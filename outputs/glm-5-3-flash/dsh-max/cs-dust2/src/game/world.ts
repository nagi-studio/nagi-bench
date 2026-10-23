/**
 * world.ts — the playable world derived from mapdata:
 *   - occupancy grid (cell heightfield) used for movement collision, vision & path-finding
 *   - merged collider boxes used for bullet ray-casts
 *   - greedy-meshed geometry descriptors used by the renderer & minimap
 * Contains no three.js / DOM code so it can run head-less in tests.
 */

import {
  RECTS, WALLS, CRATES, MapRect, MapCrate, MapWall, inSite,
} from './mapdata';

export const CELL = 1.5;          // grid cell size (meters)
export const WALL_H = 6.5;        // wall height (meters)
export const STEP = 0.55;         // max step-up height while walking
export const PLAYER_R = 0.42;     // character collision radius

export interface AABB {
  x1: number; y1: number; z1: number;
  x2: number; y2: number; z2: number;
}

export interface Box2D { x1: number; z1: number; x2: number; z2: number; h: number }

export interface Vec2 { x: number; z: number }

/* ---------------------------------------------------------------- */

class MinHeap {
  private ids: number[] = [];
  private cost: Float64Array;
  constructor(size: number) { this.cost = new Float64Array(size); }
  clear() { this.ids.length = 0; }
  get size() { return this.ids.length; }
  push(id: number, c: number) {
    this.cost[id] = c;
    const a = this.ids; a.push(id);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.cost[a[p]] <= this.cost[a[i]]) break;
      const t = a[p]; a[p] = a[i]; a[i] = t; i = p;
    }
  }
  pop(): number {
    const a = this.ids;
    const top = a[0];
    const last = a.pop()!;
    if (a.length > 0) {
      a[0] = last;
      let i = 0;
      for (;;) {
        const l = i * 2 + 1, r = l + 1;
        let m = i;
        if (l < a.length && this.cost[a[l]] < this.cost[a[m]]) m = l;
        if (r < a.length && this.cost[a[r]] < this.cost[a[m]]) m = r;
        if (m === i) break;
        const t = a[m]; a[m] = a[i]; a[i] = t; i = m;
      }
    }
    return top;
  }
}

/* ---------------------------------------------------------------- */

export class World {
  minX: number; minZ: number; gx: number; gz: number;
  /** ground top height per cell (WALL_H for solid rock/wall cells) */
  height: Float32Array;
  solid: Uint8Array;
  /** 1 = A site, 2 = B site, 3 = T spawn, 4 = CT spawn */
  zone: Uint8Array;
  /** 1 when the cell is covered by a crate footprint */
  crateCell: Uint8Array;
  /** rectangle name per cell (debug / callouts) */
  rectOf: Int16Array;
  rectNames: string[] = [];

  /** merged boxes for bullet ray-casts */
  colliders: AABB[] = [];
  wallBoxes: Box2D[] = [];
  floorBoxes: Box2D[] = [];
  crateBoxes: Box2D[] = [];
  crates: MapCrate[] = [];
  ceilings: Box2D[] = [];

  private cameFrom: Int32Array;
  private gScore: Float32Array;
  private closed: Uint8Array;
  private openHeap: MinHeap;
  private openStamp: Int32Array;
  private stamp = 1;

