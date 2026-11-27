const EASY_HEALTH = {
  goblin: 10,
  chief: 30,
  ent: 20,
  dino: 20,
  beholder: 20,
  spider: 5,
  mosquito: 5,
  boss: 100,
};

const HARD_HEALTH = {
  goblin: 20,
  chief: 35,
  ent: 40,
  dino: 20,
  beholder: 20,
  spider: 10,
  mosquito: 5,
  boss: 100,
};

export const DIFFICULTIES = {
  easy: { damage: 0.5, health: EASY_HEALTH, swordDamage: 10 },
  hard: { damage: 1, health: HARD_HEALTH, swordDamage: 10 },
};
