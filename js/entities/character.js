import MovableObject from "./movable-object.js";
import DrawableObject from "./drawable-object.js";
import SpriteAnimation from "../sprite-animation.js";
import Bolt from "./bolt.js";

const MAGE_PATH = "./assets/images/mage/";
const SPELL_COST = 20;
const CAST_COOLDOWN = 0.6;
const MANA_REGEN = 10;
const STAFF_REACH = 41;
const STAFF_HEIGHT = 19;
const RELEASE_FRAME = 4;
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
    this.maxMana = 100;
    this.mana = this.maxMana;
    this.pendingBolt = null;
    this.boltLoaded = false;
    this.alpha = 1;
    this.web = new DrawableObject(0, 0, WEB_SIZE, WEB_SIZE);
    this.web.loadImage(WEB_IMAGE);
    this.animations = {
      idle: new SpriteAnimation(MAGE_PATH, "idle", 14, 0.2, { loopPause: 2 }),
      run: new SpriteAnimation(MAGE_PATH, "run", 8, 0.08),
      jump: new SpriteAnimation(MAGE_PATH, "jump", 7, 0.1),
      flip: new SpriteAnimation(MAGE_PATH, "flip", 6, 0.07, { loop: false }),
      hurt: new SpriteAnimation(MAGE_PATH, "hurt", 4, 0.1, { loop: false }),
      attack: new SpriteAnimation(MAGE_PATH, "attack", 7, 0.07, {
        loop: false,
      }),
      death: new SpriteAnimation(MAGE_PATH, "death", 10, 0.1, {
        loop: false,
        padding: 64,
      }),
    };

    this.setAnimation(this.animations.idle);
  }

  update(delta) {
    this.handleInput(delta);
    if (this.isDead()) this.setAnimation(this.animations.death);
    else if (this.isHurt()) this.setAnimation(this.animations.hurt);
    else if (this.isAttacking()) this.setAnimation(this.animations.attack);
    else if (!this.onGround) this.setAnimation(this.airAnimation());
    else if (this.keyboard.left || this.keyboard.right)
      this.setAnimation(this.animations.run);
    else this.setAnimation(this.animations.idle);
    this.updateTimers(delta);
    this.mana = Math.min(this.mana + MANA_REGEN * delta, this.maxMana);
    this.applyGravity(delta);
    this.animate(delta);
    this.releaseBolt();
  }

  updateTimers(delta) {
    super.updateTimers(delta);
    this.slowTimer = Math.max(this.slowTimer - delta, 0);
    this.speed = RUN_SPEED;
    if (this.isSlowed()) this.speed = SLOW_SPEED;
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

  attack() {
    if (this.isOnCooldown() || this.mana < SPELL_COST) return;
    this.mana -= SPELL_COST;
    this.cooldownTimer = CAST_COOLDOWN;
    this.attackTimer = this.animations.attack.cycleDuration();
    this.boltLoaded = true;
  }

  isReleasing() {
    return (
      this.currentAnimation === this.animations.attack &&
      this.frameIndex === RELEASE_FRAME
    );
  }

  releaseBolt() {
    if (!this.boltLoaded || !this.isReleasing()) return;
    this.pendingBolt = this.createBolt();
    this.boltLoaded = false;
  }

  createBolt() {
    let reach = STAFF_REACH;
    if (this.facingLeft) reach = -STAFF_REACH;
    return new Bolt(
      this.centerX() + reach,
      this.y - STAFF_HEIGHT,
      this.facingLeft,
    );
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

  takeBolt() {
    const bolt = this.pendingBolt;
    this.pendingBolt = null;
    return bolt;
  }
}
