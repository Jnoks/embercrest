import World from "./world.js";
import Keyboard from "./keyboard.js";
import Overlay from "./ui/overlay.js";
import StartScreen from "./ui/start-screen.js";
import TextBox from "./ui/text-box.js";
import Quest from "./quest.js";
import createLevel1 from "./data/level1.js";
import { TITLE, INTRO_PAGES, WORLDS, UI_TEXT } from "./data/story.js";
import { DIFFICULTIES } from "./data/difficulty.js";
import DifficultyMenu from "./ui/difficulty-menu.js";
import PauseMenu from "./ui/pause-menu.js";
import ControlsScreen from "./ui/controls-screen.js";
import { sound } from "./sound.js";
import { voice } from "./voice.js";

const WORLD = WORLDS[0];

export default class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = new Keyboard();
    this.lastTime = 0;
    this.difficulty = "easy";
    this.createOverlays();
    this.createControls();
    this.newGame();
    canvas.addEventListener("click", (e) => this.click(e));
    requestAnimationFrame((time) => this.loop(time));
  }

  createOverlays() {
    const retry = ["tryAgain", "toStart"];
    const again = ["playAgain", "toStart"];
    this.startScreen = new StartScreen();
    this.gameOver = new Overlay(UI_TEXT.gameOver, UI_TEXT.heroDown, retry);
    this.victory = new Overlay(UI_TEXT.endTitle, UI_TEXT.thanks, again);
  }

  createControls() {
    this.difficultyMenu = new DifficultyMenu();
    this.pauseMenu = new PauseMenu();
    this.controls = new ControlsScreen();
    this.menu = this.startScreen;
    this.back = null;
    this.shown = null;
  }

  newGame() {
    this.quest = new Quest(WORLD.quest, WORLD.boss);
    this.texts = this.createTexts();
    this.finale = this.createFinale();
    this.start();
  }

  createTexts() {
    const intro = new TextBox(TITLE, INTRO_PAGES);
    const arrival = new TextBox(WORLD.name, WORLD.arrival);
    return [intro, arrival];
  }

  createFinale() {
    const cleared = new TextBox(UI_TEXT.worldCleared, WORLD.cleared);
    const ending = new TextBox(TITLE, WORLD.ending);
    return [cleared, ending];
  }

  start() {
    const level = createLevel1();
    this.quest.restart();
    this.world = new World(this.canvas, this.keyboard, level, this.quest);
    this.world.applyDifficulty(DIFFICULTIES[this.difficulty]);
    sound.playMusic("forest");
  }

  chooseStart() {
    const choice = this.startScreen.choice();
    sound.resume();
    if (choice === "controls") this.openControls();
    else if (choice === "soundToggle") this.toggleSound();
    else this.menu = this.difficultyMenu;
  }

  chooseDifficulty() {
    this.difficulty = this.difficultyMenu.choice();
    this.menu = null;
    this.start();
  }

  click(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * this.canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * this.canvas.height;
    const overlay = this.overlay();
    if (this.isMenu(overlay) && !overlay.click(x, y)) return;
    this.confirm();
  }

  loop(time) {
    const delta = Math.min((time - this.lastTime) / 1000, 0.1);
    this.lastTime = time;
    this.handleKeys();
    this.collectText();
    this.checkEnding();
    const overlay = this.overlay();
    if (overlay) overlay.update(delta);
    else this.world.update(delta);
    this.draw(overlay);
    requestAnimationFrame((t) => this.loop(t));
  }

  collectText() {
    const text = this.quest.takeText();
    if (text) this.texts.push(text);
  }

  draw(overlay) {
    this.world.draw();
    if (overlay) overlay.draw(this.ctx);
  }

  checkEnding() {
    if (!this.world.isWon() || this.finale.length === 0) return;
    sound.play("win");
    while (this.finale.length > 0) this.texts.push(this.finale.shift());
  }

  handleKeys() {
    if (this.keyboard.take("confirm")) this.confirm();
    if (this.keyboard.take("cancel")) this.cancel();
    if (this.isReading() && this.keyboard.take("attack")) this.turnPage();
    this.moveSelection();
  }

  moveSelection() {
    const overlay = this.overlay();
    const opened = overlay !== this.shown && this.isMenu(overlay);
    this.shown = overlay;
    if (opened) this.keyboard.releaseAll();
    if (!this.isMenu(overlay)) return;
    if (this.keyboard.take("left")) overlay.move(-1);
    if (this.keyboard.take("right")) overlay.move(1);
  }

  isMenu(overlay) {
    const menus = [
      this.startScreen,
      this.difficultyMenu,
      this.pauseMenu,
      this.gameOver,
      this.victory,
    ];
    return menus.includes(overlay);
  }

  isReading() {
    return this.overlay() === this.texts[0];
  }

  overlay() {
    if (this.menu) return this.menu;
    if (this.texts.length > 0) return this.texts[0];
    if (this.world.isOver()) return this.gameOver;
    if (this.world.isWon()) return this.victory;
    return null;
  }

  confirm() {
    const overlay = this.overlay();
    if (overlay === this.texts[0]) this.turnPage();
    else if (overlay) this.choose(overlay);
  }

  choose(overlay) {
    sound.play("click");
    if (overlay === this.startScreen) this.chooseStart();
    else if (overlay === this.difficultyMenu) this.chooseDifficulty();
    else if (overlay === this.pauseMenu) this.choosePause();
    else if (overlay === this.controls) this.menu = this.back;
    else this.chooseEnd(overlay);
  }

  chooseEnd(overlay) {
    const choice = overlay.choice();
    overlay.select(0);
    if (choice === "toStart") this.toStart();
    else if (choice === "playAgain") this.newGame();
    else this.start();
  }

  choosePause() {
    const choice = this.pauseMenu.choice();
    if (choice === "resume") this.menu = null;
    else if (choice === "controls") this.openControls();
    else if (choice === "soundToggle") this.toggleSound();
    else this.toStart();
  }

  openControls() {
    this.back = this.menu;
    this.menu = this.controls;
  }

  turnPage() {
    sound.play("page");
    this.texts[0].next();
    if (this.texts[0].isDone()) this.closeText();
  }

  closeText() {
    this.texts.shift();
    voice.stop();
  }

  cancel() {
    const overlay = this.overlay();
    if (overlay === this.texts[0]) this.closeText();
    else if (overlay === this.controls) this.menu = this.back;
    else if (overlay === this.difficultyMenu) this.menu = this.startScreen;
    else if (overlay === this.pauseMenu) this.menu = null;
    else if (overlay === null) this.openPause();
  }

  openPause() {
    this.pauseMenu.select(0);
    this.menu = this.pauseMenu;
  }

  toStart() {
    voice.stop();
    this.menu = this.startScreen;
    this.newGame();
  }

  toggleSound() {
    sound.toggle();
    if (sound.muted) voice.stop();
  }
}
