const { ContainerClient } = require("@azure/storage-blob");
const logger = require("logzio-nodejs");
const BackupContainer = require("./backup-container");
const containerName = "logziologsbackupcontainer";

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
  bufferSize: Number(process.env.BufferSize),
  timeout: Number(process.env.Timeout)
});

const getContainerDetails = () => ({
  storageConnectionString: process.env.LogsStorageConnectionString,
  containerName: containerName
});

module.exports = async function processEventHubMessages(context, eventHubs) {
  const callBackFunction = getCallBackFunction(context);
  const { host, token, bufferSize, timeout } = getParserOptions();
  const logzioShipper = logger.createLogger({
    token,
    host,
    type: "eventHub",
    protocol: "https",
    internalLogger: context,
    compress: true,
    debug: true,
    callback: callBackFunction,
    bufferSize: bufferSize || 100,
    timeout: timeout || 180000
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
    addTimestampIfNotExists(eventHub);
    if (process.env.ParseEmptyFields == "true") {
      deleteEmptyFieldsOfLog(eventHub);
    }
    try {
      logzioShipper.log(eventHub);
    }
    catch (error) {
      await backupContainer.writeEventToBlob(eventHub, error);
      backupContainer.updateFolderIfMaxSizeSurpassed();
      backupContainer.updateFileIfBulkSizeSurpassed();
    }
    finally {
      await backupContainer.uploadFiles();
      backupContainer.deleteDirectoriesRecursively();
    }
  });
};
