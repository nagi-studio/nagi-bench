// Grid navigation: A* over the map cell grid (8-connected, no corner cutting)
// followed by line-of-sight string pulling with an agent clearance radius.

import { CELL, CELL_FLOOR, COLS, ROWS, cellCenter, worldToCell, inBounds } from './map.ts';
import type { CellRect, MapData } from './map.ts';
import type { V3 } from './math.ts';

class MinHeap {
  ids: number[] = [];
  keys: number[] = [];
  get size() {
    return this.ids.length;
  }
  push(id: number, key: number) {
    const ids = this.ids;
    const keys = this.keys;
    ids.push(id);
    keys.push(key);
    let i = ids.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (keys[p] <= keys[i]) break;
      [ids[p], ids[i]] = [ids[i], ids[p]];
      [keys[p], keys[i]] = [keys[i], keys[p]];
      i = p;
    }
  }
  pop(): number {
    const ids = this.ids;
    const keys = this.keys;
    const top = ids[0];
    const lastId = ids.pop()!;
    const lastKey = keys.pop()!;
    if (ids.length > 0) {
      ids[0] = lastId;
      keys[0] = lastKey;
      let i = 0;
      const n = ids.length;
      for (;;) {
        const l = i * 2 + 1;
        const r = l + 1;
        let m = i;
        if (l < n && keys[l] < keys[m]) m = l;
        if (r < n && keys[r] < keys[m]) m = r;
        if (m === i) break;
        [ids[m], ids[i]] = [ids[i], ids[m]];
        [keys[m], keys[i]] = [keys[i], keys[m]];
        i = m;
      }
    }
    return top;
  }
}

const SQRT2 = Math.SQRT2;

export class NavGrid {
  walk: Uint8Array;
  private g = new Float32Array(COLS * ROWS);
  private parent = new Int32Array(COLS * ROWS);
  private closed = new Uint8Array(COLS * ROWS);
  private stamp = new Uint32Array(COLS * ROWS);
  private curStamp = 0;

  constructor(map: MapData) {
    this.walk = new Uint8Array(COLS * ROWS);
    for (let i = 0; i < COLS * ROWS; i++) this.walk[i] = map.grid[i] === CELL_FLOOR ? 1 : 0;
  }

  isWalkableCell(c: number, r: number) {
    return inBounds(c, r) && this.walk[r * COLS + c] === 1;
  }
  isWalkablePoint(x: number, z: number) {
    const [c, r] = worldToCell(x, z);
    return this.isWalkableCell(c, r);
  }

  nearestWalkable(c: number, r: number): [number, number] {
    if (this.isWalkableCell(c, r)) return [c, r];
    for (let rad = 1; rad < 10; rad++)
      for (let dr = -rad; dr <= rad; dr++)
        for (let dc = -rad; dc <= rad; dc++) {
          if (Math.max(Math.abs(dr), Math.abs(dc)) !== rad) continue;
          if (this.isWalkableCell(c + dc, r + dr)) return [c + dc, r + dr];
        }
    return [c, r];
  }

