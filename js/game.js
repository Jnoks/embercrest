import World from "./world.js";
import Keyboard from "./keyboard.js";
import Overlay from "./ui/overlay.js";
import StartScreen from "./ui/start-screen.js";
import TextBox from "./ui/text-box.js";
import Quest from "./quest.js";
import createLevel1 from "./data/level1.js";
import { TITLE, INTRO_PAGES, WORLDS, UI_TEXT } from "./data/story.js";

const WORLD = WORLDS[0];

export default class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = new Keyboard();
    this.lastTime = 0;
    this.started = false;
    this.quest = new Quest(WORLD.quest, WORLD.boss);
    this.texts = this.createTexts();
    this.createOverlays();
    this.start();
    canvas.addEventListener("click", () => this.confirm());
    requestAnimationFrame((time) => this.loop(time));
  }

  createOverlays() {
    this.startScreen = new StartScreen();
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

  createTexts() {
    const intro = new TextBox(TITLE, INTRO_PAGES);
    const arrival = new TextBox(WORLD.name, WORLD.arrival);
    return [intro, arrival];
  }

  start() {
    this.quest.restart();
    const level = createLevel1();
    this.world = new World(this.canvas, this.keyboard, level, this.quest);
  }

  loop(time) {
    const delta = Math.min((time - this.lastTime) / 1000, 0.1);
    this.lastTime = time;
    if (this.keyboard.take("confirm")) this.confirm();
    if (this.keyboard.take("cancel")) this.cancel();
    const text = this.quest.takeText();
    if (text) this.texts.push(text);
    const overlay = this.overlay();
    if (overlay) overlay.update(delta);
    else this.world.update(delta);
    this.world.draw();
    if (overlay) overlay.draw(this.ctx);
    requestAnimationFrame((t) => this.loop(t));
  }

  overlay() {
    if (!this.started) return this.startScreen;
    if (this.texts.length > 0) return this.texts[0];
    if (this.world.isOver()) return this.gameOver;
    if (this.world.isWon()) return this.victory;
    return null;
  }

  confirm() {
    const overlay = this.overlay();
    if (overlay === this.startScreen) this.started = true;
    else if (overlay === this.texts[0]) this.turnPage();
    else if (overlay) this.start();
  }

  turnPage() {
    this.texts[0].next();
    if (this.texts[0].isDone()) this.texts.shift();
  }

  cancel() {
    if (this.overlay() === this.texts[0]) this.texts.shift();
  }
}
