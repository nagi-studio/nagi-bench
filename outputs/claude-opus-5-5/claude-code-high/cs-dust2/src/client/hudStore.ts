// External store bridging the imperative game loop to React (useSyncExternalStore).
import type { Team } from '../core/character.ts';
import type { RoundPhase } from '../core/round.ts';
import type { BombStatus } from '../core/sim.ts';
import type { Slot, WeaponId } from '../core/weapons.ts';

export interface KillfeedEntry {
  id: number;
  killer: string;
  killerTeam: Team;
  victim: string;
  victimTeam: Team;
  weapon: string;
  headshot: boolean;
  involvesMe: boolean;
  time: number;
}

export interface InventoryEntry {
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
  hs: number;
  alive: boolean;
  me: boolean;
  bot: boolean;
  bomb: boolean;
}

export interface BuyItem {
  key: string;
  id: WeaponId;
  name: string;
  owned: boolean;
}

export interface HudState {
  started: boolean;
  locked: boolean;
  playerTeam: Team;
  round: number;
  pistol: boolean;
  phase: RoundPhase;
  timeLeft: number;
  score: { CT: number; T: number };
  alive: { CT: number; T: number };
  bomb: { state: BombStatus; site: 'A' | 'B' | null; timeLeft: number };
  view: {
    name: string;
    team: Team;
    self: boolean;
    alive: boolean;
    health: number;
    armor: number;
    helmet: boolean;
    kit: boolean;
    weapon: string;
    weaponId: WeaponId | null;
    mag: number;
    reserve: number;
    magSize: number;
    reloading: boolean;
    reloadP: number;
    inventory: InventoryEntry[];
    hasBomb: boolean;
    scoped: boolean;
  };
  spectating: boolean;
  canTakeover: boolean;
  progress: { label: string; value: number; color: string } | null;
  message: { id: number; title: string; sub: string; color: string } | null;
  killfeed: KillfeedEntry[];
  hit: { id: number; head: boolean; kill: boolean };
  damage: { id: number; angle: number };
  buyOpen: boolean;
  canBuy: boolean;
  buyItems: BuyItem[];
  scoreboard: boolean;
  rows: ScoreRow[];
  matchOver: { winner: Team } | null;
  hint: string | null;
  fps: number;
}

type Listener = () => void;

export class HudStore {
  private state: HudState;
  private listeners = new Set<Listener>();

  constructor(initial: HudState) {
    this.state = initial;
  }

  subscribe = (l: Listener) => {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  };

  getSnapshot = () => this.state;

  set(next: HudState) {
    this.state = next;
    for (const l of this.listeners) l();
  }
}
