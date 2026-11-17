import DrawableObject from "./drawable-object.js";
import SpriteAnimation from "../sprite-animation.js";

const IMAGE_PATH = "./assets/images/";
const FIGURE_SIZE = 128;

export default class Figure extends DrawableObject {
  constructor(name, frames, centerX, y) {
    super(centerX - 47, y, FIGURE_SIZE, FIGURE_SIZE);
    this.anchorX = 47;
    this.anchorY = 111;
    const path = IMAGE_PATH + name + "/";
    const options = { loopPause: 2 };
    this.setAnimation(new SpriteAnimation(path, "idle", frames, 0.2, options));
  }

  update(delta) {
    this.animate(delta);
  }
}
