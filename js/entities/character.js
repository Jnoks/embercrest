import MovableObject from "./movable-object.js";

export default class Character extends MovableObject {
  constructor(x, y) {
    super(x, y, 128, 128);
    this.anchorY = 111;
    this.loadImage("./assets/images/mage/idle/idle1.png");
  }
}
