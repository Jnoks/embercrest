export default class DrawableObject {
  constructor(x, y, width, height) {
    this.img = null;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.anchorY = 0;
    this.facingLeft = false;
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.animation = null;
  }

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  setAnimation(animation) {
    if (this.animation === animation) return;
    this.animation = animation;
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.img = animation.frames[0];
  }

  animate(delta) {
    this.frameTimer += delta;
    if (this.frameTimer >= this.animation.frameDuration) {
      this.frameTimer -= this.animation.frameDuration;
      this.frameIndex = (this.frameIndex + 1) % this.animation.frames.length;
      this.img = this.animation.frames[this.frameIndex];
      if (this.frameIndex === 0) this.frameTimer -= this.animation.loopPause;
    }
  }

  draw(ctx) {
    this.drawAt(ctx, this.x);
  }

  drawAt(ctx, x) {
    if (!this.img) return;
    if (this.facingLeft) {
      ctx.save();
      ctx.translate(Math.round(x) + this.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(
        this.img,
        0,
        this.y - this.anchorY,
        this.width,
        this.height,
      );
      ctx.restore();
    } else {
      ctx.drawImage(
        this.img,
        Math.round(x),
        this.y - this.anchorY,
        this.width,
        this.height,
      );
    }
  }

  update(delta) {}
}
