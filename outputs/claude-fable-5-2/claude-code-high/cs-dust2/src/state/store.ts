// Global UI state engine.
//
// The game loop runs outside React. It talks to the UI through two channels:
//   1. `hud` — an external store with shallow-diffed updates, consumed via useSyncExternalStore.
//      Only low-frequency data lives here (health, ammo, scores, kill feed ...), so React
//      re-renders a component only when a value it selected actually changed.
//   2. `hudRefs` — DOM nodes registered by HUD components. Per-frame visuals (crosshair spread,
//      hit markers, minimap, damage flash) are written to them imperatively, bypassing React.

import { useSyncExternalStore } from 'react';
import type { Team } from '../sim/actor';
import type { Phase } from '../sim/round';
import type { GameMode } from '../sim/sim';
import type { Slot, WeaponId } from '../sim/weapons';

export interface Settings {
  team: Team;
  mode: GameMode;
  difficulty: number;
  sensitivity: number;
  volume: number;
}

export interface KillEntry {
  id: number;
  killer: string;
  killerTeam: Team | null;
  victim: string;
  victimTeam: Team;
  weapon: string;
  headshot: boolean;
  /** Involves the local player (highlighted). */
  mine: boolean;
  time: number;
}

export interface SlotInfo {
  slot: Slot;
  key: string;
  name: string;
  active: boolean;
}

export interface ScoreRow {
  id: number;
  name: string;
  team: Team;
  kills: number;
  deaths: number;
  alive: boolean;
  you: boolean;
  bomb: boolean;
}

export interface Banner {
  title: string;
  sub: string;
  tone: 'win' | 'lose';
}

export interface HudState {
  screen: 'menu' | 'game';
  settings: Settings;
  locked: boolean;
  phase: Phase;
  roundNum: number;
  pistol: boolean;
  scoreAtk: number;
  scoreDef: number;
  timer: number;
  bombPlanted: boolean;
  aliveAtk: number;
  aliveDef: number;
  team: Team;
  alive: boolean;
  hp: number;
  armor: number;
  helmet: boolean;
  weaponId: WeaponId;
  weaponName: string;
  ammo: number;
  reserve: number;
  magSize: number;
  reloading: boolean;
  melee: boolean;
  slots: SlotInfo[];
  zoom: number;
  hasBomb: boolean;
  hasKit: boolean;
  zone: string;
  hint: string;
  progress: number;
  progressLabel: string;
  notice: string;
  killfeed: KillEntry[];
  banner: Banner | null;
  spectating: string;
  canTakeover: boolean;
  showScores: boolean;
  scores: ScoreRow[];
  buyOpen: boolean;
  loadoutPrimary: WeaponId;
  loadoutSecondary: WeaponId;
  attackSite: string;
  matchOver: '' | 'win' | 'lose';
  fps: number;
}

export const defaultSettings: Settings = {
  team: 'def',
  mode: 'match',
  difficulty: 1,
  sensitivity: 1,
  volume: 0.7,
};

const initial: HudState = {
  screen: 'menu',
  settings: defaultSettings,
  locked: false,
  phase: 'freeze',
  roundNum: 1,
  pistol: true,
  scoreAtk: 0,
  scoreDef: 0,
  timer: 0,
  bombPlanted: false,
  aliveAtk: 5,
  aliveDef: 5,
  team: 'def',
  alive: true,
  hp: 100,
  armor: 0,
  helmet: false,
  weaponId: 'usp',
  weaponName: 'USP',
  ammo: 12,
  reserve: 48,
  magSize: 12,
  reloading: false,
  melee: false,
  slots: [],
  zoom: 0,
  hasBomb: false,
  hasKit: false,
  zone: '',
  hint: '',
  progress: -1,
  progressLabel: '',
  notice: '',
  killfeed: [],
  banner: null,
  spectating: '',
  canTakeover: false,
  showScores: false,
  scores: [],
  buyOpen: false,
  loadoutPrimary: 'm4a1',
  loadoutSecondary: 'usp',
  attackSite: '',
  matchOver: '',
  fps: 0,
};

type Listener = () => void;

class Store<T extends object> {
  private state: T;
  private listeners = new Set<Listener>();
  constructor(init: T) {
    this.state = init;
  }
  get = (): T => this.state;
  /** Shallow merge; listeners are only notified when at least one key really changed. */
  set(patch: Partial<T>): void {
    let changed = false;
    const cur = this.state as unknown as Record<string, unknown>;
    const p = patch as unknown as Record<string, unknown>;
    for (const k in p) {
      if (!Object.is(cur[k], p[k])) {
        changed = true;
        break;
      }
    }
    if (!changed) return;
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((l) => l());
  }
  subscribe = (l: Listener): (() => void) => {
    this.listeners.add(l);
    return () => {
      this.listeners.delete(l);
    };
  };
}

export const hud = new Store<HudState>(initial);

/** Subscribe a component to one slice of the HUD state. Selectors must return stable values. */
export function useHud<S>(selector: (s: HudState) => S): S {
  return useSyncExternalStore(
    hud.subscribe,
    () => selector(hud.get()),
    () => selector(hud.get()),
  );
}

/** DOM nodes the engine writes to every frame. */
export const hudRefs: {
  crosshair: HTMLElement | null;
  hitmarker: HTMLElement | null;
  vignette: HTMLElement | null;
  dmgArrow: HTMLElement | null;
  minimap: HTMLCanvasElement | null;
  flash: HTMLElement | null;
} = {
  crosshair: null,
  hitmarker: null,
  vignette: null,
  dmgArrow: null,
  minimap: null,
  flash: null,
};

export function resetHudForMenu(): void {
  hud.set({ ...initial, screen: 'menu', settings: hud.get().settings });
}
