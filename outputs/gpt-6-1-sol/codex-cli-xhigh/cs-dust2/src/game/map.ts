export const CELL = 2;
export const MIN_X = -42,
  MAX_X = 44,
  MIN_Z = -34,
  MAX_Z = 38;
export const COLS = (MAX_X - MIN_X) / CELL,
  ROWS = (MAX_Z - MIN_Z) / CELL;
export interface Rect {
  x: number;
  z: number;
  w: number;
  d: number;
}
export interface Solid extends Rect {
  h: number;
  y: number;
  kind: "crate" | "wall" | "door";
}
export const REGIONS = [
  { name: "T SPAWN", x: -10, z: 24, w: 28, d: 12 },
  { name: "UPPER MID", x: -6, z: 8, w: 12, d: 20 },
  { name: "MID", x: -6, z: -12, w: 12, d: 22 },
  { name: "CT SPAWN", x: -14, z: -24, w: 32, d: 12 },
  { name: "CT CROSS", x: -28, z: -24, w: 56, d: 8 },
  { name: "LONG APPROACH", x: 14, z: 20, w: 26, d: 10 },
  { name: "LONG DOORS", x: 30, z: 10, w: 10, d: 16 },
  { name: "A LONG", x: 30, z: -24, w: 10, d: 38 },
  { name: "A SITE", x: 18, z: -28, w: 22, d: 16 },
  { name: "CATWALK", x: 4, z: 8, w: 14, d: 6 },
  { name: "SHORT A", x: 12, z: -12, w: 6, d: 24 },
  { name: "A RAMP", x: 12, z: -16, w: 16, d: 8 },
  { name: "TUNNEL APPROACH", x: -30, z: 22, w: 24, d: 8 },
  { name: "B TUNNELS", x: -32, z: -8, w: 10, d: 34 },
  { name: "LOWER TUNNELS", x: -26, z: 4, w: 24, d: 6 },
  { name: "B SITE", x: -38, z: -28, w: 22, d: 22 },
];
export const SITES = [
  { name: "A", x: 27, z: -21, r: 6.6 },
  { name: "B", x: -28, z: -19, r: 7 },
];
export const OBSTACLES: Solid[] = [
  { x: 24, z: -24, w: 4, d: 3, h: 2.5, y: 0, kind: "crate" },
  { x: 20, z: -20, w: 2.2, d: 2.2, h: 1.7, y: 0, kind: "crate" },
  { x: 34, z: -20, w: 2, d: 3, h: 1.5, y: 0, kind: "crate" },
  { x: 30, z: 1, w: 2, d: 3, h: 1.8, y: 0, kind: "crate" },
  { x: -34, z: -25, w: 4, d: 4, h: 2.7, y: 0, kind: "crate" },
  { x: -24, z: -20, w: 3, d: 3, h: 2, y: 0, kind: "crate" },
  { x: -36, z: -13, w: 3, d: 2, h: 1.6, y: 0, kind: "crate" },
  { x: -31, z: 12, w: 2, d: 3, h: 1.8, y: 0, kind: "crate" },
  { x: -6, z: 17, w: 2, d: 3, h: 2.2, y: 0, kind: "crate" },
  { x: 12, z: 25, w: 2, d: 3, h: 1.6, y: 0, kind: "crate" },
  // Open double doors: solid leaves and a traversable 2.8m centre passage.
  { x: -5.9, z: -9, w: 4.5, d: 0.5, h: 3.4, y: 0, kind: "door" },
  { x: 1.4, z: -8, w: 4.5, d: 0.5, h: 3.4, y: 0, kind: "door" },
  { x: 30, z: 12, w: 3.5, d: 0.5, h: 3.5, y: 0, kind: "door" },
  { x: 36.5, z: 13, w: 3.5, d: 0.5, h: 3.5, y: 0, kind: "door" },
];
export function inside(x: number, z: number, r: Rect) {
  return x >= r.x && x < r.x + r.w && z >= r.z && z < r.z + r.d;
}
export const walkGrid: boolean[] = Array.from(
  { length: COLS * ROWS },
  (_, i) => {
    const x = MIN_X + ((i % COLS) + 0.5) * CELL,
      z = MIN_Z + (Math.floor(i / COLS) + 0.5) * CELL;
    return REGIONS.some((r) => inside(x, z, r));
  },
);
export function cellAt(x: number, z: number) {
  const c = Math.floor((x - MIN_X) / CELL),
    r = Math.floor((z - MIN_Z) / CELL);
  return c < 0 || r < 0 || c >= COLS || r >= ROWS ? -1 : r * COLS + c;
}
export function cellPos(i: number) {
  return {
    x: MIN_X + ((i % COLS) + 0.5) * CELL,
    z: MIN_Z + (Math.floor(i / COLS) + 0.5) * CELL,
  };
}
export function walkable(x: number, z: number) {
  const i = cellAt(x, z);
  return i >= 0 && walkGrid[i];
}
// Circle-vs-grid and circle-vs-box collision. The navigation grid uses this exact query.
export function canStand(x: number, z: number, r = 0.34, y = 0) {
  for (const dx of [-r, 0, r])
    for (const dz of [-r, 0, r]) if (!walkable(x + dx, z + dz)) return false;
  return !OBSTACLES.some(
    (o) =>
      y < o.y + o.h &&
      x + r > o.x &&
      x - r < o.x + o.w &&
      z + r > o.z &&
      z - r < o.z + o.d,
  );
}
export function moveCircle(
  pos: { x: number; z: number; y: number },
  dx: number,
  dz: number,
  r = 0.34,
) {
  const steps = Math.max(1, Math.ceil(Math.hypot(dx, dz) / 0.17));
  for (let s = 0; s < steps; s++) {
    if (canStand(pos.x + dx / steps, pos.z, r, pos.y)) pos.x += dx / steps;
    if (canStand(pos.x, pos.z + dz / steps, r, pos.y)) pos.z += dz / steps;
  }
}
export function location(x: number, z: number) {
  if (Math.hypot(x - 27, z + 21) < 9) return "A SITE";
  if (Math.hypot(x + 28, z + 19) < 10) return "B SITE";
  return [...REGIONS].reverse().find((r) => inside(x, z, r))?.name || "DUST II";
}
export class Navigation {
  grid = walkGrid.map((w, i) => {
    const p = cellPos(i);
    return w && canStand(p.x, p.z, 0.4);
  });
  nearest(x: number, z: number) {
    let best = -1,
      dist = Infinity;
    for (let i = 0; i < this.grid.length; i++)
      if (this.grid[i]) {
        const p = cellPos(i),
          d = (p.x - x) ** 2 + (p.z - z) ** 2;
        if (d < dist) {
          best = i;
          dist = d;
        }
      }
    return best;
  }
  find(sx: number, sz: number, tx: number, tz: number) {
    const start = this.nearest(sx, sz),
      end = this.nearest(tx, tz);
    if (start < 0 || end < 0) return [];
    const open = new Set([start]),
      from = new Map<number, number>(),
      g = new Map([[start, 0]]),
      f = new Map([[start, 0]]);
    const ep = cellPos(end);
    while (open.size) {
      let cur = -1,
        best = Infinity;
      for (const i of open)
        if ((f.get(i) ?? Infinity) < best) {
          best = f.get(i)!;
          cur = i;
        }
      if (cur === end) {
        const path = [cellPos(cur)];
        while (from.has(cur)) {
          cur = from.get(cur)!;
          path.unshift(cellPos(cur));
        }
        return path;
      }
      open.delete(cur);
      const col = cur % COLS;
      for (const n of [
        cur - COLS,
        cur + COLS,
        ...(col > 0 ? [cur - 1] : []),
        ...(col < COLS - 1 ? [cur + 1] : []),
      ]) {
        if (n < 0 || n >= this.grid.length || !this.grid[n]) continue;
        const cp = cellPos(cur),
          np = cellPos(n);
        if (!canStand((cp.x + np.x) / 2, (cp.z + np.z) / 2, 0.4)) continue;
        const ng = g.get(cur)! + 1;
        if (ng < (g.get(n) ?? Infinity)) {
          from.set(n, cur);
          g.set(n, ng);
          f.set(n, ng + (Math.abs(np.x - ep.x) + Math.abs(np.z - ep.z)) / CELL);
          open.add(n);
        }
      }
    }
    return [];
  }
}
