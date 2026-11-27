import Enemy from "./enemy.js";
import SpriteAnimation from "../sprite-animation.js";
import FireRing from "./fire-ring.js";
import { SHOUTS } from "../data/story.js";

const BEHOLDER_PATH = "./assets/images/beholder/";
const BEHOLDER_SIZE = 128;
const EYE_REACH = 24;
const RING_HEIGHT = 14;

export default class Beholder extends Enemy {
  constructor(centerX, centerY) {
    super(centerX - 50, centerY + 25, BEHOLDER_SIZE, BEHOLDER_SIZE);
    this.setBody();
    this.maxHealth = 40;
    this.health = this.maxHealth;
    this.sightRange = 576;
    this.shotCooldown = 2.5;
    this.releaseFrame = 1;
    this.kind = "beholder";
    this.greetings = SHOUTS.beholder;
    this.cry = "beholder";
    this.animations = this.createAnimations();
    this.setAnimation(this.animations.idle);
  }

  setBody() {
    this.anchorX = 50;
    this.anchorY = 87;
    this.hitboxWidth = 44;
    this.hitboxHeight = 50;
    this.facingLeft = true;
  }

  createAnimations() {
    const once = { loop: false };
    return {
      idle: new SpriteAnimation(BEHOLDER_PATH, "idle", 4, 0.2),
      attack: new SpriteAnimation(BEHOLDER_PATH, "attack", 4, 0.12, once),
      hurt: new SpriteAnimation(BEHOLDER_PATH, "hurt", 5, 0.08, once),
      death: new SpriteAnimation(BEHOLDER_PATH, "death", 5, 0.12, once),
    };
  }

  chase(delta) {
    if (this.seesTarget()) this.facingLeft = this.targetX < this.centerX();
    if (this.seesTarget() && !this.isOnCooldown()) this.shoot();
    else this.setAnimation(this.animations.idle);
  }

  createShot() {
    let x = this.centerX() + EYE_REACH;
    if (this.facingLeft) x = this.centerX() - EYE_REACH;
    const y = this.centerY() + RING_HEIGHT;
    const ring = new FireRing(x, y, this.targetX < x);
    ring.aimAt(this.targetX, this.targetY + RING_HEIGHT);
    return ring;
  }

  attack() {}

  isHitting() {
    return false;
  }

  isVisible() {
    if (this.isGone()) return false;
    return super.isVisible();
  }
}
