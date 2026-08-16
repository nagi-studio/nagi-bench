import { useSyncExternalStore } from 'react'
import { subscribe, getVersion, hudState } from './game/store'
import type { HudState } from './game/types'

export function useHud(): HudState {
  useSyncExternalStore(subscribe, getVersion)
  return hudState
}
