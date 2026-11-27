import Figure from "./figure.js";
import DrawableObject from "./drawable-object.js";
import SpriteAnimation from "../sprite-animation.js";
import Key from "../ui/key.js";
import Label from "../ui/label.js";
import { UI_TEXT } from "../data/story.js";

const MARKER_IMAGE = "./assets/images/ui/quest-marker.png";
const MARKER_WIDTH = 14;
const MARKER_HEIGHT = 33;
const MARKER_Y = 92;
const MARKER_SPACE = 41;
const KEY_SIZE = 24;
const KEY_X = 41;
const KEY_Y = 83;
const HINT_X = 15;
const RUN_SPEED = 280;

export default class Npc extends Figure {
  constructor(name, frames, centerX, y) {
    super(name, frames, centerX, y);
    this.homeX = centerX;
    this.targetX = centerX;
    this.speed = RUN_SPEED;
    this.marked = false;
    this.near = false;
    this.createAnimations();
    this.createMarker(centerX, y);
    this.createPrompt(centerX, y);
  }

  createAnimations() {
    this.animations.run = new SpriteAnimation(this.path, "run", 8, 0.08);
    this.animations.attack = new SpriteAnimation(this.path, "attack", 7, 0.1, {
      loop: false,
    });
  }

  createMarker(centerX, y) {
    const x = centerX - MARKER_WIDTH / 2;
    const top = y - MARKER_Y;
    this.marker = new DrawableObject(x, top, MARKER_WIDTH, MARKER_HEIGHT);
    this.marker.loadImage(MARKER_IMAGE);
  }

  createPrompt(centerX, y) {
    const top = y - KEY_Y;
    const hintX = centerX + HINT_X;
    const hintY = top + KEY_SIZE / 2;
    this.key = new Key(centerX - KEY_X, top, "E", KEY_SIZE, KEY_SIZE);
    this.hint = new Label(UI_TEXT.talk, hintX, hintY, 16, "white", "black");
  }

  update(delta) {
    this.updateTimers(delta);
    if (this.isAttacking()) this.setAnimation(this.animations.attack);
    else if (this.isMoving()) this.run(delta);
    else this.setAnimation(this.animations.idle);
    this.animate(delta);
  }

  runTo(x) {
    this.targetX = x;
  }

  isMoving() {
    return Math.abs(this.targetX - this.centerX()) > 0.5;
  }

  run(delta) {
    const distance = this.targetX - this.centerX();
    const step = Math.min(this.speed * delta, Math.abs(distance));
    this.x += Math.sign(distance) * step;
    this.facingLeft = distance < 0;
    this.setAnimation(this.animations.run);
  }

  work() {
    this.attackTimer = this.animations.attack.cycleDuration();
  }

  draw(ctx) {
    super.draw(ctx);
    ctx.save();
    ctx.translate(Math.round(this.centerX() - this.homeX), 0);
    if (this.marked) this.marker.draw(ctx);
    if (this.near) this.drawPrompt(ctx);
    ctx.restore();
  }

  drawPrompt(ctx) {
    if (this.marked) ctx.translate(0, -MARKER_SPACE);
    this.key.draw(ctx);
    this.hint.draw(ctx);
  }
}
