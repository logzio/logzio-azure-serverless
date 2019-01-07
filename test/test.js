const testLogs = require('./test-logs');
const testMetrics = require('./test-metrics');
const DataParser = require('../eventHubFunction/SharedCode/data-parser');

const context = {
  log: (a) => {
    console.log(a);
  },
  done: () => {
    console.log('done');
  },
};

describe('Azure eventHub function', () => {
  it('Simple string and json logs', () => {
    const eventHubMessages = [testLogs.simpleJsonLog, testLogs.simpleJsonLog];
    const dataParser = new DataParser(context);
    const parseMessagesArray = dataParser.parseEventHubLogMessagesToArray(eventHubMessages);
    expect(parseMessagesArray.length).toBe(2);
    expect(parseMessagesArray[0]).toBe(eventHubMessages[0]);
    expect(parseMessagesArray[1]).toBe(eventHubMessages[1]);
  });

  it('AuditLogs', () => {
    const eventHubMessages = [testLogs.auditLogs];
    const dataParser = new DataParser(context);
    const parseMessagesArray = dataParser.parseEventHubLogMessagesToArray(eventHubMessages);
    expect(parseMessagesArray.length).toBe(1);
    expect(parseMessagesArray[0]).not.toHaveProperty('properties.resultReason');
    expect(parseMessagesArray[0]).not.toHaveProperty('properties.initiatedBy.user.displayName');
    expect(parseMessagesArray[0]).not.toHaveProperty('properties.targetResources.displayName');
    expect(parseMessagesArray[0]).not.toHaveProperty('properties.additionalDetails');
    expect(parseMessagesArray[0]).not.toHaveProperty('time');
  });

  it('NetworkSecurityGroupRuleCounter logs', () => {
    const eventHubMessages = [testLogs.networkSecurityGroupRuleCounterLogs];
    const dataParser = new DataParser(context);
    const parseMessagesArray = dataParser.parseEventHubLogMessagesToArray(eventHubMessages);
    expect(parseMessagesArray[0]).not.toHaveProperty('time');
    expect(parseMessagesArray).toMatchObject(eventHubMessages[0].records);
  });

  it('aksAgentPool metrics', () => {
    const eventHubMessages = [testMetrics.aksAgentPool];
    const dataParser = new DataParser({
      internalLogger: context,
      enableMetric: true,
    });
    const parseMessagesArray = dataParser.parseEventHubLogMessagesToArray(eventHubMessages);
    expect(parseMessagesArray.length).toBe(1);
    expect(parseMessagesArray[0]).not.toHaveProperty('time');
    expect(parseMessagesArray[0]).not.toHaveProperty('metricName');
    expect(parseMessagesArray[0]).not.toHaveProperty('count');
    expect(parseMessagesArray[0]).not.toHaveProperty('total');
    expect(parseMessagesArray[0]).not.toHaveProperty('average');
    expect(parseMessagesArray[0]).toHaveProperty('BytesSentRate.total');
    expect(parseMessagesArray[0]).toHaveProperty('BytesSentRate.count');
    expect(parseMessagesArray[0]).toHaveProperty('BytesSentRate.average');
  });
});
