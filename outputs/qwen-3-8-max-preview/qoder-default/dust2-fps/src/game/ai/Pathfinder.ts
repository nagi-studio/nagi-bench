import { Vec3 } from '../types';
import { Dust2Map } from '../world/Dust2Map';

interface NavNode {
  pos: Vec3;
  neighbors: number[];
}

// A* pathfinding on navigation graph
export class Pathfinder {
  private nodes: NavNode[] = [];
  private map: Dust2Map;

  constructor(map: Dust2Map) {
    this.map = map;
    this.buildNavGraph();
  }

  private buildNavGraph() {
    const points = this.map.navPoints;
    // Create nodes
    for (const p of points) {
      this.nodes.push({ pos: { ...p }, neighbors: [] });
    }
    // Connect nodes that have line of sight and are within range
    const MAX_DIST = 20;
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const d = this.dist(this.nodes[i].pos, this.nodes[j].pos);
        if (d < MAX_DIST) {
          const eyeA = { x: this.nodes[i].pos.x, y: 1.5, z: this.nodes[i].pos.z };
          const eyeB = { x: this.nodes[j].pos.x, y: 1.5, z: this.nodes[j].pos.z };
          if (this.map.hasLineOfSight(eyeA, eyeB)) {
            this.nodes[i].neighbors.push(j);
            this.nodes[j].neighbors.push(i);
          }
        }
      }
    }
    // Ensure connectivity - connect isolated nodes to nearest
    for (let i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].neighbors.length === 0) {
        let nearest = -1;
        let nearestDist = Infinity;
        for (let j = 0; j < this.nodes.length; j++) {
          if (i === j) continue;
          const d = this.dist(this.nodes[i].pos, this.nodes[j].pos);
          if (d < nearestDist) {
            nearestDist = d;
            nearest = j;
          }
        }
        if (nearest >= 0) {
          this.nodes[i].neighbors.push(nearest);
          this.nodes[nearest].neighbors.push(i);
        }
      }
    }
  }

  private dist(a: Vec3, b: Vec3): number {
    const dx = a.x - b.x;
    const dz = a.z - b.z;
    return Math.sqrt(dx * dx + dz * dz);
  }

  private findNearestNode(pos: Vec3): number {
    let nearest = 0;
    let nearestDist = Infinity;
    for (let i = 0; i < this.nodes.length; i++) {
      const d = this.dist(pos, this.nodes[i].pos);
      if (d < nearestDist) {
        nearestDist = d;
        nearest = i;
      }
    }
    return nearest;
  }

  findPath(from: Vec3, to: Vec3): Vec3[] {
    const startNode = this.findNearestNode(from);
    const endNode = this.findNearestNode(to);

    if (startNode === endNode) {
      return [{ ...to }];
    }

    // A* algorithm
    const openSet = new Set<number>([startNode]);
    const cameFrom = new Map<number, number>();
    const gScore = new Map<number, number>();
    const fScore = new Map<number, number>();

    gScore.set(startNode, 0);
    fScore.set(startNode, this.dist(this.nodes[startNode].pos, this.nodes[endNode].pos));

    while (openSet.size > 0) {
      // Find node with lowest fScore
      let current = -1;
      let lowestF = Infinity;
      for (const node of openSet) {
        const f = fScore.get(node) || Infinity;
        if (f < lowestF) {
          lowestF = f;
          current = node;
        }
      }

      if (current === endNode) {
        // Reconstruct path
        const path: Vec3[] = [];
        let c: number | undefined = current;
        while (c !== undefined && c !== startNode) {
          path.unshift({ ...this.nodes[c].pos });
          c = cameFrom.get(c);
        }
        path.push({ ...to });
        return path;
      }

      openSet.delete(current);
      for (const neighbor of this.nodes[current].neighbors) {
        const tentG = (gScore.get(current) || 0) + this.dist(this.nodes[current].pos, this.nodes[neighbor].pos);
        if (tentG < (gScore.get(neighbor) || Infinity)) {
          cameFrom.set(neighbor, current);
          gScore.set(neighbor, tentG);
          fScore.set(neighbor, tentG + this.dist(this.nodes[neighbor].pos, this.nodes[endNode].pos));
          openSet.add(neighbor);
        }
      }
    }

    // No path found - return direct
    return [{ ...to }];
  }

  getRandomPatrolPoint(from: Vec3, team: 'CT' | 'T'): Vec3 {
    const P = this.map.POSITIONS;
    const ctPoints = [P.CT_SPAWN, P.A_SITE, P.MID_DOORS, P.CATWALK, P.B_SITE, P.B_DOORS, P.UPPER_MID, P.A_SHORT];
    const tPoints = [P.T_SPAWN, P.A_LONG, P.MID, P.B_TUNNELS, P.LOWER_TUNNELS, P.A_LONG_DOORS, P.MID_DOORS, P.B_SITE];
    const points = team === 'CT' ? ctPoints : tPoints;
    const idx = Math.floor(Math.random() * points.length);
    return { ...points[idx] };
  }
}
