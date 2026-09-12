// Dust2 风格地图数据：墙体 AABB、箱子、出生点、炸弹点、寻路节点
// 坐标系：x 向东，z 向南，y 向上；地面 y=0；墙高 2.6m

export interface Rect {
  x0: number;
  x1: number;
  z0: number;
  z1: number;
}

export interface WallDef extends Rect {
  height: number;
  color: number; // 0xrrggbb
}

export interface BoxDef extends Rect {
  height: number; // 箱子高度（多层箱 = 更高）
  color: number;
  stack: number; // 1 = 单层 2 = 双层
}

export const WORLD_MIN_X = -33;
export const WORLD_MAX_X = 33;
export const WORLD_MIN_Z = -37;
export const WORLD_MAX_Z = 37;

const H = 2.6;
const WALL: number = 0xb8a884;
const WALL_D: number = 0xa8956f;
const BOX: number = 0x8a7a5c;
const BOX2: number = 0x6e6148;

// ---------- 墙体（AABB，实心） ----------
export const WALLS: WallDef[] = [
  // 外围
  { x0: -33, x1: 33, z0: -38, z1: -36.8, height: H, color: WALL },
  { x0: -33, x1: 33, z0: 36.8, z1: 38, height: H, color: WALL },
  { x0: -34.2, x1: -33, z0: -38, z1: 38, height: H, color: WALL },
  { x0: 33, x1: 34.2, z0: -38, z1: 38, height: H, color: WALL },

  // A 长（A 大）北墙：与 A 点 / T 出生点之间的分隔（含两个门洞：x[-31,-29] 与 x[-15,-13]）
  { x0: -32, x1: -31, z0: 4.6, z1: 5.4, height: H, color: WALL },
  { x0: -29, x1: -15, z0: 4.6, z1: 5.4, height: H, color: WALL },
  { x0: -13, x1: -8, z0: 4.6, z1: 5.4, height: H, color: WALL },
  // A 长与 T 区之间的墙（门洞 x[25.5,27.5]）
  { x0: 8, x1: 25.5, z0: 16.4, z1: 17.2, height: H, color: WALL },
  { x0: 27.5, x1: 34, z0: 16.4, z1: 17.2, height: H, color: WALL },
  // A 长东端墙
  { x0: 27.2, x1: 28, z0: 6.2, z1: 16.4, height: H, color: WALL },
  // A 长南侧边界（走廊边缘）
  { x0: -33, x1: -32, z0: 6.2, z1: 15.6, height: H, color: WALL },
  { x0: 28, x1: 33, z0: 6.2, z1: 15.6, height: H, color: WALL },
  // A 长转角墙体（汽车位）
  { x0: -26, x1: -24, z0: 6.2, z1: 9, height: H, color: WALL_D },

  // 中门（mid）北墙：中门门体，两扇薄门 + 中间可穿过的门缝
  { x0: 4, x1: 6.4, z0: -18.8, z1: -18, height: H, color: WALL_D },
  { x0: 9.6, x1: 12, z0: -18.8, z1: -18, height: H, color: WALL_D },
  // 中门东侧到 B 洞的墙（开口 z[-12,-6] = 中门↔B洞 门洞）
  { x0: 12.4, x1: 14, z0: -20, z1: -12, height: H, color: WALL },
  { x0: 12.4, x1: 14, z0: -6, z1: 5, height: H, color: WALL },
  // 中门与 A 长之间的墙（门洞 x[-4.5,-2.5] = A 短入口）
  { x0: -6, x1: -4.5, z0: 10.4, z1: 11.2, height: H, color: WALL },
  { x0: -2.5, x1: 12, z0: 10.4, z1: 11.2, height: H, color: WALL },
  // 中门西侧与 A 点东侧的墙（门洞 z[-15.2,-13.8]）
  { x0: -6.4, x1: -5.6, z0: -18, z1: -15.2, height: H, color: WALL },
  { x0: -6.4, x1: -5.6, z0: -13.8, z1: 12, height: H, color: WALL },

  // 猫道：北墙 + 西段南墙（东段俯瞰 A 点 / 中门）
  { x0: -32, x1: -4, z0: -26.8, z1: -26, height: H, color: WALL_D },
  { x0: -32, x1: -15, z0: -19.6, z1: -18.8, height: H, color: WALL_D },
  // 猫道东端墙（与 CT 区通道之间的入口）
  { x0: -4.8, x1: -4, z0: -26, z1: -24.4, height: H, color: WALL_D },
  { x0: -4.8, x1: -4, z0: -21.2, z1: -18.8, height: H, color: WALL_D },

  // A 点北墙（门洞 x[-14,-12] 通往猫道）
  { x0: -32, x1: -14, z0: -17.4, z1: -16.6, height: H, color: WALL },
  { x0: -12, x1: -8, z0: -17.4, z1: -16.6, height: H, color: WALL },

  // CT 出生区南墙（门洞 x[6.4,9.6] = 中门北口）
  { x0: -32, x1: 6.4, z0: -29.6, z1: -28.8, height: H, color: WALL },
  { x0: 9.6, x1: 12, z0: -29.6, z1: -28.8, height: H, color: WALL },
  // CT 出生区东墙
  { x0: 11.2, x1: 12, z0: -38, z1: -29.6, height: H, color: WALL },

  // B 点西墙 / B 点南墙（B 洞洞口 x[18,26]）
  { x0: 11.2, x1: 12, z0: -38, z1: -20, height: H, color: WALL },
  { x0: 12, x1: 18, z0: -20.4, z1: -19.6, height: H, color: WALL },
  { x0: 26, x1: 33, z0: -20.4, z1: -19.6, height: H, color: WALL },

  // T 区北墙（B 洞南口 x[15,29]）
  { x0: 8, x1: 15, z0: 17.2, z1: 18, height: H, color: WALL },
  { x0: 29, x1: 34, z0: 17.2, z1: 18, height: H, color: WALL },
];

