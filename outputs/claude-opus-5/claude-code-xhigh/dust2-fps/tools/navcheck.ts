/**
 * 导航网格与射线的正确性检查：
 *   - 网格烘焙覆盖率
 *   - 关键点位两两可达（这是"地图连通"的硬性验收）
 *   - 平滑后的路径每一段都真的能走
 *   - 网格 DDA 射线与暴力射线结果一致
 */

import { v3 } from '../src/core/math.ts';
import { Rng } from '../src/core/rng.ts';
import { buildMap } from '../src/map/build.ts';
import { NavGrid } from '../src/map/nav.ts';
import { BOMB_SITES, CT_SPAWNS, T_SPAWNS } from '../src/map/dust2.ts';

const t0 = Date.now();
const map = buildMap();
const nav = new NavGrid(map.world);
const bakeMs = Date.now() - t0;

const stats = nav.stats();
console.log(
  `网格 ${nav.nx} x ${nav.nz} = ${stats.total} 格，可行走 ${stats.walkable} 格 (${(
    (stats.walkable / stats.total) *
    100
  ).toFixed(1)}%)，烘焙耗时 ${bakeMs}ms`,
);

const problems: string[] = [];

interface Spot {
  name: string;
  x: number;
  y: number;
  z: number;
}

const spots: Spot[] = [
  { name: 'T出生点', x: T_SPAWNS[2].x, y: 0, z: T_SPAWNS[2].z },
  { name: 'CT出生点', x: CT_SPAWNS[2].x, y: 0.6, z: CT_SPAWNS[2].z },
  { name: 'A点(下包位)', x: BOMB_SITES[0].plantX, y: 1.0, z: BOMB_SITES[0].plantZ },
  { name: 'B点(下包位)', x: BOMB_SITES[1].plantX, y: 1.2, z: BOMB_SITES[1].plantZ },
  { name: 'A大长廊', x: 50, y: 0, z: 10 },
  { name: '长廊大门', x: 50, y: 0, z: 40 },
  { name: '中门', x: -6, y: 0, z: 16 },
  { name: '中路', x: -6, y: 0, z: 0 },
  { name: '猫道', x: 8, y: 0.4, z: -20 },
  { name: 'A小道', x: 8, y: 0.9, z: -36 },
  { name: 'B洞下层', x: -28, y: 0, z: 34 },
  { name: 'B洞上层', x: -30, y: 1.2, z: 6 },
  { name: 'B门', x: -20, y: 1.0, z: -53 },
  { name: 'CT中路上口', x: -6, y: 0.8, z: -42 },
  { name: '深坑', x: 61, y: -1.2, z: -4 },
  { name: 'A点站台', x: 18, y: 1.9, z: -54 },
];

const path = [] as ReturnType<typeof v3>[];
let pathCount = 0;
let totalMs = 0;

for (const a of spots) {
  for (const b of spots) {
    if (a === b) continue;
    const st = performance.now();
    const ok = nav.findPath(a.x, a.y, a.z, b.x, b.y, b.z, path);
    totalMs += performance.now() - st;
    pathCount++;
    if (!ok) {
      problems.push(`${a.name} -> ${b.name} 走不通`);
      continue;
    }
    // 终点必须真的靠近目标
    const last = path[path.length - 1];
    const d = Math.hypot(last.x - b.x, last.z - b.z);
    if (d > 2.5) {
      problems.push(`${a.name} -> ${b.name} 只到了 ${d.toFixed(1)}m 之外`);
    }
    // 平滑后每一段都必须可走
    let px = a.x;
    let pz = a.z;
    let py = a.y;
    for (const wp of path) {
      if (!nav.lineWalkableWorld(px, pz, wp.x, wp.z, py, wp.y)) {
        problems.push(`${a.name} -> ${b.name} 平滑后有一段穿墙 (${px.toFixed(1)},${pz.toFixed(1)}) -> (${wp.x.toFixed(1)},${wp.z.toFixed(1)})`);
        break;
      }
      px = wp.x;
      pz = wp.z;
      py = wp.y;
    }
  }
}

console.log(`寻路 ${pathCount} 次，平均 ${(totalMs / pathCount).toFixed(2)}ms/次`);

// 几条有代表性的路线的长度
function routeLen(a: Spot, b: Spot): number {
  if (!nav.findPath(a.x, a.y, a.z, b.x, b.y, b.z, path)) return -1;
  let len = 0;
  let px = a.x;
  let pz = a.z;
  for (const wp of path) {
    len += Math.hypot(wp.x - px, wp.z - pz);
    px = wp.x;
    pz = wp.z;
  }
  return len;
}
const byName = (n: string) => spots.find((s) => s.name === n)!;
for (const [from, to] of [
  ['T出生点', 'A点(下包位)'],
  ['T出生点', 'B点(下包位)'],
  ['CT出生点', 'A点(下包位)'],
  ['CT出生点', 'B点(下包位)'],
  ['T出生点', '中门'],
] as Array<[string, string]>) {
  const len = routeLen(byName(from), byName(to));
  console.log(`  ${from} -> ${to}: ${len.toFixed(0)}m (约 ${(len / 5.4).toFixed(0)}s)`);
}

// 射线：网格 DDA vs 暴力
{
  const rng = new Rng(12345);
  let mismatches = 0;
  for (let i = 0; i < 4000; i++) {
    const ox = rng.range(-56, 64);
    const oy = rng.range(0.2, 4);
    const oz = rng.range(-58, 66);
    let dx = rng.gaussian();
    let dy = rng.gaussian() * 0.3;
    let dz = rng.gaussian();
    const l = Math.hypot(dx, dy, dz);
    if (l < 1e-6) continue;
    dx /= l;
    dy /= l;
    dz /= l;
    const a = map.world.raycast(ox, oy, oz, dx, dy, dz, 200);
    const b = map.world.raycastBrute(ox, oy, oz, dx, dy, dz, 200);
    const ta = a ? a.t : Infinity;
    const tb = b ? b.t : Infinity;
    if (Math.abs(ta - tb) > 1e-4) {
      if (mismatches < 5) {
        problems.push(
          `射线不一致 @(${ox.toFixed(1)},${oy.toFixed(1)},${oz.toFixed(1)}) dir(${dx.toFixed(
            2,
          )},${dy.toFixed(2)},${dz.toFixed(2)}): DDA=${ta.toFixed(3)} 暴力=${tb.toFixed(3)}`,
        );
      }
      mismatches++;
    }
  }
  console.log(`射线一致性: 4000 条中 ${mismatches} 条不一致`);
}

// 射线性能
{
  const rng = new Rng(777);
  const N = 20000;
  const st = performance.now();
  let hits = 0;
  for (let i = 0; i < N; i++) {
    const dx = rng.gaussian();
    const dz = rng.gaussian();
    const l = Math.hypot(dx, dz) || 1;
    if (map.world.raycast(0, 1.6, 0, dx / l, 0, dz / l, 120)) hits++;
  }
  const ms = performance.now() - st;
  console.log(`射线性能: ${N} 条耗时 ${ms.toFixed(0)}ms (${((ms / N) * 1000).toFixed(1)}µs/条)`);
}

if (problems.length) {
  console.log(`\n✗ 问题 ${problems.length} 条:`);
  for (const p of problems.slice(0, 30)) console.log('  - ' + p);
  process.exit(1);
}
console.log('\n✓ 导航与射线检查通过');
