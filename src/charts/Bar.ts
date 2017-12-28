import { getElementContentWidth, floatTwo, $, offset, canvas } from "src/charts/utils";
import { creatSVGAnimate } from 'src/charts/utils/draw';
import Tooltip from './Tooltip';

/**
 * 分层的解耦思想
 * 数据层 (可以更换算法) -> 渲染层 (可以更换渲染方式)
 * 好处，方便兼容与替换，方便测试
 * 坏处，自制驱动引擎？动画
 */

/** 图默认高度 */
const DEFAULT_HEIGHT = 240;

/**
 * 根据最大最小值确定分度，原来代码这部分做得太啰嗦
 * 问题抽象，在已知最大值与最小值的情况下，不限制间隔与数量的情况下，如何让坐标轴刻度尽可能美观
 * G2 实现也很啰嗦 https://github.com/antvis/g2/blob/724872cee56d7e731b1d945444b7b10d4d0ef2e8/src/scale/auto/number.js
 * 想到一个 简单方法，最大值 - 最小值差值 / 6 向上取整数量级
 * @param maxValue
 * @param minValue
 */
function calcIntervals(maxValue: number, minValue: number): number[] {
  const ticks = [];
  // 始终以 0 为基准，
  const diff = minValue > 0 ? maxValue : maxValue - minValue;
  const initInterval = diff / 6;
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

  return ticks.reverse();
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
  /** 颜色数据 */
  colors: string[];
  /** 画布类型 */
  type?: 'svg' | 'canvas';
}

interface XAxisUnit {
  /** 柱状图开始点 */
  startBarPos: number;
  /** bar 宽度 */
  barWidth: number;
  /** 中心点 */
  centerPos: number;
  /** 处理后，超出 unit 区域 ... */
  text: string;
  /** 新-老的差值，中心点 */
  diffCenterPos?: number;
}

class XAxis {
  /** 单元宽度 */
  unitWidth: number;
  /** 轴高度 */
  axisHeight = 6;
  /** x轴高度 */
  height = 40;
  /** 两侧空隙 */
  padding = 80;
  /** 每个单元的位置 */
  unitList: XAxisUnit[] = [];
}

class YAxisUnit {
  /** 处理后，部分太大，科学计数法 */
  text: string;
  /** 竖直位置 */
  pos: number;
  /** 新-老的差值，竖直位置 */
  diffPos?: number;
}

class YAxis {
  /** 分度值List */
  ticks: number[] = [];
  /** 起始位置，与 text 的长短有关 */
  startPos: number;
  /** 结束位置 */
  endPos: number;
  /** 每个单元的位置 */
  unitList: YAxisUnit[] = [];
  /** 零轴位置 */
  zeroPos: number;
  /** 每个长度代表的value */
  valueInterval: number;
}

interface DataPos {
  value: number;
  x: number;
  y: number;
  width: number;
  height: number;
  oldValue?: {
    // x: number;
    y: number;
    // width: number;
    height: number;
  };
}

class BarChart {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  oldDataPos: DataPos[][];
  tooltip: Tooltip;
  xAxisGroup: SVGElement;
  yAxisGroup: SVGElement;
  svg: SVGElement;
  chartWrapper: any;
  container: HTMLElement;
  data: Data;
  config: BarChartConfig;
  parent: Element;
  dataPos: DataPos[][];

  width: number;
  height: number;

  xAxis: XAxis = new XAxis();
  yAxis: YAxis = new YAxis();

  constructor(config: BarChartConfig) {
    this.config = config;
    this.calculate();
    this.render();

    window.addEventListener('resize', () => {
      this.calculate();
      this.render();
    });
  }

  /**
   * 计算模块
   */
  calculate() {
    this.getSize();
    this.getAxis();
    this.getValue();
  }

  renderCanvas(time, allTime) {
    if (time <= allTime) {
      this.renderCanvasContainer();
      this.renderCanvasAxis();
      this.renderCanvasValue(time, allTime);
      this.renderTooltip();

      window.requestAnimationFrame(() => {
        this.renderCanvas(time + 1, allTime);
      });
    }
    return;
  }

