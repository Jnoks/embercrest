import HudImage from "./hud-image.js";

export default class StatusBar extends HudImage {
  constructor(x, y, width, height, imagePath) {
    super(x, y, width, height, imagePath);
    this.fullWidth = width;
  }

  setValue(value, max) {
    this.width = (this.fullWidth * value) / max;
  }
}
