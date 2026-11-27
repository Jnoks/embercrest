import MovableObject from "./movable-object.js";
import SpeechBubble from "../ui/speech-bubble.js";

const SHOUT_CHANCE = 0.25;
const CHAT_RANGE = 200;
const BUBBLE_GAP = 12;
const BUBBLE_SHIFT = 6;
const ALERT_RANGE = 960;
const RECOIL_TIME = 0.4;
const BAR_WIDTH = 32;
const BAR_HEIGHT = 4;
const BAR_GAP = 8;
const BAR_BACK = "rgba(0, 0, 0, 0.6)";
const BAR_COLOR = "#e0452f";

export default class Enemy extends MovableObject {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.damage = 10;
    this.targetX = 0;
    this.targetY = 0;
    this.targetHidden = false;
    this.pendingSpell = null;
    this.shotCooldown = 0;
    this.releaseFrame = 0;
    this.shotLoaded = false;
    this.invincibleDuration = 0;
    this.hitFrame = 0;
    this.attackReach = 0;
    this.sightRange = 0;
    this.stopDistance = 0;
    this.attackCooldown = 0;
    this.minX = -Infinity;
    this.maxX = Infinity;
    this.lines = [];
    this.greetings = [];
    this.greeted = false;
    this.bubble = new SpeechBubble();
  }

  setZone(zone) {
    this.minX = zone.left + this.hitboxWidth / 2;
    this.maxX = zone.right - this.hitboxWidth / 2;
  }

  update(delta) {
    this.updateTimers(delta);
    if (this.isDead()) {
      this.setAnimation(this.animations.death);
    } else if (this.isHurt()) {
      this.setAnimation(this.animations.hurt);
    } else if (this.isAttacking()) {
      this.setAnimation(this.animations.attack);
    } else {
      this.chase(delta);
    }
    this.animate(delta);
    this.releaseShot();
  }

  updateTimers(delta) {
    super.updateTimers(delta);
    this.bubble.update(delta);
  }

  takeDamage(amount) {
    super.takeDamage(amount);
    this.sightRange = ALERT_RANGE;
  }

  recoil() {
    this.hurtTimer = RECOIL_TIME;
    this.attackTimer = 0;
  }

  seesTarget() {
    if (this.targetHidden) return false;
    return Math.abs(this.targetX - this.centerX()) <= this.sightRange;
  }

  chase(delta) {
    const distance = this.targetX - this.centerX();
    if (this.seesTarget()) this.facingLeft = distance < 0;
    if (this.canWalk(distance)) this.walk(delta);
    else this.setAnimation(this.animations.idle);
  }

  canWalk(distance) {
    if (!this.seesTarget() || this.isAtEdge()) return false;
    return Math.abs(distance) >= this.stopDistance;
  }

  isAtEdge() {
    if (this.facingLeft) return this.centerX() <= this.minX;
    return this.centerX() >= this.maxX;
  }

  walk(delta) {
    this.setAnimation(this.animations.walk);
    if (this.facingLeft) this.moveLeft(delta);
    else this.moveRight(delta);
  }

  attack() {
    if (this.isOnCooldown() || this.isHurt() || this.isDead()) return;
    this.attackTimer = this.animations.attack.cycleDuration();
    this.cooldownTimer = this.attackCooldown;
    this.shout();
  }

  shout() {
    if (this.lines.length === 0 || Math.random() > SHOUT_CHANCE) return;
    this.bubble.say(this.pick(this.lines));
  }

  notices() {
    if (this.greeted || this.isDead() || !this.seesTarget()) return false;
    this.greeted = true;
    return this.greetings.length > 0;
  }

  canAnswer(other) {
    if (this.greeted || this.isDead()) return false;
    const distance = Math.abs(this.centerX() - other.centerX());
    const near = distance < CHAT_RANGE && this.y === other.y;
    return near && this.greetings.length > 0;
  }

  greet() {
    this.bubble.say(this.pick(this.greetings));
  }

  pick(lines) {
    return lines[Math.floor(Math.random() * lines.length)];
  }

  shoot() {
    this.attackTimer = this.animations.attack.cycleDuration();
    this.cooldownTimer = this.shotCooldown;
    this.shotLoaded = true;
  }

  isReleasing() {
    const attacking = this.currentAnimation === this.animations.attack;
    return attacking && this.frameIndex === this.releaseFrame;
  }

  releaseShot() {
    if (!this.shotLoaded || !this.isReleasing()) return;
    this.shotLoaded = false;
    this.pendingSpell = this.createShot();
  }

  createShot() {
    return null;
  }

  takeSpell() {
    const spell = this.pendingSpell;
    this.pendingSpell = null;
    return spell;
  }

  isHitting() {
    return (
      this.currentAnimation === this.animations.attack &&
      this.frameIndex === this.hitFrame
    );
  }

  attackBox() {
    const box = this.hitbox();
    if (this.facingLeft) box.left -= this.attackReach;
    else box.right += this.attackReach;
    return box;
  }

  draw(ctx) {
    super.draw(ctx);
    if (this.isDead()) return;
    this.drawHealth(ctx);
    let x = this.centerX() + BUBBLE_SHIFT;
    if (!this.facingLeft) x = this.centerX() - BUBBLE_SHIFT;
    this.bubble.pointAt(x, this.hitbox().top - BUBBLE_GAP, !this.facingLeft);
    this.bubble.draw(ctx);
  }

  drawHealth(ctx) {
    if (this.health === this.maxHealth) return;
    const x = Math.round(this.centerX() - BAR_WIDTH / 2);
    const y = this.hitbox().top - BAR_GAP;
    const width = (BAR_WIDTH * this.health) / this.maxHealth;
    ctx.fillStyle = BAR_BACK;
    ctx.fillRect(x - 1, y - 1, BAR_WIDTH + 2, BAR_HEIGHT + 2);
    ctx.fillStyle = BAR_COLOR;
    ctx.fillRect(x, y, width, BAR_HEIGHT);
  }

  drawHitbox(ctx) {
    super.drawHitbox(ctx);
    const box = this.attackBox();
    ctx.strokeStyle = "orange";
    ctx.strokeRect(
      box.left,
      box.top,
      box.right - box.left,
      box.bottom - box.top,
    );
  }
}
