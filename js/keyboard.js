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

const TOUCH_KEYS = ["jump", "attack", "block", "talk", "cancel"];
const PAD_EVENTS = ["touchstart", "touchmove", "touchend", "touchcancel"];

export default class Keyboard {
  constructor() {
    this.releaseAll();
    this.steering = null;
    window.addEventListener("keydown", (e) => this.handleKey(e, true));
    window.addEventListener("keyup", (e) => this.handleKey(e, false));
    window.addEventListener("blur", () => this.releaseAll());
    for (let i = 0; i < TOUCH_KEYS.length; i++) {
      this.bindTouch(TOUCH_KEYS[i]);
    }
    this.bindPad();
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

  bindPad() {
    const pad = document.getElementById("touch-pad");
    for (let i = 0; i < PAD_EVENTS.length; i++) {
      pad.addEventListener(PAD_EVENTS[i], (e) => this.steer(e, pad));
    }
  }

  steer(e, pad) {
    e.preventDefault();
    const direction = this.findDirection(e.touches, pad);
    if (direction === this.steering) return;
    this.steering = direction;
    this.left = direction === "left";
    this.right = direction === "right";
  }

  findDirection(touches, pad) {
    const box = pad.getBoundingClientRect();
    const center = box.left + box.width / 2;
    let direction = null;
    for (let i = 0; i < touches.length; i++) {
      const onPad = pad.contains(touches[i].target);
      if (onPad) direction = this.sideOf(touches[i].clientX, center);
    }
    return direction;
  }

  sideOf(x, center) {
    if (x < center) return "left";
    return "right";
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
