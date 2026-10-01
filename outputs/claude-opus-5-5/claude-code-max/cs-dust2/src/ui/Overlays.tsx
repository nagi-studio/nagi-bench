import { useState } from 'react';
import { ROUND_END_TEXT, TEAM_NAME, type MatchSettings, type Team } from '../game/core/types';
import { BUY_KEYS, type GameEngine } from '../game/engine/GameEngine';
import { useStore } from '../game/engine/Store';
import { WEAPONS } from '../game/weapons/WeaponDefs';
import { ControlsHelp } from './ControlsHelp';

const teamClass = (t: Team) => (t === 'CT' ? 'ct' : 't');

export function BuyMenu({ engine }: { engine: GameEngine }) {
  const s = useStore(engine.hud, (h) => ({ open: h.buyOpen, pistol: h.pistolRound, team: h.playerTeam, w: h.slots }));
  if (!s.open) return null;
  return (
    <div className="buy-menu">
      <div className="buy-head">
        <span>购买菜单</span>
        <em>{s.pistol ? '手枪局：仅可选择手枪' : '自由购买（原型无经济系统）'} · 数字键购买 · B 关闭</em>
      </div>
      <div className="buy-grid">
        {BUY_KEYS.map((b) => {
          const isArmor = b.item === 'armor';
          const def = isArmor ? null : WEAPONS[b.item as Exclude<typeof b.item, 'armor'>];
          const disabled = !isArmor && def!.slot === 0 && s.pistol;
          const owned = !isArmor && s.w.some((x) => x.id === def!.id);
          return (
            <button
              key={b.key}
              type="button"
              className={`buy-item ${disabled ? 'disabled' : ''} ${owned ? 'owned' : ''}`}
              disabled={disabled}
              onMouseDown={(e) => {
                e.stopPropagation();
                engine.buy(b.item);
              }}
            >
              <kbd>{b.key}</kbd>
              <div className="buy-name">{isArmor ? '防弹衣 + 头盔' : def!.name}</div>
              <div className="buy-meta">
                {isArmor
                  ? '护甲 100（手枪局无头盔）'
                  : `伤害 ${def!.damage} · ${def!.automatic ? '全自动' : '半自动'} · 弹匣 ${def!.magSize}${def!.team !== 'any' ? ` · ${def!.team} 默认` : ''}`}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Scoreboard({ engine }: { engine: GameEngine }) {
  const s = useStore(engine.hud, (h) => ({ open: h.scoreboardOpen, rows: h.scoreboard, ct: h.scoreCT, t: h.scoreT, history: h.history }));
  if (!s.open) return null;
  const sorted = (team: Team) => s.rows.filter((r) => r.team === team).sort((a, b) => b.kills - a.kills || a.deaths - b.deaths);
  return (
    <div className="scoreboard">
      {(['CT', 'T'] as Team[]).map((team) => (
        <div key={team} className={`sb-team ${teamClass(team)}`}>
          <div className="sb-head">
            <span>{TEAM_NAME[team]}</span>
            <span className="sb-score">{team === 'CT' ? s.ct : s.t}</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>玩家</th>
                <th>击杀</th>
                <th>死亡</th>
                <th>爆头</th>
                <th>伤害</th>
              </tr>
            </thead>
            <tbody>
              {sorted(team).map((r) => (
                <tr key={r.id} className={`${r.alive ? '' : 'dead'} ${r.isHuman ? 'me' : ''}`}>
                  <td>
                    {r.name}
                    {r.isHuman ? '（你）' : ' BOT'}
                    {r.isControlled && !r.isHuman ? ' · 操控中' : ''}
                    {r.hasBomb ? ' 💣' : ''}
                  </td>
                  <td>{r.kills}</td>
                  <td>{r.deaths}</td>
                  <td>{r.headshots}</td>
                  <td>{r.damage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      <div className="sb-history">
        {s.history.map((h, i) => (
          <span key={i} className={`hist ${teamClass(h.winner)}`} title={ROUND_END_TEXT[h.reason]}>
            {h.reason === 'bomb_exploded' ? '💥' : h.reason === 'bomb_defused' ? '✂' : h.reason === 'time_expired' ? '⏱' : '☠'}
          </span>
        ))}
      </div>
    </div>
  );
}

export function PauseMenu({ engine, onExit }: { engine: GameEngine; onExit: (s?: MatchSettings) => void }) {
  const [sens, setSens] = useState(engine.currentSettings.sensitivity);
  const [vol, setVol] = useState(engine.currentSettings.volume);
  const ready = useStore(engine.hud, (h) => h.ready);
  const started = useStore(engine.hud, (h) => h.started);
  const team = useStore(engine.hud, (h) => h.playerTeam);
  if (!ready) return null;
  return (
    <div className="pause" onClick={(e) => e.stopPropagation()}>
      <div className="pause-card">
        <h2>{started ? '已暂停' : `准备就绪 · 你是${team === 'CT' ? '反恐精英（CT）' : '恐怖分子（T）'}`}</h2>
        {!started && (
          <p className="pause-intro">
            {team === 'CT'
              ? '目标：守住 A / B 炸弹点，消灭全部恐怖分子，或在炸弹爆炸前拆除它（按住 E）。'
              : '目标：携带 C4 的队友会推进到 A 或 B 点安放炸弹；消灭全部反恐精英或让炸弹爆炸即可获胜。'}
          </p>
        )}
        <button
          className="start-btn"
          type="button"
          onClick={() => {
            engine.resume();
          }}
        >
          {started ? '点击继续游戏（锁定鼠标）' : '点击进入战斗（锁定鼠标）'}
        </button>
        <div className="pause-grid">
          <div>
            <h3>
              鼠标灵敏度 <em>{sens.toFixed(2)}</em>
            </h3>
            <input
              type="range"
              min={0.3}
              max={6}
              step={0.05}
              value={sens}
              onChange={(e) => {
                const v = Number(e.target.value);
                setSens(v);
                engine.setSensitivity(v);
              }}
            />
            <h3>
              音量 <em>{Math.round(vol * 100)}%</em>
            </h3>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={vol}
              onChange={(e) => {
                const v = Number(e.target.value);
                setVol(v);
                engine.setVolume(v);
              }}
            />
            <button className="btn ghost" type="button" onClick={() => onExit({ ...engine.currentSettings })}>
              退出到主菜单
            </button>
          </div>
          <ControlsHelp compact />
        </div>
      </div>
    </div>
  );
}

export function MatchOver({ engine, onExit }: { engine: GameEngine; onExit: (s?: MatchSettings) => void }) {
  const s = useStore(engine.hud, (h) => ({ winner: h.matchWinner, ct: h.scoreCT, t: h.scoreT, rows: h.scoreboard, team: h.playerTeam }));
  if (!s.winner) return null;
  const win = s.winner === s.team;
  const best = [...s.rows].sort((a, b) => b.kills - a.kills)[0];
  return (
    <div className="pause">
      <div className={`pause-card matchover ${teamClass(s.winner)}`}>
        <h2>{win ? '胜利！' : '失败'}</h2>
        <div className="mo-score">
          <span className="ct">CT {s.ct}</span> : <span className="t">{s.t} T</span>
        </div>
        <div className="mo-sub">{TEAM_NAME[s.winner]}赢得了比赛</div>
        {best && (
          <div className="mo-mvp">
            MVP：{best.name}（{best.kills} 杀 / {best.deaths} 死）
          </div>
        )}
        <div className="mo-actions">
          <button
            className="start-btn"
            type="button"
            onClick={() => {
              engine.restartMatch();
              engine.resume();
            }}
          >
            再来一局
          </button>
          <button className="btn ghost" type="button" onClick={() => onExit({ ...engine.currentSettings })}>
            返回主菜单
          </button>
        </div>
      </div>
    </div>
  );
}
