import { createMachine, DT } from '../src/physics.js';
const m = createMachine();
let mn = 9, mx = -9;
for (let i = 0; i < 60 * 20; i++) {
  m.step(DT); m.events.length = 0;
  const p = 2 * Math.atan2(m.bodies.lever.quaternion.z, m.bodies.lever.quaternion.w);
  mn = Math.min(mn, p); mx = Math.max(mx, p);
}
console.log('lever phi range deg', (mn * 180 / Math.PI).toFixed(1), (mx * 180 / Math.PI).toFixed(1));
