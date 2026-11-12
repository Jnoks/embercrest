import DrawableObject from "./drawable-object.js";

const GRAVITY = 2000;
const SHOW_HITBOX = true;

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

  hitbox() {
    const centerX = this.x + this.anchorX;
    return {
      left: centerX - this.hitboxWidth / 2,
      right: centerX + this.hitboxWidth / 2,
      top: this.y - this.hitboxHeight,
      bottom: this.y,
    };
  }

  isColliding(other) {
    const a = this.hitbox();
    const b = other.hitbox();
    return (
      a.left < b.right &&
      a.right > b.left &&
      a.top < b.bottom &&
      a.bottom > b.top
    );
  }

  takeDamage(amount) {
    this.health = Math.max(this.health - amount, 0);
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
