import * as THREE from 'three';
import type { Collider } from './types';
import { circleOverlaps } from './physics';

interface HeapNode { index: number; score: number }

class MinHeap {
  data: HeapNode[] = [];
  push(node: HeapNode) {
    this.data.push(node);
    let i = this.data.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.data[parent].score <= node.score) break;
      this.data[i] = this.data[parent];
      i = parent;
    }
    this.data[i] = node;
  }
  pop() {
    const root = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length) {
      let i = 0;
      while (true) {
        let child = i * 2 + 1;
        if (child >= this.data.length) break;
        if (child + 1 < this.data.length && this.data[child + 1].score < this.data[child].score) child++;
        if (this.data[child].score >= last.score) break;
        this.data[i] = this.data[child];
        i = child;
      }
      this.data[i] = last;
    }
    return root;
  }
  get length() { return this.data.length; }
}

export class Navigator {
  private readonly cell = 1;
  private readonly width: number;
  private readonly depth: number;
  private readonly blocked: Uint8Array;
  private readonly minX: number;
  private readonly minZ: number;

  constructor(private colliders: Collider[], bounds: { minX: number; maxX: number; minZ: number; maxZ: number }) {
    this.minX = bounds.minX + 1;
    this.minZ = bounds.minZ + 1;
    this.width = Math.floor(bounds.maxX - bounds.minX - 2);
    this.depth = Math.floor(bounds.maxZ - bounds.minZ - 2);
    this.blocked = new Uint8Array(this.width * this.depth);
    for (let z = 0; z < this.depth; z++) {
      for (let x = 0; x < this.width; x++) {
        const world = this.toWorld(x, z);
        for (const c of colliders) {
          if (c.maxY > 0.55 && c.minY < 1.5 && circleOverlaps(c, world.x, world.z, 0.48)) {
            this.blocked[this.index(x, z)] = 1;
            break;
          }
        }
      }
    }
  }

  private index(x: number, z: number) { return z * this.width + x; }
  private coords(index: number) { return { x: index % this.width, z: Math.floor(index / this.width) }; }
  private toCell(pos: THREE.Vector3) {
    return {
      x: Math.max(0, Math.min(this.width - 1, Math.round(pos.x - this.minX))),
      z: Math.max(0, Math.min(this.depth - 1, Math.round(pos.z - this.minZ))),
    };
  }
  private toWorld(x: number, z: number) { return new THREE.Vector3(this.minX + x, 0, this.minZ + z); }

  private nearestOpen(cell: { x: number; z: number }) {
    if (!this.blocked[this.index(cell.x, cell.z)]) return cell;
    for (let r = 1; r <= 7; r++) {
      for (let dz = -r; dz <= r; dz++) {
        for (let dx = -r; dx <= r; dx++) {
          if (Math.abs(dx) !== r && Math.abs(dz) !== r) continue;
          const x = cell.x + dx;
          const z = cell.z + dz;
          if (x >= 0 && z >= 0 && x < this.width && z < this.depth && !this.blocked[this.index(x, z)]) return { x, z };
        }
      }
    }
    return null;
  }

  private walkablePoint(pos: THREE.Vector3) {
    for (const c of this.colliders) {
      if (c.maxY > 0.55 && c.minY < 1.5 && circleOverlaps(c, pos.x, pos.z, 0.45)) return false;
    }
    return true;
  }

  private walkableLine(a: THREE.Vector3, b: THREE.Vector3) {
    const distance = a.distanceTo(b);
    const steps = Math.ceil(distance / 0.4);
    for (let i = 1; i < steps; i++) {
      const p = a.clone().lerp(b, i / steps);
      if (!this.walkablePoint(p)) return false;
    }
    return true;
  }

  findPath(startPos: THREE.Vector3, endPos: THREE.Vector3): THREE.Vector3[] {
    const start = this.nearestOpen(this.toCell(startPos));
    const end = this.nearestOpen(this.toCell(endPos));
    if (!start || !end) return [];
    const startIndex = this.index(start.x, start.z);
    const endIndex = this.index(end.x, end.z);
    if (startIndex === endIndex) return [endPos.clone()];
    const count = this.width * this.depth;
    const g = new Float32Array(count);
    g.fill(Infinity);
    const came = new Int32Array(count);
    came.fill(-1);
    const closed = new Uint8Array(count);
    const heap = new MinHeap();
    g[startIndex] = 0;
    heap.push({ index: startIndex, score: 0 });
    const directions = [[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [1, 1, Math.SQRT2], [1, -1, Math.SQRT2], [-1, 1, Math.SQRT2], [-1, -1, Math.SQRT2]];
    let iterations = 0;
    while (heap.length && iterations++ < 16000) {
      const current = heap.pop().index;
      if (closed[current]) continue;
      if (current === endIndex) break;
      closed[current] = 1;
      const { x, z } = this.coords(current);
      for (const [dx, dz, cost] of directions) {
        const nx = x + dx;
        const nz = z + dz;
        if (nx < 0 || nz < 0 || nx >= this.width || nz >= this.depth) continue;
        const next = this.index(nx, nz);
        if (this.blocked[next] || closed[next]) continue;
        if (dx && dz && (this.blocked[this.index(x + dx, z)] || this.blocked[this.index(x, z + dz)])) continue;
        const nextG = g[current] + cost;
        if (nextG >= g[next]) continue;
        g[next] = nextG;
        came[next] = current;
        const ax = Math.abs(end.x - nx);
        const az = Math.abs(end.z - nz);
        const heuristic = Math.max(ax, az) + (Math.SQRT2 - 1) * Math.min(ax, az);
        heap.push({ index: next, score: nextG + heuristic });
      }
    }
    if (came[endIndex] === -1) return [];
    const reversed: THREE.Vector3[] = [];
    let current = endIndex;
    while (current !== startIndex && current !== -1) {
      const { x, z } = this.coords(current);
      reversed.push(this.toWorld(x, z));
      current = came[current];
    }
    reversed.reverse();
    if (this.walkablePoint(endPos)) {
      if (reversed.length) reversed[reversed.length - 1] = endPos.clone();
      else reversed.push(endPos.clone());
    }
    // String pulling prevents grid-like motion while testing the full agent radius.
    const smooth: THREE.Vector3[] = [];
    let anchor = startPos;
    let i = 0;
    while (i < reversed.length) {
      let furthest = i;
      for (let j = reversed.length - 1; j > i; j--) {
        if (this.walkableLine(anchor, reversed[j])) { furthest = j; break; }
      }
      smooth.push(reversed[furthest]);
      anchor = reversed[furthest];
      i = furthest + 1;
    }
    return smooth;
  }
}
