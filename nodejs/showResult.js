/**
 * Created by henrywan16 on 11/29/16.
 * make a reference to the opensource code:
 * https://github.com/UncleBarney/play-big-data/blob/master/nodejs/index.js
 *
 */

var arguement = require('minimist')(process.argv.slice(2));
var port = arguement['port'];
var redisHost = arguement['redis_host'];
var redisPort = arguement['redis_port'];
var shareTopic = arguement['subscribe_topic'];

var expressDependence = require('express');
var application = expressDependence();
var nodeJSserver = require('http').createServer(application);
var inOrOut = require('socket.io')(nodeJSserver);

var redis = require('redis');
console.log('Get a client for redis: ');
var redisClient = redis.createClient(redisPort, redisHost);
console.log('Subscribing to redis topic %s', shareTopic);
redisClient.subscribe(shareTopic);
redisClient.on('message', function (channel, information) {
    if (channel == shareTopic) {
        console.log('get the message %s', information);
        inOrOut.sockets.emit('data', information);
    }
});

application.use(expressDependence.static(__dirname + '/public'));
application.use('/jquery', expressDependence.static(__dirname + '/node_modules/jquery/dist/'));
application.use('/smoothie', expressDependence.static(__dirname + '/node_modules/smoothie/'));
application.use('/d3', expressDependence.static(__dirname + '/node_modules/d3/'));
application.use('/nvd3', expressDependence.static(__dirname + '/node_modules/nvd3/build/'));
application.use('/bootstrap', expressDependence.static(__dirname + '/node_modules/bootstrap/dist'));
application.use('/highcharts',expressDependence.static(__dirname + '/node_modules/highcharts'));

nodeJSserver.listen(port, function () {
    console.log('Port %d is monitored by server.', port);
});

// do something before shutdown
var shutdown_hook = function () {
    console.log('Exitting the redis client');
    redisClient.quit();
    console.log('Close the application.');
    process.exit();
};

// prepare for the signal and recycle the resources frequently.
process.on('exit', shutdown_hook);

process.on('SIGINT', shutdown_hook);

process.on('SIGTERM', shutdown_hook);
