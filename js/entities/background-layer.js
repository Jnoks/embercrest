import DrawableObject from "./drawable-object.js";

export default class BackgroundLayer extends DrawableObject {
  constructor(x, y, imagePath, parallax) {
    super(x, y, 960, 540);
    this.loadImage(imagePath);
    this.parallax = parallax;
    this.scroll = 0;
  }

  scrollTo(cameraX) {
    this.scroll = cameraX * this.parallax;
  }

  draw(ctx) {
    const offset = (this.x - this.scroll) % this.width;
    this.drawAt(ctx, offset);
    this.drawAt(ctx, offset + this.width);
  }
}
