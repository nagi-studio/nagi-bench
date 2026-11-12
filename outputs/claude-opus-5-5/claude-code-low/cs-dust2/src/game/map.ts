/**
 * Desert bomb-defusal map ("Sandstorm").
 * The world is described by a 2D cell grid. Every cell has a kind and a solid height.
 * The same grid drives rendering, collision, line-of-sight/bullet raycasts, AI navigation
 * and the minimap, so all of these are always consistent with one another.
 */

export const CELL = 2; // metres per cell
export const GW = 60; // grid width  (x)
export const GH = 70; // grid height (z)
export const WALL_H = 8;
export const STEP_H = 0.45; // max height an agent can step onto without jumping

export const Kind = {
  Floor: 0,
  Wall: 1,
  Crate: 2,
  Door: 3,
} as const;
export type Kind = (typeof Kind)[keyof typeof Kind];

export interface Zone {
  name: string;
  x0: number;
  z0: number;
  x1: number;
  z1: number; // inclusive cell ranges
}

export interface Vec2 {
  x: number;
  z: number;
}

export class GameMap {
  kind = new Uint8Array(GW * GH);
  height = new Float32Array(GW * GH);
  zones: Zone[] = [];
  siteA: Zone;
  siteB: Zone;
  tSpawns: Vec2[] = [];
  ctSpawns: Vec2[] = [];
  /** labelled call-outs for the minimap / HUD */
  callouts: { name: string; x: number; z: number }[] = [];
  /** named strategic points in world coordinates */
  points: Record<string, Vec2> = {};

