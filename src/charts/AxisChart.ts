/**
 * @file Axis chart
 */
import BaseChart from './BaseChart';
import { Iargs } from '../index.d';
import { makeYLine, makeXLine, createSVG } from './utils/draw';
import { getStringWidth } from './utils';
const Y_AXIS_NUMBER = 6;

class AxisChart extends BaseChart {
  public xAxisContainer: SVGElement;
  public yAxisContainer: SVGElement;
  public drawHeight: number;
  public drawWidth: number;
  public labels: string[];
  public datasets: object[];
  public xPositons: number[] = [];
  public yPositions: number[] = [];
  public yValues: number[] = [];
  public xInterval: number;
  public yInterval: number;
  constructor(args: Iargs) {
    super(args);
    const { data } = args;
    this.labels = data.labels;
    this.datasets = data.datasets;
    this.drawHeight = this.svg.getBoundingClientRect().height - (this.translateY * 2);
    this.drawWidth = this.svg.getBoundingClientRect().width - (this.translateX);
    this.initAxisContainer();
    this.createYAxis();
    this.creteXAxis();
  }
  initAxisContainer() {
    this.xAxisContainer = createSVG('g', {
      parent: this.drawArea,
      className: 'x axis',
    });
    this.yAxisContainer = createSVG('g', {
      parent: this.drawArea,
      className: 'y axis'
    });
  }
  getAllYValues() {
    let yValues: any[] = [];
    this.datasets.forEach((dataset: any) => {
      yValues = yValues.concat(dataset.values);
    });
    return yValues;
  }
  getYAxisValue() {
    const yValues = this.getAllYValues();
    // TODO: 待优化 Y 轴区间
    // TODO: 待考虑 0 的情况
    const max = Math.max(...yValues);
    const min = Math.min(...yValues);
    const interval = (max - min) / Y_AXIS_NUMBER + 2;
    const middle = (max + min) / 2;
    const yAxisValues = [];
    for (let i = 0; i < Y_AXIS_NUMBER; i++) {
      const firstValue = middle - interval * 3;
      const value = firstValue + (interval * i);
      yAxisValues.push(value);
    }
    return yAxisValues;
  }
  drawYAxis(value: number, index: number, yPos: number) {
    const startAt = 6;
    this.yInterval = this.drawWidth / (this.labels.length - 1);
    // TODO: 去除 magic number
    const textEndAt = -30;
    // 减去文字部分, 减去左边间距
    const width = this.chartWidth - this.translateX - 15;
    const yLine = makeYLine(startAt, width, textEndAt, value, yPos);
    this.yAxisContainer.appendChild(yLine);
  }
  createYAxis() {
    const yAxisValues = this.getYAxisValue();
    const yPosInterval = this.drawHeight / 6;
    yAxisValues.map((value, index) => {
      const yPos = this.drawHeight - 20 - (yPosInterval * index);
      this.yPositions.push(yPos);
      this.yValues.push(value);
      this.drawYAxis(value, index, yPos);
    });
  }
  creteXAxis() {
    this.xInterval = (this.drawWidth + 60) / (this.labels.length);
    this.labels.forEach((label, index) => {
      const xPos = this.xInterval * (index) + 15;
      this.xPositons.push(xPos);
      this.dragXAxis(label, xPos);
    });
  }
  dragXAxis(label: string, xPos: number) {
    const textStartAt = this.drawHeight - 9;
    const xLine = makeXLine(textStartAt, textStartAt, label, xPos);
    this.xAxisContainer.appendChild(xLine);
  }
}

export { AxisChart };
