import TextBox from "./ui/text-box.js";

const PORTRAIT_PATH = "./assets/images/portraits/";

export default class Quest {
  constructor(data) {
    const portrait = PORTRAIT_PATH + data.portrait + ".png";
    this.offer = new TextBox(data.giver, data.offer, portrait);
    this.state = "new";
    this.pendingText = null;
  }

  meet() {
    if (this.state !== "new") return;
    this.state = "running";
    this.pendingText = this.offer;
  }

  takeText() {
    const text = this.pendingText;
    this.pendingText = null;
    return text;
  }
}
