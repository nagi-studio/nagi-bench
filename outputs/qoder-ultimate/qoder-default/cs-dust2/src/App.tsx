import { useEffect, useRef, useState } from 'react';
import { GameEngine } from './game/GameEngine';
import { useHud } from './ui/useHud';
import { HUD } from './ui/HUD';

export function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [started, setStarted] = useState(false);
  const hud = useHud();

  useEffect(() => {
    if (!containerRef.current) return;
    const engine = new GameEngine(containerRef.current);
    engineRef.current = engine;
    return () => engine.dispose();
  }, []);

  const handleStart = () => {
    engineRef.current?.start();
    setStarted(true);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <div
        ref={containerRef}
        style={{ position: 'absolute', inset: 0 }}
        onContextMenu={(e) => e.preventDefault()}
        onClick={() => {
          if (started) engineRef.current && (engineRef.current as any).input?.requestLock();
        }}
      />
      {started && <HUD hud={hud} />}
      {!started && <StartScreen onStart={handleStart} />}
      {started && <LockHint />}
    </div>
  );
}

function LockHint() {
  const [locked, setLocked] = useState(true);
  useEffect(() => {
    const h = () => setLocked(!!document.pointerLockElement);
    document.addEventListener('pointerlockchange', h);
    return () => document.removeEventListener('pointerlockchange', h);
  }, []);
  if (locked) return null;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        background: 'rgba(0,0,0,0.35)',
        fontSize: 20,
        pointerEvents: 'none',
      }}
    >
      Click to resume · mouse look locked
    </div>
  );
}

function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 40%, #2a3340, #0a0d12)',
        color: '#fff',
        fontFamily: 'Segoe UI, sans-serif',
      }}
    >
      <h1 style={{ fontSize: 46, margin: 0, letterSpacing: 4, color: '#e8b45b' }}>DUST2</h1>
      <p style={{ color: '#9fb0c0', marginTop: 4, letterSpacing: 2 }}>
        5v5 FPS PROTOTYPE · React + three.js
      </p>
      <div
        style={{
          margin: '18px 0',
          maxWidth: 560,
          textAlign: 'center',
          color: '#cdd6df',
          lineHeight: 1.7,
          fontSize: 14,
        }}
      >
        <b>WASD</b> move · <b>Space</b> jump · <b>Mouse</b> look · <b>LMB</b> fire · <b>RMB</b> scope (AWP)
        <br />
        <b>1/2/3</b> primary / pistol / knife · <b>R</b> reload · <b>E</b> plant/defuse · <b>V</b> take over teammate
        <br />
        You are a <span style={{ color: '#e8b45b' }}>Terrorist</span>. Plant the C4 at A or B, or eliminate the CTs.
        <br />
        Round 1 is a <b>pistol round</b>.
      </div>
      <button
        onClick={onStart}
        style={{
          pointerEvents: 'auto',
          padding: '14px 46px',
          fontSize: 20,
          fontWeight: 700,
          background: '#e8b45b',
          color: '#1a1a1a',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          letterSpacing: 2,
        }}
      >
        ENTER GAME
      </button>
      <p style={{ color: '#66707a', marginTop: 20, fontSize: 12 }}>
        Click enables pointer lock & audio
      </p>
    </div>
  );
}
