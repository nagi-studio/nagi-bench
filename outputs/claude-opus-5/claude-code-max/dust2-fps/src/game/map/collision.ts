/**
 * Collision world.
 *
 * Everything solid in the map is an axis aligned box: walls (generated from the sector
 * floor plan) and props. This module provides the three queries the rest of the game needs:
 *
 *   groundAt()   -> floor height under a point, honouring ramps, ledges and prop tops
 *   slide()      -> cylinder-vs-boxes horizontal resolution (players and bots)
 *   rayCast()    -> bullets and AI line-of-sight
 */

import { Vec3 } from '../../core/math.ts';
import type { PropDef, PropKind, Sector } from './dust2.ts';
import { PROPS, SECTORS, WALL_HEIGHT, sectorContains, sectorFloorAt } from './dust2.ts';

export type SolidKind = 'wall' | 'ceiling' | PropKind;

export interface SolidBox {
  x0: number;
  y0: number;
  z0: number;
  x1: number;
  y1: number;
  z1: number;
  kind: SolidKind;
  /** Sector the box was generated for (walls only) — used to tint geometry. */
  sector?: string;
}

export interface RayHit {
  distance: number;
  point: Vec3;
  normal: Vec3;
  box: SolidBox;
}

const WALL_THICKNESS = 0.5;
const EDGE_CELL = 0.5;
const EPS = 1e-4;

function boxFromProp(p: PropDef): SolidBox {
  return {
    x0: p.x - p.sx / 2,
    y0: p.y,
    z0: p.z - p.sz / 2,
    x1: p.x + p.sx / 2,
    y1: p.y + p.sy,
    z1: p.z + p.sz / 2,
    kind: p.kind,
  };
}

/** True when a point stands on walkable floor (any sector). */
export function isWalkablePoint(x: number, z: number): boolean {
  for (const s of SECTORS) {
    if (sectorContains(s, x, z)) return true;
  }
  return false;
}

/**
 * Generates wall boxes: walk every sector edge in cells, and wherever the cell just
 * outside the edge is not part of any sector, emit a wall. Consecutive cells are merged
 * so the map stays a few dozen boxes rather than a few thousand.
 */
function buildWalls(): SolidBox[] {
  const walls: SolidBox[] = [];

  const emit = (
    s: Sector,
    axis: 'x' | 'z',
    edge: number,
    outward: number,
    from: number,
    to: number,
    capStart: boolean,
    capEnd: boolean,
  ) => {
    const t = WALL_THICKNESS;
    // Runs are only extended where they meet a corner of the sector. Extending into a
    // doorway would pinch the opening and can make it impassable for a 0.4m radius actor.
    const padStart = capStart ? t / 2 : 0;
    const padEnd = capEnd ? t / 2 : 0;
    // Floor can slope along the run, so size the wall to cover the whole span.
    let lo = Infinity;
    let hi = -Infinity;
    const samples = 4;
    for (let i = 0; i <= samples; i++) {
      const p = from + ((to - from) * i) / samples;
      const y = axis === 'x' ? sectorFloorAt(s, edge, p) : sectorFloorAt(s, p, edge);
      lo = Math.min(lo, y);
      hi = Math.max(hi, y);
    }
    const height = s.wallHeight ?? WALL_HEIGHT;
    const box: SolidBox = {
      x0: 0,
      y0: lo - 2.0,
      z0: 0,
      x1: 0,
      y1: hi + height,
      z1: 0,
      kind: 'wall',
      sector: s.id,
    };
    if (axis === 'x') {
      box.x0 = outward > 0 ? edge : edge - t;
      box.x1 = outward > 0 ? edge + t : edge;
      box.z0 = from - padStart;
      box.z1 = to + padEnd;
    } else {
      box.z0 = outward > 0 ? edge : edge - t;
      box.z1 = outward > 0 ? edge + t : edge;
      box.x0 = from - padStart;
      box.x1 = to + padEnd;
    }
    walls.push(box);
  };

  for (const s of SECTORS) {
    const edges: Array<{ axis: 'x' | 'z'; edge: number; outward: number; a: number; b: number }> = [
      { axis: 'x', edge: s.x0, outward: -1, a: s.z0, b: s.z1 },
      { axis: 'x', edge: s.x1, outward: 1, a: s.z0, b: s.z1 },
      { axis: 'z', edge: s.z0, outward: -1, a: s.x0, b: s.x1 },
      { axis: 'z', edge: s.z1, outward: 1, a: s.x0, b: s.x1 },
    ];

    for (const e of edges) {
      const span = e.b - e.a;
      const cells = Math.max(1, Math.round(span / EDGE_CELL));
      const step = span / cells;
      let runStart: number | null = null;

      for (let i = 0; i < cells; i++) {
        const centre = e.a + step * (i + 0.5);
        const probe = e.edge + e.outward * (EDGE_CELL / 2);
        const px = e.axis === 'x' ? probe : centre;
        const pz = e.axis === 'x' ? centre : probe;
        const open = isWalkablePoint(px, pz);

        if (!open && runStart === null) runStart = e.a + step * i;
        if (open && runStart !== null) {
          emit(s, e.axis, e.edge, e.outward, runStart, e.a + step * i, runStart === e.a, false);
          runStart = null;
        }
      }
      if (runStart !== null) emit(s, e.axis, e.edge, e.outward, runStart, e.b, runStart === e.a, true);
    }
  }

  return walls;
}

