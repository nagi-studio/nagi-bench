import type { Collider, Entity, HitRegion, Vec3, WeaponDef } from './types.ts';
import type { MapData } from './map.ts';
import { raycastWorld } from './map.ts';
import { CFG } from './config.ts';
import { rayAABB, v3 } from './vecmath.ts';

interface LocalBox {
  region: HitRegion;
  min: Vec3;
  max: Vec3;
}

// Humanoid hitboxes in local space (feet at origin, facing -Z). Matches the
// procedural character rig proportions in the render layer.
export const HITBOXES: LocalBox[] = [
  { region: 'head', min: v3(-0.13, 1.5, -0.13), max: v3(0.13, 1.78, 0.13) },
  { region: 'chest', min: v3(-0.24, 1.12, -0.15), max: v3(0.24, 1.48, 0.15) },
  { region: 'stomach', min: v3(-0.21, 0.86, -0.14), max: v3(0.21, 1.12, 0.14) },
  { region: 'arm', min: v3(-0.42, 1.02, -0.2), max: v3(-0.24, 1.46, 0.22) },
  { region: 'arm', min: v3(0.24, 1.02, -0.2), max: v3(0.42, 1.46, 0.22) },
  { region: 'leg', min: v3(-0.22, 0.0, -0.16), max: v3(-0.02, 0.86, 0.18) },
  { region: 'leg', min: v3(0.02, 0.0, -0.16), max: v3(0.22, 0.86, 0.18) },
];

export function eyePos(e: Entity): Vec3 {
  return v3(e.pos.x, e.pos.y + CFG.eyeHeight, e.pos.z);
}

// Transform a world ray into an entity's local frame (rotate by -yaw).
function toLocal(e: Entity, o: Vec3, d: Vec3): { o: Vec3; d: Vec3 } {
  const c = Math.cos(e.yaw), s = Math.sin(e.yaw);
  const ox = o.x - e.pos.x, oy = o.y - e.pos.y, oz = o.z - e.pos.z;
  return {
    o: v3(ox * c + oz * s, oy, -ox * s + oz * c),
    d: v3(d.x * c + d.z * s, d.y, -d.x * s + d.z * c),
  };
}

export function hitTestEntity(e: Entity, o: Vec3, d: Vec3, maxT: number): { region: HitRegion; t: number } | null {
  const { o: lo, d: ld } = toLocal(e, o, d);
  let best: { region: HitRegion; t: number } | null = null;
  for (const b of HITBOXES) {
    const hit = rayAABB(lo, ld, b.min, b.max, maxT);
    if (hit && hit.t > 0.05 && (!best || hit.t < best.t)) {
      best = { region: b.region, t: hit.t };
    }
  }
  return best;
}

export type ShotResult =
  | { kind: 'entity'; entity: Entity; region: HitRegion; t: number; point: Vec3; pens: number }
  | { kind: 'world'; t: number; point: Vec3; normal: Vec3; collider: Collider; pens: number }
  | { kind: 'none'; point: Vec3 };

export function hitscan(map: MapData, entities: Entity[], shooter: Entity, origin: Vec3, dir: Vec3, def: WeaponDef): ShotResult {
  const maxT = def.range;
  const world = raycastWorld(map, origin, dir, maxT);
  const solidT = world.solid ? world.solid.t : maxT;

  let bestEnt: { entity: Entity; region: HitRegion; t: number } | null = null;
  for (const e of entities) {
    if (e.id === shooter.id || !e.alive) continue;
    if (!CFG.friendlyFire && e.team === shooter.team) continue;
    const ht = hitTestEntity(e, origin, dir, solidT);
    if (ht && (!bestEnt || ht.t < bestEnt.t)) bestEnt = { entity: e, region: ht.region, t: ht.t };
  }

  if (bestEnt) {
    const pens = world.pens.filter((p) => p.t < bestEnt!.t).length;
    const point = v3(origin.x + dir.x * bestEnt.t, origin.y + dir.y * bestEnt.t, origin.z + dir.z * bestEnt.t);
    return { kind: 'entity', entity: bestEnt.entity, region: bestEnt.region, t: bestEnt.t, point, pens };
  }
  if (world.solid) {
    const t = world.solid.t;
    const point = v3(origin.x + dir.x * t, origin.y + dir.y * t, origin.z + dir.z * t);
    return { kind: 'world', t, point, normal: world.solid.normal, collider: world.solid.collider, pens: world.pens.length };
  }
  return { kind: 'none', point: v3(origin.x + dir.x * maxT, origin.y + dir.y * maxT, origin.z + dir.z * maxT) };
}

// Spread cone deviation (degrees) applied to a shot direction.
export function applySpread(dir: Vec3, spreadDeg: number): Vec3 {
  if (spreadDeg <= 0) return dir;
  const a = Math.random() * Math.PI * 2;
  const r = Math.sqrt(Math.random()) * spreadDeg * (Math.PI / 180);
  // Build an orthonormal basis around dir.
  const up = Math.abs(dir.y) < 0.99 ? v3(0, 1, 0) : v3(1, 0, 0);
  const rx = dir.y * up.z - dir.z * up.y;
  const ry = dir.z * up.x - dir.x * up.z;
  const rz = dir.x * up.y - dir.y * up.x;
  const rl = Math.hypot(rx, ry, rz) || 1;
  const ux = (rx / rl), uy = (ry / rl), uz = (rz / rl);
  // second basis = dir cross right
  const vx = dir.y * uz - dir.z * uy;
  const vy = dir.z * ux - dir.x * uz;
  const vz = dir.x * uy - dir.y * ux;
  const ox = Math.cos(a) * r, oy = Math.sin(a) * r;
  const nx = dir.x + ux * ox + vx * oy;
  const ny = dir.y + uy * ox + vy * oy;
  const nz = dir.z + uz * ox + vz * oy;
  const l = Math.hypot(nx, ny, nz) || 1;
  return v3(nx / l, ny / l, nz / l);
}
