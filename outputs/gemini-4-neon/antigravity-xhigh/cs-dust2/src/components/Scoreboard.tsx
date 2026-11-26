import React from 'react';
import { HudSnapshot } from '../game/types';
import { WEAPONS } from '../game/weapons';

interface ScoreboardProps {
  hud: HudSnapshot;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ hud }) => {
  if (!hud.scoreboardOpen) return null;

  const ctPlayers = hud.scoreboard
    .filter((p) => p.team === 'CT')
    .sort((a, b) => b.kills - a.kills);
  const tPlayers = hud.scoreboard
    .filter((p) => p.team === 'T')
    .sort((a, b) => b.kills - a.kills);

  const renderTable = (title: string, cls: string, score: number, list: typeof ctPlayers) => (
    <div className={`sb-team ${cls}`}>
      <div className="sb-team-header">
        <span>{title}</span>
        <span className="sb-team-score">{score}</span>
      </div>
      <div className="sb-row sb-head">
        <span>干员</span>
        <span>状态</span>
        <span>武器</span>
        <span>金钱</span>
        <span>K</span>
        <span>D</span>
      </div>
      {list.map((p) => (
        <div
          key={p.id}
          className={`sb-row ${p.isHuman ? 'is-human' : ''} ${!p.alive ? 'is-dead' : ''}`}
        >
          <span className="sb-name">
            {p.name}
            {p.hasBomb && <em className="sb-c4">C4</em>}
          </span>
          <span>{p.alive ? `${p.hp} HP` : '阵亡'}</span>
          <span>{WEAPONS[p.weapon]?.shortName ?? p.weapon}</span>
          <span>${p.money}</span>
          <strong>{p.kills}</strong>
          <span>{p.deaths}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="scoreboard-backdrop">
      <div className="scoreboard-panel">
        <div className="sb-top">
          <h2>DE_DUST2 · 5v5 战术对抗</h2>
          <span>
            第 {hud.roundNumber} 回合 · {hud.isPistolRound ? '手枪局' : '全枪局'}
          </span>
        </div>
        <div className="sb-grid">
          {renderTable('反恐精英 (CT)', 'ct', hud.scoreCT, ctPlayers)}
          {renderTable('恐怖分子 (T)', 't', hud.scoreT, tPlayers)}
        </div>
      </div>
    </div>
  );
};
