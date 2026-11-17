import Figure from "./figure.js";
import DrawableObject from "./drawable-object.js";
import Label from "../ui/label.js";
import { UI_TEXT } from "../data/story.js";

const MARKER_IMAGE = "./assets/images/ui/quest-marker.png";
const MARKER_WIDTH = 14;
const MARKER_HEIGHT = 33;
const MARKER_Y = 92;
const HINT_Y = 104;
const HINT = `E ${UI_TEXT.talk}`;

export default class Npc extends Figure {
  constructor(name, frames, centerX, y) {
    super(name, frames, centerX, y);
    const x = centerX - MARKER_WIDTH / 2;
    const top = y - MARKER_Y;
    this.marker = new DrawableObject(x, top, MARKER_WIDTH, MARKER_HEIGHT);
    this.marker.loadImage(MARKER_IMAGE);
    this.hint = new Label(HINT, centerX, y - HINT_Y, 8, "white", "black");
    this.marked = false;
    this.near = false;
  }

  draw(ctx) {
    super.draw(ctx);
    if (this.marked) this.marker.draw(ctx);
    if (this.marked && this.near) this.hint.draw(ctx);
  }
}
