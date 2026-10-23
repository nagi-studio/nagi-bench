import { createContext, useContext } from 'react';
import type { Game } from '../game/Game';
import type { HudState } from '../game/store';
import { useStore } from '../game/store';

export const GameContext = createContext<Game | null>(null);

export function useGame(): Game {
  const g = useContext(GameContext);
  if (!g) throw new Error('GameContext missing');
  return g;
}

export function useHud<R>(selector: (s: HudState) => R): R {
  const g = useGame();
  return useStore(g.store, selector);
}