// ---------- 箱子 / 掩体 ----------
export const BOXES: BoxDef[] = [
  // A 点
  { x0: -16, x1: -12, z0: -12, z1: -8, height: 1.4, color: BOX2, stack: 2 },
  { x0: -22, x1: -18, z0: 0, z1: 3, height: 0.7, color: BOX, stack: 1 },
  { x0: -30, x1: -26, z0: -5, z1: -2, height: 1.1, color: BOX2, stack: 1 },
  { x0: -12, x1: -9, z0: -16.4, z1: -13, height: 0.9, color: BOX, stack: 1 },
  { x0: -28, x1: -26, z0: -14, z1: -12, height: 0.7, color: BOX, stack: 1 },
  { x0: -15, x1: -13.5, z0: -6.5, z1: -5, height: 0.7, color: BOX, stack: 1 },
  // A 长
  { x0: -20, x1: -16, z0: 9, z1: 11, height: 0.9, color: BOX, stack: 1 },
  { x0: 20, x1: 24, z0: 9, z1: 12, height: 1.1, color: BOX2, stack: 1 },
  { x0: 4, x1: 7, z0: 8, z1: 10, height: 0.7, color: BOX, stack: 1 },
  // 中门
  { x0: 0, x1: 3, z0: -8, z1: -5, height: 1.1, color: BOX2, stack: 1 },
  { x0: 6, x1: 9, z0: 2, z1: 4.5, height: 0.9, color: BOX, stack: 1 },
  // B 洞
  { x0: 18, x1: 20, z0: 6, z1: 10, height: 0.9, color: BOX, stack: 1 },
  { x0: 22, x1: 26, z0: -4, z1: -1, height: 1.1, color: BOX2, stack: 1 },
  // B 点
  { x0: 20, x1: 24, z0: -32, z1: -28, height: 1.4, color: BOX2, stack: 2 },
  { x0: 26, x1: 29, z0: -26, z1: -23, height: 0.9, color: BOX, stack: 1 },
  { x0: 14, x1: 17, z0: -36, z1: -33, height: 1.1, color: BOX2, stack: 1 },
  { x0: 27, x1: 30, z0: -34, z1: -31, height: 0.7, color: BOX, stack: 1 },
  // T 区
  { x0: 22, x1: 26, z0: 26, z1: 30, height: 1.1, color: BOX2, stack: 1 },
  { x0: 28, x1: 32, z0: 30, z1: 33, height: 0.9, color: BOX, stack: 1 },
  // CT 区
  { x0: -24, x1: -21, z0: -34, z1: -31, height: 0.9, color: BOX, stack: 1 },
  { x0: -14, x1: -11, z0: -36, z1: -33, height: 1.1, color: BOX2, stack: 1 },
  // 猫道
  { x0: -24, x1: -22, z0: -24.5, z1: -21.5, height: 0.9, color: BOX, stack: 1 },
  { x0: -10, x1: -8, z0: -25, z1: -22, height: 0.7, color: BOX, stack: 1 },
];

