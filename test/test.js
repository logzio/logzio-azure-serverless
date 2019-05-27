const nock = require('nock');
const testLogs = require('./test-logs');
const testMetrics = require('./test-metrics');
const DataParser = require('../src/data-parser');
const logsFunction = require('../src/logs-index');
const metricsFunction = require('../src/metrics-index');

const dummyHost = 'mocked-listener.logz.io';
const nockHttpAddress = `https://${dummyHost}:8071`;
const dummyToken = '123456789';


const context = {
  log: () => {},
  done: () => {},
  err: () => {},
};

describe('Azure eventHub functions - unittest', () => {
  it('Simple string and json logs', () => {
    const eventHubMessages = [testLogs.simpleJsonLog, testLogs.simpleJsonLog];
    const dataParser = new DataParser(context);
    const parseMessagesArray = dataParser.parseEventHubLogMessagesToArray(eventHubMessages);
    expect(parseMessagesArray.length).toBe(3);
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
    expect(parseMessagesArray[0]).toHaveProperty('metrics.BytesSentRate.total');
    expect(parseMessagesArray[0]).toHaveProperty('metrics.BytesSentRate.count');
    expect(parseMessagesArray[0]).toHaveProperty('metrics.BytesSentRate.average');
    expect(parseMessagesArray[0]).toHaveProperty('dimensions.SUBSCRIPTIONS');
    expect(parseMessagesArray[0]).toHaveProperty('dimensions.RESOURCEGROUPS');
    expect(parseMessagesArray[0]).toHaveProperty('dimensions.PROVIDERS');
    expect(parseMessagesArray[0]).toHaveProperty('dimensions.NETWORKINTERFACES');
  });

  it('VM Linux agent metrics', () => {
    const eventHubMessages = [testMetrics.vmLinuxMetric];
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
    expect(parseMessagesArray[0]).toHaveProperty('metrics./builtin/disk/readbytespersecond.total');
    expect(parseMessagesArray[0]).toHaveProperty('metrics./builtin/disk/readbytespersecond.count');
    expect(parseMessagesArray[0]).toHaveProperty('metrics./builtin/disk/readbytespersecond.average');
    expect(parseMessagesArray[0]).toHaveProperty('dimensions.subscriptions');
    expect(parseMessagesArray[0]).toHaveProperty('dimensions.resourceGroups');
    expect(parseMessagesArray[0]).toHaveProperty('dimensions.providers');
    expect(parseMessagesArray[0]).toHaveProperty('dimensions.virtualMachines');
  });

  describe('Test functions full flow', () => {
    beforeEach(() => {
      process.env.LogzioMetricsToken = dummyToken;
      process.env.LogzioLogsToken = dummyToken;
      process.env.LogzioMetricsHost = dummyHost;
      process.env.LogzioLogsHost = dummyHost;
    });

    it('logzioLogsFunction', (done) => {
      nock(nockHttpAddress)
        .post('/')
        .query({
          token: dummyToken,
        })
        .reply(200, () => {
          done();
        });
      logsFunction(context, [testLogs.auditLogs]);
    });

    it('logzioMetricsFunction', (done) => {
      nock(nockHttpAddress)
        .post('/')
        .query({
          token: dummyToken,
        })
        .reply(200, () => {
          done();
        });
      metricsFunction(context, [testMetrics.aksAgentPool]);
    });
  });
});
