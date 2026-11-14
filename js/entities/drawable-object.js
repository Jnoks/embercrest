export default class DrawableObject {
  constructor(x, y, width, height) {
    this.img = null;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.anchorY = 0;
    this.anchorX = width / 2;
    this.facingLeft = false;
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.currentAnimation = null;
  }

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  setAnimation(animation) {
    if (this.currentAnimation === animation) return;
    this.currentAnimation = animation;
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.img = animation.frames[0];
  }

  animate(delta) {
    if (this.isAnimationFinished()) return;
    this.frameTimer += delta;
    if (this.frameTimer >= this.currentAnimation.frameDuration) {
      this.frameTimer -= this.currentAnimation.frameDuration;
      this.frameIndex =
        (this.frameIndex + 1) % this.currentAnimation.frames.length;
      this.img = this.currentAnimation.frames[this.frameIndex];
      if (this.frameIndex === 0)
        this.frameTimer -= this.currentAnimation.loopPause;
    }
  }

  isAnimationFinished() {
    const lastIndex = this.currentAnimation.frames.length - 1;
    return !this.currentAnimation.loop && this.frameIndex === lastIndex;
  }

  draw(ctx) {
    this.drawAt(ctx, this.x);
  }

  drawAt(ctx, x) {
    if (!this.img) return;
    if (this.facingLeft) {
      ctx.save();
      ctx.translate(Math.round(x) + 2 * this.anchorX, 0);
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
