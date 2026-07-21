import * as THREE from 'three';
import { Waypoint } from '../types/game';

export class NavMesh {
  private waypoints: Map<string, Waypoint> = new Map();

  constructor() {
    this.initWaypoints();
  }

  private addNode(id: string, x: number, z: number, connections: string[], zone?: Waypoint['zone']) {
    this.waypoints.set(id, {
      id,
      position: new THREE.Vector3(x, 0, z),
      connections,
      zone
    });
  }

  private initWaypoints() {
    // T Spawn Zone
    this.addNode('T_SPAWN_CENTER', 0, 60, ['T_SPAWN_LONG', 'T_SPAWN_MID', 'T_SPAWN_B'], 'T_SPAWN');
    this.addNode('T_SPAWN_LONG', 25, 58, ['T_SPAWN_CENTER', 'LONG_A_OUTSIDE'], 'T_SPAWN');
    this.addNode('T_SPAWN_MID', 0, 48, ['T_SPAWN_CENTER', 'TOP_MID'], 'T_SPAWN');
    this.addNode('T_SPAWN_B', -25, 55, ['T_SPAWN_CENTER', 'UPPER_B_ENTRANCE'], 'T_SPAWN');

    // Long A Path
    this.addNode('LONG_A_OUTSIDE', 42, 50, ['T_SPAWN_LONG', 'LONG_A_CORNER']);
    this.addNode('LONG_A_CORNER', 42, 35, ['LONG_A_OUTSIDE', 'LONG_A_DOORS', 'LONG_A_PIT'], 'LONG_A');
    this.addNode('LONG_A_PIT', 48, 20, ['LONG_A_CORNER', 'LONG_A_RAMP'], 'LONG_A');
    this.addNode('LONG_A_DOORS', 42, 15, ['LONG_A_CORNER', 'LONG_A_RAMP'], 'LONG_A');
    this.addNode('LONG_A_RAMP', 42, -5, ['LONG_A_DOORS', 'LONG_A_PIT', 'A_SITE_CENTER'], 'LONG_A');

    // A Site
    this.addNode('A_SITE_CENTER', 40, -15, ['LONG_A_RAMP', 'CATWALK_END', 'CT_RAMP_A', 'A_GOOSE'], 'A_SITE');
    this.addNode('A_GOOSE', 48, -25, ['A_SITE_CENTER'], 'A_SITE');

    // Mid & Catwalk
    this.addNode('TOP_MID', 0, 35, ['T_SPAWN_MID', 'MID_DOORS_S', 'XBOX'], 'MID');
    this.addNode('XBOX', 8, 12, ['TOP_MID', 'CATWALK_MID'], 'CATWALK');
    this.addNode('CATWALK_MID', 15, 5, ['XBOX', 'CATWALK_END'], 'CATWALK');
    this.addNode('CATWALK_END', 25, -10, ['CATWALK_MID', 'A_SITE_CENTER'], 'CATWALK');

    this.addNode('MID_DOORS_S', 0, 15, ['TOP_MID', 'MID_DOORS_N'], 'MID');
    this.addNode('MID_DOORS_N', 0, -5, ['MID_DOORS_S', 'CT_MID'], 'MID');
    this.addNode('CT_MID', 0, -25, ['MID_DOORS_N', 'CT_SPAWN_CENTER', 'CT_RAMP_B', 'CT_RAMP_A'], 'MID');

    // Upper B Tunnels & B Site
    this.addNode('UPPER_B_ENTRANCE', -40, 45, ['T_SPAWN_B', 'UPPER_B_MID'], 'B_TUNNELS');
    this.addNode('UPPER_B_MID', -45, 25, ['UPPER_B_ENTRANCE', 'B_TUNNEL_EXIT'], 'B_TUNNELS');
    this.addNode('B_TUNNEL_EXIT', -45, 0, ['UPPER_B_MID', 'B_SITE_CENTER'], 'B_TUNNELS');

    this.addNode('B_SITE_CENTER', -40, -25, ['B_TUNNEL_EXIT', 'B_DOORS', 'B_WINDOW', 'B_PLATFORM'], 'B_SITE');
    this.addNode('B_PLATFORM', -48, -18, ['B_SITE_CENTER'], 'B_SITE');
    this.addNode('B_DOORS', -26, -18, ['B_SITE_CENTER', 'CT_RAMP_B'], 'B_SITE');
    this.addNode('B_WINDOW', -28, -28, ['B_SITE_CENTER', 'CT_RAMP_B'], 'B_SITE');

    // CT Spawn & Ramps
    this.addNode('CT_SPAWN_CENTER', 0, -42, ['CT_MID', 'CT_RAMP_A', 'CT_RAMP_B'], 'CT_SPAWN');
    this.addNode('CT_RAMP_A', 22, -35, ['CT_SPAWN_CENTER', 'CT_MID', 'A_SITE_CENTER']);
    this.addNode('CT_RAMP_B', -20, -35, ['CT_SPAWN_CENTER', 'CT_MID', 'B_DOORS', 'B_WINDOW']);

    // Ensure all bidirectional connections are set up
    for (const [id, wp] of this.waypoints.entries()) {
      for (const targetId of wp.connections) {
        const target = this.waypoints.get(targetId);
        if (target && !target.connections.includes(id)) {
          target.connections.push(id);
        }
      }
    }
  }