// ---------- 炸弹点 ----------
export interface SiteDef {
  name: string;
  x: number;
  z: number;
  radius: number; // 可下包半径
}

export const SITES: SiteDef[] = [
  { name: 'A', x: -21, z: -6, radius: 11 },
  { name: 'B', x: 24, z: -24, radius: 10 },
];

// ---------- 出生点 ----------
export const T_SPAWNS: { x: number; z: number; yaw: number }[] = [
  { x: 14, z: 34, yaw: -Math.PI / 2 }, // 面朝北（-z）
  { x: 20, z: 36, yaw: -Math.PI / 2 },
  { x: 26, z: 34, yaw: -Math.PI / 2 },
  { x: 31, z: 22, yaw: -Math.PI / 2 },
  { x: 16, z: 20, yaw: -Math.PI / 2 },
];

export const CT_SPAWNS: { x: number; z: number; yaw: number }[] = [
  { x: -29, z: -34, yaw: Math.PI / 2 },
  { x: -25, z: -33.5, yaw: Math.PI / 2 },
  { x: -20, z: -32, yaw: Math.PI / 2 },
  { x: -27, z: -31, yaw: Math.PI / 2 },
  { x: -9, z: -34.5, yaw: Math.PI / 2 },
];

// ---------- 寻路节点（waypoint 图，每个节点均位于可行走空地） ----------
export interface NavNode {
  id: number;
  x: number;
  z: number;
  name: string;
}

