import Trap from "./trap.js";
import SpriteAnimation from "../sprite-animation.js";
import { sound } from "../sound.js";

const PLANT_PATH = "./assets/images/trap-plant/";
const PLANT_SIZE = 128;
const FIRST_BITE_FRAME = 1;
const LAST_BITE_FRAME = 4;
const SNAP = new SpriteAnimation(PLANT_PATH, "snap", 6, 0.09);

export default class TrapPlant extends Trap {
  constructor(centerX, y) {
    super(centerX - PLANT_SIZE / 2, y, PLANT_SIZE, PLANT_SIZE);
    this.anchorY = 97;
    this.hitboxWidth = 80;
    this.hitboxHeight = 50;
    this.damage = 15;
    this.snapping = false;
    this.setAnimation(SNAP);
  }

  touch() {
    if (this.snapping) return;
    this.snapping = true;
    this.frameIndex = FIRST_BITE_FRAME;
    this.frameTimer = 0;
    this.img = SNAP.frames[FIRST_BITE_FRAME];
    sound.play("snap");
  }

  update(delta) {
    if (!this.snapping) return;
    this.animate(delta);
    if (this.frameIndex === 0) this.snapping = false;
  }

  isHitting() {
    return this.snapping && this.frameIndex <= LAST_BITE_FRAME;
  }
}
