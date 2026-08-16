// ============================================================================
// 导航网格 + A* —— 纯 TS，基于地图高度场与碰撞体自建，无外部寻路库
// ============================================================================
import { MAP, groundHeightAt } from './map/dust2';
import type { NavNode } from './types';

const SPACING = 1.5;
const CLEAR = 0.55;         // 节点离墙/箱的最小距离（点到矩形精确距离）
const MAX_EDGE_STEP = 1.0;  // 边上两端高度差上限（坡道连续，只挡台阶/悬崖）

/** 点到 AABB 在 XZ 平面的精确距离（不含 y 判断） */
function distToBox2D(x: number, z: number, b: { minX: number; maxX: number; minZ: number; maxZ: number }): number {
  const dx = Math.max(b.minX - x, 0, x - b.maxX);
  const dz = Math.max(b.minZ - z, 0, z - b.maxZ);
  return Math.hypot(dx, dz);
}

function clearanceOk(x: number, z: number, h: number): boolean {
  for (const b of MAP.colliders) {
    if (b.minY >= h + 1.8 || b.maxY <= h + 0.1) continue;
    if (distToBox2D(x, z, b) < CLEAR) return false;
  }
  return true;
}

export class NavMesh {
  nodes: NavNode[] = [];
  private byCell = new Map<number, number>();

