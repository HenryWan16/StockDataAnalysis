from kafka import KafkaConsumer
import logging
import atexit
import redis
import sys


topicName=''
kafkaBroker=''
redisChannel=''
redisHost=''
redisPort=''

logging.basicConfig(format='%(levelname)s:%(message)s')
log = logging.getLogger()
log.setLevel(logging.INFO)

def shutdown(kafkaConsumer):
    try:
      log.info('Close kafka consumer')
      kafkaConsumer.close()
      log.info('Kafka consumer has already closed')
    except Exception as kafkaError:
        log.warn('Failed to close kafka consumer ,caused by : %s' ,kafkaError.message)

def initArgs():
    global topicName
    global kafkaBroker
    global redisChannel
    global redisHost
    global redisPort
    log.info('Init args,args is %s' , sys.argv)
    topicName=sys.argv[1]
    kafkaBroker=sys.argv[2]
    redisChannel=sys.argv[3]
    redisHost=sys.argv[4]
    redisPort=sys.argv[5]


def initKakfkaConsumer():
    log.info('Init kafka consumer,start')
    log.info(topicName)
    kafkaConsumer = KafkaConsumer(topicName,bootstrap_servers=kafkaBroker)
    log.info('Init kafka consumer , end')
    return  kafkaConsumer

def publish(kafkaConsumer,redisClient):
    try:
        log.info('Publish data to redis:start')
        for message in kafkaConsumer:
            log.info('Received data from kafka %s' , message.value)
            redisClient.publish(redisChannel,message.value)
            log.info('Publish data to redis %s' ,message.value)
    except Exception as redisError:
        log.warn('Fail to publish data to redis ,caused by : %s ',redisError.message)

if __name__=='__main__':

    initArgs()

    kafkaConsumer=initKakfkaConsumer()

    redisClient=redis.StrictRedis(host=redisHost, port=redisPort)

    atexit.register(shutdown,kafkaConsumer)

    publish(kafkaConsumer,redisClient)