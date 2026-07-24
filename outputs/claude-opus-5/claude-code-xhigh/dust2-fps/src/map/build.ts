/**
 * 把 dust2.ts 的声明式地图编译成实际几何：
 *   区域 -> 地板 / 四周墙体（在 Portal 处开洞）/ 天花板
 *   高差 -> 自动在低侧生成台阶
 *   道具 -> 箱子、油桶、集装箱、中门门体
 * 输出一个 CollisionWorld（物理与 AI 视线用）以及渲染层需要的 box 列表。
 */

import { intervalOverlap, subtractInterval } from '../core/math.ts';
import type { AreaDef, PortalDef, SurfaceKind } from './dust2.ts';
import { AREAS, DEFAULT_WALL_H, PORTALS, PROPS, WALL_THICKNESS } from './dust2.ts';
import { CollisionWorld, makeBox } from './collision.ts';
import type { Box } from './collision.ts';

export interface ResolvedPortal {
  a: AreaDef;
  b: AreaDef;
  /** 'x' 表示共享面是 x = coord 的竖直面（开口沿 Z 展开）。 */
  axis: 'x' | 'z';
  coord: number;
  lo: number;
  hi: number;
  /** 开口净高（相对两侧较高地面）。 */
  top: number;
  label?: string;
  /** 开口中心点，AI 与调试用。 */
  cx: number;
  cz: number;
}

export interface BuiltMap {
  world: CollisionWorld;
  areas: AreaDef[];
  areaById: Map<string, AreaDef>;
  portals: ResolvedPortal[];
  /** 区域邻接表（区域 id -> 相邻区域 id）。 */
  adjacency: Map<string, string[]>;
}

const EPS = 1e-6;

export function wallHeightOf(a: AreaDef): number {
  return a.wallH ?? DEFAULT_WALL_H;
}

/** 解析一条 Portal 的几何；数据写错时抛出，便于测试立刻发现。 */
export function resolvePortal(
  def: PortalDef,
  areaById: Map<string, AreaDef>,
): ResolvedPortal {
  const a = areaById.get(def.a);
  const b = areaById.get(def.b);
  if (!a) throw new Error(`portal 引用了不存在的区域: ${def.a}`);
  if (!b) throw new Error(`portal 引用了不存在的区域: ${def.b}`);

  let axis: 'x' | 'z';
  let coord: number;
  let span: [number, number] | null;

  if (Math.abs(a.x1 - b.x0) < 1e-6) {
    axis = 'x';
    coord = a.x1;
    span = intervalOverlap(a.z0, a.z1, b.z0, b.z1);
  } else if (Math.abs(a.x0 - b.x1) < 1e-6) {
    axis = 'x';
    coord = a.x0;
    span = intervalOverlap(a.z0, a.z1, b.z0, b.z1);
  } else if (Math.abs(a.z1 - b.z0) < 1e-6) {
    axis = 'z';
    coord = a.z1;
    span = intervalOverlap(a.x0, a.x1, b.x0, b.x1);
  } else if (Math.abs(a.z0 - b.z1) < 1e-6) {
    axis = 'z';
    coord = a.z0;
    span = intervalOverlap(a.x0, a.x1, b.x0, b.x1);
  } else {
    throw new Error(`portal ${def.a}<->${def.b} 的两个区域并不相邻`);
  }

  if (!span) throw new Error(`portal ${def.a}<->${def.b} 共享边长度为 0`);

  let [lo, hi] = span;
  if (def.clip) {
    lo = Math.max(lo, def.clip[0]);
    hi = Math.min(hi, def.clip[1]);
    if (hi - lo < 1e-4) {
      throw new Error(`portal ${def.a}<->${def.b} 的 clip 把开口裁没了`);
    }
  }

  const top = def.top ?? Math.min(wallHeightOf(a), wallHeightOf(b));

  return {
    a,
    b,
    axis,
    coord,
    lo,
    hi,
    top,
    label: def.label,
    cx: axis === 'x' ? coord : (lo + hi) / 2,
    cz: axis === 'x' ? (lo + hi) / 2 : coord,
  };
}

