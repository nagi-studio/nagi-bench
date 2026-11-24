export interface NavNode {
  id: string;
  x: number;
  y: number;
  z: number;
  neighbors: string[];
  tags?: string[];
}

export class NavGraph {
  private nodes = new Map<string, NavNode>();

  constructor() {
    this.buildDust2Graph();
  }

  private addNode(id: string, x: number, y: number, z: number, tags?: string[]): void {
    this.nodes.set(id, { id, x, y, z, neighbors: [], tags });
  }

  private connect(a: string, b: string): void {
    const na = this.nodes.get(a);
    const nb = this.nodes.get(b);
    if (!na || !nb) return;
    if (!na.neighbors.includes(b)) na.neighbors.push(b);
    if (!nb.neighbors.includes(a)) nb.neighbors.push(a);
  }

  private buildDust2Graph(): void {
    // --- T SPAWN ---
    this.addNode('t_spawn_c', 0, 3.0, 41, ['t_spawn']);
    this.addNode('t_spawn_e', 18, 3.0, 39, ['t_spawn']);
    this.addNode('t_spawn_w', -18, 3.0, 39, ['t_spawn']);

    // --- OUTSIDE LONG -> LONG DOORS -> A LONG -> A SITE ---
    this.addNode('out_long_s', 34, 3.0, 36);
    this.addNode('out_long_n', 35, 3.0, 26);
    this.addNode('long_doors_in', 36, 2.2, 18);
    this.addNode('long_doors_exit', 38.5, 1.5, 11.5);
    this.addNode('a_long_s', 38, 1.5, 5);
    this.addNode('a_long_m', 37, 1.5, -5);
    this.addNode('a_long_n', 38, 1.5, -15, ['ct_hold_a']);
    this.addNode('a_ramp', 38, 2.5, -22);
    this.addNode('a_site_s', 38, 3.4, -30, ['a_site']);
    this.addNode('a_site_plant', 40.5, 3.4, -34.5, ['a_site', 'plant_a']);
    this.addNode('a_site_goose', 43, 3.4, -42, ['a_site', 'ct_hold_a']);
    this.addNode('a_site_nw', 32.5, 3.4, -40, ['a_site', 'ct_hold_a']);

    // --- TOP MID / SUICIDE / CONNECTOR ---
    this.addNode('suicide', 1, 2.3, 28);
    this.addNode('top_mid', 2, 1.6, 17);
    this.addNode('top_mid_e', 9, 1.6, 18);
    this.addNode('mid_long_conn', 18, 2.4, 22);

    // --- MID -> MID DOORS -> CT MID -> CT SPAWN ---
    this.addNode('mid_ramp', -2, 0.8, 5);
    this.addNode('mid_lower', -2, 0.0, -5, ['mid']);
    this.addNode('mid_lower_n', -2.8, 0.0, -15, ['mid']);
    this.addNode('mid_doors', -2.8, 0.0, -20, ['mid_doors']);
    this.addNode('ct_mid_s', -2.8, 0.0, -25, ['ct_mid', 'ct_hold_mid']);
    this.addNode('ct_mid_c', -7, 0.0, -30, ['ct_mid']);
    this.addNode('ct_mid_w', -16, 0.0, -28, ['ct_mid', 'ct_hold_b']);
    this.addNode('ct_mid_nw', -16, 0.0, -37.5, ['ct_mid']);
    this.addNode('ct_spawn_w', 6, 0.0, -37, ['ct_spawn']);
    this.addNode('ct_spawn_e', 15, 0.0, -38, ['ct_spawn']);
    this.addNode('ct_ramp_mid', 24, 1.7, -39);

    // --- CATWALK / A SHORT ---
    this.addNode('short_stairs_bot', 9, 1.8, 7);
    this.addNode('short_stairs_top', 9, 3.0, -6);
    this.addNode('cat_mid', 9, 3.0, -16, ['catwalk', 'ct_hold_mid']);
    this.addNode('cat_corner', 9, 3.0, -28, ['catwalk']);
    this.addNode('cat_bridge', 18, 3.0, -28.5, ['catwalk', 'ct_hold_a']);
    this.addNode('short_a_top', 29, 3.4, -29, ['catwalk']);

    // --- B TUNNELS (OUTSIDE, UPPER, LOWER) ---
    this.addNode('out_b', -32, 2.4, 35);
    this.addNode('b_tun_entry', -39, 1.8, 30);
    this.addNode('b_tun_s', -39, 1.8, 17);
    this.addNode('b_tun_m', -39, 1.8, 5);
    this.addNode('b_tun_n', -36, 1.8, -4, ['b_tunnels']);
    this.addNode('b_tun_exit', -36, 1.1, -12);
    // Lower Tunnels connecting Upper B Tunnels to Lower Mid
    this.addNode('b_lower_w', -24, 1.6, -4);
    this.addNode('b_lower_e', -11, 0.1, -4);

    // --- B SITE ---
    this.addNode('b_site_s', -36, 0.5, -19, ['b_site']);
    this.addNode('b_site_w', -37.2, 0.5, -28.0, ['b_site']);
    this.addNode('b_site_plant', -33.8, 0.5, -35.5, ['b_site', 'plant_b']);
    this.addNode('b_site_e', -28.5, 0.5, -28.0, ['b_site', 'ct_hold_b']);
    this.addNode('b_site_ne', -28.5, 0.5, -37.5, ['b_site', 'ct_hold_b']);
    this.addNode('b_site_back', -42.5, 1.2, -40.5, ['b_site', 'ct_hold_b']);
    this.addNode('b_doors', -21.5, 0.25, -28.0);
    this.addNode('b_window', -21.5, 0.25, -37.5);

    // =========================================================================
    // EDGES (Every edge crosses verified walkable, unobstructed space)
    // =========================================================================

    // T Spawn internal
    this.connect('t_spawn_c', 't_spawn_e');
    this.connect('t_spawn_c', 't_spawn_w');
    this.connect('t_spawn_c', 'suicide');

    // Outside Long -> A Long -> A Site
    this.connect('t_spawn_e', 'out_long_s');
    this.connect('out_long_s', 'out_long_n');
    this.connect('out_long_n', 'mid_long_conn');
    this.connect('mid_long_conn', 'top_mid_e');
    this.connect('out_long_n', 'long_doors_in');
    this.connect('long_doors_in', 'long_doors_exit');
    this.connect('long_doors_exit', 'a_long_s');
    this.connect('a_long_s', 'a_long_m');
    this.connect('a_long_m', 'a_long_n');
    this.connect('a_long_n', 'a_ramp');
    this.connect('a_ramp', 'a_site_s');
    this.connect('a_site_s', 'a_site_plant');
    this.connect('a_site_plant', 'a_site_goose');
    this.connect('a_site_plant', 'a_site_nw');
    this.connect('a_site_s', 'a_site_nw');
    this.connect('a_site_goose', 'a_site_nw');

    // Top Mid -> Mid -> Mid Doors -> CT Mid -> CT Spawn -> CT Ramp -> A Site
    this.connect('suicide', 'top_mid');
    this.connect('top_mid', 'top_mid_e');
    this.connect('top_mid', 'mid_ramp');
    this.connect('mid_ramp', 'mid_lower');
    this.connect('mid_lower', 'mid_lower_n');
    this.connect('mid_lower_n', 'mid_doors');
    this.connect('mid_doors', 'ct_mid_s');
    this.connect('ct_mid_s', 'ct_mid_c');
    this.connect('ct_mid_c', 'ct_mid_w');
    this.connect('ct_mid_c', 'ct_mid_nw');
    this.connect('ct_mid_w', 'ct_mid_nw');
    this.connect('ct_mid_s', 'ct_spawn_w');
    this.connect('ct_mid_c', 'ct_spawn_w');
    this.connect('ct_spawn_w', 'ct_spawn_e');
    this.connect('ct_spawn_e', 'ct_ramp_mid');
    this.connect('ct_ramp_mid', 'a_site_nw');

    // Catwalk / A Short
    this.connect('top_mid_e', 'short_stairs_bot');
    this.connect('top_mid', 'short_stairs_bot');
    this.connect('short_stairs_bot', 'short_stairs_top');
    this.connect('short_stairs_top', 'cat_mid');
    this.connect('cat_mid', 'cat_corner');
    this.connect('cat_corner', 'cat_bridge');
    this.connect('cat_bridge', 'short_a_top');
    this.connect('short_a_top', 'a_site_s');
    this.connect('short_a_top', 'a_site_nw');

    // Upper & Lower B Tunnels
    this.connect('t_spawn_w', 'out_b');
    this.connect('out_b', 'b_tun_entry');
    this.connect('b_tun_entry', 'b_tun_s');
    this.connect('b_tun_s', 'b_tun_m');
    this.connect('b_tun_m', 'b_tun_n');
    this.connect('b_tun_n', 'b_tun_exit');
    this.connect('b_tun_n', 'b_lower_w');
    this.connect('b_lower_w', 'b_lower_e');
    this.connect('b_lower_e', 'mid_lower');

    // B Site <-> CT Mid via B Doors & B Window (clean paths around Double Stack & Big Box)
    this.connect('b_tun_exit', 'b_site_s');
    this.connect('b_site_s', 'b_site_e');
    this.connect('b_site_s', 'b_site_w');
    this.connect('b_site_w', 'b_site_plant');
    this.connect('b_site_e', 'b_site_plant');
    this.connect('b_site_plant', 'b_site_ne');
    this.connect('b_site_plant', 'b_site_back');
    this.connect('b_site_e', 'b_site_ne');
    this.connect('b_site_e', 'b_doors');
    this.connect('b_doors', 'ct_mid_w');
    this.connect('b_site_ne', 'b_window');
    this.connect('b_window', 'ct_mid_nw');
  }

