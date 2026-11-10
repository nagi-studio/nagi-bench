// 几何检查：两只木齿轮按理想速比同步转动一个齿距，统计任意两根齿（胶囊）之间的最小间隙
const DEG = Math.PI / 180;
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => mul(a, 1 / Math.hypot(...a));
function rotAxis(v, k, a) { const c = Math.cos(a), s = Math.sin(a); return add(add(mul(v, c), mul(cross(k, v), s)), mul(k, dot(k, v) * (1 - c))); }
function segDist(p1, q1, p2, q2) {
  const d1 = sub(q1, p1), d2 = sub(q2, p2), r = sub(p1, p2); const a = dot(d1, d1), e = dot(d2, d2), f = dot(d2, r);
  let s, t; const c = dot(d1, r), b = dot(d1, d2), den = a * e - b * b;
  s = den > 1e-12 ? Math.min(1, Math.max(0, (b * f - c * e) / den)) : 0; t = (b * s + f) / e;
  if (t < 0) { t = 0; s = Math.min(1, Math.max(0, -c / a)); } else if (t > 1) { t = 1; s = Math.min(1, Math.max(0, (b - c) / a)); }
  return Math.hypot(...sub(add(p1, mul(d1, s)), add(p2, mul(d2, t))));
}
// 齿轮：center, axis, e1(相位0方向), R, n, phase, tilt(0=径向, 90°=轴向, 其它=圆锥), hh, r
function pegs(g, ang) {
  const out = []; const e2 = cross(g.axis, g.e1);
  for (let i = 0; i < g.n; i++) {
    const a = g.phase + ang + (i * 2 * Math.PI) / g.n; const rd = add(mul(g.e1, Math.cos(a)), mul(e2, Math.sin(a)));
    const c = add(g.center, mul(rd, g.R)); const dir = norm(add(mul(rd, Math.cos(g.tilt)), mul(g.axis, Math.sin(g.tilt))));
    out.push([sub(c, mul(dir, g.hh)), add(c, mul(dir, g.hh))]);
  }
  return out;
}
export function check(g1, g2, ratioSign = -1, label = '') {
  // g2 转角 = ratioSign * ang * n1/n2；在一个齿距内扫描，并在侧隙范围内找“居中”时的最小间隙
  let worst = 1e9, worstBack = 1e9;
  const pitch1 = (2 * Math.PI) / g1.n;
  for (let i = 0; i < 60; i++) {
    const a1 = (i / 60) * pitch1; const a2 = ratioSign * a1 * g1.n / g2.n;
    // 在 g2 上附加微小偏角 off，找到两侧都不接触的最大余量（即侧隙）
    let best = -1e9;
    for (let k = -30; k <= 30; k++) {
      const off = (k / 30) * 0.5 * (2 * Math.PI / g2.n);
      const P1 = pegs(g1, a1), P2 = pegs(g2, a2 + off); let m = 1e9;
      for (const s1 of P1) for (const s2 of P2) { const d = segDist(s1[0], s1[1], s2[0], s2[1]) - g1.r - g2.r; if (d < m) m = d; }
      if (m > best) best = m;
    }
    if (best < worst) worst = best;
  }
  console.log(`${label}: 最小可达间隙 = ${(worst * 1000).toFixed(1)} mm  (<0 表示必然干涉/楔死)`);
  return worst;
}
if (import.meta.main) {
  const { G } = await import('../src/sim.js');
  const Y = [0, 1, 0], Z = [0, 0, 1], X = [1, 0, 0];
  const n = [0, G.n.y, G.n.z], u1 = [0, G.u1.y, G.u1.z];
  const a = process.argv.slice(2).map(Number);
  const r2 = a[0] ?? G.GEAR2.r, hhC = a[1] ?? G.GEAR2.hh, hhD = a[2] ?? G.GEAR2.hhD, tiltC = (a[3] ?? 90) * DEG;
  // A–B
  check({ center: [0, G.YC, G.ZA], axis: Z, e1: X, R: G.RA, n: G.NA, phase: Math.PI / 2, tilt: 0, hh: G.GEAR1.hh, r: G.GEAR1.r },
    { center: [0, G.YC + G.RA, G.ZS], axis: Y, e1: Z, R: G.RB, n: G.NB, phase: Math.PI / G.NB, tilt: Math.PI / 2, hh: G.GEAR1.hh, r: G.GEAR1.r }, -1, 'A–B');
  // C–D（浑象）
  check({ center: [0, G.YGC, G.ZS], axis: Y, e1: Z, R: G.RC, n: G.NC, phase: 0, tilt: tiltC, hh: hhC, r: r2 },
    { center: [0, G.GLOBE.y, G.GLOBE.z], axis: n, e1: X, R: G.RD, n: G.ND, phase: Math.PI / 2 + Math.PI / G.ND, tilt: 0, hh: hhD, r: r2 }, 1, 'C–D');
  check({ center: [0, G.YGC, G.ZS], axis: Y, e1: Z, R: G.RC, n: G.NC, phase: 0, tilt: tiltC, hh: hhC, r: r2 },
    { center: [0, G.GLOBE.y, G.GLOBE.z], axis: n, e1: X, R: G.RD, n: G.ND, phase: Math.PI / 2 + Math.PI / G.ND, tilt: 0, hh: hhD, r: r2 }, -1, 'C–D(反向)');
  check({ center: [0, G.YGC2, G.ZS], axis: Y, e1: Z, R: G.RC2, n: G.NC2, phase: 0, tilt: tiltC, hh: hhC, r: r2 },
    { center: [0, G.ARM.gy, G.ARM.gz], axis: n, e1: X, R: G.RD2, n: G.ND2, phase: Math.PI / 2 + Math.PI / G.ND2, tilt: 0, hh: hhD, r: r2 }, 1, 'C2–D2');
  check({ center: [0, G.YGC2, G.ZS], axis: Y, e1: Z, R: G.RC2, n: G.NC2, phase: 0, tilt: tiltC, hh: hhC, r: r2 },
    { center: [0, G.ARM.gy, G.ARM.gz], axis: n, e1: X, R: G.RD2, n: G.ND2, phase: Math.PI / 2 + Math.PI / G.ND2, tilt: 0, hh: hhD, r: r2 }, -1, 'C2–D2(反向)');
}