  public getNearestWaypoint(pos: THREE.Vector3): Waypoint {
    let nearest: Waypoint | null = null;
    let minDst = Infinity;

    for (const wp of this.waypoints.values()) {
      const dst = wp.position.distanceTo(pos);
      if (dst < minDst) {
        minDst = dst;
        nearest = wp;
      }
    }
    return nearest || Array.from(this.waypoints.values())[0];
  }

  public getRandomWaypointInZone(zone: Waypoint['zone']): Waypoint {
    const candidates = Array.from(this.waypoints.values()).filter(w => w.zone === zone);
    if (candidates.length > 0) {
      return candidates[Math.floor(Math.random() * candidates.length)];
    }
    return Array.from(this.waypoints.values())[Math.floor(Math.random() * this.waypoints.size)];
  }

  public findPath(startPos: THREE.Vector3, targetPos: THREE.Vector3): THREE.Vector3[] {
    const startWp = this.getNearestWaypoint(startPos);
    const targetWp = this.getNearestWaypoint(targetPos);

    if (startWp.id === targetWp.id) {
      return [targetPos.clone()];
    }

    // A* Pathfinding implementation
    const openSet: string[] = [startWp.id];
    const cameFrom: Map<string, string> = new Map();

    const gScore: Map<string, number> = new Map();
    const fScore: Map<string, number> = new Map();

    for (const id of this.waypoints.keys()) {
      gScore.set(id, Infinity);
      fScore.set(id, Infinity);
    }

    gScore.set(startWp.id, 0);
    fScore.set(startWp.id, startWp.position.distanceTo(targetWp.position));

    while (openSet.length > 0) {
      // Find node with lowest fScore
      let currentId = openSet[0];
      let lowestF = fScore.get(currentId) || Infinity;

      for (let i = 1; i < openSet.length; i++) {
        const id = openSet[i];
        const f = fScore.get(id) || Infinity;
        if (f < lowestF) {
          lowestF = f;
          currentId = id;
        }
      }

      if (currentId === targetWp.id) {
        // Reconstruct path
        const path: THREE.Vector3[] = [];
        let curr: string | undefined = currentId;
        while (curr) {
          const wp = this.waypoints.get(curr);
          if (wp) path.unshift(wp.position.clone());
          curr = cameFrom.get(curr);
        }
        path.push(targetPos.clone());
        return path;
      }

      openSet.splice(openSet.indexOf(currentId), 1);
      const currentWp = this.waypoints.get(currentId)!;

      for (const neighborId of currentWp.connections) {
        const neighborWp = this.waypoints.get(neighborId);
        if (!neighborWp) continue;

        const tentativeG = (gScore.get(currentId) || 0) + currentWp.position.distanceTo(neighborWp.position);

        if (tentativeG < (gScore.get(neighborId) || Infinity)) {
          cameFrom.set(neighborId, currentId);
          gScore.set(neighborId, tentativeG);
          fScore.set(neighborId, tentativeG + neighborWp.position.distanceTo(targetWp.position));

          if (!openSet.includes(neighborId)) {
            openSet.push(neighborId);
          }
        }
      }
    }

    return [targetWp.position.clone(), targetPos.clone()];
  }
}

export const navMesh = new NavMesh();
