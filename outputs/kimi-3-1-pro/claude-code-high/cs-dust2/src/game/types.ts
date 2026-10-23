import * as THREE from 'three';

export type Team = 'CT' | 'T';
export type Slot = 'primary' | 'secondary' | 'melee';
export type WeaponId = 'ak47' | 'm4a4' | 'awp' | 'glock' | 'usp' | 'deagle' | 'knife';
export type HitZone = 'head' | 'chest' | 'stomach' | 'arms' | 'legs';
export type RoundPhase = 'freeze' | 'live' | 'ended';
export type BotState = 'advance' | 'combat' | 'plant' | 'defuse' | 'guard' | 'retrieve';

export interface WeaponSpec {
  id: WeaponId;
  name: string;
  shortName: string;
  slot: Slot;
  damage: number;
  rpm: number;
  magazine: number;
  reserve: number;
  reload: number;
  range: number;
  automatic: boolean;
  spread: number;
  moveSpread: number;
  bloom: number;
  recoil: number;
  price: number;
  zoom?: number;
  team?: Team;
}

export interface WeaponState {
  id: WeaponId;
  ammo: number;
  reserve: number;
}

export interface Collider {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  minY: number;
  maxY: number;
  kind: 'wall' | 'crate' | 'door';
}

export interface Zone {
  name: string;
  x: number;
  z: number;
  radius: number;
}

export interface PlayerEntity {
  id: number;
  name: string;
  team: Team;
  isBot: boolean;
  alive: boolean;
  pos: THREE.Vector3;
  velocity: THREE.Vector3;
  yaw: number;
  pitch: number;
  radius: number;
  height: number;
  hp: number;
  armor: number;
  money: number;
  kills: number;
  deaths: number;
  weapons: Partial<Record<Slot, WeaponState>>;
  slot: Slot;
  reloadLeft: number;
  fireCooldown: number;
  bloom: number;
  hasBomb: boolean;
  grounded: boolean;
  stepDistance: number;
  actionProgress: number;
  bot: {
    state: BotState;
    targetId: number | null;
    targetVisible: boolean;
    reaction: number;
    thinkLeft: number;
    repathLeft: number;
    path: THREE.Vector3[];
    pathIndex: number;
    destination: THREE.Vector3 | null;
    site: 'A' | 'B';
    strafe: number;
    strafeLeft: number;
    burst: number;
    stuckTime: number;
    lastPos: THREE.Vector3;
  };
}

export interface KillEvent {
  id: number;
  killer: string;
  victim: string;
  killerTeam: Team;
  victimTeam: Team;
  weapon: string;
  headshot: boolean;
}

export interface BombState {
  status: 'carried' | 'dropped' | 'planted' | 'defused' | 'exploded';
  carrierId: number | null;
  pos: THREE.Vector3;
  site: 'A' | 'B' | null;
  timer: number;
}

export interface HudPlayer {
  id: number;
  name: string;
  team: Team;
  alive: boolean;
  hp: number;
  armor: number;
  kills: number;
  deaths: number;
  x: number;
  z: number;
  yaw: number;
  hasBomb: boolean;
}

export interface HudSnapshot {
  phase: RoundPhase;
  round: number;
  roundTime: number;
  buyTime: number;
  score: Record<Team, number>;
  controlledId: number;
  spectatingId: number | null;
  hp: number;
  armor: number;
  money: number;
  weapon: string;
  weaponId: WeaponId;
  slot: Slot;
  ammo: number;
  reserve: number;
  reloading: boolean;
  reloadProgress: number;
  scoped: boolean;
  crosshair: number;
  hitMarker: boolean;
  players: HudPlayer[];
  spotted: number[];
  bomb: { status: BombState['status']; x: number; z: number; timer: number; site: 'A' | 'B' | null };
  action: { label: string; progress: number } | null;
  hint: string;
  killfeed: KillEvent[];
  buyOpen: boolean;
  canBuy: boolean;
  roundMessage: string;
  locked: boolean;
  alive: boolean;
  team: Team;
}
