const logsProcessor = require('./index');

module.exports = function processEventHubMessages(context, eventHubMessages) {
  logsProcessor(context, eventHubMessages, {});
};
