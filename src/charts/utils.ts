/**
 * 获取 element 的 content 宽度
 * @param element 
 */
export function getElementContentWidth(element: Element): number {
	const styles = window.getComputedStyle(element);
	const padding = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
	return element.clientWidth - padding;
}

/**
 * 保留两位小数
 * @param number
 */
export function floatTwo(number: number) {
	return parseFloat(number.toFixed(2));
}