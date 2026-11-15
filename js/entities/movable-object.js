import DrawableObject from "./drawable-object.js";

const GRAVITY = 2000;
const SHOW_HITBOX = true;
const HURT_DURATION = 0.4;
const INVINCIBLE_DURATION = 1;

export default class MovableObject extends DrawableObject {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.speed = 0;
    this.velocityY = 0;
    this.jumpSpeed = 0;
    this.onGround = false;
    this.hitboxWidth = width;
    this.hitboxHeight = height;
    this.health = 100;
    this.hurtTimer = 0;
    this.invincibleTimer = 0;
    this.attackTimer = 0;
    this.cooldownTimer = 0;
  }

  moveRight(delta) {
    this.x += this.speed * delta;
  }

  moveLeft(delta) {
    this.x -= this.speed * delta;
  }

  applyGravity(delta) {
    this.velocityY += GRAVITY * delta;
    this.y += this.velocityY * delta;
  }

  land(groundY) {
    this.y = groundY;
    this.velocityY = 0;
    this.onGround = true;
  }

  jump() {
    if (!this.onGround) return;
    this.onGround = false;
    this.velocityY = -this.jumpSpeed;
  }

  centerX() {
    return this.x + this.anchorX;
  }

  hitbox() {
    const centerX = this.centerX();
    return {
      left: centerX - this.hitboxWidth / 2,
      right: centerX + this.hitboxWidth / 2,
      top: this.y - this.hitboxHeight,
      bottom: this.y,
    };
  }

  overlaps(box) {
    const a = this.hitbox();
    return (
      a.left < box.right &&
      a.right > box.left &&
      a.top < box.bottom &&
      a.bottom > box.top
    );
  }

  isColliding(other) {
    return this.overlaps(other.hitbox());
  }

  takeDamage(amount) {
    if (this.isInvincible() || this.isDead()) return;
    this.health = Math.max(this.health - amount, 0);
    this.hurtTimer = HURT_DURATION;
    this.invincibleTimer = INVINCIBLE_DURATION;
  }

  isHurt() {
    return this.hurtTimer > 0;
  }

  isInvincible() {
    return this.invincibleTimer > 0;
  }

  isDead() {
    return this.health === 0;
  }

  isAttacking() {
    return this.attackTimer > 0;
  }

  isOnCooldown() {
    return this.cooldownTimer > 0;
  }

  updateTimers(delta) {
    this.hurtTimer = Math.max(this.hurtTimer - delta, 0);
    this.invincibleTimer = Math.max(this.invincibleTimer - delta, 0);
    this.attackTimer = Math.max(this.attackTimer - delta, 0);
    this.cooldownTimer = Math.max(this.cooldownTimer - delta, 0);
  }

  draw(ctx) {
    super.draw(ctx);
    if (SHOW_HITBOX) {
      this.drawHitbox(ctx);
    }
  }

  drawHitbox(ctx) {
    const box = this.hitbox();
    ctx.strokeStyle = "red";
    ctx.strokeRect(box.left, box.top, this.hitboxWidth, this.hitboxHeight);
  }
}
