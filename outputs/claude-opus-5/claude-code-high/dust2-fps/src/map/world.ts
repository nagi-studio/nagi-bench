import { clamp, dist2D } from '../core/math.ts';
import type { Vec3 } from '../core/math.ts';
import type { Team } from '../core/types.ts';
import { STEP_HEIGHT, WorldGrid } from './grid.ts';
import type { BlockRect, FloorRect, RayHit } from './grid.ts';

export type PropKind = 'crate' | 'barrel' | 'car' | 'plate' | 'door' | 'pillar' | 'sandbag';

/** A box-shaped piece of level furniture. Solid props are full physics colliders. */
export interface Prop {
  name: string;
  kind: PropKind;
  /** Centre in X/Z, *bottom* in Y. */
  x: number;
  y: number;
  z: number;
  sx: number;
  sy: number;
  sz: number;
  color: number;
  solid: boolean;
  /** Yaw in radians — visual only, collision stays axis aligned. */
  rot?: number;
}

export interface Zone {
  name: string;
  x1: number;
  z1: number;
  x2: number;
  z2: number;
}

export interface SpawnPoint {
  x: number;
  z: number;
  yaw: number;
}

/** Named tactical anchors the AI navigates between. */
export interface NavAnchor {
  name: string;
  area: string;
  x: number;
  z: number;
}

export interface WorldDef {
  bounds: { minX: number; minZ: number; maxX: number; maxZ: number };
  floors: FloorRect[];
  blocks: BlockRect[];
  props: Prop[];
  bombsites: { A: Zone; B: Zone };
  spawns: Record<Team, SpawnPoint[]>;
  anchors: NavAnchor[];
}

export interface WorldRayHit extends RayHit {
  prop: Prop | null;
}

/**
 * The level: a collision grid plus box props, zones and spawn data.
 * Owns every geometric query the game needs (raycasts, line of sight,
 * ground support, circle-vs-world resolution).
 */
export class World {
  readonly grid: WorldGrid;
  readonly def: WorldDef;
  readonly props: Prop[];
  readonly solidProps: Prop[];
  readonly bombsites: { A: Zone; B: Zone };

  constructor(def: WorldDef) {
    this.def = def;
    this.grid = new WorldGrid(def.bounds.minX, def.bounds.minZ, def.bounds.maxX, def.bounds.maxZ);
    this.grid.carve(def.floors, def.blocks);
    this.props = def.props;
    this.solidProps = def.props.filter((p) => p.solid);
    this.bombsites = def.bombsites;
  }

  spawns(team: Team): SpawnPoint[] {
    return this.def.spawns[team];
  }

  anchors(area?: string): NavAnchor[] {
    return area ? this.def.anchors.filter((a) => a.area === area) : this.def.anchors;
  }

  anchor(name: string): NavAnchor | undefined {
    return this.def.anchors.find((a) => a.name === name);
  }

  static inZone(z: Zone, x: number, zz: number): boolean {
    return x >= z.x1 && x <= z.x2 && zz >= z.z1 && zz <= z.z2;
  }

  /** Which bomb site (if any) contains this position. */
  siteAt(pos: Vec3): 'A' | 'B' | null {
    if (World.inZone(this.bombsites.A, pos.x, pos.z)) return 'A';
    if (World.inZone(this.bombsites.B, pos.x, pos.z)) return 'B';
    return null;
  }

  /**
   * Highest supporting surface under an actor standing at (x,z).
   * `allowance` is how far *above* the feet a surface may still count as
   * ground: a step height while walking, almost nothing while airborne (plus a
   * little extra when ducking, which is what makes crouch-jumping work).
   */
  supportHeight(x: number, z: number, feetY: number, radius: number, allowance = STEP_HEIGHT): number {
    let best = this.grid.floorAt(x, z);
    for (const p of this.solidProps) {
      const top = p.y + p.sy;
      if (top > feetY + allowance + 0.02) continue;
      if (top <= best) continue;
      const hx = p.sx * 0.5 + radius;
      const hz = p.sz * 0.5 + radius;
      if (Math.abs(x - p.x) <= hx && Math.abs(z - p.z) <= hz) best = top;
    }
    return best;
  }

  /** Ray against walls, floor steps and solid props. */
  raycast(origin: Vec3, dir: Vec3, maxDist: number): WorldRayHit {
    const g = this.grid.raycast(origin, dir, maxDist);
    let best: WorldRayHit = { ...g, prop: null };
    let bestDist = g.hit ? g.dist : maxDist;

    for (const p of this.solidProps) {
      const t = rayBox(origin, dir, p, bestDist);
      if (t && t.dist < bestDist) {
        bestDist = t.dist;
        best = {
          hit: true,
          dist: t.dist,
          point: { x: origin.x + dir.x * t.dist, y: origin.y + dir.y * t.dist, z: origin.z + dir.z * t.dist },
          normal: t.normal,
          prop: p,
        };
      }
    }
    return best;
  }

