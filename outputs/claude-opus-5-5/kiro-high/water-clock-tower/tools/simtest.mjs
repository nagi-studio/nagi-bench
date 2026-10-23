// 无头物理测试：检查擒纵是否一格一格稳定放行、木人何时击钟鼓
import { DT, WHEEL, LEVER, WATER } from '../src/sim/layout.js';

const T = Number(process.argv[2] || 30);
const env = process.env;
if (env.CW) LEVER.cwMass = Number(env.CW);
if (env.RATE) WATER.rate = Number(env.RATE);
if (env.DAMP) WHEEL.damp = Number(env.DAMP);
const { createSimulation, setSolverIterations } = await import('../src/sim/physics.js');
if (env.ITER) setSolverIterations(Number(env.ITER));
const sim = createSimulation();
const t0 = performance.now();
let lastPrint = 0;
let minLever = 0;
const n = Math.round(T / DT);
const fillCount = () => {
  // 注水位附近的壶里有多少水滴
  const [wx, wy] = WHEEL.center;
  let c = 0;
  for (const p of sim.particles) {
    const dx = p.body.position.x - wx;
    const dy = p.body.position.y - wy;
    const th = Math.atan2(dx, dy);
    const r = Math.hypot(dx, dy);
    if (r > 1.25 && r < 1.8 && Math.abs(th - WHEEL.fillTheta) < 0.2) c++;
  }
  return c;
};
for (let i = 0; i < n; i++) {
  sim.step();
  minLever = Math.min(minLever, sim.lever.limit.rel);
  if (env.TRACE && i % 3 === 0 && sim.time < Number(env.TRACE) && sim.time > Number(env.TFROM || 0)) {
    const lv = sim.lever.body;
    let stopC = 0;
    let padC = 0;
    const who = [];
    for (const c of sim.world.contacts) {
      if (c.bi === lv || c.bj === lv) {
        const other = c.bi === lv ? c.bj : c.bi;
        if (other === sim.wheel.body) stopC++;
        else {
          padC++;
          who.push(sim.buckets.findIndex((b) => b.body === other));
        }
      }
    }
    console.log(
      `${sim.time.toFixed(3)} wheel=${((-sim.wheel.tracker.angle * 180) / Math.PI).toFixed(2)} w=${sim.wheel.body.angularVelocity.z.toFixed(3)} lever=${sim.lever.limit.rel.toFixed(3)} stopC=${stopC} padC=${padC}[${who}] tilts=${sim.buckets.map((b) => b.limit.rel.toFixed(2)).join(',')}`,
    );
  }
  if (sim.time - lastPrint >= 1) {
    lastPrint = sim.time;
    const wa = (-sim.wheel.tracker.angle * 180) / Math.PI;
    console.log(
      `t=${sim.time.toFixed(1)} wheel=${wa.toFixed(1)} steps=${(wa / (360 / WHEEL.n)).toFixed(2)} lever=${sim.lever.limit.rel.toFixed(3)} min=${minLever.toFixed(3)} n=${sim.particles.length} fill=${fillCount()} jl=${((-sim.jilun.tracker.angle * 180) / Math.PI).toFixed(1)} drum=${sim.strikers.drum.tracker.angle.toFixed(2)} bell=${sim.strikers.bell.tracker.angle.toFixed(2)}`,
    );
    minLever = 0;
  }
}
const ms = performance.now() - t0;
console.log(`avg step ${(ms / n).toFixed(3)} ms`);
console.log('release angles', (sim.stats.releaseAngles || []).map((a) => ((-a * 180) / Math.PI).toFixed(1)).join(' '));
const r = sim.stats.releases;
console.log('releases', r.map((x) => x.toFixed(2)).join(' '));
console.log('intervals', r.slice(1).map((x, i) => (x - r[i]).toFixed(2)).join(' '));
const ev = sim.events.filter((e) => e.type === 'bell' || e.type === 'drum');
console.log('strikes', ev.map((e) => `${e.type}@${e.t.toFixed(2)}(${e.v.toFixed(2)})`).join(' '));
const c = {};
for (const e of sim.events) c[e.type] = (c[e.type] || 0) + 1;
console.log(c);
