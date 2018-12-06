isArray = arr => arr instanceof Array;
isEmptyArray = arr => isArray(arr) ? arr.length === 0 : false;
isNil = item => item == null || item === 'null' || item === 'undefined';
isEmpty = item => item === '';

class DataParser {
    constructor({
        internalLogger = console
    }) {
        this.internalLogger = internalLogger;
    }

    _removeEmpty(obj) {
        if (typeof (obj) === 'string') return obj; //for string event.

        return Object.keys(obj)
            .filter(k => !isEmpty(k) && !isNil(k))
            .filter(k => !isEmpty(obj[k]) && !isNil(obj[k]))
            .filter(k => !isEmptyArray(obj[k]))
            .reduce((acc, k) => Object.assign(acc, {
                [k]: typeof obj[k] === 'object' ? this._removeEmpty(obj[k]) : obj[k]
            }), {});
    }

    _pushParsedMsg(parsedMessages, msg) {
        isArray(msg.records) ?
            msg.records.map(subMsg => parsedMessages.push(this._removeEmpty(subMsg))) :
            parsedMessages.push(this._removeEmpty(msg));
    }

    parseEventHubLogMessagesToArray(eventHubMessage) {
        const parsedMessages = [];
        isArray(eventHubMessage) ?
            eventHubMessage.map(msg => this._pushParsedMsg(parsedMessages, msg)) :
            this._pushParsedMsg(parsedMessages, eventHubMessage);
        return parsedMessages;
    };
}

module.exports = DataParser;