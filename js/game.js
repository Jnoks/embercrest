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
    this.lastTime = 0;
    this.createOverlays();
    this.start();
    canvas.addEventListener("click", () => this.confirm());
    requestAnimationFrame((time) => this.loop(time));
  }

  createOverlays() {
    this.gameOver = new Overlay(
      UI_TEXT.gameOver,
      UI_TEXT.heroDown,
      UI_TEXT.tryAgain,
    );
    this.victory = new Overlay(
      UI_TEXT.worldCleared,
      UI_TEXT.thanks,
      UI_TEXT.playAgain,
    );
  }

  start() {
    this.world = new World(this.canvas, this.keyboard, createLevel1());
  }

  loop(time) {
    const delta = Math.min((time - this.lastTime) / 1000, 0.1);
    this.lastTime = time;
    if (this.keyboard.confirm) this.confirm();
    const overlay = this.overlay();
    if (!overlay) this.world.update(delta);
    this.world.draw();
    if (overlay) overlay.draw(this.ctx);
    requestAnimationFrame((t) => this.loop(t));
  }

  overlay() {
    if (this.world.isOver()) return this.gameOver;
    if (this.world.isWon()) return this.victory;
    return null;
  }

  confirm() {
    if (this.overlay()) this.start();
  }
}
