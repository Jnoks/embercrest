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
    this.speed = 15 + Math.random() * 25;
    this.animations = {
      walk: new SpriteAnimation(GOBLIN_PATH, "walk", 6, 0.2),
    };
    this.setAnimation(this.animations.walk);
    this.frameTimer = -Math.random() * this.currentAnimation.cycleDuration();
  }

  update(delta) {
    this.animate(delta);
    this.moveLeft(delta);
  }
}
