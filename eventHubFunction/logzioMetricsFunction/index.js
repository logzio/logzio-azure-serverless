const metricsProcessor = require('../SharedCode/mainIndex');

module.exports = function processEventHubMessages(context, eventHubMessages) {
  metricsProcessor(context, eventHubMessages, true);
};
