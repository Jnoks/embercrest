import MovableObject from "./movable-object.js";
import SpriteAnimation from "../sprite-animation.js";

const SHARD_PATH = "./assets/images/ember-shard/";
const SHARD_SIZE = 32;
const SHARD_ANIMATION = new SpriteAnimation(SHARD_PATH, "spin", 10, 0.1);

export default class EmberShard extends MovableObject {
  constructor(centerX, y) {
    super(centerX - SHARD_SIZE / 2, y, SHARD_SIZE, SHARD_SIZE);
    this.anchorY = 31;
    this.hitboxWidth = 24;
    this.hitboxHeight = 28;
    this.done = false;
    this.setAnimation(SHARD_ANIMATION);
  }

  update(delta) {
    this.animate(delta);
  }
}
