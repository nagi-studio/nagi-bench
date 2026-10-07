import * as THREE from 'three';

export interface NavNode {
  id: string;
  position: THREE.Vector3;
  zone: string;
  neighbors: string[];
}

export class WaypointGraph {
  public nodes: Map<string, NavNode> = new Map();

  constructor() {
    this.buildGraph();
  }

  private addNode(id: string, x: number, y: number, z: number, zone: string, neighbors: string[]) {
    this.nodes.set(id, {
      id,
      position: new THREE.Vector3(x, y, z),
      zone,
      neighbors,
    });
  }

  private buildGraph() {
    // 1. T SPAWN
    this.addNode('t_spawn_center', 0, 0, 75, 'T Spawn', ['t_spawn_east', 't_spawn_west', 't_top_mid']);
    this.addNode('t_spawn_east', 15, 0, 72, 'T Spawn', ['t_spawn_center', 'long_doors_outside']);
    this.addNode('t_spawn_west', -15, 0, 72, 'T Spawn', ['t_spawn_center', 't_roof_stairs']);
    this.addNode('t_top_mid', 0, 0, 52, 'Top Mid', ['t_spawn_center', 'mid_top']);

    // 2. LONG A PATHWAY
    this.addNode('long_doors_outside', 35, 0, 62, 'Long Outside', ['t_spawn_east', 'long_doors_inside']);
    this.addNode('long_doors_inside', 38, 0, 52, 'Long Doors', ['long_doors_outside', 'long_doors_exit']);
    this.addNode('long_doors_exit', 44, 0, 42, 'Long Corner', ['long_doors_inside', 'long_pit', 'long_corner']);
    this.addNode('long_pit', 54, 0, 32, 'Long Pit', ['long_doors_exit', 'long_corner']);
    this.addNode('long_corner', 46, 0, 30, 'Long Corner', ['long_doors_exit', 'long_pit', 'long_car']);
    this.addNode('long_car', 48, 0, 5, 'Long A', ['long_corner', 'long_cross']);
    this.addNode('long_cross', 44, 0, -20, 'Long Cross', ['long_car', 'a_ramp_bottom']);
    this.addNode('a_ramp_bottom', 44, 0, -35, 'A Ramp', ['long_cross', 'a_ramp_top']);
    this.addNode('a_ramp_top', 44, 1.5, -48, 'A Site', ['a_ramp_bottom', 'a_site_default', 'a_site_boxes']);

    // 3. A SITE PLATFORM
    this.addNode('a_site_default', 38, 1.5, -56, 'A Site', ['a_ramp_top', 'a_site_boxes', 'a_site_goose', 'a_short_stairs', 'ct_spawn_ramp_top']);
    this.addNode('a_site_boxes', 46, 1.5, -55, 'A Site', ['a_ramp_top', 'a_site_default', 'a_site_goose']);
    this.addNode('a_site_goose', 32, 1.5, -65, 'Goose', ['a_site_default', 'a_site_boxes']);
    this.addNode('a_short_stairs', 26, 1.8, -48, 'Short A', ['a_site_default', 'short_a_corner']);

    // 4. CT SPAWN & CT RAMP
    this.addNode('ct_spawn_ramp_top', 26, 1.5, -62, 'CT Ramp', ['a_site_default', 'ct_spawn_ramp_bottom']);
    this.addNode('ct_spawn_ramp_bottom', 24, 0, -70, 'CT Ramp', ['ct_spawn_ramp_top', 'ct_spawn_center']);
    this.addNode('ct_spawn_center', 22, 0, -78, 'CT Spawn', ['ct_spawn_ramp_bottom', 'ct_mid_entrance']);
    this.addNode('ct_mid_entrance', 8, 0, -70, 'CT Mid', ['ct_spawn_center', 'ct_mid']);

    // 5. MID & MID DOORS
    this.addNode('mid_top', 0, 0, 36, 'Top Mid', ['t_top_mid', 'mid_suicide']);
    this.addNode('mid_suicide', 0, 0, 16, 'Suicide', ['mid_top', 'mid_lower']);
    this.addNode('mid_lower', 0, 0, -8, 'Lower Mid', ['mid_suicide', 'mid_doors_south', 'catwalk_stairs', 'lower_tunnel_mid']);
    this.addNode('mid_doors_south', 0, 0, -22, 'Mid Doors', ['mid_lower', 'mid_doors_north']);
    this.addNode('mid_doors_north', 0, 0, -34, 'Mid Doors', ['mid_doors_south', 'ct_mid']);
    this.addNode('ct_mid', 0, 0, -50, 'CT Mid', ['mid_doors_north', 'ct_mid_entrance', 'ct_mid_to_b']);
    this.addNode('ct_mid_to_b', -14, 0, -50, 'CT to B', ['ct_mid', 'b_doors_outside', 'b_window_outside']);

    // 6. CATWALK / SHORT A
    this.addNode('catwalk_stairs', 12, 0, -6, 'Catwalk Stairs', ['mid_lower', 'catwalk_entry']);
    this.addNode('catwalk_entry', 18, 2.0, -15, 'Catwalk', ['catwalk_stairs', 'catwalk_straight']);
    this.addNode('catwalk_straight', 18, 2.0, -32, 'Catwalk', ['catwalk_entry', 'short_a_corner']);
    this.addNode('short_a_corner', 22, 1.8, -45, 'Short A', ['catwalk_straight', 'a_short_stairs']);

    // 7. B TUNNELS (Upper & Lower)
    this.addNode('t_roof_stairs', -25, 0, 62, 'T Roof', ['t_spawn_west', 'upper_tunnel_1']);
    this.addNode('upper_tunnel_1', -36, 0, 50, 'Upper Tunnel', ['t_roof_stairs', 'upper_tunnel_2']);
    this.addNode('upper_tunnel_2', -38, 0, 32, 'Upper Tunnel', ['upper_tunnel_1', 'upper_tunnel_3', 'lower_tunnel_stairs']);
    this.addNode('upper_tunnel_3', -45, 0, 16, 'Upper Tunnel', ['upper_tunnel_2', 'upper_tunnel_exit']);
    this.addNode('upper_tunnel_exit', -48, 0, -2, 'Upper Tunnel Exit', ['upper_tunnel_3', 'b_site_entrance']);

    this.addNode('lower_tunnel_stairs', -26, 0, 2, 'Lower Tunnel', ['upper_tunnel_2', 'lower_tunnel_mid']);
    this.addNode('lower_tunnel_mid', -14, 0, -6, 'Lower Tunnel', ['lower_tunnel_stairs', 'mid_lower']);

    // 8. B SITE
    this.addNode('b_site_entrance', -54, 0, -14, 'B Site', ['upper_tunnel_exit', 'b_site_platform', 'b_car']);
    this.addNode('b_site_platform', -62, 0.8, -32, 'B Platform', ['b_site_entrance', 'b_site_default', 'b_doors_inside']);
    this.addNode('b_site_default', -64, 0.8, -40, 'B Site', ['b_site_platform', 'b_doors_inside', 'b_car']);
    this.addNode('b_car', -68, 0, -22, 'B Car', ['b_site_entrance', 'b_site_default']);
    this.addNode('b_doors_inside', -48, 0, -36, 'B Doors', ['b_site_platform', 'b_site_default', 'b_doors_outside', 'b_window_inside']);
    this.addNode('b_doors_outside', -36, 0, -38, 'Outside B Doors', ['b_doors_inside', 'ct_mid_to_b']);
    this.addNode('b_window_inside', -48, 0.8, -24, 'B Window', ['b_doors_inside', 'b_site_platform', 'b_window_outside']);
    this.addNode('b_window_outside', -36, 0, -22, 'Outside B Window', ['b_window_inside', 'ct_mid_to_b']);

    // Ensure all bidirectional neighbor links exist
    this.nodes.forEach((node) => {
      node.neighbors.forEach((neighborId) => {
        const neighbor = this.nodes.get(neighborId);
        if (neighbor && !neighbor.neighbors.includes(node.id)) {
          neighbor.neighbors.push(node.id);
        }
      });
    });
  }

