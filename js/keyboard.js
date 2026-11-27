const KEY_MAP = {
  KeyA: "left",
  KeyD: "right",
  Space: "attack",
  KeyW: "jump",
  KeyS: "block",
  KeyE: "talk",
  Enter: "confirm",
  Escape: "cancel",
  KeyQ: "log",
};

const TOUCH_KEYS = ["left", "right", "jump", "attack", "talk", "cancel"];

export default class Keyboard {
  constructor() {
    this.releaseAll();
    window.addEventListener("keydown", (e) => this.handleKey(e, true));
    window.addEventListener("keyup", (e) => this.handleKey(e, false));
    window.addEventListener("blur", () => this.releaseAll());
    for (let i = 0; i < TOUCH_KEYS.length; i++) {
      this.bindTouch(TOUCH_KEYS[i]);
    }
  }

  bindTouch(flag) {
    const button = document.getElementById("touch-" + flag);
    button.addEventListener("touchstart", (e) => this.touch(e, flag, true));
    button.addEventListener("touchend", (e) => this.touch(e, flag, false));
    button.addEventListener("touchcancel", (e) => this.touch(e, flag, false));
  }

  touch(e, flag, pressed) {
    e.preventDefault();
    this[flag] = pressed;
  }

  handleKey(e, pressed) {
    const flag = KEY_MAP[e.code];
    if (!flag) return;
    e.preventDefault();
    if (e.repeat) return;
    this[flag] = pressed;
  }

  take(flag) {
    const pressed = this[flag];
    this[flag] = false;
    return pressed;
  }

  releaseAll() {
    this.left = false;
    this.right = false;
    this.jump = false;
    this.attack = false;
    this.block = false;
    this.talk = false;
    this.confirm = false;
    this.cancel = false;
    this.log = false;
  }
}
