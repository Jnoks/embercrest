import Mage from "./entities/mage.js";
import Knight from "./entities/knight.js";
import Heart from "./entities/heart.js";
import Hud from "./ui/hud.js";
import { CHATS } from "./data/story.js";
import { sound } from "./sound.js";

const SHAKE = 4;
const PUSH_RANGE = 320;
const PUSH_SPEED = 260;
const ROOM_OPEN_SPEED = 300;
const EDGE_MARGIN = 26;
const ANSWER_DELAY = 0.9;
const HEART_DROP = 40;
const HEART_GAP = 20;
const CAMERA_OFFSET = 100;
const HEROES = { mage: Mage, knight: Knight };

export default class World {
  constructor(canvas, keyboard, level, quest) {
    this.ctx = canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    this.canvas = canvas;
    this.cameraX = 0;
    this.leftLimit = 0;
    this.level = level;
    this.quest = quest;
    const Hero = HEROES[this.quest.hero];
    this.character = new Hero(100, this.level.groundY, keyboard);
    this.hud = new Hud(this.quest.hero);
    this.bolts = [];
    this.spells = [];
    this.effects = [];
    this.bossPhase = this.level.boss.phase;
    this.restore();
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
    this.drawObjects(this.bolts);
    this.drawObjects(this.spells);
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
    this.updateEnemies(delta);
    this.updateMagic(delta);
    this.updateQuest(delta);
    this.collectHearts(delta);
    this.updateTraps(delta);
    this.hud.update(this.character, this.level.boss, this.quest);
    this.updateCamera();
  }

  updateEnemies(delta) {
    this.updateTargets();
    this.updateObjects(this.level.enemies, delta);
    this.checkCollisions();
    this.checkSwordHits();
  }

  checkSwordHits() {
    if (!this.character.takeSwing()) return;
    const box = this.character.attackBox();
    for (let i = 0; i < this.level.enemies.length; i++) {
      const enemy = this.level.enemies[i];
      if (!enemy.isDead() && enemy.overlaps(box)) {
        this.hurtEnemy(enemy, this.character.damage);
      }
    }
  }

  hurtEnemy(enemy, damage) {
    enemy.takeDamage(damage);
    if (enemy.isDead()) sound.play("defeat");
    else sound.play("hit");
  }

  updateMagic(delta) {
    this.updateBolts(delta);
    this.updateSpells(delta);
    this.updateEffects(delta);
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
    this.updateObjects(this.level.backgroundLayers, delta);
    this.level.rain.update(delta);
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
    this.collectSpells();
    this.spells = this.updateProjectiles(this.spells, delta);
    for (let i = 0; i < this.spells.length; i++) {
      this.hitCharacter(this.spells[i]);
      this.hitRock(this.spells[i]);
    }
  }

  collectSpells() {
    for (let i = 0; i < this.level.enemies.length; i++) {
      const spell = this.level.enemies[i].takeSpell();
      if (spell) this.spells.push(spell);
    }
  }

  checkBoltHits() {
    for (let i = 0; i < this.bolts.length; i++) {
      this.hitRock(this.bolts[i]);
      for (let j = 0; j < this.level.enemies.length; j++) {
        this.hitEnemy(this.bolts[i], this.level.enemies[j]);
      }
    }
  }

  hitRock(projectile) {
    if (!projectile.isHitting()) return;
    if (this.level.map.hitsRock(projectile.hitbox())) projectile.explode();
  }

  hitEnemy(bolt, enemy) {
    if (!bolt.isHitting() || enemy.isDead()) return;
    if (!bolt.isColliding(enemy)) return;
    this.hurtEnemy(enemy, bolt.damage);
    bolt.explode();
  }

  hitCharacter(spell) {
    if (!spell.isHitting()) return;
    if (!spell.isColliding(this.character)) return;
    if (!this.blockHit(spell.centerX())) this.hurtBySpell(spell);
    spell.explode();
  }

  hurtBySpell(spell) {
    this.character.takeDamage(spell.damage);
    if (spell.slowTime > 0) this.character.slow(spell.slowTime);
  }

  blockHit(x) {
    const character = this.character;
    if (character.isInvincible() || !character.blocks(x)) return false;
    character.block();
    sound.play("block");
    return true;
  }

  updateEffects(delta) {
    const effect = this.level.boss.takeEffect();
    if (effect) this.effects.push(effect);
    const star = this.level.gate.takeEffect();
    if (star) this.effects.push(star);
    this.effects = this.updateProjectiles(this.effects, delta);
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
    this.level.shards = this.updateProjectiles(this.level.shards, delta);
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
    this.level.hearts = this.updateProjectiles(this.level.hearts, delta);
  }

  updateTraps(delta) {
    for (let i = 0; i < this.level.traps.length; i++) {
      const trap = this.level.traps[i];
      trap.targetX = this.character.centerX();
      trap.targetY = this.character.y;
      if (this.character.isColliding(trap)) this.touchTrap(trap);
    }
    this.level.traps = this.updateProjectiles(this.level.traps, delta);
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

  updateObjects(objects, delta) {
    for (let i = 0; i < objects.length; i++) {
      objects[i].update(delta);
    }
  }

  updateTargets() {
    for (let i = 0; i < this.level.enemies.length; i++) {
      const enemy = this.level.enemies[i];
      enemy.targetX = this.character.centerX();
      enemy.targetY = this.character.centerY();
      enemy.targetHidden = this.isHidden(enemy);
      if (enemy.notices()) this.startChat(enemy);
    }
  }

  isHidden(enemy) {
    const character = this.character;
    const eye = { x: enemy.centerX(), y: enemy.centerY() };
    const target = { x: character.centerX(), y: character.centerY() };
    return this.level.map.blocksView(eye, target);
  }

  startChat(enemy) {
    const partner = this.findPartner(enemy);
    if (enemy.cry) sound.play(enemy.cry);
    if (partner === null) {
      enemy.greet();
      return;
    }
    const chat = CHATS[Math.floor(Math.random() * CHATS.length)];
    enemy.bubble.say(chat.first);
    partner.bubble.say(chat.second, ANSWER_DELAY);
    partner.greeted = true;
  }

  findPartner(enemy) {
    for (let i = 0; i < this.level.enemies.length; i++) {
      const other = this.level.enemies[i];
      if (other !== enemy && other.canAnswer(enemy)) return other;
    }
    return null;
  }

  checkCollisions() {
    if (this.character.isDead() || this.level.scene.isRunning()) return;
    for (let i = 0; i < this.level.enemies.length; i++) {
      const enemy = this.level.enemies[i];
      if (this.character.overlaps(enemy.attackBox())) {
        enemy.attack();
        if (enemy.isHitting()) this.strikeCharacter(enemy);
      }
    }
  }

  strikeCharacter(enemy) {
    if (this.blockHit(enemy.centerX())) enemy.recoil();
    else this.character.takeDamage(enemy.damage);
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
