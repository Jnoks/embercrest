import Menu from "./menu.js";
import HudImage from "./hud-image.js";
import Label, { TITLE_COLOR, SHADOW_COLOR } from "./label.js";
import Figure from "../entities/figure.js";
import { TITLE, TAGLINE } from "../data/story.js";

const BACKGROUND = "./assets/images/ui/start-background.png";
const CENTER_X = 480;
const HERO_Y = 498;
const BUTTON_Y = 278;
const TOGGLE_Y = 330;
const DIM_COLOR = "rgba(0, 0, 0, 0.35)";

export default class StartScreen extends Menu {
  constructor(hasSave) {
    super();
    this.background = new HudImage(0, 0, 960, 540, BACKGROUND);
    this.mage = new Figure("mage", 14, 440, HERO_Y);
    this.knight = new Figure("knight", 12, 500, HERO_Y);
    this.title = new Label(TITLE, CENTER_X, 203, 64, TITLE_COLOR, SHADOW_COLOR);
    this.tagline = new Label(TAGLINE, CENTER_X, 254, 16, "white", SHADOW_COLOR);
    this.choices = ["newGame", "controls"];
    if (hasSave) this.choices = ["resume", "newGame", "controls"];
    this.buttons = this.createButtons(BUTTON_Y);
    this.addToggle(TOGGLE_Y);
    this.select(0);
  }

  update(delta) {
    this.mage.update(delta);
    this.knight.update(delta);
    this.updateToggle(delta);
  }

  draw(ctx) {
    this.background.draw(ctx);
    this.mage.draw(ctx);
    this.knight.draw(ctx);
    ctx.fillStyle = DIM_COLOR;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.title.draw(ctx);
    this.tagline.draw(ctx);
    for (let i = 0; i < this.buttons.length; i++) this.buttons[i].draw(ctx);
  }
}
