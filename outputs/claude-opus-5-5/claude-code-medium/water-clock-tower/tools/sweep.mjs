import RAPIER from '@dimforge/rapier3d-compat';
import { createSim, DT } from '../src/physics.js';
await RAPIER.init();
// usage: bun tools/sweep.mjs '[{...opts}, {...}]'
const list = JSON.parse(process.argv[2] || '[{}]');
for (const opts of list) {
  const sim = createSim(RAPIER, opts);
  const T = opts.T ?? 30;
  let lastStep = 0;
  const steps = [];
  let maxOver = 0;
  for (let i = 0; i < T / DT; i++) {
    sim.step();
    const a = sim.wheelAngle * 180 / Math.PI;
    const st = Math.floor((a + 3) / 30);
    if (st > lastStep) { steps.push(sim.time.toFixed(2)); lastStep = st; }
  }
  // detect runaway: step intervals < 1.2 s
  const iv = steps.map((t, i) => i ? (t - steps[i - 1]).toFixed(2) : t);
  const bells = sim.collisions.filter(c => (c.a === 'bell' || c.b === 'bell') && c.v > 0.3).map(c => c.t.toFixed(1));
  const ja = sim.angleOf(sim.shafts.jack) * 180 / Math.PI, wa = sim.wheelAngle * 180 / Math.PI;
  console.log(JSON.stringify(opts), '\n  steps', steps.length, 'final wheel', wa.toFixed(1), 'jackAx', ja.toFixed(1), '\n  intervals', iv.join(' '), '\n  bells', bells.join(' '));
}
