/**
 * Combatant factory + shared combatant-level helpers (hit boxes, movement
 * intent, weapon handling primitives).
 */

import {
  CHARACTER, HITBOXES, makeWeaponState, weaponDef,
  type HitBoxId, type Slot, type WeaponId, type WeaponState,
} from './weapons';
import { makeBody } from './physics';
import { NAV_POINTS, T_SPAWN_POINTS, CT_SPAWN_POINTS } from './map/dust2';
import { angleDelta, clamp, dist2D, moveAngleTowards } from './mathUtils';
import type { BotBrain, BotRole, Combatant, Team } from './types';

export const BOT_NAMES_CT = ['Viper', 'Frost', 'Slate', 'Nomad', 'Kite'];
export const BOT_NAMES_T = ['Raiz', 'Blitz', 'Kobra', 'Dune', 'Havoc'];

export function makeBrain(role: BotRole): BotBrain {
  return {
    state: 'advance',
    role,
    goal: null,
    path: [],
    pathIndex: 0,
    repathTimer: 0,
    stuckTimer: 0,
    lastX: 0,
    lastZ: 0,
    targetId: null,
    lastSeenX: 0,
    lastSeenZ: 0,
    lastSeenTime: -99,
    visible: false,
    reactionTimer: 0,
    trackTime: 0,
    aimHigh: false,
    burstLeft: 0,
    burstPause: 0,
    strafeDir: Math.random() < 0.5 ? -1 : 1,
    strafeTimer: 0,
    holdSpot: null,
    route: [],
    routeIndex: 0,
    decisionTimer: 0,
    aggression: 0.6 + Math.random() * 0.4,
  };
}

export interface Loadout {
  primary: WeaponId | null;
  secondary: WeaponId;
  armor: number;
  helmet: boolean;
  kit: boolean;
}

export function pistolLoadout(team: Team): Loadout {
  return {
    primary: null,
    secondary: team === 'T' ? 'glock' : 'usp',
    armor: 0,
    helmet: false,
    kit: false,
  };
}

export function gunLoadout(team: Team): Loadout {
  const primaries: WeaponId[] = team === 'T'
    ? ['ak47', 'ak47', 'ak47', 'awp', 'm4a4']
    : ['m4a4', 'm4a4', 'm4a4', 'awp', 'ak47'];
  const primary = primaries[Math.floor(Math.random() * primaries.length)]!;
  return {
    primary,
    secondary: Math.random() < 0.5 ? 'deagle' : team === 'T' ? 'glock' : 'usp',
    armor: 100,
    helmet: Math.random() < 0.8,
    kit: team === 'CT',
  };
}

export function createCombatant(
  id: number,
  name: string,
  team: Team,
  isHuman: boolean,
  spawn: { x: number; z: number },
  loadout: Loadout,
): Combatant {
  const body = makeBody(spawn.x, 0, spawn.z, CHARACTER.radius, CHARACTER.height);
  // face the enemy side of the map
  const faceYaw = team === 'T' ? Math.PI * 0.75 : -Math.PI * 0.25;

  const weapons: Partial<Record<Slot, WeaponState>> = {
    secondary: makeWeaponState(loadout.secondary),
    melee: makeWeaponState('knife'),
  };
  if (loadout.primary) weapons.primary = makeWeaponState(loadout.primary);

  return {
    id,
    name,
    team,
    isHuman,
    alive: true,
    health: 100,
    armor: loadout.armor,
    helmet: loadout.helmet,
    hasDefuseKit: loadout.kit,
    body,
    yaw: faceYaw + (Math.random() - 0.5) * 0.4,
    pitch: 0,
    slot: loadout.primary ? 'primary' : 'secondary',
    weapons,
    primaryId: loadout.primary,
    hasBomb: false,
    plantHold: 0,
    defuseHold: 0,
    spread: 0,
    recoilPitch: 0,
    recoilYaw: 0,
    recoilDebt: 0,
    ads: false,
    adsAmount: 0,
    triggerHeld: false,
    burstLeft: 0,
    kills: 0,
    deaths: 0,
    damage: 0,
    lastHitTime: -99,
    lastHitFromX: 0,
    lastHitFromZ: 0,
    animPhase: Math.random() * 10,
    stepAccum: 0,
    deathTime: 0,
    deathYaw: 0,
    brain: null,
  };
}

export function spawnPointsFor(team: Team): { x: number; z: number }[] {
  return team === 'T' ? T_SPAWN_POINTS : CT_SPAWN_POINTS;
}

// ---------------------------------------------------------------------------
// Hit detection
// ---------------------------------------------------------------------------

export interface HitTestResult {
  hitbox: HitBoxId;
  /** distance along the ray */
  t: number;
}

/**
 * Ray vs the character's hit boxes. Boxes are axis aligned in world space and
 * ordered head -> legs so the most valuable box wins ties.
 */
