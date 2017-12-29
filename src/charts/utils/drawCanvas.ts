/** 动画参数 */
const EASING = {
  ease: "0.25 0.1 0.25 1",
  linear: "0 0 1 1",
  easein: "0.1 0.8 0.2 1",
  easeout: "0 0 0.58 1",
  easeinout: "0.42 0 0.58 1"
};

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
  ctx: CanvasRenderingContext2D,
  startAt: number,
  width: number,
  textEndAt: number,
  point: number | string,
  yPos: number,
  darker = false,
  lineType = "",
  lineWidth = 1,
  strokeStyle = "#dadada",
  fontSize = 11,
) {
  ctx.save();
  ctx.lineWidth = 1;
  ctx.strokeStyle = strokeStyle;
  ctx.beginPath();
  ctx.moveTo(startAt, yPos);
  ctx.lineTo(width, yPos);
  ctx.stroke();

  ctx.font = `300 ${fontSize}px Helvetica Neue, Arial, sans-serif`;
  ctx.fillStyle = '#555b51';
  ctx.textAlign = 'end';
  ctx.fillText(String(point), textEndAt, yPos + 5);
  ctx.restore();
}

/**
 * 绘制一条 X 轴的线
 * @param height 高度
 * @param textStartAt 文字的Y坐标
 * @param point 坐标轴文字内容
 * @param xPos 线的X坐标
 */
export function makeXLine(
  ctx: CanvasRenderingContext2D,
  height: number,
  textStartAt: number,
  point: string | number,
  xPos: number,
  lineWidth = 1,
  strokeStyle = "#dadada",
  fontSize = 11,
) {
  ctx.save();
  ctx.lineWidth = 1;
  ctx.strokeStyle = strokeStyle;
  ctx.beginPath();
  ctx.moveTo(xPos, 0);
  ctx.lineTo(xPos, height);
  ctx.stroke();

  ctx.font = `300 ${fontSize}px Helvetica Neue, Arial, sans-serif`;
  ctx.fillStyle = '#555b51';
  ctx.textAlign = 'center';
  ctx.fillText(String(point), xPos, textStartAt);
  ctx.restore();
}
