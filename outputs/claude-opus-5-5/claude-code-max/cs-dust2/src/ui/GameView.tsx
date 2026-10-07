import { useEffect, useRef, useState } from 'react';
import type { AudioEngine } from '../game/audio/AudioEngine';
import type { MatchSettings } from '../game/core/types';
import { GameEngine } from '../game/engine/GameEngine';
import { Hud } from './Hud';

interface Props {
  settings: MatchSettings;
  audio: AudioEngine;
  onExit: (s?: MatchSettings) => void;
}

/**
 * React owns the lifecycle (mount → create engine, unmount → dispose); the engine owns the
 * canvas and its own requestAnimationFrame loop. HUD components subscribe to the engine store.
 */
export function GameView({ settings, audio, onExit }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // settings/audio are fixed for the lifetime of a session (GameView is keyed per session)
  const initial = useRef({ settings, audio });
  const [engine, setEngine] = useState<GameEngine | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let e: GameEngine | null = null;
    // defer one frame so the loading screen paints before the (synchronous) world build
    const id = requestAnimationFrame(() => {
      try {
        e = new GameEngine(canvas, initial.current.settings, initial.current.audio);
        e.start();
        setEngine(e);
        if (import.meta.env.DEV) (window as unknown as { __engine?: GameEngine }).__engine = e;
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : String(err));
      }
    });
    return () => {
      cancelAnimationFrame(id);
      e?.dispose();
    };
  }, []);

  return (
    <div className="game-root">
      <canvas ref={canvasRef} className="game-canvas" onClick={() => engine?.resume()} />
      {!engine && !error && (
        <div className="loading">
          <div className="spinner" />
          <div>正在生成 Dust2 地图、角色与音效…</div>
        </div>
      )}
      {error && (
        <div className="loading">
          <div className="error-title">启动失败</div>
          <div>{error}</div>
          <button className="btn" onClick={() => onExit()}>
            返回菜单
          </button>
        </div>
      )}
      {engine && <Hud engine={engine} onExit={onExit} />}
    </div>
  );
}
