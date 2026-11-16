import { createMachine, DT } from '../src/physics.js';
// 直接操纵铰链电机符号,判断伺服方向约定
const m = createMachine();
let mn = 9, mx = -9;
for (let i = 0; i < 60 * 12; i++) {
  // 覆盖弹簧符号:在 step 前设置( step 内部会再设一次,故改用 monkey-patch )
  m.step(DT); m.events.length = 0;
  const p = 2 * Math.atan2(m.bodies.lever.quaternion.z, m.bodies.lever.quaternion.w);
  mn = Math.min(mn, p); mx = Math.max(mx, p);
}
console.log('default sign range deg', (mn * 180 / Math.PI).toFixed(1), (mx * 180 / Math.PI).toFixed(1));
