const isArray = arr => arr instanceof Array;
const isEmptyArray = arr => (isArray(arr) ? arr.length === 0 : false);
const isNil = item => item === null || item === 'null' || item === 'undefined';
const isEmpty = item => item === '';
const isEmptyObj = (obj) => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return true;
}
const filterAllEmpty = (k, v) => !isEmpty(k) && !isNil(k) && !isEmpty(v) && !isNil(v) && !isEmptyArray(v) && !isEmptyObj(v);

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

  pushParsedMsg(parsedMessages, msg) {
    if (isArray(msg.records)) {
      msg.records.forEach(subMsg => parsedMessages.push(this.removeEmpty(subMsg)));
    } else {
      parsedMessages.push(this.removeEmpty(msg));
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