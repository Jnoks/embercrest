import DrawableObject from "../entities/drawable-object.js";

export default class HudImage extends DrawableObject {
  constructor(x, y, width, height, imagePath) {
    super(x, y, width, height);
    this.loadImage(imagePath);
  }
}
