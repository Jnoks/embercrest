import Character from "./entities/character.js";
import Hud from "./ui/hud.js";

const SHAKE = 4;
const PUSH_RANGE = 320;
const PUSH_SPEED = 260;

export default class World {
  constructor(canvas, keyboard, level) {
    this.ctx = canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    this.canvas = canvas;
    this.cameraX = 0;
    this.lastTime = 0;
    this.level = level;
    this.character = new Character(100, this.level.groundY, keyboard);
    this.hud = new Hud();
    this.bolts = [];
    this.spells = [];
    this.effects = [];

    requestAnimationFrame((time) => this.loop(time));
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawObjects(this.level.backgroundLayers);
    this.ctx.save();
    this.ctx.translate(-Math.round(this.cameraX) + this.shake(), this.shake());
    this.drawObjects(this.level.tiles);
    this.character.draw(this.ctx);
    this.drawObjects(this.level.enemies);
    this.drawObjects(this.bolts);
    this.drawObjects(this.spells);
    this.drawObjects(this.effects);
    this.ctx.restore();
    this.hud.draw(this.ctx);
  }

  drawObjects(objects) {
    for (let i = 0; i < objects.length; i++) {
      objects[i].draw(this.ctx);
    }
  }

  update(delta) {
    this.updateObjects(this.level.backgroundLayers, delta);
    this.character.update(delta);
    this.pushCharacter(delta);
    if (this.character.y >= this.level.groundY) {
      this.character.land(this.level.groundY);
    }
    this.character.x = Math.min(
      Math.max(this.character.x, 0),
      this.level.width - this.character.width,
    );
    this.updateTargets();
    this.updateObjects(this.level.enemies, delta);
    this.checkCollisions();
    this.updateBolts(delta);
    this.updateSpells(delta);
    this.updateEffects(delta);
    this.hud.update(this.character, this.level.boss);
    this.cameraX = Math.min(
      Math.max(this.character.x - 100, 0),
      this.level.width - this.canvas.width,
    );
    for (let i = 0; i < this.level.backgroundLayers.length; i++) {
      this.level.backgroundLayers[i].scrollTo(this.cameraX);
    }
  }

  updateBolts(delta) {
    const bolt = this.character.takeBolt();
    if (bolt) this.bolts.push(bolt);
    this.bolts = this.updateProjectiles(this.bolts, delta);
    this.checkBoltHits();
  }

  updateProjectiles(projectiles, delta) {
    this.updateObjects(projectiles, delta);
    return projectiles.filter((projectile) => !projectile.done);
  }

  updateSpells(delta) {
    const spell = this.level.boss.takeSpell();
    if (spell) this.spells.push(spell);
    this.spells = this.updateProjectiles(this.spells, delta);
    for (let i = 0; i < this.spells.length; i++) {
      this.hitCharacter(this.spells[i]);
      this.hitGround(this.spells[i]);
    }
  }

  checkBoltHits() {
    for (let i = 0; i < this.bolts.length; i++) {
      for (let j = 0; j < this.level.enemies.length; j++) {
        this.hitEnemy(this.bolts[i], this.level.enemies[j]);
      }
    }
  }

  hitEnemy(bolt, enemy) {
    if (bolt.isExploding() || enemy.isDead()) return;
    if (!bolt.isColliding(enemy)) return;
    enemy.takeDamage(bolt.damage);
    bolt.explode();
  }

  hitCharacter(spell) {
    if (!spell.isHitting()) return;
    if (!spell.isColliding(this.character)) return;
    this.character.takeDamage(spell.damage);
    spell.explode();
  }

  hitGround(spell) {
    if (spell.y >= this.level.groundY) spell.explode();
  }

  updateEffects(delta) {
    const effect = this.level.boss.takeEffect();
    if (effect) this.effects.push(effect);
    this.effects = this.updateProjectiles(this.effects, delta);
  }

  pushCharacter(delta) {
    const boss = this.level.boss;
    if (!boss.isRaging() || this.character.isDead()) return;
    const distance = this.character.centerX() - boss.centerX();
    if (Math.abs(distance) > PUSH_RANGE) return;
    this.character.x += Math.sign(distance) * PUSH_SPEED * delta;
  }

  shake() {
    if (!this.level.boss.isRaging()) return 0;
    return Math.round((Math.random() * 2 - 1) * SHAKE);
  }

  updateObjects(objects, delta) {
    for (let i = 0; i < objects.length; i++) {
      objects[i].update(delta);
    }
  }

  updateTargets() {
    for (let i = 0; i < this.level.enemies.length; i++) {
      this.level.enemies[i].targetX = this.character.centerX();
    }
  }

  checkCollisions() {
    if (this.character.isDead()) return;
    for (let i = 0; i < this.level.enemies.length; i++) {
      const enemy = this.level.enemies[i];
      if (this.character.overlaps(enemy.attackBox())) {
        enemy.attack();
        if (enemy.isHitting()) {
          this.character.takeDamage(enemy.damage);
        }
      }
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