  constructor() {
    // ---- bounds ----
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    const eat = (x1: number, z1: number, x2: number, z2: number) => {
      minX = Math.min(minX, x1); maxX = Math.max(maxX, x2);
      minZ = Math.min(minZ, z1); maxZ = Math.max(maxZ, z2);
    };
    for (const r of RECTS) eat(r.x1, r.z1, r.x2, r.z2);
    for (const w of WALLS) eat(w.x1, w.z1, w.x2, w.z2);
    for (const c of CRATES) eat(c.x - c.w, c.z - c.d, c.x + c.w, c.z + c.d);
    minX -= 10; maxX += 10; minZ -= 10; maxZ += 10;
    this.minX = minX; this.minZ = minZ;
    this.gx = Math.ceil((maxX - minX) / CELL);
    this.gz = Math.ceil((maxZ - minZ) / CELL);

    const n = this.gx * this.gz;
    this.height = new Float32Array(n);      // 0 by default (solid rock top)
    this.solid = new Uint8Array(n).fill(1); // everything solid until a rect opens it
    this.zone = new Uint8Array(n);
    this.crateCell = new Uint8Array(n);
    this.rectOf = new Int16Array(n).fill(-1);
    this.cameFrom = new Int32Array(n);
    this.gScore = new Float32Array(n);
    this.closed = new Uint8Array(n);
    this.openStamp = new Int32Array(n);
    this.openHeap = new MinHeap(n);

    // ---- walkable rects ----
    for (const r of RECTS) this.stampRect(r);
    // ---- interior walls ----
    for (const w of WALLS) this.stampWall(w);
    // ---- crates (cover, jumpable) ----
    for (const c of CRATES) this.stampCrate(c);

    // solid cells must have wall height so collision, vision and bullets all
    // treat the untouched "rock" around the playables as blocking
    for (let i = 0; i < n; i++) if (this.solid[i]) this.height[i] = Math.max(this.height[i], WALL_H);

    this.buildGeometry();
  }

  /* ---------------- construction helpers ---------------- */

  private rectHeight(r: MapRect, x: number, z: number): number {
    if (r.ramp) {
      const a = r.ramp.axis;
      const p = a === 'x' ? x : z;
      const span = r.ramp.to - r.ramp.from;
      const t = span === 0 ? 0 : (p - r.ramp.from) / span;
      const lo = r.h ?? 0;
      const hi = r.h2 ?? lo;
      return lo + (hi - lo) * Math.max(0, Math.min(1, t));
    }
    return r.h ?? 0;
  }

  private stampRect(r: MapRect) {
    const id = this.rectNames.push(r.name) - 1;
    const zoneId = r.zone === 'A' ? 1 : r.zone === 'B' ? 2 : r.zone === 'T' ? 3 : r.zone === 'CT' ? 4 : 0;
    const cx1 = this.cellX(r.x1), cx2 = this.cellX(r.x2 - 0.01);
    const cz1 = this.cellZ(r.z1), cz2 = this.cellZ(r.z2 - 0.01);
    for (let cz = cz1; cz <= cz2; cz++) {
      for (let cx = cx1; cx <= cx2; cx++) {
        if (cx < 0 || cz < 0 || cx >= this.gx || cz >= this.gz) continue;
        const i = cz * this.gx + cx;
        this.solid[i] = 0;
        const p = this.cellCenter(cx, cz);
        this.height[i] = this.rectHeight(r, p.x, p.z);
        this.rectOf[i] = id;
        if (zoneId) this.zone[i] = zoneId;
      }
    }
    if (r.ceiling) {
      this.ceilings.push({ x1: r.x1, z1: r.z1, x2: r.x2, z2: r.z2, h: r.ceiling });
    }
  }

  private stampWall(w: MapWall) {
    const h = w.h ?? WALL_H;
    const cx1 = this.cellX(w.x1), cx2 = this.cellX(w.x2 - 0.01);
    const cz1 = this.cellZ(w.z1), cz2 = this.cellZ(w.z2 - 0.01);
    for (let cz = cz1; cz <= cz2; cz++) {
      for (let cx = cx1; cx <= cx2; cx++) {
        if (cx < 0 || cz < 0 || cx >= this.gx || cz >= this.gz) continue;
        const i = cz * this.gx + cx;
        this.solid[i] = 1;
        this.height[i] = h;
      }
    }
  }

