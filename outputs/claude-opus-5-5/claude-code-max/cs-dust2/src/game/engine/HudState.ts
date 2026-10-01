import type { RoundEndReason, Team } from '../core/types';
import type { RoundPhase } from '../sim/World';
import type { WeaponId, WeaponKind } from '../weapons/WeaponDefs';

export interface KillfeedEntry {
  id: number;
  killer: string | null;
  killerTeam: Team | null;
  victim: string;
  victimTeam: Team;
  weapon: string;
  headshot: boolean;
  time: number;
  /** Highlight entries involving the human. */
  mine: boolean;
}

export interface SlotInfo {
  slot: number;
  key: string;
  id: WeaponId;
  name: string;
  active: boolean;
}

export interface WeaponHud {
  id: WeaponId;
  name: string;
  kind: WeaponKind;
  ammo: number;
  mag: number;
  reserve: number;
}

export interface ScoreRow {
  id: number;
  name: string;
  team: Team;
  alive: boolean;
  kills: number;
  deaths: number;
  headshots: number;
  damage: number;
  isHuman: boolean;
  isControlled: boolean;
  hasBomb: boolean;
}

export interface Banner {
  key: number;
  title: string;
  sub?: string;
  tone: 'ct' | 't' | 'neutral' | 'warn';
}

export interface Notice {
  key: number;
  text: string;
  tone: 'ct' | 't' | 'neutral' | 'warn';
}

export interface HudState {
  ready: boolean;
  paused: boolean;
  locked: boolean;
  /** True once the player has entered the game at least once (pause vs. first start screen). */
  started: boolean;
  phase: RoundPhase;
  round: number;
  pistolRound: boolean;
  clock: number;
  bombPlanted: boolean;
  scoreCT: number;
  scoreT: number;
  aliveCT: boolean[];
  aliveT: boolean[];
  playerTeam: Team;
  // viewed actor
  viewName: string;
  viewTeam: Team;
  spectating: boolean;
  deathCam: boolean;
  canTakeover: boolean;
  controllingBot: string | null;
  health: number;
  armor: number;
  helmet: boolean;
  hasKit: boolean;
  hasBomb: boolean;
  weapon: WeaponHud | null;
  slots: SlotInfo[];
  reloading: boolean;
  scoped: boolean;
  inBombsite: string | null;
  plantProgress: number | null;
  defuseProgress: number | null;
  actionHint: string | null;
  location: string;
  killfeed: KillfeedEntry[];
  banner: Banner | null;
  notices: Notice[];
  buyOpen: boolean;
  canBuy: boolean;
  scoreboardOpen: boolean;
  scoreboard: ScoreRow[];
  matchWinner: Team | null;
  history: { winner: Team; reason: RoundEndReason }[];
  fps: number;
  showFps: boolean;
  lastRoundEnd: { winner: Team; reason: RoundEndReason } | null;
}

export const INITIAL_HUD: HudState = {
  ready: false,
  paused: true,
  locked: false,
  started: false,
  phase: 'freeze',
  round: 1,
  pistolRound: true,
  clock: 0,
  bombPlanted: false,
  scoreCT: 0,
  scoreT: 0,
  aliveCT: [],
  aliveT: [],
  playerTeam: 'CT',
  viewName: '',
  viewTeam: 'CT',
  spectating: false,
  deathCam: false,
  canTakeover: false,
  controllingBot: null,
  health: 100,
  armor: 0,
  helmet: false,
  hasKit: false,
  hasBomb: false,
  weapon: null,
  slots: [],
  reloading: false,
  scoped: false,
  inBombsite: null,
  plantProgress: null,
  defuseProgress: null,
  actionHint: null,
  location: '',
  killfeed: [],
  banner: null,
  notices: [],
  buyOpen: false,
  canBuy: false,
  scoreboardOpen: false,
  scoreboard: [],
  matchWinner: null,
  history: [],
  fps: 0,
  showFps: true,
  lastRoundEnd: null,
};

/** High-frequency state polled each animation frame by canvas/DOM-driven widgets. */
export interface FastHud {
  /** Crosshair gap in pixels. */
  crosshairGap: number;
  showCrosshair: boolean;
  /** 0..1 hit marker intensity, and whether it was a kill/headshot. */
  hitMarker: number;
  hitKill: boolean;
  hitHead: boolean;
  /** Damage indicators: screen-space angles (radians, 0 = up) with intensity. */
  damageDirs: { angle: number; alpha: number }[];
  damageFlash: number;
  flashbang: number;
}
