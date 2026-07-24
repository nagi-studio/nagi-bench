import { createDust2World, DUST2 } from '../src/map/dust2.ts';

const w = createDust2World();
const g = w.grid;
let open = 0;
for (let k = 0; k < g.solid.length; k++) if (!g.solid[k]) open++;
console.log(`grid ${g.nx}x${g.nz}, open cells = ${open}`);

const seen = g.floodFill(19, 39); // start at T spawn
const targets: [string, number, number][] = [
  ['T spawn', 19, 39],
  ['CT spawn', -7, -43],
  ['A site', 38, -33],
  ['B site', -38, -30],
  ['mid doors', 4, 7],
  ['catwalk', 22, -15],
  ['long doors', 44.5, 28],
  ['long corner', 44, -13],
  ['B tunnel', -16, 14],
  ['B doors', -12, -27],
  ['A short', 33, -19],
  ['ct mid', -2, -27],
  ['pit', 38, -12],
  ['a cross', 15, -42],
  ['ct_to_b', -16, -34],
  ['upper tunnel', -8, 42],
];
let ok = true;
for (const [n, x, z] of targets) {
  const i = g.cellX(x);
  const j = g.cellZ(z);
  const solid = g.isSolidCell(i, j);
  const reach = !!seen[g.idx(i, j)];
  if (solid || !reach) ok = false;
  const tag = reach && !solid ? 'OK  ' : 'FAIL';
  console.log(`${tag} ${n.padEnd(14)} solid=${solid} reach=${reach} y=${g.floorCell(i, j).toFixed(2)}`);
}
for (const an of DUST2.anchors) {
  const i = g.cellX(an.x);
  const j = g.cellZ(an.z);
  if (g.isSolidCell(i, j) || !seen[g.idx(i, j)]) {
    console.log(`FAIL anchor ${an.name}`);
    ok = false;
  }
}
for (const t of ['T', 'CT'] as const) {
  for (const s of DUST2.spawns[t]) {
    const i = g.cellX(s.x);
    const j = g.cellZ(s.z);
    if (g.isSolidCell(i, j) || !seen[g.idx(i, j)]) {
      console.log(`FAIL spawn ${t} ${s.x},${s.z}`);
      ok = false;
    }
  }
}
let reachCount = 0;
for (const v of seen) if (v) reachCount++;
console.log(`reachable ${reachCount}/${open} (${((reachCount / open) * 100).toFixed(1)}%)`);
console.log(ok ? 'MAP OK' : 'MAP FAILED');
