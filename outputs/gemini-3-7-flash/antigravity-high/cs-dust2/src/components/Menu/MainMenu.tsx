import React, { useState } from 'react';

interface MainMenuProps {
  onStartGame: (team: 'CT' | 'T', isPistolOnly: boolean, sensitivity: number) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStartGame }) => {
  const [selectedTeam, setSelectedTeam] = useState<'CT' | 'T'>('CT');
  const [isPistolOnly, setIsPistolOnly] = useState<boolean>(false);
  const [sensitivity, setSensitivity] = useState<number>(1.2);

  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center p-6 z-50 overflow-y-auto">
      {/* Background ambient lighting & overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/20 via-slate-950/90 to-slate-950 pointer-events-none" />

      <div className="relative w-full max-w-4xl rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl p-8 md:p-10 flex flex-col gap-8 backdrop-blur-xl">
        {/* Title Banner */}
        <div className="text-center flex flex-col items-center gap-2 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold tracking-widest uppercase">
            3D Web Tactical FPS Prototype
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-widest text-slate-100 font-sans uppercase">
            COUNTER-STRIKE: <span className="text-amber-400">DUST II</span>
          </h1>
          <p className="text-slate-400 text-sm max-w-xl font-mono">
            Full 5v5 procedural AI match with authentic Dust2 map zones (A/B sites, Mid Doors, Catwalk, Long A, B Tunnels), Hitbox system, C4 plant/defuse, and Web Audio sound.
          </p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Team Selection */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              1. Choose Your Faction
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSelectedTeam('CT')}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  selectedTeam === 'CT'
                    ? 'bg-sky-950/90 border-sky-400 text-sky-300 shadow-lg shadow-sky-950/50 scale-[1.02]'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-2xl">👮‍♂️</span>
                <span className="font-black tracking-wider text-base font-sans">COUNTER-TERRORISTS</span>
                <span className="text-[11px] text-center font-mono opacity-75">Defend sites A & B, defuse C4 bomb</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTeam('T')}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  selectedTeam === 'T'
                    ? 'bg-amber-950/90 border-amber-400 text-amber-300 shadow-lg shadow-amber-950/50 scale-[1.02]'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-2xl">🥷</span>
                <span className="font-black tracking-wider text-base font-sans">TERRORISTS</span>
                <span className="text-[11px] text-center font-mono opacity-75">Infiltrate site, plant C4 explosive</span>
              </button>
            </div>
          </div>

          {/* Match Options */}
          <div className="flex flex-col gap-4">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              2. Match Configuration
            </label>

            {/* Pistol Round Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <div className="font-bold text-sm text-slate-200">Pistol Round Only</div>
                <div className="text-xs text-slate-400 font-mono">Start and stay in standard CS pistol round</div>
              </div>
              <input
                type="checkbox"
                checked={isPistolOnly}
                onChange={e => setIsPistolOnly(e.target.checked)}
                className="w-5 h-5 rounded accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Mouse Sensitivity Slider */}
            <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-300 font-bold">Mouse Sensitivity</span>
                <span className="text-amber-400 font-bold">{sensitivity.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.4"
                max="3.0"
                step="0.1"
                value={sensitivity}
                onChange={e => setSensitivity(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Controls Cheatsheet */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-wrap justify-between gap-3 text-xs font-mono text-slate-400">
          <div><span className="text-slate-200 font-bold">WASD:</span> Move</div>
          <div><span className="text-slate-200 font-bold">Space:</span> Jump</div>
          <div><span className="text-slate-200 font-bold">Shift:</span> Walk</div>
          <div><span className="text-slate-200 font-bold">Ctrl:</span> Crouch</div>
          <div><span className="text-slate-200 font-bold">Left Click:</span> Shoot</div>
          <div><span className="text-slate-200 font-bold">Right Click:</span> Scope (AWP)</div>
          <div><span className="text-slate-200 font-bold">R:</span> Reload</div>
          <div><span className="text-slate-200 font-bold">1/2/3/5:</span> Weapons / C4</div>
          <div><span className="text-slate-200 font-bold">B:</span> Buy Menu</div>
          <div><span className="text-slate-200 font-bold">E:</span> Plant / Defuse / Bot Takeover</div>
          <div><span className="text-slate-200 font-bold">TAB:</span> Scoreboard</div>
        </div>

        {/* Start Game Action */}
        <button
          onClick={() => onStartGame(selectedTeam, isPistolOnly, sensitivity)}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-lg tracking-widest uppercase font-sans shadow-2xl shadow-amber-500/25 transform hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
        >
          DEPLOY TO DUST II (START 5v5)
        </button>
      </div>
    </div>
  );
};
