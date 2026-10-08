/**
 * Headless simulation harness (dev only).
 * Runs the engine for several rounds with no human input and reports whether
 * the bots navigate, fight, plant / defuse and whether rounds resolve.
 *
 *   npm run sim
 */

import { GameEngine, makeInput } from './game';
import { REGIONS, REGION_INDEX, buildDust2Grid, propBoxes } from './map/dust2';
import { dist2D, makeRng } from './mathUtils';
import { makeBody, moveHorizontal, moveVertical } from './physics';

const STEP = 1 / 60;

function run(label: string, seconds: number): void {
  const engine = new GameEngine('CT');
  const input = makeInput();
  engine.setPlayerWeapons(null, 'usp');

  const visited = new Set<number>();
  const startPos = new Map<number, { x: number; z: number }>();
  for (const c of engine.combatants) startPos.set(c.id, { x: c.body.x, z: c.body.z });

  const track = new Map<number, { x: number; z: number; still: number }>();
  const roundsSeen = new Set<number>();
  const winners: string[] = [];
  let lastRound = engine.round.number;
  let plantedFlag = false;
  let defusedFlag = false;
  let plantCount = 0;
  let defuseCount = 0;
  let stuckReports = 0;
  let lastWinner: string | null = null;

  let clipReports = 0;

  const steps = Math.round(seconds / STEP);
  for (let i = 0; i < steps; i++) {
    engine.step(STEP, input);

    for (const c of engine.combatants) {
      if (!c.alive) continue;
      const r = engine.grid.regionAt(c.body.x, c.body.z);
      if (r > 0) visited.add(r);
      if (!engine.grid.isWalkableAt(c.body.x, c.body.z)) {
        clipReports++;
        if (clipReports <= 6) {
          console.log(`   [clip] ${c.name}(${c.team}) @(${c.body.x.toFixed(2)},${c.body.z.toFixed(2)})`);
        }
      }
    }

    if (engine.round.number !== lastRound) {
      lastRound = engine.round.number;
      roundsSeen.add(lastRound);
      track.clear();
    }
    if (engine.round.winner && engine.round.winner !== lastWinner) {
      lastWinner = engine.round.winner;
      winners.push(`${lastWinner}(${engine.round.reason})`);
    }
    if (!engine.round.winner) lastWinner = null;

    if (engine.bomb.state === 'planted' && !plantedFlag) { plantedFlag = true; plantCount++; }
    if (engine.bomb.state !== 'planted') plantedFlag = false;
    if (engine.bomb.state === 'defused' && !defusedFlag) { defusedFlag = true; defuseCount++; }
    if (engine.bomb.state !== 'defused') defusedFlag = false;

    // stall detection, sampled once per second
    if (i % 60 === 0) {
      for (const c of engine.combatants) {
        if (!c.alive || c.isHuman) continue;
        const t = track.get(c.id);
        if (!t) { track.set(c.id, { x: c.body.x, z: c.body.z, still: 0 }); continue; }
        const moved = dist2D(c.body.x, c.body.z, t.x, t.z);
        if (moved < 0.4) {
          t.still++;
          if (t.still === 8) {
            stuckReports++;
            const rid = engine.grid.regionAt(c.body.x, c.body.z);
            const b = c.brain!;
            const gd = b.goal ? dist2D(c.body.x, c.body.z, b.goal.x, b.goal.z) : -1;
            console.log(
              `   [stall] ${c.name}(${c.team}) @(${c.body.x.toFixed(1)},${c.body.z.toFixed(1)}) ` +
              `reg=${rid > 0 ? REGIONS[rid - 1]!.id : '?'} st=${b.state} role=${b.role} ` +
              `goal=${b.goal ? `(${b.goal.x.toFixed(0)},${b.goal.z.toFixed(0)})` : 'none'} d=${gd.toFixed(1)} ` +
              `path=${b.path.length}/${b.pathIndex} route=${b.routeIndex}/${b.route.length} ` +
              `tgt=${b.targetId} vis=${b.visible} v=(${c.body.vx.toFixed(2)},${c.body.vz.toFixed(2)})`,
            );
          }
        } else {
          t.still = 0;
        }
        t.x = c.body.x;
        t.z = c.body.z;
      }
    }
  }

  console.log(`\n=== ${label} — ${seconds}s simulated ===`);
  console.log(`rounds played   : ${roundsSeen.size}`);
  console.log(`round results   : ${winners.join(' | ') || '(none)'}`);
  console.log(`bombs planted   : ${plantCount}`);
  console.log(`bombs defused   : ${defuseCount}`);
  console.log(`stall reports   : ${stuckReports}`);
  console.log(`wall clips      : ${clipReports}`);
  console.log(`score           : CT ${engine.round.scoreCT} : ${engine.round.scoreT} T`);

  const missing = REGIONS.filter((r) => !visited.has(REGION_INDEX[r.id]! + 1));
  console.log(`regions visited : ${REGIONS.length - missing.length}/${REGIONS.length}` +
    (missing.length ? `  (never: ${missing.map((m) => m.id).join(', ')})` : ''));

  console.log('final combatants:');
  for (const c of engine.combatants) {
    const rid = engine.grid.regionAt(c.body.x, c.body.z);
    console.log(
      `   ${c.team} ${c.name.padEnd(6)} ${c.alive ? 'alive' : 'dead '} ` +
      `hp=${String(Math.round(c.health)).padStart(3)} k=${c.kills} d=${c.deaths} ` +
      `dmg=${String(Math.round(c.damage)).padStart(4)} @${(rid > 0 ? REGIONS[rid - 1]!.id : '-').padEnd(13)}` +
      `(${c.body.x.toFixed(0)},${c.body.z.toFixed(0)})`,
    );
  }

  const moved = [...startPos.entries()].filter(([id, p]) => {
    const c = engine.combatants.find((x) => x.id === id)!;
    return !c.isHuman && dist2D(c.body.x, c.body.z, p.x, p.z) > 8;
  });
  console.log(`bots that pushed out of spawn: ${moved.length}/9`);
}

