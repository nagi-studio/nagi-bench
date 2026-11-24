import React, { useEffect, useRef, useState } from 'react';
import { BuyMenu } from './components/BuyMenu';
import { GameHUD } from './components/GameHUD';
import { Scoreboard } from './components/Scoreboard';
import { StartOverlay } from './components/StartOverlay';
import { GameEngine } from './game/engine/GameEngine';
import { GameMode, HudState, Team, WeaponId } from './game/types';

export const App: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [hud, setHud] = useState<HudState | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const engine = new GameEngine(container, (snapshot) => {
      setHud(snapshot);
    });
    engineRef.current = engine;

    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  const handleStart = (team: Team, mode: GameMode) => {
    engineRef.current?.startMatch(team, mode);
  };

  const handleResume = () => {
    engineRef.current?.resumeGame();
  };

  const handleRestart = () => {
    engineRef.current?.restartMatch();
  };

  const handleBuy = (item: WeaponId | 'armor' | 'helmet') => {
    engineRef.current?.buyItem(item);
  };

  const handleCloseBuy = () => {
    engineRef.current?.closeBuyMenu();
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Three.js WebGL Viewport */}
      <div
        ref={mountRef}
        style={{ width: '100%', height: '100%' }}
        onClick={() => {
          if (hud?.started && !hud.paused && !hud.buyMenuOpen && !hud.pointerLocked) {
            engineRef.current?.requestPointerLock();
          }
        }}
      />

      {/* Active In-Game 2D HUD */}
      {hud && hud.started && engineRef.current && (
        <GameHUD hud={hud} mapData={engineRef.current.mapData} />
      )}

      {/* Tactical Buy Menu (B Key) */}
      {hud && hud.started && hud.buyMenuOpen && (
        <BuyMenu hud={hud} onBuy={handleBuy} onClose={handleCloseBuy} />
      )}

      {/* Live 5v5 Scoreboard (Tab Key) */}
      {hud && hud.started && hud.scoreboardOpen && <Scoreboard hud={hud} />}

      {/* Launch / Pause Overlay */}
      {hud && (!hud.started || hud.paused) && (
        <StartOverlay
          hud={hud}
          onStart={handleStart}
          onResume={handleResume}
          onRestart={handleRestart}
          onSensitivityChange={(s) => engineRef.current?.setSensitivity(s)}
          onMuteToggle={(m) => engineRef.current?.setMuted(m)}
        />
      )}
    </div>
  );
};

export default App;
