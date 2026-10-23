import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Game } from './game/engine';
import { Bridge } from './game/bridge';
import { audio } from './game/audio';
import { Hud } from './ui/Hud';
import { StartMenu, PauseMenu, MatchOver } from './ui/Menus';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const minimapRef = useRef<HTMLCanvasElement | null>(null);
  const crosshairRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<Game | null>(null);

  const [bridge] = useState(() => new Bridge());
  const hud = useSyncExternalStore(bridge.subscribe, bridge.getSnapshot);
  const [running, setRunning] = useState(false);
  const [locked, setLocked] = useState(false);
  const [vol, setVol] = useState(0.7);

  useEffect(() => {
    const onChange = () => setLocked(document.pointerLockElement !== null);
    document.addEventListener('pointerlockchange', onChange);
    return () => document.removeEventListener('pointerlockchange', onChange);
  }, []);

  useEffect(() => () => { gameRef.current?.stop(); gameRef.current = null; }, []);

  const start = useCallback((team: 'T' | 'CT', opts: { sens: number; vol: number }) => {
    audio.init();
    audio.setVolume(opts.vol);
    setVol(opts.vol);
    if (gameRef.current) gameRef.current.stop();
    const canvas = canvasRef.current!;
    const minimap = minimapRef.current!;
    const game = new Game({
      canvas, minimap, crosshair: crosshairRef.current, bridge, team,
    });
    game.input.sensitivity = opts.sens * 0.001;
    (window as unknown as { __game: Game }).__game = game;  // debugging / tests
    gameRef.current = game;
    game.start();
    setRunning(true);
    // pointer lock must happen inside the user gesture
    setTimeout(() => game.input.requestLock(), 30);
  }, [bridge]);

  const resume = useCallback(() => {
    audio.init();
    gameRef.current?.input.requestLock();
  }, []);

  const restart = useCallback(() => {
    gameRef.current?.restartMatch();
    resume();
  }, [resume]);

  const quit = useCallback(() => {
    gameRef.current?.stop();
    gameRef.current = null;
    setRunning(false);
  }, []);

  const onVolume = useCallback((v: number) => {
    setVol(v);
    audio.setVolume(v);
  }, []);

  // click on the canvas re-captures the mouse
  const onCanvasClick = useCallback(() => {
    if (running && !locked && hud.phase !== 'matchover') resume();
  }, [running, locked, hud.phase, resume]);

  const showPause = running && !locked && hud.phase !== 'matchover';

  return (
    <div className="app">
      <canvas ref={canvasRef} className="game-canvas" onClick={onCanvasClick} />

      {/* crosshair is written to directly by the engine (60fps, no React) */}
      <div className="crosshair" ref={crosshairRef}>
        <span className="ch t" /><span className="ch b" /><span className="ch l" /><span className="ch r" />
        <span className="ch dot" />
      </div>

      {running && <Hud hud={hud} />}

      {/* minimap canvas must exist before the Game is constructed; the engine paints it */}
      <div className="minimap-wrap" style={{ visibility: running ? 'visible' : 'hidden' }}>
        <canvas ref={minimapRef} width={230} height={268} className="minimap" />
        <div className="map-label">de_dust2</div>
      </div>

      {!running && <StartMenu onStart={start} />}

      {showPause && (
        <PauseMenu
          onResume={resume}
          onRestart={restart}
          onQuit={quit}
          vol={vol}
          onVolume={onVolume}
        />
      )}

      {hud.phase === 'matchover' && (
        <MatchOver
          winner={hud.scoreT > hud.scoreCT ? 'T' : 'CT'}
          scoreT={hud.scoreT}
          scoreCT={hud.scoreCT}
          onRestart={restart}
        />
      )}

      {running && (
        <div className="fps-tag">{hud.fps} fps</div>
      )}
    </div>
  );
}
