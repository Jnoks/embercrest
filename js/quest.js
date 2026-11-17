import TextBox from "./ui/text-box.js";

const PORTRAIT_PATH = "./assets/images/portraits/";

export default class Quest {
  constructor(data, boss) {
    const portrait = PORTRAIT_PATH + data.portrait + ".png";
    const bossPortrait = PORTRAIT_PATH + boss.portrait + ".png";
    this.offer = new TextBox(data.giver, data.offer, portrait);
    this.reminder = new TextBox(data.giver, data.reminder, portrait);
    this.bossIntro = new TextBox(boss.name, boss.intro, bossPortrait);
    this.bossDefeat = new TextBox(boss.name, boss.defeat, bossPortrait);
    this.amount = data.amount;
    this.shards = 0;
    this.state = "new";
    this.pendingText = null;
  }

  meet() {
    if (this.state === "new") this.pendingText = this.offer;
    else this.pendingText = this.reminder;
    this.pendingText.restart();
    this.state = "running";
  }

  faceBoss() {
    this.showOnce(this.bossIntro);
  }

  beatBoss() {
    this.showOnce(this.bossDefeat);
  }

  showOnce(text) {
    if (text.seen) return;
    text.seen = true;
    this.pendingText = text;
  }

  collect() {
    this.shards += 1;
  }

  restart() {
    this.shards = 0;
  }

  takeText() {
    const text = this.pendingText;
    this.pendingText = null;
    return text;
  }
}
