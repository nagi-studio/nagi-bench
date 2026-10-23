// Navigation grid + A* pathfinding + string-pulling. Built from the collision world so
// bots can never be routed through solids. 0.5m cells, agent radius inflation, height-
// continuity checks (cliffs are not traversable), and a wall-proximity cost so bots keep
// away from corners instead of grinding along walls.

import type { World } from '../world/World';
import { BODY_RADIUS, STEP_HEIGHT } from '../config';
import type { V2 } from '../math';
import type { Rect } from '../world/MapData';

export interface PathPoint {
  x: number;
  y: number;
  z: number;
}

const SQRT2 = Math.SQRT2;
const MAX_DH = 0.36; // per 0.5m cell

class MinHeap {
  private idx: Int32Array;
  private key: Float32Array;
  size = 0;
  constructor(cap: number) {
    this.idx = new Int32Array(cap);
    this.key = new Float32Array(cap);
  }
  clear() {
    this.size = 0;
  }
  push(i: number, k: number) {
    if (this.size >= this.idx.length) {
      const ni = new Int32Array(this.idx.length * 2);
      ni.set(this.idx);
      const nk = new Float32Array(this.key.length * 2);
      nk.set(this.key);
      this.idx = ni;
      this.key = nk;
    }
    let n = this.size++;
    while (n > 0) {
      const p = (n - 1) >> 1;
      if (this.key[p] <= k) break;
      this.idx[n] = this.idx[p];
      this.key[n] = this.key[p];
      n = p;
    }
    this.idx[n] = i;
    this.key[n] = k;
  }
  pop(): number {
    const top = this.idx[0];
    const lastI = this.idx[--this.size];
    const lastK = this.key[this.size];
    let n = 0;
    for (;;) {
      let c = n * 2 + 1;
      if (c >= this.size) break;
      if (c + 1 < this.size && this.key[c + 1] < this.key[c]) c++;
      if (this.key[c] >= lastK) break;
      this.idx[n] = this.idx[c];
      this.key[n] = this.key[c];
      n = c;
    }
    this.idx[n] = lastI;
    this.key[n] = lastK;
    return top;
  }
}

export class NavGrid {
  readonly cs = 0.5;
  readonly W: number;
  readonly D: number;
  readonly walk: Uint8Array;
  readonly h: Float32Array;
  readonly extra: Float32Array;
  private g: Float32Array;
  private parent: Int32Array;
  private seen: Uint32Array;
  private closed: Uint32Array;
  private gen = 0;
  private heap: MinHeap;
  readonly world: World;

  constructor(world: World) {
    this.world = world;
    const map = world.map;
    this.W = Math.round(map.W / this.cs);
    this.D = Math.round(map.D / this.cs);
    const N = this.W * this.D;
    this.walk = new Uint8Array(N);
    this.h = new Float32Array(N);
    this.extra = new Float32Array(N);
    this.g = new Float32Array(N);
    this.parent = new Int32Array(N);
    this.seen = new Uint32Array(N);
    this.closed = new Uint32Array(N);
    this.heap = new MinHeap(4096);

    const cs = this.cs;
    const inflate = BODY_RADIUS + 0.02;
    for (let j = 0; j < this.D; j++)
      for (let i = 0; i < this.W; i++) {
        const idx = j * this.W + i;
        const cx = (i + 0.5) * cs;
        const cz = (j + 0.5) * cs;
        const fh = world.floorAt(cx, cz);
        if (Number.isNaN(fh)) continue;
        this.h[idx] = fh;
        const x0 = i * cs - inflate, x1 = (i + 1) * cs + inflate;
        const z0 = j * cs - inflate, z1 = (j + 1) * cs + inflate;
        let free = true;
        // floor of the whole inflated footprint must exist (no hanging over void/cliffs)
        for (const [sx, sz] of [
          [x0, z0],
          [x1, z0],
          [x0, z1],
          [x1, z1],
        ]) {
          const h2 = world.floorAt(sx, sz);
          if (Number.isNaN(h2) || Math.abs(h2 - fh) > 0.6) free = false;
        }
        if (free) {
          for (const b of world.boxesNear(x0, z0, x1, z1)) {
            if (x1 <= b.minX || x0 >= b.maxX || z1 <= b.minZ || z0 >= b.maxZ) continue;
            if (b.maxY > fh + STEP_HEIGHT * 0.5 && b.minY < fh + 1.75) {
              free = false;
              break;
            }
          }
        }
        if (free) this.walk[idx] = 1;
      }

    // Wall-proximity penalty via multi-source BFS distance from blocked cells.
    const dist = new Int16Array(N).fill(-1);
    const q: number[] = [];
    for (let k = 0; k < N; k++)
      if (!this.walk[k]) {
        dist[k] = 0;
        q.push(k);
      }
    for (let qi = 0; qi < q.length; qi++) {
      const k = q[qi];
      const i = k % this.W, j = (k / this.W) | 0;
      const d = dist[k];
      if (d >= 4) continue;
      for (const [di, dj] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const ni = i + di, nj = j + dj;
        if (ni < 0 || nj < 0 || ni >= this.W || nj >= this.D) continue;
        const nk = nj * this.W + ni;
        if (dist[nk] !== -1) continue;
        dist[nk] = d + 1;
        q.push(nk);
      }
    }
    for (let k = 0; k < N; k++) {
      if (!this.walk[k]) continue;
      const d = dist[k] === -1 ? 9 : dist[k];
      this.extra[k] = d <= 3 ? (4 - d) * 0.45 : 0;
    }
  }

