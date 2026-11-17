import HudImage from "./hud-image.js";
import Label, { TITLE_COLOR, SHADOW_COLOR } from "./label.js";
import Button from "./button.js";
import Key from "./key.js";
import Figure from "../entities/figure.js";
import { TITLE, TAGLINE, UI_TEXT } from "../data/story.js";

const BACKGROUND = "./assets/images/ui/start-background.png";
const CENTER_X = 480;
const HERO_Y = 498;
const KEY_Y = 340;
const LABEL_Y = 394;
const DIM_COLOR = "rgba(0, 0, 0, 0.35)";

export default class StartScreen {
  constructor() {
    this.background = new HudImage(0, 0, 960, 540, BACKGROUND);
    this.mage = new Figure("mage", 14, 440, HERO_Y);
    this.knight = new Figure("knight", 12, 500, HERO_Y);
    this.title = new Label(TITLE, CENTER_X, 203, 64, TITLE_COLOR, SHADOW_COLOR);
    this.tagline = new Label(TAGLINE, CENTER_X, 254, 16, "white", SHADOW_COLOR);
    this.button = new Button(CENTER_X, 278, UI_TEXT.newGame);
    this.legend = this.createLegend();
  }

  createLegend() {
    return [
      new Key(278, KEY_Y, "A"),
      new Key(322, KEY_Y, "D"),
      new Label(UI_TEXT.move, 320, LABEL_Y, 16, "white", SHADOW_COLOR),
      new Key(402, KEY_Y, "W"),
      new Label(UI_TEXT.jump, 422, LABEL_Y, 16, "white", SHADOW_COLOR),
      new Key(482, KEY_Y, "Space", 120),
      new Label(UI_TEXT.attack, 542, LABEL_Y, 16, "white", SHADOW_COLOR),
      new Key(642, KEY_Y, "E"),
      new Label(UI_TEXT.talk, 662, LABEL_Y, 16, "white", SHADOW_COLOR),
    ];
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
    for (let i = 0; i < this.legend.length; i++) {
      this.legend[i].draw(ctx);
    }
  }
}
