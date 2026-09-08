import { memo, type CSSProperties, type ComponentProps } from 'react';
import { fmtTime } from '../core/math';
import type { HudState } from '../game/types';
import { Minimap } from './Minimap';

type MapType = ComponentProps<typeof Minimap>['map'];

function Crosshair({ spread, hit }: { spread: number; hit: number }) {
  const gap = 4 + Math.min(58, spread * 520);
  const len = 8;
  const th = 2;
  const color = 'rgba(120,255,150,0.95)';
  const line = (style: CSSProperties) => <i className="ch-line" style={style} />;
  return (
    <div className="crosshair">
      {line({ width: th, height: len, left: 0, top: -gap - len / 2, background: color })}
      {line({ width: th, height: len, left: 0, top: gap + len / 2, background: color })}
      {line({ width: len, height: th, left: -gap - len / 2, top: 0, background: color })}
      {line({ width: len, height: th, left: gap + len / 2, top: 0, background: color })}
      <i className="ch-dot" style={{ left: 0, top: 0 }} />
      {hit > 0 && (
        <div className="hitmark" style={{ opacity: Math.min(1, hit) }}>
          <i style={{ transform: 'translate(-50%,-50%) rotate(45deg)', left: -9, top: -9 }} />
          <i style={{ transform: 'translate(-50%,-50%) rotate(-45deg)', left: 9, top: -9 }} />
          <i style={{ transform: 'translate(-50%,-50%) rotate(-45deg)', left: -9, top: 9 }} />
          <i style={{ transform: 'translate(-50%,-50%) rotate(45deg)', left: 9, top: 9 }} />
        </div>
      )}
    </div>
  );
}

function ScopeOverlay() {
  return (
    <div className="scope">
      <div className="ring" />
      <div className="hline" />
      <div className="vline" />
    </div>
  );
}

function Killfeed({ hud }: { hud: HudState }) {
  return (
    <div className="killfeed">
      {hud.killfeed.map((k) => (
        <div className="kf" key={k.id}>
          <span className={k.killerTeam === 'CT' ? 'ct' : 't'}>{k.killer}</span>
          <span className="wpn">
            {k.headshot ? <span className="hs">◎ </span> : null}
            {k.weapon}
          </span>
          <span className={k.victimTeam === 'CT' ? 'ct' : 't'}>{k.victim}</span>
        </div>
      ))}
    </div>
  );
}

function TopBar({ hud }: { hud: HudState }) {
  const bombLive = hud.bomb.planted;
  const time = bombLive ? hud.bomb.timer : hud.roundTime;
  const alive = (n: number, team: 'CT' | 'T') => (
    <div className="alive-group">
      {[0, 1, 2, 3, 4].map((i) => (
        <i
          key={i}
          className={i >= n ? 'dead' : ''}
          style={{ background: team === 'CT' ? 'var(--ct)' : 'var(--t)' }}
        />
      ))}
    </div>
  );
  return (
    <>
      <div className="topbar">
        <div className="score">
          <span className="side ct">CT</span>
          <span className="val">{hud.scoreCT}</span>
        </div>
        <div className={`timer${bombLive ? ' bomb' : ''}`}>
          <span className="t">{fmtTime(time)}</span>
          <span className="r">{bombLive ? 'C4' : `第 ${hud.roundNumber} 回合`}</span>
        </div>
        <div className="score">
          <span className="val">{hud.scoreT}</span>
          <span className="side t">T</span>
        </div>
      </div>
      <div className="alive-dots">
        {alive(hud.aliveCT, 'CT')}
        {alive(hud.aliveT, 'T')}
      </div>
    </>
  );
}

function Vitals({ hud }: { hud: HudState }) {
  const hpPct = Math.max(0, Math.min(100, hud.health));
  const arPct = Math.max(0, Math.min(100, hud.armor));
  const hpColor = hpPct > 60 ? '#6ee7a8' : hpPct > 25 ? '#ffcf6b' : '#ff5a5a';
  return (
    <div className="panel vitals">
      <div className="row">
        <span className="num" style={{ color: hpColor }}>
          {hud.health}
        </span>
        <span className="lbl">HP</span>
        {hud.armor > 0 && (
          <span className="armor-tag">
            🛡 {hud.armor}
            {hud.helmet ? ' +盔' : ''}
          </span>
        )}
      </div>
      <div className="bar">
        <i style={{ width: `${hpPct}%`, background: hpColor }} />
      </div>
      {hud.armor > 0 && (
        <div className="bar" style={{ height: 4 }}>
          <i style={{ width: `${arPct}%`, background: 'var(--ct)' }} />
        </div>
      )}
    </div>
  );
}

function Ammo({ hud }: { hud: HudState }) {
  const infinite = hud.slot === 'knife';
  return (
    <div className="panel ammo">
      <div className="wname">{hud.weaponName}</div>
      <div className="mag">
        {infinite ? '—' : hud.ammo}
        {!infinite && <small> / {hud.reserve}</small>}
      </div>
      {hud.reloading && <div className="reload">装填中…</div>}
      {!hud.reloading && !infinite && hud.ammo === 0 && <div className="reload">按 R 换弹</div>}
    </div>
  );
}

export const Hud = memo(function Hud({ hud, map }: { hud: HudState; map: MapType }) {
  const teamColor = hud.team === 'CT' ? 'var(--ct)' : 'var(--t)';
  return (
    <div id="hud-root">
      <Minimap map={map} entities={hud.entities} yaw={hud.playerYaw} />
      <TopBar hud={hud} />
      <Killfeed hud={hud} />
      {!hud.scoped && <Crosshair spread={hud.spread} hit={hud.hitMarker} />}
      {hud.scoped && <ScopeOverlay />}
      <Vitals hud={hud} />
      <Ammo hud={hud} />
      {hud.banner && (
        <div className="banner" style={{ color: teamColor }}>
          {hud.banner}
        </div>
      )}
      {hud.interact && <div className="interact">{hud.interact}</div>}
      {!hud.playerAlive && (
        <div className="dead-note">
          <b>已阵亡</b>
          <div style={{ opacity: 0.75, fontSize: 13, marginTop: 4 }}>正在切换至存活队友…</div>
        </div>
      )}
      {hud.damageFlash > 0.02 && <div className="damage-vignette" style={{ opacity: Math.min(1, hud.damageFlash) }} />}
      <div className="fps">
        FPS {hud.fps} · {hud.playerName}
      </div>
    </div>
  );
});
