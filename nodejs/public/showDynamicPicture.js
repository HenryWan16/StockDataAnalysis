/**
 * Created by henrywan16 on 12/1/16.
 */
$(function () {
    var a = 2;
    var b = 1;
    console.log('a = ' + a, 'b = ' + b);
    var y1 = a + b;
    var y2 = a * 2 + b;
    var y3 = a * 3 + b;
    var y4 = a * 4 + b;
    var y5 = a * 5 + b;
    var y6 = a * 6 + b;
    var y7 = a * 7 + b;
    var y8 = a * 8 + b;
    var y9 = a * 9 + b;
    var y10 = a * 10 + b;
    var y11 = a * 11 + b;
    var y12 = a * 12 + b;

    Highcharts.chart('container2', {
        title: {
            text: 'Stock Analysising Results',
            x: -20 //center
        },
        subtitle: {
            text: 'What is the trend?',
            x: -20
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
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
            valueSuffix: '°C'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: 'Average',
            data: [y1, y2, y3, y4, y5, y6, y7, y8, y9, y10, y11, y12]
        }]
    });
});
/**
 * Created by henrywan16 on 12/6/16.
 */
