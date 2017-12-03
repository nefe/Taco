import { getElementContentWidth, floatTwo } from "src/charts/utils";

/**
 * 分层的解耦思想
 * 数据层 (可以更换算法) -> 渲染层 (可以更换渲染方式)
 * 好处，方便兼容与替换，方便测试
 * 坏处，自制驱动引擎？动画
 */

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

// console.log(calcIntervals(200, 20));
// console.log(calcIntervals(-100, -1000));

interface Data {
  labels: string[],
  datasets: Array<{
    title: string,
    values: number[],
  }>,
}

interface BarChartConfig {
  /** 外部容器 */
  parent: string | Element;
  /** 图表高度 */
  height?: number;
  /** 图表数据 */
  data?: Data;
}

class XAxis {
  /** 单元宽度 */
  unitWidth: number;
  /** 每个单元的起始位置 */
  startPosList: number[];
}

class YAxis {
  /** 分度值 */
  ticks: number[];
}

class BarChart {
  data: Data;
  config: BarChartConfig;
  parent: Element;

  width: number;
  height: number;

  xAxis: XAxis = new XAxis();
  yAxis: YAxis = new YAxis();

  constructor(config: BarChartConfig) {
    this.config = config;
    this.calculate();
    this.render();
  }

  /**
   * 计算模块
   */
  calculate() {
    this.getSize();
    this.getAxis();
  }

  /**
   * 渲染模块
   */
  render() {

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
    this.data = this.config.data;

    // x 轴
    this.xAxis.unitWidth = this.width / this.data.labels.length;
    this.xAxis.startPosList = this.data.labels.map((label, i) => {
      return floatTwo(i * this.xAxis.unitWidth);
    });

    // y 轴
    // 合并所有 y 值，求解最大、最小值
    const allValues = this.data.datasets.reduce((pre, dataset) => {
      return [ ...pre, ...dataset.values ];
    }, []);

    const maxValue = Math.max(...allValues);
    const minValue = Math.min(...allValues);

    this.yAxis.ticks = calcIntervals(maxValue, minValue);
  }
}

export default BarChart;

