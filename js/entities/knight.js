import Character from "./character.js";
import SpriteAnimation from "../sprite-animation.js";
import { sound } from "../sound.js";

const KNIGHT_PATH = "./assets/images/knight/";
const SWING_COOLDOWN = 0.8;
const HIT_FRAME = 1;
const SWORD_REACH = 44;
const ONCE = { loop: false };
const DEATH = { loop: false, padding: 64 };

export default class Knight extends Character {
  constructor(x, y, keyboard) {
    super(x, y, keyboard);
    this.anchorY = 110;
    this.damage = 20;
    this.armor = 0.7;
    this.struck = false;
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
}
