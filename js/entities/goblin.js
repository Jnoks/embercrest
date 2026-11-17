import Enemy from "./enemy.js";
import SpriteAnimation from "../sprite-animation.js";

const GOBLIN_PATH = "./assets/images/goblin/";

export default class Goblin extends Enemy {
  constructor(x, y) {
    super(x, y, 128, 128);
    this.anchorY = 89;
    this.hitboxWidth = 36;
    this.hitboxHeight = 44;
    this.facingLeft = true;
    this.maxHealth = 30;
    this.health = this.maxHealth;
    this.speed = 15 + Math.random() * 25;
    this.hitFrame = 2;
    this.attackReach = 30;
    this.sightRange = 400;
    this.stopDistance = 50;
    this.attackCooldown = 1.5;
    this.animations = {
      walk: new SpriteAnimation(GOBLIN_PATH, "walk", 6, 0.2),
      attack: new SpriteAnimation(GOBLIN_PATH, "attack", 5, 0.1, {
        loop: false,
      }),
      idle: new SpriteAnimation(GOBLIN_PATH, "idle", 4, 0.2),
      hurt: new SpriteAnimation(GOBLIN_PATH, "hurt", 3, 0.1, { loop: false }),
      death: new SpriteAnimation(GOBLIN_PATH, "death", 4, 0.15, {
        loop: false,
      }),
    };
    this.setAnimation(this.animations.walk);
    this.frameTimer = -Math.random() * this.currentAnimation.cycleDuration();
  }
}
