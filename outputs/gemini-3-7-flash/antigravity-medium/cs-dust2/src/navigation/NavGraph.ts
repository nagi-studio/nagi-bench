import * as THREE from 'three';
import { Waypoint } from '../types/game';

export class NavGraph {
  public waypoints: Map<string, Waypoint> = new Map();

  constructor() {
    this.initWaypoints();
  }

  private addNode(id: string, x: number, y: number, z: number, zone: string, connectedIds: string[] = []) {
    this.waypoints.set(id, {
      id,
      position: new THREE.Vector3(x, y, z),
      zone,
      connectedIds: [...connectedIds],
    });
  }

  private connect(id1: string, id2: string) {
    const n1 = this.waypoints.get(id1);
    const n2 = this.waypoints.get(id2);
    if (n1 && n2) {
      if (!n1.connectedIds.includes(id2)) n1.connectedIds.push(id2);
      if (!n2.connectedIds.includes(id1)) n2.connectedIds.push(id1);
    }
  }

  private initWaypoints() {
    // 1. T Spawn area
    this.addNode('T_SPAWN_1', -8, 0, 60, 'T_SPAWN');
    this.addNode('T_SPAWN_2', 0, 0, 60, 'T_SPAWN');
    this.addNode('T_SPAWN_3', 8, 0, 60, 'T_SPAWN');
    this.addNode('T_SPAWN_MAIN', 0, 0, 52, 'T_SPAWN');

    this.connect('T_SPAWN_1', 'T_SPAWN_MAIN');
    this.connect('T_SPAWN_2', 'T_SPAWN_MAIN');
    this.connect('T_SPAWN_3', 'T_SPAWN_MAIN');

    // 2. T Mid & Suicide
    this.addNode('T_MID_TOP', 0, 0, 42, 'T_MID');
    this.addNode('T_MID_SLOPE', 0, 0, 25, 'T_MID');
    this.connect('T_SPAWN_MAIN', 'T_MID_TOP');
    this.connect('T_MID_TOP', 'T_MID_SLOPE');

    // 3. T to Outside Long
    this.addNode('T_OUTSIDE_LONG', 22, 0, 50, 'OUTSIDE_LONG');
    this.addNode('LONG_DOORS_T', 32, 0, 46, 'OUTSIDE_LONG');
    this.addNode('LONG_DOORS_INSIDE', 32, 0, 35, 'LONG_DOORS');
    this.addNode('LONG_DOORS_CORNER', 36, 0, 24, 'LONG_DOORS');

    this.connect('T_SPAWN_MAIN', 'T_OUTSIDE_LONG');
    this.connect('T_OUTSIDE_LONG', 'LONG_DOORS_T');
    this.connect('LONG_DOORS_T', 'LONG_DOORS_INSIDE');
    this.connect('LONG_DOORS_INSIDE', 'LONG_DOORS_CORNER');

    // 4. Long A Roadway & Pit
    this.addNode('LONG_A_CORNER', 36, 0, 16, 'LONG_A');
    this.addNode('LONG_A_PIT', 46, 0, 22, 'PIT');
    this.addNode('LONG_A_MIDWAY', 36, 0, 0, 'LONG_A');
    this.addNode('LONG_A_CROSS', 34, 0, -16, 'LONG_A');
    this.addNode('LONG_A_RAMP', 28, 1.0, -28, 'A_SITE');

    this.connect('LONG_DOORS_CORNER', 'LONG_A_CORNER');
    this.connect('LONG_A_CORNER', 'LONG_A_PIT');
    this.connect('LONG_A_CORNER', 'LONG_A_MIDWAY');
    this.connect('LONG_A_PIT', 'LONG_A_MIDWAY');
    this.connect('LONG_A_MIDWAY', 'LONG_A_CROSS');
    this.connect('LONG_A_CROSS', 'LONG_A_RAMP');

    // 5. A Site Platform
    this.addNode('A_SITE_DEFAULT', 24, 1.6, -40, 'A_SITE');
    this.addNode('A_SITE_GOOSE', 24, 1.6, -50, 'A_SITE');
    this.addNode('A_SITE_NINJA', 34, 1.6, -42, 'A_SITE');
    this.addNode('A_SITE_SHORT_ENTRY', 18, 2.2, -32, 'A_SITE');

    this.connect('LONG_A_RAMP', 'A_SITE_DEFAULT');
    this.connect('A_SITE_DEFAULT', 'A_SITE_GOOSE');
    this.connect('A_SITE_DEFAULT', 'A_SITE_NINJA');
    this.connect('A_SITE_DEFAULT', 'A_SITE_SHORT_ENTRY');

    // 6. Catwalk & Short A
    this.addNode('LOWER_MID', 0, 0, 10, 'MID');
    this.addNode('XBOX_CORNER', 4, 0, 4, 'MID');
    this.addNode('CATWALK_STAIRS', 8, 1.8, 2, 'CATWALK');
    this.addNode('CATWALK_MID', 11, 3.5, -8, 'CATWALK');
    this.addNode('SHORT_A_BEND', 14, 3.5, -20, 'SHORT_A');
    this.addNode('SHORT_A_STAIRS', 16, 2.8, -28, 'SHORT_A');

    this.connect('T_MID_SLOPE', 'LOWER_MID');
    this.connect('LOWER_MID', 'XBOX_CORNER');
    this.connect('XBOX_CORNER', 'CATWALK_STAIRS');
    this.connect('CATWALK_STAIRS', 'CATWALK_MID');
    this.connect('CATWALK_MID', 'SHORT_A_BEND');
    this.connect('SHORT_A_BEND', 'SHORT_A_STAIRS');
    this.connect('SHORT_A_STAIRS', 'A_SITE_SHORT_ENTRY');

    // 7. Mid Doors & Mid to CT
    this.addNode('MID_DOORS_T_SIDE', 0, 0, -6, 'MID');
    this.addNode('MID_DOORS_GAP', 0, 0, -12, 'MID_DOORS');
    this.addNode('MID_DOORS_CT_SIDE', 0, 0, -18, 'CT_MID');

    this.connect('LOWER_MID', 'MID_DOORS_T_SIDE');
    this.connect('MID_DOORS_T_SIDE', 'MID_DOORS_GAP');
    this.connect('MID_DOORS_GAP', 'MID_DOORS_CT_SIDE');

    // 8. Lower B Tunnel
    this.addNode('LOWER_TUNNEL_MID_ENTRY', -8, 0, 10, 'LOWER_TUNNEL');
    this.addNode('LOWER_TUNNEL_MIDWAY', -18, 0, 6, 'LOWER_TUNNEL');
    this.addNode('LOWER_TUNNEL_UPPER_JUNCTION', -34, 0, 6, 'B_TUNNEL');

    this.connect('LOWER_MID', 'LOWER_TUNNEL_MID_ENTRY');
    this.connect('LOWER_TUNNEL_MID_ENTRY', 'LOWER_TUNNEL_MIDWAY');
    this.connect('LOWER_TUNNEL_MIDWAY', 'LOWER_TUNNEL_UPPER_JUNCTION');

    // 9. Upper B Tunnel
    this.addNode('UPPER_TUNNEL_T_ENTRY', -24, 0, 48, 'B_TUNNEL');
    this.addNode('UPPER_TUNNEL_SOUTH', -36, 0, 36, 'B_TUNNEL');
    this.addNode('UPPER_TUNNEL_NORTH', -36, 0, 16, 'B_TUNNEL');
    this.addNode('UPPER_TUNNEL_EXIT', -38, 0, -2, 'B_TUNNEL');

    this.connect('T_SPAWN_1', 'UPPER_TUNNEL_T_ENTRY');
    this.connect('UPPER_TUNNEL_T_ENTRY', 'UPPER_TUNNEL_SOUTH');
    this.connect('UPPER_TUNNEL_SOUTH', 'UPPER_TUNNEL_NORTH');
    this.connect('UPPER_TUNNEL_NORTH', 'LOWER_TUNNEL_UPPER_JUNCTION');
    this.connect('LOWER_TUNNEL_UPPER_JUNCTION', 'UPPER_TUNNEL_EXIT');

    // 10. B Site Platform & Enclosure
    this.addNode('B_SITE_ENTRY_RAMP', -40, 0, -12, 'B_SITE');
    this.addNode('B_SITE_DEFAULT', -44, 0, -32, 'B_SITE');
    this.addNode('B_SITE_BACK_PLAT', -52, 1.5, -40, 'B_SITE');
    this.addNode('B_SITE_WINDOW', -30, 2.5, -28, 'B_SITE');
    this.addNode('B_SITE_DOORS', -30, 0, -38, 'B_SITE');

    this.connect('UPPER_TUNNEL_EXIT', 'B_SITE_ENTRY_RAMP');
    this.connect('B_SITE_ENTRY_RAMP', 'B_SITE_DEFAULT');
    this.connect('B_SITE_DEFAULT', 'B_SITE_BACK_PLAT');
    this.connect('B_SITE_DEFAULT', 'B_SITE_WINDOW');
    this.connect('B_SITE_DEFAULT', 'B_SITE_DOORS');

    // 11. CT Spawn & CT Connections
    this.addNode('CT_MID', -8, 0, -32, 'CT_MID');
    this.addNode('CT_SPAWN_1', -5, 0, -52, 'CT_SPAWN');
    this.addNode('CT_SPAWN_2', 0, 0, -52, 'CT_SPAWN');
    this.addNode('CT_SPAWN_3', 6, 0, -52, 'CT_SPAWN');
    this.addNode('CT_RAMP_A', 14, 0, -46, 'CT_SPAWN');

    this.connect('MID_DOORS_CT_SIDE', 'CT_MID');
    this.connect('CT_MID', 'B_SITE_DOORS');
    this.connect('CT_MID', 'B_SITE_WINDOW');
    this.connect('CT_MID', 'CT_SPAWN_1');
    this.connect('CT_SPAWN_1', 'CT_SPAWN_2');
    this.connect('CT_SPAWN_2', 'CT_SPAWN_3');
    this.connect('CT_SPAWN_3', 'CT_RAMP_A');
    this.connect('CT_RAMP_A', 'A_SITE_DEFAULT');
  }

