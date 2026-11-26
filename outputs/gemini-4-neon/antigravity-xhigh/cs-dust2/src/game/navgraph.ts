import { Vec3 } from './types';

export interface NavNode {
  id: string;
  x: number;
  y: number;
  z: number;
  zone: 'T_SPAWN' | 'CT_SPAWN' | 'MID' | 'CAT' | 'A_LONG' | 'A_SITE' | 'B_TUN' | 'B_SITE';
  neighbors: string[];
}

interface RawNode {
  id: string;
  x: number;
  y: number;
  z: number;
  zone: NavNode['zone'];
}

const RAW_NODES: RawNode[] = [
  // T Spawn (y = 2.0)
  { id: 't_spawn_mid', x: 0, y: 2.0, z: 44, zone: 'T_SPAWN' },
  { id: 't_spawn_east', x: 14, y: 2.0, z: 42, zone: 'T_SPAWN' },
  { id: 't_spawn_west', x: -13, y: 2.0, z: 42, zone: 'T_SPAWN' },

  // Suicide -> Top Mid -> Mid -> Mid Doors -> CT Mid
  { id: 'suicide_top', x: 0, y: 2.0, z: 36.5, zone: 'T_SPAWN' },
  { id: 'suicide_bot', x: 0, y: 0, z: 27, zone: 'MID' },
  { id: 'top_mid', x: 0.5, y: 0, z: 20, zone: 'MID' },
  { id: 'top_mid_east', x: 10, y: 0, z: 29.5, zone: 'MID' },
  { id: 'mid_center', x: 1.0, y: 0, z: 9, zone: 'MID' },
  { id: 'mid_lower', x: -2.5, y: 0, z: 2, zone: 'MID' },
  { id: 'mid_xbox', x: -1.0, y: 0, z: -5, zone: 'MID' },
  { id: 'mid_doors_s', x: 0, y: 0, z: -9.5, zone: 'MID' },
  { id: 'mid_doors_n', x: 0, y: 0, z: -15.5, zone: 'MID' },
  { id: 'ct_mid', x: -1.5, y: 0, z: -21, zone: 'MID' },
  { id: 'ct_mid_w', x: -10.5, y: 0, z: -20, zone: 'MID' },
  { id: 'ct_mid_nw', x: -10.0, y: 0, z: -31, zone: 'MID' },

  // Catwalk / Short A (y = 2.4)
  { id: 'cat_stairs_bot', x: 6.5, y: 0, z: 9, zone: 'CAT' },
  { id: 'cat_stairs_top', x: 15.8, y: 2.4, z: 9, zone: 'CAT' },
  { id: 'cat_south', x: 16.5, y: 2.4, z: 1, zone: 'CAT' },
  { id: 'cat_mid', x: 15.5, y: 2.4, z: -9, zone: 'CAT' },
  { id: 'cat_north', x: 15.5, y: 2.4, z: -17, zone: 'CAT' },
  { id: 'cat_short', x: 18.0, y: 2.4, z: -23, zone: 'CAT' },

  // CT Spawn & CT Ramp
  { id: 'ct_spawn_w', x: 2.0, y: 0, z: -29, zone: 'CT_SPAWN' },
  { id: 'ct_spawn_mid', x: 7.5, y: 0, z: -32, zone: 'CT_SPAWN' },
  { id: 'ct_ramp_bot', x: 13.0, y: 0, z: -33.5, zone: 'CT_SPAWN' },

  // Outside Long -> Long Doors -> A Long -> A Ramp
  { id: 't_east_ramp_top', x: 17.5, y: 2.0, z: 42, zone: 'A_LONG' },
  { id: 't_east_ramp_bot', x: 25.5, y: 0, z: 42, zone: 'A_LONG' },
  { id: 'outside_long', x: 27, y: 0, z: 38.5, zone: 'A_LONG' },
  { id: 'long_doors_in', x: 27, y: 0, z: 34, zone: 'A_LONG' },
  { id: 'long_doors_room', x: 27, y: 0, z: 29.75, zone: 'A_LONG' },
  { id: 'long_mid_conn', x: 18, y: 0, z: 29.75, zone: 'A_LONG' },
  { id: 'long_doors_out', x: 34, y: 0, z: 29.75, zone: 'A_LONG' },
  { id: 'a_long_south', x: 37.5, y: 0, z: 26, zone: 'A_LONG' },
  { id: 'a_long_corner', x: 38.5, y: 0, z: 16, zone: 'A_LONG' },
  { id: 'a_long_mid', x: 38, y: 0, z: 5, zone: 'A_LONG' },
  { id: 'a_long_north', x: 37.2, y: 0, z: -5, zone: 'A_LONG' },
  { id: 'a_ramp_bot', x: 35.5, y: 0, z: -10, zone: 'A_LONG' },
  { id: 'a_ramp_top', x: 34.0, y: 2.8, z: -21.5, zone: 'A_SITE' },

  // A Site (y = 2.8)
  { id: 'a_site_plant', x: 31.5, y: 2.8, z: -25.5, zone: 'A_SITE' },
  { id: 'a_site_mid', x: 25.8, y: 2.8, z: -27.2, zone: 'A_SITE' },
  { id: 'a_site_short', x: 23.5, y: 2.8, z: -23.0, zone: 'A_SITE' },
  { id: 'a_site_ct', x: 23.8, y: 2.8, z: -33.5, zone: 'A_SITE' },
  { id: 'a_site_back', x: 27.5, y: 2.8, z: -34.5, zone: 'A_SITE' },
  { id: 'a_site_goose', x: 35.5, y: 2.8, z: -34.5, zone: 'A_SITE' },

  // Outside B -> B Tunnels (Upper & Lower)
  { id: 't_west_ramp_top', x: -16.5, y: 2.0, z: 42, zone: 'B_TUN' },
  { id: 't_west_ramp_bot', x: -25.5, y: 0, z: 42, zone: 'B_TUN' },
  { id: 'outside_b', x: -30.5, y: 0, z: 34.5, zone: 'B_TUN' },
  { id: 'b_tun_entry', x: -30.5, y: 0, z: 25.5, zone: 'B_TUN' },
  { id: 'b_tun_upper_w', x: -34.5, y: 0, z: 14, zone: 'B_TUN' },
  { id: 'b_tun_upper_e', x: -26.0, y: 0, z: 14, zone: 'B_TUN' },
  { id: 'b_tun_junction', x: -29.5, y: 0, z: 3.5, zone: 'B_TUN' },
  { id: 'b_tun_lower_w', x: -20.0, y: 0, z: 2.0, zone: 'B_TUN' },
  { id: 'b_tun_lower_e', x: -8.5, y: 0, z: 2.0, zone: 'B_TUN' },
  { id: 'b_tun_exit', x: -30.0, y: 0, z: -9.0, zone: 'B_TUN' },

  // B Site (y = 0.0 / 0.9)
  { id: 'b_site_entry', x: -30.0, y: 0, z: -15.5, zone: 'B_SITE' },
  { id: 'b_site_south', x: -27.5, y: 0, z: -20.0, zone: 'B_SITE' },
  { id: 'b_site_west', x: -35.5, y: 0, z: -21.0, zone: 'B_SITE' },
  { id: 'b_site_east_lane', x: -23.8, y: 0, z: -25.0, zone: 'B_SITE' },
  { id: 'b_site_doors', x: -20.0, y: 0, z: -20.0, zone: 'B_SITE' },
  { id: 'b_doors_gap', x: -15.6, y: 0, z: -20.0, zone: 'B_SITE' },
  { id: 'b_site_plant', x: -26.5, y: 0, z: -29.5, zone: 'B_SITE' },
  { id: 'b_site_window', x: -20.5, y: 0, z: -31.0, zone: 'B_SITE' },
  { id: 'b_window_gap', x: -15.6, y: 0.85, z: -31.0, zone: 'B_SITE' },
  { id: 'b_site_plat', x: -36.5, y: 0.9, z: -29.5, zone: 'B_SITE' },
];

