import React, { useState } from 'react';
import { GameEngine } from '../game/GameEngine';
import { sound } from '../audio/SoundSystem';

interface Props {
  engine: GameEngine;
  isLocked: boolean;
  setIsLocked: (locked: boolean) => void;
}

export const MenuOverlay: React.FC<Props> = ({ engine, isLocked, setIsLocked }) => {
  const [isPistolMode, setIsPistolMode] = useState(false);

  const handleStartGame = () => {
    sound.unlock();
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.requestPointerLock();
    }
  };

  const handleTogglePistolMode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsPistolMode(checked);
    engine.togglePistolRound(checked);
  };

  if (isLocked) return null;

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(5, 8, 14, 0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', zIndex: 20 }}>
      <div style={{ backgroundColor: '#101622', padding: '36px 48px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 10px 40px rgba(0,0,0,0.8)', textAlign: 'center', maxWidth: '520px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#e6a100', marginBottom: '8px', letterSpacing: '1px' }}>
          COUNTER-STRIKE: DUST 2
        </h1>
        <p style={{ color: '#88a0bc', fontSize: '14px', marginBottom: '24px' }}>
          3D Procedural First-Person Shooter Prototype
        </p>

        {/* Pistol Round Mode Switch */}
        <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '12px 18px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>🔫 Pistol Round Mode (手枪局)</div>
            <div style={{ fontSize: '12px', color: '#aaa' }}>Default pistols, no main rifles, pistol armor config</div>
          </div>
          <input
            type="checkbox"
            checked={isPistolMode}
            onChange={handleTogglePistolMode}
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
          />
        </div>

        {/* Controls Guide */}
        <div style={{ textAlign: 'left', backgroundColor: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', marginBottom: '28px', fontSize: '13px', lineHeight: '1.8', color: '#ccc' }}>
          <div><strong>WASD</strong> : Move</div>
          <div><strong>Mouse</strong> : Look around | <strong>Left Click</strong> : Shoot</div>
          <div><strong>Right Click</strong> : Scope AWP</div>
          <div><strong>1 / 2 / 3 / 4</strong> : Switch Weapon (Primary / Pistol / Knife / C4)</div>
          <div><strong>R</strong> : Reload | <strong>E</strong> : Plant C4 at Site / Defuse C4</div>
          <div><strong>TAB</strong> : View Scoreboard | <strong>SPACE</strong> : Spectate / Jump</div>
        </div>

        <button
          onClick={handleStartGame}
          style={{ width: '100%', padding: '14px 0', backgroundColor: '#e6a100', color: '#000', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', transition: 'transform 0.1s' }}
        >
          CLICK TO PLAY (LOCK MOUSE)
        </button>
      </div>
    </div>
  );
};
