import * as THREE from 'three';
import type { Team, Vec2 } from './types';
import { A_SITE_CENTER, B_SITE_CENTER } from './config';

export interface SolidBox {
  min: THREE.Vector3;
  max: THREE.Vector3;
  color: number;
  kind: 'wall' | 'crate' | 'door' | 'ground';
}

export interface MinimapWall {
  x0: number;
  z0: number;
  x1: number;
  z1: number;
}

const WALL_COLOR = 0xb89a6a;
const CRATE_COLOR = 0x9c7a4a;
const DOOR_COLOR = 0x7a5a30;

// ---- helpers -------------------------------------------------------------

function hWall(z: number, x0: number, x1: number, t = 1, h = 4.4): SolidBox {
  return {
    min: new THREE.Vector3(Math.min(x0, x1), 0, z - t / 2),
    max: new THREE.Vector3(Math.max(x0, x1), h, z + t / 2),
    color: WALL_COLOR,
    kind: 'wall',
  };
}

function vWall(x: number, z0: number, z1: number, t = 1, h = 4.4): SolidBox {
  return {
    min: new THREE.Vector3(x - t / 2, 0, Math.min(z0, z1)),
    max: new THREE.Vector3(x + t / 2, h, Math.max(z0, z1)),
    color: WALL_COLOR,
    kind: 'wall',
  };
}

function crate(cx: number, cz: number, sx: number, sy: number, sz: number): SolidBox {
  return {
    min: new THREE.Vector3(cx - sx / 2, 0, cz - sz / 2),
    max: new THREE.Vector3(cx + sx / 2, sy, cz + sz / 2),
    color: CRATE_COLOR,
    kind: 'crate',
  };
}

function door(z: number, x0: number, x1: number, h = 3.2): SolidBox {
  return {
    min: new THREE.Vector3(Math.min(x0, x1), 0, z - 0.12),
    max: new THREE.Vector3(Math.max(x0, x1), h, z + 0.12),
    color: DOOR_COLOR,
    kind: 'door',
  };
}

// ---- build the Dust2-style layout ----------------------------------------

const walls: SolidBox[] = [];
const crates: SolidBox[] = [];
const doors: SolidBox[] = [];

function add(w: SolidBox): void {
  if (w.kind === 'crate') crates.push(w);
  else if (w.kind === 'door') doors.push(w);
  else walls.push(w);
}

// Outer boundary (playable interior: x[-40,40], z[-34,24])
add(hWall(-34, -40.5, 40.5));
add(hWall(24, -40.5, 40.5));
add(vWall(-40, -34, 24));
add(vWall(40, -34, 24));

// Top-zone room dividers (A site | CT spawn | B site), gaps z[-26,-20]
add(vWall(-10, -34, -26));
add(vWall(-10, -20, -14));
add(vWall(10, -34, -26));
add(vWall(10, -20, -14));

// Boundary wall between top zone (z<-14) and lanes (z>-12), with gaps:
//   A-long gap [-36,-30], catwalk gap [-16,-12], mid-door gap [-3,3], B-tunnel gap [30,36]
add(hWall(-14, -40, -36));
add(hWall(-14, -30, -16));
add(hWall(-14, -12, -3));
add(hWall(-14, 3, 30));
add(hWall(-14, 36, 40));

// Mid doors: shoot-through wooden double door (blocks movement + AI LOS)
doors.push(door(-14, -3, 3));

// Lane separators (z[-12,12])
add(vWall(-30, -12, 12));       // A long | middle-left
add(vWall(-4, -12, -9));        // mid west wall (catwalk gap z[-9,-5])
add(vWall(-4, -5, 12));
add(vWall(4, -12, 6));          // mid east wall (lower-tunnel gap z[6,10])
add(vWall(4, 10, 12));
add(vWall(30, -12, 6));         // B tunnels west wall (lower-tunnel gap z[6,10])
add(vWall(30, 10, 12));

// Middle-left region blocks (catwalk carved out as an L corridor):
//   catwalk horizontal x[-16,-4] z[-9,-5]; catwalk vertical x[-16,-12] z[-14,-9]
// Middle-right region blocks (lower tunnels corridor z[6,10]).
function box(x0: number, z0: number, x1: number, z1: number, h = 4.4): SolidBox {
  return {
    min: new THREE.Vector3(Math.min(x0, x1), 0, Math.min(z0, z1)),
    max: new THREE.Vector3(Math.max(x0, x1), h, Math.max(z0, z1)),
    color: WALL_COLOR,
    kind: 'wall',
  };
}

walls.push(box(-30, -5, -4, 12));   // middle-left south block
walls.push(box(-12, -14, -4, -9));  // middle-left north block
walls.push(box(-30, -14, -16, -5)); // middle-left west block

walls.push(box(4, -12, 30, 6));   // middle-right north block
walls.push(box(4, 10, 30, 12));   // middle-right south block

// ---- crates for cover ----------------------------------------------------

crates.push(crate(-30, -24, 3, 3, 3)); // A big box
crates.push(crate(-23, -17, 2, 2, 2));
crates.push(crate(-18, -26, 2, 2, 2));
crates.push(crate(-13, -17, 2, 2, 2));
crates.push(crate(28, -26, 3, 3, 3));  // B box
crates.push(crate(22, -17, 2, 2, 2));
crates.push(crate(32, -17, 2, 2, 2));
crates.push(crate(0, 0, 2, 2, 2));     // mid "xbox"
crates.push(crate(-8, -7, 1.6, 1.6, 1.6));
crates.push(crate(-34, -5, 2, 2, 2));  // long corner
crates.push(crate(13, 19, 2, 2, 2));
crates.push(crate(22, 19, 2, 2, 2));
crates.push(crate(-5, -28, 2, 2, 2));
crates.push(crate(5, -28, 2, 2, 2));
crates.push(crate(20, -8, 2, 2, 2));   // upper tunnels cover

