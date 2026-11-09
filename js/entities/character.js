import MovableObject from "./movable-object.js";

export default class Character extends MovableObject {
  constructor(x, y, keyboard) {
    super(x, y, 128, 128);
    this.anchorY = 111;
    this.keyboard = keyboard;
    this.speed = 150;
    const paths = [];
    for (let i = 1; i <= 14; i++) {
      paths.push(`./assets/images/mage/idle/idle${i}.png`);
    }
    this.loadImages(paths);
  }

  update(delta) {
    if (this.keyboard.right) {
      this.moveRight(delta);
      this.facingLeft = false;
    }
    if (this.keyboard.left) {
      this.moveLeft(delta);
      this.facingLeft = true;
    }
    this.animate(delta);
  }
}
