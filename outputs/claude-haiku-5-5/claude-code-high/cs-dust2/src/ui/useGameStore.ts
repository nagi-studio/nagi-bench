import { useSyncExternalStore } from 'react'
import { gameStore, type UiState } from '../store/gameStore.ts'

/** 订阅外部 store 的一个切片。selector 应返回已有引用（如 s.hud），避免无限重渲染。 */
export function useGameStore<T>(selector: (s: UiState) => T): T {
  return useSyncExternalStore(gameStore.subscribe, () => selector(gameStore.getState()))
}
