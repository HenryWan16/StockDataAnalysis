#kafka dependency
```sh
pip install -r requirements.txt
```
#data-producer.py
```sh
use the yahoo_finance to put raw historial data
```
```sh
use flask to implement the add/delete stock entity dynamicly
```
```sh
assume your kafka framework/ zookeeper is already setup on 192.168.99.100
```
```sh
you may use postman or curl to POST/DELETE
```
### run this code in your bash
```sh
python flask-data-producer.py
```