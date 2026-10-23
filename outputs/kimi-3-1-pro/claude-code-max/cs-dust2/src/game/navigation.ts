import * as THREE from 'three';
import type { MapData } from './map';
import { floorHeightAt } from './physics';

interface HeapNode { index: number; score: number }

class MinHeap {
  private values: HeapNode[] = [];
  get size() { return this.values.length; }
  push(node: HeapNode) {
    this.values.push(node);
    let index = this.values.length - 1;
    while (index > 0) {
      const parent = (index - 1) >> 1;
      if (this.values[parent].score <= node.score) break;
      this.values[index] = this.values[parent];
      index = parent;
    }
    this.values[index] = node;
  }
  pop() {
    const root = this.values[0];
    const tail = this.values.pop()!;
    if (this.values.length === 0) return root;
    let index = 0;
    while (true) {
      const left = index * 2 + 1;
      const right = left + 1;
      if (left >= this.values.length) break;
      let child = left;
      if (right < this.values.length && this.values[right].score < this.values[left].score) child = right;
      if (this.values[child].score >= tail.score) break;
      this.values[index] = this.values[child];
      index = child;
    }
    this.values[index] = tail;
    return root;
  }
}

export class NavigationGrid {
  readonly cellSize = 1;
  readonly minX = -41;
  readonly minZ = -46;
  readonly columns = 83;
  readonly rows = 93;
  private walkable = new Uint8Array(this.columns * this.rows);
  private heights = new Float32Array(this.columns * this.rows);

  constructor(private map: MapData) {
    for (let z = 0; z < this.rows; z++) {
      for (let x = 0; x < this.columns; x++) {
        const index = z * this.columns + x;
        const worldX = this.minX + x * this.cellSize;
        const worldZ = this.minZ + z * this.cellSize;
        this.heights[index] = floorHeightAt(map, worldX, worldZ);
        this.walkable[index] = this.canStand(worldX, worldZ, this.heights[index]) ? 1 : 0;
      }
    }
  }

  private canStand(x: number, z: number, height: number) {
    const radius = 0.43;
    for (const box of this.map.colliders) {
      if (box.maxY <= height + 0.46 || box.minY >= height + 1.75) continue;
      const nx = THREE.MathUtils.clamp(x, box.minX, box.maxX);
      const nz = THREE.MathUtils.clamp(z, box.minZ, box.maxZ);
      const dx = x - nx;
      const dz = z - nz;
      if (dx * dx + dz * dz < radius * radius) return false;
    }
    return true;
  }

  private world(index: number) {
    const x = index % this.columns;
    const z = Math.floor(index / this.columns);
    return new THREE.Vector3(
      this.minX + x * this.cellSize,
      this.heights[index],
      this.minZ + z * this.cellSize,
    );
  }

  private nearest(position: THREE.Vector3) {
    const baseX = Math.round((position.x - this.minX) / this.cellSize);
    const baseZ = Math.round((position.z - this.minZ) / this.cellSize);
    let best = -1;
    let bestDistance = Infinity;
    for (let radius = 0; radius <= 5; radius++) {
      for (let dz = -radius; dz <= radius; dz++) {
        for (let dx = -radius; dx <= radius; dx++) {
          if (Math.max(Math.abs(dx), Math.abs(dz)) !== radius) continue;
          const x = baseX + dx;
          const z = baseZ + dz;
          if (x < 0 || z < 0 || x >= this.columns || z >= this.rows) continue;
          const index = z * this.columns + x;
          if (!this.walkable[index]) continue;
          const worldX = this.minX + x * this.cellSize;
          const worldZ = this.minZ + z * this.cellSize;
          const distance = (worldX - position.x) ** 2 + (worldZ - position.z) ** 2;
          if (distance < bestDistance) {
            bestDistance = distance;
            best = index;
          }
        }
      }
      if (best >= 0) return best;
    }
    return best;
  }

