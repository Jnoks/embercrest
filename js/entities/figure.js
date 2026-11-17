import MovableObject from "./movable-object.js";
import SpriteAnimation from "../sprite-animation.js";

const IMAGE_PATH = "./assets/images/";
const FIGURE_SIZE = 128;

export default class Figure extends MovableObject {
  constructor(name, frames, centerX, y) {
    super(centerX - 47, y, FIGURE_SIZE, FIGURE_SIZE);
    this.anchorX = 47;
    this.anchorY = 111;
    this.hitboxWidth = 80;
    this.hitboxHeight = 60;
    this.path = IMAGE_PATH + name + "/";
    const options = { loopPause: 2 };
    const idle = new SpriteAnimation(this.path, "idle", frames, 0.2, options);
    this.animations.idle = idle;
    this.setAnimation(idle);
  }

  update(delta) {
    this.animate(delta);
  }
}
