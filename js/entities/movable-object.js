import DrawableObject from "./drawable-object.js";

const GRAVITY = 2000;

export default class MovableObject extends DrawableObject {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.speed = 0;
    this.velocityY = 0;
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
  }
}
