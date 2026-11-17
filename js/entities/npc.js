import Figure from "./figure.js";
import DrawableObject from "./drawable-object.js";
import Key from "../ui/key.js";
import Label from "../ui/label.js";
import { UI_TEXT } from "../data/story.js";

const MARKER_IMAGE = "./assets/images/ui/quest-marker.png";
const MARKER_WIDTH = 14;
const MARKER_HEIGHT = 33;
const MARKER_Y = 92;
const KEY_SIZE = 24;
const KEY_X = 41;
const KEY_Y = 12;
const HINT_X = 15;

export default class Npc extends Figure {
  constructor(name, frames, centerX, y) {
    super(name, frames, centerX, y);
    const x = centerX - MARKER_WIDTH / 2;
    const top = y - MARKER_Y;
    const hintX = centerX + HINT_X;
    const hintY = y + KEY_Y + KEY_SIZE / 2;
    this.marker = new DrawableObject(x, top, MARKER_WIDTH, MARKER_HEIGHT);
    this.marker.loadImage(MARKER_IMAGE);
    this.key = new Key(centerX - KEY_X, y + KEY_Y, "E", KEY_SIZE, KEY_SIZE);
    this.hint = new Label(UI_TEXT.talk, hintX, hintY, 16, "white", "black");
    this.marked = false;
    this.near = false;
  }

  draw(ctx) {
    super.draw(ctx);
    if (this.marked) this.marker.draw(ctx);
    if (this.near) this.drawPrompt(ctx);
  }

  drawPrompt(ctx) {
    this.key.draw(ctx);
    this.hint.draw(ctx);
  }
}
