// ============================================================================
// HUD —— 准星 / 血甲 / 弹药 / 计时 / 击杀播报 / 开镜遮罩 / 阵亡 / 记分板 / 购买
// ============================================================================
import { useEffect, useState, useSyncExternalStore } from 'react';
import type { Game } from '../game/engine';
import type { HudState } from '../game/types';
import { BUY_ITEMS } from '../game/config';

function useHud(game: Game): HudState {
  return useSyncExternalStore(game.store.subscribe, game.store.getSnapshot);
}

export function Hud({ game }: { game: Game }) {
  const s = useHud(game);
  const playing = s.phase !== 'menu' && s.phase !== 'matchover';
  if (!playing) return null;
  return (
    <div className="hud">
      <Crosshair s={s} />
      <ScopeOverlay s={s} />
      <DamageFlash s={s} />
      <Hitmarker s={s} />
      <TopBar s={s} />
      <HealthArmor s={s} />
      <AmmoPanel s={s} />
      <Killfeed s={s} />
      <Banner s={s} />
      <DeathOverlay s={s} />
      <BombStatus s={s} />
      <Scoreboard s={s} />
      <BuyMenu s={s} game={game} />
      <LockHint s={s} game={game} />
      <PlantDefuseBar s={s} />
    </div>
  );
}

function Crosshair({ s }: { s: HudState }) {
  const { self } = s;
  const hide = !self.alive || self.zoomed || (self.weaponName === 'AWP' && !self.zoomed) || s.buyOpen;
  if (hide) return null;
  const gap = Math.max(3, Math.min(60, self.crosshairGap)) / 2;
  const line = (style: React.CSSProperties, key: string) => <div key={key} className="ch-line" style={style} />;
  const c = 'var(--ch)';
  return (
    <div className="crosshair">
      {line({ left: `calc(50% - ${gap + 7}px)`, top: '50%', width: 7, height: 2, background: c }, 'l1')}
      {line({ left: `calc(50% + ${gap}px)`, top: '50%', width: 7, height: 2, background: c }, 'l2')}
      {line({ top: `calc(50% - ${gap + 7}px)`, left: '50%', width: 2, height: 7, background: c }, 'l3')}
      {line({ top: `calc(50% + ${gap}px)`, left: '50%', width: 2, height: 7, background: c }, 'l4')}
      <div className="ch-dot" />
    </div>
  );
}

function ScopeOverlay({ s }: { s: HudState }) {
  if (!s.self.zoomed || !s.self.alive) return null;
  return (
    <div className="scope-overlay">
      <div className="scope-cross-h" />
      <div className="scope-cross-v" />
      <div className="scope-ring" />
      <div className="scope-zoom-label">×{s.self.zoomLevel === 2 ? '8' : '4'}</div>
    </div>
  );
}

function DamageFlash({ s }: { s: HudState }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (s.damageFlash > 0) setT(s.damageFlash);
  }, [s.damageFlash]);
  if (!t) return null;
  return <FlashInner t={t} />;
}
function FlashInner({ t }: { t: number }) {
  const [op, setOp] = useState(1);
  useEffect(() => {
    setOp(1);
    const id = setTimeout(() => setOp(0), 90);
    return () => clearTimeout(id);
  }, [t]);
  return <div className="damage-flash" style={{ opacity: op * 0.75 }} />;
}

function Hitmarker({ s }: { s: HudState }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (s.hitmarker > 0) setT(s.hitmarker);
  }, [s.hitmarker]);
  if (!t) return null;
  return <HitInner t={t} />;
}
function HitInner({ t }: { t: number }) {
  const [op, setOp] = useState(1);
  useEffect(() => {
    setOp(1);
    const id = setTimeout(() => setOp(0), 140);
    return () => clearTimeout(id);
  }, [t]);
  return (
    <div className="hitmarker" style={{ opacity: op }}>
      <span /><span /><span /><span />
    </div>
  );
}

function fmtTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function TopBar({ s }: { s: HudState }) {
  const bombTick = s.bombState === 'planted';
  return (
    <div className="top-bar">
      <div className="scores">
        <span className={s.scores.t >= s.scores.ct ? 'win' : ''}>T {s.scores.t}</span>
        <span className="sep">:</span>
        <span className={s.scores.ct >= s.scores.t ? 'win' : ''}>{s.scores.ct} CT</span>
      </div>
      <div className={`round-timer ${bombTick ? 'danger' : ''}`}>
        {s.phase === 'freeze' && <span className="freeze-label">冻结 {Math.max(0, Math.ceil(s.phaseTimeLeft))}s</span>}
        {s.phase === 'live' && s.bombState !== 'planted' && fmtTime(s.roundTimeLeft)}
        {s.bombState === 'planted' && `💣 ${s.bombTimer.toFixed(1)}`}
        {s.phase === 'ended' && '回合结束'}
      </div>
      <div className="round-num">
        {s.pistolRound ? '手枪局' : `第 ${s.round} 回合`}
      </div>
    </div>
  );
}

function HealthArmor({ s }: { s: HudState }) {
  const { self } = s;
  const hpPct = Math.max(0, Math.min(100, self.hp));
  const apPct = Math.max(0, Math.min(100, self.armor));
  return (
    <div className="hp-armor">
      <div className="hp-row">
        <div className="bar"><div className={`fill hp ${hpPct < 30 ? 'low' : ''}`} style={{ width: `${hpPct}%` }} /></div>
        <span className="num">{self.hp}</span>
        <span className="icon">❤</span>
      </div>
      <div className="hp-row">
        <div className="bar"><div className="fill armor" style={{ width: `${apPct}%` }} /></div>
        <span className="num">{self.armor}</span>
        <span className="icon">🛡</span>
      </div>
      <div className="money">$ {self.money}</div>
    </div>
  );
}

function AmmoPanel({ s }: { s: HudState }) {
  const { self } = s;
  const slots = [
    { n: 1, label: '主武器', on: !!self.hasPrimary, cur: self.slot === 1 },
    { n: 2, label: '副武器', on: true, cur: self.slot === 2 },
    { n: 3, label: '近战', on: true, cur: self.slot === 3 },
    { n: 5, label: 'C4', on: self.hasBomb, cur: self.slot === 5 },
  ];
  return (
    <div className="ammo-panel">
      <div className="slots">
        {slots.map((sl) => (
          <div key={sl.n} className={`slot ${sl.cur ? 'cur' : ''} ${sl.on ? '' : 'off'}`}>{sl.n}</div>
        ))}
      </div>
      {self.slot !== 3 && self.slot !== 5 ? (
        <div className="ammo-nums">
          <span className="mag">{self.mag}</span>
          <span className="res">/ {self.reserve}</span>
          {self.reloading && <span className="reloading">换弹中…</span>}
        </div>
      ) : self.slot === 5 ? (
        <div className="ammo-nums"><span className="mag c4">C4</span></div>
      ) : (
        <div className="ammo-nums"><span className="mag knife">🔪</span></div>
      )}
      <div className="weapon-name">{self.weaponName}</div>
    </div>
  );
}

function Killfeed({ s }: { s: HudState }) {
  return (
    <div className="killfeed">
      {s.killfeed.map((k) => (
        <div key={k.id} className="kf-entry">
          <span className="killer">{k.killer || 'C4'}</span>
          <span className="weapon">{k.hs ? '⌖' : ''}{k.weapon}</span>
          <span className="victim">{k.victim}</span>
        </div>
      ))}
    </div>
  );
}

function Banner({ s }: { s: HudState }) {
  if (!s.banner) return null;
  return (
    <div className="banner">
      <div className="banner-text">{s.banner.text}</div>
      <div className="banner-sub">{s.banner.sub}</div>
    </div>
  );
}