  constructor() {
    this.kind.fill(Kind.Wall);
    this.height.fill(WALL_H);

    // ---------------------------------------------------------------- layout
    this.carve(23, 3, 37, 11); // CT spawn
    this.carve(41, 4, 55, 18); // A site
    this.carve(37, 6, 41, 10); // CT -> A
    this.carve(3, 4, 17, 18); // B site
    this.carve(17, 6, 23, 10); // CT -> B
    this.carve(27, 11, 33, 50); // Mid
    this.carve(34, 15, 40, 18); // Catwalk (short A), mid -> A
    this.carve(25, 50, 35, 57); // Outside mid / T ramp
    this.carve(20, 57, 40, 66); // T spawn
    this.carve(41, 58, 49, 63); // Outside long
    this.carve(47, 19, 54, 63); // Long A
    this.carve(55, 22, 57, 27); // Long "pit" corner
    this.carve(9, 59, 19, 62); // Upper tunnel entrance
    this.carve(8, 19, 11, 62); // B tunnels (long corridor)
    this.carve(12, 38, 26, 40); // Lower tunnel: mid -> B tunnels

    // Mid doors: two door leaves with a 3-cell gap one can walk through
    for (const x of [27, 28, 32, 33]) this.set(x, 24, Kind.Door, WALL_H);
    // Long doors
    for (const x of [47, 48, 49, 53, 54]) this.set(x, 44, Kind.Door, WALL_H);
    // B tunnel exit doorway pillars
    this.set(8, 19, Kind.Wall, WALL_H);
    // Catwalk entrance lip (single crate step, jumpable)
    this.set(34, 18, Kind.Crate, 1.1);

    // ---------------------------------------------------------------- crates
    const crates: [number, number, number][] = [
      // A site
      [45, 9, 2.2], [46, 9, 2.2], [45, 10, 1.1], [50, 12, 1.1], [51, 12, 2.2],
      [43, 15, 1.1], [54, 6, 2.2], [54, 7, 1.1], [48, 5, 1.1],
      // B site
      [5, 8, 2.2], [6, 8, 2.2], [5, 9, 1.1], [12, 12, 1.1], [13, 12, 2.2],
      [15, 6, 1.1], [4, 15, 2.2], [4, 16, 1.1],
      // Mid
      [30, 42, 1.1], [28, 30, 2.2], [32, 18, 1.1],
      // Long
      [53, 31, 2.2], [52, 31, 1.1], [48, 52, 1.1], [56, 24, 2.2],
      // T spawn / outside
      [24, 60, 1.1], [36, 64, 2.2], [43, 60, 2.2],
      // CT spawn
      [25, 5, 1.1], [36, 4, 2.2],
      // tunnels
      [10, 30, 1.1], [21, 38, 1.1],
    ];
    for (const [x, z, h] of crates) this.set(x, z, Kind.Crate, h);

    // ---------------------------------------------------------------- zones
    this.siteA = { name: 'A', x0: 42, z0: 5, x1: 55, z1: 17 };
    this.siteB = { name: 'B', x0: 3, z0: 5, x1: 16, z1: 17 };
    this.zones.push(this.siteA, this.siteB);

    for (let i = 0; i < 5; i++) {
      this.tSpawns.push(this.cellCenter(24 + i * 3, 63));
      this.ctSpawns.push(this.cellCenter(27 + i * 2, 8));
    }

    const p = (name: string, cx: number, cz: number) => (this.points[name] = this.cellCenter(cx, cz));
    p('siteA', 48, 11);
    p('siteB', 10, 11);
    p('plantA', 47, 12);
    p('plantB', 9, 12);
    p('longMid', 50, 40);
    p('longCorner', 51, 22);
    p('catwalk', 37, 16);
    p('midDoors', 30, 27);
    p('midTop', 30, 14);
    p('tunnel', 9, 45);
    p('tunnelExit', 9, 21);
    p('lowerTunnel', 18, 39);
    p('ctSpawn', 30, 7);
    p('tSpawn', 30, 62);
    p('holdA1', 44, 13);
    p('holdA2', 52, 9);
    p('holdA3', 50, 17);
    p('holdB1', 11, 15);
    p('holdB2', 14, 9);
    p('holdB3', 6, 12);
    p('holdMid', 30, 16);
    p('outsideLong', 45, 60);

    this.callouts = [
      { name: 'T 出生点', ...this.cellCenter(30, 62) },
      { name: 'CT 出生点', ...this.cellCenter(30, 6) },
      { name: 'A 点', ...this.cellCenter(48, 10) },
      { name: 'B 点', ...this.cellCenter(10, 10) },
      { name: 'A 大', ...this.cellCenter(51, 36) },
      { name: '中路', ...this.cellCenter(30, 34) },
      { name: '中门', ...this.cellCenter(30, 24) },
      { name: '猫道', ...this.cellCenter(37, 16) },
      { name: 'B 洞', ...this.cellCenter(9, 45) },
    ];
  }

  private carve(x0: number, z0: number, x1: number, z1: number) {
    for (let z = z0; z <= z1; z++)
      for (let x = x0; x <= x1; x++) {
        if (x <= 0 || z <= 0 || x >= GW - 1 || z >= GH - 1) continue; // keep border solid
        this.set(x, z, Kind.Floor, 0);
      }
  }

  set(x: number, z: number, k: Kind, h: number) {
    const i = z * GW + x;
    this.kind[i] = k;
    this.height[i] = h;
  }

  inGrid(cx: number, cz: number) {
    return cx >= 0 && cz >= 0 && cx < GW && cz < GH;
  }

  kindAt(cx: number, cz: number): Kind {
    if (!this.inGrid(cx, cz)) return Kind.Wall;
    return this.kind[cz * GW + cx] as Kind;
  }

  heightAt(cx: number, cz: number): number {
    if (!this.inGrid(cx, cz)) return WALL_H;
    return this.height[cz * GW + cx];
  }

  cellCenter(cx: number, cz: number): Vec2 {
    return { x: cx * CELL + CELL / 2, z: cz * CELL + CELL / 2 };
  }

  toCell(x: number, z: number) {
    return { cx: Math.floor(x / CELL), cz: Math.floor(z / CELL) };
  }

