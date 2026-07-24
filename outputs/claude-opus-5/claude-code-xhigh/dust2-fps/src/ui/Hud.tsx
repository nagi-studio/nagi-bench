/**
 * 2D HUD 覆盖层：准星 / 生命护甲 / 弹药 / 回合计时 / 击杀播报 / 下包拆包进度 / 开镜遮罩。
 * 大部分数据来自 20Hz 快照；准星和开镜遮罩需要跟手，所以单独开 rAF 直接读引擎。
 */

import { useEffect, useRef } from 'react';
import type { GameEngine, HudSnapshot } from '../game/engine.ts';
import { activeWeaponDef } from '../game/actor.ts';
import { currentInaccuracy } from '../game/combat.ts';
import { WEAPONS } from '../game/weapons.ts';
import { siteAt } from '../game/bomb.ts';
import { DEG, clamp } from '../core/math.ts';

interface Props {
  engine: GameEngine;
  snap: HudSnapshot;
  fov: number;
}

export function Hud({ engine, snap, fov }: Props) {
  return (
    <div className="hud">
      <Crosshair engine={engine} fov={fov} />
      <ScopeOverlay engine={engine} />
      <TopBar snap={snap} />
      <Killfeed snap={snap} engine={engine} />
      <BottomLeft snap={snap} />
      <BottomRight snap={snap} />
      <CenterMessages snap={snap} engine={engine} />
      <DamageVignette engine={engine} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Crosshair({ engine, fov }: { engine: GameEngine; fov: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const el = ref.current;
      const a = engine.viewActor;
      if (!el || !a) return;
      const def = activeWeaponDef(a);
      if (a.scoped && def.scope) {
        el.style.opacity = '0';
        return;
      }
      el.style.opacity = '1';
      // 把弧度换算成屏幕像素：tan(散布) / tan(半视角) * 半屏高
      const inacc = currentInaccuracy(a, def);
      const px = (Math.tan(inacc) / Math.tan((fov * DEG) / 2)) * (window.innerHeight / 2);
      const gap = clamp(4 + px * 0.85, 3, 120);
      el.style.setProperty('--gap', `${gap.toFixed(1)}px`);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [engine, fov]);

  return (
    <div className="crosshair" ref={ref}>
      <i className="ch-dot" />
      <i className="ch-l" />
      <i className="ch-r" />
      <i className="ch-t" />
      <i className="ch-b" />
    </div>
  );
}

/** AWP 开镜的 2D 镜面遮罩 */
function ScopeOverlay({ engine }: { engine: GameEngine }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const el = ref.current;
      const a = engine.viewActor;
      if (!el || !a) return;
      const on = a.scoped && !!activeWeaponDef(a).scope;
      el.style.opacity = on ? '1' : '0';
      el.style.pointerEvents = 'none';
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [engine]);

  return (
    <div className="scope" ref={ref}>
      <div className="scope-mask" />
      <div className="scope-lens">
        <i className="scope-h" />
        <i className="scope-v" />
        <i className="scope-ring" />
        {[...Array(9)].map((_, i) => (
          <i
            key={`t${i}`}
            className="scope-tick"
            style={{ top: `calc(50% + ${(i - 4) * 26}px)` }}
          />
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function fmtTime(t: number): string {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function TopBar({ snap }: { snap: HudSnapshot }) {
  const bombLive = snap.bomb.phase === 'planted';
  const timer = bombLive ? snap.bomb.timer : snap.phaseTimer;
  return (
    <div className="topbar">
      <div className={`team-block t ${snap.playerTeam === 'T' ? 'mine' : ''}`}>
        <span className="team-name">T</span>
        <span className="team-score">{snap.scoreT}</span>
        <span className="team-alive">{'●'.repeat(snap.aliveT)}</span>
      </div>
      <div className="round-block">
        <div className={`round-timer ${bombLive ? 'bomb' : ''} ${timer < 10 && !bombLive ? 'low' : ''}`}>
          {bombLive ? timer.toFixed(1) : fmtTime(timer)}
        </div>
        <div className="round-label">
          {snap.phase === 'freeze'
            ? '准备阶段'
            : snap.phase === 'over'
              ? '回合结束'
              : bombLive
                ? `C4 已安放 · ${snap.bomb.site} 点`
                : `第 ${snap.roundNumber} 回合`}
        </div>
      </div>
      <div className={`team-block ct ${snap.playerTeam === 'CT' ? 'mine' : ''}`}>
        <span className="team-alive">{'●'.repeat(snap.aliveCT)}</span>
        <span className="team-score">{snap.scoreCT}</span>
        <span className="team-name">CT</span>
      </div>
    </div>
  );
}

function Killfeed({ snap, engine }: { snap: HudSnapshot; engine: GameEngine }) {
  const now = engine.time;
  const items = snap.killfeed.filter((k) => now - k.time < 7);
  return (
    <div className="killfeed">
      {items.map((k) => (
        <div key={k.id} className="kf-row">
          <span className={`kf-name ${k.attackerTeam === 'T' ? 't' : 'ct'}`}>{k.attacker}</span>
          <span className="kf-weapon">
            {k.headshot && <b className="kf-hs">HS</b>}
            {WEAPONS[k.weapon]?.name ?? k.weapon}
          </span>
          <span className={`kf-name ${k.victimTeam === 'T' ? 't' : 'ct'}`}>{k.victim}</span>
        </div>
      ))}
    </div>
  );
}

function BottomLeft({ snap }: { snap: HudSnapshot }) {
  const l = snap.local;
  if (!l) return null;
  return (
    <div className="bottom-left">
      <div className="vitals">
        <div className={`vital hp ${l.health <= 30 ? 'low' : ''}`}>
          <span className="vital-icon">✚</span>
          <span className="vital-value">{l.health}</span>
        </div>
        <div className="vital ar">
          <span className="vital-icon">{l.helmet ? '⛨' : '◈'}</span>
          <span className="vital-value">{l.armor}</span>
        </div>
      </div>
      <div className="hp-bar">
        <div className="hp-fill" style={{ width: `${clamp(l.health, 0, 100)}%` }} />
        <div className="ar-fill" style={{ width: `${clamp(l.armor, 0, 100)}%` }} />
      </div>
      <div className="money-row">
        <span className="money">${l.money}</span>
        {l.hasBomb && <span className="bomb-tag">C4</span>}
        <span className="location">{snap.location}</span>
      </div>
    </div>
  );
}

function BottomRight({ snap }: { snap: HudSnapshot }) {
  const w = snap.local?.weapon;
  if (!w) return null;
  const melee = w.slot === 'melee' || w.slot === 'bomb';
  return (
    <div className="bottom-right">
      <div className="weapon-name">{w.name}</div>
      {!melee ? (
        <div className={`ammo ${w.ammo === 0 ? 'empty' : w.ammo <= w.magSize * 0.25 ? 'low' : ''}`}>
          <span className="ammo-mag">{w.ammo}</span>
          <span className="ammo-sep">/</span>
          <span className="ammo-reserve">{w.reserve}</span>
        </div>
      ) : (
        <div className="ammo melee">—</div>
      )}
      {!melee && (
        <div className="mag-pips">
          {[...Array(Math.min(30, w.magSize))].map((_, i) => (
            <i
              key={i}
              className={i < Math.round((w.ammo / w.magSize) * Math.min(30, w.magSize)) ? 'on' : ''}
            />
          ))}
        </div>
      )}
      {w.reloading && (
        <div className="reload-bar">
          <div style={{ width: `${clamp(w.reloadPct * 100, 0, 100)}%` }} />
          <span>换弹中</span>
        </div>
      )}
    </div>
  );
}

function CenterMessages({ snap, engine }: { snap: HudSnapshot; engine: GameEngine }) {
  const l = snap.local;
  const planting = (l?.plantProgress ?? 0) > 0;
  const defusing = (l?.defuseProgress ?? 0) > 0;
  const canPlant =
    l?.hasBomb &&
    snap.phase === 'live' &&
    !!engine.viewActor &&
    inSite(engine);

  return (
    <div className="center-msgs">
      {snap.message && <div className="big-msg">{snap.message}</div>}
      {snap.phase === 'freeze' && (
        <div className="hint">按 B 购买装备 · {Math.ceil(snap.phaseTimer)} 秒后开始</div>
      )}
      {canPlant && !planting && <div className="hint action">按住 E 安放 C4</div>}
      {planting && (
        <div className="progress">
          <div className="progress-label">安放炸弹中…</div>
          <div className="progress-track">
            <div style={{ width: `${clamp((l!.plantProgress ?? 0) * 100, 0, 100)}%` }} />
          </div>
        </div>
      )}
      {defusing && (
        <div className="progress defuse">
          <div className="progress-label">拆除炸弹中…</div>
          <div className="progress-track">
            <div style={{ width: `${clamp((l!.defuseProgress ?? 0) * 100, 0, 100)}%` }} />
          </div>
        </div>
      )}
      {snap.spectating && (
        <div className="spectate">
          <div className="spec-title">你已阵亡</div>
          <div className="spec-sub">
            正在观战 <b>{snap.spectateName}</b> · 空格切换队友 · F 接管
          </div>
        </div>
      )}
    </div>
  );
}

function inSite(engine: GameEngine): boolean {
  const a = engine.viewActor;
  if (!a) return false;
  return siteAt(a.pos.x, a.pos.z) !== null;
}

/** 受伤时的红色边缘闪烁 */
function DamageVignette({ engine }: { engine: GameEngine }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const el = ref.current;
      const a = engine.viewActor;
      if (!el || !a) return;
      const lowHp = a.alive ? Math.max(0, 1 - a.health / 45) * 0.35 : 0;
      el.style.opacity = String(Math.min(0.85, a.flinch * 0.55 + lowHp));
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [engine]);
  return <div className="damage-vignette" ref={ref} />;
}
