// Focused mechanic checks with assertions.
import { Sim, TICK } from '../src/core/sim.ts';
import { WEAPONS, computeDamage, HITGROUP_MULT } from '../src/core/weapons.ts';
import type { HitGroup } from '../src/core/weapons.ts';
import { HITBOXES, rayHitboxes } from '../src/core/skeleton.ts';
import { stepBody } from '../src/core/physics.ts';
import { World } from '../src/core/world.ts';
import { BOMBSITES } from '../src/core/mapData.ts';
import { DEG } from '../src/core/math.ts';

let failures = 0;
const check = (cond: boolean, msg: string) => {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${msg}`);
  if (!cond) failures++;
};

// ---------------------------------------------------------------- damage model
const noArmor = { armor: 0, helmet: false };
const kevlar = { armor: 100, helmet: false };
const full = { armor: 100, helmet: true };
for (const id of ['ak47', 'm4a4', 'awp', 'glock', 'usp', 'deagle'] as const) {
  const d = WEAPONS[id];
  const head = computeDamage(d, d.damage, 'head', 0, noArmor).health;
  const chest = computeDamage(d, d.damage, 'chest', 0, noArmor).health;
  check(Math.abs(head - 2 * chest) <= 1, `${id}: headshot (${head}) = 2x body (${chest})`);
}
const groups: HitGroup[] = ['head', 'chest', 'stomach', 'arm', 'leg'];
check(new Set(groups.map((g) => HITGROUP_MULT[g])).size === 5, 'every hit group has a distinct multiplier');
check(computeDamage(WEAPONS.ak47, 38, 'chest', 0, kevlar).health < computeDamage(WEAPONS.ak47, 38, 'chest', 0, noArmor).health, 'kevlar reduces chest damage');
check(computeDamage(WEAPONS.ak47, 38, 'leg', 0, kevlar).health === computeDamage(WEAPONS.ak47, 38, 'leg', 0, noArmor).health, 'legs are not protected by kevlar');
check(computeDamage(WEAPONS.ak47, 38, 'head', 0, full).health < computeDamage(WEAPONS.ak47, 38, 'head', 0, kevlar).health, 'helmet reduces headshot damage');
for (const g of ['head', 'chest', 'stomach', 'arm'] as HitGroup[])
  check(computeDamage(WEAPONS.awp, WEAPONS.awp.damage, g, 20, full).health >= 100, `AWP one-shots through full armor (${g})`);
check(WEAPONS.glock.damage < WEAPONS.deagle.damage && WEAPONS.usp.damage < WEAPONS.deagle.damage, 'deagle hits harder than glock/usp');
check(WEAPONS.deagle.damage < WEAPONS.m4a4.damage && WEAPONS.deagle.damage < WEAPONS.ak47.damage, 'deagle below rifles');
check(WEAPONS.deagle.magSize < WEAPONS.glock.magSize && WEAPONS.deagle.magSize < WEAPONS.usp.magSize, 'deagle has the smallest magazine');
check(WEAPONS.ak47.damage > WEAPONS.m4a4.damage, 'AK damage > M4 damage');
check(WEAPONS.m4a4.fireInterval < WEAPONS.ak47.fireInterval, 'M4 fires faster than AK');
check(WEAPONS.awp.fireInterval > 1, 'AWP fires very slowly');

// ---------------------------------------------------------------- hitboxes
const pos = { x: 0, y: 0, z: 0 };
const shoot = (y: number, x = 0) => rayHitboxes(HITBOXES.rifle, pos, 0, x, y, -10, 0, 0, 1, 100)?.group ?? null;
check(shoot(1.7) === 'head', 'ray at 1.70 m hits head');
check(shoot(1.4, 0.18) === 'chest' || shoot(1.4, 0.18) === 'arm', `ray at 1.40 m hits chest/arm (${shoot(1.4, 0.18)})`);
check(shoot(1.0, -0.12) === 'stomach', `ray at 1.0 m hits stomach (${shoot(1.0, -0.12)})`);
check(shoot(0.4, 0.1) === 'leg', 'ray at 0.4 m hits leg');
check(shoot(2.0) === null, 'ray above head misses');
// rotated target: facing +X (yaw = -90deg) shot from +X side still hits head
const rh = rayHitboxes(HITBOXES.rifle, pos, -Math.PI / 2, 10, 1.65, 0, -1, 0, 0, 100);
check(rh?.group === 'head', 'rotated hitboxes work');

// ---------------------------------------------------------------- recoil comparison
function spray(id: 'ak47' | 'm4a4', shots: number) {
  const sim = new Sim({ playerTeam: 'T', difficulty: 'normal', allPistolRounds: false, winsToMatch: 99, autopilot: false, playerName: 'p' });
  sim.start();
  while (sim.round.phase === 'freeze') sim.step(TICK);
  const c = sim.player;
  c.give(id);
  c.active = 'primary';
  c.deployEnd = 0;
  c.nextAttack = 0;
  // stand in a quiet place, disable bots
  for (const o of sim.chars) if (o !== c) o.alive = false;
  c.input.fire = true;
  let maxPunch = 0;
  let fired = 0;
  let maxSpread = 0;
  for (let i = 0; i < 400 && fired < shots; i++) {
    const before = c.weapon!.mag;
    sim.step(TICK);
    if (c.weapon!.mag < before) fired++;
    maxPunch = Math.max(maxPunch, c.punchPitch);
    maxSpread = Math.max(maxSpread, sim.computeSpread(c));
  }
  c.input.fire = false;
  return { punch: maxPunch / DEG, spread: maxSpread, fired };
}
const ak = spray('ak47', 10);
const m4 = spray('m4a4', 10);
check(ak.fired === 10 && m4.fired === 10, 'automatic fire works');
check(ak.punch > m4.punch * 1.5, `AK view climb (${ak.punch.toFixed(1)}°) much stronger than M4 (${m4.punch.toFixed(1)}°)`);
check(ak.spread > m4.spread * 1.4, `AK spread (${ak.spread.toFixed(3)}) larger than M4 (${m4.spread.toFixed(3)})`);

// ---------------------------------------------------------------- mid doors are passable, walls are not
const world = new World();
const body = { pos: { x: 1.9, y: 0, z: -18 }, vel: { x: 0, y: 0, z: -5 }, radius: 0.4, height: 1.82, onGround: true, landImpact: 0 };
for (let i = 0; i < 240; i++) {
  body.vel.x = (1.9 - body.pos.x) * 4;
  body.vel.z = -5;
  stepBody(world, body, TICK);
}
check(body.pos.z < -27, `walked through the mid-door gap (z=${body.pos.z.toFixed(1)})`);
const body2 = { pos: { x: -2.5, y: 0, z: -18 }, vel: { x: 0, y: 0, z: -5 }, radius: 0.4, height: 1.82, onGround: true, landImpact: 0 };
for (let i = 0; i < 240; i++) {
  body2.vel.z = -5;
  body2.vel.x = 0;
  stepBody(world, body2, TICK);
}
check(body2.pos.z > -23, `closed door leaf / wall blocks (z=${body2.pos.z.toFixed(2)})`);
const body3 = { pos: { x: 3, y: 0, z: 0 }, vel: { x: 0, y: 0, z: 0 }, radius: 0.4, height: 1.82, onGround: true, landImpact: 0 };
for (let i = 0; i < 300; i++) {
  body3.vel.x = -8;
  body3.vel.z = 0;
  stepBody(world, body3, TICK);
}
check(body3.pos.x > -4.0 - 0.01 || world.floorAt(body3.pos.x, body3.pos.z) !== null, 'cannot leave walkable space through walls');
// climb the catwalk ramp to 1.2m
const body4 = { pos: { x: 5, y: 0, z: -5 }, vel: { x: 0, y: 0, z: 0 }, radius: 0.4, height: 1.82, onGround: true, landImpact: 0 };
for (let i = 0; i < 200; i++) {
  body4.vel.x = 5;
  body4.vel.z = 0;
  stepBody(world, body4, TICK);
}
check(Math.abs(body4.pos.y - 1.2) < 0.05, `walked up the catwalk ramp (y=${body4.pos.y.toFixed(2)})`);

// ---------------------------------------------------------------- pistol round loadout
{
  const sim = new Sim({ playerTeam: 'CT', difficulty: 'normal', allPistolRounds: false, winsToMatch: 99, autopilot: true, playerName: 'p' });
  sim.start();
  const ok = sim.chars.every(
    (c) =>
      !c.weapons.primary &&
      c.weapons.secondary?.def.id === (c.team === 'T' ? 'glock' : 'usp') &&
      !!c.weapons.melee &&
      !c.helmet &&
      c.armor === 100,
  );
  check(sim.round.isPistol && ok, 'round 1 is a pistol round: default pistol + knife, kevlar, no helmet, no primary');
  const carriers = sim.chars.filter((c) => c.hasBomb());
  check(carriers.length === 1 && carriers[0].team === 'T', 'exactly one T carries the C4');
  // gun round
  sim.round.endRound('CT', 'time');
  sim.round.phase = 'live';
  sim.round.endRound('CT', 'time');
  sim.round.startRound();
  check(!sim.round.isPistol && sim.chars.every((c) => !!c.weapons.primary), 'round 2 is a gun round with primaries');
}

// ---------------------------------------------------------------- plant + defuse flow
{
  const sim = new Sim({ playerTeam: 'T', difficulty: 'normal', allPistolRounds: false, winsToMatch: 99, autopilot: false, playerName: 'p' });
  sim.start();
  while (sim.round.phase === 'freeze') sim.step(TICK);
  const t = sim.player;
  const carrier = sim.chars.find((c) => c.hasBomb())!;
  if (carrier !== t) {
    delete carrier.weapons.bomb;
    sim.giveBomb(t);
  }
  // freeze bots so nobody interferes
  for (const c of sim.chars) if (c !== t) c.isBot = false;
  const [px, pz] = BOMBSITES.B.plant;
  t.body.pos.x = px;
  t.body.pos.z = pz;
  t.body.pos.y = 0;
  t.input.use = true;
  let steps = 0;
  while (sim.bomb.state !== 'planted' && steps < 400) {
    sim.step(TICK);
    steps++;
  }
  check(sim.bomb.state === 'planted' && sim.bomb.site === 'B', `T planted at B after ${(steps * TICK).toFixed(2)}s`);
  t.input.use = false;
  const ct = sim.chars.find((c) => c.team === 'CT')!;
  ct.body.pos.x = px + 0.5;
  ct.body.pos.z = pz;
  ct.body.pos.y = 0;
  ct.input.use = true;
  steps = 0;
  while (sim.bomb.state === 'planted' && steps < 60 * 12) {
    sim.step(TICK);
    steps++;
  }
  check(sim.bomb.state === 'defused', `CT defused after ${(steps * TICK).toFixed(2)}s (kit=${ct.hasKit})`);
  check(sim.round.lastWinner === 'CT' && sim.round.lastReason === 'bomb_defused', 'CT wins by defuse');
}
// explosion
{
  const sim = new Sim({ playerTeam: 'T', difficulty: 'normal', allPistolRounds: false, winsToMatch: 99, autopilot: false, playerName: 'p' });
  sim.start();
  while (sim.round.phase === 'freeze') sim.step(TICK);
  for (const c of sim.chars) c.isBot = false;
  const carrier = sim.chars.find((c) => c.hasBomb())!;
  const [px, pz] = BOMBSITES.A.plant;
  carrier.body.pos.x = px;
  carrier.body.pos.z = pz;
  carrier.body.pos.y = 1.2;
  carrier.input.use = true;
  for (let i = 0; i < 300 && sim.bomb.state !== 'planted'; i++) sim.step(TICK);
  carrier.input.use = false;
  // kill all Ts except the planter: planted bomb keeps the round alive
  for (const c of sim.chars) if (c.team === 'T' && c !== carrier) sim.kill(c, c, 'knife', false, true);
  sim.kill(carrier, carrier, 'knife', false, true);
  check(sim.round.phase === 'live', 'round continues after all Ts die once the bomb is planted');
  for (let i = 0; i < 60 * 42 && sim.bomb.state === 'planted'; i++) sim.step(TICK);
  check(sim.bomb.state === 'exploded' && sim.round.lastWinner === 'T', 'bomb explodes after 40s -> T win');
}
// dropped bomb pickup
{
  const sim = new Sim({ playerTeam: 'T', difficulty: 'normal', allPistolRounds: false, winsToMatch: 99, autopilot: false, playerName: 'p' });
  sim.start();
  while (sim.round.phase === 'freeze') sim.step(TICK);
  for (const c of sim.chars) c.isBot = false;
  const carrier = sim.chars.find((c) => c.hasBomb())!;
  const other = sim.chars.find((c) => c.team === 'T' && c !== carrier)!;
  sim.kill(carrier, sim.chars.find((c) => c.team === 'CT')!, 'ak47', false);
  check(sim.bomb.state === 'dropped', 'bomb drops when the carrier dies');
  other.body.pos.x = sim.bomb.pos.x + 0.3;
  other.body.pos.z = sim.bomb.pos.z;
  other.body.pos.y = sim.bomb.pos.y;
  sim.step(TICK);
  check(sim.bomb.state === 'carried' && other.hasBomb(), 'another T picks the bomb up');
}

console.log(failures === 0 ? '\nALL MECHANICS OK' : `\n${failures} FAILURE(S)`);
process.exit(failures ? 1 : 0);
