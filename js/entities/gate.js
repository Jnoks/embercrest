import MovableObject from "./movable-object.js";
import DrawableObject from "./drawable-object.js";

const GATE_PATH = "./assets/images/forest/objects/";
const GATE_SIZE = 128;

export default class Gate extends MovableObject {
  constructor(centerX, y) {
    super(centerX - GATE_SIZE / 2, y, GATE_SIZE, GATE_SIZE);
    this.anchorY = 102;
    this.hitboxWidth = 20;
    this.hitboxHeight = 60;
    this.open = false;
    this.loadImage(GATE_PATH + "thorn-gate.png");
    this.vines = new DrawableObject(this.x, y, GATE_SIZE, GATE_SIZE);
    this.vines.anchorY = this.anchorY;
    this.vines.loadImage(GATE_PATH + "thorn-gate-vines.png");
  }

  draw(ctx) {
    super.draw(ctx);
    if (!this.open) this.vines.draw(ctx);
  }
}
