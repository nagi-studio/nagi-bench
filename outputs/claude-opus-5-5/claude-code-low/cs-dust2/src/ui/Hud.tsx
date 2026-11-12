import { useCallback, type CSSProperties } from 'react';
import type { Game, HudSnapshot } from '../game/game';

function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  return `${m}:${ss.toString().padStart(2, '0')}`;
}

export function Hud({ game, s }: { game: Game; s: HudSnapshot }) {
  const minimapRef = useCallback((c: HTMLCanvasElement | null) => game.setMinimapCanvas(c), [game]);
  const now = performance.now();
  const hitAge = now - s.hitmarker;
  const lowAmmo = s.magSize > 0 && s.mag <= Math.ceil(s.magSize * 0.25);

  return (
    <div className="hud">
      {/* ---------- top bar: score / time */}
      <div className="topbar">
        <div className="score ct">
          <span className="alive">{s.aliveCT}</span>
          <b>{s.scoreCT}</b>
        </div>
        <div className={`timer ${s.bombState === 'planted' ? 'bomb' : ''}`}>
          {s.bombState === 'planted' ? <span className="c4">C4 {s.bombSite}</span> : null}
          {s.phase === 'freeze' ? <small>准备</small> : null}
          {fmtTime(s.timeLeft)}
          <small>
            第 {s.round} 回合{s.pistolRound ? ' · 手枪局' : ''}
          </small>
        </div>
        <div className="score t">
          <b>{s.scoreT}</b>
          <span className="alive">{s.aliveT}</span>
        </div>
      </div>

      {/* ---------- minimap */}
      <div className="minimap">
        <canvas ref={minimapRef} width={200} height={234} />
      </div>

      {/* ---------- killfeed */}
      <div className="killfeed">
        {s.killfeed.map((k) => (
          <div key={k.id} className="kill">
            <span className={k.killerTeam === 'CT' ? 'ctc' : 'tc'}>{k.killer}</span>
            <span className="weapon">
              {k.weapon}
              {k.headshot ? ' ⊕' : ''}
            </span>
            <span className={k.victimTeam === 'CT' ? 'ctc' : 'tc'}>{k.victim}</span>
          </div>
        ))}
      </div>

      {/* ---------- crosshair / scope */}
      {s.scoped ? (
        <div className="scope">
          <div className="scope-ring" />
          <div className="scope-h" />
          <div className="scope-v" />
        </div>
      ) : (
        s.alive && (
          <div className="crosshair" style={{ '--gap': `${s.crosshairGap}px` } as CSSProperties}>
            <i className="l" />
            <i className="r" />
            <i className="u" />
            <i className="d" />
            <i className="dot" />
          </div>
        )
      )}
      {hitAge < 220 && <div className={`hitmarker ${s.hitHead ? 'head' : ''}`} style={{ opacity: 1 - hitAge / 220 }} />}

      {/* ---------- damage direction */}
      {s.damageDirs.map((d, i) => (
        <div
          key={i}
          className="dmgdir"
          style={{ transform: `translate(-50%,-50%) rotate(${-d.angle}rad) translateY(-120px)`, opacity: 1 - (now - d.t) / 1200 }}
        />
      ))}

      {/* ---------- centre message & action bar */}
      {s.message && (
        <div className="message" style={{ color: s.messageColor }}>
          {s.message}
        </div>
      )}
      {s.actionLabel && (
        <div className="action">
          <div>{s.actionLabel}</div>
          <div className="bar">
            <div style={{ width: `${Math.min(100, s.actionFrac * 100)}%` }} />
          </div>
        </div>
      )}
      {s.alive && s.hasBomb && s.phase === 'live' && (
        <div className="hint">{s.inSite ? `你在 ${s.inSite} 点 — 按住 E 安放 C4` : '你携带着 C4 — 前往 A 或 B 包点'}</div>
      )}
      {s.alive && s.playerTeam === 'CT' && s.bombState === 'planted' && !s.actionLabel && (
        <div className="hint">C4 已安放在 {s.bombSite} 点 — 靠近炸弹按住 E 拆除</div>
      )}
      {s.canBuy && (
        <div className="buy">
          购买（冻结时间）：<kbd>7</kbd> AK-47 <kbd>8</kbd> M4A4 <kbd>9</kbd> AWP <kbd>0</kbd> 沙鹰
          {s.pistolRound ? <em>（手枪局仅可购买手枪）</em> : null}
        </div>
      )}

      {/* ---------- spectator */}
      {!s.alive && (
        <div className="spectator">
          {s.spectating ? (
            <>
              <div>
                观战：<b>{s.spectating}</b>
              </div>
              <small>左/右键切换队友 · 按 F 接管该队友</small>
            </>
          ) : (
            <div>全队阵亡 — 等待下一回合</div>
          )}
        </div>
      )}

      {/* ---------- bottom left: health/armor */}
      <div className="vitals">
        <div className={`hp ${s.health <= 25 ? 'low' : ''}`}>
          <span className="icon">✚</span>
          {s.health}
        </div>
        <div className="ap">
          <span className="icon">{s.helmet ? '⛑' : '◈'}</span>
          {s.armor}
        </div>
        {s.hasBomb && <div className="c4tag">C4</div>}
      </div>

      {/* ---------- bottom right: weapon / ammo */}
      <div className="weapon-panel">
        <div className="slots">
          {s.slots.map((sl) => (
            <div key={sl.slot} className={sl.slot === s.slot ? 'on' : ''}>
              <kbd>{sl.key}</kbd> {sl.name}
            </div>
          ))}
        </div>
        <div className="wname">{s.weaponName}</div>
        {s.magSize > 0 ? (
          <div className={`ammo ${lowAmmo ? 'low' : ''}`}>
            <b>{s.mag}</b>
            <span>/ {s.reserve}</span>
          </div>
        ) : (
          <div className="ammo">
            <b>∞</b>
          </div>
        )}
        {s.magSize > 0 && (
          <div className="bullets">
            {Array.from({ length: Math.min(s.magSize, 30) }).map((_, i) => (
              <i key={i} className={i < Math.round((s.mag / s.magSize) * Math.min(s.magSize, 30)) ? 'full' : ''} />
            ))}
          </div>
        )}
        {s.reloading && (
          <div className="reload">
            换弹中…
            <div className="bar">
              <div style={{ width: `${Math.min(100, s.reloadFrac * 100)}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* ---------- scoreboard */}
      {(s.showScores || s.matchOver) && (
        <div className="scoreboard">
          {s.matchOver && <h2>{s.matchOver === s.playerTeam ? '胜利！' : '失败'} — 按 Enter 重新开始</h2>}
          {(['CT', 'T'] as const).map((team) => (
            <table key={team} className={team === 'CT' ? 'ctt' : 'tt'}>
              <thead>
                <tr>
                  <th>{team === 'CT' ? `反恐精英 ${s.scoreCT}` : `恐怖分子 ${s.scoreT}`}</th>
                  <th>击杀</th>
                  <th>死亡</th>
                </tr>
              </thead>
              <tbody>
                {s.scoreboard
                  .filter((p) => p.team === team)
                  .map((p) => (
                    <tr key={p.name} className={`${p.alive ? '' : 'dead'} ${p.isPlayer ? 'me' : ''}`}>
                      <td>{p.name}</td>
                      <td>{p.kills}</td>
                      <td>{p.deaths}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ))}
        </div>
      )}
      <div className="fps">{s.fps} FPS</div>
    </div>
  );
}
