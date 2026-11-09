const KEY_MAP = {
  KeyA: "left",
  KeyD: "right",
  Space: "jump",
  KeyW: "jump",
  KeyF: "attack",
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
    this[flag] = pressed;
  }
  releaseAll() {
    this.left = false;
    this.right = false;
    this.jump = false;
    this.attack = false;
  }
}
