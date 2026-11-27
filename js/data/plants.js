import Plant from "../entities/plant.js";
import { GROUND, IVY } from "../tile-map.js";

export const TREES = [
  { char: "T", name: "tree-big", count: 1, width: 170, height: 159, y: -83 },
  { char: "t", name: "tree-small", count: 2, width: 112, height: 124, y: -49 },
];
export const BUSHES = [
  { char: "b", name: "bush-big", count: 1, width: 66, height: 58, y: 16 },
  { char: "u", name: "bush-small", count: 2, width: 46, height: 45, y: 29 },
];
export const VINES = [
  { char: "l", name: "vine", count: 3, width: 36, height: 125, y: -18 },
  { char: "j", name: "garland", count: 3, width: 146, height: 99, y: -18 },
];
const IVY_BIG = { name: "ivy-big", count: 2, width: 50, height: 99, y: 4 };
const IVY_SMALL = { name: "ivy-small", count: 2, width: 28, height: 37, y: 10 };
const TUFT = { name: "grass", count: 8, width: 32, height: 32, y: 50 };
const TUFT_SHARE = 2;
const TUFT_SHIFT = 8;

export function createPlants(map, kinds) {
  const plants = [];
  for (let i = 0; i < kinds.length; i++) {
    const spots = map.spots(kinds[i].char);
    for (let j = 0; j < spots.length; j++) {
      plants.push(createPlant(spots[j], kinds[i]));
    }
  }
  return plants;
}

export function createIvy(map) {
  const plants = [];
  const spots = map.spots(IVY);
  for (let i = 0; i < spots.length; i++) {
    const below = map.cell(spots[i].column, spots[i].row + 1);
    let kind = IVY_BIG;
    if (below !== GROUND) kind = IVY_SMALL;
    plants.push(createPlant(spots[i], kind));
  }
  return plants;
}

export function createTufts(map) {
  const tufts = [];
  const spots = map.stands();
  for (let i = 0; i < spots.length; i++) {
    const mix = spots[i].column * 7 + spots[i].row * 13;
    if (mix % TUFT_SHARE === 0) tufts.push(createTuft(spots[i], mix));
  }
  return tufts;
}

function createTuft(spot, mix) {
  const number = ((mix / TUFT_SHARE) % TUFT.count) + 1;
  const shift = ((mix % 5) - 2) * TUFT_SHIFT;
  return new Plant(spot.x + shift, spot.y + TUFT.y, TUFT, number);
}

function createPlant(spot, kind) {
  const number = ((spot.column + spot.row) % kind.count) + 1;
  return new Plant(spot.x, spot.y + kind.y, kind, number);
}
