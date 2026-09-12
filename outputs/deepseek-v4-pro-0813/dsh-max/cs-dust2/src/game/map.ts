// Dust2 核心区域程序化地图：墙体/地板/楼梯数据 + 寻路网格 + 视线判定
// 坐标系：+X 东，+Z 南（-Z 北），y 向上。单位：米。

import { AABB, dist2D } from './math';

export interface BoxDef {
  x0: number; z0: number; x1: number; z1: number; y0: number; y1: number;
  color: string;
  penetrable?: boolean; // 子弹可穿透（中门）
  step?: boolean;       // 楼梯台阶：碰撞但不阻挡寻路网格
  rail?: boolean;
  walkable?: boolean;   // 顶面可行走（不作为寻路障碍）
  floor?: boolean;      // 纯地板：仅碰撞（不渲染为墙）
}

export interface WalkArea { x0: number; z0: number; x1: number; z1: number; y: number; thin?: boolean }

const B = (
  x0: number, z0: number, x1: number, z1: number, y0: number, y1: number,
  color = '#c9ab78', opts: Partial<BoxDef> = {}
): BoxDef => ({ x0, z0, x1, z1, y0, y1, color, ...opts });

const WALL = '#c9ab78';
const FILL = '#b0986a';
const ROCK = '#b5a184';
const DOOR = '#5d4630';

const boxes: BoxDef[] = [];

// ============ 外墙 ============
boxes.push(B(-60, -60.6, 66, -59.8, 0, 4.4, WALL));   // 北
boxes.push(B(65.8, -60.6, 66.6, 60.6, 0, 4.4, WALL)); // 东
boxes.push(B(-60.6, 59.8, 66.6, 60.6, 0, 4.4, WALL)); // 南
boxes.push(B(-60.6, -60.6, -59.8, 60.6, 0, 4.4, WALL)); // 西

// ============ 中门（可穿透门体 + 两侧墙体，x∈[10,14] 为猫梯井缺口）============
boxes.push(B(-8.4, -18.4, 0, -17.6, 0, 4.4, WALL));
boxes.push(B(4, -18.4, 10, -17.6, 0, 4.4, WALL));
boxes.push(B(14, -18.4, 15.6, -17.6, 0, 4.4, WALL));
// 门体单独管理（可被推开），不进入静态碰撞体
export const doorDef = { x0: 0, z0: -18.25, x1: 4, z1: -17.75, y0: 0, y1: 4.2, color: DOOR };
export const doorPanels = [
  { x0: 0, x1: 2, hinge: -1 },  // hinge -1 = 左侧转轴
  { x0: 2, x1: 4, hinge: 1 },
];

// ============ 中路 ============
boxes.push(B(-8.4, -18.4, -7.6, 10.4, 0, 4.4, WALL));
boxes.push(B(3.6, -12.4, 4.4, 10.4, 0, 4.4, WALL));

// ============ CT 出生点（与中路南端连成开放庭院）============
boxes.push(B(-40.4, 9.6, -8, 10.4, 0, 4.4, WALL));
boxes.push(B(3.6, 10, 4.4, 60, 0, 4.4, WALL));
boxes.push(B(-60, 10, -54, 60, 0, 4.4, FILL));    // 出生点西侧填充

// ============ A 点平台（y=1.2 高原）============
boxes.push(B(-58, -58, -22, -32, 0, 1.2, '#d0b184', { walkable: true }));

// ============ CT 坡道（CT spawn -> A 点）============
boxes.push(B(-54.4, -28, -53.6, 10, 0, 4.4, WALL));
boxes.push(B(-40.4, -28, -39.6, 10, 0, 4.4, WALL));
boxes.push(B(-60, -32, -54, 10, 0, 4.4, FILL));
// 坡道台阶
boxes.push(B(-54, -29, -44, -28, 0, 0.3, '#d8c093', { step: true }));
boxes.push(B(-54, -30, -44, -29, 0, 0.6, '#d8c093', { step: true }));
boxes.push(B(-54, -31, -44, -30, 0, 0.9, '#d8c093', { step: true }));
boxes.push(B(-54, -32, -44, -31, 0, 1.2, '#d8c093', { step: true }));

// ============ A 大（T 侧长走廊，东侧 L 形）============
boxes.push(B(56.6, -58, 57.4, -10, 0, 4.4, WALL));
boxes.push(B(56.6, 0, 57.4, 10, 0, 4.4, WALL));
boxes.push(B(54.6, -14, 55.4, -10, 0, 4.4, WALL));
boxes.push(B(54.6, 0, 55.4, 60, 0, 4.4, WALL));
boxes.push(B(55.4, -14, 56.6, -10, 0, 4.4, FILL));   // 缝隙填充
boxes.push(B(-24.4, -46.4, 57, -45.6, 0, 4.4, WALL)); // 长走廊横段南墙
// A 大尽头台阶（从东侧上行：0.3 → 0.6 → 0.9 → 平台 1.2）
boxes.push(B(-21.6, -52, -21.3, -46, 0, 0.3, '#d8c093', { step: true }));
boxes.push(B(-21.9, -52, -21.6, -46, 0, 0.6, '#d8c093', { step: true }));
boxes.push(B(-22.2, -52, -21.9, -46, 0, 0.9, '#d8c093', { step: true }));
// A 点东北死区护栏
boxes.push(B(-22.2, -58, -21.8, -52, 1.2, 2.2, WALL, { rail: true }));
// 北部死区填充
boxes.push(B(-60, -60, -24, -58, 0, 4.4, FILL));
boxes.push(B(-22, -46, 4, -32, 0, 4.4, FILL));

// ============ A 点南墙外填充（死屋顶）============
boxes.push(B(-40, -32, -27, -18, 0, 4.4, FILL));

// ============ T 中庭 / T 出生点 ============
boxes.push(B(46, -14.4, 55, -13.6, 0, 4.4, WALL));
boxes.push(B(9.6, -12.3, 10.4, 60, 0, 4.4, WALL));
boxes.push(B(4, -12.3, 10, 60, 0, 4.4, FILL));
// T 中庭（中门北侧）西墙
boxes.push(B(-8.4, -26, -7.6, -18, 0, 4.4, WALL));
boxes.push(B(-24, -22, -8, -18, 0, 4.4, FILL));

