import MovableObject from "./movable-object.js";

export default class Trap extends MovableObject {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.damage = 0;
  }

  touch() {}

  isHitting() {
    return false;
  }
}
