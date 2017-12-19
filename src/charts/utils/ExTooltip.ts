
/**
 * @file Chart Tip
 */

import { $ } from "src/charts/utils/dom";

export class ToolTip {
  private tooltip;
  private parent: Element;
  private drawArea: Element;
  private drawTop: number;
  private xPositons: string[];
  private xInterval: number;
  private labels: string[];
  private datasets: any[];
  private getYPosition: any;
  private translateX: number;
  private colors: string[];
  constructor({parent, drawArea, xPositons, xInterval, labels, datasets, getYPosition, translateX, colors}) {
    this.parent = parent;
    this.drawArea = drawArea;
    this.xPositons = xPositons;
    this.xInterval = xInterval;
    this.labels = labels;
    this.datasets = datasets;
    this.getYPosition = getYPosition;
    this.translateX = translateX;
    this.colors = colors;
    this.addTooltip();
    this.addTooltipEvents();
  }
  calcOffset() {
    let rect = this.drawArea.getBoundingClientRect();
    const left = rect.left + (document.documentElement.scrollLeft || document.body.scrollLeft);
    return {
      left,
      width: rect.width
    }
  }
  addTooltipEvents() {
    this.drawArea.addEventListener('mousemove', (event: MouseEvent) => {
      const offset = this.calcOffset();
      const relX = event.pageX - offset.left;
      this.changeTooltip(relX);
    });
    this.parent.addEventListener('mouseleave', () => {
      this.hideToolTip();
    });
  }
  changeTooltip(relX) {
    console.log(relX, 'relX', this.xInterval);
    const activeIndex = Math.floor(relX / this.xInterval);
    const { label, values } = this.getValues(activeIndex);
    const x = this.xPositons[activeIndex] + this.translateX;
    const y = this.getYPosition([values[0].value])[0];
    this.setTooltip(x, y, label, values);
  }
  getValues(activeIndex) {
    const label = this.labels[activeIndex];
    // const values = [];
    const values = this.datasets.map((dataset, index) => {
      return {
        title: dataset.title,
        value: dataset.values[activeIndex],
        color: this.colors[index]
      }
    }).sort((aDataset, bDataset) => {
      return bDataset.value - aDataset.value;
    });
    return {
      label,
      values
    }
  }
  setTooltip(x, y, label, values) {
    this.tooltip.querySelector('.title').innerHTML = label;
    const valueTpls = values.map((item) => {
      return `<li>
        <span>${item.title}</span>
        <span class="number"><i style="background-color: ${item.color}"></i>${item.value}</span>
      </li>`;
    });
    this.tooltip.querySelector('.data-list').innerHTML = valueTpls.join('');
    const rect = this.tooltip.getBoundingClientRect();
    console.log(rect, '====');
    this.showTooltip(y - rect.height, x - (rect.width / 2));
  }
  addTooltip() {
    this.tooltip = $.create('div', {
      inside: this.parent,
      className: 'svg-tip',
      innerHTML: `<span class="title">test</span>
        <ul class="data-list">test</ul>
        `
    });
    this.hideToolTip();
  }
  showTooltip(top, left) {
    this.tooltip.style.top = `${top}px`;
    this.tooltip.style.left = `${left}px`;
    this.tooltip.style.display = 'block';
	}
  hideToolTip() {
    this.tooltip.style.top = '0px';
    this.tooltip.style.left = '0px';
    this.tooltip.style.display = 'none';
  }
}
