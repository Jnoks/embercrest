import Label from "./label.js";
import Key from "./key.js";
import { WINDOW } from "./text-box.js";
import { UI_TEXT } from "../data/story.js";

const ROWS = [
  { keys: ["A", "D"], text: UI_TEXT.move },
  { keys: ["W"], text: UI_TEXT.jump },
  { keys: ["W", "W"], text: UI_TEXT.doubleJump },
  { keys: ["Space"], text: UI_TEXT.attack },
  { keys: ["S"], text: UI_TEXT.block },
  { keys: ["E"], text: UI_TEXT.talk },
  { keys: ["Q"], text: UI_TEXT.questLog },
  { keys: ["Esc"], text: UI_TEXT.pause },
  { keys: ["Enter"], text: UI_TEXT.confirm },
];
const KEY_WIDTHS = { Space: 72, Enter: 72, Esc: 48 };
const ROWS_PER_COLUMN = 5;
const FIRST_X = 264;
const FIRST_Y = 162;
const COLUMN_STEP = 250;
const ROW_STEP = 50;
const KEY_SIZE = 24;
const KEY_GAP = 4;
const TEXT_X = 84;
const TEXT_COLOR = "#52402b";
const TITLE_COLOR = "#282c0c";
const LIGHT_COLOR = "#ffc300";
const DIM_COLOR = "rgba(0, 0, 0, 0.6)";

export default class ControlsScreen {
  constructor() {
    const title = UI_TEXT.controls;
    this.parts = [
      new Label(title, 480, 80, 16, TITLE_COLOR, LIGHT_COLOR),
      new Key(432, 494, "Esc", 48, KEY_SIZE),
      new Label(UI_TEXT.closePage, 520, 506, 16, "white", "black"),
    ];
    for (let i = 0; i < ROWS.length; i++) this.addRow(ROWS[i], i);
  }

  addRow(row, index) {
    let x = FIRST_X + Math.floor(index / ROWS_PER_COLUMN) * COLUMN_STEP;
    const y = FIRST_Y + (index % ROWS_PER_COLUMN) * ROW_STEP;
    for (let i = 0; i < row.keys.length; i++) {
      const width = KEY_WIDTHS[row.keys[i]] || KEY_SIZE;
      this.parts.push(new Key(x, y, row.keys[i], width, KEY_SIZE));
      x += width + KEY_GAP;
    }
  }

  update(delta) {}

  draw(ctx) {
    ctx.fillStyle = DIM_COLOR;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (let i = 0; i < WINDOW.length - 1; i++) WINDOW[i].draw(ctx);
    for (let i = 0; i < this.parts.length; i++) this.parts[i].draw(ctx);
    this.drawTexts(ctx);
  }

  drawTexts(ctx) {
    ctx.font = "16px Silkscreen, monospace";
    ctx.fillStyle = TEXT_COLOR;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    for (let i = 0; i < ROWS.length; i++) {
      const column = Math.floor(i / ROWS_PER_COLUMN);
      const x = FIRST_X + column * COLUMN_STEP + TEXT_X;
      const y = FIRST_Y + (i % ROWS_PER_COLUMN) * ROW_STEP + KEY_SIZE / 2;
      ctx.fillText(ROWS[i].text, x, y);
    }
  }
}
