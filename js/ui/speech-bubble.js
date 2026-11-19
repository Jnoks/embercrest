import DrawableObject from "../entities/drawable-object.js";
import SpriteAnimation from "../sprite-animation.js";

const UI_PATH = "./assets/images/ui/";
const BUBBLES = new SpriteAnimation(UI_PATH, "speech-bubble", 2, 0);
const WIDTH = 128;
const HEIGHTS = [57, 77];
const TEXT_Y = 15;
const LINE_HEIGHT = 20;
const TEXT_FONT = "16px Silkscreen, monospace";
const TEXT_COLOR = "#2b2118";
const DURATION = 2.2;

export default class SpeechBubble extends DrawableObject {
  constructor() {
    super(0, 0, WIDTH, HEIGHTS[0]);
    this.lines = [];
    this.delay = 0;
    this.timer = 0;
  }

  say(lines, delay = 0) {
    this.img = BUBBLES.frames[lines.length - 1];
    this.height = HEIGHTS[lines.length - 1];
    this.lines = lines;
    this.delay = delay;
    this.timer = DURATION;
  }

  update(delta) {
    if (this.delay > 0) this.delay = Math.max(this.delay - delta, 0);
    else this.timer = Math.max(this.timer - delta, 0);
  }

  isVisible() {
    return this.delay === 0 && this.timer > 0;
  }

  pointAt(x, y, toLeft) {
    this.facingLeft = toLeft;
    this.x = x;
    if (toLeft) this.x = x - WIDTH;
    this.y = y - this.height;
  }

  draw(ctx) {
    if (!this.isVisible()) return;
    super.draw(ctx);
    ctx.font = TEXT_FONT;
    ctx.fillStyle = TEXT_COLOR;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    for (let i = 0; i < this.lines.length; i++) this.drawLine(ctx, i);
  }

  drawLine(ctx, i) {
    const width = ctx.measureText(this.lines[i]).width;
    const x = Math.round(this.x + (WIDTH - width) / 2);
    const y = Math.round(this.y + TEXT_Y + i * LINE_HEIGHT);
    ctx.fillText(this.lines[i], x, y);
  }
}
