import Button from "./button.js";
import { UI_TEXT } from "../data/story.js";

const CENTER_X = 480;
const BUTTON_STEP = 184;

export default class Menu {
  constructor() {
    this.buttons = [];
    this.choices = [];
    this.selected = 0;
  }

  select(index) {
    this.selected = index;
    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].selected = i === index;
    }
  }

  move(step) {
    const count = this.buttons.length;
    this.select((this.selected + step + count) % count);
  }

  click(x, y) {
    for (let i = 0; i < this.buttons.length; i++) {
      if (this.buttons[i].contains(x, y)) {
        this.select(i);
        return true;
      }
    }
    return false;
  }

  createButtons(y) {
    const buttons = [];
    const count = this.choices.length;
    const left = CENTER_X - ((count - 1) * BUTTON_STEP) / 2;
    for (let i = 0; i < count; i++) {
      const text = UI_TEXT[this.choices[i]];
      buttons.push(new Button(left + i * BUTTON_STEP, y, text));
    }
    return buttons;
  }

  choice() {
    return this.choices[this.selected];
  }
}