  private stampCrate(c: MapCrate) {
    const cx1 = this.cellX(c.x - c.w / 2), cx2 = this.cellX(c.x + c.w / 2 - 0.01);
    const cz1 = this.cellZ(c.z - c.d / 2), cz2 = this.cellZ(c.z + c.d / 2 - 0.01);
    let base = 0;
    for (let cz = cz1; cz <= cz2; cz++) {
      for (let cx = cx1; cx <= cx2; cx++) {
        if (cx < 0 || cz < 0 || cx >= this.gx || cz >= this.gz) continue;
        const i = cz * this.gx + cx;
        if (!this.solid[i]) base = Math.max(base, this.height[i]);
      }
    }
    const top = base + c.h;
    for (let cz = cz1; cz <= cz2; cz++) {
      for (let cx = cx1; cx <= cx2; cx++) {
        if (cx < 0 || cz < 0 || cx >= this.gx || cz >= this.gz) continue;
        const i = cz * this.gx + cx;
        if (this.solid[i]) continue;
        this.height[i] = Math.max(this.height[i], top);
        this.crateCell[i] = 1;
      }
    }
    this.crates.push(c);
    this.crateBoxes.push({ x1: c.x - c.w / 2, z1: c.z - c.d / 2, x2: c.x + c.w / 2, z2: c.z + c.d / 2, h: c.h });
  }

  /* ---------------- geometry merging ---------------- */

  private buildGeometry() {
    const { gx, gz } = this;
    const q = (v: number) => Math.round(v * 4) / 4;

    // greedy-mesh walkable cells by quantised height -> floor slabs
    const used = new Uint8Array(gx * gz);
    for (let cz = 0; cz < gz; cz++) {
      for (let cx = 0; cx < gx; cx++) {
        const i = cz * gx + cx;
        if (this.solid[i] || used[i]) continue;
        const h = q(this.height[i]);
        // extend right
        let w = 1;
        while (cx + w < gx) {
          const j = cz * gx + cx + w;
          if (this.solid[j] || used[j] || q(this.height[j]) !== h) break;
          w++;
        }
        // extend down
        let d = 1;
        outer: while (cz + d < gz) {
          for (let k = 0; k < w; k++) {
            const j = (cz + d) * gx + cx + k;
            if (this.solid[j] || used[j] || q(this.height[j]) !== h) break outer;
          }
          d++;
        }
        for (let z2 = 0; z2 < d; z2++) for (let x2 = 0; x2 < w; x2++) used[(cz + z2) * gx + cx + x2] = 1;
        const box: Box2D = {
          x1: this.minX + cx * CELL, z1: this.minZ + cz * CELL,
          x2: this.minX + (cx + w) * CELL, z2: this.minZ + (cz + d) * CELL, h,
        };
        this.floorBoxes.push(box);
        if (h > 0.3) {
          // plateau: solid box down to the ground so its cliff faces exist
          this.colliders.push({ x1: box.x1, y1: -2, z1: box.z1, x2: box.x2, y2: h, z2: box.z2 });
        }
      }
    }

    // greedy-mesh solid cells -> walls
    const usedW = new Uint8Array(gx * gz);
    for (let cz = 0; cz < gz; cz++) {
      for (let cx = 0; cx < gx; cx++) {
        const i = cz * gx + cx;
        if (!this.solid[i] || usedW[i]) continue;
        let w = 1;
        while (cx + w < gx && this.solid[cz * gx + cx + w] && !usedW[cz * gx + cx + w]) w++;
        let d = 1;
        outer: while (cz + d < gz) {
          for (let k = 0; k < w; k++) {
            const j = (cz + d) * gx + cx + k;
            if (!this.solid[j] || usedW[j]) break outer;
          }
          d++;
        }
        for (let z2 = 0; z2 < d; z2++) for (let x2 = 0; x2 < w; x2++) usedW[(cz + z2) * gx + cx + x2] = 1;
        const box: Box2D = {
          x1: this.minX + cx * CELL, z1: this.minZ + cz * CELL,
          x2: this.minX + (cx + w) * CELL, z2: this.minZ + (cz + d) * CELL, h: WALL_H,
        };
        this.wallBoxes.push(box);
        this.colliders.push({ x1: box.x1, y1: 0, z1: box.z1, x2: box.x2, y2: WALL_H, z2: box.z2 });
      }
    }

    for (const c of this.crateBoxes) {
      const base = this.groundBaseAt((c.x1 + c.x2) / 2, (c.z1 + c.z2) / 2);
      this.colliders.push({ x1: c.x1, y1: base - 0.05, z1: c.z1, x2: c.x2, y2: base + c.h, z2: c.z2 });
    }
  }

