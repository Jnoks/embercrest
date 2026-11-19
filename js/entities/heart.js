import MovableObject from "./movable-object.js";
import SpriteAnimation from "../sprite-animation.js";

const HEART_PATH = "./assets/images/heart/";
const HEART_SIZE = 32;
const HEART_ANIMATION = new SpriteAnimation(HEART_PATH, "spin", 10, 0.1);

export default class Heart extends MovableObject {
  constructor(centerX, centerY) {
    const bottom = centerY + HEART_SIZE / 2;
    super(centerX - HEART_SIZE / 2, bottom, HEART_SIZE, HEART_SIZE);
    this.anchorY = HEART_SIZE;
    this.hitboxWidth = 24;
    this.hitboxHeight = 24;
    this.amount = 25;
    this.done = false;
    this.setAnimation(HEART_ANIMATION);
  }

  update(delta) {
    this.animate(delta);
  }
}