  // Find the closest waypoint to any 3D position
  public getClosestWaypoint(pos: THREE.Vector3): Waypoint {
    let closest: Waypoint | null = null;
    let minDist = Infinity;

    for (const wp of this.waypoints.values()) {
      const d = wp.position.distanceTo(pos);
      if (d < minDist) {
        minDist = d;
        closest = wp;
      }
    }

    return closest || this.waypoints.get('T_SPAWN_MAIN')!;
  }

  // Get waypoints by zone
  public getWaypointsByZone(zone: string): Waypoint[] {
    const list: Waypoint[] = [];
    for (const wp of this.waypoints.values()) {
      if (wp.zone === zone) list.push(wp);
    }
    return list;
  }

  // A* Pathfinding between any two positions
  public findPath(startPos: THREE.Vector3, targetPos: THREE.Vector3): THREE.Vector3[] {
    const startNode = this.getClosestWaypoint(startPos);
    const targetNode = this.getClosestWaypoint(targetPos);

    if (startNode.id === targetNode.id) {
      return [targetPos.clone()];
    }

    const openSet = new Set<string>([startNode.id]);
    const cameFrom = new Map<string, string>();

    const gScore = new Map<string, number>();
    gScore.set(startNode.id, 0);

    const fScore = new Map<string, number>();
    fScore.set(startNode.id, startNode.position.distanceTo(targetNode.position));

    while (openSet.size > 0) {
      // Find node in openSet with lowest fScore
      let currentId = '';
      let lowestF = Infinity;
      for (const id of openSet) {
        const score = fScore.get(id) ?? Infinity;
        if (score < lowestF) {
          lowestF = score;
          currentId = id;
        }
      }

      if (currentId === targetNode.id) {
        // Reconstruct path
        const path: THREE.Vector3[] = [targetPos.clone()];
        let curr = currentId;
        while (cameFrom.has(curr)) {
          const wp = this.waypoints.get(curr)!;
          path.unshift(wp.position.clone());
          curr = cameFrom.get(curr)!;
        }
        return path;
      }

      openSet.delete(currentId);
      const currentNode = this.waypoints.get(currentId)!;
      const currentG = gScore.get(currentId) ?? Infinity;

      for (const neighborId of currentNode.connectedIds) {
        const neighbor = this.waypoints.get(neighborId);
        if (!neighbor) continue;

        const dist = currentNode.position.distanceTo(neighbor.position);
        const tentativeG = currentG + dist;

        if (tentativeG < (gScore.get(neighborId) ?? Infinity)) {
          cameFrom.set(neighborId, currentId);
          gScore.set(neighborId, tentativeG);
          const h = neighbor.position.distanceTo(targetNode.position);
          fScore.set(neighborId, tentativeG + h);
          openSet.add(neighborId);
        }
      }
    }

    // Fallback: direct vector to target
    return [targetPos.clone()];
  }
}
