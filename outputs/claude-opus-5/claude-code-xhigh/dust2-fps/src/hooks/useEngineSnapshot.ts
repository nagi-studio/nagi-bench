/**
 * React 与引擎之间唯一的状态通道。
 * 引擎在关键事件（击杀/回合切换/购买）时立刻 notify，其余情况按 20Hz 推快照，
 * 所以 HUD 既不会漏掉重要变化，也不会被 60Hz 的重渲染拖垮。
 */

import { useSyncExternalStore } from 'react';
import type { GameEngine, HudSnapshot } from '../game/engine.ts';

export function useEngineSnapshot(engine: GameEngine): HudSnapshot {
  return useSyncExternalStore(engine.subscribe, engine.getSnapshot, engine.getSnapshot);
}
