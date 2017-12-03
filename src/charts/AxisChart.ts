/**
 * @file Axis chart
 */
import { BaseChart } from './BaseChart';
import { Iargs } from '../index.d';
import { createDrawAreaComponent, makeYLine, makeXLine } from './utils/draw';
import { getStringWidth } from './utils';
const Y_AXIS_NUMBER = 6;

class AxisChart extends BaseChart {
  private xAxisContainer: SVGElement;
  private yAxisContainer: SVGElement;
  private drawHeight: number;
  private drawWidth: number;
  private labels: string[];
  private datasets: object[];
  constructor(args: Iargs) {
    super(args);
    const { data } = args;
    this.labels = data.labels;
    this.datasets = data.datasets;
    this.drawHeight = this.svg.getBoundingClientRect().height - (this.translateY * 2);
    this.drawWidth = this.svg.getBoundingClientRect().width - (this.translateX * 2);
    this.initAxisContainer();
    this.createYAxis();
    this.creteXAxis();
  }
  initAxisContainer() {
    this.xAxisContainer = createDrawAreaComponent(this.drawArea, 'y axis');
    this.yAxisContainer = createDrawAreaComponent(this.drawArea, 'x axis');
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
    const interval = (max - min) / Y_AXIS_NUMBER;
    const middle = (max + min) / 2;
    const yAxisValues = [];
    for (let i = 0; i < Y_AXIS_NUMBER; i++) {
      const firstValue = middle - interval * 2.5;
      const value = firstValue + (interval * i);
      yAxisValues.push(value);
    }
    return yAxisValues;
  }
  drawYAxis(value: number, index: number, yPos: number) {
    const startAt = 6;
    const interval = this.drawWidth / (this.labels.length - 1);
    // TODO: 去除 magic number
    const width = this.chartWidth - interval + 16;
    const textEndAt = -30;
    const yLine = makeYLine(startAt, width, textEndAt, value, yPos);
    this.yAxisContainer.appendChild(yLine);
  }
  createYAxis() {
    const yAxisValues = this.getYAxisValue();
    const yPosInterval = this.drawHeight / 6;
    yAxisValues.map((value, index) => {
      const yPos = this.drawHeight - 20 - (yPosInterval * index);
      this.drawYAxis(value, index, yPos);
    });
  }
  creteXAxis() {
    const interval = this.drawWidth / (this.labels.length - 1);
    this.labels.forEach((label, index) => {
      const xPos = interval * (index) + 15;
      this.dragXAxis(label, xPos);
    })
  }
  dragXAxis(label: string, xPos: number) {
    const textStartAt = this.drawHeight - 9;
    const xLine = makeXLine(textStartAt, textStartAt, label, xPos);
    this.xAxisContainer.appendChild(xLine);
  }
}

export { AxisChart };
