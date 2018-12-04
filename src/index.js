const logger = require('logzio-nodejs');

const isArray = arr => arr instanceof Array;
// const isEmptyArray = arr => arr.length === 0;
const isNil = item => item == null || item === 'null' || item === 'undefined';
const isEmpty = item => item === '';

const removeEmpty = (context, obj) => {
    if (typeof (obj) === 'string') return obj; //for string event.

    return Object.keys(obj)
        .filter(k => !isEmpty(k) && !isNil(k))
        .filter(k => !isEmpty(obj[k]) && !isNil(obj[k]))
        .reduce((acc, k) => Object.assign(acc, {
            [k]: typeof obj[k] === 'object' ? removeEmpty(context, obj[k]) : obj[k]
        }), {});
}

const getParsedMsg = (context, msg) => {
    if (isArray(msg.records)) {
        return msg.records.map(subMsg => removeEmpty(context, subMsg));
    }
    return removeEmpty(context, msg);
}

const parseEventHubMessagesToArray = (context, eventHubMessage) => {
    if (isArray(eventHubMessage)) {
        return eventHubMessage.map(msg => getParsedMsg(context, msg));
    }
    return [getParsedMsg(context, eventHubMessage)];
};

const processEventHubMessages = (context, eventHubMessages) => {
    context.log("Starting Logz.io Azure function. Received " + eventHubMessages.length + " logs")
    const logzioShipper = logger.createLogger({
        token: '<ACCOUNT-TOKEN>',
        type: 'eventHub',
        // host: '<LISTENER-URL>',
        protocol: 'https',
        internalLogger: context,
        compress: true,
        debug: true,
    });

    const parseMessagesArray = parseEventHubMessagesToArray(context, eventHubMessages);
    context.log("About to send " + parseMessagesArray.length + " logs...")
    parseMessagesArray.forEach(log => {
        context.log(JSON.stringify(log));
        logzioShipper.log(log);
    });
    logzioShipper.sendAndClose();
    context.done();
};

module.exports = processEventHubMessages;