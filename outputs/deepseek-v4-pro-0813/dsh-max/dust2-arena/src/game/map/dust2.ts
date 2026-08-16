// ============================================================================
// Dust2 核心区域 —— 纯程序化生成
// 坐标系：x 东(+)/西(-)，z 南(+)/北(-)，y 向上。1 单位 = 1 米。
// 区域：T出生点 / CT出生点 / A大 / A点 / 中门(可穿透门体) / 猫道 / B洞 / B点
// 全部按 Dust2 实际走位彼此连通。
// 墙体由高度场自动生成（自动封边、自动台阶墙），门体为手动可穿透面板。
// ============================================================================
import type { MapData, FlatRect, RampRect, AABB, Rect } from '../types';

const H0 = 0;
const H_CAT = 3.0;      // 猫道高度
const H_TUN = 1.5;      // B 洞上层高度

// ---------------- 地板 ----------------
const flats: FlatRect[] = [
  { x: -14, z: 24, w: 28, d: 12, h: H0 },        // T 出生点广场
  { x: 14, z: 24, w: 18, d: 6, h: H0 },          // T 广场 → A大 转角
  { x: 26, z: -6, w: 6, d: 30, h: H0 },          // A 大（长道）
  { x: -4, z: 4, w: 8, d: 20, h: H0 },           // 中门 T 侧通道
  { x: -8, z: -10, w: 14, d: 14, h: H0 },        // CT 中路庭院
  { x: -12, z: -30, w: 26, d: 8, h: H0 },        // CT 出生点
  { x: -6, z: -22, w: 12, d: 12, h: H0 },        // CT 出生点 → 中 连接
  { x: 14, z: -30, w: 26, d: 22, h: H0 },        // A 点
  { x: 6, z: -6, w: 20, d: 4, h: H0 },           // 长门走廊（CT 中 ↔ A 大）
  { x: 24, z: -10, w: 12, d: 4, h: H0 },         // 长道坑（A大北端出口）
  { x: -26, z: 24, w: 12, d: 4, h: H0 },         // T 出生点 → B 洞 连接
  { x: -30, z: -12, w: 6, d: 36, h: H0 },        // B 洞（下层隧道）
  { x: -32, z: -26, w: 18, d: 18, h: H0 },       // B 点
  { x: -14, z: -12, w: 6, d: 4.5, h: H0 },       // B 门走廊
  { x: -30, z: -19, w: 16, d: 3, h: H_TUN },     // B 洞上层隧道（B 点南侧）
  { x: 10, z: -10, w: 8, d: 4, h: H_CAT },       // 猫道
];

// ---------------- 坡道（axis 方向线性抬升） ----------------
const ramps: RampRect[] = [
  { x: 4, z: -10, w: 6, d: 4, axis: 'x', h0: H0, h1: H_CAT },        // 中 → 猫道上行
  { x: 18, z: -10, w: 8, d: 4, axis: 'x', h0: H_CAT, h1: H0 },       // 猫道 → A 小道下行
  { x: -30, z: -16, w: 6, d: 4, axis: 'z', h0: H_TUN, h1: H0 },      // B 洞下层 → 上层（北端抬升）
  { x: -20, z: -19, w: 6, d: 6, axis: 'x', h0: H_TUN, h1: H0 },      // 上层隧道 → B 点口（东端下坡）
];

// 开放边缘（不自动生成墙）：猫道北缘向 A 点敞开的跳落口（与 Dust2 猫道跳点一致）
const openRects = [{ x: 14, z: -10.6, w: 4, d: 0.7 }];

// ---------------- 手动墙（普通实心墙，补门洞两侧） ----------------
const manualWalls: AABB[] = [
  // 中门墙（z=4，缺口 x -2..2 为门体）
  { minX: -4, maxX: -2, minZ: 3.8, maxZ: 4.2, minY: 0, maxY: 3.6 },
  { minX: 2, maxX: 4, minZ: 3.8, maxZ: 4.2, minY: 0, maxY: 3.6 },
  // 长门墙（x=12）
  { minX: 11.8, maxX: 12.2, minZ: -6, maxZ: -5.4, minY: 0, maxY: 3.6 },
  { minX: 11.8, maxX: 12.2, minZ: -2.6, maxZ: -2, minY: 0, maxY: 3.6 },
  // B 门墙（x=-13.5）
  { minX: -13.55, maxX: -13.35, minZ: -12, maxZ: -11.4, minY: 0, maxY: 3.6 },
  { minX: -13.55, maxX: -13.35, minZ: -8.2, maxZ: -7.5, minY: 0, maxY: 3.6 },
  // CT 出生点 → A 点拱门墙（x≈14，留缺口 z -27.2..-24.8）
  { minX: 13.7, maxX: 14.1, minZ: -30, maxZ: -27.2, minY: 0, maxY: 3.6 },
  { minX: 13.7, maxX: 14.1, minZ: -24.8, maxZ: -22, minY: 0, maxY: 3.6 },
];

