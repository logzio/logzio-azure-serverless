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

const parserOptions = {
  metrics: {
    token: process.env.LogzioMetricsToken,
    host: process.env.LogzioMetricsHost,
  },
  logs: {
    token: process.env.LogzioLogsToken,
    host: process.env.LogzioLogsHost,
  },
};

module.exports = function processEventHubMessages(context, eventHubMessages, {
  enableMetric = false,
}) {
  const {
    host,
    token,
  } = enableMetric ? parserOptions.metrics : parserOptions.logs;

  context.log(`Starting Logz.io Azure function with enableMetrics: ${enableMetric}`);
  context.log(JSON.stringify(eventHubMessages));
  const callBackFunction = getCallBackFunction(context);

  const logzioShipper = logger.createLogger({
    token,
    host,
    type: 'eventHub',
    protocol: 'https',
    internalLogger: context,
    compress: true,
    debug: true,
    callback: callBackFunction,
  });

  const dataParser = new DataParser({
    internalLogger: context,
    enableMetric,
  });

  const parseMessagesArray = dataParser.parseEventHubLogMessagesToArray(eventHubMessages);
  context.log(`About to send ${parseMessagesArray.length} logs...`);
  parseMessagesArray.forEach((log) => {
    logzioShipper.log(log);
  });

  logzioShipper.sendAndClose(callBackFunction);
};
