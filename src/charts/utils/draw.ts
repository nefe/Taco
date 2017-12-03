function $(expr: string, con?: HTMLElement) {
  return typeof expr === 'string'
    ? (con || document).querySelector(expr)
    : expr || null;
}

export const createSVG = (tag: string, o: any) => {
  var element = document.createElementNS('http://www.w3.org/2000/svg', tag);

  for (var i in o) {
    var val = o[i];

    if (i === 'inside') {
      $(val).appendChild(element);
    } else if (i === 'around') {
      var ref = $(val);
      ref.parentNode.insertBefore(element, ref);
      element.appendChild(ref);
    } else if (i === 'styles') {
      if (typeof val === 'object') {
        Object.keys(val).map((prop: any) => {
          element.style[prop] = val[prop];
        });
      }
    } else {
      if (i === 'className') {
        i = 'class';
      }
      if (i === 'innerHTML') {
        element['textContent'] = val;
      } else {
        element.setAttribute(i, val);
      }
    }
  }

  return element;
};

export const createDrawAreaComponent = (
  parent: SVGElement,
  className: string,
  transform = ''
) => {
  return createSVG('g', {
    className: className,
    inside: parent,
    transform: transform
  });
};

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
    dy: '.32em',
    innerHTML: point + ''
  });

  let yLine = createSVG('g', {
    className: `tick y-axis-label`,
    transform: `translate(0, ${yPos})`,
    'stroke-opacity': 1
  });

  if (darker) {
    line.style.stroke = 'rgba(27, 31, 35, 0.6)';
  }

  yLine.appendChild(line);
  yLine.appendChild(text);

  return yLine;
}

export function makeXLine(
  height: number,
  textStartAt: number,
  point: string,
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
    dy: '.71em',
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
