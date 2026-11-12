// 打印关键物理事件时刻：格叉开始下沉、枢轮开始转动（放行）、天关卡住（停）、钟响
import RAPIER from '@dimforge/rapier3d-compat';
import { createSim, DT } from '../src/physics.js';
await RAPIER.init();
const opts = JSON.parse(process.argv[2] || '{}');
const sim = createSim(RAPIER, opts);
const T = opts.T ?? 34;
const zang = (b) => { const r = b.rotation(); return 2 * Math.atan2(r.z, r.w) * 180 / Math.PI; };
let moving = false, forkDown = false, beamUp = false;
const ev = [];
while (sim.time < T) {
  sim.step();
  const w = -sim.wheel.angvel().z;
  if (!moving && w > 0.04) { moving = true; ev.push([sim.time, 'release(轮开始转)', (sim.wheelAngle * 180 / Math.PI).toFixed(1)]); }
  if (moving && Math.abs(w) < 0.01) { moving = false; ev.push([sim.time, 'stop(天关卡住)', (sim.wheelAngle * 180 / Math.PI).toFixed(1)]); }
  const fa = zang(sim.fork);
  if (!forkDown && fa > 2.5) { forkDown = true; ev.push([sim.time, 'fork dip >2.5°']); }
  if (forkDown && fa < 0.8) { forkDown = false; ev.push([sim.time, 'fork back']); }
  const ba = -zang(sim.beam);
  if (!beamUp && ba > 1.5) { beamUp = true; ev.push([sim.time, 'beam lift >1.5°']); }
  if (beamUp && ba < 0.3) { beamUp = false; ev.push([sim.time, 'beam rest']); }
}
for (const c of sim.collisions) if ((c.a === 'bell' || c.b === 'bell') && c.v > 0.06) ev.push([c.t, 'BELL', c.v.toFixed(2)]);
ev.sort((a, b) => a[0] - b[0]);
for (const e of ev) console.log(e[0].toFixed(2), ...e.slice(1));
console.log('steps', sim.stepTimes.map((t) => t.toFixed(2)).join(' '));