// ============ 中门 -> B 的 CT 走廊 ============
// CT 房间（地面层，x∈[4,16]）
boxes.push(B(4, -12.3, 20.4, -11.5, 0, 4.4, WALL));       // 南墙
boxes.push(B(15.6, -17.6, 16.4, -12, 0, 4.4, WALL));      // 东墙（隔开 T 绕行带）
boxes.push(B(16.4, -17.7, 20.4, -17.1, 0, 4.4, WALL));    // 坡道南侧封墙
// 猫梯井（x∈[9.6,14.4]，通到猫道）
boxes.push(B(9.6, -22, 10.4, -13.25, 0, 4.4, WALL));
boxes.push(B(13.6, -22, 14.4, -13.25, 0, 4.4, WALL));
boxes.push(B(10, -13.25, 14, -12, 0, 0.4, '#d8c093', { step: true }));
boxes.push(B(10, -14.5, 14, -13.25, 0, 0.8, '#d8c093', { step: true }));
boxes.push(B(10, -15.75, 14, -14.5, 0, 1.2, '#d8c093', { step: true }));
boxes.push(B(10, -17, 14, -15.75, 0, 1.6, '#d8c093', { step: true }));
boxes.push(B(10, -18.25, 14, -17, 0, 2.0, '#d8c093', { step: true }));
boxes.push(B(10, -19.5, 14, -18.25, 0, 2.4, '#d8c093', { step: true }));
boxes.push(B(10, -20.75, 14, -19.5, 0, 2.8, '#d8c093', { step: true }));
boxes.push(B(10, -22, 14, -20.75, 0, 3.2, '#d8c093', { step: true }));
// 上桥坡道（x∈[16,20]，0.4 级差，通到桥板 2.2）
boxes.push(B(16, -18.4, 20, -17.6, 0, 0.4, '#d8c093', { step: true }));
boxes.push(B(16, -19.2, 20, -18.4, 0, 0.8, '#d8c093', { step: true }));
boxes.push(B(16, -20, 20, -19.2, 0, 1.2, '#d8c093', { step: true }));
boxes.push(B(16, -20.8, 20, -20, 0, 1.6, '#d8c093', { step: true }));
boxes.push(B(16, -21.6, 20, -20.8, 0, 2.0, '#d8c093', { step: true }));
boxes.push(B(16, -22.4, 20, -21.6, 0, 2.2, '#d8c093', { step: true }));
boxes.push(B(19.6, -22.4, 20.4, -17.6, 0, 2.2, WALL));    // 坡道东墙
// 上层走廊平台体（x∈[20,26]，y=1.2）
boxes.push(B(20, -46, 26, -26, 0, 1.2, '#d0b184', { walkable: true }));
boxes.push(B(19.6, -46, 20.4, -26, 1.2, 4.4, WALL));      // 平台西墙
// 平台东墙（缺口：B门门厅 / 窗户门厅）
boxes.push(B(25.6, -46, 26.4, -42, 1.2, 4.4, WALL));
boxes.push(B(25.6, -36, 26.4, -32, 1.2, 4.4, WALL));
boxes.push(B(25.6, -28, 26.4, -26, 1.2, 4.4, WALL));
boxes.push(B(25.6, -42, 26.4, -36, 3.2, 5.2, WALL));      // B 门过梁（开口高 2m）
boxes.push(B(25.6, -32, 26.4, -28, 1.2, 2.2, WALL));      // 窗台
boxes.push(B(25.6, -32, 26.4, -28, 3.2, 5.2, WALL));      // 窗楣
// 桥板（x∈[20,26]，y=2.2，跨过 T 中庭东侧）
boxes.push(B(20, -23.2, 26, -18, 1.8, 2.2, '#d0b184', { walkable: true }));
// 桥板与走廊之间台阶
boxes.push(B(20, -26, 26, -24.6, 1.2, 1.7, '#d8c093', { step: true }));
boxes.push(B(20, -24.6, 26, -23.2, 1.2, 2.2, '#d8c093', { step: true }));
// B 门门厅（y=1.2）
boxes.push(B(26, -42, 29, -36, 0, 1.2, '#d0b184', { walkable: true }));
// 窗户门厅（y=1.2）
boxes.push(B(26, -32, 29, -28, 0, 1.2, '#d0b184', { walkable: true }));
// 门厅间填充
boxes.push(B(26, -36, 29, -32, 0, 3.2, FILL));
boxes.push(B(26, -28, 29, -26, 0, 3.2, FILL));
boxes.push(B(26, -46, 29, -42, 0, 4.4, FILL));
boxes.push(B(26, -46, 28, -42, 0, 4.4, FILL));   // 平台东侧填充
boxes.push(B(26, -36, 28, -32, 0, 4.4, FILL));
boxes.push(B(26, -28, 28, -26, 0, 4.4, FILL));
boxes.push(B(26, -22, 28, -17.6, 0, 4.4, FILL)); // 隧道西侧填充

// ============ 下连通道（T中庭 <-> B洞，y=-2 下沉）============
boxes.push(B(16.5, -26.4, 20, -26, -2, 4.4, WALL));
boxes.push(B(20, -26.4, 26, -26, -2, 0, WALL));
boxes.push(B(20.4, -21.6, 28, -20.8, -2, 4.4, WALL));
boxes.push(B(16, -21.6, 20, -20.8, -2, 0, WALL));  // 坡道下封底
boxes.push(B(27.6, -24, 28.4, -22, -2, 0, WALL));
boxes.push(B(15.6, -24, 16.4, -22, -2, 3.2, WALL)); // 西墙
// 下连通道台阶（西口，每级一格，从 T 中庭下）
boxes.push(B(15.6, -26, 16.5, -24, -0.4, 0, '#d8c093', { step: true }));
boxes.push(B(16.5, -26, 17.4, -24, -0.8, -0.4, '#d8c093', { step: true }));
boxes.push(B(17.4, -26, 18.3, -24, -1.2, -0.8, '#d8c093', { step: true }));
boxes.push(B(18.3, -26, 19.2, -24, -1.6, -1.2, '#d8c093', { step: true }));
boxes.push(B(19.2, -26, 20.1, -24, -2, -1.6, '#d8c093', { step: true }));
// 下连通道台阶（东口，每级一格，上到 B 洞）
boxes.push(B(27.0, -26, 27.9, -24, -2, -1.6, '#d8c093', { step: true }));
boxes.push(B(27.9, -26, 28.8, -24, -2, -1.2, '#d8c093', { step: true }));
boxes.push(B(28.8, -26, 29.7, -24, -2, -0.8, '#d8c093', { step: true }));
boxes.push(B(29.7, -26, 30.6, -24, -2, -0.4, '#d8c093', { step: true }));
boxes.push(B(30.6, -26, 31.5, -24, -2, 0, '#d8c093', { step: true }));

// ============ B 洞（隧道）============
boxes.push(B(27.6, -22, 28.4, -14, 0, 4.4, WALL));
boxes.push(B(45.6, -26, 46.4, -14, 0, 4.4, WALL));
boxes.push(B(28, -26.4, 38, -26, 0, 4.4, WALL));
// B 洞上 B 点台阶
boxes.push(B(38, -23.33, 46, -22, 0, 0.4, '#d8c093', { step: true }));
boxes.push(B(38, -24.67, 46, -23.33, 0, 0.8, '#d8c093', { step: true }));
boxes.push(B(38, -26, 46, -24.67, 0, 1.2, '#d8c093', { step: true }));
// B4 填充（隧道与A大之间）
boxes.push(B(46, -26, 57, -14, 0, 4.4, FILL));

