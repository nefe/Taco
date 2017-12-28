
/**
 * 获取 element 的 content 宽度
 * @param element
 */
export function getElementContentWidth(element: Element): number {
  const styles = window.getComputedStyle(element);
  const padding =
    parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
  return element.clientWidth - padding;
}

/**
 * 保留两位小数
 * @param number
 */
export function floatTwo(number: number) {
  return parseFloat(number.toFixed(2));
}

/**
 * Returns pixel width of string.
 * @param {String} string
 * @param {Number} charWidth Width of single char in pixels
 */
export function getStringWidth(string: string, charWidth: number) {
  return (string + '').length * charWidth;
}

/**
 * dom 方法
 */
export const $ = {
	select: (expr: string | Element, con?: Element): Element => {
		return typeof expr === "string" ? (con || document).querySelector(expr) : expr || null;
	},
	// <T extends keyof HTMLElement>
	create: (tag: string, options: any): HTMLElement => {
		const element = document.createElement(tag);
		for (var key in options) {
			const value = options[key];
			if (key === 'parent') {
				$.select(value).appendChild(element);
			}
			if (key in element) {
				(element as any)[key] = value;
			}
		}
		return element;
	},
	createSVG: (tag: string, options: any): SVGElement => {
		const element = document.createElementNS("http://www.w3.org/2000/svg", tag);

		for (var key in options) {
			const value = options[key];
			if (key === "className") {
				key = "class";
			}
			if (key === "parent") {
				$.select(value).appendChild(element);
			} else if (key === "innerHTML") {
				element['textContent'] = value;
			} else {
				element.setAttribute(key, value);
			}
		}
		return element;
	}
}

/** canvas 对象 */
export const canvas = {
	line: (ctx: CanvasRenderingContext2D, lineConfig: {
		startX: number;
		startY: number;
		endX: number;
		endY: number;
		lineWidth?: number;
		strokeStyle?: string;
	}) => {
		const { startX, startY, endX, endY, lineWidth = 1, strokeStyle = '#dadada' } = lineConfig;
		ctx.lineWidth = lineWidth;
		ctx.strokeStyle = strokeStyle;
		ctx.beginPath();
		ctx.moveTo(parseInt(String(startX)) + 0.5, parseInt(String(startY)) + 0.5);
		ctx.lineTo(parseInt(String(endX)) + 0.5, parseInt(String(endY)) + 0.5);
		ctx.stroke();
	},
	text: (ctx: CanvasRenderingContext2D, textConfig: {
		text: string;
		x: number;
		y: number;
		fontSize?: number;
		fillStyle?: string;
	}) => {
		const { text, x, y, fontSize = 11, fillStyle = "#555b51" } = textConfig;
		ctx.font = `300 ${fontSize}px Helvetica Neue, Arial, sans-serif`;
		ctx.fillStyle = fillStyle;
		ctx.fillText(text, x, y);
	},
	rect: (ctx: CanvasRenderingContext2D, rectConfig: {
		x: number,
		y: number,
		width: number,
		height: number,
		fillStyle?: string,
	}) => {
		const { x, y, width, height, fillStyle } = rectConfig;
		console.log(fillStyle);
		ctx.fillStyle = fillStyle;
		// ctx.rect(x, y, width, height);
		// ctx.fill();
		ctx.fillRect(x, y, width, height);
	},
}

/**
 * 获取 element 在整个页面中的 top 与 left
 * @param element
 */
export function offset(element: HTMLElement) {
	let rect = element.getBoundingClientRect();
	return {
		top: rect.top + (document.documentElement.scrollTop || document.body.scrollTop),
		left: rect.left + (document.documentElement.scrollLeft || document.body.scrollLeft)
	};
}
