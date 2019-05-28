cp src/data-parser.js src/core.js src/logs-index.js dist/logs/logzioLogsFunction \
&& cp src/data-parser.js src/core.js src/metrics-index.js dist/metrics/logzioMetricsFunction \
&& git add dist/* \
|| git commit -m "updating dist folder"
