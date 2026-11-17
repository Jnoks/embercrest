import Level from "../level.js";
import Goblin from "../entities/goblin.js";
import BackgroundLayer from "../entities/background-layer.js";
import CloudLayer from "../entities/cloud-layer.js";
import Tile, { TILE_SIZE } from "../entities/tile.js";
import Boss from "../entities/boss.js";
import Gate from "../entities/gate.js";

const BACKGROUND_PATH = "./assets/images/forest/background/";
const TILE_PATH = "./assets/images/forest/tiles/";
const GROUND_Y = 482;
const LEVEL_WIDTH = 2880;
const LEVEL_HEIGHT = 540;
const WALL = [
  ["grass-top-left", "grass-top-middle", "grass-top-middle"],
  ["rock-left", "rock-middle", "rock-middle"],
  ["rock-left", "rock-middle", "rock-middle"],
  ["rock-left", "rock-middle", "rock-middle"],
];
const WALL_X = LEVEL_WIDTH - WALL[0].length * TILE_SIZE;
const WALL_Y = LEVEL_HEIGHT - WALL.length * TILE_SIZE;

function createWall() {
  const tiles = [];
  for (let row = 0; row < WALL.length; row++) {
    for (let column = 0; column < WALL[row].length; column++) {
      const x = WALL_X + column * TILE_SIZE;
      const y = WALL_Y + row * TILE_SIZE;
      tiles.push(new Tile(x, y, TILE_PATH + WALL[row][column] + ".png"));
    }
  }
  return tiles;
}

export default function createLevel1() {
  const gate = new Gate(2790, GROUND_Y);
  const tiles = createWall();
  tiles.push(gate);
  for (let i = 0; i < LEVEL_WIDTH / TILE_SIZE; i++) {
    const y = LEVEL_HEIGHT - TILE_SIZE;
    tiles.push(new Tile(i * TILE_SIZE, y, TILE_PATH + "grass-top-middle.png"));
  }
  const boss = new Boss(2600, GROUND_Y);
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
      boss,
    ],
    boss,
    gate,
  });
}