function buildCeilings(): SolidBox[] {
  const out: SolidBox[] = [];
  for (const s of SECTORS) {
    if (s.ceiling === undefined) continue;
    let hi = -Infinity;
    for (const [x, z] of [
      [s.x0, s.z0],
      [s.x1, s.z1],
    ]) {
      hi = Math.max(hi, sectorFloorAt(s, x, z));
    }
    out.push({
      x0: s.x0,
      y0: hi + s.ceiling,
      z0: s.z0,
      x1: s.x1,
      y1: hi + s.ceiling + 0.4,
      z1: s.z1,
      kind: 'ceiling',
      sector: s.id,
    });
  }
  return out;
}

export class CollisionWorld {
  readonly walls: SolidBox[];
  readonly ceilings: SolidBox[];
  readonly props: SolidBox[];
  readonly solids: SolidBox[];

  constructor() {
    this.walls = buildWalls();
    this.ceilings = buildCeilings();
    this.props = PROPS.map(boxFromProp);
    this.solids = [...this.walls, ...this.ceilings, ...this.props];
  }

  /**
   * Floor height under (x, z). `feetY` disambiguates ledges: only surfaces the actor can
   * actually be standing on (at most `step` above the feet) are considered, so walking off
   * catwalk drops you into mid instead of snapping back up.
   */
  groundAt(x: number, z: number, feetY: number, step = 0.55): number {
    let best = -Infinity;
    let lowest = Infinity;

    for (const s of SECTORS) {
      if (!sectorContains(s, x, z)) continue;
      const y = sectorFloorAt(s, x, z);
      lowest = Math.min(lowest, y);
      if (y <= feetY + step && y > best) best = y;
    }

    for (const p of this.props) {
      if (x < p.x0 || x > p.x1 || z < p.z0 || z > p.z1) continue;
      if (p.y1 <= feetY + step && p.y1 > best) best = p.y1;
    }

    if (best > -Infinity) return best;
    return lowest < Infinity ? lowest : -20;
  }

  /** Floor height ignoring props — the surface the navigation grid is built on. */
  sectorGroundAt(x: number, z: number): number {
    let best = -Infinity;
    for (const s of SECTORS) {
      if (!sectorContains(s, x, z)) continue;
      const y = sectorFloorAt(s, x, z);
      if (y > best) best = y;
    }
    return best;
  }

  /** Ceiling height above `feetY` at (x, z), used to stop jumps inside tunnels. */
  ceilingAt(x: number, z: number, feetY: number): number {
    let best = Infinity;
    for (const b of this.solids) {
      if (x < b.x0 || x > b.x1 || z < b.z0 || z > b.z1) continue;
      if (b.y0 >= feetY + 0.2 && b.y0 < best) best = b.y0;
    }
    return best;
  }

