import MovableObject from "./movable-object.js";
import SpriteAnimation from "../sprite-animation.js";

const MAGE_PATH = "./assets/images/mage/";

export default class Character extends MovableObject {
  constructor(x, y, keyboard) {
    super(x, y, 128, 128);
    this.anchorY = 111;
    this.anchorX = 47;
    this.hitboxWidth = 30;
    this.hitboxHeight = 50;
    this.keyboard = keyboard;
    this.speed = 150;
    this.jumpSpeed = 700;
    this.animations = {
      idle: new SpriteAnimation(MAGE_PATH, "idle", 14, 0.2, 2),
      run: new SpriteAnimation(MAGE_PATH, "run", 8, 0.08),
      jump: new SpriteAnimation(MAGE_PATH, "jump", 7, 0.1),
      hurt: new SpriteAnimation(MAGE_PATH, "hurt", 4, 0.1),
    };

    this.setAnimation(this.animations.idle);
  }

  update(delta) {
    this.handleInput(delta);
    if (this.isHurt()) this.setAnimation(this.animations.hurt);
    else if (!this.onGround) this.setAnimation(this.animations.jump);
    else if (this.keyboard.left || this.keyboard.right)
      this.setAnimation(this.animations.run);
    else this.setAnimation(this.animations.idle);

    this.updateTimers(delta);
    this.applyGravity(delta);
    this.animate(delta);
  }

  handleInput(delta) {
    if (this.isHurt() || this.isDead()) return;
    if (this.keyboard.right) {
      this.moveRight(delta);
      this.facingLeft = false;
    }
    if (this.keyboard.left) {
      this.moveLeft(delta);
      this.facingLeft = true;
    }
    if (this.keyboard.jump) {
      this.jump();
    }
  }
}
