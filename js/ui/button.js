import HudImage from "./hud-image.js";
import Label from "./label.js";

const BUTTON_PATH = "./assets/images/ui/button-";
const BUTTON_WIDTH = 168;
const BUTTON_HEIGHT = 36;
const TEXT_COLOR = "#282c0c";
const LIGHT_COLOR = "#ffc300";

export default class Button extends HudImage {
  constructor(centerX, y, text) {
    const x = centerX - BUTTON_WIDTH / 2;
    super(x, y, BUTTON_WIDTH, BUTTON_HEIGHT, BUTTON_PATH + "yellow.png");
    const centerY = y + BUTTON_HEIGHT / 2;
    this.label = new Label(text, centerX, centerY, 16, TEXT_COLOR, LIGHT_COLOR);
    const plain = BUTTON_PATH + "brown.png";
    this.plain = new HudImage(x, y, BUTTON_WIDTH, BUTTON_HEIGHT, plain);
    this.selected = true;
  }

  draw(ctx) {
    if (this.selected) super.draw(ctx);
    else this.plain.draw(ctx);
    this.label.draw(ctx);
  }
}
