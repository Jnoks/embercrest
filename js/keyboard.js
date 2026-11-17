const KEY_MAP = {
  KeyA: "left",
  KeyD: "right",
  Space: "attack",
  KeyW: "jump",
  Enter: "confirm",
  Escape: "cancel",
};

export default class Keyboard {
  constructor() {
    this.releaseAll();
    window.addEventListener("keydown", (e) => this.handleKey(e, true));
    window.addEventListener("keyup", (e) => this.handleKey(e, false));
    window.addEventListener("blur", () => this.releaseAll());
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
    this.confirm = false;
    this.cancel = false;
  }
}
