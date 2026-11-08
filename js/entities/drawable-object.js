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
    this.drawAt(ctx, this.x);
  }

  drawAt(ctx, x) {
    if (!this.img) return;
    ctx.drawImage(
      this.img,
      Math.round(x),
      this.y - this.anchorY,
      this.width,
      this.height,
    );
  }

  update(delta) {}
}
