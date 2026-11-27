import HudImage from "./hud-image.js";
import Label, { TITLE_COLOR, SHADOW_COLOR } from "./label.js";
import Button from "./button.js";
import Key from "./key.js";
import DialogBox from "./dialog-box.js";
import Figure from "../entities/figure.js";
import { HEROES, UI_TEXT } from "../data/story.js";

const BACKGROUND = "./assets/images/ui/start-background.png";
const PORTRAIT_PATH = "./assets/images/hud/portrait-";
const CENTER_X = 480;
const HERO_Y = 498;
const DIM_COLOR = "rgba(0, 0, 0, 0.35)";
const FADED = 0.4;

export default class HeroScreen {
  constructor() {
    this.background = new HudImage(0, 0, 960, 540, BACKGROUND);
    this.figures = [
      new Figure("mage", 14, 440, HERO_Y),
      new Figure("knight", 12, 500, HERO_Y),
    ];
    this.cards = [this.createCard(HEROES[0]), this.createCard(HEROES[1])];
    this.button = new Button(CENTER_X, 262, UI_TEXT.confirmHero);
    this.parts = this.createParts();
    this.selected = 0;
  }

  createCard(hero) {
    const portrait = PORTRAIT_PATH + hero.id + ".png";
    const card = new DialogBox(hero.name, [hero.description], portrait);
    card.hints = [];
    return card;
  }

  createParts() {
    const title = UI_TEXT.chooseHero;
    const hint = UI_TEXT.chooseHeroHint;
    return [
      new Label(title, CENTER_X, 36, 32, TITLE_COLOR, SHADOW_COLOR),
      new Label(hint, CENTER_X, 236, 16, "white", SHADOW_COLOR),
      new Key(368, 440, "A"),
      new Key(552, 440, "D"),
      this.button,
    ];
  }

  hero() {
    return HEROES[this.selected].id;
  }

  select(index) {
    if (index === this.selected) return;
    this.selected = index;
    this.cards[index].restart();
  }

  move(step) {
    const count = this.cards.length;
    this.select((this.selected + step + count) % count);
  }

  click(x, y) {
    if (this.button.contains(x, y)) return true;
    if (x < CENTER_X) this.select(0);
    else this.select(1);
    return false;
  }

  update(delta) {
    this.cards[this.selected].update(delta);
    for (let i = 0; i < this.figures.length; i++) {
      this.figures[i].update(delta);
    }
  }

  draw(ctx) {
    this.background.draw(ctx);
    for (let i = 0; i < this.figures.length; i++) this.drawFigure(ctx, i);
    ctx.fillStyle = DIM_COLOR;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.cards[this.selected].draw(ctx);
    for (let i = 0; i < this.parts.length; i++) this.parts[i].draw(ctx);
  }

  drawFigure(ctx, index) {
    ctx.save();
    if (index !== this.selected) ctx.globalAlpha = FADED;
    this.figures[index].draw(ctx);
    ctx.restore();
  }
}
