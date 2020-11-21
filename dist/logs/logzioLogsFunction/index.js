const logsProcessor = require('./core.js');

module.exports = function processEventHubMessages(context, eventHubMessages) {
    logsProcessor(context, eventHubMessages);
};
