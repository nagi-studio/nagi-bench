import * as THREE from 'three';
import { cellPoint, pointCell, COLS, ROWS, WorldMap } from './map';

class MinHeap {
  nodes: { id: number; score: number }[] = [];
  push(id: number, score: number) {
    const value = { id, score }; let i = this.nodes.length; this.nodes.push(value);
    while (i > 0) { const p = (i - 1) >> 1; if (this.nodes[p].score <= score) break; this.nodes[i] = this.nodes[p]; i = p; }
    this.nodes[i] = value;
  }
  pop() {
    const first = this.nodes[0], last = this.nodes.pop()!;
    if (this.nodes.length) {
      let i = 0;
      while (i * 2 + 1 < this.nodes.length) {
        let c = i * 2 + 1;
        if (c + 1 < this.nodes.length && this.nodes[c + 1].score < this.nodes[c].score) c++;
        if (this.nodes[c].score >= last.score) break;
        this.nodes[i] = this.nodes[c]; i = c;
      }
      this.nodes[i] = last;
    }
    return first.id;
  }
}
export class Navigator {
  private edges: number[][];
  constructor(private map: WorldMap) {
    this.edges = Array.from({ length: COLS * ROWS }, () => []);
    // Grid occupancy alone cannot detect a narrow doorpost between two free cells.
    // Precompute swept-radius-valid edges once, including diagonal corner clearance.
    for (let current = 0; current < map.nav.length; current++) {
      if (!map.nav[current]) continue;
      const x = current % COLS, z = Math.floor(current / COLS), from = cellPoint(current);
      for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) {
        if ((!dx && !dz) || x + dx < 0 || x + dx >= COLS || z + dz < 0 || z + dz >= ROWS) continue;
        const next = current + dz * COLS + dx;
        if (!map.nav[next] || (dx && dz && (!map.nav[current + dx] || !map.nav[current + dz * COLS]))) continue;
        if (map.segmentClear(from, cellPoint(next), .43)) this.edges[current].push(next);
      }
    }
  }
  nearest(pos: THREE.Vector3): number {
    const cell = pointCell(pos.x, pos.z);
    if (cell >= 0 && this.map.nav[cell]) return cell;
    let best = -1, distance = Infinity;
    for (let i = 0; i < this.map.nav.length; i++) {
      if (!this.map.nav[i]) continue;
      const d = cellPoint(i).distanceToSquared(pos);
      if (d < distance) { best = i; distance = d; }
    }
    return best;
  }
  find(from: THREE.Vector3, to: THREE.Vector3): THREE.Vector3[] {
    if (this.map.segmentClear(from, to)) return [to.clone()];
    const start = this.nearest(from), goal = this.nearest(to);
    if (start < 0 || goal < 0) return [];
    const count = COLS * ROWS, g = new Float32Array(count).fill(Infinity), parents = new Int32Array(count).fill(-1), closed = new Uint8Array(count);
    const heap = new MinHeap(); g[start] = 0; heap.push(start, 0);
    const gx = goal % COLS, gz = Math.floor(goal / COLS);
    while (heap.nodes.length) {
      const current = heap.pop();
      if (closed[current]) continue;
      if (current === goal) {
        const cells: number[] = []; let p = goal;
        while (p !== start && p >= 0) { cells.push(p); p = parents[p]; }
        cells.reverse();
        const points = cells.map(cellPoint);
        if (this.map.segmentClear(points[points.length - 1] ?? from, to)) points.push(to.clone());
        const smooth: THREE.Vector3[] = []; let anchor = from, i = 0;
        while (i < points.length) {
          let far = i;
          while (far + 1 < points.length && this.map.segmentClear(anchor, points[far + 1])) far++;
          smooth.push(points[far]); anchor = points[far]; i = far + 1;
        }
        return smooth;
      }
      closed[current] = 1;
      const x = current % COLS, z = Math.floor(current / COLS);
      for (const next of this.edges[current]) {
        if (closed[next]) continue;
        const nx = next % COLS, nz = Math.floor(next / COLS);
        const cost = g[current] + (nx !== x && nz !== z ? 1.4142 : 1);
        if (cost >= g[next]) continue;
        g[next] = cost; parents[next] = current;
        const hx = Math.abs(nx - gx), hz = Math.abs(nz - gz);
        heap.push(next, cost + Math.max(hx, hz) + .4142 * Math.min(hx, hz));
      }
    }
    return [];
  }
}
