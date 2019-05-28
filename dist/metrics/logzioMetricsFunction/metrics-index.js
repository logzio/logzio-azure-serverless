const metricsProcessor = require('./core');

module.exports = function processEventHubMessages(context, eventHubMessages) {
  metricsProcessor(context, eventHubMessages, {
    enableMetric: true,
  });
};
