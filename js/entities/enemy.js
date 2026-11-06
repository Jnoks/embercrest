import MovableObject from "./movable-object.js";

export default class Enemy extends MovableObject {
  constructor(x, y) {
    super(x, y, 128, 128);
    this.anchorY = 89;
    this.loadImage("./assets/images/goblin/idle/idle1.png");
  }
}
