import { loader } from "./loader.js";

export default class SpriteAnimation {
  constructor(
    folder,
    name,
    count,
    frameDuration,
    { loopPause = 0, loop = true, padding = 0 } = {},
  ) {
    this.frames = [];
    this.frameDuration = frameDuration;
    this.loopPause = loopPause;
    this.loop = loop;
    this.padding = padding;
    for (let i = 1; i <= count; i++) {
      const path = `${folder}${name}/${name}${i}.png`;
      this.frames.push(loader.createImage(path));
    }
  }

  cycleDuration() {
    return this.frames.length * this.frameDuration;
  }
}
