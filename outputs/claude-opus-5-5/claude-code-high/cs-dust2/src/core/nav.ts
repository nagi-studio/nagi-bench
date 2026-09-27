// Navigation grid (0.5 m) + A* + string-pulling path smoothing.

import type { Solid, World } from './world.ts';

export const NAV_CELL = 0.5;
const AGENT_R = 0.45;
const MAX_CLIMB = 0.3;

export type P2 = [number, number];

class MinHeap {
  private keys: number[] = [];
  private vals: number[] = [];
  get size() {
    return this.keys.length;
  }
  clear() {
    this.keys.length = 0;
    this.vals.length = 0;
  }
  push(k: number, v: number) {
    const keys = this.keys;
    const vals = this.vals;
    let i = keys.length;
    keys.push(k);
    vals.push(v);
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (keys[p] <= k) break;
      keys[i] = keys[p];
      vals[i] = vals[p];
      i = p;
    }
    keys[i] = k;
    vals[i] = v;
  }
  pop(): number {
    const keys = this.keys;
    const vals = this.vals;
    const top = vals[0];
    const lk = keys.pop()!;
    const lv = vals.pop()!;
    const n = keys.length;
    if (n > 0) {
      let i = 0;
      for (;;) {
        const l = i * 2 + 1;
        if (l >= n) break;
        const r = l + 1;
        const c = r < n && keys[r] < keys[l] ? r : l;
        if (keys[c] >= lk) break;
        keys[i] = keys[c];
        vals[i] = vals[c];
        i = c;
      }
      keys[i] = lk;
      vals[i] = lv;
    }
    return top;
  }
}

const DIRS: [number, number, number][] = [
  [1, 0, 1],
  [-1, 0, 1],
  [0, 1, 1],
  [0, -1, 1],
  [1, 1, Math.SQRT2],
  [1, -1, Math.SQRT2],
  [-1, 1, Math.SQRT2],
  [-1, -1, Math.SQRT2],
];

export class NavGrid {
  readonly w: number;
  readonly h: number;
  readonly x0: number;
  readonly z0: number;
  readonly free: Uint8Array;
  readonly height: Float32Array;
  readonly cost: Float32Array;
  readonly component: Int32Array;

  private g: Float32Array;
  private from: Int32Array;
  private seen: Uint32Array;
  private closed: Uint32Array;
  private gen = 1;
  private heap = new MinHeap();

  private world: World;

  constructor(world: World) {
    this.world = world;
    this.x0 = world.gx0;
    this.z0 = world.gz0;
    this.w = Math.round((world.gw * 1) / NAV_CELL);
    this.h = Math.round((world.gh * 1) / NAV_CELL);
    const n = this.w * this.h;
    this.free = new Uint8Array(n);
    this.height = new Float32Array(n);
    this.cost = new Float32Array(n).fill(1);
    this.component = new Int32Array(n).fill(-1);
    this.g = new Float32Array(n);
    this.from = new Int32Array(n);
    this.seen = new Uint32Array(n);
    this.closed = new Uint32Array(n);
    this.build();
  }

