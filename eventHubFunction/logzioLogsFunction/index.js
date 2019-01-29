const logsProcessor = require('../SharedCode/mainIndex');

module.exports = function processEventHubMessages(context, eventHubMessages) {
  logsProcessor(context, eventHubMessages, false);
};
