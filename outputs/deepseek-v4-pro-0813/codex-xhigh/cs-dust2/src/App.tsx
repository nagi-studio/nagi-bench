import { useEffect, useRef, useState } from 'react';
import { Dust2Game } from './game/engine';
import { HudState, DEFAULT_HUD_STATE } from './game/types';
import HUD from './components/HUD';

export default function App() {
  const mountRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Dust2Game | null>(null);
  const [hud, setHud] = useState<HudState>(DEFAULT_HUD_STATE);

  useEffect(() => {
    if (!mountRef.current) return;
    const game = new Dust2Game(mountRef.current);
    gameRef.current = game;
    game.onHudState((next) => setHud({ ...next }));
    game.start();
    return () => {
      game.dispose();
      gameRef.current = null;
    };
  }, []);

  return (
    <div className="app-shell">
      <div ref={mountRef} className="game-mount" />
      <HUD hud={hud} onResume={() => gameRef.current?.resumeFromMenu()} />
    </div>
  );
}
