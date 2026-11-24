import React from 'react';
import { Dust2MapData } from '../game/map/dust2Data';
import { HudState } from '../game/types';
import { WEAPONS } from '../game/weapons/weaponData';
import { Minimap } from './Minimap';

interface GameHUDProps {
  hud: HudState;
  mapData: Dust2MapData;
}

function formatClock(sec: number): string {
  const s = Math.max(0, Math.ceil(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, '0')}`;
}

export const GameHUD: React.FC<GameHUDProps> = ({ hud, mapData }) => {
  const scoped = hud.scopeLevel > 0 && hud.alive;
  const gap = hud.crosshairSpread;

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 15 }}>
      {/* ==================== AWP 2D SNIPER SCOPE OVERLAY ==================== */}
      {scoped && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 16,
            background:
              'radial-gradient(circle at center, transparent 0%, transparent 37%, rgba(0,0,0,0.92) 38.2%, #000 44%)',
          }}
        >
          {/* Horizontal crosshair hairline */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: 1.5,
              background: 'rgba(0,0,0,0.88)',
            }}
          />
          {/* Vertical crosshair hairline */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: 1.5,
              background: 'rgba(0,0,0,0.88)',
            }}
          />
          {/* Center mil-dot ticks */}
          {[-48, -24, 24, 48].map((off) => (
            <React.Fragment key={off}>
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(50% - 5px)',
                  left: `calc(50% + ${off}px)`,
                  width: 1.5,
                  height: 11,
                  background: '#000',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 'calc(50% - 5px)',
                  top: `calc(50% + ${off}px)`,
                  height: 1.5,
                  width: 11,
                  background: '#000',
                }}
              />
            </React.Fragment>
          ))}
          {/* Center red aiming dot */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 4,
              height: 4,
              marginLeft: -2,
              marginTop: -2,
              borderRadius: '50%',
              background: '#ff3030',
              boxShadow: '0 0 6px #ff3030',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 'calc(50% + 90px)',
              top: 'calc(50% + 14px)',
              fontSize: 12,
              fontFamily: 'monospace',
              color: 'rgba(120, 230, 140, 0.85)',
              fontWeight: 700,
            }}
          >
            ZOOM {hud.scopeLevel === 2 ? '4.5x' : '2.2x'}
          </div>
        </div>
      )}

      {/* ==================== RED DAMAGE VIGNETTE ==================== */}
      {hud.damageFlash > 0.01 && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: `radial-gradient(circle, transparent 42%, rgba(220, 30, 30, ${hud.damageFlash * 0.65}) 100%)`,
          }}
        />
      )}

      {/* ==================== DIRECTIONAL DAMAGE ARCS ==================== */}
      {hud.damageIndicators.map((ind) => (
        <div
          key={ind.id}
          style={{
            position: 'fixed',
            left: '50%',
            top: '50%',
            width: 140,
            height: 140,
            marginLeft: -70,
            marginTop: -70,
            transform: `rotate(${-ind.angle}rad)`,
          }}
        >
          <div
            style={{
              width: 34,
              height: 6,
              margin: '0 auto',
              borderRadius: 4,
              background: 'rgba(255, 52, 52, 0.88)',
              boxShadow: '0 0 10px rgba(255, 40, 40, 0.9)',
            }}
          />
        </div>
      ))}

      {/* ==================== DYNAMIC CROSSHAIR + HITMARKER ==================== */}
      {!scoped && hud.alive && (
        <div style={{ position: 'fixed', left: '50%', top: '50%' }}>
          {/* Top */}
          <div
            style={{
              position: 'absolute',
              left: -1,
              top: -(gap + 9),
              width: 2,
              height: 9,
              background: '#47ff8d',
              boxShadow: '0 0 2px #000',
            }}
          />
          {/* Bottom */}
          <div
            style={{
              position: 'absolute',
              left: -1,
              top: gap,
              width: 2,
              height: 9,
              background: '#47ff8d',
              boxShadow: '0 0 2px #000',
            }}
          />
          {/* Left */}
          <div
            style={{
              position: 'absolute',
              top: -1,
              left: -(gap + 9),
              width: 9,
              height: 2,
              background: '#47ff8d',
              boxShadow: '0 0 2px #000',
            }}
          />
          {/* Right */}
          <div
            style={{
              position: 'absolute',
              top: -1,
              left: gap,
              width: 9,
              height: 2,
              background: '#47ff8d',
              boxShadow: '0 0 2px #000',
            }}
          />
          {/* Center dot */}
          <div
            style={{
              position: 'absolute',
              left: -1,
              top: -1,
              width: 2,
              height: 2,
              background: '#47ff8d',
              boxShadow: '0 0 2px #000',
            }}
          />
        </div>
      )}

      {/* Hitmarker X (visible both scoped and unscoped!) */}
      {hud.hitMarker.active && (
        <div style={{ position: 'fixed', left: '50%', top: '50%', zIndex: 25 }}>
          {[45, 135, 225, 315].map((deg) => (
            <div
              key={deg}
              style={{
                position: 'absolute',
                left: -1,
                top: -1,
                width: 2,
                height: hud.hitMarker.kill ? 14 : 10,
                background: hud.hitMarker.headshot || hud.hitMarker.kill ? '#ff3b30' : '#ffffff',
                transformOrigin: '50% 0%',
                transform: `rotate(${deg}deg) translateY(5px)`,
                boxShadow: '0 0 4px rgba(0,0,0,0.9)',
              }}
            />
          ))}
        </div>
      )}

      {/* ==================== MINIMAP (TOP-LEFT) ==================== */}
      <Minimap
        mapData={mapData}
        agents={hud.minimapAgents}
        bomb={hud.minimapBomb}
        playerTeam={hud.playerTeam}
        callout={hud.callout}
      />

      {/* ==================== TOP MATCH SCORE & TIMER BAR ==================== */}
      <div
        style={{
          position: 'fixed',
          top: 12,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'rgba(10, 14, 22, 0.84)',
          border: '1px solid rgba(255,255,255,0.14)',
          borderRadius: 8,
          padding: '6px 16px',
          boxShadow: '0 6px 24px rgba(0,0,0,0.45)',
          zIndex: 20,
        }}
      >
        {/* CT side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: '#60a5fa', fontWeight: 700 }}>CT 存活 {hud.ctAlive}/5</div>
            <div style={{ display: 'flex', gap: 3, justifyContent: 'flex-end', marginTop: 2 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 2,
                    background: i < hud.ctAlive ? '#60a5fa' : 'rgba(255,255,255,0.14)',
                  }}
                />
              ))}
            </div>
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#60a5fa', minWidth: 26, textAlign: 'center' }}>
            {hud.ctScore}
          </div>
        </div>

        {/* Center Timer / Bomb Status */}
        <div
          style={{
            minWidth: 106,
            textAlign: 'center',
            padding: '2px 12px',
            borderLeft: '1px solid rgba(255,255,255,0.12)',
            borderRight: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          {hud.roundPhase === 'bomb_planted' ? (
            <div className="pulse-fast" style={{ color: '#ff3b30', fontWeight: 900, fontSize: 16 }}>
              💣 {hud.bombPlantedSite}点 {hud.bombTimeRemaining.toFixed(1)}s
            </div>
          ) : (
            <div style={{ fontSize: 20, fontWeight: 900, fontVariantNumeric: 'tabular-nums', color: '#f8fafc' }}>
              {formatClock(hud.phaseTimer)}
            </div>
          )}
          <div style={{ fontSize: 10, fontWeight: 700, color: hud.isPistolRound ? '#f5b942' : '#94a3b8' }}>
            R{hud.roundNumber} {hud.isPistolRound ? '· 手枪局' : hud.roundPhase === 'freeze' ? '· 购买准备' : ''}
          </div>
        </div>

        {/* T side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#f59e0b', minWidth: 26, textAlign: 'center' }}>
            {hud.tScore}
          </div>
          <div>
            <div style={{ fontSize: 10, color: '#f59e0b', fontWeight: 700 }}>T 存活 {hud.tAlive}/5</div>
            <div style={{ display: 'flex', gap: 3, marginTop: 2 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 2,
                    background: i < hud.tAlive ? '#f59e0b' : 'rgba(255,255,255,0.14)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ==================== TOP-RIGHT LIVE KILLFEED ==================== */}
      <div
        style={{
          position: 'fixed',
          top: 14,
          right: 14,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 5,
          zIndex: 20,
        }}
      >
        {hud.killFeed.map((k) => (
          <div
            key={k.id}
            className="fade-in"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              background: 'rgba(10, 14, 22, 0.82)',
              border:
                k.killerName === 'YOU' || k.victimName === 'YOU'
                  ? '1px solid rgba(245, 185, 66, 0.65)'
                  : '1px solid rgba(255,255,255,0.1)',
              borderRadius: 5,
              padding: '4px 10px',
              fontSize: 12,
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            }}
          >
            <span style={{ color: k.killerTeam === 'CT' ? '#60a5fa' : '#f59e0b' }}>{k.killerName}</span>
            <span
              style={{
                padding: '1px 6px',
                borderRadius: 3,
                background: 'rgba(255,255,255,0.1)',
                color: '#e2e8f0',
                fontSize: 10,
              }}
            >
              {k.weaponName}
            </span>
            {k.headshot && (
              <span style={{ color: '#ff453a', fontSize: 11, fontWeight: 900 }} title="爆头击杀">
                ⊕HS
              </span>
            )}
            <span style={{ color: k.victimTeam === 'CT' ? '#60a5fa' : '#f59e0b' }}>{k.victimName}</span>
          </div>
        ))}
      </div>

      {/* ==================== CENTER ANNOUNCEMENTS & PROMPTS ==================== */}
      {hud.announcement && !hud.roundBanner && (
        <div
          style={{
            position: 'fixed',
            top: 86,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(12, 17, 27, 0.85)',
            border: '1px solid rgba(245, 185, 66, 0.45)',
            color: '#fef08a',
            padding: '7px 18px',
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: '0.04em',
            zIndex: 22,
          }}
        >
          {hud.announcement}
        </div>
      )}

      {/* Buy Zone hint */}
      {hud.canBuy && !hud.buyMenuOpen && hud.alive && !hud.isSpectating && (
        <div
          style={{
            position: 'fixed',
            bottom: 94,
            left: 18,
            background: 'rgba(34, 197, 94, 0.2)',
            border: '1px solid rgba(74, 222, 128, 0.5)',
            color: '#86efac',
            padding: '4px 10px',
            borderRadius: 5,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          🛒 购买区内 · 按 [B] 打开武器购买菜单
        </div>
      )}

      {/* Context interaction prompt (Plant / Defuse) */}
      {hud.interactionPrompt && !hud.actionProgress && (
        <div
          style={{
            position: 'fixed',
            bottom: 160,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(15, 20, 30, 0.88)',
            border: '1px solid #f5b942',
            color: '#fde68a',
            padding: '8px 18px',
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 800,
            zIndex: 22,
          }}
        >
          {hud.interactionPrompt}
        </div>
      )}

      {/* Plant / Defuse Progress Bar */}
      {hud.actionProgress && (
        <div
          style={{
            position: 'fixed',
            bottom: 165,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 260,
            background: 'rgba(10, 14, 22, 0.9)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 8,
            padding: '10px 14px',
            textAlign: 'center',
            zIndex: 24,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc', marginBottom: 6 }}>
            {hud.actionProgress.label}
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.14)', borderRadius: 4, overflow: 'hidden' }}>
            <div
              style={{
                width: `${Math.min(100, hud.actionProgress.progress * 100)}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #f59e0b, #ef4444)',
              }}
            />
          </div>
        </div>
      )}

      {/* Reload Progress Indicator near Crosshair */}
      {hud.reloading && hud.alive && (
        <div
          style={{
            position: 'fixed',
            top: 'calc(50% + 34px)',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 96,
            textAlign: 'center',
            zIndex: 22,
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 800, color: '#fde68a', marginBottom: 3 }}>换弹中...</div>
          <div style={{ height: 4, background: 'rgba(0,0,0,0.65)', borderRadius: 2, overflow: 'hidden' }}>
            <div
              style={{
                width: `${Math.min(100, hud.reloadProgress * 100)}%`,
                height: '100%',
                background: '#f5b942',
              }}
            />
          </div>
        </div>
      )}

      {/* ==================== SPECTATE & BOT TAKEOVER BAR ==================== */}
      {hud.isSpectating && (
        <div
          style={{
            position: 'fixed',
            bottom: 92,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(10, 15, 24, 0.9)',
            border: '1px solid rgba(96, 165, 250, 0.5)',
            borderRadius: 8,
            padding: '10px 22px',
            textAlign: 'center',
            zIndex: 25,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 800, color: '#93c5fd' }}>
            正在观战队友：{hud.spectateTargetName}
          </div>
          <div style={{ fontSize: 12, color: '#e2e8f0', marginTop: 4 }}>
            {hud.canTakeoverBot ? (
              <>
                <span style={{ color: '#4ade80', fontWeight: 800 }}>按 [E] 立即接管操控该 Bot</span>
                <span style={{ opacity: 0.75 }}> · 左键/右键/Space 切换队友</span>
              </>
            ) : (
              '左键/右键 切换观战队友'
            )}
          </div>
        </div>
      )}

      {/* ==================== ROUND END VICTORY BANNER ==================== */}
      {hud.roundBanner && (
        <div
          className="fade-in"
          style={{
            position: 'fixed',
            top: '24%',
            left: '50%',
            transform: 'translateX(-50%)',
            background:
              hud.roundBanner.team === 'CT'
                ? 'linear-gradient(90deg, rgba(29,78,216,0.92), rgba(37,99,235,0.92))'
                : 'linear-gradient(90deg, rgba(180,83,9,0.92), rgba(217,119,6,0.92))',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: 10,
            padding: '16px 38px',
            textAlign: 'center',
            boxShadow: '0 18px 50px rgba(0,0,0,0.65)',
            zIndex: 30,
          }}
        >
          <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: '0.06em', color: '#fff' }}>
            {hud.roundBanner.title}
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.92)', marginTop: 4, fontWeight: 600 }}>
            {hud.roundBanner.subtitle}
          </div>
        </div>
      )}

      {/* ==================== BOTTOM-LEFT: HP / ARMOR / MONEY ==================== */}
      <div
        style={{
          position: 'fixed',
          bottom: 16,
          left: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          background: 'rgba(10, 14, 22, 0.84)',
          border: '1px solid rgba(255,255,255,0.14)',
          borderRadius: 8,
          padding: '10px 18px',
          zIndex: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontSize: 13, color: '#ef4444', fontWeight: 800 }}>✚</span>
          <span
            style={{
              fontSize: 32,
              fontWeight: 900,
              fontVariantNumeric: 'tabular-nums',
              color: hud.hp <= 25 ? '#ef4444' : '#f8fafc',
            }}
          >
            {hud.hp}
          </span>
        </div>

        <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.14)' }} />

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontSize: 13, color: '#60a5fa', fontWeight: 800 }}>
            {hud.hasHelmet ? '🪖' : '🛡'}
          </span>
          <span style={{ fontSize: 26, fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: '#bfdbfe' }}>
            {hud.armor}
          </span>
        </div>

        <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.14)' }} />

        <div style={{ fontSize: 22, fontWeight: 800, color: '#4ade80', fontVariantNumeric: 'tabular-nums' }}>
          ${hud.money}
        </div>
      </div>

      {/* ==================== BOTTOM-RIGHT: AMMO & WEAPON SLOTS ==================== */}
      <div
        style={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 6,
          zIndex: 20,
        }}
      >
        {/* Weapon Slot Strip */}
        <div style={{ display: 'flex', gap: 6 }}>
          {hud.slots.primary && (
            <SlotPill num="1" label={WEAPONS[hud.slots.primary].shortName} active={hud.activeWeapon === hud.slots.primary} />
          )}
          {hud.slots.secondary && (
            <SlotPill num="2" label={WEAPONS[hud.slots.secondary].shortName} active={hud.activeWeapon === hud.slots.secondary} />
          )}
          <SlotPill num="3" label="KNIFE" active={hud.activeWeapon === 'knife'} />
          {hud.slots.c4 && (
            <SlotPill num="5" label="C4" active={hud.activeWeapon === 'c4'} highlight="#ef4444" />
          )}
        </div>

        {/* Active Weapon & Dynamic Ammo Panel */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 14,
            background: 'rgba(10, 14, 22, 0.84)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 8,
            padding: '10px 18px',
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 800, color: '#f5b942', letterSpacing: '0.05em' }}>
            {hud.activeWeaponName}
          </span>
          {hud.activeWeapon === 'knife' || hud.activeWeapon === 'c4' ? (
            <span style={{ fontSize: 24, fontWeight: 900, color: '#cbd5e1' }}>∞</span>
          ) : (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, fontVariantNumeric: 'tabular-nums' }}>
              <span
                style={{
                  fontSize: 32,
                  fontWeight: 900,
                  color: hud.ammoInMag <= 5 ? '#f87171' : '#f8fafc',
                }}
              >
                {hud.ammoInMag}
              </span>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#94a3b8' }}>/ {hud.reserveAmmo}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SlotPill: React.FC<{ num: string; label: string; active: boolean; highlight?: string }> = ({
  num,
  label,
  active,
  highlight,
}) => (
  <div
    style={{
      padding: '3px 8px',
      borderRadius: 4,
      fontSize: 11,
      fontWeight: 800,
      background: active
        ? highlight
          ? `${highlight}dd`
          : 'rgba(245, 185, 66, 0.92)'
        : 'rgba(10, 14, 22, 0.76)',
      color: active ? (highlight ? '#fff' : '#0f172a') : '#94a3b8',
      border: active ? '1px solid rgba(255,255,255,0.4)' : '1px solid rgba(255,255,255,0.1)',
    }}
  >
    <span style={{ opacity: 0.75, marginRight: 4 }}>{num}</span>
    {label}
  </div>
);
