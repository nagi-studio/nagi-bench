// Deterministic checks of the round rules & C4 flow required by the spec.
import { GameSim } from '../src/game/simulation';
import { emptyInput } from '../src/game/types';
import type { PlayerInput, Team } from '../src/game/types';
import { v3 } from '../src/game/math';

let failures = 0;
const check = (name: string, ok: boolean, extra = ''): void => {
  if (!ok) {
    failures++;
    console.error(`  FAIL  ${name} ${extra}`);
  } else {
    console.log(`  ok    ${name}`);
  }
};
const dt = 1 / 60;
const run = (sim: GameSim, seconds: number, input: PlayerInput = emptyInput()): void => {
  for (let i = 0; i < Math.ceil(seconds / dt); i++) sim.update(dt, input);
};
const input = (patch: Partial<PlayerInput>): PlayerInput => ({ ...emptyInput(), ...patch });
const park = (sim: GameSim, team: Team, x: number, z: number, yaw: number): void => {
  for (const c of sim.combatants) {
    if (c.team !== team) continue;
    c.pos = v3(x + (c.id % 5) * 0.01, 0, z);
    c.yaw = yaw;
    c.vel = v3();
    if (c.bot) {
      c.bot.goal = null;
      c.bot.path = [];
    }
  }
};

console.log('== pistol round ==');
{
  const sim = new GameSim({ seed: 5, playerTeam: 'CT' });
  check('round 1 is pistol', sim.pistol);
  check('no primaries', sim.combatants.every((c) => c.primary === null));
  check('no armor', sim.combatants.every((c) => c.armor === 0));
  check('CT default USP', sim.combatants.filter((c) => c.team === 'CT').every((c) => c.secondary === 'usp'));
  check('T default Glock', sim.combatants.filter((c) => c.team === 'T').every((c) => c.secondary === 'glock'));
  check('bomb with a T', sim.bomb.state === 'carried' && sim.byId(sim.bomb.carrier)?.team === 'T');
  check('buy blocked in pistol round', !sim.buy('ak47'));
  // finish round 1 by time -> round 2 is a buy round
  run(sim, 3.2); // freeze
  sim.liveT = 0.01;
  run(sim, 0.1);
  check('time expiry without plant = CT win', sim.roundEndWinner === 'CT' && sim.roundEndReason === 'time');
  run(sim, 5.2); // round end -> round 2
  check('round 2 not pistol', !sim.pistol && sim.round === 2);
  check('buy round has armor 100', sim.combatants.every((c) => c.armor === 100));
  check('buy round has primaries', sim.combatants.every((c) => c.primary !== null));
  check('buy works', sim.buy('awp') && sim.player.primary === 'awp');
}

