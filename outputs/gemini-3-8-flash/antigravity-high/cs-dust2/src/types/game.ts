import * as THREE from 'three';

export type Team = 'CT' | 'T';

export type WeaponSlot = 'primary' | 'secondary' | 'knife' | 'c4';

export type WeaponId = 'ak47' | 'm4a4' | 'awp' | 'glock' | 'usp' | 'deagle' | 'knife' | 'c4';

export type HitboxZone = 'head' | 'chest' | 'stomach' | 'arm_left' | 'arm_right' | 'leg_left' | 'leg_right';

export interface WeaponData {
  id: WeaponId;
  name: string;
  slot: WeaponSlot;
  damage: number;
  headshotMultiplier: number;
  armorPenetration: number; // percentage (e.g. 0.77 for AK)
  fireRate: number; // rounds per second
  magazineSize: number;
  maxReserveAmmo: number;
  reloadTime: number; // seconds
  recoilVertical: number;
  recoilHorizontal: number;
  spread: number;
  range: number;
  automatic: boolean;
  scoped?: boolean;
  price: number;
}

export interface PlayerInventory {
  primary: WeaponId | null;
  secondary: WeaponId;
  knife: WeaponId;
  c4: boolean;
  currentSlot: WeaponSlot;
  ammo: Record<WeaponId, { current: number; reserve: number }>;
}

export type RoundPhase = 'freeze' | 'live' | 'planted' | 'ended';

export interface KillfeedEntry {
  id: string;
  killerName: string;
  killerTeam: Team;
  victimName: string;
  victimTeam: Team;
  weapon: WeaponId;
  isHeadshot: boolean;
  timestamp: number;
}

export interface BotTacticalTarget {
  position: THREE.Vector3;
  zoneName: string;
  action: 'patrol' | 'hold' | 'rush' | 'plant' | 'defuse' | 'hunt';
}

export interface BoundingBox {
  min: THREE.Vector3;
  max: THREE.Vector3;
}

export interface Waypoint {
  id: string;
  position: THREE.Vector3;
  zone: string;
  neighbors: string[];
}

export interface MinimapEntity {
  id: string;
  position: THREE.Vector3;
  rotationY: number;
  team: Team;
  isAlive: boolean;
  isPlayer: boolean;
  isSpotted: boolean;
  hasC4: boolean;
}

export interface C4State {
  status: 'carried' | 'dropped' | 'planting' | 'planted' | 'defusing' | 'defused' | 'exploded';
  position: THREE.Vector3;
  plantedSite: 'A' | 'B' | null;
  carrierId: string | null;
  timer: number; // 40s fuse
  maxTimer: number;
  plantProgress: number; // 0 to 1
  defuseProgress: number; // 0 to 1
}

export interface GameStats {
  scoreCT: number;
  scoreT: number;
  roundNumber: number;
  isPistolRound: boolean;
  roundPhase: RoundPhase;
  roundTimeLeft: number;
  c4: C4State;
  winner: Team | null;
  winReason: string;
}
