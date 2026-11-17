import type { Point } from './types';
import type { World } from './world';

/** Grid A*, followed by collision-checked string pulling. No navmesh dependency. */
export class Navigation {
  readonly width = 90;
  readonly height = 82;
  readonly walkable: Uint8Array;
  constructor(private world: World) {
    this.walkable = new Uint8Array(this.width * this.height);
    for (let z = 0; z < this.height; z++) for (let x = 0; x < this.width; x++) {
      const p = this.point(z * this.width + x); this.walkable[z * this.width + x] = world.clear(p.x, p.z, .48) ? 1 : 0;
    }
  }
  private point(id: number): Point { return { x: id % this.width - 43.5, z: Math.floor(id / this.width) - 45.5 }; }
  private nearest(p: Point) {
    const x = Math.round(p.x + 43.5), z = Math.round(p.z + 45.5);
    for (let r = 0; r < 9; r++) for (let dz = -r; dz <= r; dz++) for (let dx = -r; dx <= r; dx++) {
      const xx = x + dx, zz = z + dz;
      if (xx < 0 || xx >= this.width || zz < 0 || zz >= this.height) continue;
      const id = zz * this.width + xx;
      if (this.walkable[id]) return id;
    }
    return -1;
  }
  findPath(from: Point, to: Point): Point[] {
    if (this.world.lineWalkable(from, to)) return [{ ...to }];
    const start = this.nearest(from), end = this.nearest(to);
    if (start < 0 || end < 0) return [];
    const size = this.width * this.height;
    const costs = new Float32Array(size).fill(Infinity), parent = new Int32Array(size).fill(-1), closed = new Uint8Array(size);
    const heap: { id: number; score: number }[] = [];
    const push = (id: number, score: number) => {
      heap.push({ id, score }); let i = heap.length - 1;
      while (i > 0) { const p = (i - 1) >> 1; if (heap[p].score <= score) break; [heap[p], heap[i]] = [heap[i], heap[p]]; i = p; }
    };
    const pop = () => {
      const root = heap[0], last = heap.pop()!;
      if (heap.length) { heap[0] = last; let i = 0; while (true) { let child = i * 2 + 1; if (child >= heap.length) break; if (child + 1 < heap.length && heap[child + 1].score < heap[child].score) child++; if (heap[i].score <= heap[child].score) break; [heap[i], heap[child]] = [heap[child], heap[i]]; i = child; } }
      return root.id;
    };
    const heuristic = (id: number) => Math.hypot(id % this.width - end % this.width, Math.floor(id / this.width) - Math.floor(end / this.width));
    costs[start] = 0; push(start, heuristic(start));
    const offsets = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]];
    while (heap.length) {
      const current = pop(); if (closed[current]) continue; closed[current] = 1;
      if (current === end) {
        const path: Point[] = []; let i = end;
        while (i !== start && i >= 0) { path.push(this.point(i)); i = parent[i]; }
        path.reverse(); const result: Point[] = []; let anchor = from, at = 0;
        while (at < path.length) { let far = Math.min(at + 16, path.length - 1); while (far > at && !this.world.lineWalkable(anchor, path[far])) far--; result.push(path[far]); anchor = path[far]; at = far + 1; }
        if (this.world.lineWalkable(anchor, to)) result.push({ ...to });
        return result;
      }
      const cx = current % this.width, cz = Math.floor(current / this.width);
      for (const [dx, dz] of offsets) {
        const nx = cx + dx, nz = cz + dz;
        if (nx < 0 || nz < 0 || nx >= this.width || nz >= this.height) continue;
        const next = nz * this.width + nx;
        if (!this.walkable[next] || closed[next]) continue;
        if (dx && dz && (!this.walkable[cz * this.width + nx] || !this.walkable[nz * this.width + cx])) continue;
        const cost = costs[current] + (dx && dz ? 1.4142 : 1);
        if (cost >= costs[next]) continue;
        costs[next] = cost; parent[next] = current; push(next, cost + heuristic(next));
      }
    }
    return [];
  }
}
