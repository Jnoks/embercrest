import MovableObject from "./movable-object.js";
import SpriteAnimation from "../sprite-animation.js";

const MAGE_PATH = "./assets/images/mage/";

export default class Character extends MovableObject {
  constructor(x, y, keyboard) {
    super(x, y, 128, 128);
    this.anchorY = 111;
    this.keyboard = keyboard;
    this.speed = 150;
    this.idle = new SpriteAnimation(MAGE_PATH, "idle", 14, 0.2, 2);
    this.run = new SpriteAnimation(MAGE_PATH, "run", 8, 0.08);
    this.setAnimation(this.idle);
  }

  update(delta) {
    if (this.keyboard.right) {
      this.moveRight(delta);
      this.facingLeft = false;
    }
    if (this.keyboard.left) {
      this.moveLeft(delta);
      this.facingLeft = true;
    }
    if (this.keyboard.left || this.keyboard.right) this.setAnimation(this.run);
    else this.setAnimation(this.idle);
    this.animate(delta);
  }
}
