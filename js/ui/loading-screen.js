import HudImage from "./hud-image.js";
import StatusBar from "./status-bar.js";
import Label, { TITLE_COLOR, SHADOW_COLOR } from "./label.js";
import { loader } from "../loader.js";
import { TITLE, UI_TEXT } from "../data/story.js";

const HUD_PATH = "./assets/images/hud/";

export default class LoadingScreen {
  constructor() {
    this.title = new Label(TITLE, 480, 203, 64, TITLE_COLOR, SHADOW_COLOR);
    this.frame = new HudImage(308, 262, 344, 28, HUD_PATH + "boss-bar.png");
    const fill = HUD_PATH + "loading-fill.png";
    this.bar = new StatusBar(319, 268, 322, 16, fill, UI_TEXT.loading);
  }

  update(delta) {
    this.bar.setValue(loader.loaded, loader.total);
  }

  draw(ctx) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.title.draw(ctx);
    this.frame.draw(ctx);
    this.bar.draw(ctx);
  }
}
