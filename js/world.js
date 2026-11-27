import Mage from "./entities/mage.js";
import Knight from "./entities/knight.js";
import Heart from "./entities/heart.js";
import Hud from "./ui/hud.js";
import Battle from "./battle.js";
import { sound } from "./sound.js";
import { updateObjects, updateProjectiles } from "./update.js";

const SHAKE = 4;
const PUSH_RANGE = 320;
const PUSH_SPEED = 260;
const ROOM_OPEN_SPEED = 300;
const EDGE_MARGIN = 26;
const HEART_DROP = 40;
const HEART_GAP = 20;
const CAMERA_OFFSET = 100;
const HEROES = { mage: Mage, knight: Knight };

export default class World {
  constructor(canvas, keyboard, level, quest) {
    this.canvas = canvas;
    this.ctx = this.createContext();
    this.cameraX = 0;
    this.leftLimit = 0;
    this.level = level;
    this.quest = quest;
    this.effects = [];
    this.bossPhase = this.level.boss.phase;
    this.createCharacter(keyboard);
    this.restore();
  }

  createContext() {
    const ctx = this.canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    return ctx;
  }

  createCharacter(keyboard) {
    const Hero = HEROES[this.quest.hero];
    this.character = new Hero(100, this.level.groundY, keyboard);
    this.hud = new Hud(this.quest.hero);
    this.battle = new Battle(this.level, this.character);
  }

  applyDifficulty(difficulty) {
    this.weakenEnemies(difficulty.enemyHealth);
    this.character.damage = difficulty.swordDamage;
    this.level.boss.maxHealth = difficulty.bossHealth;
    this.level.boss.health = difficulty.bossHealth;
  }

  weakenEnemies(factor) {
    for (let i = 0; i < this.level.enemies.length; i++) {
      const enemy = this.level.enemies[i];
      enemy.maxHealth *= factor;
      enemy.health = enemy.maxHealth;
    }
  }

  restore() {
    const found = this.quest.found;
    const total = this.level.shards.length;
    this.level.shards = this.level.shards.filter(
      (shard) => !found.includes(shard.centerX()),
    );
    this.quest.shards = total - this.level.shards.length;
    this.respawn();
  }

