/**
 * 2D overlay: crosshair, vitals, ammo, kill feed, bomb timers, radar,
 * scoreboard, death / spectate states and the AWP scope.
 */

import { useEffect, useRef } from 'react';
import type { Snapshot } from '../game/game';
import type { WeaponId } from '../game/weapons';
import type { Bomb, Combatant } from '../game/types';
import type { NavGrid } from '../game/map/grid';
import { Minimap } from './Minimap';

const WEAPON_LABEL: Record<string, string> = {
  ak47: 'AK-47', m4a4: 'M4A4', awp: 'AWP', glock: 'GLOCK',
  usp: 'USP-S', deagle: 'DEAGLE', knife: 'KNIFE',
};

interface HudProps {
  snap: Snapshot;
  grid: NavGrid;
  combatants: Combatant[];
  bomb: Bomb;
  cameraId: number | null;
  cameraYaw: number;
  scoreboardOpen: boolean;
}

// ---------------------------------------------------------------------------

function Crosshair({ spread, scoped, hidden }: { spread: number; scoped: boolean; hidden: boolean }) {
  if (hidden || scoped) return null;
  const gap = Math.min(34, 5 + spread * 620);
  const len = 8;
  const c = 30;
  const style = (w: number, h: number, l: number, t: number): React.CSSProperties => ({
    width: w, height: h, left: l, top: t,
  });
  return (
    <div className="crosshair">
      <i style={style(2, len, c - 1, c - gap - len)} />
      <i style={style(2, len, c - 1, c + gap)} />
      <i style={style(len, 2, c - gap - len, c - 1)} />
      <i style={style(len, 2, c + gap, c - 1)} />
      <i className="dot" style={{ left: 29, top: 29 }} />
    </div>
  );
}

function HitMarker({ headshot, killed }: { headshot: boolean; killed: boolean }) {
  const s = killed ? 13 : 9;
  const len = killed ? 11 : 8;
  const c = 17;
  return (
    <div className={`hitmarker${headshot ? ' head' : ''}`}>
      <i style={{ width: 2, height: len, left: c - 1, top: c - s - len }} />
      <i style={{ width: 2, height: len, left: c - 1, top: c + s }} />
      <i style={{ width: len, height: 2, left: c - s - len, top: c - 1 }} />
      <i style={{ width: len, height: 2, left: c + s, top: c - 1 }} />
    </div>
  );
}

function ScopeOverlay() {
  return (
    <div className="scope-wrap">
      <div className="scope-mask" />
      <div className="scope-ring" />
      <div className="scope-cross">
        <i style={{ left: '50%', top: 0, width: 1.5, height: '100%', marginLeft: -0.75 }} />
        <i style={{ top: '50%', left: 0, height: 1.5, width: '100%', marginTop: -0.75 }} />
      </div>
      {[0, 1, 2, 3].map((q) => (
        <div key={q}>
          {[1, 2, 3].map((k) => {
            const off = 6 + k * 5;
            const vertical = q % 2 === 0;
            return (
              <div
                key={k}
                className="scope-tick"
                style={vertical
                  ? { left: '50%', top: `calc(50% + ${q < 2 ? off : -off}vmin)`, width: k === 2 ? 9 : 6, height: 1.5, marginLeft: -3 }
                  : { top: '50%', left: `calc(50% + ${q === 1 ? off : -off}vmin)`, height: k === 2 ? 9 : 6, width: 1.5, marginTop: -3 }}
              />
            );
          })}
        </div>
      ))}
      <div style={{
        position: 'absolute', left: '50%', top: '50%', width: 3, height: 3,
        marginLeft: -1.5, marginTop: -1.5, background: '#000', borderRadius: '50%',
      }} />
    </div>
  );
}

// ---------------------------------------------------------------------------

