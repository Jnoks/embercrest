import TextBox from "./text-box.js";
import HudImage from "./hud-image.js";
import { ROADMAP, UI_TEXT } from "../data/story.js";

const ICON = "./assets/images/hud/shard-icon.png";
const ICON_SIZE = 16;
const ICON_X = 316;
const TEXT_X = 344;
const FIRST_Y = 170;
const ROW_STEP = 50;
const READ_TIME = 0.5;
const TEXT_COLOR = "#52402b";

export default class RoadmapScreen extends TextBox {
  constructor() {
    super(UI_TEXT.comingSoon, ROADMAP);
    this.icons = [];
    for (let i = 0; i < ROADMAP.length; i++) this.addIcon(i);
  }

  addIcon(index) {
    const y = FIRST_Y + index * ROW_STEP;
    this.icons.push(new HudImage(ICON_X, y, ICON_SIZE, ICON_SIZE, ICON));
  }

  update(delta) {
    this.time += delta;
  }

  next() {
    if (this.time >= READ_TIME) this.page = this.pages.length;
  }

  drawText(ctx) {
    this.drawParts(ctx, this.icons);
    ctx.font = "16px Silkscreen, monospace";
    ctx.fillStyle = TEXT_COLOR;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    for (let i = 0; i < this.pages.length; i++) {
      const y = FIRST_Y + i * ROW_STEP + ICON_SIZE / 2;
      ctx.fillText(this.pages[i], TEXT_X, y);
    }
  }
}
