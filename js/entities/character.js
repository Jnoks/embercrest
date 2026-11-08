import MovableObject from "./movable-object.js";

export default class Character extends MovableObject {
  constructor(x, y) {
    super(x, y, 128, 128);
    this.anchorY = 111;
    const paths = [];
    for (let i = 1; i <= 14; i++) {
      paths.push(`./assets/images/mage/idle/idle${i}.png`);
    }
    this.loadImages(paths);
  }

  update(delta) {
    this.animate(delta);
  }
}
