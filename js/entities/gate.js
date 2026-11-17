import MovableObject from "./movable-object.js";
import DrawableObject from "./drawable-object.js";
import Effect from "./effect.js";
import SpriteAnimation from "../sprite-animation.js";

const GATE_PATH = "./assets/images/forest/objects/";
const GATE_SIZE = 128;
const LOCK_WIDTH = 33;
const LOCK_HEIGHT = 37;
const LOCK_Y = 55;
const LOCK_HOP = 300;
const STAR_SIZE = 32;
const STAR = new SpriteAnimation(GATE_PATH, "star", 10, 0.06, { loop: false });

export default class Gate extends MovableObject {
  constructor(centerX, y) {
    super(centerX - GATE_SIZE / 2, y, GATE_SIZE, GATE_SIZE);
    this.anchorY = 102;
    this.hitboxWidth = 20;
    this.hitboxHeight = 60;
    this.open = false;
    this.unlocked = false;
    this.pendingEffect = null;
    this.loadImage(GATE_PATH + "thorn-gate.png");
    this.vines = new DrawableObject(this.x, y, GATE_SIZE, GATE_SIZE);
    this.vines.anchorY = this.anchorY;
    this.vines.loadImage(GATE_PATH + "thorn-gate-vines.png");
    this.lock = this.createLock(centerX, y);
  }

  createLock(centerX, y) {
    const x = centerX - LOCK_WIDTH / 2;
    const lock = new MovableObject(x, y - LOCK_Y, LOCK_WIDTH, LOCK_HEIGHT);
    lock.loadImage(GATE_PATH + "gate-lock.png");
    return lock;
  }

  update(delta) {
    if (!this.unlocked || this.open) return;
    this.lock.applyGravity(delta);
    if (this.lock.y > this.y) this.open = true;
  }

  unlock() {
    const centerY = this.lock.y + LOCK_HEIGHT / 2;
    this.unlocked = true;
    this.lock.velocityY = -LOCK_HOP;
    this.pendingEffect = new Effect(this.centerX(), centerY, STAR_SIZE, STAR);
  }

  takeEffect() {
    const effect = this.pendingEffect;
    this.pendingEffect = null;
    return effect;
  }

  draw(ctx) {
    super.draw(ctx);
    if (this.open) return;
    this.vines.draw(ctx);
    this.lock.draw(ctx);
  }
}
