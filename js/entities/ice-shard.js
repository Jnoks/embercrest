import SpriteAnimation from "../sprite-animation.js";
import Projectile from "./projectile.js";
import { sound } from "../sound.js";

const SHARD_PATH = "./assets/images/ice-shard/";
const SHARD_ANIMATIONS = {
  fly: new SpriteAnimation(SHARD_PATH, "fly", 3, 0.08),
  hit: new SpriteAnimation(SHARD_PATH, "hit", 4, 0.06, { loop: false }),
};

export default class IceShard extends Projectile {
  constructor(centerX, y, facingLeft) {
    super(centerX, y, 136, 128, facingLeft);
    this.anchorY = 84;
    this.hitboxWidth = 60;
    this.hitboxHeight = 12;
    this.damage = 15;
    this.speed = 300;
    this.range = 700;
    this.animations = SHARD_ANIMATIONS;
    this.setAnimation(this.animations.fly);
    sound.play("ice");
  }
}
