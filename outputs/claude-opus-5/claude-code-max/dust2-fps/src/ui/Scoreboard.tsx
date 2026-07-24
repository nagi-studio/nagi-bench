import { WEAPONS } from '../game/weapons.ts';
import type { HudSnapshot, ScoreRow } from './store.ts';

function TeamTable({ rows, team, label, score }: { rows: ScoreRow[]; team: 'CT' | 'T'; label: string; score: number }) {
  return (
    <div className={`sb-team sb-${team}`}>
      <div className="sb-team-head">
        <span className="sb-team-name">{label}</span>
        <span className="sb-team-score">{score}</span>
      </div>
      <div className="sb-row sb-row-head">
        <span>玩家</span>
        <span>击杀</span>
        <span>死亡</span>
        <span>伤害</span>
        <span>装备</span>
      </div>
      {rows.map((r) => (
        <div key={r.id} className={`sb-row ${r.alive ? '' : 'sb-dead'} ${r.isSelf ? 'sb-self' : ''}`}>
          <span className="sb-name">
            {r.name}
            {r.hasBomb && <b className="sb-bomb">C4</b>}
          </span>
          <span>{r.kills}</span>
          <span>{r.deaths}</span>
          <span>{r.damage}</span>
          <span className="sb-weapon">{r.weapon ? WEAPONS[r.weapon].name : '—'}</span>
        </div>
      ))}
    </div>
  );
}

export function Scoreboard({ snap }: { snap: HudSnapshot }) {
  const ct = snap.scoreboard.filter((r) => r.team === 'CT');
  const t = snap.scoreboard.filter((r) => r.team === 'T');
  return (
    <div className="scoreboard">
      <div className="sb-header">
        <span className="sb-map">DE_DUST2</span>
        <span className="sb-round">第 {snap.round} 回合</span>
      </div>
      <div className="sb-tables">
        <TeamTable rows={ct} team="CT" label="反恐精英" score={snap.scoreCT} />
        <TeamTable rows={t} team="T" label="恐怖分子" score={snap.scoreT} />
      </div>
      <div className="sb-hint">按住 Tab 查看记分板</div>
    </div>
  );
}
