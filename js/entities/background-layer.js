import DrawableObject from "./drawable-object.js";

export default class BackgroundLayer extends DrawableObject {
  constructor(x, y, imagePath) {
    super(x, y, 960, 540);
    this.loadImage(imagePath);
  }
}
