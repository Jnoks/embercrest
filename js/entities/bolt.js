import MovableObject from "./movable-object.js";
import SpriteAnimation from "../sprite-animation.js";

const BOLT_PATH = "./assets/images/bolt/";
const BOLT_SIZE = 32;
const BOLT_SPEED = 400;

export default class Bolt extends MovableObject {
  constructor(centerX, y, facingLeft) {
    super(centerX - BOLT_SIZE / 2, y, BOLT_SIZE, BOLT_SIZE);
    this.anchorY = 29;
    this.facingLeft = facingLeft;
    this.speed = BOLT_SPEED;
    this.animations = {
      fly: new SpriteAnimation(BOLT_PATH, "fly", 4, 0.08),
    };
    this.setAnimation(this.animations.fly);
  }

  update(delta) {
    this.animate(delta);
    this.fly(delta);
  }

  fly(delta) {
    if (this.facingLeft) this.moveLeft(delta);
    else this.moveRight(delta);
  }
}