  /** Raw A* returning cell indices. */
  private astar(sc: number, sr: number, gc: number, gr: number): number[] | null {
    const start = sr * COLS + sc;
    const goal = gr * COLS + gc;
    if (start === goal) return [start];
    this.curStamp++;
    const stamp = this.stamp;
    const g = this.g;
    const parent = this.parent;
    const closed = this.closed;
    const heap = new MinHeap();
    const h = (c: number, r: number) => {
      const dx = Math.abs(c - gc);
      const dy = Math.abs(r - gr);
      return dx + dy + (SQRT2 - 2) * Math.min(dx, dy);
    };
    stamp[start] = this.curStamp;
    g[start] = 0;
    parent[start] = -1;
    closed[start] = 0;
    heap.push(start, h(sc, sr));
    while (heap.size > 0) {
      const cur = heap.pop();
      if (closed[cur] && stamp[cur] === this.curStamp) continue;
      closed[cur] = 1;
      if (cur === goal) {
        const out: number[] = [];
        let n = cur;
        while (n !== -1) {
          out.push(n);
          n = parent[n];
        }
        return out.reverse();
      }
      const cc = cur % COLS;
      const cr = (cur - cc) / COLS;
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          if (!dr && !dc) continue;
          const nc = cc + dc;
          const nr = cr + dr;
          if (!this.isWalkableCell(nc, nr)) continue;
          if (dr && dc && (!this.isWalkableCell(cc + dc, cr) || !this.isWalkableCell(cc, cr + dr))) continue;
          const ni = nr * COLS + nc;
          const cost = g[cur] + (dr && dc ? SQRT2 : 1);
          if (stamp[ni] !== this.curStamp) {
            stamp[ni] = this.curStamp;
            closed[ni] = 0;
            g[ni] = Infinity;
          }
          if (closed[ni]) continue;
          if (cost < g[ni]) {
            g[ni] = cost;
            parent[ni] = cur;
            heap.push(ni, cost + h(nc, nr));
          }
        }
    }
    return null;
  }

  /** Is the straight segment walkable for an agent with the given clearance? */
  lineWalkable(a: V3, b: V3, clearance = 0.5): boolean {
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const d = Math.hypot(dx, dz);
    if (d < 1e-4) return this.isWalkablePoint(a.x, a.z);
    const px = (-dz / d) * clearance;
    const pz = (dx / d) * clearance;
    const steps = Math.ceil(d / 0.25);
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = a.x + dx * t;
      const z = a.z + dz * t;
      if (!this.isWalkablePoint(x, z)) return false;
      if (!this.isWalkablePoint(x + px, z + pz)) return false;
      if (!this.isWalkablePoint(x - px, z - pz)) return false;
    }
    return true;
  }

  /** World-space path from `from` to `to`, string-pulled. */
  findPath(from: V3, to: V3): V3[] | null {
    let [sc, sr] = worldToCell(from.x, from.z);
    let [gc, gr] = worldToCell(to.x, to.z);
    [sc, sr] = this.nearestWalkable(sc, sr);
    const goalWalk = this.isWalkableCell(gc, gr);
    [gc, gr] = this.nearestWalkable(gc, gr);
    const cells = this.astar(sc, sr, gc, gr);
    if (!cells) return null;
    const pts: V3[] = cells.map((i) => {
      const c = i % COLS;
      return cellCenter(c, (i - c) / COLS);
    });
    pts[0] = { x: from.x, y: 0, z: from.z };
    if (goalWalk) pts[pts.length - 1] = { x: to.x, y: 0, z: to.z };
    return this.smooth(pts);
  }

  smooth(pts: V3[]): V3[] {
    if (pts.length <= 2) return pts.slice(1);
    const out: V3[] = [];
    let anchor = 0;
    while (anchor < pts.length - 1) {
      let next = anchor + 1;
      for (let j = pts.length - 1; j > anchor + 1; j--) {
        if (this.lineWalkable(pts[anchor], pts[j], 0.5)) {
          next = j;
          break;
        }
      }
      out.push(pts[next]);
      anchor = next;
    }
    return out;
  }

  /** Path that visits a list of via-points in order. */
  findPathVia(from: V3, points: V3[]): V3[] | null {
    const out: V3[] = [];
    let cur = from;
    for (const p of points) {
      const seg = this.findPath(cur, p);
      if (!seg) return null;
      out.push(...seg);
      cur = p;
    }
    return out;
  }

  randomPointIn(rect: CellRect, tries = 40): V3 {
    for (let i = 0; i < tries; i++) {
      const c = rect.c0 + Math.floor(Math.random() * (rect.c1 - rect.c0 + 1));
      const r = rect.r0 + Math.floor(Math.random() * (rect.r1 - rect.r0 + 1));
      // Require all 4-neighbours walkable so the point is not hugging walls.
      if (
        this.isWalkableCell(c, r) &&
        this.isWalkableCell(c + 1, r) &&
        this.isWalkableCell(c - 1, r) &&
        this.isWalkableCell(c, r + 1) &&
        this.isWalkableCell(c, r - 1)
      ) {
        const p = cellCenter(c, r);
        p.x += (Math.random() - 0.5) * CELL * 0.4;
        p.z += (Math.random() - 0.5) * CELL * 0.4;
        return p;
      }
    }
    const [c, r] = this.nearestWalkable((rect.c0 + rect.c1) >> 1, (rect.r0 + rect.r1) >> 1);
    return cellCenter(c, r);
  }
}
