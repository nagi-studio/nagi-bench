// Dust2 core-area layout, fully procedural. Pure data + collision queries (no three.js).
//
// Top-down layout (x = east, z = south, y = up). Walkable area is the union of rects below;
// walls are auto-generated from a 1m rasterization of that union, so regions are guaranteed
// connected exactly where the rects touch/overlap — no leaks, no missing areas.
//
//   CT spawn (north-center) ── A ramp ──> A site (NE) <── Long A <── outside long <── T spawn (SE)
//        │                                    ^                                          │
//        └── B doors ──> B site (NW)          └── short/catwalk <── mid (xbox) <─────────┤
//                          ^                                          │                  │
//                          └──────────── B tunnels <──────── south corridor <────────────┘
//
// Mid doors sit in the mid corridor; catwalk branches below them (T side), as in Dust2.

import { AABB, Vec2, aabb, dist2, rand } from './math';

export interface Rect { x1: number; z1: number; x2: number; z2: number; }
export interface Collider extends AABB { penetrable: boolean; kind: 'wall' | 'door' | 'crate'; }
export interface Waypoint { id: number; pos: Vec2; edges: number[]; }

export const CELL = 1;
const WALL_H = 7;

// ---- walkable regions -------------------------------------------------------
export const REGIONS: Record<string, Rect> = {
  ctSpawn:    { x1: -16, z1: -62, x2: 16,  z2: -40 },
  aSite:      { x1: 30,  z1: -56, x2: 62,  z2: -24 },
  longA:      { x1: 52,  z1: -24, x2: 64,  z2: 62 },   // includes outside long down to T ramp
  tSpawn:     { x1: 18,  z1: 52,  x2: 56,  z2: 76 },
  southCorr:  { x1: -36, z1: 52,  x2: 18,  z2: 64 },   // T spawn -> mid (suicide) & tunnels
  mid:        { x1: -6,  z1: -40, x2: 6,   z2: 52 },
  catwalk:    { x1: 6,   z1: 12,  x2: 30,  z2: 20 },
  shortA:     { x1: 24,  z1: -24, x2: 32,  z2: 20 },   // short stairs up to A
  ctToA:      { x1: 16,  z1: -52, x2: 30,  z2: -44 },   // CT ramp into A
  bSite:      { x1: -62, z1: -56, x2: -30, z2: -24 },
  bTunnels:   { x1: -38, z1: -24, x2: -26, z2: 52 },   // upper + lower tunnels
  ctToB:      { x1: -30, z1: -52, x2: -16, z2: -44 },   // B doors from CT
};

export const BOMB_SITES: Record<'A' | 'B', Rect> = {
  A: { x1: 36, z1: -52, x2: 58, z2: -28 },
  B: { x1: -58, z1: -52, x2: -34, z2: -28 },
};

export const CT_SPAWNS: Vec2[] = [
  { x: -8, z: -56 }, { x: -3, z: -58 }, { x: 2, z: -56 }, { x: 7, z: -58 }, { x: 0, z: -50 },
];
export const T_SPAWNS: Vec2[] = [
  { x: 26, z: 60 }, { x: 32, z: 64 }, { x: 38, z: 60 }, { x: 44, z: 64 }, { x: 36, z: 70 },
];

// ---- doors (solid for movement, bullets penetrate with damage falloff) ------
interface DoorSpec { box: AABB; }
const DOORS: DoorSpec[] = [
  // Mid doors: two leaves with a 1.8m walkable gap at x=0, z≈8
  { box: aabb(-6, 0, 7.5, -0.9, 3.4, 8.5) },
  { box: aabb(0.9, 0, 7.5, 6, 3.4, 8.5) },
  // Long doors (z≈40), gap at x≈58
  { box: aabb(52, 0, 39.5, 56.8, 3.4, 40.5) },
  { box: aabb(59.2, 0, 39.5, 64, 3.4, 40.5) },
  // B doors (x≈-23), gap at z≈-47
  { box: aabb(-23.5, 0, -52, -22.5, 3.4, -48.2) },
  { box: aabb(-23.5, 0, -45.8, -22.5, 3.4, -44) },
];

