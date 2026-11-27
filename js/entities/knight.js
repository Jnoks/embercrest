import Character from "./character.js";
import SpriteAnimation from "../sprite-animation.js";
import { sound } from "../sound.js";

const KNIGHT_PATH = "./assets/images/knight/";
const SWING_COOLDOWN = 0.8;
const HIT_FRAME = 1;
const SWORD_REACH = 44;
const BLOCK_COST = 20;
const BRACE_TIME = 0.2;
const RECOIL_SHIFT = 6;
const ONCE = { loop: false };
const DEATH = { loop: false, padding: 64 };

export default class Knight extends Character {
  constructor(x, y, keyboard) {
    super(x, y, keyboard);
    this.anchorY = 110;
    this.damage = 20;
    this.armor = 0.7;
    this.maxEnergy = 100;
    this.energy = this.maxEnergy;
    this.energyRegen = 10;
    this.struck = false;
    this.braceTimer = 0;
    this.animations = this.createAnimations();
    this.setAnimation(this.animations.idle);
  }

  createAnimations() {
    const idle = { loopPause: 2 };
    return {
      idle: new SpriteAnimation(KNIGHT_PATH, "idle", 12, 0.2, idle),
      run: new SpriteAnimation(KNIGHT_PATH, "run", 8, 0.08),
      jump: new SpriteAnimation(KNIGHT_PATH, "jump", 7, 0.1),
      flip: new SpriteAnimation(KNIGHT_PATH, "flip", 6, 0.07, ONCE),
      hurt: new SpriteAnimation(KNIGHT_PATH, "hurt", 4, 0.1, ONCE),
      attack: new SpriteAnimation(KNIGHT_PATH, "attack", 4, 0.08, ONCE),
      block: new SpriteAnimation(KNIGHT_PATH, "block", 2, 0.06, ONCE),
      death: new SpriteAnimation(KNIGHT_PATH, "death", 10, 0.1, DEATH),
    };
  }

  attack() {
    if (this.isOnCooldown()) return;
    this.cooldownTimer = SWING_COOLDOWN;
    this.attackTimer = this.animations.attack.cycleDuration();
    this.struck = false;
    sound.play("swing");
  }

  takeSwing() {
    const swinging = this.currentAnimation === this.animations.attack;
    if (!swinging || this.frameIndex !== HIT_FRAME || this.struck) return false;
    this.struck = true;
    return true;
  }

  attackBox() {
    const box = this.hitbox();
    if (this.facingLeft) box.left -= SWORD_REACH;
    else box.right += SWORD_REACH;
    return box;
  }

  handleInput(delta) {
    if (this.isBlocking()) this.turn();
    else super.handleInput(delta);
  }

  turn() {
    if (this.keyboard.left) this.facingLeft = true;
    if (this.keyboard.right) this.facingLeft = false;
  }

  chooseAnimation() {
    if (this.isBlocking()) this.setAnimation(this.animations.block);
    else super.chooseAnimation();
  }

  updateTimers(delta) {
    super.updateTimers(delta);
    this.braceTimer = Math.max(this.braceTimer - delta, 0);
  }

  regenerate(delta) {
    if (!this.isBlocking()) super.regenerate(delta);
  }

  isBlocking() {
    const busy = this.isAttacking() || this.isHurt() || this.isDead();
    const ready = this.onGround && this.energy >= BLOCK_COST;
    return this.keyboard.block && ready && !busy;
  }

  blocks(x) {
    const distance = x - this.centerX();
    const left = distance < 0;
    const outside = Math.abs(distance) > this.hitboxWidth / 2;
    return this.isBlocking() && left === this.facingLeft && outside;
  }

  block() {
    this.energy -= BLOCK_COST;
    this.braceTimer = BRACE_TIME;
  }

  isBracing() {
    return this.braceTimer > 0 && this.isBlocking();
  }

  recoilShift() {
    if (!this.isBracing()) return 0;
    const shift = (RECOIL_SHIFT * this.braceTimer) / BRACE_TIME;
    if (this.facingLeft) return shift;
    return -shift;
  }

  drawAt(ctx, x) {
    super.drawAt(ctx, x + this.recoilShift());
  }
}
