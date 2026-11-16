import { GameCore } from '../src/game/core/core.ts';
import { buildMap, isWalkablePoint } from '../src/game/core/map.ts';
import { computeDamage, WEAPONS, makeWeapon } from '../src/game/core/weapons.ts';
import { createEntity } from '../src/game/core/entities.ts';
import { moveEntity } from '../src/game/core/physics.ts';
import { initAI, assignAttack } from '../src/game/core/ai.ts';
import { CFG } from '../src/game/core/config.ts';
import { v3 } from '../src/game/core/vecmath.ts';

let failures = 0;
function assert(cond: boolean, msg: string): void {
  if (!cond) { failures++; console.log('  FAIL:', msg); }
  else console.log('  ok:', msg);
}
const DT = 1 / 60;
function step(core: GameCore, seconds: number): void {
  const n = Math.round(seconds / DT);
  for (let i = 0; i < n; i++) { core.update(DT); core.drainEvents(); }
}
function freezeAll(core: GameCore): void {
  for (const e of core.entities) { e.bot = false; e.ai = null; e.vel = v3(); }
}

console.log('== Weapon damage math ==');
const ak = WEAPONS.ak47;
assert(computeDamage(ak, 'chest', 0).hp === 50, 'AK chest unarmored = 50');
assert(computeDamage(ak, 'head', 0).hp === 100, 'AK head = 2x chest = 100');
assert(computeDamage(ak, 'head', 100).hp === 100, 'AK head ignores armor (still 100)');
assert(computeDamage(ak, 'chest', 100).hp < 50, 'AK chest reduced by armor');
const awp = WEAPONS.awp;
assert(computeDamage(awp, 'chest', 100).hp >= 100, 'AWP one-shot chest through armor');
assert(computeDamage(awp, 'leg', 100).hp < 100, 'AWP leg shot not lethal');
const deagle = WEAPONS.deagle;
assert(deagle.damage > WEAPONS.glock.damage && deagle.damage < ak.damage, 'Deagle damage between pistol and rifle');
assert(deagle.mag < ak.mag, 'Deagle small magazine');
assert(WEAPONS.m4a4.rpm > ak.rpm && WEAPONS.m4a4.recoilPitch < ak.recoilPitch, 'M4 faster + less recoil than AK');

console.log('== Physics: walls & door gap ==');
const map = buildMap();
const dummy = createEntity({ name: 'D', team: 'T', isPlayerSlot: false, bot: true, spawn: v3(3, 0, 10), spawnYaw: 0, pistol: true });
// Push north into mid doors panel region away from gap (x=0 -> left panel)
dummy.pos = v3(0, 0, 6);
for (let i = 0; i < 120; i++) moveEntity(map, dummy, { wishX: 0, wishZ: -1, speed: 6, jump: false, dt: DT });
assert(dummy.pos.z > 1.6, 'Blocked by mid door panel (cannot walk through solid wood) z=' + dummy.pos.z.toFixed(2));
// Through the gap at x=3
dummy.pos = v3(3, 0, 6);
for (let i = 0; i < 180; i++) moveEntity(map, dummy, { wishX: 0, wishZ: -1, speed: 6, jump: false, dt: DT });
assert(dummy.pos.z < -2, 'Passed through mid door gap z=' + dummy.pos.z.toFixed(2));
// Outer wall containment: push east from long into the void
dummy.pos = v3(50, 0, 0);
for (let i = 0; i < 200; i++) moveEntity(map, dummy, { wishX: 1, wishZ: 0, speed: 6, jump: false, dt: DT });
assert(dummy.pos.x < 54.5, 'Contained by long east wall x=' + dummy.pos.x.toFixed(2));