// ---- crates / cover ----------------------------------------------------------
interface CrateSpec { x1: number; z1: number; x2: number; z2: number; h: number; }
export const CRATES: CrateSpec[] = [
  // A site
  { x1: 40, z1: -46, x2: 44, z2: -42, h: 2.0 },   // default box
  { x1: 56, z1: -52, x2: 60, z2: -48, h: 1.0 },   // goose
  { x1: 32, z1: -52, x2: 35, z2: -49, h: 1.5 },   // ninja
  { x1: 44, z1: -38, x2: 52, z2: -30, h: 0.5 },   // site platform (step-up)
  { x1: 54, z1: -34, x2: 58, z2: -30, h: 1.0 },
  // B site
  { x1: -52, z1: -46, x2: -46, z2: -40, h: 2.0 },
  { x1: -40, z1: -52, x2: -36, z2: -48, h: 1.0 },
  { x1: -58, z1: -34, x2: -50, z2: -28, h: 0.5 },
  { x1: -44, z1: -32, x2: -40, z2: -28, h: 1.0 },
  // mid / catwalk
  { x1: 0, z1: 14, x2: 3, z2: 17, h: 1.2 },       // xbox
  { x1: -4, z1: -12, x2: -1, z2: -9, h: 1.0 },
  // long
  { x1: 54, z1: 8, x2: 58, z2: 12, h: 1.0 },
  { x1: 56, z1: 26, x2: 60, z2: 30, h: 1.0 },
  // tunnels
  { x1: -34, z1: 18, x2: -30, z2: 22, h: 1.0 },
  { x1: -36, z1: -8, x2: -32, z2: -4, h: 1.0 },
  // spawns
  { x1: -4, z1: -58, x2: 2, z2: -54, h: 1.0 },
  { x1: 30, z1: 66, x2: 36, z2: 70, h: 1.0 },
];

// ---- waypoints for AI navigation --------------------------------------------
const WP_POS: Vec2[] = [
  { x: 36, z: 64 },   // 0  T spawn
  { x: 58, z: 56 },   // 1  T ramp / outside long
  { x: 58, z: 44 },   // 2  long doors (south)
  { x: 58, z: 36 },   // 3  long doors (north)
  { x: 58, z: 12 },   // 4  long mid
  { x: 58, z: -14 },  // 5  long north / pit
  { x: 46, z: -40 },  // 6  A site center
  { x: 42, z: -48 },  // 7  A default
  { x: 58, z: -50 },  // 8  goose
  { x: 28, z: -16 },  // 9  short top
  { x: 28, z: 2 },    // 10 short mid
  { x: 18, z: 16 },   // 11 catwalk
  { x: 1, z: 18 },    // 12 xbox (below mid doors)
  { x: 0, z: 32 },    // 13 lower mid
  { x: 0, z: 12 },    // 14 mid doors (south)
  { x: 0, z: 4 },     // 15 mid doors (north)
  { x: 0, z: -16 },   // 16 upper mid
  { x: 0, z: -36 },   // 17 CT mid
  { x: 0, z: -52 },   // 18 CT spawn
  { x: 23, z: -48 },  // 19 CT -> A ramp
  { x: -23, z: -47 }, // 20 B doors gap
  { x: -46, z: -40 }, // 21 B site center
  { x: -50, z: -46 }, // 22 B default
  { x: -32, z: -12 }, // 23 upper tunnels
  { x: -32, z: 22 },  // 24 tunnels mid
  { x: -32, z: 44 },  // 25 lower tunnels
  { x: -18, z: 58 },  // 26 south corridor west
  { x: 0, z: 58 },    // 27 south corridor / suicide
  { x: 34, z: -32 },  // 28 A site south (short entrance)
  { x: -34, z: -30 }, // 29 B site tunnels entrance
  { x: 48, z: -30 },  // 30 A site long entrance
  { x: 12, z: -48 },  // 31 CT spawn east
  { x: -12, z: -48 }, // 32 CT spawn west
];

export interface GameMap {
  colliders: Collider[];
  walls: Collider[];
  doors: Collider[];
  crates: Collider[];
  waypoints: Waypoint[];
  grid: Uint8Array;
  gx0: number; gz0: number; gw: number; gh: number;
  bounds: Rect;
  isWalkable(x: number, z: number): boolean;
  lineWalkable(a: Vec2, b: Vec2, radius?: number): boolean;
  siteAt(x: number, z: number): 'A' | 'B' | null;
  nearestWaypoint(p: Vec2): number;
  randomWalkableNear(p: Vec2, r: number): Vec2;
}

