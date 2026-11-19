import DrawableObject from "./drawable-object.js";

const PLANT_PATH = "./assets/images/forest/plants/";

export default class Plant extends DrawableObject {
  constructor(centerX, y, kind, number) {
    super(centerX - kind.width / 2, y, kind.width, kind.height);
    this.loadImage(PLANT_PATH + kind.name + number + ".png");
  }
}
