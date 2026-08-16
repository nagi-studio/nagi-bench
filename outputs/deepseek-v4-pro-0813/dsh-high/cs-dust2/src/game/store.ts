import type { Team, Vec2 } from './types';
import { ROUND_FREEZE_TIME } from './config';

export interface KillfeedEntry {
  id: number;
  text: string;
  time: number;
}

export interface MinimapPlayer {
  x: number;
  z: number;
  team: Team;
  alive: boolean;
  isSelf: boolean;
}

export interface HudState {
  started: boolean;
  paused: boolean;
  phase: 'freeze' | 'live' | 'planted' | 'over';
  round: number;
  roundTime: number;
  c4State: 'carried' | 'dropped' | 'planted' | 'none';
  c4Timer: number;
  c4Team: Team | null;
  score: { ct: number; t: number };
  team: Team;
  alive: boolean;
  hp: number;
  armor: number;
  money: number;
  weaponName: string;
  weaponSlot: string;
  mag: number;
  reserve: number;
  reloading: boolean;
  scoped: boolean;
  killfeed: KillfeedEntry[];
  hitmarker: number;
  damageFlash: number;
  minimapPlayers: MinimapPlayer[];
  minimapWalls: { x0: number; z0: number; x1: number; z1: number }[];
  c4Pos: Vec2 | null;
  spectating: string | null;
  winner: Team | null;
  message: string;
  buyOpen: boolean;
  roundOver: boolean;
}

const initial: HudState = {
  started: false,
  paused: false,
  phase: 'freeze',
  round: 1,
  roundTime: ROUND_FREEZE_TIME,
  c4State: 'none',
  c4Timer: 0,
  c4Team: null,
  score: { ct: 0, t: 0 },
  team: 'T',
  alive: true,
  hp: 100,
  armor: 0,
  money: 800,
  weaponName: 'Glock-18',
  weaponSlot: 'secondary',
  mag: 20,
  reserve: 120,
  reloading: false,
  scoped: false,
  killfeed: [],
  hitmarker: 0,
  damageFlash: 0,
  minimapPlayers: [],
  minimapWalls: [],
  c4Pos: null,
  spectating: null,
  winner: null,
  message: '',
  buyOpen: false,
  roundOver: false,
};

let state: HudState = { ...initial };

const listeners = new Set<() => void>();

export function getState(): HudState {
  return state;
}

export function setState(patch: Partial<HudState>): void {
  state = { ...state, ...patch };
  for (const l of listeners) l();
}

export function resetState(): void {
  state = { ...initial };
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