  private build() {
    const world = this.world;
    const scratch: Solid[] = [];
    for (let j = 0; j < this.h; j++) {
      for (let i = 0; i < this.w; i++) {
        const idx = j * this.w + i;
        const x = this.x0 + (i + 0.5) * NAV_CELL;
        const z = this.z0 + (j + 0.5) * NAV_CELL;
        const f = world.floorAt(x, z);
        if (f === null) continue;
        this.height[idx] = f;
        let ok = true;
        const list = world.querySolids(x - AGENT_R, z - AGENT_R, x + AGENT_R, z + AGENT_R, scratch);
        for (const s of list) {
          if (s.minY >= f + 1.7 || s.maxY <= f + 0.35) continue;
          const cx = Math.max(s.minX, Math.min(x, s.maxX));
          const cz = Math.max(s.minZ, Math.min(z, s.maxZ));
          if ((x - cx) ** 2 + (z - cz) ** 2 < AGENT_R * AGENT_R) {
            ok = false;
            break;
          }
        }
        // the floor must exist under the whole agent footprint (no hanging over walls)
        if (ok) {
          for (const [ox, oz] of [
            [AGENT_R, 0],
            [-AGENT_R, 0],
            [0, AGENT_R],
            [0, -AGENT_R],
          ]) {
            if (world.floorAt(x + ox, z + oz) === null) {
              ok = false;
              break;
            }
          }
        }
        if (ok) this.free[idx] = 1;
      }
    }
    // Wall proximity cost: prefer paths that keep distance from walls.
    const dist = new Uint8Array(this.w * this.h).fill(255);
    const q: number[] = [];
    for (let idx = 0; idx < dist.length; idx++)
      if (!this.free[idx]) {
        dist[idx] = 0;
        q.push(idx);
      }
    let head = 0;
    while (head < q.length) {
      const idx = q[head++];
      const d = dist[idx];
      if (d >= 3) continue;
      const i = idx % this.w;
      const j = (idx / this.w) | 0;
      for (let k = 0; k < 4; k++) {
        const ni = i + DIRS[k][0];
        const nj = j + DIRS[k][1];
        if (ni < 0 || nj < 0 || ni >= this.w || nj >= this.h) continue;
        const nidx = nj * this.w + ni;
        if (dist[nidx] > d + 1) {
          dist[nidx] = d + 1;
          q.push(nidx);
        }
      }
    }
    for (let idx = 0; idx < dist.length; idx++) {
      if (!this.free[idx]) continue;
      const d = dist[idx];
      this.cost[idx] = d === 1 ? 2.2 : d === 2 ? 1.4 : 1;
    }
    // Connected components (for validation / goal selection)
    let comp = 0;
    for (let idx = 0; idx < this.free.length; idx++) {
      if (!this.free[idx] || this.component[idx] >= 0) continue;
      const stack = [idx];
      this.component[idx] = comp;
      while (stack.length) {
        const c = stack.pop()!;
        const i = c % this.w;
        const j = (c / this.w) | 0;
        for (const [di, dj] of DIRS) {
          const ni = i + di;
          const nj = j + dj;
          if (!this.canStep(i, j, ni, nj)) continue;
          const nidx = nj * this.w + ni;
          if (this.component[nidx] < 0) {
            this.component[nidx] = comp;
            stack.push(nidx);
          }
        }
      }
      comp++;
    }
  }

  cellOf(x: number, z: number): [number, number] {
    return [Math.floor((x - this.x0) / NAV_CELL), Math.floor((z - this.z0) / NAV_CELL)];
  }

  centerOf(i: number, j: number): P2 {
    return [this.x0 + (i + 0.5) * NAV_CELL, this.z0 + (j + 0.5) * NAV_CELL];
  }

  isFree(i: number, j: number): boolean {
    if (i < 0 || j < 0 || i >= this.w || j >= this.h) return false;
    return this.free[j * this.w + i] === 1;
  }

  isFreeAt(x: number, z: number): boolean {
    const [i, j] = this.cellOf(x, z);
    return this.isFree(i, j);
  }

  private canStep(i: number, j: number, ni: number, nj: number): boolean {
    if (!this.isFree(ni, nj)) return false;
    const a = this.height[j * this.w + i];
    const b = this.height[nj * this.w + ni];
    if (Math.abs(a - b) > MAX_CLIMB) return false;
    if (ni !== i && nj !== j) {
      if (!this.isFree(ni, j) || !this.isFree(i, nj)) return false;
    }
    return true;
  }

  /** Nearest free cell to a world point (spiral search). */
  nearestFree(x: number, z: number, maxR = 12): [number, number] | null {
    const [ci, cj] = this.cellOf(x, z);
    if (this.isFree(ci, cj)) return [ci, cj];
    for (let r = 1; r <= maxR; r++) {
      let best: [number, number] | null = null;
      let bd = Infinity;
      for (let dj = -r; dj <= r; dj++)
        for (let di = -r; di <= r; di++) {
          if (Math.abs(di) !== r && Math.abs(dj) !== r) continue;
          if (!this.isFree(ci + di, cj + dj)) continue;
          const d = di * di + dj * dj;
          if (d < bd) {
            bd = d;
            best = [ci + di, cj + dj];
          }
        }
      if (best) return best;
    }
    return null;
  }

  componentAt(x: number, z: number): number {
    const c = this.nearestFree(x, z, 4);
    return c ? this.component[c[1] * this.w + c[0]] : -1;
  }

