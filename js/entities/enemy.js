import MovableObject from "./movable-object.js";

export default class Enemy extends MovableObject {
  constructor(x, y) {
    super(x, y, 128, 128);
    this.anchorY = 89;
    this.facingLeft = true;
    this.loopPause = 0;
    this.speed = 15 + Math.random() * 25;
    const paths = [];
    for (let i = 1; i <= 4; i++) {
      paths.push(`./assets/images/goblin/idle/idle${i}.png`);
    }
    this.loadImages(paths);
    this.frameTimer = -Math.random() * this.frames.length * this.frameDuration;
  }

  update(delta) {
    this.animate(delta);
    this.moveLeft(delta);
  }
}
