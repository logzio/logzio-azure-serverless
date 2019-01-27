const isArray = arr => arr instanceof Array;
const isEmptyArray = arr => (isArray(arr) ? arr.length === 0 : false);
const isNil = item => item == null || item === 'null' || item === 'undefined';
const isEmpty = item => item === '';
const isEmptyObj = obj => (typeof obj === 'object' ? Object.keys(obj).length === 0 : false);
const filterAllEmpty = (k, v) => !isEmpty(k) && !isNil(k) && !isEmpty(v)
  && !isNil(v) && !isEmptyArray(v) && !isEmptyObj(v);
const renameLogKey = (obj) => {
  if (obj.time) {
    delete Object.assign(obj, {
      '@timestamp': obj.time,
    }).time;
  }
};

class DataParser {
  constructor({
    internalLogger = global.console,
    enableMetric = false,
  }) {
    this.internalLogger = internalLogger;
    this.enableMetric = enableMetric;
    this.availableStatistics = ['count', 'total', 'average', 'maximum', 'minimum'];
  }

  removeEmpty(obj) {
    if (typeof (obj) === 'string') return obj; // for string event.

    return Object.keys(obj)
      .filter(k => filterAllEmpty(k, obj[k]))
      .reduce((acc, k) => Object.assign(acc, {
        [k]: typeof obj[k] === 'object' ? this.removeEmpty(obj[k]) : obj[k],
      }), {});
  }

  parseLogToMetric(obj) {
    if ('metricName' in obj) {
      const {
        metricName,
      } = obj;

      const metricObj = {
        metrics: {
          [metricName]: {},
        },
        dimensions: {},
      };

      Object.keys(obj).forEach((key) => {
        if (this.availableStatistics.includes(key)) {
          metricObj.metrics[metricName][key] = obj[key];
        } else if (key === 'resourceId') {
          const splitArr = obj[key].split('/');
          for (let i = 1; i < splitArr.length; i += 2) metricObj.dimensions[splitArr[i]] = splitArr[i + 1];
        } else if (key === '@timestamp') {
          metricObj[key] = obj[key];
        } else if (!(key === 'metricName')) metricObj.dimensions[key] = obj[key];
      });
      return metricObj;
    }
    return obj;
  }

  renameKeyRemoveEmpty(obj) {
    renameLogKey(obj);
    return this.enableMetric
      ? this.parseLogToMetric(this.removeEmpty(obj))
      : this.removeEmpty(obj);
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
