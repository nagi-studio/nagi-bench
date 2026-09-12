import type { HudSnapshot, ScoreboardRow, Team } from '../core/types.ts';

function TeamTable({ rows, team, score }: { rows: ScoreboardRow[]; team: Team; score: number }): JSX.Element {
  const label = team === 'CT' ? '反恐精英 (CT)' : '恐怖分子 (T)';
  return (
    <>
      <div className="team-head">
        <span className={`tag ${team === 'CT' ? 'ct' : 't'}`}>{label}</span>
        <span style={{ opacity: 0.6, fontSize: 13 }}>
          {rows.filter((r) => r.alive).length} 存活 · 比分 {score}
        </span>
      </div>
      <table>
        <thead>
          <tr>
            <th style={{ width: '46%' }}>玩家</th>
            <th>击杀</th>
            <th>死亡</th>
            <th>金钱</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className={`${r.alive ? '' : 'dead'} ${r.isPlayer ? 'me' : ''}`}>
              <td className="name">
                {r.name}
                {r.hasBomb ? ' 💣' : ''}
              </td>
              <td>{r.kills}</td>
              <td>{r.deaths}</td>
              <td>${r.money}</td>
              <td>{r.alive ? '存活' : '阵亡'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export function Scoreboard({ snap }: { snap: HudSnapshot }): JSX.Element {
  const ct = snap.scoreboard.filter((r) => r.team === 'CT');
  const t = snap.scoreboard.filter((r) => r.team === 'T');
  return (
    <div className="modal-back">
      <div className="scoreboard panel">
        <h2>
          第 {snap.roundNumber} 回合 {snap.isPistolRound ? '· 手枪局' : ''} — de_dust2
        </h2>
        <TeamTable rows={ct} team="CT" score={snap.scoreCT} />
        <TeamTable rows={t} team="T" score={snap.scoreT} />
      </div>
    </div>
  );
}
