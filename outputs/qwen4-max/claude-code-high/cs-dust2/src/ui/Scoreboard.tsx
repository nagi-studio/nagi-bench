import type { ReactElement } from 'react';
import type { HudState, ScoreRow } from '../game/types';

function TeamTable({ rows, team, scores }: { rows: ScoreRow[]; team: 'CT' | 'T'; scores: number }): ReactElement {
  return (
    <div className={`sb-team ${team === 'CT' ? 'ct' : 't'}`}>
      <div className="sb-head">
        <span>{team === 'CT' ? '反恐精英 CT' : '恐怖分子 T'}</span>
        <span className="sb-score">{scores}</span>
      </div>
      <table>
        <thead>
          <tr><th>玩家</th><th>击杀</th><th>死亡</th><th>状态</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className={r.isPlayer ? 'me' : ''}>
              <td>{r.name}{r.hasBomb ? ' 💣' : ''}{r.isPlayer ? '（你）' : ''}</td>
              <td>{r.kills}</td>
              <td>{r.deaths}</td>
              <td>{r.alive ? '存活' : '阵亡'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Scoreboard({ hud }: { hud: HudState }): ReactElement {
  return (
    <div className="scoreboard">
      <TeamTable rows={hud.scoreboard.filter((r) => r.team === 'CT')} team="CT" scores={hud.scores.CT} />
      <TeamTable rows={hud.scoreboard.filter((r) => r.team === 'T')} team="T" scores={hud.scores.T} />
    </div>
  );
}
