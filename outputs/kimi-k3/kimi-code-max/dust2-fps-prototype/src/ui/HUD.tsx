import { useEffect, useState, useSyncExternalStore } from 'react';
import type { UIStore } from './store';

function Crosshair({ gap, hit, head }: { gap: number; hit: number; head: boolean }) {
  const [hitVisible, setHitVisible] = useState(false);
  useEffect(() => {
    if (hit === 0) return;
    setHitVisible(true);
    const t = setTimeout(() => setHitVisible(false), 120);
    return () => clearTimeout(t);
  }, [hit]);
  const g = Math.min(60, Math.max(4, gap));
  const len = 8;
  const th = 2;
  return (
    <div className="crosshair">
      <div className="ch-line" style={{ left: -g - len, top: -th / 2, width: len, height: th }} />
      <div className="ch-line" style={{ left: g, top: -th / 2, width: len, height: th }} />
      <div className="ch-line" style={{ top: -g - len, left: -th / 2, height: len, width: th }} />
      <div className="ch-line" style={{ top: g, left: -th / 2, height: len, width: th }} />
      <div className="ch-dot" />
      {hitVisible && <div className={head ? 'hitmarker head' : 'hitmarker'} />}
    </div>
  );
}

function ScopeOverlay() {
  return (
    <div className="scope-overlay">
      <div className="scope-circle" />
      <div className="scope-h" />
      <div className="scope-v" />
    </div>
  );
}

function fmtTime(sec: number): string {
  const s = Math.max(0, Math.ceil(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function HUD({ store }: { store: UIStore }) {
  const s = useSyncExternalStore(store.subscribe, store.get);
  const bombPlanted = s.bomb === 'planted';

  return (
    <div className="hud">
      {s.scoped && <ScopeOverlay />}
      {!s.scoped && s.showCrosshair && <Crosshair gap={s.crossGap} hit={s.hitTick} head={s.hitHead} />}

      <div className="topbar">
        <span className="score t">T {s.scoreT}</span>
        <span className={bombPlanted ? 'timer bomb' : 'timer'}>{fmtTime(s.timeLeft)}</span>
        <span className="score ct">{s.scoreCT} CT</span>
        <span className="round-info">
          第 {s.roundNum} 回合{s.phase === 'freeze' ? ' · 准备' : ''}
        </span>
        {bombPlanted && <span className="bomb-flag">C4 已安放 {s.bombSite}</span>}
        {s.hasBomb && <span className="bomb-flag carried">你携带 C4</span>}
      </div>

      <div className="killfeed">
        {s.killfeed.map((k) => (
          <div key={k.id} className="kf-row">
            <span className={k.killerTeam === 'T' ? 'kf-t' : 'kf-ct'}>{k.killer}</span>
            <span className="kf-weapon">
              [{k.weapon}
              {k.headshot ? ' 爆头' : ''}]
            </span>
            <span className={k.victimTeam === 'T' ? 'kf-t' : 'kf-ct'}>{k.victim}</span>
          </div>
        ))}
      </div>

      <div className="vitals">
        <div className="bar-row">
          <span className="bar-label">HP</span>
          <div className="bar">
            <div className="bar-fill hp" style={{ width: `${s.hp}%` }} />
          </div>
          <span className="bar-num">{s.hp}</span>
        </div>
        <div className="bar-row">
          <span className="bar-label">护甲</span>
          <div className="bar">
            <div className="bar-fill armor" style={{ width: `${s.armor}%` }} />
          </div>
          <span className="bar-num">{s.armor}</span>
        </div>
      </div>

      <div className="ammo-panel">
        <div className="weapon-name">{s.weaponName}</div>
        <div className="ammo-nums">
          <span className={s.reloading ? 'mag reloading' : 'mag'}>{s.reloading ? '换弹中' : s.mag}</span>
          <span className="reserve">/ {s.reserve}</span>
        </div>
        <div className="slots">
          <span className={s.slot === 'primary' ? 'slot active' : s.hasPrimary ? 'slot' : 'slot empty'}>1</span>
          <span className={s.slot === 'secondary' ? 'slot active' : s.hasSecondary ? 'slot' : 'slot empty'}>2</span>
          <span className={s.slot === 'melee' ? 'slot active' : 'slot'}>3</span>
        </div>
      </div>

      {s.channel && (
        <div className="channel">
          <div className="channel-label">{s.channel.label}</div>
          <div className="channel-bar">
            <div className="channel-fill" style={{ width: `${Math.min(100, s.channel.frac * 100)}%` }} />
          </div>
        </div>
      )}

      {s.hint && <div className="hint">{s.hint}</div>}

      {s.banner && (
        <div className="banner">
          <div className="banner-main">{s.banner}</div>
          {s.subBanner && <div className="banner-sub">{s.subBanner}</div>}
        </div>
      )}

      {s.dead && (
        <div className="dead-overlay">
          <div className="dead-title">你已阵亡</div>
          {s.spectating && <div className="dead-sub">观战中：{s.spectating}（左键切换队友）</div>}
          {s.canPossess && <div className="dead-sub">按 F 接管该队友</div>}
        </div>
      )}

      {!s.locked && !s.dead && <div className="lock-hint">点击画面锁定鼠标继续</div>}
    </div>
  );
}