console.log('== Deterministic C4 flow ==');
{
  const core = new GameCore(map);
  core.startMatch('CT');
  core.round.phase = 'live';
  freezeAll(core);
  const carrier = core.entities.find((e) => e.bombCarrier)!;
  carrier.pos = v3(40, 0, -38); // A site
  core.beginPlant(carrier);
  assert(carrier.action?.type === 'plant', 'plant action started');
  step(core, CFG.plantTime + 0.2);
  assert(core.bomb.state === 'planted', 'bomb planted');
  assert(core.round.phase === 'planted', 'phase -> planted');
  // defuse
  const ct = core.entities.find((e) => e.team === 'CT' && e.alive && !e.isPlayerSlot)!;
  ct.pos = v3(core.bomb.pos.x + 0.5, 0, core.bomb.pos.z);
  ct.kit = true;
  core.beginDefuse(ct);
  step(core, CFG.defuseTimeKit + 0.3);
  assert(core.bomb.state === 'defused', 'bomb defused');
  assert(core.round.winner === 'CT', 'CT wins by defuse');
}
{
  const core = new GameCore(map);
  core.startMatch('CT');
  core.round.phase = 'live';
  freezeAll(core);
  const carrier = core.entities.find((e) => e.bombCarrier)!;
  carrier.pos = v3(-38, 0, -42); // B site
  core.beginPlant(carrier);
  step(core, CFG.plantTime + 0.2);
  assert(core.bomb.state === 'planted' && core.bomb.site === 'B', 'planted at B');
  // let it explode (move CTs far so they cannot defuse)
  for (const e of core.entities) if (e.team === 'CT') e.pos = v3(7, 0, -46);
  step(core, CFG.bombTimer + 1);
  assert(core.bomb.state === 'exploded', 'bomb exploded');
  assert(core.round.winner === 'T', 'T wins by explosion');
}
{
  const core = new GameCore(map);
  core.startMatch('CT');
  core.round.phase = 'live';
  freezeAll(core);
  const carrier = core.entities.find((e) => e.bombCarrier)!;
  const killer = core.entities.find((e) => e.team === 'CT')!;
  core.kill(killer, carrier, 'm4a4', false);
  assert(core.bomb.state === 'dropped', 'bomb dropped on carrier death');
  const other = core.entities.find((e) => e.team === 'T' && e.alive && !e.bombCarrier)!;
  other.pos = v3(core.bomb.pos.x + 0.3, 0, core.bomb.pos.z);
  core.tryPickupBomb(other);
  assert(core.bomb.state === 'carried' && other.bombCarrier, 'bomb picked up by another T');
}

console.log('== Player input: hold-E plant & defuse ==');
{
  const core = new GameCore(map);
  core.startMatch('T');
  core.round.phase = 'live';
  freezeAll(core);
  const pe = core.playerEntity!;
  for (const e of core.entities) e.bombCarrier = false;
  pe.bombCarrier = true;
  core.bomb.state = 'carried';
  core.bomb.carrierId = pe.id;
  pe.pos = v3(40, 0, -38);
  core.controlledId = pe.id;
  core.spectating = false;
  core.input.use = true;
  step(core, CFG.plantTime + 0.4);
  core.input.use = false;
  assert(core.bomb.state === 'planted', 'player planted by holding E');
}
{
  const core = new GameCore(map);
  core.startMatch('CT');
  core.round.phase = 'live';
  freezeAll(core);
  const carrier = core.entities.find((e) => e.bombCarrier)!;
  carrier.pos = v3(40, 0, -38);
  core.beginPlant(carrier);
  step(core, CFG.plantTime + 0.2);
  const pe = core.playerEntity!;
  pe.pos = v3(core.bomb.pos.x + 0.4, 0, core.bomb.pos.z);
  core.controlledId = pe.id;
  core.input.use = true;
  step(core, CFG.defuseTime + 0.4);
  core.input.use = false;
  assert(core.bomb.state === 'defused', 'player defused by holding E');
  assert(core.round.reason === 'Bomb defused', 'win reason is defuse');
}

console.log('== Player firing: input -> hitscan -> damage -> kill ==');
{
  const core = new GameCore(map);
  core.startMatch('CT');
  core.round.phase = 'live';
  freezeAll(core);
  const pe = core.playerEntity!;
  pe.inv.primary = makeWeapon('m4a4');
  pe.activeSlot = 'primary';
  pe.switchT = 0;
  pe.pos = v3(40, 0, -38);
  pe.yaw = 0; // face -Z
  pe.pitch = 0;
  const enemy = core.entities.find((e) => e.team === 'T')!;
  enemy.pos = v3(40, 0, -43);
  enemy.armor = 0;
  core.controlledId = pe.id;
  core.spectating = false;
  core.input.fire = true;
  step(core, 1.5);
  core.input.fire = false;
  assert(enemy.hp < 100 || !enemy.alive, 'player fire damaged the enemy');
  assert(!enemy.alive, 'player fire killed the enemy');
  assert(core.killfeed.some((k) => k.victim === enemy.name && k.killer === pe.name), 'killfeed recorded the player kill');
  assert(pe.kills >= 1, 'player kill counted');
  assert(pe.inv.primary!.ammo < 30, 'player ammo decremented');
}

console.log('== Pistol round config ==');
{
  const core = new GameCore(map);
  core.startMatch('T');
  assert(core.round.pistol === true, 'round 1 is pistol round');
  for (const e of core.entities) {
    assert(e.inv.primary === null, e.name + ' has no primary in pistol round');
  }
  const t = core.entities.find((e) => e.team === 'T')!;
  const ct = core.entities.find((e) => e.team === 'CT')!;
  assert(t.inv.secondary.id === 'glock', 'T default Glock');
  assert(ct.inv.secondary.id === 'usp', 'CT default USP');
}