  respawn() {
    const spawn = this.quest.spawn;
    if (spawn === null) return;
    this.character.x = spawn.x - this.character.anchorX;
    this.character.y = spawn.y;
    for (let i = 0; i < this.level.checkpoints.length; i++) {
      const checkpoint = this.level.checkpoints[i];
      checkpoint.setActive(checkpoint.centerX() === spawn.x);
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawObjects(this.level.backgroundLayers);
    this.level.rain.draw(this.ctx);
    this.ctx.save();
    this.ctx.translate(-Math.round(this.cameraX) + this.shake(), this.shake());
    this.drawScene();
    this.ctx.restore();
    this.hud.draw(this.ctx);
  }

  drawScene() {
    this.drawObjects(this.level.tiles);
    this.drawObjects(this.level.checkpoints);
    this.drawObjects(this.level.shards);
    this.drawObjects(this.level.hearts);
    this.character.draw(this.ctx);
    this.drawObjects(this.level.traps);
    this.drawObjects(this.level.enemies);
    this.drawObjects(this.battle.bolts);
    this.drawObjects(this.battle.spells);
    this.drawObjects(this.effects);
  }

  drawObjects(objects) {
    for (let i = 0; i < objects.length; i++) {
      objects[i].draw(this.ctx);
    }
  }

  update(delta) {
    this.updateScenery(delta);
    this.moveCharacter(delta);
    this.updateBossRoom(delta);
    this.keepInside();
    this.battle.update(delta);
    this.updateEffects(delta);
    this.updateQuest(delta);
    this.collectHearts(delta);
    this.updateTraps(delta);
    this.hud.update(this.character, this.level.boss, this.quest);
    this.updateCamera();
  }

  updateCamera() {
    const max = this.level.width - this.canvas.width;
    const x = Math.max(this.character.x - CAMERA_OFFSET, this.leftLimit);
    this.cameraX = Math.min(x, max);
    for (let i = 0; i < this.level.backgroundLayers.length; i++) {
      this.level.backgroundLayers[i].scrollTo(this.cameraX);
    }
  }

  moveCharacter(delta) {
    const character = this.character;
    const lastX = character.x;
    const lastY = character.y;
    character.update(delta);
    this.pushCharacter(delta);
    this.stopAtWalls(lastX, lastY);
    this.stopAtCeiling(lastY);
    this.landOnTiles(lastY);
  }

  stopAtWalls(lastX, lastY) {
    const box = this.character.hitbox();
    const rise = lastY - this.character.y;
    box.top += rise;
    box.bottom += rise;
    if (this.level.map.hitsWall(box)) this.character.x = lastX;
  }

  stopAtCeiling(lastY) {
    const character = this.character;
    if (character.velocityY >= 0) return;
    if (this.level.map.hitsTop(character.hitbox())) {
      character.y = lastY;
      character.velocityY = 0;
    }
  }

  landOnTiles(lastY) {
    const character = this.character;
    const floor = this.level.map.floorUnder(character.hitbox(), lastY);
    if (floor === null) character.onGround = false;
    else character.land(floor);
  }

  updateScenery(delta) {
    updateObjects(this.level.backgroundLayers, delta);
    this.level.rain.update(delta);
  }

  updateEffects(delta) {
    const effect = this.level.boss.takeEffect();
    if (effect) this.effects.push(effect);
    const star = this.level.gate.takeEffect();
    if (star) this.effects.push(star);
    this.effects = updateProjectiles(this.effects, delta);
  }

  updateQuest(delta) {
    const latch = this.level.latch;
    const scene = this.level.scene;
    this.updateCheckpoints();
    this.collectShards(delta);
    this.updateScene();
    latch.update(delta);
    latch.marked = this.quest.state === "new";
    latch.near = !scene.isRunning() && this.character.isColliding(latch);
    if (latch.near && this.character.wantsToTalk()) this.quest.meet();
  }

  updateCheckpoints() {
    if (this.character.isDead()) return;
    for (let i = 0; i < this.level.checkpoints.length; i++) {
      const checkpoint = this.level.checkpoints[i];
      if (this.isAhead(checkpoint) && this.character.isColliding(checkpoint)) {
        this.activate(checkpoint);
      }
    }
  }

  isAhead(checkpoint) {
    const spawn = this.quest.spawn;
    return spawn === null || checkpoint.centerX() > spawn.x;
  }

  activate(checkpoint) {
    for (let i = 0; i < this.level.checkpoints.length; i++) {
      this.level.checkpoints[i].setActive(false);
    }
    checkpoint.setActive(true);
    this.quest.reach({ x: checkpoint.centerX(), y: checkpoint.y });
    this.effects.push(checkpoint.createEffect());
    sound.play("checkpoint");
  }

  updateScene() {
    const scene = this.level.scene;
    const ready = this.quest.isComplete() && this.isInBossRoom();
    if (ready && !scene.isRunning()) scene.start(this.character, this.quest);
    scene.update();
  }

  collectShards(delta) {
    const loot = this.level.boss.takeLoot();
    if (loot) this.level.shards.push(loot);
    for (let i = 0; i < this.level.shards.length; i++) {
      const shard = this.level.shards[i];
      if (this.character.isColliding(shard)) {
        shard.done = true;
        this.quest.collect(shard.centerX());
        sound.play("shard");
      }
    }
    this.level.shards = updateProjectiles(this.level.shards, delta);
  }

  dropHearts() {
    const boss = this.level.boss;
    const y = boss.y - HEART_DROP;
    if (boss.phase === this.bossPhase) return;
    this.bossPhase = boss.phase;
    this.level.hearts.push(new Heart(boss.centerX() - HEART_GAP, y));
    this.level.hearts.push(new Heart(boss.centerX() + HEART_GAP, y));
  }

  collectHearts(delta) {
    this.dropHearts();
    for (let i = 0; i < this.level.hearts.length; i++) {
      const heart = this.level.hearts[i];
      if (this.character.canHeal() && this.character.isColliding(heart)) {
        this.character.heal(heart.amount);
        heart.done = true;
        sound.play("heart");
      }
    }
    this.level.hearts = updateProjectiles(this.level.hearts, delta);
  }

  updateTraps(delta) {
    for (let i = 0; i < this.level.traps.length; i++) {
      const trap = this.level.traps[i];
      trap.targetX = this.character.centerX();
      trap.targetY = this.character.y;
      if (this.character.isColliding(trap)) this.touchTrap(trap);
    }
    this.level.traps = updateProjectiles(this.level.traps, delta);
  }

  touchTrap(trap) {
    trap.touch();
    if (trap.isHitting()) this.character.takeDamage(trap.damage);
  }

  updateBossRoom(delta) {
    const boss = this.level.boss;
    this.level.gate.update(delta);
    this.checkGate();
    if (boss.isGone()) this.endFight();
    if (boss.isDead()) {
      this.leftLimit = Math.max(this.leftLimit - ROOM_OPEN_SPEED * delta, 0);
    } else if (this.isInBossRoom() || boss.sightRange > 0) {
      this.leftLimit = this.cameraX;
      boss.sightRange = this.canvas.width;
      this.quest.faceBoss();
      sound.playMusic("boss");
    }
  }

  endFight() {
    this.quest.beatBoss();
    this.level.rain.stop();
    sound.playMusic("forest");
  }

  isInBossRoom() {
    return this.cameraX === this.level.width - this.canvas.width;
  }

  checkGate() {
    const gate = this.level.gate;
    const scene = this.level.scene;
    if (gate.unlocked || scene.isRunning()) return;
    if (!this.level.boss.isGone()) return;
    if (this.character.isColliding(gate)) this.quest.showOnce(scene.locked);
  }

  keepInside() {
    const character = this.character;
    const min = this.leftLimit + EDGE_MARGIN - character.anchorX;
    const max = this.level.width - EDGE_MARGIN - character.anchorX;
    character.x = Math.min(Math.max(character.x, min), max);
  }

  pushCharacter(delta) {
    const boss = this.level.boss;
    if (!boss.isRaging() || this.character.isDead()) return;
    const distance = this.character.centerX() - boss.centerX();
    if (Math.abs(distance) > PUSH_RANGE) return;
    this.character.x += Math.sign(distance) * PUSH_SPEED * delta;
  }

  shake() {
    if (!this.level.boss.isRaging() || this.isOver()) return 0;
    return Math.round((Math.random() * 2 - 1) * SHAKE);
  }

  isOver() {
    return this.character.isGone();
  }

  isWon() {
    const gate = this.level.gate;
    if (!gate.open || this.character.isDead()) return false;
    return this.character.alpha === 0;
  }
}