export const NAV: NavNode[] = [
  { id: 0, x: 16, z: 34, name: 't-spawn1' },
  { id: 1, x: 26, z: 34, name: 't-spawn2' },
  { id: 2, x: 24, z: 20, name: 't-north' },
  { id: 3, x: 28, z: 28, name: 't-east' },
  { id: 4, x: 22, z: 14, name: 'bt-south' },
  { id: 5, x: 22, z: -8, name: 'bt-mid' },
  { id: 6, x: 22, z: -16, name: 'bt-north' },
  { id: 7, x: 27, z: 4, name: 'bt-east' },
  { id: 8, x: 18, z: -16, name: 'bt-west' },
  { id: 9, x: 21, z: -25, name: 'b-site' },
  { id: 10, x: 13, z: -30, name: 'b-west' },
  { id: 11, x: 29, z: -28, name: 'b-east' },
  { id: 12, x: 26, z: 12, name: 'long-east' },
  { id: 13, x: 14, z: 10, name: 'long-mid' },
  { id: 14, x: 2, z: 12.5, name: 'long-junc' },
  { id: 15, x: -18, z: 13, name: 'long-car' },
  { id: 16, x: -28, z: 12, name: 'long-door' },
  { id: 17, x: -13.5, z: 6.5, name: 'long-pit' },
  { id: 18, x: 8, z: 0, name: 'mid-east' },
  { id: 19, x: 4, z: -8, name: 'mid-center' },
  { id: 20, x: -2, z: -14, name: 'mid-west' },
  { id: 21, x: 8, z: -14, name: 'mid-door' },
  { id: 22, x: -3, z: 4, name: 'mid-south' },
  { id: 23, x: -8, z: -21, name: 'cat-east' },
  { id: 24, x: -18, z: -20.5, name: 'cat-mid' },
  { id: 25, x: -28, z: -20.5, name: 'cat-west' },
  { id: 26, x: -6, z: -24, name: 'ct-alley' },
  { id: 27, x: 8, z: -26, name: 'doors-north' },
  { id: 28, x: -13, z: -16, name: 'a-north' },
  { id: 29, x: -20, z: -6, name: 'a-site' },
  { id: 30, x: -28, z: -9, name: 'a-west' },
  { id: 31, x: -11, z: -3, name: 'a-east' },
  { id: 32, x: -24, z: -30.2, name: 'ct-spawn1' },
  { id: 33, x: -15, z: -30.2, name: 'ct-spawn2' },
  { id: 34, x: -6, z: -33, name: 'ct-east' },
  { id: 35, x: -30, z: -30.2, name: 'ct-west' },
  // 门洞 / 绕行节点
  { id: 39, x: 13.2, z: -9, name: 'bt-mid-door' },
  { id: 40, x: -4.4, z: -23, name: 'cat-door' },
  { id: 41, x: -13, z: -17.6, name: 'a-north-door' },
  { id: 42, x: -14, z: 4.2, name: 'a-long-door1' },
  { id: 43, x: -30, z: 4.2, name: 'a-long-door2' },
  { id: 45, x: 26.5, z: 17.6, name: 't-long-door' },
  { id: 46, x: -7, z: -14.5, name: 'mid-a-door' },
  { id: 47, x: 8, z: -30, name: 'ct-mid-door' },
  { id: 48, x: 18, z: 14.8, name: 'long-north' },
  { id: 49, x: -11, z: -31.5, name: 'ct-plaza' },
  { id: 51, x: 25, z: 14, name: 'bt-north' },
  { id: 53, x: 28, z: -5, name: 'bt-east2' },
  { id: 38, x: -3.5, z: 10.8, name: 'a-short-door' },
  { id: 55, x: 8, z: 12, name: 'long-south' },
  { id: 56, x: -14.5, z: 12, name: 'car-north' },
  { id: 58, x: -3.5, z: 12, name: 'a-short-north' },
];

/** id → 节点 快速查找（id 不连续） */
export const NAV_BY_ID: Map<number, NavNode> = new Map(NAV.map((n) => [n.id, n]));

/** 按 id 取节点（AI 寻路用） */
export function navNode(id: number): NavNode {
  return NAV_BY_ID.get(id) ?? NAV[0];
}

// 邻接表（边，均经过通行性校验：线段不与墙体/高箱相交）
export const NAV_EDGES: [number, number][] = [
  // T 出生区
  [0, 1], [0, 2], [1, 3], [2, 3], [2, 45], [3, 45], [3, 12],
  // B 洞
  [4, 51], [51, 7], [51, 12], [7, 12], [7, 53], [53, 5], [53, 12],
  [12, 48], [48, 13], [5, 8], [8, 18], [5, 6], [6, 8], [6, 9], [8, 39],
  [39, 5], [39, 18],
  // B 点
  [9, 10], [9, 11], [10, 6],
  // A 长
  [13, 48], [48, 12], [48, 55], [55, 58], [58, 14], [14, 15],
  [15, 16], [16, 15], [17, 56], [56, 15], [56, 16], [17, 42],
  [42, 29], [42, 31], [16, 43], [43, 29],
  // 中门
  [18, 19], [19, 20], [20, 21], [21, 19], [18, 22], [20, 22],
  [22, 38], [38, 58], [20, 46],
  [46, 42], [46, 31],
  // 猫道 / CT 通道
  [23, 24], [24, 25], [23, 26], [26, 40], [40, 23], [40, 27],
  // A 点
  [29, 30], [29, 31], [30, 28], [28, 41], [41, 23],
  // 中门北口 → CT 区
  [21, 27], [27, 47], [47, 49], [49, 34], [49, 33], [33, 32], [32, 35], [33, 35],
];

