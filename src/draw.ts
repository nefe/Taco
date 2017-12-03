/**
 * 创建一个 SVG 元素
 * @param tag 标签名
 * @param o 对象
 */
export function createSVG(tag: string, o: any) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tag);

  for (let key in o) {
    if (o.hasOwnProperty(key)) {
      const val = o[key];
      if (key === 'inside') {
        val.appendChild(element);
      } else if (key === 'styles') {
        if (typeof val === 'object') {
          Object.keys(val).map((prop: string) => {
            (element.style as any)[prop] = val[prop];
          });
        }
      } else {
        if (key === 'className') { key = 'class'; } // 兼容 react 中的 className
        if (key === 'innerHTML') {
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
 * 创建 path
 */
export function makePath(pathStr: string, className='', stroke = 'none', fill = 'none') {
  return createSVG('path', {
    className,
    d: pathStr,
    styles: {
      stroke,
      fill
    }
  })
}

/**
 * 绘制一条 X 轴的线
 * @param height 高度
 * @param textStartAt 文字的Y坐标
 * @param point 坐标轴文字内容
 * @param labelClass 坐标轴文字样式
 * @param axisLineClass 坐标轴样式
 * @param xPos 线的X坐标
 */
export function makeXLine(height: number, textStartAt: number, point: any, labelClass: string, axisLineClass: string, xPos: number) {
  const line = createSVG('line', {
    x1: 0,
    x2: 0,
    y1: 0,
    y2: height,
    stroke: '#dadada',
  });
  const text = createSVG('text', {
    className: labelClass,
    x: 0,
    y: textStartAt,
    dy: '.71em', // 文字向下稍微偏移
    innerHTML: point,
    'text-anchor': 'middle',
    'font-size': '11px'
  });
  const xLine = createSVG('g', {
    className: `tick ${axisLineClass}`,
    transform: `translate(${xPos} 0)` // 平移
  });
  xLine.appendChild(line);
  xLine.appendChild(text);
  return xLine;
}


/**
 * 绘制一条 Y 轴的线
 * @param startAt 左侧留白宽度
 * @param width 高度
 * @param textEndAt 文字的X坐标
 * @param point 坐标轴文字内容
 * @param labelClass 坐标轴文字样式
 * @param axisLineClass 坐标轴样式
 * @param yPos 线的Y坐标
 */
export function makeYLine(startAt: number, width: number, textEndAt: number, point: any, labelClass: string, axisLineClass: string, yPos: number) {
  const line = createSVG('line', {
    x1: startAt,
    x2: width,
    y1: 0,
    y2: 0,
    stroke: '#dadada',
  });
  const text = createSVG('text', {
    className: labelClass,
    x: textEndAt,
    y: 0,
    dy: '.32em', // 文字向下稍微偏移
    innerHTML: point,
    'text-anchor': 'end',
    'font-size': '11px'
  });
  const yLine = createSVG('g', {
    className: `tick ${axisLineClass}`,
    transform: `translate(0 ${yPos})` // 平移
  });
  yLine.appendChild(line);
  yLine.appendChild(text);
  return yLine;
}
