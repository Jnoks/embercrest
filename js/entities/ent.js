import Enemy from "./enemy.js";
import SpriteAnimation from "../sprite-animation.js";
import { SHOUTS } from "../data/story.js";

const ENT_PATH = "./assets/images/ent/";
const ENT_SIZE = 256;
const WAKE_RANGE = 170;
const BRANCH_HEIGHT = 40;

export default class Ent extends Enemy {
  constructor(centerX, y) {
    super(centerX - 117, y, ENT_SIZE, ENT_SIZE);
    this.setBody();
    this.setStats();
    this.greetings = SHOUTS.ent;
    this.cry = "ent";
    this.animations = this.createAnimations();
    this.setAnimation(this.animations.idle);
  }

  setBody() {
    this.anchorX = 117;
    this.anchorY = 180;
    this.hitboxWidth = 56;
    this.hitboxHeight = 96;
    this.facingLeft = true;
  }

  setStats() {
    this.maxHealth = 80;
    this.health = this.maxHealth;
    this.speed = 25;
    this.damage = 25;
    this.hitFrame = 2;
    this.attackReach = 100;
    this.sightRange = WAKE_RANGE;
    this.stopDistance = 110;
    this.attackCooldown = 2;
    this.hurtDuration = 0.2;
  }

  createAnimations() {
    const once = { loop: false };
    return {
      idle: new SpriteAnimation(ENT_PATH, "idle", 4, 0.3),
      walk: new SpriteAnimation(ENT_PATH, "walk", 6, 0.2),
      attack: new SpriteAnimation(ENT_PATH, "attack", 5, 0.15, once),
      hurt: new SpriteAnimation(ENT_PATH, "hurt", 3, 0.07, once),
      death: new SpriteAnimation(ENT_PATH, "death", 7, 0.15, once),
    };
  }

  attackBox() {
    const box = super.attackBox();
    box.top = this.y - BRANCH_HEIGHT;
    return box;
  }
}
