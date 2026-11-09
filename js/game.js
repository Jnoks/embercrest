import World from "./world.js";
import Keyboard from "./keyboard.js";

const canvas = document.getElementById("canvas");
const keyboard = new Keyboard();
const world = new World(canvas, keyboard);
