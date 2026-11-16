import type { Vec3 } from './math';
import { v3, vdist2 } from './math';
import type { MapData } from './map';
import { cellAt, cellCenter, walkable } from './map';

/** A* on the 2m walkability grid (4-connected), with line-of-sight smoothing. */
export function findPath(map: MapData, from: Vec3, to: Vec3): Vec3[] {
  const s = cellAt(map, from.x, from.z);
  const g = cellAt(map, to.x, to.z);
  if (!walkable(map, s.c, s.r) || !walkable(map, g.c, g.r)) {
    // fall back: nearest walkable cell to the goal
    const alt = nearestWalkable(map, to);
    if (!alt) return [];
    g.c = alt.c;
    g.r = alt.r;
    if (!walkable(map, s.c, s.r)) return [];
  }
  const cols = map.cols;
  const rows = map.rows;
  const start = s.r * cols + s.c;
  const goal = g.r * cols + g.c;
  if (start === goal) return [v3(to.x, 0, to.z)];

  const gScore = new Float32Array(cols * rows).fill(Infinity);
  const came = new Int32Array(cols * rows).fill(-1);
  const closed = new Uint8Array(cols * rows);
  // simple binary heap
  const heap: number[] = [];
  const fScore = new Float32Array(cols * rows).fill(Infinity);
  const h = (i: number): number => {
    const c = i % cols;
    const r = (i / cols) | 0;
    return Math.abs(c - g.c) + Math.abs(r - g.r);
  };
  const push = (i: number): void => {
    heap.push(i);
    let k = heap.length - 1;
    while (k > 0) {
      const par = (k - 1) >> 1;
      if (fScore[heap[par]] <= fScore[heap[k]]) break;
      const t = heap[par]; heap[par] = heap[k]; heap[k] = t;
      k = par;
    }
  };
  const pop = (): number => {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let k = 0;
      for (;;) {
        const l = k * 2 + 1;
        const r = l + 1;
        let m = k;
        if (l < heap.length && fScore[heap[l]] < fScore[heap[m]]) m = l;
        if (r < heap.length && fScore[heap[r]] < fScore[heap[m]]) m = r;
        if (m === k) break;
        const t = heap[m]; heap[m] = heap[k]; heap[k] = t;
        k = m;
      }
    }
    return top;
  };

  gScore[start] = 0;
  fScore[start] = h(start);
  push(start);
  let found = false;
  let guard = 0;
  while (heap.length > 0 && guard++ < 20000) {
    const cur = pop();
    if (cur === goal) {
      found = true;
      break;
    }
    if (closed[cur]) continue;
    closed[cur] = 1;
    const c = cur % cols;
    const r = (cur / cols) | 0;
    const neighbors = [
      [c - 1, r], [c + 1, r], [c, r - 1], [c, r + 1],
    ];
    for (const [nc, nr] of neighbors) {
      if (!walkable(map, nc, nr)) continue;
      const ni = nr * cols + nc;
      if (closed[ni]) continue;
      const tentative = gScore[cur] + 1;
      if (tentative < gScore[ni]) {
        gScore[ni] = tentative;
        came[ni] = cur;
        fScore[ni] = tentative + h(ni);
        push(ni);
      }
    }
  }
  if (!found) return [];

  const cells: number[] = [];
  let cur = goal;
  while (cur !== -1) {
    cells.push(cur);
    cur = came[cur];
  }
  cells.reverse();
  const pts: Vec3[] = cells.map((i) => cellCenter(map, i % cols, (i / cols) | 0));
  pts[pts.length - 1] = v3(to.x, 0, to.z);
  return smoothPath(map, pts);
}

/** Greedy string-pulling: skip waypoints while the straight segment stays on walkable cells. */
function smoothPath(map: MapData, pts: Vec3[]): Vec3[] {
  if (pts.length <= 2) return pts;
  const out: Vec3[] = [pts[0]];
  let i = 0;
  while (i < pts.length - 1) {
    let j = pts.length - 1;
    for (; j > i + 1; j--) {
      if (gridLineClear(map, pts[i], pts[j])) break;
    }
    out.push(pts[j]);
    i = j;
  }
  return out;
}

export function gridLineClear(map: MapData, a: Vec3, b: Vec3): boolean {
  const dist = vdist2(a, b);
  const steps = Math.max(1, Math.ceil(dist / (map.cell * 0.4)));
  for (let k = 0; k <= steps; k++) {
    const t = k / steps;
    const x = a.x + (b.x - a.x) * t;
    const z = a.z + (b.z - a.z) * t;
    const { c, r } = cellAt(map, x, z);
    if (!walkable(map, c, r)) return false;
  }
  return true;
}

export function nearestWalkable(map: MapData, p: Vec3): { c: number; r: number } | null {
  const { c, r } = cellAt(map, p.x, p.z);
  if (walkable(map, c, r)) return { c, r };
  for (let rad = 1; rad <= 6; rad++) {
    for (let dr = -rad; dr <= rad; dr++) {
      for (let dc = -rad; dc <= rad; dc++) {
        if (Math.max(Math.abs(dr), Math.abs(dc)) !== rad) continue;
        if (walkable(map, c + dc, r + dr)) return { c: c + dc, r: r + dr };
      }
    }
  }
  return null;
}