// ============ B 点平台（y=1.2）============
boxes.push(B(29, -46, 58, -26, 0, 1.2, '#d0b184', { walkable: true }));
boxes.push(B(45.6, -26.4, 58, -25.6, 1.2, 4.4, WALL));
boxes.push(B(57.6, -46, 58.4, -26, 1.2, 4.4, WALL));
boxes.push(B(28.6, -46, 29.4, -42, 1.2, 4.4, WALL));
boxes.push(B(28.6, -36, 29.4, -32, 1.2, 4.4, WALL));
boxes.push(B(28.6, -28, 29.4, -26, 1.2, 4.4, WALL));

// ============ 猫道 ============
// 猫道西段填充（顶部 3.2 可行走）
boxes.push(B(-22, -32, 15.6, -26, 0, 3.2, FILL, { walkable: true }));
boxes.push(B(-27, -26, -8, -22, 0, 3.2, FILL, { walkable: true }));
// 猫道悬空板（跨过 T 中庭与下连通道西段）
boxes.push(B(-8, -26, 20, -22, 3.2, 3.6, '#d8c093', { walkable: true }));
// 猫道护栏（猫梯井出口留缺口）
boxes.push(B(-8, -22.3, 10, -22, 3.2, 3.9, WALL, { rail: true }));
boxes.push(B(14, -22.3, 20, -22, 3.2, 3.9, WALL, { rail: true }));
boxes.push(B(-8, -26, 20, -25.7, 3.2, 3.9, WALL, { rail: true }));
boxes.push(B(-22, -26.3, -8, -26, 3.2, 3.9, WALL, { rail: true }));
// 猫道下 A 点台阶（支撑体 + 3 级台阶）
boxes.push(B(-27, -32, -22, -26, 0, 1.2, '#d0b184', { walkable: true }));
boxes.push(B(-23, -32, -22, -27, 1.2, 2.7, '#d8c093', { step: true }));
boxes.push(B(-24, -32, -23, -27, 1.2, 2.2, '#d8c093', { step: true }));
boxes.push(B(-25, -32, -24, -27, 1.2, 1.7, '#d8c093', { step: true }));
boxes.push(B(-27, -32, -23.1, -26, 3.2, 3.6, '#d8c093', { walkable: true })); // 猫道西延板
// A 点与猫道之间的大岩石
boxes.push(B(-22, -46, 15.6, -32, 0, 4.4, ROCK));

// ============ 木箱 ============
const crate = (cx: number, cz: number, w: number, h: number, baseY: number) =>
  B(cx - w / 2, cz - w / 2, cx + w / 2, cz + w / 2, baseY, baseY + h, '#8a6a45');boxes.push(crate(-46, -52, 2.2, 1.2, 1.2)); // A 点
boxes.push(crate(-36, -46, 1.6, 1.1, 1.2));
boxes.push(crate(-54, -44, 1.3, 1.0, 1.2));
boxes.push(crate(42, -40, 2.6, 1.5, 1.2));  // B 点
boxes.push(crate(37, -33, 1.5, 1.1, 1.2));
boxes.push(crate(50, -46, 1.6, 1.2, 1.2));
boxes.push(crate(24, -30, 1.2, 1.2, 1.2));  // xbox（窗户门厅）
boxes.push(crate(-3, 2, 1.6, 1.1, 0));      // 中路
boxes.push(crate(-48, 42, 1.7, 1.1, 0));    // CT 出生点
boxes.push(crate(-20, 46, 1.3, 1.0, 0));
boxes.push(crate(22, 26, 1.8, 1.2, 0));     // T 出生点
boxes.push(crate(44, 20, 1.3, 1.0, 0));
boxes.push(crate(32, -24, 1.4, 1.1, 0));    // B 洞（靠西侧）
boxes.push(crate(2, -22, 1.3, 1.0, 0));     // T 中庭
boxes.push(crate(61, -30, 1.3, 1.0, 0));    // A 大
boxes.push(crate(18, -38, 1.2, 1.0, 1.2));  // 上层走廊
boxes.push(crate(23, -21, 1.2, 1.2, 0));    // T 中庭东

// 台阶盒全部改为薄板（顶部 0.35m），避免同级多级台阶互相遮蔽下层
for (const b of boxes) {
  if (b.step) {
    const top = b.y1;
    b.y0 = top - 0.35;
  }
}

