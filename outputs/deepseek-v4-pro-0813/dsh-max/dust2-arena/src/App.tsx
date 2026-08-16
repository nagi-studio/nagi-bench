import { useEffect, useRef, useState } from 'react';
import { Game } from './game/engine';
import { Hud } from './ui/Hud';
import { Minimap } from './ui/Minimap';
import { Menus } from './ui/Menus';

export const GameContext = { game: null as Game | null };

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const g = new Game(canvas);
    g.initScene();
    g.input.attach(canvas);
    GameContext.game = g;
    (window as unknown as { __game: Game }).__game = g;
    setGame(g);
    return () => {
      g.destroy();
      GameContext.game = null;
      (window as unknown as { __game: Game | null }).__game = null;
      setGame(null);
    };
  }, []);

  return (
    <div className="app-root">
      <canvas ref={canvasRef} className="game-canvas" />
      {game && (
        <>
          <Hud game={game} />
          <Minimap game={game} />
          <Menus game={game} />
        </>
      )}
    </div>
  );
}
