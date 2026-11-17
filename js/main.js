import Game from "./game.js";

await document.fonts.load("bold 16px Silkscreen");
await document.fonts.load("16px Silkscreen");
new Game(document.getElementById("canvas"));
