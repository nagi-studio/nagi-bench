import { useEffect, useRef, useState } from 'react';
import { Game, type GameOptions } from './game/Game';
import { GameContext } from './ui/context';
import { Hud } from './ui/Hud';
import { MainMenu } from './ui/MainMenu';

export default function App() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hostRef.current) return;
    let g: Game | null = null;
    try {
      g = new Game(hostRef.current);
      setGame(g);
      // handle for debugging / automated checks from the devtools console
      (window as unknown as { __game?: Game }).__game = g;
      const params = new URLSearchParams(window.location.search);
      if (params.has('demo')) {
        g.start({ team: 'CT', pistolStart: params.get('demo') !== 'full', sensitivity: 1, volume: 0, demo: true });
      }
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : String(e));
    }
    return () => {
      g?.dispose();
    };
  }, []);

  const start = (opts: GameOptions) => {
    game?.start(opts);
  };

  return (
    <div className="app">
      <div className="viewport" ref={hostRef} onClick={() => game?.requestLock()} />
      {error && <div className="fatal">无法初始化 WebGL：{error}</div>}
      {game && (
        <GameContext.Provider value={game}>
          <Hud />
          <MainMenu onStart={start} />
        </GameContext.Provider>
      )}
    </div>
  );
}
