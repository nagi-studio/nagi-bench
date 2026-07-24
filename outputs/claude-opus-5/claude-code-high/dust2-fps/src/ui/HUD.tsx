import { clamp } from '../core/math.ts';
import type { HudSnapshot } from '../core/types.ts';
import type { GameEngine } from '../game/engine.ts';
import { Killfeed } from './Killfeed.tsx';
import { Minimap } from './Minimap.tsx';
import { ScopeOverlay } from './ScopeOverlay.tsx';

function fmtTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

/** Dynamic crosshair: the gap follows the weapon's current cone. */
function Crosshair({ snap }: { snap: HudSnapshot }): JSX.Element | null {
  if (snap.scoped) return null;
  const gap = clamp(snap.spreadPx, 5, 90);
  return (
    <div className="crosshair">
      <i className="h" style={{ transform: `translate(${-gap - 9}px, 0)` }} />
      <i className="h" style={{ transform: `translate(${gap}px, 0)` }} />
      <i className="v" style={{ transform: `translate(0, ${-gap - 9}px)` }} />
      <i className="v" style={{ transform: `translate(0, ${gap}px)` }} />
      <i className="dot" />
    </div>
  );
}

function AliveDots({ count, team }: { count: number; team: 'ct' | 't' }): JSX.Element {
  return (
    <div className="alive-dots">
      {[0, 1, 2, 3, 4].map((i) => (
        <i key={i} className={`${i < count ? 'on ' : ''}${team}`} />
      ))}
    </div>
  );
}

export function HUD({ snap, engine }: { snap: HudSnapshot; engine: GameEngine }): JSX.Element {
  const now = engine.time;
  const hitMarkerOn = now - snap.hitMarker < 0.35;
  const damageOn = now - snap.damageFlash < 0.45;
  const lowHp = snap.health <= 35;
  const lowAmmo = snap.usesAmmo && snap.magAmmo <= 5;
  const planting = snap.plantProgress > 0;
  const defusing = snap.defuseProgress > 0;

  return (
    <div className="hud">
      <Minimap engine={engine} />

      {/* ---------------------------------------------------- round header */}
      <div className="hud-top-center panel">
        <div>
          <div className="score ct">{snap.scoreCT}</div>
          <AliveDots count={snap.aliveCT} team="ct" />
        </div>
        <div>
          <div className={`timer${snap.bombPlanted ? ' bomb' : ''}`}>
            {snap.bombPlanted ? snap.bombTimeLeft.toFixed(1) : fmtTime(snap.phaseTimeLeft)}
          </div>
          <div className="round-label">
            {snap.bombPlanted
              ? 'C4 已安放'
              : snap.phase === 'freeze'
                ? `准备阶段 · 第 ${snap.roundNumber} 回合`
                : `第 ${snap.roundNumber} 回合${snap.isPistolRound ? ' · 手枪局' : ''}`}
          </div>
        </div>
        <div>
          <div className="score t">{snap.scoreT}</div>
          <AliveDots count={snap.aliveT} team="t" />
        </div>
      </div>

      <Killfeed events={snap.killfeed} now={now} />

      {/* --------------------------------------------------------- crosshair */}
      <Crosshair snap={snap} />
      <div className={`hitmarker${hitMarkerOn ? ' on' : ''}`}>
        <i style={{ left: 0, top: 0, width: 12, height: 2 }} />
        <i style={{ right: 0, bottom: 0, width: 12, height: 2 }} />
        <i style={{ left: 0, top: 0, width: 2, height: 12 }} />
        <i style={{ right: 0, bottom: 0, width: 2, height: 12 }} />
      </div>

      {snap.scoped && <ScopeOverlay />}
      <div className={`damage-flash${damageOn ? ' on' : ''}`} />

      {/* ------------------------------------------------------- vitals ---- */}
      <div className="hud-bottom-left panel">
        <div>
          <div className="stat">
            <span className="label">HP</span>
            <span className="value" style={lowHp ? { color: '#ff5a3c' } : undefined}>
              {snap.health}
            </span>
          </div>
          <div className={`hp-bar${lowHp ? ' low' : ''}`}>
            <span style={{ width: `${clamp(snap.health, 0, 100)}%` }} />
          </div>
        </div>
        <div className="stat armor">
          <span className="label">{snap.helmet ? '护甲+盔' : '护甲'}</span>
          <span className="value">{snap.armor}</span>
        </div>
        <div className="stat">
          <span className="label">$</span>
          <span className="value" style={{ fontSize: 20, color: '#7ee4a5' }}>
            {snap.money}
          </span>
        </div>
      </div>

      {/* --------------------------------------------------------- weapon -- */}
      <div className="hud-bottom-right panel">
        <div className={`ammo${lowAmmo ? ' low' : ''}`}>
          {snap.usesAmmo ? (
            <>
              {snap.magAmmo}
              <span className="reserve"> / {snap.reserveAmmo}</span>
            </>
          ) : (
            <span style={{ fontSize: 22, opacity: 0.6 }}>—</span>
          )}
        </div>
        <div className="weapon-name">{snap.weaponName}</div>
        {snap.reloading && <div className="reloading">换弹中…</div>}
        <div className="slots">
          {snap.loadout.map((l) => (
            <span key={l.slot} className={l.active ? 'active' : ''}>
              {l.slot === 'primary' ? '1' : l.slot === 'secondary' ? '2' : l.slot === 'melee' ? '3' : '5'} {l.name}
            </span>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------- plant / defuse --- */}
      {(planting || defusing) && (
        <div className="progress-wrap">
          <div className="label">{planting ? '安放 C4' : '拆除 C4'}</div>
          <div className={`progress${defusing ? ' defuse' : ''}`}>
            <span style={{ width: `${(planting ? snap.plantProgress : snap.defuseProgress) * 100}%` }} />
          </div>
        </div>
      )}

      {snap.hint && <div className="hint">{snap.hint}</div>}

      {snap.roundEndText && (
        <div className="round-banner panel">
          {snap.roundEndText}
          <div className="sub">
            CT {snap.scoreCT} — {snap.scoreT} T
          </div>
        </div>
      )}

      {snap.spectating && snap.phase !== 'over' && (
        <div className="death-notice panel">
          正在观战 <b>{snap.spectatedName}</b>
          <div style={{ marginTop: 8, fontSize: 13, opacity: 0.75 }}>
            <kbd>空格</kbd>/<kbd>左键</kbd> 切换队友 · <kbd>F</kbd> 接管该队友
          </div>
        </div>
      )}
    </div>
  );
}
