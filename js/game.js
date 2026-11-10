import World from "./world.js";
import Keyboard from "./keyboard.js";
import createLevel1 from "./data/level1.js";

const canvas = document.getElementById("canvas");
const keyboard = new Keyboard();
const world = new World(canvas, keyboard, createLevel1());
