import MovableObject from "./movable-object.js";

export default class Enemy extends MovableObject {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.damage = 10;
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
