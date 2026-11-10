// 无头物理调试：bun tools/simtest.mjs [seconds] [key=value ...]
import RAPIER from '@dimforge/rapier3d-compat';
import { buildSim, G } from '../src/sim.js';
await RAPIER.init();
const args = process.argv.slice(2);
const dur = Number(args[0] ?? 12);
const opts = {};
for (const a of args.slice(1)) { const [k, v] = a.split(/[:=]/); opts[k] = Number(v); }
if (opts.nopre) opts.prefill = [];
const verbose = opts.verbose ?? 0;
const sim = buildSim(RAPIER, opts);
const t0 = performance.now();
const D = 180 / Math.PI;
let last = 0;
const unwrap = (() => { let prev = 0, acc = 0; return (a) => { let d = a - prev; if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI; acc += d; prev = a; return acc; }; })();
const unwrapS = (() => { let prev = 0, acc = 0; return (a) => { let d = a - prev; if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI; acc += d; prev = a; return acc; }; })();
let wa = 0, sa = 0;
const gearCount = { n: 0 };
while (sim.t < dur) {
  sim.step();
  wa = unwrap(sim.wheelAngle()); sa = unwrapS(sim.shaftAngle());
  for (const e of sim.events) {
    if (e.type === 'gear') { gearCount.n++; continue; }
    if (e.type === 'plop') continue;
    console.log(`  [${e.t.toFixed(3)}] ${e.type}${e.v !== undefined ? ' v=' + e.v.toFixed(3) : ''}  wheel=${(wa * D).toFixed(2)}° shaft=${(sa * D).toFixed(2)}°`);
  }
  sim.events.length = 0;
  if (verbose && sim.t - last >= verbose) {
    last = sim.t;
    const b = sim.bodies;
    console.log(`t=${sim.t.toFixed(2)} wheel=${(wa * D).toFixed(2)}° w=${b.wheel.angvel().z.toFixed(3)} fork=${(sim.angZ(b.fork) * D).toFixed(2)}° heng=${(sim.angZ(b.heng) * D).toFixed(2)}° s0=${(sim.angZ(b.scoops[0]) * D - wa * D).toFixed(1)} shaft=${(sa * D).toFixed(2)}° hamA=${(sim.angZ(b.hamA) * D).toFixed(1)} hamB=${(sim.angZ(b.hamB) * D).toFixed(1)} balls=${sim.activeBalls()}`);
  }
}
const ms = performance.now() - t0;
const q = sim.bodies.globe.rotation(); const qa = sim.bodies.armil.rotation();
console.log(`done ${dur}s sim in ${ms.toFixed(0)}ms (${(ms / sim.steps).toFixed(3)} ms/step) ticks=${sim.counts.ticks} wheel=${(wa * D).toFixed(1)}° shaft=${(sa * D).toFixed(1)}° globe=${(2 * Math.acos(Math.min(1, Math.abs(q.w))) * D).toFixed(1)}° armil=${(2 * Math.acos(Math.min(1, Math.abs(qa.w))) * D).toFixed(1)}° gearHits=${gearCount.n} balls=${sim.activeBalls()}/${sim.balls.length}`);