  /** Unobstructed line between two points (bullet / vision test). */
  losClear(a: Vec3, b: Vec3): boolean {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dz = b.z - a.z;
    const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (len < 1e-4) return true;
    const dir = { x: dx / len, y: dy / len, z: dz / len };
    const hit = this.raycast(a, dir, len - 0.05);
    return !hit.hit;
  }

  /**
   * Move a vertical cylinder (radius r, feet at y) by (dx,dz) with sliding
   * collision response against the grid and solid props. Axis-separated so
   * players slide along walls instead of sticking to them.
   */
  moveCircle(
    pos: Vec3,
    dx: number,
    dz: number,
    radius: number,
    allowance = STEP_HEIGHT,
  ): { x: number; z: number; hitWall: boolean } {
    let x = pos.x;
    let z = pos.z;
    let hitWall = false;

    const tryAxis = (nx: number, nz: number): boolean => {
      if (!this.circleFree(nx, nz, pos.y, radius, allowance)) return false;
      x = nx;
      z = nz;
      return true;
    };

    if (dx !== 0 && !tryAxis(x + dx, z)) hitWall = true;
    if (dz !== 0 && !tryAxis(x, z + dz)) hitWall = true;
    return { x, z, hitWall };
  }

  /** Is a cylinder at (x,z,feetY) free of walls/props? */
  circleFree(x: number, z: number, feetY: number, radius: number, allowance = STEP_HEIGHT): boolean {
    const g = this.grid;
    const i0 = g.cellX(x - radius);
    const i1 = g.cellX(x + radius);
    const j0 = g.cellZ(z - radius);
    const j1 = g.cellZ(z + radius);
    for (let j = j0; j <= j1; j++) {
      for (let i = i0; i <= i1; i++) {
        const blocked = g.isSolidCell(i, j) || g.floorCell(i, j) - feetY > allowance;
        if (!blocked) continue;
        // Closest point on the cell to the circle centre.
        const cx = clamp(x, g.minX + i, g.minX + i + 1);
        const cz = clamp(z, g.minZ + j, g.minZ + j + 1);
        const ddx = x - cx;
        const ddz = z - cz;
        if (ddx * ddx + ddz * ddz < radius * radius) return false;
      }
    }
    for (const p of this.solidProps) {
      const top = p.y + p.sy;
      if (top <= feetY + allowance + 0.02) continue; // low enough to step / climb onto
      if (p.y >= feetY + 1.8) continue; // overhead
      const cx = clamp(x, p.x - p.sx / 2, p.x + p.sx / 2);
      const cz = clamp(z, p.z - p.sz / 2, p.z + p.sz / 2);
      const ddx = x - cx;
      const ddz = z - cz;
      if (ddx * ddx + ddz * ddz < radius * radius) return false;
    }
    return true;
  }

  /**
   * Push a cylinder out of anything it is overlapping.
   *
   * Sliding collision alone can trap an actor: once its centre is inside an
   * obstacle's inflated footprint, *every* candidate position is rejected and
   * it can never move again (this really happened to a bot that walked off the
   * edge of a crate). Resolving the penetration explicitly guarantees escape.
   */
  depenetrate(x: number, z: number, feetY: number, radius: number, allowance = STEP_HEIGHT): { x: number; z: number } {
    let pushX = 0;
    let pushZ = 0;

    const resolveBox = (minX: number, maxX: number, minZ: number, maxZ: number): void => {
      const cx = clamp(x, minX, maxX);
      const cz = clamp(z, minZ, maxZ);
      let dx = x - cx;
      let dz = z - cz;
      let d = Math.hypot(dx, dz);
      if (d >= radius) return;
      if (d < 1e-5) {
        // Centre is inside the box: leave through the nearest face.
        const west = x - minX;
        const east = maxX - x;
        const north = z - minZ;
        const south = maxZ - z;
        const m = Math.min(west, east, north, south);
        if (m === west) {
          dx = -1;
          dz = 0;
          d = -west;
        } else if (m === east) {
          dx = 1;
          dz = 0;
          d = -east;
        } else if (m === north) {
          dx = 0;
          dz = -1;
          d = -north;
        } else {
          dx = 0;
          dz = 1;
          d = -south;
        }
      } else {
        dx /= d;
        dz /= d;
      }
      const push = radius - d + 0.01;
      pushX += dx * push;
      pushZ += dz * push;
    };

    const g = this.grid;
    const i0 = g.cellX(x - radius);
    const i1 = g.cellX(x + radius);
    const j0 = g.cellZ(z - radius);
    const j1 = g.cellZ(z + radius);
    for (let j = j0; j <= j1; j++) {
      for (let i = i0; i <= i1; i++) {
        if (!g.isSolidCell(i, j) && g.floorCell(i, j) - feetY <= allowance) continue;
        resolveBox(g.minX + i, g.minX + i + 1, g.minZ + j, g.minZ + j + 1);
      }
    }
    for (const p of this.solidProps) {
      const top = p.y + p.sy;
      if (top <= feetY + allowance + 0.02) continue;
      if (p.y >= feetY + 1.8) continue;
      resolveBox(p.x - p.sx / 2, p.x + p.sx / 2, p.z - p.sz / 2, p.z + p.sz / 2);
    }

    const len = Math.hypot(pushX, pushZ);
    if (len < 1e-6) return { x, z };
    // Cap the correction so a deeply buried actor eases out over a few ticks.
    const maxStep = 0.35;
    const scale = len > maxStep ? maxStep / len : 1;
    return { x: x + pushX * scale, z: z + pushZ * scale };
  }

