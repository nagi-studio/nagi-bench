import { NAV_EDGES, NAV_NODES } from './mapData';
import { distance2d } from './math';

interface NodeRecord {
  id: string;
  x: number;
  z: number;
  neighbors: string[];
}

export class Navigation {
  private nodes = new Map<string, NodeRecord>();

  constructor() {
    for (const node of NAV_NODES) {
      this.nodes.set(node.id, { ...node, neighbors: [] });
    }
    for (const [a, b] of NAV_EDGES) {
      this.nodes.get(a)?.neighbors.push(b);
      this.nodes.get(b)?.neighbors.push(a);
    }
  }

  nearestNode(x: number, z: number, exclude?: string): string {
    let best: string | null = null;
    let bestDistance = Number.POSITIVE_INFINITY;
    for (const [id, node] of this.nodes) {
      if (id === exclude) continue;
      const d = distance2d(x, z, node.x, node.z);
      if (d < bestDistance) {
        best = id;
        bestDistance = d;
      }
    }
    return best ?? 'mid';
  }

  findPath(fromX: number, fromZ: number, toX: number, toZ: number): Array<{ x: number; z: number }> {
    const start = this.nearestNode(fromX, fromZ);
    const goal = this.nearestNode(toX, toZ);
    if (start === goal) return [{ x: toX, z: toZ }];

    const open = new Map<string, number>();
    const cameFrom = new Map<string, string>();
    const gScore = new Map<string, number>();
    const fScore = new Map<string, number>();
    for (const id of this.nodes.keys()) {
      gScore.set(id, Number.POSITIVE_INFINITY);
      fScore.set(id, Number.POSITIVE_INFINITY);
    }
    gScore.set(start, 0);
    fScore.set(start, this.heuristic(start, goal));
    open.set(start, fScore.get(start)!);

    for (let guard = 0; guard < 200 && open.size > 0; guard += 1) {
      let current = '';
      let best = Number.POSITIVE_INFINITY;
      for (const [id, score] of open) {
        if (score < best) {
          best = score;
          current = id;
        }
      }
      if (current === goal) break;
      open.delete(current);
      const record = this.nodes.get(current)!;
      for (const neighbor of record.neighbors) {
        const tentative = gScore.get(current)! + distance2d(record.x, record.z, this.nodes.get(neighbor)!.x, this.nodes.get(neighbor)!.z);
        if (tentative < (gScore.get(neighbor) ?? Number.POSITIVE_INFINITY)) {
          cameFrom.set(neighbor, current);
          gScore.set(neighbor, tentative);
          fScore.set(neighbor, tentative + this.heuristic(neighbor, goal));
          open.set(neighbor, fScore.get(neighbor)!);
        }
      }
    }

    const chain: string[] = [];
    let cursor = goal;
    while (cursor && cursor !== start) {
      chain.unshift(cursor);
      cursor = cameFrom.get(cursor) ?? '';
    }
    chain.unshift(start);
    const path = chain.map((id) => {
      const node = this.nodes.get(id)!;
      return { x: node.x, z: node.z };
    });
    path.push({ x: toX, z: toZ });
    return path;
  }

  private heuristic(a: string, b: string): number {
    const nodeA = this.nodes.get(a)!;
    const nodeB = this.nodes.get(b)!;
    return distance2d(nodeA.x, nodeA.z, nodeB.x, nodeB.z);
  }
}
