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
var $ = {
    select: function (expr, con) {
        return typeof expr === "string" ? (con || document).querySelector(expr) : expr || null;
    },
    create: function (tag, options) {
        var element = document.createElement(tag);
        for (var key in options) {
            var value = options[key];
            if (key in element) {
                element[key] = value;
            }
        }
        return element;
    },
    createSVG: function (tag, options) {
        var element = document.createElementNS("http://www.w3.org/2000/svg", tag);
        for (var key in options) {
            var value = options[key];
            if (key === "className") {
                key = "class";
            }
            if (key === "inside") {
                $.select(value).appendChild(element);
            }
            else if (key === "innerHTML") {
                element['textContent'] = value;
            }
            else {
                element.setAttribute(key, value);
            }
        }
        return element;
    }
};
//# sourceMappingURL=utils.js.map

var DEFAULT_HEIGHT = 240;
function calcIntervals(maxValue, minValue) {
    var ticks = [];
    var diff = minValue > 0 ? maxValue : maxValue - minValue;
    var initInterval = diff / 6;
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
    return ticks.reverse();
}
var XAxis = (function () {
    function XAxis() {
        this.axisHeight = 6;
        this.height = 40;
        this.padding = 80;
        this.unitList = [];
    }
    return XAxis;
}());
var YAxis = (function () {
    function YAxis() {
        this.ticks = [];
        this.unitList = [];
    }
    return YAxis;
}());
var BarChart = (function () {
    function BarChart(config) {
        this.xAxis = new XAxis();
        this.yAxis = new YAxis();
        this.config = config;
        this.calculate();
        this.isExist = true;
        this.render();
    }
    BarChart.prototype.calculate = function () {
        this.getSize();
        this.getAxis();
        this.getValue();
    };
    BarChart.prototype.render = function () {
        this.renderContainer();
        this.renderAxis();
        this.renderValue();
    };
    BarChart.prototype.update = function (data) {
    };
    BarChart.prototype.getSize = function () {
        if (this.isExist)
            return;
        if (typeof this.config.parent === 'string') {
            this.parent = document.querySelector(this.config.parent);
        }
        else {
            this.parent = this.config.parent;
        }
        this.width = getElementContentWidth(this.parent);
        this.height = this.config.height || DEFAULT_HEIGHT;
    };
    BarChart.prototype.getAxis = function () {
        var _this = this;
        this.data = this.config.data;
        this.xAxis.unitWidth = (this.width - this.xAxis.padding * 2) / this.data.labels.length;
        var charWidth = 8;
        var barWidth = this.xAxis.unitWidth * (2 / 3) / (this.data.datasets.length);
        this.xAxis.unitList = this.data.labels.map(function (label, i) {
            var labelWidth = label.length * charWidth;
            var centerPos = floatTwo(i * _this.xAxis.unitWidth + _this.xAxis.padding + _this.xAxis.unitWidth / 2);
            return {
                barWidth: barWidth,
                startBarPos: i * _this.xAxis.unitWidth + _this.xAxis.padding + _this.xAxis.unitWidth * (1 / 3) / 2,
                centerPos: centerPos,
                text: labelWidth > _this.xAxis.unitWidth ? label.slice(0, _this.xAxis.unitWidth / charWidth) + "..." : label,
            };
        });
        var allValues = this.data.datasets.reduce(function (pre, dataset) {
            return pre.concat(dataset.values);
        }, []);
        var maxValue = Math.max.apply(Math, allValues);
        var minValue = Math.min.apply(Math, allValues);
        var padding = this.xAxis.height;
        var oldTicks = this.yAxis.ticks.slice();
        this.yAxis.ticks = calcIntervals(maxValue, minValue);
        var heightInterval = (this.height - padding * 2) / (this.yAxis.ticks.length - 1);
        this.yAxis.valueInterval = (this.height - padding * 2) / (this.yAxis.ticks[0] - this.yAxis.ticks[this.yAxis.ticks.length - 1]);
        var statPosLimit = this.xAxis.padding;
        var maxTick = Math.max(Math.abs(this.yAxis.ticks[0]), Math.abs(this.yAxis.ticks[this.yAxis.ticks.length - 1]));
        var maxTickLength = String(maxTick).length * charWidth;
        this.yAxis.startPos = (statPosLimit < maxTickLength ? statPosLimit : maxTickLength) + 10;
        this.yAxis.endPos = this.width - this.yAxis.startPos * 2;
        this.yAxis.unitList = this.yAxis.ticks.map(function (tick, index) {
            if (tick === 0) {
                _this.yAxis.zeroPos = padding + heightInterval * index;
            }
            return {
                pos: padding + heightInterval * index,
                text: String(tick),
            };
        });
    };
    BarChart.prototype.getValue = function () {
        var _this = this;
        this.dataPos = this.data.datasets.map(function (dataset, index) {
            var values = dataset.values;
            return values.map(function (value, i) {
                var _a = _this.xAxis.unitList[i], barWidth = _a.barWidth, startBarPos = _a.startBarPos;
                var startX = startBarPos + barWidth * index;
                var height = Math.abs(value) * _this.yAxis.valueInterval;
                if (value < 0) {
                    return {
                        value: value,
                        startX: startX,
                        startY: _this.yAxis.zeroPos,
                        width: barWidth,
                        height: height,
                    };
                }
                return {
                    value: value,
                    startX: startX,
                    startY: _this.yAxis.zeroPos - height,
                    width: barWidth,
                    height: height,
                };
            });
        });
    };
    BarChart.prototype.renderContainer = function () {
        this.container = $.create('div', {
            className: 'chart-container',
            innerHTML: "<div class=\"frappe-chart graphics\"></div>",
        });
        this.parent.innerHTML = '';
        this.parent.appendChild(this.container);
        this.chartWrapper = this.container.querySelector('.frappe-chart');
        this.svg = $.createSVG('svg', {
            className: 'chart',
            inside: this.chartWrapper,
            width: this.width,
            height: this.height,
        });
    };
    BarChart.prototype.renderAxis = function () {
        var _this = this;
        this.yAxisGroup = $.createSVG('g', {
            className: 'y-axis',
            inside: this.svg,
        });
        this.yAxis.unitList.forEach(function (unit, index) {
            var pos = unit.pos, text = unit.text;
            var yAxisTick = $.createSVG('g', {
                className: 'y-axis-tick',
                inside: _this.yAxisGroup,
                transform: "translate(0, " + pos + ")",
            });
            var yAxisLine = $.createSVG('line', {
                className: text === '0' ? 'y-axis-line y-axis-line-zero' : 'y-axis-line',
                x1: _this.yAxis.startPos,
                x2: _this.yAxis.endPos,
                y1: 0,
                y2: 0
            });
            var yAxisText = $.createSVG('text', {
                className: 'y-axis-text',
                x: _this.yAxis.startPos - 6,
                y: 0,
                dy: '.32em',
                innerHTML: text,
            });
            yAxisTick.appendChild(yAxisLine);
            yAxisTick.appendChild(yAxisText);
        });
        this.xAxisGroup = $.createSVG('g', {
            className: 'x-axis',
            inside: this.svg,
            transform: "translate(0, " + (this.height - this.xAxis.height) + ")",
        });
        this.xAxis.unitList.forEach(function (unit, index) {
            var centerPos = unit.centerPos, text = unit.text;
            var xAxisTick = $.createSVG('g', {
                className: 'x-axis-tick',
                inside: _this.xAxisGroup,
                transform: "translate(" + centerPos + ", 0)",
            });
            var xAxisLine = $.createSVG('line', {
                className: 'x-axis-line',
                x1: 0,
                x2: 0,
                y1: 0,
                y2: _this.xAxis.axisHeight,
            });
            var xAxisText = $.createSVG('text', {
                className: 'x-axis-text',
                innerHTML: text,
                x: 0,
                dy: '.9em',
                y: _this.xAxis.axisHeight,
            });
            xAxisTick.appendChild(xAxisLine);
            xAxisTick.appendChild(xAxisText);
        });
    };
    BarChart.prototype.renderValue = function () {
        var _this = this;
        this.dataPos.forEach(function (data, index) {
            var color = _this.config.colors[index];
            var dataG = $.createSVG('g', {
                className: 'data-points',
                inside: _this.svg,
            });
            data.forEach(function (pos) {
                var value = pos.value, startX = pos.startX, startY = pos.startY, width = pos.width, height = pos.height;
                var dataRect = $.createSVG('rect', {
                    className: 'bar',
                    x: startX,
                    y: startY,
                    width: width,
                    height: height,
                    fill: color,
                });
                dataG.appendChild(dataRect);
            });
        });
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
    height: 300,
    colors: ['#7cd6fd', '#743ee2', '#5e64ff'],
    data: data,
});
//# sourceMappingURL=demo.js.map

}());
//# sourceMappingURL=bundle.js.map
