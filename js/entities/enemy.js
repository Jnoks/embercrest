import MovableObject from "./movable-object.js";

export default class Enemy extends MovableObject {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.damage = 10;
    this.targetX = 0;
    this.invincibleDuration = 0;
    this.hitFrame = 0;
    this.attackReach = 0;
    this.sightRange = 0;
    this.stopDistance = 0;
    this.attackCooldown = 0;
    this.animations = {};
  }

  update(delta) {
    this.updateTimers(delta);
    if (this.isDead()) {
      this.setAnimation(this.animations.death);
    } else if (this.isHurt()) {
      this.setAnimation(this.animations.hurt);
    } else if (this.isAttacking()) {
      this.setAnimation(this.animations.attack);
    } else {
      this.chase(delta);
    }
    this.animate(delta);
  }

  chase(delta) {
    const distance = this.targetX - this.centerX();
    if (Math.abs(distance) > this.sightRange) {
      this.setAnimation(this.animations.idle);
      return;
    }
    this.facingLeft = distance < 0;
    if (Math.abs(distance) < this.stopDistance) {
      this.setAnimation(this.animations.idle);
      return;
    }
    this.setAnimation(this.animations.walk);
    if (this.facingLeft) this.moveLeft(delta);
    else this.moveRight(delta);
  }

  attack() {
    if (this.isOnCooldown() || this.isHurt() || this.isDead()) return;
    this.attackTimer = this.animations.attack.cycleDuration();
    this.cooldownTimer = this.attackCooldown;
  }

  isHitting() {
    return (
      this.currentAnimation === this.animations.attack &&
      this.frameIndex === this.hitFrame
    );
  }

  attackBox() {
    const box = this.hitbox();
    if (this.facingLeft) box.left -= this.attackReach;
    else box.right += this.attackReach;
    return box;
  }

  drawHitbox(ctx) {
    super.drawHitbox(ctx);
    const box = this.attackBox();
    ctx.strokeStyle = "orange";
    ctx.strokeRect(
      box.left,
      box.top,
      box.right - box.left,
      box.bottom - box.top,
    );
  }
}
