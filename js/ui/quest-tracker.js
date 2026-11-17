import HudImage from "./hud-image.js";
import Label from "./label.js";

const PANEL = "./assets/images/hud/counter-panel.png";
const ICON = "./assets/images/hud/shard-icon.png";

export default class QuestTracker {
  constructor() {
    this.panel = new HudImage(880, 8, 72, 24, PANEL);
    this.icon = new HudImage(887, 11, 16, 16, ICON);
    this.count = new Label("", 925, 20, 16, "white", "black");
    this.count.weight = "normal";
    this.visible = false;
  }

  update(quest) {
    this.visible = quest.state === "running" || quest.shards > 0;
    this.count.text = `${quest.shards}/${quest.amount}`;
  }

  draw(ctx) {
    if (!this.visible) return;
    this.panel.draw(ctx);
    this.icon.draw(ctx);
    this.count.draw(ctx);
  }
}
