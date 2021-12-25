var wxCharts = require('../../../utils/wxcharts.js');
var app = getApp();
var pieChart = null;
Page({
    data: {
    },
    touchHandler: function (e) {
        console.log(444444444)
        console.log(pieChart.getCurrentDataIndex(e));
    },        
    onLoad: function (e) {
        var windowWidth = 320;
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }

        pieChart = new wxCharts({
            animation: true,
            canvasId: 'pieCanvas',
            type: 'pie',
            legend: false,
            background: '#f00',
            series: [{
                name: '成交量1',
                data: 15,
                format: function() {
                  return '成交量-15'
                },
                color: '#f00'
            }, {
                name: '成交量2',
                data: 35,
            }, {
                name: '成交量3',
                data: 78,
            }, {
                name: '成交量4',
                data: 63,
            }, {
                name: '成交量2',
                data: 35,
            }],
            fontSize: '300',
            width: windowWidth,
            height: 300,
            dataLabel: true,
          // disablePieStroke: true,
        });
    }
});