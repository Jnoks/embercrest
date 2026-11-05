export default class MovableObject {
  constructor(x, y, width, height) {
    this.img = null;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  draw(ctx) {
    if (!this.img) return;
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  moveRight() {
    console.log("Moving right");
  }
}
