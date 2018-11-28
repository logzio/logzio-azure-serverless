# logzio-azure-serverless
Azure function that ships Logs to logz.io

## Creating an Azure Event Hub
To learn how to create an event hub follow: 
https://docs.microsoft.com/en-gb/azure/event-hubs/event-hubs-create

You need to create a javascript 

## Set Azure services to route logs to the Event Hub.
To ship logz from your Azure services to your event hub,please read here:
https://docs.microsoft.com/en-us/azure/monitoring-and-diagnostics/monitor-stream-monitoring-data-event-hubs

## Install Logz.io Azure Function

For more information about Azure functions please follow https://docs.microsoft.com/en-us/azure/azure-functions/

* create new function
* Select Azure event hub trigger
* Enter name for your function.
* Add the wanted Event Hub connection or create a new one if you haven’t have one already.
* Select the Event Hub consumer group and the Event Hub Name you want to pull logs from.
* Hit Create 
* Replace the initiale code with the Logz.io Azure function
* Change the LOGZ_IO token with your account token
* Save Function
* In the Integrate part, set the Event Parameter Name to eventHubMessages and cardinality to Many.



Thats It!
You should be shortly see logz entering to your account with type "eventhub"
