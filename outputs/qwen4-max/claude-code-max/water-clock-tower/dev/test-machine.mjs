// Node 端物理自检：不渲染，直接步进 30+ 秒，打印传动链诊断
import RAPIER from '@dimforge/rapier3d-compat';
import { createMachine } from '../src/sim/machine.js';

await RAPIER.init();
const m = createMachine(RAPIER, { seed: 1092 });
const seconds = Number(process.argv[2] ?? 34);
const steps = Math.round(seconds / m.DT);

let lastTickT = 0, lastBellT = 0;
const tickIntervals = [], bellIntervals = [];
m.on('clack', () => { const t = m.diag.time; if (lastTickT) tickIntervals.push(t - lastTickT); lastTickT = t; });
m.on('bell', () => { const t = m.diag.time; if (lastBellT) bellIntervals.push(t - lastBellT); lastBellT = t; });

const t0 = performance.now();
let lastLog = -1;
let prevWheel = 0;
const stepSizes = [];
for (let i = 0; i < steps; i++) {
  m.step();
  const d = m.diag;
  const dw = d.wheelDeg - prevWheel;
  if (dw > 0.5) stepSizes.push(dw);
  prevWheel = d.wheelDeg;
  const sec = Math.floor(d.time);
  if (sec !== lastLog) {
    lastLog = sec;
    console.log(
      `t=${sec.toString().padStart(2)}s wheel=${d.wheelDeg.toFixed(1).padStart(7)}° shaft=${d.shaftDeg.toFixed(1).padStart(6)}° car=${d.carouselDeg.toFixed(1).padStart(7)}° ticks=${String(d.ticks).padStart(2)} rel=${String(d.releases).padStart(2)} bell=${d.bellHits} drum=${d.drumHits} drops=${String(d.droplets).padStart(2)} L1=${d.lever1Deg.toFixed(1)}° fill=${d.bucketFill} ${d.jammed ? 'JAM!' : ''}`
    );
  }
}
const ms = performance.now() - t0;
console.log(`\n${steps} steps in ${ms.toFixed(0)}ms => ${(ms / steps).toFixed(2)}ms/step`);
console.log('tick intervals:', tickIntervals.map(x => x.toFixed(2)).join(' '));
console.log('bell intervals:', bellIntervals.map(x => x.toFixed(2)).join(' '));
const avg = a => a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0;
console.log(`avg tick=${avg(tickIntervals).toFixed(2)}s  avg bell=${avg(bellIntervals).toFixed(2)}s`);
console.log('wheel step sizes (deg):', stepSizes.map(x => x.toFixed(1)).join(' '));
console.log(`final: wheel=${m.diag.wheelDeg.toFixed(1)}° shaft=${m.diag.shaftDeg.toFixed(1)}° carousel=${m.diag.carouselDeg.toFixed(1)}°`);
console.log(`ratios: shaft/wheel=${(m.diag.shaftDeg / m.diag.wheelDeg).toFixed(3)} (expect ~0.333) carousel/wheel=${(m.diag.carouselDeg / m.diag.wheelDeg).toFixed(3)} (expect ~1.333)`);