  constructor() {
    const b = MAP.bounds;
    const cols = Math.ceil(b.w / SPACING);
    const rows = Math.ceil(b.d / SPACING);
    let idx = 0;
    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= cols; c++) {
        const x = b.x + c * SPACING;
        const z = b.z + r * SPACING;
        const h = groundHeightAt(x, z);
        if (h <= -1e8) continue;
        if (!clearanceOk(x, z, h)) continue;
        const node: NavNode = { x, z, h, idx, edges: [] };
        this.nodes.push(node);
        this.byCell.set(r * (cols + 1) + c, idx);
        idx++;
      }
    }
    // 建边
    const dirs = [
      [1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1],
    ];
    for (let i = 0; i < this.nodes.length; i++) {
      const a = this.nodes[i];
      const ac = Math.round((a.x - b.x) / SPACING);
      const ar = Math.round((a.z - b.z) / SPACING);
      for (const [dc, dr] of dirs) {
        const key = (ar + dr) * (Math.ceil(b.w / SPACING) + 1) + (ac + dc);
        const j = this.byCell.get(key);
        if (j === undefined) continue;
        const n = this.nodes[j];
        if (Math.abs(n.h - a.h) > MAX_EDGE_STEP) continue;
        if (!this.edgeClear(a, n)) continue;
        a.edges.push(j);
      }
    }
  }

  /** 两点之间（2D）是否可直线通过：无碰撞体、高度连续 */
  edgeClear(a: NavNode, b: NavNode): boolean {
    const dx = b.x - a.x, dz = b.z - a.z;
    const len = Math.hypot(dx, dz);
    if (len < 1e-6) return false;
    const steps = Math.max(1, Math.ceil(len / 0.75));
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const x = a.x + dx * t, z = a.z + dz * t;
      const gh = groundHeightAt(x, z);
      if (gh <= -1e8) return false;
      const lerpH = a.h + (b.h - a.h) * t;
      if (Math.abs(gh - lerpH) > 0.65) return false;
      if (!clearanceOk(x, z, gh)) return false;
    }
    return true;
  }

  nearest(x: number, z: number): NavNode {
    let best = this.nodes[0];
    let bestD = Infinity;
    for (const n of this.nodes) {
      const d = (n.x - x) * (n.x - x) + (n.z - z) * (n.z - z) + (n.h - groundHeightAt(x, z)) * (n.h - groundHeightAt(x, z));
      if (d < bestD) { bestD = d; best = n; }
    }
    return best;
  }

  /** A*：返回节点下标序列（含起点/终点最近节点） */
  astar(from: NavNode, to: NavNode): NavNode[] | null {
    if (from === to) return [from];
    const N = this.nodes.length;
    const g = new Float64Array(N).fill(Infinity);
    const f = new Float64Array(N).fill(Infinity);
    const came = new Int32Array(N).fill(-1);
    const closed = new Uint8Array(N);
    const open = new SimpleHeap();
    g[from.idx] = 0;
    f[from.idx] = this.h(from, to);
    open.push(from.idx, f[from.idx]);
    let guard = 0;
    while (open.size > 0 && guard++ < N * 4) {
      const cur = open.pop();
      if (cur === to.idx) {
        const path: NavNode[] = [];
        let c = cur;
        while (c !== -1) { path.push(this.nodes[c]); c = came[c]; }
        return path.reverse();
      }
      if (closed[cur]) continue;
      closed[cur] = 1;
      const node = this.nodes[cur];
      for (const j of node.edges) {
        if (closed[j]) continue;
        const nb = this.nodes[j];
        const cost = Math.hypot(nb.x - node.x, nb.z - node.z) + Math.abs(nb.h - node.h) * 1.5;
        const ng = g[cur] + cost;
        if (ng < g[j]) {
          g[j] = ng;
          f[j] = ng + this.h(nb, to);
          came[j] = cur;
          open.push(j, f[j]);
        }
      }
    }
    return null;
  }

  private h(a: NavNode, b: NavNode): number {
    return Math.hypot(a.x - b.x, a.z - b.z) + Math.abs(a.h - b.h) * 1.5;
  }

  /** 对外：寻路返回世界坐标路径（含终点） */
  findPath(x0: number, z0: number, x1: number, z1: number): [number, number][] | null {
    const a = this.nearest(x0, z0);
    const b = this.nearest(x1, z1);
    const res = this.astar(a, b);
    if (!res) return null;
    // 轻量平滑：能直连就跳过中间点
    const path: NavNode[] = [res[0]];
    for (let i = 1; i < res.length; i++) {
      while (path.length >= 2 && this.edgeClear(path[path.length - 2], res[i])) {
        path.pop();
      }
      path.push(res[i]);
    }
    return path.map((n) => [n.x, n.z]);
  }

  findPathToArea(x0: number, z0: number, area: string): [number, number][] | null {
    const pts = MAP.waypoints[area];
    if (!pts) return null;
    let best: [number, number][] | null = null;
    let bestLen = Infinity;
    for (const [px, pz] of pts) {
      const p = this.findPath(x0, z0, px, pz);
      if (p && p.length < bestLen) { bestLen = p.length; best = p; }
    }
    return best;
  }
}

class SimpleHeap {
  private ids: number[] = [];
  private keys: number[] = [];
  get size() { return this.ids.length; }
  push(id: number, key: number) {
    this.ids.push(id); this.keys.push(key);
    let i = this.ids.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.keys[p] <= this.keys[i]) break;
      [this.ids[p], this.ids[i]] = [this.ids[i], this.ids[p]];
      [this.keys[p], this.keys[i]] = [this.keys[i], this.keys[p]];
      i = p;
    }
  }
  pop(): number {
    const top = this.ids[0];
    const lastId = this.ids.pop()!;
    const lastKey = this.keys.pop()!;
    if (this.ids.length > 0) {
      this.ids[0] = lastId; this.keys[0] = lastKey;
      let i = 0;
      const n = this.ids.length;
      for (;;) {
        const l = 2 * i + 1, r = 2 * i + 2;
        let m = i;
        if (l < n && this.keys[l] < this.keys[m]) m = l;
        if (r < n && this.keys[r] < this.keys[m]) m = r;
        if (m === i) break;
        [this.ids[i], this.ids[m]] = [this.ids[m], this.ids[i]];
        [this.keys[i], this.keys[m]] = [this.keys[m], this.keys[i]];
        i = m;
      }
    }
    return top;
  }
}
