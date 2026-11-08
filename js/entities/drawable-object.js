export default class DrawableObject {
  constructor(x, y, width, height) {
    this.img = null;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.anchorY = 0;
    this.frames = [];
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.frameDuration = 0.2;
    this.loopPause = 2;
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

  animate(delta) {
    this.frameTimer += delta;
    if (this.frameTimer >= this.frameDuration) {
      this.frameTimer -= this.frameDuration;
      this.frameIndex = (this.frameIndex + 1) % this.frames.length;
      this.img = this.frames[this.frameIndex];
      if (this.frameIndex === 0) this.frameTimer -= this.loopPause;
    }
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
