import { useSyncExternalStore } from 'react';
import type { HudSnapshot } from '../core/types.ts';
import type { GameEngine } from '../game/engine.ts';

/**
 * Bridges the fixed-step simulation to React.
 *
 * The engine publishes an immutable HUD snapshot at ~20 Hz (and immediately on
 * important events like a kill or a plant). React only re-renders when that
 * snapshot changes, so the 64 Hz simulation and the 60 fps render loop never
 * pay for the component tree.
 */
export function useEngineSnapshot(engine: GameEngine): HudSnapshot {
  return useSyncExternalStore(
    (cb) => engine.subscribe(cb),
    () => engine.getSnapshot(),
    () => engine.getSnapshot(),
  );
}
