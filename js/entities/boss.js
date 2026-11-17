import Enemy from "./enemy.js";
import SpriteAnimation from "../sprite-animation.js";

const BOSS_PATH = "./assets/images/boss/";

export default class Boss extends Enemy {
  constructor(x, y) {
    super(x, y, 256, 256);
    this.anchorY = 207;
    this.anchorX = 99;
    this.hitboxWidth = 60;
    this.hitboxHeight = 100;
    this.facingLeft = true;
    this.maxHealth = 240;
    this.health = this.maxHealth;
    this.speed = 60;
    this.damage = 20;
    this.hitFrame = 3;
    this.attackReach = 120;
    this.sightRange = 500;
    this.stopDistance = 90;
    this.attackCooldown = 2;
    this.hurtDuration = 0.2;
    this.animations = {
      idle: new SpriteAnimation(BOSS_PATH, "idle", 3, 0.3, { loopPause: 1 }),
      walk: new SpriteAnimation(BOSS_PATH, "walk", 6, 0.15),
      attack: new SpriteAnimation(BOSS_PATH, "attack", 7, 0.1, {
        loop: false,
      }),
      hurt: new SpriteAnimation(BOSS_PATH, "hurt", 2, 0.1, { loop: false }),
      death: new SpriteAnimation(BOSS_PATH, "death", 6, 0.15, {
        loop: false,
      }),
    };
    this.setAnimation(this.animations.idle);
  }

  takeDamage(amount) {
    super.takeDamage(amount);
    if (this.isAttacking()) this.hurtTimer = 0;
  }
}