console.log('== Full bot-vs-bot matches ==');
function runMatch(seedTeam: 'CT' | 'T', maxSeconds: number): { rounds: number; kills: number; plants: number; defuses: number; explosions: number; winner: string | null; stuck: number; nan: number; oob: number } {
  const core = new GameCore(map);
  core.startMatch(seedTeam);
  // Make the human slot AI-driven too, preserving the varied attack routes that
  // startMatch assigned to the bots (mirrors real gameplay, not an all-long rush).
  for (const e of core.entities) {
    if (!e.ai) {
      initAI(e, 0, core.time);
      if (e.team === 'T') assignAttack(e, 'A', 'midShort');
    }
    e.bot = true;
  }
  core.controlledId = -1;
  core.spectating = false;
  let kills = 0, plants = 0, defuses = 0, explosions = 0;
  let roundsSeen = core.round.number;
  let stuck = 0, nan = 0, oob = 0;
  // Track continuous immobilization while a bot wants to move (real wall-stuck),
  // ignoring brief chokepoint congestion.
  const anchor = new Map<number, { x: number; z: number; t: number }>();
  const steps = Math.round(maxSeconds / DT);
  for (let i = 0; i < steps; i++) {
    core.update(DT);
    for (const ev of core.drainEvents()) {
      if (ev.type === 'hit' && ev.killed) kills++;
      else if (ev.type === 'plant') plants++;
      else if (ev.type === 'defuse') defuses++;
      else if (ev.type === 'explosion') explosions++;
    }
    if (core.round.number !== roundsSeen) { roundsSeen = core.round.number; anchor.clear(); }
    if (i % 15 === 0) {
      for (const e of core.entities) {
        if (!Number.isFinite(e.pos.x) || !Number.isFinite(e.pos.y) || !Number.isFinite(e.pos.z)) nan++;
        if (e.pos.x < map.bounds.x1 - 2 || e.pos.x > map.bounds.x2 + 2 || e.pos.z < map.bounds.z1 - 2 || e.pos.z > map.bounds.z2 + 2) oob++;
        if (e.alive && e.bot && e.ai) {
          const wantsMove = e.ai.state === 'advance' || e.ai.state === 'rotate' || e.ai.state === 'retrieve' || e.ai.state === 'hunt';
          const a = anchor.get(e.id);
          if (!a) { anchor.set(e.id, { x: e.pos.x, z: e.pos.z, t: core.time }); continue; }
          const moved = Math.hypot(e.pos.x - a.x, e.pos.z - a.z);
          if (!wantsMove || moved > 1.0) {
            anchor.set(e.id, { x: e.pos.x, z: e.pos.z, t: core.time });
          } else if (core.time - a.t > 8) {
            // Distinguish genuine solo wall/path-stuck from transient crowd congestion.
            const crowded = core.entities.some((o) => o.id !== e.id && o.alive && Math.hypot(o.pos.x - e.pos.x, o.pos.z - e.pos.z) < 2.5);
            if (!crowded) {
              stuck++;
              if (process.env.STUCK_DEBUG) {
                console.log(`    WALL-STUCK ${e.name}(${e.team}) state=${e.ai.state} pos=(${e.pos.x.toFixed(1)},${e.pos.z.toFixed(1)}) goal=${e.ai.goal ? `(${e.ai.goal.x.toFixed(1)},${e.ai.goal.z.toFixed(1)})` : 'null'} pathLen=${e.ai.path.length} idx=${e.ai.pathIdx}`);
              }
            }
            anchor.set(e.id, { x: e.pos.x, z: e.pos.z, t: core.time });
          }
        }
      }
    }
    if (core.matchWinner) break;
  }
  return { rounds: roundsSeen, kills, plants, defuses, explosions, winner: core.matchWinner, stuck, nan, oob };
}

let totKills = 0, totPlants = 0, totDefuses = 0, totExplosions = 0, totRounds = 0, totStuck = 0, totNan = 0, totOob = 0;
for (let m = 0; m < 4; m++) {
  const r = runMatch(m % 2 === 0 ? 'CT' : 'T', 240);
  console.log(`  match ${m + 1}: rounds=${r.rounds} kills=${r.kills} plants=${r.plants} defuses=${r.defuses} explosions=${r.explosions} winner=${r.winner ?? '—'} stuck=${r.stuck} nan=${r.nan} oob=${r.oob}`);
  totKills += r.kills; totPlants += r.plants; totDefuses += r.defuses; totExplosions += r.explosions; totRounds += r.rounds; totStuck += r.stuck; totNan += r.nan; totOob += r.oob;
}
assert(totRounds >= 4, 'multiple rounds simulated (' + totRounds + ')');
assert(totKills > 0, 'AI combat produced kills (' + totKills + ')');
assert(totPlants > 0, 'AI planted the C4 (' + totPlants + ')');
assert(totDefuses + totExplosions > 0, 'C4 resolved by defuse/explosion (' + (totDefuses + totExplosions) + ')');
assert(totNan === 0, 'no NaN positions');
assert(totOob === 0, 'no entities escaped the map bounds');
assert(totStuck === 0, 'no bot solo-stuck on walls >8s (samples=' + totStuck + ')');

console.log('');
if (failures === 0) console.log('ALL CORE TESTS PASSED');
else console.log(failures + ' TEST(S) FAILED');
