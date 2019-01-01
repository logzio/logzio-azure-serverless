const isArray = arr => arr instanceof Array;
const isEmptyArray = arr => (isArray(arr) ? arr.length === 0 : false);
const isNil = item => item == null || item === 'null' || item === 'undefined';
const isEmpty = item => item === '';
const isEmptyObj = obj => (typeof obj === 'object' ? Object.keys(obj).length === 0 : false);
const filterAllEmpty = (k, v) => !isEmpty(k) && !isNil(k) && !isEmpty(v)
  && !isNil(v) && !isEmptyArray(v) && !isEmptyObj(v);
const renameKey = (obj) => {
  if (obj.hasOwnProperty) {
    delete Object.assign(obj, {
      '@timestamp': obj.time,
    }).time;
  }
};

class DataParser {
  constructor({
    internalLogger = global.console,
  }) {
    this.internalLogger = internalLogger;
  }

  removeEmpty(obj) {
    if (typeof (obj) === 'string') return obj; // for string event.

    return Object.keys(obj)
      .filter(k => filterAllEmpty(k, obj[k]))
      .reduce((acc, k) => Object.assign(acc, {
        [k]: typeof obj[k] === 'object' ? this.removeEmpty(obj[k]) : obj[k],
      }), {});
  }

  renameKeyRemoveEmpty(obj) {
    renameKey(obj);
    return this.removeEmpty(obj);
  }

  pushParsedMsg(parsedMessages, msg) {
    if (isArray(msg.records)) {
      msg.records.forEach(subMsg => parsedMessages.push(this.renameKeyRemoveEmpty(subMsg)));
    } else {
      parsedMessages.push(this.renameKeyRemoveEmpty(msg));
    }
  }

  parseEventHubLogMessagesToArray(eventHubMessage) {
    const parsedMessages = [];
    if (isArray(eventHubMessage)) {
      eventHubMessage.forEach(msg => this.pushParsedMsg(parsedMessages, msg));
    } else {
      this.pushParsedMsg(parsedMessages, eventHubMessage);
    }
    return parsedMessages;
  }
}

module.exports = DataParser;
