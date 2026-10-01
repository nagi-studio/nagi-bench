import { PHYS } from '../core/config';
import { MASK_MOVE, type Collider, type CollisionWorld } from './Collision';

export interface NavPoint {
  x: number;
  z: number;
}

const MAX_CLIMB = 0.5;
const SQRT2 = Math.SQRT2;

/** Binary min-heap over cell indices keyed by an external score array. */
class IndexHeap {
  private items: Int32Array;
  private size = 0;

  constructor(capacity: number, private readonly score: Float32Array) {
    this.items = new Int32Array(capacity);
  }

  clear(): void {
    this.size = 0;
  }

  get length(): number {
    return this.size;
  }

  push(i: number): void {
    if (this.size >= this.items.length) {
      const grown = new Int32Array(this.items.length * 2);
      grown.set(this.items);
      this.items = grown;
    }
    let k = this.size++;
    const items = this.items;
    const s = this.score[i];
    while (k > 0) {
      const p = (k - 1) >> 1;
      if (this.score[items[p]] <= s) break;
      items[k] = items[p];
      k = p;
    }
    items[k] = i;
  }

  pop(): number {
    const items = this.items;
    const top = items[0];
    const last = items[--this.size];
    if (this.size > 0) {
      let k = 0;
      const s = this.score[last];
      for (;;) {
        let c = 2 * k + 1;
        if (c >= this.size) break;
        if (c + 1 < this.size && this.score[items[c + 1]] < this.score[items[c]]) c++;
        if (this.score[items[c]] >= s) break;
        items[k] = items[c];
        k = c;
      }
      items[k] = last;
    }
    return top;
  }
}

/**
 * 2.5D navigation grid (one walkable surface per cell). Built from the designer floor raster and
 * validated against the collision world with the agent hull inflated, so a path through walkable
 * cells is always physically traversable. A* with octile heuristic + string-pulling smoothing.
 */
export class NavGrid {
  readonly cols: number;
  readonly rows: number;
  readonly walkable: Uint8Array;
  readonly height: Float32Array;
  /** Chebyshev distance (in cells) to the nearest non-walkable cell, capped. */
  readonly clearance: Uint8Array;

  private readonly g: Float32Array;
  private readonly f: Float32Array;
  private readonly parent: Int32Array;
  private readonly visit: Uint32Array;
  private readonly closed: Uint32Array;
  private generation = 1;
  private readonly heap: IndexHeap;