  /**
   * 渲染模块
   */
  render() {
    if (this.config.type === 'canvas') {
      // 动画事件，每秒 60 帧
      const dur = 1000;
      const time = dur / 1000 * 60;
      
      window.requestAnimationFrame(() => {
        this.renderCanvas(1, time);
      });
      return;
    }
    this.renderContainer();
    this.renderAxis();
    this.renderValue();
    this.renderTooltip();
  }

  /**
   * 更新模块
   */
  update(data: Data) {
    this.config.data = data;
    this.calculate();
    this.render();
  }

  /**
   * 渲染 Tooltip
   */
  renderTooltip() {
    if (!this.tooltip) {
      this.tooltip = new Tooltip({
        parent: this.chartWrapper,
      });
      this.bindTooltip();
    }
  }

  /**
   * 绑定 ToolTip，整个 x 轴区域
   */
  bindTooltip() {
    this.chartWrapper.addEventListener('mousemove', (event: MouseEvent) => {
      const { left, top } = offset(this.chartWrapper);
      const { pageX, pageY } = event;

      const padding = this.xAxis.height;
      const realY = pageY - top;
      const realX = pageX - left;
      if (realY < this.height - padding && realX >= this.xAxis.padding && realX < this.width - this.xAxis.padding) {
        const barIndex = Math.floor((realX - this.xAxis.padding) / this.xAxis.unitWidth);
        const xValue = this.data.labels[barIndex];
        const yValue = this.data.datasets.map((dataset) => {
          return {
            title: dataset.title,
            value: dataset.values[barIndex],
          };
        });
        const x = this.xAxis.unitList[barIndex].centerPos;
        const y = this.dataPos.reduce((pre, pos) => {
          if (pre > pos[barIndex].y) {
            return pos[barIndex].y;
          }
          return pre;
        }, Number.MAX_SAFE_INTEGER) - 4;
        this.tooltip.setValues(xValue, yValue, { x, y });
      } else {
        this.tooltip.hideTip();
      }
    });
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
    this.height = this.config.height || DEFAULT_HEIGHT;
  }

  /**
   * 设置坐标轴大小，可抽象为 Axis
   */
  getAxis() {
    this.data = this.config.data;

    // x 轴
    this.xAxis.unitWidth = (this.width - this.xAxis.padding * 2) / this.data.labels.length;
    const charWidth = 8;
    const barWidth = this.xAxis.unitWidth * (2 / 3) / (this.data.datasets.length);
    this.xAxis.unitList = this.data.labels.map((label, i) => {
      // 需要考虑 label 过长的情况，获取字符串的长度
      const labelWidth = label.length * charWidth;
      const centerPos = floatTwo(i * this.xAxis.unitWidth + this.xAxis.padding + this.xAxis.unitWidth / 2);
      return {
        barWidth,
        startBarPos: i * this.xAxis.unitWidth + this.xAxis.padding + this.xAxis.unitWidth * (1 / 3) / 2,
        centerPos,
        text: labelWidth > this.xAxis.unitWidth ? `${label.slice(0, this.xAxis.unitWidth / charWidth)}...` : label,
        // 当前存在，则发生偏移，不存在的直接出现
        // diffCenterPos: this.xAxis.unitList.length - 1 > i ? this.xAxis.unitList[i].centerPos - centerPos : 0,
      };
    });

    // y 轴
    // 合并所有 y 值，求解最大、最小值
    const allValues = this.data.datasets.reduce((pre, dataset) => {
      return [ ...pre, ...dataset.values ];
    }, []);

    const maxValue = Math.max(...allValues);
    const minValue = Math.min(...allValues);

    // padding 为 x 轴高度
    const padding = this.xAxis.height;

    const oldTicks = [...this.yAxis.ticks];
    this.yAxis.ticks = calcIntervals(maxValue, minValue);
    const heightInterval = (this.height - padding * 2) / (this.yAxis.ticks.length - 1);
    this.yAxis.valueInterval = (this.height - padding * 2) / (this.yAxis.ticks[0] - this.yAxis.ticks[this.yAxis.ticks.length - 1]);

    // 最大的开始位置
    const statPosLimit = this.xAxis.padding;
    const maxTick = Math.max(Math.abs(this.yAxis.ticks[0]), Math.abs(this.yAxis.ticks[this.yAxis.ticks.length - 1]));
    const maxTickLength = String(maxTick).length * charWidth;
    this.yAxis.startPos = (statPosLimit < maxTickLength ? statPosLimit : maxTickLength) + 10;
    this.yAxis.endPos = this.width - this.yAxis.startPos * 2;

    this.yAxis.unitList = this.yAxis.ticks.map((tick, index) => {
      // @Todo 太长考虑用科学计数法代替
      if (tick === 0) {
        this.yAxis.zeroPos = padding + heightInterval * index;
      }
      return {
        pos: padding + heightInterval * index,
        text: String(tick),
      };
    });
  }

