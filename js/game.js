import World from "./world.js";
import Keyboard from "./keyboard.js";
import Overlay from "./ui/overlay.js";
import StartScreen from "./ui/start-screen.js";
import TextBox from "./ui/text-box.js";
import createLevel1 from "./data/level1.js";
import { TITLE, INTRO_PAGES, UI_TEXT } from "./data/story.js";

const INTRO_HINT = `Enter ${UI_TEXT.nextPage}   Esc ${UI_TEXT.skipIntro}`;

export default class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = new Keyboard();
    this.lastTime = 0;
    this.started = false;
    this.createOverlays();
    this.start();
    canvas.addEventListener("click", () => this.confirm());
    requestAnimationFrame((time) => this.loop(time));
  }

  createOverlays() {
    this.startScreen = new StartScreen();
    this.intro = new TextBox(TITLE, INTRO_PAGES, INTRO_HINT);
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
    if (this.keyboard.take("confirm")) this.confirm();
    if (this.keyboard.take("cancel")) this.cancel();
    const overlay = this.overlay();
    if (overlay) overlay.update(delta);
    else this.world.update(delta);
    this.world.draw();
    if (overlay) overlay.draw(this.ctx);
    requestAnimationFrame((t) => this.loop(t));
  }

  overlay() {
    if (!this.started) return this.startScreen;
    if (!this.intro.isDone()) return this.intro;
    if (this.world.isOver()) return this.gameOver;
    if (this.world.isWon()) return this.victory;
    return null;
  }

  confirm() {
    const overlay = this.overlay();
    if (overlay === this.startScreen) this.started = true;
    else if (overlay === this.intro) this.intro.next();
    else if (overlay) this.start();
  }

  cancel() {
    if (this.overlay() === this.intro) this.intro.skip();
  }
}