/**
 * (1) Continuous-collision sweep. Drives a body with single displacements far
 * larger than a frame can ever produce (up to 12 m in one `moveHorizontal`
 * call) from thousands of random walkable starting positions. If the
 * substepped sweep has a hole, the body ends up on a non-walkable cell.
 */
function sweepStress(iterations: number): boolean {
  const grid = buildDust2Grid();
  const props = propBoxes();
  const rng = makeRng(0xc0ffee);
  const walkable: { x: number; z: number }[] = [];
  for (let cz = 0; cz < grid.rows; cz++) {
    for (let cx = 0; cx < grid.cols; cx++) {
      if (grid.isWalkableCell(cx, cz)) walkable.push({ x: grid.centerX(cx), z: grid.centerZ(cz) });
    }
  }

  let failures = 0;
  let worst = 0;
  for (let i = 0; i < iterations; i++) {
    const s = walkable[Math.floor(rng() * walkable.length)]!;
    const body = makeBody(s.x, 0, s.z, 0.36, 1.8);
    for (let k = 0; k < 8; k++) {
      const a = rng() * Math.PI * 2;
      const d = 0.5 + rng() * 12;
      moveHorizontal(grid, props, body, Math.cos(a) * d, Math.sin(a) * d);
      moveVertical(grid, props, body, STEP);
      if (!grid.isWalkableAt(body.x, body.z)) {
        failures++;
        worst = Math.max(worst, d);
        if (failures <= 6) {
          console.log(`   [sweep clip] from (${s.x.toFixed(1)},${s.z.toFixed(1)}) ` +
            `-> (${body.x.toFixed(2)},${body.z.toFixed(2)}) step=${d.toFixed(1)}m`);
        }
        break;
      }
    }
  }
  console.log(`\n=== collision sweep CCD — ${iterations} bodies x 8 huge displacements ===`);
  console.log(`walkable start cells        : ${walkable.length}`);
  console.log(`escapes                     : ${failures}` +
    (worst ? `  (largest displacement that still failed: ${worst.toFixed(1)}m)` : ''));
  const ok = failures === 0;
  console.log(ok ? 'CCD OK — no displacement can sweep a body through a wall' : 'FAIL — sweep tunnelled');
  return ok;
}

/**
 * (2) Chaos test through the real engine: bodies receive random velocity
 * impulses, vertical kicks and outright teleports (including into solid
 * geometry). The `unstickBody` safety net has to pull every one of them back
 * onto walkable floor, and nobody may leave the world vertically.
 */
