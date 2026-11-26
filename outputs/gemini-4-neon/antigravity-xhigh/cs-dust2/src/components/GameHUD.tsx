import React from 'react';
import { Dust2MapData } from '../game/dust2Map';
import { HudSnapshot } from '../game/types';
import { HITBOX_LABELS, WEAPONS } from '../game/weapons';
import { Minimap } from './Minimap';

interface GameHUDProps {
  hud: HudSnapshot;
  mapData: Dust2MapData | null;
  onTakeover: () => void;
}

function formatClock(seconds: number): string {
  const s = Math.max(0, Math.ceil(seconds));
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}:${rem < 10 ? '0' : ''}${rem}`;
}

export const GameHUD: React.FC<GameHUDProps> = ({ hud, mapData, onTakeover }) => {
  const isScoped = hud.scopeLevel > 0 && hud.alive && !hud.isSpectating;
  const spreadPx = Math.round(hud.crosshairSpread);

  return (
    <div className="hud-layer">
      {/* Low-HP / Damage vignette */}
      {(hud.damageFlashAlpha > 0.01 || (hud.alive && hud.hp <= 25)) && (
        <div
          className="damage-vignette"
          style={{
            opacity: Math.max(hud.damageFlashAlpha, hud.alive && hud.hp <= 25 ? 0.35 : 0),
          }}
        />
      )}

      {/* AWP 2D Sniper Scope Overlay */}
      {isScoped && (
        <div className={`awp-scope-overlay zoom-${hud.scopeLevel}`}>
          <div className="scope-ring">
            <div className="scope-line-h" />
            <div className="scope-line-v" />
            <div className="scope-ticks-h" />
            <div className="scope-ticks-v" />
            <div className="scope-center-dot" />
          </div>
          <div className="scope-zoom-tag">{hud.scopeLevel === 2 ? '8.0x' : '3.5x'}</div>
        </div>
      )}

      {/* Dynamic Tactical Crosshair (hidden while scoped) */}
      {!isScoped && hud.alive && !hud.buyMenuOpen && (
        <div className="crosshair-root">
          <div className="ch-tick ch-top" style={{ transform: `translate(-50%, ${-spreadPx - 9}px)` }} />
          <div className="ch-tick ch-bot" style={{ transform: `translate(-50%, ${spreadPx}px)` }} />
          <div className="ch-tick ch-left" style={{ transform: `translate(${-spreadPx - 9}px, -50%)` }} />
          <div className="ch-tick ch-right" style={{ transform: `translate(${spreadPx}px, -50%)` }} />
          <div className="ch-dot" />
        </div>
      )}

      {/* Hitmarker + Hitbox Zone & Damage Readout */}
      {hud.hitmarkerTime > 0 && (
        <div className={`hitmarker ${hud.hitmarkerHeadshot ? 'headshot' : ''} ${hud.hitmarkerKill ? 'kill' : ''}`}>
          <span className="hm-arm hm-1" />
          <span className="hm-arm hm-2" />
          <span className="hm-arm hm-3" />
          <span className="hm-arm hm-4" />
          {hud.lastHitZone && (
            <div className="hm-label">
              {HITBOX_LABELS[hud.lastHitZone]} -{hud.lastHitDamage}
            </div>
          )}
        </div>
      )}

      {/* Directional Damage Arc */}
      {hud.damageIndicatorAngle !== null && (
        <div
          className="damage-dir-wrapper"
          style={{ transform: `translate(-50%, -50%) rotate(${hud.damageIndicatorAngle}rad)` }}
        >
          <div className="damage-dir-arrow" />
        </div>
      )}

      {/* TOP LEFT: Always-on Dust2 Minimap */}
      <Minimap mapData={mapData} hud={hud} />

      {/* TOP CENTER: Match Scoreboard Bar + Alive Avatars + Clock / C4 Timer */}
      <div className="top-bar">
        <div className="team-roster roster-ct">
          {hud.ctRosterAlive.map((alive, idx) => (
            <div key={idx} className={`roster-pip ct ${alive ? 'alive' : 'dead'}`} />
          ))}
        </div>

        <div className="score-box score-ct">
          <span className="score-label">CT</span>
          <span className="score-num">{hud.scoreCT}</span>
        </div>

        <div className={`clock-box ${hud.bombState === 'planted' ? 'bomb-active' : ''}`}>
          {hud.bombState === 'planted' ? (
            <>
              <span className="bomb-badge">C4 · {hud.bombSite}点</span>
              <span className="clock-time">{hud.bombTimer.toFixed(1)}s</span>
            </>
          ) : (
            <>
              <span className="round-meta">
                R{hud.roundNumber} {hud.isPistolRound ? '手枪局' : '全枪局'}
              </span>
              <span className="clock-time">{formatClock(hud.roundTimer)}</span>
            </>
          )}
        </div>

        <div className="score-box score-t">
          <span className="score-num">{hud.scoreT}</span>
          <span className="score-label">T</span>
        </div>

        <div className="team-roster roster-t">
          {hud.tRosterAlive.map((alive, idx) => (
            <div key={idx} className={`roster-pip t ${alive ? 'alive' : 'dead'}`} />
          ))}
        </div>
      </div>

      {/* TOP RIGHT: Real-time Killfeed */}
      <div className="killfeed">
        {hud.killfeed.map((k) => (
          <div key={k.id} className="killfeed-item">
            <span className={`kf-name ${k.killerTeam.toLowerCase()}`}>{k.killerName}</span>
            <span className="kf-weapon">[{WEAPONS[k.weapon]?.shortName ?? k.weapon}]</span>
            {k.headshot && <span className="kf-hs" title="爆头">HS</span>}
            <span className={`kf-name ${k.victimTeam.toLowerCase()}`}>{k.victimName}</span>
          </div>
        ))}
      </div>

      {/* CENTER: Announcements, Round Banner, Plant/Defuse Progress */}
      {hud.announcement && (
        <div className="hud-announcement">{hud.announcement}</div>
      )}

      {hud.roundPhase === 'round_end' && hud.roundWinner && (
        <div className={`round-end-banner winner-${hud.roundWinner.toLowerCase()}`}>
          <div className="reb-title">
            {hud.roundWinner === 'CT' ? '反恐精英 胜利 (CT WIN)' : '恐怖分子 胜利 (T WIN)'}
          </div>
          <div className="reb-reason">{hud.roundWinReason}</div>
        </div>
      )}

      {hud.actionType !== 'none' && (
        <div className="action-progress-box">
          <div className="ap-title">
            {hud.actionType === 'planting' ? '正在安放 C4 炸弹...' : '正在拆除 C4 炸弹...'}
          </div>
          <div className="ap-track">
            <div
              className={`ap-fill ${hud.actionType}`}
              style={{ width: `${Math.round(hud.actionProgress * 100)}%` }}
            />
          </div>
        </div>
      )}

      {hud.actionType === 'none' && hud.canPlant && (
        <div className="context-prompt plant">
          位于 <strong>{hud.inBombsite} 点</strong> — 按住 <kbd>E</kbd> 安放 C4 炸弹
        </div>
      )}

      {hud.actionType === 'none' && hud.canDefuse && (
        <div className="context-prompt defuse">
          靠近已安放 C4 — 按住 <kbd>E</kbd> 拆除炸弹
        </div>
      )}

      {/* Spectator / Bot Takeover Banner */}
      {hud.isSpectating && hud.roundPhase === 'live' && (
        <div className="spectator-banner">
          <div className="spec-title">
            已阵亡 · 正在观战队友: <strong>{hud.controlledName}</strong>
          </div>
          <div className="spec-actions">
            <span>[左键 / 右键] 切换存活队友</span>
            {hud.canTakeover && (
              <button className="spec-takeover-btn" onClick={onTakeover}>
                按 [E] 接管该队友
              </button>
            )}
          </div>
        </div>
      )}

      {/* BOTTOM LEFT: Health, Armor, Helmet & Cash */}
      <div className="hud-bottom-left">
        <div className={`vital-card hp-card ${hud.hp <= 25 ? 'critical' : ''}`}>
          <span className="vital-icon">+</span>
          <span className="vital-value">{hud.hp}</span>
        </div>
        <div className="vital-card armor-card">
          <span className="vital-icon">{hud.hasHelmet ? '⛨' : '◈'}</span>
          <span className="vital-value">{hud.armor}</span>
          <span className="vital-sub">{hud.hasHelmet ? '防弹衣+头盔' : '防弹衣'}</span>
        </div>
        <div className="money-pill">${hud.money}</div>
      </div>

      {/* BOTTOM RIGHT: Dynamic Ammo, Reload Bar & Weapon Slot Strip */}
      <div className="hud-bottom-right">
        <div className="weapon-slots">
          <div className={`slot-chip ${hud.activeSlot === 'primary' ? 'active' : ''} ${!hud.slots.primary ? 'empty' : ''}`}>
            <span className="slot-key">1</span>
            <span>{hud.slots.primary ? WEAPONS[hud.slots.primary].shortName : '—'}</span>
          </div>
          <div className={`slot-chip ${hud.activeSlot === 'secondary' ? 'active' : ''}`}>
            <span className="slot-key">2</span>
            <span>{hud.slots.secondary ? WEAPONS[hud.slots.secondary].shortName : '—'}</span>
          </div>
          <div className={`slot-chip ${hud.activeSlot === 'melee' ? 'active' : ''}`}>
            <span className="slot-key">3</span>
            <span>匕首</span>
          </div>
          {hud.slots.c4 && (
            <div className={`slot-chip c4-chip ${hud.activeSlot === 'c4' ? 'active' : ''}`}>
              <span className="slot-key">4</span>
              <span>C4</span>
            </div>
          )}
        </div>

        <div className="ammo-panel">
          <div className="ammo-weapon-name">
            {hud.activeWeaponName}
            {hud.activeWeapon === 'awp' && <span className="hint-chip">右键开镜</span>}
          </div>
          {hud.reloading ? (
            <div className="reload-wrap">
              <span className="reload-label">换弹中...</span>
              <div className="reload-bar">
                <div
                  className="reload-fill"
                  style={{ width: `${Math.round(hud.reloadProgress * 100)}%` }}
                />
              </div>
            </div>
          ) : hud.mag >= 0 ? (
            <div className="ammo-numbers">
              <span className={`ammo-mag ${hud.mag <= 5 ? 'low' : ''}`}>{hud.mag}</span>
              <span className="ammo-sep">/</span>
              <span className="ammo-res">{hud.reserve}</span>
            </div>
          ) : (
            <div className="ammo-numbers melee-tag">
              {hud.activeWeapon === 'c4' ? '前往包点按 [E]' : '左键挥砍 / 右键重刺'}
            </div>
          )}
        </div>

        <div className="quick-keys-hint">
          [B] 武器商店 · [R] 换弹 · [Tab] 战绩 · [Esc] 菜单
        </div>
      </div>
    </div>
  );
};
