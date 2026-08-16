// ============================================================================
// HUD 状态存储 —— 引擎高频更新、React 通过 useSyncExternalStore 订阅。
// 引擎内部维护一个可变 state + version 计数，仅在变化时通知。
// ============================================================================
import type { HudState } from './types';

export class HudStore {
  private state: HudState;
  private listeners = new Set<() => void>();

  constructor() {
    this.state = HudStore.initialState();
  }

  static initialState(): HudState {
    return {
      version: 0,
      phase: 'menu',
      phaseTimeLeft: 0,
      round: 0,
      roundTimeLeft: 0,
      bombState: 'none',
      bombTimer: 0,
      bombCarrierTeam: null,
      bombWorld: null,
      self: {
        team: 'CT', alive: false, hp: 100, armor: 0,
        weaponName: '', slot: 0, mag: 0, reserve: 0,
        hasPrimary: false, hasBomb: false, money: 0,
        zoomed: false, zoomLevel: 0, crosshairGap: 6, reloading: false,
      },
      spectating: null,
      killfeed: [],
      scores: { t: 0, ct: 0 },
      banner: null,
      players: [],
      pistolRound: true,
      buyOpen: false,
      buyLocked: true,
      hitmarker: 0,
      damageFlash: 0,
      damageDir: 0,
      lockHint: false,
      matchWinner: null,
      defusing: 0,
      planting: 0,
      selfIndex: -1,
      scoreboard: false,
    };
  }

  /** 引擎直接改写（内部），随后替换快照引用以触发 React 更新 */
  mutate(fn: (s: HudState) => void) {
    fn(this.state);
    this.state = { ...this.state };
    this.state.version++;
    for (const l of this.listeners) l();
  }

  getSnapshot = (): HudState => this.state;

  subscribe = (cb: () => void): (() => void) => {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  };

  reset() {
    this.state = HudStore.initialState();
    this.state.version++;
    for (const l of this.listeners) l();
  }
}