function chaosStress(seconds: number): boolean {
  const engine = new GameEngine('CT');
  const input = makeInput();
  const rng = makeRng(0x5eed1234);
  const steps = Math.round(seconds / STEP);
  const grid = engine.grid;

  let clipSamples = 0;
  let fell = 0;
  let teleports = 0;
  let framesOutside = 0;

  for (let i = 0; i < steps; i++) {
    if (i % 15 === 0) {
      for (const c of engine.combatants) {
        if (!c.alive) continue;
        if (rng() < 0.35) {
          // outright teleport anywhere in the level bounds, walls included
          c.body.x = grid.ox + rng() * grid.cols * grid.cell;
          c.body.z = grid.oz + rng() * grid.rows * grid.cell;
          c.body.y = rng() * 6;
          teleports++;
        } else {
          const a = rng() * Math.PI * 2;
          const s = 20 + rng() * 80;
          c.body.vx = Math.cos(a) * s;
          c.body.vz = Math.sin(a) * s;
          if (rng() < 0.4) c.body.vy = 8 + rng() * 12;
        }
      }
    }
    engine.step(STEP, input);

    for (const c of engine.combatants) {
      if (!c.alive) continue;
      if (!grid.isWalkableAt(c.body.x, c.body.z)) {
        if (clipSamples <= 6) {
          console.log(`   [clip] ${c.name}(${c.team}) @(${c.body.x.toFixed(2)},${c.body.z.toFixed(2)}) ` +
            `v=(${c.body.vx.toFixed(1)},${c.body.vz.toFixed(1)})`);
        }
        clipSamples++;
        framesOutside++;
      }
      if (c.body.y < -3 || c.body.y > 40) {
        if (fell <= 6) console.log(`   [fell] ${c.name}(${c.team}) y=${c.body.y.toFixed(2)}`);
        fell++;
      }
    }
  }

  // once the chaos stops, everybody has to be back on legitimate floor
  const outsideNow = () => engine.combatants.filter(
    (c) => c.alive && !grid.isWalkableAt(c.body.x, c.body.z));
  let settleFrames = 0;
  for (let i = 1; i <= 900; i++) {
    engine.step(STEP, input);
    settleFrames = i;
    if (outsideNow().length === 0) break;
    if (i % 150 === 0) {
      for (const c of outsideNow()) {
        const nw = grid.nearestWalkable(c.body.x, c.body.z);
        console.log(`   [settling] f=${i} ${c.name}(${c.team}) @(${c.body.x.toFixed(2)},${c.body.z.toFixed(2)}) ` +
          `y=${c.body.y.toFixed(2)} v=(${c.body.vx.toFixed(1)},${c.body.vz.toFixed(1)}) ground=${c.body.onGround} ` +
          `nw=${nw ? `(${nw.x.toFixed(2)},${nw.z.toFixed(2)})` : 'null'} cell=(${grid.cellX(c.body.x)},${grid.cellZ(c.body.z)})`);
      }
    }
  }
  const stuckList = outsideNow();
  for (const c of stuckList) {
    console.log(`   [still outside] ${c.name}(${c.team}) @(${c.body.x.toFixed(2)},${c.body.z.toFixed(2)})`);
  }

  console.log(`\n=== chaos stress — ${seconds}s simulated ===`);
  console.log(`teleports into geometry     : ${teleports}`);
  console.log(`samples taken inside a wall : ${framesOutside}`);
  console.log(`bodies out of the world     : ${fell}`);
  console.log(`frames to fully recover     : ${settleFrames} (${(settleFrames * STEP).toFixed(1)}s)`);
  console.log(`still outside after settling: ${stuckList.length}`);
  const ok = stuckList.length === 0 && fell === 0;
  console.log(ok ? 'RECOVERY OK — every body is back on walkable floor' : 'FAIL — a body stayed outside');
  return ok;
}

console.log('starting headless 5v5 simulation…');
run('headless 5v5', 260);
const sweepOk = sweepStress(20000);
const chaosOk = chaosStress(60);
console.log(`\n${sweepOk && chaosOk ? 'ALL PHYSICS CHECKS PASSED' : 'PHYSICS CHECKS FAILED'}`);
console.log('DONE');
