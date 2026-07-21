import { useSyncExternalStore } from 'react';
import { gameStore, HudState } from '../store';

export function useHud(): HudState {
  return useSyncExternalStore(gameStore.subscribe, gameStore.getSnapshot);
}
