import SpriteAnimation from "../sprite-animation.js";
import Projectile from "./projectile.js";

const WEB_PATH = "./assets/images/web/";
const WEB_SIZE = 64;
const WEB_ANIMATIONS = {
  fly: new SpriteAnimation(WEB_PATH, "fly", 3, 0.08, { loop: false }),
  hit: new SpriteAnimation(WEB_PATH, "hit", 2, 0.1, { loop: false }),
};

export default class Web extends Projectile {
  constructor(centerX, y, facingLeft) {
    super(centerX, y, WEB_SIZE, WEB_SIZE, facingLeft);
    this.anchorY = 43;
    this.hitboxWidth = 24;
    this.hitboxHeight = 24;
    this.damage = 5;
    this.slowTime = 2;
    this.speed = 240;
    this.range = 512;
    this.animations = WEB_ANIMATIONS;
    this.setAnimation(this.animations.fly);
  }
}
