import Tile, { TILE_SIZE } from "./entities/tile.js";

const TILE_PATH = "./assets/images/forest/tiles/";
const CORNER_TILES = [
  "rock-middle-tl",
  "rock-middle-tr",
  "rock-middle-bl",
  "rock-middle-br",
  "rock-middle-tl-bl",
  "rock-middle-tr-br",
];

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
    if (row >= this.rows.length) return true;
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
    const name = this.shape(column, row, kind) + this.side(column, row, kind);
    const corners = this.corners(column, row, kind);
    if (CORNER_TILES.includes(name + corners)) return name + corners;
    return name;
  }

  shape(column, row, kind) {
    const above = this.isKind(column, row - 1, kind);
    const below = this.isKind(column, row + 1, kind);
    if (above && below) return "rock";
    if (above) return "under";
    if (below) return "grass-top";
    return "island";
  }

  side(column, row, kind) {
    const left = this.isKind(column - 1, row, kind);
    const right = this.isKind(column + 1, row, kind);
    if (left && right) return "-middle";
    if (left) return "-right";
    if (right) return "-left";
    return "-single";
  }

  corners(column, row, kind) {
    let corners = "";
    if (this.isCorner(column, row, kind, -1, -1)) corners += "-tl";
    if (this.isCorner(column, row, kind, 1, -1)) corners += "-tr";
    if (this.isCorner(column, row, kind, -1, 1)) corners += "-bl";
    if (this.isCorner(column, row, kind, 1, 1)) corners += "-br";
    return corners;
  }

  isCorner(column, row, kind, dx, dy) {
    const horizontal = this.isKind(column + dx, row, kind);
    const vertical = this.isKind(column, row + dy, kind);
    const diagonal = this.isKind(column + dx, row + dy, kind);
    return horizontal && vertical && !diagonal;
  }
}
