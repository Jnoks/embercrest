const WIDTH = 960;
const HEIGHT = 540;
const COUNT = 220;
const COLOR = "rgba(214, 232, 255, 0.55)";
const FALL_SPEED = 600;
const DRIFT_SPEED = 80;
const STOP_TIME = 2;

export default class Rain {
  constructor() {
    this.amount = 1;
    this.stopping = false;
    this.drops = [];
    for (let i = 0; i < COUNT; i++) {
      this.drops.push(this.createDrop());
    }
  }

  createDrop() {
    return {
      x: Math.random() * WIDTH,
      y: Math.random() * HEIGHT,
      length: Math.round(10 + Math.random() * 8),
    };
  }

  stop() {
    this.stopping = true;
  }

  update(delta) {
    this.thinOut(delta);
    for (let i = 0; i < this.drops.length; i++) {
      this.moveDrop(this.drops[i], delta);
    }
  }

  thinOut(delta) {
    if (!this.stopping) return;
    this.amount = Math.max(this.amount - delta / STOP_TIME, 0);
  }

  moveDrop(drop, delta) {
    drop.y += FALL_SPEED * delta;
    drop.x -= DRIFT_SPEED * delta;
    if (drop.y > HEIGHT) drop.y -= HEIGHT + 2 * drop.length;
    if (drop.x < 0) drop.x += WIDTH;
  }

  draw(ctx) {
    const visible = this.drops.length * this.amount;
    ctx.fillStyle = COLOR;
    for (let i = 0; i < visible; i++) {
      this.drawDrop(ctx, this.drops[i]);
    }
  }

  drawDrop(ctx, drop) {
    const x = Math.round(drop.x);
    const y = Math.round(drop.y);
    ctx.fillRect(x, y, 2, drop.length);
    ctx.fillRect(x - 2, y + drop.length, 2, drop.length);
  }
}