  /**
   * Pushes a cylinder out of every box it overlaps. Resolution is along the shortest
   * escape vector in XZ, which gives natural sliding along walls and around corners.
   */
  slide(pos: Vec3, radius: number, height: number): void {
    for (let pass = 0; pass < 2; pass++) {
      let moved = false;
      for (const b of this.solids) {
        if (pos.y + height <= b.y0 + EPS || pos.y >= b.y1 - EPS) continue;
        if (pos.x + radius <= b.x0 || pos.x - radius >= b.x1) continue;
        if (pos.z + radius <= b.z0 || pos.z - radius >= b.z1) continue;

        const cx = Math.min(Math.max(pos.x, b.x0), b.x1);
        const cz = Math.min(Math.max(pos.z, b.z0), b.z1);
        let dx = pos.x - cx;
        let dz = pos.z - cz;
        let d2 = dx * dx + dz * dz;

        if (d2 > radius * radius) continue;

        if (d2 < EPS * EPS) {
          // Centre is inside the box: escape along the closest face.
          const toMinX = pos.x - b.x0;
          const toMaxX = b.x1 - pos.x;
          const toMinZ = pos.z - b.z0;
          const toMaxZ = b.z1 - pos.z;
          const m = Math.min(toMinX, toMaxX, toMinZ, toMaxZ);
          if (m === toMinX) pos.x = b.x0 - radius;
          else if (m === toMaxX) pos.x = b.x1 + radius;
          else if (m === toMinZ) pos.z = b.z0 - radius;
          else pos.z = b.z1 + radius;
          moved = true;
          continue;
        }

        const d = Math.sqrt(d2);
        dx /= d;
        dz /= d;
        const push = radius - d;
        pos.x += dx * push;
        pos.z += dz * push;
        moved = true;
      }
      if (!moved) break;
    }
  }

  /** True if a cylinder at this position intersects any solid. */
  overlaps(x: number, y: number, z: number, radius: number, height: number): boolean {
    for (const b of this.solids) {
      if (y + height <= b.y0 + EPS || y >= b.y1 - EPS) continue;
      const cx = Math.min(Math.max(x, b.x0), b.x1);
      const cz = Math.min(Math.max(z, b.z0), b.z1);
      const dx = x - cx;
      const dz = z - cz;
      if (dx * dx + dz * dz < radius * radius - EPS) return true;
    }
    return false;
  }

  /** Ray vs world. Returns the closest hit, or null. */
  rayCast(origin: Vec3, dir: Vec3, maxDist: number): RayHit | null {
    let bestT = maxDist;
    let bestBox: SolidBox | null = null;
    let bestAxis = 0;
    let bestSign = 1;

    const inv = [
      dir.x !== 0 ? 1 / dir.x : Infinity,
      dir.y !== 0 ? 1 / dir.y : Infinity,
      dir.z !== 0 ? 1 / dir.z : Infinity,
    ];
    const o = [origin.x, origin.y, origin.z];

    for (const b of this.solids) {
      const lo = [b.x0, b.y0, b.z0];
      const hi = [b.x1, b.y1, b.z1];
      let tMin = 0;
      let tMax = bestT;
      let axis = 0;
      let sign = 1;
      let hit = true;

      for (let a = 0; a < 3; a++) {
        if (!Number.isFinite(inv[a])) {
          if (o[a] < lo[a] || o[a] > hi[a]) {
            hit = false;
            break;
          }
          continue;
        }
        let t1 = (lo[a] - o[a]) * inv[a];
        let t2 = (hi[a] - o[a]) * inv[a];
        let s = -1;
        if (t1 > t2) {
          const tmp = t1;
          t1 = t2;
          t2 = tmp;
          s = 1;
        }
        if (t1 > tMin) {
          tMin = t1;
          axis = a;
          sign = s;
        }
        if (t2 < tMax) tMax = t2;
        if (tMin > tMax) {
          hit = false;
          break;
        }
      }

      if (hit && tMin < bestT && tMin >= 0) {
        bestT = tMin;
        bestBox = b;
        bestAxis = axis;
        bestSign = sign;
      }
    }

    if (!bestBox) return null;
    return {
      distance: bestT,
      point: new Vec3(origin.x + dir.x * bestT, origin.y + dir.y * bestT, origin.z + dir.z * bestT),
      normal: new Vec3(
        bestAxis === 0 ? bestSign : 0,
        bestAxis === 1 ? bestSign : 0,
        bestAxis === 2 ? bestSign : 0,
      ),
      box: bestBox,
    };
  }

  /** Cheap boolean version of rayCast for line-of-sight tests. */
  losBlocked(from: Vec3, to: Vec3): boolean {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dz = to.z - from.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (dist < 1e-5) return false;
    const dir = new Vec3(dx / dist, dy / dist, dz / dist);
    const hit = this.rayCast(from, dir, dist);
    return hit !== null;
  }
}
