# logzio-azure-serverless
This repo contains the code and instructions you'll need to ship logs from your Azure services to Logz.io.
At the end of this process, your Azure function will forward logs from an Azure Event Hub to your Logz.io account.

## Setting log shipping from Azure

### 1. Deploy a custom template

![Search menu](img/search-deploy-custom-template.png)

In the search bar, type "deploy", and then click **Deploy a custom template**.
This brings you to the _Custom deployment_ page.

Click **Build your own template in the editor** to continue to the template editor.
Clear the default code so the editor is blank.
Replace it with the code from [logzio-azure-serverless](https://raw.githubusercontent.com/logzio/logzio-azure-serverless/master/azuredeploy.json), and then click **Save** to continue to the _Customized template_ page.

### 2. Configure the customized template

![Customized template](img/customized-template-step-2.png)

Make sure to use these settings:

**In the BASICS section**
* **Resource group**: Click **Create new**. <br />
  Give a meaningful **Name**, such as "logzioEventHubIntegration", and then click **OK**.

**In the SETTINGS section:**
* **Logzio Host**: Use your Logz.io region's listener URL.
  If your login URL is app.logz.io, use `listener.logz.io` (this is the default setting).
  If your login URL is app-eu.logz.io, use `listener-eu.logz.io`.
* **Logzio Token**: Use the [token](https://app.logz.io/#/dashboard/settings/general) of the account you want to ship to.

At the bottom of the page, select **I agree to the terms and conditions stated above**, and then click **Purchase** to deploy.

Deployment can take a few minutes.

### 3. _(Optional)_ Add failsafe for log shipping timeouts

You can configure logzio-azure-serverless to back up logs to Azure Blob Storage.
So if the connection to Logz.io times out or an error occurs, you'll still have a backup of any dropped logs.

![Function app left menu](img/function-app-menu-integrate.png)

To do this, expand your function app's left menu, and then click **Integrate**.

![New Blob output](img/azure-blob-storage-outputblob.png)

In the top of the triggers panel, click **Azure Blob Storage (outputBlob)**.
The _Azure Blob Storage output_ settings are displayed.

Leave **Blob parameter name** blank.
Enter the blob **Path** for the Azure blob you're sending dropped logs to, and then click **Save**.

**Important:** Make sure the blob **Path** you're using here exists or create it now.

**Note:** For more information on Azure Blob output binding, see [Azure Blob storage bindings for Azure Functions > Output](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-storage-blob#output) from Microsoft.

### 4. Stream Azure service logs to your new event hub

Now that you've set it up, configure Azure to stream service logs to your new event hub so that your new function app can forward those logs to Logz.io.
If you're not sure how to do this, see [Stream Azure monitoring data to an event hub for consumption by an external tool](https://docs.microsoft.com/en-us/azure/monitoring-and-diagnostics/monitor-stream-monitoring-data-event-hubs) from Microsoft.

### 5. Test your configuration

Give your logs some time to get from your system to ours, and then open Kibana.
If everything went according to plan, you should see logs with the type `eventhub` in Kibana.

If you still don’t see your logs, see [log shipping troubleshooting](https://docs.logz.io/user-guide/log-shipping/log-shipping-troubleshooting.html) in the Logz.io docs.
