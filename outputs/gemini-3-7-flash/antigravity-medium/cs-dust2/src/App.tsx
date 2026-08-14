import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from './engine/GameEngine';
import { HUD } from './ui/HUD';
import { BuyMenu } from './ui/BuyMenu';
import { Scoreboard } from './ui/Scoreboard';
import { ControlsModal } from './ui/ControlsModal';
import { CharacterState, RoundState, KillFeedEntry, WeaponId } from './types/game';

export const App: React.FC = () => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  // UI States
  const [gameState, setGameState] = useState<{
    player: CharacterState | null;
    round: RoundState | null;
    allEntities: CharacterState[];
    spectatingEntity: CharacterState | null;
    isSpectating: boolean;
  }>({
    player: null,
    round: null,
    allEntities: [],
    spectatingEntity: null,
    isSpectating: false,
  });

  const [killfeed, setKillfeed] = useState<KillFeedEntry[]>([]);
  const [damageFlash, setDamageFlash] = useState(false);
  const [plantProgress, setPlantProgress] = useState(0);
  const [defuseProgress, setDefuseProgress] = useState(0);

  // Modals
  const [isBuyMenuOpen, setIsBuyMenuOpen] = useState(false);
  const [isScoreboardOpen, setIsScoreboardOpen] = useState(false);
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (!canvasContainerRef.current) return;

    const engine = new GameEngine(canvasContainerRef.current, {
      onStateUpdate: (state) => {
        setGameState({
          player: { ...state.player },
          round: { ...state.round },
          allEntities: [...state.allEntities],
          spectatingEntity: state.spectatingEntity ? { ...state.spectatingEntity } : null,
          isSpectating: state.isSpectating,
        });
      },
      onKillFeed: (entry) => {
        setKillfeed((prev) => [...prev, entry]);
      },
      onDamageTaken: () => {
        setDamageFlash(true);
        setTimeout(() => setDamageFlash(false), 120);
      },
      onPlantProgress: (prog) => {
        setPlantProgress(prog);
      },
      onDefuseProgress: (prog) => {
        setDefuseProgress(prog);
      },
    });

    engineRef.current = engine;

    // Pointer Lock change listener
    const handlePointerLockChange = () => {
      const locked = document.pointerLockElement === engine.renderer.domElement;
      setIsLocked(locked);
      if (locked) {
        setIsBuyMenuOpen(false);
        setIsControlsOpen(false);
      }
    };
    document.addEventListener('pointerlockchange', handlePointerLockChange);

    // Global Key Listener for B, Tab, Esc
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyB') {
        setIsBuyMenuOpen((prev) => !prev);
        if (document.pointerLockElement) {
          document.exitPointerLock();
        }
      }
      if (e.code === 'Tab') {
        e.preventDefault();
        setIsScoreboardOpen(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Tab') {
        setIsScoreboardOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      engine.destroy();
    };
  }, []);

  const handleBuyWeapon = (wId: WeaponId) => {
    engineRef.current?.buyWeapon(wId);
  };

  const handleBuyGear = (type: 'armor' | 'helmet' | 'kit') => {
    engineRef.current?.buyGear(type);
  };

  const handleTogglePistolRound = () => {
    engineRef.current?.startRound(true);
    setIsBuyMenuOpen(false);
  };

  const handleTakeOverBot = () => {
    engineRef.current?.takeOverBot();
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none font-['Inter']">
      {/* 3D WebGL Canvas Container */}
      <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-crosshair" />

      {/* Main HUD */}
      {gameState.player && gameState.round && (
        <HUD
          player={gameState.player}
          round={gameState.round}
          allEntities={gameState.allEntities}
          spectatingEntity={gameState.spectatingEntity}
          isSpectating={gameState.isSpectating}
          killfeed={killfeed}
          damageFlash={damageFlash}
          plantProgress={plantProgress}
          defuseProgress={defuseProgress}
          onOpenBuyMenu={() => {
            setIsBuyMenuOpen(true);
            if (document.pointerLockElement) document.exitPointerLock();
          }}
          onOpenControls={() => {
            setIsControlsOpen(true);
            if (document.pointerLockElement) document.exitPointerLock();
          }}
          onTakeOverBot={handleTakeOverBot}
        />
      )}

      {/* Start / Focus Splash Overlay if not pointer locked */}
      {!isLocked && !isBuyMenuOpen && !isControlsOpen && (
        <div
          onClick={() => {
            if (engineRef.current) {
              engineRef.current.renderer.domElement.requestPointerLock();
            }
          }}
          className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm cursor-pointer select-none"
        >
          <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-[#0b1329]/95 border border-sky-400/30 shadow-2xl text-center max-w-md animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-2xl shadow-inner">
              🎯
            </div>
            <div>
              <h1 className="text-3xl font-black font-['Chakra_Petch'] text-white tracking-wider">
                DUST II 5v5 PROTOTYPE
              </h1>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Counter-Strike 5v5 Dust2 Match Engine (Procedural 3D)
              </p>
            </div>

            <div className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-mono font-bold text-sm shadow-lg shadow-sky-500/25">
              CLICK TO ENTER COMBAT
            </div>

            <div className="text-[11px] font-mono text-slate-400 space-y-0.5">
              <div>WASD Move • Left Click Fire • Right Click Scope</div>
              <div>[B] Arsenal Loadout • [E] Plant / Defuse • [Tab] Scoreboard</div>
            </div>
          </div>
        </div>
      )}

      {/* Buy Menu Modal */}
      <BuyMenu
        isOpen={isBuyMenuOpen}
        onClose={() => setIsBuyMenuOpen(false)}
        onBuyWeapon={handleBuyWeapon}
        onBuyGear={handleBuyGear}
        onTogglePistolRound={handleTogglePistolRound}
        isPistolRound={gameState.round?.isPistolRound || false}
      />

      {/* Tab Scoreboard */}
      {gameState.round && (
        <Scoreboard
          isOpen={isScoreboardOpen}
          round={gameState.round}
          allEntities={gameState.allEntities}
        />
      )}

      {/* Controls Help Modal */}
      <ControlsModal isOpen={isControlsOpen} onClose={() => setIsControlsOpen(false)} />
    </div>
  );
};
