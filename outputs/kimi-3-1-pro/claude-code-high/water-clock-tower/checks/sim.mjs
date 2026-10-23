import { ClockPhysics } from '../src/physics.js';

let ticks = 0;
let bells = 0;
const bellTimes = [];
const sim = new ClockPhysics({ onTick: () => ticks++, onBell: () => { bells++; bellTimes.push(sim?.time.toFixed(2)); } });
for (let second = 0; second <= 36; second++) {
  const d = sim.getDiagnostics();
  console.log(second, 'wheel', d.wheelAngle.toFixed(3), 'ω', d.wheelSpeed.toFixed(3), 'anchor', d.anchorAngle.toFixed(3), 'B/C/D', d.gearBSpeed.toFixed(2), d.gearCSpeed.toFixed(2), d.gearDSpeed.toFixed(2), 'shaft', d.shaftSpeed.toFixed(2), 'striker', d.strikerAngle.toFixed(2), 'locked', d.locked, 'target', d.lockTarget.toFixed(2), 'drive', d.driveTorque.toFixed(1), 'ticks', ticks, 'bells', bells, 'fill', d.filled.reduce((a,b)=>a+b,0).toFixed(2));
  if (!Number.isFinite(d.wheelAngle)) break;
  for (let i = 0; i < 180; i++) sim.advance(1 / 180);
}
console.log('bell times', bellTimes.join(', '));
