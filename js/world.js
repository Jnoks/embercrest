import Character from "./entities/character.js";

export default class World {
  constructor(canvas, keyboard, level) {
    this.ctx = canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    this.canvas = canvas;
    this.cameraX = 0;
    this.lastTime = 0;
    this.level = level;
    this.character = new Character(100, this.level.groundY, keyboard);

    requestAnimationFrame((time) => this.loop(time));
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawObjects(this.level.backgroundLayers);
    this.ctx.save();
    this.ctx.translate(-Math.round(this.cameraX), 0);
    this.drawObjects(this.level.tiles);
    this.character.draw(this.ctx);
    this.drawObjects(this.level.enemies);
    this.ctx.restore();
  }

  drawObjects(objects) {
    for (let i = 0; i < objects.length; i++) {
      objects[i].draw(this.ctx);
    }
  }

  update(delta) {
    this.updateObjects(this.level.backgroundLayers, delta);
    this.character.update(delta);
    if (this.character.y >= this.level.groundY) {
      this.character.land(this.level.groundY);
    }
    this.character.x = Math.min(
      Math.max(this.character.x, 0),
      this.level.width - this.character.width,
    );
    this.updateObjects(this.level.enemies, delta);
    this.checkCollisions();
    this.cameraX = Math.min(
      Math.max(this.character.x - 100, 0),
      this.level.width - this.canvas.width,
    );
    for (let i = 0; i < this.level.backgroundLayers.length; i++) {
      this.level.backgroundLayers[i].scrollTo(this.cameraX);
    }
  }

  updateObjects(objects, delta) {
    for (let i = 0; i < objects.length; i++) {
      objects[i].update(delta);
    }
  }

  checkCollisions() {
    for (let i = 0; i < this.level.enemies.length; i++) {
      if (this.character.isColliding(this.level.enemies[i])) console.log("hit");
    }
  }

  loop(time) {
    const delta = Math.min((time - this.lastTime) / 1000, 0.1);
    this.lastTime = time;
    this.update(delta);
    this.draw();
    requestAnimationFrame((t) => this.loop(t));
  }
}