  /** 设置各个值在 x 轴与 y 轴的真实位置 */
  getValue() {
    // 求解动画数据，没有的用上一个最后补齐，上一个没有用 0 补齐
    this.oldDataPos = (this.dataPos || []).map(data => data);
    const defaultOldValue = {
      // x, width 与当前一致
      /** 有零线，没有零线设为最低线 */
      y: this.yAxis.zeroPos !== undefined ?
        this.yAxis.zeroPos : this.yAxis.unitList[this.yAxis.unitList.length - 1].pos,
      height: 0,
    };

    this.dataPos = this.data.datasets.map((dataset, index) => {
      const { values } = dataset;
      const isExistIndex = this.oldDataPos.length > index;
      return values.map((value, i) => {
        const { barWidth, startBarPos } = this.xAxis.unitList[i];
        const x = startBarPos + barWidth * index;
        const height = Math.abs(value) * this.yAxis.valueInterval;
        const isExistI = isExistIndex && this.oldDataPos[index].length > i;
        const oldValue = isExistIndex && isExistI ? this.oldDataPos[index][i] : defaultOldValue;

        if (value < 0) {
          return {
            value,
            x,
            y: this.yAxis.zeroPos,
            width: barWidth,
            height,
            oldValue,
          };
        }
        return {
          value,
          x,
          y: this.yAxis.zeroPos - height,
          width: barWidth,
          height,
          oldValue,
        }
      });
    });
  }

  renderCanvasContainer() {
    // 如果当前 canvas 已存在，改变大小和清空
    if (this.canvas && this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      return;
    }

    this.container = $.create('div', {
      className: 'chart-container',
      innerHTML: `<div class="frappe-chart graphics"></div>`,
    });
    
    this.parent.appendChild(this.container);

    this.chartWrapper = this.container.querySelector('.frappe-chart');

    this.canvas = $.create('canvas', {
      className: 'chart',
      parent: this.chartWrapper,
      width: this.width,
      height: this.height,
    }) as HTMLCanvasElement;

    this.ctx = this.canvas.getContext('2d');
  }

