import MovableObject from "./movable-object.js";

export default class BackgroundLayer extends MovableObject {
  constructor(x, y, imagePath) {
    super(x, y, 960, 540);
    this.loadImage(imagePath);
  }
}
