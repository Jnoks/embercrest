import Menu from "./menu.js";
import HudImage from "./hud-image.js";
import Label, { TITLE_COLOR, SHADOW_COLOR } from "./label.js";
import { UI_TEXT } from "../data/story.js";

const BACKGROUND = "./assets/images/ui/start-background.png";
const CENTER_X = 480;
const DIM_COLOR = "rgba(0, 0, 0, 0.35)";

export default class DifficultyMenu extends Menu {
  constructor() {
    super();
    const title = UI_TEXT.chooseDifficulty;
    this.background = new HudImage(0, 0, 960, 540, BACKGROUND);
    this.title = new Label(title, CENTER_X, 222, 32, TITLE_COLOR, SHADOW_COLOR);
    this.choices = ["easy", "hard"];
    this.buttons = this.createButtons(278);
    this.select(0);
  }

  update(delta) {}

  draw(ctx) {
    this.background.draw(ctx);
    ctx.fillStyle = DIM_COLOR;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.title.draw(ctx);
    for (let i = 0; i < this.buttons.length; i++) this.buttons[i].draw(ctx);
  }
}
