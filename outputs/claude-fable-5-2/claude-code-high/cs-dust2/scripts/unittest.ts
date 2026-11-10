// Focused checks of gameplay rules on the real simulation code:  bun run scripts/unittest.ts
import { Actor, rayActor, STAND_HEIGHT } from '../src/sim/actor';
import { RNG } from '../src/sim/math';
import { Simulation, TICK } from '../src/sim/sim';
import { applyArmor, WEAPONS, ZONE_MULT } from '../src/sim/weapons';

let failures = 0;
const ok = (cond: boolean, msg: string) => {
  if (!cond) failures++;
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${msg}`);
};

// ---------------------------------------------------------------- weapon data rules
ok(ZONE_MULT.head === 2 * ZONE_MULT.chest, 'headshot multiplier is exactly 2x body');
ok(new Set(Object.values(ZONE_MULT)).size === 5, 'all five hit zones have distinct multipliers');
const W = WEAPONS;
ok(W.ak47.damage > W.m4a1.damage && W.ak47.recoilPitch > W.m4a1.recoilPitch * 2, 'AK-47: more damage and far more recoil than M4A1');
ok(W.m4a1.rpm > W.ak47.rpm, 'M4A1 fires faster than AK-47');
ok(W.awp.damage * ZONE_MULT.stomach * W.awp.armorPen >= 100, 'AWP kills an armored target with one body shot');
ok(W.awp.rpm < 60 && !!W.awp.zoom, 'AWP is slow and scoped');
const pistols = [W.glock, W.usp];
ok(pistols.every((p) => p.damage < W.deagle.damage) && W.deagle.damage < Math.min(W.ak47.damage, W.m4a1.damage), 'Deagle damage sits between pistols and rifles');
ok(W.deagle.magSize < W.glock.magSize && W.deagle.magSize < W.usp.magSize, 'Deagle has the smallest magazine');
const a1 = applyArmor(100, 'chest', 100, true, 0.7);
ok(Math.abs(a1.health - 70) < 1e-9 && a1.armor === 15, 'armor: 70% to health, half of the rest absorbed');
ok(applyArmor(100, 'leg', 100, true, 0.7).health === 100, 'armor does not cover legs');
ok(applyArmor(100, 'head', 100, false, 0.7).health === 100, 'no helmet: full headshot damage');

// ---------------------------------------------------------------- hitbox zones
{
  const t = new Actor(0, 't', 'def');
  t.pos.x = 0;
  t.pos.y = 0;
  t.pos.z = -10;
  t.yaw = 0.7; // arbitrary facing
  const probe = (y: number, x = 0) => {
    const h = rayActor(t, x, y, 0, 0, 0, -1, 50);
    return h ? h.zone : 'miss';
  };
  ok(probe(1.65) === 'head', 'ray at 1.65 m hits the head');
  ok(probe(1.3) === 'chest', 'ray at 1.30 m hits the chest');
  ok(probe(1.0) === 'stomach', 'ray at 1.00 m hits the stomach');
  ok(probe(0.4, 0.1) === 'leg' || probe(0.4, -0.1) === 'leg', 'ray at 0.40 m hits a leg');
  ok(probe(2.0) === 'miss' && probe(1.0, 1.0) === 'miss', 'rays above / beside the body miss');
  t.crouch = 1;
  ok(probe(1.65) === 'miss' && probe(1.2) === 'head', 'crouching lowers the head hitbox');
}

// ---------------------------------------------------------------- live simulation with a human slot
const sim = new Simulation({ humanTeam: 'atk', mode: 'rifle', difficulty: 1, seed: 9 });
const h = sim.human as Actor;
ok(h !== null && h.isHuman && h.team === 'atk', 'human controls an attacker');
ok(sim.actors.length === 10 && sim.aliveCount('atk') === 5 && sim.aliveCount('def') === 5, '5 v 5');
ok(sim.actors.filter((a) => a.hasBomb).length === 1 && sim.actors.find((a) => a.hasBomb)?.team === 'atk', 'exactly one attacker carries the C4');
ok(h.weapons.primary?.def.id === 'ak47' && h.armor === 100 && h.helmet, 'rifle round: AK + full armor for attackers');
const d0 = sim.actors[5];
ok(d0.weapons.primary !== null && d0.hasKit, 'rifle round: defenders have a primary and a defuse kit');

// freeze time: nobody moves, nobody shoots
h.input.moveZ = 1;
h.input.fire = true;
const startX = h.pos.x;
for (let i = 0; i < 60; i++) sim.tick(TICK);
ok(Math.abs(h.pos.x - startX) < 1e-6 && h.weapon.ammo === 30, 'freeze time locks movement and fire');
h.input.fire = false;
while (sim.round.phase === 'freeze') sim.tick(TICK);
// park the bots so they do not interfere with the measurements below
for (const a of sim.actors) if (!a.isHuman) a.pos.y = 0;
const freezeBots = () => {
  for (const b of sim.brains) (b as unknown as { nextThink: number }).nextThink = Infinity;
};

// --- run speed and jump height
h.input.moveZ = 1;
let top = 0;
let maxSpeed = 0;
for (let i = 0; i < 90; i++) {
  h.input.jump = i === 60;
  sim.tick(TICK);
  top = Math.max(top, h.pos.y);
  maxSpeed = Math.max(maxSpeed, h.speed);
}
ok(maxSpeed > 4.2 && maxSpeed < 6, `run speed with a rifle = ${maxSpeed.toFixed(2)} m/s`);
ok(top > 1.05 && top < 1.35, `jump apex = ${top.toFixed(2)} m`);
h.input.moveZ = 0;
h.input.jump = false;
for (let i = 0; i < 40; i++) sim.tick(TICK);
ok(h.speed < 0.05, 'friction brings the player to a stop');

// --- recoil: spray 12 rounds with each rifle and compare the climb
const spray = (slot: 'primary', id: 'ak47' | 'm4a1'): { climb: number; spread: number } => {
  h.give(id);
  h.active = slot;
  h.drawEnd = 0;
  h.reloadEnd = 0;
  h.punchPitch = 0;
  h.punchYaw = 0;
  h.spread = 0;
  h.shotsFired = 0;
  h.nextFire = 0;
  h.pitch = 0;
  h.input.fire = true;
  let guard = 0;
  while (h.weapon.ammo > 18 && guard++ < 600) sim.tick(TICK);
  const r = { climb: (h.punchPitch * 180) / Math.PI, spread: h.inaccuracy() };
  h.input.fire = false;
  for (let i = 0; i < 90; i++) sim.tick(TICK);
  return r;
};
const ak = spray('primary', 'ak47');
const settle = (h.punchPitch * 180) / Math.PI;
const m4 = spray('primary', 'm4a1');
ok(ak.climb > 7 && ak.climb > m4.climb * 1.8, `12-round spray climbs ${ak.climb.toFixed(1)} deg (AK) vs ${m4.climb.toFixed(1)} deg (M4)`);
ok(ak.spread > m4.spread * 1.5, `spray bloom ${ak.spread.toFixed(4)} rad (AK) vs ${m4.spread.toFixed(4)} rad (M4)`);
ok(Math.abs(settle) < 0.2, 'view recovers after the spray stops');

// --- reload restores the magazine from reserve
h.give('ak47');
h.active = 'primary';
h.weapon.ammo = 7;
h.drawEnd = 0;
h.input.reload = true;
sim.tick(TICK);
h.input.reload = false;
ok(h.reloading, 'R starts a reload');
for (let i = 0; i < 60 * 3; i++) sim.tick(TICK);
ok(h.weapon.ammo === 30 && h.weapon.reserve === 67, 'reload refills the magazine and consumes reserve');

// --- AWP: scope cycle, one-shot kill, bolt unscopes
h.give('awp');
h.active = 'primary';
h.drawEnd = 0;
const click2 = () => {
  h.input.fire2 = true;
  sim.tick(TICK);
  h.input.fire2 = false;
  sim.tick(TICK);
};
click2();
ok(h.zoom === 1, 'right click scopes in');
click2();
ok(h.zoom === 2, 'second right click zooms further');
const victim = sim.actors[6];
// put the victim 20 m in front of the player on open ground (attacker spawn faces east)
h.pos.x = -50;
h.pos.z = 0;
h.pos.y = 0;
h.vel.x = h.vel.z = 0;
h.yaw = -Math.PI / 2;
h.pitch = -0.012; // chest height at 20 m
victim.pos.x = -44;
victim.pos.z = 0;
victim.pos.y = 0;
freezeBots();
for (const a of sim.actors) if (!a.isHuman) a.input.moveX = a.input.moveZ = 0;
for (let i = 0; i < 30; i++) {
  victim.pos.x = -44;
  victim.pos.z = 0;
  sim.tick(TICK);
}
h.punchPitch = h.punchYaw = 0;
const hpBefore = victim.hp;
h.input.fire = true;
sim.tick(TICK);
h.input.fire = false;
ok(hpBefore === 100 && !victim.alive, 'scoped AWP body shot kills a full-armor target');
ok(h.zoom === 0 && h.rezoomAt > 0, 'bolt cycle drops the scope');
for (let i = 0; i < 70; i++) sim.tick(TICK);
ok(h.zoom === 2, 'scope returns after the bolt cycle');
ok(h.kills === 1 && victim.deaths === 1, 'kill is credited');

// --- collision fuzz: a body driven by random input never ends up inside geometry
{
  const rng = new RNG(77);
  let bad = 0;
  let minY = 0;
  h.give('knife');
  h.active = 'melee';
  for (let i = 0; i < 60 * 240; i++) {
    if (i % 30 === 0) {
      h.input.moveX = rng.range(-1, 1);
      h.input.moveZ = rng.range(-0.2, 1);
      h.yaw += rng.range(-1.2, 1.2);
      h.input.crouch = rng.chance(0.15);
    }
    h.input.jump = rng.chance(0.03);
    h.hp = 100;
    h.alive = true;
    sim.tick(TICK);
    if (!sim.world.bodyFits(h.pos.x, h.pos.y + 0.002, h.pos.z, h.hw - 0.002, h.height - 0.004)) bad++;
    minY = Math.min(minY, h.pos.y);
    if (h.pos.x < sim.map.minX || h.pos.x > sim.map.maxX || h.pos.z < sim.map.minZ + 3.5 || h.pos.z > sim.map.maxZ) bad++;
  }
  ok(bad === 0 && minY > -0.01, `4 minutes of random movement: ${bad} wall penetrations, lowest y = ${minY.toFixed(3)}`);
  ok(h.height <= STAND_HEIGHT, 'body height stays sane');
}

console.log(failures === 0 ? '\nALL PASS' : `\n${failures} FAILED`);
if (failures) process.exit(1);
