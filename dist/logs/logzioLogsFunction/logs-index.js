const logsProcessor = require('./core');

module.exports = function processEventHubMessages(context, eventHubMessages) {
  logsProcessor(context, eventHubMessages, {});
};
