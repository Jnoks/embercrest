import Level from "../level.js";
import Goblin from "../entities/goblin.js";
import BackgroundLayer from "../entities/background-layer.js";
import CloudLayer from "../entities/cloud-layer.js";
import TileMap, { BACKDROP, GROUND } from "../tile-map.js";
import Boss from "../entities/boss.js";
import Gate from "../entities/gate.js";
import Npc from "../entities/npc.js";
import EmberShard from "../entities/ember-shard.js";
import GateScene from "../gate-scene.js";
import Rain from "../entities/rain.js";
import Sun from "../entities/sun.js";
import { WORLDS } from "./story.js";
import { LEVEL1_SCREENS } from "./level1-map.js";

const BACKGROUND_PATH = "./assets/images/forest/background/";
const GROUND_Y = 482;
const LEVEL_HEIGHT = 540;

function createTiles(map, gate, latch) {
  const tiles = map.createTiles(BACKDROP);
  const ground = map.createTiles(GROUND);
  tiles.push(gate);
  for (let i = 0; i < ground.length; i++) tiles.push(ground[i]);
  tiles.push(latch);
  return tiles;
}

function createShards() {
  return [
    new EmberShard(700, GROUND_Y - 30),
    new EmberShard(1050, GROUND_Y - 100),
    new EmberShard(1500, GROUND_Y - 30),
    new EmberShard(1850, GROUND_Y - 100),
  ];
}

export default function createLevel1() {
  const map = new TileMap(LEVEL1_SCREENS, LEVEL_HEIGHT);
  const gate = new Gate(2790, GROUND_Y);
  const latch = new Npc("latch", 17, 420, GROUND_Y);
  latch.facingLeft = true;
  const boss = new Boss(2600, GROUND_Y);
  const rain = new Rain();
  return new Level({
    width: map.width(),
    groundY: GROUND_Y,
    map,
    backgroundLayers: [
      new BackgroundLayer(0, 0, BACKGROUND_PATH + "sky.png", 0),
      new Sun(rain),
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
    tiles: createTiles(map, gate, latch),
    enemies: [
      new Goblin(1200, GROUND_Y),
      new Goblin(1800, GROUND_Y),
      new Goblin(2400, GROUND_Y),
      boss,
    ],
    boss,
    gate,
    latch,
    shards: createShards(),
    scene: new GateScene(gate, latch, WORLDS[0].gate),
    rain,
  });
}
