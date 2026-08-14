import * as THREE from 'three';

export type Team = 'CT' | 'T';

export type WeaponSlot = 'primary' | 'secondary' | 'knife' | 'c4';

export type WeaponId = 'ak47' | 'm4a4' | 'awp' | 'glock' | 'usp' | 'deagle' | 'knife' | 'c4';

export type HitboxZone = 'head' | 'chest' | 'stomach' | 'arms' | 'legs';

export interface WeaponData {
  id: WeaponId;
  name: string;
  slot: WeaponSlot;
  damage: number; // base chest damage
  headshotMultiplier: number;
  armorPenetration: number; // 0.0 to 1.0 (e.g. 0.77 for AK, 0.70 for M4, 0.97 for AWP)
  fireRate: number; // rounds per second
  magSize: number;
  maxReserve: number;
  reloadTime: number; // seconds
  recoilPitch: number; // camera kick upward
  recoilYaw: number; // camera horizontal sway
  spreadBase: number;
  spreadMove: number;
  scopedSpread: number;
  rangeModifier: number; // falloff
  hasScope: boolean;
  scopeZoomFov: number;
  price: number;
  killAward: number;
}

export interface HitboxDefinition {
  zone: HitboxZone;
  box: THREE.Box3;
  mesh?: THREE.Object3D;
  multiplier: number;
}

export interface PlayerInventory {
  primary: WeaponId | null;
  secondary: WeaponId;
  knife: WeaponId;
  c4: boolean;
  currentSlot: WeaponSlot;
  ammo: Record<WeaponId, { current: number; reserve: number }>;
}

export interface CharacterState {
  id: string;
  name: string;
  team: Team;
  isPlayer: boolean;
  isAlive: boolean;
  health: number;
  maxHealth: number;
  armor: number;
  hasHelmet: boolean;
  hasDefuseKit: boolean;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: { yaw: number; pitch: number };
  isGrounded: boolean;
  isCrouching: boolean;
  isPlanting: boolean;
  isDefusing: boolean;
  isReloading: boolean;
  isScoped: boolean;
  currentWeapon: WeaponId;
  inventory: PlayerInventory;
  kills: number;
  deaths: number;
  assists: number;
  score: number;
  ping: number;
}

export type BombSite = 'A' | 'B';

export type RoundStatus = 'freezetime' | 'live' | 'bomb_planted' | 'round_end';

export interface RoundState {
  roundNumber: number;
  scoreCT: number;
  scoreT: number;
  status: RoundStatus;
  timer: number; // seconds remaining in phase
  maxRoundTime: number;
  bombState: {
    isPlanted: boolean;
    site: BombSite | null;
    position: THREE.Vector3 | null;
    timer: number; // 40 seconds
    planterId: string | null;
    carrierId: string | null;
    isDropped: boolean;
    droppedPosition: THREE.Vector3 | null;
    defusingPlayerId: string | null;
    defuseProgress: number; // 0 to 1
  };
  winner: Team | null;
  winReason: string | null;
  isPistolRound: boolean;
}

export interface KillFeedEntry {
  id: string;
  killerId: string;
  killerName: string;
  killerTeam: Team;
  victimId: string;
  victimName: string;
  victimTeam: Team;
  weapon: WeaponId;
  isHeadshot: boolean;
  isWallbang: boolean;
  isNoScope: boolean;
  timestamp: number;
}

export interface Waypoint {
  id: string;
  position: THREE.Vector3;
  zone: string; // 'T_SPAWN' | 'A_SITE' | 'B_SITE' | 'LONG_A' | 'CATWALK' | 'MID' | 'B_TUNNEL' | 'CT_SPAWN'
  connectedIds: string[];
  coverPoints?: THREE.Vector3[];
  dangerLevel?: number;
}

export interface BulletImpact {
  position: THREE.Vector3;
  normal: THREE.Vector3;
  type: 'flesh' | 'metal' | 'wood' | 'concrete';
  isHeadshot?: boolean;
}

export interface TracerLine {
  id: string;
  start: THREE.Vector3;
  end: THREE.Vector3;
  color: number;
  life: number;
  maxLife: number;
}
