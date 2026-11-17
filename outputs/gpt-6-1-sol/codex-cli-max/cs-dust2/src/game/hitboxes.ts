import { Vector3 } from 'three';
import type { Actor, HitZone } from './types';
import { rayAABB } from './math';

const ZONES: { zone: HitZone; min: Vector3; max: Vector3 }[] = [
  { zone: 'head', min: new Vector3(-.17, 1.56, -.18), max: new Vector3(.17, 1.98, .18) },
  { zone: 'chest', min: new Vector3(-.29, 1.13, -.19), max: new Vector3(.29, 1.49, .18) },
  { zone: 'abdomen', min: new Vector3(-.27, .86, -.18), max: new Vector3(.27, 1.13, .18) },
  { zone: 'arm', min: new Vector3(-.46, 1.02, -.56), max: new Vector3(-.24, 1.48, .11) },
  { zone: 'arm', min: new Vector3(.24, 1.02, -.56), max: new Vector3(.46, 1.48, .11) },
  { zone: 'leg', min: new Vector3(-.28, .02, -.2), max: new Vector3(-.035, .86, .18) },
  { zone: 'leg', min: new Vector3(.035, .02, -.2), max: new Vector3(.28, .86, .18) },
];
export function intersectActor(origin: Vector3, direction: Vector3, actor: Actor, limit: number) {
  const c = Math.cos(actor.yaw), s = Math.sin(actor.yaw), x = origin.x - actor.x, z = origin.z - actor.z;
  const localOrigin = new Vector3(c * x - s * z, origin.y - actor.y, s * x + c * z);
  const localDirection = new Vector3(c * direction.x - s * direction.z, direction.y, s * direction.x + c * direction.z);
  let nearest = limit, zone: HitZone | null = null;
  for (const box of ZONES) { const t = rayAABB(localOrigin, localDirection, box.min, box.max, nearest); if (t < nearest) { nearest = t; zone = box.zone; } }
  return zone ? { distance: nearest, zone } : null;
}
