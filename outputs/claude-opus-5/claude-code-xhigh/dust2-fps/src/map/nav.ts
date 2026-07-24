/**
 * 导航网格：从碰撞世界里"烘焙"出一张 XZ 均匀网格，做 A* 寻路。
 *
 * 之所以不用现成寻路库（要求里也不允许），这里自己实现：
 *   1. 逐格采样地面高度 + 站立空间，判定可行走；
 *   2. 8 邻接，允许的高差 <= 台阶高，斜向不允许切角；
 *   3. 贴墙格子加代价，让 AI 走廊道中间而不是蹭着墙走；
 *   4. A* 出来的折线再做一次拉绳平滑（string pulling），路径更自然。
 */

import type { Vec3 } from '../core/math.ts';
import { v3 } from '../core/math.ts';
import type { Rng } from '../core/rng.ts';
import type { CollisionWorld } from './collision.ts';
import { areaAt } from './build.ts';
import { mapBounds } from './dust2.ts';

export const NAV_CELL = 0.75;
/** AI/玩家半径，判定站得下与否。 */
export const AGENT_RADIUS = 0.42;
export const AGENT_HEIGHT = 1.78;
/** 能一步跨上去的高度。 */
export const STEP_HEIGHT = 0.5;
/** 允许直接走下去的最大落差（再高就得跳下去，寻路不走）。 */
export const MAX_DROP = 1.4;

const SQRT2 = Math.SQRT2;

class MinHeap {
  private items: number[] = [];
  private keys: Float32Array;
  private size = 0;

  constructor(capacity: number) {
    this.keys = new Float32Array(capacity);
    this.items = new Array(capacity);
  }

  clear(): void {
    this.size = 0;
  }

  get length(): number {
    return this.size;
  }

  push(item: number, key: number): void {
    let i = this.size++;
    if (i >= this.items.length) {
      // 极端情况下扩容
      const nk = new Float32Array(this.keys.length * 2);
      nk.set(this.keys);
      this.keys = nk;
      this.items.length = this.keys.length;
    }
    this.items[i] = item;
    this.keys[i] = key;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.keys[p] <= this.keys[i]) break;
      this.swap(i, p);
      i = p;
    }
  }

  pop(): number {
    const top = this.items[0];
    this.size--;
    if (this.size > 0) {
      this.items[0] = this.items[this.size];
      this.keys[0] = this.keys[this.size];
      let i = 0;
      for (;;) {
        const l = i * 2 + 1;
        const r = l + 1;
        let m = i;
        if (l < this.size && this.keys[l] < this.keys[m]) m = l;
        if (r < this.size && this.keys[r] < this.keys[m]) m = r;
        if (m === i) break;
        this.swap(i, m);
        i = m;
      }
    }
    return top;
  }

  private swap(a: number, b: number): void {
    const ti = this.items[a];
    this.items[a] = this.items[b];
    this.items[b] = ti;
    const tk = this.keys[a];
    this.keys[a] = this.keys[b];
    this.keys[b] = tk;
  }
}

export class NavGrid {
  readonly cell = NAV_CELL;
  readonly x0: number;
  readonly z0: number;
  readonly nx: number;
  readonly nz: number;
  readonly walkable: Uint8Array;
  readonly height: Float32Array;
  /** 贴墙代价系数 */
  readonly cost: Float32Array;
  /** 连通块编号，-1 表示不可走。箱子顶那种孤岛会单独成块。 */
  readonly comp: Int32Array;
  /** 最大的连通块（也就是地图主体）。 */
  mainComp = -1;

  // A* 工作区（复用，避免每次寻路都分配）
  private gScore: Float32Array;
  private cameFrom: Int32Array;
  private stampOpen: Int32Array;
  private stampClosed: Int32Array;
  private stamp = 0;
  private heap: MinHeap;
  private world: CollisionWorld;

  constructor(world: CollisionWorld) {
    this.world = world;
    const b = mapBounds();
    this.x0 = b.x0;
    this.z0 = b.z0;
    this.nx = Math.ceil((b.x1 - b.x0) / NAV_CELL);
    this.nz = Math.ceil((b.z1 - b.z0) / NAV_CELL);
    const n = this.nx * this.nz;
    this.walkable = new Uint8Array(n);
    this.height = new Float32Array(n);
    this.cost = new Float32Array(n);
    this.comp = new Int32Array(n).fill(-1);
    this.gScore = new Float32Array(n);
    this.cameFrom = new Int32Array(n);
    this.stampOpen = new Int32Array(n);
    this.stampClosed = new Int32Array(n);
    this.heap = new MinHeap(Math.max(1024, n >> 2));
    this.bake();
  }

