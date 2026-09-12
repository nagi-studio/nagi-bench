import { clamp, dist2D } from '../core/math.ts';
import type { Vec3 } from '../core/math.ts';
import { STEP_HEIGHT } from './grid.ts';
import type { World } from './world.ts';

/** Minimal binary heap keyed on f-score — the A* open set. */
class MinHeap {
  private items: number[] = [];
  private prio: number[] = [];

  get size(): number {
    return this.items.length;
  }

  clear(): void {
    this.items.length = 0;
    this.prio.length = 0;
  }

  push(item: number, p: number): void {
    this.items.push(item);
    this.prio.push(p);
    let i = this.items.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.prio[parent] <= this.prio[i]) break;
      this.swap(i, parent);
      i = parent;
    }
  }

  pop(): number {
    const top = this.items[0];
    const lastItem = this.items.pop()!;
    const lastPrio = this.prio.pop()!;
    if (this.items.length > 0) {
      this.items[0] = lastItem;
      this.prio[0] = lastPrio;
      let i = 0;
      for (;;) {
        const l = i * 2 + 1;
        const r = l + 1;
        let m = i;
        if (l < this.items.length && this.prio[l] < this.prio[m]) m = l;
        if (r < this.items.length && this.prio[r] < this.prio[m]) m = r;
        if (m === i) break;
        this.swap(i, m);
        i = m;
      }
    }
    return top;
  }

  private swap(a: number, b: number): void {
    const ti = this.items[a];
    this.items[a] = this.items[b];
    this.items[b] = ti;
    const tp = this.prio[a];
    this.prio[a] = this.prio[b];
    this.prio[b] = tp;
  }
}

const SQRT2 = Math.SQRT2;

/**
 * Grid A* with string-pulling. Every walkable cell of the level is a node, so
 * bots can path anywhere without hand-authored waypoints; the tactical anchors
 * in the map data only decide *where* they want to go, not how to get there.
 */
export class NavGraph {
  private world: World;
  private nx: number;
  private nz: number;
  /** 1 = an actor-sized cylinder cannot stand here (wall or tall prop). */
  readonly blocked: Uint8Array;
  private gScore: Float32Array;
  private cameFrom: Int32Array;
  private state: Uint8Array; // 0 unvisited, 1 open, 2 closed
  private stamp: Int32Array;
  private runId = 0;
  private heap = new MinHeap();

  constructor(world: World) {
    this.world = world;
    const g = world.grid;
    this.nx = g.nx;
    this.nz = g.nz;
    const n = this.nx * this.nz;
    this.blocked = new Uint8Array(n);
    this.gScore = new Float32Array(n);
    this.cameFrom = new Int32Array(n);
    this.state = new Uint8Array(n);
    this.stamp = new Int32Array(n).fill(-1);

    for (let j = 0; j < this.nz; j++) {
      for (let i = 0; i < this.nx; i++) {
        const k = g.idx(i, j);
        if (g.solid[k]) {
          this.blocked[k] = 1;
          continue;
        }
        const cx = g.cellCenterX(i);
        const cz = g.cellCenterZ(j);
        const floorY = g.floor[k];
        // Cells whose centre is buried inside a tall solid prop are unusable.
        let inside = false;
        for (const p of world.solidProps) {
          if (p.y + p.sy <= floorY + STEP_HEIGHT + 0.02) continue;
          if (
            cx > p.x - p.sx / 2 - 0.35 &&
            cx < p.x + p.sx / 2 + 0.35 &&
            cz > p.z - p.sz / 2 - 0.35 &&
            cz < p.z + p.sz / 2 + 0.35
          ) {
            inside = true;
            break;
          }
        }
        this.blocked[k] = inside ? 1 : 0;
      }
    }
  }

  isBlockedCell(i: number, j: number): boolean {
    const g = this.world.grid;
    if (!g.inBounds(i, j)) return true;
    return this.blocked[g.idx(i, j)] === 1;
  }

  private traversable(fromK: number, toI: number, toJ: number): boolean {
    const g = this.world.grid;
    if (!g.inBounds(toI, toJ)) return false;
    const toK = g.idx(toI, toJ);
    if (this.blocked[toK]) return false;
    return Math.abs(g.floor[toK] - g.floor[fromK]) <= STEP_HEIGHT + 0.01;
  }

  /** Closest usable cell to a world position (bots occasionally end up on a blocked cell). */
  nearestFreeCell(x: number, z: number): number {
    const g = this.world.grid;
    const i0 = clamp(g.cellX(x), 0, this.nx - 1);
    const j0 = clamp(g.cellZ(z), 0, this.nz - 1);
    if (!this.blocked[g.idx(i0, j0)]) return g.idx(i0, j0);
    for (let r = 1; r <= 10; r++) {
      for (let dj = -r; dj <= r; dj++) {
        for (let di = -r; di <= r; di++) {
          if (Math.max(Math.abs(di), Math.abs(dj)) !== r) continue;
          const i = i0 + di;
          const j = j0 + dj;
          if (g.inBounds(i, j) && !this.blocked[g.idx(i, j)]) return g.idx(i, j);
        }
      }
    }
    return -1;
  }