/** 生成整张地图。 */
export function buildMap(): BuiltMap {
  const areaById = new Map<string, AreaDef>();
  for (const a of AREAS) {
    if (areaById.has(a.id)) throw new Error(`重复的区域 id: ${a.id}`);
    areaById.set(a.id, a);
  }

  const portals = PORTALS.map((p) => resolvePortal(p, areaById));
  const world = new CollisionWorld();

  // ---- 地板 / 天花板 ----
  for (const a of AREAS) {
    world.add(
      makeBox(a.x0, a.y - 0.8, a.z0, a.x1, a.y, a.z1, a.floor ?? 'sand', 'floor', a.id),
    );
    if (a.ceiling) {
      const h = wallHeightOf(a);
      world.add(
        makeBox(a.x0, a.y + h, a.z0, a.x1, a.y + h + 0.5, a.z1, 'plaster', 'ceiling', a.id),
      );
    }
  }

  // ---- 墙体（沿四条边，扣掉 Portal 开口）----
  for (const a of AREAS) {
    const h = wallHeightOf(a);
    const t = WALL_THICKNESS;
    const top = a.y + h;
    const base = a.y - 0.8;

    // 每条边：[沿边轴的区间集合]
    const sides: Array<{
      axis: 'x' | 'z';
      coord: number;
      /** 墙体在法线方向上的占用区间 */
      n0: number;
      n1: number;
      s0: number;
      s1: number;
    }> = [
      { axis: 'x', coord: a.x0, n0: a.x0, n1: a.x0 + t, s0: a.z0, s1: a.z1 },
      { axis: 'x', coord: a.x1, n0: a.x1 - t, n1: a.x1, s0: a.z0, s1: a.z1 },
      { axis: 'z', coord: a.z0, n0: a.z0, n1: a.z0 + t, s0: a.x0, s1: a.x1 },
      { axis: 'z', coord: a.z1, n0: a.z1 - t, n1: a.z1, s0: a.x0, s1: a.x1 },
    ];

    for (const side of sides) {
      const openings = portals.filter(
        (p) =>
          (p.a.id === a.id || p.b.id === a.id) &&
          p.axis === side.axis &&
          Math.abs(p.coord - side.coord) < 1e-6,
      );

      let segments: Array<[number, number]> = [[side.s0, side.s1]];
      for (const p of openings) segments = subtractInterval(segments, p.lo, p.hi);

      for (const [s0, s1] of segments) {
        if (side.axis === 'x') {
          world.add(makeBox(side.n0, base, s0, side.n1, top, s1, 'wall', 'wall', a.id));
        } else {
          world.add(makeBox(s0, base, side.n0, s1, top, side.n1, 'wall', 'wall', a.id));
        }
      }

      // 门楣：开口净高小于墙高时，上方补一块
      for (const p of openings) {
        const other = p.a.id === a.id ? p.b : p.a;
        const lintelBase = Math.max(a.y, other.y) + p.top;
        if (lintelBase < top - 1e-3) {
          if (side.axis === 'x') {
            world.add(
              makeBox(side.n0, lintelBase, p.lo, side.n1, top, p.hi, 'wall', 'wall', a.id),
            );
          } else {
            world.add(
              makeBox(p.lo, lintelBase, side.n0, p.hi, top, side.n1, 'wall', 'wall', a.id),
            );
          }
        }
      }
    }
  }

  // ---- 高差台阶 ----
  for (const p of portals) {
    const dy = Math.abs(p.a.y - p.b.y);
    if (dy < 0.05) continue;
    const lower = p.a.y < p.b.y ? p.a : p.b;
    const higher = p.a.y < p.b.y ? p.b : p.a;
    const n = Math.max(1, Math.ceil(dy / 0.28));
    const rise = dy / n;
    // 踏面深度必须 > 导航网格边长(NAV_CELL=0.75)，这样每一级台阶至少落到一行格心上，
    // 导航采样才不会"跳过"一级、算出超过抬脚高度的落差。
    const depth = 0.8;
    // 判断“往低区域内部”的方向
    let dir = 1;
    if (p.axis === 'x') dir = Math.abs(lower.x1 - p.coord) < 1e-6 ? -1 : 1;
    else dir = Math.abs(lower.z1 - p.coord) < 1e-6 ? -1 : 1;

    const lo = p.lo - 0.25;
    const hi = p.hi + 0.25;
    for (let k = 0; k < n; k++) {
      const stepTop = higher.y - k * rise;
      const near = p.coord + dir * (k * depth);
      const far = p.coord + dir * ((k + 1) * depth);
      const s0 = Math.min(near, far);
      const s1 = Math.max(near, far);
      if (p.axis === 'x') {
        world.add(makeBox(s0, lower.y - 0.8, lo, s1, stepTop, hi, 'stone', 'step', lower.id));
      } else {
        world.add(makeBox(lo, lower.y - 0.8, s0, hi, stepTop, s1, 'stone', 'step', lower.id));
      }
    }
  }

  // ---- 掩体 ----
  for (const prop of PROPS) {
    world.add(
      makeBox(
        prop.x0,
        prop.y,
        prop.z0,
        prop.x1,
        prop.y + prop.h,
        prop.z1,
        prop.kind,
        'prop',
        undefined,
        prop.tag,
      ),
    );
  }

  world.build();

  const adjacency = new Map<string, string[]>();
  for (const a of AREAS) adjacency.set(a.id, []);
  for (const p of portals) {
    adjacency.get(p.a.id)!.push(p.b.id);
    adjacency.get(p.b.id)!.push(p.a.id);
  }

  return { world, areas: AREAS, areaById, portals, adjacency };
}

/** 点所在的区域（用于 HUD 位置提示与 AI 语义）。 */
export function areaAt(x: number, z: number): AreaDef | null {
  for (let i = 0; i < AREAS.length; i++) {
    const a = AREAS[i];
    if (x >= a.x0 - EPS && x <= a.x1 + EPS && z >= a.z0 - EPS && z <= a.z1 + EPS) return a;
  }
  return null;
}

/** 渲染层按材质分组时用到的颜色表（同时供小地图使用）。 */
export const SURFACE_COLORS: Record<SurfaceKind, number> = {
  sand: 0xc2a878,
  stone: 0xb7ad97,
  wall: 0xb08d5f,
  plaster: 0xd8cbb0,
  crate: 0x9c6b3c,
  metal: 0x5d6b74,
  concrete: 0x9a9186,
  barrel: 0x7a5230,
};

export function boxesByRole(world: CollisionWorld, role: Box['role']): Box[] {
  return world.boxes.filter((b) => b.role === role);
}
