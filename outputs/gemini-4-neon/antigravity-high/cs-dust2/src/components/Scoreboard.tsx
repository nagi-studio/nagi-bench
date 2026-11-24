import React from 'react';
import { HudState, ScoreboardEntry } from '../game/types';

interface ScoreboardProps {
  hud: HudState;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ hud }) => {
  const ctRows = hud.scoreboard
    .filter((s) => s.team === 'CT')
    .sort((a, b) => b.kills - a.kills || a.deaths - b.deaths);
  const tRows = hud.scoreboard
    .filter((s) => s.team === 'T')
    .sort((a, b) => b.kills - a.kills || a.deaths - b.deaths);

  const renderTeamTable = (title: string, score: number, color: string, rows: ScoreboardEntry[]) => (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '6px 12px',
          background: `${color}22`,
          borderLeft: `4px solid ${color}`,
          fontWeight: 800,
          fontSize: 13,
          color,
        }}
      >
        <span>{title}</span>
        <span>胜场: {score}</span>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
            <th style={{ padding: '6px 10px' }}>玩家</th>
            <th style={{ padding: '6px 8px' }}>状态</th>
            <th style={{ padding: '6px 8px' }}>武器</th>
            <th style={{ padding: '6px 8px', textAlign: 'right' }}>资金</th>
            <th style={{ padding: '6px 8px', textAlign: 'right' }}>击杀</th>
            <th style={{ padding: '6px 10px', textAlign: 'right' }}>死亡</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.id}
              style={{
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                background: r.isHuman ? 'rgba(255,255,255,0.08)' : 'transparent',
                opacity: r.alive ? 1 : 0.48,
              }}
            >
              <td style={{ padding: '6px 10px', fontWeight: r.isHuman ? 800 : 500 }}>
                {r.name}
                {r.hasC4 && (
                  <span
                    style={{
                      marginLeft: 6,
                      padding: '1px 5px',
                      borderRadius: 3,
                      background: '#dc2626',
                      color: '#fff',
                      fontSize: 10,
                      fontWeight: 800,
                    }}
                  >
                    C4
                  </span>
                )}
              </td>
              <td style={{ padding: '6px 8px', color: r.alive ? '#4ade80' : '#ef4444' }}>
                {r.alive ? `${r.hp} HP` : '阵亡'}
              </td>
              <td style={{ padding: '6px 8px', color: '#cbd5e1' }}>{r.alive ? r.weaponShort : '-'}</td>
              <td style={{ padding: '6px 8px', textAlign: 'right', color: '#86efac' }}>${r.money}</td>
              <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700 }}>{r.kills}</td>
              <td style={{ padding: '6px 10px', textAlign: 'right' }}>{r.deaths}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 45,
      }}
    >
      <div
        style={{
          width: 640,
          maxWidth: '94vw',
          background: 'rgba(11, 16, 24, 0.92)',
          border: '1px solid rgba(255,255,255,0.16)',
          borderRadius: 10,
          padding: 18,
          boxShadow: '0 20px 60px rgba(0,0,0,0.65)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            paddingBottom: 8,
          }}
        >
          <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: '0.06em' }}>
            DUST2 // 5v5 战绩面板
          </span>
          <span style={{ fontSize: 12, color: '#f5b942', fontWeight: 700 }}>
            第 {hud.roundNumber} 回合 {hud.isPistolRound ? '· 手枪局' : ''}
          </span>
        </div>

        {renderTeamTable('反恐精英 (CT)', hud.ctScore, '#60a5fa', ctRows)}
        {renderTeamTable('恐怖分子 (T)', hud.tScore, '#f59e0b', tRows)}
      </div>
    </div>
  );
};
