import { useEffect, useRef, useState } from 'react';
import { Dust2GameEngine } from './game/GameEngine';
import { HudSnapshot } from './game/types';
import { GameHUD } from './components/GameHUD';
import { Scoreboard } from './components/Scoreboard';
import { BuyMenu } from './components/BuyMenu';
import { OverlayMenus } from './components/OverlayMenus';

export default function App() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<Dust2GameEngine | null>(null);
  const [hud, setHud] = useState<HudSnapshot | null>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    const engine = new Dust2GameEngine(el, (snap) => {
      setHud(snap);
    });
    engineRef.current = engine;
    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  const engine = engineRef.current;

  return (
    <div className="app-root">
      <div ref={mountRef} className="viewport-canvas-host" />

      {hud && hud.started && (
        <GameHUD
          hud={hud}
          mapData={engine ? engine.mapData : null}
          onTakeover={() => engine?.takeoverSpectatedBot()}
        />
      )}

      {hud && <Scoreboard hud={hud} />}

      {hud && (
        <BuyMenu
          hud={hud}
          onBuyWeapon={(id) => engine?.buyWeapon(id)}
          onBuyArmor={(helmet) => engine?.buyArmor(helmet)}
          onClose={() => engine?.closeBuyMenu()}
        />
      )}

      {hud && (
        <OverlayMenus
          hud={hud}
          onStart={(team, mode) => engine?.startGame(team, mode)}
          onResume={() => engine?.resumeGame()}
          onSwitchTeam={(team) => engine?.setTeamAndRestart(team)}
          onSwitchMode={(mode) => engine?.setGameModeAndRestart(mode)}
          onSkipToFullBuy={() => engine?.skipToFullBuyRound()}
          onSetSensitivity={(v) => engine?.setSensitivity(v)}
          onSetVolume={(v) => engine?.setVolume(v)}
        />
      )}
    </div>
  );
}
