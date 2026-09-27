import { useState } from 'react';
import { Menu } from './Menu.tsx';
import { GameView } from './GameView.tsx';
import type { ClientOptions } from '../client/gameClient.ts';

const DEFAULTS: ClientOptions = {
  team: 'CT',
  difficulty: 'normal',
  allPistolRounds: false,
  sensitivity: 1,
  volume: 0.7,
  playerName: 'Player',
  shadows: true,
};

function loadOptions(): ClientOptions {
  try {
    const raw = localStorage.getItem('dust2-options');
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return DEFAULTS;
}

export function App() {
  const [options, setOptions] = useState<ClientOptions>(loadOptions);
  const [session, setSession] = useState<{ key: number; opts: ClientOptions } | null>(null);

  const start = (opts: ClientOptions) => {
    setOptions(opts);
    try {
      localStorage.setItem('dust2-options', JSON.stringify(opts));
    } catch {
      /* ignore */
    }
    setSession({ key: Date.now(), opts });
  };

  if (!session) return <Menu initial={options} onStart={start} />;
  return <GameView key={session.key} opts={session.opts} onExit={() => setSession(null)} />;
}
