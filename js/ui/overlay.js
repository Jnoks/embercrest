import Label from "./label.js";
import Button from "./button.js";

const CENTER_X = 480;
const DIM_COLOR = "rgba(0, 0, 0, 0.6)";
const TITLE_COLOR = "#ffa600";
const SHADOW_COLOR = "#191a0c";

export default class Overlay {
  constructor(title, message, buttonText) {
    this.title = new Label(title, CENTER_X, 222, 32, TITLE_COLOR, SHADOW_COLOR);
    this.message = new Label(message, CENTER_X, 262, 16, "white", SHADOW_COLOR);
    this.button = new Button(CENTER_X, 290, buttonText);
  }

  draw(ctx) {
    ctx.fillStyle = DIM_COLOR;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.title.draw(ctx);
    this.message.draw(ctx);
    this.button.draw(ctx);
  }
}
