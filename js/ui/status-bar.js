import HudImage from "./hud-image.js";

const LABEL_FONT = "8px monospace";

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
    ctx.textAlign = "center";
    ctx.fillText(`${this.name} ${this.label}`, centerX, centerY);
  }
}
