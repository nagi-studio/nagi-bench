import { useState } from 'react';
import type { GameOptions } from '../game/client/Game.ts';
import { GameView } from './GameView.tsx';
import { Menu } from './Menu.tsx';

export function App() {
  const [options, setOptions] = useState<GameOptions | null>(null);
  if (!options) return <Menu onStart={setOptions} />;
  return <GameView options={options} onExit={() => setOptions(null)} />;
}
