import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { DEFAULT_SETTINGS, GameClient, type ClientSettings } from './app/GameClient.ts';
import { Hud } from './ui/Hud.tsx';
import { MainMenu } from './ui/MainMenu.tsx';
import { Scoreboard } from './ui/Scoreboard.tsx';

type Phase = 'menu' | 'playing' | 'paused';

/**
 * Everything below the canvas is driven by the store snapshot; this component only
 * re-renders when the 30 Hz HUD snapshot changes, never per animation frame.
 */
function GameOverlay({ client, showScoreboard }: { client: GameClient; showScoreboard: boolean }) {
  const snap = useSyncExternalStore(client.store.subscribe, client.store.getSnapshot);
  const [fps, setFps] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setFps(client.fps), 500);
    return () => window.clearInterval(id);
  }, [client]);

  return (
    <>
      <Hud snap={snap} fps={fps} />
      {(showScoreboard || snap.phase === 'ended' || snap.phase === 'matchOver') && <Scoreboard snap={snap} />}
    </>
  );
}

export function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const clientRef = useRef<GameClient | null>(null);

  const [client, setClient] = useState<GameClient | null>(null);
  const [phase, setPhase] = useState<Phase>('menu');
  const [settings, setSettings] = useState<ClientSettings>(DEFAULT_SETTINGS);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [score, setScore] = useState<{ ct: number; t: number; round: number } | null>(null);

  // Keep live subsystems in sync with settings that can change mid-match.
  useEffect(() => {
    clientRef.current?.applySettings(settings);
  }, [settings]);

  useEffect(() => () => {
    clientRef.current?.dispose();
    clientRef.current = null;
  }, []);

  const attachClient = useCallback((next: GameClient) => {
    next.onScoreboard = (shown) => setShowScoreboard(shown);
    next.onPointerLockChange = (locked) => {
      if (locked) {
        setPhase('playing');
      } else {
        setPhase('paused');
        setScore({
          ct: next.world.round.scoreCT,
          t: next.world.round.scoreT,
          round: next.world.round.round,
        });
      }
    };
  }, []);

  // Pointer lock has to be requested synchronously from the click that triggered it —
  // awaiting the audio context first would cost us the user gesture.
  const startGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let active = clientRef.current;
    if (!active) {
      active = new GameClient(canvas, settings);
      attachClient(active);
      clientRef.current = active;
      setClient(active);
      active.start();
    }
    active.applySettings(settings);
    active.input.requestPointerLock();
    void active.enableAudio();
  }, [attachClient, settings]);

  const restart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    clientRef.current?.dispose();
    const next = new GameClient(canvas, { ...settings, seed: Math.floor(Math.random() * 100000) });
    attachClient(next);
    clientRef.current = next;
    setClient(next);
    setScore(null);
    next.start();
    next.input.requestPointerLock();
    void next.enableAudio();
  }, [attachClient, settings]);

  return (
    <div className="app">
      <canvas
        ref={canvasRef}
        className="game-canvas"
        onClick={() => {
          if (phase !== 'playing') startGame();
        }}
      />

      {client && phase === 'playing' && (
        <GameOverlay client={client} showScoreboard={showScoreboard} />
      )}

      {phase !== 'playing' && (
        <MainMenu
          mode={phase === 'menu' ? 'start' : 'paused'}
          settings={settings}
          onChange={setSettings}
          onStart={startGame}
          onRestart={restart}
          score={phase === 'paused' ? score : null}
        />
      )}
    </div>
  );
}
