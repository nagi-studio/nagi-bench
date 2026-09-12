import React from 'react';
import { WeaponId } from '../types/game';
import { WEAPON_CONFIGS } from '../weapons/WeaponConfig';

interface BuyMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onBuyWeapon: (weaponId: WeaponId) => void;
  onBuyGear: (type: 'armor' | 'helmet' | 'kit') => void;
  onTogglePistolRound: () => void;
  isPistolRound: boolean;
}

export const BuyMenu: React.FC<BuyMenuProps> = ({
  isOpen,
  onClose,
  onBuyWeapon,
  onBuyGear,
  onTogglePistolRound,
  isPistolRound,
}) => {
  if (!isOpen) return null;

  const rifles: WeaponId[] = ['ak47', 'm4a4', 'awp'];
  const pistols: WeaponId[] = ['deagle', 'glock', 'usp'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md select-none">
      <div className="w-[850px] max-w-[95vw] rounded-3xl bg-[#0f172a]/95 border border-white/10 p-8 shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div>
            <h2 className="text-2xl font-black tracking-wider uppercase font-['Chakra_Petch'] text-sky-400">
              EQUIPMENT & LOADOUT MENU
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Select weapons and tactical armor for the round
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onTogglePistolRound}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                isPistolRound
                  ? 'bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/30'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
              }`}
            >
              {isPistolRound ? '✓ PISTOL ROUND MODE (ACTIVE)' : 'START PISTOL ROUND'}
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-mono font-bold hover:bg-red-500/30 transition-all"
            >
              CLOSE [B]
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Rifles */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-slate-400 tracking-wider uppercase border-b border-white/5 pb-1.5">
              PRIMARY RIFLES
            </h3>
            {rifles.map((wId) => {
              const item = WEAPON_CONFIGS[wId];
              return (
                <button
                  key={wId}
                  onClick={() => {
                    onBuyWeapon(wId);
                    onClose();
                  }}
                  className="w-full text-left p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-sky-400/50 hover:bg-sky-500/10 transition-all group"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-slate-100 group-hover:text-sky-300">
                      {item.name}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      ${item.price}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-1">
                    DMG {item.damage} • RPM {Math.round(item.fireRate * 60)} • MAG {item.magSize}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Secondary Pistols */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-slate-400 tracking-wider uppercase border-b border-white/5 pb-1.5">
              SECONDARY PISTOLS
            </h3>
            {pistols.map((wId) => {
              const item = WEAPON_CONFIGS[wId];
              return (
                <button
                  key={wId}
                  onClick={() => {
                    onBuyWeapon(wId);
                    onClose();
                  }}
                  className="w-full text-left p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-400/50 hover:bg-amber-500/10 transition-all group"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-slate-100 group-hover:text-amber-300">
                      {item.name}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      ${item.price}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-1">
                    DMG {item.damage} • RPM {Math.round(item.fireRate * 60)} • MAG {item.magSize}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Gear / Equipment */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-slate-400 tracking-wider uppercase border-b border-white/5 pb-1.5">
              GEAR & DEFENSE
            </h3>

            <button
              onClick={() => {
                onBuyGear('armor');
                onClose();
              }}
              className="w-full text-left p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-400/50 hover:bg-emerald-500/10 transition-all group"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-slate-100 group-hover:text-emerald-300">
                  Kevlar Body Armor
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">$650</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-1">
                Reduces torso & body ballistic damage
              </div>
            </button>

            <button
              onClick={() => {
                onBuyGear('helmet');
                onClose();
              }}
              className="w-full text-left p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-400/50 hover:bg-emerald-500/10 transition-all group"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-slate-100 group-hover:text-emerald-300">
                  Helmet + Kevlar Vest
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">$1000</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-1">
                Prevents 1-shot headshot kills from M4 & pistols
              </div>
            </button>

            <button
              onClick={() => {
                onBuyGear('kit');
                onClose();
              }}
              className="w-full text-left p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-400/50 hover:bg-blue-500/10 transition-all group"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-slate-100 group-hover:text-blue-300">
                  Defusal Kit (CT)
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">$400</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-1">
                Reduces bomb defusal time from 10s down to 5s
              </div>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 pt-4 border-t border-white/10 flex justify-between items-center text-xs font-mono text-slate-400">
          <div>Press [B] during match anytime to re-open this armory</div>
          <div className="text-sky-400 font-semibold">DUST II TACTICAL ARSENAL</div>
        </div>
      </div>
    </div>
  );
};