// ---- spawn points ---------------------------------------------------------

export const T_SPAWNS: Vec2[] = [
  { x: 14, z: 20 }, { x: 20, z: 20 }, { x: 26, z: 20 },
  { x: 18, z: 16 }, { x: 26, z: 16 },
];

export const CT_SPAWNS: Vec2[] = [
  { x: -6, z: -28 }, { x: 0, z: -28 }, { x: 6, z: -28 },
  { x: -4, z: -23 }, { x: 4, z: -23 },
];

export function spawnFor(team: Team, index: number): Vec2 {
  const arr = team === 'T' ? T_SPAWNS : CT_SPAWNS;
  return arr[index % arr.length];
}

export const SITES = {
  A: { center: A_SITE_CENTER, radius: 9 },
  B: { center: B_SITE_CENTER, radius: 9 },
};

export function siteAt(x: number, z: number): 'A' | 'B' | null {
  for (const key of ['A', 'B'] as const) {
    const s = SITES[key];
    const dx = x - s.center.x;
    const dz = z - s.center.z;
    if (dx * dx + dz * dz <= s.radius * s.radius) return key;
  }
  return null;
}

// ---- collider lists -------------------------------------------------------

export const allSolids: SolidBox[] = [...walls, ...crates, ...doors];
/** boxes that stop bullets (doors are penetrable) */
export const bulletBlockers: SolidBox[] = [...walls, ...crates];
/** boxes that block AI line-of-sight (doors block too) */
export const sightBlockers: SolidBox[] = allSolids;
/** boxes that block movement */
export const moveBlockers: SolidBox[] = allSolids;

// ---- minimap outline ------------------------------------------------------

function toMinimap(b: SolidBox): MinimapWall {
  return { x0: b.min.x, z0: b.min.z, x1: b.max.x, z1: b.max.z };
}

export const minimapWalls: MinimapWall[] = [
  ...walls.map(toMinimap),
  ...crates.map(toMinimap),
  { x0: -3, z0: -14.12, x1: 3, z1: -13.88 }, // mid door
];

// ---- navigation grid ------------------------------------------------------

export interface NavNode {
  id: number;
  x: number;
  z: number;
  neighbors: number[];
}

const NAV_SPACING = 3;
const NAV_MIN_X = -38;
const NAV_MAX_X = 38;
const NAV_MIN_Z = -32;
const NAV_MAX_Z = 22;

export const navNodes: NavNode[] = [];
const navGrid: (NavNode | null)[][] = [];

function playerFootprintOverlaps(x: number, z: number, boxes: SolidBox[]): boolean {
  const r = 0.65; // player radius + margin
  for (const b of boxes) {
    if (b.min.y > 1.7) continue; // tall wall only matters for footprint anyway
    const cx = Math.max(b.min.x, Math.min(x, b.max.x));
    const cz = Math.max(b.min.z, Math.min(z, b.max.z));
    const dx = x - cx;
    const dz = z - cz;
    if (dx * dx + dz * dz < r * r) return true;
  }
  return false;
}

function segmentClear(x0: number, z0: number, x1: number, z1: number): boolean {
  const steps = Math.ceil(Math.hypot(x1 - x0, z1 - z0) / 0.6);
  for (let i = 0; i <= steps; i++) {
    const t = steps === 0 ? 0 : i / steps;
    const x = x0 + (x1 - x0) * t;
    const z = z0 + (z1 - z0) * t;
    if (playerFootprintOverlaps(x, z, moveBlockers)) return false;
  }
  return true;
}

function buildNav(): void {
  const cols = Math.floor((NAV_MAX_X - NAV_MIN_X) / NAV_SPACING) + 1;
  const rows = Math.floor((NAV_MAX_Z - NAV_MIN_Z) / NAV_SPACING) + 1;
  for (let c = 0; c < cols; c++) {
    navGrid[c] = [];
    for (let r = 0; r < rows; r++) {
      const x = NAV_MIN_X + c * NAV_SPACING;
      const z = NAV_MIN_Z + r * NAV_SPACING;
      if (!playerFootprintOverlaps(x, z, moveBlockers)) {
        const node: NavNode = { id: navNodes.length, x, z, neighbors: [] };
        navNodes.push(node);
        navGrid[c][r] = node;
      } else {
        navGrid[c][r] = null;
      }
    }
  }
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const node = navGrid[c][r];
      if (!node) continue;
      const dirs = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ];
      for (const [dc, dr] of dirs) {
        const nc = c + dc;
        const nr = r + dr;
        if (nc < 0 || nr < 0 || nc >= cols || nr >= rows) continue;
        const other = navGrid[nc][nr];
        if (other && segmentClear(node.x, node.z, other.x, other.z)) {
          node.neighbors.push(other.id);
        }
      }
    }
  }
}

buildNav();

export function nearestNavNode(x: number, z: number): NavNode | null {
  let best: NavNode | null = null;
  let bestD = Infinity;
  for (const n of navNodes) {
    const d = (n.x - x) * (n.x - x) + (n.z - z) * (n.z - z);
    if (d < bestD) {
      bestD = d;
      best = n;
    }
  }
  return best;
}

export function randomNavNode(): NavNode {
  return navNodes[Math.floor(Math.random() * navNodes.length)];
}
