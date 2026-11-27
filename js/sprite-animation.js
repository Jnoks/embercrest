import { loader } from "./loader.js";

export default class SpriteAnimation {
  constructor(
    folder,
    name,
    count,
    frameDuration,
    { loopPause = 0, loop = true, padding = 0 } = {},
  ) {
    this.frames = this.loadFrames(folder, name, count);
    this.frameDuration = frameDuration;
    this.loopPause = loopPause;
    this.loop = loop;
    this.padding = padding;
  }

  loadFrames(folder, name, count) {
    const frames = [];
    for (let i = 1; i <= count; i++) {
      const path = `${folder}${name}/${name}${i}.png`;
      frames.push(loader.createImage(path));
    }
    return frames;
  }

  cycleDuration() {
    return this.frames.length * this.frameDuration;
  }
}
