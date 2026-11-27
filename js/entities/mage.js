import Character from "./character.js";
import SpriteAnimation from "../sprite-animation.js";
import Bolt from "./bolt.js";

const MAGE_PATH = "./assets/images/mage/";
const SPELL_COST = 20;
const CAST_COOLDOWN = 0.6;
const STAFF_REACH = 41;
const STAFF_HEIGHT = 19;
const RELEASE_FRAME = 4;
const ONCE = { loop: false };
const DEATH = { loop: false, padding: 64 };

export default class Mage extends Character {
  constructor(x, y, keyboard) {
    super(x, y, keyboard);
    this.maxEnergy = 100;
    this.energy = this.maxEnergy;
    this.energyRegen = 10;
    this.pendingBolt = null;
    this.boltLoaded = false;
    this.animations = this.createAnimations();
    this.setAnimation(this.animations.idle);
  }

  createAnimations() {
    return {
      idle: new SpriteAnimation(MAGE_PATH, "idle", 14, 0.2, { loopPause: 2 }),
      run: new SpriteAnimation(MAGE_PATH, "run", 8, 0.08),
      jump: new SpriteAnimation(MAGE_PATH, "jump", 7, 0.1),
      flip: new SpriteAnimation(MAGE_PATH, "flip", 6, 0.07, ONCE),
      hurt: new SpriteAnimation(MAGE_PATH, "hurt", 4, 0.1, ONCE),
      attack: new SpriteAnimation(MAGE_PATH, "attack", 7, 0.07, ONCE),
      death: new SpriteAnimation(MAGE_PATH, "death", 10, 0.1, DEATH),
    };
  }

  update(delta) {
    super.update(delta);
    this.releaseBolt();
  }

  attack() {
    if (this.isOnCooldown() || this.energy < SPELL_COST) return;
    this.energy -= SPELL_COST;
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

  takeBolt() {
    const bolt = this.pendingBolt;
    this.pendingBolt = null;
    return bolt;
  }
}
