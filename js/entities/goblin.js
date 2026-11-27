import Enemy from "./enemy.js";
import SpriteAnimation from "../sprite-animation.js";
import { SHOUTS } from "../data/story.js";

const GOBLIN_PATH = "./assets/images/goblin/";
const GOBLIN_SIZE = 128;

export default class Goblin extends Enemy {
  constructor(centerX, y, path = GOBLIN_PATH) {
    super(centerX - GOBLIN_SIZE / 2, y, GOBLIN_SIZE, GOBLIN_SIZE);
    this.setBody();
    this.setStats();
    this.kind = "goblin";
    this.greetings = SHOUTS.goblin;
    this.cry = "goblin";
    this.animations = this.createAnimations(path);
    this.setAnimation(this.animations.walk);
    this.frameTimer = -Math.random() * this.currentAnimation.cycleDuration();
  }

  setBody() {
    this.anchorY = 89;
    this.hitboxWidth = 36;
    this.hitboxHeight = 44;
    this.facingLeft = true;
  }

  setStats() {
    this.maxHealth = 40;
    this.health = this.maxHealth;
    this.damage = 15;
    this.speed = 85 + Math.random() * 20;
    this.hurtDuration = 0.1;
    this.hitFrame = 2;
    this.attackReach = 30;
    this.sightRange = 400;
    this.stopDistance = 50;
    this.attackCooldown = 1;
  }

  createAnimations(path) {
    const once = { loop: false };
    return {
      walk: new SpriteAnimation(path, "walk", 6, 0.12),
      attack: new SpriteAnimation(path, "attack", 5, 0.1, once),
      idle: new SpriteAnimation(path, "idle", 4, 0.2),
      hurt: new SpriteAnimation(path, "hurt", 3, 0.1, once),
      death: new SpriteAnimation(path, "death", 4, 0.15, once),
    };
  }
}