// ============ 可行走区域 ============
export const walkAreas: WalkArea[] = [
  // 地面
  { x0: -54, z0: 10, x1: 4, z1: 60, y: 0 },     // CT 出生点（含中路南端庭院）
  { x0: -54, z0: -28, x1: -40, z1: 10, y: 0 },  // CT 坡道走廊
  { x0: -10, z0: -18, x1: 4, z1: 10, y: 0 },    // 中路
  { x0: 10, z0: -14, x1: 55, z1: 60, y: 0 },    // T 出生点
  { x0: -8, z0: -26, x1: 15.6, z1: -18.4, y: 0 }, // T 中庭（西）
  { x0: 20, z0: -22, x1: 26, z1: -17.6, y: 0 }, // T 中庭（东，桥下）
  { x0: 16.4, z0: -17.1, x1: 26, z1: -14, y: 0 }, // T 绕行带（中门东侧）
  { x0: 4, z0: -18, x1: 16, z1: -12, y: 0 },    // CT 房间
  { x0: 28, z0: -26, x1: 46, z1: -14, y: 0 },   // B 洞
  { x0: 57, z0: -58, x1: 66, z1: 10, y: 0 },    // A 大
  { x0: 55, z0: -10, x1: 57, z1: 0, y: 0 },     // A 大入口
  { x0: 55, z0: 0, x1: 57, z1: 10, y: 0 },      // 入口南侧
  { x0: 57, z0: 10, x1: 66, z1: 60, y: 0 },     // A 大南院
  { x0: -21.3, z0: -60, x1: 66, z1: -46, y: 0 }, // A 大横段
  { x0: -22.6, z0: -60, x1: -21.3, z1: -52, y: 0 }, // A 大横段西端
  // 下连通道（y=-2）
  { x0: 16, z0: -26, x1: 28, z1: -22, y: -2 },
  // 台阶
  { x0: -54, z0: -29, x1: -44, z1: -28, y: 0.3 },
  { x0: -54, z0: -30, x1: -44, z1: -29, y: 0.6 },
  { x0: -54, z0: -31, x1: -44, z1: -30, y: 0.9 },
  { x0: -54, z0: -32, x1: -44, z1: -31, y: 1.2 },
  { x0: 16, z0: -18.4, x1: 20, z1: -17.6, y: 0.4 },
  { x0: 16, z0: -19.2, x1: 20, z1: -18.4, y: 0.8 },
  { x0: 16, z0: -20, x1: 20, z1: -19.2, y: 1.2 },
  { x0: 16, z0: -20.8, x1: 20, z1: -20, y: 1.6 },
  { x0: 16, z0: -21.6, x1: 20, z1: -20.8, y: 2.0 },
  { x0: 16, z0: -22.4, x1: 20, z1: -21.6, y: 2.2 },
  { x0: 15.6, z0: -26, x1: 16.5, z1: -24, y: 0 },
  { x0: 16.5, z0: -26, x1: 17.4, z1: -24, y: -0.4 },
  { x0: 17.4, z0: -26, x1: 18.3, z1: -24, y: -0.8 },
  { x0: 18.3, z0: -26, x1: 19.2, z1: -24, y: -1.2 },
  { x0: 19.2, z0: -26, x1: 20.1, z1: -24, y: -1.6 },
  { x0: 10, z0: -13.25, x1: 14, z1: -12, y: 0.4 },
  { x0: 10, z0: -14.5, x1: 14, z1: -13.25, y: 0.8 },
  { x0: 10, z0: -15.75, x1: 14, z1: -14.5, y: 1.2 },
  { x0: 10, z0: -17, x1: 14, z1: -15.75, y: 1.6 },
  { x0: 10, z0: -18.25, x1: 14, z1: -17, y: 2.0 },
  { x0: 10, z0: -19.5, x1: 14, z1: -18.25, y: 2.4 },
  { x0: 10, z0: -20.75, x1: 14, z1: -19.5, y: 2.8 },
  { x0: 10, z0: -22, x1: 14, z1: -20.75, y: 3.2 },
  { x0: 27.0, z0: -26, x1: 27.9, z1: -24, y: -1.6 },
  { x0: 27.9, z0: -26, x1: 28.8, z1: -24, y: -1.2 },
  { x0: 28.8, z0: -26, x1: 29.7, z1: -24, y: -0.8 },
  { x0: 29.7, z0: -26, x1: 30.6, z1: -24, y: -0.4 },
  { x0: 30.6, z0: -26, x1: 31.5, z1: -24, y: 0 },
  { x0: 38, z0: -23.33, x1: 46, z1: -22, y: 0.4 },
  { x0: 38, z0: -24.67, x1: 46, z1: -23.33, y: 0.8 },
  { x0: 38, z0: -26, x1: 46, z1: -24.67, y: 1.2 },
  { x0: -21.6, z0: -52, x1: -21.3, z1: -46, y: 0.3 },
  { x0: -21.9, z0: -52, x1: -21.6, z1: -46, y: 0.6 },
  { x0: -22.2, z0: -52, x1: -21.9, z1: -46, y: 0.9 },
  // 平台（y=1.2）
  { x0: -58, z0: -58, x1: -21.9, z1: -32, y: 1.2 }, // A 点
  { x0: 29, z0: -46, x1: 58, z1: -26, y: 1.2 },   // B 点
  { x0: 20, z0: -46, x1: 26, z1: -26, y: 1.2 },   // 上层走廊
  { x0: 26, z0: -42, x1: 29, z1: -36, y: 1.2 },   // B 门门厅
  { x0: 26, z0: -32, x1: 29, z1: -28, y: 1.2 },   // 窗户门厅
  // 桥板（y=2.2）
  { x0: 20, z0: -23.2, x1: 26, z1: -18, y: 2.2 },
  { x0: 20, z0: -26, x1: 26, z1: -24.6, y: 1.7 },
  { x0: 20, z0: -24.6, x1: 26, z1: -23.2, y: 2.2 },
  // 猫道（y=3.2）
  { x0: -27, z0: -26, x1: -8, z1: -22, y: 3.2 },
  { x0: -22, z0: -32, x1: 15.6, z1: -26, y: 3.2 },
  { x0: -8, z0: -26, x1: 20, z1: -22, y: 3.2 },
  { x0: -27, z0: -32, x1: -23.1, z1: -26, y: 3.2 }, // 猫道西延板
  // 猫道下 A 点台阶（支撑体顶 + 台阶）
  { x0: -27, z0: -32, x1: -22, z1: -26, y: 1.2 },
  { x0: -23, z0: -32, x1: -22, z1: -27, y: 2.7 },
  { x0: -24, z0: -32, x1: -23, z1: -27, y: 2.2 },
  { x0: -25, z0: -32, x1: -24, z1: -27, y: 1.7 },
];

// 窄条区域（台阶）标记为 thin：寻路层只出现在台阶实体所在的格子
for (const a of walkAreas) {
  if (a.x1 - a.x0 <= 1.6 || a.z1 - a.z0 <= 1.6) a.thin = true;
}

// ============ 出生点 ============
export const spawns = {
  T: [
    { x: 18, z: 24 }, { x: 28, z: 30 }, { x: 38, z: 24 }, { x: 46, z: 30 }, { x: 34, z: 40 },
  ],
  CT: [
    { x: -48, z: 24 }, { x: -38, z: 30 }, { x: -28, z: 24 }, { x: -18, z: 30 }, { x: -44, z: 38 },
  ],
};

// ============ 巡逻 / 防守点位 ============
export const patrolPoints = {
  tSpawn: [
    { x: 20, z: 20 }, { x: 30, z: 26 }, { x: 44, z: 16 }, { x: 30, z: 44 }, { x: 18, z: 44 },
  ],
  tMid: [{ x: 0, z: -21 }, { x: 12, z: -24 }],
  tunnels: [{ x: 32, z: -20 }, { x: 42, z: -24 }, { x: 30, z: -17 }],
  lower: [{ x: 24, z: -24 }],
  aLong: [{ x: 61, z: -20 }, { x: 61, z: -44 }, { x: 50, z: -52 }],
  bSite: [{ x: 36, z: -32 }, { x: 44, z: -40 }, { x: 52, z: -30 }, { x: 44, z: -29 }],
  aSite: [{ x: -30, z: -44 }, { x: -44, z: -50 }, { x: -52, z: -38 }],
  cat: [{ x: 0, z: -24 }, { x: 24, z: -30 }],
  ctSpawn: [
    { x: -44, z: 24 }, { x: -36, z: 34 }, { x: -24, z: 24 }, { x: -16, z: 34 }, { x: -40, z: 44 },
  ],
  mid: [{ x: -2, z: -6 }, { x: 0, z: 4 }],
  midToB: [{ x: 8, z: -15 }, { x: 16, z: -15 }, { x: 18, z: -24 }, { x: 18, z: -38 }],
  bDoors: [{ x: 24, z: -39 }],
  windowRoom: [{ x: 24, z: -30 }],
  ramp: [{ x: -46, z: -18 }, { x: -48, z: 0 }],
};

