const fs = require("fs");
const util = require("util");
const workingDir = process.cwd();
const folderMaxSizeInMB = 10000;
const maxShipperBulkSize = 100;
const appendFileAsync = util.promisify(fs.appendFile);

class BackupContainer {
  constructor({ internalLogger = global.console, containerClient }) {
    this._context = internalLogger;
    this._containerClient = containerClient;
    this.currentFolder;
    this.currentFile;
    this._filesToUpload = [];
    this._folderSize = 0;
    this._logsInBulk = 1;
    this._createNewFolder();
    this._createNewFile();
    this._foldersToDelete = [this.currentFolder];
  }

  _updateFolderSize() {
    const stats = fs.statSync(this.currentFile);
    const fileSizeInKb = stats.size / 1000;
    this._folderSize += fileSizeInKb;
  }

  _getDate() {
    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1; //months from 1-12
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    return year + "-" + month + "-" + day;
  }

  _uniqString() {
    return Math.random()
      .toString(36)
      .substring(7);
  }

  async _createNewFolder() {
    const newFolderName = this._getDate() + "-" + this._uniqString();
    fs.mkdir(newFolderName, { recursive: true }, err => {
      if (err) this._context.log.error(err);
    });
    this._folderSize = 0;
    this.currentFolder = newFolderName;
  }

  _createNewFile() {
    this._logsInBulk = 1;
    this.currentFile = "logs-".concat(this._uniqString()).concat(".txt");
  }

  updateFolderIfMaxSizeSurpassed() {
    if (this.folderSize >= folderMaxSizeInMB) {
      this._createNewFolder();
    }
  }

  updateFileIfBulkSizeSurpassed() {
    if (this._logsInBulk >= maxShipperBulkSize) {
      this._updateFolderSize();
      this._createNewFile();
    }
  }

  deleteDirectoriesRecursively() {
    this._foldersToDelete.forEach(folderPath => {
      fs.rmdirSync(folderPath, { recursive: true });
    });
    this._foldersToDelete = [];
  }

  async uploadFiles() {
    try {
      const uploadingFilesPromises = [];
      for (const file of this._filesToUpload) {
        const blockBlobClient = this._containerClient.getBlockBlobClient(file);
        uploadingFilesPromises.push(blockBlobClient.uploadFile(file));
      }
      await Promise.all(uploadingFilesPromises);
      if (this._filesToUpload.length !== 0) {
        this._context.log("Uploaded logs to back up container.");
      }
      this._filesToUpload = [];
    }
    catch (error) {
      this._context.log.error(error);
    }
  }

  async writeEventToBlob(event, error) {
    this._context.log.error(
      `Failed to send a log to Logz.io due to the error: '${error}'.\n Uploading to backup container: '${this._containerClient._containerName}' in the file: '${this.currentFolder}\\${this.currentFile}'`
    );
    const eventWithNewLine = JSON.stringify(event).concat("\n");
    const concatFolderToFile = `${this.currentFolder}/${this.currentFile}`;
    const fileFullPath = `${workingDir}/${concatFolderToFile}`;
    try {
      await appendFileAsync(fileFullPath, eventWithNewLine);
      this._logsInBulk++;
      if (!this._filesToUpload.includes(concatFolderToFile)) {
        this._filesToUpload.push(concatFolderToFile);
      }
      if (!this._foldersToDelete.includes(this.currentFolder)) {
        this._foldersToDelete.push(this.currentFolder);
      }
    } 
    catch (error) {
      this._context.log.error(`Error was thrown in appendFile, ${error}`);
    }
  }
}

module.exports = BackupContainer;
