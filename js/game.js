import World from "./world.js";
import Keyboard from "./keyboard.js";
import Overlay from "./ui/overlay.js";
import createLevel1 from "./data/level1.js";
import { UI_TEXT } from "./data/story.js";

export default class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = new Keyboard();
    this.gameOver = new Overlay(
      UI_TEXT.gameOver,
      UI_TEXT.heroDown,
      UI_TEXT.tryAgain,
    );
    this.lastTime = 0;
    this.start();
    canvas.addEventListener("click", () => this.confirm());
    requestAnimationFrame((time) => this.loop(time));
  }

  start() {
    this.world = new World(this.canvas, this.keyboard, createLevel1());
  }

  loop(time) {
    const delta = Math.min((time - this.lastTime) / 1000, 0.1);
    this.lastTime = time;
    if (this.keyboard.confirm) this.confirm();
    if (!this.world.isOver()) this.world.update(delta);
    this.world.draw();
    if (this.world.isOver()) this.gameOver.draw(this.ctx);
    requestAnimationFrame((t) => this.loop(t));
  }

  confirm() {
    if (this.world.isOver()) this.start();
  }
}
