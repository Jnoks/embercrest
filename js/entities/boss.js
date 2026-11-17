import Enemy from "./enemy.js";
import SpriteAnimation from "../sprite-animation.js";
import IceShard from "./ice-shard.js";
import Effect from "./effect.js";

const BOSS_PATH = "./assets/images/boss/";
const LIGHTNING_PATH = "./assets/images/lightning/";
const FIREBALL_PATH = "./assets/images/fireball/";
const CAST_DISTANCE = 220;
const RELEASE_FRAME = 4;
const HAND_REACH = 90;
const HAND_HEIGHT = 73;
const AIM_HEIGHT = 20;
const PHASES = 3;
const ATTACK_COOLDOWNS = [2, 1.6, 1.2];
const SPELL_COOLDOWNS = [3, 2.2, 1.5];
const RAGE_SIZE = 512;
const RAGE_HEIGHTS = [0, 196, 50];
const RAGE_EFFECTS = [
  null,
  new SpriteAnimation(LIGHTNING_PATH, "strike", 9, 0.08, { loop: false }),
  new SpriteAnimation(FIREBALL_PATH, "hit", 7, 0.1, { loop: false }),
];

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
    this.attackCooldown = ATTACK_COOLDOWNS[0];
    this.hurtDuration = 0.2;
    this.name = "Hob";
    this.castTimer = 0;
    this.spellTimer = 0;
    this.spellLoaded = false;
    this.pendingSpell = null;
    this.spellCooldown = SPELL_COOLDOWNS[0];
    this.phase = 1;
    this.rageTimer = 0;
    this.pendingEffect = null;
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
      anger: new SpriteAnimation(BOSS_PATH, "anger", 5, 0.2, { loop: false }),
    };
    this.setAnimation(this.animations.idle);
  }

  update(delta) {
    if (this.isRaging()) this.rage(delta);
    else if (this.isCasting() && !this.isDead()) this.cast(delta);
    else super.update(delta);
  }

  rage(delta) {
    this.updateTimers(delta);
    this.setAnimation(this.animations.anger);
    this.animate(delta);
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
    this.rageTimer = Math.max(this.rageTimer - delta, 0);
  }

  isRaging() {
    return this.rageTimer > 0;
  }

  isCasting() {
    return this.castTimer > 0;
  }

  takeDamage(amount) {
    if (this.isRaging()) return;
    super.takeDamage(amount);
    if (this.isAttacking() || this.isCasting()) this.hurtTimer = 0;
    if (this.health <= this.nextPhaseAt()) this.startRage();
  }

  nextPhaseAt() {
    return (this.maxHealth * (PHASES - this.phase)) / PHASES;
  }

  startRage() {
    if (this.isDead()) return;
    this.phase += 1;
    this.attackCooldown = ATTACK_COOLDOWNS[this.phase - 1];
    this.spellCooldown = SPELL_COOLDOWNS[this.phase - 1];
    this.rageTimer = this.animations.anger.cycleDuration();
    this.hurtTimer = 0;
    this.attackTimer = 0;
    this.castTimer = 0;
    this.spellLoaded = false;
    this.pendingEffect = this.createRageEffect();
  }

  createRageEffect() {
    const centerY = this.y - RAGE_HEIGHTS[this.phase - 1];
    const animation = RAGE_EFFECTS[this.phase - 1];
    return new Effect(this.centerX(), centerY, RAGE_SIZE, animation);
  }

  takeEffect() {
    const effect = this.pendingEffect;
    this.pendingEffect = null;
    return effect;
  }

  startCast() {
    this.facingLeft = this.targetX < this.centerX();
    this.castTimer = this.animations.ice.cycleDuration();
    this.spellTimer = this.spellCooldown;
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
