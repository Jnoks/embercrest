import Autopilot from "./autopilot.js";
import TextBox from "./ui/text-box.js";

const STEPS = [
  "gather",
  "trade",
  "reachLock",
  "pickLock",
  "reachLock",
  "pickLock",
  "unlock",
  "open",
  "narrate",
  "stepAside",
  "farewell",
];
const ENTRY_DISTANCE = 1000;
const HERO_DISTANCE = 70;
const LOCK_DISTANCE = 30;
const SIDE_DISTANCE = 50;
const TOLERANCE = 8;

export default class GateScene {
  constructor(gate, latch, texts) {
    this.gate = gate;
    this.latch = latch;
    this.locked = new TextBox(texts.name, texts.locked);
    this.opened = new TextBox(texts.name, texts.opened);
    this.autopilot = new Autopilot();
    this.character = null;
    this.quest = null;
    this.keyboard = null;
    this.index = STEPS.length;
  }

  isRunning() {
    return this.index < STEPS.length;
  }

  start(character, quest) {
    this.character = character;
    this.quest = quest;
    this.keyboard = character.keyboard;
    character.keyboard = this.autopilot;
    this.latch.x = this.gate.centerX() - ENTRY_DISTANCE;
    this.index = 0;
  }

  update() {
    if (!this.isRunning()) return;
    const step = STEPS[this.index];
    if (this[step]()) this.index += 1;
    if (!this.isRunning()) this.character.keyboard = this.keyboard;
  }

  gather() {
    const target = this.gate.centerX() - HERO_DISTANCE;
    const distance = target - this.character.centerX();
    this.autopilot.right = distance > TOLERANCE;
    this.autopilot.left = distance < -TOLERANCE;
    this.latch.runTo(this.gate.centerX() - LOCK_DISTANCE);
    return Math.abs(distance) <= TOLERANCE && !this.latch.isMoving();
  }

  trade() {
    this.character.facingLeft = false;
    this.latch.facingLeft = true;
    this.quest.deliver();
    return true;
  }

  reachLock() {
    this.latch.facingLeft = false;
    this.latch.work();
    return true;
  }

  pickLock() {
    return !this.latch.isAttacking();
  }

  unlock() {
    this.gate.unlock();
    return true;
  }

  open() {
    return this.gate.open;
  }

  narrate() {
    this.quest.showOnce(this.opened);
    return true;
  }

  stepAside() {
    this.latch.runTo(this.gate.centerX() + SIDE_DISTANCE);
    return !this.latch.isMoving();
  }

  farewell() {
    this.latch.facingLeft = true;
    this.quest.showOnce(this.quest.farewell);
    return true;
  }
}
