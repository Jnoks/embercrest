export default class Level {
  constructor({ width, groundY, backgroundLayers, tiles, enemies }) {
    this.width = width;
    this.groundY = groundY;
    this.backgroundLayers = backgroundLayers;
    this.tiles = tiles;
    this.enemies = enemies;
  }
}
