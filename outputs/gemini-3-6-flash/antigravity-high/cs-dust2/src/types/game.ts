import * as THREE from 'three';

export type Team = 'CT' | 'T';

export type WeaponType = 'ak47' | 'm4a4' | 'awp' | 'glock' | 'usp' | 'deagle' | 'knife';

export type WeaponCategory = 'primary' | 'secondary' | 'melee';

export interface WeaponData {
  id: WeaponType;
  name: string;
  category: WeaponCategory;
  damage: number; // Base body damage
  fireRate: number; // Shots per second
  recoil: number; // Recoil scale (0-1)
  spread: number; // Base inaccuracy angle
  clipSize: number;
  maxReserve: number;
  reloadTime: number; // seconds
  hasScope?: boolean;
  teams: Team[];
}

export type HitboxZone = 'head' | 'chest' | 'abdomen' | 'arm' | 'leg';

export interface Hitbox {
  zone: HitboxZone;
  mesh: THREE.Mesh;
  multiplier: number;
}

export interface CharacterState {
  id: string;
  name: string;
  team: Team;
  isBot: boolean;
  hp: number;
  maxHp: number;
  armor: number; // 0 - 100
  hasHelmet: boolean;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  yaw: number;
  pitch: number;
  velocity: THREE.Vector3;
  isGrounded: boolean;
  isCrouching: boolean;
  isScoping: boolean;
  currentWeapon: WeaponType;
  primaryWeapon?: WeaponType;
  secondaryWeapon: WeaponType;
  ammoInClip: Record<WeaponType, number>;
  ammoReserve: Record<WeaponType, number>;
  isReloading: boolean;
  reloadTimer: number;
  isPlantingC4: boolean;
  plantTimer: number;
  isDefusingC4: boolean;
  defuseTimer: number;
  hasC4: boolean;
  isDead: boolean;
  killCount: number;
  deathCount: number;
  lastDamageDealerId?: string;
  walkCycle: number;
}

export interface C4State {
  isPlanted: boolean;
  isDropped: boolean;
  position: THREE.Vector3;
  carrierId?: string;
  plantProgress: number; // 0 - 1
  defuseProgress: number; // 0 - 1
  plantSite?: 'A' | 'B';
  timer: number; // countdown when planted, e.g., 40s
}

export type RoundPhase = 'FREEZE_TIME' | 'IN_PROGRESS' | 'ENDED';

export type RoundWinReason = 
  | 'T_ELIMINATED'
  | 'CT_ELIMINATED'
  | 'C4_EXPLODED'
  | 'C4_DEFUSED'
  | 'TIME_RAN_OUT';

export interface GameScore {
  ct: number;
  t: number;
  currentRound: number;
  isPistolRound: boolean;
}

export interface KillEvent {
  id: string;
  killerName: string;
  killerTeam: Team;
  victimName: string;
  victimTeam: Team;
  weapon: WeaponType;
  isHeadshot: boolean;
  timestamp: number;
}

export interface Waypoint {
  id: string;
  position: THREE.Vector3;
  connections: string[]; // Connected waypoint IDs
  zone?: 'T_SPAWN' | 'CT_SPAWN' | 'A_SITE' | 'B_SITE' | 'LONG_A' | 'CATWALK' | 'MID' | 'B_TUNNELS';
}
