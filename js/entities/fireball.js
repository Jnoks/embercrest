import Projectile from "./projectile.js";
import SpriteAnimation from "../sprite-animation.js";

const FIREBALL_PATH = "./assets/images/fireball/";
const FIREBALL_SIZE = 256;
const BLAST_WIDTH = 110;
const BLAST_HEIGHT = 60;
const LAST_BLAST_FRAME = 2;
const FIREBALL_ANIMATIONS = {
  fly: new SpriteAnimation(FIREBALL_PATH, "fly", 3, 0.08),
  hit: new SpriteAnimation(FIREBALL_PATH, "hit", 7, 0.1, { loop: false }),
};

export default class Fireball extends Projectile {
  constructor(centerX, y, facingLeft) {
    super(centerX, y, FIREBALL_SIZE, FIREBALL_SIZE, facingLeft);
    this.anchorY = 134;
    this.hitboxWidth = 40;
    this.hitboxHeight = 16;
    this.damage = 25;
    this.speed = 220;
    this.range = 900;
    this.animations = FIREBALL_ANIMATIONS;
    this.setAnimation(this.animations.fly);
  }

  explode() {
    super.explode();
    this.hitboxWidth = BLAST_WIDTH;
    this.hitboxHeight = BLAST_HEIGHT;
  }

  isHitting() {
    return !this.isExploding() || this.frameIndex <= LAST_BLAST_FRAME;
  }
}
