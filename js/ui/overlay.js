import Menu from "./menu.js";
import Label, { TITLE_COLOR, SHADOW_COLOR } from "./label.js";

const CENTER_X = 480;
const DIM_COLOR = "rgba(0, 0, 0, 0.6)";

export default class Overlay extends Menu {
  constructor(title, message, choices) {
    super();
    this.title = new Label(title, CENTER_X, 222, 32, TITLE_COLOR, SHADOW_COLOR);
    this.message = new Label(message, CENTER_X, 262, 16, "white", SHADOW_COLOR);
    this.choices = choices;
    this.buttons = this.createButtons(290);
    this.select(0);
  }

  update(delta) {}

  draw(ctx) {
    ctx.fillStyle = DIM_COLOR;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.title.draw(ctx);
    this.message.draw(ctx);
    for (let i = 0; i < this.buttons.length; i++) this.buttons[i].draw(ctx);
  }
}
