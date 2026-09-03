import type { Wall, ZoneId } from './types';

// World units: meters-ish. Map spans x:[0,64], z:[0,64].
// Layout (top-down, +x east, +z south):
//   T spawn west, CT spawn east, A site north-east, B site south-east,
//   mid runs center with a door, catwalk north of mid, tunnel south to B.

export interface Waypoint { x: number; z: number; zone: ZoneId; links: number[]; }

export const T_SPAWN = [
  { x: 6, z: 26 }, { x: 6, z: 30 }, { x: 6, z: 34 }, { x: 8, z: 28 }, { x: 8, z: 32 },
];
export const CT_SPAWN = [
  { x: 58, z: 26 }, { x: 58, z: 30 }, { x: 58, z: 34 }, { x: 56, z: 28 }, { x: 56, z: 32 },
];

export const SITE_A = { x1: 46, z1: 8, x2: 60, z2: 20 };
export const SITE_B = { x1: 46, z1: 44, x2: 60, z2: 56 };

// h = wall height. Crates h=1.2 (blocks movement, can shoot over from standing? no: treated as full blockers).
export const WALLS: Wall[] = [
  // outer bounds
  { x1: 0, z1: 0, x2: 64, z2: 1, h: 6 },
  { x1: 0, z1: 63, x2: 64, z2: 64, h: 6 },
  { x1: 0, z1: 0, x2: 1, z2: 64, h: 6 },
  { x1: 63, z1: 0, x2: 64, z2: 64, h: 6 },
  // long (north corridor walls)
  { x1: 12, z1: 12, x2: 44, z2: 13.5, h: 5 },
  { x1: 12, z1: 21, x2: 40, z2: 22.5, h: 5 },
  { x1: 40, z1: 13.5, x2: 41.5, z2: 21, h: 5 },
  // long corner crates
  { x1: 36, z1: 16, x2: 38, z2: 18, h: 1.3 },
  { x1: 24, z1: 18.5, x2: 26, z2: 20.5, h: 1.3 },
  // A site back wall segments + goose corner
  { x1: 44, z1: 6, x2: 62, z2: 7.5, h: 5 },
  { x1: 60.5, z1: 7.5, x2: 62, z2: 22, h: 5 },
  { x1: 50, z1: 9, x2: 52, z2: 11, h: 1.3 },
  // mid walls (leave door gap at x 30..33)
  { x1: 24, z1: 27, x2: 30, z2: 28.5, h: 5 },
  { x1: 33, z1: 27, x2: 44, z2: 28.5, h: 5 },
  { x1: 24, z1: 35.5, x2: 44, z2: 37, h: 5 },
  // mid door body (passable gap flanked by posts; door panel itself blocks sight/fire until... static closed panel with side gaps)
  { x1: 30, z1: 28.5, x2: 30.6, z2: 35.5, h: 5 },
  { x1: 32.4, z1: 28.5, x2: 33, z2: 35.5, h: 5 },
  { x1: 30.6, z1: 31.4, x2: 32.4, z2: 32.2, h: 4.2 },
  // catwalk (north of mid, raised visual only; walls)
  { x1: 24, z1: 23, x2: 44, z2: 24, h: 5 },
  { x1: 43, z1: 24, x2: 44, z2: 27, h: 5 },
  // tunnel to B (south)
  { x1: 24, z1: 40, x2: 44, z2: 41.5, h: 5 },
  { x1: 24, z1: 48, x2: 40, z2: 49.5, h: 5 },
  { x1: 40, z1: 41.5, x2: 41.5, z2: 49.5, h: 5 },
  { x1: 30, z1: 44, x2: 32, z2: 46, h: 1.3 },
  // B site walls + crates
  { x1: 44, z1: 56.5, x2: 62, z2: 58, h: 5 },
  { x1: 60.5, z1: 42, x2: 62, z2: 56.5, h: 5 },
  { x1: 50, z1: 48, x2: 52.5, z2: 50.5, h: 1.3 },
  { x1: 54, z1: 51, x2: 56, z2: 53, h: 1.3 },
  // CT spawn cover
  { x1: 54, z1: 24, x2: 56, z2: 26, h: 1.3 },
  { x1: 54, z1: 38, x2: 56, z2: 40, h: 1.3 },
];

