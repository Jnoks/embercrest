import Character from "./entities/character.js";
import Enemy from "./entities/enemy.js";
import BackgroundLayer from "./entities/background-layer.js";
import Tile from "./entities/tile.js";

const BACKGROUND_PATH = "./assets/images/forest/background/";
const GROUND_Y = 482;

export default class World {
  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.character = new Character(100, GROUND_Y);
    this.enemies = [
      new Enemy(832, GROUND_Y),
      new Enemy(632, GROUND_Y),
      new Enemy(432, GROUND_Y),
    ];
    this.backgroundLayers = [
      new BackgroundLayer(0, 0, BACKGROUND_PATH + "sky.png"),
      new BackgroundLayer(0, 0, BACKGROUND_PATH + "clouds-back-layer2.png"),
      new BackgroundLayer(0, 0, BACKGROUND_PATH + "clouds-back-layer1.png"),
      new BackgroundLayer(0, 0, BACKGROUND_PATH + "mountains.png"),
      new BackgroundLayer(0, 0, BACKGROUND_PATH + "clouds-small.png"),
      new BackgroundLayer(0, 0, BACKGROUND_PATH + "trees.png"),
    ];
    this.groundTiles = [];
    for (let i = 0; i < 15; i++) {
      this.groundTiles.push(
        new Tile(
          i * 64,
          476,
          "./assets/images/forest/tiles/grass-top-middle.png",
        ),
      );
    }
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = 0; i < this.backgroundLayers.length; i++) {
      this.backgroundLayers[i].draw(this.ctx);
    }
    for (let i = 0; i < this.groundTiles.length; i++) {
      this.groundTiles[i].draw(this.ctx);
    }
    this.character.draw(this.ctx);
    for (let i = 0; i < this.enemies.length; i++) {
      this.enemies[i].draw(this.ctx);
    }

    requestAnimationFrame(() => this.draw());
  }
}
