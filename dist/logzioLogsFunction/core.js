const { ContainerClient } = require("@azure/storage-blob");
const logger = require("logzio-nodejs");
const BackupContainer = require("./backup-container");
const containerName = "logziologsbackupcontainer";
const availableStatistics = ["count", "total", "average", "maximum", "minimum"];
const addTimestampIfNotExists = log => {
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

const buildLog = (eventHub, context) => {
  let eventhubLog = {};
  try {
    if (process.env.ParseEmptyFields.toLowerCase() == "true") {
      eventhubLog = deleteEmptyFieldsOfLog(eventHub);
    }
    if (process.env.DataType == "Metrics") {
      eventhubLog = parseLogToMetric(eventHub);
    } else {
      eventhubLog = addTimestampIfNotExists(eventHub);
    }
  } catch (e) {
    context.log.error(e);
  }
  return eventhubLog;
};

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
  eventHubs[0].records.map(async eventHub => {
    eventHub = buildLog(eventHub, context);
    try {
      logzioShipper.log(eventHub);
    } catch (error) {
      await backupContainer.writeEventToBlob(eventHub, error);
      backupContainer.updateFolderIfMaxSizeSurpassed();
      backupContainer.updateFileIfBulkSizeSurpassed();
    } finally {
      await backupContainer.uploadFiles();
    }
  });
  await Promise.all(eventHubs[0].records);
  logzioShipper.sendAndClose(callBackFunction);
};
