import Character from "./entities/character.js";
import Enemy from "./entities/enemy.js";

export default class World {
  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.character = new Character(100, 300);
    this.enemies = [
      new Enemy(832, 321),
      new Enemy(632, 321),
      new Enemy(432, 321),
    ];
    this.draw();
  }

  draw() {
    this.character.draw(this.ctx);
    for (let i = 0; i < this.enemies.length; i++) {
      this.enemies[i].draw(this.ctx);
    }
    requestAnimationFrame(() => this.draw());
  }
}
