// 追踪木人击打：尾杆被拨牙推起、滑脱、回落击中乐器
import { createSimulation } from '../src/sim/physics.js';
import { DT } from '../src/sim/layout.js';
const sim = createSimulation();
const T = Number(process.argv[2] || 25);
const name = process.argv[3] || 'drum';
const s = sim.strikers[name];
let prev = 0;
const inst = sim.world.bodies.find((b) => b.mass === 0 && Math.abs(b.position.x - s.instPos[0]) < 1e-6 && Math.abs(b.position.y - s.instPos[1]) < 1e-6);
for (let i = 0; i < T / DT; i++) {
  sim.step();
  const a = s.tracker.angle;
  const w = s.body.angularVelocity.z;
  let inContact = false;
  for (const c of sim.world.contacts) if ((c.bi === s.body && c.bj === inst) || (c.bj === s.body && c.bi === inst)) inContact = true;
  if (Math.abs(w) > 0.5 || inContact !== prev || (process.env.FROM && sim.time > Number(process.env.FROM) && sim.time < Number(process.env.FROM) + 0.12)) {
    const others = sim.world.contacts.filter((c) => c.bi === s.body || c.bj === s.body).map((c) => {
      const o = c.bi === s.body ? c.bj : c.bi;
      return o === inst ? 'INST' : o === sim.jilun.body ? 'JL' : o.mass === 0 ? 'static' : 'other';
    });
    console.log(sim.time.toFixed(3), 'angle', a.toFixed(3), 'w', w.toFixed(2), 'contact', inContact, others.join(','));
  }
  prev = inContact;
}
console.log(sim.events.filter((e) => e.type === name).map((e) => `${e.t.toFixed(2)}:${e.v.toFixed(2)}`).join(' '));
