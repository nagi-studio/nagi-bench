import React from 'react';
import { CharacterState, RoundState } from '../types/game';

interface ScoreboardProps {
  isOpen: boolean;
  round: RoundState;
  allEntities: CharacterState[];
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ isOpen, round, allEntities }) => {
  if (!isOpen) return null;

  const ctPlayers = allEntities.filter((e) => e.team === 'CT');
  const tPlayers = allEntities.filter((e) => e.team === 'T');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md select-none">
      <div className="w-[850px] max-w-[95vw] rounded-3xl bg-[#0d1424]/95 border border-white/15 p-6 shadow-2xl text-white font-mono">
        {/* Match Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold font-['Chakra_Petch'] text-sky-400">
              COUNTER-TERRORISTS: {round.scoreCT}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-white font-['Chakra_Petch']">
              ROUND {round.roundNumber}
            </span>
            <span className="text-xs text-amber-400 uppercase tracking-widest font-bold">
              {round.status === 'freezetime' ? 'FREEZETIME' : round.status === 'bomb_planted' ? 'BOMB PLANTED' : 'LIVE'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xl font-bold font-['Chakra_Petch'] text-amber-400">
              TERRORISTS: {round.scoreT}
            </span>
          </div>
        </div>

        {/* CT Team Table */}
        <div className="mb-6">
          <div className="flex items-center justify-between px-4 py-2 bg-sky-950/60 rounded-t-xl border border-sky-500/20 text-xs font-bold text-sky-300">
            <span className="w-48">COUNTER-TERRORIST TEAM</span>
            <span className="w-16 text-center">STATUS</span>
            <span className="w-16 text-center">KILLS</span>
            <span className="w-16 text-center">DEATHS</span>
            <span className="w-16 text-center">SCORE</span>
            <span className="w-16 text-center">PING</span>
          </div>
          <div className="divide-y divide-white/5 border-x border-b border-white/10 rounded-b-xl overflow-hidden bg-black/40">
            {ctPlayers.map((p) => (
              <div
                key={p.id}
                className={`flex items-center justify-between px-4 py-2.5 text-xs ${
                  p.isPlayer ? 'bg-sky-500/15 font-bold text-sky-200' : 'text-slate-300'
                } ${!p.isAlive ? 'opacity-40 line-through' : ''}`}
              >
                <span className="w-48 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  {p.name} {p.isPlayer && '⭐ (YOU)'}
                </span>
                <span className="w-16 text-center font-bold">
                  {p.isAlive ? <span className="text-emerald-400">{p.health} HP</span> : <span className="text-red-400">DEAD</span>}
                </span>
                <span className="w-16 text-center font-bold text-white">{p.kills}</span>
                <span className="w-16 text-center text-slate-400">{p.deaths}</span>
                <span className="w-16 text-center font-bold text-amber-400">{p.score}</span>
                <span className="w-16 text-center text-slate-400">{p.ping}ms</span>
              </div>
            ))}
          </div>
        </div>

        {/* T Team Table */}
        <div>
          <div className="flex items-center justify-between px-4 py-2 bg-amber-950/60 rounded-t-xl border border-amber-500/20 text-xs font-bold text-amber-300">
            <span className="w-48">TERRORIST TEAM</span>
            <span className="w-16 text-center">STATUS</span>
            <span className="w-16 text-center">KILLS</span>
            <span className="w-16 text-center">DEATHS</span>
            <span className="w-16 text-center">SCORE</span>
            <span className="w-16 text-center">PING</span>
          </div>
          <div className="divide-y divide-white/5 border-x border-b border-white/10 rounded-b-xl overflow-hidden bg-black/40">
            {tPlayers.map((p) => (
              <div
                key={p.id}
                className={`flex items-center justify-between px-4 py-2.5 text-xs ${
                  p.isPlayer ? 'bg-amber-500/15 font-bold text-amber-200' : 'text-slate-300'
                } ${!p.isAlive ? 'opacity-40 line-through' : ''}`}
              >
                <span className="w-48 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  {p.name} {p.inventory.c4 && '💣'}
                </span>
                <span className="w-16 text-center font-bold">
                  {p.isAlive ? <span className="text-emerald-400">{p.health} HP</span> : <span className="text-red-400">DEAD</span>}
                </span>
                <span className="w-16 text-center font-bold text-white">{p.kills}</span>
                <span className="w-16 text-center text-slate-400">{p.deaths}</span>
                <span className="w-16 text-center font-bold text-amber-400">{p.score}</span>
                <span className="w-16 text-center text-slate-400">{p.ping}ms</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-slate-400">Hold [TAB] to view scoreboard</div>
      </div>
    </div>
  );
};
