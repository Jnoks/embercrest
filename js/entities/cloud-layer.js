import MovableObject from "./movable-object.js";

export default class CloudLayer extends MovableObject {
  constructor(x, y, imagePath, speed) {
    super(x, y, 960, 540);
    this.speed = speed;
    this.loadImage(imagePath);
  }

  update(delta) {
    this.moveLeft(delta);
    if (this.x <= -this.width) {
      this.x += this.width;
    }
  }

  draw(ctx) {
    this.drawAt(ctx, this.x);
    this.drawAt(ctx, this.x + this.width);
  }
}
