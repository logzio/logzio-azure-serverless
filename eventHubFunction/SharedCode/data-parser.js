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
    this._parsedMessages = [];
    this._parsing = false;
    this._internalLogger = internalLogger;
    this._enableMetric = enableMetric;
    this._availableStatistics = ['count', 'total', 'average', 'maximum', 'minimum'];
  }

  _removeEmpty(obj) {
    if (typeof (obj) === 'string') return obj; // for string event.

    return Object.keys(obj)
      .filter(k => filterAllEmpty(k, obj[k]))
      .reduce((acc, k) => Object.assign(acc, {
        [k]: typeof obj[k] === 'object' ? this._removeEmpty(obj[k]) : obj[k],
      }), {});
  }

  _parseLogToMetric(obj) {
    const {
      metricName,
    } = obj;
    if (!metricName) return obj;

    const metricObj = {
      metrics: {
        [metricName]: {},
      },
      dimensions: {},
    };

    Object.entries(obj).forEach(([key, value]) => {
      if (this._availableStatistics.includes(key)) {
        metricObj.metrics[metricName][key] = value;
      } else if (key === 'resourceId') {
        const splitArr = value.split('/');

        for (let i = 1; i < splitArr.length; i += 2) {
          metricObj.dimensions[splitArr[i]] = splitArr[i + 1];
        }
      } else if (key === '@timestamp') {
        metricObj[key] = value;
      } else if (key !== 'metricName') {
        metricObj.dimensions[key] = value;
      }
    });
    return metricObj;
  }

  _renameKeyRemoveEmpty(obj) {
    renameLogKey(obj);
    return this._enableMetric
      ? this._parseLogToMetric(this._removeEmpty(obj))
      : this._removeEmpty(obj);
  }

  _pushMessage(msg) {
    if (isArray(msg.records)) {
      msg.records.forEach(subMsg => this._parsedMessages.push(this._renameKeyRemoveEmpty(subMsg)));
    } else {
      this._parsedMessages.push(this._renameKeyRemoveEmpty(msg));
    }
  }

  parseEventHubLogMessagesToArray(eventHubMessage) {
    if (this._parsing === true) throw Error('already parsing, create a new DataParser');
    this._parsing = true;

    if (isArray(eventHubMessage)) {
      eventHubMessage.forEach(msg => this._pushMessage(msg));
    } else {
      this._pushMessage(eventHubMessage);
    }
    return this._parsedMessages;
  }
}

module.exports = DataParser;
