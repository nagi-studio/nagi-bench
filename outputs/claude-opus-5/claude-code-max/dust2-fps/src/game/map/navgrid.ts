/**
 * Navigation grid + A*.
 *
 * The grid is rasterised from the same sector data the collision world uses, so a cell is
 * walkable only if an actor-sized cylinder actually fits there. Vertical links are
 * asymmetric: bots can step up small ledges but may drop down bigger ones (catwalk -> mid),
 * exactly like the player.
 */

import { Vec3 } from '../../core/math.ts';
import type { CollisionWorld } from './collision.ts';
import { isWalkablePoint } from './collision.ts';
import { mapBounds } from './dust2.ts';

export const CELL = 1.0;
const AGENT_RADIUS = 0.42;
const AGENT_HEIGHT = 1.5;
const MAX_STEP_UP = 0.62;
const MAX_DROP = 2.4;

class MinHeap {
  private ids: number[] = [];
  private keys: number[] = [];

  get size(): number {
    return this.ids.length;
  }

  clear(): void {
    this.ids.length = 0;
    this.keys.length = 0;
  }

  push(id: number, key: number): void {
    this.ids.push(id);
    this.keys.push(key);
    let i = this.ids.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.keys[parent] <= this.keys[i]) break;
      this.swap(i, parent);
      i = parent;
    }
  }

  pop(): number {
    const top = this.ids[0];
    const lastId = this.ids.pop()!;
    const lastKey = this.keys.pop()!;
    if (this.ids.length > 0) {
      this.ids[0] = lastId;
      this.keys[0] = lastKey;
      let i = 0;
      for (;;) {
        const l = i * 2 + 1;
        const r = l + 1;
        let m = i;
        if (l < this.ids.length && this.keys[l] < this.keys[m]) m = l;
        if (r < this.ids.length && this.keys[r] < this.keys[m]) m = r;
        if (m === i) break;
        this.swap(i, m);
        i = m;
      }
    }
    return top;
  }

  private swap(a: number, b: number): void {
    const ti = this.ids[a];
    this.ids[a] = this.ids[b];
    this.ids[b] = ti;
    const tk = this.keys[a];
    this.keys[a] = this.keys[b];
    this.keys[b] = tk;
  }
}

export class NavGrid {
  readonly originX: number;
  readonly originZ: number;
  readonly cols: number;
  readonly rows: number;
  readonly walkable: Uint8Array;
  readonly height: Float32Array;

  // A* scratch buffers, reused between queries to avoid per-frame allocation.
  private readonly gScore: Float32Array;
  private readonly fScore: Float32Array;
  private readonly cameFrom: Int32Array;
  private readonly stamp: Int32Array;
  private readonly closed: Uint8Array;
  private readonly open = new MinHeap();
  private queryId = 0;

