// A* pathfinding over the floor grid for AI navigation. 8-connected with no
// corner-cutting through walls; the resulting cell path is line-of-sight
// simplified so bots walk natural diagonals instead of hugging cell centers.

import { MapGrid } from './grid';

interface HeapItem {
  i: number;
  f: number;
}

class MinHeap {
  private a: HeapItem[] = [];
  get size(): number {
    return this.a.length;
  }
  push(item: HeapItem): void {
    const a = this.a;
    a.push(item);
    let c = a.length - 1;
    while (c > 0) {
      const p = (c - 1) >> 1;
      if (a[p].f <= a[c].f) break;
      [a[p], a[c]] = [a[c], a[p]];
      c = p;
    }
  }
  pop(): HeapItem {
    const a = this.a;
    const top = a[0];
    const last = a.pop()!;
    if (a.length) {
      a[0] = last;
      let p = 0;
      const n = a.length;
      for (;;) {
        const l = p * 2 + 1;
        const r = l + 1;
        let s = p;
        if (l < n && a[l].f < a[s].f) s = l;
        if (r < n && a[r].f < a[s].f) s = r;
        if (s === p) break;
        [a[p], a[s]] = [a[s], a[p]];
        p = s;
      }
    }
    return top;
  }
}

function nearestFloor(grid: MapGrid, cx: number, cz: number): { cx: number; cz: number } | null {
  if (grid.isFloor(cx, cz)) return { cx, cz };
  for (let r = 1; r <= 4; r++) {
    for (let dz = -r; dz <= r; dz++) {
      for (let dx = -r; dx <= r; dx++) {
        if (Math.abs(dx) !== r && Math.abs(dz) !== r) continue;
        if (grid.isFloor(cx + dx, cz + dz)) return { cx: cx + dx, cz: cz + dz };
      }
    }
  }
  return null;
}

const SQRT2 = Math.SQRT2;

export function findPath(
  grid: MapGrid,
  startX: number, startZ: number,
  goalX: number, goalZ: number,
): { x: number; z: number }[] | null {
  const s0 = grid.cellOf(startX, startZ);
  const g0 = grid.cellOf(goalX, goalZ);
  const start = nearestFloor(grid, s0.cx, s0.cz);
  const goal = nearestFloor(grid, g0.cx, g0.cz);
  if (!start || !goal) return null;

  const cols = grid.cols;
  const n = cols * grid.rows;
  const startI = start.cz * cols + start.cx;
  const goalI = goal.cz * cols + goal.cx;
  if (startI === goalI) return [{ x: goalX, z: goalZ }];

  const gScore = new Float32Array(n).fill(Infinity);
  const came = new Int32Array(n).fill(-1);
  const closed = new Uint8Array(n);
  const open = new MinHeap();
  gScore[startI] = 0;
  open.push({ i: startI, f: 0 });

  const gcx = goal.cx;
  const gcz = goal.cz;
  const heur = (cx: number, cz: number): number => {
    const dx = Math.abs(cx - gcx);
    const dz = Math.abs(cz - gcz);
    return (dx + dz) + (SQRT2 - 2) * Math.min(dx, dz);
  };

  let guard = 0;
  let found = false;
  while (open.size && guard++ < 20000) {
    const cur = open.pop();
    const ci = cur.i;
    if (closed[ci]) continue;
    closed[ci] = 1;
    if (ci === goalI) {
      found = true;
      break;
    }
    const cx = ci % cols;
    const cz = (ci - cx) / cols;
    for (let dz = -1; dz <= 1; dz++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dz === 0) continue;
        const nx = cx + dx;
        const nz = cz + dz;
        if (!grid.isFloor(nx, nz)) continue;
        if (dx !== 0 && dz !== 0) {
          // no corner cutting
          if (grid.isWall(cx + dx, cz) || grid.isWall(cx, cz + dz)) continue;
        }
        const ni = nz * cols + nx;
        if (closed[ni]) continue;
        const step = dx !== 0 && dz !== 0 ? SQRT2 : 1;
        const ng = gScore[ci] + step;
        if (ng < gScore[ni]) {
          gScore[ni] = ng;
          came[ni] = ci;
          open.push({ i: ni, f: ng + heur(nx, nz) });
        }
      }
    }
  }
  if (!found) return null;

  // reconstruct cell path
  const cells: number[] = [];
  let c = goalI;
  while (c !== -1) {
    cells.push(c);
    c = came[c];
  }
  cells.reverse();

  // to world points (cell centers), keep true goal as final point
  const pts: { x: number; z: number }[] = cells.map((i) => {
    const cx = i % cols;
    const cz = (i - cx) / cols;
    return grid.centerOf(cx, cz);
  });
  pts[pts.length - 1] = { x: goalX, z: goalZ };

  // line-of-sight simplification (string pulling)
  const out: { x: number; z: number }[] = [pts[0]];
  let anchor = 0;
  for (let i = 2; i < pts.length; i++) {
    if (grid.segmentBlocked(pts[anchor].x, pts[anchor].z, pts[i].x, pts[i].z)) {
      out.push(pts[i - 1]);
      anchor = i - 1;
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}
