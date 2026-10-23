import type { Vector3 } from 'three';

export type Team = 'CT' | 'T';
export type WeaponId = 'ak47' | 'm4a4' | 'awp' | 'glock' | 'usp' | 'deagle' | 'knife';
export type WeaponSlot = 'primary' | 'secondary' | 'melee';
export type HitZone = 'head' | 'chest' | 'abdomen' | 'arms' | 'legs';
export type RoundPhase = 'warmup' | 'freeze' | 'live' | 'roundEnd';
export type BotState = 'advance' | 'engage' | 'plant' | 'defuse' | 'guard';

export interface WeaponState {
  id: WeaponId;
  ammo: number;
  reserve: number;
}

export interface Inventory {
  primary: WeaponState | null;
  secondary: WeaponState;
  melee: WeaponState;
  active: WeaponSlot;
  previous: WeaponSlot;
  hasBomb: boolean;
}

export interface BotBrain {
  state: BotState;
  path: Vector3[];
  pathIndex: number;
  destination: Vector3 | null;
  targetId: string | null;
  nextThink: number;
  nextPath: number;
  reactionAt: number;
  nextShot: number;
  burstLeft: number;
  strafeDirection: number;
  strafeUntil: number;
  preferredSite: 'A' | 'B';
  objectiveStage: number;
  stuckFor: number;
  lastPosition: Vector3;
}

export interface Actor {
  id: string;
  name: string;
  team: Team;
  controlled: boolean;
  position: Vector3;
  velocity: Vector3;
  yaw: number;
  pitch: number;
  radius: number;
  height: number;
  health: number;
  armor: number;
  alive: boolean;
  grounded: boolean;
  money: number;
  kills: number;
  deaths: number;
  inventory: Inventory;
  brain: BotBrain;
  reloadEndsAt: number;
  switchEndsAt: number;
  nextShotAt: number;
  lastShotAt: number;
  weaponHeat: number;
  walkPhase: number;
  lastStepAt: number;
  lastDamageAt: number;
  lastAttackerId: string | null;
  action: 'plant' | 'defuse' | null;
  actionStartedAt: number;
}

export interface BombState {
  status: 'carried' | 'dropped' | 'planted' | 'defused' | 'exploded';
  carrierId: string | null;
  planterId: string | null;
  position: Vector3;
  site: 'A' | 'B' | null;
  timer: number;
  plantProgress: number;
  defuseProgress: number;
  actionActorId: string | null;
  nextBeepAt: number;
}

export interface KillfeedEntry {
  id: number;
  killer: string;
  killerTeam: Team;
  victim: string;
  victimTeam: Team;
  weapon: WeaponId | 'c4';
  headshot: boolean;
  expiresAt: number;
}

export interface MinimapActor {
  id: string;
  team: Team;
  x: number;
  z: number;
  yaw: number;
  alive: boolean;
  controlled: boolean;
  visible: boolean;
}

export interface PlayerSnapshot {
  id: string;
  name: string;
  team: Team;
  alive: boolean;
  health: number;
  armor: number;
  ammo: number;
  reserve: number;
  magazine: number;
  weapon: WeaponId;
  weaponName: string;
  slot: WeaponSlot;
  hasPrimary: boolean;
  hasBomb: boolean;
  reloading: boolean;
  reloadProgress: number;
  money: number;
  kills: number;
  deaths: number;
  spectating: boolean;
  spectatedName: string;
}

export interface EngineSnapshot {
  started: boolean;
  paused: boolean;
  pointerLocked: boolean;
  phase: RoundPhase;
  round: number;
  roundTime: number;
  phaseTime: number;
  score: Record<Team, number>;
  winner: Team | null;
  endReason: string;
  announcement: string;
  announcementDetail: string;
  player: PlayerSnapshot;
  actors: MinimapActor[];
  alive: Record<Team, number>;
  bomb: {
    status: BombState['status'];
    x: number;
    z: number;
    site: 'A' | 'B' | null;
    timer: number;
    visible: boolean;
    carrierTeam: Team | null;
  };
  killfeed: KillfeedEntry[];
  scoped: boolean;
  spread: number;
  hitMarkerAt: number;
  damageFlashAt: number;
  buyOpen: boolean;
  canBuy: boolean;
  contextPrompt: string;
  actionProgress: number;
  actionLabel: string;
  elapsed: number;
}

export interface BuyItem {
  id: WeaponId | 'armor';
  name: string;
  description: string;
  price: number;
  slot: string;
}
