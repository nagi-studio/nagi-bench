import { useSyncExternalStore } from 'react';
import type { GameClient } from '../client/gameClient.ts';
import type { HudState } from '../client/hudStore.ts';
import { Crosshair } from './Crosshair.tsx';
import { Minimap } from './Minimap.tsx';

interface Props {
  client: GameClient;
  onExit: () => void;
}

const fmtTime = (t: number) => {
  const s = Math.max(0, Math.ceil(t));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

const teamLabel = (t: 'CT' | 'T') => (t === 'CT' ? '反恐精英' : '恐怖分子');

export function Hud({ client, onExit }: Props) {
  const s = useSyncExternalStore(client.hud.subscribe, client.hud.getSnapshot);
  const v = s.view;
  return (
    <div className="hud">
      {v.scoped && v.alive && <ScopeOverlay />}
      <Crosshair client={client} />
      <div className="hud-tl">
        <Minimap client={client} />
        <div className="round-tag">
          第 {s.round} 回合 · {s.pistol ? <b className="pistol">手枪局</b> : '长枪局'}
        </div>
      </div>
      <TopBar s={s} />
      <Killfeed s={s} />
      {s.hit.id > 0 && <div key={`h${s.hit.id}`} className={`hitmarker ${s.hit.head ? 'head' : ''} ${s.hit.kill ? 'kill' : ''}`} />}
      {s.damage.id > 0 && (
        <div key={`d${s.damage.id}`} className="dmg-indicator" style={{ transform: `translate(-50%, -50%) rotate(${s.damage.angle}rad)` }}>
          <div className="dmg-arc" />
        </div>
      )}
      {s.damage.id > 0 && <div key={`f${s.damage.id}`} className="dmg-flash" />}
      {s.message && (
        <div key={s.message.id} className="center-msg">
          <div className="cm-title" style={{ color: s.message.color }}>
            {s.message.title}
          </div>
          {s.message.sub && <div className="cm-sub">{s.message.sub}</div>}
        </div>
      )}
      {s.progress && (
        <div className="progress">
          <div className="progress-label">{s.progress.label}</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${s.progress.value * 100}%`, background: s.progress.color }} />
          </div>
        </div>
      )}
      {s.hint && !s.progress && <div className="hint">{s.hint}</div>}
      {v.alive && <Vitals s={s} />}
      {v.alive && <Ammo s={s} />}
      {s.spectating && (
        <div className="spectate">
          <div className="spec-title">
            正在观察 <b className={v.team}>{v.name}</b>
          </div>
          <div className="spec-sub">
            左键/右键 切换 {s.canTakeover && <> · <kbd>E</kbd> 接管该队友</>}
          </div>
        </div>
      )}
      {!v.alive && !s.spectating && s.phase !== 'matchover' && <div className="spectate dead">你已阵亡</div>}
      {s.buyOpen && <BuyMenu s={s} client={client} />}
      {s.scoreboard && <Scoreboard s={s} />}
      <div className="fps">{s.fps} FPS</div>
      {!s.locked && !s.matchOver && <PauseOverlay started={s.started} client={client} onExit={onExit} />}
      {s.matchOver && <MatchOver s={s} client={client} onExit={onExit} />}
    </div>
  );
}

function ScopeOverlay() {
  return (
    <div className="scope">
      <div className="scope-mask" />
      <div className="scope-line h" />
      <div className="scope-line v" />
    </div>
  );
}

function TopBar({ s }: { s: HudState }) {
  const planted = s.bomb.state === 'planted';
  const aliveIcons = (team: 'CT' | 'T') => {
    const members = s.rows.filter((r) => r.team === team);
    return members.map((r) => <span key={r.id} className={`pip ${team} ${r.alive ? '' : 'dead'} ${r.me ? 'me' : ''}`} />);
  };
  return (
    <div className="topbar">
      <div className="tb-side CT">
        <div className="tb-pips">{aliveIcons('CT')}</div>
        <div className="tb-score">{s.score.CT}</div>
      </div>
      <div className={`tb-timer ${planted ? 'planted' : ''} ${s.phase === 'freeze' ? 'freeze' : ''}`}>
        {planted ? (
          <>
            <span className="c4-icon">C4</span>
            {fmtTime(s.bomb.timeLeft)}
          </>
        ) : s.phase === 'over' || s.phase === 'matchover' ? (
          '—'
        ) : (
          fmtTime(s.timeLeft)
        )}
        <div className="tb-phase">{s.phase === 'freeze' ? '准备阶段' : planted ? `${s.bomb.site} 点已安放` : ''}</div>
      </div>
      <div className="tb-side T">
        <div className="tb-score">{s.score.T}</div>
        <div className="tb-pips">{aliveIcons('T')}</div>
      </div>
    </div>
  );
}

function Killfeed({ s }: { s: HudState }) {
  return (
    <div className="killfeed">
      {s.killfeed.map((k) => (
        <div key={k.id} className={`kf-row ${k.involvesMe ? 'me' : ''}`}>
          {k.killer && <span className={`kf-name ${k.killerTeam}`}>{k.killer}</span>}
          <span className="kf-weapon">{k.weapon}</span>
          {k.headshot && <span className="kf-hs" title="爆头">◎</span>}
          <span className={`kf-name ${k.victimTeam}`}>{k.victim}</span>
        </div>
      ))}
    </div>
  );
}

function Vitals({ s }: { s: HudState }) {
  const v = s.view;
  const low = v.health <= 25;
  return (
    <div className="vitals">
      <div className={`vital hp ${low ? 'low' : ''}`}>
        <span className="vi-icon">✚</span>
        <span className="vi-num">{v.health}</span>
        <div className="vi-bar">
          <div style={{ width: `${v.health}%` }} />
        </div>
      </div>
      <div className="vital ar">
        <span className="vi-icon">{v.helmet ? '⛨' : '◈'}</span>
        <span className="vi-num">{v.armor}</span>
        <div className="vi-bar armor">
          <div style={{ width: `${v.armor}%` }} />
        </div>
      </div>
      <div className="vi-tags">
        {v.helmet && <span>头盔</span>}
        {v.kit && <span>拆弹器</span>}
        {v.hasBomb && <span className="bomb">C4</span>}
        {!v.self && <span className="spec">{v.name}</span>}
      </div>
    </div>
  );
}

function Ammo({ s }: { s: HudState }) {
  const v = s.view;
  const isGun = v.magSize > 0;
  const low = isGun && v.mag <= Math.ceil(v.magSize * 0.2);
  return (
    <div className="ammo-panel">
      <div className="inventory">
        {v.inventory.map((i) => (
          <div key={i.slot} className={`inv ${i.active ? 'active' : ''}`}>
            <span className="inv-key">{i.key}</span>
            <span className="inv-name">{i.name}</span>
          </div>
        ))}
      </div>
      <div className="ammo">
        <div className="ammo-weapon">{v.weapon}</div>
        {isGun ? (
          <div className="ammo-nums">
            <span className={`ammo-mag ${low ? 'low' : ''}`}>{v.mag}</span>
            <span className="ammo-sep">/</span>
            <span className="ammo-res">{v.reserve}</span>
          </div>
        ) : (
          <div className="ammo-nums">
            <span className="ammo-mag">∞</span>
          </div>
        )}
        {isGun && (
          <div className="ammo-bullets">
            {Array.from({ length: Math.min(v.magSize, 30) }).map((_, i) => (
              <span key={i} className={i < Math.round((v.mag / v.magSize) * Math.min(v.magSize, 30)) ? 'on' : ''} />
            ))}
          </div>
        )}
        {v.reloading && (
          <div className="reload">
            换弹中
            <div className="reload-bar">
              <div style={{ width: `${v.reloadP * 100}%` }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function BuyMenu({ s, client }: { s: HudState; client: GameClient }) {
  return (
    <div className="buy">
      <div className="buy-title">购买菜单 <span>（按数字键购买，B 关闭）</span></div>
      {s.buyItems.map((it) => (
        <div key={it.id} className={`buy-item ${it.owned ? 'owned' : ''}`} onMouseDown={() => client.buy(it.id)}>
          <kbd>{it.key}</kbd>
          <span className="buy-name">{it.name}</span>
          {it.owned && <span className="buy-owned">已装备</span>}
        </div>
      ))}
      <div className="buy-note">选择会保留到后续长枪局。手枪局不可购买。</div>
    </div>
  );
}

function Scoreboard({ s }: { s: HudState }) {
  const team = (t: 'CT' | 'T') => (
    <div className={`sb-team ${t}`}>
      <div className="sb-head">
        <span>{teamLabel(t)}</span>
        <span className="sb-score">{s.score[t]}</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>玩家</th>
            <th>击杀</th>
            <th>死亡</th>
            <th>爆头</th>
          </tr>
        </thead>
        <tbody>
          {s.rows
            .filter((r) => r.team === t)
            .sort((a, b) => b.kills - a.kills)
            .map((r) => (
              <tr key={r.id} className={`${r.alive ? '' : 'dead'} ${r.me ? 'me' : ''}`}>
                <td>
                  {r.name} {r.bot && <span className="bot">BOT</span>} {r.bomb && <span className="bomb">C4</span>}
                </td>
                <td>{r.kills}</td>
                <td>{r.deaths}</td>
                <td>{r.hs}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
  return (
    <div className="scoreboard">
      <div className="sb-title">Dust II · 第 {s.round} 回合</div>
      {team('CT')}
      {team('T')}
    </div>
  );
}

function PauseOverlay({ started, client, onExit }: { started: boolean; client: GameClient; onExit: () => void }) {
  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && client.requestLock()}>
      <div className="panel">
        <h2>{started ? '已暂停' : 'Dust II · 5v5'}</h2>
        <p>{started ? '点击继续游戏' : '点击进入游戏（将锁定鼠标）'}</p>
        <button className="primary" onClick={() => client.requestLock()}>
          {started ? '继续' : '进入游戏'}
        </button>
        <div className="panel-row">
          <label>灵敏度</label>
          <input
            type="range"
            min={0.2}
            max={3}
            step={0.05}
            defaultValue={client.opts.sensitivity}
            onChange={(e) => client.setSensitivity(Number(e.target.value))}
          />
        </div>
        <div className="panel-row">
          <label>音量</label>
          <input type="range" min={0} max={1} step={0.05} defaultValue={client.opts.volume} onChange={(e) => client.setVolume(Number(e.target.value))} />
        </div>
        <button onClick={onExit}>返回主菜单</button>
      </div>
    </div>
  );
}

function MatchOver({ s, client, onExit }: { s: HudState; client: GameClient; onExit: () => void }) {
  const win = s.matchOver!.winner === s.playerTeam;
  return (
    <div className="overlay">
      <div className="panel">
        <h2 className={win ? 'win' : 'lose'}>{win ? '胜利！' : '失败'}</h2>
        <p>
          {teamLabel(s.matchOver!.winner)} 赢得比赛 · CT {s.score.CT} : {s.score.T} T
        </p>
        <button
          className="primary"
          onClick={() => {
            client.restartMatch();
            client.requestLock();
          }}
        >
          再来一局
        </button>
        <button onClick={onExit}>返回主菜单</button>
      </div>
    </div>
  );
}
