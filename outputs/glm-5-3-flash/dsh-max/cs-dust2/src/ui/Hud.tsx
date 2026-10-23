/**
 * Hud.tsx — the 2D overlay: crosshair, health/armour, ammo panel, round
 * timer + score, killfeed, prompt, messages, scoreboard, scope mask.
 */

import { useEffect, useState } from 'react';
import type { HudSnapshot, KillEvent } from '../game/bridge';

function fmtTime(t: number): string {
  const s = Math.max(0, Math.ceil(t));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function KillfeedRow({ k }: { k: KillEvent }) {
  return (
    <div className={`kf-row ${k.killerTeam === 'CT' ? 'kf-ct' : 'kf-t'}`}>
      <span className="kf-name">{k.killer}</span>
      <span className="kf-wep">{k.headshot ? '☠ HS' : ''} {k.weapon}</span>
      <span className={`kf-name ${k.victimTeam === 'CT' ? 'kf-ct' : 'kf-t'}`}>{k.victim}</span>
    </div>
  );
}

function TeamPips({ alive, total, color }: { alive: number; total: number; color: string }) {
  return (
    <div className="pips">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className="pip" style={{ background: i < alive ? color : 'rgba(255,255,255,0.18)' }} />
      ))}
    </div>
  );
}

export function Hud({ hud }: { hud: HudSnapshot }) {
  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => { if (e.code === 'Tab') { e.preventDefault(); setShowScore(true); } };
    const up = (e: KeyboardEvent) => { if (e.code === 'Tab') setShowScore(false); };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);

  const lowHp = hud.hp <= 30;
  const bombPlanted = hud.bombState === 'planted';

  return (
    <div className="hud">
      {/* ---- top center: score + timer ---- */}
      <div className="topbar">
        <div className="score t">{hud.scoreT}</div>
        <div className="mid">
          <div className={`timer ${hud.phase === 'planted' ? 'danger' : ''}`}>
            {bombPlanted ? '💣 ' + Math.ceil(hud.bombTimer) : fmtTime(hud.timeLeft)}
          </div>
          <div className="phase-label">
            {hud.phase === 'freeze' ? '准备时间' : hud.phase === 'planted' ? 'C4 已安放' : `回合 ${hud.round}`}
          </div>
          <div className="pips-row">
            <TeamPips alive={hud.aliveT} total={5} color="#e8b23c" />
            <TeamPips alive={hud.aliveCT} total={5} color="#5aa9ff" />
          </div>
        </div>
        <div className="score ct">{hud.scoreCT}</div>
      </div>

      {/* ---- killfeed ---- */}
      <div className="killfeed">
        {hud.killfeed.map(k => <KillfeedRow key={k.id} k={k} />)}
      </div>

      {/* ---- bottom left: health / armour ---- */}
      <div className={`vitals ${lowHp ? 'low' : ''}`}>
        <div className="vital">
          <span className="vicon">✚</span>
          <span className="vnum">{hud.hp}</span>
        </div>
        <div className="vital">
          <span className="vicon ar">{hud.helmet ? '⛨' : '▣'}</span>
          <span className="vnum dim">{hud.armor}</span>
        </div>
        {hud.hasC4 && <div className="c4tag">C4</div>}
      </div>

      {/* ---- bottom right: ammo ---- */}
      <div className="ammo">
        <div className="wname">{hud.weaponName}</div>
        <div className="ammo-nums">
          {hud.weaponSlot === 'melee'
            ? <span className="melee-label">knife</span>
            : <>
              <span className={`mag ${hud.mag === 0 ? 'empty' : ''}`}>{hud.mag}</span>
              <span className="sep">/</span>
              <span className="reserve">{hud.reserve}</span>
            </>}
        </div>
        {hud.reloading && <div className="reload-tag">换弹中…</div>}
        <div className="slots">
          <span className={hud.weaponSlot === 'primary' ? 'on' : ''}>1</span>
          <span className={hud.weaponSlot === 'secondary' ? 'on' : ''}>2</span>
          <span className={hud.weaponSlot === 'melee' ? 'on' : ''}>3</span>
        </div>
      </div>

      {/* ---- center bottom: prompt + progress ---- */}
      {hud.prompt && <div className="prompt">{hud.prompt}</div>}
      {hud.progressLabel && (
        <div className="progress-wrap">
          <div className="progress-label">{hud.progressLabel}</div>
          <div className="progress"><div className="progress-fill" style={{ width: `${hud.progress * 100}%` }} /></div>
        </div>
      )}

      {/* ---- messages ---- */}
      {hud.message && hud.phase !== 'over' && (
        <div className="message">
          <div className="message-main">{hud.message}</div>
          {hud.messageSub && <div className="message-sub">{hud.messageSub}</div>}
        </div>
      )}

      {/* ---- round result ---- */}
      {hud.phase === 'over' && hud.roundResult && (
        <div className={`round-result ${hud.roundResult === 'T' ? 't' : 'ct'}`}>
          {hud.roundResult === 'T' ? '恐怖分子获胜' : '反恐精英获胜'}
          <div className="rr-sub">{hud.roundReason}</div>
        </div>
      )}

      {/* ---- dead / spectating ---- */}
      {!hud.alive && hud.phase !== 'matchover' && (
        <div className="spectate">
          <div className="spec-title">{hud.spectating ?? '阵亡'}</div>
          <div className="spec-hint">鼠标左键 / 空格 切换队友视角{hud.canTakeOver ? ' · [F] 接管操控' : ''}</div>
        </div>
      )}

      {/* ---- scoreboard ---- */}
      {showScore && (
        <div className="scoreboard">
          <div className="sb-head">
            <span>de_dust2 · 第 {hud.round} 回合</span>
            <span>T {hud.scoreT} : {hud.scoreCT} CT</span>
          </div>
          {(['T', 'CT'] as const).map(team => (
            <div key={team}>
              <div className={`sb-team ${team === 'T' ? 't' : 'ct'}`}>{team === 'T' ? '恐怖分子' : '反恐精英'}</div>
              <table>
                <thead><tr><th>玩家</th><th>K</th><th>D</th><th>$</th></tr></thead>
                <tbody>
                  {hud.players.filter(p => p.team === team).map(p => (
                    <tr key={p.name + team} className={`${p.alive ? '' : 'dead'} ${p.isPlayer ? 'me' : ''}`}>
                      <td>{p.name}{p.hasC4 ? ' 💣' : ''}{p.isPlayer ? ' (你)' : ''}</td>
                      <td>{p.kills}</td>
                      <td>{p.deaths}</td>
                      <td>{p.money}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {/* ---- AWP scope mask ---- */}
      {hud.scoped && (
        <div className="scope">
          <div className="scope-circle" />
          <div className="scope-h" />
          <div className="scope-v" />
        </div>
      )}
    </div>
  );
}