const EDGES: [string, string][] = [
  // T Spawn links
  ['t_spawn_mid', 'suicide_top'],
  ['t_spawn_mid', 't_spawn_east'],
  ['t_spawn_mid', 't_spawn_west'],
  ['t_spawn_east', 't_east_ramp_top'],
  ['t_spawn_west', 't_west_ramp_top'],

  // Mid spine
  ['suicide_top', 'suicide_bot'],
  ['suicide_bot', 'top_mid'],
  ['suicide_bot', 'top_mid_east'],
  ['top_mid', 'top_mid_east'],
  ['top_mid', 'mid_center'],
  ['mid_center', 'cat_stairs_bot'],
  ['mid_center', 'mid_lower'],
  ['mid_lower', 'mid_xbox'],
  ['mid_xbox', 'mid_doors_s'],
  ['mid_doors_s', 'mid_doors_n'],
  ['mid_doors_n', 'ct_mid'],
  ['ct_mid', 'ct_mid_w'],
  ['ct_mid', 'ct_spawn_w'],
  ['ct_mid_w', 'ct_mid_nw'],
  ['ct_mid_nw', 'ct_spawn_w'],

  // Catwalk / Short A
  ['cat_stairs_bot', 'cat_stairs_top'],
  ['cat_stairs_top', 'cat_south'],
  ['cat_south', 'cat_mid'],
  ['cat_mid', 'cat_north'],
  ['cat_north', 'cat_short'],
  ['cat_short', 'a_site_short'],

  // CT Spawn -> CT Ramp -> A Site
  ['ct_spawn_w', 'ct_spawn_mid'],
  ['ct_spawn_mid', 'ct_ramp_bot'],
  ['ct_ramp_bot', 'a_site_ct'],

  // A Long route
  ['t_east_ramp_top', 't_east_ramp_bot'],
  ['t_east_ramp_bot', 'outside_long'],
  ['outside_long', 'long_doors_in'],
  ['long_doors_in', 'long_doors_room'],
  ['top_mid_east', 'long_mid_conn'],
  ['long_mid_conn', 'long_doors_room'],
  ['long_doors_room', 'long_doors_out'],
  ['long_doors_out', 'a_long_south'],
  ['a_long_south', 'a_long_corner'],
  ['a_long_corner', 'a_long_mid'],
  ['a_long_mid', 'a_long_north'],
  ['a_long_north', 'a_ramp_bot'],
  ['a_ramp_bot', 'a_ramp_top'],

  // A Site internal mesh
  ['a_ramp_top', 'a_site_plant'],
  ['a_ramp_top', 'a_site_goose'],
  ['a_site_plant', 'a_site_mid'],
  ['a_site_mid', 'a_site_short'],
  ['a_site_mid', 'a_site_back'],
  ['a_site_mid', 'a_site_ct'],
  ['a_site_plant', 'a_site_goose'],
  ['a_site_short', 'a_site_ct'],
  ['a_site_ct', 'a_site_back'],
  ['a_site_back', 'a_site_goose'],

  // B Tunnels (Upper + Lower)
  ['t_west_ramp_top', 't_west_ramp_bot'],
  ['t_west_ramp_bot', 'outside_b'],
  ['outside_b', 'b_tun_entry'],
  ['b_tun_entry', 'b_tun_upper_w'],
  ['b_tun_entry', 'b_tun_upper_e'],
  ['b_tun_upper_w', 'b_tun_junction'],
  ['b_tun_upper_e', 'b_tun_junction'],
  ['b_tun_junction', 'b_tun_lower_w'],
  ['b_tun_lower_w', 'b_tun_lower_e'],
  ['b_tun_lower_e', 'mid_lower'],
  ['b_tun_junction', 'b_tun_exit'],
  ['b_tun_exit', 'b_site_entry'],

  // B Site internal & CT Mid connections (B Doors + B Window)
  ['b_site_entry', 'b_site_south'],
  ['b_site_entry', 'b_site_west'],
  ['b_site_south', 'b_site_doors'],
  ['b_site_south', 'b_site_west'],
  ['b_site_south', 'b_site_east_lane'],
  ['b_site_doors', 'b_site_east_lane'],
  ['b_site_east_lane', 'b_site_plant'],
  ['b_site_east_lane', 'b_site_window'],
  ['b_site_doors', 'b_doors_gap'],
  ['b_doors_gap', 'ct_mid_w'],
  ['b_site_doors', 'b_site_window'],
  ['b_site_plant', 'b_site_window'],
  ['b_site_plant', 'b_site_plat'],
  ['b_site_window', 'b_window_gap'],
  ['b_window_gap', 'ct_mid_nw'],
];

