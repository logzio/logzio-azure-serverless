cp src/data-parser.js src/core.js src/logs-index.js dist/logs/logzioLogsFunction \
&& mv dist/logs/logzioLogsFunction/logs-index.js dist/logs/logzioLogsFunction/index.js \
&& cp src/data-parser.js src/core.js src/metrics-index.js dist/metrics/logzioMetricsFunction \
&& mv dist/metrics/logzioMetricsFunction/metrics-index.js dist/metrics/logzioMetricsFunction/index.js \
&& git add dist/* \
|| git commit -m "updating dist folder"
