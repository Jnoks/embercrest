import MovableObject from "./movable-object.js";

export default class Cloud extends MovableObject {
  constructor(x, y) {
    super(x, y, 960, 540);
    this.loadImage("./assets/images/forest/background/clouds-small.png");
  }
}