  // Find nearest waypoint node to a given 3D position
  public getNearestNode(pos: THREE.Vector3, zoneFilter?: string): NavNode {
    let nearest: NavNode | null = null;
    let minDistanceSq = Infinity;

    this.nodes.forEach((node) => {
      if (zoneFilter && node.zone !== zoneFilter) return;
      const dSq = node.position.distanceToSquared(pos);
      if (dSq < minDistanceSq) {
        minDistanceSq = dSq;
        nearest = node;
      }
    });

    return nearest || this.nodes.get('mid_lower')!;
  }

  // A* Pathfinding Algorithm
  public findPath(startPos: THREE.Vector3, targetPos: THREE.Vector3): THREE.Vector3[] {
    const startNode = this.getNearestNode(startPos);
    const targetNode = this.getNearestNode(targetPos);

    if (startNode.id === targetNode.id) {
      return [targetPos.clone()];
    }

    interface PriorityItem {
      nodeId: string;
      fScore: number;
    }

    const openSet: PriorityItem[] = [{ nodeId: startNode.id, fScore: 0 }];
    const cameFrom: Map<string, string> = new Map();

    const gScore: Map<string, number> = new Map();
    gScore.set(startNode.id, 0);

    const fScore: Map<string, number> = new Map();
    fScore.set(startNode.id, startNode.position.distanceTo(targetNode.position));

    while (openSet.length > 0) {
      // Find node with lowest fScore
      openSet.sort((a, b) => a.fScore - b.fScore);
      const current = openSet.shift()!;

      if (current.nodeId === targetNode.id) {
        // Reconstruct path
        const path: THREE.Vector3[] = [targetPos.clone()];
        let currId: string | undefined = targetNode.id;

        while (currId && currId !== startNode.id) {
          const node = this.nodes.get(currId);
          if (node) path.unshift(node.position.clone());
          currId = cameFrom.get(currId);
        }

        return path;
      }

      const currNode = this.nodes.get(current.nodeId);
      if (!currNode) continue;

      const currentG = gScore.get(current.nodeId) ?? Infinity;

      for (const neighborId of currNode.neighbors) {
        const neighbor = this.nodes.get(neighborId);
        if (!neighbor) continue;

        const edgeCost = currNode.position.distanceTo(neighbor.position);
        const tentativeG = currentG + edgeCost;

        if (tentativeG < (gScore.get(neighborId) ?? Infinity)) {
          cameFrom.set(neighborId, current.nodeId);
          gScore.set(neighborId, tentativeG);
          const f = tentativeG + neighbor.position.distanceTo(targetNode.position);
          fScore.set(neighborId, f);

          if (!openSet.some((item) => item.nodeId === neighborId)) {
            openSet.push({ nodeId: neighborId, fScore: f });
          }
        }
      }
    }

    // Fallback: direct line to target
    return [targetPos.clone()];
  }
}