export const holdPoints = {
  aSite: [{ x: -30, z: -44 }, { x: -52, z: -38 }, { x: -40, z: -48 }],
  bSite: [{ x: 44, z: -40 }, { x: 36, z: -32 }, { x: 52, z: -30 }],
  mid: [{ x: -2, z: -4 }, { x: -2, z: 2 }],
};

// ============ 炸弹区域 ============
export const sites = {
  A: { x0: -58, z0: -58, x1: -22, z1: -32, name: 'A点' },
  B: { x0: 29, z0: -46, x1: 58, z1: -26, name: 'B点' },
};

export const plantPoints = {
  A: [{ x: -40, z: -45 }, { x: -34, z: -50 }, { x: -46, z: -50 }],
  B: [{ x: 40, z: -35 }, { x: 48, z: -35 }, { x: 40, z: -42 }],
};

// ============ 导出数据结构 ============
// 自动为每个大面积地板生成地板碰撞盒（保证任何可行走面都有支撑）
{
  const floorSet = new Set<string>();
  for (const a of walkAreas) {
    if (a.thin) continue; // 台阶等 thin 区域已有自身实体盒，跳过以免生成重复阻挡盒
    const key = `${a.x0},${a.z0},${a.x1},${a.z1}`;
    if (floorSet.has(key)) continue;
    floorSet.add(key);
    boxes.push(B(a.x0, a.z0, a.x1, a.z1, a.y - 0.5, a.y, '#c4a878', { floor: true }));
  }
}

/** 静态碰撞体（不含中门，门由引擎动态管理） */
export const staticColliders: AABB[] = boxes.map((b) => ({
  minX: b.x0, maxX: b.x1, minY: b.y0, maxY: b.y1, minZ: b.z0, maxZ: b.z1,
  penetrable: b.penetrable,
  step: !!b.step,
}));

export const colliders: AABB[] = staticColliders;

export const navObstacles: AABB[] = boxes
  .filter((b) => !b.step && !b.walkable && !b.floor)
  .map((b) => ({ minX: b.x0, maxX: b.x1, minY: b.y0, maxY: b.y1, minZ: b.z0, maxZ: b.z1 }));

export const renderBoxes = boxes.filter((b) => !b.floor);
export const doorCollider: AABB = {
  minX: doorDef.x0, maxX: doorDef.x1, minY: doorDef.y0, maxY: doorDef.y1,
  minZ: doorDef.z0, maxZ: doorDef.z1, penetrable: true,
};

// 小地图轮廓
export const minimapShapes = {
  walls: boxes.filter((b) => !b.step && !b.floor && b.y0 <= 0 && b.y1 >= 2).map((b) => ({ x0: b.x0, z0: b.z0, x1: b.x1, z1: b.z1 })),
  floors: walkAreas.map((a) => ({ x0: a.x0, z0: a.z0, x1: a.x1, z1: a.z1 })),
};

// ============ 视线判定 ============
function segHitsBox(
  x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, b: AABB
): boolean {
  const dx = x1 - x0, dy = y1 - y0, dz = z1 - z0;
  let tmin = 0, tmax = 1;
  const test = (p0: number, p1: number, lo: number, hi: number, d: number): boolean => {
    if (Math.abs(d) < 1e-12) return p0 >= lo && p0 <= hi;
    let t1 = (lo - p0) / d, t2 = (hi - p0) / d;
    if (t1 > t2) { const t = t1; t1 = t2; t2 = t; }
    if (t1 > tmin) tmin = t1;
    if (t2 < tmax) tmax = t2;
    return tmin <= tmax;
  };
  if (!test(x0, x1, b.minX, b.maxX, dx)) return false;
  if (!test(y0, y1, b.minY, b.maxY, dy)) return false;
  if (!test(z0, z1, b.minZ, b.maxZ, dz)) return false;
  return true;
}

/** 两点之间视线是否畅通（被任何实体阻挡则 false） */
export function losClear(
  x0: number, y0: number, z0: number, x1: number, y1: number, z1: number
): boolean {
  for (const b of colliders) {
    if (segHitsBox(x0, y0, z0, x1, y1, z1, b)) return false;
  }
  return true;
}

// ============ 寻路网格（多层高度：猫道/下连通道与地面可重叠）============
const CELL = 0.9;
const MINX = -60.9, OZ = -60.9;
const MAX_LAYERS = 6;

export interface NavGrid {
  path(sx: number, sy: number, sz: number, tx: number, tz: number, ty?: number): { x: number; z: number; y: number }[] | null;
  pathRaw(sx: number, sy: number, sz: number, tx: number, tz: number, ty?: number): { x: number; z: number; y: number }[] | null;
  nearestWalkable(x: number, z: number): { x: number; z: number; y: number } | null;
  randomPointNear(x: number, z: number, r: number, rng?: () => number): { x: number; z: number; y: number } | null;
  floorYAt(x: number, z: number): number | null;
  debugLayers(x: number, z: number): number[];
}

