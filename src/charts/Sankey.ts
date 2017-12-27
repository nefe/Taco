/**
 * 桑基图
 * @author linhuiw
 */

interface SankeyConfig {
  /** 外部容器 */
  parent: HTMLElement;
  /** 图表类型 */
  type: string;
  /** 图表高度 */
  height: number;
  /** 节点数据 */
  nodes: any;
  /** Links关联数据 */
  links: any;
  /** 颜色 */
  colors: any[];
}
const nodeWidth = 20;
const heightPadding = 20;
export class SankeyChart {
  config: SankeyConfig;
  parent: SankeyConfig['parent'];
  canvas: HTMLCanvasElement;
  nodes: SankeyConfig['nodes'];
  links: SankeyConfig['links'];
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  constructor(config) {
    this.config = config;
    this.parent = config.parent;
    this.width = this.parent.getBoundingClientRect().width;
    this.height = config.height;
    this.initContainer();
    this.initNodes();
    this.initLinks();
  }
  initContainer() {
    this.parent.innerHTML = `<canvas class="sankey-container" width=${
      this.width
    } height=${this.config.height} />`;
    this.canvas = this.parent.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
  }
  initNodes() {
    this.calNodes();
    this.drawNodes();
  }
  initLinks() {
    this.calLinks();
    this.drawLinks();
  }
  getMaxValue() {
    let maxValue = 0;
    this.config.nodes.forEach(nodes => {
      nodes.forEach(node => {
        maxValue = Math.max(node.value, maxValue);
      });
    });
    return maxValue;
  }
  calNodes() {
    const xInterval = (this.width - nodeWidth) / (this.config.nodes.length - 1);
    this.nodes = [];
    const maxValue = this.getMaxValue();
    const xNodesLength = this.config.nodes.length;
    this.config.nodes.forEach((nodes, xIndex) => {
      const x = xIndex * xInterval;
      const heightInterval = (this.height - heightPadding * 2) / maxValue;
      const yInterval = (this.height - heightPadding * 2) / nodes.length;
      const yTopPaddingInterval =
        (this.height - heightPadding * 2) / xNodesLength;
      const yTopPadding =
        xIndex === xNodesLength - 1 ? 0 : yTopPaddingInterval * xIndex;
      nodes.forEach((node, yIndex) => {
        const height = heightInterval * node.value - 40;
        const y = yIndex * yInterval + yTopPadding;
        this.nodes.push({
          ...node,
          x,
          y,
          height
        });
      });
    });
  }
  drawNodes() {
    this.nodes.forEach((node, index) => {
      const colorIndex = index % this.config.colors.length;
      this.ctx.fillStyle = this.config.colors[colorIndex];
      this.ctx.fillRect(node.x, node.y, nodeWidth, node.height);
    });
  }
  calLinks() {
    this.links = [];
    const nodes = {};
    this.nodes.forEach(oneNode => {
      nodes[oneNode.node] = oneNode;
    });
    const sources = {};
    const targets = {};
    this.config.links.forEach(link => {
      const source = nodes[link.source];
      const target = nodes[link.target];
      const sourceHeight = source.height / source.value * link.value;
      const targetHeight = target.height / target.value * link.value;
      let sourceYOffset = 0;
      let targetYOffset = 0;
      if (sources[link.source]) {
        sourceYOffset = sources[link.source].reduce(
          (accumulator, currentLink) => {
            return accumulator + currentLink.sourceHeight;
          },
          0
        );
      }
      if (targets[link.target]) {
        targetYOffset = targets[link.target].reduce(
          (accumulator, currentLink) => {
            return accumulator + currentLink.targetHeight;
          },
          0
        );
      }
      const linkData = {
        ...link,
        x0: source.x + nodeWidth,
        y0: source.y + sourceYOffset,
        sourceHeight,
        targetHeight,
        x1: target.x,
        y1: target.y + targetYOffset
      };
      if (sources[link.source]) {
        sources[link.source].push(linkData);
      } else {
        sources[link.source] = [linkData];
      }
      if (targets[link.target]) {
        targets[link.target].push(linkData);
      } else {
        targets[link.target] = [linkData];
      }
      this.links.push(linkData);
    });
  }
  interpolateNumber(a, b) {
    return (
      (a = +a),
      (b -= a),
      function(t) {
        return a + b * t;
      }
    );
  }
  drawLinks() {
    this.links.forEach(link => {
      // [x0, y0] , [x1, y1]
      // [x0, y0 + sourceHeight], [x1, y1 + targetHeight]
      const curvature = 0.5;
      const xi = this.interpolateNumber(link.x0, link.x1);
      const x2 = xi(curvature);
      const x3 = xi(1 - curvature);
      this.ctx.beginPath();
      this.ctx.moveTo(link.x0, link.y0);
      this.ctx.bezierCurveTo(x2, link.y0, x3, link.y1, link.x1, link.y1);
      this.ctx.lineTo(link.x1, link.y1);
      this.ctx.lineTo(link.x1, link.y1 + link.targetHeight);
      this.ctx.bezierCurveTo(
        x3,
        link.y1 + link.targetHeight,
        x2,
        link.y0 + link.sourceHeight,
        link.x0,
        link.y0 + link.sourceHeight
      );
      this.ctx.lineTo(link.x0, link.y0 + link.sourceHeight);
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      this.ctx.fill();
      this.ctx.closePath();
    });
  }
}
