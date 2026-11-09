import BackgroundLayer from "./background-layer.js";

export default class CloudLayer extends BackgroundLayer {
  constructor(x, y, imagePath, parallax, speed) {
    super(x, y, imagePath, parallax);
    this.speed = speed;
  }

  update(delta) {
    this.x -= this.speed * delta;
  }
}