  index(cx: number, cz: number): number {
    return cz * this.nx + cx;
  }

  cellX(x: number): number {
    return Math.floor((x - this.x0) / NAV_CELL);
  }

  cellZ(z: number): number {
    return Math.floor((z - this.z0) / NAV_CELL);
  }

  worldX(cx: number): number {
    return this.x0 + (cx + 0.5) * NAV_CELL;
  }

  worldZ(cz: number): number {
    return this.z0 + (cz + 0.5) * NAV_CELL;
  }

  inBounds(cx: number, cz: number): boolean {
    return cx >= 0 && cz >= 0 && cx < this.nx && cz < this.nz;
  }

  private bake(): void {
    const w = this.world;
    for (let cz = 0; cz < this.nz; cz++) {
      for (let cx = 0; cx < this.nx; cx++) {
        const i = this.index(cx, cz);
        const x = this.worldX(cx);
        const z = this.worldZ(cz);
        const area = areaAt(x, z);
        if (!area) {
          this.walkable[i] = 0;
          continue;
        }
        // 只在“地面附近”找支撑：上限压在台阶最高一级之上、箱子顶之下，
        // 免得把天花板或高箱子顶当成地面。
        const ground = w.supportHeight(x, z, area.y + 1.8, 0.02);
        if (!isFinite(ground) || ground < area.y - 1.5) {
          this.walkable[i] = 0;
          continue;
        }
        // 站立空间从"抬脚高度"开始算：低于台阶高的东西是能跨上去的，不算阻挡。
        // 这一点必须和 physics.ts 的上台阶逻辑保持一致，否则 AI 会以为能走结果卡住。
        const r = AGENT_RADIUS;
        const blocked = w.overlapBox(
          x - r,
          ground + STEP_HEIGHT + 0.02,
          z - r,
          x + r,
          ground + AGENT_HEIGHT,
          z + r,
        );
        this.walkable[i] = blocked ? 0 : 1;
        this.height[i] = ground;
      }
    }

    // 贴墙代价：邻居里有不可走的格子就加钱，AI 会自然走中间
    for (let cz = 0; cz < this.nz; cz++) {
      for (let cx = 0; cx < this.nx; cx++) {
        const i = this.index(cx, cz);
        if (!this.walkable[i]) {
          this.cost[i] = 0;
          continue;
        }
        let blockedNeighbors = 0;
        for (let dz = -1; dz <= 1; dz++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dz === 0) continue;
            const nxc = cx + dx;
            const nzc = cz + dz;
            if (!this.inBounds(nxc, nzc) || !this.walkable[this.index(nxc, nzc)]) {
              blockedNeighbors++;
            }
          }
        }
        this.cost[i] = 1 + blockedNeighbors * 0.14;
      }
    }

    this.computeComponents();
  }

  /** 洪泛出连通块；边的规则必须和 A* 完全一致。 */
  private computeComponents(): void {
    let next = 0;
    let bestSize = -1;
    const queue: number[] = [];
    for (let start = 0; start < this.walkable.length; start++) {
      if (!this.walkable[start] || this.comp[start] >= 0) continue;
      const id = next++;
      let size = 0;
      queue.length = 0;
      queue.push(start);
      this.comp[start] = id;
      while (queue.length) {
        const cur = queue.pop()!;
        size++;
        const cx = cur % this.nx;
        const cz = (cur / this.nx) | 0;
        for (let dz = -1; dz <= 1; dz++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dz === 0) continue;
            const nxc = cx + dx;
            const nzc = cz + dz;
            if (!this.inBounds(nxc, nzc)) continue;
            const ni = this.index(nxc, nzc);
            if (this.comp[ni] >= 0 || !this.canStep(cur, ni)) continue;
            if (dx !== 0 && dz !== 0) {
              if (
                !this.canStep(cur, this.index(cx + dx, cz)) ||
                !this.canStep(cur, this.index(cx, cz + dz))
              ) {
                continue;
              }
            }
            this.comp[ni] = id;
            queue.push(ni);
          }
        }
      }
      if (size > bestSize) {
        bestSize = size;
        this.mainComp = id;
      }
    }
  }

  isWalkableAt(x: number, z: number): boolean {
    const cx = this.cellX(x);
    const cz = this.cellZ(z);
    if (!this.inBounds(cx, cz)) return false;
    return this.walkable[this.index(cx, cz)] === 1;
  }

  groundAt(x: number, z: number): number {
    const cx = this.cellX(x);
    const cz = this.cellZ(z);
    if (!this.inBounds(cx, cz)) return 0;
    return this.height[this.index(cx, cz)];
  }

  /**
   * 找离 (x,z,y) 最近的可行走格子。
   * 优先返回“和查询点同一层、且属于主连通块”的格子——否则站在箱子上的玩家
   * 会被吸附到箱子顶那种孤岛格子上，导致所有寻路失败。
   */
  nearestWalkable(x: number, z: number, y = 0, maxRadiusCells = 16): number {
    const cx0 = this.cellX(x);
    const cz0 = this.cellZ(z);
    let best = -1;
    let bestScore = Infinity;
    let bestGood = -1;
    let bestGoodScore = Infinity;
    for (let r = 0; r <= maxRadiusCells; r++) {
      for (let dz = -r; dz <= r; dz++) {
        for (let dx = -r; dx <= r; dx++) {
          if (Math.max(Math.abs(dx), Math.abs(dz)) !== r) continue;
          const cx = cx0 + dx;
          const cz = cz0 + dz;
          if (!this.inBounds(cx, cz)) continue;
          const i = this.index(cx, cz);
          if (!this.walkable[i]) continue;
          const ddx = this.worldX(cx) - x;
          const ddz = this.worldZ(cz) - z;
          const dh = this.height[i] - y;
          const flat = ddx * ddx + ddz * ddz;
          const score = flat + dh * dh * 6.25;
          if (score < bestScore) {
            bestScore = score;
            best = i;
          }
          if (Math.abs(dh) <= 1.2 && this.comp[i] === this.mainComp && flat < bestGoodScore) {
            bestGoodScore = flat;
            bestGood = i;
          }
        }
      }
      if (bestGood >= 0) break;
    }
    return bestGood >= 0 ? bestGood : best;
  }

  /** 两点是否属于同一连通块——比跑一次 A* 便宜得多。 */
  reachable(ax: number, az: number, ay: number, bx: number, bz: number, by: number): boolean {
    const a = this.nearestWalkable(ax, az, ay);
    const b = this.nearestWalkable(bx, bz, by);
    return a >= 0 && b >= 0 && this.comp[a] === this.comp[b];
  }

  private canStep(from: number, to: number): boolean {
    if (!this.walkable[to]) return false;
    const dh = this.height[to] - this.height[from];
    // 往上只能迈台阶高度，往下允许跳下一定落差（站台、深坑边沿）
    return dh <= STEP_HEIGHT && dh >= -MAX_DROP;
  }

  /**
   * A* 寻路。成功时把平滑后的路点写进 out（世界坐标，y 为地面高度）。
   */
  findPath(
    sx: number,
    sy: number,
    sz: number,
    tx: number,
    ty: number,
    tz: number,
    out: Vec3[],
  ): boolean {
    out.length = 0;
    const start = this.nearestWalkable(sx, sz, sy);
    const goal = this.nearestWalkable(tx, tz, ty);
    if (start < 0 || goal < 0) return false;
    if (start === goal) {
      out.push(v3(this.worldX(goal % this.nx), this.height[goal], this.worldZ((goal / this.nx) | 0)));
      return true;
    }

    const stamp = ++this.stamp;
    this.heap.clear();
    this.gScore[start] = 0;
    this.cameFrom[start] = -1;
    this.stampOpen[start] = stamp;
    const gx = goal % this.nx;
    const gz = (goal / this.nx) | 0;
    this.heap.push(start, this.heuristic(start % this.nx, (start / this.nx) | 0, gx, gz));

    let found = false;
    let iterations = 0;
    const maxIterations = this.nx * this.nz;

    while (this.heap.length > 0 && iterations++ < maxIterations) {
      const cur = this.heap.pop();
      if (this.stampClosed[cur] === stamp) continue;
      this.stampClosed[cur] = stamp;
      if (cur === goal) {
        found = true;
        break;
      }
      const cx = cur % this.nx;
      const cz = (cur / this.nx) | 0;
      const g = this.gScore[cur];

      for (let dz = -1; dz <= 1; dz++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dz === 0) continue;
          const nxc = cx + dx;
          const nzc = cz + dz;
          if (!this.inBounds(nxc, nzc)) continue;
          const ni = this.index(nxc, nzc);
          if (this.stampClosed[ni] === stamp) continue;
          if (!this.canStep(cur, ni)) continue;
          if (dx !== 0 && dz !== 0) {
            // 斜向不许切角
            if (!this.canStep(cur, this.index(cx + dx, cz)) || !this.canStep(cur, this.index(cx, cz + dz))) {
              continue;
            }
          }
          const stepCost = (dx !== 0 && dz !== 0 ? SQRT2 : 1) * NAV_CELL * this.cost[ni];
          const ng = g + stepCost;
          if (this.stampOpen[ni] === stamp && ng >= this.gScore[ni]) continue;
          this.gScore[ni] = ng;
          this.cameFrom[ni] = cur;
          this.stampOpen[ni] = stamp;
          this.heap.push(ni, ng + this.heuristic(nxc, nzc, gx, gz));
        }
      }
    }

    if (!found) return false;

    // 回溯
    const raw: number[] = [];
    let node = goal;
    while (node !== -1) {
      raw.push(node);
      node = this.cameFrom[node];
    }
    raw.reverse();

    this.smooth(raw, out);
    return out.length > 0;
  }

  private heuristic(cx: number, cz: number, gx: number, gz: number): number {
    const dx = Math.abs(cx - gx);
    const dz = Math.abs(cz - gz);
    // 八方向（octile）距离
    return (Math.max(dx, dz) + (SQRT2 - 1) * Math.min(dx, dz)) * NAV_CELL;
  }

  /** 拉绳平滑：能直着走就不拐弯。 */
  private smooth(raw: number[], out: Vec3[]): void {
    let i = 0;
    while (i < raw.length - 1) {
      let j = raw.length - 1;
      // 从最远的点往回试，找到第一个能直连的
      if (j > i + 1) {
        for (; j > i + 1; j--) {
          if (this.lineWalkable(raw[i], raw[j])) break;
        }
      }
      const node = raw[Math.min(j, raw.length - 1)];
      out.push(
        v3(this.worldX(node % this.nx), this.height[node], this.worldZ((node / this.nx) | 0)),
      );
      if (j <= i) break;
      i = j;
    }
  }

  /** 两个格子之间是否可以直线行走（采样检查）。 */
  lineWalkable(from: number, to: number): boolean {
    const ax = this.worldX(from % this.nx);
    const az = this.worldZ((from / this.nx) | 0);
    const bx = this.worldX(to % this.nx);
    const bz = this.worldZ((to / this.nx) | 0);
    const dx = bx - ax;
    const dz = bz - az;
    const dist = Math.hypot(dx, dz);
    const steps = Math.max(2, Math.ceil(dist / (NAV_CELL * 0.6)));
    let prevH = this.height[from];
    for (let s = 1; s <= steps; s++) {
      const t = s / steps;
      const x = ax + dx * t;
      const z = az + dz * t;
      const cx = this.cellX(x);
      const cz = this.cellZ(z);
      if (!this.inBounds(cx, cz)) return false;
      const i = this.index(cx, cz);
      if (!this.walkable[i]) return false;
      const h = this.height[i];
      const dh = h - prevH;
      if (dh > STEP_HEIGHT || dh < -MAX_DROP) return false;
      prevH = h;
    }
    return true;
  }

  /** 直线可走判定的世界坐标版本，AI 判断"能不能直接冲过去"。 */
  lineWalkableWorld(
    ax: number,
    az: number,
    bx: number,
    bz: number,
    ay = 0,
    by = 0,
  ): boolean {
    const a = this.nearestWalkable(ax, az, ay);
    const b = this.nearestWalkable(bx, bz, by);
    if (a < 0 || b < 0) return false;
    return this.lineWalkable(a, b);
  }

  /** 在矩形范围内随机取一个可行走点。 */
  randomPointIn(
    rng: Rng,
    x0: number,
    z0: number,
    x1: number,
    z1: number,
    out: Vec3,
  ): boolean {
    for (let attempt = 0; attempt < 24; attempt++) {
      const x = rng.range(x0, x1);
      const z = rng.range(z0, z1);
      const cx = this.cellX(x);
      const cz = this.cellZ(z);
      if (!this.inBounds(cx, cz)) continue;
      const i = this.index(cx, cz);
      if (!this.walkable[i]) continue;
      out.x = this.worldX(cx);
      out.y = this.height[i];
      out.z = this.worldZ(cz);
      return true;
    }
    return false;
  }

  /** 统计信息，测试用。 */
  stats(): { total: number; walkable: number } {
    let n = 0;
    for (let i = 0; i < this.walkable.length; i++) n += this.walkable[i];
    return { total: this.walkable.length, walkable: n };
  }
}
