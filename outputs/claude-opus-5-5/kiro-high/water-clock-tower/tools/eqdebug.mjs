// 列出作用在杠杆上的所有约束方程及其力矩
import { createSimulation } from '../src/sim/physics.js';
const sim = createSimulation();
const lv = sim.lever.body;
const steps = Number(process.argv[2] || 700);
for (let k = 0; k < steps; k++) sim.step();
const solver = sim.world.solver;
const orig = solver.solve.bind(solver);
let captured = [];
solver.solve = function (dt, world) {
  const r = orig(dt, world);
  captured = this.equations.slice();
  return r;
};
sim.step();
let tot = 0;
for (const eq of captured) {
  let J = null;
  if (eq.bi === lv) J = eq.jacobianElementA;
  else if (eq.bj === lv) J = eq.jacobianElementB;
  if (!J) continue;
  // 关于支点的力矩：τ_P = τ_com + (com - P) × F
  const F = J.spatial.clone().scale(eq.multiplier);
  const tc = J.rotational.z * eq.multiplier;
  const rx = lv.position.x - sim.lever.pivot[0];
  const ry = lv.position.y - sim.lever.pivot[1];
  const tp = tc + rx * F.y - ry * F.x;
  tot += tp;
  const other = eq.bi === lv ? eq.bj : eq.bi;
  const name = other === sim.wheel.body ? 'wheel' : sim.buckets.some((b) => b.body === other) ? 'bucket' : other.mass === 0 ? 'ground' : 'other';
  if (Math.abs(tp) > 1e-3) console.log(eq.constructor.name.padEnd(22), name.padEnd(8), 'λ/dt', eq.multiplier.toFixed(3), 'τ_P', tp.toFixed(3), 'enabled', eq.enabled);
}
const g = lv.mass * 9.81 * -(lv.position.x - sim.lever.pivot[0]);
console.log('sum constraint τ_P', tot.toFixed(3), ' gravity τ_P', g.toFixed(3), ' lever angle', sim.lever.limit.rel.toFixed(4), 'ω', lv.angularVelocity.z.toFixed(4));
