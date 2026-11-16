import { createMachine, DT } from '../src/physics.js';
const m = createMachine();
for (let i = 0; i < 60 * 12; i++) { m.step(DT); m.events.length = 0; }
const act = m.balls.filter(b => b.userData.active);
console.log('active', act.length);
for (const b of act) console.log(b.position.x.toFixed(2), b.position.y.toFixed(2), b.position.z.toFixed(2), 'v', b.velocity.length().toFixed(2));
