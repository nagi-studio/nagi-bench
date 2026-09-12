import type { HudState } from './types'

function defaultHud(): HudState {
  return {
    hp: 100,
    armor: 0,
    hasHelmet: false,
    weaponName: 'USP-S',
    weaponSlot: 'secondary',
    mag: 12,
    reserve: 24,
    reloading: false,
    scope: false,
    crosshairGap: 8,
    killfeed: [],
    round: 1,
    roundPhase: 'freeze',
    bombTimer: 40,
    bombState: 'none',
    bombCarrier: null,
    scoreT: 0,
    scoreCT: 0,
    pistolRound: true,
    spectating: false,
    spectatedName: '',
    hint: '',
    banner: null,
    team: 'CT',
    minimap: { players: [], bomb: null, siteA: { x: -15, z: 15 }, siteB: { x: 20, z: 14 } },
    version: 0,
  }
}

export const hudState: HudState = defaultHud()

let version = 0
const listeners = new Set<() => void>()

export function getVersion(): number {
  return version
}

export function subscribe(cb: () => void): () => void {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

export function notifyHud(): void {
  version++
  hudState.version = version
  for (const l of listeners) l()
}
