import Character from "./entities/character.js";

export default class World {
  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.character = new Character(100, 300);
    this.draw();
  }

  draw() {
    this.character.draw(this.ctx);
    requestAnimationFrame(() => this.draw());
  }
}