  public getNode(id: string): NavNode | undefined {
    return this.nodes.get(id);
  }

  public getNodesByTag(tag: string): NavNode[] {
    const out: NavNode[] = [];
    for (const n of this.nodes.values()) {
      if (n.tags?.includes(tag)) out.push(n);
    }
    return out;
  }

  public findNearestNode(x: number, y: number, z: number): NavNode {
    let best: NavNode | null = null;
    let bestScore = Infinity;
    for (const n of this.nodes.values()) {
      const dx = n.x - x;
      const dy = (n.y - y) * 2.5; // Penalize wrong floor level (e.g. Catwalk vs CT Spawn)
      const dz = n.z - z;
      const d = dx * dx + dy * dy + dz * dz;
      if (d < bestScore) {
        bestScore = d;
        best = n;
      }
    }
    return best!;
  }

  public findPath(
    startPos: { x: number; y: number; z: number },
    goalPos: { x: number; y: number; z: number }
  ): Array<{ x: number; y: number; z: number }> {
    const startNode = this.findNearestNode(startPos.x, startPos.y, startPos.z);
    const goalNode = this.findNearestNode(goalPos.x, goalPos.y, goalPos.z);

    if (startNode.id === goalNode.id) {
      return [{ x: goalPos.x, y: goalPos.y, z: goalPos.z }];
    }

    const open = new Set<string>([startNode.id]);
    const cameFrom = new Map<string, string>();
    const gScore = new Map<string, number>([[startNode.id, 0]]);
    const fScore = new Map<string, number>([
      [startNode.id, this.dist(startNode, goalNode)],
    ]);

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

      if (currentId === goalNode.id) {
        const nodePath: Array<{ x: number; y: number; z: number }> = [];
        let cur: string | undefined = currentId;
        while (cur) {
          const n = this.nodes.get(cur)!;
          nodePath.push({ x: n.x, y: n.y, z: n.z });
          cur = cameFrom.get(cur);
        }
        nodePath.reverse();
        // Append exact goal point at the end
        nodePath.push({ x: goalPos.x, y: goalPos.y, z: goalPos.z });
        return nodePath;
      }

      open.delete(currentId);
      const current = this.nodes.get(currentId)!;

      for (const neighborId of current.neighbors) {
        const neighbor = this.nodes.get(neighborId)!;
        const tentativeG = (gScore.get(currentId) ?? Infinity) + this.dist(current, neighbor);
        if (tentativeG < (gScore.get(neighborId) ?? Infinity)) {
          cameFrom.set(neighborId, currentId);
          gScore.set(neighborId, tentativeG);
          fScore.set(neighborId, tentativeG + this.dist(neighbor, goalNode));
          open.add(neighborId);
        }
      }
    }

    return [{ x: goalPos.x, y: goalPos.y, z: goalPos.z }];
  }

  private dist(a: { x: number; y: number; z: number }, b: { x: number; y: number; z: number }): number {
    return Math.hypot(a.x - b.x, (a.y - b.y) * 1.4, a.z - b.z);
  }
}
