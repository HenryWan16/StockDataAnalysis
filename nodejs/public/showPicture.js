/**
 * Created by henrywan16 on 12/1/16.
 */
$(function () {
    var x_final;
    var x = new Array(25); // 14 days + 11 month
    var price = new Array(25);
    var prediction;

    var socket = io();

    // - Whenever the server emits 'data', update the flow graph
    socket.on('data', function (data) {
        console.log('showPicture.js received message as follow: ' + data);
        newDataCallback(data);
    });

    function newDataCallback(message) {
        "use strict";
        var parsed = JSON.parse(message);
        var timestamp = parsed['timestamp'];
        // var average = parsed['average'];
        // var symbol = parsed['symbol'];
        var coefficient = parsed['coefficient'];
        var b = parsed['b'];
        prediction = parsed['prediction'];
        // var point = {};
        // point.x = timestamp;
        // point.y = average;
        //
        // console.log(point);
        //
        // var i = getSymbolIndex(symbol, points_show);
        //
        // points_show[i].values.push(point);
        // if (points_show[i].length > 100) {
        //     points_show[i].values.shift();
        // }
        // loadGraph();

        getPointsOnline(coefficient, b, prediction);

        Highcharts.chart('container1', {
            title: {
                text: 'Stock Analysising Results',
                x: -20 //center
            },
            subtitle: {
                text: 'The price tomorrow is ' + prediction,
                x: -20
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', '26. Nov', '27. Nov', '28. Nov', '29. Nov', '30. Nov',
                    '1. Dec', '2. Dec', '3. Dec', '4. Dec', '5. Dec', '6. Dec', '7. Dec', '8. Dec', '9. Dec']
            },
            yAxis: {
                title: {
                    text: 'Price ($)'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: '$'
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [{
                name: 'Price',
                data: price
            }]
        });
    }

    function getPointsOnline(coefficient, b, prediction) {
        x_final = (prediction - b)/coefficient;
        console.log("x = " + x_final);
        var n = price.length;
        var x_temp = x_final;
        price[24] = prediction;
        x[24] = x_final;
        var i = 24;
        for (; i >= 10; i--) {
            x[i] = x_temp - 86400;
            price[i] = coefficient * x[i] + b;
            console.log("x[i] = " + x[i] + " price[i] = " + price[i]);
            x_temp = x[i];
        }
        for (; i >= 0; i--) {
            x[i] = x_temp - 2592000;
            price[i] = coefficient * x[i] + b;
            console.log("x[i] = " + x[i] + " price[i] = " + price[i]);
            x_temp = x[i];
        }
    }

    // var a = 2;
    // var b = 1;
    // console.log('a = ' + a, 'b = ' + b);
    // var y1 = a + b;
    // var y2 = a * 2 + b;
    // var y3 = a * 3 + b;
    // var y4 = a * 4 + b;
    // var y5 = a * 5 + b;
    // var y6 = a * 6 + b;
    // var y7 = a * 7 + b;
    // var y8 = a * 8 + b;
    // var y9 = a * 9 + b;
    // var y10 = a * 10 + b;
    // var y11 = a * 11 + b;
    // var y12 = a * 12 + b;

});
