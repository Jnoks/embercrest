import Level from "../level.js";
import Goblin from "../entities/goblin.js";
import BackgroundLayer from "../entities/background-layer.js";
import CloudLayer from "../entities/cloud-layer.js";
import Tile, { TILE_SIZE } from "../entities/tile.js";
import Boss from "../entities/boss.js";

const BACKGROUND_PATH = "./assets/images/forest/background/";
const GROUND_Y = 482;
const LEVEL_WIDTH = 2880;
const LEVEL_HEIGHT = 540;

export default function createLevel1() {
  const tiles = [];
  for (let i = 0; i < LEVEL_WIDTH / TILE_SIZE; i++) {
    tiles.push(
      new Tile(
        i * TILE_SIZE,
        LEVEL_HEIGHT - TILE_SIZE,
        "./assets/images/forest/tiles/grass-top-middle.png",
      ),
    );
  }
  return new Level({
    width: LEVEL_WIDTH,
    groundY: GROUND_Y,
    backgroundLayers: [
      new BackgroundLayer(0, 0, BACKGROUND_PATH + "sky.png", 0),
      new CloudLayer(0, 0, BACKGROUND_PATH + "clouds-back-layer2.png", 0.1, 15),
      new CloudLayer(
        0,
        0,
        BACKGROUND_PATH + "clouds-back-layer1.png",
        0.15,
        10,
      ),
      new BackgroundLayer(0, 0, BACKGROUND_PATH + "mountains.png", 0.3),
      new CloudLayer(0, 0, BACKGROUND_PATH + "clouds-small.png", 0.5, 20),
      new BackgroundLayer(0, 0, BACKGROUND_PATH + "trees.png", 0.8),
    ],
    tiles,
    enemies: [
      new Goblin(1200, GROUND_Y),
      new Goblin(1800, GROUND_Y),
      new Goblin(2400, GROUND_Y),
      new Boss(2600, GROUND_Y),
    ],
  });
}
