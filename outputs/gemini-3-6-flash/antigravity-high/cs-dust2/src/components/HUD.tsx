import React from 'react';
import { GameEngine } from '../game/GameEngine';
import { WEAPON_DEFINITIONS } from '../game/Weapons';

interface Props {
  engine: GameEngine;
}

export const HUD: React.FC<Props> = ({ engine }) => {
  const activeChar = engine.allCharacters.find(c => c.id === engine.spectatedCharacterId) || engine.player;
  const weaponData = WEAPON_DEFINITIONS[activeChar.currentWeapon];

  const aliveCT = engine.allCharacters.filter(c => c.team === 'CT' && !c.isDead).length;
  const aliveT = engine.allCharacters.filter(c => c.team === 'T' && !c.isDead).length;

  const spread = 8 + engine.crosshairSpread * 24;

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', color: '#fff', fontFamily: 'sans-serif' }}>
      
      {/* 1. AWP Scope 2D Overlay */}
      {activeChar.isScoping && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'radial-gradient(circle, transparent 40%, black 75%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ position: 'absolute', width: '100vw', height: '2px', backgroundColor: 'rgba(0,0,0,0.85)' }} />
          <div style={{ position: 'absolute', height: '100vh', width: '2px', backgroundColor: 'rgba(0,0,0,0.85)' }} />
        </div>
      )}

      {/* 2. Dynamic Crosshair */}
      {!activeChar.isScoping && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <div style={{ position: 'absolute', width: '8px', height: '2px', backgroundColor: '#00ff66', left: `-${spread + 8}px`, top: '-1px' }} />
          <div style={{ position: 'absolute', width: '8px', height: '2px', backgroundColor: '#00ff66', left: `${spread}px`, top: '-1px' }} />
          <div style={{ position: 'absolute', height: '8px', width: '2px', backgroundColor: '#00ff66', top: `-${spread + 8}px`, left: '-1px' }} />
          <div style={{ position: 'absolute', height: '8px', width: '2px', backgroundColor: '#00ff66', top: `${spread}px`, left: '-1px' }} />
        </div>
      )}

      {/* 3. Top Header: Scoreboard & Round Timer */}
      <div style={{ position: 'absolute', top: 15, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', backgroundColor: 'rgba(15, 20, 30, 0.85)', padding: '8px 24px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)' }}>
        {/* CT Score */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ color: '#4a90e2', fontSize: '24px', fontWeight: 'bold' }}>CT {engine.score.ct}</div>
          <div style={{ color: '#aaa', fontSize: '13px' }}>({aliveCT} alive)</div>
        </div>

        {/* Timer */}
        <div style={{ margin: '0 30px', fontSize: '22px', fontWeight: 'bold', color: engine.roundTimer < 20 ? '#ff4a4a' : '#fff' }}>
          {engine.roundPhase === 'FREEZE_TIME' ? `FREEZE: ${Math.ceil(engine.freezeTimer)}s` : `${Math.floor(engine.roundTimer / 60)}:${Math.floor(engine.roundTimer % 60).toString().padStart(2, '0')}`}
        </div>

        {/* T Score */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ color: '#aaa', fontSize: '13px' }}>({aliveT} alive)</div>
          <div style={{ color: '#e6a100', fontSize: '24px', fontWeight: 'bold' }}>T {engine.score.t}</div>
        </div>
      </div>

      {/* 4. Plant / Defuse Progress Bar */}
      {(engine.c4State.plantProgress > 0 || engine.c4State.defuseProgress > 0) && (
        <div style={{ position: 'absolute', top: '35%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
          <div style={{ fontSize: '16px', marginBottom: '6px', fontWeight: 'bold', color: '#ff9500' }}>
            {engine.c4State.plantProgress > 0 ? 'PLANTING C4...' : 'DEFUSING C4...'}
          </div>
          <div style={{ width: '240px', height: '10px', backgroundColor: 'rgba(0,0,0,0.6)', border: '1px solid #ff9500', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{
              width: `${(engine.c4State.plantProgress || engine.c4State.defuseProgress) * 100}%`,
              height: '100%', backgroundColor: '#ff9500', transition: 'width 0.1s linear'
            }} />
          </div>
        </div>
      )}

      {/* 5. Round Winner Banner */}
      {engine.roundWinnerBanner && (
        <div style={{ position: 'absolute', top: '25%', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(0,0,0,0.85)', padding: '16px 40px', borderRadius: '8px', border: '2px solid #ff9500', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: '900', color: engine.roundWinnerBanner.includes('CT') ? '#4a90e2' : '#e6a100' }}>
            {engine.roundWinnerBanner}
          </div>
        </div>
      )}

      {/* 6. Spectator Takeover Controls Banner */}
      {engine.player.isDead && (
        <div style={{ position: 'absolute', bottom: '120px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(0,0,0,0.8)', padding: '10px 24px', borderRadius: '6px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
          <div style={{ fontSize: '15px', color: '#ff4a4a', fontWeight: 'bold' }}>YOU DIED — SPECTATING: {activeChar.name}</div>
          <div style={{ fontSize: '13px', color: '#ccc', marginTop: '4px' }}>Press <span style={{ color: '#fff', fontWeight: 'bold' }}>SPACE</span> to switch teammate | Click button to TAKE OVER bot</div>
          {activeChar.isBot && (
            <button
              onClick={() => engine.takeoverSpectatedBot()}
              style={{ marginTop: '8px', pointerEvents: 'auto', padding: '6px 16px', backgroundColor: '#50e3c2', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              TAKE CONTROL OF THIS BOT
            </button>
          )}
        </div>
      )}

      {/* 7. Bottom Left: HP & Armor */}
      <div style={{ position: 'absolute', bottom: 25, left: 25, display: 'flex', gap: '20px', backgroundColor: 'rgba(15, 20, 30, 0.85)', padding: '12px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#888' }}>HEALTH</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: activeChar.hp < 30 ? '#ff4a4a' : '#fff' }}>
            +{activeChar.hp}
          </div>
        </div>
        <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.15)' }} />
        <div>
          <div style={{ fontSize: '11px', color: '#888' }}>ARMOR</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#50e3c2' }}>
            🛡️ {activeChar.armor}
          </div>
        </div>
      </div>

      {/* 8. Bottom Right: Ammo Panel */}
      <div style={{ position: 'absolute', bottom: 25, right: 25, backgroundColor: 'rgba(15, 20, 30, 0.85)', padding: '12px 24px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', textAlign: 'right' }}>
        <div style={{ fontSize: '12px', color: '#e6a100', fontWeight: 'bold' }}>{weaponData.name.toUpperCase()}</div>
        <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
          {weaponData.category !== 'melee' ? (
            <>
              <span style={{ color: activeChar.ammoInClip[activeChar.currentWeapon] === 0 ? '#ff4a4a' : '#fff' }}>
                {activeChar.ammoInClip[activeChar.currentWeapon]}
              </span>
              <span style={{ fontSize: '18px', color: '#777' }}> / {activeChar.ammoReserve[activeChar.currentWeapon]}</span>
            </>
          ) : (
            <span style={{ fontSize: '18px', color: '#777' }}>MELEE</span>
          )}
        </div>
      </div>

    </div>
  );
};
