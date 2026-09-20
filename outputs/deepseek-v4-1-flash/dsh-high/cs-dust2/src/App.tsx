import { useEffect, useRef, useState } from 'react';
import { Game } from './game/game';
import { sound } from './audio/audio';
import { initialHud, type HudState } from './game/types';
import type { MapData } from './world/mapLayout';
import { Hud } from './ui/Hud';
import { PauseMenu, StartMenu } from './ui/Menus';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);
  const [hud, setHud] = useState<HudState>(initialHud);
  const [map, setMap] = useState<MapData | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const game = new Game(canvas, setHud);
    gameRef.current = game;
    setMap(game.map);
    // Expose for debugging / automated smoke tests.
    (window as unknown as { __game?: Game }).__game = game;
    return () => {
      game.dispose();
      gameRef.current = null;
      delete (window as unknown as { __game?: Game }).__game;
    };
  }, []);

  const start = () => {
    sound.unlock();
    gameRef.current?.start();
    setStarted(true);
    gameRef.current?.input.requestLock();
  };

  const resume = () => {
    sound.unlock();
    gameRef.current?.setPaused(false);
  };

  const showPause = started && hud.paused;

  return (
    <>
      <canvas ref={canvasRef} />
      {started && map && <Hud hud={hud} map={map} />}
      {!started && <StartMenu onStart={start} />}
      {showPause && <PauseMenu onResume={resume} />}
    </>
  );
}
