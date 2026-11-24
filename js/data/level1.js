import Level from "../level.js";
import Goblin from "../entities/goblin.js";
import GoblinChief from "../entities/goblin-chief.js";
import Ent from "../entities/ent.js";
import Dino from "../entities/dino.js";
import BackgroundLayer from "../entities/background-layer.js";
import CloudLayer from "../entities/cloud-layer.js";
import TileMap, { BACKDROP, GROUND } from "../tile-map.js";
import Boss from "../entities/boss.js";
import Gate from "../entities/gate.js";
import Npc from "../entities/npc.js";
import EmberShard from "../entities/ember-shard.js";
import Heart from "../entities/heart.js";
import Checkpoint from "../entities/checkpoint.js";
import TrapPlant from "../entities/trap-plant.js";
import FallingSpike from "../entities/falling-spike.js";
import { TILE_SIZE } from "../entities/tile.js";
import GateScene from "../gate-scene.js";
import Rain from "../entities/rain.js";
import Sun from "../entities/sun.js";
import { WORLDS, SHOUTS } from "./story.js";
import { LEVEL1_SCREENS } from "./level1-map.js";
import { TREES, BUSHES, VINES, createPlants, createIvy } from "./plants.js";

const BACKGROUND_PATH = "./assets/images/forest/background/";
const GROUND_Y = 482;
const LEVEL_HEIGHT = 540;
const SHARD_HEIGHT = 30;
const PIT_SHIFT = 24;
const WALKERS = [
  { char: "g", type: Goblin },
  { char: "k", type: GoblinChief },
  { char: "e", type: Ent },
  { char: "d", type: Dino },
];

function createTiles(map, gate, latch) {
  const backdrop = map.createTiles(BACKDROP);
  const trees = createPlants(map, TREES);
  const ground = map.createTiles(GROUND);
  const ivy = createIvy(map);
  const vines = createPlants(map, VINES);
  const bushes = createPlants(map, BUSHES);
  return backdrop.concat([gate], trees, ground, ivy, vines, bushes, [latch]);
}

function createBackground(rain) {
  const path = BACKGROUND_PATH;
  return [
    new BackgroundLayer(0, 0, path + "sky.png", 0),
    new Sun(rain),
    new CloudLayer(0, 0, path + "clouds-back-layer2.png", 0.1, 15),
    new CloudLayer(0, 0, path + "clouds-back-layer1.png", 0.15, 10),
    new BackgroundLayer(0, 0, path + "mountains.png", 0.3),
    new CloudLayer(0, 0, path + "clouds-small.png", 0.5, 20),
    new BackgroundLayer(0, 0, path + "trees.png", 0.8),
  ];
}

function createObjects(map, char, create) {
  const objects = [];
  const spots = map.spots(char);
  for (let i = 0; i < spots.length; i++) {
    objects.push(create(spots[i], map));
  }
  return objects;
}

function createWalkers(map, kind) {
  const walkers = [];
  const spots = map.spots(kind.char);
  for (let i = 0; i < spots.length; i++) {
    const walker = new kind.type(spots[i].x, spots[i].floor);
    walker.setZone(map.zone(spots[i].column, spots[i].row));
    walkers.push(walker);
  }
  return walkers;
}

function createEnemies(map, boss) {
  let enemies = [];
  for (let i = 0; i < WALKERS.length; i++) {
    enemies = enemies.concat(createWalkers(map, WALKERS[i]));
  }
  return enemies.concat([boss]);
}

function createShard(spot) {
  return new EmberShard(spot.x, spot.floor - SHARD_HEIGHT);
}

function createHeart(spot) {
  return new Heart(spot.x, spot.y + TILE_SIZE / 2);
}

function createCheckpoint(spot) {
  return new Checkpoint(spot.x, spot.floor);
}

function createTrapPlant(spot, map) {
  const zone = map.zone(spot.column, spot.row);
  const middle = (zone.left + zone.right) / 2;
  let x = spot.x + Math.sign(middle - spot.x) * PIT_SHIFT;
  if (zone.right - zone.left === 2 * TILE_SIZE) x = middle;
  return new TrapPlant(x, spot.floor);
}

function createSpike(spot, map) {
  const floor = map.floorBelow(spot.column, spot.row);
  return new FallingSpike(spot.x, spot.y, floor);
}

function createFigures(map) {
  const gate = new Gate(9440, GROUND_Y);
  const latch = new Npc("latch", 17, 480, GROUND_Y);
  latch.facingLeft = true;
  const boss = new Boss(9085, GROUND_Y);
  boss.sightRange = 0;
  boss.lines = SHOUTS.hob;
  const enemies = createEnemies(map, boss);
  return { map, gate, latch, boss, enemies };
}

function addObjects(data) {
  data.shards = createObjects(data.map, "s", createShard);
  data.hearts = createObjects(data.map, "h", createHeart);
  data.checkpoints = createObjects(data.map, "c", createCheckpoint);
  const plants = createObjects(data.map, "x", createTrapPlant);
  data.traps = plants.concat(createObjects(data.map, "!", createSpike));
}

export default function createLevel1() {
  const map = new TileMap(LEVEL1_SCREENS, LEVEL_HEIGHT);
  const data = createFigures(map);
  data.width = map.width();
  data.groundY = GROUND_Y;
  data.rain = new Rain();
  data.backgroundLayers = createBackground(data.rain);
  data.tiles = createTiles(map, data.gate, data.latch);
  data.scene = new GateScene(data.gate, data.latch, WORLDS[0].gate);
  addObjects(data);
  return new Level(data);
}
