import { GameMap } from '../src/game/map/dust2';

const map = new GameMap();

// gather all floor cells
const floors: [number, number][] = [];
for (let cz = 0; cz < map.rows; cz++)
  for (let cx = 0; cx < map.cols; cx++)
    if (map.isWalkable(cx, cz)) floors.push([cx, cz]);

let bad = 0;
let tests = 0;
const R = 0.42;
for (const [cx, cz] of floors) {
  let x = map.cellCenterX(cx);
  let z = map.cellCenterZ(cz);
  // simulate small steps in 8 directions, resolving each time
  for (let d = 0; d < 8; d++) {
    const ang = (d / 8) * Math.PI * 2;
    let px = x;
    let pz = z;
    for (let step = 0; step < 20; step++) {
      px += Math.cos(ang) * 0.35;
      pz += Math.sin(ang) * 0.35;
      const [rx, rz] = map.resolveCircle(px, pz, R);
      px = rx;
      pz = rz;
      tests++;
      // resolved position must not have its circle overlapping a wall cell deeply
      if (map.isBlocked(map.toCol(px), map.toRow(pz))) bad++;
    }
  }
}
console.log(`steps tested: ${tests}, center-in-wall after resolve: ${bad}`);
console.log(bad === 0 ? 'COLLISION SLIDE OK' : 'COLLISION HAS LEAKS');
