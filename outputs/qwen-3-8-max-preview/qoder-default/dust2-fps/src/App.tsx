import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameEngine } from './game/engine/GameEngine';
import { GameState } from './game/types';
import { HUD } from './ui/HUD';

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [started, setStarted] = useState(false);
  const [scopeOverlay, setScopeOverlay] = useState(false);

  useEffect(() => {
    if (!started || !containerRef.current) return;

    const engine = new GameEngine(containerRef.current);
    engineRef.current = engine;

    engine.setStateChangeCallback((state) => {
      setGameState({ ...state });
      setScopeOverlay(engine.getScopeOverlay());
    });

    engine.start();

    return () => {
      engine.stop();
      engineRef.current = null;
    };
  }, [started]);

  const handleStart = useCallback(() => {
    setStarted(true);
  }, []);

  const handleCanvasClick = useCallback(() => {
    if (engineRef.current && !engineRef.current.isPointerLocked()) {
      engineRef.current.requestPointerLock();
    }
  }, []);

  if (!started) {
    return (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        color: '#fff', fontFamily: "'Segoe UI', Arial, sans-serif"
      }}>
        <h1 style={{ fontSize: 48, fontWeight: 'bold', marginBottom: 8, textShadow: '0 4px 8px rgba(0,0,0,0.5)' }}>
          DUST2 <span style={{ color: '#fbbf24' }}>FPS</span>
        </h1>
        <p style={{ color: '#aaa', marginBottom: 40, fontSize: 16 }}>5v5 Tactical Shooter - Pistol Round</p>

        <button
          onClick={handleStart}
          style={{
            padding: '14px 48px', fontSize: 18, fontWeight: 'bold',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            border: 'none', borderRadius: 8, color: '#000', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(245,158,11,0.4)',
            transition: 'transform 0.1s'
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          PLAY
        </button>

        <div style={{ marginTop: 40, color: '#888', fontSize: 13, textAlign: 'center', lineHeight: 2 }}>
          <div><b style={{ color: '#ccc' }}>WASD</b> Move | <b style={{ color: '#ccc' }}>Mouse</b> Look | <b style={{ color: '#ccc' }}>Space</b> Jump</div>
          <div><b style={{ color: '#ccc' }}>LMB</b> Shoot | <b style={{ color: '#ccc' }}>RMB</b> Scope (AWP) | <b style={{ color: '#ccc' }}>R</b> Reload</div>
          <div><b style={{ color: '#ccc' }}>1/2/3</b> Switch Weapon | <b style={{ color: '#ccc' }}>F</b> Plant/Defuse | <b style={{ color: '#ccc' }}>E</b> Spectate Switch</div>
        </div>

        <div style={{ marginTop: 20, color: '#666', fontSize: 11 }}>
          You play as CT. Click to lock mouse. React + Three.js + TypeScript
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }} onClick={handleCanvasClick}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      {gameState && <HUD state={gameState} scopeOverlay={scopeOverlay} />}
    </div>
  );
};

export default App;
