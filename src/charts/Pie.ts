/**
 * @file Pie chart
 * @author mickle.zy
 */
import { Iargs } from '../index.d';
import { BaseChart } from 'src/charts/baseChart';
import { getElementContentWidth } from 'src/charts/utils';
const SVG_NS = 'http://www.w3.org/2000/svg';

class Pie extends BaseChart {
  centerPoint: number[];
  chartDom: SVGElement;
  /** 开始角度 */
  beginAngel = 90;

  /** 半径 根据容器自动设置半径*/
  r = 30;

  width = 300;

  height = 300;

  /**
   * 构造器
   * @param args
   */
  constructor(args: Iargs) {
    super(args);
    /**
     * 圆心 , TODO 使用父容器的中心点
     */
    this.centerPoint = [150, 150];

    /** 开始角度 */
    this.beginAngel = 90;

    /** 半径 根据容器自动设置半径*/
    this.r = 100;

    this.width = 300;

    this.height = 300;

    this.init();
  }

  init(): any {
    console.log('init Pie');
    const containerEle = this.options.parent as HTMLElement;
    // this.centerPoint = [containerEle.clientWidth/2, containerEle.clientHeight/2];

    // 获取总共数量
    const allCount = this.getAllCount();

    // 计算比例(计算出来度数)
    const scales = this.getScales(allCount);

    // 获取所有路径集合
    const allPathPoints = this.getAllPathPoints(scales);

    // 开始渲染
    this.render(allPathPoints);
  }

  /**
   * 初始化
   */
  initContainer() {
    //
  }

  /**
   * 获取所有路径的path点集合
   * 参考 https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Paths
   * @param scales 比例
   */
  getAllPathPoints(scales: number[]): any {
    const allPathPoints: string[] = [];
    // x1 , y1 第一个焦点
    let x1 = 0;
    let y1 = this.r;

    // x2 , y2 第二个焦点
    let x2 = 0;
    let y2 = this.r;

    let startAngle = this.beginAngel;
    let endangle = this.beginAngel;
    let largeFlag = 0; // 度数超过 180 度， 置为1;

    scales.forEach((scale, index) => {
      endangle = startAngle + scale * Math.PI * 2;
      if (endangle - startAngle > Math.PI) largeFlag = 1;
      var x1 = this.centerPoint[0] + this.r * Math.sin(startAngle);
      var y1 = this.centerPoint[1] - this.r * Math.cos(startAngle);
      var x2 = this.centerPoint[0] + this.r * Math.sin(endangle);
      var y2 = this.centerPoint[1] - this.r * Math.cos(endangle);

      const hoverDiff = index === 3 ? -15 : 0;
      // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
      const path = `M${this.centerPoint[0] + hoverDiff} ${this.centerPoint[1] + hoverDiff}
      L ${x1 + hoverDiff} ${y1 + hoverDiff}
      A ${this.r} ${this.r}
      0 ${largeFlag} 1 ${x2 + hoverDiff} ${y2 + hoverDiff}
      Z`;
      startAngle = endangle;
      allPathPoints.push(path);
    });

    return allPathPoints;
  }

  /**
   * 获取总数量
   */
  getAllCount(): any {
    const all = 0;
    const values = this.optionsData.datasets[0].values;
    return values.reduce((pre, cur) => pre + cur);
  }

  /**
   * 计算比例
   */
  getScales(allCount: number): any {
    const values = this.optionsData.datasets[0].values;
    return values.map(v => v / allCount);
  }

  /**
   * 渲染扇形
   */
  renderSector(points: string, index: number): any {
    this.drawPath(points, index);
  }

  /**
   * 开始渲染
   */
  render(allPathPoints: string[]): any {
    this.drawDomContainer();
    allPathPoints.forEach((points, index) => {
      this.renderSector(points, index);
    });
    (this.options.parent as HTMLElement).appendChild(this.chartDom);
  }

  /**
   * 画容器
   */
  drawDomContainer(): any {
    let chart = document.createElementNS(SVG_NS, 'svg:svg');
    chart.setAttribute('width', this.width + '');
    chart.setAttribute('height', this.height + '');
    chart.setAttribute('viewBox', '0 0 ' + this.width + ' ' + this.height);
    this.chartDom = chart;
  }

  /**
   * 画路径
   */
  drawPath(points: string, index: number): any {
    var path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', points); //设置路径
    path.setAttribute('fill', this.options.colors[index]); //设置填充颜色
    path.setAttribute('stroke', this.options.colors[index]); //楔的外边框为黑色
    path.setAttribute('stroke-width', '1'); //两个单位
    this.chartDom.appendChild(path);
  }
}

export { Pie };
