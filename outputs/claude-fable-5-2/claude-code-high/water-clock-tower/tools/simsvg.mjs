// 物理调试截图：bun tools/simsvg.mjs t0 t1 dt x0 y0 x1 y1 [plane:xy|zy|xz] [key:val...]
import RAPIER from '@dimforge/rapier3d-compat';
import { buildSim, G } from '../src/sim.js';
import { writeFileSync, mkdirSync } from 'node:fs';
await RAPIER.init();
const a = process.argv.slice(2);
const [t0, t1, dt, x0, y0, x1, y1] = a.slice(0, 7).map(Number);
const opts = {}; let plane = 'xy'; let zmin = -9, zmax = 9;
for (const s of a.slice(7)) { const [k, v] = s.split(':'); if (k === 'plane') plane = v; else if (k === 'zmin') zmin = Number(v); else if (k === 'zmax') zmax = Number(v); else opts[k] = Number(v); }
const sim = buildSim(RAPIER, opts);
const out = new URL('../.dbg', import.meta.url).pathname; mkdirSync(out, { recursive: true });
const W = 1100, sc = W / (x1 - x0), Hh = Math.round((y1 - y0) * sc);
const rot = (q, v) => {
  const { x, y, z, w } = q; const ix = w * v.x + y * v.z - z * v.y, iy = w * v.y + z * v.x - x * v.z, iz = w * v.z + x * v.y - y * v.x, iw = -x * v.x - y * v.y - z * v.z;
  return { x: ix * w + iw * -x + iy * -z - iz * -y, y: iy * w + iw * -y + iz * -x - ix * -z, z: iz * w + iw * -z + ix * -y - iy * -x };
};
const pr = (p) => plane === 'xy' ? [(p.x - x0) * sc, Hh - (p.y - y0) * sc, p.z] : plane === 'zy' ? [(p.z - x0) * sc, Hh - (p.y - y0) * sc, p.x] : [(p.x - x0) * sc, Hh - (p.z - y0) * sc, p.y];
const cols = { 0: '#888' };
const sheet = [];
function dump(name) {
  let s = `<rect width="${W}" height="${Hh}" fill="#111" stroke="#555"/>`;
  sim.world.forEachCollider((c) => {
    if (!c.isEnabled()) return;
    const t = c.translation(), q = c.rotation(); const sh = c.shape; const g = c.collisionGroups() >>> 16;
    const col = g === 1 ? '#4af' : g === 2 ? '#c96' : g === 4 ? '#6c6' : g === 8 ? '#f55' : g === 16 ? '#ff0' : g === 32 ? '#f80' : g === 64 ? '#f0f' : g === 128 ? '#9c9' : g === 256 ? '#0ff' : g === 512 ? '#ff0' : g === 1024 ? '#f55' : g === 2048 ? '#fa0' : '#555';
    const [px, py, pd] = pr(t); if (pd < zmin || pd > zmax) return;
    if (sh.type === RAPIER.ShapeType.Ball) s += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${(sh.radius * sc).toFixed(1)}" fill="none" stroke="${col}"/>`;
    else if (sh.type === RAPIER.ShapeType.Cuboid) {
      const h = sh.halfExtents; const pts = [];
      for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) { const v = rot(q, { x: sx * h.x, y: sy * h.y, z: sz * h.z }); pts.push(pr({ x: t.x + v.x, y: t.y + v.y, z: t.z + v.z })); }
      const E = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
      for (const [i, j] of E) s += `<line x1="${pts[i][0].toFixed(1)}" y1="${pts[i][1].toFixed(1)}" x2="${pts[j][0].toFixed(1)}" y2="${pts[j][1].toFixed(1)}" stroke="${col}"/>`;
    } else if (sh.type === RAPIER.ShapeType.Capsule) {
      const v = rot(q, { x: 0, y: sh.halfHeight, z: 0 }); const p1 = pr({ x: t.x + v.x, y: t.y + v.y, z: t.z + v.z }), p2 = pr({ x: t.x - v.x, y: t.y - v.y, z: t.z - v.z });
      s += `<line x1="${p1[0].toFixed(1)}" y1="${p1[1].toFixed(1)}" x2="${p2[0].toFixed(1)}" y2="${p2[1].toFixed(1)}" stroke="${col}" stroke-opacity="0.6" stroke-width="${(2 * sh.radius * sc).toFixed(1)}" stroke-linecap="round"/>`;
    }
  });
  // 天条
  s += `<text x="10" y="20" fill="#fff" font-size="16">t=${sim.t.toFixed(3)} wheel=${(sim.wheelAngle() * 57.3).toFixed(2)} heng=${(sim.angZ(sim.bodies.heng) * 57.3).toFixed(2)} fork=${(sim.angZ(sim.bodies.fork) * 57.3).toFixed(2)} hamA=${(sim.angZ(sim.bodies.hamA) * 57.3).toFixed(1)} hamB=${(sim.angZ(sim.bodies.hamB) * 57.3).toFixed(1)}</text>`;
  sheet.push(s);
}
function flush() {
  const cols = sheet.length > 4 ? 2 : 1, rows = Math.ceil(sheet.length / cols);
  let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W * cols}" height="${Hh * rows}">`;
  sheet.forEach((f, i) => { s += `<g transform="translate(${(i % cols) * W},${Math.floor(i / cols) * Hh})">${f}</g>`; });
  s += '</svg>';
  writeFileSync(`${out}/sheet.svg`, s);
  Bun.spawnSync(['rsvg-convert', '-w', String(Math.min(W * cols, 1800)), `${out}/sheet.svg`, '-o', `${out}/sheet.png`]);
}
let next = t0, i = 0;
while (sim.t < t1 + 1e-6) {
  if (sim.t >= next - 1e-6) { dump('f' + String(i++).padStart(3, '0')); next += dt; }
  sim.step(); sim.events.length = 0;
}
flush();
console.log('frames', i, out);
