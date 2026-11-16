import { createMachine, DT } from '../src/physics.js';
const m = createMachine();
for (let i = 0; i < 60 * 4; i++) {
  m.step(DT); m.events.length = 0;
  const t = m.time;
  if (t > 1.9 && t < 2.9 && i % 6 === 0) {
    const q = m.bodies.lever.quaternion;
    console.log(t.toFixed(2), 'phi', (2 * Math.atan2(q.z, q.w) * 180 / Math.PI).toFixed(2),
      'omega', m.bodies.lever.angularVelocity.z.toFixed(3),
      'torque', m.bodies.lever.torque.z.toFixed(2),
      'mass', m.bodies.lever.mass, 'inertia', m.bodies.lever.inertia.z.toFixed(3),
      'state', m.state);
  }
}
