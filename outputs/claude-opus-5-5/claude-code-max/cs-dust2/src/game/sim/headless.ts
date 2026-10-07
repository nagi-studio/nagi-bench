import { TICK_DT } from '../core/config';
import { DEFAULT_SETTINGS, type Difficulty, type MatchSettings, type Team } from '../core/types';
import { World } from './World';

export interface SimOptions {
  seed: number;
  difficulty: Difficulty;
  roundsToWin: number;
  firstRound: MatchSettings['firstRound'];
  verbose: boolean;
  /** Safety cap in simulated seconds. */
  maxSeconds: number;
}

export interface SimReport {
  winner: Team | null;
  score: Record<Team, number>;
  rounds: { winner: Team; reason: string }[];
  simulatedSeconds: number;
  wallMs: number;
  kills: number;
  headshots: number;
  plants: number;
  defuses: number;
  explosions: number;
  /** Longest time (s) any bot wanted to move but stayed in place. */
  worstStall: number;
}

/**
 * Runs a complete 10-bot match without rendering, audio or DOM — the simulation layer is fully
 * decoupled from presentation. Used by `npm run sim` as an integration/soak test of rules + AI.
 */
export function runSimulation(opts: Partial<SimOptions> = {}, log: (s: string) => void = console.log): SimReport {
  const o: SimOptions = { seed: 1, difficulty: 'normal', roundsToWin: 8, firstRound: 'pistol', verbose: false, maxSeconds: 3600, ...opts };
  const world = new World({ ...DEFAULT_SETTINGS, difficulty: o.difficulty, roundsToWin: o.roundsToWin, firstRound: o.firstRound }, { humanControlled: false, seed: o.seed });
  const report: SimReport = {
    winner: null,
    score: world.score,
    rounds: [],
    simulatedSeconds: 0,
    wallMs: 0,
    kills: 0,
    headshots: 0,
    plants: 0,
    defuses: 0,
    explosions: 0,
    worstStall: 0,
  };
  const ev = world.events;
  const stamp = () => `[R${world.roundNumber} ${world.time.toFixed(1)}s]`;
  ev.on('kill', (e) => {
    report.kills++;
    if (e.headshot) report.headshots++;
    if (o.verbose) log(`${stamp()} ${e.killer?.name ?? '-'} ⟶ ${e.victim.name} (${e.weapon}${e.headshot ? ', HS' : ''}) @ ${world.level.zoneAt(e.victim.pos.x, e.victim.pos.z)}`);
  });
  ev.on('bombPlanted', (e) => {
    report.plants++;
    if (o.verbose) log(`${stamp()} C4 planted at ${e.site} by ${e.actor.name}`);
  });
  ev.on('bombDefused', (e) => {
    report.defuses++;
    if (o.verbose) log(`${stamp()} C4 defused by ${e.actor.name}`);
  });
  ev.on('bombExploded', () => {
    report.explosions++;
    if (o.verbose) log(`${stamp()} C4 exploded`);
  });
  ev.on('roundStart', (e) => o.verbose && log(`${stamp()} --- round ${e.round}${e.pistol ? ' (pistol)' : ''}, T plan: ${world.teamAI.T.site}`));
  ev.on('roundEnd', (e) => {
    report.rounds.push({ winner: e.winner, reason: e.reason });
    log(`${stamp()} round ${world.roundNumber}: ${e.winner} wins (${e.reason})  CT ${world.score.CT} : ${world.score.T} T`);
  });

  const stall = new Map<number, number>();
  const t0 = performance.now();
  const maxTicks = Math.ceil(o.maxSeconds / TICK_DT);
  for (let i = 0; i < maxTicks && world.phase !== 'over'; i++) {
    const before = world.actors.map((a) => [a.pos.x, a.pos.z]);
    world.tick(TICK_DT);
    if (world.phase !== 'live') continue;
    world.actors.forEach((a, idx) => {
      if (!a.alive || a.rooted) return stall.set(a.id, 0);
      const wants = Math.abs(a.input.forward) + Math.abs(a.input.right) > 0.3;
      const moved = Math.hypot(a.pos.x - before[idx][0], a.pos.z - before[idx][1]);
      const s = wants && moved < 0.01 ? (stall.get(a.id) ?? 0) + TICK_DT : 0;
      stall.set(a.id, s);
      report.worstStall = Math.max(report.worstStall, s);
    });
  }
  report.wallMs = performance.now() - t0;
  report.simulatedSeconds = world.time;
  report.winner = world.matchWinner;
  return report;
}
