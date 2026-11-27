import HudImage from "./hud-image.js";
import Label, { TITLE_COLOR, SHADOW_COLOR } from "./label.js";
import Key from "./key.js";
import { UI_TEXT } from "../data/story.js";
import { IS_TOUCH } from "../device.js";

const WINDOW_IMAGE = "./assets/images/ui/dialog-small.png";
const SHARD_IMAGE = "./assets/images/ember-shard/spin/spin1.png";
const TEXT_X = 520;
const TEXT_COLOR = "#52402b";
const DIM_COLOR = "rgba(0, 0, 0, 0.6)";

export default class QuestLog {
  constructor(data) {
    this.data = data;
    this.text = UI_TEXT.noQuest;
    this.parts = [
      new HudImage(206, 194, 548, 152, WINDOW_IMAGE),
      new HudImage(250, 226, 32, 32, SHARD_IMAGE),
      new Label(UI_TEXT.questLabel, 480, 172, 32, TITLE_COLOR, SHADOW_COLOR),
      new Key(417, 362, this.closeKey(), 24, 24),
      new Label(UI_TEXT.closePage, 492, 374, 16, "white", "black"),
    ];
    this.count = new Label("", 266, 282, 16, "white", "black");
    this.count.weight = "normal";
  }

  closeKey() {
    if (IS_TOUCH) return "Esc";
    return "Q";
  }

  refresh(quest) {
    this.count.text = `${quest.shards}/${quest.amount}`;
    this.text = this.data.objective;
    if (quest.state === "new") this.text = UI_TEXT.noQuest;
  }

  update(delta) {}

  draw(ctx) {
    ctx.fillStyle = DIM_COLOR;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (let i = 0; i < this.parts.length; i++) {
      this.parts[i].draw(ctx);
    }
    this.count.draw(ctx);
    this.drawText(ctx);
  }

  drawText(ctx) {
    ctx.fillStyle = TEXT_COLOR;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = "bold 16px Silkscreen, monospace";
    ctx.fillText(this.data.title, TEXT_X, 256);
    ctx.font = "16px Silkscreen, monospace";
    ctx.fillText(this.text, TEXT_X, 284);
  }
}