  private neighbors(index: number, output: number[]) {
    output.length = 0;
    const x = index % this.columns;
    const z = Math.floor(index / this.columns);
    for (let dz = -1; dz <= 1; dz++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dz === 0) continue;
        const nx = x + dx;
        const nz = z + dz;
        if (nx < 0 || nz < 0 || nx >= this.columns || nz >= this.rows) continue;
        const next = nz * this.columns + nx;
        if (!this.walkable[next] || Math.abs(this.heights[next] - this.heights[index]) > 0.65) continue;
        if (dx !== 0 && dz !== 0) {
          if (!this.walkable[z * this.columns + nx] || !this.walkable[nz * this.columns + x]) continue;
        }
        output.push(next);
      }
    }
  }

  private lineWalkable(from: THREE.Vector3, to: THREE.Vector3) {
    const distance = from.distanceTo(to);
    const steps = Math.ceil(distance / 0.4);
    let previousHeight = from.y;
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const x = THREE.MathUtils.lerp(from.x, to.x, t);
      const z = THREE.MathUtils.lerp(from.z, to.z, t);
      const height = floorHeightAt(this.map, x, z);
      if (Math.abs(height - previousHeight) > 0.55 || !this.canStand(x, z, height)) return false;
      previousHeight = height;
    }
    return true;
  }

  findPath(startPosition: THREE.Vector3, endPosition: THREE.Vector3): THREE.Vector3[] {
    const start = this.nearest(startPosition);
    const goal = this.nearest(endPosition);
    if (start < 0 || goal < 0) return [];
    if (start === goal) return [endPosition.clone().setY(floorHeightAt(this.map, endPosition.x, endPosition.z))];
    const count = this.columns * this.rows;
    const costs = new Float32Array(count);
    costs.fill(Infinity);
    const parents = new Int32Array(count);
    parents.fill(-1);
    const closed = new Uint8Array(count);
    const open = new MinHeap();
    const goalWorld = this.world(goal);
    costs[start] = 0;
    open.push({ index: start, score: 0 });
    const neighborBuffer: number[] = [];
    let found = false;
    while (open.size > 0) {
      const current = open.pop().index;
      if (closed[current]) continue;
      if (current === goal) { found = true; break; }
      closed[current] = 1;
      this.neighbors(current, neighborBuffer);
      for (const neighbor of neighborBuffer) {
        if (closed[neighbor]) continue;
        const currentWorld = this.world(current);
        const neighborWorld = this.world(neighbor);
        const stepCost = currentWorld.distanceTo(neighborWorld);
        const nextCost = costs[current] + stepCost;
        if (nextCost >= costs[neighbor]) continue;
        costs[neighbor] = nextCost;
        parents[neighbor] = current;
        const heuristic = neighborWorld.distanceTo(goalWorld);
        open.push({ index: neighbor, score: nextCost + heuristic });
      }
    }
    if (!found) return [];
    const reverse: THREE.Vector3[] = [];
    let current = goal;
    while (current !== start && current >= 0) {
      reverse.push(this.world(current));
      current = parents[current];
    }
    reverse.reverse();
    if (this.canStand(endPosition.x, endPosition.z, floorHeightAt(this.map, endPosition.x, endPosition.z))) {
      reverse.push(endPosition.clone().setY(floorHeightAt(this.map, endPosition.x, endPosition.z)));
    }

    const smoothed: THREE.Vector3[] = [];
    let anchor = startPosition.clone();
    let index = 0;
    while (index < reverse.length) {
      let furthest = index;
      const lookahead = Math.min(reverse.length - 1, index + 14);
      for (let candidate = lookahead; candidate >= index; candidate--) {
        if (this.lineWalkable(anchor, reverse[candidate])) {
          furthest = candidate;
          break;
        }
      }
      smoothed.push(reverse[furthest]);
      anchor = reverse[furthest];
      index = furthest + 1;
    }
    return smoothed;
  }
}
