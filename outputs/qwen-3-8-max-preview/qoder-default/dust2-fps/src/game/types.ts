// ============ Core Types ============
export type Team = 'CT' | 'T';
export type WeaponSlot = 'primary' | 'secondary' | 'melee';
export type WeaponId = 'ak47' | 'm4a4' | 'awp' | 'glock' | 'usp' | 'deagle' | 'knife';
export type HitZone = 'head' | 'chest' | 'stomach' | 'arm' | 'leg';
export type GamePhase = 'menu' | 'playing' | 'roundEnd' | 'spectating';
export type AIState = 'idle' | 'patrol' | 'chase' | 'attack' | 'plant' | 'defuse' | 'dead';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface AABB {
  min: Vec3;
  max: Vec3;
}

export interface WeaponData {
  id: WeaponId;
  name: string;
  slot: WeaponSlot;
  damage: number;
  fireRate: number; // rounds per minute
  magazineSize: number;
  reserveAmmo: number;
  reloadTime: number; // seconds
  recoilX: number;
  recoilY: number;
  spread: number;
  automatic: boolean;
  scopeZoom: number; // 1 = no scope
  headshotMultiplier: number;
}

export interface CharacterState {
  id: number;
  team: Team;
  name: string;
  isPlayer: boolean;
  isAlive: boolean;
  health: number;
  armor: number;
  position: Vec3;
  velocity: Vec3;
  rotation: number; // yaw
  pitch: number;
  currentWeapon: WeaponSlot;
  weapons: { [key in WeaponSlot]?: { id: WeaponId; ammo: number; reserve: number } };
  hasC4: boolean;
  isGrounded: boolean;
  isScoped: boolean;
  isReloading: boolean;
  reloadTimer: number;
  fireTimer: number;
  aiState: AIState;
  aiTarget: Vec3 | null;
  aiTargetEntity: number | null;
  aiPath: Vec3[];
  aiPathIndex: number;
  lastShotTime: number;
  recoilOffset: { x: number; y: number };
  kills: number;
  deaths: number;
}

export interface KillFeedEntry {
  killer: string;
  victim: string;
  weapon: WeaponId;
  headshot: boolean;
  time: number;
  killerTeam: Team;
  victimTeam: Team;
}

export interface C4State {
  planted: boolean;
  plantPosition: Vec3 | null;
  plantTime: number;
  explodeTime: number;
  defuseProgress: number;
  defuserId: number | null;
  carrierId: number | null;
  dropped: boolean;
  dropPosition: Vec3 | null;
}

export interface RoundState {
  phase: GamePhase;
  roundNumber: number;
  ctScore: number;
  tScore: number;
  roundStartTime: number;
  roundEndMessage: string;
  freezeTime: boolean;
}

export interface GameState {
  characters: CharacterState[];
  round: RoundState;
  c4: C4State;
  killFeed: KillFeedEntry[];
  playerCharacterId: number;
  spectatingId: number | null;
}

// ============ Constants ============
export const GRAVITY = -20;
export const JUMP_FORCE = 8;
export const MOVE_SPEED = 5.5;
export const PLAYER_HEIGHT = 1.7;
export const PLAYER_RADIUS = 0.3;
export const C4_PLANT_TIME = 3.0;
export const C4_DEFUSE_TIME = 5.0;
export const C4_EXPLODE_TIME = 40.0;
export const ROUND_TIME = 115;
export const FREEZE_TIME = 5;

export const WEAPONS: Record<WeaponId, WeaponData> = {
  ak47: {
    id: 'ak47', name: 'AK-47', slot: 'primary',
    damage: 36, fireRate: 600, magazineSize: 30, reserveAmmo: 90,
    reloadTime: 2.5, recoilX: 1.2, recoilY: 2.5, spread: 0.02,
    automatic: true, scopeZoom: 1, headshotMultiplier: 2
  },
  m4a4: {
    id: 'm4a4', name: 'M4A4', slot: 'primary',
    damage: 30, fireRate: 666, magazineSize: 30, reserveAmmo: 90,
    reloadTime: 2.3, recoilX: 0.7, recoilY: 1.5, spread: 0.015,
    automatic: true, scopeZoom: 1, headshotMultiplier: 2
  },
  awp: {
    id: 'awp', name: 'AWP', slot: 'primary',
    damage: 115, fireRate: 41, magazineSize: 5, reserveAmmo: 30,
    reloadTime: 3.5, recoilX: 2.0, recoilY: 5.0, spread: 0.001,
    automatic: false, scopeZoom: 2.5, headshotMultiplier: 2
  },
  glock: {
    id: 'glock', name: 'Glock-18', slot: 'secondary',
    damage: 18, fireRate: 400, magazineSize: 20, reserveAmmo: 120,
    reloadTime: 2.0, recoilX: 0.5, recoilY: 1.0, spread: 0.025,
    automatic: false, scopeZoom: 1, headshotMultiplier: 2
  },
  usp: {
    id: 'usp', name: 'USP-S', slot: 'secondary',
    damage: 20, fireRate: 352, magazineSize: 12, reserveAmmo: 24,
    reloadTime: 2.0, recoilX: 0.4, recoilY: 0.9, spread: 0.02,
    automatic: false, scopeZoom: 1, headshotMultiplier: 2
  },
  deagle: {
    id: 'deagle', name: 'Desert Eagle', slot: 'secondary',
    damage: 53, fireRate: 267, magazineSize: 7, reserveAmmo: 35,
    reloadTime: 2.2, recoilX: 1.5, recoilY: 3.0, spread: 0.03,
    automatic: false, scopeZoom: 1, headshotMultiplier: 2
  },
  knife: {
    id: 'knife', name: 'Knife', slot: 'melee',
    damage: 55, fireRate: 120, magazineSize: Infinity, reserveAmmo: 0,
    reloadTime: 0, recoilX: 0, recoilY: 0, spread: 0,
    automatic: false, scopeZoom: 1, headshotMultiplier: 2
  }
};

export const HITZONE_MULTIPLIERS: Record<HitZone, number> = {
  head: 2.0,
  chest: 1.0,
  stomach: 0.9,
  arm: 0.6,
  leg: 0.5
};
