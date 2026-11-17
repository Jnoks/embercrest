import SpriteAnimation from "../sprite-animation.js";
import Projectile from "./projectile.js";

const BOLT_PATH = "./assets/images/bolt/";
const BOLT_SIZE = 32;
const BOLT_ANIMATIONS = {
  fly: new SpriteAnimation(BOLT_PATH, "fly", 4, 0.08),
  hit: new SpriteAnimation(BOLT_PATH, "hit", 5, 0.06, { loop: false }),
};

export default class Bolt extends Projectile {
  constructor(centerX, y, facingLeft) {
    super(centerX, y, BOLT_SIZE, BOLT_SIZE, facingLeft);
    this.anchorY = 29;
    this.hitboxWidth = 24;
    this.hitboxHeight = 8;
    this.damage = 10;
    this.speed = 400;
    this.range = 400;
    this.animations = BOLT_ANIMATIONS;
    this.setAnimation(this.animations.fly);
  }
}
