import React from 'react';
import { KillFeedEntry } from '../../engine/game/GameManager';

interface KillFeedProps {
  entries: KillFeedEntry[];
}

export const KillFeed: React.FC<KillFeedProps> = ({ entries }) => {
  return (
    <div className="absolute top-4 right-4 flex flex-col gap-1.5 pointer-events-none z-30 max-w-sm">
      {entries.map(item => {
        const isKillerCT = item.killerTeam === 'CT';
        const isVictimCT = item.victimTeam === 'CT';

        const weaponLabel = item.weapon.toUpperCase();

        return (
          <div
            key={item.id}
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-black/75 border border-slate-700/60 backdrop-blur-md text-xs font-semibold tracking-wider text-slate-200 animate-fadeIn"
          >
            {/* Killer Name */}
            <span className={isKillerCT ? 'text-sky-400 font-bold' : 'text-amber-400 font-bold'}>
              {item.killerName}
            </span>

            {/* Weapon Badge */}
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">
              {weaponLabel}
            </span>

            {/* Headshot Icon */}
            {item.isHeadshot && (
              <span className="text-red-500 font-bold text-xs" title="Headshot">
                🎯
              </span>
            )}

            {/* Victim Name */}
            <span className={isVictimCT ? 'text-sky-400 font-bold' : 'text-amber-400 font-bold'}>
              {item.victimName}
            </span>
          </div>
        );
      })}
    </div>
  );
};
