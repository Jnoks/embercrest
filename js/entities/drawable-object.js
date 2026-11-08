export default class DrawableObject {
  constructor(x, y, width, height) {
    this.img = null;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.anchorY = 0;
    this.frames = [];
  }

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  loadImages(paths) {
    for (let i = 0; i < paths.length; i++) {
      const img = new Image();
      img.src = paths[i];
      this.frames.push(img);
    }
    this.img = this.frames[0];
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
