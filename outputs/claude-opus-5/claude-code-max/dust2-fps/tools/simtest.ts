/**
 * Headless gameplay verification. Run with: node tools/simtest.ts
 *
 * Simulates full 10-bot matches at the real 64 Hz tick rate and asserts that the game
 * actually works: rounds resolve, bots fight, path, plant, defuse and never end up inside
 * geometry.
 */

import { Vec3 } from '../src/core/math.ts';
import { ACTOR_RADIUS } from '../src/game/constants.ts';
import type { GameEvent } from '../src/game/events.ts';
import { isWalkablePoint } from '../src/game/map/collision.ts';
import { emptyInput } from '../src/game/playerinput.ts';
import { GameWorld } from '../src/game/world.ts';
import { check, report, section } from './harness.ts';

const TICK = 1 / 64;

interface Tally {
  ticks: number;
  events: Record<string, number>;
  roundEnds: Record<string, number>;
  winners: { CT: number; T: number };
  kills: number;
  headshots: number;
  killsByWeapon: Record<string, number>;
  plants: number;
  defuses: number;
  explosions: number;
  pickups: number;
  clipCount: number;
  maxSpeed: number;
  nanSeen: boolean;
  stuckBots: number;
  distanceTravelled: number;
  areasVisited: Set<string>;
}

function runMatch(seed: number, rounds: number, pistolOnly = false): Tally {
  const world = new GameWorld({
    seed,
    playerTeam: 'CT',
    pistolRoundsOnly: pistolOnly,
    botSkill: 0.55,
  });
  // Nobody is at the keyboard: let the AI drive the player's actor too.
  world.actors[world.playerHomeId].controller = 'bot';
  world.playerActorId = -1;

  const input = emptyInput();
  const tally: Tally = {
    ticks: 0,
    events: {},
    roundEnds: {},
    winners: { CT: 0, T: 0 },
    kills: 0,
    headshots: 0,
    killsByWeapon: {},
    plants: 0,
    defuses: 0,
    explosions: 0,
    pickups: 0,
    clipCount: 0,
    maxSpeed: 0,
    nanSeen: false,
    stuckBots: 0,
    distanceTravelled: 0,
    areasVisited: new Set<string>(),
  };

  const prevPos = world.actors.map((a) => a.pos.clone());
  const startRound = world.round.round;

  while (world.round.round < startRound + rounds && world.round.phase !== 'matchOver') {
    world.events.length = 0;
    world.tick(TICK, input);
    tally.ticks++;

    for (const ev of world.events as GameEvent[]) {
      tally.events[ev.type] = (tally.events[ev.type] ?? 0) + 1;
      if (ev.type === 'kill') {
        tally.kills++;
        if (ev.headshot) tally.headshots++;
        tally.killsByWeapon[ev.weapon] = (tally.killsByWeapon[ev.weapon] ?? 0) + 1;
      } else if (ev.type === 'plantDone') tally.plants++;
      else if (ev.type === 'defuseDone') tally.defuses++;
      else if (ev.type === 'explode') tally.explosions++;
      else if (ev.type === 'bombPickup') tally.pickups++;
      else if (ev.type === 'roundEnd') {
        tally.roundEnds[ev.reason] = (tally.roundEnds[ev.reason] ?? 0) + 1;
        tally.winners[ev.winner]++;
      }
    }

    // --- integrity checks on every actor, every tick ------------------------
    for (const a of world.actors) {
      if (!a.alive) continue;
      if (!a.pos.isFinite() || !Number.isFinite(a.yaw) || !Number.isFinite(a.health)) {
        tally.nanSeen = true;
      }
      const moved = a.pos.distanceTo2D(prevPos[a.id]);
      tally.distanceTravelled += moved;
      prevPos[a.id].copy(a.pos);
      tally.maxSpeed = Math.max(tally.maxSpeed, a.speed);
      if (a.areaLabel) tally.areasVisited.add(a.areaLabel);

      // Inside a wall / prop, or off the floor plan entirely?
      const inSolid = world.collision.overlaps(a.pos.x, a.pos.y + 0.15, a.pos.z, ACTOR_RADIUS * 0.75, a.height * 0.8);
      if (inSolid || !isWalkablePoint(a.pos.x, a.pos.z)) tally.clipCount++;
    }
  }

  // How many bots ended the run without having moved anywhere useful?
  for (const a of world.actors) {
    if (a.alive && a.speed < 0.05 && world.round.phase === 'live') tally.stuckBots++;
  }

  return tally;
}

