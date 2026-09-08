import { MAP_H, MAP_W } from '../engine/constants';
import {
  cellCenterX,
  cellCenterZ,
  isWalkableCell,
  worldToCellX,
  worldToCellZ,
  type MapData,
} from '../world/mapLayout';

interface Node {
  g: number;
  f: number;
  idx: number;
}

class MinHeap {
  private a: Node[] = [];
  get size() {
    return this.a.length;
  }
  push(n: Node) {
    const a = this.a;
    a.push(n);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (a[p].f <= a[i].f) break;
      [a[p], a[i]] = [a[i], a[p]];
      i = p;
    }
  }
  pop(): Node {
    const a = this.a;
    const top = a[0];
    const last = a.pop()!;
    if (a.length > 0) {
      a[0] = last;
      let i = 0;
      for (;;) {
        const l = i * 2 + 1;
        const r = l + 1;
        let m = i;
        if (l < a.length && a[l].f < a[m].f) m = l;
        if (r < a.length && a[r].f < a[m].f) m = r;
        if (m === i) break;
        [a[m], a[i]] = [a[i], a[m]];
        i = m;
      }
    }
    return top;
  }
}

export interface NavPoint {
  x: number;
  z: number;
}

const DIRS: Array<[number, number, number]> = [
  [1, 0, 1],
  [-1, 0, 1],
  [0, 1, 1],
  [0, -1, 1],
  [1, 1, 1.4142],
  [1, -1, 1.4142],
  [-1, 1, 1.4142],
  [-1, -1, 1.4142],
];

/** Grid A* over the walkable cells of the map. */
export class NavGrid {
  private nav: Uint8Array;
  private gScore: Float32Array;
  private cameFrom: Int32Array;
  private closed: Uint8Array;
  private openMark: Uint8Array;

  constructor(map: MapData) {
    // Copy the walkable mask, then clear cells occupied by solid props (crates)
    // so pathfinding routes around them instead of clipping through.
    this.nav = new Uint8Array(MAP_W * MAP_H);
    this.nav.set(map.walkable);
    for (const c of map.colliders) {
      if (c.maxY >= 4.0) continue; // walls live on cell boundaries already
      const x0 = worldToCellX(c.minX - 0.55);
      const x1 = worldToCellX(c.maxX + 0.55);
      const z0 = worldToCellZ(c.minZ - 0.55);
      const z1 = worldToCellZ(c.maxZ + 0.55);
      for (let gz = z0; gz <= z1; gz++) {
        for (let gx = x0; gx <= x1; gx++) {
          if (gx < 0 || gz < 0 || gx >= MAP_W || gz >= MAP_H) continue;
          this.nav[gz * MAP_W + gx] = 0;
        }
      }
    }
    this.gScore = new Float32Array(MAP_W * MAP_H);
    this.cameFrom = new Int32Array(MAP_W * MAP_H);
    this.closed = new Uint8Array(MAP_W * MAP_H);
    this.openMark = new Uint8Array(MAP_W * MAP_H);
  }

  isWalkable(x: number, z: number): boolean {
    const gx = worldToCellX(x);
    const gz = worldToCellZ(z);
    if (gx < 0 || gz < 0 || gx >= MAP_W || gz >= MAP_H) return false;
    return this.nav[gz * MAP_W + gx] === 1;
  }

  /** Nearest walkable world point (spiral search). */
  nearestWalkable(x: number, z: number): NavPoint {
    let gx = worldToCellX(x);
    let gz = worldToCellZ(z);
    if (isWalkableCell(this.nav, gx, gz)) return { x, z };
    for (let r = 1; r < 14; r++) {
      for (let dz = -r; dz <= r; dz++) {
        for (let dx = -r; dx <= r; dx++) {
          if (Math.max(Math.abs(dx), Math.abs(dz)) !== r) continue;
          const nx = gx + dx;
          const nz = gz + dz;
          if (isWalkableCell(this.nav, nx, nz)) {
            return { x: cellCenterX(nx), z: cellCenterZ(nz) };
          }
        }
      }
    }
    return { x, z };
  }