export const WAYPOINTS: Waypoint[] = [
  { x: 7, z: 30, zone: 't-spawn', links: [1, 2, 3] },
  { x: 17, z: 17, zone: 'long', links: [0, 4, 5] },
  { x: 17, z: 32, zone: 'mid', links: [0, 5, 6, 8] },
  { x: 17, z: 45, zone: 'tunnel', links: [0, 8, 9] },
  { x: 33, z: 17, zone: 'long', links: [1, 7, 10] },
  { x: 27, z: 25.5, zone: 'catwalk', links: [1, 2, 7] },
  { x: 27, z: 32, zone: 'mid-door', links: [2, 5, 11] },
  { x: 38, z: 25.5, zone: 'catwalk', links: [4, 5, 10, 13] },
  { x: 27, z: 44.5, zone: 'tunnel', links: [2, 3, 6, 12] },
  { x: 36, z: 44.5, zone: 'tunnel', links: [3, 8, 12] },
  { x: 48, z: 14, zone: 'site-a', links: [4, 7, 13] },
  { x: 36, z: 32, zone: 'mid-door', links: [6, 13, 14] },
  { x: 46, z: 50, zone: 'site-b', links: [8, 9, 14] },
  { x: 48, z: 30, zone: 'ct-spawn', links: [7, 10, 11, 14, 15] },
  { x: 48, z: 44, zone: 'ct-spawn', links: [11, 12, 13] },
  { x: 57, z: 30, zone: 'ct-spawn', links: [13] },
];

function segHitsWall(ax: number, az: number, bx: number, bz: number, h: number): boolean {
  for (const w of WALLS) {
    if (w.h < h) continue;
    // segment vs rect intersection (slab test in 2D)
    const minx = Math.min(w.x1, w.x2), maxx = Math.max(w.x1, w.x2);
    const minz = Math.min(w.z1, w.z2), maxz = Math.max(w.z1, w.z2);
    const dx = bx - ax, dz = bz - az;
    let t0 = 0, t1 = 1;
    if (Math.abs(dx) < 1e-9) {
      if (ax < minx || ax > maxx) continue;
    } else {
      let ta = (minx - ax) / dx, tb = (maxx - ax) / dx;
      if (ta > tb) { const t = ta; ta = tb; tb = t; }
      t0 = Math.max(t0, ta); t1 = Math.min(t1, tb);
      if (t0 > t1) continue;
    }
    if (Math.abs(dz) < 1e-9) {
      if (az < minz || az > maxz) continue;
    } else {
      let ta = (minz - az) / dz, tb = (maxz - az) / dz;
      if (ta > tb) { const t = ta; ta = tb; tb = t; }
      t0 = Math.max(t0, ta); t1 = Math.min(t1, tb);
      if (t0 > t1) continue;
    }
    return true;
  }
  return false;
}

/** Eye-level line of sight (blocked by tall walls only). */
export function hasLOS(ax: number, az: number, bx: number, bz: number): boolean {
  return !segHitsWall(ax, az, bx, bz, 1.6);
}

/** Movement blocked if segment crosses any wall (crates included). */
export function moveBlocked(ax: number, az: number, bx: number, bz: number): boolean {
  return segHitsWall(ax, az, bx, bz, 0.5);
}

export function pointBlocked(x: number, z: number, r: number): boolean {
  for (const w of WALLS) {
    const minx = Math.min(w.x1, w.x2) - r, maxx = Math.max(w.x1, w.x2) + r;
    const minz = Math.min(w.z1, w.z2) - r, maxz = Math.max(w.z1, w.z2) + r;
    if (x > minx && x < maxx && z > minz && z < maxz) return true;
  }
  return x < 1 + r || x > 63 - r || z < 1 + r || z > 63 - r;
}

export function nearestWP(x: number, z: number): number {
  let best = 0, bd = 1e9;
  WAYPOINTS.forEach((w, i) => {
    const d = (w.x - x) * (w.x - x) + (w.z - z) * (w.z - z);
    if (d < bd) { bd = d; best = i; }
  });
  return best;
}

/** BFS path of waypoint indices. */
export function findPath(from: number, to: number): number[] {
  if (from === to) return [from];
  const prev = new Array(WAYPOINTS.length).fill(-1);
  const q = [from];
  prev[from] = from;
  while (q.length) {
    const c = q.shift() as number;
    for (const n of WAYPOINTS[c].links) {
      if (prev[n] !== -1) continue;
      prev[n] = c;
      if (n === to) {
        const path = [to];
        let p = to;
        while (p !== from) { p = prev[p]; path.unshift(p); }
        return path;
      }
      q.push(n);
    }
  }
  return [from];
}

export function inRect(x: number, z: number, r: { x1: number; z1: number; x2: number; z2: number }): boolean {
  return x >= r.x1 && x <= r.x2 && z >= r.z1 && z <= r.z2;
}
