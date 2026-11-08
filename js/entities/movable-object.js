import DrawableObject from "./drawable-object.js";

export default class MovableObject extends DrawableObject {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.speed = 0;
  }

  moveRight(delta) {
    this.x += this.speed * delta;
  }

  moveLeft(delta) {
    this.x -= this.speed * delta;
  }
}
