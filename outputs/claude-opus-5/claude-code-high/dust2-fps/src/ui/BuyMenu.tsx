import type { HudSnapshot } from '../core/types.ts';
import type { GameEngine } from '../game/engine.ts';
import { DEFUSE_KIT_PRICE, KEVLAR_HELMET_PRICE, KEVLAR_PRICE, WEAPONS } from '../game/weapons.ts';
import type { WeaponId } from '../game/weapons.ts';

type BuyId = WeaponId | 'kevlar' | 'kevlar_helmet' | 'kit';

interface Item {
  id: BuyId;
  name: string;
  price: number;
  desc: string;
}

const RIFLES: Item[] = [
  { id: 'ak47', name: 'AK-47', price: WEAPONS.ak47.price, desc: '高伤害 · 后坐力剧烈 · 一枪爆头' },
  { id: 'm4a4', name: 'M4A4', price: WEAPONS.m4a4.price, desc: '中等伤害 · 低后坐力 · 高射速' },
  { id: 'awp', name: 'AWP', price: WEAPONS.awp.price, desc: '一枪致命 · 右键开镜 · 射速极低' },
];

const PISTOLS: Item[] = [
  { id: 'deagle', name: '沙漠之鹰', price: WEAPONS.deagle.price, desc: '高伤害手枪 · 弹匣仅 7 发' },
  { id: 'glock', name: 'Glock-18', price: WEAPONS.glock.price, desc: 'T 默认手枪 · 20 发弹匣' },
  { id: 'usp', name: 'USP-S', price: WEAPONS.usp.price, desc: 'CT 默认手枪 · 消音精准' },
];

const GEAR: Item[] = [
  { id: 'kevlar', name: '防弹衣', price: KEVLAR_PRICE, desc: '减少身体受到的伤害' },
  { id: 'kevlar_helmet', name: '防弹衣 + 头盔', price: KEVLAR_HELMET_PRICE, desc: '额外减少爆头伤害' },
  { id: 'kit', name: '拆弹器 (仅 CT)', price: DEFUSE_KIT_PRICE, desc: '拆弹时间 10s → 5s' },
];

export function BuyMenu({
  snap,
  engine,
  onClose,
}: {
  snap: HudSnapshot;
  engine: GameEngine;
  onClose: () => void;
}): JSX.Element {
  const buy = (id: BuyId) => {
    engine.buy(id);
  };

  const Group = ({ title, items }: { title: string; items: Item[] }) => (
    <>
      <h3
        style={{
          fontSize: 11,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          opacity: 0.5,
          margin: '18px 0 8px',
        }}
      >
        {title}
      </h3>
      <div className="buy-grid">
        {items.map((it) => {
          const blocked =
            it.price > snap.money || (it.id === 'kit' && snap.playerTeam !== 'CT') || !snap.canBuy;
          return (
            <button key={it.id} className="buy-item" disabled={blocked} onClick={() => buy(it.id)}>
              <span className="n">{it.name}</span>
              <span className="p">${it.price}</span>
              <span className="d">{it.desc}</span>
            </button>
          );
        })}
      </div>
    </>
  );

  return (
    <div className="modal-back" onClick={onClose}>
      <div className="buy panel" onClick={(e) => e.stopPropagation()}>
        <div className="buy-head">
          <h2>购买菜单</h2>
          <span className="money">${snap.money}</span>
        </div>
        {snap.isPistolRound && (
          <div style={{ fontSize: 12, color: '#f0a038' }}>
            手枪局：本回合只有手枪与护甲可用，主武器已禁用。
          </div>
        )}
        {!snap.isPistolRound && <Group title="主武器" items={RIFLES} />}
        <Group title="手枪" items={PISTOLS} />
        <Group title="装备" items={GEAR} />
        <div className="foot">
          <span>准备阶段剩余 {snap.phaseTimeLeft.toFixed(0)}s</span>
          <span>按 B 或 Esc 关闭</span>
        </div>
      </div>
    </div>
  );
}
