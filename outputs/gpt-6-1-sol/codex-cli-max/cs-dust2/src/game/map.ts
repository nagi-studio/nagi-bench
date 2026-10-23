import type { Collider, Vec2 } from "./types";

export const CELL = 2;
export const ACTOR_RADIUS = 0.36;
export const MAP_MIN = -48;
export const GRID_SIZE = 48;
export interface Region {
  name: string;
  label: string;
  x1: number;
  x2: number;
  z1: number;
  z2: number;
  kind?: "tunnel" | "site";
}
export const REGIONS: Region[] = [
  { name: "T 出生点", label: "T SPAWN", x1: -12, x2: 18, z1: 30, z2: 44 },
  { name: "T 斜坡", label: "T RAMP", x1: -30, x2: -10, z1: 32, z2: 40 },
  {
    name: "B 洞",
    label: "UPPER TUNNELS",
    x1: -36,
    x2: -24,
    z1: -22,
    z2: 36,
    kind: "tunnel",
  },
  {
    name: "B 点",
    label: "B SITE",
    x1: -42,
    x2: -18,
    z1: -40,
    z2: -20,
    kind: "site",
  },
  { name: "B 门", label: "B DOORS", x1: -24, x2: -8, z1: -32, z2: -24 },
  { name: "CT 出生点", label: "CT SPAWN", x1: -12, x2: 12, z1: -36, z2: -24 },
  { name: "中路", label: "MID", x1: -6, x2: 6, z1: -26, z2: 32 },
  { name: "猫道入口", label: "CATWALK", x1: 4, x2: 16, z1: 6, z2: 16 },
  { name: "猫道", label: "SHORT A", x1: 10, x2: 18, z1: -20, z2: 14 },
  { name: "A 小", label: "A SHORT", x1: 12, x2: 28, z1: -26, z2: -18 },
  {
    name: "A 点",
    label: "A SITE",
    x1: 24,
    x2: 44,
    z1: -38,
    z2: -14,
    kind: "site",
  },
  { name: "CT 斜坡", label: "CT RAMP", x1: 10, x2: 28, z1: -34, z2: -26 },
  { name: "A 大", label: "A LONG", x1: 34, x2: 44, z1: -16, z2: 24 },
  { name: "A 大门", label: "LONG DOORS", x1: 24, x2: 44, z1: 18, z2: 28 },
  { name: "A 大外侧", label: "OUTSIDE LONG", x1: 14, x2: 30, z1: 24, z2: 38 },
  {
    name: "B 下层通道",
    label: "LOWER TUNNELS",
    x1: -28,
    x2: -4,
    z1: 2,
    z2: 12,
    kind: "tunnel",
  },
];
export const SITES = {
  A: { x: 32, z: -25, radius: 8 },
  B: { x: -30, z: -29, radius: 8 },
};
export const SPAWNS = {
  T: [
    { x: 1, z: 38 },
    { x: -3, z: 36 },
    { x: 5, z: 36 },
    { x: -5, z: 40 },
    { x: 9, z: 39 },
  ],
  CT: [
    { x: 0, z: -31 },
    { x: -4, z: -32 },
    { x: 4, z: -32 },
    { x: -7, z: -28 },
    { x: 7, z: -28 },
  ],
};
export const inside = (x: number, z: number, r: Region) =>
  x >= r.x1 && x <= r.x2 && z >= r.z1 && z <= r.z2;
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));

export function groundHeight(x: number, z: number): number {
  let y = 0;
  if (x >= 24 && x <= 44 && z >= -38 && z <= -14) y = 1.2;
  if (x >= 34 && x <= 44 && z >= -16 && z <= -4)
    y = Math.max(y, clamp((-4 - z) / 12) * 1.2);
  if (x >= 10 && x <= 28 && z >= -34 && z <= -26)
    y = Math.max(y, clamp((x - 10) / 14) * 1.2);
  if (x >= 10 && x <= 18 && z >= -20 && z <= 14)
    y = Math.max(y, clamp((14 - z) / 10) * 0.8);
  if (x >= 12 && x <= 28 && z >= -26 && z <= -18)
    y = Math.max(y, 0.8 + clamp((x - 18) / 6) * 0.4);
  // The entry to short is a continuous ramp from upper mid.
  if (x >= 4 && x <= 16 && z >= 6 && z <= 16)
    y = Math.max(y, clamp((x - 6) / 8) * clamp((16 - z) / 10) * 0.8);
  return y;
}

