import HudImage from "./hud-image.js";
import Label from "./label.js";
import Key from "./key.js";
import { UI_TEXT } from "../data/story.js";
import { voice } from "../voice.js";

const UI_PATH = "./assets/images/ui/";
const PORTRAIT_PATH = "./assets/images/hud/portrait-";
const CENTER_X = 480;
const LAYOUT = {
  centerX: 480,
  centerY: 262,
  width: 420,
  lineHeight: 34,
  font: "24px Silkscreen, monospace",
};
const TEXT_COLOR = "#52402b";
const TITLE_COLOR = "#282c0c";
const LIGHT_COLOR = "#ffc300";
const DIM_COLOR = "rgba(0, 0, 0, 0.6)";
const SPEED = 30;
const READ_TIME = 0.5;
const VOICE_DELAY = 0.25;
export const WINDOW = [
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
    this.portrait = this.createPortrait(portrait, 198, 85);
    this.window = WINDOW;
    this.layout = LAYOUT;
    this.dimColor = DIM_COLOR;
    this.speaker = title;
    this.spoken = false;
    this.pages = pages;
    this.page = 0;
    this.shown = 0;
    this.time = 0;
    this.seen = false;
  }

  createPortrait(path, x, y) {
    if (!path) return [];
    return [
      new HudImage(x + 1, y + 2, 70, 66, PORTRAIT_PATH + "background.png"),
      new HudImage(x + 4, y + 3, 64, 64, path),
      new HudImage(x, y, 72, 71, PORTRAIT_PATH + "frame.png"),
    ];
  }

  update(delta) {
    const length = this.pages[this.page].length;
    this.shown = Math.min(this.shown + SPEED * delta, length);
    this.time += delta;
    if (!this.spoken && this.time > VOICE_DELAY) this.speak();
  }

  speak() {
    this.spoken = true;
    voice.speak(this.pages[this.page], this.speaker);
  }

  restart() {
    this.page = 0;
    this.shown = 0;
    this.time = 0;
    this.spoken = false;
    voice.stop();
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
    this.spoken = false;
    voice.stop();
  }

  draw(ctx) {
    ctx.fillStyle = this.dimColor;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.drawParts(ctx, this.window);
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
    const layout = this.layout;
    ctx.font = layout.font;
    ctx.fillStyle = TEXT_COLOR;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    const lines = this.wrap(ctx, this.pages[this.page]);
    const top = layout.centerY - ((lines.length - 1) * layout.lineHeight) / 2;
    let remaining = Math.floor(this.shown);
    for (let i = 0; i < lines.length && remaining > 0; i++) {
      this.drawLine(ctx, lines[i].slice(0, remaining), lines[i], top, i);
      remaining -= lines[i].length + 1;
    }
  }

  drawLine(ctx, text, line, top, i) {
    const width = ctx.measureText(line).width;
    const x = Math.round(this.layout.centerX - width / 2);
    ctx.fillText(text, x, top + i * this.layout.lineHeight);
  }

  wrap(ctx, text) {
    const words = text.split(" ");
    const lines = [words[0]];
    for (let i = 1; i < words.length; i++) {
      const last = lines.length - 1;
      const longer = lines[last] + " " + words[i];
      const tooLong = ctx.measureText(longer).width > this.layout.width;
      if (tooLong) lines.push(words[i]);
      else lines[last] = longer;
    }
    return lines;
  }
}
