// Tile-grid map core. Pure TS (no three.js) so it can be unit-tested with bun.
// The world is a grid of square cells in the XZ plane; walls are full-height
// columns, floor cells are walkable. Line-of-sight and bullet clipping against
// walls use grid DDA traversal (Amanatides & Woo).

export enum Region {
  None = 0,
  TSpawn = 1,
  CTSpawn = 2,
  ASite = 3,
  BSite = 4,
  Mid = 5,
  Long = 6,
  Cat = 7,
  Tunnel = 8,
  Connect = 9,
  Door = 10,
}

const REGION_CHAR: Record<number, string> = {
  0: '#', // wall / void rendered as # in ascii dumps
  1: 't',
  2: 'c',
  3: 'A',
  4: 'B',
  5: 'm',
  6: 'L',
  7: 'k',
  8: 'u',
  9: '+',
  10: 'D',
};

export interface CellRef {
  cx: number;
  cz: number;
}

export class MapGrid {
  readonly cols: number;
  readonly rows: number;
  readonly cell: number; // world size of one cell (meters)
  readonly floor: Uint8Array; // 1 = walkable
  readonly region: Uint8Array; // Region id per cell (only meaningful when floor)
  readonly originX: number; // world X of cell (0,0) left edge
  readonly originZ: number;

  constructor(cols: number, rows: number, cell: number) {
    this.cols = cols;
    this.rows = rows;
    this.cell = cell;
    this.floor = new Uint8Array(cols * rows);
    this.region = new Uint8Array(cols * rows);
    // Center the grid on the world origin.
    this.originX = -(cols * cell) / 2;
    this.originZ = -(rows * cell) / 2;
  }

  idx(cx: number, cz: number): number {
    return cz * this.cols + cx;
  }

  inBounds(cx: number, cz: number): boolean {
    return cx >= 0 && cz >= 0 && cx < this.cols && cz < this.rows;
  }

  isFloor(cx: number, cz: number): boolean {
    if (!this.inBounds(cx, cz)) return false;
    return this.floor[this.idx(cx, cz)] === 1;
  }

  // Out-of-bounds counts as wall so the arena is sealed.
  isWall(cx: number, cz: number): boolean {
    return !this.isFloor(cx, cz);
  }

  regionAt(cx: number, cz: number): Region {
    if (!this.inBounds(cx, cz)) return Region.None;
    return this.region[this.idx(cx, cz)] as Region;
  }

  // Carve a filled rectangle of floor (inclusive cell coords) with a region tag.
  carve(cx0: number, cz0: number, cx1: number, cz1: number, region: Region): void {
    const x0 = Math.min(cx0, cx1);
    const x1 = Math.max(cx0, cx1);
    const z0 = Math.min(cz0, cz1);
    const z1 = Math.max(cz0, cz1);
    for (let cz = z0; cz <= z1; cz++) {
      for (let cx = x0; cx <= x1; cx++) {
        if (!this.inBounds(cx, cz)) continue;
        const i = this.idx(cx, cz);
        this.floor[i] = 1;
        this.region[i] = region;
      }
    }
  }

  // Overwrite region on already-carved floor cells (does not create floor).
  tag(cx0: number, cz0: number, cx1: number, cz1: number, region: Region): void {
    const x0 = Math.min(cx0, cx1);
    const x1 = Math.max(cx0, cx1);
    const z0 = Math.min(cz0, cz1);
    const z1 = Math.max(cz0, cz1);
    for (let cz = z0; cz <= z1; cz++) {
      for (let cx = x0; cx <= x1; cx++) {
        if (!this.inBounds(cx, cz)) continue;
        const i = this.idx(cx, cz);
        if (this.floor[i]) this.region[i] = region;
      }
    }
  }

  // --- world <-> cell conversion ---
  cellOf(x: number, z: number): CellRef {
    return {
      cx: Math.floor((x - this.originX) / this.cell),
      cz: Math.floor((z - this.originZ) / this.cell),
    };
  }

  centerOf(cx: number, cz: number): { x: number; z: number } {
    return {
      x: this.originX + (cx + 0.5) * this.cell,
      z: this.originZ + (cz + 0.5) * this.cell,
    };
  }

