import type { KillEvent, Team } from '../game/types';

export interface ChannelUI {
  label: string;
  frac: number;
}

export interface UIData {
  screen: 'menu' | 'game';
  locked: boolean;
  hp: number;
  armor: number;
  weaponName: string;
  mag: number | string;
  reserve: number;
  slot: string;
  hasPrimary: boolean;
  hasSecondary: boolean;
  reloading: boolean;
  crossGap: number;
  scoped: boolean;
  showCrosshair: boolean;
  hitTick: number;
  hitHead: boolean;
  killfeed: KillEvent[];
  roundNum: number;
  phase: string;
  timeLeft: number;
  scoreT: number;
  scoreCT: number;
  bomb: string;
  bombSite: string;
  hasBomb: boolean;
  aliveT: number;
  aliveCT: number;
  myTeam: Team;
  dead: boolean;
  spectating: string;
  canPossess: boolean;
  banner: string;
  subBanner: string;
  channel: ChannelUI | null;
  hint: string;
  flash: number;
}

const initialData: UIData = {
  screen: 'menu',
  locked: false,
  hp: 100,
  armor: 0,
  weaponName: '',
  mag: 0,
  reserve: 0,
  slot: 'secondary',
  hasPrimary: false,
  hasSecondary: true,
  reloading: false,
  crossGap: 8,
  scoped: false,
  showCrosshair: true,
  hitTick: 0,
  hitHead: false,
  killfeed: [],
  roundNum: 0,
  phase: 'freeze',
  timeLeft: 0,
  scoreT: 0,
  scoreCT: 0,
  bomb: 'idle',
  bombSite: '',
  hasBomb: false,
  aliveT: 5,
  aliveCT: 5,
  myTeam: 'T',
  dead: false,
  spectating: '',
  canPossess: false,
  banner: '',
  subBanner: '',
  channel: null,
  hint: '',
  flash: 0,
};

export class UIStore {
  data: UIData = { ...initialData };
  private listeners = new Set<() => void>();
  private killId = 1;

  subscribe = (fn: () => void): (() => void) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };

  get = (): UIData => this.data;

  set(patch: Partial<UIData>): void {
    this.data = { ...this.data, ...patch };
    for (const f of this.listeners) f();
  }

  reset(): void {
    this.data = { ...initialData, screen: this.data.screen, myTeam: this.data.myTeam };
    for (const f of this.listeners) f();
  }

  pushKill(k: Omit<KillEvent, 'id' | 'time'>): void {
    const ev: KillEvent = { ...k, id: this.killId++, time: Date.now() };
    const killfeed = [...this.data.killfeed, ev].slice(-5);
    this.set({ killfeed });
  }
}