export interface Prop {
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  type: "crate" | "door";
  color?: number;
}
export const PROPS: Prop[] = [
  { x: 31, z: -30, w: 3.8, d: 3.4, h: 2.6, type: "crate" },
  { x: 37, z: -33, w: 3, d: 3, h: 3.2, type: "crate" },
  { x: 27.5, z: -20, w: 2.5, d: 2.5, h: 1.3, type: "crate" },
  { x: -33, z: -33, w: 4, d: 3, h: 2.7, type: "crate" },
  { x: -25, z: -27, w: 3, d: 3, h: 1.5, type: "crate" },
  { x: -38, z: -24, w: 2.5, d: 2.5, h: 1.7, type: "crate" },
  { x: 2.7, z: -3, w: 2.4, d: 2.8, h: 1.4, type: "crate" },
  { x: 40.7, z: 5, w: 2.2, d: 3, h: 1.3, type: "crate" },
  { x: -8, z: 40, w: 3, d: 3, h: 2, type: "crate" },
  { x: -33.7, z: 21, w: 2, d: 2.6, h: 1.4, type: "crate" },
  { x: 26.7, z: 31, w: 2.3, d: 2.5, h: 1.7, type: "crate" },
  // Open double doors: two substantial wooden leaves, with a 3.4m central passage.
  { x: -3.5, z: -15.9, w: 3.6, d: 0.46, h: 3.5, type: "door" },
  { x: 3.5, z: -15.1, w: 3.6, d: 0.46, h: 3.5, type: "door" },
  { x: 26, z: 24, w: 0.5, d: 4, h: 3.4, type: "door" },
  { x: 33, z: 21, w: 3, d: 0.5, h: 3.4, type: "door" },
];

