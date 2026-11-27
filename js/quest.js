import DialogBox from "./ui/dialog-box.js";

const PORTRAIT_PATH = "./assets/images/portraits/";

export default class Quest {
  constructor(data, boss) {
    const portrait = PORTRAIT_PATH + data.portrait + ".png";
    const bossPortrait = PORTRAIT_PATH + boss.portrait + ".png";
    this.offer = new DialogBox(data.giver, data.offer, portrait);
    this.reminder = new DialogBox(data.giver, data.reminder, portrait);
    this.complete = new DialogBox(data.giver, data.complete, portrait);
    this.farewell = new DialogBox(data.giver, data.farewell, portrait);
    this.bossIntro = new DialogBox(boss.name, boss.intro, bossPortrait);
    this.bossDefeat = new DialogBox(boss.name, boss.defeat, bossPortrait);
    this.amount = data.amount;
    this.shards = 0;
    this.found = [];
    this.spawn = null;
    this.changed = false;
    this.state = "new";
    this.pendingText = null;
  }

  meet() {
    if (this.state === "new") this.pendingText = this.offer;
    else this.pendingText = this.reminder;
    this.pendingText.restart();
    this.state = "running";
    this.changed = true;
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

  collect(x) {
    this.shards += 1;
    this.found.push(x);
    this.changed = true;
  }

  reach(spawn) {
    this.spawn = spawn;
    this.changed = true;
  }

  progress() {
    return { found: this.found, spawn: this.spawn, state: this.state };
  }

  resume(progress) {
    this.found = progress.found;
    this.spawn = progress.spawn;
    this.state = progress.state;
  }

  isComplete() {
    return this.shards === this.amount;
  }

  deliver() {
    this.shards = 0;
    this.state = "done";
    this.showOnce(this.complete);
  }

  restart() {
    this.shards = 0;
    if (this.state === "done") this.state = "running";
  }

  takeText() {
    const text = this.pendingText;
    this.pendingText = null;
    return text;
  }
}
