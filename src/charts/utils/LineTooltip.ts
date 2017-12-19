
/**
 * @file Chart Tip
 */
import { $ } from "src/charts/utils/dom";
import Tooltip from './Tooltip';

export default class LineToolTip {
  private tooltip: Tooltip;
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
    this.tooltip = new Tooltip(this.parent);
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
      this.tooltip.hide();
    });
  }
  changeTooltip(relX) {
    const activeIndex = Math.floor(relX / this.xInterval);
    const { label, values } = this.getValues(activeIndex);
    const x = Number(this.xPositons[activeIndex]);
    const y = this.getYPosition([values[0].value])[0];
    this.tooltip.update(x + 2, y + 30, label, values);
  }
  getValues(activeIndex) {
    const label = this.labels[activeIndex];
    const values = this.datasets.map((dataset, index) => {
      return {
        label: dataset.title,
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
}