export class MapData {
  readonly cells = new Uint8Array(GRID_SIZE * GRID_SIZE);
  readonly colliders: Collider[] = [];
  readonly walls: Collider[] = [];
  constructor() {
    for (let iz = 0; iz < GRID_SIZE; iz++)
      for (let ix = 0; ix < GRID_SIZE; ix++) {
        const { x, z } = this.point(ix, iz);
        this.cells[iz * GRID_SIZE + ix] = +REGIONS.some((r) => inside(x, z, r));
      }
    // Merge boundary edges into long walls; rendering and physics use these exact boxes.
    for (let z = 0; z <= GRID_SIZE; z++) {
      let run = -1;
      for (let x = 0; x <= GRID_SIZE; x++) {
        const edge = x < GRID_SIZE && this.cell(x, z - 1) !== this.cell(x, z);
        if (edge && run < 0) run = x;
        if (!edge && run >= 0) {
          const zz = MAP_MIN + z * CELL;
          this.addWall(
            MAP_MIN + run * CELL,
            MAP_MIN + x * CELL,
            zz - 0.28,
            zz + 0.28,
          );
          run = -1;
        }
      }
    }
    for (let x = 0; x <= GRID_SIZE; x++) {
      let run = -1;
      for (let z = 0; z <= GRID_SIZE; z++) {
        const edge = z < GRID_SIZE && this.cell(x - 1, z) !== this.cell(x, z);
        if (edge && run < 0) run = z;
        if (!edge && run >= 0) {
          const xx = MAP_MIN + x * CELL;
          this.addWall(
            xx - 0.28,
            xx + 0.28,
            MAP_MIN + run * CELL,
            MAP_MIN + z * CELL,
          );
          run = -1;
        }
      }
    }
    for (const p of PROPS) {
      const y = groundHeight(p.x, p.z);
      this.colliders.push({
        minX: p.x - p.w / 2,
        maxX: p.x + p.w / 2,
        minZ: p.z - p.d / 2,
        maxZ: p.z + p.d / 2,
        minY: y,
        maxY: y + p.h,
        kind: p.type,
      });
    }
    this.colliders.push({
      minX: -6,
      maxX: 6,
      minZ: -16.5,
      maxZ: -14.5,
      minY: 3.55,
      maxY: 6,
      kind: "roof",
    });
    this.colliders.push({
      minX: -36,
      maxX: -24,
      minZ: -20,
      maxZ: 30,
      minY: 4.1,
      maxY: 4.45,
      kind: "roof",
    });
    this.colliders.push({
      minX: -26,
      maxX: -6,
      minZ: 2,
      maxZ: 12,
      minY: 4.1,
      maxY: 4.45,
      kind: "roof",
    });
  }
  private addWall(minX: number, maxX: number, minZ: number, maxZ: number) {
    const wall: Collider = {
      minX,
      maxX,
      minZ,
      maxZ,
      minY: -0.4,
      maxY: 6.6,
      kind: "wall",
    };
    this.walls.push(wall);
    this.colliders.push(wall);
  }
  cell(x: number, z: number) {
    return x < 0 || z < 0 || x >= GRID_SIZE || z >= GRID_SIZE
      ? 0
      : this.cells[z * GRID_SIZE + x];
  }
  point(x: number, z: number): Vec2 {
    return { x: MAP_MIN + (x + 0.5) * CELL, z: MAP_MIN + (z + 0.5) * CELL };
  }
  indices(x: number, z: number) {
    return {
      x: Math.floor((x - MAP_MIN) / CELL),
      z: Math.floor((z - MAP_MIN) / CELL),
    };
  }
  onFloor(x: number, z: number) {
    const p = this.indices(x, z);
    return !!this.cell(p.x, p.z);
  }
  location(x: number, z: number) {
    if (Math.abs(x) < 6 && z > -19 && z < -12) return "中门";
    const matches = REGIONS.filter((r) => inside(x, z, r));
    return (
      matches.find((r) => r.kind === "site")?.name ??
      matches.at(-1)?.name ??
      "Dust II"
    );
  }
  siteAt(x: number, z: number): "A" | "B" | null {
    for (const id of ["A", "B"] as const) {
      const s = SITES[id];
      if (Math.hypot(x - s.x, z - s.z) < s.radius) return id;
    }
    return null;
  }
  blocked(
    x: number,
    z: number,
    y = groundHeight(x, z),
    radius = 0.39,
    height = 1.82,
  ) {
    if (!this.onFloor(x, z)) return true;
    return this.colliders.some(
      (c) =>
        y < c.maxY - 0.08 &&
        y + height > c.minY + 0.05 &&
        this.circleBox(x, z, radius, c),
    );
  }
  circleBox(x: number, z: number, r: number, c: Collider) {
    const dx = x - clamp(x, c.minX, c.maxX),
      dz = z - clamp(z, c.minZ, c.maxZ);
    return dx * dx + dz * dz < r * r;
  }
  move(
    position: { x: number; y: number; z: number },
    dx: number,
    dz: number,
    radius = ACTOR_RADIUS,
  ) {
    const steps = Math.max(1, Math.ceil(Math.hypot(dx, dz) / 0.22));
    for (let i = 0; i < steps; i++) {
      const x = position.x + dx / steps;
      if (
        !this.blocked(
          x,
          position.z,
          Math.max(position.y, groundHeight(x, position.z)),
          radius,
        )
      )
        position.x = x;
      const z = position.z + dz / steps;
      if (
        !this.blocked(
          position.x,
          z,
          Math.max(position.y, groundHeight(position.x, z)),
          radius,
        )
      )
        position.z = z;
    }
  }
  support(x: number, z: number, feetY: number) {
    let y = groundHeight(x, z);
    for (const c of this.colliders)
      if (
        c.kind === "crate" &&
        feetY >= c.maxY - 0.12 &&
        x > c.minX - 0.2 &&
        x < c.maxX + 0.2 &&
        z > c.minZ - 0.2 &&
        z < c.maxZ + 0.2
      )
        y = Math.max(y, c.maxY);
    return y;
  }
  clearPath(a: Vec2, b: Vec2, radius = 0.42) {
    const length = Math.hypot(b.x - a.x, b.z - a.z),
      steps = Math.ceil(length / 0.6);
    for (let i = 0; i <= steps; i++) {
      const t = steps ? i / steps : 0;
      const x = a.x + (b.x - a.x) * t,
        z = a.z + (b.z - a.z) * t;
      if (this.blocked(x, z, groundHeight(x, z), radius)) return false;
    }
    return true;
  }
  rayDistance(
    origin: { x: number; y: number; z: number },
    direction: { x: number; y: number; z: number },
    maxDistance = 200,
  ) {
    let nearest = maxDistance;
    for (const c of this.colliders) {
      let lo = 0,
        hi = nearest;
      const axes = [
        ["x", "minX", "maxX"],
        ["y", "minY", "maxY"],
        ["z", "minZ", "maxZ"],
      ] as const;
      for (const [axis, min, max] of axes) {
        const d = direction[axis],
          o = origin[axis];
        if (Math.abs(d) < 1e-8) {
          if (o < c[min] || o > c[max]) {
            hi = -1;
            break;
          }
        } else {
          let t1 = (c[min] - o) / d,
            t2 = (c[max] - o) / d;
          if (t1 > t2) [t1, t2] = [t2, t1];
          lo = Math.max(lo, t1);
          hi = Math.min(hi, t2);
          if (lo > hi) break;
        }
      }
      if (lo <= hi && hi >= 0) nearest = Math.min(nearest, Math.max(0, lo));
    }
    return nearest;
  }
  visible(
    a: { x: number; y: number; z: number },
    b: { x: number; y: number; z: number },
  ) {
    const dx = b.x - a.x,
      dy = b.y - a.y,
      dz = b.z - a.z,
      len = Math.hypot(dx, dy, dz);
    return (
      len < 0.01 ||
      this.rayDistance(a, { x: dx / len, y: dy / len, z: dz / len }, len) >=
        len - 0.05
    );
  }
}

