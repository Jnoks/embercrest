import HudImage from "./hud-image.js";
import Label from "./label.js";

const KEY_PATH = "./assets/images/ui/key-";
const KEY_SIZE = 40;
const LETTER_SIZES = { 24: 16, 40: 24 };

export default class Key extends HudImage {
  constructor(x, y, text, width = KEY_SIZE, height = KEY_SIZE) {
    super(x, y, width, height, KEY_PATH + width + ".png");
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const size = LETTER_SIZES[height];
    this.label = new Label(text, centerX, centerY, size, "white", "black");
    this.label.weight = "normal";
  }

  draw(ctx) {
    super.draw(ctx);
    this.label.draw(ctx);
  }
}
