// Horizontal collision for a vertical-cylinder actor (radius r) against the wall
// grid and crate boxes, plus ground-height sampling for standing on crates.

import { Crate } from './dust2';
import { MapGrid } from './grid';

// Push a circle (cx,cz,r) out of an AABB if overlapping. Returns corrected center.
function pushOutAABB(
  cx: number, cz: number, r: number,
  minX: number, minZ: number, maxX: number, maxZ: number,
): { x: number; z: number } | null {
  const closestX = cx < minX ? minX : cx > maxX ? maxX : cx;
  const closestZ = cz < minZ ? minZ : cz > maxZ ? maxZ : cz;
  const dx = cx - closestX;
  const dz = cz - closestZ;
  const d2 = dx * dx + dz * dz;
  if (d2 > r * r) return null; // no overlap

  if (d2 > 1e-8) {
    const d = Math.sqrt(d2);
    const push = r - d;
    return { x: cx + (dx / d) * push, z: cz + (dz / d) * push };
  }
  // Center inside the box: push along the least-penetration axis.
  const penL = cx - minX;
  const penR = maxX - cx;
  const penT = cz - minZ;
  const penB = maxZ - cz;
  const minPen = Math.min(penL, penR, penT, penB);
  if (minPen === penL) return { x: minX - r, z: cz };
  if (minPen === penR) return { x: maxX + r, z: cz };
  if (minPen === penT) return { x: cx, z: minZ - r };
  return { x: cx, z: maxZ + r };
}

// Resolve against wall cells overlapping the circle's neighborhood.
export function collideWalls(grid: MapGrid, x: number, z: number, r: number): { x: number; z: number } {
  const cs = grid.cell;
  let px = x;
  let pz = z;
  for (let iter = 0; iter < 3; iter++) {
    const c0 = grid.cellOf(px - r, pz - r);
    const c1 = grid.cellOf(px + r, pz + r);
    let moved = false;
    for (let cz = c0.cz; cz <= c1.cz; cz++) {
      for (let cx = c0.cx; cx <= c1.cx; cx++) {
        if (!grid.isWall(cx, cz)) continue;
        const minX = grid.originX + cx * cs;
        const minZ = grid.originZ + cz * cs;
        const res = pushOutAABB(px, pz, r, minX, minZ, minX + cs, minZ + cs);
        if (res) {
          px = res.x;
          pz = res.z;
          moved = true;
        }
      }
    }
    if (!moved) break;
  }
  return { x: px, z: pz };
}

// Resolve against crates that the actor cannot stand on at its current feet Y.
export function collideCrates(
  crates: Crate[], x: number, z: number, r: number, feetY: number,
): { x: number; z: number } {
  let px = x;
  let pz = z;
  for (let iter = 0; iter < 2; iter++) {
    let moved = false;
    for (const cr of crates) {
      if (cr.height <= feetY + 0.15) continue; // standing on / above it
      const res = pushOutAABB(px, pz, r, cr.x - cr.hx, cr.z - cr.hz, cr.x + cr.hx, cr.z + cr.hz);
      if (res) {
        px = res.x;
        pz = res.z;
        moved = true;
      }
    }
    if (!moved) break;
  }
  return { x: px, z: pz };
}

// Highest crate top under the actor's footprint, else 0 (floor).
export function groundHeightAt(crates: Crate[], x: number, z: number, r: number): number {
  let h = 0;
  for (const cr of crates) {
    // Standing counts if the actor center is over the (slightly shrunk) top face.
    const mx = cr.hx - r * 0.5;
    const mz = cr.hz - r * 0.5;
    if (
      x >= cr.x - mx && x <= cr.x + mx &&
      z >= cr.z - mz && z <= cr.z + mz
    ) {
      if (cr.height > h) h = cr.height;
    }
  }
  return h;
}

// 3D ray vs crate boxes: nearest hit distance within maxT, or maxT if none.
// Used for bullet clipping and line-of-sight through the (partial-height) crates.
export function rayCrateDistance(
  crates: Crate[],
  ox: number, oy: number, oz: number,
  dx: number, dy: number, dz: number,
  maxT: number,
): number {
  let best = maxT;
  for (const cr of crates) {
    const t = rayBox3(
      ox, oy, oz, dx, dy, dz,
      cr.x - cr.hx, 0, cr.z - cr.hz,
      cr.x + cr.hx, cr.height, cr.z + cr.hz,
    );
    if (t >= 0 && t < best) best = t;
  }
  return best;
}

function rayBox3(
  ox: number, oy: number, oz: number,
  dx: number, dy: number, dz: number,
  minX: number, minY: number, minZ: number,
  maxX: number, maxY: number, maxZ: number,
): number {
  const o = [ox, oy, oz];
  const d = [dx, dy, dz];
  const mn = [minX, minY, minZ];
  const mx = [maxX, maxY, maxZ];
  let tmin = -Infinity;
  let tmax = Infinity;
  for (let a = 0; a < 3; a++) {
    if (Math.abs(d[a]) < 1e-8) {
      if (o[a] < mn[a] || o[a] > mx[a]) return -1;
    } else {
      const inv = 1 / d[a];
      let t1 = (mn[a] - o[a]) * inv;
      let t2 = (mx[a] - o[a]) * inv;
      if (t1 > t2) {
        const tmp = t1;
        t1 = t2;
        t2 = tmp;
      }
      if (t1 > tmin) tmin = t1;
      if (t2 < tmax) tmax = t2;
      if (tmin > tmax) return -1;
    }
  }
  if (tmax < 0) return -1;
  return tmin >= 0 ? tmin : tmax;
}