  constructor(
    readonly originX: number,
    readonly originZ: number,
    readonly res: number,
    cols: number,
    rows: number,
    floorHeight: Float32Array,
    collision: CollisionWorld,
    seeds: NavPoint[],
  ) {
    this.cols = cols;
    this.rows = rows;
    const n = cols * rows;
    this.walkable = new Uint8Array(n);
    this.height = new Float32Array(n);
    this.clearance = new Uint8Array(n);
    this.g = new Float32Array(n);
    this.f = new Float32Array(n);
    this.parent = new Int32Array(n);
    this.visit = new Uint32Array(n);
    this.closed = new Uint32Array(n);
    this.heap = new IndexHeap(4096, this.f);

    // 1. hull-inflated obstacle test per floor cell. Inflating by hull radius + half a cell means
    //    any point inside a walkable cell keeps the square hull clear of geometry, so straight
    //    lines through walkable cells (smoothed paths) never clip convex corners.
    const R = PHYS.radius + res * 0.5;
    const list: Collider[] = [];
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const idx = j * cols + i;
        const h = floorHeight[idx];
        this.height[idx] = Number.isNaN(h) ? 0 : h;
        if (Number.isNaN(h)) continue;
        const cx = originX + (i + 0.5) * res;
        const cz = originZ + (j + 0.5) * res;
        collision.query(cx - R, cz - R, cx + R, cz + R, MASK_MOVE, list);
        let blocked = false;
        for (const c of list) {
          if (c.minY >= h + PHYS.height - 0.05) continue;
          const top = c.topOver(cx - R, cz - R, cx + R, cz + R);
          if (top <= h + PHYS.stepHeight - 0.02) continue;
          blocked = true;
          break;
        }
        if (!blocked) this.walkable[idx] = 1;
      }
    }

    // 2. keep only cells reachable from the spawns (removes unreachable islands)
    const reach = new Uint8Array(n);
    const queue = new Int32Array(n);
    let qh = 0;
    let qt = 0;
    for (const s of seeds) {
      const idx = this.nearestWalkableIndex(s.x, s.z, 6);
      if (idx >= 0 && !reach[idx]) {
        reach[idx] = 1;
        queue[qt++] = idx;
      }
    }
    while (qh < qt) {
      const cur = queue[qh++];
      const ci = cur % cols;
      const cj = (cur - ci) / cols;
      for (let dj = -1; dj <= 1; dj++) {
        for (let di = -1; di <= 1; di++) {
          if (!di && !dj) continue;
          const ni = ci + di;
          const nj = cj + dj;
          if (ni < 0 || nj < 0 || ni >= cols || nj >= rows) continue;
          const nIdx = nj * cols + ni;
          if (reach[nIdx] || !this.canStep(cur, ci, cj, di, dj)) continue;
          reach[nIdx] = 1;
          queue[qt++] = nIdx;
        }
      }
    }
    for (let i = 0; i < n; i++) if (!reach[i]) this.walkable[i] = 0;

    // 3. clearance field (multi-source BFS from blocked cells)
    const dist = this.clearance;
    dist.fill(255);
    qh = 0;
    qt = 0;
    for (let i = 0; i < n; i++) {
      if (!this.walkable[i]) {
        dist[i] = 0;
        queue[qt++] = i;
      }
    }
    while (qh < qt) {
      const cur = queue[qh++];
      const ci = cur % cols;
      const cj = (cur - ci) / cols;
      const d = dist[cur];
      if (d >= 8) continue;
      for (let dj = -1; dj <= 1; dj++) {
        for (let di = -1; di <= 1; di++) {
          const ni = ci + di;
          const nj = cj + dj;
          if (ni < 0 || nj < 0 || ni >= cols || nj >= rows) continue;
          const nIdx = nj * cols + ni;
          if (dist[nIdx] > d + 1) {
            dist[nIdx] = d + 1;
            queue[qt++] = nIdx;
          }
        }
      }
    }
  }

  // ------------------------------------------------------------------ queries

  cellIndex(x: number, z: number): number {
    const i = Math.floor((x - this.originX) / this.res);
    const j = Math.floor((z - this.originZ) / this.res);
    if (i < 0 || j < 0 || i >= this.cols || j >= this.rows) return -1;
    return j * this.cols + i;
  }

  cellCenterX(idx: number): number {
    return this.originX + ((idx % this.cols) + 0.5) * this.res;
  }

  cellCenterZ(idx: number): number {
    return this.originZ + (Math.floor(idx / this.cols) + 0.5) * this.res;
  }

  isWalkable(x: number, z: number): boolean {
    const idx = this.cellIndex(x, z);
    return idx >= 0 && this.walkable[idx] === 1;
  }

  heightAt(x: number, z: number): number {
    const idx = this.cellIndex(x, z);
    return idx >= 0 ? this.height[idx] : 0;
  }

  /**
   * Nearest walkable cell index within `maxRadius` meters (ring search), or -1.
   * With `y`, only cells whose floor is within a step of that height qualify (so a bot standing
   * below a ledge never "recovers" towards the top of it).
   */
  nearestWalkableIndex(x: number, z: number, maxRadius = 4, y?: number): number {
    const ci = Math.floor((x - this.originX) / this.res);
    const cj = Math.floor((z - this.originZ) / this.res);
    const maxR = Math.ceil(maxRadius / this.res);
    let best = -1;
    let bestD = Infinity;
    for (let r = 0; r <= maxR; r++) {
      for (let dj = -r; dj <= r; dj++) {
        for (let di = -r; di <= r; di++) {
          if (Math.max(Math.abs(di), Math.abs(dj)) !== r) continue;
          const i = ci + di;
          const j = cj + dj;
          if (i < 0 || j < 0 || i >= this.cols || j >= this.rows) continue;
          const idx = j * this.cols + i;
          if (!this.walkable[idx]) continue;
          if (y !== undefined && Math.abs(this.height[idx] - y) > MAX_CLIMB + 0.1) continue;
          const d = di * di + dj * dj;
          if (d < bestD) {
            bestD = d;
            best = idx;
          }
        }
      }
      if (best >= 0) return best;
    }
    return -1;
  }

  nearestWalkable(x: number, z: number, maxRadius = 4): NavPoint | null {
    const idx = this.nearestWalkableIndex(x, z, maxRadius);
    if (idx < 0) return null;
    return { x: this.cellCenterX(idx), z: this.cellCenterZ(idx) };
  }

  private canStep(cur: number, ci: number, cj: number, di: number, dj: number): boolean {
    const cols = this.cols;
    const nIdx = (cj + dj) * cols + (ci + di);
    if (!this.walkable[nIdx]) return false;
    const h = this.height[cur];
    if (Math.abs(this.height[nIdx] - h) > MAX_CLIMB) return false;
    if (di !== 0 && dj !== 0) {
      const a = cj * cols + (ci + di);
      const b = (cj + dj) * cols + ci;
      if (!this.walkable[a] || !this.walkable[b]) return false;
      if (Math.abs(this.height[a] - h) > MAX_CLIMB || Math.abs(this.height[b] - h) > MAX_CLIMB) return false;
    }
    return true;
  }

  /** Straight walk check between two points on the grid (used for path smoothing & steering). */
  lineWalkable(ax: number, az: number, bx: number, bz: number): boolean {
    const dx = bx - ax;
    const dz = bz - az;
    const len = Math.hypot(dx, dz);
    const steps = Math.max(1, Math.ceil(len / (this.res * 0.35)));
    let prevIdx = this.cellIndex(ax, az);
    if (prevIdx < 0 || !this.walkable[prevIdx]) return false;
    let prevH = this.height[prevIdx];
    for (let s = 1; s <= steps; s++) {
      const t = s / steps;
      const idx = this.cellIndex(ax + dx * t, az + dz * t);
      if (idx < 0 || !this.walkable[idx]) return false;
      if (idx !== prevIdx) {
        const h = this.height[idx];
        if (Math.abs(h - prevH) > MAX_CLIMB) return false;
        // reject cutting diagonally through two blocked corner cells
        const pi = prevIdx % this.cols;
        const pj = (prevIdx - pi) / this.cols;
        const ni = idx % this.cols;
        const nj = (idx - ni) / this.cols;
        if (pi !== ni && pj !== nj) {
          if (!this.walkable[pj * this.cols + ni] || !this.walkable[nj * this.cols + pi]) return false;
        }
        prevIdx = idx;
        prevH = h;
      }
    }
    return true;
  }

  /**
   * A* from (sx,sz) to (gx,gz). Writes a smoothed waypoint list into `out` (excluding the start).
   * Returns false if no path exists.
   */
  findPath(sx: number, sz: number, gx: number, gz: number, out: NavPoint[], sy?: number): boolean {
    out.length = 0;
    let start = sy !== undefined ? this.nearestWalkableIndex(sx, sz, 3, sy) : -1;
    if (start < 0) start = this.nearestWalkableIndex(sx, sz, 3);
    const goal = this.nearestWalkableIndex(gx, gz, 4);
    if (start < 0 || goal < 0) return false;
    if (start === goal) {
      out.push({ x: gx, z: gz });
      return true;
    }
    const cols = this.cols;
    const gen = ++this.generation;
    const gI = goal % cols;
    const gJ = (goal - gI) / cols;
    const heur = (idx: number): number => {
      const i = idx % cols;
      const j = (idx - i) / cols;
      const dx = Math.abs(i - gI);
      const dz = Math.abs(j - gJ);
      return dx + dz + (SQRT2 - 2) * Math.min(dx, dz);
    };
    const heap = this.heap;
    heap.clear();
    this.g[start] = 0;
    this.f[start] = heur(start);
    this.parent[start] = -1;
    this.visit[start] = gen;
    heap.push(start);
    let found = false;
    let expansions = 0;
    while (heap.length > 0) {
      const cur = heap.pop();
      if (this.closed[cur] === gen) continue;
      this.closed[cur] = gen;
      if (cur === goal) {
        found = true;
        break;
      }
      if (++expansions > 60000) break;
      const ci = cur % cols;
      const cj = (cur - ci) / cols;
      const gCur = this.g[cur];
      for (let dj = -1; dj <= 1; dj++) {
        for (let di = -1; di <= 1; di++) {
          if (!di && !dj) continue;
          const ni = ci + di;
          const nj = cj + dj;
          if (ni < 0 || nj < 0 || ni >= cols || nj >= this.rows) continue;
          const nIdx = nj * cols + ni;
          if (this.closed[nIdx] === gen) continue;
          if (!this.canStep(cur, ci, cj, di, dj)) continue;
          const clr = this.clearance[nIdx];
          const penalty = clr <= 1 ? 1.6 : clr === 2 ? 0.5 : clr === 3 ? 0.15 : 0;
          const ng = gCur + (di && dj ? SQRT2 : 1) * (1 + penalty);
          if (this.visit[nIdx] !== gen || ng < this.g[nIdx]) {
            this.visit[nIdx] = gen;
            this.g[nIdx] = ng;
            this.f[nIdx] = ng + heur(nIdx);
            this.parent[nIdx] = cur;
            heap.push(nIdx);
          }
        }
      }
    }
    if (!found) return false;

    // reconstruct cell chain
    const chain: number[] = [];
    for (let c = goal; c !== -1; c = this.parent[c]) chain.push(c);
    chain.reverse();

    // string pulling
    const pts: NavPoint[] = chain.map((c) => ({ x: this.cellCenterX(c), z: this.cellCenterZ(c) }));
    const goalPt: NavPoint = this.isWalkable(gx, gz) ? { x: gx, z: gz } : pts[pts.length - 1];
    pts[pts.length - 1] = goalPt;
    let anchor: NavPoint = this.isWalkable(sx, sz) ? { x: sx, z: sz } : pts[0];
    for (let k = 1; k < pts.length; k++) {
      if (!this.lineWalkable(anchor.x, anchor.z, pts[k].x, pts[k].z)) {
        const corner = pts[k - 1];
        if (corner !== anchor) {
          out.push(corner);
          anchor = corner;
        }
      }
    }
    out.push(goalPt);
    return true;
  }
}