  cellOf(x: number, z: number): number {
    const i = Math.floor(x / this.cs), j = Math.floor(z / this.cs);
    if (i < 0 || j < 0 || i >= this.W || j >= this.D) return -1;
    return j * this.W + i;
  }

  isWalkable(x: number, z: number): boolean {
    const c = this.cellOf(x, z);
    return c >= 0 && this.walk[c] === 1;
  }

  center(c: number): PathPoint {
    const i = c % this.W, j = (c / this.W) | 0;
    return { x: (i + 0.5) * this.cs, y: this.h[c], z: (j + 0.5) * this.cs };
  }

  nearestWalkable(x: number, z: number, maxR = 12): number {
    const c = this.cellOf(x, z);
    if (c >= 0 && this.walk[c]) return c;
    const ci = Math.floor(x / this.cs), cj = Math.floor(z / this.cs);
    let best = -1;
    let bestD = Infinity;
    for (let r = 1; r <= maxR; r++) {
      for (let dj = -r; dj <= r; dj++)
        for (let di = -r; di <= r; di++) {
          if (Math.abs(di) !== r && Math.abs(dj) !== r) continue;
          const i = ci + di, j = cj + dj;
          if (i < 0 || j < 0 || i >= this.W || j >= this.D) continue;
          const k = j * this.W + i;
          if (!this.walk[k]) continue;
          const d = di * di + dj * dj;
          if (d < bestD) {
            bestD = d;
            best = k;
          }
        }
      if (best >= 0) return best;
    }
    return -1;
  }

  private canStep(a: number, b: number): boolean {
    return this.walk[b] === 1 && Math.abs(this.h[a] - this.h[b]) <= MAX_DH;
  }

