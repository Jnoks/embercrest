import Goblin from "./goblin.js";
import { SHOUTS } from "../data/story.js";

const CHIEF_PATH = "./assets/images/goblin-chief/";

export default class GoblinChief extends Goblin {
  constructor(centerX, y) {
    super(centerX, y, CHIEF_PATH);
    this.maxHealth = 70;
    this.health = this.maxHealth;
    this.damage = 20;
    this.speed = 100;
    this.greetings = SHOUTS.chief;
  }
}
