import type { HudState } from '../game/types.ts'

/**
 * 外部状态仓库（与 React 解耦）：
 * 3D 循环每 50ms 写入一次 HUD 快照，React 通过 useSyncExternalStore 订阅所需字段。
 * 因此高频的逻辑 / 渲染不会触发组件树的整体重渲染。
 */
export interface UiState {
  hud: HudState | null
  locked: boolean
}

type Listener = () => void

let state: UiState = { hud: null, locked: false }
const listeners = new Set<Listener>()

export const gameStore = {
  getState: (): UiState => state,
  patch: (p: Partial<UiState>): void => {
    state = { ...state, ...p }
    for (const l of listeners) l()
  },
  subscribe: (l: Listener): (() => void) => {
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  },
}
