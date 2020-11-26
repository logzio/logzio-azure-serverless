
const { ContainerClient } = require('@azure/storage-blob');
const logger = require('logzio-nodejs');
const fs = require('fs');
const util = require('util');
const appendFileAsync = util.promisify(fs.appendFile);
const containerName = 'logziologsbackupcontainer';
const addTimestampIfNotExists = log => {
    if (log.time) {
        return {
            ...log,
            '@timestamp': log.time,
        };
    }
    return log;
};
const updateFolderSize = () => {
    const stats = fs.statSync(fileName);
    const fileSizeInKb = stats.size / 1000;
    folderSize += fileSizeInKb;
}
const getDate = () => {
    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1; //months from 1-12
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    return year + '-' + month + '-' + day;
};
const uniqString = () => {
    return Math.random()
        .toString(36)
        .substring(7);
};
const createNewFolder = () => {
    const newFolderName = getDate() + '-' + uniqString();
    fs.mkdir(newFolderName, { recursive: true }, err => {
        if (err) context.log.error(err);
    });
    return newFolderName;
};
let folderName = createNewFolder();
let fileName = '';
const workingDir = process.cwd();
const createFileName = (context) => {
    fileName = 'logs-'.concat(uniqString()).concat('.txt');
    return fileName;
};
const maxShipperBulkSize = 100;
let folderSize = 0;
let logIndex = 1;
const isObject = obj => {
    return obj !== undefined && obj !== null && obj.constructor == Object;
};
const deleteEmptyFields = obj => {
    for (const key in obj) {
        if (isObject(obj[key])) {
            deleteEmptyFields(obj[key]);
        }
        if (key === '') {
            delete obj[key];
        }
    }
};
const getCallBackFunction = context => {
    return function callback(err) {
        if (err) {
            context.log.error(`logzio-logger error: ${err}`);
        }
        context.log('Done.');
        context.done();
    };
};
const getParserOptions = () => ({
  token: process.env.LogzioLogsToken,
  host: process.env.LogzioLogsHost,
  bufferSize: Number(process.env.BufferSize),
  timeout: Number(process.env.Timeout),
});

const getContainerDetails = () => ({
        storageConnectionString: process.env.LogsStorageConnectionString,
        containerName: containerName,
});

const deleteDirectoriesRecursively = (foldersToDelete, context) => {
    foldersToDelete.forEach(folderPath => {
          fs.rmdirSync(folderPath, { recursive: true });
    })
}

const uploadFiles = async (containerClient, filesToUpload, context) => {
    try {
        const uploadingFilesPromises = [];
        for (const file of filesToUpload) {
            const blockBlobClient = containerClient.getBlockBlobClient(file);
            uploadingFilesPromises.push(blockBlobClient.uploadFile(file));
        }
        await Promise.all(uploadingFilesPromises);
        if (filesToUpload.length !== 0) {
          context.log('Uploaded logs to back up container.');
        } 
    } catch (error) {
        context.log.error(error);
    }
};
const writeEventToBlob = async (event, filesToUpload, foldersToDelete, context) => {
    if (logIndex >= maxShipperBulkSize) {
        fileName = createFileName();
        updateFolderSize();
        logIndex = 1;
    } else {
        logIndex++;
        const eventWithNewLine = JSON.stringify(event).concat('\n');
        const concatFolderToFile = `${folderName}\\${fileName}`;
        const fileFullPath = `${workingDir}\\${concatFolderToFile}`;
        try {
            await appendFileAsync(fileFullPath, eventWithNewLine);
            if (!filesToUpload.includes(concatFolderToFile)) { filesToUpload.push(concatFolderToFile); }
            if (!foldersToDelete.includes(folderName)) { foldersToDelete.push(folderName); }
        }
        catch (e) {
            context.log.error(`Error was thrown in appendFile, ${e}`);
        }
    };
};

const updateFolderNameIfMaxSizeSurpassed = (folderMaxSizeInMB = 1000) => {
  if (folderSize >= folderMaxSizeInMB) {
      folderName = createNewFolder();
      folderSize = 0;
  }
}

module.exports = async function processEventHubMessages(context, eventHubs) {
    try{
    createFileName(context);
    const filesToUpload = [];
    const foldersToDelete = [ folderName ];
    const callBackFunction = getCallBackFunction(context);
    const { host, token, bufferSize, timeout } = getParserOptions();
    const { storageConnectionString, containerName } = getContainerDetails();
    const containerClient = new ContainerClient(storageConnectionString, containerName);
    const logzioShipper = logger.createLogger({
        token,
        host,
        type: 'eventHub',
        protocol: 'https',
        internalLogger: context,
        compress: true,
        debug: true,
        callback: callBackFunction,
        bufferSize: bufferSize || 100,
        timeout: timeout || 180000,
    });
    eventHubs[0].records.map(async eventHub => {
        addTimestampIfNotExists(eventHub);
        if (process.env.ParseEmptyFields == 'true') {
            deleteEmptyFields(eventHub);
        }
        try {
            logzioShipper.log(eventHub);
            throw new Error("errrr");
        } catch (error) {
            context.log.error(`Failed to send a log to Logz.io due to the error: '${error}'. \nUploading to backup container: '${containerName}' in the file: '${fileName}'`);
            await writeEventToBlob(eventHub, filesToUpload, foldersToDelete, context);
            updateFolderNameIfMaxSizeSurpassed();
        } finally {
            await uploadFiles(containerClient, filesToUpload, context);
            deleteDirectoriesRecursively(foldersToDelete, context);
        }
    });
    }
    catch(error){
        context.log.error(error)
    }
};