/**
 * 购买菜单：只有准备阶段可用。手枪局不给买主武器——这就是"手枪局"的规则本身。
 */

import type { GameEngine, HudSnapshot } from '../game/engine.ts';
import { ARMOR_HELMET_PRICE, ARMOR_PRICE, WEAPONS } from '../game/weapons.ts';
import type { WeaponId } from '../game/weapons.ts';

interface Props {
  engine: GameEngine;
  snap: HudSnapshot;
  onClose: () => void;
}

const RIFLES: WeaponId[] = ['ak47', 'm4a4', 'awp'];
const PISTOLS: WeaponId[] = ['glock', 'usp', 'deagle'];

export function BuyMenu({ engine, snap, onClose }: Props) {
  const money = snap.local?.money ?? 0;
  const pistolRound = engine.pistolOnly || snap.roundNumber === 1;
  const cur = snap.local?.weapon?.id;

  const buy = (item: WeaponId | 'armor' | 'helmet') => {
    engine.buy(item);
  };

  return (
    <div className="buymenu" onContextMenu={(e) => e.preventDefault()}>
      <div className="bm-panel">
        <div className="bm-head">
          <span>购买装备</span>
          <span className="bm-money">${money}</span>
        </div>

        {pistolRound && (
          <div className="bm-note">手枪局：本回合不提供主武器</div>
        )}

        {!pistolRound && (
          <>
            <div className="bm-section">主武器</div>
            <div className="bm-grid">
              {RIFLES.map((id) => (
                <BuyItem
                  key={id}
                  label={WEAPONS[id].cn}
                  sub={`${WEAPONS[id].damage} 伤害 · ${WEAPONS[id].rpm} RPM`}
                  price={WEAPONS[id].price}
                  money={money}
                  owned={cur === id}
                  onClick={() => buy(id)}
                />
              ))}
            </div>
          </>
        )}

        <div className="bm-section">手枪</div>
        <div className="bm-grid">
          {PISTOLS.map((id) => (
            <BuyItem
              key={id}
              label={WEAPONS[id].cn}
              sub={`${WEAPONS[id].damage} 伤害 · ${WEAPONS[id].magSize} 发弹匣`}
              price={WEAPONS[id].price}
              money={money}
              owned={cur === id}
              onClick={() => buy(id)}
            />
          ))}
        </div>

        <div className="bm-section">护甲</div>
        <div className="bm-grid">
          <BuyItem
            label="防弹衣"
            sub="减少躯干伤害"
            price={ARMOR_PRICE}
            money={money}
            owned={(snap.local?.armor ?? 0) > 0 && !snap.local?.helmet}
            onClick={() => buy('armor')}
          />
          <BuyItem
            label="防弹衣 + 头盔"
            sub="额外减少爆头伤害"
            price={ARMOR_HELMET_PRICE}
            money={money}
            owned={!!snap.local?.helmet}
            onClick={() => buy('helmet')}
          />
        </div>

        <div className="bm-foot">
          <button onClick={onClose}>完成 (B / Esc)</button>
        </div>
      </div>
    </div>
  );
}

function BuyItem({
  label,
  sub,
  price,
  money,
  owned,
  onClick,
}: {
  label: string;
  sub: string;
  price: number;
  money: number;
  owned: boolean;
  onClick: () => void;
}) {
  const afford = money >= price;
  return (
    <button
      className={`bm-item ${afford ? '' : 'poor'} ${owned ? 'owned' : ''}`}
      disabled={!afford}
      onClick={onClick}
    >
      <span className="bm-label">{label}</span>
      <span className="bm-sub">{sub}</span>
      <span className="bm-price">${price}</span>
    </button>
  );
}