function BombStatus({ s }: { s: HudState }) {
  if (s.bombState !== 'carried' && s.bombState !== 'dropped') return null;
  const me = s.bombCarrierTeam;
  return (
    <div className="bomb-status">
      {s.bombState === 'carried' && (
        <span>💣 {me === s.self.team ? (s.self.hasBomb ? '你携带 C4 —— 按 5 切出、在 A/B 点按住开火下包' : '队友携带 C4') : 'T 携带 C4'}</span>
      )}
      {s.bombState === 'dropped' && <span className="warn">💣 C4 掉落！{s.self.team === 'T' ? 'T 走到炸弹旁自动拾取' : '守住炸弹'}</span>}
    </div>
  );
}

function DeathOverlay({ s }: { s: HudState }) {
  if (s.self.alive || s.phase !== 'live') return null;
  const t = s.spectating;
  return (
    <div className="death-overlay">
      <div className="death-title">你阵亡了</div>
      {t ? (
        <div className="death-info">
          观战：<b>{t.name}</b>（{t.team === 'T' ? 'T' : 'CT'} · {t.hp} HP）
          <div className="death-hint">点击 / 空格 切换队友 · E 接管该队友操控</div>
        </div>
      ) : (
        <div className="death-info">等待回合结束…</div>
      )}
    </div>
  );
}

function Scoreboard({ s }: { s: HudState }) {
  if (!s.scoreboard) return null;
  const sorted = [...s.players].sort((a, b) => (a.team === b.team ? 0 : a.team === 'T' ? -1 : 1));
  return (
    <div className="scoreboard">
      <div className="sb-title">记分板 · 先到 {8} 回合胜</div>
      <div className="sb-table">
        {sorted.map((p, i) => (
          <div key={i} className={`sb-row ${p.team === 'T' ? 't' : 'ct'} ${p.isSelf ? 'self' : ''}`}>
            <span className="sb-name">{p.name}{p.isSelf ? ' (你)' : ''}</span>
            <span className="sb-team">{p.team}</span>
            <span className="sb-state">{p.alive ? '存活' : '阵亡'}</span>
            <span className="sb-bomb">{p.isCarrier ? '💣' : ''}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BuyMenu({ s, game }: { s: HudState; game: Game }) {
  if (!s.buyOpen) return null;
  const g = game;
  const team = s.self.team;
  const items = BUY_ITEMS.filter((i) =>
    i.kind === 'armor' || i.weapon === 'awp' || i.weapon === 'deagle' ||
    (team === 'T' && (i.weapon === 'ak47' || i.weapon === 'glock')) ||
    (team === 'CT' && (i.weapon === 'm4a4' || i.weapon === 'usp')),
  );
  return (
    <div className="buy-menu">
      <div className="buy-title">购买装备 · 冻结时间 <span className="money-big">${s.self.money}</span></div>
      <div className="buy-grid">
        {items.map((i) => (
          <button key={i.id} className="buy-item" disabled={s.self.money < i.price} onClick={() => g.buyItem(i.id)}>
            <span className="buy-name">{i.label}</span>
            <span className="buy-price">${i.price}</span>
          </button>
        ))}
      </div>
      <div className="buy-hint">按 B 或 Esc 关闭（关闭后重新锁定鼠标）</div>
    </div>
  );
}

function LockHint({ s, game }: { s: HudState; game: Game }) {
  if (!s.lockHint) return null;
  const g = game;
  return (
    <div className="lock-hint" onClick={() => g.lockPointer()}>
      <div className="lock-title">点击继续游戏</div>
      <div className="lock-sub">鼠标指针已释放（Esc），点击此处重新锁定</div>
    </div>
  );
}

function PlantDefuseBar({ s }: { s: HudState }) {
  if (s.planting <= 0 && s.defusing <= 0) return null;
  const v = s.planting > 0 ? s.planting : s.defusing;
  const label = s.planting > 0 ? '安放 C4…' : '拆除 C4…';
  return (
    <div className="plant-bar">
      <div className="plant-label">{label}</div>
      <div className="plant-track"><div className="plant-fill" style={{ width: `${v * 100}%` }} /></div>
    </div>
  );
}
