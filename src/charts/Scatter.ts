/**
 * 散点图，将所有的数据以点的形式展现在笛卡尔坐标系上。可以通过x轴，y轴，透明度，圆大小来展示4个维度的数据。
 * 我们可以推断出变量间的相关性。
 */
import { getElementContentWidth, floatTwo } from "src/charts/utils";

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
  labels: string[],
  datasets: Array<{
    title: string,
    values: number[],
  }>,
}

interface ScatterConfig {
  /** 外部容器 */
  parent: string | Element;
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
  parent: Element;

  width: number;
  height: number;

  xAxis = new XAxis();
  yAxis = new YAxis();

  constructor(config: ScatterConfig) {
    this.config = config;
    this.data = this.config.data;
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
    // x 轴
    this.xAxis.ticks = calcIntervalsOfArray(this.data.datasets[0].values);
    this.yAxis.ticks = calcIntervalsOfArray(this.data.datasets[1].values);
  }

  /**
   * 渲染模块
   */
  render() {
    console.log('rendering');
    console.log('xAxis', this.xAxis);
    console.log('yAxis', this.yAxis);
    // 开始画坐标轴

  }
}

export default ScatterChart;
