const fs = require("fs");
const util = require("util");
const workingDir = "C:\\local\\Temp\\";
const root = process.cwd();

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
    const newFolderName = workingDir + this._getDate() + "-" + this._uniqString();
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

  deleteDirectoriesRecursively(context) {
        fs.readdir(root, function(err, items) {
        context.log("About to delete all files in: ", root)
        for (var i=0; i<items.length; i++) {
            if (items[i].startsWith('2021')){
                fs.rmdirSync(items[i], { recursive: true });
            }
        } 
        context.log("Deleted successfully.")
    });
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

  async writeEventToBlob(event, context, error) {
    this._context.log.error(
      `Failed to send a log to Logz.io due to the error: '${error}'.\n Uploading to backup container: '${this._containerClient._containerName}' in the file: '${this.currentFolder}\\${this.currentFile}'`
    );
    const eventWithNewLine = JSON.stringify(event).concat("\n");
    const fileFullPath = `${this.currentFolder}//${this.currentFile}`;
    try {
      await appendFileAsync(fileFullPath, eventWithNewLine);
      this._logsInBulk++;
      if (!this._filesToUpload.includes(fileFullPath)) {
        this._filesToUpload.push(fileFullPath);
      }
    } 
    catch (error) {
      this._context.log.error(`Error was thrown in appendFile, ${error}`);
    }
  }
}

module.exports = BackupContainer;
