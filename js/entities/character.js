import MovableObject from "./movable-object.js";
import SpriteAnimation from "../sprite-animation.js";
import Bolt from "./bolt.js";

const MAGE_PATH = "./assets/images/mage/";
const SPELL_COST = 20;
const CAST_COOLDOWN = 0.6;
const MANA_REGEN = 10;
const STAFF_REACH = 41;
const STAFF_HEIGHT = 19;
const RELEASE_FRAME = 4;

export default class Character extends MovableObject {
  constructor(x, y, keyboard) {
    super(x, y, 128, 128);
    this.anchorY = 111;
    this.anchorX = 47;
    this.hitboxWidth = 30;
    this.hitboxHeight = 50;
    this.keyboard = keyboard;
    this.speed = 150;
    this.jumpSpeed = 700;
    this.maxMana = 100;
    this.mana = this.maxMana;
    this.pendingBolt = null;
    this.boltLoaded = false;
    this.animations = {
      idle: new SpriteAnimation(MAGE_PATH, "idle", 14, 0.2, { loopPause: 2 }),
      run: new SpriteAnimation(MAGE_PATH, "run", 8, 0.08),
      jump: new SpriteAnimation(MAGE_PATH, "jump", 7, 0.1),
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
    else if (!this.onGround) this.setAnimation(this.animations.jump);
    else if (this.keyboard.left || this.keyboard.right)
      this.setAnimation(this.animations.run);
    else this.setAnimation(this.animations.idle);
    this.updateTimers(delta);
    this.mana = Math.min(this.mana + MANA_REGEN * delta, this.maxMana);
    this.applyGravity(delta);
    this.animate(delta);
    this.releaseBolt();
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
    if (this.keyboard.jump) {
      this.jump();
    }
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

  takeBolt() {
    const bolt = this.pendingBolt;
    this.pendingBolt = null;
    return bolt;
  }
}
