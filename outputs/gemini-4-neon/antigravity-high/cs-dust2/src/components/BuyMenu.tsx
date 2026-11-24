import React, { useEffect } from 'react';
import { ROUND_CONFIG } from '../game/config';
import { HudState, WeaponId } from '../game/types';
import { WEAPONS } from '../game/weapons/weaponData';

interface BuyMenuProps {
  hud: HudState;
  onBuy: (item: WeaponId | 'armor' | 'helmet') => void;
  onClose: () => void;
}

export const BuyMenu: React.FC<BuyMenuProps> = ({ hud, onBuy, onClose }) => {
  const isPistol = hud.isPistolRound;

  const items: Array<{
    key: string;
    id: WeaponId | 'armor' | 'helmet';
    name: string;
    desc: string;
    price: number;
    category: string;
    locked?: boolean;
    lockReason?: string;
    owned?: boolean;
  }> = [
    {
      key: '1',
      id: 'ak47',
      name: WEAPONS.ak47.name,
      desc: '高伤害 · 强后坐力 · 30发步枪',
      price: WEAPONS.ak47.price,
      category: '主武器',
      locked: isPistol,
      lockReason: '手枪局禁用主武器',
      owned: hud.slots.primary === 'ak47',
    },
    {
      key: '2',
      id: 'm4a4',
      name: WEAPONS.m4a4.name,
      desc: '中伤害 · 低后坐 · 高射速步枪',
      price: WEAPONS.m4a4.price,
      category: '主武器',
      locked: isPistol,
      lockReason: '手枪局禁用主武器',
      owned: hud.slots.primary === 'm4a4',
    },
    {
      key: '3',
      id: 'awp',
      name: WEAPONS.awp.name,
      desc: '单发致命 · 右键双倍开镜狙击',
      price: WEAPONS.awp.price,
      category: '主武器',
      locked: isPistol,
      lockReason: '手枪局禁用主武器',
      owned: hud.slots.primary === 'awp',
    },
    {
      key: '4',
      id: 'deagle',
      name: WEAPONS.deagle.name,
      desc: '高穿甲大口径手枪 · 7发弹匣',
      price: WEAPONS.deagle.price,
      category: '副武器',
      owned: hud.slots.secondary === 'deagle',
    },
    {
      key: '5',
      id: 'usp',
      name: WEAPONS.usp.name,
      desc: '消音精准手枪 · 12发弹匣',
      price: WEAPONS.usp.price,
      category: '副武器',
      owned: hud.slots.secondary === 'usp',
    },
    {
      key: '6',
      id: 'glock',
      name: WEAPONS.glock.name,
      desc: '20发大弹匣手枪 · 移动稳定',
      price: WEAPONS.glock.price,
      category: '副武器',
      owned: hud.slots.secondary === 'glock',
    },
    {
      key: '7',
      id: 'armor',
      name: '凯夫拉防弹衣 (Kevlar)',
      desc: '100 护甲 · 显著降低身体中弹伤害',
      price: ROUND_CONFIG.ARMOR_COST,
      category: '装备',
      owned: hud.armor >= 100,
    },
    {
      key: '8',
      id: 'helmet',
      name: '战术头盔 (Helmet)',
      desc: '降低头部中弹伤害（需防弹衣）',
      price: ROUND_CONFIG.HELMET_COST,
      category: '装备',
      locked: isPistol || hud.armor <= 0,
      lockReason: isPistol ? '手枪局禁用头盔' : '请先购买防弹衣',
      owned: hud.hasHelmet,
    },
  ];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const idx = parseInt(e.key, 10) - 1;
      if (idx >= 0 && idx < items.length) {
        const it = items[idx];
        if (!it.locked && !it.owned && hud.money >= it.price) {
          onBuy(it.id);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hud.money, isPistol, hud.armor, hud.hasHelmet]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(6, 10, 16, 0.72)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div
        style={{
          width: 680,
          maxWidth: '94vw',
          background: 'linear-gradient(160deg, rgba(19, 26, 38, 0.96), rgba(11, 15, 24, 0.98))',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          borderRadius: 12,
          padding: 22,
          boxShadow: '0 24px 64px rgba(0,0,0,0.65)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '0.06em' }}>
              战术军械库 // BUY MENU
            </div>
            <div style={{ fontSize: 12, color: '#9fb2c8', marginTop: 2 }}>
              {isPistol
                ? '当前为第一回合手枪局：仅允许购买手枪与基础护甲（第二回合起解锁全步枪/AWP）'
                : '按数字键 [1-8] 或点击购买 · 按 [B] 或 [ESC] 返回战场'}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#4ade80' }}>${hud.money}</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>当前资金</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {items.map((it) => {
            const canAfford = hud.money >= it.price;
            const disabled = Boolean(it.locked || it.owned || !canAfford);
            return (
              <button
                key={it.id}
                disabled={disabled}
                onClick={() => onBuy(it.id)}
                style={{
                  textAlign: 'left',
                  padding: '12px 14px',
                  borderRadius: 8,
                  border: it.owned
                    ? '1px solid rgba(74, 222, 128, 0.5)'
                    : disabled
                    ? '1px solid rgba(255,255,255,0.08)'
                    : '1px solid rgba(245, 185, 66, 0.45)',
                  background: it.owned
                    ? 'rgba(34, 197, 94, 0.12)'
                    : disabled
                    ? 'rgba(255,255,255,0.03)'
                    : 'rgba(255,255,255,0.07)',
                  color: disabled ? '#64748b' : '#f1f5f9',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  transition: 'all 0.12s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>
                    <span style={{ color: '#f5b942', marginRight: 6 }}>[{it.key}]</span>
                    {it.name}
                  </span>
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: 13,
                      color: it.owned ? '#4ade80' : canAfford && !it.locked ? '#4ade80' : '#ef4444',
                    }}
                  >
                    {it.owned ? '已装备' : `$${it.price}`}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: it.locked ? '#f87171' : '#94a3b8', marginTop: 4 }}>
                  {it.locked ? it.lockReason : `${it.category} · ${it.desc}`}
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 20px',
              borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.2)',
              background: '#f5b942',
              color: '#111827',
              fontWeight: 800,
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            返回游戏 [B / ESC]
          </button>
        </div>
      </div>
    </div>
  );
};
