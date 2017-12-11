# pykafka_cassandra.py
实现Kafka Consumer往Cassandra存储数据过程

# 使用库
cassandra-driver    https://github.com/datastax/python-driver
pykafka   https://github.com/Parsely/pykafka

# 配置环境
pip install -r requirement.txt

# 运行
使用格式：
python pykafka-cassandra.py kafka_broker kafka_topic cassandra_ip keyspace table

假设Kafka和Cassandra运行ip都是192.168.99.101：
python pykafka-cassandra.py 192.168.99.101:9092 stock-analyzer 192.168.99.101 stock stock_analyzer