// ---------------- 门体（子弹可穿过，阻挡视线，不阻挡移动） ----------------
const doorPanels: AABB[] = [
  // 中门双扇（木门）
  { minX: -2, maxX: 0, minZ: 3.9, maxZ: 4.1, minY: 0, maxY: 2.3 },
  { minX: 0, maxX: 2, minZ: 3.9, maxZ: 4.1, minY: 0, maxY: 2.3 },
  // 长门双扇（棕色木门）
  { minX: 11.9, maxX: 12.1, minZ: -5.4, maxZ: -4, minY: 0, maxY: 2.3 },
  { minX: 11.9, maxX: 12.1, minZ: -4, maxZ: -2.6, minY: 0, maxY: 2.3 },
  // B 门双扇
  { minX: -13.55, maxX: -13.35, minZ: -11.4, maxZ: -9.8, minY: 0, maxY: 2.3 },
  { minX: -13.55, maxX: -13.35, minZ: -9.8, maxZ: -8.2, minY: 0, maxY: 2.3 },
];

// ---------------- 箱子（实心掩体） ----------------
interface CrateSpec { x: number; z: number; w: number; d: number; h: number; kind: 'crate' | 'car'; }
const crateSpecs: CrateSpec[] = [
  // A 点
  { x: 20, z: -20, w: 2.5, d: 2.5, h: 1.2, kind: 'crate' },   // 电梯位
  { x: 26, z: -23, w: 2.5, d: 2, h: 1.1, kind: 'crate' },     // 双叠位
  { x: 30, z: -26, w: 2, d: 2, h: 1.2, kind: 'crate' },
  { x: 16, z: -14, w: 2, d: 2, h: 1.2, kind: 'crate' },       // 小道口（鹅位）
  { x: 28, z: -8.8, w: 2, d: 1.8, h: 1.1, kind: 'crate' },    // 长道坑
  // A 大
  { x: 27, z: 10, w: 1.5, d: 1.5, h: 1.1, kind: 'crate' },
  // 中
  { x: 2.5, z: -4.5, w: 2, d: 2, h: 1.1, kind: 'crate' },     // Xbox
  // B 点
  { x: -28, z: -24, w: 2.5, d: 2, h: 1.2, kind: 'crate' },
  { x: -24, z: -20, w: 2, d: 2, h: 1.0, kind: 'crate' },
  { x: -26, z: -17, w: 4, d: 2, h: 1.3, kind: 'car' },        // B 点轿车
  { x: -20, z: -12.5, w: 2, d: 2, h: 1.0, kind: 'crate' },
  // B 洞上层
  { x: -27, z: -17.7, w: 1.5, d: 1.2, h: 1.0, kind: 'crate' },
  // 出生点
  { x: -1, z: 28, w: 2, d: 1.2, h: 1.1, kind: 'crate' },
  { x: 4, z: 30, w: 1.5, d: 1.5, h: 1.0, kind: 'crate' },
  { x: -2, z: -25, w: 2, d: 1.5, h: 1.1, kind: 'crate' },
  { x: 6, z: -28, w: 2, d: 1.5, h: 1.0, kind: 'crate' },
];

const sites = {
  A: { x: 16, z: -26, w: 20, d: 14 } as Rect,
  B: { x: -30, z: -24, w: 14, d: 12 } as Rect,
};

const plantSpots = {
  A: [[22, -14], [31, -22]] as [number, number][],
  B: [[-22, -13], [-29, -19]] as [number, number][],
};

const spawns: { T: [number, number][]; CT: [number, number][] } = {
  T: [[6, 30], [2, 30], [-2, 30], [-6, 30], [0, 33]],
  CT: [[-4, -26], [0, -26], [4, -26], [9, -26], [-8, -24]],
};

