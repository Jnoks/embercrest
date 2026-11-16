import HudImage from "./hud-image.js";

const HUD_PATH = "./assets/images/hud/";

export default class Hud {
  constructor() {
    this.images = [
      new HudImage(9, 10, 70, 66, HUD_PATH + "portrait-background.png"),
      new HudImage(12, 11, 64, 64, HUD_PATH + "portrait-mage.png"),
      new HudImage(8, 8, 72, 71, HUD_PATH + "portrait-frame.png"),
      new HudImage(79, 8, 127, 20, HUD_PATH + "health-bar.png"),
    ];
  }

  draw(ctx) {
    for (let i = 0; i < this.images.length; i++) {
      this.images[i].draw(ctx);
    }
  }
}
