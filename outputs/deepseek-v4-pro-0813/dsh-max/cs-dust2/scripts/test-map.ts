// 地图连通性 / 寻路 / 视线测试
import { navGrid, losClear, colliders } from '../src/game/map';
import { resolveMove, v3 } from '../src/game/math';

let failures = 0;
const check = (name: string, ok: boolean, detail = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`);
  if (!ok) failures++;
};

// 1. 各区域代表点之间的连通性
const zonePoints: [string, number, number, number][] = [
  ['T出生点', 30, 30, 0],
  ['T中庭(中门北)', 4, -20, 0],
  ['中路', 0, 4, 0],
  ['CT出生点', -30, 30, 0],
  ['CT坡道', -48, -18, 0],
  ['A点', -40, -45, 1.2],
  ['A大', 63, -30, 0],
  ['A大横段', 30, -52, 0],
  ['B洞', 34, -20, 0],
  ['下连通道', 20, -24, -2],
  ['B点', 44, -38, 1.2],
  ['中门->B西段', 8, -15, 0],
  ['上层走廊', 22, -30, 1.2],
  ['B门门厅', 27.5, -39, 1.2],
  ['窗户门厅', 27.5, -30, 1.2],
  ['猫道', 12, -24, 3.2],
];

const pairs: [string, string][] = [
  ['T出生点', 'A点'], ['T出生点', 'A大'], ['T出生点', 'T中庭(中门北)'],
  ['T出生点', 'B洞'], ['T出生点', 'B点'], ['T出生点', '下连通道'],
  ['T中庭(中门北)', '中路'], ['T中庭(中门北)', '下连通道'], ['T中庭(中门北)', 'B洞'],
  ['CT出生点', '中路'], ['CT出生点', 'CT坡道'], ['CT出生点', 'A点'],
  ['CT出生点', 'B点'], ['CT出生点', '猫道'], ['CT出生点', '中门->B西段'],
  ['中路', '猫道'], ['中路', 'B点'], ['中路', 'A点'],
  ['A大', 'A点'], ['A大横段', 'A点'], ['A大', 'B点'],
  ['B洞', 'B点'], ['下连通道', 'B洞'], ['上层走廊', 'B点'],
  ['窗户门厅', 'B点'], ['B门门厅', 'B点'], ['猫道', 'A点'], ['猫道', '上层走廊'],
  ['中门->B西段', '上层走廊'],
];

for (const [a, b] of pairs) {
  const pa = zonePoints.find((z) => z[0] === a)!;
  const pb = zonePoints.find((z) => z[0] === b)!;
  const path = navGrid.path(pa[1], pa[3], pa[2], pb[1], pb[2], pb[3]);
  check(`寻路 ${a} -> ${b}`, !!path, path ? `节点数 ${path.length}` : '');
}

// 2. 层高检查（验证猫道/平台/下连通道）
const y1 = navGrid.floorYAt(0, 4);        // 中路 y=0
const y2 = navGrid.floorYAt(-40, -45);    // A点 y=1.2
const y3 = navGrid.floorYAt(0, -24);      // 猫道下方（T中庭）最低层 y=0，最高层 3.2
const y4 = navGrid.floorYAt(24, -24);     // 下连通道 y=-2
check('中路地面 y=0', y1 === 0, `y=${y1}`);
check('A点平台 y=1.2', y2 === 1.2, `y=${y2}`);
check('猫道下方最低层 y=0', y3 === 0, `y=${y3}`);
check('下连通道 y=-2', y4 === -2, `y=${y4}`);

// 猫道路径必须经过 3.2 层
{
  const path = navGrid.path(-48, 0, 24, 0, -24, 3.2); // CT出生点 -> 猫道
  const maxY = path ? Math.max(...path.map((p) => p.y)) : -99;
  check('CT出生点->猫道路径登上 3.2 层', !!path && maxY >= 3.1, `maxY=${maxY.toFixed(2)}`);
}
// 下连通道路径经过 -2 层
{
  const path = navGrid.path(4, 0, -20, 24, -24, -2); // T中庭 -> 下连通道
  const minY = path ? Math.min(...path.map((p) => p.y)) : 99;
  check('T中庭->下连通道路径下到 -2 层', !!path && minY <= -1.9, `minY=${minY.toFixed(2)}`);
}

// 3. 视线判定
check('中路到中门对面被墙挡', !losClear(0, 1.6, -16, 0, 1.6, -20));
check('A点与中路之间被墙挡', !losClear(-40, 2.8, -44, 0, 1.6, 4));
check('开阔区域视线畅通', losClear(30, 1.6, 30, 30, 1.6, 20));
check('猫道可俯瞰T中庭', losClear(0, 4.8, -22.4, 0, 1.6, -20));
check('B窗户可透视线', losClear(24, 2.8, -30, 30, 2.8, -30));

// 4. 物理碰撞：玩家无法穿墙
{
  const prev = v3(0, 0, -59);
  const next = v3(0, 0, -60);
  resolveMove(prev, next, 0.3, 1.8, colliders);
  check('玩家无法穿过外墙', next.z >= -59.9, `z=${next.z.toFixed(2)}`);
}
{
  // A点平台边缘：地面玩家推不上去
  const pos = v3(-40, 0, -30.6);
  for (let i = 0; i < 120; i++) {
    const prev = { ...pos };
    pos.z -= 0.05;
    resolveMove(prev, pos, 0.3, 1.8, colliders);
  }
  check('地面玩家被A点平台挡住', pos.z > -32.1, `z=${pos.z.toFixed(2)}`);
}
{
  // 登台阶：CT坡道
  const pos = v3(-49, 0, -28.6);
  for (let i = 0; i < 90; i++) {
    const prev = { ...pos };
    pos.z -= 0.04;
    const r1 = resolveMove(prev, pos, 0.3, 1.8, colliders);
    if (r1.hitWallZ) {
      // 抬升后重试（自动登台阶）
      const liftedPrev = { ...prev, y: prev.y + 0.56 };
      const lifted = { ...pos, y: pos.y + 0.56 };
      const r2 = resolveMove(liftedPrev, lifted, 0.3, 1.8, colliders);
      if (!r2.hitWallZ) {
        pos.y = lifted.y;
        pos.z = lifted.z;
        continue;
      }
      // 抬升不了：贴墙站住
      resolveMove(prev, pos, 0.3, 1.8, colliders);
      break;
    }
  }
  check('玩家可登台阶上升', pos.y >= 0.25, `y=${pos.y.toFixed(2)} z=${pos.z.toFixed(2)}`);
}

// 5. 出生点都在可行走区域
import { spawns } from '../src/game/map';
for (const team of ['T', 'CT'] as const) {
  for (const p of spawns[team]) {
    const y = navGrid.floorYAt(p.x, p.z);
    check(`出生点 ${team}(${p.x},${p.z}) 可行走`, y !== null, `y=${y}`);
  }
}

console.log(failures === 0 ? '\n=== 全部通过 ===' : `\n=== ${failures} 项失败 ===`);
if (failures > 0) throw new Error(`${failures} 项失败`);
