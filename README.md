# StockAnalysis
StockAnalysis can grab the real time information about the stocks you subscribe, and make a prediction about the price of the stock tomorrow based on the history data. It can evaluate live data. According to historical trends, there is an 80% chance for this stock price going down in a few minutes. Live data becomes historical trends over time. With the help of historical trends, if historical information is sufficient, we can do data mining among all the information, so that stock prices could be predicted.
Our aiming users are those retail investors in second-level circulation market. Most of them could not analyze the information instantly and efficiently, so the stock prediction would not only help them make more profit, but also avoid potential risks. 

## How to use it on Mac or Ubuntu 16.04
1. Create a virtual machine which contains 2 cpus and 2G memory.
+ cd docker 
+ docker-machine create --driver virtualbox --virtualbox-cpu-count 2 --virtualbox-memory 2048 $(your-virtual-machine-name)
+ When you run this application for the first time you can use:
+   ./local-setup.sh $(your-virtual-machine-name) 
+ If you have already have docker images, you can use:
+   docker-machine start $(your-virtual-machine-name)
+ eval $(docker-machine env $(your-virtual-machine-name))
+ docker-machine env $(your-virtual-machine-name)
+ docker run -d -p 2181:2181 -p 2888:2888 -p 3888:3888 --name zookeeper confluent/zookeeper
+ docker run -d -p 9092:9092 -e KAFKA_ADVERTISED_HOST_NAME=`docker-machine ip $(your-virtual-machine-name)` -e KAFKA_ADVERTISED_PORT=9092 --name kafka --link zookeeper:zookeeper confluent/kafka
+ docker run -d -p 7199:7199 -p 9042:9042 -p 9160:9160 -p 7001:7001 --name cassandra cassandra:3.7
+ docker run -d -p 6379:6379 --name redis redis:alpine

2. Create the python virtual env
+ Install python 2.7
+ Install virtualenv

3. Run kafka producer
+ cd kafka_data_producer
+ pip install -r requirement.txt
+ python data-producer.py

4. Run spark cluster
+ cd spark
+ pip install -r requirement.txt
+ spark-submit --jars spark-streaming-kafka-0-8-assembly_2.11-2.0.0.jar spark.py realtTime-StockAnalyzer prediction-stock-price 192.168.99.100:9092 "$(the date you want to predict)"

5. Run redis cluster
+ cd redis
+ pip install -r requirement.txt
+ python redis_jhl.py prediction-stock-price 192.168.99.100:9092 prediction-stock-price 192.168.99.100 6379

6. Run node.js server
+ cd node.js
+ npm install
+ node showResult.js --port=3000 --redis_host=192.168.99.100 --redis_port=6379 --subscribe_topic=prediction-stock-price

7. Run cassandra
+ cd cassandra
+ pip install -r requirement.txt
+ python pykafka-cassandra.py 192.168.99.100:9092 stock-analyzer 192.168.99.100 stock stock_analyzer

8. Open the google chrome
+ Go to "http://localhost:3000"
+ Subscribe the stock you want, such as "AAPL"
+ You can see the dynamic prices about the stock.
+ Click "result", and you can see the result we predict.

## Functionalities
1. Grasp stock data every 10 second from google_finance
2. Display the graphic of the stock prediction process 
3. Predict price of some stocks
4. Show the stock price dynamically.

## Technology
1. Apache Kafka:
Apache Kafka is an open-sourced message broker project which can be used to produce data. With the help of this message queue, 
our application can grap real-time data information from google finance, and send these information to spark analysis services.

2. Apache Cassandra:
Apache Cassandra is a free and open-source distributed NoSQL database management system. With the help of this no-sql database, we can save the results which is produced by the spark, and back up these information for user's query. 

3. Apache Zookeeper:
Apache ZooKeeper is a distributed, open-source coordination service for distributed applications. With the help of this service, our application can know all the resources in our cluster. 

4. Nodejs:
Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient. Node.js' package ecosystem, npm, is the largest ecosystem of open source libraries in the world. With the help of this module, we can get the dynamic information with the help of node.js server.

5. Docker:
Docker containers wrap a piece of software in a complete filesystem that contains everything needed to run: code, runtime, system tools, system libraries – anything that can be installed on a server. This guarantees that the software will always run the same, regardless of its environment.

6. Spark:
Apache Spark™ is a fast and general engine for large-scale data processing. Here we use it to build a module and analysis the stock information.

## Basic ideas
The data analyzed by Spark are placed directly to Kafka, not to Cassandra. This would reduce dependency on data server IO performance. We use Redis as a transit point between Kafka and NodeJS, which would improve the transmission efficiency. Cassandra would take the result from Kafka and archive down to complete the data persistence.
We use Amazon ECS to schedule long-running applications, services, and batch processes using Docker containers, and deploy our applicaionn to Amazon Ec2.
The prediction model can be more tested and self improved by adding some machine learning methods. Since data analytic is stream processing in spark, we can adjust parameters and modify prediction model to make more precise computing model. 




