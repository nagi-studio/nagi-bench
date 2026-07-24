import type { HudSnapshot } from '../game/engine.ts';

export function Scoreboard({ snap }: { snap: HudSnapshot }) {
  const t = snap.players.filter((p) => p.team === 'T');
  const ct = snap.players.filter((p) => p.team === 'CT');
  const sort = (a: { kills: number; deaths: number }, b: { kills: number; deaths: number }) =>
    b.kills - a.kills || a.deaths - b.deaths;
  t.sort(sort);
  ct.sort(sort);

  return (
    <div className="scoreboard">
      <div className="sb-head">
        <span className="sb-title">DUST2 · 第 {snap.roundNumber} 回合</span>
        <span className="sb-score">
          <b className="t">{snap.scoreT}</b> : <b className="ct">{snap.scoreCT}</b>
        </span>
      </div>
      <div className="sb-cols">
        <TeamTable title="恐怖分子" cls="t" players={t} />
        <TeamTable title="反恐精英" cls="ct" players={ct} />
      </div>
    </div>
  );
}

function TeamTable({
  title,
  cls,
  players,
}: {
  title: string;
  cls: string;
  players: HudSnapshot['players'];
}) {
  return (
    <div className={`sb-team ${cls}`}>
      <div className="sb-team-title">{title}</div>
      <table>
        <thead>
          <tr>
            <th className="n">玩家</th>
            <th>击杀</th>
            <th>死亡</th>
            <th>金钱</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p) => (
            <tr key={p.id} className={`${p.isLocal ? 'me' : ''} ${p.alive ? '' : 'dead'}`}>
              <td className="n">
                {p.name}
                {p.hasBomb && <span className="sb-bomb">C4</span>}
              </td>
              <td>{p.kills}</td>
              <td>{p.deaths}</td>
              <td>${p.money}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
