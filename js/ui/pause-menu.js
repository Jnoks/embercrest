import Menu from "./menu.js";
import Label, { TITLE_COLOR, SHADOW_COLOR } from "./label.js";
import { UI_TEXT } from "../data/story.js";

const CENTER_X = 480;
const DIM_COLOR = "rgba(0, 0, 0, 0.6)";

export default class PauseMenu extends Menu {
  constructor() {
    super();
    const title = UI_TEXT.paused;
    this.title = new Label(title, CENTER_X, 222, 32, TITLE_COLOR, SHADOW_COLOR);
    this.choices = ["resume", "controls", "toStart"];
    this.buttons = this.createButtons(290);
    this.addToggle(342);
    this.select(0);
  }

  update(delta) {
    this.updateToggle(delta);
  }

  draw(ctx) {
    ctx.fillStyle = DIM_COLOR;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.title.draw(ctx);
    for (let i = 0; i < this.buttons.length; i++) this.buttons[i].draw(ctx);
  }
}
