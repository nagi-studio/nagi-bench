// Navigation grid generated automatically from the collision world.
// 0.5 m cells store a floor height (2.5D), 8-way connectivity bits (respecting step height and
// ledges), and a wall-clearance penalty so paths prefer the middle of corridors.
// Path queries use A* with a binary heap followed by line-of-walk string pulling.

import { CollisionWorld, STEP_HEIGHT } from './collision';
import { RNG, Vec3 } from './math';

const CS = 0.5;
const BODY_HW = 0.36;
const BODY_H = 1.8;
const MAX_FLOOR = 3.2; // nothing walkable above this height on this map
const MAX_DROP = 1.3;

const DX = [1, 1, 0, -1, -1, -1, 0, 1];
const DZ = [0, 1, 1, 1, 0, -1, -1, -1];
const DCOST = [1, Math.SQRT2, 1, Math.SQRT2, 1, Math.SQRT2, 1, Math.SQRT2];

export class NavGrid {
  readonly cols: number;
  readonly rows: number;
  readonly minX: number;
  readonly minZ: number;
  readonly floor: Float32Array;
  readonly valid: Uint8Array;
  readonly edges: Uint8Array;
  readonly clearance: Uint8Array;
  readonly reachable: Uint8Array;
  private penalty: Float32Array;
  private reachList: number[] = [];

  // A* scratch
  private g: Float32Array;
  private f: Float32Array;
  private from: Int32Array;
  private mark: Uint32Array;
  private closed: Uint32Array;
  private searchId = 0;
  private heap: number[] = [];

  constructor(
    private world: CollisionWorld,
    minX: number,
    minZ: number,
    maxX: number,
    maxZ: number,
    seed: Vec3,
  ) {
    this.minX = minX;
    this.minZ = minZ;
    this.cols = Math.round((maxX - minX) / CS);
    this.rows = Math.round((maxZ - minZ) / CS);
    const n = this.cols * this.rows;
    this.floor = new Float32Array(n);
    this.valid = new Uint8Array(n);
    this.edges = new Uint8Array(n);
    this.clearance = new Uint8Array(n);
    this.reachable = new Uint8Array(n);
    this.penalty = new Float32Array(n);
    this.g = new Float32Array(n);
    this.f = new Float32Array(n);
    this.from = new Int32Array(n);
    this.mark = new Uint32Array(n);
    this.closed = new Uint32Array(n);
    this.build(seed);
  }

  cellX(c: number): number {
    return this.minX + (c + 0.5) * CS;
  }
  cellZ(r: number): number {
    return this.minZ + (r + 0.5) * CS;
  }
  index(x: number, z: number): number {
    const c = Math.floor((x - this.minX) / CS);
    const r = Math.floor((z - this.minZ) / CS);
    if (c < 0 || r < 0 || c >= this.cols || r >= this.rows) return -1;
    return r * this.cols + c;
  }
  point(i: number): Vec3 {
    const c = i % this.cols;
    const r = (i - c) / this.cols;
    return { x: this.cellX(c), y: this.floor[i], z: this.cellZ(r) };
  }

