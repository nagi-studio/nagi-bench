import RAPIER from '@dimforge/rapier3d-compat';
import { createSim, DT } from '../src/physics.js';
await RAPIER.init();
const opts = JSON.parse(process.argv[2] || '{}');
const sim = createSim(RAPIER, opts);
const T = opts.T ?? 40;
let lastStep = 0, t0 = performance.now();
const deg = (r) => (r * 180 / Math.PI).toFixed(1);
let nextPrint = 0;
const zang = (b) => { const r = b.rotation(); return 2 * Math.atan2(r.z, r.w); };
for (let i = 0; i < T / DT; i++) {
  sim.step();
  const st = Math.floor((sim.wheelAngle + 0.05) / (Math.PI / 6));
  const t = sim.time;
  if (t >= nextPrint) {
    nextPrint += opts.every ?? 0.5;
    let n = 0;
    for (const d of sim.drops) { const p = d.body.translation(); if (p.x > 1.9 && p.x < 3 && p.y > -0.5 && p.y < 0.3) n++; }
    console.log(`t=${t.toFixed(2)} wheel=${deg(sim.wheelAngle)} fork=${deg(zang(sim.fork))} beam=${deg(zang(sim.beam))} jack=${deg(zang(sim.jack))} fill=${n} drops=${sim.drops.length} w=${sim.wheel.angvel().z.toFixed(2)} jackAx=${deg(sim.angleOf(sim.shafts.jack))}`);
  }
  if (st > lastStep) { console.log(`  >>> STEP ${st} at t=${t.toFixed(2)}`); lastStep = st; }
}
const ev = {};
for (const c of sim.collisions) { const k = [c.a, c.b].sort().join('-'); (ev[k] ??= []).push(c.t.toFixed(2) + ':' + c.v.toFixed(2)); }
for (const k in ev) if (!k.includes('undefined') || opts.all) console.log(k, ev[k].slice(0, 30).join(' '));
console.log('ms', (performance.now() - t0).toFixed(0));
