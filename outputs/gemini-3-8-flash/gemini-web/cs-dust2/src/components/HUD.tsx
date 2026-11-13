import React, { useEffect, useRef } from 'react';
import { GameSnapshot, KillfeedItem, WeaponId } from '../types';
import { BOMB_SITES } from '../game/Dust2Map';

interface HUDProps {
  snapshot: GameSnapshot;
  killfeed: KillfeedItem[];
  onSelectWeapon: (wepId: WeaponId) => void;
  onTakeoverBot: () => void;
  onTogglePistolRound: () => void;
  onResetRound: () => void;
  onActionPress: () => void;
  onActionRelease: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  snapshot,
  killfeed,
  onSelectWeapon,
  onTakeoverBot,
  onTogglePistolRound,
  onResetRound,
  onActionPress,
  onActionRelease
}) => {
  const radarRef = useRef<HTMLCanvasElement | null>(null);

  // Render 2D top-down minimap radar
  useEffect(() => {
    const canvas = radarRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0a0e17';
    ctx.fillRect(0, 0, 188, 188);

    const worldToRadar = (wx: number, wz: number): [number, number] => {
      const rx = ((wx + 45) / 90) * 188;
      const ry = ((45 - wz) / 90) * 188;
      return [rx, ry];
    };

    // Draw Map Walls
    ctx.fillStyle = '#334155';
    // Perimeter outline
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(2, 2, 184, 184);

    // Draw Bomb Sites
    BOMB_SITES.forEach((site, idx) => {
      const [sx, sy] = worldToRadar(site.x, site.z);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(sx, sy, 12, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#f87171';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(idx === 0 ? 'A' : 'B', sx - 3.5, sy + 3.5);
    });

    // Draw Soldiers
    snapshot.soldiers.forEach((s) => {
      if (!s.alive) return;
      const [px, py] = worldToRadar(s.x, s.z);

      ctx.fillStyle = s.isHuman ? '#22c55e' : (s.team === 'CT' ? '#38bdf8' : '#fbbf24');
      ctx.beginPath();
      ctx.arc(px, py, s.isHuman ? 4.5 : 3.2, 0, Math.PI * 2);
      ctx.fill();

      // Human view cone
      if (s.isHuman) {
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.6)';
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px - Math.sin(s.yaw) * 16, py - Math.cos(s.yaw) * 16);
        ctx.stroke();
      }
    });

    // Draw C4 Position
    if (snapshot.c4Position) {
      const [cx, cy] = worldToRadar(snapshot.c4Position.x, snapshot.c4Position.z);
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(cx, cy, 3.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [snapshot.soldiers, snapshot.c4Position]);

  const mins = Math.floor(snapshot.roundTime / 60);
  const secs = Math.floor(snapshot.roundTime % 60);
  const timeFormatted = `0${mins}:${String(secs).padStart(2, '0')}`;

  const spread = snapshot.crosshairSpread;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}>
      {/* AWP Sniper Scope Overlay */}
      {snapshot.isScoped && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 50%, transparent 28%, rgba(0,0,0,0.96) 31%)',
            pointerEvents: 'none',
            zIndex: 15
          }}
        >
          <div style={{ position: 'absolute', insetInline: 0, top: '50%', height: '1px', background: '#000' }} />
          <div style={{ position: 'absolute', insetBlock: 0, left: '50%', width: '1px', background: '#000' }} />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              border: '1px solid #ef4444'
            }}
          />
        </div>
      )}

      {/* Dynamic FPS Crosshair */}
      {!snapshot.isScoped && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 20
          }}
        >
          <div style={{ position: 'absolute', left: '-1px', width: '2px', height: '8px', background: '#22c55e', bottom: `${spread}px`, boxShadow: '0 0 2px #000' }} />
          <div style={{ position: 'absolute', left: '-1px', width: '2px', height: '8px', background: '#22c55e', top: `${spread}px`, boxShadow: '0 0 2px #000' }} />
          <div style={{ position: 'absolute', top: '-1px', height: '2px', width: '8px', background: '#22c55e', right: `${spread}px`, boxShadow: '0 0 2px #000' }} />
          <div style={{ position: 'absolute', top: '-1px', height: '2px', width: '8px', background: '#22c55e', left: `${spread}px`, boxShadow: '0 0 2px #000' }} />
        </div>
      )}

      {/* TOP LEFT: Minimap Radar & Controls */}
      <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'auto' }}>
        <div
          style={{
            background: 'rgba(11, 15, 25, 0.85)',
            backdropFilter: 'blur(8px)',
            borderRadius: 16,
            padding: 10,
            border: '1px solid rgba(245, 158, 11, 0.3)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
            <span style={{ fontWeight: 'bold', color: '#fbbf24' }}>DE_DUST2 RADAR</span>
            <span style={{ fontFamily: 'monospace', color: '#38bdf8' }}>{snapshot.zone}</span>
          </div>
          <canvas ref={radarRef} width={188} height={188} style={{ borderRadius: 10, display: 'block' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#94a3b8', marginTop: 4 }}>
            <span><b style={{ color: '#38bdf8' }}>●</b> CT 警队</span>
            <span><b style={{ color: '#fbbf24' }}>●</b> T 匪队</span>
            <span><b style={{ color: '#ef4444' }}>★</b> C4</span>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(11, 15, 25, 0.85)',
            backdropFilter: 'blur(8px)',
            borderRadius: 12,
            padding: 8,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            maxWidth: 208,
            display: 'flex',
            flexDirection: 'column',
            gap: 6
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
            <button
              onClick={onTogglePistolRound}
              style={{
                background: snapshot.isPistolRound ? 'rgba(245, 158, 11, 0.35)' : 'rgba(30, 41, 59, 0.8)',
                color: snapshot.isPistolRound ? '#fde047' : '#cbd5e1',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: 4,
                padding: '4px 6px',
                fontSize: 10,
                cursor: 'pointer'
              }}
            >
              手枪局: {snapshot.isPistolRound ? '开' : '关'}
            </button>
            <button
              onClick={onTakeoverBot}
              style={{
                background: 'rgba(30, 41, 59, 0.8)',
                color: '#cbd5e1',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: 4,
                padding: '4px 6px',
                fontSize: 10,
                cursor: 'pointer'
              }}
            >
              接管AI (Tab)
            </button>
            <button
              onMouseDown={onActionPress}
              onMouseUp={onActionRelease}
              style={{
                background: snapshot.isActionHolding ? 'rgba(239, 68, 68, 0.45)' : 'rgba(30, 41, 59, 0.8)',
                color: '#cbd5e1',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: 4,
                padding: '4px 6px',
                fontSize: 10,
                cursor: 'pointer'
              }}
            >
              下包/拆包 (E)
            </button>
            <button
              onClick={onResetRound}
              style={{
                background: 'rgba(30, 41, 59, 0.8)',
                color: '#cbd5e1',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: 4,
                padding: '4px 6px',
                fontSize: 10,
                cursor: 'pointer'
              }}
            >
              重开回合 (N)
            </button>
          </div>
          <div style={{ fontSize: 9, color: '#94a3b8', lineHeight: 1.3 }}>
            WASD移动 · 左键开火 · 右键AWP开镜 · R换弹 · 1-7切枪 · E交互
          </div>
        </div>
      </div>

      {/* TOP CENTER: 5v5 Scoreboard & C4 Banner */}
      <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, pointerEvents: 'auto' }}>
        <div
          style={{
            background: 'rgba(11, 15, 25, 0.85)',
            backdropFilter: 'blur(8px)',
            borderRadius: 16,
            padding: '6px 20px',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 20
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: '#38bdf8', fontWeight: 'bold' }}>CT 警队</div>
            <div style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 'bold' }}>
              {snapshot.ctScore} <span style={{ fontSize: 11, color: '#7dd3fc' }}>({snapshot.ctAlive}存活)</span>
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.5)', padding: '4px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: '#f59e0b', fontWeight: 'bold' }}>
              {snapshot.c4Status === 'planted' ? 'C4 PLANTED' : 'ROUND TIME'}
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 'bold', color: snapshot.c4Status === 'planted' ? '#ef4444' : '#fff' }}>
              {snapshot.c4Status === 'planted' ? `${snapshot.c4Countdown.toFixed(1)}s` : timeFormatted}
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: '#fbbf24', fontWeight: 'bold' }}>T 匪队</div>
            <div style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 'bold' }}>
              {snapshot.tScore} <span style={{ fontSize: 11, color: '#fde047' }}>({snapshot.tAlive}存活)</span>
            </div>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(0,0,0,0.85)',
            padding: '4px 14px',
            borderRadius: 20,
            border: '1px solid rgba(245, 158, 11, 0.4)',
            fontSize: 11,
            fontWeight: 600,
            color: '#fef3c7'
          }}
        >
          {snapshot.banner}
        </div>

        {/* C4 Plant / Defuse Progress Bar */}
        {snapshot.c4Progress > 0 && (
          <div style={{ width: 200, height: 8, background: '#1e293b', borderRadius: 4, overflow: 'hidden', border: '1px solid #f59e0b' }}>
            <div
              style={{
                width: `${snapshot.c4Progress * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #f59e0b, #ef4444)',
                transition: 'width 0.05s ease'
              }}
            />
          </div>
        )}
      </div>

      {/* TOP RIGHT: Real-time Killfeed */}
      <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, pointerEvents: 'none' }}>
        {killfeed.slice(0, 5).map((item) => (
          <div
            key={item.id}
            style={{
              background: 'rgba(11, 15, 25, 0.85)',
              backdropFilter: 'blur(6px)',
              borderRadius: 8,
              padding: '4px 8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11
            }}
          >
            <span style={{ fontWeight: 'bold', color: item.killerTeam === 'CT' ? '#38bdf8' : '#fbbf24' }}>
              {item.killerName}
            </span>
            <span style={{ background: 'rgba(255,255,255,0.1)', padding: '1px 4px', borderRadius: 4, fontFamily: 'monospace', fontSize: 10 }}>
              {item.weaponName}{item.isHeadshot ? ' [HS]' : ''}
            </span>
            <span style={{ fontWeight: 'bold', color: item.victimTeam === 'CT' ? '#38bdf8' : '#fbbf24' }}>
              {item.victimName}
            </span>
          </div>
        ))}
      </div>

      {/* BOTTOM LEFT: Health, Armor & Active Agent */}
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          background: 'rgba(11, 15, 25, 0.85)',
          backdropFilter: 'blur(8px)',
          borderRadius: 16,
          padding: '8px 16px',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          pointerEvents: 'auto'
        }}
      >
        <div>
          <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase' }}>HP 生命值</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 22, fontWeight: 'bold', color: '#22c55e' }}>{snapshot.hp}</span>
            <div style={{ width: 64, height: 8, background: '#1e293b', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${snapshot.hp}%`, height: '100%', background: '#22c55e', transition: 'width 0.15s ease' }} />
            </div>
          </div>
        </div>

        <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.1)' }} />

        <div>
          <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase' }}>ARMOR 防弹衣</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 22, fontWeight: 'bold', color: '#38bdf8' }}>{snapshot.armor}</span>
            <div style={{ width: 64, height: 8, background: '#1e293b', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${snapshot.armor}%`, height: '100%', background: '#38bdf8', transition: 'width 0.15s ease' }} />
            </div>
          </div>
        </div>

        <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.1)' }} />

        <div>
          <div style={{ fontSize: 9, color: '#94a3b8' }}>当前操控</div>
          <div style={{ fontSize: 11, fontWeight: 'bold', color: '#fbbf24' }}>{snapshot.playerName}</div>
        </div>
      </div>

      {/* BOTTOM RIGHT: Weapon Hotbar & Ammo Readout */}
      <div style={{ position: 'absolute', bottom: 12, right: 12, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, pointerEvents: 'auto' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {(['ak47', 'm4a4', 'awp', 'deagle', 'usp', 'knife', 'c4'] as WeaponId[]).map((wId, i) => {
            const active = snapshot.weaponId === wId;
            return (
              <button
                key={wId}
                onClick={() => onSelectWeapon(wId)}
                style={{
                  background: active ? 'rgba(245, 158, 11, 0.4)' : 'rgba(30, 41, 59, 0.8)',
                  color: active ? '#fef08a' : '#94a3b8',
                  border: active ? '1px solid #fde047' : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 6,
                  padding: '4px 8px',
                  fontSize: 10,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {i + 1}·{wId.toUpperCase()}
              </button>
            );
          })}
        </div>

        <div
          style={{
            background: 'rgba(11, 15, 25, 0.85)',
            backdropFilter: 'blur(8px)',
            borderRadius: 16,
            padding: '8px 18px',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 16
          }}
        >
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, fontWeight: 'bold', color: '#fbbf24' }}>{snapshot.weaponName}</div>
            <div style={{ fontSize: 10, color: '#94a3b8' }}>{snapshot.weaponSub}</div>
          </div>

          <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.1)' }} />

          <div style={{ fontFamily: 'monospace', fontSize: 24, fontWeight: 'bold' }}>
            <span style={{ color: '#fbbf24' }}>{snapshot.mag}</span>
            <span style={{ color: '#64748b', fontSize: 16 }}> / </span>
            <span style={{ color: '#cbd5e1', fontSize: 16 }}>{snapshot.reserve}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