  isWallAtWorld(x: number, z: number): boolean {
    const c = this.cellOf(x, z);
    return this.isWall(c.cx, c.cz);
  }

  // DDA: distance (world units) along ray (ox,oz)+t*(dx,dz) to first wall cell.
  // Returns maxDist if nothing hit within range. dir need not be normalized;
  // dx,dz are treated as a unit direction here.
  rayWallDistance(ox: number, oz: number, dx: number, dz: number, maxDist: number): number {
    const cs = this.cell;
    let cx = Math.floor((ox - this.originX) / cs);
    let cz = Math.floor((oz - this.originZ) / cs);
    if (this.isWall(cx, cz)) return 0;
    const stepX = dx > 0 ? 1 : dx < 0 ? -1 : 0;
    const stepZ = dz > 0 ? 1 : dz < 0 ? -1 : 0;
    const tDeltaX = dx !== 0 ? Math.abs(cs / dx) : Infinity;
    const tDeltaZ = dz !== 0 ? Math.abs(cs / dz) : Infinity;
    // world coords of current cell edges
    const cellMinX = this.originX + cx * cs;
    const cellMinZ = this.originZ + cz * cs;
    let tMaxX =
      dx !== 0
        ? (stepX > 0 ? cellMinX + cs - ox : ox - cellMinX) / Math.abs(dx)
        : Infinity;
    let tMaxZ =
      dz !== 0
        ? (stepZ > 0 ? cellMinZ + cs - oz : oz - cellMinZ) / Math.abs(dz)
        : Infinity;
    let guard = 0;
    while (guard++ < 4096) {
      let t: number;
      if (tMaxX < tMaxZ) {
        cx += stepX;
        t = tMaxX;
        tMaxX += tDeltaX;
      } else {
        cz += stepZ;
        t = tMaxZ;
        tMaxZ += tDeltaZ;
      }
      if (t > maxDist) return maxDist;
      if (this.isWall(cx, cz)) return t;
    }
    return maxDist;
  }

  // True if a wall blocks the straight segment a->b in the XZ plane.
  segmentBlocked(ax: number, az: number, bx: number, bz: number): boolean {
    const dx = bx - ax;
    const dz = bz - az;
    const len = Math.hypot(dx, dz);
    if (len < 1e-6) return false;
    const d = this.rayWallDistance(ax, az, dx / len, dz / len, len);
    return d < len - 1e-3;
  }

  // Breadth-first reachable set from a seed floor cell; used to verify the map
  // is fully connected during authoring.
  reachableCount(seedCx: number, seedCz: number): number {
    const seen = new Uint8Array(this.cols * this.rows);
    const stack: number[] = [];
    if (!this.isFloor(seedCx, seedCz)) return 0;
    stack.push(this.idx(seedCx, seedCz));
    seen[this.idx(seedCx, seedCz)] = 1;
    let count = 0;
    while (stack.length) {
      const i = stack.pop()!;
      count++;
      const cx = i % this.cols;
      const cz = (i - cx) / this.cols;
      const neigh = [
        [cx + 1, cz],
        [cx - 1, cz],
        [cx, cz + 1],
        [cx, cz - 1],
      ];
      for (const [nx, nz] of neigh) {
        if (!this.isFloor(nx, nz)) continue;
        const ni = this.idx(nx, nz);
        if (seen[ni]) continue;
        seen[ni] = 1;
        stack.push(ni);
      }
    }
    return count;
  }

  totalFloor(): number {
    let n = 0;
    for (let i = 0; i < this.floor.length; i++) if (this.floor[i]) n++;
    return n;
  }

  toAscii(): string {
    const lines: string[] = [];
    for (let cz = 0; cz < this.rows; cz++) {
      let line = '';
      for (let cx = 0; cx < this.cols; cx++) {
        const i = this.idx(cx, cz);
        line += this.floor[i] ? REGION_CHAR[this.region[i]] ?? '.' : '#';
      }
      lines.push(line);
    }
    return lines.join('\n');
  }
}
