const logger = require('logzio-nodejs');
const DataParser = require('./data-parser');

function getCallBackFunction(context) {
  return function callback(err, bulk) {
    if (err) {
      context.err(`logzio-logger error: ${err}`, err);
      context.bindings.outputBlob = bulk;
    }
    context.done();
  };
}

module.exports = function processEventHubMessages(context, eventHubMessages) {
  context.log('Starting Logz.io Azure function.');

  const callBackFunction = getCallBackFunction(context);
  const logzioShipper = logger.createLogger({
    token: process.env.LogzioToken,
    type: 'eventHub',
    host: process.env.LogzioHost,
    protocol: 'https',
    internalLogger: context,
    compress: true,
    debug: true,
    callback: callBackFunction,
  });

  const dataParser = new DataParser(context);
  const parseMessagesArray = dataParser.parseEventHubLogMessagesToArray(eventHubMessages);
  context.log(`About to send ${parseMessagesArray.length} logs...`);

  parseMessagesArray.forEach((log) => {
    logzioShipper.log(log);
  });
  logzioShipper.sendAndClose(callBackFunction);
};