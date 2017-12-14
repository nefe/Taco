/**
 * 创建一个 SVG 元素
 * @param tag 标签名
 * @param o 对象
 */
export function createSVG(tag: string, options: any) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tag);

  for (let key in options) {
    if (options.hasOwnProperty(key)) {
      const val = options[key];
      if (key === 'inside') {
        val.appendChild(element);
      } else if (key === 'styles') {
        if (typeof val === 'object') {
          Object.keys(val).map((prop: string) => {
            (element.style as any)[prop] = val[prop];
          });
        }
      } else {
        if (key === 'className') {
          key = 'class'; // 兼容 react 中的 className
        } else if (key === 'innerHTML') {
          element['textContent'] = val;
        } else {
          // 设置属性，最重要的一行
          element.setAttribute(key, val);
        }
      }
    }
  }

  return element;
}

/**
 * 绘制一条 Y 轴的线
 * @param startAt 左侧留白宽度
 * @param width 高度
 * @param textEndAt 文字的X坐标
 * @param point 坐标轴文字内容
 * @param yPos 线的Y坐标
 * @param darker
 * @param lineType
 */
export function makeYLine(
  startAt: number,
  width: number,
  textEndAt: number,
  point: number | string,
  yPos: number,
  darker = false,
  lineType = ''
) {
  let line = createSVG('line', {
    className: lineType === 'dashed' ? 'dashed' : '',
    x1: startAt,
    x2: width,
    y1: 0,
    y2: 0,
    stroke: '#dadada'
  });

  let text = createSVG('text', {
    className: 'y-value-text',
    x: textEndAt,
    y: 0,
    dy: '.32em', // 文字向下稍微偏移
    innerHTML: point + ''
  });

  let yLine = createSVG('g', {
    className: `tick y-axis-label`,
    transform: `translate(0, ${yPos})`, // 平移
    'stroke-opacity': 1
  });

  if (darker) {
    line.style.stroke = 'rgba(27, 31, 35, 0.6)';
  }

  yLine.appendChild(line);
  yLine.appendChild(text);

  return yLine;
}

/**
 * 绘制一条 X 轴的线
 * @param height 高度
 * @param textStartAt 文字的Y坐标
 * @param point 坐标轴文字内容
 * @param xPos 线的X坐标
 */
export function makeXLine(
  height: number,
  textStartAt: number,
  point: string | number,
  xPos: number
) {
  let line = createSVG('line', {
    x1: 0,
    x2: 0,
    y1: 0,
    y2: height,
    stroke: '#dadada'
  });

  let text = createSVG('text', {
    className: 'x-value-text',
    x: 0,
    y: textStartAt,
    dy: '.71em', // 文字向下稍微偏移
    innerHTML: point
  });

  let xLine = createSVG('g', {
    className: `tick x-axis-label`,
    transform: `translate(${xPos}, 0)`
  });

  xLine.appendChild(line);
  xLine.appendChild(text);

  return xLine;
}

/**
 * 创建 path
 */
export function makePath(
  pathStr: string,
  className = '',
  stroke = 'none',
  fill = 'none'
) {
  return createSVG('path', {
    className: className,
    d: pathStr,
    styles: {
      stroke: stroke,
      fill: fill
    }
  });
}
