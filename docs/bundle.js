(function () {
'use strict';

const __assign = Object.assign || function (target) {
    for (var source, i = 1; i < arguments.length; i++) {
        source = arguments[i];
        for (var prop in source) {
            if (Object.prototype.hasOwnProperty.call(source, prop)) {
                target[prop] = source[prop];
            }
        }
    }
    return target;
};

function __extends(d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var EASING = {
    ease: "0.25 0.1 0.25 1",
    linear: "0 0 1 1",
    easein: "0.1 0.8 0.2 1",
    easeout: "0 0 0.58 1",
    easeinout: "0.42 0 0.58 1"
};
function createSVG(tag, options) {
    var element = document.createElementNS("http://www.w3.org/2000/svg", tag);
    var _loop_1 = function (key) {
        if (options.hasOwnProperty(key)) {
            var val_1 = options[key];
            if (key === "parent") {
                val_1.appendChild(element);
            }
            else if (key === "styles") {
                if (typeof val_1 === "object") {
                    Object.keys(val_1).map(function (prop) {
                        element.style[prop] = val_1[prop];
                    });
                }
            }
            else {
                if (key === "className") {
                    key = "class";
                }
                else if (key === "innerHTML") {
                    element["textContent"] = val_1;
                }
                element.setAttribute(key, val_1);
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
    if (lineType === void 0) { lineType = ""; }
    var line = createSVG("line", {
        className: lineType === "dashed" ? "dashed" : "",
        x1: startAt,
        x2: width,
        y1: 0,
        y2: 0,
        stroke: "#dadada"
    });
    var text = createSVG("text", {
        className: "y-axis-text",
        x: textEndAt,
        y: 0,
        dy: ".32em",
        innerHTML: point + ""
    });
    var yLine = createSVG("g", {
        className: "tick y-axis-label",
        transform: "translate(0, " + yPos + ")",
        "stroke-opacity": 1
    });
    if (darker) {
        line.style.stroke = "rgba(27, 31, 35, 0.6)";
    }
    yLine.appendChild(line);
    yLine.appendChild(text);
    return yLine;
}
function makeXLine(height, textStartAt, point, xPos) {
    var line = createSVG("line", {
        x1: 0,
        x2: 0,
        y1: 0,
        y2: height,
        stroke: "#dadada"
    });
    var text = createSVG("text", {
        className: "y-axis-text",
        x: 0,
        y: textStartAt,
        dy: ".71em",
        innerHTML: point
    });
    var xLine = createSVG("g", {
        className: "tick x-axis-label",
        transform: "translate(" + xPos + ", 0)"
    });
    xLine.appendChild(line);
    xLine.appendChild(text);
    return xLine;
}
function makePath(pathStr, className, stroke, fill) {
    if (className === void 0) { className = ""; }
    if (stroke === void 0) { stroke = "none"; }
    if (fill === void 0) { fill = "none"; }
    return createSVG("path", {
        className: className,
        d: pathStr,
        styles: {
            stroke: stroke,
            fill: fill
        }
    });
}
function creatSVGAnimate(options) {
    var parent = options.parent, old = options.old, dur = options.dur;
    for (var attributeName in options.new) {
        var to = options.new[attributeName];
        var from = old[attributeName];
        var animAttr = {
            parent: parent,
            attributeName: attributeName,
            from: from,
            to: to,
            begin: "0s",
            dur: dur / 1000 + "s",
            values: from + ";" + to,
            keySplines: EASING.ease,
            keyTimes: "0;1",
            calcMode: "spline",
            fill: "freeze"
        };
        createSVG("animate", animAttr);
    }
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
            parent: this.chartWrapper,
            width: this.chartWidth,
            height: this.chartHeight
        });
        this.svgDefs = createSVG('defs', {
            parent: this.svg,
        });
    };
    BaseChart.prototype.initDrawArea = function () {
        this.drawArea = createSVG('g', {
            className: this.type + "-chart",
            parent: this.svg,
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
        _this.drawWidth = _this.svg.getBoundingClientRect().width - (_this.translateX);
        _this.initAxisContainer();
        _this.createYAxis();
        _this.creteXAxis();
        return _this;
    }
    AxisChart.prototype.initAxisContainer = function () {
        this.xAxisContainer = createSVG('g', {
            parent: this.drawArea,
            className: 'x axis',
        });
        this.yAxisContainer = createSVG('g', {
            parent: this.drawArea,
            className: 'y axis'
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
        this.yInterval = this.drawWidth / (this.labels.length - 1);
        var textEndAt = -30;
        var width = this.chartWidth - this.translateX - 15;
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
        this.xInterval = (this.drawWidth + 60) / (this.labels.length);
        this.labels.forEach(function (label, index) {
            var xPos = _this.xInterval * (index) + 15;
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

var Tooltip = (function () {
    function Tooltip(parentNode) {
        this.domNode = document.createElement('div');
        this.domNode.className = "svg-tip";
        if (parentNode) {
            parentNode.appendChild(this.domNode);
        }
        else {
            throw Error("Error: parentNode does not exist.");
        }
    }
    Tooltip.prototype.update = function (left, top, title, values, position) {
        if (position === void 0) { position = 'top'; }
        if (!this.domNode.classList.contains(position)) {
            this.domNode.classList.add(position);
        }
        var valueTpls = values.map(function (item) {
            return "<tr>\n        <td>" + item.label + "</td>\n        <td class=\"number\"><i class=\"color-icon\" style=\"background-color: " + item.color + "\"></i>" + item.value + "</td>\n      </tr>";
        });
        this.domNode.innerHTML = "\n    <div>\n      <span class=\"title\">" + title + "</span>\n      <table class=\"data-list\"></table>\n    </div>\n    ";
        this.domNode.style.top = top + "px";
        this.domNode.style.left = left + "px";
        this.domNode.style.display = 'block';
        this.domNode.querySelector('.data-list').innerHTML = valueTpls.join('');
    };
    Tooltip.prototype.hide = function () {
        this.domNode.style.display = 'none';
        this.domNode.style.top = '0';
        this.domNode.style.left = '0';
    };
    Tooltip.prototype.destroy = function () {
        if (this.parentNode) {
            this.parentNode.removeChild(this.domNode);
        }
    };
    return Tooltip;
}());

var LineToolTip = (function () {
    function LineToolTip(_a) {
        var parent = _a.parent, drawArea = _a.drawArea, chartWrapper = _a.chartWrapper, xPositons = _a.xPositons, xInterval = _a.xInterval, labels = _a.labels, datasets = _a.datasets, getYPosition = _a.getYPosition, translateX = _a.translateX, colors = _a.colors;
        this.parent = parent;
        this.chartWrapper = chartWrapper;
        this.drawArea = drawArea;
        this.xPositons = xPositons;
        this.xInterval = xInterval;
        this.labels = labels;
        this.datasets = datasets;
        this.getYPosition = getYPosition;
        this.translateX = translateX;
        this.colors = colors;
        this.tooltip = new Tooltip(this.parent);
        this.addTooltipEvents();
    }
    LineToolTip.prototype.calcOffset = function () {
        var rect = this.drawArea.getBoundingClientRect();
        var left = rect.left + (document.documentElement.scrollLeft || document.body.scrollLeft);
        return {
            left: left,
            width: rect.width
        };
    };
    LineToolTip.prototype.addTooltipEvents = function () {
        var _this = this;
        this.chartWrapper.addEventListener('mousemove', function (event) {
            var offset = _this.calcOffset();
            var relX = event.pageX - offset.left;
            _this.changeTooltip(relX);
        });
        this.parent.addEventListener('mouseleave', function () {
            _this.tooltip.hide();
        });
    };
    LineToolTip.prototype.changeTooltip = function (relX) {
        var activeIndex = Math.floor(relX / this.xInterval);
        var _a = this.getValues(activeIndex), label = _a.label, values = _a.values;
        var x = Number(this.xPositons[activeIndex]);
        var y = this.getYPosition([values[0].value])[0];
        this.tooltip.update(x + 2, y + 30, label, values);
    };
    LineToolTip.prototype.getValues = function (activeIndex) {
        var _this = this;
        var label = this.labels[activeIndex];
        var values = this.datasets.map(function (dataset, index) {
            return {
                label: dataset.title,
                value: dataset.values[activeIndex],
                color: _this.colors[index]
            };
        }).sort(function (aDataset, bDataset) {
            return bDataset.value - aDataset.value;
        });
        return {
            label: label,
            values: values
        };
    };
    return LineToolTip;
}());

var Line = (function (_super) {
    __extends(Line, _super);
    function Line(args) {
        var _this = _super.call(this, args) || this;
        _this.getYPosition = function (values) {
            var maxYValue = Math.max.apply(Math, _this.yValues);
            var minYValue = Math.min.apply(Math, _this.yValues);
            var maxYPosition = Math.max.apply(Math, _this.yPositions);
            var minYPosition = Math.min.apply(Math, _this.yPositions);
            var yInterval = (maxYPosition - minYPosition) / (maxYValue - minYValue);
            return values.map(function (value) {
                return minYPosition + ((maxYValue - value) * yInterval);
            });
        };
        _this.init();
        return _this;
    }
    Line.prototype.init = function () {
        this.initPathGroup();
        this.tooltip = new LineToolTip({
            parent: this.parent,
            xPositons: this.xPositons,
            chartWrapper: this.chartWrapper,
            drawArea: this.drawArea,
            xInterval: this.xInterval,
            labels: this.labels,
            datasets: this.datasets,
            getYPosition: this.getYPosition,
            translateX: this.translateX,
            colors: this.options.colors
        });
    };
    Line.prototype.initPathGroup = function () {
        var _this = this;
        this.datasets.map(function (dataset, index) {
            var color = dataset.color || _this.args.colors[index % _this.args.colors.length];
            var grouSvg = createSVG('g', {
                parent: _this.drawArea,
                className: "path-group path-group-" + index,
            });
            var linePath = _this.getLinePath(dataset.values, color);
            grouSvg.appendChild(linePath);
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
            if (key === 'parent') {
                $.select(value).appendChild(element);
            }
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
            if (key === "parent") {
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
function offset(element) {
    var rect = element.getBoundingClientRect();
    return {
        top: rect.top + (document.documentElement.scrollTop || document.body.scrollTop),
        left: rect.left + (document.documentElement.scrollLeft || document.body.scrollLeft)
    };
}
//# sourceMappingURL=utils.js.map

var ToolTip = (function () {
    function ToolTip(option) {
        this.parent = option.parent;
        this.makeTooltip();
    }
    ToolTip.prototype.makeTooltip = function () {
        var _this = this;
        this.container = $.create('div', {
            parent: this.parent,
            className: 'graph-svg-tip comparison',
            innerHTML: "<div className=\"graph-svg-tip-content\">\n        <span class=\"title\"></span>\n        <ul class=\"data-point-list\"></ul>\n      </div>"
        });
        this.title = this.container.querySelector('.title');
        this.data_point_list = this.container.querySelector('.data-point-list');
        this.parent.addEventListener('mouseleave', function () {
            _this.hideTip();
        });
        this.hideTip();
    };
    ToolTip.prototype.render = function () {
        var _this = this;
        this.title.innerHTML = "<strong>" + this.xValue + "</strong>";
        this.clearTooltip();
        this.yValue.forEach(function (y, i) {
            var value = y.value, title = y.title;
            var li = $.create('li', {
                innerHTML: "<strong style=\"display: block;\">" + value + "</strong>" + title
            });
            _this.data_point_list.appendChild(li);
        });
        var width = this.container.offsetWidth;
        var height = this.container.offsetHeight;
        this.x = this.point.x - width / 2;
        this.y = this.point.y - height;
        this.showTip();
    };
    ToolTip.prototype.clearTooltip = function () {
        this.data_point_list.innerHTML = '';
    };
    ToolTip.prototype.showTip = function () {
        this.container.style.top = this.y + 'px';
        this.container.style.left = this.x + 'px';
        this.container.style.opacity = '1';
    };
    ToolTip.prototype.hideTip = function () {
        this.container.style.top = '0px';
        this.container.style.left = '0px';
        this.container.style.opacity = '0';
    };
    ToolTip.prototype.setValues = function (xValue, yValue, point) {
        this.xValue = xValue;
        this.yValue = yValue;
        this.point = point;
        this.render();
    };
    return ToolTip;
}());

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
        var _this = this;
        this.xAxis = new XAxis();
        this.yAxis = new YAxis();
        this.config = config;
        this.calculate();
        this.render();
        window.addEventListener('resize', function () {
            _this.calculate();
            _this.render();
        });
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
        this.renderTooltip();
    };
    BarChart.prototype.update = function (data) {
        this.config.data = data;
        this.calculate();
        this.render();
    };
    BarChart.prototype.renderTooltip = function () {
        this.tooltip = new ToolTip({
            parent: this.chartWrapper,
        });
        this.bindTooltip();
    };
    BarChart.prototype.bindTooltip = function () {
        var _this = this;
        this.chartWrapper.addEventListener('mousemove', function (event) {
            var _a = offset(_this.chartWrapper), left = _a.left, top = _a.top;
            var pageX = event.pageX, pageY = event.pageY;
            var padding = _this.xAxis.height;
            var realY = pageY - top;
            var realX = pageX - left;
            if (realY < _this.height - padding && realX >= _this.xAxis.padding && realX < _this.width - _this.xAxis.padding) {
                var barIndex_1 = Math.floor((realX - _this.xAxis.padding) / _this.xAxis.unitWidth);
                var xValue = _this.data.labels[barIndex_1];
                var yValue = _this.data.datasets.map(function (dataset) {
                    return {
                        title: dataset.title,
                        value: dataset.values[barIndex_1],
                    };
                });
                var x = _this.xAxis.unitList[barIndex_1].centerPos;
                var y = _this.dataPos.reduce(function (pre, pos) {
                    if (pre > pos[barIndex_1].y) {
                        return pos[barIndex_1].y;
                    }
                    return pre;
                }, Number.MAX_SAFE_INTEGER) - 4;
                _this.tooltip.setValues(xValue, yValue, { x: x, y: y });
            }
            else {
                _this.tooltip.hideTip();
            }
        });
    };
    BarChart.prototype.getSize = function () {
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
        this.oldDataPos = (this.dataPos || []).map(function (data) { return data; });
        var defaultOldValue = {
            y: this.yAxis.zeroPos !== undefined ?
                this.yAxis.zeroPos : this.yAxis.unitList[this.yAxis.unitList.length - 1].pos,
            height: 0,
        };
        this.dataPos = this.data.datasets.map(function (dataset, index) {
            var values = dataset.values;
            var isExistIndex = _this.oldDataPos.length > index;
            return values.map(function (value, i) {
                var _a = _this.xAxis.unitList[i], barWidth = _a.barWidth, startBarPos = _a.startBarPos;
                var x = startBarPos + barWidth * index;
                var height = Math.abs(value) * _this.yAxis.valueInterval;
                var isExistI = isExistIndex && _this.oldDataPos[index].length > i;
                var oldValue = isExistIndex && isExistI ? _this.oldDataPos[index][i] : defaultOldValue;
                if (value < 0) {
                    return {
                        value: value,
                        x: x,
                        y: _this.yAxis.zeroPos,
                        width: barWidth,
                        height: height,
                        oldValue: oldValue,
                    };
                }
                return {
                    value: value,
                    x: x,
                    y: _this.yAxis.zeroPos - height,
                    width: barWidth,
                    height: height,
                    oldValue: oldValue,
                };
            });
        });
        console.log(this.dataPos);
    };
    BarChart.prototype.renderContainer = function () {
        this.container = $.create('div', {
            className: 'chart-container',
            innerHTML: "<div class=\"frappe-chart graphics\"></div>",
        });
        this.clearContainer();
        this.parent.appendChild(this.container);
        this.chartWrapper = this.container.querySelector('.frappe-chart');
        this.svg = $.createSVG('svg', {
            className: 'chart',
            parent: this.chartWrapper,
            width: this.width,
            height: this.height,
        });
    };
    BarChart.prototype.clearContainer = function () {
        this.parent.innerHTML = '';
    };
    BarChart.prototype.renderAxis = function () {
        var _this = this;
        this.yAxisGroup = $.createSVG('g', {
            className: 'y-axis',
            parent: this.svg,
        });
        this.yAxis.unitList.forEach(function (unit, index) {
            var pos = unit.pos, text = unit.text;
            var yAxisTick = $.createSVG('g', {
                className: 'y-axis-tick',
                parent: _this.yAxisGroup,
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
            parent: this.svg,
            transform: "translate(0, " + (this.height - this.xAxis.height) + ")",
        });
        this.xAxis.unitList.forEach(function (unit, index) {
            var centerPos = unit.centerPos, text = unit.text;
            var xAxisTick = $.createSVG('g', {
                className: 'x-axis-tick',
                parent: _this.xAxisGroup,
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
                parent: _this.svg,
            });
            data.forEach(function (pos) {
                var value = pos.value, x = pos.x, y = pos.y, width = pos.width, height = pos.height, oldValue = pos.oldValue;
                var dataRect = $.createSVG('rect', {
                    className: 'bar',
                    x: x,
                    y: y,
                    width: width,
                    height: height,
                    fill: color,
                });
                var dataAniamteRect = $.createSVG('rect', {
                    className: 'bar',
                    x: x,
                    y: y,
                    width: width,
                    height: height,
                    fill: color,
                });
                dataG.appendChild(dataRect);
                creatSVGAnimate({
                    parent: dataRect,
                    dur: 1000,
                    new: {
                        y: pos.y,
                        height: pos.height,
                    },
                    old: {
                        y: oldValue.y,
                        height: oldValue.height,
                    }
                });
            });
        });
    };
    return BarChart;
}());

function offset$1(element) {
    var rect = element.getBoundingClientRect();
    return {
        top: rect.top +
            (document.documentElement.scrollTop || document.body.scrollTop),
        left: rect.left +
            (document.documentElement.scrollLeft || document.body.scrollLeft)
    };
}

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
        this.transformedData = [];
        this.config = config;
        this.data = this.config.data;
        this.calculate();
        this.render();
        this.tooltip = new Tooltip(this.parent);
        this.bindTooltips();
    }
    ScatterChart.prototype.bindTooltips = function () {
        this.parent.addEventListener('mousemove', this.mouseMove.bind(this));
        this.parent.addEventListener('mouseleave', this.mouseLeave.bind(this));
    };
    ScatterChart.prototype.mouseMove = function (e) {
        var o = offset$1(this.parent);
        var relX = e.pageX - o.left;
        var relY = e.pageY - o.top;
        var nearestIndex = this.findNearestIndex(relX, relY);
        var nearest = this.transformedData[nearestIndex];
        var pattern = this.config.pattern;
        var values = [
            { label: pattern[0], value: nearest[pattern[0]] },
            { label: pattern[1], value: nearest[pattern[1]] },
            { label: pattern[2], value: nearest[pattern[2]], color: "rgba(255, 0, 0, " + nearest.zPercent + ")" },
        ];
        this.tooltip.update(nearest.xPos - 8, nearest.yPos - 4, "\u7B2C" + (nearestIndex + 1) + "\u4E2A\u5143\u7D20", values);
    };
    ScatterChart.prototype.mouseLeave = function () {
        this.tooltip.hide();
    };
    ScatterChart.prototype.findNearestIndex = function (x, y) {
        x = x - 35;
        y = y - 7;
        var distanceSquares = this.transformedData.map(function (entry) {
            return (entry.xPos - x) * (entry.xPos - x) + (entry.yPos - y) * (entry.yPos - y);
        });
        return distanceSquares.indexOf(Math.min.apply(Math, distanceSquares));
    };
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
        var svg = createSVG('svg', {
            className: 'chart',
            fill: 'none',
            width: this.width,
            height: this.height,
        });
        this.chartContent = createSVG('g', {
            className: 'scatter-chart',
            transform: 'translate(40, 10)',
            parent: svg
        });
        var contentWidth = this.width - 40;
        var contentHeight = this.height - 20;
        var xAxisGroup = createSVG('g', {
            className: 'x axis',
            transform: "translate(0, -7)",
            parent: this.chartContent
        });
        this.xAxis.ticks.forEach(function (val, index) {
            var xPosUnit = (contentWidth - 30) / (_this.xAxis.ticks.length - 1);
            var xLine = makeXLine(contentHeight - 20, contentHeight - 10, val, index * xPosUnit);
            xAxisGroup.appendChild(xLine);
        });
        var yAxisGroup = createSVG('g', {
            className: 'y axis',
            parent: this.chartContent
        });
        this.yAxis.ticks.forEach(function (val, index) {
            var yPosUnit = (contentHeight - 35) / (_this.yAxis.ticks.length - 1);
            var yLine = makeYLine(-7, contentWidth - 25, -10, val, yPosUnit * (_this.yAxis.ticks.length - index - 1));
            yAxisGroup.appendChild(yLine);
        });
        var transformedData = [];
        this.data.datasets.forEach(function (o) {
            o.values.forEach(function (entry, index) {
                if (transformedData[index] == null) {
                    transformedData[index] = {};
                }
                transformedData[index][o.title] = entry;
                var max = Math.max.apply(Math, o.values);
                var width = contentWidth - 30;
                var height = contentHeight - 35;
                var dataType = _this.config.pattern.indexOf(o.title);
                if (dataType === 0) {
                    transformedData[index].xPercent = entry / _this.xAxis.ticks[_this.xAxis.ticks.length - 1];
                    transformedData[index].xPos = transformedData[index].xPercent * width;
                }
                else if (dataType === 1) {
                    transformedData[index].yPercent = entry / _this.yAxis.ticks[_this.yAxis.ticks.length - 1];
                    transformedData[index].yPos = transformedData[index].yPercent * height;
                }
                else {
                    transformedData[index].zPercent = entry / max;
                }
            });
        });
        this.transformedData = transformedData;
        var dataPoints = createSVG('g', {
            className: 'data-points',
            parent: this.chartContent
        });
        var pattern = this.config.pattern;
        transformedData.forEach(function (data) {
            var circle = createSVG('circle', {
                r: 5,
                fill: 'red',
                opacity: data.zPercent,
            });
            creatSVGAnimate({
                parent: circle,
                dur: 1000,
                new: {
                    cx: data.xPos,
                    cy: data.yPos,
                },
                old: {
                    cx: data.xPos,
                    cy: contentHeight - 20,
                }
            });
            dataPoints.appendChild(circle);
        });
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

var nodeWidth = 20;
var heightPadding = 20;
var SankeyChart = (function () {
    function SankeyChart(config) {
        this.config = config;
        this.parent = config.parent;
        this.width = this.parent.getBoundingClientRect().width;
        this.height = config.height;
        this.initContainer();
        this.initNodes();
        this.initLinks();
    }
    SankeyChart.prototype.initContainer = function () {
        this.parent.innerHTML = "<canvas class=\"sankey-container\" width=" + this.width + " height=" + this.config.height + " />";
        this.canvas = this.parent.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');
    };
    SankeyChart.prototype.initNodes = function () {
        this.calNodes();
        this.drawNodes();
    };
    SankeyChart.prototype.initLinks = function () {
        this.calLinks();
        this.drawLinks();
    };
    SankeyChart.prototype.getMaxValue = function () {
        var maxValue = 0;
        this.config.nodes.forEach(function (nodes) {
            nodes.forEach(function (node) {
                maxValue = Math.max(node.value, maxValue);
            });
        });
        return maxValue;
    };
    SankeyChart.prototype.calNodes = function () {
        var _this = this;
        var xInterval = (this.width - nodeWidth) / (this.config.nodes.length - 1);
        this.nodes = [];
        var maxValue = this.getMaxValue();
        var xNodesLength = this.config.nodes.length;
        this.config.nodes.forEach(function (nodes, xIndex) {
            var x = xIndex * xInterval;
            var heightInterval = (_this.height - heightPadding * 2) / maxValue;
            var yInterval = (_this.height - heightPadding * 2) / nodes.length;
            var yTopPaddingInterval = (_this.height - heightPadding * 2) / xNodesLength;
            var yTopPadding = xIndex === xNodesLength - 1 ? 0 : yTopPaddingInterval * xIndex;
            nodes.forEach(function (node, yIndex) {
                var height = heightInterval * node.value - 40;
                var y = yIndex * yInterval + yTopPadding;
                _this.nodes.push(__assign({}, node, { x: x,
                    y: y,
                    height: height }));
            });
        });
    };
    SankeyChart.prototype.drawNodes = function () {
        var _this = this;
        this.nodes.forEach(function (node, index) {
            var colorIndex = index % _this.config.colors.length;
            _this.ctx.fillStyle = _this.config.colors[colorIndex];
            _this.ctx.fillRect(node.x, node.y, nodeWidth, node.height);
        });
    };
    SankeyChart.prototype.calLinks = function () {
        var _this = this;
        this.links = [];
        var nodes = {};
        this.nodes.forEach(function (oneNode) {
            nodes[oneNode.node] = oneNode;
        });
        var sources = {};
        var targets = {};
        this.config.links.forEach(function (link) {
            var source = nodes[link.source];
            var target = nodes[link.target];
            var sourceHeight = source.height / source.value * link.value;
            var targetHeight = target.height / target.value * link.value;
            var sourceYOffset = 0;
            var targetYOffset = 0;
            if (sources[link.source]) {
                sourceYOffset = sources[link.source].reduce(function (accumulator, currentLink) {
                    return accumulator + currentLink.sourceHeight;
                }, 0);
            }
            if (targets[link.target]) {
                targetYOffset = targets[link.target].reduce(function (accumulator, currentLink) {
                    return accumulator + currentLink.targetHeight;
                }, 0);
            }
            var linkData = __assign({}, link, { x0: source.x + nodeWidth, y0: source.y + sourceYOffset, sourceHeight: sourceHeight,
                targetHeight: targetHeight, x1: target.x, y1: target.y + targetYOffset });
            if (sources[link.source]) {
                sources[link.source].push(linkData);
            }
            else {
                sources[link.source] = [linkData];
            }
            if (targets[link.target]) {
                targets[link.target].push(linkData);
            }
            else {
                targets[link.target] = [linkData];
            }
            _this.links.push(linkData);
        });
    };
    SankeyChart.prototype.interpolateNumber = function (a, b) {
        return (a = +a, b -= a, function (t) {
                return a + b * t;
            });
    };
    SankeyChart.prototype.drawLinks = function () {
        var _this = this;
        this.links.forEach(function (link) {
            var curvature = 0.5;
            var xi = _this.interpolateNumber(link.x0, link.x1);
            var x2 = xi(curvature);
            var x3 = xi(1 - curvature);
            _this.ctx.beginPath();
            _this.ctx.moveTo(link.x0, link.y0);
            _this.ctx.bezierCurveTo(x2, link.y0, x3, link.y1, link.x1, link.y1);
            _this.ctx.lineTo(link.x1, link.y1);
            _this.ctx.lineTo(link.x1, link.y1 + link.targetHeight);
            _this.ctx.bezierCurveTo(x3, link.y1 + link.targetHeight, x2, link.y0 + link.sourceHeight, link.x0, link.y0 + link.sourceHeight);
            _this.ctx.lineTo(link.x0, link.y0 + link.sourceHeight);
            _this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            _this.ctx.fill();
            _this.ctx.closePath();
        });
    };
    return SankeyChart;
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
    title: 'Line Chart',
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
function rnd(start, end) {
    if (start === void 0) { start = -100; }
    if (end === void 0) { end = 100; }
    return Math.floor(Math.random() * (end - start) + start);
}
function getRandomValues() {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function () {
        return rnd();
    });
}
setTimeout(function () {
    chart.update({
        labels: [
            '12am-3am',
            '3am-6pm',
            '6am-9am',
            '9am-12am',
            '12pm-3pm',
            '3pm-6pm',
            '6pm-9pm',
            '9am-12am',
            '14am-16am'
        ],
        datasets: [
            {
                title: 'Some Data',
                values: getRandomValues(),
            },
            {
                title: 'Another Set',
                values: getRandomValues(),
            },
            {
                title: "Yet Another",
                values: getRandomValues(),
            }
        ]
    });
}, 1000);
var scatterData = {
    datasets: [
        {
            title: 'size',
            values: [10, 9, 1, 4, 5, 6, 8]
        },
        {
            title: 'year',
            values: [300, 100, 30, 422, 322, 423, 283]
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
new SankeyChart({
    parent: document.getElementById('sankey-chart'),
    type: 'sankey',
    height: 400,
    colors: ['#7cd6fd', '#743ee2', '#5e64ff', 'yellow', 'red', 'blue', 'pink', 'grey'],
    nodes: [
        [{ "node": 0, "name": "node0", "value": 4 },
            { "node": 1, "name": "node1", "value": 4 }],
        [{ "node": 2, "name": "node2", "value": 4 }],
        [{ "node": 3, "name": "node3", "value": 4 }],
        [{ "node": 4, "name": "node4", "value": 8 }]
    ],
    links: [
        { "source": 0, "target": 2, "value": 2 },
        { "source": 1, "target": 2, "value": 2 },
        { "source": 1, "target": 3, "value": 2 },
        { "source": 0, "target": 4, "value": 2 },
        { "source": 2, "target": 3, "value": 2 },
        { "source": 2, "target": 4, "value": 2 },
        { "source": 3, "target": 4, "value": 4 }
    ]
});
//# sourceMappingURL=demo.js.map

}());
//# sourceMappingURL=bundle.js.map
