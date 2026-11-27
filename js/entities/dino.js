import Enemy from "./enemy.js";
import SpriteAnimation from "../sprite-animation.js";
import { SHOUTS } from "../data/story.js";

const DINO_PATH = "./assets/images/dino/";
const DINO_SIZE = 128;
const TURN_TIME = 0.7;

export default class Dino extends Enemy {
  constructor(centerX, y) {
    super(centerX - 52, y, DINO_SIZE, DINO_SIZE);
    this.anchorX = 52;
    this.anchorY = 87;
    this.hitboxWidth = 70;
    this.hitboxHeight = 40;
    this.facingLeft = true;
    this.maxHealth = 40;
    this.health = this.maxHealth;
    this.speed = 190;
    this.damage = 20;
    this.hitFrame = 2;
    this.attackReach = 36;
    this.sightRange = 512;
    this.stopDistance = 40;
    this.attackCooldown = 1.2;
    this.hurtDuration = 0.1;
    this.turnTimer = 0;
    this.greetings = SHOUTS.dino;
    this.cry = "dino";
    this.animations = this.createAnimations();
    this.setAnimation(this.animations.idle);
  }

  createAnimations() {
    const once = { loop: false };
    return {
      idle: new SpriteAnimation(DINO_PATH, "idle", 4, 0.2),
      walk: new SpriteAnimation(DINO_PATH, "walk", 4, 0.08),
      attack: new SpriteAnimation(DINO_PATH, "attack", 5, 0.08, once),
      hurt: new SpriteAnimation(DINO_PATH, "hurt", 4, 0.08, once),
      death: new SpriteAnimation(DINO_PATH, "death", 6, 0.12, once),
    };
  }

  chase(delta) {
    if (this.isBehind()) {
      this.turn(delta);
    } else {
      this.turnTimer = 0;
      super.chase(delta);
    }
  }

  isBehind() {
    const left = this.targetX < this.centerX();
    return this.seesTarget() && left !== this.facingLeft;
  }

  turn(delta) {
    this.setAnimation(this.animations.idle);
    this.turnTimer += delta;
    if (this.turnTimer < TURN_TIME) return;
    this.turnTimer = 0;
    this.facingLeft = !this.facingLeft;
  }
}