  private build(seed: Vec3): void {
    const { cols, rows, world } = this;
    const tops: number[] = [];
    // 1. floor height per cell: lowest standable surface under the footprint
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const x = this.cellX(c);
        const z = this.cellZ(r);
        tops.length = 0;
        world.topsUnder(x - BODY_HW, z - BODY_HW, x + BODY_HW, z + BODY_HW, tops);
        tops.sort((a, b) => a - b);
        for (let k = 0; k < tops.length; k++) {
          const y = tops[k];
          if (y < 0 || y > MAX_FLOOR) continue;
          if (world.bodyFits(x, y, z, BODY_HW, BODY_H)) {
            this.floor[i] = y;
            this.valid[i] = 1;
            break;
          }
        }
      }
    }
    // 2. connectivity
    const canStep = (i: number, j: number, c: number, r: number, d: number): boolean => {
      if (!this.valid[j]) return false;
      const dy = this.floor[j] - this.floor[i];
      if (dy > STEP_HEIGHT - 0.01 || dy < -MAX_DROP) return false;
      const mx = this.cellX(c) + DX[d] * CS * 0.5;
      const mz = this.cellZ(r) + DZ[d] * CS * 0.5;
      const y = Math.max(this.floor[i], this.floor[j]);
      return world.bodyFits(mx, y, mz, BODY_HW, BODY_H);
    };
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        if (!this.valid[i]) continue;
        let bits = 0;
        for (let d = 0; d < 8; d += 2) {
          const nc = c + DX[d];
          const nr = r + DZ[d];
          if (nc < 0 || nr < 0 || nc >= cols || nr >= rows) continue;
          if (canStep(i, nr * cols + nc, c, r, d)) bits |= 1 << d;
        }
        this.edges[i] = bits;
      }
    }
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        if (!this.valid[i]) continue;
        let bits = this.edges[i];
        for (let d = 1; d < 8; d += 2) {
          const nc = c + DX[d];
          const nr = r + DZ[d];
          if (nc < 0 || nr < 0 || nc >= cols || nr >= rows) continue;
          const j = nr * cols + nc;
          const a = (d + 7) % 8;
          const b = (d + 1) % 8;
          // A diagonal is only allowed when both orthogonal detours are open and level.
          if (!(bits & (1 << a)) || !(bits & (1 << b))) continue;
          const ia = (r + DZ[a]) * cols + c + DX[a];
          const ib = (r + DZ[b]) * cols + c + DX[b];
          if (Math.abs(this.floor[ia] - this.floor[i]) > 0.3 || Math.abs(this.floor[ib] - this.floor[i]) > 0.3) continue;
          if (Math.abs(this.floor[j] - this.floor[i]) > 0.3) continue;
          if (canStep(i, j, c, r, d)) bits |= 1 << d;
        }
        this.edges[i] = bits;
      }
    }
    // 3. clearance: BFS distance (in cells) from anything a body cannot freely walk through
    const dist = this.clearance;
    dist.fill(255);
    let frontier: number[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        if (!this.valid[i]) {
          dist[i] = 0;
          frontier.push(i);
          continue;
        }
        // cells next to a ledge or an obstacle are "distance 1"
        const e = this.edges[i];
        let blocked = false;
        for (let d = 0; d < 8; d += 2) {
          if (!(e & (1 << d))) {
            blocked = true;
            break;
          }
          const j = (r + DZ[d]) * cols + c + DX[d];
          if (!(this.edges[j] & (1 << ((d + 4) % 8)))) {
            blocked = true;
            break;
          }
        }
        if (blocked) {
          dist[i] = 1;
          frontier.push(i);
        }
      }
    }
    for (let depth = 0; depth < 6 && frontier.length; depth++) {
      const next: number[] = [];
      for (const i of frontier) {
        const c = i % cols;
        const r = (i - c) / cols;
        for (let d = 0; d < 8; d++) {
          const nc = c + DX[d];
          const nr = r + DZ[d];
          if (nc < 0 || nr < 0 || nc >= cols || nr >= rows) continue;
          const j = nr * cols + nc;
          if (dist[j] > dist[i] + 1) {
            dist[j] = dist[i] + 1;
            next.push(j);
          }
        }
      }
      frontier = next;
    }
    for (let i = 0; i < dist.length; i++) {
      const d = dist[i];
      this.penalty[i] = d <= 1 ? 2.5 : d === 2 ? 0.9 : d === 3 ? 0.3 : 0;
    }
    // 4. reachability flood fill from a spawn so stray islands (crate tops, out of bounds) are ignored
    const start = this.nearestValid(seed.x, seed.z, seed.y, false);
    if (start >= 0) {
      const stack = [start];
      this.reachable[start] = 1;
      while (stack.length) {
        const i = stack.pop() as number;
        this.reachList.push(i);
        const c = i % cols;
        const r = (i - c) / cols;
        const e = this.edges[i];
        for (let d = 0; d < 8; d++) {
          if (!(e & (1 << d))) continue;
          const j = (r + DZ[d]) * cols + c + DX[d];
          if (!this.reachable[j]) {
            this.reachable[j] = 1;
            stack.push(j);
          }
        }
      }
    }
  }

  get reachableCount(): number {
    return this.reachList.length;
  }

  /** Nearest valid (optionally reachable) cell to a world position; prefers the same floor level. */
  nearestValid(x: number, z: number, y = 0, needReach = true): number {
    const c0 = Math.floor((x - this.minX) / CS);
    const r0 = Math.floor((z - this.minZ) / CS);
    let best = -1;
    let bestD = Infinity;
    const R = 10;
    for (let r = r0 - R; r <= r0 + R; r++) {
      if (r < 0 || r >= this.rows) continue;
      for (let c = c0 - R; c <= c0 + R; c++) {
        if (c < 0 || c >= this.cols) continue;
        const i = r * this.cols + c;
        if (!this.valid[i] || (needReach && !this.reachable[i])) continue;
        const ddx = this.cellX(c) - x;
        const ddz = this.cellZ(r) - z;
        const ddy = (this.floor[i] - y) * 2.5;
        const d = ddx * ddx + ddz * ddz + ddy * ddy;
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
    }
    return best;
  }

  /** Projects an XZ point onto the walkable mesh. */
  project(x: number, z: number, y = 0): Vec3 {
    const i = this.nearestValid(x, z, y, true);
    if (i < 0) return { x, y, z };
    const p = this.point(i);
    // keep the exact coordinates when the containing cell itself is fine
    const own = this.index(x, z);
    if (own === i) {
      p.x = x;
      p.z = z;
    }
    return p;
  }

  randomPoint(rng: RNG): Vec3 {
    const i = this.reachList[Math.floor(rng.next() * this.reachList.length)];
    return this.point(i);
  }

  // ------------------------------------------------------------------ A*
  private heapPush(i: number): void {
    const h = this.heap;
    const f = this.f;
    let k = h.length;
    h.push(i);
    while (k > 0) {
      const p = (k - 1) >> 1;
      if (f[h[p]] <= f[i]) break;
      h[k] = h[p];
      k = p;
    }
    h[k] = i;
  }
  private heapPop(): number {
    const h = this.heap;
    const f = this.f;
    const top = h[0];
    const last = h.pop() as number;
    const n = h.length;
    if (n > 0) {
      let k = 0;
      for (;;) {
        let ch = k * 2 + 1;
        if (ch >= n) break;
        if (ch + 1 < n && f[h[ch + 1]] < f[h[ch]]) ch++;
        if (f[h[ch]] >= f[last]) break;
        h[k] = h[ch];
        k = ch;
      }
      h[k] = last;
    }
    return top;
  }

  /**
   * Shortest path between two world positions as a list of smoothed waypoints
   * (excluding the start, including the goal), or null when unreachable.
   */
  findPath(from: Vec3, to: Vec3): Vec3[] | null {
    const start = this.nearestValid(from.x, from.z, from.y, true);
    const goal = this.nearestValid(to.x, to.z, to.y, true);
    if (start < 0 || goal < 0) return null;
    if (start === goal) return [this.point(goal)];
    const cols = this.cols;
    const id = ++this.searchId;
    const gc = goal % cols;
    const gr = (goal - gc) / cols;
    const heur = (i: number): number => {
      const c = i % cols;
      const r = (i - c) / cols;
      const dx = Math.abs(c - gc);
      const dz = Math.abs(r - gr);
      return (Math.max(dx, dz) + (Math.SQRT2 - 1) * Math.min(dx, dz)) * CS;
    };
    this.heap.length = 0;
    this.g[start] = 0;
    this.f[start] = heur(start);
    this.from[start] = -1;
    this.mark[start] = id;
    this.heapPush(start);
    let found = false;
    while (this.heap.length) {
      const i = this.heapPop();
      if (this.closed[i] === id) continue;
      this.closed[i] = id;
      if (i === goal) {
        found = true;
        break;
      }
      const c = i % cols;
      const r = (i - c) / cols;
      const e = this.edges[i];
      const gi = this.g[i];
      for (let d = 0; d < 8; d++) {
        if (!(e & (1 << d))) continue;
        const j = (r + DZ[d]) * cols + c + DX[d];
        if (this.closed[j] === id) continue;
        const ng = gi + DCOST[d] * CS * (1 + this.penalty[j]);
        if (this.mark[j] !== id || ng < this.g[j]) {
          this.mark[j] = id;
          this.g[j] = ng;
          this.f[j] = ng + heur(j);
          this.from[j] = i;
          this.heapPush(j);
        }
      }
    }
    if (!found) return null;
    const cellsPath: number[] = [];
    for (let i = goal; i !== -1; i = this.from[i]) cellsPath.push(i);
    cellsPath.reverse();
    return this.smooth(cellsPath);
  }

  /** Total length of a path from a start position. */
  pathLength(from: Vec3, path: Vec3[]): number {
    let len = 0;
    let px = from.x;
    let pz = from.z;
    for (const p of path) {
      len += Math.hypot(p.x - px, p.z - pz);
      px = p.x;
      pz = p.z;
    }
    return len;
  }

  /** A straight walk between two cells is allowed when every cell on the way is open and level-ish. */
  private lineWalkable(a: number, b: number): boolean {
    const pa = this.point(a);
    const pb = this.point(b);
    const dx = pb.x - pa.x;
    const dz = pb.z - pa.z;
    const len = Math.hypot(dx, dz);
    const steps = Math.ceil(len / 0.2);
    let prev = a;
    for (let s = 1; s <= steps; s++) {
      const t = s / steps;
      const i = this.index(pa.x + dx * t, pa.z + dz * t);
      if (i < 0 || !this.valid[i] || this.clearance[i] < 2) return false;
      if (i !== prev) {
        if (Math.abs(this.floor[i] - this.floor[prev]) > 0.3) return false;
        prev = i;
      }
    }
    return true;
  }

  private smooth(cells: number[]): Vec3[] {
    const out: Vec3[] = [];
    let anchor = 0;
    while (anchor < cells.length - 1) {
      // furthest cell reachable in a straight line from the anchor
      let next = anchor + 1;
      const limit = Math.min(cells.length - 1, anchor + 80);
      for (let k = limit; k > anchor + 1; k--) {
        if (this.lineWalkable(cells[anchor], cells[k])) {
          next = k;
          break;
        }
      }
      out.push(this.point(cells[next]));
      anchor = next;
    }
    return out;
  }
}