  /**
   * A* between two world positions. Returns smoothed waypoints (world space,
   * y = floor height) or null when unreachable.
   */
  findPath(from: Vec3, to: Vec3, maxNodes = 9000): Vec3[] | null {
    const g = this.world.grid;
    const startK = this.nearestFreeCell(from.x, from.z);
    const goalK = this.nearestFreeCell(to.x, to.z);
    if (startK < 0 || goalK < 0) return null;
    if (startK === goalK) return [{ x: to.x, y: g.floorAt(to.x, to.z), z: to.z }];

    const run = ++this.runId;
    this.heap.clear();
    const gi = startK % this.nx;
    const gj = (startK - gi) / this.nx;
    const tgtI = goalK % this.nx;
    const tgtJ = (goalK - tgtI) / this.nx;

    this.gScore[startK] = 0;
    this.cameFrom[startK] = -1;
    this.state[startK] = 1;
    this.stamp[startK] = run;
    this.heap.push(startK, heuristic(gi, gj, tgtI, tgtJ));

    let expanded = 0;
    let found = false;
    while (this.heap.size > 0 && expanded < maxNodes) {
      const cur = this.heap.pop();
      if (this.stamp[cur] === run && this.state[cur] === 2) continue;
      this.state[cur] = 2;
      if (cur === goalK) {
        found = true;
        break;
      }
      expanded++;
      const ci = cur % this.nx;
      const cj = (cur - ci) / this.nx;
      const baseG = this.gScore[cur];

      for (let dj = -1; dj <= 1; dj++) {
        for (let di = -1; di <= 1; di++) {
          if (di === 0 && dj === 0) continue;
          const ni = ci + di;
          const nj = cj + dj;
          if (!this.traversable(cur, ni, nj)) continue;
          if (di !== 0 && dj !== 0) {
            // No cutting corners through diagonal gaps.
            if (!this.traversable(cur, ci + di, cj) || !this.traversable(cur, ci, cj + dj)) continue;
          }
          const nk = g.idx(ni, nj);
          if (this.stamp[nk] === run && this.state[nk] === 2) continue;
          const step = di !== 0 && dj !== 0 ? SQRT2 : 1;
          const tentative = baseG + step;
          if (this.stamp[nk] === run && this.state[nk] === 1 && tentative >= this.gScore[nk]) continue;
          this.stamp[nk] = run;
          this.state[nk] = 1;
          this.gScore[nk] = tentative;
          this.cameFrom[nk] = cur;
          this.heap.push(nk, tentative + heuristic(ni, nj, tgtI, tgtJ) * 1.08);
        }
      }
    }
    if (!found) return null;

    const cells: number[] = [];
    let k = goalK;
    let guard = 0;
    while (k !== -1 && guard++ < 20000) {
      cells.push(k);
      if (k === startK) break;
      k = this.cameFrom[k];
    }
    cells.reverse();

    const raw: Vec3[] = cells.map((c) => {
      const i = c % this.nx;
      const j = (c - i) / this.nx;
      return { x: g.cellCenterX(i), y: g.floor[c], z: g.cellCenterZ(j) };
    });
    const last = raw[raw.length - 1];
    if (dist2D(last, to) < 2 && this.canWalkStraight(last, to, 0.4)) {
      raw.push({ x: to.x, y: g.floorAt(to.x, to.z), z: to.z });
    }
    return this.smooth(raw);
  }

  /** String-pulling: drop waypoints that can be skipped with a clear walk. */
  private smooth(path: Vec3[]): Vec3[] {
    if (path.length <= 2) return path;
    const out: Vec3[] = [path[0]];
    let i = 0;
    while (i < path.length - 1) {
      let j = path.length - 1;
      for (; j > i + 1; j--) {
        if (this.canWalkStraight(path[i], path[j], 0.45)) break;
      }
      out.push(path[j]);
      i = j;
    }
    return out;
  }

  /** Sample a straight walk for wall/prop/step clearance. */
  canWalkStraight(a: Vec3, b: Vec3, radius: number): boolean {
    const w = this.world;
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const len = Math.hypot(dx, dz);
    if (len < 1e-4) return true;
    const steps = Math.ceil(len / 0.4);
    let prevY = w.grid.floorAt(a.x, a.z);
    for (let s = 1; s <= steps; s++) {
      const t = s / steps;
      const x = a.x + dx * t;
      const z = a.z + dz * t;
      const y = w.grid.floorAt(x, z);
      if (Math.abs(y - prevY) > STEP_HEIGHT) return false;
      if (!w.circleFree(x, z, prevY, radius)) return false;
      prevY = y;
    }
    return true;
  }
}

function heuristic(ax: number, az: number, bx: number, bz: number): number {
  const dx = Math.abs(ax - bx);
  const dz = Math.abs(az - bz);
  return dx > dz ? dx + (SQRT2 - 1) * dz : dz + (SQRT2 - 1) * dx;
}
