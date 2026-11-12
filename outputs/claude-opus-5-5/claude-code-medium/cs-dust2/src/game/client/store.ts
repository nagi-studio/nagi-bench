// Tiny external store consumed by React via useSyncExternalStore. The game loop
// publishes immutable HUD snapshots at a throttled rate so React re-renders
// stay cheap while the 3D view runs at full frame rate.
import type { Team } from '../core/entity.ts';
import type { Phase } from '../core/sim.ts';
import type { WeaponId } from '../core/weapons.ts';

export class Store<T> {
  private state: T;
  private listeners = new Set<() => void>();
  constructor(initial: T) {
    this.state = initial;
  }
  get = (): T => this.state;
  set(next: T) {
    this.state = next;
    this.listeners.forEach((l) => l());
  }
  subscribe = (l: () => void) => {
    this.listeners.add(l);
    return () => {
      this.listeners.delete(l);
    };
  };
}

export interface KillfeedEntry {
  key: number;
  killer: string | null;
  killerTeam: Team | null;
  victim: string;
  victimTeam: Team;
  weapon: string;
  headshot: boolean;
  mine: boolean;
  time: number;
}

export interface ScoreRow {
  id: number;
  name: string;
  team: Team;
  kills: number;
  deaths: number;
  alive: boolean;
  isPlayer: boolean;
  isControlled: boolean;
  hp: number;
}

export interface HudState {
  ready: boolean;
  locked: boolean;
  phase: Phase;
  round: number;
  roundTypeLabel: string;
  isPistolRound: boolean;
  score: Record<Team, number>;
  winsToMatch: number;
  timeLeft: number;
  bombState: 'carried' | 'dropped' | 'planted' | 'defused' | 'exploded';
  bombTime: number;
  bombSite: string | null;
  playerTeam: Team;
  aliveCount: Record<Team, number>;
  // view / control
  viewName: string;
  viewTeam: Team;
  spectating: boolean;
  controlledIsPlayer: boolean;
  canTakeover: boolean;
  deathCam: boolean;
  // vitals
  hp: number;
  armor: number;
  helmet: boolean;
  hasBomb: boolean;
  location: string;
  // weapon
  weaponId: WeaponId;
  weaponName: string;
  mag: number;
  magSize: number;
  reserve: number;
  isMelee: boolean;
  reloadFrac: number | null;
  slots: { primary: string | null; secondary: string | null; melee: string; active: string };
  crosshairGap: number;
  scoped: boolean;
  // objective
  plantProgress: number | null;
  defuseProgress: number | null;
  hint: string | null;
  // feedback
  killfeed: KillfeedEntry[];
  hitmarkerAt: number;
  hitmarkerHead: boolean;
  killmarkerAt: number;
  damageAt: number;
  now: number;
  banner: { title: string; sub: string; team: Team | null } | null;
  // menus
  buyOpen: boolean;
  canBuy: boolean;
  buyAllowPrimary: boolean;
  prefs: { primary: WeaponId | null; secondary: WeaponId | null };
  showScores: boolean;
  scores: ScoreRow[];
  matchWinner: Team | null;
}
