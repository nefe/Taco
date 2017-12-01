(function () {
'use strict';

function __extends(d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var BaseChart = (function () {
    function BaseChart(args) {
        this.initContainer();
    }
    BaseChart.prototype.initContainer = function () {
        console.log('init BaseChart');
    };
    return BaseChart;
}());

var Line = (function (_super) {
    __extends(Line, _super);
    function Line(args) {
        var _this = _super.call(this, args) || this;
        _this.init();
        return _this;
    }
    Line.prototype.init = function () {
        console.log('line');
    };
    return Line;
}(BaseChart));

var Scatter = (function (_super) {
    __extends(Scatter, _super);
    function Scatter(args) {
        var _this = _super.call(this, args) || this;
        _this.init();
        return _this;
    }
    Scatter.prototype.init = function () {
        console.log('Scatter');
    };
    return Scatter;
}(BaseChart));

var Chart = (function () {
    function Chart(args) {
        switch (args.type) {
            case 'line': {
                return new Line(args);
            }
            case 'scatter': {
                return new Scatter(args);
            }
            default:
                return new Line(args);
        }
    }
    return Chart;
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
        }
    ]
};
var chart = new Chart({
    parent: 'line',
    title: 'My Chart',
    data: data,
    type: 'line',
    height: 250,
    colors: ['#7cd6fd', '#743ee2']
});

}());
//# sourceMappingURL=bundle.js.map
