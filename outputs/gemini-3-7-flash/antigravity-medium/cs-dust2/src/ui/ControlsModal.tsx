import React from 'react';

interface ControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ControlsModal: React.FC<ControlsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const keymaps = [
    { key: 'W A S D', desc: 'Move Forward / Left / Back / Right' },
    { key: 'Mouse', desc: 'Look / Turn view' },
    { key: 'Left Click', desc: 'Fire Weapon / Slash Knife' },
    { key: 'Right Click', desc: 'AWP Sniper Scope Toggle' },
    { key: 'Space', desc: 'Jump / Takeover Bot when dead' },
    { key: 'Shift / Ctrl', desc: 'Walk (Silent) / Crouch' },
    { key: 'R', desc: 'Reload Ammo' },
    { key: '1, 2, 3, 4', desc: 'Select Primary / Pistol / Knife / C4' },
    { key: 'E', desc: 'Plant C4 (T) / Defuse C4 (CT) / Take control of bot' },
    { key: 'B', desc: 'Open Arsenal & Loadout Buy Menu' },
    { key: 'Tab', desc: 'Show 5v5 Scoreboard & KDA' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md select-none">
      <div className="w-[600px] max-w-[95vw] rounded-3xl bg-[#0f172a]/95 border border-white/10 p-6 shadow-2xl text-white">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <h2 className="text-xl font-bold font-['Chakra_Petch'] text-sky-400">
            CONTROLS & SHORTCUTS
          </h2>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-white/10 text-xs font-mono font-bold hover:bg-white/20"
          >
            CLOSE [ESC]
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {keymaps.map((km, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5"
            >
              <span className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-sky-300 font-mono font-bold text-xs">
                {km.key}
              </span>
              <span className="text-xs text-slate-300 font-medium">{km.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
