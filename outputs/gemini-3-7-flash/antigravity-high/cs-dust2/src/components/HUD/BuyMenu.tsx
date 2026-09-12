import React from 'react';
import { WeaponId, WEAPON_REGISTRY } from '../../engine/weapon/WeaponTypes';
import { BotEntity } from '../../engine/ai/BotAI';

interface BuyMenuProps {
  playerEntity: BotEntity | null;
  onBuyWeapon: (weaponId: WeaponId) => void;
  onBuyEquipment: (item: 'armor' | 'helmet' | 'kit') => void;
  onClose: () => void;
}

export const BuyMenu: React.FC<BuyMenuProps> = ({
  playerEntity,
  onBuyWeapon,
  onBuyEquipment,
  onClose
}) => {
  if (!playerEntity) return null;

  const currentMoney = playerEntity.money;
  const isCT = playerEntity.team === 'CT';

  const weaponsList: { id: WeaponId; category: string }[] = [
    { id: 'ak47', category: 'Rifles' },
    { id: 'm4a4', category: 'Rifles' },
    { id: 'awp', category: 'Snipers' },
    { id: 'deagle', category: 'Pistols' },
    { id: 'glock', category: 'Pistols' },
    { id: 'usp', category: 'Pistols' }
  ];

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-3xl rounded-xl bg-slate-950/95 border border-slate-700/80 shadow-2xl p-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-black text-slate-100 tracking-wider font-sans">BUY MENU</h2>
            <p className="text-xs text-slate-400 font-mono">Select weapons and tactical gear for this round</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs text-slate-400 font-mono">CURRENT FUNDS</span>
              <div className="text-2xl font-black text-emerald-400 font-mono">${currentMoney}</div>
            </div>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold transition-colors"
            >
              ESC / CLOSE
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Primary / Secondary Weapons */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">Firearms</h3>
            <div className="flex flex-col gap-2">
              {weaponsList.map(({ id, category }) => {
                const def = WEAPON_REGISTRY[id];
                const canAfford = currentMoney >= def.price;
                const isTeamAllowed = !def.teamExclusive || def.teamExclusive === playerEntity.team;
                const isEquipped = playerEntity.primaryWeapon === id || playerEntity.secondaryWeapon === id;

                return (
                  <button
                    key={id}
                    disabled={!canAfford || !isTeamAllowed || isEquipped}
                    onClick={() => onBuyWeapon(id)}
                    className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                      isEquipped
                        ? 'bg-slate-900/40 border-slate-800 opacity-50 cursor-not-allowed'
                        : canAfford && isTeamAllowed
                        ? 'bg-slate-900/90 border-slate-700/80 hover:border-amber-400/80 hover:bg-slate-800/90 cursor-pointer text-slate-100 shadow-md'
                        : 'bg-black/40 border-slate-800/50 opacity-40 cursor-not-allowed text-slate-500'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm text-slate-100">{def.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{category} • {def.magazineSize} Rnds • {def.damage} Dmg</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-emerald-400">${def.price}</div>
                      {isEquipped && <div className="text-[10px] text-slate-400 font-mono">EQUIPPED</div>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Equipment & Armor */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider font-mono">Equipment & Armor</h3>
            <div className="flex flex-col gap-2">
              {/* Kevlar Vest */}
              <button
                disabled={currentMoney < 650 || playerEntity.armor >= 100}
                onClick={() => onBuyEquipment('armor')}
                className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                  currentMoney >= 650 && playerEntity.armor < 100
                    ? 'bg-slate-900/90 border-slate-700/80 hover:border-sky-400/80 hover:bg-slate-800/90 cursor-pointer text-slate-100'
                    : 'bg-black/40 border-slate-800/50 opacity-40 cursor-not-allowed text-slate-500'
                }`}
              >
                <div>
                  <div className="font-bold text-sm text-slate-100">Kevlar Body Armor</div>
                  <div className="text-[11px] text-slate-400 font-mono">Reduces chest and body bullet damage</div>
                </div>
                <div className="font-mono font-bold text-emerald-400">$650</div>
              </button>

              {/* Kevlar + Helmet */}
              <button
                disabled={currentMoney < 1000 || (playerEntity.armor >= 100 && playerEntity.hasHelmet)}
                onClick={() => onBuyEquipment('helmet')}
                className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                  currentMoney >= 1000 && (!playerEntity.hasHelmet || playerEntity.armor < 100)
                    ? 'bg-slate-900/90 border-slate-700/80 hover:border-sky-400/80 hover:bg-slate-800/90 cursor-pointer text-slate-100'
                    : 'bg-black/40 border-slate-800/50 opacity-40 cursor-not-allowed text-slate-500'
                }`}
              >
                <div>
                  <div className="font-bold text-sm text-slate-100">Kevlar + Helmet</div>
                  <div className="text-[11px] text-slate-400 font-mono">Prevents instant death from most headshots</div>
                </div>
                <div className="font-mono font-bold text-emerald-400">$1000</div>
              </button>

              {/* Defuse Kit (CT Only) */}
              {isCT && (
                <button
                  disabled={currentMoney < 400 || playerEntity.hasDefuseKit}
                  onClick={() => onBuyEquipment('kit')}
                  className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                    currentMoney >= 400 && !playerEntity.hasDefuseKit
                      ? 'bg-slate-900/90 border-slate-700/80 hover:border-sky-400/80 hover:bg-slate-800/90 cursor-pointer text-slate-100'
                      : 'bg-black/40 border-slate-800/50 opacity-40 cursor-not-allowed text-slate-500'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm text-slate-100">Defuse Kit</div>
                    <div className="text-[11px] text-slate-400 font-mono">Cuts C4 defusal time in half (10s → 5s)</div>
                  </div>
                  <div className="font-mono font-bold text-emerald-400">$400</div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