  /** 渲染外容器 */
  renderContainer() {
    this.container = $.create('div', {
      className: 'chart-container',
      innerHTML: `<div class="frappe-chart graphics"></div>`,
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
  }

  clearContainer() {
    this.parent.innerHTML = '';
    this.tooltip = null;
  }

  /** 渲染 Canvas 坐标轴 */
  renderCanvasAxis() {
    this.yAxis.unitList.forEach((unit, index) => {
      const { pos, text } = unit;

      canvas.line(this.ctx, {
        startX: this.yAxis.startPos,
        startY: pos,
        endX: this.yAxis.endPos,
        endY: pos,
        strokeStyle: text === '0' ? 'rgba(27, 31, 35, 0.6)' : '#dadada',
      });

      const textLength = String(text).length * 6;

      canvas.text(this.ctx, {
        x: this.yAxis.startPos - textLength - 8,
        y: pos + 5,
        text,
        fontSize: 11,
      });
    });

    this.xAxis.unitList.forEach((unit, index) => {
      const { centerPos, text } = unit;

      const height = this.height - this.xAxis.height;
      canvas.line(this.ctx, {
        startX: centerPos,
        startY: height,
        endX: centerPos,
        endY: height + this.xAxis.axisHeight,
        strokeStyle: '#dadada',
      });

      const textLength = String(text).length * 6;

      canvas.text(this.ctx, {
        x: centerPos - textLength / 2,
        y: height + this.xAxis.axisHeight + 16,
        text,
        fontSize: 11,
      });
    });
  }

  /** 渲染坐标轴 */
  renderAxis() {
    // 渲染 y 轴坐标
    this.yAxisGroup = $.createSVG('g', {
      className: 'y-axis',
      parent: this.svg,
    });

    this.yAxis.unitList.forEach((unit, index) => {
      const { pos, text } = unit;

      const yAxisTick = $.createSVG('g', {
        className: 'y-axis-tick',
        parent: this.yAxisGroup,
        transform: `translate(0, ${pos})`,
      });

      const yAxisLine = $.createSVG('line', {
        className: text === '0' ? 'y-axis-line y-axis-line-zero' : 'y-axis-line',
        x1: this.yAxis.startPos,
        x2: this.yAxis.endPos,
        y1: 0,
        y2: 0
      });

      const yAxisText = $.createSVG('text', {
        className: 'y-axis-text',
        x: this.yAxis.startPos - 6,
        y: 0,
        dy: '.32em',
        innerHTML: text,
      });

      yAxisTick.appendChild(yAxisLine);
      yAxisTick.appendChild(yAxisText);
    });

    // 渲染 x 轴坐标
    this.xAxisGroup = $.createSVG('g', {
      className: 'x-axis',
      parent: this.svg,
      transform: `translate(0, ${this.height - this.xAxis.height})`,
    });

    this.xAxis.unitList.forEach((unit, index) => {
      const { centerPos, text } = unit;

      const xAxisTick = $.createSVG('g', {
        className: 'x-axis-tick',
        parent: this.xAxisGroup,
        transform: `translate(${centerPos}, 0)`,
      });
      const xAxisLine = $.createSVG('line', {
        className: 'x-axis-line',
        x1: 0,
        x2: 0,
        y1: 0,
        y2: this.xAxis.axisHeight,
      });
      const xAxisText = $.createSVG('text', {
        className: 'x-axis-text',
        innerHTML: text,
        x: 0,
        dy: '.9em',
        y: this.xAxis.axisHeight,
      });

      xAxisTick.appendChild(xAxisLine);
      xAxisTick.appendChild(xAxisText);
    });
  }

  renderCanvasValue(time, allTime) {
    this.dataPos.forEach((data, index) => {
      const color = this.config.colors[index];

      data.forEach(pos => {
        const { value, x, y, width, height, oldValue } = pos;

        canvas.rect(this.ctx, {
          x,
          y: oldValue.y + (pos.y - oldValue.y) / allTime * time,
          width,
          height: oldValue.height + (pos.height - oldValue.height) / allTime * time,
          fillStyle: color,
        });
      });
    });
  }

  renderValue() {
    this.dataPos.forEach((data, index) => {
      const color = this.config.colors[index];
      const dataG = $.createSVG('g', {
        className: 'data-points',
        parent: this.svg,
      });

      data.forEach(pos => {
        const { value, x, y, width, height, oldValue } = pos;
        const dataRect = $.createSVG('rect', {
          className: 'bar',
          x,
          y: oldValue.y,
          width,
          height: oldValue.height,
          fill: color,
        });

        dataG.appendChild(dataRect);

        const dataAniamteRect = $.createSVG('rect', {
          className: 'bar',
          x,
          y,
          width,
          height,
          fill: color,
        });

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
  }
}

export default BarChart;