  inZone(zone: Zone, x: number, z: number) {
    const { cx, cz } = this.toCell(x, z);
    return cx >= zone.x0 && cx <= zone.x1 && cz >= zone.z0 && cz <= zone.z1;
  }

  /** Which bomb site (if any) a world position is inside. */
  siteAt(x: number, z: number): 'A' | 'B' | null {
    if (this.inZone(this.siteA, x, z)) return 'A';
    if (this.inZone(this.siteB, x, z)) return 'B';
    return null;
  }

  // ====================================================================== physics

  /** Highest surface under a square footprint that the agent can stand on. */
  groundHeight(x: number, z: number, r: number, feetY: number): number {
    let g = 0;
    const c0 = this.toCell(x - r, z - r);
    const c1 = this.toCell(x + r, z + r);
    for (let cz = c0.cz; cz <= c1.cz; cz++)
      for (let cx = c0.cx; cx <= c1.cx; cx++) {
        const h = this.heightAt(cx, cz);
        if (h <= feetY + STEP_H && h > g) g = h;
      }
    return g;
  }

  private blocks(cx: number, cz: number, feetY: number) {
    return this.heightAt(cx, cz) > feetY + STEP_H;
  }

  /**
   * Move a square-footprint body (half-size r) by (dx,dz), axis-separated,
   * resolving against every blocking cell. Mutates and returns pos.
   */
  moveBody(pos: { x: number; y: number; z: number }, dx: number, dz: number, r: number) {
    // sub-step to avoid tunnelling at high speed
    const steps = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dz)) / (r * 0.9)));
    const sx = dx / steps;
    const sz = dz / steps;
    for (let s = 0; s < steps; s++) {
      pos.x += sx;
      this.resolveAxis(pos, r, 'x', sx);
      pos.z += sz;
      this.resolveAxis(pos, r, 'z', sz);
    }
    return pos;
  }

  private resolveAxis(pos: { x: number; y: number; z: number }, r: number, axis: 'x' | 'z', d: number) {
    if (d === 0) return;
    const eps = 1e-4;
    const c0 = this.toCell(pos.x - r, pos.z - r);
    const c1 = this.toCell(pos.x + r - eps, pos.z + r - eps);
    for (let cz = c0.cz; cz <= c1.cz; cz++)
      for (let cx = c0.cx; cx <= c1.cx; cx++) {
        if (!this.blocks(cx, cz, pos.y)) continue;
        if (axis === 'x') {
          if (d > 0) pos.x = Math.min(pos.x, cx * CELL - r - eps);
          else pos.x = Math.max(pos.x, (cx + 1) * CELL + r + eps);
        } else {
          if (d > 0) pos.z = Math.min(pos.z, cz * CELL - r - eps);
          else pos.z = Math.max(pos.z, (cz + 1) * CELL + r + eps);
        }
      }
  }

  /**
   * 3D ray vs grid (DDA). Returns distance to the first solid hit (walls, crates, floor)
   * or Infinity if nothing within maxDist.
   */
  raycast(ox: number, oy: number, oz: number, dx: number, dy: number, dz: number, maxDist: number): number {
    let tBest = Infinity;
    // floor plane
    if (dy < -1e-6) {
      const tg = -oy / dy;
      if (tg >= 0 && tg < maxDist) tBest = tg;
    }
    let cx = Math.floor(ox / CELL);
    let cz = Math.floor(oz / CELL);
    const stepX = dx > 0 ? 1 : -1;
    const stepZ = dz > 0 ? 1 : -1;
    const tDeltaX = dx !== 0 ? Math.abs(CELL / dx) : Infinity;
    const tDeltaZ = dz !== 0 ? Math.abs(CELL / dz) : Infinity;
    let tMaxX = dx !== 0 ? ((dx > 0 ? (cx + 1) * CELL : cx * CELL) - ox) / dx : Infinity;
    let tMaxZ = dz !== 0 ? ((dz > 0 ? (cz + 1) * CELL : cz * CELL) - oz) / dz : Infinity;
    let tEnter = 0;
    const limit = Math.min(maxDist, tBest);
    for (let iter = 0; iter < 400 && tEnter <= limit; iter++) {
      const tExit = Math.min(tMaxX, tMaxZ);
      const h = this.heightAt(cx, cz);
      if (h > 0) {
        const y0 = oy + dy * tEnter;
        const y1 = oy + dy * Math.min(tExit, limit);
        if (y0 <= h) return Math.min(tEnter, tBest);
        if (y1 <= h && dy < 0) {
          const t = (h - oy) / dy;
          return Math.min(t, tBest);
        }
      }
      if (tMaxX < tMaxZ) {
        cx += stepX;
        tEnter = tMaxX;
        tMaxX += tDeltaX;
      } else {
        cz += stepZ;
        tEnter = tMaxZ;
        tMaxZ += tDeltaZ;
      }
    }
    return tBest < maxDist ? tBest : Infinity;
  }

  /** Line-of-sight test between two points. */
  visible(ax: number, ay: number, az: number, bx: number, by: number, bz: number): boolean {
    const dx = bx - ax, dy = by - ay, dz = bz - az;
    const d = Math.hypot(dx, dy, dz);
    if (d < 1e-3) return true;
    const t = this.raycast(ax, ay, az, dx / d, dy / d, dz / d, d);
    return t >= d - 0.05;
  }

  // ====================================================================== navigation

  walkable(cx: number, cz: number) {
    return this.kindAt(cx, cz) === Kind.Floor;
  }

  /** nearest walkable cell to a world position (spiral search) */
  nearestWalkable(x: number, z: number) {
    const { cx, cz } = this.toCell(x, z);
    if (this.walkable(cx, cz)) return { cx, cz };
    for (let r = 1; r < 6; r++)
      for (let oz = -r; oz <= r; oz++)
        for (let ox = -r; ox <= r; ox++) {
          if (Math.max(Math.abs(ox), Math.abs(oz)) !== r) continue;
          if (this.walkable(cx + ox, cz + oz)) return { cx: cx + ox, cz: cz + oz };
        }
    return { cx, cz };
  }

  /** A* over the grid (8-connected, no corner cutting). Returns world waypoints. */
  findPath(from: Vec2, to: Vec2): Vec2[] {
    const s = this.nearestWalkable(from.x, from.z);
    const g = this.nearestWalkable(to.x, to.z);
    const N = GW * GH;
    const start = s.cz * GW + s.cx;
    const goal = g.cz * GW + g.cx;
    if (start === goal) return [to];
    const gScore = new Float32Array(N).fill(Infinity);
    const came = new Int32Array(N).fill(-1);
    const closed = new Uint8Array(N);
    const heap = new MinHeap();
    const hfn = (i: number) => {
      const dx = Math.abs((i % GW) - g.cx);
      const dz = Math.abs(Math.floor(i / GW) - g.cz);
      return Math.max(dx, dz) + 0.414 * Math.min(dx, dz);
    };
    gScore[start] = 0;
    heap.push(start, hfn(start));
    const dirs = [
      [1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1],
      [1, 1, 1.414], [1, -1, 1.414], [-1, 1, 1.414], [-1, -1, 1.414],
    ];
    let found = false;
    while (heap.size) {
      const cur = heap.pop();
      if (cur === goal) {
        found = true;
        break;
      }
      if (closed[cur]) continue;
      closed[cur] = 1;
      const cx = cur % GW;
      const cz = (cur / GW) | 0;
      for (const [ox, oz, cost] of dirs) {
        const nx = cx + ox, nz = cz + oz;
        if (!this.walkable(nx, nz)) continue;
        if (ox !== 0 && oz !== 0 && (!this.walkable(cx + ox, cz) || !this.walkable(cx, cz + oz))) continue;
        // penalise cells hugging walls so agents keep off corners
        const ni = nz * GW + nx;
        if (closed[ni]) continue;
        const wallPenalty = this.nearWall(nx, nz) ? 0.6 : 0;
        const ng = gScore[cur] + cost + wallPenalty;
        if (ng < gScore[ni]) {
          gScore[ni] = ng;
          came[ni] = cur;
          heap.push(ni, ng + hfn(ni));
        }
      }
    }
    if (!found) return [];
    const cells: number[] = [];
    for (let c = goal; c !== -1; c = came[c]) cells.push(c);
    cells.reverse();
    const pts = cells.map((c) => this.cellCenter(c % GW, (c / GW) | 0));
    pts[pts.length - 1] = { x: to.x, z: to.z };
    return this.smooth(from, pts);
  }

  private nearWall(cx: number, cz: number) {
    for (let oz = -1; oz <= 1; oz++)
      for (let ox = -1; ox <= 1; ox++) if (!this.walkable(cx + ox, cz + oz)) return true;
    return false;
  }

  /** string-pulling: drop waypoints that can be skipped with a clear, wide corridor */
  private smooth(from: Vec2, pts: Vec2[]): Vec2[] {
    const out: Vec2[] = [];
    let anchor = from;
    let i = 0;
    while (i < pts.length) {
      let j = pts.length - 1;
      while (j > i && !this.clearWalk(anchor, pts[j])) j--;
      out.push(pts[j]);
      anchor = pts[j];
      i = j + 1;
    }
    return out;
  }

  /** samples a fat line (3 parallel rays) for walkability */
  clearWalk(a: Vec2, b: Vec2): boolean {
    const dx = b.x - a.x, dz = b.z - a.z;
    const len = Math.hypot(dx, dz);
    if (len < 0.01) return true;
    const nx = -dz / len, nz = dx / len;
    const w = 0.55;
    const steps = Math.ceil(len / 0.4);
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const x = a.x + dx * t, z = a.z + dz * t;
      for (const o of [-w, 0, w]) {
        const c = this.toCell(x + nx * o, z + nz * o);
        if (!this.walkable(c.cx, c.cz)) return false;
      }
    }
    return true;
  }

  randomWalkableNear(p: Vec2, radiusCells: number): Vec2 {
    const c = this.toCell(p.x, p.z);
    for (let k = 0; k < 30; k++) {
      const cx = c.cx + Math.round((Math.random() * 2 - 1) * radiusCells);
      const cz = c.cz + Math.round((Math.random() * 2 - 1) * radiusCells);
      if (this.walkable(cx, cz)) return this.cellCenter(cx, cz);
    }
    return p;
  }
}

class MinHeap {
  private items: number[] = [];
  private pri: number[] = [];
  get size() {
    return this.items.length;
  }
  push(item: number, p: number) {
    this.items.push(item);
    this.pri.push(p);
    let i = this.items.length - 1;
    while (i > 0) {
      const par = (i - 1) >> 1;
      if (this.pri[par] <= this.pri[i]) break;
      this.swap(i, par);
      i = par;
    }
  }
  pop(): number {
    const top = this.items[0];
    const lastI = this.items.pop()!;
    const lastP = this.pri.pop()!;
    if (this.items.length) {
      this.items[0] = lastI;
      this.pri[0] = lastP;
      let i = 0;
      const n = this.items.length;
      for (;;) {
        const l = i * 2 + 1, r = l + 1;
        let m = i;
        if (l < n && this.pri[l] < this.pri[m]) m = l;
        if (r < n && this.pri[r] < this.pri[m]) m = r;
        if (m === i) break;
        this.swap(i, m);
        i = m;
      }
    }
    return top;
  }
  private swap(a: number, b: number) {
    [this.items[a], this.items[b]] = [this.items[b], this.items[a]];
    [this.pri[a], this.pri[b]] = [this.pri[b], this.pri[a]];
  }
}
