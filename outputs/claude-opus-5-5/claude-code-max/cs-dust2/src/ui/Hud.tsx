import { memo } from 'react';
import { formatClock } from '../game/core/math';
import type { Team } from '../game/core/types';
import type { GameEngine } from '../game/engine/GameEngine';
import { useStore } from '../game/engine/Store';
import type { MatchSettings } from '../game/core/types';
import { Crosshair } from './Crosshair';
import { Minimap } from './Minimap';
import { BuyMenu, MatchOver, PauseMenu, Scoreboard } from './Overlays';

interface HudProps {
  engine: GameEngine;
  onExit: (s?: MatchSettings) => void;
}

export function Hud({ engine, onExit }: HudProps) {
  const paused = useStore(engine.hud, (s) => s.paused);
  const matchWinner = useStore(engine.hud, (s) => s.matchWinner);
  const scoped = useStore(engine.hud, (s) => s.scoped);
  return (
    <div className="hud">
      {scoped && <ScopeOverlay />}
      <Crosshair engine={engine} />
      <TopBar engine={engine} />
      <div className="hud-tl">
        <Minimap engine={engine} />
        <Location engine={engine} />
      </div>
      <Killfeed engine={engine} />
      <Notices engine={engine} />
      <BannerView engine={engine} />
      <Vitals engine={engine} />
      <Ammo engine={engine} />
      <Objective engine={engine} />
      <Spectator engine={engine} />
      <Fps engine={engine} />
      <BuyMenu engine={engine} />
      <Scoreboard engine={engine} />
      {paused && !matchWinner && <PauseMenu engine={engine} onExit={onExit} />}
      {matchWinner && <MatchOver engine={engine} onExit={onExit} />}
    </div>
  );
}

const ScopeOverlay = memo(function ScopeOverlay() {
  return (
    <div className="scope">
      <div className="scope-mask" />
      <div className="scope-line h" />
      <div className="scope-line v" />
      <div className="scope-ring" />
    </div>
  );
});

