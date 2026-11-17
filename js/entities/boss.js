import Enemy from "./enemy.js";
import SpriteAnimation from "../sprite-animation.js";
import IceShard from "./ice-shard.js";

const BOSS_PATH = "./assets/images/boss/";
const CAST_DISTANCE = 220;
const SPELL_COOLDOWN = 3;
const RELEASE_FRAME = 4;
const HAND_REACH = 90;
const HAND_HEIGHT = 73;
const AIM_HEIGHT = 20;

export default class Boss extends Enemy {
  constructor(x, y) {
    super(x, y, 256, 256);
    this.anchorY = 207;
    this.anchorX = 99;
    this.hitboxWidth = 60;
    this.hitboxHeight = 100;
    this.facingLeft = true;
    this.maxHealth = 240;
    this.health = this.maxHealth;
    this.speed = 60;
    this.damage = 20;
    this.hitFrame = 3;
    this.attackReach = 120;
    this.sightRange = 500;
    this.stopDistance = 90;
    this.attackCooldown = 2;
    this.hurtDuration = 0.2;
    this.name = "Hob";
    this.castTimer = 0;
    this.spellTimer = 0;
    this.spellLoaded = false;
    this.pendingSpell = null;
    this.animations = {
      idle: new SpriteAnimation(BOSS_PATH, "idle", 3, 0.3, { loopPause: 1 }),
      walk: new SpriteAnimation(BOSS_PATH, "walk", 6, 0.15),
      attack: new SpriteAnimation(BOSS_PATH, "attack", 7, 0.1, {
        loop: false,
      }),
      hurt: new SpriteAnimation(BOSS_PATH, "hurt", 2, 0.1, { loop: false }),
      death: new SpriteAnimation(BOSS_PATH, "death", 6, 0.15, {
        loop: false,
      }),
      ice: new SpriteAnimation(BOSS_PATH, "ice", 5, 0.1, { loop: false }),
    };
    this.setAnimation(this.animations.idle);
  }

  update(delta) {
    if (this.isCasting() && !this.isDead()) this.cast(delta);
    else super.update(delta);
  }

  cast(delta) {
    this.updateTimers(delta);
    this.setAnimation(this.animations.ice);
    this.animate(delta);
    this.releaseSpell();
  }

  updateTimers(delta) {
    super.updateTimers(delta);
    this.castTimer = Math.max(this.castTimer - delta, 0);
    this.spellTimer = Math.max(this.spellTimer - delta, 0);
  }

  isCasting() {
    return this.castTimer > 0;
  }

  takeDamage(amount) {
    super.takeDamage(amount);
    if (this.isAttacking() || this.isCasting()) this.hurtTimer = 0;
  }

  startCast() {
    this.facingLeft = this.targetX < this.centerX();
    this.castTimer = this.animations.ice.cycleDuration();
    this.spellTimer = SPELL_COOLDOWN;
    this.spellLoaded = true;
  }

  canCast() {
    const distance = Math.abs(this.targetX - this.centerX());
    return (
      this.spellTimer === 0 && this.seesTarget() && distance > CAST_DISTANCE
    );
  }

  chase(delta) {
    if (this.canCast()) this.startCast();
    else super.chase(delta);
  }

  isReleasing() {
    return (
      this.currentAnimation === this.animations.ice &&
      this.frameIndex === RELEASE_FRAME
    );
  }

  releaseSpell() {
    if (!this.spellLoaded || !this.isReleasing()) return;
    this.pendingSpell = this.createShard();
    this.spellLoaded = false;
  }

  createShard() {
    let reach = HAND_REACH;
    if (this.facingLeft) reach = -HAND_REACH;
    const shard = new IceShard(
      this.centerX() + reach,
      this.y - HAND_HEIGHT,
      this.facingLeft,
    );
    shard.aimAt(this.targetX, this.y - AIM_HEIGHT);
    return shard;
  }

  takeSpell() {
    const spell = this.pendingSpell;
    this.pendingSpell = null;
    return spell;
  }
}