  /** A* path as a list of world waypoints (excluding the start cell). */
  findPath(sx: number, sz: number, tx: number, tz: number): NavPoint[] {
    const start = this.nearestWalkable(sx, sz);
    const goal = this.nearestWalkable(tx, tz);
    const s = worldToCellZ(start.z) * MAP_W + worldToCellX(start.x);
    const g = worldToCellZ(goal.z) * MAP_W + worldToCellX(goal.x);
    if (s === g) return [{ x: goal.x, z: goal.z }];

    this.gScore.fill(Infinity);
    this.closed.fill(0);
    this.openMark.fill(0);
    this.cameFrom.fill(-1);

    const gx = worldToCellX(goal.x);
    const gz = worldToCellZ(goal.z);
    const h = (idx: number) => {
      const x = idx % MAP_W;
      const z = (idx / MAP_W) | 0;
      const dx = Math.abs(x - gx);
      const dz = Math.abs(z - gz);
      const mn = Math.min(dx, dz);
      const mx = Math.max(dx, dz);
      return mx + (1.4142 - 1) * mn;
    };

    const open = new MinHeap();
    this.gScore[s] = 0;
    open.push({ g: 0, f: h(s), idx: s });
    this.openMark[s] = 1;

    let found = false;
    let guard = 0;
    while (open.size > 0 && guard++ < 20000) {
      const cur = open.pop();
      const idx = cur.idx;
      if (this.closed[idx]) continue;
      this.closed[idx] = 1;
      if (idx === g) {
        found = true;
        break;
      }
      const cx = idx % MAP_W;
      const cz = (idx / MAP_W) | 0;
      for (const [dx, dz, cost] of DIRS) {
        const nx = cx + dx;
        const nz = cz + dz;
        if (!isWalkableCell(this.nav, nx, nz)) continue;
        if (dx !== 0 && dz !== 0) {
          if (!isWalkableCell(this.nav, cx + dx, cz) || !isWalkableCell(this.nav, cx, cz + dz)) continue;
        }
        const nIdx = nz * MAP_W + nx;
        if (this.closed[nIdx]) continue;
        const ng = this.gScore[idx] + cost;
        if (ng < this.gScore[nIdx] - 1e-6) {
          this.gScore[nIdx] = ng;
          this.cameFrom[nIdx] = idx;
          open.push({ g: ng, f: ng + h(nIdx), idx: nIdx });
        }
      }
    }

    if (!found) return [];
    const cells: number[] = [];
    let cur = g;
    while (cur !== -1) {
      cells.push(cur);
      if (cur === s) break;
      cur = this.cameFrom[cur];
    }
    cells.reverse();
    const pts: NavPoint[] = cells.map((idx) => ({
      x: cellCenterX(idx % MAP_W),
      z: cellCenterZ((idx / MAP_W) | 0),
    }));
    pts.shift();
    if (pts.length === 0) pts.push({ x: goal.x, z: goal.z });
    else pts[pts.length - 1] = { x: goal.x, z: goal.z };
    return this.smooth(pts, start);
  }

  /** String-pull: drop waypoints we can walk straight past. */
  private smooth(pts: NavPoint[], start: NavPoint): NavPoint[] {
    if (pts.length <= 1) return pts;
    const out: NavPoint[] = [];
    let anchor = start;
    let i = 0;
    while (i < pts.length) {
      let furthest = i;
      for (let j = pts.length - 1; j > i; j--) {
        if (this.clearWalk(anchor.x, anchor.z, pts[j].x, pts[j].z)) {
          furthest = j;
          break;
        }
      }
      out.push(pts[furthest]);
      anchor = pts[furthest];
      i = furthest + 1;
    }
    return out;
  }

  /** Straight, wall-free walkable line between two world points. */
  clearWalk(ax: number, az: number, bx: number, bz: number): boolean {
    const dx = bx - ax;
    const dz = bz - az;
    const dist = Math.hypot(dx, dz);
    const steps = Math.max(2, Math.ceil(dist / 0.6));
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      if (!this.isWalkable(ax + dx * t, az + dz * t)) return false;
    }
    return true;
  }

  /** Random walkable point near (x,z), useful for patrols. */
  randomNear(x: number, z: number, radius: number): NavPoint {
    for (let i = 0; i < 24; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * radius;
      const px = x + Math.cos(a) * r;
      const pz = z + Math.sin(a) * r;
      if (this.isWalkable(px, pz)) return { x: px, z: pz };
    }
    return this.nearestWalkable(x, z);
  }

  get cellCount(): number {
    return MAP_W * MAP_H;
  }

  get gridW(): number {
    return MAP_W;
  }
  get gridH(): number {
    return MAP_H;
  }
}
