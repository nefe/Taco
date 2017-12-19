/**
 * 散点图，将所有的数据以点的形式展现在笛卡尔坐标系上。可以通过x轴，y轴，透明度，圆大小来展示4个维度的数据。
 * 我们可以推断出变量间的相关性。
 */
import { getElementContentWidth, floatTwo } from "src/charts/utils";
import { makePath, makeXLine, makeYLine, createSVG } from "src/charts/utils/draw";
import { offset } from "src/charts/utils/dom";
import Tooltip from 'src/charts/utils/Tooltip';

const DEFAULT_HEIGHT = 240;

/**
 * 根据最大最小值确定分度，原来代码这部分做得太啰嗦
 * 问题抽象，在已知最大值与最小值的情况下，不限制间隔与数量的情况下，如何让坐标轴刻度尽可能美观
 * G2 实现也很啰嗦 https://github.com/antvis/g2/blob/724872cee56d7e731b1d945444b7b10d4d0ef2e8/src/scale/auto/number.js
 * 想到一个 简单方法，最大值 - 最小值差值 / 4 向上取整数量级
 * @param maxValue
 * @param minValue
 */
function calcIntervals(maxValue: number, minValue: number): number[] {
  const ticks = [];
  // 始终以 0 为基准，
  const diff = minValue > 0 ? maxValue : maxValue - minValue;
  const initInterval = diff / 5;
  const exp = Math.floor(Math.log10(initInterval));
  const finalInterval = Math.ceil(initInterval / Math.pow(10, exp)) * Math.pow(10, exp);

  let downCount = 0;
  while (0 - downCount * finalInterval >= minValue) {
    ticks.unshift(0 - downCount * finalInterval);
    downCount++;
  }
  if (minValue <= 0) {
    ticks.unshift(0 - downCount * finalInterval);
  }
  let upCount = 0;
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
/** 传一组数组直接返回恰当的分隔点 */
function calcIntervalsOfArray(data: number[]): number[] {
  const max = Math.max(...data);
  const min = Math.min(...data);

  return calcIntervals(max, min);
}

// console.log(calcIntervals(100, 1));
// console.log(calcIntervals(-100, -1000));

interface Data {
  datasets: Array<{
    title: string,
    values: number[],
  }>,
}

interface ScatterConfig {
  /** 外部容器 */
  parent: string | HTMLElement;
  /** 图表高度 */
  height?: number;
  /** 模式，依次对应 x轴，y轴，透明度，圆大小 */
  pattern: string[];
  /** 图表数据 */
  data?: Data;
}

class XAxis {
  /** 分度值 */
  ticks: number[];
}

class YAxis {
  /** 分度值 */
  ticks: number[];
}

class ScatterChart {
  /** 用户数据 */
  data: Data;
  /** 用户配置 */
  config: ScatterConfig;
  parent: HTMLElement;

  width: number;
  height: number;

  xAxis = new XAxis();
  yAxis = new YAxis();

  chartContent: SVGElement;
  tooltip: Tooltip;
  transformedData: any[] = [];

  constructor(config: ScatterConfig) {
    this.config = config;
    this.data = this.config.data;
    this.calculate();
    this.render();
    this.tooltip = new Tooltip(this.parent);
    this.bindTooltips();
  }

  /** listen to mouse event to show tooltip */
  bindTooltips() {
    this.parent.addEventListener('mousemove', this.mouseMove.bind(this));
    this.parent.addEventListener('mouseleave', this.mouseLeave.bind(this));
  }

  mouseMove(e: MouseEvent) {
    let o = offset(this.parent);
    let relX = e.pageX - o.left;
    let relY = e.pageY - o.top;
    const nearestIndex = this.findNearestIndex(relX, relY);
    const nearest = this.transformedData[nearestIndex];
    const pattern = this.config.pattern;
    const values = [
      { label: pattern[0], value: nearest[pattern[0]]},
      { label: pattern[1], value: nearest[pattern[1]]},
      { label: pattern[2], value: nearest[pattern[2]], color: `rgba(255, 0, 0, ${nearest.zPercent})`},
    ]
    this.tooltip.update(nearest.xPos - 8, nearest.yPos - 4, `第${nearestIndex + 1}个元素`, values);
  }

  mouseLeave() {
    this.tooltip.hide();
  }

  findNearestIndex(x: number, y: number) {
    x = x - 35;
    y = y - 7;
    const distanceSquares = this.transformedData.map(entry => {
      return (entry.xPos - x) * (entry.xPos - x) + (entry.yPos - y) * (entry.yPos - y);
    });
    return distanceSquares.indexOf(Math.min(...distanceSquares));
  }

  /**
   * 计算模块
   */
  calculate() {
    this.getSize();
    this.getAxis();
  }

  /**
   * 设置图表大小，可抽象为 Base
   */
  getSize() {
    if (typeof this.config.parent === 'string') {
      this.parent = document.querySelector(this.config.parent);
    } else {
      this.parent = this.config.parent;
    }
    this.width = getElementContentWidth(this.parent);
    this.height = DEFAULT_HEIGHT;
  }

  /**
   * 设置坐标轴大小，可抽象为 Axis
   */
  getAxis() {
    // y 轴
    this.xAxis.ticks = calcIntervalsOfArray(this.data.datasets[0].values);
    this.yAxis.ticks = calcIntervalsOfArray(this.data.datasets[1].values);
  }

  /**
   * 渲染模块
   */
  render() {
    // 添加画布
    const svg = createSVG('svg', {
      className: 'chart',
      fill: 'none',
      width: this.width,
      height: this.height,
    });
    this.chartContent = createSVG('g', {
      className: 'scatter-chart',
      transform: 'translate(40, 10)',
      inside: svg
    });

    const contentWidth = this.width - 40;
    const contentHeight = this.height - 20;

    // 开始画X坐标轴
    const xAxisGroup = createSVG('g', {
      className: 'x axis',
      transform: `translate(0, -7)`,
      inside: this.chartContent
    });
    this.xAxis.ticks.forEach((val: number, index: number) => {
      const xPosUnit = (contentWidth - 30) / (this.xAxis.ticks.length - 1)

      const xLine = makeXLine(contentHeight - 20, contentHeight - 10, val, index * xPosUnit);
      xAxisGroup.appendChild(xLine);
    });

    // 开始画Y坐标轴
    const yAxisGroup = createSVG('g', {
      className: 'y axis',
      inside: this.chartContent
    });
    this.yAxis.ticks.forEach((val: number, index: number) => {
      const yPosUnit = (contentHeight - 35) / (this.yAxis.ticks.length - 1)
      const yLine = makeYLine(-7, contentWidth - 25, -10, val, yPosUnit * (this.yAxis.ticks.length - index - 1));
      yAxisGroup.appendChild(yLine);
    });

    // 转换数据为易处理的格式
    const transformedData: any[] = [];
    this.data.datasets.forEach(o => {
      o.values.forEach((entry, index) => {
        if (transformedData[index] == null) { transformedData[index] = {};}
        transformedData[index][o.title] = entry;
        const max = Math.max(...o.values);
        // const percent = max > min ? (entry - min) / (max - min) : 0;
        // const percent = entry / max;

        const width = contentWidth - 30;
        const height = contentHeight - 35;
        // 得到数据的比例
        const dataType = this.config.pattern.indexOf(o.title);
        if (dataType === 0) {
          transformedData[index].xPercent = entry / this.xAxis.ticks[this.xAxis.ticks.length - 1];
          transformedData[index].xPos = transformedData[index].xPercent * width;
        } else if (dataType === 1) {
          transformedData[index].yPercent = entry / this.yAxis.ticks[this.yAxis.ticks.length - 1];
          transformedData[index].yPos = transformedData[index].yPercent * height;
        } else {
          transformedData[index].zPercent = entry / max;
        }
      })
    });
    this.transformedData = transformedData;

    // 画散点图中的数据点
    const dataPoints = createSVG('g', {
      className: 'data-points',
      inside: this.chartContent
    });
    const pattern = this.config.pattern;
    transformedData.forEach(data => {
      const circle = createSVG('circle', {
        cx: data.xPos,
        cy: data.yPos,
        r: 5,
        fill: 'red',
        opacity: data.zPercent,
      });
      dataPoints.appendChild(circle);
    })

    this.parent.appendChild(svg);
  }
}

export default ScatterChart;
