import DrawableObject from "./drawable-object.js";

export default class Effect extends DrawableObject {
  constructor(centerX, centerY, size, animation) {
    super(centerX - size / 2, centerY, size, size);
    this.anchorY = size / 2;
    this.done = false;
    this.setAnimation(animation);
  }

  update(delta) {
    this.animate(delta);
    if (this.isAnimationFinished()) this.done = true;
  }
}
