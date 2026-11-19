import MovableObject from "./movable-object.js";

const FADE_TIME = 0.15;

export default class Projectile extends MovableObject {
  constructor(centerX, y, width, height, facingLeft) {
    super(centerX - width / 2, y, width, height);
    this.facingLeft = facingLeft;
    this.damage = 0;
    this.range = 0;
    this.distance = 0;
    this.alpha = 1;
    this.done = false;
  }

  update(delta) {
    this.animate(delta);
    if (!this.isExploding()) this.fly(delta);
    if (this.isFading()) this.fade(delta);
    if (this.isExploding() && this.isAnimationFinished()) this.done = true;
  }

  fly(delta) {
    if (this.facingLeft) this.moveLeft(delta);
    else this.moveRight(delta);
    this.y += this.velocityY * delta;
    this.distance += this.speed * delta;
  }

  isFading() {
    return this.distance > this.range && !this.isExploding();
  }

  fade(delta) {
    this.alpha = Math.max(this.alpha - delta / FADE_TIME, 0);
    if (this.alpha === 0) this.done = true;
  }

  aimAt(x, y) {
    const time = Math.abs(x - this.centerX()) / this.speed;
    this.velocityY = (y - this.y) / time;
  }

  explode() {
    this.alpha = 1;
    this.setAnimation(this.animations.hit);
  }

  isExploding() {
    return this.currentAnimation === this.animations.hit;
  }

  isHitting() {
    return !this.isExploding() && !this.isFading();
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    super.draw(ctx);
    ctx.restore();
  }
}
