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
    this.label = `${Math.floor(value)}/${max}`;
  }

  draw(ctx) {
    super.draw(ctx);
    const centerX = this.x + this.fullWidth / 2;
    const centerY = this.y + this.height / 2;
    ctx.font = LABEL_FONT;
    ctx.textBaseline = "middle";
    const text = `${this.name} ${this.label}`;
    const left = Math.round(centerX - (ctx.measureText(text).width + 1) / 2);
    ctx.textAlign = "left";
    ctx.fillStyle = "black";
    ctx.fillText(text, left + 1, centerY + 1);
    ctx.fillStyle = "white";
    ctx.fillText(text, left, centerY);
  }
}
