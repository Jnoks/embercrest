import MovableObject from "./movable-object.js";

export default class Tile extends MovableObject {
  constructor(x, y, imagePath) {
    super(x, y, 64, 64);
    this.loadImage(imagePath);
  }
}
