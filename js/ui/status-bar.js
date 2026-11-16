import HudImage from "./hud-image.js";

const LABEL_FONT = "bold 8px Silkscreen, monospace";

export default class StatusBar extends HudImage {
  constructor(x, y, width, height, imagePath, name) {
    super(x, y, width, height, imagePath);
    this.fullWidth = width;
    this.label = "";
    this.name = name;
  }

  setValue(value, max) {
    this.width = (this.fullWidth * value) / max;
    this.label = `${value}/${max}`;
  }

  draw(ctx) {
    super.draw(ctx);
    const centerX = this.x + this.fullWidth / 2;
    const centerY = this.y + this.height / 2;
    ctx.font = LABEL_FONT;
    ctx.fillStyle = "white";
    ctx.textBaseline = "middle";
    const text = `${this.name} ${this.label}`;
    const left = Math.round(centerX - ctx.measureText(text).width / 2);
    ctx.textAlign = "left";
    ctx.fillText(text, left, centerY);
  }
}