export function buildMap(): GameMap {
  const rects = Object.values(REGIONS);
  const bounds: Rect = { x1: -64, z1: -64, x2: 66, z2: 78 };
  const gx0 = bounds.x1, gz0 = bounds.z1;
  const gw = Math.ceil((bounds.x2 - bounds.x1) / CELL);
  const gh = Math.ceil((bounds.z2 - bounds.z1) / CELL);
  const grid = new Uint8Array(gw * gh);

  const inRect = (x: number, z: number, r: Rect) => x >= r.x1 && x < r.x2 && z >= r.z1 && z < r.z2;
  for (let gz = 0; gz < gh; gz++) {
    for (let gx = 0; gx < gw; gx++) {
      const cx = gx0 + (gx + 0.5) * CELL, cz = gz0 + (gz + 0.5) * CELL;
      for (const r of rects) if (inRect(cx, cz, r)) { grid[gz * gw + gx] = 1; break; }
    }
  }
  const cellAt = (gx: number, gz: number) => (gx < 0 || gz < 0 || gx >= gw || gz >= gh) ? 0 : grid[gz * gw + gx];
  const isWalkable = (x: number, z: number) => cellAt(Math.floor((x - gx0) / CELL), Math.floor((z - gz0) / CELL)) === 1;

  // Walls: solid cells touching walkable cells (8-neighborhood seals diagonal gaps).
  // Merge horizontal runs of wall cells into single boxes to keep collider count low.
  const wallMark = new Uint8Array(gw * gh);
  for (let gz = 0; gz < gh; gz++) {
    for (let gx = 0; gx < gw; gx++) {
      if (grid[gz * gw + gx]) continue;
      let near = false;
      for (let dz = -1; dz <= 1 && !near; dz++)
        for (let dx = -1; dx <= 1; dx++)
          if (cellAt(gx + dx, gz + dz)) { near = true; break; }
      if (near) wallMark[gz * gw + gx] = 1;
    }
  }
  const walls: Collider[] = [];
  for (let gz = 0; gz < gh; gz++) {
    let runStart = -1;
    for (let gx = 0; gx <= gw; gx++) {
      const on = gx < gw && wallMark[gz * gw + gx] === 1;
      if (on && runStart < 0) runStart = gx;
      if (!on && runStart >= 0) {
        const x1 = gx0 + runStart * CELL, x2 = gx0 + gx * CELL;
        const z1 = gz0 + gz * CELL, z2 = z1 + CELL;
        walls.push({ ...aabb(x1, 0, z1, x2, WALL_H, z2), penetrable: false, kind: 'wall' });
        runStart = -1;
      }
    }
  }

  const doors: Collider[] = DOORS.map(d => ({ ...d.box, penetrable: true, kind: 'door' as const }));
  const crates: Collider[] = CRATES.map(c => ({ ...aabb(c.x1, 0, c.z1, c.x2, c.h, c.z2), penetrable: false, kind: 'crate' as const }));
  const colliders = [...walls, ...doors, ...crates];

  // Waypoint graph: auto-connect pairs whose straight line is walkable and clear of
  // solid colliders (door gaps pass because the line goes through the gap).
  const waypoints: Waypoint[] = WP_POS.map((pos, id) => ({ id, pos, edges: [] }));
  const solidForNav = colliders; // includes doors & crates
  const segClear = (a: Vec2, b: Vec2): boolean => {
    const d = dist2(a, b);
    const steps = Math.ceil(d / 0.4);
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = a.x + (b.x - a.x) * t, z = a.z + (b.z - a.z) * t;
      if (!isWalkable(x, z)) return false;
      // circle (r=0.4) vs solid colliders in 2D
      for (const c of solidForNav) {
        if (c.maxY < 0.3) continue;
        const nx = Math.max(c.minX, Math.min(x, c.maxX));
        const nz = Math.max(c.minZ, Math.min(z, c.maxZ));
        if ((x - nx) ** 2 + (z - nz) ** 2 < 0.4 * 0.4) return false;
      }
    }
    return true;
  };
  for (let i = 0; i < waypoints.length; i++) {
    for (let j = i + 1; j < waypoints.length; j++) {
      const a = waypoints[i].pos, b = waypoints[j].pos;
      if (dist2(a, b) > 30) continue;
      if (segClear(a, b)) { waypoints[i].edges.push(j); waypoints[j].edges.push(i); }
    }
  }
  // ensure no isolated nodes: connect each to nearest reachable other node
  for (const wp of waypoints) {
    if (wp.edges.length === 0) {
      let best = -1, bestD = Infinity;
      for (const o of waypoints) {
        if (o.id === wp.id || o.edges.length === 0) continue;
        const d = dist2(wp.pos, o.pos);
        if (d < bestD && segClear(wp.pos, o.pos)) { bestD = d; best = o.id; }
      }
      if (best >= 0) { wp.edges.push(best); waypoints[best].edges.push(wp.id); }
    }
  }

  const lineWalkable = (a: Vec2, b: Vec2, radius = 0.35): boolean => {
    const d = dist2(a, b);
    const steps = Math.max(1, Math.ceil(d / 0.4));
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = a.x + (b.x - a.x) * t, z = a.z + (b.z - a.z) * t;
      if (!isWalkable(x, z)) return false;
      if (radius > 0) {
        for (const c of colliders) {
          if (c.kind === 'wall' && c.maxY < 0.3) continue;
          const nx = Math.max(c.minX, Math.min(x, c.maxX));
          const nz = Math.max(c.minZ, Math.min(z, c.maxZ));
          if ((x - nx) ** 2 + (z - nz) ** 2 < radius * radius) return false;
        }
      }
    }
    return true;
  };

  const siteAt = (x: number, z: number): 'A' | 'B' | null => {
    for (const key of ['A', 'B'] as const) {
      const r = BOMB_SITES[key];
      if (x >= r.x1 && x <= r.x2 && z >= r.z1 && z <= r.z2) return key;
    }
    return null;
  };

  const nearestWaypoint = (p: Vec2): number => {
    let best = 0, bestD = Infinity;
    for (const wp of waypoints) {
      const d = dist2(p, wp.pos);
      if (d < bestD) { bestD = d; best = wp.id; }
    }
    return best;
  };

  const randomWalkableNear = (p: Vec2, r: number): Vec2 => {
    for (let i = 0; i < 24; i++) {
      const x = p.x + rand(-r, r), z = p.z + rand(-r, r);
      if (isWalkable(x, z) && lineWalkable(p, { x, z }, 0.3)) return { x, z };
    }
    return { ...p };
  };

  return { colliders, walls, doors, crates, waypoints, grid, gx0, gz0, gw, gh, bounds, isWalkable, lineWalkable, siteAt, nearestWaypoint, randomWalkableNear };
}

