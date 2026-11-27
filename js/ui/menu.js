import Button from "./button.js";
import Toggle from "./toggle.js";
import { UI_TEXT } from "../data/story.js";
import { sound } from "../sound.js";
import { CAN_FULLSCREEN, isFullscreen } from "../fullscreen.js";

const CENTER_X = 480;
const BUTTON_STEP = 184;
const SOUND_X = 372;
const SCREEN_X = 556;
const SCREEN_WIDTH = 192;

export default class Menu {
  constructor() {
    this.buttons = [];
    this.choices = [];
    this.selected = 0;
    this.toggle = null;
    this.screenToggle = null;
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

  addToggle(y) {
    const text = UI_TEXT.soundToggle;
    let x = CENTER_X;
    if (CAN_FULLSCREEN) x = SOUND_X;
    this.toggle = new Toggle(x, y, text, !sound.muted);
    this.buttons.push(this.toggle);
    this.choices.push("soundToggle");
    if (CAN_FULLSCREEN) this.addScreenToggle(y);
  }

  addScreenToggle(y) {
    const text = UI_TEXT.fullscreen;
    this.screenToggle = new Toggle(SCREEN_X, y, text, false, SCREEN_WIDTH);
    this.buttons.push(this.screenToggle);
    this.choices.push("fullscreen");
  }

  updateToggle(delta) {
    this.toggle.on = !sound.muted;
    this.toggle.update(delta);
    if (this.screenToggle) this.updateScreenToggle(delta);
  }

  updateScreenToggle(delta) {
    this.screenToggle.on = isFullscreen();
    this.screenToggle.update(delta);
  }

  choice() {
    return this.choices[this.selected];
  }
}
