import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { GameEngine } from '../game/engine';
import type { HudSnapshot, Team } from '../game/types';
import { HUD } from './HUD';

const emptySubscribe = () => () => {};
const emptySnapshot = () => null;

export function GameView({ team, onExit }: { team: Team; onExit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [engine, setEngine] = useState<GameEngine | null>(null);
  const subscribe = useCallback((listener: () => void) => engine ? engine.subscribe(listener) : emptySubscribe(), [engine]);
  const getSnapshot = useCallback(() => engine ? engine.getSnapshot() : emptySnapshot(), [engine]);
  const snapshot = useSyncExternalStore(subscribe, getSnapshot) as HudSnapshot | null;

  useEffect(() => {
    if (!canvasRef.current) return;
    const game = new GameEngine(canvasRef.current, team);
    setEngine(game);
    return () => game.dispose();
  }, [team]);

  return (
    <main className="game-shell">
      <canvas ref={canvasRef} className="game-canvas" aria-label="Dustline 3D game viewport" />
      {engine && snapshot && <HUD engine={engine} snapshot={snapshot} onExit={onExit} />}
      {!snapshot && <div className="loading"><span /> INITIALIZING COMBAT SPACE</div>}
    </main>
  );
}
