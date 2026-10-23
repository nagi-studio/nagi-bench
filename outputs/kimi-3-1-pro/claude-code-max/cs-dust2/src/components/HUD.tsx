import type { CSSProperties } from 'react';
import type { BuyItem, EngineSnapshot } from '../game/types';
import { BUY_ITEMS } from '../game/weapons';

interface HUDProps {
  snapshot: EngineSnapshot;
  onBuy: (id: BuyItem['id']) => void;
  onCloseBuy: () => void;
}

const timeText = (seconds: number) => {
  const whole = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
};

const weaponNames: Record<string, string> = {
  ak47: 'AK-47', m4a4: 'M4A4', awp: 'AWP', glock: 'GLOCK', usp: 'USP', deagle: 'DEAGLE', knife: 'KNIFE', c4: 'C4',
};

export function HUD({ snapshot, onBuy, onCloseBuy }: HUDProps) {
  const { player } = snapshot;
  const hit = snapshot.elapsed - snapshot.hitMarkerAt < 0.18;
  const damaged = snapshot.elapsed - snapshot.damageFlashAt < 0.42;
  const displayTime = snapshot.bomb.status === 'planted'
    ? snapshot.bomb.timer
    : snapshot.phase === 'freeze' || snapshot.phase === 'roundEnd' ? snapshot.phaseTime : snapshot.roundTime;
  const crosshairStyle = { '--spread': `${snapshot.spread}px` } as CSSProperties;

  return (
    <div className="hud" aria-live="off">
      <div className="vignette" />
      {damaged && <div className="damage-flash" />}
      <div className="top-brand">
        <span className="brand-slashes">//</span> SANDLINE <b>STRIKE</b>
        <small>PROCEDURAL 5V5</small>
      </div>

      <div className="scoreboard">
        <div className="score-team ct-score">
          <span>CT</span><strong>{snapshot.score.CT}</strong>
          <div className="alive-pips">{Array.from({ length: 5 }, (_, i) => <i key={i} className={i < snapshot.alive.CT ? 'alive' : ''} />)}</div>
        </div>
        <div className={`round-clock ${snapshot.bomb.status === 'planted' ? 'bomb-clock' : ''}`}>
          <small>{snapshot.bomb.status === 'planted' ? `C4 // ${snapshot.bomb.site}` : snapshot.phase === 'freeze' ? `ROUND ${snapshot.round} // BUY` : `ROUND ${snapshot.round}`}</small>
          <strong>{timeText(displayTime)}</strong>
          <span>{snapshot.bomb.status === 'planted' ? 'DETONATION' : snapshot.phase === 'freeze' ? 'DEPLOY IN' : 'ROUND TIME'}</span>
        </div>
        <div className="score-team t-score">
          <strong>{snapshot.score.T}</strong><span>T</span>
          <div className="alive-pips">{Array.from({ length: 5 }, (_, i) => <i key={i} className={i < snapshot.alive.T ? 'alive' : ''} />)}</div>
        </div>
      </div>

      <div className="killfeed">
        {snapshot.killfeed.map((entry) => (
          <div className="kill-entry" key={entry.id}>
            <span className={entry.killerTeam === 'CT' ? 'ct-text' : 't-text'}>{entry.killer}</span>
            <b className="kill-weapon">{weaponNames[entry.weapon]}{entry.headshot && <em> HEADSHOT</em>}</b>
            <span className={entry.victimTeam === 'CT' ? 'ct-text' : 't-text'}>{entry.victim}</span>
          </div>
        ))}
      </div>

      {snapshot.announcement && (
        <div className={`announcement ${snapshot.phase === 'roundEnd' ? 'round-result' : ''}`}>
          <div className="announcement-rule" />
          <strong>{snapshot.announcement}</strong>
          <span>{snapshot.announcementDetail}</span>
        </div>
      )}

      {!snapshot.scoped && player.alive && !snapshot.paused && (
        <div className={`crosshair ${hit ? 'hit' : ''}`} style={crosshairStyle}>
          <i className="crosshair-top" /><i className="crosshair-right" />
          <i className="crosshair-bottom" /><i className="crosshair-left" />
          <b />
          {hit && <span className="hitmarker"><i /><i /><i /><i /></span>}
        </div>
      )}
      {snapshot.scoped && (
        <div className="scope-overlay">
          <div className="scope-lens"><i className="scope-horizontal" /><i className="scope-vertical" /><span className="scope-center" /></div>
          <div className="scope-data">AWP  //  4.0×<span>20 MM</span></div>
        </div>
      )}

      <div className="bottom-left">
        <div className="player-identity"><span className={`team-badge ${player.team.toLowerCase()}`}>{player.team}</span>{player.name}<small>{player.kills} K / {player.deaths} D</small></div>
        <div className="vitals">
          <div className="health-block"><span className="vital-icon">+</span><strong>{player.health}</strong><small>HEALTH</small></div>
          <div className="armor-block"><span className="armor-icon">◆</span><strong>{player.armor}</strong><small>ARMOR</small></div>
        </div>
      </div>

      <div className="bottom-center">
        {snapshot.actionLabel && (
          <div className="action-panel">
            <div><span>{snapshot.actionLabel}</span><b>{Math.floor(snapshot.actionProgress * 100)}%</b></div>
            <div className="action-track"><i style={{ width: `${snapshot.actionProgress * 100}%` }} /></div>
          </div>
        )}
        {!snapshot.actionLabel && snapshot.contextPrompt && <div className="context-prompt">{snapshot.contextPrompt}</div>}
        {player.spectating && <div className="spectate-banner"><span>观战视角</span><strong>{player.spectatedName}</strong><small>F 切换 · G 接管</small></div>}
      </div>

      <div className="bottom-right">
        <div className="economy">$ {player.money.toLocaleString()}<span>{player.hasBomb ? '◆ C4 CARRIER' : ''}</span></div>
        <div className="weapon-name"><span>{player.slot.toUpperCase()}</span>{player.weaponName}</div>
        {player.weapon !== 'knife' ? (
          <div className="ammo-panel"><strong>{String(player.ammo).padStart(2, '0')}</strong><span>/ {player.reserve}</span><small>AMMO</small></div>
        ) : <div className="ammo-panel melee-panel"><strong>∞</strong><small>MELEE</small></div>}
        <div className="weapon-slots">
          <span className={player.slot === 'primary' ? 'active' : ''}>1 {player.hasPrimary ? 'PRIMARY' : '—'}</span>
          <span className={player.slot === 'secondary' ? 'active' : ''}>2 SIDEARM</span>
          <span className={player.slot === 'melee' ? 'active' : ''}>3 KNIFE</span>
        </div>
        {player.reloading && <div className="reload-bar"><span>RELOADING</span><div><i style={{ width: `${player.reloadProgress * 100}%` }} /></div></div>}
      </div>

      <div className="controls-hint">WASD 移动 <i /> SHIFT 静步 <i /> R 换弹 <i /> Q / 滚轮 切枪 <i /> M 静音</div>
      <div className="zone-status"><i className={player.team === 'CT' ? 'ct-dot' : 't-dot'} />{player.team === 'CT' ? 'COUNTER-TERRORISTS' : 'TERRORISTS'}<span>ONLINE</span></div>

      {snapshot.buyOpen && (
        <div className="modal-layer buy-layer">
          <section className="buy-menu">
            <header><div><small>TACTICAL LOADOUT</small><h2>购买装备</h2></div><div className="buy-money">AVAILABLE<strong>$ {player.money.toLocaleString()}</strong></div></header>
            <p className="buy-note">购买阶段与出生点保护已启用。第一回合仅可购买手枪与护甲。</p>
            <div className="buy-grid">
              {BUY_ITEMS.map((item, index) => {
                const unaffordable = player.money < item.price;
                const armorOwned = item.id === 'armor' && player.armor >= 100;
                return (
                  <button key={item.id} disabled={unaffordable || armorOwned} onClick={() => onBuy(item.id)}>
                    <span className="buy-index">0{index + 1}</span>
                    <span className="buy-slot">{item.slot}</span>
                    <strong>{item.name}</strong>
                    <small>{item.description}</small>
                    <b>{armorOwned ? '已装备' : `$ ${item.price.toLocaleString()}`}</b>
                  </button>
                );
              })}
            </div>
            <footer><span>购买后会自动装备对应武器</span><button onClick={onCloseBuy}>关闭并继续 <kbd>B</kbd></button></footer>
          </section>
        </div>
      )}
    </div>
  );
}
