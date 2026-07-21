import * as THREE from 'three';

export type Team = 'CT' | 'T';

export type WeaponSlot = 'primary' | 'secondary' | 'melee';

export type WeaponId =
  | 'ak47'
  | 'm4a4'
  | 'awp'
  | 'glock'
  | 'usp'
  | 'deagle'
  | 'knife';

export type HitboxZone = 'head' | 'chest' | 'stomach' | 'arm' | 'leg';

export interface WeaponDef {
  id: WeaponId;
  name: string;
  slot: WeaponSlot;
  /** base body (chest) damage before armor / zone multipliers */
  damage: number;
  /** rounds per minute */
  rpm: number;
  magSize: number;
  reserveAmmo: number;
  reloadTime: number; // seconds
  /** recoil: vertical kick (radians) per shot */
  recoilVertical: number;
  /** recoil: horizontal random kick (radians) */
  recoilHorizontal: number;
  /** crosshair bloom added per shot (radians) */
  bloomPerShot: number;
  /** max spread cap (radians) */
  maxSpread: number;
  /** how fast bloom recovers per second */
  recovery: number;
  /** effective range in meters */
  range: number;
  /** damage falloff per meter beyond 20m */
  falloff: number;
  automatic: boolean;
  canScope?: boolean;
  /** armor penetration 0..1 (fraction of damage still applied through armor) */
  armorPen: number;
  /** first-person color for the viewmodel */
  color: number;
}

export interface RoundState {
  phase: 'freezetime' | 'live' | 'ended';
  roundNumber: number;
  isPistolRound: boolean;
  scoreCT: number;
  scoreT: number;
  timeLeft: number;
  bombPlanted: boolean;
  bombTimer: number;
  winner: Team | null;
  winReason: string;
}

export const HITBOX_MULT: Record<HitboxZone, number> = {
  head: 4.0, // relative to base body; actual "2x body" enforced in combat
  chest: 1.0,
  stomach: 1.25,
  arm: 0.75,
  leg: 0.6,
};

/** small helpers */
export const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
export const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const rand = (a: number, b: number) => a + Math.random() * (b - a);
