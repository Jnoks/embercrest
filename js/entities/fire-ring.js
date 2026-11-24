import SpriteAnimation from "../sprite-animation.js";
import Projectile from "./projectile.js";

const RING_PATH = "./assets/images/fire-ring/";
const RING_SIZE = 64;
const RING_ANIMATIONS = {
  fly: new SpriteAnimation(RING_PATH, "fly", 3, 0.1),
  hit: new SpriteAnimation(RING_PATH, "hit", 2, 0.08, { loop: false }),
};

export default class FireRing extends Projectile {
  constructor(centerX, y, facingLeft) {
    super(centerX, y, RING_SIZE, RING_SIZE, facingLeft);
    this.anchorY = 46;
    this.hitboxWidth = 28;
    this.hitboxHeight = 28;
    this.damage = 15;
    this.speed = 140;
    this.range = 600;
    this.animations = RING_ANIMATIONS;
    this.setAnimation(this.animations.fly);
  }

  aimAt(x, y) {
    const distanceX = x - this.centerX();
    const distanceY = y - this.y;
    const distance = Math.hypot(distanceX, distanceY);
    this.velocityY = (this.speed * distanceY) / distance;
    this.speed = (this.speed * Math.abs(distanceX)) / distance;
  }
}
