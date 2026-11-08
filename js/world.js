import Character from "./entities/character.js";
import Enemy from "./entities/enemy.js";
import BackgroundLayer from "./entities/background-layer.js";
import Tile, { TILE_SIZE } from "./entities/tile.js";

const BACKGROUND_PATH = "./assets/images/forest/background/";
const GROUND_Y = 482;

export default class World {
  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.lastTime = 0;
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
    for (let i = 0; i < this.canvas.width / TILE_SIZE; i++) {
      this.groundTiles.push(
        new Tile(
          i * TILE_SIZE,
          this.canvas.height - TILE_SIZE,
          "./assets/images/forest/tiles/grass-top-middle.png",
        ),
      );
    }
    requestAnimationFrame((time) => this.loop(time));
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawObjects(this.backgroundLayers);
    this.drawObjects(this.groundTiles);
    this.character.draw(this.ctx);
    this.drawObjects(this.enemies);
  }

  drawObjects(objects) {
    for (let i = 0; i < objects.length; i++) {
      objects[i].draw(this.ctx);
    }
  }

  loop(time) {
    const delta = (time - this.lastTime) / 1000;
    this.lastTime = time;
    this.draw();
    requestAnimationFrame((t) => this.loop(t));
  }
}
