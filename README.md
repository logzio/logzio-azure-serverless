
# logzio-azure-serverless
This repo contains the code and instructions you'll need to ship logs and metrics from your Azure services to Logz.io.
At the end of this process, your Azure function will forward logs or metrics from an Azure Event Hub to your Logz.io account.

![Integration-architecture](img/logzio-evethub-Diagram.png)

## Setting log shipping from Azure

### 1. Deploy the Logz.io template👇 


| Logs | Metrics |
|---|---|
| [![Deploy to Azure](https://azuredeploy.net/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Flogzio%2Flogzio-azure-serverless%2Fmaster%2Fdeployments%2Fazuredeploylogs.json) | [![Deploy to Azure](https://azuredeploy.net/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Flogzio%2Flogzio-azure-serverless%2Fmaster%2Fdeployments%2Fazuredeploymetrics.json) |

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
| Region* | Select the same region as the Azure services that will stream data to this event hub. |
| Shipping token* | Add the [logs shipping token](https://app.logz.io/#/dashboard/settings/general) or [metrics shipping token](https://docs.logz.io/user-guide/accounts/finding-your-metrics-account-token/) for the relevant Logz.io account. This is the account you want to ship to.  |
| Logs listener host* (Default: `listener.logz.io`)| Use the listener URL specific to the region of your Logz.io account. You can look it up [here](https://docs.logz.io/user-guide/accounts/account-region.html). |
| buffersize (Default: 100) | The maximum number of messages the logger will accumulate before sending them all as a bulk  |

For all other parameters; to use your existing services, change the parameter to the relevant service's name. Otherwise, the template will build the necessary services automatically.

*Required fields.  

At the bottom of the page, select **Review + Create**, and then click **Create** to deploy.

Deployment can take a few minutes.

### 3. Stream Azure service data to your new event hubs

Now that you've set it up, configure Azure to stream service logs/metrics to your new event hubs so that your new function apps can forward that data to Logz.io.
To send your data to this event hub choose your service type and create diagnostic settings for it.  
Under 'Event hub policy name' choose 'LogzioLSharedAccessKey' for logs and 'LogzioMSharedAccessKey' for metrics.
This settings may take time to be applied and some of the services may need to be restarted.  
For more information see [Stream Azure monitoring data to an event hub for consumption by an external tool](https://docs.microsoft.com/en-us/azure/monitoring-and-diagnostics/monitor-stream-monitoring-data-event-hubs) from Microsoft.

![Diagnostic-settings](img/diagnostic-settings.png)

### 4. For metrics data only - Building rollups config

**Contact support to request a custom rollups config.**  
Your Metrics account offers 18 month retention, by default. This is to allow you to establish your baseline and make comparisons over a substantial time frame.

Data rollups are used to compress the data without losing the original extremes. The original max, min, and average values are kept so you can graph the data more accurately despite its compression. For more information and the list of default configs, see Rollups.

To kick off this process, email Support to request a custom rollups config,
help@logz.io.

Include the following details in your message:

Your Logz.io Metrics account ID or token.
At least 5 sample JSONs of your custom metrics.
If you are sending multiple metricsets, add descriptions to clarify which dimensions are associated with each metricset.
Configuring the rollups for your custom metrics is included in your package and we’re happy to offer it!

### 5. Check Logz.io for your data

Give your data some time to get from your system to ours, and then open Logz.io.
If everything went according to plan, you should see logs with the type `eventHub` in Kibana, or metrics with the type `eventHub` in Grafana.

### Backing up your logs!

This deployment will also back up your data in case of connection or shipping errors. In that case the logs that weren't shipped to Logz.io will be uploaded to the blob storage 'logziologsbackupstorage' under the container 'logziologsbackupcontainer'.

### Working with your parameters after deployment

If you wish to change parameters values after the deployment, go to your function app page, then on the left menu press the 'Configuration' tab.
You'll have the option to edit the following values:
* Shipper's configurations such as LogzioHost, LogzioToken, Buffersize.
* FUNCTIONS_WORKER_PROCESS_COUNT - maximum of 10, for more information press [here](https://docs.microsoft.com/en-us/azure/azure-functions/functions-app-settings#functions_worker_process_count).
* ParseEmptyFields - (Default: False) If you encounter invalid logs of Azure's services that contains empty fields and will not parse in Kibana, you can use this option by changing it's values to 'true'. **Please note using this option may slow the shipper's perfomance.**

![Function's configuration](img/configuration-settings.png)

</div>

## Changelog

- 2.0.0: Update function app version 3.x (Node 12).
    * Back up container for failures.
    * Builds insights on deployment.
- 1.1.0: Switch to independent deploy for metrics and logs.