  findPath(sx: number, sz: number, gx: number, gz: number): P2[] | null {
    const s = this.nearestFree(sx, sz);
    const t = this.nearestFree(gx, gz);
    if (!s || !t) return null;
    const w = this.w;
    const sIdx = s[1] * w + s[0];
    const tIdx = t[1] * w + t[0];
    if (this.component[sIdx] !== this.component[tIdx]) return null;
    const gen = ++this.gen;
    const heap = this.heap;
    const free = this.free;
    const closed = this.closed;
    const height = this.height;
    const cost = this.cost;
    const hgt = this.h;
    const DI = [1, -1, 0, 0, 1, 1, -1, -1];
    const DJ = [0, 0, 1, -1, 1, -1, 1, -1];
    const DC = [1, 1, 1, 1, Math.SQRT2, Math.SQRT2, Math.SQRT2, Math.SQRT2];
    const DOFF = DI.map((di, k) => di + DJ[k] * w);
    heap.clear();
    const hfun = (i: number, j: number) => {
      const dx = Math.abs(i - t[0]);
      const dz = Math.abs(j - t[1]);
      // slightly inflated octile heuristic: much faster, paths remain near-optimal
      return (dx + dz + (Math.SQRT2 - 2) * Math.min(dx, dz)) * 1.2;
    };
    this.g[sIdx] = 0;
    this.seen[sIdx] = gen;
    this.from[sIdx] = -1;
    heap.push(hfun(s[0], s[1]), sIdx);
    let found = false;
    let iterations = 0;
    while (heap.size > 0) {
      const cur = heap.pop();
      if (this.closed[cur] === gen) continue;
      this.closed[cur] = gen;
      if (cur === tIdx) {
        found = true;
        break;
      }
      if (++iterations > 60000) break;
      const i = cur % w;
      const j = (cur / w) | 0;
      const gc = this.g[cur];
      const hc = height[cur];
      for (let k = 0; k < 8; k++) {
        const ni = i + DI[k];
        const nj = j + DJ[k];
        if (ni < 0 || nj < 0 || ni >= w || nj >= hgt) continue;
        const nidx = cur + DOFF[k];
        if (!free[nidx] || closed[nidx] === gen) continue;
        const dh = height[nidx] - hc;
        if (dh > MAX_CLIMB || dh < -MAX_CLIMB) continue;
        if (k >= 4 && (!free[cur + DI[k]] || !free[cur + DJ[k] * w])) continue;
        const ng = gc + DC[k] * cost[nidx];
        if (this.seen[nidx] !== gen || ng < this.g[nidx]) {
          this.seen[nidx] = gen;
          this.g[nidx] = ng;
          this.from[nidx] = cur;
          heap.push(ng + hfun(ni, nj), nidx);
        }
      }
    }
    if (!found) return null;
    const cells: number[] = [];
    for (let c = tIdx; c !== -1; c = this.from[c]) cells.push(c);
    cells.reverse();
    const pts: P2[] = cells.map((c) => this.centerOf(c % w, (c / w) | 0));
    return this.smooth(pts);
  }

  /** Can an agent walk in a straight line between two points? */
  walkableLine(ax: number, az: number, bx: number, bz: number): boolean {
    const d = Math.hypot(bx - ax, bz - az);
    const steps = Math.max(1, Math.ceil(d / (NAV_CELL * 0.5)));
    let [pi, pj] = this.cellOf(ax, az);
    if (!this.isFree(pi, pj)) return false;
    for (let s = 1; s <= steps; s++) {
      const t = s / steps;
      const [i, j] = this.cellOf(ax + (bx - ax) * t, az + (bz - az) * t);
      if (i === pi && j === pj) continue;
      if (!this.isFree(i, j)) return false;
      if (Math.abs(this.height[j * this.w + i] - this.height[pj * this.w + pi]) > MAX_CLIMB) return false;
      if (i !== pi && j !== pj && (!this.isFree(i, pj) || !this.isFree(pi, j))) return false;
      pi = i;
      pj = j;
    }
    return true;
  }

  private smooth(pts: P2[]): P2[] {
    if (pts.length <= 2) return pts;
    const out: P2[] = [pts[0]];
    let anchor = 0;
    while (anchor < pts.length - 1) {
      let far = anchor + 1;
      // forward scan: extend while the straight segment stays walkable
      for (let k = anchor + 2; k < pts.length; k++) {
        if (this.walkableLine(pts[anchor][0], pts[anchor][1], pts[k][0], pts[k][1])) far = k;
        else break;
      }
      out.push(pts[far]);
      anchor = far;
    }
    return out;
  }

  randomFreeNear(x: number, z: number, radius: number, rnd: () => number = Math.random): P2 {
    for (let tries = 0; tries < 30; tries++) {
      const a = rnd() * Math.PI * 2;
      const r = rnd() * radius;
      const px = x + Math.cos(a) * r;
      const pz = z + Math.sin(a) * r;
      if (this.isFreeAt(px, pz) && this.componentAt(px, pz) === this.componentAt(x, z)) return [px, pz];
    }
    const c = this.nearestFree(x, z);
    return c ? this.centerOf(c[0], c[1]) : [x, z];
  }
}
