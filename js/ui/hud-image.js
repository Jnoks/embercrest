import DrawableObject from "../entities/drawable-object.js";

export default class HudImage extends DrawableObject {
  constructor(x, y, width, height, imagePath) {
    super(x, y, width, height);
    this.loadImage(imagePath);
  }

  contains(x, y) {
    const inside = x >= this.x && x <= this.x + this.width;
    return inside && y >= this.y && y <= this.y + this.height;
  }
}