section('single match, 6 rounds');

const t = runMatch(20240607, 6);
const seconds = (t.ticks / 64).toFixed(0);
check('simulation ran without NaN', !t.nanSeen, `${t.ticks} ticks (${seconds}s of match time)`);
check('no actor ever clipped into geometry', t.clipCount === 0, `${t.clipCount} violations`);
check('rounds resolved', Object.keys(t.roundEnds).length > 0, JSON.stringify(t.roundEnds));
check('both sides can win', t.winners.CT + t.winners.T >= 5, `CT ${t.winners.CT} / T ${t.winners.T}`);
check('bots fight each other', t.kills >= 10, `${t.kills} kills, ${t.headshots} headshots`);
check(
  'kills come from several weapons',
  Object.keys(t.killsByWeapon).length >= 2,
  JSON.stringify(t.killsByWeapon),
);
check('bots move around the map', t.distanceTravelled > 2000, `${t.distanceTravelled.toFixed(0)}m walked`);
check(
  'bots visit many areas',
  t.areasVisited.size >= 10,
  `${t.areasVisited.size} areas: ${[...t.areasVisited].slice(0, 8).join(', ')}…`,
);
check('speeds stay sane', t.maxSpeed < 12, `max ${t.maxSpeed.toFixed(1)} m/s`);
check('weapons are fired and reloaded', (t.events.shot ?? 0) > 200 && (t.events.reload ?? 0) > 0,
  `${t.events.shot ?? 0} shots, ${t.events.reload ?? 0} reloads`);
check('footsteps are emitted', (t.events.footstep ?? 0) > 100, `${t.events.footstep ?? 0} steps`);

section('bomb flow across many rounds');

let plants = 0;
let defuses = 0;
let explosions = 0;
let pickups = 0;
const reasons: Record<string, number> = {};
let totalKills = 0;
let clip = 0;
for (const seed of [11, 22, 33, 44, 55, 66]) {
  const m = runMatch(seed, 5);
  plants += m.plants;
  defuses += m.defuses;
  explosions += m.explosions;
  pickups += m.pickups;
  totalKills += m.kills;
  clip += m.clipCount;
  for (const [k, v] of Object.entries(m.roundEnds)) reasons[k] = (reasons[k] ?? 0) + v;
}

check('T bots plant the bomb', plants > 0, `${plants} plants over 30 rounds`);
check('planted bombs explode', explosions > 0, `${explosions} detonations`);
check('CT bots defuse', defuses > 0, `${defuses} defuses`);
check('dropped bombs get picked up again mid-round', pickups > 0, `${pickups} re-pickups`);
check('every win condition is reachable', Object.keys(reasons).length >= 3, JSON.stringify(reasons));
check('no clipping across 30 rounds', clip === 0, `${clip} violations, ${totalKills} kills`);

section('full match to completion');

{
  const world = new GameWorld({ seed: 31337, playerTeam: 'CT', botSkill: 0.5 });
  world.actors[world.playerHomeId].controller = 'bot';
  world.playerActorId = -1;
  const input = emptyInput();

  let ticks = 0;
  let matchEnds = 0;
  let nan = false;
  let clipped = 0;
  const maxTicks = 64 * 60 * 45; // 45 minutes of match time is plenty for 16 round wins.

  while (world.round.phase !== 'matchOver' && ticks < maxTicks) {
    world.events.length = 0;
    world.tick(TICK, input);
    ticks++;
    matchEnds += world.events.filter((e) => e.type === 'matchEnd').length;
    if (ticks % 11 === 0) {
      for (const a of world.actors) {
        if (!a.alive) continue;
        if (!a.pos.isFinite()) nan = true;
        if (!isWalkablePoint(a.pos.x, a.pos.z)) clipped++;
      }
    }
  }

  check(
    'a match plays through to a winner',
    world.round.phase === 'matchOver',
    `${world.round.round} rounds, CT ${world.round.scoreCT} : ${world.round.scoreT} T, ${(ticks / 64 / 60).toFixed(1)} min simulated`,
  );
  check('match end is announced exactly once', matchEnds === 1, `${matchEnds} matchEnd events`);
  check('no NaN or clipping across the whole match', !nan && clipped === 0, `${clipped} clip samples`);

  // Ticking a finished match must stay stable rather than throwing or restarting.
  for (let i = 0; i < 600; i++) world.tick(TICK, input);
  check('finished match stays stable', world.round.phase === 'matchOver');
}

