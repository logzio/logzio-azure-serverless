const testLogs = require('./test-logs');

const DataParser = require('../src/data-parser');

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
    expect(parseMessagesArray).not.toHaveProperty('properties.resultReason');
    expect(parseMessagesArray).not.toHaveProperty('properties.initiatedBy.user.displayName');
    expect(parseMessagesArray).not.toHaveProperty('properties.targetResources.displayName');
    expect(parseMessagesArray).not.toHaveProperty('properties.additionalDetails');
  });

  it('NetworkSecurityGroupRuleCounter logs', () => {
    const eventHubMessages = [testLogs.networkSecurityGroupRuleCounterLogs];
    const dataParser = new DataParser(context);
    const parseMessagesArray = dataParser.parseEventHubLogMessagesToArray(eventHubMessages);
    expect(parseMessagesArray).toMatchObject(eventHubMessages[0].records);
  });

  it('activityLogs', () => {
    const eventHubMessages = [testLogs.activityLogs];
    const dataParser = new DataParser(context);
    const parseMessagesArray = dataParser.parseEventHubLogMessagesToArray(eventHubMessages);
    expect(parseMessagesArray.length).toBe(6);
  });
});