function TopBar({ engine }: { engine: GameEngine }) {
  const s = useStore(engine.hud, (h) => ({
    clock: h.clock,
    phase: h.phase,
    round: h.round,
    pistol: h.pistolRound,
    planted: h.bombPlanted,
    ct: h.scoreCT,
    t: h.scoreT,
    aliveCT: h.aliveCT,
    aliveT: h.aliveT,
  }));
  const clockClass = s.planted ? 'clock bomb' : s.phase === 'freeze' ? 'clock freeze' : s.clock <= 10 && s.phase === 'live' ? 'clock low' : 'clock';
  return (
    <div className="topbar">
      <div className="team-side ct">
        <div className="pips">
          {s.aliveCT.map((a, i) => (
            <span key={i} className={`pip ct ${a ? '' : 'dead'}`} />
          ))}
        </div>
        <div className="score ct">{s.ct}</div>
      </div>
      <div className="center-clock">
        <div className={clockClass}>{s.planted ? <span className="bomb-icon">💣</span> : formatClock(s.clock)}</div>
        <div className="round-label">
          {s.phase === 'freeze' ? '冻结时间' : s.planted ? '炸弹已安放' : `第 ${s.round} 回合`}
          {s.pistol ? ' · 手枪局' : ''}
        </div>
      </div>
      <div className="team-side t">
        <div className="score t">{s.t}</div>
        <div className="pips">
          {s.aliveT.map((a, i) => (
            <span key={i} className={`pip t ${a ? '' : 'dead'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Location({ engine }: { engine: GameEngine }) {
  const loc = useStore(engine.hud, (h) => h.location);
  return <div className="location">{loc || '—'}</div>;
}

const teamClass = (t: Team | null) => (t === 'CT' ? 'ct' : t === 'T' ? 't' : '');

function Killfeed({ engine }: { engine: GameEngine }) {
  const feed = useStore(engine.hud, (h) => h.killfeed);
  return (
    <div className="killfeed">
      {feed.map((k) => (
        <div key={k.id} className={`kf-row ${k.mine ? 'mine' : ''}`}>
          {k.killer && <span className={`kf-name ${teamClass(k.killerTeam)}`}>{k.killer}</span>}
          <span className="kf-weapon">{k.weapon}</span>
          {k.headshot && <span className="kf-hs" title="爆头">◎</span>}
          <span className={`kf-name ${teamClass(k.victimTeam)}`}>{k.victim}</span>
        </div>
      ))}
    </div>
  );
}

function Notices({ engine }: { engine: GameEngine }) {
  const notices = useStore(engine.hud, (h) => h.notices);
  return (
    <div className="notices">
      {notices.map((n) => (
        <div key={n.key} className={`notice ${n.tone}`}>
          {n.text}
        </div>
      ))}
    </div>
  );
}

function BannerView({ engine }: { engine: GameEngine }) {
  const b = useStore(engine.hud, (h) => h.banner);
  if (!b) return null;
  return (
    <div className={`banner ${b.tone}`} key={b.key}>
      <div className="banner-title">{b.title}</div>
      {b.sub && <div className="banner-sub">{b.sub}</div>}
    </div>
  );
}

function Vitals({ engine }: { engine: GameEngine }) {
  const s = useStore(engine.hud, (h) => ({
    hp: h.health,
    armor: h.armor,
    helmet: h.helmet,
    kit: h.hasKit,
    bomb: h.hasBomb,
    team: h.viewTeam,
    spectating: h.spectating,
    name: h.viewName,
    deathCam: h.deathCam,
  }));
  if (s.deathCam) return null;
  const hpClass = s.hp <= 25 ? 'low' : s.hp <= 50 ? 'mid' : '';
  return (
    <div className={`vitals ${s.team === 'CT' ? 'ct' : 't'}`}>
      <div className="vital">
        <span className="v-icon">✚</span>
        <span className={`v-num ${hpClass}`}>{s.hp}</span>
        <div className="v-bar">
          <div className={`v-fill hp ${hpClass}`} style={{ width: `${s.hp}%` }} />
        </div>
      </div>
      <div className="vital">
        <span className="v-icon">{s.helmet ? '⛑' : '⛨'}</span>
        <span className="v-num">{s.armor}</span>
        <div className="v-bar">
          <div className="v-fill armor" style={{ width: `${s.armor}%` }} />
        </div>
      </div>
      <div className="v-tags">
        {s.helmet && <span className="tag">头盔</span>}
        {s.kit && <span className="tag ct">拆弹器</span>}
        {s.bomb && <span className="tag bomb">C4</span>}
        {s.spectating && <span className="tag">观战：{s.name}</span>}
      </div>
    </div>
  );
}

function Ammo({ engine }: { engine: GameEngine }) {
  const s = useStore(engine.hud, (h) => ({ w: h.weapon, slots: h.slots, reloading: h.reloading, deathCam: h.deathCam }));
  if (s.deathCam || !s.w) return null;
  const w = s.w;
  const hasMag = w.mag > 0;
  const low = hasMag && w.ammo <= Math.ceil(w.mag * 0.2);
  // a compact bullet column reflecting magazine fill
  const pips = hasMag ? Math.min(w.mag, 30) : 0;
  const filled = hasMag ? Math.round((w.ammo / w.mag) * pips) : 0;
  return (
    <div className="ammo">
      <div className="slots">
        {s.slots.map((sl) => (
          <div key={sl.slot} className={`slot ${sl.active ? 'active' : ''}`}>
            <kbd>{sl.key}</kbd>
            <span>{sl.name}</span>
          </div>
        ))}
      </div>
      <div className="weapon-name">{w.name}</div>
      {hasMag ? (
        <>
          <div className="ammo-count">
            <span className={`mag ${low ? 'low' : ''} ${s.reloading ? 'reloading' : ''}`}>{s.reloading ? '换弹中' : w.ammo}</span>
            <span className="sep">/</span>
            <span className="reserve">{w.reserve}</span>
          </div>
          <div className="bullets">
            {Array.from({ length: pips }, (_, i) => (
              <span key={i} className={`bullet ${i < filled ? 'on' : ''}`} />
            ))}
          </div>
        </>
      ) : (
        <div className="ammo-count">
          <span className="mag">∞</span>
        </div>
      )}
    </div>
  );
}

function Objective({ engine }: { engine: GameEngine }) {
  const s = useStore(engine.hud, (h) => ({ plant: h.plantProgress, defuse: h.defuseProgress, hint: h.actionHint, site: h.inBombsite }));
  return (
    <div className="objective">
      {s.hint && <div className="action-hint">{s.hint}</div>}
      {s.plant !== null && (
        <div className="progress t">
          <div className="progress-label">正在安放 C4…</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${s.plant * 100}%` }} />
          </div>
        </div>
      )}
      {s.defuse !== null && (
        <div className="progress ct">
          <div className="progress-label">正在拆除炸弹…</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${s.defuse * 100}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}

function Spectator({ engine }: { engine: GameEngine }) {
  const s = useStore(engine.hud, (h) => ({
    spectating: h.spectating,
    deathCam: h.deathCam,
    name: h.viewName,
    team: h.viewTeam,
    canTakeover: h.canTakeover,
    controllingBot: h.controllingBot,
    playerTeam: h.playerTeam,
  }));
  if (s.controllingBot && !s.spectating) {
    return <div className="takeover-tag">正在操控：{s.controllingBot}（BOT）</div>;
  }
  if (!s.spectating) return null;
  if (s.deathCam) {
    return (
      <div className="spectator">
        <div className="spec-title">你阵亡了</div>
        <div className="spec-sub">即将切换到存活队友视角（左键跳过）</div>
      </div>
    );
  }
  return (
    <div className="spectator">
      <div className="spec-title">
        正在观察：<span className={teamClass(s.team)}>{s.name || '—'}</span>
      </div>
      <div className="spec-sub">
        鼠标左/右键或 ←/→ 切换队友
        {s.canTakeover ? ' · 按 E 接管该队友（BOT）' : s.team !== s.playerTeam ? ' · 队友已全部阵亡' : ''}
      </div>
    </div>
  );
}

function Fps({ engine }: { engine: GameEngine }) {
  const s = useStore(engine.hud, (h) => ({ fps: h.fps, show: h.showFps }));
  if (!s.show) return null;
  return <div className="fps">{s.fps} FPS</div>;
}

