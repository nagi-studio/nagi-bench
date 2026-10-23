import type { GameEngine } from '../game/engine';
import type { HudSnapshot } from '../game/types';
import { BUY_ITEMS, WEAPONS } from '../game/weapons';
import { Minimap } from './Minimap';

function clock(seconds: number) {
  const safe = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, '0')}`;
}

export function HUD({ engine, snapshot, onExit }: { engine: GameEngine; snapshot: HudSnapshot; onExit: () => void }) {
  const teammates = snapshot.players.filter(p => p.team === snapshot.team);
  const enemiesAlive = snapshot.players.filter(p => p.team !== snapshot.team && p.alive).length;
  const gap = Math.min(35, snapshot.crosshair);
  return (
    <div className="hud">
      <div className="hud-vignette" />
      <div className="top-left">
        <div className="map-heading"><span>TACTICAL MAP</span><b>DUST2 / CORE</b></div>
        <Minimap engine={engine} snapshot={snapshot} />
        <div className="map-legend"><span><i className="friendly-dot" /> FRIENDLY</span><span><i className="enemy-dot" /> SPOTTED</span></div>
      </div>

      <div className="round-header">
        <div className="team-score ct-score"><span>CT</span><b>{snapshot.score.CT}</b></div>
        <div className="round-clock">
          <small>{snapshot.phase === 'freeze' ? 'DEPLOYMENT' : snapshot.phase === 'ended' ? 'ROUND COMPLETE' : `ROUND ${snapshot.round}`}</small>
          <strong className={snapshot.bomb.status === 'planted' ? 'danger' : ''}>{snapshot.bomb.status === 'planted' ? clock(snapshot.bomb.timer) : clock(snapshot.roundTime)}</strong>
          <span>{snapshot.bomb.status === 'planted' ? `C4 ACTIVE · ${snapshot.bomb.site}` : snapshot.phase === 'freeze' ? 'FIRST ROUND · PISTOLS' : `${enemiesAlive} HOSTILES ACTIVE`}</span>
        </div>
        <div className="team-score t-score"><b>{snapshot.score.T}</b><span>T</span></div>
      </div>

      <div className="killfeed">
        {snapshot.killfeed.map(kill => (
          <div className="kill-row" key={kill.id}>
            <span className={kill.killerTeam === 'CT' ? 'ct-text' : 't-text'}>{kill.killer}</span>
            <b>[ {kill.headshot ? 'HEADSHOT · ' : ''}{kill.weapon} ]</b>
            <span className={kill.victimTeam === 'CT' ? 'ct-text' : 't-text'}>{kill.victim}</span>
          </div>
        ))}
      </div>

      {!snapshot.scoped && snapshot.alive && (
        <div className="crosshair" style={{ '--gap': `${gap}px` } as React.CSSProperties}>
          <i className="ch-top" /><i className="ch-right" /><i className="ch-bottom" /><i className="ch-left" /><span />
        </div>
      )}
      {snapshot.hitMarker && <div className="hitmarker"><i /><i /><i /><i /></div>}
      {snapshot.scoped && (
        <div className="scope-overlay">
          <div className="scope-circle"><i className="scope-h" /><i className="scope-v" /><span className="scope-mark m1" /><span className="scope-mark m2" /></div>
          <div className="scope-info">8.0× OPTICAL<br /><span>AWP / PRECISION</span></div>
        </div>
      )}

      <div className="vitals-panel">
        <div className="vital-label">OPERATIVE <span>{snapshot.team}</span></div>
        <div className="vital-values">
          <div><small>+</small><strong>{snapshot.hp}</strong><span>HEALTH</span></div>
          <div className="armor-value"><small>◇</small><strong>{snapshot.armor}</strong><span>ARMOR</span></div>
        </div>
        <div className="health-track"><i style={{ width: `${snapshot.hp}%` }} /></div>
        <div className="team-strip">
          {teammates.map(player => <i key={player.id} className={`${player.alive ? 'alive' : 'dead'} ${player.id === snapshot.controlledId ? 'self' : ''}`} title={`${player.name}: ${player.hp} HP`} />)}
          <span>{teammates.filter(p => p.alive).length} / 5 ACTIVE</span>
        </div>
      </div>

      <div className="ammo-panel">
        <div className="money">$ {snapshot.money.toLocaleString()}</div>
        <div className="weapon-name"><span>{snapshot.slot === 'primary' ? '01' : snapshot.slot === 'secondary' ? '02' : '03'}</span>{snapshot.weapon}</div>
        <div className="ammo-values">
          <strong>{snapshot.slot === 'melee' ? '—' : snapshot.ammo}</strong>
          <span>{snapshot.slot === 'melee' ? 'MELEE' : `/ ${snapshot.reserve}`}</span>
        </div>
        {snapshot.reloading && <div className="reload-track"><i style={{ width: `${snapshot.reloadProgress * 100}%` }} /><span>RELOADING</span></div>}
        <div className="ammo-hint">R&nbsp; RELOAD <b>·</b> 1—3&nbsp; WEAPONS</div>
      </div>

      {snapshot.hint && <div className="context-hint"><kbd>E</kbd>{snapshot.hint.replace('按住 E ', '')}</div>}
      {snapshot.action && <div className="action-progress"><span>{snapshot.action.label}</span><div><i style={{ width: `${snapshot.action.progress * 100}%` }} /></div></div>}
      {snapshot.phase === 'freeze' && <div className="freeze-banner"><span>{snapshot.roundMessage}</span><small>{snapshot.canBuy ? '按 B 打开购买菜单 · 准备部署' : '准备部署'}</small></div>}
      {snapshot.phase === 'ended' && <div className="round-result"><small>ROUND {snapshot.round} COMPLETE</small><strong>{snapshot.roundMessage}</strong><span>NEXT ROUND IN {Math.max(0, Math.ceil(snapshot.roundTime))}</span></div>}
      {snapshot.bomb.status === 'planted' && snapshot.phase === 'live' && <div className="bomb-alert">C4 HAS BEEN PLANTED <span>// SITE {snapshot.bomb.site}</span></div>}

      {!snapshot.alive && snapshot.phase !== 'ended' && (
        <div className="spectate-panel">
          <small>YOU ARE DOWN</small>
          <strong>{snapshot.spectatingId === null ? 'NO SURVIVING TEAMMATES' : `SPECTATING · ${snapshot.players[snapshot.spectatingId].name}`}</strong>
          <span><kbd>SPACE</kbd> 切换队友 <kbd>F</kbd> 接管当前角色</span>
          {snapshot.spectatingId !== null && <button onClick={() => engine.takeover()}>接管角色 <b>F</b></button>}
        </div>
      )}

      {!snapshot.locked && !snapshot.buyOpen && (
        <div className="pause-overlay">
          <div className="pause-card">
            <small>TACTICAL LINK PAUSED</small>
            <h2>点击画面继续</h2>
            <p>鼠标将被锁定用于第一人称视角 · ESC 释放</p>
            <div><kbd>WASD</kbd> 移动 <kbd>LMB</kbd> 开火 <kbd>RMB</kbd> AWP 开镜</div>
            <button onClick={onExit}>退出至主菜单</button>
          </div>
        </div>
      )}

      {snapshot.buyOpen && (
        <div className="buy-overlay">
          <section className="buy-menu">
            <header><div><small>BUY PERIOD · {clock(snapshot.buyTime)}</small><h2>装备采购</h2></div><strong>$ {snapshot.money.toLocaleString()}</strong></header>
            <div className="buy-category">PRIMARY / SECONDARY / ARMOR</div>
            {BUY_ITEMS.map((item, index) => {
              const wrongTeam = item.id !== 'armor' && !!WEAPONS[item.id].team && WEAPONS[item.id].team !== snapshot.team;
              const disabled = wrongTeam || snapshot.money < item.price || !snapshot.canBuy;
              return <button key={item.id} disabled={disabled} onClick={() => engine.purchaseItem(item.id)}>
                <span className="buy-index">0{index + 1}</span>
                <span className="buy-item"><strong>{item.label}</strong><small>{wrongTeam ? '敌方阵营专属' : item.detail}</small></span>
                <b>$ {item.price}</b>
              </button>;
            })}
            <footer><span>购买仅在回合开局阶段可用</span><button onClick={() => engine.closeBuy()}>关闭 <kbd>B</kbd></button></footer>
          </section>
        </div>
      )}
      <div className="build-tag">DL//P&nbsp; 1.0 <span>PROCEDURAL BUILD</span></div>
    </div>
  );
}
