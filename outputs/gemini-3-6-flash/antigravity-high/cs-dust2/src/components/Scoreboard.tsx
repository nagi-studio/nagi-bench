import React, { useEffect, useState } from 'react';
import { GameEngine } from '../game/GameEngine';

interface Props {
  engine: GameEngine;
}

export const Scoreboard: React.FC<Props> = ({ engine }) => {
  const [showTab, setShowTab] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Tab') {
        e.preventDefault();
        setShowTab(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Tab') {
        setShowTab(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  if (!showTab) return null;

  const ctList = engine.allCharacters.filter(c => c.team === 'CT');
  const tList = engine.allCharacters.filter(c => c.team === 'T');

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', pointerEvents: 'none', zIndex: 10 }}>
      <div style={{ width: '700px', backgroundColor: '#121820', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', padding: '20px', color: '#fff' }}>
        <div style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
          DUST2 5v5 MATCH SCOREBOARD (ROUND {engine.score.currentRound})
        </div>

        {/* Counter-Terrorist Section */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#4a90e2', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
            <span>COUNTER-TERRORISTS (SCORE: {engine.score.ct})</span>
            <span>KILLS / DEATHS</span>
          </div>
          {ctList.map(c => (
            <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', backgroundColor: c.isDead ? 'rgba(255,255,255,0.03)' : 'rgba(74, 144, 226, 0.1)', borderRadius: '4px', marginBottom: '4px' }}>
              <span style={{ color: c.isDead ? '#666' : '#fff' }}>
                {c.name} {c.id === engine.player.id ? '(YOU)' : ''} {c.isDead ? '💀' : ''}
              </span>
              <span style={{ fontWeight: 'bold' }}>{c.killCount} / {c.deathCount}</span>
            </div>
          ))}
        </div>

        {/* Terrorist Section */}
        <div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#e6a100', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
            <span>TERRORISTS (SCORE: {engine.score.t})</span>
            <span>KILLS / DEATHS</span>
          </div>
          {tList.map(c => (
            <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', backgroundColor: c.isDead ? 'rgba(255,255,255,0.03)' : 'rgba(230, 161, 0, 0.1)', borderRadius: '4px', marginBottom: '4px' }}>
              <span style={{ color: c.isDead ? '#666' : '#fff' }}>
                {c.name} {c.id === engine.player.id ? '(YOU)' : ''} {c.hasC4 ? '💣' : ''} {c.isDead ? '💀' : ''}
              </span>
              <span style={{ fontWeight: 'bold' }}>{c.killCount} / {c.deathCount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
