const logger = require('logzio-nodejs');

const removeEmpty = (context, obj) => {
  if (typeof(obj) === 'string') {
      return obj;
  }
  
  return Object.keys(obj)
    .filter(k => !!k)  // Remove undef, null, and empty.
    .reduce((newObj, k) =>
      typeof obj[k] === 'object' ?
        Object.assign(newObj, {[k]: removeEmpty(context, obj[k])}) :  // Recurse.
        Object.assign(newObj, {[k]: obj[k]}),  // Copy value.
      {});
}

const removeEmptyAndPush = (context, array, msg) => {
    array.push(removeEmpty(context, msg));
}

const isArray = (obj) => { 
    return (obj instanceof Array) 
}

const addToArray = (context, array, msg) => {
    if (isArray(msg.records)) {
        msg.records.forEach(subMsg => {
            removeEmptyAndPush(context, array, subMsg);
        });
    } else {
        removeEmptyAndPush(context, array, msg);
    }
}

const parseEventHubMessagesToArray = (context, eventHubMessage) => {
    const messages = [];
    if (isArray(eventHubMessage)) {
        eventHubMessage.forEach(msg => {
            addToArray(context, messages, msg);
        });
    } else {
        addToArray(context, messages, eventHubMessage);
    }
    return messages;
};

module.exports = function (context, eventHubMessages) {
    context.log("Starting Logz.io Azure function")
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
        logzioShipper.log(log);
    });
    logzioShipper.sendAndClose();
    context.done();
};
