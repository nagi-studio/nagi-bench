import React from 'react';
import { BotEntity } from '../../engine/ai/BotAI';

interface SpectatorOverlayProps {
  spectatingBot: BotEntity | null;
  aliveTeammates: BotEntity[];
  onTakeOver: (botId: string) => void;
  onCycleTeammate: (dir: number) => void;
}

export const SpectatorOverlay: React.FC<SpectatorOverlayProps> = ({
  spectatingBot,
  aliveTeammates,
  onTakeOver,
  onCycleTeammate
}) => {
  if (!spectatingBot) return null;

  return (
    <div className="fixed inset-x-0 bottom-12 flex flex-col items-center gap-4 z-40 pointer-events-auto animate-fadeIn">
      {/* Spectator Target Info */}
      <div className="px-6 py-3 rounded-xl bg-slate-950/90 border border-slate-700/80 shadow-2xl backdrop-blur-md flex items-center gap-6">
        <button
          onClick={() => onCycleTeammate(-1)}
          className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold transition-colors"
        >
          ◀ PREV
        </button>

        <div className="text-center">
          <div className="text-[11px] text-amber-400 font-mono tracking-widest uppercase font-bold">
            SPECTATING TEAMMATE
          </div>
          <div className="text-lg font-bold text-slate-100 font-sans">
            {spectatingBot.name}
          </div>
          <div className="text-xs text-slate-400 font-mono mt-0.5">
            {spectatingBot.health} HP • {spectatingBot.armor} AP • {spectatingBot.currentWeapon.toUpperCase()}
          </div>
        </div>

        <button
          onClick={() => onCycleTeammate(1)}
          className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold transition-colors"
        >
          NEXT ▶
        </button>
      </div>

      {/* Take Over Bot Call-To-Action */}
      <button
        onClick={() => onTakeOver(spectatingBot.id)}
        className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-sm tracking-wider uppercase font-mono shadow-xl shadow-amber-500/20 transform hover:scale-105 active:scale-95 transition-all cursor-pointer"
      >
        PRESS [E] TO TAKE OVER BOT
      </button>
    </div>
  );
};