  /* ---------------- coordinate helpers ---------------- */

  cellX(x: number) { return Math.floor((x - this.minX) / CELL); }
  cellZ(z: number) { return Math.floor((z - this.minZ) / CELL); }
  cellCenterX(cx: number) { return this.minX + (cx + 0.5) * CELL; }
  cellCenterZ(cz: number) { return this.minZ + (cz + 0.5) * CELL; }
  cellCenter(cx: number, cz: number): Vec2 { return { x: this.cellCenterX(cx), z: this.cellCenterZ(cz) }; }
  idx(cx: number, cz: number) { return cz * this.gx + cx; }
  inBounds(cx: number, cz: number) { return cx >= 0 && cz >= 0 && cx < this.gx && cz < this.gz; }

  /** height of the ground (or wall top) at a world position */
  heightAt(x: number, z: number): number {
    const cx = this.cellX(x), cz = this.cellZ(z);
    if (!this.inBounds(cx, cz)) return WALL_H;
    return this.height[cz * this.gx + cx];
  }

  isSolidAt(x: number, z: number): boolean {
    const cx = this.cellX(x), cz = this.cellZ(z);
    if (!this.inBounds(cx, cz)) return true;
    return this.solid[cz * this.gx + cx] === 1;
  }

  /** terrain height under a position ignoring walls (used for placing props) */
  groundBaseAt(x: number, z: number): number {
    const cx = this.cellX(x), cz = this.cellZ(z);
    if (!this.inBounds(cx, cz)) return 0;
    const i = cz * this.gx + cx;
    return this.solid[i] ? 0 : this.height[i];
  }

  zoneAt(x: number, z: number): 'A' | 'B' | 'T' | 'CT' | null {
    const cx = this.cellX(x), cz = this.cellZ(z);
    if (!this.inBounds(cx, cz)) return null;
    const v = this.zone[cz * this.gx + cx];
    return v === 1 ? 'A' : v === 2 ? 'B' : v === 3 ? 'T' : v === 4 ? 'CT' : null;
  }

  /** true when a character with feet at `feetY` and radius `r` fits at (x,z) */
  fits(x: number, z: number, feetY: number, r = PLAYER_R): boolean {
    const cx1 = this.cellX(x - r), cx2 = this.cellX(x + r);
    const cz1 = this.cellZ(z - r), cz2 = this.cellZ(z + r);
    for (let cz = cz1; cz <= cz2; cz++) {
      for (let cx = cx1; cx <= cx2; cx++) {
        if (!this.inBounds(cx, cz)) return false;
        const h = this.height[cz * this.gx + cx];
        if (h > feetY + STEP) return false;
      }
    }
    return true;
  }

  /** highest walkable surface under a body (feetY is current feet height) */
  supportHeight(x: number, z: number, feetY: number, r = PLAYER_R): number {
    const cx1 = this.cellX(x - r), cx2 = this.cellX(x + r);
    const cz1 = this.cellZ(z - r), cz2 = this.cellZ(z + r);
    let best = -100;
    for (let cz = cz1; cz <= cz2; cz++) {
      for (let cx = cx1; cx <= cx2; cx++) {
        if (!this.inBounds(cx, cz)) continue;
        const h = this.height[cz * this.gx + cx];
        if (h <= feetY + STEP && h > best) best = h;
      }
    }
    return best === -100 ? WALL_H : best;
  }

  /** sample terrain height along a move, used for smooth walking on ramps */
  clampMove(x: number, z: number, feetY: number, dx: number, dz: number, r = PLAYER_R): Vec2 {
    let nx = x, nz = z;
    // axis separated so we slide along walls
    if (dx !== 0 && this.fits(x + dx, nz, feetY, r)) nx = x + dx;
    if (dz !== 0 && this.fits(nx, z + dz, feetY, r)) nz = z + dz;
    return { x: nx, z: nz };
  }

  /* ---------------- vision ---------------- */

