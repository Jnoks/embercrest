import HudImage from "./hud-image.js";
import Label from "./label.js";
import Key from "./key.js";

const PANEL = "./assets/images/hud/counter-panel.png";
const ICON = "./assets/images/hud/shard-icon.png";

export default class QuestTracker {
  constructor() {
    this.panel = new HudImage(880, 8, 72, 24, PANEL);
    this.icon = new HudImage(887, 11, 16, 16, ICON);
    this.count = new Label("", 925, 20, 16, "white", "black");
    this.count.weight = "normal";
    this.key = new Key(852, 8, "Q", 24, 24);
    this.visible = false;
  }

  update(quest) {
    this.visible = quest.state === "running" || quest.shards > 0;
    this.count.text = `${quest.shards}/${quest.amount}`;
  }

  contains(x, y) {
    return this.panel.contains(x, y);
  }

  draw(ctx) {
    if (!this.visible) return;
    this.key.draw(ctx);
    this.panel.draw(ctx);
    this.icon.draw(ctx);
    this.count.draw(ctx);
  }
}
