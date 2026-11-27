export function updateObjects(objects, delta) {
  for (let i = 0; i < objects.length; i++) {
    objects[i].update(delta);
  }
}

export function updateProjectiles(projectiles, delta) {
  updateObjects(projectiles, delta);
  return projectiles.filter((projectile) => !projectile.done);
}