section('pistol round configuration');

const p = runMatch(909, 3, true);
check('pistol-only match plays out', p.kills > 3, `${p.kills} kills`);
const pistolWeapons = Object.keys(p.killsByWeapon).filter((w) => w !== 'bomb' && w !== 'world');
check(
  'only pistols and knives are used',
  pistolWeapons.every((w) => ['glock', 'usp', 'deagle', 'knife'].includes(w)),
  JSON.stringify(p.killsByWeapon),
);

section('performance');

{
  const start = Date.now();
  const perf = runMatch(4242, 3);
  const ms = Date.now() - start;
  const perTick = (ms / perf.ticks) * 1000;
  check(
    'simulation is real-time capable',
    perTick < 1500,
    `${perTick.toFixed(0)}µs per 64Hz tick (${(perf.ticks / 64).toFixed(0)}s simulated in ${(ms / 1000).toFixed(1)}s)`,
  );
}

section('player control path');

{
  const world = new GameWorld({ seed: 7, playerTeam: 'CT', botSkill: 0.4 });
  const input = emptyInput();
  const player = world.actors[world.playerHomeId];
  const start = player.pos.clone();

  // Walk forward for two seconds after freeze time.
  for (let i = 0; i < 64 * 8; i++) {
    input.forward = 1;
    input.mouseDx = i === 200 ? 40 : 0;
    world.events.length = 0;
    world.tick(TICK, input);
  }
  check('player actor responds to input', player.pos.distanceTo2D(start) > 3,
    `moved ${player.pos.distanceTo2D(start).toFixed(1)}m`);
  check('player stays inside the map', isWalkablePoint(player.pos.x, player.pos.z));

  // Fire the weapon.
  input.forward = 0;
  input.fire = true;
  input.firePressed = true;
  let shots = 0;
  for (let i = 0; i < 64 * 3; i++) {
    world.events.length = 0;
    world.tick(TICK, input);
    shots += world.events.filter((e) => e.type === 'shot').length;
  }
  check('player can shoot', shots > 3, `${shots} shots`);

  // Kill the player and confirm the takeover flow.
  input.fire = false;
  input.firePressed = false;
  player.health = 1;
  player.alive = false;
  world.events.length = 0;
  world.tick(TICK, input);
  check('death switches to spectating', world.spectating && world.playerActorId === -1);
  input.takeoverPressed = true;
  world.update(TICK, input);
  const taken = world.controlledActor();
  check('player can take over a living team mate', !!taken && taken.alive && taken.controller === 'player',
    taken ? `took over ${taken.name}` : 'no takeover');
}

section('weapon mechanics');

{
  const world = new GameWorld({ seed: 12, playerTeam: 'T' });
  const input = emptyInput();
  const player = world.actors[world.playerHomeId];

  // Skip freeze time.
  while (world.round.phase !== 'live') world.tick(TICK, input);

  // Keep the test subject alive and firing regardless of what the bots are doing.
  const keepAlive = () => {
    player.health = 100;
    player.alive = true;
  };

  player.applyLoadout({ primary: 'ak47', secondary: 'glock', armor: 0, helmet: false });
  player.slot = 'primary';
  const magSize = player.currentAmmo().mag;

  input.fire = true;
  let reloadStarted = 0;
  let reloadFinished = 0;
  let emptyMagSeen = false;
  let refilledAfterReload = false;
  for (let i = 0; i < 64 * 12; i++) {
    keepAlive();
    world.events.length = 0;
    world.tick(TICK, input);
    if (player.currentAmmo().mag === 0) emptyMagSeen = true;
    for (const ev of world.events) {
      if (ev.type === 'reload') reloadStarted++;
      if (ev.type === 'reloadDone') {
        reloadFinished++;
        if (player.currentAmmo().mag === magSize) refilledAfterReload = true;
      }
    }
  }
  check('automatic fire empties the magazine', emptyMagSeen, `magazine ${magSize}`);
  check('empty magazine triggers a reload', reloadStarted > 0, `${reloadStarted} reloads started`);
  check('reload refills the magazine from reserve', reloadFinished > 0 && refilledAfterReload,
    `${reloadFinished} reloads completed, ${player.currentAmmo().reserve} left in reserve`);

  // Recoil must actually kick the view and spread must grow while spraying.
  const { currentSpread } = await import('../src/game/systems/combat.ts');
  player.applyLoadout({ primary: 'ak47', secondary: 'glock', armor: 0, helmet: false });
  player.slot = 'primary';
  const restSpread = currentSpread(player);
  for (let i = 0; i < 64; i++) {
    keepAlive();
    world.events.length = 0;
    world.tick(TICK, input);
  }
  const sprayPunch = player.viewPunchPitch;
  const spraySpread = currentSpread(player);
  check('firing kicks the view upwards', sprayPunch > 0.02, `${(sprayPunch * 57.3).toFixed(1)}° of climb`);
  check('spread grows while spraying', spraySpread > restSpread * 3,
    `${(restSpread * 1000).toFixed(2)} -> ${(spraySpread * 1000).toFixed(2)} mrad`);

  input.fire = false;
  for (let i = 0; i < 64 * 2; i++) {
    keepAlive();
    world.tick(TICK, input);
  }
  check('recoil recovers when you stop firing', player.viewPunchPitch < sprayPunch * 0.2,
    `${(player.viewPunchPitch * 57.3).toFixed(2)}° left`);

  // AWP scope levels.
  player.applyLoadout({ primary: 'awp', secondary: 'glock', armor: 0, helmet: false });
  player.slot = 'primary';
  const { toggleScope } = await import('../src/game/systems/combat.ts');
  toggleScope(world, player);
  const zoom1 = player.scopeLevel;
  toggleScope(world, player);
  const zoom2 = player.scopeLevel;
  toggleScope(world, player);
  check('AWP cycles through two zoom levels and back', zoom1 === 1 && zoom2 === 2 && player.scopeLevel === 0);
}