export function raycastCombatant(
  c: Combatant,
  ox: number, oy: number, oz: number,
  dx: number, dy: number, dz: number,
  maxT: number,
): HitTestResult | null {
  if (!c.alive) return null;
  const r = c.body.radius;
  const bx = c.body.x;
  const bz = c.body.z;
  const by = c.body.y;

  // cheap sphere reject first
  const mx = bx - ox, my = by + CHARACTER.height * 0.5 - oy, mz = bz - oz;
  const proj = mx * dx + my * dy + mz * dz;
  if (proj < -1.0 || proj > maxT + 1.0) return null;
  const px = mx - dx * proj, py = my - dy * proj, pz = mz - dz * proj;
  if (px * px + py * py + pz * pz > 1.4 * 1.4) return null;

  let best: HitTestResult | null = null;
  for (const box of HITBOXES) {
    const minY = by + box.minY;
    const maxY = by + box.maxY;
    const minX = bx - box.halfW;
    const maxX = bx + box.halfW;
    const minZ = bz - box.halfD;
    const maxZ = bz + box.halfD;

    let tmin = 0, tmax = maxT;
    let ok = true;
    // X
    if (Math.abs(dx) < 1e-8) { if (ox < minX || ox > maxX) ok = false; }
    else {
      const inv = 1 / dx;
      let t1 = (minX - ox) * inv, t2 = (maxX - ox) * inv;
      if (t1 > t2) { const tmp = t1; t1 = t2; t2 = tmp; }
      tmin = Math.max(tmin, t1); tmax = Math.min(tmax, t2);
    }
    if (!ok || tmin > tmax) continue;
    // Y
    if (Math.abs(dy) < 1e-8) { if (oy < minY || oy > maxY) ok = false; }
    else {
      const inv = 1 / dy;
      let t1 = (minY - oy) * inv, t2 = (maxY - oy) * inv;
      if (t1 > t2) { const tmp = t1; t1 = t2; t2 = tmp; }
      tmin = Math.max(tmin, t1); tmax = Math.min(tmax, t2);
    }
    if (!ok || tmin > tmax) continue;
    // Z
    if (Math.abs(dz) < 1e-8) { if (oz < minZ || oz > maxZ) ok = false; }
    else {
      const inv = 1 / dz;
      let t1 = (minZ - oz) * inv, t2 = (maxZ - oz) * inv;
      if (t1 > t2) { const tmp = t1; t1 = t2; t2 = tmp; }
      tmin = Math.max(tmin, t1); tmax = Math.min(tmax, t2);
    }
    if (!ok || tmin > tmax) continue;
    if (tmin < 0 || tmin > maxT) continue;
    if (!best || tmin < best.t) best = { hitbox: box.id, t: tmin };
  }
  void r;
  return best;
}

// ---------------------------------------------------------------------------
// Aiming helpers
// ---------------------------------------------------------------------------

export function eyePosition(c: Combatant): { x: number; y: number; z: number } {
  return { x: c.body.x, y: c.body.y + CHARACTER.eyeHeight, z: c.body.z };
}

export function dirFromAngles(yaw: number, pitch: number): { x: number; y: number; z: number } {
  const cp = Math.cos(pitch);
  return { x: -Math.sin(yaw) * cp, y: Math.sin(pitch), z: -Math.cos(yaw) * cp };
}

export function rightVector(yaw: number): { x: number; z: number } {
  return { x: Math.cos(yaw), z: -Math.sin(yaw) };
}

/** Yaw / pitch needed to look at `target` from `from`. */
export function anglesTo(fromX: number, fromY: number, fromZ: number, tx: number, ty: number, tz: number): { yaw: number; pitch: number } {
  const dx = tx - fromX, dy = ty - fromY, dz = tz - fromZ;
  const horiz = Math.hypot(dx, dz);
  return { yaw: Math.atan2(-dx, -dz), pitch: Math.atan2(dy, horiz) };
}

export function turnTowards(c: Combatant, targetYaw: number, targetPitch: number, maxRate: number, dt: number): void {
  const dYaw = angleDelta(c.yaw, targetYaw);
  const step = maxRate * dt;
  c.yaw += clamp(dYaw, -step, step);
  c.pitch = moveAngleTowards(c.pitch, targetPitch, step);
  c.pitch = clamp(c.pitch, -1.45, 1.45);
}

/** Pick a hold spot near a named nav point. */
export function holdSpotFor(role: BotRole, team: Team): { x: number; z: number } {
  if (team === 'T') {
    switch (role) {
      case 'rushA': return NAV_POINTS.A_SITE!;
      case 'rushB': return NAV_POINTS.B_SITE!;
      case 'midTake': return NAV_POINTS.TOP_MID!;
      default: return NAV_POINTS.CATWALK!;
    }
  }
  switch (role) {
    case 'anchorA': return NAV_POINTS.A_SITE!;
    case 'anchorB': return NAV_POINTS.B_SITE!;
    case 'anchorMid': return NAV_POINTS.TOP_MID!;
    default: return NAV_POINTS.CT_MID!;
  }
}

export function distanceTo(a: Combatant, b: Combatant): number {
  return dist2D(a.body.x, a.body.z, b.body.x, b.body.z);
}

export function currentWeaponId(c: Combatant): WeaponId {
  const ws = c.weapons[c.slot];
  return ws ? ws.id : 'knife';
}

export function currentDef(c: Combatant) {
  return weaponDef(currentWeaponId(c));
}