  constructor(collision: CollisionWorld) {
    const b = mapBounds();
    this.originX = b.minX - CELL;
    this.originZ = b.minZ - CELL;
    this.cols = Math.ceil((b.maxX - b.minX) / CELL) + 2;
    this.rows = Math.ceil((b.maxZ - b.minZ) / CELL) + 2;

    const n = this.cols * this.rows;
    this.walkable = new Uint8Array(n);
    this.height = new Float32Array(n);
    this.gScore = new Float32Array(n);
    this.fScore = new Float32Array(n);
    this.cameFrom = new Int32Array(n);
    this.stamp = new Int32Array(n).fill(-1);
    this.closed = new Uint8Array(n);

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const i = r * this.cols + c;
        const x = this.cellX(c);
        const z = this.cellZ(r);
        if (!isWalkablePoint(x, z)) continue;
        // Props are obstacles for the AI, never navigation surfaces: sample the floor only.
        const y = collision.sectorGroundAt(x, z);
        this.height[i] = y;
        this.walkable[i] = collision.overlaps(x, y + 0.25, z, AGENT_RADIUS, AGENT_HEIGHT) ? 0 : 1;
      }
    }
  }

  cellX(c: number): number {
    return this.originX + (c + 0.5) * CELL;
  }

  cellZ(r: number): number {
    return this.originZ + (r + 0.5) * CELL;
  }

  colAt(x: number): number {
    return Math.floor((x - this.originX) / CELL);
  }

  rowAt(z: number): number {
    return Math.floor((z - this.originZ) / CELL);
  }

  indexAt(x: number, z: number): number {
    const c = this.colAt(x);
    const r = this.rowAt(z);
    if (c < 0 || r < 0 || c >= this.cols || r >= this.rows) return -1;
    return r * this.cols + c;
  }

  isWalkableIndex(i: number): boolean {
    return i >= 0 && this.walkable[i] === 1;
  }

  /** Nearest walkable cell index, searched in rings. Used to snap goals onto the mesh. */
  nearestWalkable(x: number, z: number, maxRings = 12): number {
    const c0 = this.colAt(x);
    const r0 = this.rowAt(z);
    const at = (c: number, r: number) =>
      c < 0 || r < 0 || c >= this.cols || r >= this.rows ? -1 : r * this.cols + c;

    const start = at(c0, r0);
    if (this.isWalkableIndex(start)) return start;

    for (let ring = 1; ring <= maxRings; ring++) {
      let best = -1;
      let bestD = Infinity;
      for (let dr = -ring; dr <= ring; dr++) {
        for (let dc = -ring; dc <= ring; dc++) {
          if (Math.max(Math.abs(dr), Math.abs(dc)) !== ring) continue;
          const i = at(c0 + dc, r0 + dr);
          if (!this.isWalkableIndex(i)) continue;
          const dx = this.cellX(c0 + dc) - x;
          const dz = this.cellZ(r0 + dr) - z;
          const d = dx * dx + dz * dz;
          if (d < bestD) {
            bestD = d;
            best = i;
          }
        }
      }
      if (best >= 0) return best;
    }
    return -1;
  }

  private linkOk(from: number, to: number): boolean {
    if (!this.isWalkableIndex(to)) return false;
    const dy = this.height[to] - this.height[from];
    return dy <= MAX_STEP_UP && dy >= -MAX_DROP;
  }

  /** Straight-line walkability, used for path smoothing and by the AI for "can I just go". */
  lineClear(ax: number, az: number, bx: number, bz: number): boolean {
    const dx = bx - ax;
    const dz = bz - az;
    const dist = Math.hypot(dx, dz);
    const steps = Math.max(1, Math.ceil(dist / (CELL * 0.5)));
    let prev = this.indexAt(ax, az);
    if (!this.isWalkableIndex(prev)) return false;
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const idx = this.indexAt(ax + dx * t, az + dz * t);
      if (idx === prev) continue;
      if (!this.linkOk(prev, idx)) return false;
      prev = idx;
    }
    return true;
  }

  /**
   * A* between two world positions. Returns a smoothed list of waypoints (including the
   * exact goal) or null when unreachable.
   */
  findPath(from: Vec3, to: Vec3, out: Vec3[] = []): Vec3[] | null {
    out.length = 0;
    const start = this.nearestWalkable(from.x, from.z);
    const goal = this.nearestWalkable(to.x, to.z);
    if (start < 0 || goal < 0) return null;
    if (start === goal) {
      out.push(new Vec3(to.x, this.height[goal], to.z));
      return out;
    }

    const id = ++this.queryId;
    this.open.clear();
    const gx = this.cellX(goal % this.cols);
    const gz = this.cellZ(Math.floor(goal / this.cols));

    const heuristic = (i: number) => {
      const dx = Math.abs(this.cellX(i % this.cols) - gx);
      const dz = Math.abs(this.cellZ(Math.floor(i / this.cols)) - gz);
      // Octile distance.
      return Math.max(dx, dz) + (Math.SQRT2 - 1) * Math.min(dx, dz);
    };

    this.stamp[start] = id;
    this.gScore[start] = 0;
    this.fScore[start] = heuristic(start);
    this.cameFrom[start] = -1;
    this.closed[start] = 0;
    this.open.push(start, this.fScore[start]);

    let found = false;
    let guard = 0;
    while (this.open.size > 0 && guard++ < 200000) {
      const current = this.open.pop();
      if (this.closed[current] === 1 && this.stamp[current] === id) continue;
      this.closed[current] = 1;
      if (current === goal) {
        found = true;
        break;
      }

      const c = current % this.cols;
      const r = (current - c) / this.cols;

      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dc === 0 && dr === 0) continue;
          const nc = c + dc;
          const nr = r + dr;
          if (nc < 0 || nr < 0 || nc >= this.cols || nr >= this.rows) continue;
          const n = nr * this.cols + nc;
          if (!this.linkOk(current, n)) continue;

          if (dc !== 0 && dr !== 0) {
            // No corner cutting.
            if (!this.linkOk(current, r * this.cols + nc)) continue;
            if (!this.linkOk(current, nr * this.cols + c)) continue;
          }

          const stepCost = dc !== 0 && dr !== 0 ? Math.SQRT2 : 1;
          const climb = Math.abs(this.height[n] - this.height[current]) * 0.6;
          const tentative = this.gScore[current] + stepCost + climb;

          if (this.stamp[n] !== id) {
            this.stamp[n] = id;
            this.gScore[n] = Infinity;
            this.closed[n] = 0;
            this.cameFrom[n] = -1;
          }
          if (tentative < this.gScore[n]) {
            this.gScore[n] = tentative;
            this.cameFrom[n] = current;
            this.fScore[n] = tentative + heuristic(n);
            this.open.push(n, this.fScore[n]);
          }
        }
      }
    }

    if (!found) return null;

    // Reconstruct.
    const cells: number[] = [];
    for (let i = goal; i !== -1; i = this.cameFrom[i]) {
      cells.push(i);
      if (i === start) break;
    }
    cells.reverse();

    // String pulling: drop intermediate points we can walk past directly.
    const pts: Vec3[] = cells.map(
      (i) => new Vec3(this.cellX(i % this.cols), this.height[i], this.cellZ(Math.floor(i / this.cols))),
    );
    pts[pts.length - 1] = new Vec3(to.x, this.height[goal], to.z);

    let anchor = 0;
    out.push(pts[0]);
    while (anchor < pts.length - 1) {
      let next = anchor + 1;
      for (let probe = pts.length - 1; probe > anchor + 1; probe--) {
        if (this.lineClear(pts[anchor].x, pts[anchor].z, pts[probe].x, pts[probe].z)) {
          next = probe;
          break;
        }
      }
      out.push(pts[next]);
      anchor = next;
    }
    if (out.length > 1) out.shift(); // The first point is where we already are.
    return out;
  }

  randomWalkable(rand: () => number): Vec3 {
    for (let tries = 0; tries < 200; tries++) {
      const i = Math.floor(rand() * this.walkable.length);
      if (this.walkable[i] === 1) {
        return new Vec3(this.cellX(i % this.cols), this.height[i], this.cellZ(Math.floor(i / this.cols)));
      }
    }
    return new Vec3(0, 0, 0);
  }

  countWalkable(): number {
    let n = 0;
    for (let i = 0; i < this.walkable.length; i++) n += this.walkable[i];
    return n;
  }
}