  /** A* from world position to world position; returns smoothed waypoints (excluding start). */
  findPath(sx: number, sz: number, gx: number, gz: number): PathPoint[] | null {
    const start = this.nearestWalkable(sx, sz);
    const goal = this.nearestWalkable(gx, gz);
    if (start < 0 || goal < 0) return null;
    if (start === goal) return [this.center(goal)];
    const W = this.W;
    const gen = ++this.gen;
    const gi = goal % W, gj = (goal / W) | 0;
    const heur = (k: number) => {
      const dx = Math.abs((k % W) - gi), dz = Math.abs(((k / W) | 0) - gj);
      return dx + dz + (SQRT2 - 2) * Math.min(dx, dz);
    };
    const heap = this.heap;
    heap.clear();
    this.g[start] = 0;
    this.seen[start] = gen;
    this.parent[start] = -1;
    heap.push(start, heur(start));
    let found = false;
    let iter = 0;
    while (heap.size > 0 && iter++ < 200000) {
      const cur = heap.pop();
      if (this.closed[cur] === gen) continue;
      this.closed[cur] = gen;
      if (cur === goal) {
        found = true;
        break;
      }
      const ci = cur % W, cj = (cur / W) | 0;
      for (let dj = -1; dj <= 1; dj++)
        for (let di = -1; di <= 1; di++) {
          if (!di && !dj) continue;
          const ni = ci + di, nj = cj + dj;
          if (ni < 0 || nj < 0 || ni >= W || nj >= this.D) continue;
          const nk = nj * W + ni;
          if (this.closed[nk] === gen || !this.canStep(cur, nk)) continue;
          if (di && dj) {
            // no corner cutting
            if (!this.canStep(cur, cj * W + ni) || !this.canStep(cur, nj * W + ci)) continue;
          }
          const step = (di && dj ? SQRT2 : 1) + this.extra[nk];
          const ng = this.g[cur] + step;
          if (this.seen[nk] === gen && ng >= this.g[nk]) continue;
          this.seen[nk] = gen;
          this.g[nk] = ng;
          this.parent[nk] = cur;
          heap.push(nk, ng + heur(nk));
        }
    }
    if (!found) return null;
    const cells: number[] = [];
    for (let k = goal; k !== -1; k = this.parent[k]) cells.push(k);
    cells.reverse();
    return this.smooth(cells);
  }

  /** Walkability of the straight segment between two cells, with a fat (body-width) check. */
  lineWalkable(ax: number, az: number, bx: number, bz: number): boolean {
    const dx = bx - ax, dz = bz - az;
    const len = Math.hypot(dx, dz);
    if (len < 1e-3) return true;
    const nx = -dz / len, nz = dx / len;
    const steps = Math.ceil(len / (this.cs * 0.4));
    for (const off of [0, 0.3, -0.3]) {
      let prev = this.cellOf(ax + nx * off, az + nz * off);
      if (prev < 0 || !this.walk[prev]) {
        if (off === 0) return false;
        prev = this.cellOf(ax, az);
      }
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        const c = this.cellOf(ax + dx * t + nx * off, az + dz * t + nz * off);
        if (c < 0 || !this.walk[c]) return false;
        if (c !== prev && Math.abs(this.h[c] - this.h[prev]) > MAX_DH) return false;
        prev = c;
      }
    }
    return true;
  }

  private smooth(cells: number[]): PathPoint[] {
    const pts = cells.map((c) => this.center(c));
    const out: PathPoint[] = [];
    let anchor = 0;
    while (anchor < pts.length - 1) {
      let far = anchor + 1;
      // greedy: furthest visible point (cap lookahead for speed)
      for (let k = Math.min(pts.length - 1, anchor + 80); k > anchor + 1; k--) {
        if (this.lineWalkable(pts[anchor].x, pts[anchor].z, pts[k].x, pts[k].z)) {
          far = k;
          break;
        }
      }
      out.push(pts[far]);
      anchor = far;
    }
    return out;
  }

  randomPointIn(r: Rect, tries = 40): V2 | null {
    for (let t = 0; t < tries; t++) {
      const x = r.x0 + Math.random() * (r.x1 - r.x0);
      const z = r.z0 + Math.random() * (r.z1 - r.z0);
      const c = this.cellOf(x, z);
      if (c >= 0 && this.walk[c] && this.extra[c] < 0.5) return { x, z };
    }
    return null;
  }

  /** Connected-component label for diagnostics (reachability checks). */
  reachableFrom(x: number, z: number): Uint8Array {
    const out = new Uint8Array(this.W * this.D);
    const s = this.nearestWalkable(x, z);
    if (s < 0) return out;
    const q = [s];
    out[s] = 1;
    for (let qi = 0; qi < q.length; qi++) {
      const k = q[qi];
      const i = k % this.W, j = (k / this.W) | 0;
      for (const [di, dj] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const ni = i + di, nj = j + dj;
        if (ni < 0 || nj < 0 || ni >= this.W || nj >= this.D) continue;
        const nk = nj * this.W + ni;
        if (out[nk] || !this.canStep(k, nk)) continue;
        out[nk] = 1;
        q.push(nk);
      }
    }
    return out;
  }
}
