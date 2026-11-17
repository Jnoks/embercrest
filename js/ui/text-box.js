import HudImage from "./hud-image.js";
import Label from "./label.js";
import Key from "./key.js";
import { UI_TEXT } from "../data/story.js";

const UI_PATH = "./assets/images/ui/";
const HUD_PATH = "./assets/images/hud/";
const CENTER_X = 480;
const CENTER_Y = 262;
const TEXT_WIDTH = 420;
const LINE_HEIGHT = 34;
const TEXT_FONT = "24px Silkscreen, monospace";
const TEXT_COLOR = "#52402b";
const TITLE_COLOR = "#282c0c";
const LIGHT_COLOR = "#ffc300";
const DIM_COLOR = "rgba(0, 0, 0, 0.6)";
const SPEED = 30;
const READ_TIME = 0.5;
const WINDOW = [
  new HudImage(201, 90, 559, 376, UI_PATH + "window-background.png"),
  new HudImage(187, 75, 587, 405, UI_PATH + "window-border.png"),
  new HudImage(295, 50, 370, 63, UI_PATH + "window-ribbon.png"),
  new HudImage(232, 120, 495, 310, UI_PATH + "parchment.png"),
  new HudImage(688, 395, 66, 66, UI_PATH + "play-button.png"),
];
const HINTS = [
  new Key(343, 494, "Space", 72, 24),
  new Label(UI_TEXT.nextPage, 449, 506, 16, "white", "black"),
  new Key(499, 494, "Esc", 48, 24),
  new Label(UI_TEXT.closePage, 586, 506, 16, "white", "black"),
];

export default class TextBox {
  constructor(title, pages, portrait) {
    this.title = new Label(title, CENTER_X, 80, 16, TITLE_COLOR, LIGHT_COLOR);
    this.portrait = this.createPortrait(portrait);
    this.pages = pages;
    this.page = 0;
    this.shown = 0;
    this.time = 0;
    this.seen = false;
  }

  createPortrait(path) {
    if (!path) return [];
    return [
      new HudImage(199, 87, 70, 66, HUD_PATH + "portrait-background.png"),
      new HudImage(202, 88, 64, 64, path),
      new HudImage(198, 85, 72, 71, HUD_PATH + "portrait-frame.png"),
    ];
  }

  update(delta) {
    const length = this.pages[this.page].length;
    this.shown = Math.min(this.shown + SPEED * delta, length);
    this.time += delta;
  }

  restart() {
    this.page = 0;
    this.shown = 0;
    this.time = 0;
  }

  isDone() {
    return this.page === this.pages.length;
  }

  next() {
    if (this.time < READ_TIME) return;
    const length = this.pages[this.page].length;
    if (this.shown < length) {
      this.shown = length;
      return;
    }
    this.page += 1;
    this.shown = 0;
    this.time = 0;
  }

  draw(ctx) {
    ctx.fillStyle = DIM_COLOR;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.drawParts(ctx, WINDOW);
    this.drawParts(ctx, this.portrait);
    this.drawParts(ctx, HINTS);
    this.title.draw(ctx);
    this.drawText(ctx);
  }

  drawParts(ctx, parts) {
    for (let i = 0; i < parts.length; i++) {
      parts[i].draw(ctx);
    }
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
