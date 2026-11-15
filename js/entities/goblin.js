import Enemy from "./enemy.js";
import SpriteAnimation from "../sprite-animation.js";

const GOBLIN_PATH = "./assets/images/goblin/";
const HIT_FRAME = 2;
const ATTACK_REACH = 30;

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
      attack: new SpriteAnimation(GOBLIN_PATH, "attack", 5, 0.1, {
        loop: false,
      }),
    };
    this.setAnimation(this.animations.walk);
    this.frameTimer = -Math.random() * this.currentAnimation.cycleDuration();
  }

  update(delta) {
    this.updateTimers(delta);
    if (this.isAttacking()) {
      this.setAnimation(this.animations.attack);
    } else {
      this.chase(delta);
    }
    this.animate(delta);
  }

  chase(delta) {
    this.setAnimation(this.animations.walk);
    this.moveLeft(delta);
  }

  attack() {
    if (this.isAttacking()) return;
    this.attackTimer = this.animations.attack.cycleDuration();
  }

  isHitting() {
    return (
      this.currentAnimation === this.animations.attack &&
      this.frameIndex === HIT_FRAME
    );
  }

  attackBox() {
    const box = this.hitbox();
    if (this.facingLeft) box.left -= ATTACK_REACH;
    else box.right += ATTACK_REACH;
    return box;
  }
}
