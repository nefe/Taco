import { $ } from "src/charts/utils";

interface ToolTipOptions {
  parent: HTMLElement,
}

class ToolTip {
  y: number;
  x: number;
  data_point_list: any;
  title: any;
  point: { x: number; y: number; };
  yValue: { title: string; value: number; }[];
  xValue: string;
  container: HTMLElement;
  parent: HTMLElement;

  constructor(option: ToolTipOptions) {
    this.parent = option.parent;
    this.makeTooltip();
  }

  makeTooltip() {
    this.container = $.create('div', {
      inside: this.parent,
      className: 'graph-svg-tip comparison',
      innerHTML: `<div className="graph-svg-tip-content">
        <span class="title"></span>
        <ul class="data-point-list"></ul>
      </div>`
    });

    this.title = this.container.querySelector('.title');
    this.data_point_list = this.container.querySelector('.data-point-list');

    this.parent.addEventListener('mouseleave', () => {
			this.hideTip();
    });
    
    this.hideTip();
  }

  render() {
    this.title.innerHTML = `<strong>${this.xValue}</strong>`;
    this.clearTooltip();

    this.yValue.forEach((y, i) => {
      const { value, title } = y;
			let li = $.create('li', {
				innerHTML: `<strong style="display: block;">${value}</strong>${title}`
			});
			this.data_point_list.appendChild(li);
    });
    
    const width = this.container.offsetWidth;
    const height = this.container.offsetHeight;
    this.x = this.point.x - width / 2;
    this.y = this.point.y - height;

    this.showTip();
  }

  clearTooltip() {
    this.data_point_list.innerHTML = '';
  }

  showTip() {
    this.container.style.top = this.y + 'px';
		this.container.style.left = this.x + 'px';
		this.container.style.opacity = '1';
  }

  hideTip() {
    this.container.style.top = '0px';
		this.container.style.left = '0px';
		this.container.style.opacity = '0';
  }

  /**
   * @param xValue x 轴的值
   * @param yValue y 轴的值
   * @param point 位置
   */
  setValues(
    xValue: string,
    yValue: Array<{ title: string, value: number }>,
    point: { x: number, y: number }
  ) {
    this.xValue = xValue;
    this.yValue = yValue;
    this.point = point;
    this.render();
  }
}

export default ToolTip;