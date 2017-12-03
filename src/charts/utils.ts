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
		return typeof expr === "string"? (con || document).querySelector(expr) : expr || null;
	},
	// <T extends keyof HTMLElement>
	create: (tag: string, options: any): HTMLElement => {
		const element = document.createElement(tag);
		for (var key in options) {
			const value = options[key];
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
