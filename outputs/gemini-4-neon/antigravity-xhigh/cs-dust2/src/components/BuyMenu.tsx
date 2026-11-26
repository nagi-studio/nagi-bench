import React from 'react';
import { HudSnapshot, WeaponId } from '../game/types';
import { WEAPONS } from '../game/weapons';

interface BuyMenuProps {
  hud: HudSnapshot;
  onBuyWeapon: (id: WeaponId) => void;
  onBuyArmor: (withHelmet: boolean) => void;
  onClose: () => void;
}

const PRIMARY_LIST: { id: WeaponId; desc: string }[] = [
  { id: 'ak47', desc: '高伤害 · 强后坐力 · 经典点射/压枪' },
  { id: 'm4a4', desc: '中等伤害 · 低后坐力 · 高射速稳定' },
  { id: 'awp', desc: '单发致命 · 极低射速 · 右键双倍开镜' },
];

const SECONDARY_LIST: { id: WeaponId; desc: string }[] = [
  { id: 'glock', desc: 'T 阵营默认手枪 · 20发大弹匣' },
  { id: 'usp', desc: 'CT 阵营默认消音手枪 · 高精准' },
  { id: 'deagle', desc: '沙鹰 · 高穿甲重火力 · 7发小弹匣' },
];

export const BuyMenu: React.FC<BuyMenuProps> = ({ hud, onBuyWeapon, onBuyArmor, onClose }) => {
  if (!hud.buyMenuOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="buy-panel">
        <div className="buy-header">
          <div>
            <h2>战术军械库 · 购买装备</h2>
            <p>
              {hud.isPistolRound
                ? '当前为手枪局：仅限手枪与防弹衣（主武器与头盔已锁定）'
                : '全枪局已开放：可自由装备 AK-47 / M4A4 / AWP / 沙鹰 / 默认手枪'}
            </p>
          </div>
          <div className="buy-cash">${hud.money}</div>
        </div>

        <div className="buy-columns">
          <div className="buy-col">
            <h3>主武器 (Rifles / Sniper)</h3>
            {PRIMARY_LIST.map(({ id, desc }) => {
              const cfg = WEAPONS[id];
              const locked = hud.isPistolRound;
              const owned = hud.slots.primary === id;
              const canAfford = hud.money >= cfg.price;
              return (
                <button
                  key={id}
                  className={`buy-item ${owned ? 'owned' : ''} ${locked ? 'locked' : ''}`}
                  disabled={locked || !canAfford}
                  onClick={() => onBuyWeapon(id)}
                >
                  <div className="bi-top">
                    <strong>{cfg.name}</strong>
                    <span className="bi-price">{locked ? '手枪局锁定' : `$${cfg.price}`}</span>
                  </div>
                  <div className="bi-desc">{desc}</div>
                  <div className="bi-stats">
                    伤害 {cfg.baseDamage} · 弹匣 {cfg.magSize}/{cfg.reserveMax}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="buy-col">
            <h3>副武器手枪 (Pistols)</h3>
            {SECONDARY_LIST.map(({ id, desc }) => {
              const cfg = WEAPONS[id];
              const owned = hud.slots.secondary === id;
              const canAfford = hud.money >= cfg.price;
              return (
                <button
                  key={id}
                  className={`buy-item ${owned ? 'owned' : ''}`}
                  disabled={!canAfford}
                  onClick={() => onBuyWeapon(id)}
                >
                  <div className="bi-top">
                    <strong>{cfg.name}</strong>
                    <span className="bi-price">${cfg.price}</span>
                  </div>
                  <div className="bi-desc">{desc}</div>
                  <div className="bi-stats">
                    伤害 {cfg.baseDamage} · 弹匣 {cfg.magSize}/{cfg.reserveMax}
                  </div>
                </button>
              );
            })}

            <h3 style={{ marginTop: 14 }}>战术护甲 (Armor)</h3>
            <div className="armor-row">
              <button
                className="buy-item compact"
                disabled={hud.money < 650}
                onClick={() => onBuyArmor(false)}
              >
                <div className="bi-top">
                  <strong>凯夫拉防弹衣</strong>
                  <span className="bi-price">$650</span>
                </div>
              </button>
              <button
                className={`buy-item compact ${hud.isPistolRound ? 'locked' : ''}`}
                disabled={hud.isPistolRound || hud.money < 1000}
                onClick={() => onBuyArmor(true)}
              >
                <div className="bi-top">
                  <strong>防弹衣 + 头盔</strong>
                  <span className="bi-price">{hud.isPistolRound ? '锁定' : '$1000'}</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="buy-footer">
          <button className="btn-primary" onClick={onClose}>
            返回战斗 [B / Esc]
          </button>
        </div>
      </div>
    </div>
  );
};