function buildNavGrid(): NavGrid {
  const nx = Math.ceil((66.9 - MINX) / CELL) + 1;
  const nz = Math.ceil((-OZ + 60.9) / CELL) + 1;
  const ox = MINX;
  const idx = (ix: number, iz: number) => iz * nx + ix;
  const layers: number[][] = []; // 每个单元格的可行走高度（升序）

  interface NavObs { minX: number; maxX: number; minZ: number; maxZ: number; minY: number; maxY: number; step?: boolean }
  const obstacles: NavObs[] = navObstacles.map((b) => ({
    minX: b.minX, maxX: b.maxX, minZ: b.minZ, maxZ: b.maxZ, minY: b.minY, maxY: b.maxY,
  }));
  // 台阶与可行走实心盒也参与逐层阻挡（防止其内部出现假地面层）
  for (const b of boxes) {
    if (b.step || b.walkable) {
      obstacles.push({ minX: b.x0, maxX: b.x1, minZ: b.z0, maxZ: b.z1, minY: b.y0, maxY: b.y1, step: !!b.step });
    }
  }

  const H = 1.8;
  for (let iz = 0; iz < nz; iz++) {
    for (let ix = 0; ix < nx; ix++) {
      const x0 = ox + ix * CELL, z0 = OZ + iz * CELL;
      const x1 = x0 + CELL, z1 = z0 + CELL;
      const ys: number[] = [];
      const seen = new Set<number>();
      // 候选层：普通区域矩形重叠 ≥ 0.02；台阶（thin）要求单元格中心落在台阶内（±0.3）
      for (const a of walkAreas) {
        if (a.thin) {
          const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
          if (cx >= a.x0 - 0.3 && cx <= a.x1 + 0.3 && cz >= a.z0 - 0.3 && cz <= a.z1 + 0.3) {
            const key = Math.round(a.y * 100);
            if (!seen.has(key)) { seen.add(key); ys.push(a.y); }
          }
        } else {
          const oxl = Math.max(x0, a.x0), oxr = Math.min(x1, a.x1);
          const ozl = Math.max(z0, a.z0), ozr = Math.min(z1, a.z1);
          if (oxr - oxl >= 0.02 && ozr - ozl >= 0.02) {
            const key = Math.round(a.y * 100);
            if (!seen.has(key)) { seen.add(key); ys.push(a.y); }
          }
        }
      }
      // 逐层判定：障碍（含台阶/可走顶面实心盒）与 [y, y+H] 垂直重叠且 XZ 重叠且
      // 盒顶高于脚底 0.62m 以上（即无法一步登上去）→ 该层不可走
      const final: number[] = [];
      for (const y of ys) {
        let blk = false;
        for (const o of obstacles) {
          if (y + H <= o.minY + 0.02 || y >= o.maxY - 0.02) continue;
          if (o.maxY - y <= 0.62) continue; // 可一步登上的台阶/矮台
          let overlap: boolean;
          if (o.step) {
            // 台阶盒：与 thin 层生成规则一致，按单元格中心判定（±0.3），
            // 避免台阶边缘只擦到 0.1m 的格子被误判为不可走
            const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
            overlap = cx >= o.minX - 0.3 && cx <= o.maxX + 0.3 && cz >= o.minZ - 0.3 && cz <= o.maxZ + 0.3;
          } else {
            overlap = x0 < o.maxX - 0.02 && x1 > o.minX + 0.02 && z0 < o.maxZ - 0.02 && z1 > o.minZ + 0.02;
          }
          if (overlap) {
            blk = true;
            break;
          }
        }
        if (!blk) final.push(y);
      }
      final.sort((a, b) => a - b);
      layers.push(final);
    }
  }

  const cellOf = (x: number, z: number): [number, number] | null => {
    const ix = Math.floor((x - ox) / CELL);
    const iz = Math.floor((z - OZ) / CELL);
    if (ix < 0 || ix >= nx || iz < 0 || iz >= nz) return null;
    return [ix, iz];
  };

  const clampLayer = (c: [number, number], y: number): number => {
    const ys = layers[idx(c[0], c[1])];
    if (!ys.length) return -1;
    let best = 0;
    for (let i = 0; i < ys.length; i++) if (Math.abs(ys[i] - y) < Math.abs(ys[best] - y)) best = i;
    return best;
  };

  // 障碍空间分桶（4m），加速线段查询
  const obsBuckets = new Map<string, typeof obstacles>();
  for (const o of obstacles) {
    const bx0 = Math.floor((o.minX - 0.2) / 4), bx1 = Math.floor((o.maxX + 0.2) / 4);
    const bz0 = Math.floor((o.minZ - 0.2) / 4), bz1 = Math.floor((o.maxZ + 0.2) / 4);
    for (let bx = bx0; bx <= bx1; bx++) {
      for (let bz = bz0; bz <= bz1; bz++) {
        const k = `${bx},${bz}`;
        const arr = obsBuckets.get(k);
        if (arr) arr.push(o);
        else obsBuckets.set(k, [o]);
      }
    }
  }
  const obsInSegment = (sx: number, sz: number, tx: number, tz: number, out: typeof obstacles): void => {
    const minX = Math.min(sx, tx) - 0.2, maxX = Math.max(sx, tx) + 0.2;
    const minZ = Math.min(sz, tz) - 0.2, maxZ = Math.max(sz, tz) + 0.2;
    for (let bx = Math.floor(minX / 4); bx <= Math.floor(maxX / 4); bx++) {
      for (let bz = Math.floor(minZ / 4); bz <= Math.floor(maxZ / 4); bz++) {
        const arr = obsBuckets.get(`${bx},${bz}`);
        if (arr) for (const o of arr) out.push(o);
      }
    }
  };
  const segEntryT = (ax: number, az: number, bx: number, bz: number, minX: number, minZ: number, maxX: number, maxZ: number): number => {
    const dx = bx - ax, dz = bz - az;
    let tmin = 0, tmax = 1;
    const test = (p0: number, p1: number, lo: number, hi: number, d: number): boolean => {
      if (Math.abs(d) < 1e-12) return p0 >= lo && p0 <= hi;
      let t1 = (lo - p0) / d, t2 = (hi - p0) / d;
      if (t1 > t2) { const t = t1; t1 = t2; t2 = t; }
      if (t1 > tmin) tmin = t1;
      if (t2 < tmax) tmax = t2;
      return tmin <= tmax;
    };
    if (!test(ax, bx, minX, maxX, dx)) return -1;
    if (!test(az, bz, minZ, maxZ, dz)) return -1;
    return tmin;
  };
  // 同层移动：线段不得穿过无法一步登顶(>0.57m)且低于头顶的障碍盒
  const sameLayerClear = (sx: number, sz: number, tx: number, tz: number, y: number): boolean => {
    const hits: typeof obstacles = [];
    obsInSegment(sx, sz, tx, tz, hits);
    for (const o of hits) {
      if (o.maxY - y <= 0.57) continue; // 可一步登顶
      if (o.minY - y >= 1.78) continue; // 高于头顶
      if (segHitsRect(sx, sz, tx, tz, o.minX - 0.2, o.minZ - 0.2, o.maxX + 0.2, o.maxZ + 0.2)) return false;
    }
    return true;
  };
  // 跨格爬升物理校验：沿线段依次越过障碍盒——
  // 每越过一个可一步登顶(≤0.56m)的盒，脚底即升高，方可越过下一个
  const climbFeasible = (sx: number, sz: number, tx: number, tz: number, y: number, jy: number): boolean => {
    const hits: { t: number; top: number }[] = [];
    const cands: typeof obstacles = [];
    obsInSegment(sx, sz, tx, tz, cands);
    for (const o of cands) {
      if (o.maxY <= y + 0.02) continue; // 在脚下或更低：直接走过
      if (o.minY >= y + 1.78) continue; // 高于头顶：不挡脚
      const t = segEntryT(sx, sz, tx, tz, o.minX - 0.2, o.minZ - 0.2, o.maxX + 0.2, o.maxZ + 0.2);
      if (t >= 0) hits.push({ t, top: o.maxY });
    }
    hits.sort((a, b) => a.t - b.t);
    let h = y;
    for (const hit of hits) {
      if (hit.top <= h + 0.57) h = Math.max(h, hit.top);
      else return false;
    }
    return h >= jy - 0.02;
  };
  // 一次性预计算全部跨格边可用性（数字查找表，A* 内 O(1) 查询）
  const edgeOk = new Int8Array(nx * nz * MAX_LAYERS * 8 * MAX_LAYERS);
  {
    const dirs: [number, number][] = [[-1, -1], [0, -1], [1, -1], [-1, 0], [0, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
    for (let iz = 0; iz < nz; iz++) {
      for (let ix = 0; ix < nx; ix++) {
        const cell = idx(ix, iz);
        const ys = layers[cell];
        const cx = ox + ix * CELL + CELL / 2, cz = OZ + iz * CELL + CELL / 2;
        for (let sl = 0; sl < ys.length; sl++) {
          const y = ys[sl];
          const state = cell * MAX_LAYERS + sl;
          for (let d = 0; d < 9; d++) {
            if (d === 4) continue;
            const jx = ix + dirs[d][0], jz = iz + dirs[d][1];
            if (jx < 0 || jx >= nx || jz < 0 || jz >= nz) continue;
            const jcell = idx(jx, jz);
            const jys = layers[jcell];
            const txC = ox + jx * CELL + CELL / 2, tzC = OZ + jz * CELL + CELL / 2;
            const baseIdx = (state * 8 + d) * MAX_LAYERS;
            for (let jl = 0; jl < jys.length; jl++) {
              const jy = jys[jl];
              let ok = true;
              if (jy - y > 0.02) ok = climbFeasible(cx, cz, txC, tzC, y, jy);
              else if (jy > y - 0.02) ok = sameLayerClear(cx, cz, txC, tzC, y);
              edgeOk[baseIdx + jl] = ok ? 1 : 0;
            }
          }
        }
      }
    }
  }

  // A* 可复用工作缓冲（跨查询，避免反复分配）
  const ag = new Float32Array(nx * nz * MAX_LAYERS);
  const acame = new Int32Array(nx * nz * MAX_LAYERS);
  const aclosed = new Uint32Array(nx * nz * MAX_LAYERS);
  let aqid = 0;

  // A*：状态 = (cell, layer)。节点 id = cell*MAX_LAYERS + layer
  const pathRaw = (
    sx: number, sy: number, sz: number, tx: number, tz: number, ty?: number
  ) => {
    const s = cellOf(sx, sz);
    const t = cellOf(tx, tz);
    if (!s || !t) return null;
    const sCell = idx(s[0], s[1]);
    const tCell = idx(t[0], t[1]);
    if (!layers[sCell].length || !layers[tCell].length) return null;
    const sl = clampLayer(s, sy);
    const tl = ty !== undefined ? clampLayer(t, ty) : 0;
    const start = sCell * MAX_LAYERS + sl;
    const goal = tCell * MAX_LAYERS + tl;
    if (start === goal) return [{ x: tx, z: tz, y: layers[tCell][tl] }];

    aqid++;
    const g = ag;
    const came = acame;
    const closed = aclosed;
    const qid = aqid;
    const heap: { i: number; f: number }[] = [];
    const push = (i: number, f: number) => {
      heap.push({ i, f });
      let c = heap.length - 1;
      while (c > 0) {
        const p = (c - 1) >> 1;
        if (heap[p].f <= heap[c].f) break;
        [heap[p], heap[c]] = [heap[c], heap[p]];
        c = p;
      }
    };
    const pop = (): number => {
      const top = heap[0].i;
      const last = heap.pop()!;
      if (heap.length) {
        heap[0] = last;
        let c = 0;
        for (;;) {
          const l = c * 2 + 1, r = l + 1;
          let m = c;
          if (l < heap.length && heap[l].f < heap[m].f) m = l;
          if (r < heap.length && heap[r].f < heap[m].f) m = r;
          if (m === c) break;
          [heap[m], heap[c]] = [heap[c], heap[m]];
          c = m;
        }
      }
      return top;
    };
    const h = (i: number) => {
      const cell = (i / MAX_LAYERS) | 0;
      const ix = cell % nx, iz = (cell / nx) | 0;
      const lyr = i % MAX_LAYERS;
      const d = Math.hypot(ix - t[0], iz - t[1]);
      const yPenalty = ty !== undefined && layers[cell][lyr] !== undefined
        ? Math.abs(layers[cell][lyr] - ty) * 0.5
        : 0;
      return (d + yPenalty) * 1.001; // 轻微打破平局，减少扩张
    };
    g[start] = 0;
    closed[start] = qid;
    push(start, h(start));
    let found = false;
    let foundNode = start;
    while (heap.length) {
      const i = pop();
      if (closed[i] === qid && i !== start) continue;
      closed[i] = qid;
      const cell = (i / MAX_LAYERS) | 0;
      if (cell === tCell) {
        const lyr = i % MAX_LAYERS;
        if (ty === undefined || Math.abs(layers[cell][lyr] - ty) <= 0.61) {
          found = true;
          foundNode = i;
          break;
        }
      }
      const lyr = i % MAX_LAYERS;
      const y = layers[cell][lyr];
      const ix = cell % nx, iz = (cell / nx) | 0;
      const tryEdge = (j: number, cost: number) => {
        const jcell = (j / MAX_LAYERS) | 0;
        const jl = j % MAX_LAYERS;
        const jy = layers[jcell][jl];
        if (jy === undefined) return;
        if (Math.abs(jy - y) > 0.6) return;
        const gj = closed[j] === qid ? g[j] : Infinity;
        const ng = g[i] + cost;
        if (ng < gj) {
          g[j] = ng;
          came[j] = i;
          push(j, ng + h(j));
        }
      };
      // 跨格爬升的物理校验：从源格角到目标格角的线段，
      // 不得穿过「高于一步登顶(0.56m)且低于头顶」的障碍盒
      // 同格上下层（向上代价高，鼓励跨格爬台阶）
      for (let l2 = 0; l2 < layers[cell].length; l2++) {
        if (l2 === lyr) continue;
        const up = layers[cell][l2] > y;
        tryEdge(cell * MAX_LAYERS + l2, up ? 2.5 : 0.25);
      }
      // 8 邻格
      for (let dz = -1; dz <= 1; dz++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dz) continue;
          const jx = ix + dx, jz = iz + dz;
          if (jx < 0 || jx >= nx || jz < 0 || jz >= nz) continue;
          const jcell = idx(jx, jz);
          const cost = (dx !== 0 && dz !== 0) ? 1.414 : 1;
          const dirIdx = (dz + 1) * 3 + (dx + 1);
          const baseIdx = ((cell * MAX_LAYERS + lyr) * 8 + dirIdx) * MAX_LAYERS;
          for (let l2 = 0; l2 < layers[jcell].length; l2++) {
            if (!edgeOk[baseIdx + l2]) continue;
            tryEdge(jcell * MAX_LAYERS + l2, cost);
          }
        }
      }
    }
    if (!found) return null;
    const nodes: { x: number; z: number; y: number }[] = [];
    let cur = foundNode;
    while (cur !== -1 && cur !== start) {
      const cell = (cur / MAX_LAYERS) | 0;
      const lyr = cur % MAX_LAYERS;
      nodes.push({
        x: ox + (cell % nx) * CELL + CELL / 2,
        z: OZ + ((cell / nx) | 0) * CELL + CELL / 2,
        y: layers[cell][lyr],
      });
      cur = came[cur];
    }
    nodes.push({ x: sx, z: sz, y: layers[sCell][sl] });
    nodes.reverse();
    return nodes;
  };

  const segClear2D = (ax: number, az: number, bx: number, bz: number): boolean => {
    for (const o of obstacles) {
      if (segHitsRect(ax, az, bx, bz, o.minX - 0.2, o.minZ - 0.2, o.maxX + 0.2, o.maxZ + 0.2)) return false;
    }
    return true;
  };

  const path = (
    sx: number, sy: number, sz: number, tx: number, tz: number, ty?: number
  ) => {
    const nodes = pathRaw(sx, sy, sz, tx, tz, ty);
    if (!nodes) return null;
    const smooth: typeof nodes = [nodes[0]];
    let curIdx = 0;
    while (curIdx < nodes.length - 1) {
      let best = curIdx + 1;
      for (let j = nodes.length - 1; j > curIdx + 1; j--) {
        // 仅在同高度节点间剪枝（楼梯爬升节点必须保留）
        if (Math.abs(nodes[j].y - nodes[curIdx].y) > 0.01) continue;
        if (segClear2D(nodes[curIdx].x, nodes[curIdx].z, nodes[j].x, nodes[j].z)) { best = j; break; }
      }
      smooth.push(nodes[best]);
      curIdx = best;
    }
    return smooth;
  };

  const nearestWalkable = (x: number, z: number) => {
    const c = cellOf(x, z);
    if (c) {
      const ys = layers[idx(c[0], c[1])];
      if (ys.length) return { x: ox + c[0] * CELL + CELL / 2, z: OZ + c[1] * CELL + CELL / 2, y: ys[0] };
    }
    for (let r = 1; r < 20; r++) {
      for (let dz = -r; dz <= r; dz++) {
        for (let dx = -r; dx <= r; dx++) {
          if (Math.max(Math.abs(dx), Math.abs(dz)) !== r) continue;
          const jx = c ? c[0] + dx : 0, jz = c ? c[1] + dz : 0;
          if (jx < 0 || jx >= nx || jz < 0 || jz >= nz) continue;
          const ys = layers[idx(jx, jz)];
          if (ys.length) return { x: ox + jx * CELL + CELL / 2, z: OZ + jz * CELL + CELL / 2, y: ys[0] };
        }
      }
    }
    return null;
  };

  const randomPointNear = (x: number, z: number, r: number, rng: () => number = Math.random) => {
    for (let i = 0; i < 24; i++) {
      const a = rng() * Math.PI * 2;
      const d = rng() * r;
      const px = x + Math.cos(a) * d;
      const pz = z + Math.sin(a) * d;
      const c = cellOf(px, pz);
      if (c) {
        const ys = layers[idx(c[0], c[1])];
        if (ys.length) return { x: ox + c[0] * CELL + CELL / 2, z: OZ + c[1] * CELL + CELL / 2, y: ys[0] };
      }
    }
    return null;
  };

  const floorYAt = (x: number, z: number): number | null => {
    const c = cellOf(x, z);
    if (!c) return null;
    const ys = layers[idx(c[0], c[1])];
    return ys.length ? ys[0] : null;
  };

  const debugLayers = (x: number, z: number): number[] => {
    const c = cellOf(x, z);
    if (!c) return [];
    return [...layers[idx(c[0], c[1])]];
  };

  return { path, pathRaw, nearestWalkable, randomPointNear, floorYAt, debugLayers };
}

