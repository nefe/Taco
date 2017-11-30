(function () {
'use strict';

function getElementContentWidth(element) {
    var styles = window.getComputedStyle(element);
    var padding = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
    return element.clientWidth - padding;
}
function floatTwo(number) {
    return parseFloat(number.toFixed(2));
}
//# sourceMappingURL=utils.js.map

var DEFAULT_HEIGHT = 240;
function calcIntervals(maxValue, minValue) {
    var ticks = [];
    var diff = minValue > 0 ? maxValue : maxValue - minValue;
    var initInterval = diff / 5;
    var exp = Math.floor(Math.log10(initInterval));
    var finalInterval = Math.ceil(initInterval / Math.pow(10, exp)) * Math.pow(10, exp);
    var downCount = 0;
    while (0 - downCount * finalInterval >= minValue) {
        ticks.unshift(0 - downCount * finalInterval);
        downCount++;
    }
    if (minValue <= 0) {
        ticks.unshift(0 - downCount * finalInterval);
    }
    var upCount = 0;
    while (0 + upCount * finalInterval <= maxValue) {
        if (!(ticks[ticks.length - 1] === 0 && 0 + upCount * finalInterval === 0)) {
            ticks.push(0 + upCount * finalInterval);
        }
        upCount++;
    }
    if (maxValue >= 0) {
        ticks.push(0 + upCount * finalInterval);
    }
    return ticks;
}
var XAxis = (function () {
    function XAxis() {
    }
    return XAxis;
}());
var YAxis = (function () {
    function YAxis() {
    }
    return YAxis;
}());
var BarChart = (function () {
    function BarChart(config) {
        this.xAxis = new XAxis();
        this.yAxis = new YAxis();
        this.config = config;
        this.calculate();
        this.render();
    }
    BarChart.prototype.calculate = function () {
        this.getSize();
        this.getAxis();
    };
    BarChart.prototype.render = function () {
    };
    BarChart.prototype.getSize = function () {
        if (typeof this.config.parent === 'string') {
            this.parent = document.querySelector(this.config.parent);
        }
        else {
            this.parent = this.config.parent;
        }
        this.width = getElementContentWidth(this.parent);
        this.height = DEFAULT_HEIGHT;
    };
    BarChart.prototype.getAxis = function () {
        var _this = this;
        this.data = this.config.data;
        this.xAxis.unitWidth = this.width / this.data.labels.length;
        this.xAxis.startPosList = this.data.labels.map(function (label, i) {
            return floatTwo(i * _this.xAxis.unitWidth);
        });
        var allValues = this.data.datasets.reduce(function (pre, dataset) {
            return pre.concat(dataset.values);
        }, []);
        var maxValue = Math.max.apply(Math, allValues);
        var minValue = Math.min.apply(Math, allValues);
        this.yAxis.ticks = calcIntervals(maxValue, minValue);
    };
    return BarChart;
}());

var data = {
    labels: [
        '12am-3am',
        '3am-6pm',
        '6am-9am',
        '9am-12am',
        '12pm-3pm',
        '3pm-6pm',
        '6pm-9pm',
        '9am-12am'
    ],
    datasets: [
        {
            title: 'Some Data',
            values: [25, 40, 30, 35, 8, 52, 17, -4]
        },
        {
            title: 'Another Set',
            values: [25, 50, -10, 15, 18, 32, 27, 14]
        },
        {
            title: "Yet Another",
            values: [15, 20, -3, -15, 58, 12, -17, 37]
        }
    ]
};
var chart = new BarChart({
    parent: document.getElementById('barchart'),
    height: 400,
    data: data,
});
//# sourceMappingURL=demo.js.map

}());
//# sourceMappingURL=bundle.js.map
