import { Clockwork } from '../src/mechanism.js';
const bm = Number(process.argv[2] ?? 0.55);
const T = Number(process.argv[3] ?? 35);
const cw = new Clockwork({ beamMass: bm });
const dt = 1 / 600;
let last = -1, t0 = performance.now();
for (let i = 0; i < T * 600; i++) {
  cw.step(dt);
  const t = cw.world.time;
  if (i % 300 === 0) {
    const b0 = cw.buckets.reduce((m, b) => b.water > m.water ? b : m);
    console.log(`t=${t.toFixed(1)} steps=${cw.wheelSteps.toFixed(2)} w=${cw.wheel.w.toFixed(3)} fork=${cw.fork.a.toFixed(3)} beam=${cw.beam.a.toFixed(3)} h2=${cw.h2.toFixed(3)} ` +
      `water=[${cw.buckets.map(b => b.water.toFixed(2)).join(',')}] bell=${cw.strikers.bell.lever.a.toFixed(3)} parts=${cw.particles.length}`);
  }
  for (const e of cw.world.events) if (e.tag !== 'fork') console.log(`  ev ${e.tag} t=${e.time.toFixed(2)} imp=${e.impulse.toFixed(3)} v=${e.speed.toFixed(2)}`);
  cw.world.events.length = 0;
}
console.log('ms', performance.now() - t0);
