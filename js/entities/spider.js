import Enemy from "./enemy.js";
import SpriteAnimation from "../sprite-animation.js";
import Web from "./web.js";
import { SHOUTS } from "../data/story.js";

const SPIDER_PATH = "./assets/images/spider/";
const SPIDER_SIZE = 128;
const SPIT_HEIGHT = 40;
const MOUTH_REACH = 34;
const MOUTH_HEIGHT = 10;

export default class Spider extends Enemy {
  constructor(centerX, y) {
    super(centerX - SPIDER_SIZE / 2, y, SPIDER_SIZE, SPIDER_SIZE);
    this.anchorY = 87;
    this.hitboxWidth = 50;
    this.hitboxHeight = 36;
    this.facingLeft = true;
    this.maxHealth = 20;
    this.health = this.maxHealth;
    this.hitFrame = 1;
    this.attackReach = 10;
    this.sightRange = 512;
    this.attackCooldown = 1.5;
    this.shotCooldown = 2.5;
    this.releaseFrame = 1;
    this.greetings = SHOUTS.spider;
    this.cry = "spider";
    this.animations = this.createAnimations();
    this.setAnimation(this.animations.idle);
  }

  createAnimations() {
    const once = { loop: false };
    return {
      idle: new SpriteAnimation(SPIDER_PATH, "idle", 4, 0.2),
      attack: new SpriteAnimation(SPIDER_PATH, "attack", 3, 0.12, once),
      hurt: new SpriteAnimation(SPIDER_PATH, "hurt", 3, 0.1, once),
      death: new SpriteAnimation(SPIDER_PATH, "death", 4, 0.15, once),
    };
  }

  chase(delta) {
    if (this.seesTarget()) this.facingLeft = this.targetX < this.centerX();
    if (this.canSpit()) this.shoot();
    else this.setAnimation(this.animations.idle);
  }

  canSpit() {
    const level = Math.abs(this.targetY - this.centerY()) < SPIT_HEIGHT;
    return level && this.seesTarget() && !this.isOnCooldown();
  }

  createShot() {
    let x = this.centerX() + MOUTH_REACH;
    if (this.facingLeft) x = this.centerX() - MOUTH_REACH;
    return new Web(x, this.y - MOUTH_HEIGHT, this.facingLeft);
  }
}
