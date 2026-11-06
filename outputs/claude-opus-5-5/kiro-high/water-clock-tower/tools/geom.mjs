import { createSimulation } from '../src/sim/physics.js';
import { WHEEL } from '../src/sim/layout.js';
const sim = createSimulation();
const [wx, wy] = WHEEL.center;
const L = sim.lever;
const f = (p) => `(${p[0].toFixed(3)},${p[1].toFixed(3)}) r=${Math.hypot(p[0] - wx, p[1] - wy).toFixed(3)}`;
console.log('pinC', f(L.pinC), 'P', f(L.pivot), 'pad', f(L.padC), 'cw', f(L.cwC), 'com', f(L.com));
const lv = L.body;
const gt = lv.mass * 9.81 * -(L.com[0] - L.pivot[0]);
console.log('lever mass', lv.mass.toFixed(2), 'gravity torque about P (CCW+)', gt.toFixed(3), 'I', lv.inertia.z.toFixed(3));
const b3 = sim.buckets[sim.fillIndex];
for (const [i, s] of b3.body.shapes.entries()) {
  if (s.radius) {
    const o = b3.body.shapeOffsets[i];
    console.log('lug', f([o.x + b3.body.position.x, o.y + b3.body.position.y]));
  }
}
const steps = Number(process.argv[2] || 12);
for (let k = 0; k < steps; k++) sim.step();
for (const c of sim.world.contacts) {
  const isL = c.bi === lv || c.bj === lv;
  if (!isL) continue;
  const other = c.bi === lv ? c.bj : c.bi;
  const b = c.bi;
  const pt = [b.position.x + c.ri.x, b.position.y + c.ri.y];
  const nOnLever = c.bi === lv ? [-c.ni.x, -c.ni.y] : [c.ni.x, c.ni.y];
  const r = [pt[0] - L.pivot[0], pt[1] - L.pivot[1]];
  const tq = r[0] * nOnLever[1] - r[1] * nOnLever[0];
  const force = c.multiplier;
  console.log(other === sim.wheel.body ? 'STOP' : 'PAD', 'pt', f(pt), 'n', nOnLever.map((x) => x.toFixed(3)), 'unitTq', tq.toFixed(4), 'F', force.toFixed(2), 'Tq', (tq * force).toFixed(3));
}
console.log('lever angle', sim.lever.limit.rel.toFixed(4));
