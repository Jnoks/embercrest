import MovableObject from "./movable-object.js";

export const TILE_SIZE = 64;

export default class Tile extends MovableObject {
  constructor(x, y, imagePath) {
    super(x, y, TILE_SIZE, TILE_SIZE);
    this.loadImage(imagePath);
  }
}
