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