export class Dust2NavGraph {
  public readonly nodes = new Map<string, NavNode>();
  public readonly nodeList: NavNode[] = [];

  constructor() {
    for (const rn of RAW_NODES) {
      const node: NavNode = { ...rn, neighbors: [] };
      this.nodes.set(node.id, node);
      this.nodeList.push(node);
    }
    for (const [a, b] of EDGES) {
      const na = this.nodes.get(a);
      const nb = this.nodes.get(b);
      if (na && nb) {
        if (!na.neighbors.includes(b)) na.neighbors.push(b);
        if (!nb.neighbors.includes(a)) nb.neighbors.push(a);
      }
    }
  }

  public findNearestNode(pos: Vec3): NavNode {
    let best = this.nodeList[0];
    let bestScore = Infinity;
    for (let i = 0; i < this.nodeList.length; i++) {
      const n = this.nodeList[i];
      const dx = n.x - pos.x;
      const dy = (n.y - pos.y) * 2.6; // Strongly prefer same elevation (e.g. Catwalk vs Mid)
      const dz = n.z - pos.z;
      const d = dx * dx + dy * dy + dz * dz;
      if (d < bestScore) {
        bestScore = d;
        best = n;
      }
    }
    return best;
  }

  public getNode(id: string): NavNode | undefined {
    return this.nodes.get(id);
  }

