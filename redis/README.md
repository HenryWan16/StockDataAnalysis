# redis-jhl.py
Redis producer, consume kafka second topic and publish to redis PUB

#dependency
```sh
pip install -r requirements.txt
```

#run command
assume your docker-machine ip : 192.168.99.100
```sh
python redis-publisher.py prediction-stock-price 192.168.99.100:9092 prediction-stock-price 192.168.99.100 6379
```