  /**
   * Grid line-of-sight between two eye points. Cells whose top surface is
   * higher than the interpolated eye ray block the sight (so crates give
   * cover but a raised platform does not blind someone standing on it).
   */
  losClear(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): boolean {
    const dx = x2 - x1, dz = z2 - z1;
    const dist = Math.hypot(dx, dz);
    if (dist < 0.001) return true;
    const steps = Math.ceil(dist / (CELL * 0.5));
    for (let s = 1; s < steps; s++) {
      const t = s / steps;
      const x = x1 + dx * t, z = z1 + dz * t;
      const y = y1 + (y2 - y1) * t;
      const cx = this.cellX(x), cz = this.cellZ(z);
      if (!this.inBounds(cx, cz)) return false;
      const h = this.height[cz * this.gx + cx];
      if (h > y + 0.2) return false;
    }
    return true;
  }

  /** nav line of sight (walkable, no big height jumps along the segment) */
  walkableLine(x1: number, z1: number, x2: number, z2: number): boolean {
    const h1 = this.heightAt(x1, z1), h2 = this.heightAt(x2, z2);
    if (h1 >= WALL_H || h2 >= WALL_H) return false;
    const dist = Math.hypot(x2 - x1, z2 - z1);
    const steps = Math.ceil(dist / (CELL * 0.5));
    for (let s = 0; s <= steps; s++) {
      const t = s / Math.max(1, steps);
      const x = x1 + (x2 - x1) * t, z = z1 + (z2 - z1) * t;
      const h = this.heightAt(x, z);
      if (h >= WALL_H) return false;
      if (h > Math.max(h1, h2) + STEP || h < Math.min(h1, h2) - STEP) return false;
    }
    return true;
  }

  /* ---------------- path finding (A*) ---------------- */

