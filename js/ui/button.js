import HudImage from "./hud-image.js";
import Label from "./label.js";

const BUTTON_IMAGE = "./assets/images/ui/button-yellow.png";
const BUTTON_WIDTH = 168;
const BUTTON_HEIGHT = 36;
const TEXT_COLOR = "#282c0c";
const LIGHT_COLOR = "#ffc300";

export default class Button extends HudImage {
  constructor(centerX, y, text) {
    const x = centerX - BUTTON_WIDTH / 2;
    super(x, y, BUTTON_WIDTH, BUTTON_HEIGHT, BUTTON_IMAGE);
    const centerY = y + BUTTON_HEIGHT / 2;
    this.label = new Label(text, centerX, centerY, 16, TEXT_COLOR, LIGHT_COLOR);
  }

  draw(ctx) {
    super.draw(ctx);
    this.label.draw(ctx);
  }
}
