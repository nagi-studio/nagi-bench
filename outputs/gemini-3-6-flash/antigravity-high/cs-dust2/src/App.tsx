import React, { useEffect, useState, useMemo } from 'react';
import { GameEngine } from './game/GameEngine';
import { CanvasContainer } from './components/CanvasContainer';
import { HUD } from './components/HUD';
import { Minimap } from './components/Minimap';
import { Killfeed } from './components/Killfeed';
import { Scoreboard } from './components/Scoreboard';
import { MenuOverlay } from './components/MenuOverlay';

export const App: React.FC = () => {
  const engine = useMemo(() => new GameEngine(), []);
  const [, setTick] = useState(0);
  const [isPointerLocked, setIsPointerLocked] = useState(false);

  useEffect(() => {
    engine.setOnStateChange(() => {
      setTick(t => t + 1);
    });

    const handlePointerLockChange = () => {
      const locked = !!document.pointerLockElement;
      setIsPointerLocked(locked);
      engine.isPointerLocked = locked;
    };

    document.addEventListener('pointerlockchange', handlePointerLockChange);
    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
    };
  }, [engine]);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <CanvasContainer engine={engine} />
      <HUD engine={engine} />
      <Minimap engine={engine} />
      <Killfeed engine={engine} />
      <Scoreboard engine={engine} />
      <MenuOverlay engine={engine} isLocked={isPointerLocked} setIsLocked={setIsPointerLocked} />
    </div>
  );
};

export default App;