console.log('== plant / defuse / explosion ==');
{
  // T player plants at A
  const sim = new GameSim({ seed: 9, playerTeam: 'T' });
  run(sim, 3.2);
  const p = sim.player;
  for (const c of sim.combatants) c.hasBomb = false;
  p.hasBomb = true;
  sim.bomb.state = 'carried';
  sim.bomb.carrier = p.id;
  p.pos = v3(40, 0, -30);
  park(sim, 'CT', -40, -35, 0); // CTs far away at B
  run(sim, 4, input({ use: true }));
  check('plant completes in ~3.2s', sim.bomb.state === 'planted', sim.bomb.state);
  check('planter lost the bomb', !p.hasBomb);
  check('bomb timer ~40', sim.bomb.timer > 35 && sim.bomb.timer <= 40);

  // CT player defuses (all Ts dead -> still must defuse)
  const sim2 = new GameSim({ seed: 9, playerTeam: 'CT' });
  run(sim2, 3.2);
  const ct = sim2.player;
  ct.pos = v3(40, 0, -30);
  for (const c of sim2.combatants) {
    if (c.team === 'T') {
      c.alive = false;
      c.hp = 0;
    }
  }
  sim2.bomb.state = 'planted';
  sim2.bomb.pos = v3(41, 0, -30);
  sim2.bomb.timer = 40;
  run(sim2, 11, input({ use: true }));
  check('defuse completes in ~10s', sim2.bomb.state === 'defused', sim2.bomb.state);
  check('defuse = CT win', sim2.roundEndWinner === 'CT' && sim2.roundEndReason === 'defuse');

  // explosion = T win even if all Ts dead
  const sim3 = new GameSim({ seed: 9, playerTeam: 'CT' });
  run(sim3, 3.2);
  for (const c of sim3.combatants) {
    if (c.team === 'T') {
      c.alive = false;
      c.hp = 0;
    }
    c.pos = v3(0, 0, -55); // everyone far from blast
  }
  sim3.bomb.state = 'planted';
  sim3.bomb.pos = v3(40, 0, -30);
  sim3.bomb.timer = 0.05;
  run(sim3, 0.2);
  check('explosion happens', sim3.bomb.state === 'exploded');
  check('explosion = T win', sim3.roundEndWinner === 'T' && sim3.roundEndReason === 'explosion');

  // T wipe without plant = CT win; CT wipe = T win
  const sim4 = new GameSim({ seed: 9, playerTeam: 'CT' });
  run(sim4, 3.2);
  for (const c of sim4.combatants) if (c.team === 'T') { c.alive = false; c.hp = 0; }
  run(sim4, 0.1);
  check('T wipe without plant = CT win', sim4.roundEndWinner === 'CT' && sim4.roundEndReason === 'elimination');
  const sim5 = new GameSim({ seed: 9, playerTeam: 'CT' });
  run(sim5, 3.2);
  for (const c of sim5.combatants) if (c.team === 'CT') { c.alive = false; c.hp = 0; }
  run(sim5, 0.1);
  check('CT wipe = T win', sim5.roundEndWinner === 'T' && sim5.roundEndReason === 'elimination');
}

console.log('== bomb drop & pickup ==');
{
  const sim = new GameSim({ seed: 11, playerTeam: 'T' });
  run(sim, 3.2);
  const carrier = sim.byId(sim.bomb.carrier)!;
  carrier.pos = v3(10, 0, 50);
  (sim as unknown as { dropBomb(c: typeof carrier): void }).dropBomb(carrier);
  check('death drop -> dropped', sim.bomb.state === 'dropped' && !carrier.hasBomb);
  const other = sim.alive('T').find((c) => c.id !== carrier.id)!;
  other.pos = v3(10.5, 0, 50);
  other.vel = v3();
  run(sim, 0.2);
  check('nearby T picks up', sim.bomb.state === 'carried' && other.hasBomb);
}

console.log('== half-time swap & match end ==');
{
  const sim = new GameSim({ seed: 3, playerTeam: 'CT' });
  for (let r = 0; r < 7; r++) {
    run(sim, 3.2);
    sim.liveT = 0.01;
    run(sim, 0.1);
    run(sim, 5.2);
  }
  check('round 8 reached', sim.round === 8);
  check('player swapped to T', sim.player.team === 'T');
  check('round 8 is pistol again', sim.pistol);
  check('scores CT 7', sim.scores.CT === 7);
  // CT (now the bot side) wins one more -> match end at 8
  run(sim, 3.2);
  sim.liveT = 0.01;
  run(sim, 0.1);
  run(sim, 5.2);
  check('match ends at 8', sim.phase === 'matchend' && sim.matchWinner === 'CT');
}

console.log('== spectate takeover ==');
{
  const sim = new GameSim({ seed: 13, playerTeam: 'CT' });
  run(sim, 3.2);
  const mate = sim.alive('CT').find((c) => !c.isPlayer)!;
  sim.player.alive = false;
  check('takeover succeeds', sim.takeover(mate.id));
  check('player id moved', sim.playerId === mate.id && mate.isPlayer && mate.bot === null);
  check('cannot takeover enemy', !sim.takeover(sim.alive('T')[0].id));
}

console.log(failures === 0 ? '\nRULES TEST PASSED' : `\nRULES TEST: ${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);
