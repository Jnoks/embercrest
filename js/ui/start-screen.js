import HudImage from "./hud-image.js";
import Label, { TITLE_COLOR, SHADOW_COLOR } from "./label.js";
import Button from "./button.js";
import Figure from "../entities/figure.js";
import { TITLE, TAGLINE, UI_TEXT } from "../data/story.js";

const BACKGROUND = "./assets/images/ui/start-background.png";
const CENTER_X = 480;
const HERO_Y = 498;
const DIM_COLOR = "rgba(0, 0, 0, 0.35)";
const KEYS = `A/D ${UI_TEXT.move}   W ${UI_TEXT.jump}   Space ${UI_TEXT.attack}`;

export default class StartScreen {
  constructor() {
    this.background = new HudImage(0, 0, 960, 540, BACKGROUND);
    this.mage = new Figure("mage", 14, 440, HERO_Y);
    this.knight = new Figure("knight", 12, 500, HERO_Y);
    this.title = new Label(TITLE, CENTER_X, 215, 64, TITLE_COLOR, SHADOW_COLOR);
    this.tagline = new Label(TAGLINE, CENTER_X, 268, 16, "white", SHADOW_COLOR);
    this.button = new Button(CENTER_X, 296, UI_TEXT.newGame);
    this.keys = new Label(KEYS, CENTER_X, 372, 16, "white", SHADOW_COLOR);
  }

  update(delta) {
    this.mage.update(delta);
    this.knight.update(delta);
  }

  draw(ctx) {
    this.background.draw(ctx);
    this.mage.draw(ctx);
    this.knight.draw(ctx);
    ctx.fillStyle = DIM_COLOR;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.title.draw(ctx);
    this.tagline.draw(ctx);
    this.button.draw(ctx);
    this.keys.draw(ctx);
  }
}