function segHitsRect(
  ax: number, az: number, bx: number, bz: number,
  minX: number, minZ: number, maxX: number, maxZ: number
): boolean {
  if (Math.max(ax, bx) < minX || Math.min(ax, bx) > maxX) return false;
  if (Math.max(az, bz) < minZ || Math.min(az, bz) > maxZ) return false;
  if (ax >= minX && ax <= maxX && az >= minZ && az <= maxZ) return true;
  if (bx >= minX && bx <= maxX && bz >= minZ && bz <= maxZ) return true;
  const dx = bx - ax, dz = bz - az;
  const edges: [number, number, number, number][] = [
    [minX, minZ, maxX, minZ], [maxX, minZ, maxX, maxZ],
    [maxX, maxZ, minX, maxZ], [minX, maxZ, minX, minZ],
  ];
  for (const [p, q, r, s] of edges) {
    const ex = r - p, ez = s - q;
    const denom = dx * ez - dz * ex;
    if (Math.abs(denom) < 1e-12) continue;
    const t = ((p - ax) * ez - (q - az) * ex) / denom;
    if (t < 0 || t > 1) continue;
    const u = ((p - ax) * dz - (q - az) * dx) / denom;
    if (u >= 0 && u <= 1) return true;
  }
  return false;
}

export const navGrid: NavGrid = buildNavGrid();

