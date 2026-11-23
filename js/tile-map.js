import Tile, { TILE_SIZE } from "./entities/tile.js";

const TILE_PATH = "./assets/images/forest/tiles/";
const SURFACE = 6;
const STEP = 8;
const VIEW_STEP = 16;
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
export const IVY = "&";

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
    const char = line[this.clamp(column, line.length - 1)];
    if (char === IVY) return GROUND;
    return char;
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

  isSolid(x, y) {
    const column = Math.floor(x / TILE_SIZE);
    const row = Math.floor((y - this.top) / TILE_SIZE);
    return this.cell(column, row) === GROUND;
  }

  hitsTop(box) {
    return this.isSolid(box.left, box.top) || this.isSolid(box.right, box.top);
  }

  hitsWall(box) {
    const bottom = box.bottom - STEP;
    if (this.hitsTop(box)) return true;
    return this.isSolid(box.left, bottom) || this.isSolid(box.right, bottom);
  }

  hitsRock(box) {
    const bottom = this.isSolid(box.left, box.bottom);
    return this.hitsTop(box) || bottom || this.isSolid(box.right, box.bottom);
  }

  blocksView(from, to) {
    const distanceX = to.x - from.x;
    const distanceY = to.y - from.y;
    const longest = Math.max(Math.abs(distanceX), Math.abs(distanceY));
    const steps = Math.ceil(longest / VIEW_STEP);
    for (let i = 1; i < steps; i++) {
      const x = from.x + (distanceX * i) / steps;
      const y = from.y + (distanceY * i) / steps;
      if (this.isSolid(x, y)) return true;
    }
    return false;
  }

  floorUnder(box, lastBottom) {
    const start = lastBottom - STEP - SURFACE - this.top;
    const end = box.bottom - SURFACE - this.top;
    const last = Math.floor(end / TILE_SIZE);
    for (let row = Math.ceil(start / TILE_SIZE); row <= last; row++) {
      if (this.isFloor(box, row)) return this.top + row * TILE_SIZE + SURFACE;
    }
    return null;
  }

  isFloor(box, row) {
    const left = Math.floor(box.left / TILE_SIZE);
    const right = Math.floor(box.right / TILE_SIZE);
    return this.isTop(left, row) || this.isTop(right, row);
  }

  isTop(column, row) {
    const above = this.cell(column, row - 1);
    return this.cell(column, row) === GROUND && above !== GROUND;
  }

  spots(char) {
    const spots = [];
    for (let row = 0; row < this.rows.length; row++) {
      for (let column = 0; column < this.rows[row].length; column++) {
        if (this.rows[row][column] === char) spots.push(this.spot(column, row));
      }
    }
    return spots;
  }

  spot(column, row) {
    const x = column * TILE_SIZE + TILE_SIZE / 2;
    const y = this.top + row * TILE_SIZE;
    const floor = y + TILE_SIZE + SURFACE;
    return { column, row, x, y, floor };
  }

  floorBelow(column, row) {
    let last = row;
    while (this.cell(column, last + 1) !== GROUND) last += 1;
    return this.spot(column, last).floor;
  }

  zone(column, row) {
    let first = column;
    let last = column;
    while (this.isStand(first - 1, row)) first -= 1;
    while (this.isStand(last + 1, row)) last += 1;
    return { left: first * TILE_SIZE, right: (last + 1) * TILE_SIZE };
  }

  isStand(column, row) {
    if (column < 0 || column >= this.rows[0].length) return false;
    const free = this.cell(column, row) !== GROUND;
    return free && this.cell(column, row + 1) === GROUND;
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
