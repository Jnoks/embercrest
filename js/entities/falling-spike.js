import Trap from "./trap.js";
import SpriteAnimation from "../sprite-animation.js";
import { sound } from "../sound.js";

const SPIKE_PATH = "./assets/images/rock-spike/";
const SPIKE_SIZE = 128;
const HANG_HEIGHT = 43;
const TRIGGER_RANGE = 120;
const SHAKE_TIME = 0.35;
const SHAKE = 2;
const SPIKE_ANIMATIONS = {
  hang: new SpriteAnimation(SPIKE_PATH, "hang", 1, 0),
  break: new SpriteAnimation(SPIKE_PATH, "break", 7, 0.07, { loop: false }),
};

export default class FallingSpike extends Trap {
  constructor(centerX, top, floor) {
    super(centerX - SPIKE_SIZE / 2, top + HANG_HEIGHT, SPIKE_SIZE, SPIKE_SIZE);
    this.anchorY = 94;
    this.hitboxWidth = 16;
    this.hitboxHeight = 50;
    this.damage = 20;
    this.homeX = this.x;
    this.floor = floor;
    this.loose = false;
    this.shakeTimer = SHAKE_TIME;
    this.animations = SPIKE_ANIMATIONS;
    this.setAnimation(this.animations.hang);
  }

  update(delta) {
    if (this.isBroken()) this.crumble(delta);
    else if (this.shakeTimer === 0) this.fall(delta);
    else if (this.loose || this.isTriggered()) this.shake(delta);
  }

  isTriggered() {
    const distance = Math.abs(this.targetX - this.centerX());
    const below = this.targetY > this.y && this.targetY <= this.floor;
    return below && distance < TRIGGER_RANGE;
  }

  shake(delta) {
    if (!this.loose) sound.play("crack");
    this.loose = true;
    this.shakeTimer = Math.max(this.shakeTimer - delta, 0);
    this.x = this.homeX + Math.round((Math.random() * 2 - 1) * SHAKE);
  }

  fall(delta) {
    this.x = this.homeX;
    this.applyGravity(delta);
    if (this.y < this.floor) return;
    this.y = this.floor;
    this.velocityY = 0;
    this.setAnimation(this.animations.break);
    sound.play("break");
  }

  crumble(delta) {
    this.animate(delta);
    this.done = this.isAnimationFinished();
  }

  isBroken() {
    return this.currentAnimation === this.animations.break;
  }

  isHitting() {
    return this.velocityY > 0;
  }
}
