import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Game } from './game/game';
import { Hud } from './ui/Hud';
import type { HudState } from './game/types';
import './index.css';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);
  const [snap, setSnap] = useState<HudState | null>(null);
  const [started, setStarted] = useState(false);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv || gameRef.current) return;
    const game = new Game(cv);
    gameRef.current = game;
    game.onHud((s) => setSnap(s));
    game.start();
    const onLock = () => setLocked(document.pointerLockElement === cv);
    document.addEventListener('pointerlockchange', onLock);
    const onErr = (e: Event) => e.preventDefault();
    cv.addEventListener('error', onErr);
    return () => {
      document.removeEventListener('pointerlockchange', onLock);
      cv.removeEventListener('error', onErr);
      game.destroy();
    };
  }, []);

  const handleStart = () => {
    gameRef.current?.requestStart();
    setStarted(true);
  };

  return (
    <div className="app">
      <canvas ref={canvasRef} className="game-canvas" />
      {snap && (
        <Hud
          snap={snap}
          started={started}
          locked={locked}
          onStart={handleStart}
          onRestart={() => gameRef.current?.reset()}
        />
      )}
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