class MinHeap {
  items: { id: number; f: number }[] = [];
  push(item: { id: number; f: number }) {
    let i = this.items.length;
    this.items.push(item);
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.items[p].f <= item.f) break;
      this.items[i] = this.items[p];
      i = p;
    }
    this.items[i] = item;
  }
  pop() {
    const first = this.items[0],
      last = this.items.pop()!;
    if (this.items.length) {
      let i = 0;
      while (true) {
        let c = i * 2 + 1;
        if (c >= this.items.length) break;
        if (c + 1 < this.items.length && this.items[c + 1].f < this.items[c].f)
          c++;
        if (last.f <= this.items[c].f) break;
        this.items[i] = this.items[c];
        i = c;
      }
      this.items[i] = last;
    }
    return first;
  }
}

export class Navigator {
  readonly safe = new Uint8Array(GRID_SIZE * GRID_SIZE);
  constructor(readonly map: MapData) {
    for (let z = 0; z < GRID_SIZE; z++)
      for (let x = 0; x < GRID_SIZE; x++) {
        const p = map.point(x, z);
        this.safe[z * GRID_SIZE + x] = +(
          !!map.cell(x, z) &&
          !map.blocked(p.x, p.z, groundHeight(p.x, p.z), 0.46)
        );
      }
  }
  nearest(p: Vec2): number {
    const c = this.map.indices(p.x, p.z);
    let best = -1,
      dist = Infinity;
    for (let radius = 0; radius <= 8; radius++) {
      for (let z = c.z - radius; z <= c.z + radius; z++)
        for (let x = c.x - radius; x <= c.x + radius; x++) {
          if (
            x < 0 ||
            x >= GRID_SIZE ||
            z < 0 ||
            z >= GRID_SIZE ||
            !this.safe[z * GRID_SIZE + x]
          )
            continue;
          const v = this.map.point(x, z),
            d = Math.hypot(v.x - p.x, v.z - p.z);
          if (d < dist) {
            dist = d;
            best = z * GRID_SIZE + x;
          }
        }
      if (best >= 0) return best;
    }
    return best;
  }
  findPath(from: Vec2, to: Vec2): Vec2[] {
    if (this.map.clearPath(from, to)) return [{ x: to.x, z: to.z }];
    const start = this.nearest(from),
      end = this.nearest(to);
    if (start < 0 || end < 0) return [];
    const total = GRID_SIZE * GRID_SIZE,
      g = new Float32Array(total).fill(Infinity),
      parent = new Int32Array(total).fill(-1),
      closed = new Uint8Array(total),
      heap = new MinHeap();
    const ex = end % GRID_SIZE,
      ez = (end / GRID_SIZE) | 0;
    g[start] = 0;
    heap.push({ id: start, f: 0 });
    while (heap.items.length) {
      const { id } = heap.pop();
      if (closed[id]) continue;
      if (id === end) break;
      closed[id] = 1;
      const x = id % GRID_SIZE,
        z = (id / GRID_SIZE) | 0;
      for (let dz = -1; dz <= 1; dz++)
        for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dz) continue;
          const nx = x + dx,
            nz = z + dz,
            nid = nz * GRID_SIZE + nx;
          if (
            nx < 0 ||
            nz < 0 ||
            nx >= GRID_SIZE ||
            nz >= GRID_SIZE ||
            !this.safe[nid] ||
            closed[nid]
          )
            continue;
          if (
            dx &&
            dz &&
            (!this.safe[z * GRID_SIZE + nx] || !this.safe[nz * GRID_SIZE + x])
          )
            continue;
          const nextG = g[id] + (dx && dz ? 1.414 : 1);
          if (nextG >= g[nid]) continue;
          if (
            !this.map.clearPath(
              this.map.point(x, z),
              this.map.point(nx, nz),
              0.4,
            )
          )
            continue;
          parent[nid] = id;
          g[nid] = nextG;
          heap.push({ id: nid, f: nextG + Math.hypot(nx - ex, nz - ez) });
        }
    }
    if (start !== end && parent[end] < 0) return [];
    const raw: Vec2[] = [];
    let cur = end;
    while (cur !== start && cur >= 0) {
      raw.push(this.map.point(cur % GRID_SIZE, (cur / GRID_SIZE) | 0));
      cur = parent[cur];
    }
    raw.reverse();
    // String-pull A* paths using collision-aware visibility, so bots don't zigzag or cut corners.
    const smooth: Vec2[] = [];
    let anchor = from,
      index = 0;
    while (index < raw.length) {
      let far = index;
      while (
        far + 1 < raw.length &&
        this.map.clearPath(anchor, raw[far + 1], 0.47)
      )
        far++;
      smooth.push(raw[far]);
      anchor = raw[far];
      index = far + 1;
    }
    if (!this.map.blocked(to.x, to.z) && this.map.clearPath(anchor, to, 0.44))
      smooth.push({ x: to.x, z: to.z });
    return smooth;
  }
}
