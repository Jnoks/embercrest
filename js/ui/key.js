import HudImage from "./hud-image.js";
import Label from "./label.js";

const KEY_PATH = "./assets/images/ui/key-";
const KEY_SIZE = 40;

export default class Key extends HudImage {
  constructor(x, y, text, width = KEY_SIZE) {
    super(x, y, width, KEY_SIZE, KEY_PATH + width + ".png");
    const centerY = y + KEY_SIZE / 2;
    this.label = new Label(text, x + width / 2, centerY, 24, "white", "black");
    this.label.weight = "normal";
  }

  draw(ctx) {
    super.draw(ctx);
    this.label.draw(ctx);
  }
}
