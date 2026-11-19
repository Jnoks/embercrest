export default class Level {
  constructor(data) {
    this.width = data.width;
    this.groundY = data.groundY;
    this.map = data.map;
    this.backgroundLayers = data.backgroundLayers;
    this.tiles = data.tiles;
    this.enemies = data.enemies;
    this.boss = data.boss;
    this.gate = data.gate;
    this.latch = data.latch;
    this.shards = data.shards;
    this.hearts = data.hearts;
    this.checkpoints = data.checkpoints;
    this.scene = data.scene;
    this.rain = data.rain;
  }
}
