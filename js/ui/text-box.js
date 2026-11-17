import HudImage from "./hud-image.js";
import Label from "./label.js";

const UI_PATH = "./assets/images/ui/";
const CENTER_X = 480;
const CENTER_Y = 262;
const TEXT_WIDTH = 420;
const LINE_HEIGHT = 34;
const TEXT_FONT = "bold 24px Silkscreen, monospace";
const TEXT_COLOR = "#52402b";
const TITLE_COLOR = "#282c0c";
const LIGHT_COLOR = "#ffc300";
const DIM_COLOR = "rgba(0, 0, 0, 0.6)";
const SPEED = 30;

export default class TextBox {
  constructor(title, pages, hint) {
    this.images = [
      new HudImage(201, 90, 559, 376, UI_PATH + "window-background.png"),
      new HudImage(187, 75, 587, 405, UI_PATH + "window-border.png"),
      new HudImage(295, 50, 370, 63, UI_PATH + "window-ribbon.png"),
      new HudImage(232, 120, 495, 310, UI_PATH + "parchment.png"),
      new HudImage(688, 395, 66, 66, UI_PATH + "play-button.png"),
    ];
    this.title = new Label(title, CENTER_X, 80, 16, TITLE_COLOR, LIGHT_COLOR);
    this.hint = new Label(hint, CENTER_X, 506, 16, "white", "black");
    this.pages = pages;
    this.page = 0;
    this.shown = 0;
  }

  update(delta) {
    const length = this.pages[this.page].length;
    this.shown = Math.min(this.shown + SPEED * delta, length);
  }

  isDone() {
    return this.page === this.pages.length;
  }

  next() {
    const length = this.pages[this.page].length;
    if (this.shown < length) {
      this.shown = length;
      return;
    }
    this.page += 1;
    this.shown = 0;
  }

  skip() {
    this.page = this.pages.length;
  }

  draw(ctx) {
    ctx.fillStyle = DIM_COLOR;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (let i = 0; i < this.images.length; i++) {
      this.images[i].draw(ctx);
    }
    this.title.draw(ctx);
    this.hint.draw(ctx);
    this.drawText(ctx);
  }

  drawText(ctx) {
    ctx.font = TEXT_FONT;
    ctx.fillStyle = TEXT_COLOR;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    const lines = this.wrap(ctx, this.pages[this.page]);
    const top = CENTER_Y - ((lines.length - 1) * LINE_HEIGHT) / 2;
    let remaining = Math.floor(this.shown);
    for (let i = 0; i < lines.length && remaining > 0; i++) {
      const x = Math.round(CENTER_X - ctx.measureText(lines[i]).width / 2);
      ctx.fillText(lines[i].slice(0, remaining), x, top + i * LINE_HEIGHT);
      remaining -= lines[i].length + 1;
    }
  }

  wrap(ctx, text) {
    const words = text.split(" ");
    const lines = [words[0]];
    for (let i = 1; i < words.length; i++) {
      const last = lines.length - 1;
      const longer = lines[last] + " " + words[i];
      if (ctx.measureText(longer).width > TEXT_WIDTH) lines.push(words[i]);
      else lines[last] = longer;
    }
    return lines;
  }
}
