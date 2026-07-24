/**
 * Targeted checks for game rules that the random soak test may not reach.
 *   node --experimental-strip-types tools/unit.ts
 */
import { Rng, dirToYaw, dist2D } from '../src/core/math.ts';
import { EventBus } from '../src/core/events.ts';
import { createActor, giveWeapon, switchSlot, startReload, finishReload, activeDef } from '../src/game/actor.ts';
import type { Actor } from '../src/game/actor.ts';
import { applyDamage, computeDamage, traceBullet, tryFire } from '../src/game/combat.ts';
import { stepActor } from '../src/game/physics.ts';
import type { CombatCtx } from '../src/game/combat.ts';
import { HITBOX_MULT, WEAPONS } from '../src/game/weapons.ts';
import type { WeaponId } from '../src/game/weapons.ts';
import { raycastActor } from '../src/game/hitbox.ts';
import { createDust2World } from '../src/map/dust2.ts';
import { GameEngine, TICK_DT } from '../src/game/engine.ts';

let passed = 0;
const failures: string[] = [];

function check(name: string, cond: boolean, detail = ''): void {
  if (cond) {
    passed++;
    console.log(`  ok   ${name}${detail ? ` — ${detail}` : ''}`);
  } else {
    failures.push(name);
    console.log(`  FAIL ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

function near(a: number, b: number, eps = 1e-6): boolean {
  return Math.abs(a - b) <= eps;
}

// ---------------------------------------------------------------- damage model
console.log('\n[damage model]');
{
  const victim = createActor('V', 'T', true);
  for (const id of ['ak47', 'm4a4', 'awp', 'glock', 'usp', 'deagle'] as WeaponId[]) {
    const def = WEAPONS[id];
    const head = computeDamage(def, 'head', 1, victim);
    const chest = computeDamage(def, 'chest', 1, victim);
    check(`${def.name}: headshot is exactly 2x a chest hit`, near(head, chest * 2, 1e-9), `${chest} -> ${head}`);
  }
  const def = WEAPONS.ak47;
  const stomach = computeDamage(def, 'stomach', 1, victim);
  const leg = computeDamage(def, 'leg', 1, victim);
  const arm = computeDamage(def, 'arm', 1, victim);
  check('stomach > chest > arm > leg', stomach > def.damage && def.damage > arm && arm > leg, `${stomach}/${def.damage}/${arm}/${leg}`);
  check('AK headshot one-taps an unarmoured player', computeDamage(def, 'head', 1, victim) >= 100);
  check('AWP body shot is lethal', computeDamage(WEAPONS.awp, 'chest', 1, victim) >= 100);
  check('falloff reduces damage at range', computeDamage(def, 'chest', 85, victim) < def.damage);
  check('hitbox multipliers match the spec', HITBOX_MULT.head === 2 && HITBOX_MULT.stomach === 1.25);
}

// ------------------------------------------------------------------ armour
console.log('\n[armour]');
{
  const world = createDust2World();
  const bus = new EventBus();
  const rng = new Rng(7);
  const attacker = createActor('A', 'CT', true);
  giveWeapon(attacker, 'ak47');
  switchSlot(attacker, 'primary', 0);
  const ctx: CombatCtx = {
    world,
    actors: [],
    rng,
    bus,
    time: 0,
    viewActorId: -1,
    onKill: () => {},
  };

  const naked = createActor('N', 'T', true);
  const armored = createActor('K', 'T', true);
  armored.armor = 100;
  applyDamage(ctx, naked, attacker, 50, 'chest', naked.pos, 'ak47');
  applyDamage(ctx, armored, attacker, 50, 'chest', armored.pos, 'ak47');
  check('armour reduces incoming damage', armored.health > naked.health, `${armored.health} vs ${naked.health}`);
  check('armour value is consumed', armored.armor < 100, `armor=${armored.armor.toFixed(1)}`);

  const noHelmet = createActor('H0', 'T', true);
  noHelmet.armor = 100;
  const helmet = createActor('H1', 'T', true);
  helmet.armor = 100;
  helmet.helmet = true;
  applyDamage(ctx, noHelmet, attacker, 60, 'head', noHelmet.pos, 'ak47');
  applyDamage(ctx, helmet, attacker, 60, 'head', helmet.pos, 'ak47');
  check('helmet matters for headshots', helmet.health > noHelmet.health, `${helmet.health} vs ${noHelmet.health}`);

  const dead = createActor('D', 'T', true);
  applyDamage(ctx, dead, attacker, 500, 'chest', dead.pos, 'ak47');
  check('lethal damage kills and increments deaths', !dead.alive && dead.deaths === 1);
}

// ----------------------------------------------------------------- hitboxes
console.log('\n[hitboxes]');
{
  const target = createActor('T', 'T', true);
  target.pos = { x: 0, y: 0, z: 0 };
  target.yaw = 0;
  const from = (y: number) => ({ x: 0, y, z: 6 });
  const dir = { x: 0, y: 0, z: -1 };
  const at = (y: number) => raycastActor(from(y), dir, 20, target.pos, target.yaw, 1)?.group ?? null;
  check('head hitbox at 1.68m', at(1.68) === 'head', String(at(1.68)));
  check('chest hitbox at 1.33m', at(1.33) === 'chest', String(at(1.33)));
  check('stomach hitbox at 1.0m', at(1.0) === 'stomach', String(at(1.0)));
  check('leg hitbox at 0.4m', at(0.4) === 'leg', String(at(0.4)));
  check('miss above the head', at(2.3) === null);
  const crouched = raycastActor(from(1.68), dir, 20, target.pos, target.yaw, 0.72);
  check('crouching lowers the head hitbox', crouched === null || crouched.group !== 'head');
}

// ------------------------------------------------------------- line of sight
console.log('\n[line of sight]');
{
  const world = createDust2World();
  const eye = (x: number, z: number) => ({ x, y: world.grid.floorAt(x, z) + 1.6, z });
  check('mid corridor is visible along its length', world.losClear(eye(4, 20), eye(4, 12)));
  check('CT spawn cannot see T spawn', !world.losClear(eye(-7, -43), eye(19, 39)));
  check('long doors block sight into A site', !world.losClear(eye(44, 28), eye(38, -33)));
  check('mid doors gap is see-through', world.losClear(eye(4, 12), eye(4, 4)));
  check('a wall next to the mid door blocks sight', !world.losClear(eye(1, 12), eye(1, 4)));
  check('bomb sites are self-visible', world.losClear(eye(38, -33), eye(44, -33)));
}

// -------------------------------------------------------------- weapon feel
console.log('\n[weapon handling]');
{
  const world = createDust2World();
  const bus = new EventBus();
  const shooter = createActor('S', 'CT', true);
  shooter.pos = { x: 4, y: 0, z: 20 };
  giveWeapon(shooter, 'ak47');
  switchSlot(shooter, 'primary', 0);
  shooter.deployEndTime = 0;
  const ctx: CombatCtx = { world, actors: [shooter], rng: new Rng(3), bus, time: 1, viewActorId: -1, onKill: () => {} };

  const mag0 = shooter.weapons.primary!.mag;
  tryFire(ctx, shooter, true, true);
  check('firing consumes a round', shooter.weapons.primary!.mag === mag0 - 1);
  check('firing kicks the view up', shooter.punchPitch < 0, `punch=${shooter.punchPitch.toFixed(4)}`);
  check('firing blooms the cone', shooter.spread > 0, `spread=${shooter.spread.toFixed(4)}`);

  ctx.time = 1.0001;
  const before = shooter.weapons.primary!.mag;
  tryFire(ctx, shooter, true, true);
  check('rate of fire is respected', shooter.weapons.primary!.mag === before);

  // AK vs M4: same trigger time, AK must kick harder.
  const mk = (id: WeaponId): Actor => {
    const a = createActor(id, 'CT', true);
    a.pos = { x: 4, y: 0, z: 20 };
    giveWeapon(a, id);
    switchSlot(a, 'primary', 0);
    a.deployEndTime = 0;
    return a;
  };
  const ak = mk('ak47');
  const m4 = mk('m4a4');
  const c2: CombatCtx = { world, actors: [], rng: new Rng(11), bus, time: 5, viewActorId: -1, onKill: () => {} };
  tryFire({ ...c2, actors: [ak] }, ak, true, true);
  tryFire({ ...c2, actors: [m4] }, m4, true, true);
  check('AK-47 recoil > M4A4 recoil', Math.abs(ak.punchPitch) > Math.abs(m4.punchPitch), `${ak.punchPitch.toFixed(4)} vs ${m4.punchPitch.toFixed(4)}`);
  check('M4A4 fires faster than the AK', WEAPONS.m4a4.rpm > WEAPONS.ak47.rpm);
  check('AK-47 hits harder than the M4A4', WEAPONS.ak47.damage > WEAPONS.m4a4.damage);
  check('AWP has the slowest fire rate', WEAPONS.awp.rpm < WEAPONS.deagle.rpm && WEAPONS.deagle.rpm < WEAPONS.usp.rpm);
  check('AWP has a scope', !!WEAPONS.awp.scope && WEAPONS.awp.scope!.fov < 40);
  check('Deagle sits between pistols and rifles', WEAPONS.deagle.damage > WEAPONS.usp.damage && WEAPONS.deagle.damage > WEAPONS.glock.damage && WEAPONS.deagle.damage < WEAPONS.awp.damage);
  check('Deagle magazine is small', WEAPONS.deagle.magSize < WEAPONS.glock.magSize && WEAPONS.deagle.magSize < WEAPONS.usp.magSize);
  check('Glock is the T default, USP the CT default', WEAPONS.glock.teamDefault === 'T' && WEAPONS.usp.teamDefault === 'CT');

  // Reload restores the magazine from reserve.
  const r = mk('ak47');
  r.weapons.primary!.mag = 3;
  startReload(r, 10);
  finishReload(r);
  check('reload refills the magazine from reserve', r.weapons.primary!.mag === 30 && r.weapons.primary!.reserve === 63, `${r.weapons.primary!.mag}/${r.weapons.primary!.reserve}`);

  // Bullets stop at walls.
  const blocked = traceBullet(ctx, shooter, { x: 4, y: 1.6, z: 20 }, { x: -1, y: 0, z: 0 }, 60);
  check('bullets stop at the mid corridor wall', blocked.dist < 6, `dist=${blocked.dist.toFixed(2)}`);
}

// ------------------------------------------------------------------ movement
console.log('\n[movement and collision]');
{
  const world = createDust2World();
  const run = (
    a: Actor,
    intent: Partial<{ forward: number; strafe: number; jump: boolean; crouch: boolean; walk: boolean }>,
    seconds: number,
  ) => {
    const full = { forward: 0, strafe: 0, jump: false, crouch: false, walk: false, ...intent };
    for (let i = 0; i < Math.round(seconds * 64); i++) stepActor(a, full, world, 1 / 64, i / 64);
  };
  const spawn = (x: number, z: number, yaw: number): Actor => {
    const a = createActor('M', 'CT', true);
    a.pos = { x, y: world.grid.floorAt(x, z), z };
    a.yaw = yaw;
    giveWeapon(a, 'ak47');
    switchSlot(a, 'primary', 0);
    a.deployEndTime = 0;
    return a;
  };
  const YAW_WEST = dirToYaw(-1, 0);
  const YAW_EAST = dirToYaw(1, 0);

  // Walls stop you.
  const wallRunner = spawn(4, 20, YAW_WEST);
  run(wallRunner, { forward: 1 }, 3);
  check('running into a wall does not clip through it', wallRunner.pos.x > 0 && !world.grid.isSolidAt(wallRunner.pos.x, wallRunner.pos.z), `x=${wallRunner.pos.x.toFixed(2)}`);

  // Free running covers ground at a sane speed.
  const sprinter = spawn(4, 20, dirToYaw(0, -1));
  const startZ = sprinter.pos.z;
  run(sprinter, { forward: 1 }, 2);
  const travelled = Math.abs(sprinter.pos.z - startZ);
  check('run speed is roughly 5 m/s', travelled > 8 && travelled < 12, `${travelled.toFixed(1)}m in 2s`);

  // Walking up the A-site ramp gains elevation.
  const climber = spawn(22, -42, YAW_EAST);
  run(climber, { forward: 1 }, 4);
  check('the A ramp lifts the player onto the site', climber.pos.y > 1.0, `y=${climber.pos.y.toFixed(2)} x=${climber.pos.x.toFixed(1)}`);

  // A 1.3 m crate blocks a walk but yields to a crouch-jump.
  const blocked = spawn(5.4, -11.5, dirToYaw(0, -1));
  run(blocked, { forward: 1 }, 2.5);
  check('a tall crate blocks walking', blocked.pos.y < 0.3, `y=${blocked.pos.y.toFixed(2)}`);

  const hopper = spawn(5.4, -11.6, dirToYaw(0, -1));
  for (let i = 0; i < 64 * 3; i++) {
    const t = i / 64;
    const jump = hopper.grounded && t > 0.35;
    stepActor(hopper, { forward: 1, strafe: 0, jump, crouch: !hopper.grounded, walk: false }, world, 1 / 64, t);
    if (hopper.pos.y > 1.2 && hopper.grounded) break;
  }
  check('crouch-jumping gets you on top of the crate', hopper.pos.y > 1.2, `y=${hopper.pos.y.toFixed(2)}`);

  // Being wedged inside a crate must resolve itself, not trap the actor
  // forever (regression: a bot walked off a crate edge and froze in place).
  const wedged = spawn(42.2, 0, dirToYaw(0, 1)); // centre of long_crate_2
  wedged.pos.y = 0;
  const startedInside = !world.circleFree(wedged.pos.x, wedged.pos.z, wedged.pos.y, 0.38);
  run(wedged, { forward: 1 }, 1.5);
  const freed = world.circleFree(wedged.pos.x, wedged.pos.z, wedged.pos.y, 0.38);
  check('an actor stuck inside a crate pushes itself out', startedInside && freed, `now (${wedged.pos.x.toFixed(1)}, ${wedged.pos.z.toFixed(1)})`);

  // Same for a body wedged into a wall.
  const inWall = spawn(4, 20, 0);
  inWall.pos.x = 0.2; // inside the mid corridor's west wall
  run(inWall, { forward: 0 }, 1.5);
  check('an actor pushed into a wall is ejected', world.circleFree(inWall.pos.x, inWall.pos.z, inWall.pos.y, 0.38), `x=${inWall.pos.x.toFixed(2)}`);

  // Gravity brings you back down.
  const faller = spawn(4, 20, 0);
  faller.pos.y = 6;
  faller.grounded = false;
  run(faller, {}, 3);
  check('gravity returns the player to the floor', Math.abs(faller.pos.y) < 0.05 && faller.grounded, `y=${faller.pos.y.toFixed(3)}`);
}

// ------------------------------------------------- rounds, economy and bomb
console.log('\n[round rules]');
{
  const engine = new GameEngine({ seed: 99, playerTeam: 'CT' });
  for (const a of engine.actors) a.isBot = true;
  engine.bus.on('roundStart', () => {
    for (const a of engine.actors) a.isBot = true;
  });

  check('10 actors, 5 per side', engine.actors.length === 10 && engine.aliveCount('CT') === 5 && engine.aliveCount('T') === 5);
  check('round 1 is a pistol round', engine.isPistolRound);
  const pistolOk = engine.actors.every(
    (a) => !a.weapons.primary && a.weapons.secondary && a.weapons.melee && a.armor === 0,
  );
  check('pistol round: pistol + knife only, no armour', pistolOk);
  const sides = engine.actors.every((a) => a.weapons.secondary!.id === (a.team === 'T' ? 'glock' : 'usp'));
  check('pistol round gives each side its default sidearm', sides);
  const carrier = engine.actors.filter((a) => a.hasBomb);
  check('exactly one T carries the C4', carrier.length === 1 && carrier[0].team === 'T');

  // Spawns must be inside the map and standable.
  const spawnsOk = engine.actors.every((a) => !engine.world.grid.isSolidAt(a.pos.x, a.pos.z));
  check('everyone spawns on walkable ground', spawnsOk);

  // Force a round win for T to check the economy and the round counter.
  const round0 = engine.roundNumber;
  for (const a of engine.actors.filter((x) => x.team === 'CT')) {
    a.alive = false;
    a.health = 0;
  }
  engine.phase = 'live';
  engine.step(TICK_DT);
  check('killing every CT ends the round for T', engine.scoreT === 1, `scoreT=${engine.scoreT}`);
  const moneyOk = engine.actors.filter((a) => a.team === 'T').every((a) => a.money > 800);
  check('round win pays the winners', moneyOk);
  for (let i = 0; i < 6 * 64 + 10; i++) engine.step(TICK_DT);
  check('a new round starts after the interval', engine.roundNumber === round0 + 1 && engine.aliveCount('CT') === 5);
  check('round 2 is a buy round (bots hold rifles)', engine.actors.some((a) => a.weapons.primary));
}

// ------------------------------------------------------- forced bomb explosion
console.log('\n[bomb: plant, drop, defuse, explode]');
{
  const engine = new GameEngine({ seed: 5, playerTeam: 'CT' });
  for (const a of engine.actors) a.isBot = true;
  // Skip freeze time.
  engine.phase = 'live';
  engine.phaseTimer = 115;

  const carrier = engine.actors.find((a) => a.hasBomb)!;
  const site = engine.world.bombsites.A;
  carrier.pos = { x: (site.x1 + site.x2) / 2, y: 1.2, z: (site.z1 + site.z2) / 2 };

  // Drop test: kill the carrier, another T must be able to pick it up.
  const victimPos = { ...carrier.pos };
  carrier.health = 0;
  carrier.alive = false;
  (engine as unknown as { onKill: (v: unknown, a: unknown, w: string, h: boolean) => void }).onKill(carrier, null, 'ak47', false);
  check('bomb drops when the carrier dies', engine.bomb.phase === 'dropped' && !carrier.hasBomb);
  const mate = engine.actors.find((a) => a.team === 'T' && a.alive)!;
  mate.pos = { ...victimPos };
  engine.step(TICK_DT);
  check('another T picks the bomb back up', mate.hasBomb && engine.bomb.phase === 'carried');

  // Plant it by holding "use" as the bot would.
  mate.pos = { x: (site.x1 + site.x2) / 2, y: 1.2, z: (site.z1 + site.z2) / 2 };
  const flags = (engine as unknown as { botUseFlags: Map<number, boolean> }).botUseFlags;
  for (let i = 0; i < 64 * 5; i++) {
    flags.set(mate.id, true);
    mate.vel.x = 0;
    mate.vel.z = 0;
    engine.step(TICK_DT);
    if (engine.bomb.phase === 'planted') break;
  }
  check('C4 can be planted inside bomb site A', engine.bomb.phase === 'planted' && engine.bomb.site === 'A');
  check('planting starts the fuse', engine.bomb.fuse > 0 && engine.bomb.fuse <= 40);

  // Park every CT far away so nobody defuses, then run the fuse out.
  const ctPos = { x: -7, y: 0, z: -43 };
  let ticks = 0;
  while (engine.bomb.phase === 'planted' && ticks < 64 * 60) {
    for (const a of engine.actors) {
      if (a.team === 'CT') {
        a.pos.x = ctPos.x;
        a.pos.z = ctPos.z;
        a.health = 100;
        a.alive = true;
      }
    }
    engine.step(TICK_DT);
    ticks++;
  }
  check('the C4 explodes when the fuse expires', engine.bomb.phase === 'exploded', `after ${(ticks / 64).toFixed(1)}s`);
  check('explosion wins the round for T', engine.roundWinner === 'T' && engine.roundEndReason === 'bomb_exploded');
}

// ----------------------------------------------------------- defuse + takeover
console.log('\n[defuse and player takeover]');
{
  const engine = new GameEngine({ seed: 21, playerTeam: 'CT' });
  for (const a of engine.actors) if (a.isBot) a.isBot = true;
  engine.phase = 'live';
  engine.phaseTimer = 115;
  const site = engine.world.bombsites.B;
  const centre = { x: (site.x1 + site.x2) / 2, y: 0.5, z: (site.z1 + site.z2) / 2 };
  const carrier = engine.actors.find((a) => a.hasBomb)!;
  carrier.pos = { ...centre };
  const flags = (engine as unknown as { botUseFlags: Map<number, boolean> }).botUseFlags;
  carrier.isBot = true;
  for (let i = 0; i < 64 * 6 && engine.bomb.phase !== 'planted'; i++) {
    flags.set(carrier.id, true);
    carrier.vel.x = 0;
    carrier.vel.z = 0;
    engine.step(TICK_DT);
  }
  check('C4 plants inside bomb site B', engine.bomb.phase === 'planted' && engine.bomb.site === 'B');

  // A CT with a kit stands on it and holds E.
  const player = engine.localActor!;
  player.hasKit = true;
  player.pos = { x: engine.bomb.pos.x, y: engine.bomb.pos.y, z: engine.bomb.pos.z };
  engine.input.use = true;
  let t = 0;
  while (engine.bomb.phase === 'planted' && t < 64 * 12) {
    player.pos.x = engine.bomb.pos.x;
    player.pos.z = engine.bomb.pos.z;
    engine.input.use = true;
    engine.step(TICK_DT);
    t++;
  }
  check('a CT with a defuse kit defuses in ~5s', engine.bomb.phase === 'defused', `${(t / 64).toFixed(1)}s`);
  check('defusing wins the round for CT', engine.roundWinner === 'CT' && engine.roundEndReason === 'bomb_defused');

  // Death -> spectate -> take over a team-mate.
  const me = engine.localActor!;
  me.alive = false;
  me.health = 0;
  me.deathTime = engine.time;
  engine.spectateNext();
  const spectated = engine.viewActor!;
  check('spectator view moves to a living team-mate', spectated.id !== me.id && spectated.alive && spectated.team === me.team);
  check('no controlled actor while dead', engine.controlledActor() === null);
  engine.takeControl();
  check('taking over a bot makes it player-controlled', engine.localActorId === spectated.id && !spectated.isBot && spectated.isLocal);
  check('the taken-over bot is now controllable', engine.controlledActor()?.id === spectated.id);
  check('the name is tagged with (YOU)', engine.controlledActor()!.name.includes('YOU'));
}

// ------------------------------------------------------------- pistol-only mode
console.log('\n[pistol-only match option]');
{
  const engine = new GameEngine({ seed: 4, pistolOnly: true });
  for (let r = 0; r < 3; r++) {
    engine.roundNumber = r + 2;
    engine.startRound();
    check(`round ${r + 2} stays a pistol round`, engine.isPistolRound && engine.actors.every((a) => !a.weapons.primary));
  }
  const me = engine.localActor!;
  me.money = 16000;
  const boughtRifle = engine.buy('ak47');
  check('rifles cannot be bought during a pistol round', !boughtRifle && !me.weapons.primary);
  const boughtDeagle = engine.buy('deagle');
  check('pistols can still be bought during a pistol round', boughtDeagle && me.weapons.secondary?.id === 'deagle');
  const boughtArmor = engine.buy('kevlar_helmet');
  check('armour can be bought during a pistol round', boughtArmor && me.armor === 100 && me.helmet);
}

console.log('\n[buy menu]');
{
  const engine = new GameEngine({ seed: 8, playerTeam: 'CT' });
  engine.roundNumber = 3;
  engine.startRound();
  const me = engine.localActor!;
  me.money = 1000;
  check('cannot buy what you cannot afford', !engine.buy('awp'));
  me.money = 5000;
  check('buying an AWP works during freeze time', engine.buy('awp') && me.weapons.primary?.id === 'awp');
  check('buying deducts the price', me.money === 5000 - WEAPONS.awp.price, `$${me.money}`);
  engine.phase = 'live';
  check('buying is blocked once the round is live', !engine.buy('ak47'));
}

console.log(`\n${passed} checks passed, ${failures.length} failed`);
if (failures.length) {
  console.log(`FAILED: ${failures.join(', ')}`);
  process.exit(1);
}
console.log('UNIT OK');
