import MovableObject from "./movable-object.js";
import Effect from "./effect.js";
import SpriteAnimation from "../sprite-animation.js";

const OBJECT_PATH = "./assets/images/forest/objects/";
const SIGNS = new SpriteAnimation(OBJECT_PATH, "sign", 2, 0);
const STAR = new SpriteAnimation(OBJECT_PATH, "star", 10, 0.06, {
  loop: false,
});
const SIGN_SIZE = 32;
const STAR_SIZE = 32;
const STAR_HEIGHT = 40;

export default class Checkpoint extends MovableObject {
  constructor(centerX, y) {
    super(centerX - SIGN_SIZE / 2, y, SIGN_SIZE, SIGN_SIZE);
    this.anchorY = 29;
    this.hitboxWidth = 24;
    this.hitboxHeight = 48;
    this.setActive(false);
  }

  setActive(active) {
    this.active = active;
    this.img = SIGNS.frames[0];
    if (active) this.img = SIGNS.frames[1];
  }

  createEffect() {
    const centerY = this.y - STAR_HEIGHT;
    return new Effect(this.centerX(), centerY, STAR_SIZE, STAR);
  }
}
