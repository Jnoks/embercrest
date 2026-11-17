const FONT = "Silkscreen, monospace";

export default class Label {
  constructor(text, centerX, centerY, size, color, shadowColor) {
    this.text = text;
    this.centerX = centerX;
    this.centerY = centerY;
    this.size = size;
    this.color = color;
    this.shadowColor = shadowColor;
  }

  draw(ctx) {
    const pixel = this.size / 8;
    ctx.font = `bold ${this.size}px ${FONT}`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    const width = ctx.measureText(this.text).width;
    const left = Math.round(this.centerX - width / 2);
    ctx.fillStyle = this.shadowColor;
    ctx.fillText(this.text, left + pixel, this.centerY + pixel);
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, left, this.centerY);
  }
}
