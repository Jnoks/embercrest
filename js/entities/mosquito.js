import Enemy from "./enemy.js";
import SpriteAnimation from "../sprite-animation.js";
import { SHOUTS } from "../data/story.js";

const MOSQUITO_PATH = "./assets/images/mosquito/";
const MOSQUITO_SIZE = 128;
const DIVE_SPEED = 260;
const RETURN_SPEED = 110;
const DIVE_PAUSE = 1.5;

export default class Mosquito extends Enemy {
  constructor(centerX, centerY) {
    super(centerX - 62, centerY + 18, MOSQUITO_SIZE, MOSQUITO_SIZE);
    this.anchorX = 62;
    this.anchorY = 82;
    this.hitboxWidth = 36;
    this.hitboxHeight = 36;
    this.facingLeft = true;
    this.maxHealth = 10;
    this.health = this.maxHealth;
    this.sightRange = 230;
    this.homeX = centerX;
    this.homeY = this.y;
    this.diveX = 0;
    this.diveY = 0;
    this.diving = false;
    this.greetings = SHOUTS.mosquito;
    this.animations = this.createAnimations();
    this.setAnimation(this.animations.idle);
  }

  createAnimations() {
    const once = { loop: false };
    return {
      idle: new SpriteAnimation(MOSQUITO_PATH, "idle", 3, 0.08),
      fly: new SpriteAnimation(MOSQUITO_PATH, "fly", 3, 0.08),
      dive: new SpriteAnimation(MOSQUITO_PATH, "dive", 3, 0.08),
      hurt: new SpriteAnimation(MOSQUITO_PATH, "hurt", 3, 0.1, once),
      death: new SpriteAnimation(MOSQUITO_PATH, "death", 4, 0.12, once),
    };
  }

  chase(delta) {
    if (this.diving) this.dive(delta);
    else if (this.canDive()) this.startDive();
    else this.flyHome(delta);
  }

  canDive() {
    const below = this.targetY > this.centerY();
    return below && this.isHome() && this.seesTarget() && !this.isOnCooldown();
  }

  startDive() {
    this.diving = true;
    this.diveX = this.targetX;
    this.diveY = this.targetY + this.hitboxHeight / 2;
    this.facingLeft = this.diveX < this.centerX();
    this.setAnimation(this.animations.dive);
  }

  dive(delta) {
    this.speed = DIVE_SPEED;
    this.flyTo(this.diveX, this.diveY, delta);
    if (this.isAt(this.diveX, this.diveY)) this.endDive();
  }

  endDive() {
    this.diving = false;
    this.cooldownTimer = DIVE_PAUSE;
  }

  flyHome(delta) {
    this.speed = RETURN_SPEED;
    this.flyTo(this.homeX, this.homeY, delta);
    if (this.isHome()) this.setAnimation(this.animations.idle);
    else this.setAnimation(this.animations.fly);
  }

  isHome() {
    return this.isAt(this.homeX, this.homeY);
  }

  isAt(x, y) {
    return Math.abs(this.centerX() - x) < 1 && Math.abs(this.y - y) < 1;
  }

  flyTo(x, y, delta) {
    const distanceX = x - this.centerX();
    const distanceY = y - this.y;
    const distance = Math.hypot(distanceX, distanceY);
    if (distance === 0) return;
    const step = Math.min(this.speed * delta, distance);
    this.x += (distanceX / distance) * step;
    this.y += (distanceY / distance) * step;
  }

  attack() {}

  isHitting() {
    return this.diving && !this.isDead();
  }

  isVisible() {
    if (this.isGone()) return false;
    return super.isVisible();
  }
}
