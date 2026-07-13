import type { HudState } from './types'

export function initialHud(): HudState {
  return {
    phase: 'menu',
    locked: false,
    auto: false,
    round: 1,
    pistolRound: true,
    ctScore: 0,
    tScore: 0,
    timeLeft: 0,
    bombTimeLeft: null,
    bombPlanted: false,
    freezeLeft: 0,
    winner: null,
    winReason: '',
    matchWinner: null,
    playerTeam: 'CT',
    loadout: 'rifle',
    me: {
      name: '你', team: 'CT', hp: 100, armor: 0, alive: true,
      weaponName: '', weaponId: 'knife', mag: 0, reserve: 0,
      reloading: false, scoped: false, hasBomb: false, spreadPx: 4,
    },
    spectating: null,
    channel: null,
    centerHint: null,
    killfeed: [],
    hitmarkerAt: -99,
    hitmarkerHead: false,
    damageAt: -99,
  }
}

/** Tiny external store bridging the game loop and React (useSyncExternalStore). */
export class HudStore {
  state: HudState = initialHud()
  private version = 0
  private listeners = new Set<() => void>()

  subscribe = (fn: () => void) => {
    this.listeners.add(fn)
    return () => { this.listeners.delete(fn) }
  }

  getSnapshot = () => this.version

  bump() {
    this.version++
    for (const fn of this.listeners) fn()
  }
}
