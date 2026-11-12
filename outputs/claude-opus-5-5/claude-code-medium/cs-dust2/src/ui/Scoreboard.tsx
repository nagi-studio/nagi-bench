import type { HudState } from '../game/client/store.ts';
import type { Team } from '../game/core/entity.ts';

export function Scoreboard({ hud }: { hud: HudState }) {
  const teams: Team[] = ['CT', 'T'];
  return (
    <div className="scoreboard">
      <div className="sb-title">
        回合 {hud.round} · 先赢 {hud.winsToMatch} 回合获胜
      </div>
      {teams.map((t) => (
        <div key={t} className={`sb-team ${t.toLowerCase()}`}>
          <div className="sb-team-head">
            <span>{t === 'CT' ? '反恐精英 CT' : '恐怖分子 T'}</span>
            <span className="sb-score">{hud.score[t]}</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>玩家</th>
                <th>击杀</th>
                <th>死亡</th>
                <th>HP</th>
              </tr>
            </thead>
            <tbody>
              {hud.scores
                .filter((r) => r.team === t)
                .map((r) => (
                  <tr key={r.id} className={`${r.alive ? '' : 'dead'} ${r.isControlled ? 'me' : ''}`}>
                    <td>
                      {r.name}
                      {r.isPlayer ? '' : ' [BOT]'}
                      {r.isControlled && !r.isPlayer ? ' (你在操控)' : ''}
                    </td>
                    <td>{r.kills}</td>
                    <td>{r.deaths}</td>
                    <td>{r.alive ? r.hp : '阵亡'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
