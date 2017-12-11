from cassandra.cluster import Cluster
from pykafka import KafkaClient

import argparse
import atexit
import json
import logging

kafka = '192.168.99.101:9092'
topic = 'stock-analyzer'
cassandra = '192.168.99.101'
keyspace = 'stock'
table = 'stock_analyzer'

formatter = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
logging.basicConfig(format=formatter)
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

def cleanup(consumer, session):
    try:
        logger.info('close kafka consumer and cassandra session')
        consumer.commit_offsets()
        consumer.stop()
        session.shutdown()
    except Exception,e:
        logger.warn('cleanup failed, error: %s', e.message)
    finally:
        logger.info('Existing program')


def putdata(session, stock_entry):
    try:
        logger.debug('starting to put data to cassandra %s', stock_entry)
        entry = json.loads(stock_entry)[0]
        symbol = entry.get('Symbol')
        price = float(entry.get('Close'))
        datetime = entry.get('Date')
        statement = "insert into %s (stock_symbol, last_trade_date_time, last_trade_price) values ('%s', '%s', %f)" % (table, symbol, datetime, price)
        session.execute(statement)
        logger.info('put data successfully to cassandra for stock_symbol: %s, last_trade_data_time: %s, price: %f' % (symbol, datetime, price))
    except Exception,e:
        logger.error('failed to put data to cassandra %s', stock_entry)



if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='use kafka consumer to get stock-analyzer entry and put in Cassandra.')
    parser.add_argument('kafka_ip', help='kafka ip')
    parser.add_argument('topic_name', help='kafka topic name')
    parser.add_argument('cassandra_ip', help='cassandra ip')
    parser.add_argument('keyspace_name', help='keyspace name')
    parser.add_argument('table_name', help='table name')

    args = parser.parse_args()
    kafka = args.kafka_ip
    topic = args.topic_name
    cassandra = args.cassandra_ip
    keyspace = args.keyspace_name
    table = args.table_name

    client = KafkaClient(hosts=kafka)
    consume_topic = client.topics[topic]
    consumer = consume_topic.get_simple_consumer(consumer_group="cassandra", auto_commit_enable=True, consumer_timeout_ms=50000)

    cluster = Cluster([cassandra])
    session = cluster.connect()
    session.execute("create keyspace if not exists %s with replication = {'class': 'SimpleStrategy', 'replication_factor': '1'} and durable_writes = 'true'" % keyspace)
    session.set_keyspace(keyspace)
    session.execute("create table if not exists %s (stock_symbol text, last_trade_date_time timestamp, last_trade_price float, PRIMARY KEY (stock_symbol,last_trade_date_time))" % table)

    atexit.register(cleanup, consumer, session)

    for message in consumer:
        putdata(session, message.value)
