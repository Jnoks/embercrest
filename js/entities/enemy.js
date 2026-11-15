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
}
