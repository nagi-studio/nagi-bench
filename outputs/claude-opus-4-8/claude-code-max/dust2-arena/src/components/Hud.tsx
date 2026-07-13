import { useSyncExternalStore } from 'react';
import { hud } from '../engine/store';
import { Team } from '../engine/types';
import { WEAPONS } from '../engine/weapons';

function useHud() {
  return useSyncExternalStore(hud.subscribe, hud.getSnapshot, hud.getSnapshot);
}

const T_COLOR = '#e0a24a';
const CT_COLOR = '#5aa9e6';
const teamColor = (t: Team) => (t === Team.T ? T_COLOR : CT_COLOR);

function fmt(t: number): string {
  const s = Math.max(0, Math.ceil(t));
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${m}:${ss.toString().padStart(2, '0')}`;
}

function Crosshair({ spread, hit }: { spread: number; hit: boolean }) {
  const gap = Math.max(3, Math.min(90, spread * 600));
  const len = 7;
  const thick = 2;
  const col = hit ? '#ff5b5b' : '#e7fff0';
  const line = (style: React.CSSProperties) => (
    <span style={{ position: 'absolute', background: col, ...style }} />
  );
  return (
    <div className="crosshair">
      {line({ width: thick, height: len, left: -thick / 2, top: -gap - len })}
      {line({ width: thick, height: len, left: -thick / 2, top: gap })}
      {line({ width: len, height: thick, top: -thick / 2, left: -gap - len })}
      {line({ width: len, height: thick, top: -thick / 2, left: gap })}
      <span style={{ position: 'absolute', width: 2, height: 2, left: -1, top: -1, background: col }} />
    </div>
  );
}

export function Hud() {
  const s = useHud();

  return (
    <div className="hud">
      {/* top score bar */}
      <div className="topbar">
        <div className="team-block" style={{ color: T_COLOR }}>
          <span className="team-tag">T</span>
          <span className="team-alive">{'●'.repeat(s.aliveT)}<span className="dead-dots">{'○'.repeat(Math.max(0, 5 - s.aliveT))}</span></span>
        </div>
        <div className="score-center">
          <span className="score" style={{ color: T_COLOR }}>{s.scoreT}</span>
          <span className="score-time">{s.bombPlanted ? <b className="bomb-time">{fmt(s.bombTimer)}</b> : fmt(s.roundTime)}</span>
          <span className="score" style={{ color: CT_COLOR }}>{s.scoreCT}</span>
        </div>
        <div className="team-block team-right" style={{ color: CT_COLOR }}>
          <span className="team-alive"><span className="dead-dots">{'○'.repeat(Math.max(0, 5 - s.aliveCT))}</span>{'●'.repeat(s.aliveCT)}</span>
          <span className="team-tag">CT</span>
        </div>
      </div>

      {/* killfeed */}
      <div className="killfeed">
        {s.killfeed.map((k) => (
          <div className="kill-row" key={k.id}>
            <span style={{ color: teamColor(k.attackerTeam) }}>{k.attacker}</span>
            <span className="kill-weapon">{WEAPONS[k.weapon]?.name ?? k.weapon}{k.headshot ? ' ×' : ''}</span>
            <span style={{ color: teamColor(k.victimTeam) }}>{k.victim}</span>
          </div>
        ))}
      </div>

      {/* center banner */}
      {s.banner && <div className="banner">{s.banner}</div>}

      {/* plant / defuse progress */}
      {(s.planting || s.defusing) && (
        <div className="progress-wrap">
          <div className="progress-label">{s.planting ? 'PLANTING' : 'DEFUSING'}</div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${Math.min(100, (s.planting ? s.plantProgress : s.defuseProgress) * 100)}%`,
                background: s.planting ? T_COLOR : CT_COLOR,
              }}
            />
          </div>
        </div>
      )}

      {/* scope overlay */}
      {s.scoped && (
        <div className="scope">
          <div className="scope-circle" />
          <div className="scope-line scope-h" />
          <div className="scope-line scope-v" />
        </div>
      )}

      {/* crosshair */}
      {!s.scoped && (s.alive || s.spectating) && <Crosshair spread={s.spread} hit={false} />}

      {/* dead: spectate bar, or eliminated when no teammate left */}
      {!s.alive && s.spectating && (
        <div className="spectate">
          <div className="spectate-title">
            SPECTATING <span className="spectate-name">{s.spectateName}</span>
          </div>
          <div className="spectate-keys">
            <b>[F]</b> / <b>Space</b> take control&nbsp;&nbsp;·&nbsp;&nbsp;<b>Mouse1</b> / <b>A</b> / <b>D</b> switch player
          </div>
        </div>
      )}
      {!s.alive && !s.spectating && (
        <div className="dead">
          <div className="dead-title">ELIMINATED</div>
          <div className="dead-sub">No teammates left — round ending</div>
        </div>
      )}

      {/* hint */}
      {s.hint && s.alive && <div className="hint">{s.hint}</div>}

      {/* bomb carrier tag */}
      {s.hasBomb && s.alive && <div className="bomb-tag">C4 — bring it to A or B</div>}

      {/* bottom-left: health / armor */}
      <div className="vitals">
        <div className="vital">
          <span className="vital-icon hp">+</span>
          <span className="vital-num" style={{ color: s.health < 30 ? '#ff5b5b' : '#fff' }}>{s.health}</span>
        </div>
        <div className="vital">
          <span className="vital-icon ar">{s.helmet ? 'A*' : 'A'}</span>
          <span className="vital-num">{s.armor}</span>
        </div>
      </div>

      {/* bottom-right: ammo + weapons */}
      <div className="ammo-block">
        <div className="ammo-weapon">{s.weaponName}</div>
        <div className="ammo-nums">
          {s.infiniteAmmo ? (
            <span className="ammo-mag">∞</span>
          ) : (
            <>
              <span className="ammo-mag" style={{ color: s.reloading ? '#ffcf5b' : '#fff' }}>
                {s.reloading ? 'R' : s.mag}
              </span>
              <span className="ammo-res">/ {s.reserve}</span>
            </>
          )}
        </div>
        <div className="weapon-slots">
          {s.loadout.map((w) => (
            <div key={w.id} className={`slot ${w.current ? 'slot-cur' : ''}`}>
              <span className="slot-key">{w.slot === 'primary' ? '1' : w.slot === 'secondary' ? '2' : '3'}</span>
              <span className="slot-name">{w.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
