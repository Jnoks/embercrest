import HudImage from "./hud-image.js";
import Label from "./label.js";
import { IS_TOUCH } from "../device.js";

const KEY_PATH = "./assets/images/ui/key-";
const TOUCH_PATH = "./assets/images/ui/touch/";
const KEY_SIZE = 40;
const LETTER_SIZES = { 24: 16, 40: 24 };
const TOUCH_ICONS = {
  A: "left",
  D: "right",
  W: "jump",
  S: "block",
  E: "talk",
  Space: "attack",
  Esc: "menu",
};

export default class Key extends HudImage {
  constructor(x, y, text, width = KEY_SIZE, height = KEY_SIZE) {
    super(x, y, width, height, KEY_PATH + width + ".png");
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const size = LETTER_SIZES[height];
    this.label = new Label(text, centerX, centerY, size, "white", "black");
    this.label.weight = "normal";
    this.icon = this.createIcon(TOUCH_ICONS[text]);
  }

  createIcon(name) {
    if (!IS_TOUCH || !name) return null;
    const x = this.x + this.width - this.height;
    const path = TOUCH_PATH + name + ".png";
    return new HudImage(x, this.y, this.height, this.height, path);
  }

  draw(ctx) {
    if (this.icon) this.drawIcon(ctx);
    else this.drawKey(ctx);
  }

  drawIcon(ctx) {
    ctx.imageSmoothingEnabled = true;
    this.icon.draw(ctx);
    ctx.imageSmoothingEnabled = false;
  }

  drawKey(ctx) {
    super.draw(ctx);
    this.label.draw(ctx);
  }
}
