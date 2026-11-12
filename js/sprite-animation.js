export default class SpriteAnimation {
  constructor(folder, name, count, frameDuration, { loopPause = 0 } = {}) {
    this.frames = [];
    this.frameDuration = frameDuration;
    this.loopPause = loopPause;
    for (let i = 1; i <= count; i++) {
      const img = new Image();
      img.src = `${folder}${name}/${name}${i}.png`;
      this.frames.push(img);
    }
  }

  cycleDuration() {
    return this.frames.length * this.frameDuration;
  }
}
