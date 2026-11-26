import { HitboxZone, Vec3 } from './types';

interface LocalHitbox {
  zone: HitboxZone;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
}

/**
 * Standing humanoid local hitboxes aligned with the articulated 3D humanoid mesh (height = 1.80m).
 * Local space: +Z = forward (wait: in Three.js camera looks along -Z, so character faces -Z when yaw = 0),
 * +X = character right, +Y = up from feet.
 */
const STANDING_HITBOXES: LocalHitbox[] = [
  // Head (helmet/skull): y 1.50 .. 1.84
  { zone: 'head', minX: -0.15, maxX: 0.15, minY: 1.5, maxY: 1.84, minZ: -0.15, maxZ: 0.15 },
  // Chest (upper torso / vest): y 1.15 .. 1.50
  { zone: 'chest', minX: -0.23, maxX: 0.23, minY: 1.15, maxY: 1.5, minZ: -0.15, maxZ: 0.15 },
  // Stomach (lower torso / pelvis): y 0.84 .. 1.15
  { zone: 'stomach', minX: -0.21, maxX: 0.21, minY: 0.84, maxY: 1.15, minZ: -0.14, maxZ: 0.14 },
  // Left Arm (extended slightly forward in weapon stance)
  { zone: 'arm', minX: -0.37, maxX: -0.21, minY: 1.0, maxY: 1.48, minZ: -0.26, maxZ: 0.12 },
  // Right Arm
  { zone: 'arm', minX: 0.21, maxX: 0.37, minY: 1.0, maxY: 1.48, minZ: -0.26, maxZ: 0.12 },
  // Left Leg
  { zone: 'leg', minX: -0.22, maxX: -0.02, minY: 0.0, maxY: 0.84, minZ: -0.14, maxZ: 0.14 },
  // Right Leg
  { zone: 'leg', minX: 0.02, maxX: 0.22, minY: 0.0, maxY: 0.84, minZ: -0.14, maxZ: 0.14 },
];

const CROUCHING_HITBOXES: LocalHitbox[] = [
  { zone: 'head', minX: -0.15, maxX: 0.15, minY: 1.04, maxY: 1.36, minZ: -0.18, maxZ: 0.12 },
  { zone: 'chest', minX: -0.24, maxX: 0.24, minY: 0.72, maxY: 1.04, minZ: -0.17, maxZ: 0.15 },
  { zone: 'stomach', minX: -0.22, maxX: 0.22, minY: 0.48, maxY: 0.72, minZ: -0.16, maxZ: 0.16 },
  { zone: 'arm', minX: -0.38, maxX: -0.22, minY: 0.62, maxY: 1.02, minZ: -0.28, maxZ: 0.12 },
  { zone: 'arm', minX: 0.22, maxX: 0.38, minY: 0.62, maxY: 1.02, minZ: -0.28, maxZ: 0.12 },
  { zone: 'leg', minX: -0.23, maxX: -0.02, minY: 0.0, maxY: 0.48, minZ: -0.22, maxZ: 0.18 },
  { zone: 'leg', minX: 0.02, maxX: 0.23, minY: 0.0, maxY: 0.48, minZ: -0.22, maxZ: 0.18 },
];

export interface CharacterHitResult {
  distance: number;
  zone: HitboxZone;
  point: Vec3;
}

function intersectRayBoxLocal(
  ox: number,
  oy: number,
  oz: number,
  dx: number,
  dy: number,
  dz: number,
  b: LocalHitbox,
  maxDist: number
): number | null {
  const invX = Math.abs(dx) > 1e-8 ? 1 / dx : 1e12;
  const invY = Math.abs(dy) > 1e-8 ? 1 / dy : 1e12;
  const invZ = Math.abs(dz) > 1e-8 ? 1 / dz : 1e12;

  let tx1 = (b.minX - ox) * invX;
  let tx2 = (b.maxX - ox) * invX;
  if (tx1 > tx2) {
    const t = tx1;
    tx1 = tx2;
    tx2 = t;
  }

  let ty1 = (b.minY - oy) * invY;
  let ty2 = (b.maxY - oy) * invY;
  if (ty1 > ty2) {
    const t = ty1;
    ty1 = ty2;
    ty2 = t;
  }

  let tz1 = (b.minZ - oz) * invZ;
  let tz2 = (b.maxZ - oz) * invZ;
  if (tz1 > tz2) {
    const t = tz1;
    tz1 = tz2;
    tz2 = t;
  }

  const tmin = Math.max(tx1, ty1, tz1);
  const tmax = Math.min(tx2, ty2, tz2);

  if (tmax >= Math.max(0, tmin) && tmin >= 0 && tmin < maxDist) {
    return tmin;
  }
  return null;
}

/**
 * Tests a world-space ray against an articulated humanoid's 5 anatomical hitbox zones (OBB rotated by yaw).
 * Priority tie-break favors head/chest if two boxes overlap nearly identically along a grazing shot.
 */
export function raycastCharacterHitboxes(
  origin: Vec3,
  dir: Vec3,
  maxDist: number,
  charPos: Vec3,
  charYaw: number,
  crouching: boolean
): CharacterHitResult | null {
  // Quick bounding sphere rejection
  const cy = charPos.y + (crouching ? 0.68 : 0.92);
  const toX = charPos.x - origin.x;
  const toY = cy - origin.y;
  const toZ = charPos.z - origin.z;
  const proj = toX * dir.x + toY * dir.y + toZ * dir.z;
  if (proj < -1.1 || proj > maxDist + 1.1) return null;
  const closestDistSq = toX * toX + toY * toY + toZ * toZ - Math.max(0, proj) * Math.max(0, proj);
  if (closestDistSq > 1.35 * 1.35) return null;

  // Transform ray into character's yaw-local frame (character rotates by +yaw around Y)
  const cosY = Math.cos(-charYaw);
  const sinY = Math.sin(-charYaw);

  const rx = origin.x - charPos.x;
  const ry = origin.y - charPos.y;
  const rz = origin.z - charPos.z;

  const lox = rx * cosY + rz * sinY;
  const loy = ry;
  const loz = -rx * sinY + rz * cosY;

  const ldx = dir.x * cosY + dir.z * sinY;
  const ldy = dir.y;
  const ldz = -dir.x * sinY + dir.z * cosY;

  const boxes = crouching ? CROUCHING_HITBOXES : STANDING_HITBOXES;
  let bestT = maxDist;
  let bestZone: HitboxZone | null = null;

  for (let i = 0; i < boxes.length; i++) {
    const b = boxes[i];
    const t = intersectRayBoxLocal(lox, loy, loz, ldx, ldy, ldz, b, bestT + 0.08);
    if (t !== null) {
      // Slightly prefer head over adjacent shoulders if within 6cm along ray
      const preferHead = b.zone === 'head' && bestZone !== 'head' && t <= bestT + 0.06;
      if (t < bestT || preferHead) {
        bestT = t;
        bestZone = b.zone;
      }
    }
  }

  if (!bestZone) return null;
  return {
    distance: bestT,
    zone: bestZone,
    point: {
      x: origin.x + dir.x * bestT,
      y: origin.y + dir.y * bestT,
      z: origin.z + dir.z * bestT,
    },
  };
}