  /**
   * Standard A* pathfinder across Dust2 navgraph.
   */
  public findPath(fromPos: Vec3, toPos: Vec3): Vec3[] {
    const start = this.findNearestNode(fromPos);
    const goal = this.findNearestNode(toPos);
    if (start.id === goal.id) {
      return [{ x: toPos.x, y: toPos.y, z: toPos.z }];
    }

    const open = new Set<string>([start.id]);
    const cameFrom = new Map<string, string>();
    const gScore = new Map<string, number>([[start.id, 0]]);
    const fScore = new Map<string, number>([[start.id, this.dist(start, goal)]]);

    while (open.size > 0) {
      let currentId = '';
      let lowestF = Infinity;
      for (const id of open) {
        const f = fScore.get(id) ?? Infinity;
        if (f < lowestF) {
          lowestF = f;
          currentId = id;
        }
      }

      if (currentId === goal.id) {
        const path: Vec3[] = [];
        let cur: string | undefined = currentId;
        while (cur) {
          const n = this.nodes.get(cur)!;
          path.push({ x: n.x, y: n.y, z: n.z });
          cur = cameFrom.get(cur);
        }
        path.reverse();
        path.push({ x: toPos.x, y: toPos.y, z: toPos.z });
        return path;
      }

      open.delete(currentId);
      const current = this.nodes.get(currentId)!;
      const curG = gScore.get(currentId) ?? Infinity;

      for (const nbId of current.neighbors) {
        const nb = this.nodes.get(nbId)!;
        const tentativeG = curG + this.dist(current, nb);
        if (tentativeG < (gScore.get(nbId) ?? Infinity)) {
          cameFrom.set(nbId, currentId);
          gScore.set(nbId, tentativeG);
          fScore.set(nbId, tentativeG + this.dist(nb, goal));
          open.add(nbId);
        }
      }
    }

    return [{ x: toPos.x, y: toPos.y, z: toPos.z }];
  }

  private dist(a: { x: number; y: number; z: number }, b: { x: number; y: number; z: number }): number {
    return Math.hypot(a.x - b.x, (a.y - b.y) * 1.4, a.z - b.z);
  }
}
