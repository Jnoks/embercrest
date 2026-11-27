export default class Loader {
  constructor() {
    this.total = 0;
    this.loaded = 0;
  }

  createImage(path) {
    const img = new Image();
    this.total += 1;
    img.addEventListener("load", () => this.count());
    img.addEventListener("error", () => this.count());
    img.src = path;
    return img;
  }

  count() {
    this.loaded += 1;
  }

  isDone() {
    return this.loaded === this.total;
  }
}

export const loader = new Loader();
