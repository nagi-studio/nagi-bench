import React from 'react';
import { BotEntity } from '../../engine/ai/BotAI';

interface ScoreboardProps {
  players: BotEntity[];
  playerEntity: BotEntity | null;
  scoreCT: number;
  scoreT: number;
  round: number;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  players,
  playerEntity,
  scoreCT,
  scoreT,
  round
}) => {
  const ctPlayers = players.filter(p => p.team === 'CT');
  const tPlayers = players.filter(p => p.team === 'T');

  const renderRoster = (teamPlayers: BotEntity[], team: 'CT' | 'T') => {
    const isCT = team === 'CT';
    return (
      <div className="flex flex-col gap-1">
        {/* Table Header */}
        <div className={`flex items-center px-4 py-2 rounded text-xs font-bold uppercase tracking-wider ${
          isCT ? 'bg-sky-950/80 text-sky-300 border-l-4 border-sky-500' : 'bg-amber-950/80 text-amber-300 border-l-4 border-amber-500'
        }`}>
          <div className="w-48 font-bold">{isCT ? 'Counter-Terrorists' : 'Terrorists'}</div>
          <div className="w-16 text-center">Status</div>
          <div className="w-16 text-center">K</div>
          <div className="w-16 text-center">A</div>
          <div className="w-16 text-center">D</div>
          <div className="w-20 text-center">Money</div>
          <div className="w-16 text-center">Score</div>
        </div>

        {/* Player Rows */}
        {teamPlayers.map(p => {
          const isSelf = playerEntity && p.id === playerEntity.id;
          const isAlive = p.health > 0;

          return (
            <div
              key={p.id}
              className={`flex items-center px-4 py-2.5 rounded text-sm font-medium transition-colors ${
                isSelf
                  ? 'bg-slate-800/90 text-white border border-amber-400/60 shadow-lg shadow-black/50'
                  : 'bg-black/60 text-slate-300 hover:bg-slate-900/60'
              }`}
            >
              {/* Player Name */}
              <div className="w-48 flex items-center gap-2">
                <span className={`font-semibold ${isCT ? 'text-sky-300' : 'text-amber-300'}`}>
                  {p.name}
                </span>
                {p.hasC4 && <span className="text-xs px-1 rounded bg-red-800 text-white font-mono">C4</span>}
                {p.hasDefuseKit && <span className="text-xs px-1 rounded bg-blue-800 text-white font-mono">KIT</span>}
              </div>

              {/* Status / Health */}
              <div className="w-16 text-center text-xs">
                {isAlive ? (
                  <span className="text-emerald-400 font-bold">{p.health} HP</span>
                ) : (
                  <span className="text-red-500/80 font-bold">DEAD</span>
                )}
              </div>

              {/* K / A / D */}
              <div className="w-16 text-center font-mono font-bold text-slate-100">{p.kills}</div>
              <div className="w-16 text-center font-mono text-slate-400">{p.assists}</div>
              <div className="w-16 text-center font-mono text-slate-400">{p.deaths}</div>

              {/* Money */}
              <div className="w-20 text-center font-mono text-emerald-400 font-semibold">${p.money}</div>

              {/* Score */}
              <div className="w-16 text-center font-mono font-bold text-amber-300">{p.score}</div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 pointer-events-none animate-fadeIn">
      <div className="w-full max-w-4xl p-6 rounded-xl bg-slate-950/95 border border-slate-700/80 shadow-2xl shadow-black flex flex-col gap-6">
        {/* Match Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black tracking-widest text-slate-100 font-sans">DUST II</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-xs font-mono text-slate-400">Competitive 5v5</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-xs font-mono text-emerald-400">128 Tick</span>
          </div>

          {/* Scores */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sky-400 font-black text-3xl font-mono">
              <span>CT</span>
              <span>{scoreCT}</span>
            </div>
            <div className="text-slate-500 font-mono text-xl font-bold">:</div>
            <div className="flex items-center gap-2 text-amber-400 font-black text-3xl font-mono">
              <span>{scoreT}</span>
              <span>T</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-400 font-mono uppercase tracking-wider">Round {round}</div>
            <div className="text-xs text-slate-500 font-mono">MR12 Match</div>
          </div>
        </div>

        {/* CT Roster */}
        {renderRoster(ctPlayers, 'CT')}

        {/* T Roster */}
        {renderRoster(tPlayers, 'T')}
      </div>
    </div>
  );
};
