import TextBox from "./ui/text-box.js";

const PORTRAIT_PATH = "./assets/images/portraits/";

export default class Quest {
  constructor(data) {
    const portrait = PORTRAIT_PATH + data.portrait + ".png";
    this.offer = new TextBox(data.giver, data.offer, portrait);
    this.reminder = new TextBox(data.giver, data.reminder, portrait);
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
