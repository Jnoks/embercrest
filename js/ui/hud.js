import HudImage from "./hud-image.js";
import StatusBar from "./status-bar.js";

const HUD_PATH = "./assets/images/hud/";

export default class Hud {
  constructor() {
    this.images = [
      new HudImage(9, 10, 70, 66, HUD_PATH + "portrait-background.png"),
      new HudImage(12, 11, 64, 64, HUD_PATH + "portrait-mage.png"),
      new HudImage(8, 8, 72, 71, HUD_PATH + "portrait-frame.png"),
      new HudImage(79, 8, 127, 20, HUD_PATH + "health-bar.png"),
      new HudImage(79, 27, 102, 18, HUD_PATH + "small-bar.png"),
    ];
    this.healthBar = new StatusBar(
      87,
      12,
      111,
      12,
      HUD_PATH + "health-fill.png",
      "HP",
    );
    this.manaBar = new StatusBar(
      86,
      31,
      87,
      10,
      HUD_PATH + "mana-fill.png",
      "Mana",
    );
  }

  update(character) {
    this.healthBar.setValue(character.health, character.maxHealth);
    this.manaBar.setValue(character.mana, character.maxMana);
  }

  draw(ctx) {
    for (let i = 0; i < this.images.length; i++) {
      this.images[i].draw(ctx);
    }
    this.healthBar.draw(ctx);
    this.manaBar.draw(ctx);
  }
}
