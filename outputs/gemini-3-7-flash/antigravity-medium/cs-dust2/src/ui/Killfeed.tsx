import React from 'react';
import { KillFeedEntry } from '../types/game';

interface KillfeedProps {
  entries: KillFeedEntry[];
}

export const Killfeed: React.FC<KillfeedProps> = ({ entries }) => {
  return (
    <div className="fixed top-5 right-5 z-40 flex flex-col items-end gap-1.5 pointer-events-none select-none">
      {entries.slice(-5).map((entry) => {
        const killerColor = entry.killerTeam === 'CT' ? 'text-sky-400' : 'text-amber-400';
        const victimColor = entry.victimTeam === 'CT' ? 'text-sky-400' : 'text-amber-400';

        return (
          <div
            key={entry.id}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-xs font-mono font-bold shadow-lg animate-slide-in"
          >
            {/* Killer Name */}
            <span className={`${killerColor} tracking-wide`}>{entry.killerName}</span>

            {/* Weapon Badge */}
            <span className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300 text-[10px] uppercase">
              {entry.weapon}
            </span>

            {/* Headshot Skull Icon */}
            {entry.isHeadshot && (
              <span className="text-red-500 text-xs font-black" title="Headshot">
                🎯
              </span>
            )}

            {/* NoScope Icon */}
            {entry.isNoScope && (
              <span className="text-purple-400 text-xs font-black" title="No Scope">
                ⚡
              </span>
            )}

            {/* Victim Name */}
            <span className={`${victimColor} tracking-wide`}>{entry.victimName}</span>
          </div>
        );
      })}
    </div>
  );
};