// ---------------- 命名导航点（AI 计划 / 巡逻目标） ----------------
const waypoints: Record<string, [number, number][]> = {
  tSpawn: [[0, 33], [6, 30], [-6, 30]],
  longPlaza: [[29, 27]],
  aLong: [[29, 18], [29, 6], [29, -3]],
  longDoorsT: [[9, -4]],
  longDoorsCT: [[14, -4]],
  pit: [[29, -8.5]],
  midT: [[0, 12], [0, 5.5]],
  ctMid: [[0, -2], [-5, -7], [4.5, -8]],
  catBottom: [[4.8, -8.2]],
  catMidRamp: [[7, -8.5]],
  catTop: [[11, -8]],
  catMid: [[15, -8.3]],
  aShort: [[25.5, -8.2]],
  aSiteShort: [[16, -11]],
  bTunnelLow: [[-27, 18], [-27, 2]],
  bRampMid: [[-27, -14]],
  bUpper: [[-27, -17.5], [-22, -17.5]],
  bMouth: [[-14.5, -15]],
  bSite: [[-29, -17], [-24, -13], [-19, -23]],
  bDoors: [[-11, -9.5], [-13, -11.5]],
  aSite: [[17, -26], [23, -15], [33, -20]],
  ctSpawn: [[0, -26], [-6, -26], [6, -26]],
  aLongNorth: [[29, -4]],
  bombPlantA: plantSpots.A,
  bombPlantB: plantSpots.B,
};

const bounds = { x: -46, z: -38, w: 92, d: 76 };

// ---------------- 高度场 ----------------
const CELL = 0.5;
const gridW = Math.ceil(bounds.w / CELL);
const gridD = Math.ceil(bounds.d / CELL);
const heightGrid = new Float32Array(gridW * gridD).fill(-1e9);

function rampHeight(r: RampRect, x: number, z: number): number {
  const t = r.axis === 'x'
    ? (x - r.x) / r.w
    : (z - r.z) / r.d;
  return r.h0 + (r.h1 - r.h0) * Math.min(1, Math.max(0, t));
}

export function groundHeightAt(x: number, z: number): number {
  let best = -1e9;
  for (const f of flats) {
    if (x >= f.x - 1e-6 && x <= f.x + f.w + 1e-6 && z >= f.z - 1e-6 && z <= f.z + f.d + 1e-6) {
      if (f.h > best) best = f.h;
    }
  }
  for (const r of ramps) {
    if (x >= r.x - 1e-6 && x <= r.x + r.w + 1e-6 && z >= r.z - 1e-6 && z <= r.z + r.d + 1e-6) {
      const h = rampHeight(r, x, z);
      if (h > best) best = h;
    }
  }
  return best;
}

function gridIndex(cx: number, cz: number): number { return cz * gridW + cx; }

// 生成高度网格
(function rasterize() {
  for (let cz = 0; cz < gridD; cz++) {
    for (let cx = 0; cx < gridW; cx++) {
      const x = bounds.x + (cx + 0.5) * CELL;
      const z = bounds.z + (cz + 0.5) * CELL;
      heightGrid[gridIndex(cx, cz)] = groundHeightAt(x, z);
    }
  }
})();

// ---------------- 自动墙体生成 ----------------
interface WallSeg { x0: number; z0: number; x1: number; z1: number; y0: number; y1: number; along: 'x' | 'z'; }
const rawSegs: WallSeg[] = [];
const autoWalls: AABB[] = [];
const wallLines: [number, number, number, number][] = [];

function segKey(x0: number, z0: number, x1: number, z1: number, y0: number, y1: number) {
  return `${x0.toFixed(2)},${z0.toFixed(2)},${x1.toFixed(2)},${z1.toFixed(2)},${y0.toFixed(2)},${y1.toFixed(2)}`;
}

function inOpenRect(mx: number, mz: number): boolean {
  for (const o of openRects) {
    if (mx >= o.x && mx <= o.x + o.w && mz >= o.z && mz <= o.z + o.d) return true;
  }
  return false;
}

