export default class Autopilot {
  constructor() {
    this.left = false;
    this.right = false;
    this.jump = false;
    this.attack = false;
  }

  take() {
    return false;
  }
}
