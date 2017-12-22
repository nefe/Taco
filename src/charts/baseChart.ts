/**
 * @file Base chart
 */
import { Iargs } from '../index.d';
import { createSVG } from './utils/draw';

class BaseChart {
  public options:Iargs;
  public optionsData: any;
  public args: Iargs;
  public title: string;
  public subTitle: string;
  public type: 'line' | 'pie' | 'bar' | 'scatter' | 'percentage';
  public parent: HTMLElement;
  public chartWrapper: HTMLElement;
  public chartWidth: number;
  public chartHeight: number;
  public svg: SVGElement;
  public svgDefs: SVGElement;
  public drawArea: SVGElement;
  public translateX: number;
  public translateY: number;
  constructor(args: Iargs) {
    this.options = args;
    this.optionsData = args.data;
    this.args = args;
    if (this.options.type!=='pie') {
      this.setup();
    }
  }
  setup() {
    this.getValues();
    this.setMargins();
    this.initContainer();

    this.initChartArea();
    this.initDrawArea();
  }
  getValues() {
    const { title, subTitle, parent, height, type } = this.args;
    this.title = title || '';
    this.subTitle = subTitle || '';
    this.parent = typeof parent === 'string' ? document.querySelector(parent) : parent;
    this.chartWidth = this.parent.getBoundingClientRect().width
    this.chartHeight = height;
    this.type = type;
  }
  initContainer() {
    const containerHtml = `<div className="chart-container">
      <h6 class="title">${this.title}</h6>
      <h6 class="sub-title uppercase">${this.subTitle}</h6>
      <div class="taco-chart graphics"></div>
    </div>`
    this.parent.innerHTML = containerHtml;
    this.chartWrapper = this.parent.querySelector('.taco-chart');
  }
  setMargins() {
    this.translateX = 60;
    this.translateY = 10;
  }
  initChartArea() {
    this.svg = createSVG('svg', {
      className: 'chart',
      parent: this.chartWrapper,
      width: this.chartWidth,
      height: this.chartHeight
    });
    this.svgDefs = createSVG('defs', {
      parent: this.svg,
    });
  }
  initDrawArea() {
    this.drawArea = createSVG('g', {
      className: `${this.type}-chart`,
      parent: this.svg,
      transform: `translate(${this.translateX}, ${this.translateY})`
    });
  }
}

export default BaseChart;
