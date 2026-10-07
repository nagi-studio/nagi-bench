import React from 'react';
import {
  GameStats,
  PlayerInventory,
  KillfeedEntry,
  MinimapEntity,
  Team,
  WeaponId,
} from '../types/game';
import { WEAPON_CONFIGS } from '../procedural/weapons';
import { Minimap } from './Minimap';
import { SniperScope } from './SniperScope';

interface HUDProps {
  stats: GameStats;
  inventory: PlayerInventory;
  playerHealth: number;
  playerArmor: number;
  playerTeam: Team;
  isScoped: boolean;
  hitmarker: boolean;
  hitmarkerHeadshot: boolean;
  killfeed: KillfeedEntry[];
  minimapEntities: MinimapEntity[];
  spectatingBotName: string | null;
  onTakeoverBot: () => void;
  onOpenBuyMenu: () => void;
  isPointerLocked: boolean;
}

export const HUD: React.FC<HUDProps> = ({
  stats,
  inventory,
  playerHealth,
  playerArmor,
  playerTeam,
  isScoped,
  hitmarker,
  hitmarkerHeadshot,
  killfeed,
  minimapEntities,
  spectatingBotName,
  onTakeoverBot,
  onOpenBuyMenu,
  isPointerLocked,
}) => {
  const currentWeaponId: WeaponId =
    inventory.currentSlot === 'primary' && inventory.primary
      ? inventory.primary
      : inventory.currentSlot === 'secondary'
      ? inventory.secondary
      : inventory.currentSlot === 'knife'
      ? 'knife'
      : inventory.currentSlot === 'c4' && inventory.c4
      ? 'c4'
      : inventory.secondary;

  const currentWeapon = WEAPON_CONFIGS[currentWeaponId];
  const ammoData = inventory.ammo[currentWeaponId];

  // Living counts
  const livingCT = minimapEntities.filter((e) => e.team === 'CT' && e.isAlive).length;
  const livingT = minimapEntities.filter((e) => e.team === 'T' && e.isAlive).length;

  // Format Round Time mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* 1. AWP Scope Zoom Overlay */}
      {isScoped && <SniperScope />}

      {/* 2. Dust2 Minimap / Radar (Top-Left) */}
      <Minimap entities={minimapEntities} playerTeam={playerTeam} />

      {/* 3. Top Center: Round Scoreboard & Timer */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: 'rgba(15, 20, 28, 0.85)',
          padding: '6px 20px',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* CT Score & Pips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#38bdf8' }}>CT</span>
          <span style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff' }}>{stats.scoreCT}</span>
          <div style={{ display: 'flex', gap: '3px' }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: '6px',
                  height: '14px',
                  borderRadius: '2px',
                  backgroundColor: i < livingCT ? '#38bdf8' : 'rgba(255, 255, 255, 0.15)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Timer / C4 Bomb countdown */}
        <div
          style={{
            minWidth: '70px',
            textAlign: 'center',
            padding: '4px 8px',
            backgroundColor: stats.roundPhase === 'planted' ? 'rgba(239, 68, 68, 0.3)' : 'transparent',
            borderRadius: '6px',
          }}
        >
          {stats.roundPhase === 'planted' ? (
            <div style={{ color: '#ef4444', fontWeight: 800, fontSize: '18px', animation: 'pulse 1s infinite' }}>
              💣 {Math.ceil(stats.c4.timer)}s
            </div>
          ) : (
            <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '18px' }}>
              {formatTime(stats.roundTimeLeft)}
            </div>
          )}
          <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>
            {stats.isPistolRound ? 'Pistol Round' : `Round ${stats.roundNumber}`}
          </div>
        </div>

        {/* T Score & Pips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '3px' }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: '6px',
                  height: '14px',
                  borderRadius: '2px',
                  backgroundColor: i < livingT ? '#f59e0b' : 'rgba(255, 255, 255, 0.15)',
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff' }}>{stats.scoreT}</span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#f59e0b' }}>T</span>
        </div>
      </div>

      {/* 4. Top Right: Killfeed */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          alignItems: 'flex-end',
        }}
      >
        {killfeed.slice(-5).map((entry) => (
          <div
            key={entry.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(15, 20, 28, 0.85)',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
            }}
          >
            <span style={{ color: entry.killerTeam === 'CT' ? '#38bdf8' : '#f59e0b' }}>
              {entry.killerName}
            </span>
            <span style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase' }}>
              [{entry.weapon}]
            </span>
            {entry.isHeadshot && <span style={{ color: '#ef4444' }}>🎯</span>}
            <span style={{ color: entry.victimTeam === 'CT' ? '#38bdf8' : '#f59e0b' }}>
              {entry.victimName}
            </span>
          </div>
        ))}

        {/* Top-Right Quick Action Button (Buy Menu / Arsenal) */}
        <button
          onClick={onOpenBuyMenu}
          style={{
            marginTop: '8px',
            pointerEvents: 'auto',
            background: 'rgba(30, 41, 59, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#e2e8f0',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          [B] BUY MENU / WEAPONS
        </button>
      </div>

      {/* 5. Center: Dynamic Crosshair & Hitmarker */}
      {!isScoped && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Crosshair Bars */}
          <div style={{ position: 'relative', width: '28px', height: '28px' }}>
            {/* Top */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '13px',
                width: '2px',
                height: '8px',
                backgroundColor: '#22c55e',
                boxShadow: '0 0 2px #000',
              }}
            />
            {/* Bottom */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: '13px',
                width: '2px',
                height: '8px',
                backgroundColor: '#22c55e',
                boxShadow: '0 0 2px #000',
              }}
            />
            {/* Left */}
            <div
              style={{
                position: 'absolute',
                top: '13px',
                left: 0,
                width: '8px',
                height: '2px',
                backgroundColor: '#22c55e',
                boxShadow: '0 0 2px #000',
              }}
            />
            {/* Right */}
            <div
              style={{
                position: 'absolute',
                top: '13px',
                right: 0,
                width: '8px',
                height: '2px',
                backgroundColor: '#22c55e',
                boxShadow: '0 0 2px #000',
              }}
            />
          </div>

          {/* Hitmarker Indicator (Red X) */}
          {hitmarker && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: hitmarkerHeadshot ? '#ef4444' : '#f97316',
                fontSize: hitmarkerHeadshot ? '22px' : '18px',
                fontWeight: 900,
                textShadow: '0 0 4px #000',
              }}
            >
              ✕
            </div>
          )}
        </div>
      )}

      {/* 6. Center Action Prompts & Progress Bars */}
      <div
        style={{
          position: 'absolute',
          top: '65%',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {/* Planting C4 Progress Bar */}
        {stats.c4.plantProgress > 0 && (
          <div
            style={{
              backgroundColor: 'rgba(15, 20, 28, 0.9)',
              padding: '10px 18px',
              borderRadius: '8px',
              border: '1px solid #eab308',
              textAlign: 'center',
            }}
          >
            <div style={{ color: '#eab308', fontWeight: 700, fontSize: '13px', marginBottom: '6px' }}>
              ARMING C4 EXPLOSIVE...
            </div>
            <div style={{ width: '220px', height: '8px', backgroundColor: '#334155', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${stats.c4.plantProgress * 100}%`,
                  height: '100%',
                  backgroundColor: '#eab308',
                  transition: 'width 0.05s linear',
                }}
              />
            </div>
          </div>
        )}

        {/* Defusing C4 Progress Bar */}
        {stats.c4.defuseProgress > 0 && (
          <div
            style={{
              backgroundColor: 'rgba(15, 20, 28, 0.9)',
              padding: '10px 18px',
              borderRadius: '8px',
              border: '1px solid #38bdf8',
              textAlign: 'center',
            }}
          >
            <div style={{ color: '#38bdf8', fontWeight: 700, fontSize: '13px', marginBottom: '6px' }}>
              DEFUSING BOMB...
            </div>
            <div style={{ width: '220px', height: '8px', backgroundColor: '#334155', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${stats.c4.defuseProgress * 100}%`,
                  height: '100%',
                  backgroundColor: '#38bdf8',
                  transition: 'width 0.05s linear',
                }}
              />
            </div>
          </div>
        )}

        {/* Spectator Prompt & Takeover */}
        {spectatingBotName && (
          <div
            style={{
              backgroundColor: 'rgba(15, 20, 28, 0.9)',
              padding: '12px 24px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center',
              pointerEvents: 'auto',
            }}
          >
            <div style={{ fontSize: '14px', color: '#cbd5e1' }}>
              SPECTATING: <span style={{ color: '#38bdf8', fontWeight: 700 }}>{spectatingBotName}</span>
            </div>
            <button
              onClick={onTakeoverBot}
              style={{
                marginTop: '8px',
                backgroundColor: '#2563eb',
                color: '#fff',
                fontWeight: 700,
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              PRESS [E] OR CLICK TO TAKE OVER BOT
            </button>
          </div>
        )}

        {/* Round Win / Ended Banner */}
        {stats.roundPhase === 'ended' && (
          <div
            style={{
              backgroundColor: 'rgba(15, 20, 28, 0.95)',
              padding: '16px 36px',
              borderRadius: '12px',
              border: `2px solid ${stats.winner === 'CT' ? '#38bdf8' : '#f59e0b'}`,
              textAlign: 'center',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.8)',
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: '28px',
                fontWeight: 900,
                letterSpacing: '2px',
                color: stats.winner === 'CT' ? '#38bdf8' : '#f59e0b',
              }}
            >
              {stats.winner === 'CT' ? 'COUNTER-TERRORISTS WIN' : 'TERRORISTS WIN'}
            </h1>
            <div style={{ color: '#cbd5e1', fontSize: '14px', marginTop: '4px' }}>
              {stats.winReason}
            </div>
          </div>
        )}
      </div>

      {/* 7. Bottom Left: Health & Armor */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          left: 24,
          display: 'flex',
          gap: '16px',
        }}
      >
        {/* Health */}
        <div
          style={{
            backgroundColor: 'rgba(15, 20, 28, 0.85)',
            padding: '10px 18px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            minWidth: '110px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '18px' }}>❤️</span>
            <span
              style={{
                fontSize: '26px',
                fontWeight: 800,
                color: playerHealth > 25 ? '#ffffff' : '#ef4444',
              }}
            >
              {playerHealth}
            </span>
          </div>
          <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>HEALTH</div>
        </div>

        {/* Armor */}
        <div
          style={{
            backgroundColor: 'rgba(15, 20, 28, 0.85)',
            padding: '10px 18px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            minWidth: '110px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '18px' }}>🛡️</span>
            <span style={{ fontSize: '26px', fontWeight: 800, color: '#38bdf8' }}>
              {playerArmor}
            </span>
          </div>
          <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>ARMOR</div>
        </div>
      </div>

      {/* 8. Bottom Right: Active Weapon & Ammo Counter */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '8px',
        }}
      >
        {/* Weapon Slots Indicator (1, 2, 3, 5) */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {inventory.primary && (
            <div
              style={{
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 700,
                backgroundColor:
                  inventory.currentSlot === 'primary' ? '#2563eb' : 'rgba(15, 20, 28, 0.7)',
                color: '#fff',
              }}
            >
              1 {inventory.primary.toUpperCase()}
            </div>
          )}
          <div
            style={{
              padding: '3px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 700,
              backgroundColor:
                inventory.currentSlot === 'secondary' ? '#2563eb' : 'rgba(15, 20, 28, 0.7)',
              color: '#fff',
            }}
          >
            2 {inventory.secondary.toUpperCase()}
          </div>
          <div
            style={{
              padding: '3px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 700,
              backgroundColor:
                inventory.currentSlot === 'knife' ? '#2563eb' : 'rgba(15, 20, 28, 0.7)',
              color: '#fff',
            }}
          >
            3 KNIFE
          </div>
          {inventory.c4 && (
            <div
              style={{
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 700,
                backgroundColor:
                  inventory.currentSlot === 'c4' ? '#eab308' : 'rgba(15, 20, 28, 0.7)',
                color: inventory.currentSlot === 'c4' ? '#000' : '#eab308',
              }}
            >
              5 C4 BOMB
            </div>
          )}
        </div>

        {/* Ammo Counter Card */}
        <div
          style={{
            backgroundColor: 'rgba(15, 20, 28, 0.85)',
            padding: '10px 20px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            minWidth: '150px',
            textAlign: 'right',
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#94a3b8' }}>
            {currentWeapon.name}
          </div>
          {currentWeaponId !== 'knife' && currentWeaponId !== 'c4' ? (
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: '6px' }}>
              <span style={{ fontSize: '32px', fontWeight: 800, color: ammoData.current > 0 ? '#ffffff' : '#ef4444' }}>
                {ammoData.current}
              </span>
              <span style={{ fontSize: '18px', fontWeight: 600, color: '#64748b' }}>
                / {ammoData.reserve}
              </span>
            </div>
          ) : (
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#38bdf8' }}>
              READY
            </div>
          )}
        </div>
      </div>

      {/* 9. Click to Play / Pointer Lock Prompt Overlay */}
      {!isPointerLocked && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'auto',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              backgroundColor: '#121721',
              padding: '28px 40px',
              borderRadius: '12px',
              border: '1px solid #334155',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)',
            }}
          >
            <h2 style={{ margin: 0, fontSize: '26px', fontWeight: 800, letterSpacing: '2px', color: '#38bdf8' }}>
              CLICK TO ENTER CS DUST2
            </h2>
            <p style={{ margin: '12px 0 0', color: '#94a3b8', fontSize: '14px' }}>
              WASD Move | Space Jump | Mouse Aim & Shoot | R Reload | 1/2/3/5 Weapons | B Buy Menu
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
