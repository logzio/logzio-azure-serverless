const { ContainerClient } = require("@azure/storage-blob");
const logger = require("logzio-nodejs");
const BackupContainer = require("./backup-container");
const containerName = "logziologsbackupcontainer";
const availableStatistics = ["count", "total", "average", "maximum", "minimum"];
const addTimestamp = log => {
  if (log.time) {
    return {
      ...log,
      "@timestamp": log.time
    };
  }
  return log;
};

const isObject = obj => {
  return obj !== undefined && obj !== null && obj.constructor == Object;
};

const deleteEmptyFieldsOfLog = obj => {
  for (const key in obj) {
    if (isObject(obj[key])) {
      deleteEmptyFieldsOfLog(obj[key]);
    }
    if (key === "") {
      delete obj[key];
    }
  }
  return obj;
};

const getCallBackFunction = context => {
  return function callback(err) {
    if (err) {
      context.log.error(`logzio-logger error: ${err}`);
    }
    context.log("Done.");
    context.done();
  };
};

const getParserOptions = () => ({
  token: process.env.LogzioLogsToken,
  host: process.env.LogzioLogsHost,
  bufferSize: Number(process.env.BufferSize)
});

const getContainerDetails = () => ({
  storageConnectionString: process.env.LogsStorageConnectionString,
  containerName: containerName
});

const parseLogToMetric = obj => {
  const { metricName } = obj;
  if (!metricName) return obj;

  const metricObj = {
    metrics: {
      [metricName]: {}
    },
    dimensions: {}
  };
  Object.keys(obj).forEach(key => {
    if (availableStatistics.includes(key)) {
      metricObj.metrics[metricName][key] = obj[key];
    } else if (key === "resourceId") {
      const splitArr = obj[key].split("/");
      for (let i = 1; i < splitArr.length; i += 2) {
        metricObj.dimensions[splitArr[i]] = splitArr[i + 1];
      }
    } else if (key === "@timestamp") {
      metricObj[key] = obj[key];
    } else if (key !== "metricName") {
      metricObj.dimensions[key] = obj[key];
    }
  });
  return metricObj;
};

const addDataToLog = (log, context) => {
  let eventhubLog;
  try {
    if (process.env.ParseEmptyFields.toLowerCase() == "true") {
      eventhubLog = deleteEmptyFieldsOfLog(log);
    }
    if (process.env.DataType == "Metrics") {
      eventhubLog = parseLogToMetric(log);
    } else {
      eventhubLog = addTimestamp(log);
    }
  } catch (error) {
    context.log.error(error);
  }
  return eventhubLog || log;
};


const sendLog = async (log, logzioShipper, backupContainer, context) =>{
  log = addDataToLog(log, context);
  try {
    logzioShipper.log(log);
  } catch (error) {
    await backupContainer.writeEventToBlob(log, error);
    backupContainer.updateFolderIfMaxSizeSurpassed();
    backupContainer.updateFileIfBulkSizeSurpassed();
  } finally {
    await backupContainer.uploadFiles();
  }
}

module.exports = async function processEventHubMessages(context, eventHubs) {
  const callBackFunction = getCallBackFunction(context);
  const { host, token, bufferSize } = getParserOptions();
  const logzioShipper = logger.createLogger({
    token,
    host,
    type: "eventHub",
    protocol: "https",
    internalLogger: context,
    compress: true,
    debug: true,
    callback: callBackFunction,
    bufferSize: bufferSize || 100
  });
  const { storageConnectionString, containerName } = getContainerDetails();
  const containerClient = new ContainerClient(
    storageConnectionString,
    containerName
  );
  const backupContainer = new BackupContainer({
    internalLogger: context,
    containerClient: containerClient
  });
  try{
      const eventHubArray = eventHubs[0].hasOwnProperty('records') ? eventHubs[0].records : eventHubs;
      eventHubArray.map(async eventHub => {
        if (eventHub.hasOwnProperty('records')){
          eventHub.records.map(async innerEventHub => {
            sendLog(innerEventHub, logzioShipper, backupContainer, context);
          })
          await Promise.all(eventHub);
        }
        else{
          sendLog(eventHub, logzioShipper, backupContainer, context);
        }
      });
      await Promise.all(eventHubArray);
      logzioShipper.sendAndClose(callBackFunction);
  }
  catch(error){
      context.log.error(error)
  }
};