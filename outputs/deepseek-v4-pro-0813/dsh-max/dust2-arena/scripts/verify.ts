// 无头验证：地图连通性 / 区域覆盖 / 视线遮挡 / 寻路 / 出生点合法性
import { MAP, groundHeightAt, losBlocked, inSite } from '../src/game/map/dust2';
import { NavMesh } from '../src/game/nav';

let failures = 0;
function check(name: string, ok: boolean, detail = '') {
  if (ok) console.log(`  ✓ ${name}`);
  else { failures++; console.log(`  ✗ FAIL: ${name} ${detail}`); }
}

console.log('== Dust2 map verification ==');
const nav = new NavMesh();
console.log(`nav nodes: ${nav.nodes.length}`);

// ---- 所有命名区域可达性（Dust2 实际走位两两连通） ----
const areaPts: Record<string, [number, number]> = {
  T出生点: MAP.waypoints.tSpawn[0],
  A大: MAP.waypoints.aLong[0],
  长门: MAP.waypoints.longDoorsT[0],
  长道坑: MAP.waypoints.pit[0],
  A点: MAP.waypoints.aSite[0],
  CT出生点: MAP.waypoints.ctSpawn[0],
  中门T侧: MAP.waypoints.midT[1],
  CT中: MAP.waypoints.ctMid[0],
  猫道: MAP.waypoints.catTop[0],
  A小道: MAP.waypoints.aShort[0],
  B洞下层: MAP.waypoints.bTunnelLow[0],
  B洞上层: MAP.waypoints.bUpper[0],
  B点: MAP.waypoints.bSite[0],
  B门: MAP.waypoints.bDoors[0],
};

const names = Object.keys(areaPts);
const pairs: [string, string][] = [
  ['T出生点', 'A点'], ['T出生点', 'B点'], ['T出生点', 'CT出生点'],
  ['CT出生点', 'A点'], ['CT出生点', 'B点'],
  ['T出生点', '猫道'], ['T出生点', 'A大'], ['T出生点', 'B洞下层'],
  ['B洞下层', 'B点'], ['B洞上层', 'B点'],
  ['CT中', '猫道'], ['猫道', 'A小道'], ['A小道', 'A点'],
  ['CT中', '长门'], ['长门', 'A大'], ['A大', 'A点'], ['长道坑', 'A点'],
  ['CT中', 'B门'], ['B门', 'B点'], ['CT中', 'CT出生点'], ['CT中', 'A点'],
  ['B洞下层', 'B洞上层'], ['A大', '长道坑'],
];
for (const [a, b] of pairs) {
  const [x0, z0] = areaPts[a];
  const [x1, z1] = areaPts[b];
  const p = nav.findPath(x0, z0, x1, z1);
  check(`${a} → ${b}`, !!p, p ? `(${p.length} pts)` : 'NO PATH');
}

// ---- 地面高度关键点 ----
check('猫道高度 3m', Math.abs(groundHeightAt(15, -8) - 3) < 0.01);
check('A点地面 0m', Math.abs(groundHeightAt(30, -15)) < 0.01);
check('B洞上层 1.5m', Math.abs(groundHeightAt(-27, -17.5) - 1.5) < 0.01);
check('B洞下层 0m', Math.abs(groundHeightAt(-27, 5)) < 0.01);
check('中门缺口可站', groundHeightAt(0, 4) >= 0);

// ---- 视线遮挡 ----
// 中门门体挡住 T 侧 → CT 中的视线
check('中门门体挡视线', losBlocked(0, 1.6, 5.5, 0, 1.6, -2));
// 门体上方（门高 2.3，眼高 1.6 加跳）——1.6 眼高被挡 ✓
// A大 ↔ 中 之间被墙隔开
check('A大↔中 被墙隔开', losBlocked(29, 1.6, 10, 0, 1.6, 10));
// 长门门体挡视线
check('长门门体挡视线', losBlocked(10, 1.6, -4, 15, 1.6, -4));
// A点内部视线畅通（无墙）
check('A点内部视线畅通', !losBlocked(20, 1.6, -14, 33, 1.6, -20));
// 长道坑 → A点畅通
check('长道坑→A点畅通', !losBlocked(29, 1.6, -8.5, 30, 1.6, -15));
// B点内部畅通
check('B点内部视线畅通', !losBlocked(-29, 1.6, -20, -21, 1.6, -23));

// ---- 出生点合法（不在墙/箱内，地面存在） ----
for (const team of ['T', 'CT'] as const) {
  for (const [x, z] of MAP.spawns[team]) {
    const h = groundHeightAt(x, z);
    const blocked = MAP.colliders.some((c) => x > c.minX && x < c.maxX && z > c.minZ && z < c.maxZ && h + 0.5 < c.maxY && h + 0.5 > c.minY);
    check(`${team} 出生点 (${x},${z}) 合法`, h > -1e8 && !blocked, `h=${h}`);
  }
}

// ---- 下包区在点内 ----
for (const [x, z] of MAP.plantSpots.A) check(`A 下包点 (${x},${z}) 在 A 点`, inSite(x, z, 'A'));
for (const [x, z] of MAP.plantSpots.B) check(`B 下包点 (${x},${z}) 在 B 点`, inSite(x, z, 'B'));

// ---- 墙不堵路：每个出生点到所有下包点可寻路 ----
for (const team of ['T', 'CT'] as const) {
  const [sx, sz] = MAP.spawns[team][0];
  for (const site of ['A', 'B'] as const) {
    for (const [px, pz] of MAP.plantSpots[site]) {
      const p = nav.findPath(sx, sz, px, pz);
      check(`${team}出生点 → ${site}下包点`, !!p);
    }
  }
}

// ---- 猫道跳点：猫道节点不应直接连到 A 点地面节点（高度差） ----
const catNode = nav.nearest(15, -8);
const belowNode = nav.nearest(15.5, -11.5);
check('猫道高度 3m', Math.abs(catNode.h - 3) < 0.3, `h=${catNode.h}`);
check('猫道→A点地面无直接边（悬崖）', !catNode.edges.some((j) => nav.nodes[j] === belowNode));

// ---- 碰撞体不覆盖门洞（中门 x -2..2 可通行） ----
const midDoorBlocked = MAP.colliders.some((c) => c.minX < 0 && c.maxX > 0 && c.minZ < 4 && c.maxZ > 4);
check('中门门洞无实心碰撞体', !midDoorBlocked);
const midDoorsPresent = MAP.doors.some((c) => Math.abs((c.minX + c.maxX) / 2) < 1.01 && c.minZ < 4.05 && c.maxZ > 3.95);
check('中门门体存在（可穿透面板）', midDoorsPresent);

console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);
