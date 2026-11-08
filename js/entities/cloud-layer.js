import MovableObject from "./movable-object.js";

export default class CloudLayer extends MovableObject {
  constructor(x, y, imagePath) {
    super(x, y, 960, 540);
    this.speed = 0.2;
    this.loadImage(imagePath);
  }
}
