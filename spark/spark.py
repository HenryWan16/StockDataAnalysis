import atexit
import logging
import json
import sys
import datetime,time
import numpy as np
import matplotlib
#matplotlib.use('TkAgg')
import matplotlib.pyplot as plt

from sklearn import linear_model
from kafka import KafkaProducer
from kafka.errors import KafkaError, KafkaTimeoutError
from pyspark import SparkContext
from pyspark.streaming import StreamingContext
from pyspark.streaming.kafka import KafkaUtils

logger_format = '%(asctime)-15s %(message)s'
logging.basicConfig(format=logger_format)
logger = logging.getLogger('stream-processing')
logger.setLevel(logging.INFO)

topic = None
targetTopic = None
brokers = None
kafkaProducer = None
dateTime = None
predicted_price = None

dates = []
prices = []

def gracefulShutdown(producer):
    try:
        logger.info('Flushing pending messages to kafka, set timeout 10 seconds')
        producer.flush(10)
        logger.info('Finished flushing')
    except KafkaError as kafka_error:
        logger.warn('Failed to flush pending messages to kafka, caused by: %s', kafka_error.message)
    finally:
        try:
            logger.info('Closing connection with kafka')
            producer.close(10)
        except Exception as e:
            logger.warn('Failed to close kafka connection, caused by: %s', e.message)

def showPlot(dates,prices):
	linearModel = linear_model.LinearRegression()
	dates = np.reshape(dates,(len(dates),1)) # converting to matrix of n X 1
	prices = np.reshape(prices,(len(prices),1))
	linearModel.fit(dates,prices) #fitting the data points in the model
	plt.scatter(dates,prices,color='yellow') #plotting the initial datapoints
	plt.plot(dates,linearModel.predict(dates),color='blue',linewidth=3) #plotting the line made by linear regression
	plt.show()
	return

def predictPrice(dates,prices,x):
	linearModel = linear_model.LinearRegression() #defining the linear regression model
	dates = np.reshape(dates,(len(dates),1)) # converting to matrix of n X 1
	prices = np.reshape(prices,(len(prices),1))
	linearModel.fit(dates,prices) #fitting the data points in the model
	predicted_price =linearModel.predict(x)
	return predicted_price[0][0],linearModel.coef_[0][0] ,linearModel.intercept_[0]


def sendBackKafka(rdd):
    global predicted_price
    res = rdd.collect()
    for r in res:
        data = json.dumps(
            {
                'symbol': r[0],
                'timestamp': time.time(),
                'average': float('%0.3f' %r[1]),
                'prediction': float('%0.3f' %r[2]),
                'coefficient': float(r[3]),
                'b': float(r[4])

            }
        )
        try:
            logger.info('Sending average and predication price %s to kafka' % data)
            kafkaProducer.send(targetTopic, value=data)
        except KafkaError as error:
            logger.warn('Failed to send average and predication stock price to kafka, caused by: %s', error.message)

#for map function
def pair(data):
    global predicted_price
    record = json.loads(data[1].decode('utf-8'))[0]

    dates.append(int(time.mktime(time.strptime(record.get('Date'), "%Y-%m-%d"))))
    prices.append(float(record.get('Close')))
    predicted_price, coefficient, b = predictPrice(dates, prices, int(time.mktime(time.strptime(dateTime,"%Y-%m-%d"))))
    print 'Date:' + record.get('Date') + "prediction:" + str(predicted_price)

    if len(dates) == 252:
        #showPlot(dates,prices)
        print "in"

    return record.get('Symbol'), (float(record.get('Close')), predicted_price, coefficient, b, 1)#, record.get('LastTradeDateTime')

if __name__ == '__main__':
    if len(sys.argv) != 5:
        print("Usage: stream-process.py [topic] [target-topic] [broker-list] [datetime:'Y-M-D']") # [checkpoint-directory]
        exit(1)

    topic, targetTopic, brokers, dateTime = sys.argv[1:] # [checkpoint-directory]

    # Create a local StreamingContext with two working thread and batch interval of 5 seconds
    sc = SparkContext("local[2]", "StockPricePrediction")
    sc.setLogLevel('ERROR')
    ssc = StreamingContext(sc, 5) #

    # instantiate a kafka stream for processing
    directKafkaStream = KafkaUtils.createDirectStream(ssc, [topic], {'metadata.broker.list': brokers})

    pairs = directKafkaStream.map(pair)
    words = pairs.reduceByKey(lambda a, b: (a[0] + b[0], b[1], b[2], b[3], a[4] + b[4]))
    ave = words.map(lambda (k, v): (k, v[0]/v[4], v[1], v[2], v[3])).foreachRDD(sendBackKafka)

    # kafka producer
    kafkaProducer = KafkaProducer(
        bootstrap_servers=brokers
    )

    # proper shutdown
    atexit.register(gracefulShutdown, kafkaProducer)

    ssc.start()
    ssc.awaitTermination()