  /** Nearest walkable position to (x,z) — used to un-stick spawned entities. */
  nearestOpen(x: number, z: number, feetY = 0, radius = 0.4): { x: number; z: number } {
    if (this.circleFree(x, z, feetY, radius)) return { x, z };
    for (let r = 1; r <= 12; r++) {
      for (let a = 0; a < 16; a++) {
        const ang = (a / 16) * Math.PI * 2;
        const nx = x + Math.cos(ang) * r;
        const nz = z + Math.sin(ang) * r;
        if (this.circleFree(nx, nz, feetY, radius)) return { x: nx, z: nz };
      }
    }
    return { x, z };
  }

  /** Distance from a point to the nearest wall — cheap "am I in the open" metric for AI. */
  clearanceAt(x: number, z: number): number {
    let best = 8;
    for (let r = 1; r <= 8; r++) {
      for (let a = 0; a < 8; a++) {
        const ang = (a / 8) * Math.PI * 2;
        if (this.grid.isSolidAt(x + Math.cos(ang) * r, z + Math.sin(ang) * r)) {
          best = Math.min(best, r);
        }
      }
      if (best <= r) break;
    }
    return best;
  }

  distanceToSite(pos: Vec3, site: 'A' | 'B'): number {
    const zone = this.bombsites[site];
    const cx = (zone.x1 + zone.x2) / 2;
    const cz = (zone.z1 + zone.z2) / 2;
    return dist2D(pos, { x: cx, y: 0, z: cz });
  }
}

function rayBox(
  o: Vec3,
  d: Vec3,
  p: Prop,
  maxDist: number,
): { dist: number; normal: Vec3 } | null {
  const minX = p.x - p.sx / 2;
  const maxX = p.x + p.sx / 2;
  const minY = p.y;
  const maxY = p.y + p.sy;
  const minZ = p.z - p.sz / 2;
  const maxZ = p.z + p.sz / 2;

  let tmin = 0;
  let tmax = maxDist;
  let normalAxis = 0;
  let normalSign = 1;

  const axes: [number, number, number, number][] = [
    [o.x, d.x, minX, maxX],
    [o.y, d.y, minY, maxY],
    [o.z, d.z, minZ, maxZ],
  ];

  for (let a = 0; a < 3; a++) {
    const [oa, da, lo, hi] = axes[a];
    if (Math.abs(da) < 1e-9) {
      if (oa < lo || oa > hi) return null;
      continue;
    }
    const inv = 1 / da;
    let t1 = (lo - oa) * inv;
    let t2 = (hi - oa) * inv;
    let sign = -1;
    if (t1 > t2) {
      const tmp = t1;
      t1 = t2;
      t2 = tmp;
      sign = 1;
    }
    if (t1 > tmin) {
      tmin = t1;
      normalAxis = a;
      normalSign = sign;
    }
    if (t2 < tmax) tmax = t2;
    if (tmin > tmax) return null;
  }
  if (tmin <= 0 || tmin > maxDist) return null;
  const normal: Vec3 = { x: 0, y: 0, z: 0 };
  if (normalAxis === 0) normal.x = normalSign;
  else if (normalAxis === 1) normal.y = normalSign;
  else normal.z = normalSign;
  return { dist: tmin, normal };
}
