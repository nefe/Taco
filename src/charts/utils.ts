/** 动画参数 */
const EASING = {
	ease: "0.25 0.1 0.25 1",
  linear: "0 0 1 1",
	easein: "0.1 0.8 0.2 1",
	easeout: "0 0 0.58 1",
	easeinout: "0.42 0 0.58 1"
};

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
			if (key === 'inside') {
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
			if (key === "inside") {
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

interface Value {
	x?: number,
	y?: number,
	height?: number,
	width?: number,
	[key: string]: any
}

interface SVGAnimateOptions {
	parent: SVGElement,
	dur: number,
	new: Value,
	old: Value,
}

export function creatSVGAnimate(options: SVGAnimateOptions) {
	const { parent, old, dur } = options;
	for (let attributeName in options.new) {
		const to = (options.new as any)[attributeName];
		const from = (old as any)[attributeName];

		const animateElement = document.createElementNS("http://www.w3.org/2000/svg", "animate");

		const animAttr = {
			attributeName,
			from,
			to,
			begin: "0s",
			dur: `${dur / 1000}s`,
			values: from + ";" + to,
			keySplines: EASING.ease,
			keyTimes: "0;1",
			calcMode: "spline",
			fill: "freeze",
		};

		for (let attr in animAttr) {
			animateElement.setAttribute(attr, (animAttr as any)[attr]);
		}

		parent.appendChild(animateElement);
	}
}