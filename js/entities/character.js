import MovableObject from "./movable-object.js";
import DrawableObject from "./drawable-object.js";
import { sound } from "../sound.js";

const RUN_SPEED = 150;
const SLOW_SPEED = 60;
const WEB_IMAGE = "./assets/images/web/fly/fly3.png";
const WEB_SIZE = 64;
const WEB_HEIGHT = 54;

export default class Character extends MovableObject {
  constructor(x, y, keyboard) {
    super(x, y, 128, 128);
    this.anchorY = 111;
    this.anchorX = 47;
    this.hitboxWidth = 30;
    this.hitboxHeight = 50;
    this.keyboard = keyboard;
    this.speed = RUN_SPEED;
    this.jumpSpeed = 700;
    this.maxAirJumps = 1;
    this.slowTimer = 0;
    this.damageFactor = 1;
    this.armor = 1;
    this.maxMana = 0;
    this.mana = 0;
    this.manaRegen = 0;
    this.alpha = 1;
    this.web = new DrawableObject(0, 0, WEB_SIZE, WEB_SIZE);
    this.web.loadImage(WEB_IMAGE);
  }

  update(delta) {
    this.handleInput(delta);
    this.chooseAnimation();
    this.updateTimers(delta);
    this.applyGravity(delta);
    this.animate(delta);
  }

  chooseAnimation() {
    const moving = this.keyboard.left || this.keyboard.right;
    if (this.isDead()) this.setAnimation(this.animations.death);
    else if (this.isHurt()) this.setAnimation(this.animations.hurt);
    else if (this.isAttacking()) this.setAnimation(this.animations.attack);
    else if (!this.onGround) this.setAnimation(this.airAnimation());
    else if (moving) this.setAnimation(this.animations.run);
    else this.setAnimation(this.animations.idle);
  }

  updateTimers(delta) {
    super.updateTimers(delta);
    this.slowTimer = Math.max(this.slowTimer - delta, 0);
    this.speed = RUN_SPEED;
    if (this.isSlowed()) this.speed = SLOW_SPEED;
  }

  takeDamage(amount) {
    const health = this.health;
    super.takeDamage(amount * this.damageFactor * this.armor);
    if (this.health === health) return;
    if (this.isDead()) sound.play("death");
    else sound.play("hurt");
  }

  jump() {
    if (!this.canJump()) return;
    super.jump();
    sound.play("jump");
  }

  slow(time) {
    this.slowTimer = time;
  }

  isSlowed() {
    return this.slowTimer > 0;
  }

  handleInput(delta) {
    if (this.isHurt() || this.isDead()) return;
    if (this.keyboard.attack) this.attack();
    if (this.isAttacking()) return;
    if (this.keyboard.right) {
      this.moveRight(delta);
      this.facingLeft = false;
    }
    if (this.keyboard.left) {
      this.moveLeft(delta);
      this.facingLeft = true;
    }
    if (this.keyboard.take("jump")) this.jump();
  }

  airAnimation() {
    if (this.airJumps < this.maxAirJumps) return this.animations.flip;
    return this.animations.jump;
  }

  attack() {}

  takeBolt() {
    return null;
  }

  takeSwing() {
    return false;
  }

  wantsToTalk() {
    return this.keyboard.take("talk");
  }

  isVisible() {
    if (this.isGone()) return false;
    return super.isVisible();
  }

  draw(ctx) {
    if (this.isSlowed()) this.drawWeb(ctx);
    ctx.save();
    ctx.globalAlpha = this.alpha;
    super.draw(ctx);
    ctx.restore();
  }

  drawWeb(ctx) {
    this.web.x = this.centerX() - WEB_SIZE / 2;
    this.web.y = this.y - WEB_HEIGHT;
    this.web.draw(ctx);
  }
}
