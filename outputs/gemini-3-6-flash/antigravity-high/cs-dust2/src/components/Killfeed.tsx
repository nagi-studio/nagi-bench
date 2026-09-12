import React from 'react';
import { GameEngine } from '../game/GameEngine';

interface Props {
  engine: GameEngine;
}

export const Killfeed: React.FC<Props> = ({ engine }) => {
  return (
    <div style={{ position: 'absolute', top: 20, right: 25, display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end', pointerEvents: 'none' }}>
      {engine.killfeed.map((item) => (
        <div
          key={item.id}
          style={{
            backgroundColor: 'rgba(10, 14, 20, 0.85)',
            borderLeft: `4px solid ${item.killerTeam === 'CT' ? '#4a90e2' : '#e6a100'}`,
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '13px',
            fontWeight: 'bold',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
          }}
        >
          <span style={{ color: item.killerTeam === 'CT' ? '#4a90e2' : '#e6a100' }}>{item.killerName}</span>
          <span style={{ color: '#aaa', fontSize: '11px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '3px' }}>
            [{item.weapon.toUpperCase()}{item.isHeadshot ? ' 🎯 HEADSHOT' : ''}]
          </span>
          <span style={{ color: item.victimTeam === 'CT' ? '#4a90e2' : '#e6a100' }}>{item.victimName}</span>
        </div>
      ))}
    </div>
  );
};
