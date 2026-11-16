import HudImage from "./hud-image.js";

const LABEL_FONT = "10px monospace";

export default class StatusBar extends HudImage {
  constructor(x, y, width, height, imagePath) {
    super(x, y, width, height, imagePath);
    this.fullWidth = width;
    this.label = "";
  }

  setValue(value, max) {
    this.width = (this.fullWidth * value) / max;
    this.label = `${value}/${max}`;
  }

  draw(ctx) {
    super.draw(ctx);
    ctx.font = LABEL_FONT;
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      this.label,
      this.x + this.fullWidth / 2,
      this.y + this.height / 2,
    );
  }
}
