/*
 * make a reference to the opensource code:
 * https://github.com/UncleBarney/play-big-data/blob/master/nodejs/public/main.js
 *
 */
$(function () {

    var points_show = [];

    $("#chart").height($(window).height() - $("#header").height() * 2);

    $(document.body).on('click', '.stock-label', function () {
        "use strict";
        var stockName = $(this).text();

        $.ajax({
            type: "POST",
            url: 'http://localhost:5000/' + stockName,
            crossDomain: true,
            dataType: 'jsonp'
        });
        console.log("send post request to kafka: " + stockName);

        $.ajax({
            url: 'http://localhost:5000/' + stockName,
            type: 'DELETE'
        });

        $(this).remove();
        var i = getSymbolIndex(stockName, points_show);
        points_show.splice(i, 1);
        console.log(points_show);
    });

    $("#add-stock-button").click(function () {
        "use strict";
        var symbol = $("#stock-symbol").val();
        console.log(symbol);

        $.ajax({
            url: 'http://localhost:5000/' + symbol,
            type: 'POST'
        });

        $("#stock-symbol").val("");
        points_show.push({
            values: [],
            key: symbol
        });

        $("#stock-list").append(
            "<a class='stock-label list-group-item small'>" + symbol + "</a>"
        );

        console.log(points_show);
    });

    $("#show-result-button").click(function () {
        gotoTheNewPage_onclick();
    });

    function gotoTheNewPage_onclick()
    {
        location.href = "http://localhost:3000/result.html";
    }

    function getSymbolIndex(symbol, array) {
        "use strict";
        for (var i = 0; i < array.length; i++) {
            if (array[i].key == symbol) {
                return i;
            }
        }
        return -1;
    }

    var chart = nv.models.lineChart()
        .interpolate('monotone')
        .margin({
            bottom: 100
        })
        .useInteractiveGuideline(true)
        .showLegend(true)
        .color(d3.scale.category10().range());

    chart.xAxis
        .axisLabel('Time')
        .tickFormat(formatDateTick);

    chart.yAxis
        .axisLabel('Price');

    nv.addGraph(loadGraph);

    function loadGraph() {
        "use strict";
        d3.select('#chart svg')
            .datum(points_show)
            .transition()
            .duration(5)
            .call(chart);

        nv.utils.windowResize(chart.update);
        return chart;
    }

    function newDataCallback(message) {
        "use strict";
        var parsed = JSON.parse(message);
        var timestamp = parsed['timestamp'];
        var average = parsed['average'];
        var symbol = parsed['symbol'];
        var coefficient = parsed['coefficient'];
        var b = parsed['b'];
        var prediction = parsed['prediction'];
        var point = {};
        point.x = timestamp;
        point.y = average;

        console.log(point);

        var i = getSymbolIndex(symbol, points_show);

        points_show[i].values.push(point);
        if (points_show[i].length > 100) {
            points_show[i].values.shift();
        }
        loadGraph();
    }

    function formatDateTick(time) {
        "use strict";
        var date = new Date(time * 1000);
        return d3.time.format('%H:%M:%S')(date);
    }

    var socket = io();

    // - Whenever the server emits 'data', update the flow graph
    socket.on('data', function (data) {
        newDataCallback(data);
    });
});