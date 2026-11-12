import type { Game } from '../game/client/Game.ts';
import type { HudState } from '../game/client/store.ts';
import { PRIMARY_IDS, SECONDARY_IDS, WEAPONS } from '../game/core/weapons.ts';
import type { WeaponId } from '../game/core/weapons.ts';

const DESC: Record<string, string> = {
  ak47: '高伤害 · 后坐力剧烈',
  m4a4: '中等伤害 · 射速高 · 后坐力低',
  awp: '单发致命 · 右键开镜',
  glock: 'T 默认 · 弹匣大 · 伤害低',
  usp: 'CT 默认 · 消音 · 精准',
  deagle: '威力大 · 弹匣小 · 后坐力大',
};

function Card({ id, active, disabled, onClick }: { id: WeaponId; active: boolean; disabled: boolean; onClick: () => void }) {
  const d = WEAPONS[id];
  return (
    <button className={`buy-card ${active ? 'active' : ''}`} disabled={disabled} onClick={onClick}>
      <div className="buy-name">{d.name}</div>
      <div className="buy-desc">{DESC[id]}</div>
      <div className="buy-stats">
        <span>伤害 {d.damage}</span>
        <span>弹匣 {d.magSize}</span>
        <span>射速 {Math.round(60 / d.fireInterval)}/分</span>
      </div>
    </button>
  );
}

export function BuyMenu({ game, hud }: { game: Game; hud: HudState }) {
  const p = hud.prefs;
  return (
    <div className="overlay buy-overlay">
      <div className="buy-panel">
        <div className="buy-head">
          <h2>武器选择</h2>
          <span className="buy-round">{hud.roundTypeLabel}{hud.isPistolRound ? ' — 只能选择手枪' : ''}</span>
          <button className="close-btn" onClick={() => game.closeBuy()}>
            关闭 (B)
          </button>
        </div>
        <h3>主武器</h3>
        <div className="buy-row">
          {PRIMARY_IDS.map((id) => (
            <Card
              key={id}
              id={id}
              disabled={!hud.buyAllowPrimary || !hud.canBuy}
              active={hud.slots.primary === WEAPONS[id].name}
              onClick={() => game.buy(id)}
            />
          ))}
        </div>
        <h3>副武器（手枪）</h3>
        <div className="buy-row">
          {SECONDARY_IDS.map((id) => (
            <Card key={id} id={id} disabled={!hud.canBuy} active={hud.slots.secondary === WEAPONS[id].name} onClick={() => game.buy(id)} />
          ))}
        </div>
        <p className="buy-note">
          原型中武器免费，选择会在之后的回合保留（当前：{p.primary ? WEAPONS[p.primary].name : '默认主武器'} /{' '}
          {p.secondary ? WEAPONS[p.secondary].name : '默认手枪'}）。手枪局中主武器不可用。冻结时间与开局 15 秒内可更换。
        </p>
      </div>
    </div>
  );
}
