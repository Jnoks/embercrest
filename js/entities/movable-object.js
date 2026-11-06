import DrawableObject from "./drawable-object.js";

export default class MovableObject extends DrawableObject {
  moveRight() {
    console.log("Moving right");
  }
}
