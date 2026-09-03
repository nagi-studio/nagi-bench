import { WAYPOINTS, findPath, hasLOS, nearestWP } from './map';
import type { Team } from './types';

export type BotRole = 'assault' | 'guard' | 'carrier' | 'hunter';

export interface BotMind {
  role: BotRole;
  wp: number;
  path: number[];
  wait: number;
  target: number;
  repath: number;
}

export function makeMind(role: BotRole, x: number, z: number): BotMind {
  return { role, wp: nearestWP(x, z), path: [], wait: Math.random() * 1.5, target: -1, repath: 0 };
}

export interface SenseInput {
  x: number; z: number; team: Team; alive: boolean;
  bombPlanted: boolean; bombX: number; bombZ: number;
  siteA: { x1: number; z1: number; x2: number; z2: number };
  siteB: { x1: number; z1: number; x2: number; z2: number };
  foes: { x: number; z: number; alive: boolean }[];
}

const A_WP = 10, B_WP = 12, MID_WP = 11;

/** Pick a destination waypoint index for this bot. */
export function chooseDest(m: BotMind, s: SenseInput): number {
  if (s.bombPlanted) {
    // defenders converge on the bomb, attackers guard it
    if (s.team === 'CT') return nearestWP(s.bombX, s.bombZ);
    return m.wp;
  }
  if (s.team === 'T' && (m.role === 'carrier' || m.role === 'assault')) {
    return Math.random() < 0.5 ? A_WP : B_WP;
  }
  if (s.team === 'CT') {
    if (m.role === 'guard') return Math.random() < 0.5 ? A_WP : B_WP;
    return MID_WP;
  }
  return Math.random() < 0.4 ? MID_WP : Math.random() < 0.5 ? A_WP : B_WP;
}

/** Nearest visible foe index, or -1. */
export function acquire(s: SenseInput, range: number): number {
  let best = -1, bd = range * range;
  s.foes.forEach((f, i) => {
    if (!f.alive) return;
    const dx = f.x - s.x, dz = f.z - s.z;
    const d = dx * dx + dz * dz;
    if (d < bd && hasLOS(s.x, s.z, f.x, f.z)) { bd = d; best = i; }
  });
  return best;
}

/** Advance along path; returns new x/z and whether arrived. */
export function stepAlong(
  m: BotMind, s: SenseInput, speed: number, dt: number,
): { x: number; z: number; arrived: boolean } {
  if (m.path.length === 0) {
    const dest = chooseDest(m, s);
    m.path = findPath(nearestWP(s.x, s.z), dest).slice(1);
    if (m.path.length === 0) return { x: s.x, z: s.z, arrived: true };
  }
  const t = WAYPOINTS[m.path[0]];
  const dx = t.x - s.x, dz = t.z - s.z;
  const d = Math.hypot(dx, dz);
  if (d < 0.8) {
    m.path.shift();
    return { x: s.x, z: s.z, arrived: m.path.length === 0 };
  }
  const v = Math.min(speed * dt, d);
  return { x: s.x + (dx / d) * v, z: s.z + (dz / d) * v, arrived: false };
}
