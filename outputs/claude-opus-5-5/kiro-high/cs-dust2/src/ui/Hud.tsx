// 2D HUD overlay. Every widget subscribes to only the store fields it needs.

import { memo } from 'react';
import { useGame, useHud } from './context';
import { Minimap } from './Minimap';
import { TEAM_LABEL } from '../game/types';
import { ROUND_TYPE_LABEL } from '../game/weapons/WeaponDefs';
import { WIN_ROUNDS } from '../game/config';

const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.max(0, s % 60)).padStart(2, '0')}`;
const teamColor = (t: string | null) => (t === 'CT' ? 'var(--ct)' : t === 'T' ? 'var(--t)' : '#ddd');

const TopBar = memo(function TopBar() {
  const scoreT = useHud((s) => s.scoreT);
  const scoreCT = useHud((s) => s.scoreCT);
  const time = useHud((s) => s.timeLeft);
  const phase = useHud((s) => s.phase);
  const planted = useHud((s) => s.bombPlanted);
  const bombLeft = useHud((s) => s.bombTimeLeft);
  const aliveT = useHud((s) => s.aliveT);
  const aliveCT = useHud((s) => s.aliveCT);
  const round = useHud((s) => s.round);
  const roundType = useHud((s) => s.roundType);
  const pips = (n: number, team: 'T' | 'CT') => (
    <div className={`pips ${team.toLowerCase()}`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < n ? 'pip on' : 'pip'} />
      ))}
    </div>
  );
  return (
    <div className="topbar">
      <div className="score ct">
        {pips(aliveCT, 'CT')}
        <span className="num">{scoreCT}</span>
      </div>
      <div className={`clock ${planted ? 'planted' : ''} ${phase === 'freeze' ? 'freeze' : ''}`}>
        {planted ? (
          <>
            <span className="c4-icon">C4</span>
            <span>{bombLeft}</span>
          </>
        ) : (
          <span>{fmtTime(time)}</span>
        )}
        <div className="round-info">
          第 {round} 回合 · {ROUND_TYPE_LABEL[roundType]} · 先到 {WIN_ROUNDS} 胜
        </div>
      </div>
      <div className="score t">
        <span className="num">{scoreT}</span>
        {pips(aliveT, 'T')}
      </div>
    </div>
  );
});

const Crosshair = memo(function Crosshair() {
  const gap = useHud((s) => s.crosshairGap);
  const scoped = useHud((s) => s.scoped);
  const weaponId = useHud((s) => s.weaponId);
  const spectating = useHud((s) => s.spectating);
  if (scoped) return null;
  const awp = weaponId === 'awp';
  const g = Math.min(80, gap);
  return (
    <div className={`crosshair ${spectating ? 'spec' : ''}`}>
      {!awp && (
        <>
          <i className="ch-line h" style={{ transform: `translate(${-g - 9}px, -1px)` }} />
          <i className="ch-line h" style={{ transform: `translate(${g}px, -1px)` }} />
          <i className="ch-line v" style={{ transform: `translate(-1px, ${-g - 9}px)` }} />
          <i className="ch-line v" style={{ transform: `translate(-1px, ${g}px)` }} />
        </>
      )}
      <i className="ch-dot" />
    </div>
  );
});

const HitMarker = memo(function HitMarker() {
  const now = useHud((s) => s.now);
  const hit = useHud((s) => s.hitTime);
  const head = useHud((s) => s.hitHead);
  const kill = useHud((s) => s.killTime);
  const show = now - hit < 0.2;
  const killed = now - kill < 0.35;
  if (!show && !killed) return null;
  return <div className={`hitmarker ${head ? 'head' : ''} ${killed ? 'kill' : ''}`} />;
});

const DamageIndicator = memo(function DamageIndicator() {
  const now = useHud((s) => s.now);
  const t = useHud((s) => s.damageTime);
  const a = useHud((s) => s.damageAngle);
  const age = now - t;
  if (age > 1.1) return null;
  const op = Math.max(0, 1 - age / 1.1);
  return (
    <>
      <div className="damage-vignette" style={{ opacity: op * 0.55 }} />
      {a < 100 && <div className="damage-arc" style={{ transform: `translate(-50%, -50%) rotate(${(-a * 180) / Math.PI}deg)`, opacity: op }} />}
    </>
  );
});

const Vitals = memo(function Vitals() {
  const hp = useHud((s) => s.hp);
  const armor = useHud((s) => s.armor);
  const helmet = useHud((s) => s.helmet);
  const kit = useHud((s) => s.kit);
  const bomb = useHud((s) => s.hasBomb);
  return (
    <div className="vitals">
      <div className={`vital hp ${hp <= 25 ? 'low' : ''}`}>
        <span className="icon">✚</span>
        <span className="val">{hp}</span>
        <div className="bar">
          <div style={{ width: `${hp}%` }} />
        </div>
      </div>
      <div className="vital armor">
        <span className="icon">{helmet ? '⛑' : '◈'}</span>
        <span className="val">{armor}</span>
        <div className="bar">
          <div style={{ width: `${armor}%` }} />
        </div>
      </div>
      <div className="extras">
        {kit && <span className="tag kit">拆弹器</span>}
        {bomb && <span className="tag bomb">C4</span>}
      </div>
    </div>
  );
});

const Ammo = memo(function Ammo() {
  const name = useHud((s) => s.weaponName);
  const ammo = useHud((s) => s.ammo);
  const reserve = useHud((s) => s.reserve);
  const mag = useHud((s) => s.magSize);
  const reloading = useHud((s) => s.reloading);
  const progress = useHud((s) => s.reloadProgress);
  const melee = useHud((s) => s.isMelee);
  const slotKey = useHud((s) => s.slotKey);
  const active = useHud((s) => s.activeSlot);
  const slots = slotKey.split('|');
  const labels = ['primary', 'secondary', 'melee'];
  const low = !melee && ammo <= Math.ceil(mag * 0.2);
  return (
    <div className="ammo-panel">
      <div className="slots">
        {slots.map((n, i) =>
          n ? (
            <div key={i} className={`slot ${labels[i] === active ? 'active' : ''}`}>
              <span className="key">{i + 1}</span>
              {n}
            </div>
          ) : null,
        )}
      </div>
      <div className="weapon-name">{name}</div>
      {!melee && (
        <div className={`ammo ${low ? 'low' : ''}`}>
          <span className="mag">{ammo}</span>
          <span className="sep">/</span>
          <span className="reserve">{reserve}</span>
        </div>
      )}
      {!melee && (
        <div className="bullets">
          {Array.from({ length: Math.min(mag, 30) }, (_, i) => (
            <i key={i} className={i < Math.round((ammo / mag) * Math.min(mag, 30)) ? 'on' : ''} />
          ))}
        </div>
      )}
      {reloading && (
        <div className="reload">
          换弹中
          <div className="bar">
            <div style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
      )}
    </div>
  );
});

const Killfeed = memo(function Killfeed() {
  const feed = useHud((s) => s.killfeed);
  return (
    <div className="killfeed">
      {feed.map((k) => (
        <div key={k.id} className={`kill ${k.mine ? 'mine' : ''}`}>
          {k.killer && <span style={{ color: teamColor(k.killerTeam) }}>{k.killer}</span>}
          <span className="weapon">{k.weapon}</span>
          {k.headshot && <span className="hs" title="爆头">◎</span>}
          <span style={{ color: teamColor(k.victimTeam) }}>{k.victim}</span>
        </div>
      ))}
    </div>
  );
});

const CenterMessage = memo(function CenterMessage() {
  const now = useHud((s) => s.now);
  const text = useHud((s) => s.centerMsg);
  const sub = useHud((s) => s.centerSub);
  const color = useHud((s) => s.centerColor);
  const t = useHud((s) => s.centerTime);
  const age = now - t;
  if (!text || age > 3.5 || age < 0) return null;
  return (
    <div className="center-msg" style={{ opacity: Math.min(1, (3.5 - age) * 2) }}>
      <div className="main" style={{ color }}>
        {text}
      </div>
      {sub && <div className="sub">{sub}</div>}
    </div>
  );
});

const Progress = memo(function Progress() {
  const label = useHud((s) => s.progressLabel);
  const p = useHud((s) => s.progress);
  if (!label) return null;
  return (
    <div className="progress">
      <div className="label">{label}</div>
      <div className="bar">
        <div style={{ width: `${p * 100}%` }} />
      </div>
    </div>
  );
});

const Hint = memo(function Hint() {
  const hint = useHud((s) => s.hint);
  const spectating = useHud((s) => s.spectating);
  const specTeam = useHud((s) => s.spectateTeam);
  return (
    <div className="hint-wrap">
      {spectating && (
        <div className="spectate">
          观察中：<b style={{ color: teamColor(specTeam) }}>{spectating}</b>
        </div>
      )}
      {hint && <div className="hint">{hint}</div>}
    </div>
  );
});

const ScopeOverlay = memo(function ScopeOverlay() {
  const scoped = useHud((s) => s.scoped);
  if (!scoped) return null;
  return (
    <div className="scope">
      <div className="scope-ring" />
      <i className="scope-h" />
      <i className="scope-v" />
    </div>
  );
});

const BuyMenu = memo(function BuyMenu() {
  const open = useHud((s) => s.buyOpen);
  const allowed = useHud((s) => s.buyAllowed);
  const reason = useHud((s) => s.buyReason);
  const team = useHud((s) => s.playerTeam);
  if (!open) return null;
  const items: [string, string, string][] = [
    ['1', team === 'T' ? 'AK-47' : 'M4A4', team === 'T' ? '高伤害 · 后坐力大' : '射速高 · 后坐力低'],
    ['2', 'AWP', '单发致命 · 右键开镜'],
    ['3', 'Desert Eagle', '副武器 · 7 发弹匣'],
    ['4', team === 'T' ? 'Glock-18' : 'USP-S', '默认手枪'],
    ['5', '护甲 + 头盔', '100 护甲'],
    ['6', '拆弹器', team === 'CT' ? '拆弹 5 秒' : '仅限 CT'],
  ];
  return (
    <div className="buy-menu">
      <h3>购买菜单</h3>
      {!allowed && <div className="buy-locked">{reason}</div>}
      {items.map(([k, n, d]) => (
        <div key={k} className={`buy-item ${allowed ? '' : 'disabled'}`}>
          <kbd>{k}</kbd>
          <span className="n">{n}</span>
          <span className="d">{d}</span>
        </div>
      ))}
      <div className="muted small">按 B 关闭</div>
    </div>
  );
});

const Scoreboard = memo(function Scoreboard() {
  const open = useHud((s) => s.scoreboardOpen);
  const rows = useHud((s) => s.scoreboard);
  const scoreT = useHud((s) => s.scoreT);
  const scoreCT = useHud((s) => s.scoreCT);
  if (!open) return null;
  const team = (t: 'CT' | 'T', score: number) => (
    <div className={`sb-team ${t.toLowerCase()}`}>
      <div className="sb-head">
        <span>{TEAM_LABEL[t]}</span>
        <span className="sb-score">{score}</span>
      </div>
      <div className="sb-row sb-cols">
        <span>名称</span>
        <span>击杀</span>
        <span>死亡</span>
        <span>爆头</span>
      </div>
      {rows
        .filter((r) => r.team === t)
        .sort((a, b) => b.kills - a.kills)
        .map((r) => (
          <div key={r.name} className={`sb-row ${r.alive ? '' : 'dead'} ${r.isPlayer ? 'me' : ''}`}>
            <span>
              {r.name}
              {r.bomb ? ' 💣' : ''}
            </span>
            <span>{r.kills}</span>
            <span>{r.deaths}</span>
            <span>{r.hs}</span>
          </div>
        ))}
    </div>
  );
  return (
    <div className="scoreboard">
      {team('CT', scoreCT)}
      {team('T', scoreT)}
    </div>
  );
});

const MatchOver = memo(function MatchOver() {
  const winner = useHud((s) => s.matchWinner);
  const scoreT = useHud((s) => s.scoreT);
  const scoreCT = useHud((s) => s.scoreCT);
  const team = useHud((s) => s.playerTeam);
  const game = useGame();
  if (!winner) return null;
  return (
    <div className="match-over">
      <div className="mo-title" style={{ color: teamColor(winner) }}>
        {winner === team ? '胜利' : '失败'} · {TEAM_LABEL[winner]} 赢得比赛
      </div>
      <div className="mo-score">
        <span style={{ color: 'var(--ct)' }}>{scoreCT}</span> : <span style={{ color: 'var(--t)' }}>{scoreT}</span>
      </div>
      <button
        className="btn primary"
        onClick={() => {
          game.restartMatch();
          game.requestLock();
        }}
      >
        再来一局
      </button>
    </div>
  );
});

const Callout = memo(function Callout() {
  const c = useHud((s) => s.callout);
  const fps = useHud((s) => s.fps);
  return (
    <div className="callout">
      {c}
      <span className="fps">{fps} FPS</span>
    </div>
  );
});

export function Hud() {
  const started = useHud((s) => s.started);
  const spectating = useHud((s) => s.spectating);
  if (!started) return null;
  return (
    <div className="hud">
      <ScopeOverlay />
      <DamageIndicator />
      <div className="radar">
        <Minimap />
        <Callout />
      </div>
      <TopBar />
      <Killfeed />
      <Crosshair />
      <HitMarker />
      <CenterMessage />
      <Progress />
      <Hint />
      <Vitals key={spectating ? 'spec' : 'self'} />
      <Ammo />
      <BuyMenu />
      <Scoreboard />
      <MatchOver />
    </div>
  );
}
