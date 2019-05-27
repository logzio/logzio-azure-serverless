const metricsProcessor = require('./index');

module.exports = function processEventHubMessages(context, eventHubMessages) {
  metricsProcessor(context, eventHubMessages, {
    enableMetric: true,
  });
};
