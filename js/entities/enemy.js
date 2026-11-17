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
  }

  attack() {}

  isHitting() {
    return true;
  }

  attackBox() {
    return this.hitbox();
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
