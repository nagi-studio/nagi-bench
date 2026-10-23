export type Team = 'CT' | 'T';
export type WeaponId = 'ak47' | 'm4a4' | 'awp' | 'glock' | 'usp' | 'deagle' | 'knife';
export type WeaponSlot = 'primary' | 'secondary' | 'knife';
export type HitZone = 'head' | 'chest' | 'stomach' | 'arm' | 'leg';
export type GamePhase = 'menu' | 'playing' | 'roundEnd';
export type BombStatus = 'carried' | 'dropped' | 'planted' | 'defused' | 'exploded';

export interface WeaponSpec {
  id: WeaponId;
  name: string;
  shortName: string;
  slot: WeaponSlot;
  damage: number;
  interval: number;
  magazine: number;
  reserve: number;
  reloadTime: number;
  range: number;
  spread: number;
  recoil: number;
  automatic: boolean;
  moveSpeed: number;
  tracer: number;
}

export interface WeaponSnapshot {
  id: WeaponId;
  name: string;
  slot: WeaponSlot;
  ammo: number;
  reserve: number;
  reloading: boolean;
  reloadProgress: number;
}

export interface PlayerSnapshot {
  id: number;
  name: string;
  team: Team;
  health: number;
  armor: number;
  alive: boolean;
  x: number;
  y: number;
  z: number;
  yaw: number;
  kills: number;
  deaths: number;
  controlled: boolean;
  hasBomb: boolean;
  weapon: WeaponId;
}

export interface KillFeedItem {
  id: number;
  killer: string;
  killerTeam: Team;
  victim: string;
  victimTeam: Team;
  weapon: WeaponId;
  headshot: boolean;
}

export interface GameSnapshot {
  phase: GamePhase;
  paused: boolean;
  round: number;
  roundTime: number;
  score: { CT: number; T: number };
  players: PlayerSnapshot[];
  controlledId: number;
  spectatorId: number | null;
  health: number;
  armor: number;
  alive: boolean;
  team: Team;
  position: { x: number; y: number; z: number };
  yaw: number;
  location: string;
  weapon: WeaponSnapshot;
  weapons: Partial<Record<WeaponSlot, WeaponSnapshot>>;
  kills: number;
  deaths: number;
  scoped: boolean;
  spread: number;
  hitMarkerAt: number;
  damageAt: number;
  killfeed: KillFeedItem[];
  notice: string;
  noticeAt: number;
  roundWinner: Team | null;
  roundReason: string;
  bomb: {
    status: BombStatus;
    carrierId: number | null;
    x: number;
    y: number;
    z: number;
    site: 'A' | 'B' | null;
    timer: number;
    visiblePosition: boolean;
  };
  interaction: { label: string; progress: number } | null;
  visibleEnemies: number[];
  muted: boolean;
  canBuy: boolean;
}
