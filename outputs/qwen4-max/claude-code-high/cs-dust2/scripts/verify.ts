// Offline verification of the pure simulation core: map connectivity,
// collision, line-of-sight, pathfinding and weapon balance.
import { buildMap, LANDMARKS, cellAt, walkable, cellCenter, inSite } from '../src/game/map';
import { findPath, gridLineClear } from '../src/game/nav';
import { raycastWorld, hasLOS, moveEntity, groundAt } from '../src/game/physics';
import { v3, vdist2 } from '../src/game/math';
import { WEAPONS, PART_MULT, applyArmor } from '../src/game/weapons';

let failures = 0;
const check = (name: string, ok: boolean, extra = ''): void => {
  if (!ok) {
    failures++;
    console.error(`  FAIL  ${name} ${extra}`);
  } else {
    console.log(`  ok    ${name}`);
  }
};

const map = buildMap();

console.log('== map areas ==');
for (const lm of LANDMARKS) {
  const { c, r } = cellAt(map, lm.p.x, lm.p.z);
  check(`landmark walkable: ${lm.name}`, walkable(map, c, r), `(${lm.p.x},${lm.p.z})`);
}
for (const team of ['CT', 'T'] as const) {
  for (const sp of map.spawns[team]) {
    const { c, r } = cellAt(map, sp.x, sp.z);
    check(`${team} spawn walkable (${sp.x},${sp.z})`, walkable(map, c, r));
  }
}
check('A site zone', inSite(map, 40, -30) === 'A');
check('B site zone', inSite(map, -40, -35) === 'B');
check('mid is not a site', inSite(map, 2, 10) === null);

console.log('== connectivity (BFS over nav grid) ==');
{
  const start = cellAt(map, LANDMARKS[0].p.x, LANDMARKS[0].p.z);
  const seen = new Uint8Array(map.cols * map.rows);
  const queue = [start.r * map.cols + start.c];
  seen[queue[0]] = 1;
  while (queue.length) {
    const cur = queue.pop()!;
    const c = cur % map.cols;
    const r = (cur / map.cols) | 0;
    for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nc = c + dc;
      const nr = r + dr;
      if (!walkable(map, nc, nr)) continue;
      const ni = nr * map.cols + nc;
      if (!seen[ni]) {
        seen[ni] = 1;
        queue.push(ni);
      }
    }
  }
  for (const lm of LANDMARKS) {
    const { c, r } = cellAt(map, lm.p.x, lm.p.z);
    check(`reachable from T spawn: ${lm.name}`, seen[r * map.cols + c] === 1);
  }
}

console.log('== doors ==');
{
  // mid door gap at x=3,z=-3 must be open; panels must block bullets partially
  const eye = v3(3.5, 1.62, 10);
  const throughGap = hasLOS(map, eye, v3(3.5, 1.62, -20));
  check('mid doors gap passable (LOS through gap)', throughGap);
  const atPanel = raycastWorld(map, v3(-2, 1.62, 10), v3(0, 0, -1), 40);
  check('mid door panel hit by ray', !!atPanel && atPanel.collider.kind === 'door');
  check('door is penetrable', !!atPanel && atPanel.collider.penetrable);
  // walking through the gap
  let pos = v3(3.5, 0, 6);
  let vel = v3(0, 0, -6);
  for (let i = 0; i < 180; i++) {
    const res = moveEntity(map, pos, vel, 1 / 60);
    pos = res.pos;
    vel = v3(0, 0, -6);
  }
  check('walk through mid doors gap', pos.z < -6, `z=${pos.z.toFixed(2)}`);
}

console.log('== collision ==');
{
  // run straight into a wall for 2s; must not pass
  let pos = v3(2, 0, 20);
  let vel = v3();
  for (let i = 0; i < 120; i++) {
    const res = moveEntity(map, pos, v3(-6, 0, 0), 1 / 60);
    pos = res.pos;
    vel = res.vel;
  }
  const { c, r } = cellAt(map, pos.x, pos.z);
  check('wall blocks movement', walkable(map, c, r), `ended at ${pos.x.toFixed(2)},${pos.z.toFixed(2)}`);
  check('did not tunnel through wall', pos.x > -4.5, `x=${pos.x.toFixed(2)}`);
  // gravity lands on floor
  const fall = moveEntity(map, v3(15, 3, 55), v3(), 1 / 60);
  check('gravity applies', fall.vel.y < 0);
  // catwalk stairs climbable
  let p = v3(5, 0, -24);
  for (let i = 0; i < 160; i++) {
    const res = moveEntity(map, p, v3(5, 0, 0), 1 / 60);
    p = res.pos;
  }
  check('catwalk stairs climb (y≈0.9)', Math.abs(p.y - 0.9) < 0.05 && p.x > 12, `y=${p.y.toFixed(2)} x=${p.x.toFixed(2)}`);
}

console.log('== pathfinding ==');
{
  let allOk = true;
  let onGrid = true;
  for (const a of LANDMARKS) {
    for (const b of LANDMARKS) {
      if (a === b) continue;
      const path = findPath(map, a.p, b.p);
      if (path.length === 0) {
        allOk = false;
        console.error(`  no path ${a.name} -> ${b.name}`);
      }
      for (let i = 0; i + 1 < path.length; i++) {
        if (!gridLineClear(map, path[i], path[i + 1])) onGrid = false;
      }
      const last = path[path.length - 1];
      if (vdist2(last, b.p) > 2.5) {
        allOk = false;
        console.error(`  path ends far from goal ${a.name} -> ${b.name}`);
      }
    }
  }
  check('paths exist between all landmarks', allOk);
  check('smoothed paths stay on walkable grid', onGrid);
}

console.log('== weapons ==');
{
  check('head = 2x chest', PART_MULT.head === 2 * PART_MULT.chest);
  check('AK damage > M4 damage', WEAPONS.ak47.damage > WEAPONS.m4a4.damage);
  check('AK recoil > M4 recoil', WEAPONS.ak47.recoilPitch > WEAPONS.m4a4.recoilPitch);
  check('M4 rpm > AK rpm', WEAPONS.m4a4.rpm > WEAPONS.ak47.rpm);
  check('AWP one-shot lethal through armor', applyArmor(WEAPONS.awp.damage, 100, 'chest').hp >= 100);
  check('AWP slow rpm', WEAPONS.awp.rpm < 60);
  check('AWP has scope', WEAPONS.awp.scope);
  check('deagle between pistol and rifle', WEAPONS.deagle.damage > WEAPONS.usp.damage && WEAPONS.deagle.damage < WEAPONS.ak47.damage);
  check('deagle small mag', WEAPONS.deagle.magSize <= 7);
  check('armor reduces body damage', applyArmor(36, 100, 'chest').hp < 36);
  check('glock is T default, usp CT default', WEAPONS.glock.slot === 'secondary' && WEAPONS.usp.slot === 'secondary');
}

console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} CHECKS FAILED`);
process.exit(failures === 0 ? 0 : 1);
