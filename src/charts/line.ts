/**
 * @file Line chart
 */
import { AxisChart } from './AxisChart';
import { Iargs } from '../index.d';
import { createSVG, makePath } from './utils/draw';

export default class Line extends AxisChart {
  constructor(args: Iargs) {
    super(args);
    this.init();
  }
  init() {
    this.initPathGroup();
    console.log('line');
  }
  initPathGroup() {
    this.datasets.map((dataset: any, index: number) => {
      const color = dataset.color || this.args.colors[index % this.args.colors.length];
      const grouSvg = createSVG('g', {
        inside: this.drawArea,
        className: `path-group path-group-${index}`,
      });
      const linePath = this.getLinePath(dataset.values, color);
      grouSvg.appendChild(linePath);
    });
  }
  getYPosition(values: number[]) {
    const maxYValue = Math.max(...this.yValues);
    const minYValue = Math.min(...this.yValues);
    const maxYPosition = Math.max(...this.yPositions);
    const minYPosition = Math.min(...this.yPositions);
    const yInterval = (maxYPosition - minYPosition) / (maxYValue - minYValue);
    return values.map((value: number) => {
      return minYPosition + ((maxYValue - value) * yInterval);
    });
  }
  getLinePath(values: number[], color: string) {
    const yPositions: number[] = this.getYPosition(values);
    let pointsList = yPositions.map((yValue: number, index: number) => {
      return `${this.xPositons[index]},${yValue}`;
    });
    let pointsStr = pointsList.join("L");
    return makePath("M" + pointsStr, 'line-graph-path', color);
  }
}