export function HUD({ snap, grid, combatants, bomb, cameraId, cameraYaw, scoreboardOpen }: HudProps) {
  const self = snap.self;
  const round = snap.round;
  const camTeam = self?.team ?? 'CT';
  const lastHit = useRef(0);

  useEffect(() => {
    if (snap.hitmarker) lastHit.current = performance.now();
  }, [snap.hitmarker]);

  const lowHp = !!self && self.alive && self.health <= 30;
  const timeStr = `${Math.floor(Math.max(0, round.timeLeft) / 60)}:${String(Math.floor(Math.max(0, round.timeLeft) % 60)).padStart(2, '0')}`;

  return (
    <div className="hud">
      {self && !self.alive && <div className="dead-overlay" />}
      {lowHp && <div className="low-hp" />}
      {self && self.hitFlash > 0.02 && (
        <div className="vignette" style={{ opacity: self.hitFlash }} />
      )}

      {/* ---------- top: round info ---------- */}
      <div className="top-bar">
        <div className="score">
          <span className="ct">{round.scoreCT}</span>
          <span className="sep">:</span>
          <span className="t">{round.scoreT}</span>
        </div>
        <div className={`timer${round.timeLeft < 20 && round.phase === 'live' ? ' urgent' : ''}`}>
          {round.phase === 'freeze' ? `准备 ${Math.ceil(round.timeLeft)}` : timeStr}
        </div>
        <div className="alive">
          <span><b style={{ color: 'var(--ct)' }}>{snap.aliveCT}</b> CT</span>
          <span><b style={{ color: 'var(--t)' }}>{snap.aliveT}</b> T</span>
        </div>
      </div>

      {/* ---------- kill feed ---------- */}
      <div className="killfeed">
        {snap.killfeed.slice().reverse().map((k) => (
          <div key={k.id} className={`kf-row${k.killerId === self?.id || k.victimId === self?.id ? ' me' : ''}`}>
            <span className={k.killerTeam === 'CT' ? 'ct' : 't'}>{k.killerName}</span>
            <span className="w">{WEAPON_LABEL[k.weapon] ?? k.weapon}</span>
            {k.headshot && <span className="hs">HS</span>}
            <span className="w">›</span>
            <span className={k.victimTeam === 'CT' ? 'ct' : 't'}>{k.victimName}</span>
          </div>
        ))}
      </div>

      {/* ---------- banner ---------- */}
      {snap.banner && <div className="banner">{snap.banner}</div>}

      {/* ---------- bomb ---------- */}
      {bomb.state === 'planted' && (
        <div className="bomb-panel">
          <div className="bt">{bomb.timer.toFixed(1)}</div>
          <div className="bl">C4 已安放于 {bomb.site} 点 — 按 E 拆除</div>
          <div className="bomb-track"><span style={{ width: `${(bomb.timer / 40) * 100}%` }} /></div>
        </div>
      )}
      {self && self.plantProgress > 0.01 && bomb.state !== 'planted' && (
        <div className="plant-panel">
          <div className="pl">正在安放 C4… 保持静止</div>
          <div className="plant-track"><span style={{ width: `${self.plantProgress * 100}%` }} /></div>
        </div>
      )}
      {self && self.defuseProgress > 0.01 && bomb.state === 'planted' && (
        <div className="plant-panel defuse">
          <div className="pl">{self.kit ? '拆弹钳' : '手动'}拆除中… 保持静止</div>
          <div className="plant-track"><span style={{ width: `${self.defuseProgress * 100}%` }} /></div>
        </div>
      )}
      {self && self.canPlant && bomb.state !== 'planted' && self.plantProgress < 0.01 && (
        <div className="plant-panel">
          <div className="pl">在 {snap.attackSite === 'A' ? 'A' : 'B'} 点按住 <b>E</b> 安放 C4</div>
        </div>
      )}

      {/* ---------- crosshair / scope ---------- */}
      <Crosshair
        spread={self?.spread ?? 0}
        scoped={!!self?.scoped}
        hidden={!self || !self.alive || scoreboardOpen}
      />
      {self?.scoped && <ScopeOverlay />}
      {snap.hitmarker && (
        <HitMarker headshot={snap.hitmarker.headshot} killed={snap.hitmarker.killed} />
      )}

      {/* ---------- damage direction ---------- */}
      {self && self.hitFlash > 0.05 && self.alive && (
        <div className="damage-dir">
          <i style={{ transform: `rotate(${(self.hitFromAngle + cameraYaw) * (180 / Math.PI)}deg)`, opacity: self.hitFlash }} />
        </div>
      )}

      {/* ---------- bottom: vitals + ammo ---------- */}
      {self && (
        <div className="bottom-bar">
          <div className="vitals">
            <div className="vital-row">
              <div className="vital-icon" style={{ color: 'var(--hp)' }}>♥</div>
              <div className="vital-bar">
                <span style={{
                  width: `${self.health}%`,
                  background: self.health > 40 ? 'var(--hp)' : 'var(--hp-low)',
                }} />
              </div>
              <div className="vital-num">{self.health}</div>
            </div>
            <div className="vital-row">
              <div className="vital-icon" style={{ color: 'var(--armor)' }}>🛡</div>
              <div className="vital-bar">
                <span style={{ width: `${Math.min(100, self.armor)}%`, background: 'var(--armor)' }} />
              </div>
              <div className="vital-num">{self.armor}{self.helmet ? <small>盔</small> : null}</div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--dim)', marginTop: 2 }}>
              {self.hasBomb ? '★ 你携带 C4' : self.team === 'CT' ? (self.kit ? '拆弹钳 · 5 秒拆除' : '无拆弹钳 · 10 秒拆除') : `进攻目标 ${snap.attackSite} 点`}
            </div>
          </div>

          <div className="ammo-block">
            <div className="ammo-name">{WEAPON_LABEL[self.weaponId as WeaponId] ?? self.weaponName}</div>
            {self.weaponId !== 'knife' ? (
              <div className="ammo-main">
                {self.ammo}<span className="reserve"> / {self.reserve}</span>
              </div>
            ) : (
              <div className="ammo-main" style={{ fontSize: 22 }}>近战</div>
            )}
            <div className="ammo-reloading">
              {self.reloading ? '换弹中…' : (self.ammo === 0 && self.weaponId !== 'knife' ? '按 R 换弹' : '')}
            </div>
            {self.reloading && (
              <div className="reload-track"><span style={{ width: `${self.reloadProgress * 100}%` }} /></div>
            )}
            <div className="slot-row">
              {self.hasPrimary && <span className={`slot-chip${self.slot === 'primary' ? ' on' : ''}`}>1 主武器</span>}
              {self.hasSecondary && <span className={`slot-chip${self.slot === 'secondary' ? ' on' : ''}`}>2 副武器</span>}
              <span className={`slot-chip${self.slot === 'melee' ? ' on' : ''}`}>3 刀</span>
            </div>
          </div>
        </div>
      )}

      {/* ---------- radar ---------- */}
      <Minimap
        grid={grid}
        combatants={combatants}
        bomb={bomb}
        cameraId={cameraId}
        cameraTeam={camTeam}
        yaw={cameraYaw}
      />

      {/* ---------- spectate ---------- */}
      {snap.spectate && (
        <div className="spectate-bar">
          <div>观战 <b>{snap.spectate.name}</b></div>
          <div className="hint">滚轮切换队友 · 按 F 接管操控 · 你仍可继续本回合</div>
        </div>
      )}

      {/* ---------- hints ---------- */}
      {(!snap.spectate) && (
        <div className="hint-corner">
          <b>Tab</b> 计分板 · <b>Esc</b> 暂停<br />
          <b>1/2/3</b> 切换武器 · <b>R</b> 换弹
        </div>
      )}

      {/* ---------- scoreboard ---------- */}
      {scoreboardOpen && (
        <div className="scoreboard">
          <h3>第 {round.number} 回合 · {round.isPistol ? '手枪局' : '长枪局'} — CT {round.scoreCT} : {round.scoreT} T</h3>
          {(['CT', 'T'] as const).map((team) => (
            <div key={team} className={`sb-team ${team.toLowerCase()}`}>
              <div className="th">{team === 'CT' ? '反恐精英 (CT)' : '恐怖分子 (T)'} — {team === 'CT' ? snap.aliveCT : snap.aliveT} 存活</div>
              <table className="sb-table">
                <thead>
                  <tr>
                    <th>玩家</th><th className="num">击杀</th><th className="num">死亡</th>
                    <th className="num">伤害</th><th className="num">生命</th><th className="num">护甲</th>
                  </tr>
                </thead>
                <tbody>
                  {snap.players.filter((p) => p.team === team).map((p) => (
                    <tr key={p.id} className={`${p.alive ? '' : 'dead'} ${p.id === self?.id ? 'me' : ''}`}>
                      <td className="nm">
                        {p.isHuman ? '★ ' : ''}{p.name}{p.hasBomb ? ' 💼' : ''}
                      </td>
                      <td className="num">{p.kills}</td>
                      <td className="num">{p.deaths}</td>
                      <td className="num">{p.damage}</td>
                      <td className="num">{p.alive ? p.health : '—'}</td>
                      <td className="num">{p.alive ? p.armor : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
