import React from 'react';
import { CharacterState, RoundState } from '../types/game';

interface MinimapProps {
  player: CharacterState;
  allEntities: CharacterState[];
  round: RoundState;
}

export const Minimap: React.FC<MinimapProps> = ({ player, allEntities, round }) => {
  // Map world coordinate [-70, 70] to canvas [0, 180]
  // In our Dust2 coordinates: X is East(+)/West(-), Z is South(T Spawn +60) to North(CT Spawn -60)
  const mapWidth = 190;
  const mapHeight = 190;

  const worldToMap = (x: number, z: number) => {
    // x in [-70, 70] -> [15, 175]
    // z in [-75, 75] -> [15, 175] (flip Z so North CT is Top)
    const px = ((x + 70) / 140) * (mapWidth - 30) + 15;
    const py = ((-z + 75) / 150) * (mapHeight - 30) + 15;
    return { x: px, y: py };
  };

  return (
    <div className="relative w-[190px] h-[190px] bg-[#0c121e]/85 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden pointer-events-none select-none">
      {/* Schematic SVG Map of Dust2 */}
      <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${mapWidth} ${mapHeight}`}>
        {/* Map Zone Outlines */}
        {/* T Spawn */}
        <rect x="75" y="150" width="40" height="25" fill="#1e293b" rx="4" opacity="0.6" />
        <text x="95" y="166" fill="#94a3b8" fontSize="8" fontWeight="600" textAnchor="middle">T SPAWN</text>

        {/* Long A */}
        <path d="M 125 145 L 155 145 L 155 55 L 130 55" fill="none" stroke="#334155" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        <text x="160" y="105" fill="#64748b" fontSize="7" fontWeight="bold">LONG A</text>

        {/* A Site */}
        <rect x="110" y="32" width="30" height="28" fill="#1e293b" rx="4" stroke="#eab308" strokeWidth="1.5" />
        <text x="125" y="50" fill="#eab308" fontSize="13" fontWeight="bold" textAnchor="middle">A</text>

        {/* Catwalk / Short A */}
        <path d="M 95 105 L 115 105 L 115 55 L 110 55" fill="none" stroke="#334155" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />

        {/* Mid & Mid Doors */}
        <path d="M 95 140 L 95 65" fill="none" stroke="#334155" strokeWidth="12" strokeLinecap="round" />
        <line x1="88" y1="90" x2="102" y2="90" stroke="#f59e0b" strokeWidth="2" strokeDasharray="2,2" />
        <text x="95" y="85" fill="#64748b" fontSize="7" fontWeight="bold" textAnchor="middle">MID</text>

        {/* B Tunnels */}
        <path d="M 65 140 L 45 140 L 45 60 L 35 60" fill="none" stroke="#334155" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        <text x="32" y="105" fill="#64748b" fontSize="7" fontWeight="bold">TUNNELS</text>

        {/* B Site */}
        <rect x="15" y="35" width="30" height="32" fill="#1e293b" rx="4" stroke="#eab308" strokeWidth="1.5" />
        <text x="30" y="54" fill="#eab308" fontSize="13" fontWeight="bold" textAnchor="middle">B</text>

        {/* CT Spawn */}
        <rect x="75" y="15" width="40" height="22" fill="#1e293b" rx="4" opacity="0.6" />
        <text x="95" y="29" fill="#94a3b8" fontSize="8" fontWeight="600" textAnchor="middle">CT SPAWN</text>

        {/* Dropped / Planted Bomb */}
        {round.bombState.isPlanted && round.bombState.position && (
          <g>
            {(() => {
              const pos = worldToMap(round.bombState.position.x, round.bombState.position.z);
              return (
                <g transform={`translate(${pos.x}, ${pos.y})`} className="animate-pulse">
                  <circle r="7" fill="#ef4444" opacity="0.4" />
                  <circle r="4" fill="#ef4444" />
                  <text y="3" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">C4</text>
                </g>
              );
            })()}
          </g>
        )}

        {round.bombState.isDropped && round.bombState.droppedPosition && (
          <g>
            {(() => {
              const pos = worldToMap(round.bombState.droppedPosition.x, round.bombState.droppedPosition.z);
              return (
                <g transform={`translate(${pos.x}, ${pos.y})`}>
                  <circle r="4" fill="#f59e0b" />
                  <text y="3" fill="#000" fontSize="6" fontWeight="bold" textAnchor="middle">C4</text>
                </g>
              );
            })()}
          </g>
        )}

        {/* All Character dots */}
        {allEntities.map((ent) => {
          if (!ent.isAlive) return null;
          const pos = worldToMap(ent.position.x, ent.position.z);
          const isPlayer = ent.isPlayer;
          const isTeammate = ent.team === player.team;

          // Enemies only visible if nearby or same team in debug
          if (!isTeammate && !isPlayer) {
            const dist = player.position.distanceTo(ent.position);
            if (dist > 35) return null; // fog of war
          }

          const color = ent.team === 'CT' ? '#38bdf8' : '#fb923c';

          return (
            <g key={ent.id} transform={`translate(${pos.x}, ${pos.y})`}>
              {isPlayer ? (
                // Player arrow with yaw rotation
                <g transform={`rotate(${(-ent.rotation.yaw * 180) / Math.PI})`}>
                  <polygon points="0,-7 5,5 0,2 -5,5" fill="#22c55e" stroke="#ffffff" strokeWidth="1" />
                </g>
              ) : (
                // Teammate / Spotted enemy dot
                <g>
                  <circle r={isTeammate ? 3.5 : 3} fill={color} stroke="#ffffff" strokeWidth="0.8" />
                  {/* Small vision line */}
                  <line
                    x1="0"
                    y1="0"
                    x2={-Math.sin(ent.rotation.yaw) * 6}
                    y2={-Math.cos(ent.rotation.yaw) * 6}
                    stroke={color}
                    strokeWidth="1"
                    opacity="0.8"
                  />
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Radar Sweep animation */}
      <div className="absolute inset-0 rounded-2xl border border-sky-400/20 pointer-events-none" />
      <div className="absolute top-2 left-2 text-[10px] font-mono font-bold text-slate-400 tracking-wider">
        RADAR // DUST II
      </div>
    </div>
  );
};
