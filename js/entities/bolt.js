import MovableObject from "./movable-object.js";
import SpriteAnimation from "../sprite-animation.js";

const BOLT_PATH = "./assets/images/bolt/";
const BOLT_SIZE = 32;
const BOLT_SPEED = 400;
const BOLT_RANGE = 400;

export default class Bolt extends MovableObject {
  constructor(centerX, y, facingLeft) {
    super(centerX - BOLT_SIZE / 2, y, BOLT_SIZE, BOLT_SIZE);
    this.anchorY = 29;
    this.facingLeft = facingLeft;
    this.speed = BOLT_SPEED;
    this.distance = 0;
    this.done = false;
    this.animations = {
      fly: new SpriteAnimation(BOLT_PATH, "fly", 4, 0.08),
      hit: new SpriteAnimation(BOLT_PATH, "hit", 5, 0.06, { loop: false }),
    };
    this.setAnimation(this.animations.fly);
  }

  update(delta) {
    this.animate(delta);
    if (!this.isExploding()) this.fly(delta);
    if (this.isExploding() && this.isAnimationFinished()) this.done = true;
  }

  fly(delta) {
    if (this.facingLeft) this.moveLeft(delta);
    else this.moveRight(delta);
    this.distance += this.speed * delta;
    if (this.distance > BOLT_RANGE) this.explode();
  }

  explode() {
    this.setAnimation(this.animations.hit);
  }

  isExploding() {
    return this.currentAnimation === this.animations.hit;
  }
}
