// Minimal external store bridging the imperative engine to React HUD via
// useSyncExternalStore. The engine mutates through set(); the snapshot identity
// changes on each flush so React re-renders.

import { KillEvent, RoundPhase, Team } from './types';

export interface HudState {
  started: boolean;
  playerTeam: Team;
  phase: RoundPhase;
  roundNum: number;
  scoreT: number;
  scoreCT: number;
  roundTime: number;
  aliveT: number;
  aliveCT: number;

  alive: boolean;
  spectating: boolean;
  spectateName: string;
  health: number;
  armor: number;
  helmet: boolean;

  weaponName: string;
  weaponId: string;
  mag: number;
  reserve: number;
  infiniteAmmo: boolean;
  reloading: boolean;
  scoped: boolean;
  spread: number; // radians, drives crosshair gap

  hasBomb: boolean;
  bombPlanted: boolean;
  bombTimer: number;
  defusing: boolean;
  defuseProgress: number;
  planting: boolean;
  plantProgress: number;

  hint: string;
  banner: string;
  killfeed: KillEvent[];

  loadout: { id: string; name: string; slot: string; mag: number; reserve: number; current: boolean }[];
}

const initial: HudState = {
  started: false,
  playerTeam: Team.T,
  phase: RoundPhase.Warmup,
  roundNum: 0,
  scoreT: 0,
  scoreCT: 0,
  roundTime: 0,
  aliveT: 5,
  aliveCT: 5,
  alive: true,
  spectating: false,
  spectateName: '',
  health: 100,
  armor: 0,
  helmet: false,
  weaponName: '',
  weaponId: '',
  mag: 0,
  reserve: 0,
  infiniteAmmo: false,
  reloading: false,
  scoped: false,
  spread: 0.02,
  hasBomb: false,
  bombPlanted: false,
  bombTimer: 0,
  defusing: false,
  defuseProgress: 0,
  planting: false,
  plantProgress: 0,
  hint: '',
  banner: '',
  killfeed: [],
  loadout: [],
};

class HudStore {
  private state: HudState = initial;
  private listeners = new Set<() => void>();

  subscribe = (fn: () => void): (() => void) => {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  };

  getSnapshot = (): HudState => this.state;

  set(partial: Partial<HudState>): void {
    this.state = { ...this.state, ...partial };
    for (const fn of this.listeners) fn();
  }

  reset(): void {
    this.set({ ...initial });
  }
}

export const hud = new HudStore();
