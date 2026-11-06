export default class DrawableObject {
  constructor(x, y, width, height) {
    this.img = null;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.anchorY = 0;
  }

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  draw(ctx) {
    if (!this.img) return;
    ctx.drawImage(
      this.img,
      this.x,
      this.y - this.anchorY,
      this.width,
      this.height,
    );
  }
}
