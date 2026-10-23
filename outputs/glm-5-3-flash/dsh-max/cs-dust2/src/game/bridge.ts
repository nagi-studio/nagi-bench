/**
 * bridge.ts — the one-way data channel from the game engine to React (HUD).
 * The engine pushes a snapshot ~12×/s; high-frequency values (crosshair
 * spread, minimap) are written straight to DOM/canvas by the engine.
 */

export type Phase = 'freeze' | 'live' | 'planted' | 'over' | 'matchover';

export interface KillEvent {
  id: number;
  killer: string; killerTeam: 'T' | 'CT';
  victim: string; victimTeam: 'T' | 'CT';
  weapon: string; headshot: boolean;
}

export interface PlayerRow {
  name: string; team: 'T' | 'CT'; kills: number; deaths: number;
  alive: boolean; isPlayer: boolean; hasC4: boolean; money: number;
}

export interface HudSnapshot {
  phase: Phase;
  round: number;
  scoreT: number;
  scoreCT: number;
  timeLeft: number;
  bombState: 'carried' | 'dropped' | 'planted' | 'defused' | 'exploded' | 'none';
  bombSite: 'A' | 'B' | null;
  bombTimer: number;
  hp: number;
  armor: number;
  helmet: boolean;
  alive: boolean;
  team: 'T' | 'CT';
  weaponName: string;
  weaponSlot: string;
  mag: number;
  reserve: number;
  reloading: boolean;
  scoped: boolean;
  hasC4: boolean;
  prompt: string | null;
  progress: number;         // 0..1 plant / defuse bar
  progressLabel: string | null;
  kills: number;
  deaths: number;
  aliveT: number;
  aliveCT: number;
  killfeed: KillEvent[];
  message: string | null;
  messageSub: string | null;
  spectating: string | null;
  canTakeOver: boolean;
  players: PlayerRow[];
  roundResult: 'T' | 'CT' | null;
  roundReason: string;
  owned: boolean;           // controlling our own body or a teammate
  fps: number;
}

export const initialSnapshot: HudSnapshot = {
  phase: 'freeze', round: 1, scoreT: 0, scoreCT: 0, timeLeft: 0,
  bombState: 'none', bombSite: null, bombTimer: 0,
  hp: 100, armor: 0, helmet: false, alive: true, team: 'T',
  weaponName: 'Glock-18', weaponSlot: 'secondary', mag: 20, reserve: 60, reloading: false, scoped: false,
  hasC4: false, prompt: null, progress: 0, progressLabel: null,
  kills: 0, deaths: 0, aliveT: 5, aliveCT: 5, killfeed: [],
  message: null, messageSub: null, spectating: null, canTakeOver: false,
  players: [], roundResult: null, roundReason: '', owned: true, fps: 0,
};

export class Bridge {
  snapshot: HudSnapshot = initialSnapshot;
  private listeners = new Set<() => void>();

  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => { this.listeners.delete(fn); };
  };
  getSnapshot = () => this.snapshot;

  push(s: HudSnapshot) {
    this.snapshot = s;
    for (const fn of this.listeners) fn();
  }
}
