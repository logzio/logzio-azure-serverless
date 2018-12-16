const simpleStringLog = 'test';

const simpleJsonLog = JSON.stringify({
  k1: 'v1',
  k2: 'v2',
});

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
      matchedConnections: 0,
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

const activityLogs = {
  records: [
    {
      "authorization": {
        "action": "Microsoft.Resources/checkPolicyCompliance/read",
        "scope": "/subscriptions/ac7ee52c-3b51-43b5-b667-2498be58418b"
      },
      "caller": "17a14b6f-3663-48c5-bf37-cdaa929849b9",
      "channels": "Operation",
      "claims": {
        "aud": "https://management.azure.com/",
        "iss": "https://sts.windows.net/b1e82b83-416f-40eb-a93c-49303e4f25cb/",
        "iat": "1544948390",
        "nbf": "1544948390",
        "exp": "1544977490",
        "aio": "42RgYHBcKzG9Squ2wb+t1N5mVfF7AA==",
        "appid": "1d78a85d-813d-46f0-b496-dd72f50a3ec0",
        "appidacr": "2",
        "http://schemas.microsoft.com/identity/claims/identityprovider": "https://sts.windows.net/b1e82b83-416f-40eb-a93c-49303e4f25cb/",
        "http://schemas.microsoft.com/identity/claims/objectidentifier": "17a14b6f-3663-48c5-bf37-cdaa929849b9",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": "17a14b6f-3663-48c5-bf37-cdaa929849b9",
        "http://schemas.microsoft.com/identity/claims/tenantid": "b1e82b83-416f-40eb-a93c-49303e4f25cb",
        "uti": "du3pG5OYHEy7vR9lxsciAA",
        "ver": "1.0"
      },
      "correlationId": "e06e6e07-6b01-4138-b135-8cc88ed47828",
      "description": "",
      "eventDataId": "326f82ba-b74a-498c-8e95-b759abf43e21",
      "eventName": {
        "value": "EndRequest",
        "localizedValue": "End request"
      },
      "category": {
        "value": "Policy",
        "localizedValue": "Policy"
      },
      "eventTimestamp": "2018-12-16T08:25:17.274725Z",
      "id": "/subscriptions/ac7ee52c-3b51-43b5-b667-2498be58418b/resourceGroups/logzio/providers/Microsoft.Web/sites/logging-function/config/web/events/326f82ba-b74a-498c-8e95-b759abf43e21/ticks/636805455172747250",
      "level": "Warning",
      "operationId": "e06e6e07-6b01-4138-b135-8cc88ed47828",
      "operationName": {
        "value": "Microsoft.Authorization/policies/audit/action",
        "localizedValue": "Microsoft.Authorization/policies/audit/action"
      },
      "resourceGroupName": "logzio",
      "resourceProviderName": {
        "value": "Microsoft.Web",
        "localizedValue": "Azure Web Sites"
      },
      "resourceType": {
        "value": "Microsoft.Resources/checkPolicyCompliance",
        "localizedValue": "Microsoft.Resources/checkPolicyCompliance"
      },
      "resourceId": "/subscriptions/ac7ee52c-3b51-43b5-b667-2498be58418b/resourceGroups/logzio/providers/Microsoft.Web/sites/logging-function/config/web",
      "status": {
        "value": "Succeeded",
        "localizedValue": "Succeeded"
      },
      "subStatus": {
        "value": "",
        "localizedValue": ""
      },
      "submissionTimestamp": "2018-12-16T08:25:32.1033691Z",
      "subscriptionId": "ac7ee52c-3b51-43b5-b667-2498be58418b",
      "properties": {
        "isComplianceCheck": "True",
        "resourceLocation": "westeurope",
        "ancestors": "",
        "policies": "[{\"policyDefinitionId\":\"/providers/Microsoft.Authorization/policyDefinitions/752c6934-9bcc-4749-b004-655e676ae2ac/\",\"policySetDefinitionId\":\"/providers/Microsoft.Authorization/policySetDefinitions/1f3afdf9-d0c9-4c3d-847f-89da613e70a8/\",\"policyDefinitionReferenceId\":\"diagnosticsLogsInAppServiceMonitoring\",\"policySetDefinitionName\":\"1f3afdf9-d0c9-4c3d-847f-89da613e70a8\",\"policyDefinitionName\":\"752c6934-9bcc-4749-b004-655e676ae2ac\",\"policyDefinitionEffect\":\"Audit\",\"policyAssignmentId\":\"/subscriptions/ac7ee52c-3b51-43b5-b667-2498be58418b/providers/Microsoft.Authorization/policyAssignments/SecurityCenterBuiltIn/\",\"policyAssignmentName\":\"SecurityCenterBuiltIn\",\"policyAssignmentScope\":\"/subscriptions/ac7ee52c-3b51-43b5-b667-2498be58418b\",\"policyAssignmentSku\":{\"name\":\"A1\",\"tier\":\"Standard\"},\"policyAssignmentParameters\":{\"diagnosticsLogsInServiceFabricMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"systemUpdatesMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"systemConfigurationsMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"endpointProtectionMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"diskEncryptionMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"networkSecurityGroupsMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"webApplicationFirewallMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"sqlAuditingMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"sqlEncryptionMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"nextGenerationFirewallMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"vulnerabilityAssesmentMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"storageEncryptionMonitoringEffect\":{\"value\":\"Audit\"},\"jitNetworkAccessMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"adaptiveApplicationControlsMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"identityDesignateLessThanOwnersMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"identityDesignateMoreThanOneOwnerMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"identityEnableMFAForOwnerPermissionsMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"identityEnableMFAForWritePermissionsMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"identityEnableMFAForReadPermissionsMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"identityRemoveDeprecatedAccountWithOwnerPermissionsMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"identityRemoveDeprecatedAccountMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"identityRemoveExternalAccountWithOwnerPermissionsMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"identityRemoveExternalAccountWithWritePermissionsMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"identityRemoveExternalAccountWithReadPermissionsMonitoringEffect\":{\"value\":\"AuditIfNotExists\"}}}]"
      },
      "relatedEvents": []
    },
    {
      "authorization": {
        "action": "Microsoft.Resources/checkPolicyCompliance/read",
        "scope": "/subscriptions/ac7ee52c-3b51-43b5-b667-2498be58418b"
      },
      "caller": "17a14b6f-3663-48c5-bf37-cdaa929849b9",
      "channels": "Operation",
      "claims": {
        "aud": "https://management.azure.com/",
        "iss": "https://sts.windows.net/b1e82b83-416f-40eb-a93c-49303e4f25cb/",
        "iat": "1544948390",
        "nbf": "1544948390",
        "exp": "1544977490",
        "aio": "42RgYHBcKzG9Squ2wb+t1N5mVfF7AA==",
        "appid": "1d78a85d-813d-46f0-b496-dd72f50a3ec0",
        "appidacr": "2",
        "http://schemas.microsoft.com/identity/claims/identityprovider": "https://sts.windows.net/b1e82b83-416f-40eb-a93c-49303e4f25cb/",
        "http://schemas.microsoft.com/identity/claims/objectidentifier": "17a14b6f-3663-48c5-bf37-cdaa929849b9",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": "17a14b6f-3663-48c5-bf37-cdaa929849b9",
        "http://schemas.microsoft.com/identity/claims/tenantid": "b1e82b83-416f-40eb-a93c-49303e4f25cb",
        "uti": "du3pG5OYHEy7vR9lxsciAA",
        "ver": "1.0"
      },
      "correlationId": "79d0e5f1-5f55-49c1-9ed7-f8da46a9676d",
      "description": "",
      "eventDataId": "7b5afa1a-ee4f-4638-9501-3bc876cf8a20",
      "eventName": {
        "value": "EndRequest",
        "localizedValue": "End request"
      },
      "category": {
        "value": "Policy",
        "localizedValue": "Policy"
      },
      "eventTimestamp": "2018-12-16T08:25:15.6521711Z",
      "id": "/subscriptions/ac7ee52c-3b51-43b5-b667-2498be58418b/resourceGroups/logzio/providers/Microsoft.EventHub/namespaces/azure-logging-event-hub/eventhubs/insights-operational-logs/events/7b5afa1a-ee4f-4638-9501-3bc876cf8a20/ticks/636805455156521711",
      "level": "Informational",
      "operationId": "94ce6642-c3e9-42ea-8e67-0d9861c44947",
      "operationName": {
        "value": "Microsoft.Authorization/policies/auditIfNotExists/action",
        "localizedValue": "Microsoft.Authorization/policies/auditIfNotExists/action"
      },
      "resourceGroupName": "logzio",
      "resourceProviderName": {
        "value": "Microsoft.Resources",
        "localizedValue": "Microsoft Resources"
      },
      "resourceType": {
        "value": "Microsoft.Resources/checkPolicyCompliance",
        "localizedValue": "Microsoft.Resources/checkPolicyCompliance"
      },
      "resourceId": "/subscriptions/ac7ee52c-3b51-43b5-b667-2498be58418b/resourceGroups/logzio/providers/Microsoft.EventHub/namespaces/azure-logging-event-hub/eventhubs/insights-operational-logs",
      "status": {
        "value": "Succeeded",
        "localizedValue": "Succeeded"
      },
      "subStatus": {
        "value": "",
        "localizedValue": ""
      },
      "submissionTimestamp": "2018-12-16T08:25:36.1781897Z",
      "subscriptionId": "ac7ee52c-3b51-43b5-b667-2498be58418b",
      "properties": {
        "isComplianceCheck": "True",
        "resourceLocation": "westeurope",
        "ancestors": "",
        "policies": "[{\"policyDefinitionId\":\"/providers/Microsoft.Authorization/policyDefinitions/f4826e5f-6a27-407c-ae3e-9582eb39891d/\",\"policySetDefinitionId\":\"/providers/Microsoft.Authorization/policySetDefinitions/1f3afdf9-d0c9-4c3d-847f-89da613e70a8/\",\"policyDefinitionReferenceId\":\"accessRulesInEventHubMonitoring\",\"policySetDefinitionName\":\"1f3afdf9-d0c9-4c3d-847f-89da613e70a8\",\"policyDefinitionName\":\"f4826e5f-6a27-407c-ae3e-9582eb39891d\",\"policyDefinitionEffect\":\"AuditIfNotExists\",\"policyAssignmentId\":\"/subscriptions/ac7ee52c-3b51-43b5-b667-2498be58418b/providers/Microsoft.Authorization/policyAssignments/SecurityCenterBuiltIn/\",\"policyAssignmentName\":\"SecurityCenterBuiltIn\",\"policyAssignmentScope\":\"/subscriptions/ac7ee52c-3b51-43b5-b667-2498be58418b\",\"policyAssignmentSku\":{\"name\":\"A1\",\"tier\":\"Standard\"},\"policyAssignmentParameters\":{\"diagnosticsLogsInServiceFabricMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"systemUpdatesMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"systemConfigurationsMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"endpointProtectionMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"diskEncryptionMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"networkSecurityGroupsMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"webApplicationFirewallMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"sqlAuditingMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"sqlEncryptionMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"nextGenerationFirewallMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"vulnerabilityAssesmentMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"storageEncryptionMonitoringEffect\":{\"value\":\"Audit\"},\"jitNetworkAccessMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"adaptiveApplicationControlsMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"identityDesignateLessThanOwnersMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"identityDesignateMoreThanOneOwnerMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"identityEnableMFAForOwnerPermissionsMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"identityEnableMFAForWritePermissionsMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"identityEnableMFAForReadPermissionsMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"identityRemoveDeprecatedAccountWithOwnerPermissionsMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"identityRemoveDeprecatedAccountMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"identityRemoveExternalAccountWithOwnerPermissionsMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"identityRemoveExternalAccountWithWritePermissionsMonitoringEffect\":{\"value\":\"AuditIfNotExists\"},\"identityRemoveExternalAccountWithReadPermissionsMonitoringEffect\":{\"value\":\"AuditIfNotExists\"}}}]"
      },
      "relatedEvents": []
    },
    {
      "channels": "Admin, Operation",
      "correlationId": "c51713a2-f1d3-42c0-bc87-5b118fafd2e1",
      "description": "",
      "eventDataId": "5964d30b-7678-437b-bb93-4ff1660f74fc",
      "eventName": {
        "value": "",
        "localizedValue": ""
      },
      "category": {
        "value": "ResourceHealth",
        "localizedValue": "Resource Health"
      },
      "eventTimestamp": "2018-12-15T01:43:25.065Z",
      "id": "/subscriptions/ac7ee52c-3b51-43b5-b667-2498be58418b/resourceGroups/LOGZIO-PROD/providers/Microsoft.Compute/virtualMachineScaleSets/testscaleset/virtualMachines/1/events/5964d30b-7678-437b-bb93-4ff1660f74fc/ticks/636804350050650000",
      "level": "Informational",
      "operationId": "",
      "operationName": {
        "value": "Microsoft.Resourcehealth/healthevent/Updated/action",
        "localizedValue": "Health Event Updated"
      },
      "resourceGroupName": "LOGZIO-PROD",
      "resourceProviderName": {
        "value": "Microsoft.Resourcehealth/healthevent/action",
        "localizedValue": "Microsoft.Resourcehealth/healthevent/action"
      },
      "resourceType": {
        "value": "Microsoft.Compute/virtualMachineScaleSets/virtualMachines",
        "localizedValue": "Microsoft.Compute/virtualMachineScaleSets/virtualMachines"
      },
      "resourceId": "/subscriptions/ac7ee52c-3b51-43b5-b667-2498be58418b/resourceGroups/LOGZIO-PROD/providers/Microsoft.Compute/virtualMachineScaleSets/testscaleset/virtualMachines/1",
      "status": {
        "value": "Updated",
        "localizedValue": "Updated"
      },
      "subStatus": {
        "value": "",
        "localizedValue": ""
      },
      "submissionTimestamp": "2018-12-15T02:06:43.0203127Z",
      "subscriptionId": "ac7ee52c-3b51-43b5-b667-2498be58418b",
      "properties": {
        "title": "The configuration of this virtual machine is being updated as requested by an authorized user or process",
        "details": "",
        "currentHealthStatus": null,
        "previousHealthStatus": null,
        "type": "Downtime",
        "cause": "UserInitiated"
      },
      "relatedEvents": []
    },
    {
      "authorization": {
        "action": "Microsoft.Resources/deployments/write",
        "scope": "/subscriptions/ac7ee52c-3b51-43b5-b667-2498be58418b/resourceGroups/logzio-prod/providers/Microsoft.Resources/deployments/microsoft.vmss-20181215033247"
      },
      "caller": "ofer@logz.io",
      "channels": "Operation",
      "claims": {
        "aud": "https://management.core.windows.net/",
        "iss": "https://sts.windows.net/b1e82b83-416f-40eb-a93c-49303e4f25cb/",
        "iat": "1544837048",
        "nbf": "1544837048",
        "exp": "1544840948",
        "http://schemas.microsoft.com/claims/authnclassreference": "1",
        "aio": "42RgYHgkneL/b1+R6IRQXUnFlKuxBm0HEr06eZ9WKe43kr9v+hIA",
        "http://schemas.microsoft.com/claims/authnmethodsreferences": "wia",
        "appid": "c44b4083-3bb0-49c1-b47d-974e53cbdf3c",
        "appidacr": "2",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname": "Velich",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname": "Ofer",
        "groups": "725f2d7e-bc60-4daa-a81f-385d380f2fe2",
        "ipaddr": "46.116.121.76",
        "name": "Ofer Velich",
        "http://schemas.microsoft.com/identity/claims/objectidentifier": "14d7d9c8-4957-4658-a829-41c8ef73be70",
        "puid": "10037FFEAD13D89A",
        "http://schemas.microsoft.com/identity/claims/scope": "user_impersonation",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": "5nK6502PS-oZlowVZ_ZqA_Z-H9vDzt6MNlyGE_ugmPY",
        "http://schemas.microsoft.com/identity/claims/tenantid": "b1e82b83-416f-40eb-a93c-49303e4f25cb",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": "ofer@logz.io",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn": "ofer@logz.io",
        "uti": "jQM2MvhlM0mcU4yBxXMVAA",
        "ver": "1.0"
      },
      "correlationId": "eccc4747-a5c2-4e8b-bae0-ae41fa61d1a7",
      "description": "",
      "eventDataId": "e51ebaea-2a1a-4fd8-a500-763ad01ea5c8",
      "eventName": {
        "value": "EndRequest",
        "localizedValue": "End request"
      },
      "category": {
        "value": "Administrative",
        "localizedValue": "Administrative"
      },
      "eventTimestamp": "2018-12-15T01:43:28.193264Z",
      "id": "/subscriptions/ac7ee52c-3b51-43b5-b667-2498be58418b/resourceGroups/logzio-prod/providers/Microsoft.Resources/deployments/microsoft.vmss-20181215033247/events/e51ebaea-2a1a-4fd8-a500-763ad01ea5c8/ticks/636804350081932640",
      "level": "Informational",
      "operationId": "cf80bd30-c4cf-4d1e-9de2-357c644ffc29",
      "operationName": {
        "value": "Microsoft.Resources/deployments/write",
        "localizedValue": "Create Deployment"
      },
      "resourceGroupName": "logzio-prod",
      "resourceProviderName": {
        "value": "Microsoft.Resources",
        "localizedValue": "Microsoft Resources"
      },
      "resourceType": {
        "value": "Microsoft.Resources/deployments",
        "localizedValue": "Microsoft.Resources/deployments"
      },
      "resourceId": "/subscriptions/ac7ee52c-3b51-43b5-b667-2498be58418b/resourceGroups/logzio-prod/providers/Microsoft.Resources/deployments/microsoft.vmss-20181215033247",
      "status": {
        "value": "Succeeded",
        "localizedValue": "Succeeded"
      },
      "subStatus": {
        "value": "",
        "localizedValue": ""
      },
      "submissionTimestamp": "2018-12-15T01:43:47.0734805Z",
      "subscriptionId": "ac7ee52c-3b51-43b5-b667-2498be58418b",
      "relatedEvents": []
    },
    {
      "channels": "Admin",
      "correlationId": "6069bfbe-0b3d-4c45-965a-11105b6923c0",
      "description": "Resolved: Networking - UK West - Mitigated",
      "eventDataId": "337d75c7-3260-387e-bd58-287ae1dd5039",
      "eventName": {
        "value": "",
        "localizedValue": ""
      },
      "category": {
        "value": "ServiceHealth",
        "localizedValue": "Service Health"
      },
      "eventTimestamp": "2018-12-14T14:29:28.4099378Z",
      "id": "/subscriptions/ac7ee52c-3b51-43b5-b667-2498be58418b/events/337d75c7-3260-387e-bd58-287ae1dd5039/ticks/636803945684099378",
      "level": "Warning",
      "operationId": "",
      "operationName": {
        "value": "Microsoft.ServiceHealth/incident/action",
        "localizedValue": "Microsoft.ServiceHealth/incident/action"
      },
      "resourceGroupName": "",
      "resourceProviderName": {
        "value": "",
        "localizedValue": ""
      },
      "resourceType": {
        "value": "",
        "localizedValue": ""
      },
      "resourceId": "/subscriptions/ac7ee52c-3b51-43b5-b667-2498be58418b",
      "status": {
        "value": "Resolved",
        "localizedValue": "Resolved"
      },
      "subStatus": {
        "value": "",
        "localizedValue": ""
      },
      "submissionTimestamp": "2018-12-14T14:29:39.527651Z",
      "subscriptionId": "ac7ee52c-3b51-43b5-b667-2498be58418b",
      "properties": {
        "title": "Networking - UK West - Mitigated",
        "service": "Network Infrastructure",
        "region": "UK West",
        "communication": "<p>Summary of impact: Between 03:30 and 12:25 UTC on 14 Dec 2018, you were identified as a customer in UK West who may have intermittently experienced degraded performance, latency, network drops or time outs when accessing Azure resources hosted in this region. Similarly, customers with resources in UK West attempting to access resources outside of this region may have also see the same symptoms.&nbsp;</p><p>Preliminary root cause: Engineers determined that an external networking circuit experienced a hardware failure impacting a single fiber in this region.&nbsp;</p><p>Mitigation: Engineers performed a hardware replacement which restored full connectivity across the fiber circuit, thus mitigating the issue.&nbsp;</p><p>Next steps: Engineers will continue to investigate to establish the full root cause and prevent future occurrences. To stay informed on any issues, maintenance events, or advisories, create service health alerts (https://www.aka.ms/ash-alerts) and you will be notified via your preferred communication channel(s): email, SMS, webhook, etc.</p>",
        "incidentType": "Incident",
        "trackingId": "B7F1-JXZ",
        "impactStartTime": "2018-12-14T03:30:00.0000000Z",
        "impactMitigationTime": "2018-12-14T12:25:00.0000000Z",
        "impactedServices": "[{\"ImpactedRegions\":[{\"RegionName\":\"UK West\"}],\"ServiceName\":\"Network Infrastructure\"}]",
        "impactedServicesTableRows": "<tr>\r\n<td align='center' style='padding: 5px 10px; border-right:1px solid black; border-bottom:1px solid black'>Network Infrastructure</td>\r\n<td align='center' style='padding: 5px 10px; border-bottom:1px solid black'>UK West<br></td>\r\n</tr>\r\n",
        "defaultLanguageTitle": "Networking - UK West - Mitigated",
        "defaultLanguageContent": "<p>Summary of impact: Between 03:30 and 12:25 UTC on 14 Dec 2018, you were identified as a customer in UK West who may have intermittently experienced degraded performance, latency, network drops or time outs when accessing Azure resources hosted in this region. Similarly, customers with resources in UK West attempting to access resources outside of this region may have also see the same symptoms.&nbsp;</p><p>Preliminary root cause: Engineers determined that an external networking circuit experienced a hardware failure impacting a single fiber in this region.&nbsp;</p><p>Mitigation: Engineers performed a hardware replacement which restored full connectivity across the fiber circuit, thus mitigating the issue.&nbsp;</p><p>Next steps: Engineers will continue to investigate to establish the full root cause and prevent future occurrences. To stay informed on any issues, maintenance events, or advisories, create service health alerts (https://www.aka.ms/ash-alerts) and you will be notified via your preferred communication channel(s): email, SMS, webhook, etc.</p>",
        "stage": "Resolved",
        "communicationId": "11000011712536",
        "externalIncidentId": "96027574",
        "version": "0.1.1"
      },
      "relatedEvents": []
    } ,
    {
      "authorization": {
        "action": "Microsoft.Web/sites/config/write",
        "scope": "/subscriptions/ac7ee52c-3b51-43b5-b667-2498be58418b/resourceGroups/logzio/providers/Microsoft.Web/sites/FunctionForActivityLog/config/appSettings"
      },
      "caller": "amir@logz.io",
      "channels": "Operation",
      "claims": {
        "aud": "https://management.core.windows.net/",
        "iss": "https://sts.windows.net/b1e82b83-416f-40eb-a93c-49303e4f25cb/",
        "iat": "1544959013",
        "nbf": "1544959013",
        "exp": "1544962913",
        "http://schemas.microsoft.com/claims/authnclassreference": "1",
        "aio": "ASQA2/8JAAAArXCDlL4r+PnUq4w3h5c3U6ByqsggLcA7XdGTsVAovDk=",
        "http://schemas.microsoft.com/claims/authnmethodsreferences": "wia",
        "appid": "c44b4083-3bb0-49c1-b47d-974e53cbdf3c",
        "appidacr": "2",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname": "Kalron",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname": "Amir",
        "groups": "7a933952-86c4-4966-9fe2-f4d43b75ad9a",
        "ipaddr": "54.174.198.242",
        "name": "Amir Kalron",
        "http://schemas.microsoft.com/identity/claims/objectidentifier": "ee8e4963-4bb6-4fee-a6a2-2d65cbfac909",
        "puid": "10030000AD0612B0",
        "http://schemas.microsoft.com/identity/claims/scope": "user_impersonation",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": "qE2j0XscIY8TDMxuaTHN5ttAHKQ9vs9tliG_tcR86Qc",
        "http://schemas.microsoft.com/identity/claims/tenantid": "b1e82b83-416f-40eb-a93c-49303e4f25cb",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": "amir@logz.io",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn": "amir@logz.io",
        "uti": "69TKodZlD0eZIdAjtUUpAA",
        "ver": "1.0"
      },
      "correlationId": "21d82bf9-847d-4a6c-8abb-ef421d3a9ffe",
      "description": "",
      "eventDataId": "b8ed3067-38e2-4fff-a566-7d0a5c3062e2",
      "eventName": {
        "value": "BeginRequest",
        "localizedValue": "Begin request"
      },
      "category": {
        "value": "Administrative",
        "localizedValue": "Administrative"
      },
      "eventTimestamp": "2018-12-16T12:00:57.3119276Z",
      "id": "/subscriptions/ac7ee52c-3b51-43b5-b667-2498be58418b/resourceGroups/logzio/providers/Microsoft.Web/sites/FunctionForActivityLog/config/appSettings/events/b8ed3067-38e2-4fff-a566-7d0a5c3062e2/ticks/636805584573119276",
      "level": "Informational",
      "operationId": "21d82bf9-847d-4a6c-8abb-ef421d3a9ffe",
      "operationName": {
        "value": "Microsoft.Web/sites/config/write",
        "localizedValue": "Update web sites config"
      },
      "resourceGroupName": "logzio",
      "resourceProviderName": {
        "value": "Microsoft.Web",
        "localizedValue": "Azure Web Sites"
      },
      "resourceType": {
        "value": "Microsoft.Web/sites/config",
        "localizedValue": "Microsoft.Web/sites/config"
      },
      "resourceId": "/subscriptions/ac7ee52c-3b51-43b5-b667-2498be58418b/resourceGroups/logzio/providers/Microsoft.Web/sites/FunctionForActivityLog/config/appSettings",
      "status": {
        "value": "Started",
        "localizedValue": "Started"
      },
      "subStatus": {
        "value": "",
        "localizedValue": ""
      },
      "submissionTimestamp": "2018-12-16T12:01:13.0737882Z",
      "subscriptionId": "ac7ee52c-3b51-43b5-b667-2498be58418b",
      "relatedEvents": []
    }
  ]
};

module.exports = {
  simpleStringLog,
  simpleJsonLog,
  auditLogs,
  networkSecurityGroupRuleCounterLogs,
  activityLogs
};
