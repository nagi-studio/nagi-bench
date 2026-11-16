// Dust2 core areas on a tile grid: one source of truth for collision, bot
// pathfinding and the minimap.

export const CELL = 2;      // metres per cell
export const W = 64;
export const H = 64;
export const WALL_H = 4.2;

export const WALK = 0;
export const BLOCK = 1;

export type Rect = { x0: number; z0: number; x1: number; z1: number };

export const AREAS: Record<string, Rect> = {
  tspawn: { x0: 3, z0: 49, x1: 13, z1: 59 },
  longA: { x0: 13, z0: 45, x1: 33, z1: 53 },
  asite: { x0: 33, z0: 31, x1: 47, z1: 50 },
  ctspawn: { x0: 24, z0: 3, x1: 40, z1: 12 },
  mid: { x0: 25, z0: 12, x1: 31, z1: 45 },
  crafts: { x0: 31, z0: 31, x1: 35, z1: 38 },
  catwalk: { x0: 27, z0: 26, x1: 33, z1: 31 },
  bsite: { x0: 5, z0: 10, x1: 19, z1: 25 },
  btunnel: { x0: 8, z0: 25, x1: 14, z1: 42 },
  bconnect: { x0: 14, z0: 20, x1: 24, z1: 26 },
  midtob: { x0: 20, z0: 20, x1: 25, z1: 26 },
  lowmid: { x0: 25, z0: 38, x1: 33, z1: 46 }
};

export const SITES: Rect[] = [AREAS.asite, AREAS.bsite];

function carve(grid: Uint8Array, r: Rect) {
  for (let z = r.z0; z <= r.z1; z++) {
    for (let x = r.x0; x <= r.x1; x++) {
      if (x > 0 && z > 0 && x < W - 1 && z < H - 1) grid[z * W + x] = WALK;
    }
  }
}

export function buildGrid(): Uint8Array {
  const g = new Uint8Array(W * H).fill(BLOCK);
  Object.values(AREAS).forEach((r) => carve(g, r));
  // mid doors: a narrow pinch the player can still walk through
  for (let z = 33; z <= 34; z++) for (let x = 25; x <= 31; x++) g[z * W + x] = WALK;
  return g;
}

export const GRID = buildGrid();

export const idx = (x: number, z: number) => z * W + x;
export const walkable = (gx: number, gz: number) =>
  gx >= 0 && gz >= 0 && gx < W && gz < H && GRID[idx(gx, gz)] === WALK;

export const worldToCell = (x: number, z: number) => ({ gx: Math.floor(x / CELL), gz: Math.floor(z / CELL) });
export const cellToWorld = (gx: number, gz: number) => ({ x: (gx + 0.5) * CELL, z: (gz + 0.5) * CELL });

export const inRect = (r: Rect, gx: number, gz: number) => gx >= r.x0 && gx <= r.x1 && gz >= r.z0 && gz <= r.z1;

export function siteAt(gx: number, gz: number): 'A' | 'B' | null {
  if (inRect(AREAS.asite, gx, gz)) return 'A';
  if (inRect(AREAS.bsite, gx, gz)) return 'B';
  return null;
}

/** A* over the tile grid, 8-way with no corner cutting. */
export function findPath(sx: number, sz: number, tx: number, tz: number): Array<{ x: number; z: number }> {
  const start = idx(sx, sz);
  const goal = idx(tx, tz);
  if (!walkable(sx, sz) || !walkable(tx, tz)) return [];
  const open: number[] = [start];
  const gScore = new Map<number, number>([[start, 0]]);
  const fScore = new Map<number, number>([[start, 0]]);
  const came = new Map<number, number>();
  const closed = new Set<number>();
  const h = (i: number) => {
    const x = i % W, z = (i / W) | 0;
    return Math.hypot(x - tx, z - tz);
  };
  let guard = 0;
  while (open.length && guard++ < 20000) {
    open.sort((a, b) => (fScore.get(a) ?? 1e9) - (fScore.get(b) ?? 1e9));
    const cur = open.shift()!;
    if (cur === goal) {
      const path: Array<{ x: number; z: number }> = [];
      let n: number | undefined = cur;
      while (n !== undefined && n !== start) {
        const w = cellToWorld(n % W, (n / W) | 0);
        path.push(w);
        n = came.get(n);
      }
      return path.reverse();
    }
    closed.add(cur);
    const cx = cur % W, cz = (cur / W) | 0;
    for (let dz = -1; dz <= 1; dz++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dz) continue;
        const nx = cx + dx, nz = cz + dz;
        if (!walkable(nx, nz)) continue;
        if (dx && dz && (!walkable(cx + dx, cz) || !walkable(cx, cz + dz))) continue;
        const ni = idx(nx, nz);
        if (closed.has(ni)) continue;
        const step = dx && dz ? 1.42 : 1;
        const tentative = (gScore.get(cur) ?? 1e9) + step;
        if (tentative < (gScore.get(ni) ?? 1e9)) {
          came.set(ni, cur);
          gScore.set(ni, tentative);
          fScore.set(ni, tentative + h(ni));
          if (!open.includes(ni)) open.push(ni);
        }
      }
    }
  }
  return [];
}

/** Grid line of sight (Bresenham). */
export function hasLOS(ax: number, az: number, bx: number, bz: number): boolean {
  const a = worldToCell(ax, az), b = worldToCell(bx, bz);
  let x0 = a.gx, z0 = a.gz;
  const x1 = b.gx, z1 = b.gz;
  const dx = Math.abs(x1 - x0), dz = Math.abs(z1 - z0);
  const sx = x0 < x1 ? 1 : -1, sz = z0 < z1 ? 1 : -1;
  let err = dx - dz;
  let guard = 0;
  while (guard++ < 256) {
    if (!walkable(x0, z0)) return false;
    if (x0 === x1 && z0 === z1) return true;
    const e2 = 2 * err;
    if (e2 > -dz) { err -= dz; x0 += sx; }
    if (e2 < dx) { err += dx; z0 += sz; }
  }
  return false;
}

/** Ray from a point to a target, blocked by walls (DDA against the grid, used for bullets). */
export function rayHitsWall(x: number, z: number, dx: number, dz: number, maxDist: number): number {
  const step = 0.12;
  for (let d = 0; d < maxDist; d += step) {
    const g = worldToCell(x + dx * d, z + dz * d);
    if (!walkable(g.gx, g.gz)) return d;
  }
  return maxDist;
}
