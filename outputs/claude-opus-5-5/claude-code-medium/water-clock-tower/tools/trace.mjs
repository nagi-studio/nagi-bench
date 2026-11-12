import RAPIER from '@dimforge/rapier3d-compat';
import { createSim, DT } from '../src/physics.js';
await RAPIER.init();
const opts = JSON.parse(process.argv[2] || '{}');
const sim = createSim(RAPIER, opts);
const T = opts.T ?? 20;
const zang = (b) => { const r = b.rotation(); return 2 * Math.atan2(r.z, r.w) * 180 / Math.PI; };
const every = opts.every ?? 0.1;
let next = opts.from ?? 0;
for (let i = 0; i < T / DT; i++) {
  sim.step();
  if (sim.time >= next) {
    next += every;
    const w = sim.wheelAngle * 180 / Math.PI;
    // station bucket: the one whose pivot angle is near station
    let bi = -1, best = 1e9;
    sim.buckets.forEach((b, k) => { const p = b.body.translation(); const a = Math.atan2(p.y, p.x); const d = Math.abs(a - sim.station); if (d < best) { best = d; bi = k; } });
    const bb = sim.buckets[bi];
    const rel = zang(bb.body) - (-w) - bb.tilt * 180 / Math.PI;
    let n = 0;
    const bp = bb.body.translation();
    for (const d of sim.drops) { const p = d.body.translation(); if (Math.hypot(p.x - bp.x - 0.4, p.y - bp.y) < 0.55) n++; }
    console.log(`t=${sim.time.toFixed(2)} wheel=${w.toFixed(1)} fork=${zang(sim.fork).toFixed(1)} beam=${zang(sim.beam).toFixed(1)} lock=${zang(sim.lock).toFixed(1)} b${bi}rel=${rel.toFixed(1)} n=${n} jack=${zang(sim.jack).toFixed(1)} wz=${sim.wheel.angvel().z.toFixed(2)}`);
  }
}
for (const c of sim.collisions) if (c.t > (opts.from ?? 0) && c.v > 0.05 && !/bucket/.test(c.a + c.b)) console.log('  col', c.t.toFixed(2), c.a, c.b, c.v.toFixed(2));
