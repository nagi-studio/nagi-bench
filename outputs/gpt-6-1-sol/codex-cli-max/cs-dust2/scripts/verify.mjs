import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import ts from "typescript";

// These modules have no runtime imports; transpile in memory without adding a test library.
async function loadModule(path) {
  const source = await readFile(new URL(path, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
    },
  });
  return import(
    `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
  );
}
const { MapData, Navigator, SPAWNS, SITES, groundHeight, GRID_SIZE } =
  await loadModule("../src/game/map.ts");
const { WEAPONS, damageFor, HIT_MULTIPLIERS } = await loadModule(
  "../src/game/weapons.ts",
);
const map = new MapData(),
  nav = new Navigator(map);
const points = {
  T: SPAWNS.T[0],
  CT: SPAWNS.CT[0],
  A: SITES.A,
  B: SITES.B,
  Long: { x: 38, z: 4 },
  Mid: { x: -1, z: -16 },
  Catwalk: { x: 14, z: -5 },
  Tunnels: { x: -30, z: 8 },
  Lower: { x: -14, z: 7 },
};
let routes = 0;
for (const [name, from] of Object.entries(points))
  for (const [dest, to] of Object.entries(points)) {
    if (name >= dest) continue;
    const path = nav.findPath(from, to);
    assert.ok(path.length, `${name} -> ${dest} must be connected`);
    let last = from;
    for (const node of path) {
      assert.ok(
        map.clearPath(last, node, 0.38),
        `${name} -> ${dest} clips a wall`,
      );
      last = node;
    }
    assert.ok(
      Math.hypot(last.x - to.x, last.z - to.z) < 3,
      `${name} -> ${dest} never reaches destination`,
    );
    routes++;
  }
for (const team of ["T", "CT"])
  for (const p of SPAWNS[team])
    assert.equal(map.blocked(p.x, p.z), false, `${team} spawn must be free`);
assert.equal(
  map.blocked(0, -15.5),
  false,
  "middle doors must have a traversable gap",
);
assert.equal(map.blocked(-3.5, -15.9), true, "door leaves must be solid");
assert.equal(
  map.visible({ x: 0, y: 1.65, z: -10 }, { x: 0, y: 1.65, z: -20 }),
  true,
  "vision through the open middle gap",
);
assert.equal(
  map.visible({ x: -3.5, y: 1.65, z: -10 }, { x: -3.5, y: 1.65, z: -20 }),
  false,
  "door leaves must block vision",
);
const position = { x: 0, y: 0, z: 20 };
map.move(position, 80, 0);
assert.ok(
  position.x < 6 && map.onFloor(position.x, position.z),
  "high-speed movement must not tunnel through a wall",
);
const cover = { x: 31, y: groundHeight(31, -25), z: -25 };
map.move(cover, 0, -10);
assert.ok(cover.z > -28, "crate must stop movement");
assert.ok(
  groundHeight(32, -25) > 0 && groundHeight(14, -5) > 0,
  "A platform and catwalk must be raised",
);
for (const id of Object.keys(WEAPONS)) {
  const body = damageFor(id, "chest", 0, 0).health,
    head = damageFor(id, "head", 0, 0).health;
  assert.equal(head, body * 2, `${id}: headshot must be twice chest damage`);
  assert.ok(
    damageFor(id, "chest", 100, 0).health < body,
    `${id}: armor must reduce damage`,
  );
  assert.equal(
    damageFor(id, "leg", 100, 0).health,
    damageFor(id, "leg", 0, 0).health,
    "legs are not protected by armor",
  );
}
assert.ok(
  damageFor("awp", "chest", 100, 40).health >= 100,
  "AWP must kill a fully armored torso in one shot",
);
assert.ok(
  WEAPONS.ak47.recoil > WEAPONS.m4a4.recoil,
  "AK recoil must exceed M4",
);
assert.ok(
  WEAPONS.m4a4.interval < WEAPONS.ak47.interval,
  "M4 must shoot faster",
);
assert.ok(
  WEAPONS.glock.damage < WEAPONS.deagle.damage &&
    WEAPONS.deagle.damage < WEAPONS.m4a4.damage,
  "pistol damage hierarchy",
);
assert.ok(
  WEAPONS.deagle.magazine < WEAPONS.usp.magazine,
  "Deagle must have a smaller magazine",
);
assert.equal(Object.keys(HIT_MULTIPLIERS).length, 5, "all five hitbox zones");
const reachable = new Set(),
  queue = [nav.nearest(points.T)];
while (queue.length) {
  const id = queue.pop();
  if (reachable.has(id)) continue;
  reachable.add(id);
  const x = id % GRID_SIZE,
    z = (id / GRID_SIZE) | 0;
  for (const [dx, dz] of [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]) {
    const nx = x + dx,
      nz = z + dz,
      n = nz * GRID_SIZE + nx;
    if (
      nx >= 0 &&
      nz >= 0 &&
      nx < GRID_SIZE &&
      nz < GRID_SIZE &&
      nav.safe[n] &&
      !reachable.has(n)
    )
      queue.push(n);
  }
}
assert.equal(
  reachable.size,
  nav.safe.reduce((a, b) => a + b, 0),
  "navigation must not have disconnected walkable islands",
);
console.log(
  `PASS: ${routes} region-to-region routes, ${reachable.size} connected navigation cells, solid walls/crates/doors, line of sight, terrain, seven weapons, armor and five hitbox zones.`,
);

// Locations reached while strafing along CT's short-A corner must remain usable
// when switching back to navigation toward a planted bomb.
for (const [start, goal] of [
  [
    { x: 11.4638847146, z: -24.6477781405 },
    { x: -29.99, z: -21.01 },
  ],
  [
    { x: 9.8649730349, z: -24.6403351638 },
    { x: 36.4, z: -18.3 },
  ],
]) {
  const path = nav.findPath(start, goal);
  const position = { ...start, y: groundHeight(start.x, start.z) };
  let index = 0;
  for (let frame = 0; frame < 1800 && index < path.length; frame++) {
    while (
      index < path.length &&
      Math.hypot(position.x - path[index].x, position.z - path[index].z) < 0.52
    )
      index++;
    if (index >= path.length) break;
    const dx = path[index].x - position.x,
      dz = path[index].z - position.z,
      length = Math.hypot(dx, dz);
    const step = Math.min(length, 3.7 / 60);
    map.move(position, (dx / length) * step, (dz / length) * step);
    position.y = groundHeight(position.x, position.z);
  }
  assert.ok(
    Math.hypot(position.x - goal.x, position.z - goal.z) < 1.3,
    "actors must escape the wall after a combat strafe",
  );
}
console.log(
  "PASS: both CT corner retreat regression paths remain physically traversable.",
);
