(function () {
'use strict';

function __extends(d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function createSVG(tag, options) {
    var element = document.createElementNS("http://www.w3.org/2000/svg", tag);
    var _loop_1 = function (key) {
        if (options.hasOwnProperty(key)) {
            var val_1 = options[key];
            if (key === 'inside') {
                val_1.appendChild(element);
            }
            else if (key === 'styles') {
                if (typeof val_1 === 'object') {
                    Object.keys(val_1).map(function (prop) {
                        element.style[prop] = val_1[prop];
                    });
                }
            }
            else {
                if (key === 'className') {
                    key = 'class';
                }
                else if (key === 'innerHTML') {
                    element['textContent'] = val_1;
                }
                else {
                    element.setAttribute(key, val_1);
                }
            }
        }
    };
    for (var key in options) {
        _loop_1(key);
    }
    return element;
}
function makeYLine(startAt, width, textEndAt, point, yPos, darker, lineType) {
    if (darker === void 0) { darker = false; }
    if (lineType === void 0) { lineType = ''; }
    var line = createSVG('line', {
        className: lineType === 'dashed' ? 'dashed' : '',
        x1: startAt,
        x2: width,
        y1: 0,
        y2: 0,
        stroke: '#dadada'
    });
    var text = createSVG('text', {
        className: 'y-value-text',
        x: textEndAt,
        y: 0,
        dy: '.32em',
        innerHTML: point + ''
    });
    var yLine = createSVG('g', {
        className: "tick y-axis-label",
        transform: "translate(0, " + yPos + ")",
        'stroke-opacity': 1
    });
    if (darker) {
        line.style.stroke = 'rgba(27, 31, 35, 0.6)';
    }
    yLine.appendChild(line);
    yLine.appendChild(text);
    return yLine;
}
function makeXLine(height, textStartAt, point, xPos) {
    var line = createSVG('line', {
        x1: 0,
        x2: 0,
        y1: 0,
        y2: height,
        stroke: '#dadada'
    });
    var text = createSVG('text', {
        className: 'x-value-text',
        x: 0,
        y: textStartAt,
        dy: '.71em',
        innerHTML: point
    });
    var xLine = createSVG('g', {
        className: "tick x-axis-label",
        transform: "translate(" + xPos + ", 0)"
    });
    xLine.appendChild(line);
    xLine.appendChild(text);
    return xLine;
}
function makePath(pathStr, className, stroke, fill) {
    if (className === void 0) { className = ''; }
    if (stroke === void 0) { stroke = 'none'; }
    if (fill === void 0) { fill = 'none'; }
    return createSVG('path', {
        className: className,
        d: pathStr,
        styles: {
            stroke: stroke,
            fill: fill
        }
    });
}
//# sourceMappingURL=draw.js.map

var BaseChart = (function () {
    function BaseChart(args) {
        this.options = args;
        this.optionsData = args.data;
        this.args = args;
        if (this.options.type !== 'pie') {
            this.setup();
        }
    }
    BaseChart.prototype.setup = function () {
        this.getValues();
        this.setMargins();
        this.initContainer();
        this.initChartArea();
        this.initDrawArea();
    };
    BaseChart.prototype.getValues = function () {
        var _a = this.args, title = _a.title, subTitle = _a.subTitle, parent = _a.parent, height = _a.height, type = _a.type;
        this.title = title || '';
        this.subTitle = subTitle || '';
        this.parent = typeof parent === 'string' ? document.querySelector(parent) : parent;
        this.chartWidth = this.parent.getBoundingClientRect().width;
        this.chartHeight = height;
        this.type = type;
    };
    BaseChart.prototype.initContainer = function () {
        var containerHtml = "<div className=\"chart-container\">\n      <h6 class=\"title\">" + this.title + "</h6>\n      <h6 class=\"sub-title uppercase\">" + this.subTitle + "</h6>\n      <div class=\"taco-chart graphics\"></div>\n    </div>";
        this.parent.innerHTML = containerHtml;
        this.chartWrapper = this.parent.querySelector('.taco-chart');
    };
    BaseChart.prototype.setMargins = function () {
        this.translateX = 60;
        this.translateY = 10;
    };
    BaseChart.prototype.initChartArea = function () {
        this.svg = createSVG('svg', {
            className: 'chart',
            inside: this.chartWrapper,
            width: this.chartWidth,
            height: this.chartHeight
        });
        this.svgDefs = createSVG('defs', {
            inside: this.svg,
        });
    };
    BaseChart.prototype.initDrawArea = function () {
        this.drawArea = createSVG('g', {
            className: this.type + "-chart",
            inside: this.svg,
            transform: "translate(" + this.translateX + ", " + this.translateY + ")"
        });
    };
    return BaseChart;
}());

var Y_AXIS_NUMBER = 6;
var AxisChart = (function (_super) {
    __extends(AxisChart, _super);
    function AxisChart(args) {
        var _this = _super.call(this, args) || this;
        _this.xPositons = [];
        _this.yPositions = [];
        _this.yValues = [];
        var data = args.data;
        _this.labels = data.labels;
        _this.datasets = data.datasets;
        _this.drawHeight = _this.svg.getBoundingClientRect().height - (_this.translateY * 2);
        _this.drawWidth = _this.svg.getBoundingClientRect().width - (_this.translateX * 2);
        _this.initAxisContainer();
        _this.createYAxis();
        _this.creteXAxis();
        return _this;
    }
    AxisChart.prototype.initAxisContainer = function () {
        this.xAxisContainer = createSVG('g', {
            inside: this.drawArea,
            className: 'y axis',
        });
        this.yAxisContainer = createSVG('g', {
            inside: this.drawArea,
            className: 'x axis'
        });
    };
    AxisChart.prototype.getAllYValues = function () {
        var yValues = [];
        this.datasets.forEach(function (dataset) {
            yValues = yValues.concat(dataset.values);
        });
        return yValues;
    };
    AxisChart.prototype.getYAxisValue = function () {
        var yValues = this.getAllYValues();
        var max = Math.max.apply(Math, yValues);
        var min = Math.min.apply(Math, yValues);
        var interval = (max - min) / Y_AXIS_NUMBER + 2;
        var middle = (max + min) / 2;
        var yAxisValues = [];
        for (var i = 0; i < Y_AXIS_NUMBER; i++) {
            var firstValue = middle - interval * 3;
            var value = firstValue + (interval * i);
            yAxisValues.push(value);
        }
        return yAxisValues;
    };
    AxisChart.prototype.drawYAxis = function (value, index, yPos) {
        var startAt = 6;
        var interval = this.drawWidth / (this.labels.length - 1);
        var width = this.chartWidth - interval + 16;
        var textEndAt = -30;
        var yLine = makeYLine(startAt, width, textEndAt, value, yPos);
        this.yAxisContainer.appendChild(yLine);
    };
    AxisChart.prototype.createYAxis = function () {
        var _this = this;
        var yAxisValues = this.getYAxisValue();
        var yPosInterval = this.drawHeight / 6;
        yAxisValues.map(function (value, index) {
            var yPos = _this.drawHeight - 20 - (yPosInterval * index);
            _this.yPositions.push(yPos);
            _this.yValues.push(value);
            _this.drawYAxis(value, index, yPos);
        });
    };
    AxisChart.prototype.creteXAxis = function () {
        var _this = this;
        var interval = this.drawWidth / (this.labels.length - 1);
        this.labels.forEach(function (label, index) {
            var xPos = interval * (index) + 15;
            _this.xPositons.push(xPos);
            _this.dragXAxis(label, xPos);
        });
    };
    AxisChart.prototype.dragXAxis = function (label, xPos) {
        var textStartAt = this.drawHeight - 9;
        var xLine = makeXLine(textStartAt, textStartAt, label, xPos);
        this.xAxisContainer.appendChild(xLine);
    };
    return AxisChart;
}(BaseChart));

var Line = (function (_super) {
    __extends(Line, _super);
    function Line(args) {
        var _this = _super.call(this, args) || this;
        _this.init();
        return _this;
    }
    Line.prototype.init = function () {
        this.initPathGroup();
        console.log('line');
    };
    Line.prototype.initPathGroup = function () {
        var _this = this;
        this.datasets.map(function (dataset, index) {
            var color = dataset.color || _this.args.colors[index % _this.args.colors.length];
            var grouSvg = createSVG('g', {
                inside: _this.drawArea,
                className: "path-group path-group-" + index,
            });
            var linePath = _this.getLinePath(dataset.values, color);
            grouSvg.appendChild(linePath);
        });
    };
    Line.prototype.getYPosition = function (values) {
        var maxYValue = Math.max.apply(Math, this.yValues);
        var minYValue = Math.min.apply(Math, this.yValues);
        var maxYPosition = Math.max.apply(Math, this.yPositions);
        var minYPosition = Math.min.apply(Math, this.yPositions);
        var yInterval = (maxYPosition - minYPosition) / (maxYValue - minYValue);
        return values.map(function (value) {
            return minYPosition + ((maxYValue - value) * yInterval);
        });
    };
    Line.prototype.getLinePath = function (values, color) {
        var _this = this;
        var yPositions = this.getYPosition(values);
        var pointsList = yPositions.map(function (yValue, index) {
            return _this.xPositons[index] + "," + yValue;
        });
        var pointsStr = pointsList.join("L");
        return makePath("M" + pointsStr, 'line-graph-path', color);
    };
    return Line;
}(AxisChart));

var Chart = (function () {
    function Chart(args) {
        switch (args.type) {
            case 'line': {
                return new Line(args);
            }
            case 'bar': 
            case 'pie': 
            default:
                break;
        }
    }
    return Chart;
}());

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

var DEFAULT_HEIGHT$1 = 240;
function calcIntervals$1(maxValue, minValue) {
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
function calcIntervalsOfArray(data) {
    var max = Math.max.apply(Math, data);
    var min = Math.min.apply(Math, data);
    return calcIntervals$1(max, min);
}
var XAxis$1 = (function () {
    function XAxis() {
    }
    return XAxis;
}());
var YAxis$1 = (function () {
    function YAxis() {
    }
    return YAxis;
}());
var ScatterChart = (function () {
    function ScatterChart(config) {
        this.xAxis = new XAxis$1();
        this.yAxis = new YAxis$1();
        this.config = config;
        this.data = this.config.data;
        this.calculate();
        this.render();
    }
    ScatterChart.prototype.calculate = function () {
        this.getSize();
        this.getAxis();
    };
    ScatterChart.prototype.getSize = function () {
        if (typeof this.config.parent === 'string') {
            this.parent = document.querySelector(this.config.parent);
        }
        else {
            this.parent = this.config.parent;
        }
        this.width = getElementContentWidth(this.parent);
        this.height = DEFAULT_HEIGHT$1;
    };
    ScatterChart.prototype.getAxis = function () {
        this.xAxis.ticks = calcIntervalsOfArray(this.data.datasets[0].values);
        this.yAxis.ticks = calcIntervalsOfArray(this.data.datasets[1].values);
    };
    ScatterChart.prototype.render = function () {
        var _this = this;
        console.log('rendering');
        console.log('xAxis', this.xAxis);
        console.log('yAxis', this.yAxis);
        console.log(this.data);
        var transformedData = [];
        this.data.datasets.forEach(function (o) {
            o.values.forEach(function (entry, index) {
                if (transformedData[index] == null) {
                    transformedData[index] = {};
                }
                transformedData[index][o.title] = entry;
                var max = Math.max.apply(Math, o.values);
                var min = Math.min.apply(Math, o.values);
                var percent = max > min ? (entry - min) / (max - min) : 0;
                console.log('max min', min, max, entry, percent);
                transformedData[index][o.title + 'Percent'] = percent;
            });
        });
        var contentWidth = this.width - 60;
        var contentHeight = this.height - 20;
        var xAxisGroup = createSVG('g', {
            className: 'x axis',
            transform: "translate(0, -7)"
        });
        this.xAxis.ticks.forEach(function (val, index) {
            var xPosUnit = (contentWidth - 30) / (_this.xAxis.ticks.length - 1);
            var xLine = makeXLine(contentHeight - 20, contentHeight - 10, val, index * xPosUnit);
            xAxisGroup.appendChild(xLine);
        });
        var yAxisGroup = createSVG('g', {
            className: 'y axis',
        });
        this.yAxis.ticks.forEach(function (val, index) {
            var yPosUnit = (contentHeight - 35) / (_this.yAxis.ticks.length - 1);
            var yLine = makeYLine(-7, contentWidth - 25, -10, val, yPosUnit * (_this.yAxis.ticks.length - index - 1));
            yAxisGroup.appendChild(yLine);
        });
        var dataPoints = createSVG('g', {
            className: 'data-points'
        });
        var pattern = this.config.pattern;
        transformedData.forEach(function (data) {
            var circle = createSVG('circle', {
                cx: data[pattern[0] + 'Percent'] * (contentWidth - 30),
                cy: data[pattern[1] + 'Percent'] * (contentHeight - 35),
                r: 5,
                fill: 'red',
                opacity: data[pattern[2] + 'Percent'],
            });
            dataPoints.appendChild(circle);
        });
        var svg = createSVG('svg', {
            className: 'chart',
            width: this.width,
            height: this.height,
        });
        var chartContent = createSVG('g', {
            className: 'scatter-chart',
            transform: 'translate(60, 10)'
        });
        chartContent.appendChild(xAxisGroup);
        chartContent.appendChild(yAxisGroup);
        chartContent.appendChild(dataPoints);
        svg.appendChild(chartContent);
        this.parent.appendChild(svg);
    };
    return ScatterChart;
}());

var SVG_NS = 'http://www.w3.org/2000/svg';
var Pie = (function (_super) {
    __extends(Pie, _super);
    function Pie(args) {
        var _this = _super.call(this, args) || this;
        _this.beginAngel = 90;
        _this.r = 30;
        _this.width = 300;
        _this.height = 300;
        _this.centerPoint = [150, 150];
        _this.beginAngel = 90;
        _this.r = 100;
        _this.width = 300;
        _this.height = 300;
        _this.init();
        return _this;
    }
    Pie.prototype.init = function () {
        console.log('init Pie');
        var containerEle = this.options.parent;
        var allCount = this.getAllCount();
        var scales = this.getScales(allCount);
        var allPathPoints = this.getAllPathPoints(scales);
        this.render(allPathPoints);
    };
    Pie.prototype.initContainer = function () {
    };
    Pie.prototype.getAllPathPoints = function (scales) {
        var _this = this;
        var allPathPoints = [];
        var y1 = this.r;
        var y2 = this.r;
        var startAngle = this.beginAngel;
        var endangle = this.beginAngel;
        var largeFlag = 0;
        scales.forEach(function (scale, index) {
            endangle = startAngle + scale * Math.PI * 2;
            if (endangle - startAngle > Math.PI)
                largeFlag = 1;
            var x1 = _this.centerPoint[0] + _this.r * Math.sin(startAngle);
            var y1 = _this.centerPoint[1] - _this.r * Math.cos(startAngle);
            var x2 = _this.centerPoint[0] + _this.r * Math.sin(endangle);
            var y2 = _this.centerPoint[1] - _this.r * Math.cos(endangle);
            var hoverDiff = index === 3 ? -15 : 0;
            var path = "M" + (_this.centerPoint[0] + hoverDiff) + " " + (_this.centerPoint[1] + hoverDiff) + "\n      L " + (x1 + hoverDiff) + " " + (y1 + hoverDiff) + "\n      A " + _this.r + " " + _this.r + "\n      0 " + largeFlag + " 1 " + (x2 + hoverDiff) + " " + (y2 + hoverDiff) + "\n      Z";
            startAngle = endangle;
            allPathPoints.push(path);
        });
        return allPathPoints;
    };
    Pie.prototype.getAllCount = function () {
        var values = this.optionsData.datasets[0].values;
        return values.reduce(function (pre, cur) { return pre + cur; });
    };
    Pie.prototype.getScales = function (allCount) {
        var values = this.optionsData.datasets[0].values;
        return values.map(function (v) { return v / allCount; });
    };
    Pie.prototype.renderSector = function (points, index) {
        this.drawPath(points, index);
    };
    Pie.prototype.render = function (allPathPoints) {
        var _this = this;
        this.drawDomContainer();
        allPathPoints.forEach(function (points, index) {
            _this.renderSector(points, index);
        });
        this.options.parent.appendChild(this.chartDom);
    };
    Pie.prototype.drawDomContainer = function () {
        var chart = document.createElementNS(SVG_NS, 'svg:svg');
        chart.setAttribute('width', this.width + '');
        chart.setAttribute('height', this.height + '');
        chart.setAttribute('viewBox', '0 0 ' + this.width + ' ' + this.height);
        this.chartDom = chart;
    };
    Pie.prototype.drawPath = function (points, index) {
        var path = document.createElementNS(SVG_NS, 'path');
        path.setAttribute('d', points);
        path.setAttribute('fill', this.options.colors[index]);
        path.setAttribute('stroke', this.options.colors[index]);
        path.setAttribute('stroke-width', '1');
        this.chartDom.appendChild(path);
    };
    return Pie;
}(BaseChart));

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
            values: [12, 40, 30, 35, 8, 52, 17, -4]
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
var lineChart = new Chart({
    parent: '#line-chart',
    title: 'My Chart',
    data: data,
    type: 'line',
    height: 250,
    colors: ['#7cd6fd', 'violet', 'blue']
});
var chart = new BarChart({
    parent: document.getElementById('barchart'),
    height: 300,
    colors: ['#7cd6fd', '#743ee2', '#5e64ff'],
    data: data,
});
var scatterData = {
    datasets: [
        {
            title: 'size',
            values: [10, 2, 3, 4, 3, 2, 8]
        },
        {
            title: 'year',
            values: [30, 300, 232.23, 422, 322, 423, 283]
        },
        {
            title: "price",
            values: [1000, 5000, 2000, 3000, 3230, 4829, 3990]
        }
    ]
};
new ScatterChart({
    parent: document.getElementById('scatter-chart'),
    height: 250,
    pattern: ['size', 'year', 'price'],
    data: scatterData,
});
new Pie({
    parent: document.getElementById('pie-chart'),
    title: 'My Pie Chart',
    data: data,
    type: 'pie',
    height: 250,
    colors: ['#7cd6fd', '#743ee2', 'red', 'blue', 'pink', 'grey', 'yellow']
});
//# sourceMappingURL=demo.js.map

}());
//# sourceMappingURL=bundle.js.map
