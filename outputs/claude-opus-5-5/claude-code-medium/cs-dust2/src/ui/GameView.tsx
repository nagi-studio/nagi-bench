import { useEffect, useRef, useState } from 'react';
import { Game } from '../game/client/Game.ts';
import type { GameOptions } from '../game/client/Game.ts';
import { Hud } from './Hud.tsx';

interface Props {
  options: GameOptions;
  onExit: () => void;
}

/** Owns the Game instance lifecycle: created on mount, disposed on unmount. */
export function GameView({ options, onExit }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let g: Game | null = null;
    try {
      g = new Game(host, options);
      setGame(g);
    } catch (err) {
      console.error(err);
      setError(String(err instanceof Error ? err.message : err));
    }
    return () => {
      g?.dispose();
      setGame(null);
    };
  }, [options]);

  return (
    <div className="game-root">
      <div ref={hostRef} className="canvas-host" />
      {game && <Hud game={game} onExit={onExit} />}
      {error && (
        <div className="overlay">
          <div className="overlay-card">
            <h2>无法启动 WebGL</h2>
            <p>{error}</p>
            <button className="start-btn" onClick={onExit}>
              返回
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
