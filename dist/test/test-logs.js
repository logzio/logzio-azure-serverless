const simpleStringLog = 'test';

const simpleJsonLog = JSON.stringify({
  k1: 'v1',
  k2: 'v2',
});

const singleLog = {"k1":"v1"}
const logArray = [
  {"k1":"v1"},
  {"k2":"v2"}
]

const nested = {
  "records": [
    {"k1":"v1"},
    {"k2":"v2"},
    {"records":[
        {"k3":"v3"}
      ]
    }
  ]
}

const auditLogs = {
  records: [{
    time: '2018-12-03T10:00:30.0910703Z',
    operationName: 'Delete group',
    operationVersion: '1.0',
    category: 'AuditLogs',
    resultType: 'Success',
    resultSignature: 'None',
    durationMs: 0,
    callerIpAddress: '<null>',
    level: 'Informational',
    properties: {
      result: 0,
      resultReason: '',
      activityDisplayName: 'Delete group',
      loggedByService: 'AzureAD',
      initiatedBy: {
        user: {
          id: 'ab',
          displayName: null,
          userPrincipalName: 'logzio',
          ipAddress: '<null>',
        },
      },
      targetResources: [{
        userPrincipalName: 'logzio',
        id: 'abe83a158',
        displayName: null,
        modifiedProperties: [{
          displayName: 'Description',
          oldValue: '[]',
          newValue: '["fdsgvc"]',
        },
        {
          displayName: 'Group.DisplayName',
          oldValue: null,
          newValue: '"sdhfcb"',
        },
        ],
      },
      {
        groupType: 1,
        id: '8a1eb99d7',
        displayName: null,
        modifiedProperties: [],
      },
      ],
      additionalDetails: [],
    },
  }],
};

const networkSecurityGroupRuleCounterLogs = {
  records: [{
    time: '2018-12-04T07:18:07.064Z',
    systemId: '3166dc',
    category: 'NetworkSecurityGroupRuleCounter',
    resourceId: '/SUBSCRIPTIONS/6725/RESOURCEGROUPS/Q-NSG',
    operationName: 'NetworkSecurityGroupCounters',
    properties: {
      vnetResourceGuid: '{859E59}',
      subnetPrefix: '10.0.0.0/24',
      macAddress: '00-34',
      primaryIPv4Address: '10.0.0.4',
      ruleName: 'DefaultRule_AllowVnetOutBound',
      direction: 'Out',
      type: 'allow',
      matchedConnections: 1,
    },
  },
  {
    time: '2018-12-04T07:18:07.065Z',
    systemId: '3165aa76dc',
    category: 'NetworkSecurityGroupRuleCounter',
    resourceId: '/SUBSCRIPTIONS/6E725/RESOURCEGROUPS/Q-NSG',
    operationName: 'NetworkSecurityGroupCounters',
    properties: {
      vnetResourceGuid: '{59E2qwe}',
      subnetPrefix: '10.0.0.0/24',
      macAddress: '00-94',
      primaryIPv4Address: '10.0.0.4',
      ruleName: 'DefaultRule_AllowInternetOutBound',
      direction: 'Out',
      type: 'allow',
      matchedConnections: 91,
    },
  },
  ],
};

module.exports = {
  simpleStringLog,
  simpleJsonLog,
  auditLogs,
  singleLog,
  logArray,
  nested,
  networkSecurityGroupRuleCounterLogs,
};
