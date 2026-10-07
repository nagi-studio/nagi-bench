// Headless match simulation: `npm run sim -- [seed] [difficulty] [roundsToWin] [--verbose]`
// Uses Vite's SSR module loader to execute the TypeScript simulation directly in Node,
// proving the game rules + AI run without any rendering/DOM (and doubling as a soak test).
import { createServer } from 'vite';

const args = process.argv.slice(2);
const verbose = args.includes('--verbose');
const pos = args.filter((a) => !a.startsWith('--'));
const seed = Number(pos[0] ?? 1);
const difficulty = pos[1] ?? 'normal';
const roundsToWin = Number(pos[2] ?? 8);

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
try {
  const { runSimulation } = await server.ssrLoadModule('/src/game/sim/headless.ts');
  console.log(`Simulating 5v5 bots on de_dust2 (seed ${seed}, ${difficulty}, first to ${roundsToWin})...`);
  const r = runSimulation({ seed, difficulty, roundsToWin, verbose });
  console.log('\n==== match report ====');
  console.log(`winner        : ${r.winner ?? 'none (time cap)'}   score CT ${r.score.CT} : ${r.score.T} T`);
  console.log(`rounds        : ${r.rounds.length}  (${r.rounds.map((x) => `${x.winner}:${x.reason}`).join(', ')})`);
  console.log(`kills         : ${r.kills} (headshots ${r.headshots})`);
  console.log(`bomb          : ${r.plants} planted, ${r.defuses} defused, ${r.explosions} exploded`);
  console.log(`simulated     : ${r.simulatedSeconds.toFixed(0)} s game time in ${(r.wallMs / 1000).toFixed(2)} s wall time (${(r.simulatedSeconds / (r.wallMs / 1000)).toFixed(0)}x realtime)`);
  console.log(`worst bot stall: ${r.worstStall.toFixed(2)} s`);
  if (!r.winner) process.exitCode = 1;
} finally {
  await server.close();
}