(function buildWalls() {
  const seen = new Set<string>();
  function addSeg(x0: number, z0: number, x1: number, z1: number, y0: number, y1: number, along: 'x' | 'z') {
    const key = segKey(x0, z0, x1, z1, y0, y1);
    if (seen.has(key)) return;
    seen.add(key);
    rawSegs.push({ x0, z0, x1, z1, y0, y1, along });
  }
  for (let cz = 0; cz < gridD; cz++) {
    for (let cx = 0; cx < gridW; cx++) {
      const h = heightGrid[gridIndex(cx, cz)];
      if (h <= -1e8) continue;
      const xc = bounds.x + cx * CELL;
      const zc = bounds.z + cz * CELL;
      // 四个邻居（东/西/南/北），墙段覆盖整条单元边
      const neighbors = [
        { dx: 1, dz: 0, ax: xc + CELL, az: zc, mx: xc + CELL, mz: zc + CELL * 0.5, along: 'z' as const },
        { dx: -1, dz: 0, ax: xc, az: zc, mx: xc, mz: zc + CELL * 0.5, along: 'z' as const },
        { dx: 0, dz: 1, ax: xc, az: zc + CELL, mx: xc + CELL * 0.5, mz: zc + CELL, along: 'x' as const },
        { dx: 0, dz: -1, ax: xc, az: zc, mx: xc + CELL * 0.5, mz: zc, along: 'x' as const },
      ];
      for (const n of neighbors) {
        const nx = cx + n.dx, nz = cz + n.dz;
        if (nx < 0 || nz < 0 || nx >= gridW || nz >= gridD) {
          if (n.along === 'z') addSeg(n.ax, n.az, n.ax, n.az + CELL, h, h + 3.5, 'z');
          else addSeg(n.ax, n.az, n.ax + CELL, n.az, h, h + 3.5, 'x');
          continue;
        }
        const hn = heightGrid[gridIndex(nx, nz)];
        if (hn <= -1e8) {
          if (n.along === 'z') addSeg(n.ax, n.az, n.ax, n.az + CELL, h, h + 3.5, 'z');
          else addSeg(n.ax, n.az, n.ax + CELL, n.az, h, h + 3.5, 'x');
          continue;
        }
        const diff = Math.abs(hn - h);
        if (diff > 0.56) {
          if (inOpenRect(n.mx, n.mz)) continue; // 开放边缘（猫道跳点）
          const lo = Math.min(h, hn);
          if (n.along === 'z') addSeg(n.ax, n.az, n.ax, n.az + CELL, lo, lo + 3.5, 'z');
          else addSeg(n.ax, n.az, n.ax + CELL, n.az, lo, lo + 3.5, 'x');
        }
      }
    }
  }
  // 合并共线相邻段
  const merged: WallSeg[] = [];
  const used = new Set<number>();
  for (let i = 0; i < rawSegs.length; i++) {
    if (used.has(i)) continue;
    const s = rawSegs[i];
    let { x0, z0, x1, z1 } = s;
    let changed = true;
    while (changed) {
      changed = false;
      for (let j = 0; j < rawSegs.length; j++) {
        if (used.has(j) || j === i) continue;
        const t = rawSegs[j];
        if (Math.abs(t.y0 - s.y0) > 0.01 || Math.abs(t.y1 - s.y1) > 0.01) continue;
        if (s.along === 'z' && t.along === 'z' && Math.abs(t.x0 - x1) < 0.01
          && t.z0 <= z1 + 0.01 && t.z1 >= z0 - 0.01) {
          z0 = Math.min(z0, t.z0); z1 = Math.max(z1, t.z1); used.add(j); changed = true;
        }
        else if (s.along === 'x' && t.along === 'x' && Math.abs(t.z0 - z1) < 0.01
          && t.x0 <= x1 + 0.01 && t.x1 >= x0 - 0.01) {
          x0 = Math.min(x0, t.x0); x1 = Math.max(x1, t.x1); used.add(j); changed = true;
        }
      }
    }
    merged.push({ x0, z0, x1, z1, y0: s.y0, y1: s.y1, along: s.along });
    used.add(i);
  }
  // 转 AABB
  const T = 0.22; // 半墙厚
  for (const s of merged) {
    const ax = Math.abs(s.x1 - s.x0), az = Math.abs(s.z1 - s.z0);
    if (ax < 0.01) { // 沿 z 的墙
      autoWalls.push({ minX: s.x0 - T, maxX: s.x0 + T, minZ: Math.min(s.z0, s.z1), maxZ: Math.max(s.z0, s.z1), minY: s.y0, maxY: s.y1 });
    } else {
      autoWalls.push({ minX: Math.min(s.x0, s.x1), maxX: Math.max(s.x0, s.x1), minZ: s.z0 - T, maxZ: s.z0 + T, minY: s.y0, maxY: s.y1 });
    }
    wallLines.push([s.x0, s.z0, s.x1, s.z1]);
  }
})();

