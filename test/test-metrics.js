const aksAgentPool = {
  count: 1,
  total: 0,
  average: 0,
  minimum: 0,
  maximum: 0,
  resourceId: '/SUBSCRIPTIONS/6EFCEE25/RESOURCEGROUPS/MC_LOGZIO_MYCLUSTER_EA/PROVIDERS/MICROSOFT.NETWORK/NETWORKINTERFACES/AKS-AGENTPOOL-2-NIC-0',
  time: '2019-01-06T12:35:00.000Z',
  metricName: 'BytesSentRate',
  timeGrain: 'PT1M',
};

const vmLinuxMetric = {
  time: '2019-02-07T08:52:06.717Z',
  resourceId: '/subscriptions/5-c0fa1c295/resourceGroups/cslogzazuredemo/providers/Microsoft.Compute/virtualMachines/logzdemolinux',
  timeGrain: 'PT1M',
  dimensions: {
    Tenant: '',
    Role: '',
    RoleInstance: '',
  },
  metricName: '/builtin/disk/readbytespersecond',
  total: 0,
  minimum: 0,
  maximum: 0,
  average: 0,
  count: 4,
  last: 0,
};

module.exports = {
  aksAgentPool,
  vmLinuxMetric,
};