export function inSite(x: number, z: number, site: 'A' | 'B'): boolean {
  const s = sites[site];
  return x >= s.x0 && x <= s.x1 && z >= s.z0 && z <= s.z1;
}

export function zoneOf(x: number, z: number): string {
  if (inSite(x, z, 'A')) return 'A点';
  if (inSite(x, z, 'B')) return 'B点';
  const zones: [string, number, number, number, number][] = [
    ['T出生点', 10, -14, 55, 60],
    ['CT出生点', -54, 10, -10, 60],
    ['中路', -8, -18, 4, 10],
    ['T中庭', -8, -26, 24, -14],
    ['B洞', 28, -26, 46, -14],
    ['下连通道', 20, -26, 28, -22],
    ['A大', 57, -58, 66, 10],
    ['A大横段', -24, -60, 66, -46],
    ['中门->B', 4, -18, 20, -12],
    ['上层走廊', 16, -46, 20, -18],
    ['B门门厅', 20, -42, 28, -36],
    ['窗户门厅', 20, -32, 28, -28],
    ['猫道', -27, -32, 28, -22],
    ['CT坡道', -54, -28, -40, 10],
  ];
  for (const [n, x0, z0, x1, z1] of zones) {
    if (x >= x0 && x <= x1 && z >= z0 && z <= z1) return n;
  }
  return '未知';
}

export function distance(a: { x: number; z: number }, b: { x: number; z: number }): number {
  return dist2D(a.x, a.z, b.x, b.z);
}
