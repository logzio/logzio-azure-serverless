
const { ContainerClient } = require('@azure/storage-blob');
const logger = require('logzio-nodejs');
const fs = require('fs');
const util = require('util');
const appendFileAsync = util.promisify(fs.appendFile);
const containerName = 'logziologsbackupcontainer';
const updateTimestamp = log => {
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
const arrayIsEmpty = array => {
    return Array.isArray(array) && array.length == 0;
};
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
const createFolderName = () => {
    const newFolderName = getDate() + '-' + uniqString();
    fs.mkdir(newFolderName, { recursive: true }, err => {
        if (err) throw err;
    });
    return newFolderName;
};
let folderName = createFolderName();
let fileName = '';
const workingDir = process.cwd();
const createFileName = (context) => {
    fileName = 'logs-'.concat(uniqString()).concat('.txt');
    return fileName;
};
const maxBatchSize = 100;
const MB = 1000;
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
    return function callback(err, bulk) {
        if (err) {
            context.err(`logzio-logger error: ${err}`, err);
        }
        context.log('Done.');
        context.done();
    };
};
const getParserOptions = () => {
    return {
        token: process.env.LogzioLogsToken,
        host: process.env.LogzioLogsHost,
        bufferSize: Number(process.env.BufferSize),
        timeout: Number(process.env.Timeout),
    };
};
const getContainerDetails = () => {
    return {
        storageConnectionString: process.env.LogsStorageConnectionString,
        containerName: containerName,
    };
};
const deleteDirsWithFiles = (foldersToDelete, context) => {
    foldersToDelete.forEach(folderPath => {
        fs.rmdirSync(folderPath, { recursive: true });
    })
}

const uploadFiles = async (containerClient, filesToUpload, context) => {
    try {
        const promises = [];
        for (const file of filesToUpload) {
            const blockBlobClient = containerClient.getBlockBlobClient(file);
            promises.push(blockBlobClient.uploadFile(file));
        }
        await Promise.all(promises);
        if (!arrayIsEmpty(filesToUpload)) {
            context.log('Uploaded logs to back up container.');
        }
    } catch (error) {
        context.log('Error: ', error);
    }
};
const writeEventToBlob = async (event, filesToUpload, foldersToDelete, context) => {
    if (logIndex >= maxBatchSize) {
        fileName = createFileName();
        updateFolderSize();
        logIndex = 1;
    } else {
        logIndex++;
        const eventWithNewLine = JSON.stringify(event).concat('\n');
        const concatFolderToFile = folderName + "\\" + fileName;
        const filePath = workingDir + "\\" + concatFolderToFile;
        try {
            await appendFileAsync(filePath, eventWithNewLine);
            pushFileToUploadAsync(filesToUpload, concatFolderToFile, context);
            pushFolderToDeleteAsync(foldersToDelete, folderName, context);
        }
        catch (e) {
            context.log(`Error was thrown in appendFile, ${e}`);
        }
    };
};
const pushFileToUploadAsync = (filesToUpload, filePath, context) => {
    if (!filesToUpload.includes(filePath)) {
        filesToUpload.push(filePath);
    }
}
const pushFolderToDeleteAsync = (foldersToDelete, folderPath, context) => {
    if (!foldersToDelete.includes(folderPath)) {
        foldersToDelete.push(folderPath);
    }
}

const updateFolderNameIfFull = () => {
    if (folderSize >= MB) {
        folderName = createFolderName();
        folderSize = 0;
    }
}

module.exports = async function processEventHubMessages(context, eventHubs) {
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
        updateTimestamp(eventHub);
        if (process.env.ParseEmptyFileds == 'true') {
            deleteEmptyFields(eventHub);
        }
        try {
            logzioShipper.log(eventHub);
        } catch (error) {
            context.log(`Failed to send a log to Logz.io due to the error: '${error}'.\nUploading to backup container: '${containerName}' under the file: '${fileName}'`);
            await writeEventToBlob(eventHub, filesToUpload, foldersToDelete, context);
            updateFolderNameIfFull();
        } finally {
            await uploadFiles(containerClient, filesToUpload, context);
            deleteDirsWithFiles(foldersToDelete, context);
        }
    });
};