import { createMachine, DT } from '../src/physics.js';
const m = createMachine();
for (let i = 0; i < 120; i++) m.step(DT);
const t0 = performance.now();
for (let i = 0; i < 600; i++) m.step(DT);
const t1 = performance.now();
console.log('ms/step:', ((t1 - t0) / 600).toFixed(2), 'simTime', m.time.toFixed(1), 'steps', m.stepCount, 'state', m.state, 'activeBalls', m.balls.filter(b => b.userData.active).length);
// 长期运行:检查 30 秒内的报时节奏
const m2 = createMachine();
const log = [];
for (let i = 0; i < 32 * 60; i++) {
  m2.step(DT);
  for (const e of m2.events) if (e.type === 'step' || e.type === 'drum' || e.type === 'bell') log.push([m2.time.toFixed(2), e.type]);
  m2.events.length = 0;
}
console.log(log.map(x => x.join(':')).join(' '));
