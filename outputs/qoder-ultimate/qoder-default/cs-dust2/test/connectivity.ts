import { GameMap } from '../src/game/map/dust2';
import { Navigation } from '../src/game/ai/navigation';

const map = new GameMap();
const nav = new Navigation(map);

const regions = [
  'tSpawn',
  'ctSpawn',
  'aSite',
  'bSite',
  'long',
  'catwalk',
  'bTunnel',
  'mid',
  'midCT',
];

let fail = 0;
// verify every region reachable from tSpawn and ctSpawn
for (const start of ['tSpawn', 'ctSpawn']) {
  const s = map.randomFloorInRect(start);
  for (const r of regions) {
    if (r === start) continue;
    const t = map.randomFloorInRect(r);
    const path = nav.findPath(s.x, s.z, t.x, t.z);
    const ok = path.length > 0;
    if (!ok) {
      console.log(`FAIL: no path ${start} -> ${r}`);
      fail++;
    }
  }
}

// spawn sanity
for (const team of ['T', 'CT'] as const) {
  const sp = map.spawnPoints(team);
  for (const p of sp) {
    if (!map.isFloorWorld(p.x, p.z)) {
      console.log(`FAIL: ${team} spawn not on floor`, p.x, p.z);
      fail++;
    }
  }
}

// collision resolve keeps point out of walls
let clipped = 0;
for (let i = 0; i < 2000; i++) {
  const x = -50 + Math.random() * 100;
  const z = -56 + Math.random() * 110;
  const [nx, nz] = map.resolveCircle(x, z, 0.42);
  // after resolve, center cell should not be a blocked cell it was pushed into
  if (map.isBlocked(map.toCol(nx), map.toRow(nz))) {
    // acceptable only if deep inside solid with no floor nearby
    clipped++;
  }
}

console.log(`connectivity failures: ${fail}`);
console.log(`resolve-into-wall centers (info): ${clipped}/2000`);
console.log(fail === 0 ? 'ALL CONNECTIVITY TESTS PASSED' : 'CONNECTIVITY TESTS FAILED');
