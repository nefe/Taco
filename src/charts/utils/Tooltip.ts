/**
 * Tips 组件。不计算位置，只负责渲染。
 */

interface TooltipValue {
  color?: string;
  label?: string | number;
  value?: string | number;
}

export default class Tooltip {
  /** tooltip 最外层的 dom */
  domNode: HTMLElement;
  /** tooltip 最外层的 dom */
  parentNode: HTMLElement;

  /**
   * @param parentNode dom node to render to
   */
  constructor(parentNode: HTMLElement) {
    this.domNode = document.createElement('div');
    this.domNode.className = `svg-tip`;
    if (parentNode) {
      parentNode.appendChild(this.domNode);
    } else {
      throw Error("Error: parentNode does not exist.");
    }
  }

  /**
   * 设置 Tooltip 内容并显示到指定位置
   * @param left 定位点的 left
   * @param top 定位点的 top
   * @param title 标题
   * @param values 要显示的值信息
   * @param position 显示的位置，默认为 top，可以定位点的上下左右
   */
  update(left: number, top: number, title: string, values: TooltipValue[], position: 'top' | 'left' | 'right' | 'bottom' = 'top') {
    // 添加位置到 class，用来确定三角位置
    if (!this.domNode.classList.contains(position)) {
      this.domNode.classList.add(position);
    }

    const valueTpls = values.map((item) => {
      return `<tr>
        <td>${item.label}</td>
        <td class="number"><i class="color-icon" style="background-color: ${item.color}"></i>${item.value}</td>
      </tr>`;
    });

    this.domNode.innerHTML = `
    <div>
      <span class="title">${title}</span>
      <table class="data-list"></table>
    </div>
    `;
    this.domNode.style.top = `${top}px`; // 上移避免遮挡
    this.domNode.style.left = `${left}px`;
    this.domNode.style.display = 'block';
    this.domNode.querySelector('.data-list').innerHTML = valueTpls.join('');
  }

  /**
   * hide tooltip
   */
  hide() {
    this.domNode.style.display = 'none';
    this.domNode.style.top = '0';
    this.domNode.style.left = '0';
  }

  /**
   * destroy tooltip
   */
  destroy() {
    if (this.parentNode) {
      this.parentNode.removeChild(this.domNode);
    }
  }
}