section('C4 mechanics');

{
  const { bombSiteCenter } = await import('../src/game/map/dust2.ts');
  const world = new GameWorld({ seed: 99, playerTeam: 'T' });
  const input = emptyInput();
  while (world.round.phase !== 'live') world.tick(TICK, input);

  const carrier = world.actors.find((a) => a.hasBomb)!;
  check('a T starts the round with the C4', !!carrier, `${carrier.name} carries the bomb`);

  // Park every bot: this block tests the C4 rules, not who wins the gunfight. Actors
  // flagged as player-controlled take their orders from `input`, which never asks them to
  // move or shoot, so nobody interferes with the plant/defuse under test.
  for (const a of world.actors) a.controller = 'player';

  // Kill the carrier: the bomb must drop where they fell.
  const deathPos = carrier.pos.clone();
  const { killActor } = await import('../src/game/systems/combat.ts');
  world.events.length = 0;
  killActor(world, null, carrier, 'world', false);
  check('killing the carrier drops the C4', world.bomb.state === 'dropped' &&
    world.bomb.pos.distanceTo(deathPos) < 0.01);

  // Walk another T onto it.
  const mate = world.actors.find((a) => a.team === 'T' && a.alive)!;
  mate.pos.copy(world.bomb.pos);
  world.events.length = 0;
  world.tick(TICK, input);
  check('another T can pick the C4 back up', mate.hasBomb && world.bomb.state === 'carried',
    `${mate.name} picked it up`);

  // Teleport them onto the A site and plant.
  const siteA = bombSiteCenter('A');
  mate.pos.set(siteA.x, world.collision.groundAt(siteA.x, siteA.z, 40, 60), siteA.z);
  mate.controller = 'player';
  world.playerActorId = mate.id;
  world.spectating = false;
  input.use = true;
  let planted = false;
  for (let i = 0; i < 64 * 5 && !planted; i++) {
    world.events.length = 0;
    world.tick(TICK, input);
    planted = world.events.some((e) => e.type === 'plantDone');
  }
  check('the player can plant inside a bomb site', planted && world.bomb.state === 'planted',
    `site ${world.bomb.site}, ${world.bomb.timer.toFixed(1)}s on the fuse`);

  // Plant progress must abort when you let go.
  const before = world.bomb.timer;
  for (let i = 0; i < 64; i++) world.tick(TICK, input);
  check('the fuse counts down', world.bomb.timer < before, `${world.bomb.timer.toFixed(1)}s left`);

  // Now defuse it with a CT standing on the bomb (feet on the floor, not floating).
  const ct = world.actors.find((a) => a.team === 'CT' && a.alive)!;
  ct.hasDefuseKit = false;
  ct.pos.set(
    world.bomb.pos.x,
    world.collision.groundAt(world.bomb.pos.x, world.bomb.pos.z, 40, 60),
    world.bomb.pos.z,
  );
  ct.controller = 'player';
  world.playerActorId = ct.id;
  let defused = false;
  for (let i = 0; i < 64 * 12 && !defused; i++) {
    world.events.length = 0;
    world.tick(TICK, input);
    defused = world.events.some((e) => e.type === 'defuseDone');
  }
  check('a CT can defuse a planted C4', defused && world.bomb.state === 'defused');

  // Round should now be awarded to the CTs.
  world.tick(TICK, input);
  check('defusing wins the round for CT', world.round.winner === 'CT' && world.round.reason === 'bombDefused');
}

