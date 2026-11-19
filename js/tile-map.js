import Tile, { TILE_SIZE } from "./entities/tile.js";

const TILE_PATH = "./assets/images/forest/tiles/";

export const GROUND = "#";
export const BACKDROP = "%";

export default class TileMap {
  constructor(screens, height) {
    this.rows = this.joinScreens(screens);
    this.top = height - this.rows.length * TILE_SIZE;
  }

  joinScreens(screens) {
    const rows = [];
    for (let row = 0; row < screens[0].length; row++) {
      let line = "";
      for (let i = 0; i < screens.length; i++) line += screens[i][row];
      rows.push(line);
    }
    return rows;
  }

  width() {
    return this.rows[0].length * TILE_SIZE;
  }

  cell(column, row) {
    const line = this.rows[this.clamp(row, this.rows.length - 1)];
    return line[this.clamp(column, line.length - 1)];
  }

  clamp(value, max) {
    return Math.min(Math.max(value, 0), max);
  }

  isKind(column, row, kind) {
    const char = this.cell(column, row);
    if (char === kind) return true;
    const behind = char === GROUND && this.cell(column, row - 1) === BACKDROP;
    return kind === BACKDROP && behind;
  }

  createTiles(kind) {
    const tiles = [];
    for (let row = 0; row < this.rows.length; row++) {
      for (let column = 0; column < this.rows[row].length; column++) {
        if (this.isKind(column, row, kind)) {
          tiles.push(this.createTile(column, row, kind));
        }
      }
    }
    return tiles;
  }

  createTile(column, row, kind) {
    const name = this.tileName(column, row, kind);
    const x = column * TILE_SIZE;
    const y = this.top + row * TILE_SIZE;
    return new Tile(x, y, TILE_PATH + name + ".png");
  }

  tileName(column, row, kind) {
    let name = "rock";
    if (!this.isKind(column, row - 1, kind)) name = "grass-top";
    if (!this.isKind(column - 1, row, kind)) return name + "-left";
    return name + "-middle";
  }
}
