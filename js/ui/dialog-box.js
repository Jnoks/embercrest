import TextBox from "./text-box.js";
import HudImage from "./hud-image.js";
import Label from "./label.js";

const WINDOW_IMAGE = "./assets/images/ui/dialog-small.png";
const WINDOW = [new HudImage(206, 61, 548, 152, WINDOW_IMAGE)];
const LAYOUT = {
  centerX: 520,
  centerY: 137,
  width: 380,
  lineHeight: 22,
  font: "16px Silkscreen, monospace",
};
const NO_DIM = "rgba(0, 0, 0, 0)";

export default class DialogBox extends TextBox {
  constructor(title, pages, portrait) {
    super(title, pages, portrait);
    this.title = new Label(title, 266, 177, 16, "white", "black");
    this.portrait = this.createPortrait(portrait, 230, 91);
    this.window = WINDOW;
    this.layout = LAYOUT;
    this.dimColor = NO_DIM;
  }
}