// ---------- 障碍物汇总（碰撞用） ----------
export interface Obstacle extends Rect {
  height: number;
}

export const OBSTACLES: Obstacle[] = [
  ...WALLS.map((w) => ({ x0: w.x0, x1: w.x1, z0: w.z0, z1: w.z1, height: w.height })),
  ...BOXES.map((b) => ({ x0: b.x0, x1: b.x1, z0: b.z0, z1: b.z1, height: b.height })),
];

export function isInSite(x: number, z: number): SiteDef | null {
  for (const s of SITES) {
    const dx = x - s.x;
    const dz = z - s.z;
    if (dx * dx + dz * dz <= s.radius * s.radius) return s;
  }
  return null;
}

// 2D 线段与 AABB 相交（视野 / 射线检测）
export function segmentHitsObstacle(ax: number, az: number, bx: number, bz: number): boolean {
  const dx = bx - ax;
  const dz = bz - az;
  const lenSq = dx * dx + dz * dz;
  for (let i = 0; i < OBSTACLES.length; i++) {
    const o = OBSTACLES[i];
    const ex0 = o.x0, ex1 = o.x1, ez0 = o.z0, ez1 = o.z1;
    // slab 方法
    let tMin = 0, tMax = 1;
    if (Math.abs(dx) < 1e-9) {
      if (ax < ex0 || ax > ex1) continue;
    } else {
      let t1 = (ex0 - ax) / dx;
      let t2 = (ex1 - ax) / dx;
      if (t1 > t2) { const t = t1; t1 = t2; t2 = t; }
      tMin = Math.max(tMin, t1);
      tMax = Math.min(tMax, t2);
      if (tMin > tMax) continue;
    }
    if (Math.abs(dz) < 1e-9) {
      if (az < ez0 || az > ez1) continue;
    } else {
      let t1 = (ez0 - az) / dz;
      let t2 = (ez1 - az) / dz;
      if (t1 > t2) { const t = t1; t1 = t2; t2 = t; }
      tMin = Math.max(tMin, t1);
      tMax = Math.min(tMax, t2);
      if (tMin > tMax) continue;
    }
    if (tMin >= 0 && tMin <= 1 && tMin * tMin * lenSq > 0.01) return true;
  }
  return false;
}

// 点到 AABB 最近点（用于避障滑移）
export function clampPointInWorld(x: number, z: number): { x: number; z: number } {
  return {
    x: Math.min(WORLD_MAX_X, Math.max(WORLD_MIN_X, x)),
    z: Math.min(WORLD_MAX_Z, Math.max(WORLD_MIN_Z, z)),
  };
}

// 迷你地图区域色块（用于 minimap 底图）
export const MINIMAP_REGIONS: { x0: number; x1: number; z0: number; z1: number; color: string; label: string }[] = [
  { x0: -33, x1: -8, z0: -17, z1: 4.5, color: '#8d805f', label: 'A' },
  { x0: -33, x1: 33, z0: 6.2, z1: 15.6, color: '#7d7355', label: 'A LONG' },
  { x0: -6, x1: 12, z0: -18.8, z1: 11, color: '#6f674e', label: 'MID' },
  { x0: 14, x1: 30, z0: -20, z1: 20, color: '#756b50', label: 'B TUNNEL' },
  { x0: 12, x1: 32, z0: -37, z1: -20, color: '#8d805f', label: 'B' },
  { x0: -33, x1: -4, z0: -26, z1: -18.8, color: '#6f674e', label: 'CATWALK' },
  { x0: -32, x1: 12, z0: -37, z1: -29.6, color: '#6a6f80', label: 'CT SPAWN' },
  { x0: 8, x1: 33, z0: 17.2, z1: 37, color: '#7d7355', label: 'T SPAWN' },
];