  findPath(from: Vec2, to: Vec2): Vec2[] | null {
    const sx = this.cellX(from.x), sz = this.cellZ(from.z);
    let tx = this.cellX(to.x), tz = this.cellZ(to.z);
    if (!this.inBounds(sx, sz) || !this.inBounds(tx, tz)) return null;
    // snap target to nearest walkable cell
    if (this.solid[tz * this.gx + tx]) {
      const alt = this.nearestOpenCell(tx, tz);
      if (!alt) return null;
      tx = alt.cx; tz = alt.cz;
    }
    if (this.solid[sz * this.gx + sx]) {
      const alt = this.nearestOpenCell(sx, sz);
      if (!alt) return null;
      return this.findPath(this.cellCenter(alt.cx, alt.cz), to);
    }

    const start = sz * this.gx + sx;
    const goal = tz * this.gx + tx;
    if (start === goal) return [{ x: to.x, z: to.z }];

    this.stamp++;
    const { gx, gz, height, solid } = this;
    const heap = this.openHeap;
    heap.clear();
    this.gScore[start] = 0;
    this.cameFrom[start] = -1;
    this.openStamp[start] = this.stamp;
    this.closed[start] = 0;
    heap.push(start, this.heuristic(sx, sz, tx, tz));

    let found = false;
    let guard = 0;
    while (heap.size > 0 && guard++ < 60000) {
      const cur = heap.pop();
      if (cur === goal) { found = true; break; }
      if (this.openStamp[cur] === this.stamp && this.closed[cur]) continue;
      this.closed[cur] = 1;
      const cx = cur % gx, cz = (cur - cx) / gx;
      const ch = height[cur];
      for (let dz = -1; dz <= 1; dz++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dz === 0) continue;
          const nx = cx + dx, nz = cz + dz;
          if (nx < 0 || nz < 0 || nx >= gx || nz >= gz) continue;
          const ni = nz * gx + nx;
          if (solid[ni]) continue;
          const nh = height[ni];
          if (Math.abs(nh - ch) > STEP) continue;
          if (dx !== 0 && dz !== 0) {
            // no corner cutting
            if (solid[cz * gx + nx] || solid[nz * gx + cx]) continue;
            if (Math.abs(height[cz * gx + nx] - ch) > STEP || Math.abs(height[nz * gx + cx] - ch) > STEP) continue;
          }
          const step = dx !== 0 && dz !== 0 ? 1.4142 : 1.0;
          const ng = this.gScore[cur] + step;
          if (this.openStamp[ni] !== this.stamp || ng < this.gScore[ni]) {
            this.openStamp[ni] = this.stamp;
            this.closed[ni] = 0;
            this.gScore[ni] = ng;
            this.cameFrom[ni] = cur;
            heap.push(ni, ng + this.heuristic(nx, nz, tx, tz));
          }
        }
      }
    }
    if (!found) return null;

    const cells: Vec2[] = [];
    let c = goal;
    while (c !== -1) {
      const cx = c % gx, cz = (c - cx) / gx;
      cells.push(this.cellCenter(cx, cz));
      c = this.cameFrom[c];
    }
    cells.reverse();
    cells.push({ x: to.x, z: to.z });
    return this.smooth(cells);
  }

  private heuristic(ax: number, az: number, bx: number, bz: number) {
    const dx = Math.abs(ax - bx), dz = Math.abs(az - bz);
    return (dx + dz) + (1.4142 - 2) * Math.min(dx, dz);
  }

  private nearestOpenCell(cx: number, cz: number): { cx: number; cz: number } | null {
    for (let r = 1; r < 24; r++) {
      for (let dz = -r; dz <= r; dz++) {
        for (let dx = -r; dx <= r; dx++) {
          if (Math.max(Math.abs(dx), Math.abs(dz)) !== r) continue;
          const nx = cx + dx, nz = cz + dz;
          if (nx < 0 || nz < 0 || nx >= this.gx || nz >= this.gz) continue;
          if (!this.solid[nz * this.gx + nx]) return { cx: nx, cz: nz };
        }
      }
    }
    return null;
  }

  /** string-pulling: drop waypoints we can walk through directly */
  private smooth(cells: Vec2[]): Vec2[] {
    if (cells.length <= 2) return cells;
    const out: Vec2[] = [cells[0]];
    let i = 0;
    while (i < cells.length - 1) {
      let j = cells.length - 1;
      for (; j > i + 1; j--) {
        if (this.walkableLine(cells[i].x, cells[i].z, cells[j].x, cells[j].z)) break;
      }
      out.push(cells[j]);
      i = j;
    }
    return out;
  }

  randomOpenPoint(x: number, z: number, radius: number): Vec2 | null {
    for (let i = 0; i < 40; i++) {
      const a = Math.random() * Math.PI * 2;
      const d = Math.sqrt(Math.random()) * radius;
      const px = x + Math.cos(a) * d, pz = z + Math.sin(a) * d;
      if (!this.isSolidAt(px, pz) && this.heightAt(px, pz) < 2.2) return { x: px, z: pz };
    }
    return null;
  }

  /** debug ascii map used by the offline tests */
  ascii(scale = 2): string {
    const rows: string[] = [];
    const header = '    ' + Array.from({ length: this.gx }, (_, i) => (i % 10 === 0 ? '|' : ' ')).join('');
    rows.push(header);
    for (let cz = 0; cz < this.gz; cz += scale) {
      let line = '';
      for (let cx = 0; cx < this.gx; cx += scale) {
        let solidCount = 0, high = 0, open = 0, site = 0;
        for (let dz = 0; dz < scale; dz++) {
          for (let dx = 0; dx < scale; dx++) {
            const i = (cz + dz) * this.gx + (cx + dx);
            if (cz + dz >= this.gz || cx + dx >= this.gx) continue;
            if (this.solid[i]) solidCount++;
            else { open++; if (this.height[i] > 0.3) high++; }
            if (this.zone[i] === 1 || this.zone[i] === 2) site++;
          }
        }
        if (solidCount === scale * scale) line += '#';
        else if (open === 0) line += '#';
        else if (high > 0) line += site > 0 ? (this.zone[(cz) * this.gx + cx] === 1 ? 'A' : 'B') : '^';
        else if (site > 0) line += this.zone[cz * this.gx + cx] === 1 ? 'A' : 'B';
        else line += '.';
      }
      rows.push(String(cz).padStart(3) + ' ' + line);
    }
    return rows.join('\n');
  }
}

/** helper: is a world position inside one of the bombsites */
export { inSite };

export type { MapRect, MapWall, MapCrate };
