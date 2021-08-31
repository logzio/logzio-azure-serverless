const { ContainerClient } = require("@azure/storage-blob");
const logger = require('logzio-nodejs');
const BackupContainer = require('./backup-container');
const containerName = "logziologsbackupcontainer";

const addTimestamp = log => {
  if (log.time) {
    return {
      ...log,
      "@timestamp": log.time
    };
  }
  return log;
};


const isIterable = (obj) => {
  // checks for null and undefined
  if (obj == null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === 'function';
}

const isObject = obj => {
  return obj !== undefined && obj !== null && obj.constructor === Object;
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


const addDataToLog = (log, context) => {
  let eventhubLog;
  try {
    if (process.env.ParseEmptyFields.toLowerCase() === "true") {
      eventhubLog = deleteEmptyFieldsOfLog(log);
    }
    eventhubLog = addTimestamp(log);
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
  return true;
}

const exportLogs = async (eventHubs, logzioShipper, backupContainer, context) => {
  try {
    let calls = [];
    eventHubs.map(message => {
      let events = message.hasOwnProperty('records') ? message.records : message;
      if (isIterable(events)){
        events.map(log => {
          if (log.hasOwnProperty('records')) {
            if (isIterable(log.records)){
              log.records.map( innerEvent => {
                calls.push(sendLog(innerEvent, logzioShipper, backupContainer, context));
              });
            };
          } else {
            calls.push(sendLog(log, logzioShipper, backupContainer, context));
          }
        });
      } else {
        calls.push(sendLog(events, logzioShipper, backupContainer, context));
      }
    });
    await Promise.all(calls);
  }
  catch (error){
    context.log(error)
  };
  return true;
};

module.exports = async function processEventHubMessages(context, eventHubs) {
  context.log(`Messages: ${eventHubs}`)
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
    exportLogs(eventHubs, logzioShipper, backupContainer, context).then(() => {
      logzioShipper.sendAndClose(callBackFunction);
    });
  }
  catch(error){
    context.log.error(error)
  }
};
