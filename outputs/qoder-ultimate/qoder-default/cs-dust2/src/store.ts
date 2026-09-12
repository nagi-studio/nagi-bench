import { Team, WeaponId } from './game/types';

export interface KillEvent {
  id: number;
  killer: string;
  victim: string;
  weapon: WeaponId;
  headshot: boolean;
  killerTeam: Team;
  victimTeam: Team;
}

export interface MinimapDot {
  x: number;
  z: number;
  team: Team;
  isPlayer: boolean;
  alive: boolean;
  visible: boolean;
}

export interface HudState {
  started: boolean;
  health: number;
  armor: number;
  helmet: boolean;
  weaponName: string;
  weaponId: WeaponId;
  ammo: number;
  reserve: number;
  reloading: boolean;
  scoped: boolean;
  spread: number; // crosshair bloom in px
  team: Team;
  alive: boolean;
  spectating: string | null;
  kills: KillEvent[];
  scoreCT: number;
  scoreT: number;
  roundNumber: number;
  isPistolRound: boolean;
  phase: string;
  roundTime: number;
  bombPlanted: boolean;
  bombTimer: number;
  hasBomb: boolean;
  planting: number; // 0..1 progress
  defusing: number; // 0..1 progress
  winner: Team | null;
  winReason: string;
  alivesCT: number;
  alivesT: number;
  minimap: MinimapDot[];
  bombPos: { x: number; z: number } | null;
  hitMarker: number; // timestamp of last hit for flash
  damageFlash: number;
  message: string;
}

const initial: HudState = {
  started: false,
  health: 100,
  armor: 0,
  helmet: false,
  weaponName: '',
  weaponId: 'usp',
  ammo: 0,
  reserve: 0,
  reloading: false,
  scoped: false,
  spread: 8,
  team: 'CT',
  alive: true,
  spectating: null,
  kills: [],
  scoreCT: 0,
  scoreT: 0,
  roundNumber: 1,
  isPistolRound: true,
  phase: 'freezetime',
  roundTime: 0,
  bombPlanted: false,
  bombTimer: 0,
  hasBomb: false,
  planting: 0,
  defusing: 0,
  winner: null,
  winReason: '',
  alivesCT: 5,
  alivesT: 5,
  minimap: [],
  bombPos: null,
  hitMarker: 0,
  damageFlash: 0,
  message: '',
};

type Listener = () => void;

class Store {
  private state: HudState = initial;
  private listeners = new Set<Listener>();

  getSnapshot = (): HudState => this.state;

  subscribe = (l: Listener) => {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  };

  set = (patch: Partial<HudState>) => {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((l) => l());
  };
}

export const gameStore = new Store();
