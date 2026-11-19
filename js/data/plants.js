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

function createPlant(spot, kind) {
  const number = ((spot.column + spot.row) % kind.count) + 1;
  return new Plant(spot.x, spot.y + kind.y, kind, number);
}
