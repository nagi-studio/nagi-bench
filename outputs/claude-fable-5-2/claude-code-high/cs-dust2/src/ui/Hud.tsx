// 2D overlay. Every component subscribes to just the slice of HUD state it needs; per-frame
// visuals (crosshair spread, hit marker, minimap, damage flash) are driven by the engine through
// DOM refs registered in `hudRefs`.

import { memo, useCallback } from 'react';
import { BUY_PRIMARY, BUY_SECONDARY } from '../game/Game';
import type { Team } from '../sim/actor';
import { WEAPONS } from '../sim/weapons';
import { ScoreRow, hudRefs, useHud } from '../state/store';

const TEAM_NAME: Record<Team, string> = { atk: '攻方', def: '守方' };

function fmtTime(s: number): string {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r < 10 ? '0' : ''}${r}`;
}

// ------------------------------------------------------------------ top bar
const Pips = memo(function Pips({ n, team }: { n: number; team: Team }) {
  return (
    <div className={`pips ${team}`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className={i < n ? 'on' : ''} />
      ))}
    </div>
  );
});

function TopBar() {
  const scoreAtk = useHud((s) => s.scoreAtk);
  const scoreDef = useHud((s) => s.scoreDef);
  const aliveAtk = useHud((s) => s.aliveAtk);
  const aliveDef = useHud((s) => s.aliveDef);
  const timer = useHud((s) => s.timer);
  const phase = useHud((s) => s.phase);
  const planted = useHud((s) => s.bombPlanted);
  const roundNum = useHud((s) => s.roundNum);
  const pistol = useHud((s) => s.pistol);
  const team = useHud((s) => s.team);
  return (
    <div className="topbar">
      <div className={`side def ${team === 'def' ? 'mine' : ''}`}>
        <div className="label">守方{team === 'def' ? ' · 我方' : ''}</div>
        <Pips n={aliveDef} team="def" />
        <div className="score">{scoreDef}</div>
      </div>
      <div className="clock">
        <div className={`time ${planted ? 'bomb' : ''} ${phase === 'freeze' ? 'freeze' : ''}`}>
          {planted ? <span className="c4-icon">C4</span> : null}
          {phase === 'over' || phase === 'matchover' ? '--:--' : fmtTime(timer)}
        </div>
        <div className="round">
          第 {roundNum} 回合 · {pistol ? '手枪局' : '步枪局'}
          {phase === 'freeze' ? ' · 准备' : ''}
        </div>
      </div>
      <div className={`side atk ${team === 'atk' ? 'mine' : ''}`}>
        <div className="score">{scoreAtk}</div>
        <Pips n={aliveAtk} team="atk" />
        <div className="label">攻方{team === 'atk' ? ' · 我方' : ''}</div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ kill feed (top right)
function Killfeed() {
  const feed = useHud((s) => s.killfeed);
  return (
    <div className="killfeed">
      {feed.map((k) => (
        <div key={k.id} className={`kill ${k.mine ? 'mine' : ''}`}>
          {k.killer ? <span className={`name ${k.killerTeam ?? ''}`}>{k.killer}</span> : null}
          <span className="weapon">{k.weapon}</span>
          {k.headshot ? <span className="hs">爆头</span> : null}
          <span className={`name ${k.victimTeam}`}>{k.victim}</span>
        </div>
      ))}
    </div>
  );
}

// ------------------------------------------------------------------ minimap (top left)
function Minimap() {
  const zone = useHud((s) => s.zone);
  const attackSite = useHud((s) => s.attackSite);
  const setRef = useCallback((el: HTMLCanvasElement | null) => {
    hudRefs.minimap = el;
  }, []);
  return (
    <div className="minimap">
      <canvas ref={setRef} />
      <div className="minimap-foot">
        <span className="zone">{zone || '—'}</span>
        {attackSite ? <span className="plan">队伍目标：{attackSite} 点</span> : null}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ vitals (bottom left)
function Vitals() {
  const hp = useHud((s) => s.hp);
  const armor = useHud((s) => s.armor);
  const helmet = useHud((s) => s.helmet);
  const hasBomb = useHud((s) => s.hasBomb);
  const hasKit = useHud((s) => s.hasKit);
  return (
    <div className="vitals panel">
      <div className={`stat hp ${hp <= 30 ? 'low' : ''}`}>
        <svg viewBox="0 0 24 24" className="icon">
          <path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7z" fill="currentColor" />
        </svg>
        <div className="value">{hp}</div>
        <div className="bar">
          <i style={{ width: `${hp}%` }} />
        </div>
      </div>
      <div className="stat armor">
        <svg viewBox="0 0 24 24" className="icon">
          <path d="M12 2l8 3v6c0 5.2-3.4 9.4-8 11-4.6-1.600-8-5.800-8-11V5z" fill="currentColor" />
        </svg>
        <div className="value">{armor}</div>
        <div className="bar">
          <i style={{ width: `${armor}%` }} />
        </div>
        {helmet ? <span className="tag">头盔</span> : null}
      </div>
      {hasBomb || hasKit ? (
        <div className="gear">
          {hasBomb ? <span className="tag c4">C4 炸弹</span> : null}
          {hasKit ? <span className="tag kit">拆弹钳</span> : null}
        </div>
      ) : null}
    </div>
  );
}

// ------------------------------------------------------------------ ammo & weapon slots (bottom right)
function Ammo() {
  const name = useHud((s) => s.weaponName);
  const ammo = useHud((s) => s.ammo);
  const reserve = useHud((s) => s.reserve);
  const magSize = useHud((s) => s.magSize);
  const reloading = useHud((s) => s.reloading);
  const melee = useHud((s) => s.melee);
  const slots = useHud((s) => s.slots);
  const low = !melee && magSize > 0 && ammo <= Math.ceil(magSize * 0.25);
  return (
    <div className="ammo-wrap">
      <div className="slots">
        {slots.map((s) => (
          <div key={s.slot} className={`slot ${s.active ? 'active' : ''}`}>
            <span className="key">{s.key}</span>
            {s.name}
          </div>
        ))}
      </div>
      <div className="ammo panel">
        <div className="weapon-name">{name}</div>
        {melee ? (
          <div className="count melee">近战</div>
        ) : (
          <div className={`count ${low ? 'low' : ''}`}>
            <span className="mag">{ammo}</span>
            <span className="sep">/</span>
            <span className="reserve">{reserve}</span>
          </div>
        )}
        {reloading ? <div className="reloading">换弹中…</div> : low && !melee && ammo === 0 ? <div className="reloading">弹匣已空 · R 换弹</div> : null}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ centre: crosshair, hit marker, scope
function Crosshair() {
  const setCh = useCallback((el: HTMLDivElement | null) => {
    hudRefs.crosshair = el;
  }, []);
  const setHm = useCallback((el: HTMLDivElement | null) => {
    hudRefs.hitmarker = el;
  }, []);
  return (
    <>
      <div className="crosshair" ref={setCh}>
        <i className="l" />
        <i className="r" />
        <i className="u" />
        <i className="d" />
        <b />
      </div>
      <div className="hitmarker" ref={setHm} style={{ opacity: 0 }}>
        <i />
        <i />
      </div>
    </>
  );
}

function Scope() {
  const zoom = useHud((s) => s.zoom);
  if (zoom <= 0) return null;
  return (
    <div className={`scope z${zoom}`}>
      <div className="scope-mask" />
      <div className="scope-line h" />
      <div className="scope-line v" />
      <div className="scope-thick left" />
      <div className="scope-thick right" />
      <div className="scope-thick bottom" />
      <div className="scope-ring" />
      <div className="scope-zoom">{zoom === 1 ? '2.5×' : '7×'}</div>
    </div>
  );
}

function Feedback() {
  const setV = useCallback((el: HTMLDivElement | null) => {
    hudRefs.vignette = el;
  }, []);
  const setA = useCallback((el: HTMLDivElement | null) => {
    hudRefs.dmgArrow = el;
  }, []);
  const setF = useCallback((el: HTMLDivElement | null) => {
    hudRefs.flash = el;
  }, []);
  return (
    <>
      <div className="vignette" ref={setV} style={{ opacity: 0 }} />
      <div className="dmg-arrow" ref={setA} style={{ opacity: 0 }}>
        <i />
      </div>
      <div className="flash" ref={setF} style={{ opacity: 0 }} />
    </>
  );
}

// ------------------------------------------------------------------ hints, progress, banners
function Prompt() {
  const hint = useHud((s) => s.hint);
  const progress = useHud((s) => s.progress);
  const label = useHud((s) => s.progressLabel);
  const spectating = useHud((s) => s.spectating);
  return (
    <div className="prompt">
      {spectating ? (
        <div className="spectate">
          正在观战 <b>{spectating}</b>
        </div>
      ) : null}
      {progress >= 0 ? (
        <div className="progress">
          <div className="progress-label">{label}</div>
          <div className="progress-bar">
            <i style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
      ) : hint ? (
        <div className="hint">{hint}</div>
      ) : null}
    </div>
  );
}

function Banner() {
  const banner = useHud((s) => s.banner);
  const notice = useHud((s) => s.notice);
  return (
    <>
      {notice ? <div className="notice">{notice}</div> : null}
      {banner ? (
        <div className={`banner ${banner.tone}`}>
          <div className="banner-title">{banner.title}</div>
          <div className="banner-sub">{banner.sub}</div>
        </div>
      ) : null}
    </>
  );
}

// ------------------------------------------------------------------ scoreboard (Tab)
function TeamTable({ rows, team, score }: { rows: ScoreRow[]; team: Team; score: number }) {
  return (
    <div className={`team-table ${team}`}>
      <div className="team-head">
        <span>{TEAM_NAME[team]}</span>
        <span className="team-score">{score}</span>
      </div>
      <div className="row head">
        <span>玩家</span>
        <span>击杀</span>
        <span>死亡</span>
      </div>
      {rows
        .filter((r) => r.team === team)
        .sort((a, b) => b.kills - a.kills)
        .map((r) => (
          <div key={r.id} className={`row ${r.alive ? '' : 'dead'} ${r.you ? 'you' : ''}`}>
            <span>
              {r.name}
              {r.bomb ? <em className="c4">C4</em> : null}
              {r.alive ? null : <em className="dead-tag">阵亡</em>}
            </span>
            <span>{r.kills}</span>
            <span>{r.deaths}</span>
          </div>
        ))}
    </div>
  );
}

export function ScoreTables() {
  const rows = useHud((s) => s.scores);
  const scoreAtk = useHud((s) => s.scoreAtk);
  const scoreDef = useHud((s) => s.scoreDef);
  return (
    <div className="score-tables">
      <TeamTable rows={rows} team="def" score={scoreDef} />
      <TeamTable rows={rows} team="atk" score={scoreAtk} />
    </div>
  );
}

function Scoreboard() {
  const show = useHud((s) => s.showScores);
  if (!show) return null;
  return (
    <div className="scoreboard">
      <div className="scoreboard-title">潮汐货场 · 计分板</div>
      <ScoreTables />
    </div>
  );
}

// ------------------------------------------------------------------ loadout picker (B during freeze time)
function BuyPanel() {
  const open = useHud((s) => s.buyOpen);
  const primary = useHud((s) => s.loadoutPrimary);
  const secondary = useHud((s) => s.loadoutSecondary);
  if (!open) return null;
  return (
    <div className="buy panel">
      <div className="buy-title">装备选择（准备时间内有效）</div>
      <div className="buy-group">主武器</div>
      {BUY_PRIMARY.map((id, i) => (
        <div key={id} className={`buy-item ${primary === id ? 'sel' : ''}`}>
          <span className="key">{i + 1}</span>
          <span className="buy-name">{WEAPONS[id].name}</span>
          <span className="buy-desc">
            伤害 {WEAPONS[id].damage} · 射速 {WEAPONS[id].rpm} · 弹匣 {WEAPONS[id].magSize}
          </span>
        </div>
      ))}
      <div className="buy-group">副武器</div>
      {BUY_SECONDARY.map((id, i) => (
        <div key={id} className={`buy-item ${secondary === id ? 'sel' : ''}`}>
          <span className="key">{i + 4}</span>
          <span className="buy-name">{WEAPONS[id].name}</span>
          <span className="buy-desc">
            伤害 {WEAPONS[id].damage} · 射速 {WEAPONS[id].rpm} · 弹匣 {WEAPONS[id].magSize}
          </span>
        </div>
      ))}
      <div className="buy-foot">按 B 关闭</div>
    </div>
  );
}

function Fps() {
  const fps = useHud((s) => s.fps);
  return <div className="fps">{fps} FPS</div>;
}

export function Hud() {
  return (
    <div className="hud">
      <Feedback />
      <Scope />
      <Crosshair />
      <TopBar />
      <Minimap />
      <Killfeed />
      <Vitals />
      <Ammo />
      <Prompt />
      <Banner />
      <BuyPanel />
      <Scoreboard />
      <Fps />
    </div>
  );
}
