// Minimal external store bridging the imperative engine (rAF loop) and React.
// The engine patches primitive fields every frame; React components subscribe via
// useSyncExternalStore with selectors, so only components whose slice changed re-render.

import { useSyncExternalStore } from 'react';
import type { Team } from './types';
import type { RoundType } from './weapons/WeaponDefs';

export interface KillEntry {
  id: number;
  killer: string | null;
  killerTeam: Team | null;
  victim: string;
  victimTeam: Team;
  weapon: string;
  headshot: boolean;
  time: number;
  mine: boolean;
}

export interface ScoreRow {
  name: string;
  team: Team;
  kills: number;
  deaths: number;
  hs: number;
  alive: boolean;
  isPlayer: boolean;
  bomb: boolean;
}

export interface HudState {
  started: boolean;
  paused: boolean;
  locked: boolean;
  phase: 'freeze' | 'live' | 'post' | 'over';
  round: number;
  roundType: RoundType;
  scoreT: number;
  scoreCT: number;
  timeLeft: number;
  bombPlanted: boolean;
  bombTimeLeft: number;
  aliveT: number;
  aliveCT: number;
  playerTeam: Team;
  hp: number;
  armor: number;
  helmet: boolean;
  kit: boolean;
  hasBomb: boolean;
  weaponName: string;
  weaponId: string;
  ammo: number;
  reserve: number;
  magSize: number;
  reloading: boolean;
  reloadProgress: number;
  isMelee: boolean;
  slotKey: string;
  activeSlot: string;
  crosshairGap: number;
  scoped: boolean;
  hitTime: number;
  hitHead: boolean;
  killTime: number;
  damageTime: number;
  damageAngle: number;
  killfeed: KillEntry[];
  centerMsg: string;
  centerSub: string;
  centerColor: string;
  centerTime: number;
  progressLabel: string;
  progress: number;
  spectating: string;
  spectateTeam: Team | null;
  canTakeOver: boolean;
  hint: string;
  buyOpen: boolean;
  buyAllowed: boolean;
  buyReason: string;
  scoreboardOpen: boolean;
  scoreboard: ScoreRow[];
  callout: string;
  fps: number;
  matchWinner: Team | null;
  now: number;
}

export function initialHud(): HudState {
  return {
    started: false,
    paused: false,
    locked: false,
    phase: 'freeze',
    round: 1,
    roundType: 'pistol',
    scoreT: 0,
    scoreCT: 0,
    timeLeft: 0,
    bombPlanted: false,
    bombTimeLeft: 0,
    aliveT: 5,
    aliveCT: 5,
    playerTeam: 'CT',
    hp: 100,
    armor: 0,
    helmet: false,
    kit: false,
    hasBomb: false,
    weaponName: '',
    weaponId: '',
    ammo: 0,
    reserve: 0,
    magSize: 0,
    reloading: false,
    reloadProgress: 0,
    isMelee: false,
    slotKey: '',
    activeSlot: 'secondary',
    crosshairGap: 4,
    scoped: false,
    hitTime: -10,
    hitHead: false,
    killTime: -10,
    damageTime: -10,
    damageAngle: 0,
    killfeed: [],
    centerMsg: '',
    centerSub: '',
    centerColor: '#fff',
    centerTime: -10,
    progressLabel: '',
    progress: 0,
    spectating: '',
    spectateTeam: null,
    canTakeOver: false,
    hint: '',
    buyOpen: false,
    buyAllowed: false,
    buyReason: '',
    scoreboardOpen: false,
    scoreboard: [],
    callout: '',
    fps: 0,
    matchWinner: null,
    now: 0,
  };
}

export class Store<T extends object> {
  private state: T;
  private listeners = new Set<() => void>();

  constructor(initial: T) {
    this.state = initial;
  }

  get = (): T => this.state;

  subscribe = (fn: () => void): (() => void) => {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  };

  /** Shallow-merge; listeners fire only if at least one field actually changed. */
  patch(partial: Partial<T>): void {
    let changed = false;
    for (const k in partial) {
      if (!Object.is(this.state[k], partial[k])) {
        changed = true;
        break;
      }
    }
    if (!changed) return;
    this.state = { ...this.state, ...partial };
    for (const l of this.listeners) l();
  }
}

export function useStore<T extends object, R>(store: Store<T>, selector: (s: T) => R): R {
  return useSyncExternalStore(store.subscribe, () => selector(store.get()));
}
