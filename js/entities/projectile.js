import MovableObject from "./movable-object.js";

export default class Projectile extends MovableObject {
  constructor(centerX, y, width, height, facingLeft) {
    super(centerX - width / 2, y, width, height);
    this.facingLeft = facingLeft;
    this.damage = 0;
    this.range = 0;
    this.distance = 0;
    this.done = false;
    this.animations = {};
  }

  update(delta) {
    this.animate(delta);
    if (!this.isExploding()) this.fly(delta);
    if (this.isExploding() && this.isAnimationFinished()) this.done = true;
  }

  fly(delta) {
    if (this.facingLeft) this.moveLeft(delta);
    else this.moveRight(delta);
    this.distance += this.speed * delta;
    if (this.distance > this.range) this.explode();
  }

  explode() {
    this.setAnimation(this.animations.hit);
  }

  isExploding() {
    return this.currentAnimation === this.animations.hit;
  }
}
