import HudImage from "./hud-image.js";
import Label, { TITLE_COLOR, SHADOW_COLOR } from "./label.js";

const TOGGLE_PATH = "./assets/images/ui/toggle-";
const WIDTH = 128;
const HEIGHT = 24;
const TRACK_WIDTH = 44;
const KNOB_SIZE = 16;
const KNOB_GAP = 4;
const KNOB_TRAVEL = 20;
const LABEL_SHIFT = 28;
const PADDING = 8;
const SLIDE_TIME = 0.1;

export default class Toggle {
  constructor(centerX, y, text, on, width = WIDTH) {
    const labelX = centerX - LABEL_SHIFT;
    const centerY = y + HEIGHT / 2;
    this.x = centerX - width / 2;
    this.y = y;
    this.width = width;
    this.trackX = this.x + width - TRACK_WIDTH;
    this.on = on;
    this.selected = false;
    this.slide = 0;
    if (on) this.slide = 1;
    this.label = new Label(text, labelX, centerY, 16, "white", SHADOW_COLOR);
    this.createImages(this.trackX, y);
  }

  createImages(x, y) {
    const path = TOGGLE_PATH;
    const knobY = y + KNOB_GAP;
    this.trackOn = new HudImage(x, y, TRACK_WIDTH, HEIGHT, path + "on.png");
    this.trackOff = new HudImage(x, y, TRACK_WIDTH, HEIGHT, path + "off.png");
    this.knob = new HudImage(x, knobY, KNOB_SIZE, KNOB_SIZE, path + "knob.png");
  }

  contains(x, y) {
    const inside = x >= this.x - PADDING && x <= this.x + this.width + PADDING;
    return inside && y >= this.y - PADDING && y <= this.y + HEIGHT + PADDING;
  }

  update(delta) {
    const step = delta / SLIDE_TIME;
    if (this.on) this.slide = Math.min(this.slide + step, 1);
    else this.slide = Math.max(this.slide - step, 0);
    this.knob.x = this.trackX + KNOB_GAP + this.slide * KNOB_TRAVEL;
  }

  draw(ctx) {
    this.label.color = "white";
    if (this.selected) this.label.color = TITLE_COLOR;
    if (this.slide > 0.5) this.trackOn.draw(ctx);
    else this.trackOff.draw(ctx);
    this.knob.draw(ctx);
    this.label.draw(ctx);
  }
}
