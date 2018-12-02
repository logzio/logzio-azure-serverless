const logger = require('logzio-nodejs');

const isArray = arr => arr instanceof Array;
const isNil = item => item == null;
const isEmpty = item => item === '';

const removeEmptyKeys = (context, obj) => {
    if (typeof (obj) === 'string') return obj; //for string event.

    return Object.keys(obj)
        .filter(k => !isEmpty(k))
        .filter(k => !isNil(obj[k]))
        .reduce((newObj, k) => {
            context.log(k);
            context.log(obj[k]);
            return Object.assign(newObj, {
                [k]: typeof obj[k] === 'object' ? removeEmptyKeys(context, obj[k]) : obj[k]
            })
        }, {});
}

const getParsedMsg = (context, msg) => {
    if (isArray(msg.records)) {
        return msg.records.map(subMsg => {
            removeEmptyKeys(context, subMsg);
        });
    }
    return removeEmptyKeys(context, msg);
}

const parseEventHubMessagesToArray = (context, eventHubMessage) => {
    if (isArray(eventHubMessage)) {
        return eventHubMessage.map(msg => {
            return getParsedMsg(context, msg);
        });
    }
    return [getParsedMsg(context, eventHubMessage)];
};

module.exports = function (context, eventHubMessages) {
    context.log("Starting Logz.io Azure function. Received " + eventHubMessages.length + " logs")
    const logzioShipper = logger.createLogger({
        token: '<ACCOUNT-TOKEN>',
        type: 'eventHub',
        host: '<LISTENER-URL>',
        protocol: 'https',
        internalLogger: context,
        compress: true,
        debug: true,
    });

    const parseMessagesArray = parseEventHubMessagesToArray(context, eventHubMessages);
    context.log("About to send " + parseMessagesArray.length + " logs...")
    parseMessagesArray.forEach(log => {
        context.log(log);
        logzioShipper.log(log);
    });
    logzioShipper.sendAndClose();
    context.done();
};