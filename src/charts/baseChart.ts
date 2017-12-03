/**
 * @file Base chart
 */
import { Iargs } from '../index.d';
import { createSVG } from './utils/draw';

class BaseChart {
  private args: Iargs;
  private title: string;
  private subTitle: string;
  private type: 'line' | 'pie' | 'bar' | 'scatter' | 'percentage';
  private parent: HTMLElement;
  private chartWrapper: HTMLElement;
  private chartWidth: number;
  private chartHeight: number;
  private svg: SVGElement;
  private svgDefs: SVGElement;
  private drawArea: SVGElement;
  private translateX: number;
  private translateY: number;
  constructor(args: Iargs) {
    this.args = args;
    this.setup();
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
      inside: this.chartWrapper,
      width: this.chartWidth,
      height: this.chartHeight
    });
    this.svgDefs = createSVG('defs', {
      inside: this.svg,
    });
  }
  initDrawArea() {
    this.drawArea = createSVG('g', {
      className: `${this.type}-chart`,
      inside: this.svg,
      transform: `translate(${this.translateX}, ${this.translateY})`
    });
  }
}

export { BaseChart };
