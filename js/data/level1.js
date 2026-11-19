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
import { WORLDS, SHOUTS } from "./story.js";
import { LEVEL1_SCREENS } from "./level1-map.js";
import { TREES, BUSHES, VINES, createPlants, createIvy } from "./plants.js";

const BACKGROUND_PATH = "./assets/images/forest/background/";
const GROUND_Y = 482;
const LEVEL_HEIGHT = 540;
const GOBLIN = "g";

function createTiles(map, gate, latch) {
  const backdrop = map.createTiles(BACKDROP);
  const trees = createPlants(map, TREES);
  const ground = map.createTiles(GROUND);
  const ivy = createIvy(map);
  const vines = createPlants(map, VINES);
  const bushes = createPlants(map, BUSHES);
  return backdrop.concat([gate], trees, ground, ivy, vines, bushes, [latch]);
}

function createGoblins(map) {
  const goblins = [];
  const spots = map.spots(GOBLIN);
  for (let i = 0; i < spots.length; i++) {
    const goblin = new Goblin(spots[i].x, spots[i].floor);
    goblin.setZone(map.zone(spots[i].column, spots[i].row));
    goblins.push(goblin);
  }
  return goblins;
}

function createShards() {
  return [
    new EmberShard(1696, GROUND_Y - 30),
    new EmberShard(4320, GROUND_Y - 286),
    new EmberShard(6560, GROUND_Y - 222),
    new EmberShard(8352, GROUND_Y - 158),
  ];
}

export default function createLevel1() {
  const map = new TileMap(LEVEL1_SCREENS, LEVEL_HEIGHT);
  const gate = new Gate(9440, GROUND_Y);
  const latch = new Npc("latch", 17, 480, GROUND_Y);
  latch.facingLeft = true;
  const boss = new Boss(9085, GROUND_Y);
  boss.sightRange = 0;
  boss.lines = SHOUTS.hob;
  const enemies = createGoblins(map);
  enemies.push(boss);
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
    enemies,
    boss,
    gate,
    latch,
    shards: createShards(),
    scene: new GateScene(gate, latch, WORLDS[0].gate),
    rain,
  });
}
