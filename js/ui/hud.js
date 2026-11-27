import HudImage from "./hud-image.js";
import StatusBar from "./status-bar.js";
import QuestTracker from "./quest-tracker.js";

const HUD_PATH = "./assets/images/hud/";
const ENERGY = {
  mage: { fill: "mana", label: "Mana" },
  knight: { fill: "stamina", label: "Stamina" },
};

export default class Hud {
  constructor(hero) {
    const energy = ENERGY[hero];
    const frame = HUD_PATH + "small-bar.png";
    this.images = this.createImages(hero);
    this.healthBar = this.createBar(87, 12, 111, 12, "health", "HP");
    this.energyBar = this.createBar(86, 31, 87, 10, energy.fill, energy.label);
    this.bossBar = this.createBar(319, 36, 322, 16, "boss", "Boss");
    this.bossFrame = new HudImage(308, 30, 344, 28, HUD_PATH + "boss-bar.png");
    this.energyFrame = new HudImage(79, 27, 102, 18, frame);
    this.bossVisible = false;
    this.tracker = new QuestTracker();
  }

  createImages(hero) {
    return [
      new HudImage(9, 10, 70, 66, HUD_PATH + "portrait-background.png"),
      new HudImage(12, 11, 64, 64, HUD_PATH + "portrait-" + hero + ".png"),
      new HudImage(8, 8, 72, 71, HUD_PATH + "portrait-frame.png"),
      new HudImage(79, 8, 127, 20, HUD_PATH + "health-bar.png"),
    ];
  }

  createBar(x, y, width, height, name, label) {
    const path = HUD_PATH + name + "-fill.png";
    return new StatusBar(x, y, width, height, path, label);
  }

  update(character, boss, quest) {
    this.healthBar.setValue(character.health, character.maxHealth);
    this.energyBar.setValue(character.energy, character.maxEnergy);
    this.bossBar.setValue(boss.health, boss.maxHealth);
    this.bossBar.name = boss.name;
    this.bossVisible = boss.seesTarget() && !boss.isDead();
    this.tracker.update(quest);
  }

  draw(ctx) {
    for (let i = 0; i < this.images.length; i++) {
      this.images[i].draw(ctx);
    }
    this.healthBar.draw(ctx);
    this.energyFrame.draw(ctx);
    this.energyBar.draw(ctx);
    this.tracker.draw(ctx);
    if (this.bossVisible) {
      this.bossFrame.draw(ctx);
      this.bossBar.draw(ctx);
    }
  }
}
