/**
 * 地图数据体检：区域是否重叠、Portal 是否真的相邻、开口是否够宽、
 * 出生点/炸弹点/战术点是否落在可行走区域内、区域图是否连通。
 * 用 `node tools/mapcheck.ts` 直接跑（Node 22 原生支持 TS 类型擦除）。
 */

import { rectsOverlap } from '../src/core/math.ts';
import {
  AREAS,
  BOMB_SITES,
  CT_SPAWNS,
  PORTALS,
  PROPS,
  T_SPAWNS,
  TACTICAL_POINTS,
  WALL_THICKNESS,
} from '../src/map/dust2.ts';
import { areaAt, buildMap } from '../src/map/build.ts';

const problems: string[] = [];
const warnings: string[] = [];

function fail(msg: string) {
  problems.push(msg);
}

// 1. 区域不能互相重叠
for (let i = 0; i < AREAS.length; i++) {
  for (let j = i + 1; j < AREAS.length; j++) {
    if (rectsOverlap(AREAS[i], AREAS[j])) {
      fail(`区域重叠: ${AREAS[i].id} 与 ${AREAS[j].id}`);
    }
  }
}

// 2. 区域矩形合法
for (const a of AREAS) {
  if (a.x1 - a.x0 < 2 * WALL_THICKNESS + 1.6 || a.z1 - a.z0 < 2 * WALL_THICKNESS + 1.6) {
    fail(`区域 ${a.id} 去掉墙厚后太窄`);
  }
}

// 3. Portal 解析 + 宽度检查
const built = buildMap();
for (const p of built.portals) {
  const w = p.hi - p.lo;
  if (w < 1.8) fail(`通道 ${p.a.id}<->${p.b.id} 开口只有 ${w.toFixed(2)}m，玩家挤不过去`);
  // 开口必须落在双方共享边的范围内
  const shared =
    p.axis === 'x'
      ? [Math.max(p.a.z0, p.b.z0), Math.min(p.a.z1, p.b.z1)]
      : [Math.max(p.a.x0, p.b.x0), Math.min(p.a.x1, p.b.x1)];
  if (p.lo < shared[0] - 1e-6 || p.hi > shared[1] + 1e-6) {
    fail(`通道 ${p.a.id}<->${p.b.id} 的 clip 超出共享边 [${shared[0]}, ${shared[1]}]`);
  }
  const dy = Math.abs(p.a.y - p.b.y);
  if (dy > 2.0) warnings.push(`通道 ${p.a.id}<->${p.b.id} 高差 ${dy.toFixed(1)}m，台阶会很长`);
}

// 4. 区域图连通性（BFS）
{
  const seen = new Set<string>(['tspawn']);
  const queue = ['tspawn'];
  while (queue.length) {
    const cur = queue.shift()!;
    for (const nb of built.adjacency.get(cur) ?? []) {
      if (!seen.has(nb)) {
        seen.add(nb);
        queue.push(nb);
      }
    }
  }
  for (const a of AREAS) {
    if (!seen.has(a.id)) fail(`区域 ${a.id} 与 T 出生点不连通`);
  }
}

// 5. 必须包含的关键区域
const required = [
  'tspawn',
  'ct_spawn',
  'long_a',
  'a_site',
  'mid',
  'catwalk',
  'lower_tun',
  'upper_tun',
  'b_site',
];
for (const id of required) {
  if (!built.areaById.has(id)) fail(`缺少关键区域 ${id}`);
}

// 6. 出生点 / 战术点 / 下包点必须在区域内且不被掩体占住
function checkPoint(label: string, x: number, z: number) {
  const a = areaAt(x, z);
  if (!a) {
    fail(`${label} (${x}, ${z}) 不在任何区域内`);
    return;
  }
  // 距离区域边界至少留出墙厚 + 玩家半径
  const m = WALL_THICKNESS + 0.5;
  if (x < a.x0 + m || x > a.x1 - m || z < a.z0 + m || z > a.z1 - m) {
    warnings.push(`${label} (${x}, ${z}) 贴着 ${a.id} 的墙`);
  }
  const y = a.y;
  if (built.world.overlapBox(x - 0.4, y + 0.1, z - 0.4, x + 0.4, y + 1.8, z + 0.4)) {
    fail(`${label} (${x}, ${z}) 被掩体/墙卡住`);
  }
}

T_SPAWNS.forEach((s, i) => checkPoint(`T 出生点#${i}`, s.x, s.z));
CT_SPAWNS.forEach((s, i) => checkPoint(`CT 出生点#${i}`, s.x, s.z));
TACTICAL_POINTS.forEach((s, i) => checkPoint(`战术点#${i}(${s.tag})`, s.x, s.z));
BOMB_SITES.forEach((s) => checkPoint(`${s.id} 点默认下包位`, s.plantX, s.plantZ));

// 7. 炸弹点范围必须落在某个区域里
for (const site of BOMB_SITES) {
  const corners: Array<[number, number]> = [
    [site.x0, site.z0],
    [site.x1, site.z0],
    [site.x0, site.z1],
    [site.x1, site.z1],
  ];
  for (const [x, z] of corners) {
    if (!areaAt(x, z)) fail(`炸弹点 ${site.id} 的角 (${x}, ${z}) 在区域之外`);
  }
}

// 8. 掩体必须落在区域内（否则会浮在空中）
PROPS.forEach((p, i) => {
  const cx = (p.x0 + p.x1) / 2;
  const cz = (p.z0 + p.z1) / 2;
  const a = areaAt(cx, cz);
  if (!a) {
    fail(`掩体#${i} (${p.tag ?? p.kind}) 中心不在任何区域内`);
    return;
  }
  if (Math.abs(p.y - a.y) > 0.05 && p.y < a.y) {
    warnings.push(`掩体#${i} (${p.tag ?? p.kind}) 底面 ${p.y} 低于地面 ${a.y}`);
  }
});

// 9. 掩体不要堵住通道开口
for (const p of built.portals) {
  const pad = 0.2;
  const rect =
    p.axis === 'x'
      ? { x0: p.coord - 1.2, x1: p.coord + 1.2, z0: p.lo + pad, z1: p.hi - pad }
      : { x0: p.lo + pad, x1: p.hi - pad, z0: p.coord - 1.2, z1: p.coord + 1.2 };
  for (const prop of PROPS) {
    if (prop.tag && prop.tag.startsWith('中门')) continue; // 中门门体是有意放在开口里的
    if (rectsOverlap(rect, prop)) {
      warnings.push(`掩体 ${prop.tag ?? prop.kind} 挡住了通道 ${p.a.id}<->${p.b.id}`);
    }
  }
}

console.log(`区域 ${AREAS.length} 个，通道 ${PORTALS.length} 条，掩体 ${PROPS.length} 个`);
console.log(`碰撞体 ${built.world.boxes.length} 个`);
const b = built.world.bounds();
console.log(
  `地图范围 X[${b.x0}, ${b.x1}] Z[${b.z0}, ${b.z1}] = ${(b.x1 - b.x0).toFixed(0)}m x ${(
    b.z1 - b.z0
  ).toFixed(0)}m`,
);

if (warnings.length) {
  console.log(`\n⚠ 警告 ${warnings.length} 条:`);
  for (const w of warnings) console.log('  - ' + w);
}
if (problems.length) {
  console.log(`\n✗ 错误 ${problems.length} 条:`);
  for (const p of problems) console.log('  - ' + p);
  process.exit(1);
}
console.log('\n✓ 地图数据检查通过');
