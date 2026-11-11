import MovableObject from "./movable-object.js";
import SpriteAnimation from "../sprite-animation.js";

const BOSS_PATH = "./assets/images/boss/";

export default class Boss extends MovableObject {
  constructor(x, y) {
    super(x, y, 256, 256);
    this.anchorY = 207;
    this.anchorX = 82;
    this.facingLeft = true;
    this.setAnimation(new SpriteAnimation(BOSS_PATH, "idle", 3, 0.3, 1));
  }

  update(delta) {
    this.animate(delta);
  }
}