// A* over the waypoint graph. Returns list of positions from start (exclusive) to goal.
export function findPath(map: GameMap, from: Vec2, to: Vec2): Vec2[] {
  const wps = map.waypoints;
  const start = map.nearestWaypoint(from);
  const goal = map.nearestWaypoint(to);
  if (start === goal) return [{ ...to }];
  const open: number[] = [start];
  const gScore = new Map<number, number>([[start, 0]]);
  const fScore = new Map<number, number>([[start, dist2(wps[start].pos, wps[goal].pos)]]);
  const came = new Map<number, number>();
  const closed = new Set<number>();
  while (open.length) {
    let bi = 0;
    for (let i = 1; i < open.length; i++) if ((fScore.get(open[i]) ?? Infinity) < (fScore.get(open[bi]) ?? Infinity)) bi = i;
    const cur = open.splice(bi, 1)[0];
    if (cur === goal) {
      const path: Vec2[] = [{ ...to }];
      let n = goal;
      while (came.has(n)) { path.unshift({ ...wps[n].pos }); n = came.get(n)!; }
      // drop the first node if we can go directly from `from` to the second
      if (path.length > 1 && map.lineWalkable(from, path[1], 0.3)) path.shift();
      return path;
    }
    closed.add(cur);
    for (const nb of wps[cur].edges) {
      if (closed.has(nb)) continue;
      const g = (gScore.get(cur) ?? Infinity) + dist2(wps[cur].pos, wps[nb].pos);
      if (g < (gScore.get(nb) ?? Infinity)) {
        came.set(nb, cur);
        gScore.set(nb, g);
        fScore.set(nb, g + dist2(wps[nb].pos, wps[goal].pos));
        if (!open.includes(nb)) open.push(nb);
      }
    }
  }
  return [{ ...to }]; // unreachable: caller's stuck-handling will cope
}
