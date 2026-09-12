import type { Vec3 } from './math.ts';

export type Team = 'CT' | 'T';

export const otherTeam = (t: Team): Team => (t === 'CT' ? 'T' : 'CT');

export type SlotId = 'primary' | 'secondary' | 'melee' | 'bomb';

export type HitboxGroup = 'head' | 'chest' | 'stomach' | 'arm' | 'leg';

export type RoundPhase = 'warmup' | 'freeze' | 'live' | 'over';

export type RoundEndReason =
  | 'ct_eliminated'
  | 't_eliminated'
  | 'bomb_exploded'
  | 'bomb_defused'
  | 'time_expired';

/** Axis aligned box in world space (used for crates / props / bomb-site volumes). */
export interface Box {
  min: Vec3;
  max: Vec3;
}

export interface KillEvent {
  id: number;
  time: number;
  killer: string;
  killerTeam: Team;
  victim: string;
  victimTeam: Team;
  weapon: string;
  headshot: boolean;
  /** Killer or victim is the human-controlled player — used to highlight the feed row. */
  involvesPlayer: boolean;
}

/** Everything the React HUD needs. Rebuilt at a throttled rate, never every frame. */
export interface HudSnapshot {
  tick: number;
  phase: RoundPhase;
  roundNumber: number;
  isPistolRound: boolean;
  phaseTimeLeft: number;
  scoreCT: number;
  scoreT: number;
  aliveCT: number;
  aliveT: number;
  money: number;

  playerName: string;
  playerTeam: Team;
  playerAlive: boolean;
  spectating: boolean;
  spectatedName: string;
  health: number;
  armor: number;
  helmet: boolean;
  hasBomb: boolean;

  weaponName: string;
  weaponSlot: SlotId;
  magAmmo: number;
  reserveAmmo: number;
  usesAmmo: boolean;
  reloading: boolean;
  scoped: boolean;
  spreadPx: number;

  bombPlanted: boolean;
  bombTimeLeft: number;
  bombCarriedByPlayerTeam: boolean;
  plantProgress: number;
  defuseProgress: number;
  /** Contextual prompt: "按住 E 安放 C4" etc. */
  hint: string;

  killfeed: KillEvent[];
  roundEndText: string;
  scoreboard: ScoreboardRow[];
  loadout: { slot: SlotId; name: string; active: boolean }[];
  buyMenuOpen: boolean;
  canBuy: boolean;
  damageFlash: number;
  hitMarker: number;
}

export interface ScoreboardRow {
  id: number;
  name: string;
  team: Team;
  kills: number;
  deaths: number;
  money: number;
  alive: boolean;
  isPlayer: boolean;
  hasBomb: boolean;
}
