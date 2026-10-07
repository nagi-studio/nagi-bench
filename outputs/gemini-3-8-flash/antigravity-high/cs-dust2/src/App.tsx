import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from './engine/GameEngine';
import { HUD } from './components/HUD';
import { BuyMenu } from './components/BuyMenu';
import {
  GameStats,
  PlayerInventory,
  KillfeedEntry,
  MinimapEntity,
  Team,
  WeaponId,
} from './types/game';

export const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  // React UI States synced with GameEngine
  const [stats, setStats] = useState<GameStats>({
    scoreCT: 0,
    scoreT: 0,
    roundNumber: 1,
    isPistolRound: true,
    roundPhase: 'freeze',
    roundTimeLeft: 115,
    c4: {
      status: 'carried',
      position: { x: 0, y: 0, z: 0 } as any,
      plantedSite: null,
      carrierId: null,
      timer: 40,
      maxTimer: 40,
      plantProgress: 0,
      defuseProgress: 0,
    },
    winner: null,
    winReason: '',
  });

  const [inventory, setInventory] = useState<PlayerInventory>({
    primary: null,
    secondary: 'usp',
    knife: 'knife',
    c4: false,
    currentSlot: 'secondary',
    ammo: {
      ak47: { current: 30, reserve: 90 },
      m4a4: { current: 30, reserve: 90 },
      awp: { current: 5, reserve: 30 },
      glock: { current: 20, reserve: 120 },
      usp: { current: 12, reserve: 24 },
      deagle: { current: 7, reserve: 35 },
      knife: { current: 1, reserve: 1 },
      c4: { current: 1, reserve: 1 },
    },
  });

  const [playerHealth, setPlayerHealth] = useState(100);
  const [playerArmor, setPlayerArmor] = useState(100);
  const [playerTeam, setPlayerTeam] = useState<Team>('CT');
  const [isScoped, setIsScoped] = useState(false);
  const [hitmarker, setHitmarker] = useState(false);
  const [hitmarkerHeadshot, setHitmarkerHeadshot] = useState(false);
  const [killfeed, setKillfeed] = useState<KillfeedEntry[]>([]);
  const [minimapEntities, setMinimapEntities] = useState<MinimapEntity[]>([]);
  const [spectatingBotName, setSpectatingBotName] = useState<string | null>(null);
  const [isBuyMenuOpen, setIsBuyMenuOpen] = useState(false);
  const [isPointerLocked, setIsPointerLocked] = useState(false);

  // Initialize GameEngine
  useEffect(() => {
    if (!containerRef.current) return;

    const engine = new GameEngine(containerRef.current, {
      onStatsUpdate: (newStats) => setStats({ ...newStats }),
      onInventoryUpdate: (newInv) => setInventory({ ...newInv }),
      onPlayerHealthUpdate: (hp, ap) => {
        setPlayerHealth(hp);
        setPlayerArmor(ap);
      },
      onKillfeedAdd: (entry) => {
        setKillfeed((prev) => [...prev, entry]);
      },
      onHitmarker: (isHeadshot) => {
        setHitmarker(true);
        setHitmarkerHeadshot(isHeadshot);
        setTimeout(() => setHitmarker(false), 140);
      },
      onScopeChange: (scoped) => setIsScoped(scoped),
      onMinimapUpdate: (entities) => setMinimapEntities([...entities]),
      onSpectateChange: (name) => setSpectatingBotName(name),
    });

    engineRef.current = engine;

    const handlePointerLockChange = () => {
      setIsPointerLocked(document.pointerLockElement === containerRef.current);
    };
    document.addEventListener('pointerlockchange', handlePointerLockChange);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyB') {
        setIsBuyMenuOpen((prev) => !prev);
      } else if (e.code === 'Escape' && isBuyMenuOpen) {
        setIsBuyMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      window.removeEventListener('keydown', handleKeyDown);
      engine.destroy();
    };
  }, []);

  // Buy weapon handler
  const handleBuyWeapon = (weaponId: WeaponId) => {
    if (engineRef.current) {
      engineRef.current.buyWeapon(weaponId);
    }
  };

  // Restart Pistol Round handler
  const handleRestartPistolRound = () => {
    if (engineRef.current) {
      engineRef.current.startRound(true);
    }
  };

  // Take over bot handler
  const handleTakeoverBot = () => {
    if (engineRef.current) {
      engineRef.current.takeoverSpectatedBot();
    }
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          cursor: isPointerLocked ? 'none' : 'crosshair',
        }}
      />

      {/* 2D HUD Overlay */}
      <HUD
        stats={stats}
        inventory={inventory}
        playerHealth={playerHealth}
        playerArmor={playerArmor}
        playerTeam={playerTeam}
        isScoped={isScoped}
        hitmarker={hitmarker}
        hitmarkerHeadshot={hitmarkerHeadshot}
        killfeed={killfeed}
        minimapEntities={minimapEntities}
        spectatingBotName={spectatingBotName}
        onTakeoverBot={handleTakeoverBot}
        onOpenBuyMenu={() => setIsBuyMenuOpen(true)}
        isPointerLocked={isPointerLocked}
      />

      {/* Buy Menu Modal */}
      <BuyMenu
        isOpen={isBuyMenuOpen}
        onClose={() => setIsBuyMenuOpen(false)}
        onBuyWeapon={handleBuyWeapon}
        onRestartPistolRound={handleRestartPistolRound}
      />
    </div>
  );
};
export default App;
