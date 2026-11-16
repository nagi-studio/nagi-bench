import { createMachine, DT } from '../src/physics.js';
import { L, DEG } from '../src/layout.js';
const m = createMachine();
let next = 0;
for (let i = 0; i < 60 * 9; i++) {
  m.step(DT);
  m.events.length = 0;
  if (m.time >= next) {
    next += 0.5;
    const q = m.bodies.wheel.quaternion;
    const phi = 2 * Math.atan2(q.z, q.w);
    // 球相对当前壶的分布
    const qi = q.clone(); qi.inverse();
    const th = (L.fillDeg) * DEG;
    let inC = 0, above = 0, out = 0;
    for (const b of m.balls) {
      if (!b.userData.active) continue;
      const lx = b.position.x - L.wheel.x, ly = b.position.y - L.wheel.y, lz = b.position.z;
      const v = qi.vmult({ x: lx, y: ly, z: lz });
      const r = Math.hypot(v.x, v.y);
      let d = Math.atan2(v.y, v.x) - th; d = Math.atan2(Math.sin(d), Math.cos(d));
      if (Math.abs(d) < 0.15 && Math.abs(v.z) < 0.29) {
        if (r >= L.wheel.R - 0.16 && r <= L.wheel.R + 0.26) inC++;
        else if (r > L.wheel.R + 0.26) above++;
        else out++;
      }
    }
    console.log(m.time.toFixed(1), m.state, 'count', m.fillCount, 'inC', inC, 'above', above, 'below', out, 'phi', (phi / DEG).toFixed(1), 'omega', m.bodies.wheel.angularVelocity.z.toFixed(2));
  }
}
