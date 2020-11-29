
# logzio-azure-serverless
This repo contains the code and instructions you'll need to ship logs and metrics from your Azure services to Logz.io.
At the end of this process, your Azure function will forward logs or metrics from an Azure Event Hub to your Logz.io account.

![Integration-architecture](img/logzio-evethub-Diagram.png)

## Setting log shipping from Azure

* Shipping [logs](#logs)
* Shipping [metrics](#metrics)

<div id="logs">

## Sending Logs

### 1. Deploy the Logz.io template👇


[![Deploy to Azure](https://azuredeploy.net/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Flogzio%2Flogzio-azure-serverless%2Fmaster%2Fdeployments%2Fazuredeploylogs.json)

This deployment will create the following services:
* Serveless Function App
* Event Hubs Namspace
* Function's logs Storage Account
* Back up Storage Account for failed shipping
* App Service Plan
* Application Insights


### 2. Configure the template

Make sure to use these settings:

| Parameter | Description |
|---|---|
| Resource group* | Create a new resource group or select your existing one, and then click **OK**. |
| Location* | Select the same region as the Azure services that will stream data to this event hub. |
| Logs account token* | Add the [log shipping token](https://app.logz.io/#/dashboard/settings/general) for the relevant Logz.io account. This is the account you want to ship to.  |
| Logs listener host* (Default: `listener.logz.io`)| Use the listener URL specific to the region of your Logz.io account. You can look it up [here](https://docs.logz.io/user-guide/accounts/account-region.html). |
| buffersize (Default: 100) | The maximum number of messages the logger will accumulate before sending them all as a bulk  |
| timeout (Default: 180,000 = 3 minutes) | The read/write/connection timeout in *milliseconds*.  |
| ParseEmptyFields (Default: False) | There are Azure's services logs that features empty fields and will not be parsed in Kibana. If you wish to parse those logs insert the value 'true'. **Please note using this option may slow the shipper's perfomance.** |

*Required fields.  

At the bottom of the page, select **Review + Create**, and then click **Create** to deploy.

Deployment can take a few minutes.

### 3. Stream Azure service data to your new event hubs

Now that you've set it up, configure Azure to stream service logs to your new event hubs so that your new function apps can forward that data to Logz.io.
To send your data to this event hub choose your service type and create diagnostic settings for it.  
Under 'Event hub policy name' choose 'LogzioLSharedAccessKey'.  
This settings may take time to be applied and some of the services may need to be restarted.  
For more information see [Stream Azure monitoring data to an event hub for consumption by an external tool](https://docs.microsoft.com/en-us/azure/monitoring-and-diagnostics/monitor-stream-monitoring-data-event-hubs) from Microsoft.

![Diagnostic-settings](img/diagnostic-settings.png)

### 4. Check Logz.io for your logs

Give your data some time to get from your system to ours, and then open Logz.io.
If everything went according to plan, you should see logs with the type `eventhub` in Kibana.

### Backing up your logs!

This deployment will also back up your data in case of connection or shipping errors. In that case the logs that weren't shipped to Logz.io will be uploaded to the blob storage 'logziologsbackupstorage' under the container 'logziologsbackupcontainer'.

### Working with your parameters after deployment

If you wish to change parameters values after the deployment, go to your function app page, then on the left menu press the 'Configuration' tab.
You'll have the option to edit the following values:
* Shipper's configurations such as LogzioHost, LogzioToken, Buffersize, Timeout.
* FUNCTIONS_WORKER_PROCESS_COUNT - maximum of 10, for more information press [here](https://docs.microsoft.com/en-us/azure/azure-functions/functions-app-settings#functions_worker_process_count).
* ParseEmptyField - Parse logs with invalid empty fields. **Please note using this option may slow the shipper's perfomance.**

![Function's configuration](img/configuration-settings.png)

</div>

<div id="metrics">

## Sending Metrics

### 1. Deploy the Logz.io template👇

[![Deploy to Azure](https://azuredeploy.net/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Flogzio%2Flogzio-azure-serverless%2Fmaster%2Fdeployments%2Fazuredeploymetrics.json)


### 2. Configure the template

Make sure to use these settings:

* **Resource group**: Click **Create new**. <br />
  Give a meaningful **Name**, such as "logzioEventHubIntegration", and then click **OK**.
* **Location**: Choose the same region as the Azure services that will stream data to this Event Hub.
* **Metrics listener host**: Use your the listener URL for your metrics account region (default: `listener.logz.io`).
* **Metrics account token**: Use the [token](https://app.logz.io/#/dashboard/settings/general) of the metrics account you want to ship to.

At the bottom of the page, select **I agree to the terms and conditions stated above**, and then click **Purchase** to deploy.

Deployment can take a few minutes.

### 3. Stream Azure service data to your new event hubs

Now that you've set it up, configure Azure to stream service metrics to your new event hubs so that your new function apps can forward that data to Logz.io.
If you're not sure how to do this, see [Stream Azure monitoring data to an event hub for consumption by an external tool](https://docs.microsoft.com/en-us/azure/monitoring-and-diagnostics/monitor-stream-monitoring-data-event-hubs) from Microsoft.

### 4. Check Logz.io for your metrics

Give your data some time to get from your system to ours, and then open Logz.io.
If everything went according to plan, you should see metrics in Grafana.

</div>

## Changelog

- 2.0.0: Update function app version to SDK 3.
- 1.1.0: Switch to independent deploy for metrics and logs.
