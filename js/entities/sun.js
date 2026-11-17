import DrawableObject from "./drawable-object.js";
import SpriteAnimation from "../sprite-animation.js";

const SUN_PATH = "./assets/images/forest/background/";
const SUN_SIZE = 128;
const SUN_X = 700;
const HIDDEN_Y = 220;
const RISE = 196;

export default class Sun extends DrawableObject {
  constructor(rain) {
    super(SUN_X, HIDDEN_Y, SUN_SIZE, SUN_SIZE);
    this.rain = rain;
    this.setAnimation(new SpriteAnimation(SUN_PATH, "sun", 4, 0.15));
  }

  update(delta) {
    this.animate(delta);
    this.y = HIDDEN_Y - (1 - this.rain.amount) * RISE;
  }

  scrollTo(cameraX) {}
}
