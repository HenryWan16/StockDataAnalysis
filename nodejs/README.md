# Nodejs module
## Install
npm install

## Show the result from the server.

```sh
node showResult.js --port=3000 --redis_host=192.168.99.100 --redis_port=6379 --subscribe_topic=average-stock-price
```

## How to demo
1. python data-producer.py

2. spark-submit --jars spark-streaming-kafka-0-8-assembly_2.11-2.0.0.jar spark.py realtTime-StockAnalyzer prediction-stock-price 192.168.99.100:9092 "2016-12-07"

3. python redis_jhl.py prediction-stock-price 192.168.99.100:9092 prediction-stock-price 192.168.99.100 6379

4. node showResult.js --port=3000 --redis_host=192.168.99.100 --redis_port=6379 --subscribe_topic=prediction-stock-price

5. python pykafka-cassandra.py 192.168.99.100:9092 stock-analyzer 192.168.99.100 stock stock_analyzer