// 地板薄片（子弹阻挡）：平坦地面 + 坡道包围盒
const floorBoxes: AABB[] = [];
for (const f of flats) {
  floorBoxes.push({ minX: f.x, maxX: f.x + f.w, minZ: f.z, maxZ: f.z + f.d, minY: f.h - 0.6, maxY: f.h + 0.05 });
}
for (const r of ramps) {
  const lo = Math.min(r.h0, r.h1), hi = Math.max(r.h0, r.h1);
  floorBoxes.push({ minX: r.x, maxX: r.x + r.w, minZ: r.z, maxZ: r.z + r.d, minY: lo - 0.6, maxY: hi + 0.05 });
}

// 箱子碰撞体（绝对高度）
const crateList: AABB[] = crateSpecs.map((c) => ({
  minX: c.x, maxX: c.x + c.w, minZ: c.z, maxZ: c.z + c.d,
  minY: groundHeightAt(c.x + c.w / 2, c.z + c.d / 2), maxY: groundHeightAt(c.x + c.w / 2, c.z + c.d / 2) + c.h,
}));

export const MAP: MapData = {
  bounds,
  flats,
  ramps,
  colliders: [...autoWalls, ...manualWalls, ...crateList],
  doors: doorPanels,
  floorBoxes,
  sites,
  plantSpots,
  spawns,
  waypoints,
  wallLines,
  crateList,
};

// ---------------- 查询工具 ----------------
export function pointInRect(px: number, pz: number, r: { x: number; z: number; w: number; d: number }): boolean {
  return px >= r.x && px <= r.x + r.w && pz >= r.z && pz <= r.z + r.d;
}

export function inSite(x: number, z: number, which: 'A' | 'B'): boolean {
  return pointInRect(x, z, MAP.sites[which]);
}

export function isPlantable(x: number, z: number): 'A' | 'B' | null {
  if (inSite(x, z, 'A')) return 'A';
  if (inSite(x, z, 'B')) return 'B';
  return null;
}

// 射线与 AABB（slab 法）
export function rayHitsAABB(
  ox: number, oy: number, oz: number,
  dx: number, dy: number, dz: number,
  b: AABB, maxT: number,
): number | null {
  let tmin = 0, tmax = maxT;
  if (Math.abs(dx) < 1e-12) {
    if (ox < b.minX || ox > b.maxX) return null;
  } else {
    let t1 = (b.minX - ox) / dx, t2 = (b.maxX - ox) / dx;
    if (t1 > t2) { const tmp = t1; t1 = t2; t2 = tmp; }
    tmin = Math.max(tmin, t1); tmax = Math.min(tmax, t2);
    if (tmin > tmax) return null;
  }
  if (Math.abs(dy) < 1e-12) {
    if (oy < b.minY || oy > b.maxY) return null;
  } else {
    let t1 = (b.minY - oy) / dy, t2 = (b.maxY - oy) / dy;
    if (t1 > t2) { const tmp = t1; t1 = t2; t2 = tmp; }
    tmin = Math.max(tmin, t1); tmax = Math.min(tmax, t2);
    if (tmin > tmax) return null;
  }
  if (Math.abs(dz) < 1e-12) {
    if (oz < b.minZ || oz > b.maxZ) return null;
  } else {
    let t1 = (b.minZ - oz) / dz, t2 = (b.maxZ - oz) / dz;
    if (t1 > t2) { const tmp = t1; t1 = t2; t2 = tmp; }
    tmin = Math.max(tmin, t1); tmax = Math.min(tmax, t2);
    if (tmin > tmax) return null;
  }
  return tmin;
}

// 视线测试：被实心墙/门/箱子遮挡返回 true
export function losBlocked(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number): boolean {
  const dx = x1 - x0, dy = y1 - y0, dz = z1 - z0;
  const len = Math.hypot(dx, dy, dz);
  if (len < 1e-6) return false;
  const nx = dx / len, ny = dy / len, nz = dz / len;
  for (const b of MAP.colliders) {
    if (rayHitsAABB(x0, y0, z0, nx, ny, nz, b, len) !== null) return true;
  }
  for (const b of MAP.doors) {
    if (rayHitsAABB(x0, y0, z0, nx, ny, nz, b, len) !== null) return true;
  }
  return false;
}
