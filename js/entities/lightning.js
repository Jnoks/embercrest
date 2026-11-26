import MovableObject from "./movable-object.js";
import SpriteAnimation from "../sprite-animation.js";
import { sound } from "../sound.js";

const LIGHTNING_PATH = "./assets/images/lightning/";
const LIGHTNING_SIZE = 512;
const WARN_DURATION = 0.7;
const FIRST_HIT_FRAME = 2;
const LAST_HIT_FRAME = 4;
const LIGHTNING_ANIMATIONS = {
  warn: new SpriteAnimation(LIGHTNING_PATH, "warn", 2, 0.1),
  strike: new SpriteAnimation(LIGHTNING_PATH, "strike", 9, 0.08, {
    loop: false,
  }),
};

export default class Lightning extends MovableObject {
  constructor(centerX, y) {
    super(0, y, LIGHTNING_SIZE, LIGHTNING_SIZE);
    this.anchorX = 251;
    this.anchorY = 452;
    this.x = centerX - this.anchorX;
    this.hitboxWidth = 70;
    this.hitboxHeight = 380;
    this.damage = 20;
    this.warnTimer = WARN_DURATION;
    this.done = false;
    this.animations = LIGHTNING_ANIMATIONS;
    this.setAnimation(this.animations.warn);
  }

  update(delta) {
    this.animate(delta);
    this.warnTimer = Math.max(this.warnTimer - delta, 0);
    if (this.warnTimer === 0 && !this.isStriking()) this.strike();
    if (this.isStriking() && this.isAnimationFinished()) this.done = true;
  }

  strike() {
    this.setAnimation(this.animations.strike);
    sound.play("thunder");
  }

  isStriking() {
    return this.currentAnimation === this.animations.strike;
  }

  isHitting() {
    return (
      this.isStriking() &&
      this.frameIndex >= FIRST_HIT_FRAME &&
      this.frameIndex <= LAST_HIT_FRAME
    );
  }

  explode() {}
}
