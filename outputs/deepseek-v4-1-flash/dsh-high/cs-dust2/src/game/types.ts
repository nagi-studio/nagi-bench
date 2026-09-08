import type { WeaponSlot } from '../weapons/weapons';

export type Team = 'CT' | 'T';
export type RoundPhase = 'freeze' | 'live' | 'over';

/** Minimal interface so Actor can hold an AI brain without importing it. */
export interface Brain {
  update(dt: number): void;
}

export interface ActorInput {
  moveX: number; // strafe: +1 right
  moveZ: number; // forward: +1 forward
  jump: boolean;
  crouch: boolean;
  fire: boolean;
  reload: boolean;
  use: boolean;
  scope: boolean;
}

export const emptyInput = (): ActorInput => ({
  moveX: 0,
  moveZ: 0,
  jump: false,
  crouch: false,
  fire: false,
  reload: false,
  use: false,
  scope: false,
});

export interface MinimapEntity {
  x: number;
  z: number;
  team: Team;
  self: boolean;
  visible: boolean; // enemy currently seen by the player's team
  bomb: boolean;
}

export interface KillFeedEntry {
  id: number;
  killer: string;
  victim: string;
  weapon: string;
  headshot: boolean;
  killerTeam: Team;
  victimTeam: Team;
  time: number;
}

export interface BombHud {
  planted: boolean;
  timer: number;
  defuseProgress: number;
  plantProgress: number;
  carrier: string | null;
  site: 'A' | 'B' | null;
  x: number;
  z: number;
  dropped: boolean;
}

export interface HudState {
  started: boolean;
  paused: boolean;
  playerAlive: boolean;
  health: number;
  armor: number;
  helmet: boolean;
  weaponName: string;
  slot: WeaponSlot;
  ammo: number;
  reserve: number;
  reloading: boolean;
  scoped: boolean;
  canScope: boolean;
  spread: number;
  team: Team;
  scoreCT: number;
  scoreT: number;
  roundNumber: number;
  roundTime: number;
  phase: RoundPhase;
  bomb: BombHud;
  killfeed: KillFeedEntry[];
  entities: MinimapEntity[];
  banner: string;
  aliveCT: number;
  aliveT: number;
  fps: number;
  interact: string | null;
  playerName: string;
  playerYaw: number;
  hitMarker: number;
  damageFlash: number;
}

export const initialHud = (): HudState => ({
  started: false,
  paused: false,
  playerAlive: true,
  health: 100,
  armor: 0,
  helmet: false,
  weaponName: '刀',
  slot: 'knife',
  ammo: 0,
  reserve: 0,
  reloading: false,
  scoped: false,
  canScope: false,
  spread: 0,
  team: 'T',
  scoreCT: 0,
  scoreT: 0,
  roundNumber: 1,
  roundTime: 0,
  phase: 'freeze',
  bomb: { planted: false, timer: 0, defuseProgress: 0, plantProgress: 0, carrier: null, site: null, x: 0, z: 0, dropped: false },
  killfeed: [],
  entities: [],
  banner: '',
  aliveCT: 0,
  aliveT: 0,
  fps: 0,
  interact: null,
  playerName: '玩家',
  playerYaw: 0,
  hitMarker: 0,
  damageFlash: 0,
});
