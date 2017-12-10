# StockAnalysis
StockAnalysis can grab the real time information about the stocks you subscribe, and make a prediction about the price of the stock tomorrow based on the history data. It can evaluate live data. According to historical trends, there is an 80% chance for this stock price going down in a few minutes. Live data becomes historical trends over time. With the help of historical trends, if historical information is sufficient, we can do data mining among all the information, so that stock prices could be predicted.
Our aiming users are those retail investors in second-level circulation market. Most of them could not analyze the information instantly and efficiently, so the stock prediction would not only help them make more profit, but also avoid potential risks. 

## Functionalities
1. Grasp stock data every 10 second from yahoo_finance
2. Display the graphic of the stock prediction process 
3. Predict price of some stocks

## Technology
1. Apache Kafka:
Apache Kafka is an open-sourced message broker project which can be used to produce data.

2. Apache Cassandra:
Apache Cassandra is a free and open-source distributed NoSQL database management system. 

3. Apache Zookeeper:
Apache ZooKeeper is a distributed, open-source coordination service for distributed applications 

4. Nodejs:
Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient. Node.js' package ecosystem, npm, is the largest ecosystem of open source libraries in the world.

5. Docker:
Docker containers wrap a piece of software in a complete filesystem that contains everything needed to run: code, runtime, system tools, system libraries – anything that can be installed on a server. This guarantees that the software will always run the same, regardless of its environment.

6. Spark:
Apache Spark™ is a fast and general engine for large-scale data processing.

## Basic ideas
The data analyzed by Spark are placed directly to Kafka, not to Cassandra. This would reduce dependency on data server IO performance. We use Redis as a transit point between Kafka and NodeJS, which would improve the transmission efficiency. Cassandra would take the result from Kafka and archive down to complete the data persistence.
We use Amazon ECS to schedule long-running applications, services, and batch processes using Docker containers, and deploy our applicaionn to Amazon Ec2.
The prediction model can be more tested and self improved by adding some machine learning methods. Since data analytic is stream processing in spark, we can adjust parameters and modify prediction model to make more precise computing model. 



