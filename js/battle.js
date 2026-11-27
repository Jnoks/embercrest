import { CHATS } from "./data/story.js";
import { sound } from "./sound.js";
import { updateObjects, updateProjectiles } from "./update.js";

const ANSWER_DELAY = 0.9;

export default class Battle {
  constructor(level, character) {
    this.level = level;
    this.character = character;
    this.bolts = [];
    this.spells = [];
  }

  update(delta) {
    this.updateEnemies(delta);
    this.updateBolts(delta);
    this.updateSpells(delta);
  }

  updateEnemies(delta) {
    this.updateTargets();
    updateObjects(this.level.enemies, delta);
    this.checkCollisions();
    this.checkSwordHits();
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

  updateBolts(delta) {
    const bolt = this.character.takeBolt();
    if (bolt) this.bolts.push(bolt);
    this.bolts = updateProjectiles(this.bolts, delta);
    this.checkBoltHits();
  }

  updateSpells(delta) {
    this.collectSpells();
    this.spells = updateProjectiles(this.spells, delta);
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
}
