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

module.exports = function processEventHubMessages(context, eventHubMessages, enableMetrics) {
  context.log(`Starting Logz.io Azure function with enableMetrics: ${enableMetrics}`);
  context.log(JSON.stringify(eventHubMessages));
  const callBackFunction = getCallBackFunction(context);

  const logzioShipper = logger.createLogger({
    token: enableMetrics ? process.env.LogzioMetricsToken : process.env.LogzioLogsToken,
    type: 'eventHub',
    host: enableMetrics ? process.env.LogzioMetricsHost : process.env.LogzioLogsHost,
    protocol: 'https',
    internalLogger: context,
    compress: true,
    debug: true,
    callback: callBackFunction,
  });

  const dataParser = new DataParser({
    internalLogger: context,
    enableMetric: enableMetrics,
  });

  const parseMessagesArray = dataParser.parseEventHubLogMessagesToArray(eventHubMessages);
  context.log(`About to send ${parseMessagesArray.length} logs...`);
  parseMessagesArray.forEach((log) => {
    context.log(log);
    logzioShipper.log(log);
  });

  logzioShipper.sendAndClose(callBackFunction);
};
