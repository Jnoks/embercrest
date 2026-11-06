import Character from "./entities/character.js";
import Enemy from "./entities/enemy.js";
import BackgroundLayer from "./entities/background-layer.js";

const BACKGROUND_PATH = "./assets/images/forest/background/";

export default class World {
  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.character = new Character(100, 300);
    this.enemies = [
      new Enemy(832, 321),
      new Enemy(632, 321),
      new Enemy(432, 321),
    ];
    this.backgroundLayers = [
      new BackgroundLayer(0, 0, BACKGROUND_PATH + "sky.png"),
      new BackgroundLayer(0, 0, BACKGROUND_PATH + "clouds-back-layer2.png"),
      new BackgroundLayer(0, 0, BACKGROUND_PATH + "clouds-back-layer1.png"),
      new BackgroundLayer(0, 0, BACKGROUND_PATH + "mountains.png"),
      new BackgroundLayer(0, 0, BACKGROUND_PATH + "clouds-small.png"),
      new BackgroundLayer(0, 0, BACKGROUND_PATH + "trees.png"),
    ];
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = 0; i < this.backgroundLayers.length; i++) {
      this.backgroundLayers[i].draw(this.ctx);
    }
    this.character.draw(this.ctx);
    for (let i = 0; i < this.enemies.length; i++) {
      this.enemies[i].draw(this.ctx);
    }

    requestAnimationFrame(() => this.draw());
  }
}