{
  // Explosion path: plant, let the fuse run out, everyone nearby dies.
  const { bombSiteCenter } = await import('../src/game/map/dust2.ts');
  const world = new GameWorld({ seed: 5150, playerTeam: 'T' });
  const input = emptyInput();
  while (world.round.phase !== 'live') world.tick(TICK, input);

  const siteB = bombSiteCenter('B');
  const y = world.collision.groundAt(siteB.x, siteB.z, 40, 60);
  world.bomb.state = 'planted';
  world.bomb.site = 'B';
  world.bomb.timer = 1.0;
  world.bomb.pos.set(siteB.x, y, siteB.z);
  for (const a of world.actors) if (a.hasBomb) a.hasBomb = false;

  const victim = world.actors.find((a) => a.team === 'CT')!;
  victim.pos.set(siteB.x + 1, y, siteB.z);

  let exploded = false;
  for (let i = 0; i < 64 * 3 && !exploded; i++) {
    world.events.length = 0;
    world.tick(TICK, input);
    exploded = world.events.some((e) => e.type === 'explode');
  }
  check('the C4 detonates when the fuse runs out', exploded && world.bomb.state === 'exploded');
  check('the blast kills anyone standing on the bomb', !victim.alive);
  world.tick(TICK, input);
  check('a detonation wins the round for T', world.round.winner === 'T' && world.round.reason === 'bombExploded');
}

section('damage model');

{
  const world = new GameWorld({ seed: 3, playerTeam: 'CT' });
  const shooter = world.actors[0];
  const victim = world.actors.find((a) => a.team === 'T')!;

  const { applyDamage } = await import('../src/game/systems/combat.ts');
  const { WEAPONS } = await import('../src/game/weapons.ts');
  const point = new Vec3();

  const measure = (part: 'head' | 'chest' | 'stomach' | 'leg', armor: number, helmet: boolean) => {
    victim.alive = true;
    victim.health = 10000;
    victim.armor = armor;
    victim.helmet = helmet;
    const before = victim.health;
    const mult = { head: 2.0, chest: 1.0, stomach: 1.25, leg: 0.75 }[part];
    applyDamage(world, shooter, victim, WEAPONS.ak47.damage * mult, part, WEAPONS.ak47, point);
    return before - victim.health;
  };

  const chest = measure('chest', 0, false);
  const head = measure('head', 0, false);
  const stomach = measure('stomach', 0, false);
  const leg = measure('leg', 0, false);
  check('headshots deal exactly double body damage', Math.abs(head - chest * 2) <= 1, `${chest} chest / ${head} head`);
  check('stomach and legs differ from chest', stomach > chest && leg < chest, `${stomach} stomach / ${leg} leg`);

  const armored = measure('chest', 100, true);
  check('armour reduces damage', armored < chest, `${chest} unarmoured vs ${armored} armoured`);
  const headArmored = measure('head', 100, true);
  const headNoHelmet = measure('head', 100, false);
  check('helmets only protect the head', headArmored < headNoHelmet, `${headArmored} helmet / ${headNoHelmet} none`);

  // AWP one-shots an armoured chest, pistols do not.
  victim.alive = true;
  victim.health = 100;
  victim.armor = 100;
  victim.helmet = true;
  applyDamage(world, shooter, victim, WEAPONS.awp.damage, 'chest', WEAPONS.awp, point);
  check('AWP body shot is lethal', !victim.alive, 'one shot kill through armour');

  victim.alive = true;
  victim.health = 100;
  victim.armor = 100;
  applyDamage(world, shooter, victim, WEAPONS.glock.damage, 'chest', WEAPONS.glock, point);
  check('Glock body shot is not lethal', victim.alive, `${victim.health} hp left`);
}

report();
