import { HudState } from '../game/types';
import { MINIMAP_POLYGON } from '../game/mapData';
import './hud.css';

interface Props {
  hud: HudState;
  onResume: () => void;
}

function minimapPoints() {
  return MINIMAP_POLYGON.map(([x, z]) => `${((x + 60) / 120) * 220 + 10},${((z + 60) / 120) * 220 + 10}`).join(' ');
}

function toMapCoords(x: number, z: number) {
  return {
    x: ((x + 60) / 120) * 220 + 10,
    y: ((z + 60) / 120) * 220 + 10,
  };
}

export default function HUD({ hud, onResume }: Props) {
  const gap = Math.max(3, Math.round(5 + hud.crosshairSpread * 180));
  const scope = hud.scopeLevel > 0;
  const playerMark = hud.minimap.find((item) => item.id === hud.playerId);
  const bombMark = hud.minimap.find((item) => item.id === 'c4');
  const showMenu = hud.phase === 'menu' || hud.phase === 'roundEnd';

  return (
    <div className="hud-root">
      <div className="hud-topline">
        <div className="score-panel">
          <span className="ct-score">{hud.scoreCT}</span>
          <span className="score-divider">:</span>
          <span className="t-score">{hud.scoreT}</span>
          <span className="round-label">第 {hud.roundNumber} 回合</span>
          <span className="round-time">{hud.roundTime}</span>
        </div>
        <div className={`round-state ${hud.bombPlanted ? 'danger' : ''}`}>
          {hud.bombPlanted ? 'C4 已安放' : hud.bombCarrier ? 'T 携带 C4' : 'C4 未安放'}
        </div>
      </div>

      <div className="minimap-wrap">
        <svg viewBox="0 0 240 240" className="minimap" aria-label="Dust2 minimap">
          <polygon points={minimapPoints()} className="minimap-outline" />
          {hud.minimap.map((entity) => {
            const p = toMapCoords(entity.x, entity.z);
            const isPlayer = entity.id === hud.playerId;
            return (
              <g key={entity.id} className={isPlayer ? 'minimap-player' : ''}>
                {entity.id === 'c4' ? (
                  <>
                    <circle cx={p.x} cy={p.y} r="7" className="minimap-c4-halo" />
                    <circle cx={p.x} cy={p.y} r="4" className="minimap-c4" />
                    <text x={p.x} y={p.y + 14} textAnchor="middle" className="minimap-c4-text">C4</text>
                  </>
                ) : (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isPlayer ? 6 : 5}
                    className={`minimap-dot ${entity.team === 'CT' ? 'ct' : 't'} ${!entity.visible ? 'hidden' : ''}`}
                  />
                )}
              </g>
            );
          })}
          {playerMark && !bombMark && playerMark.hasBomb ? (
            <text x="200" y="28" textAnchor="end" className="minimap-c4-text">YOU C4</text>
          ) : null}
        </svg>
      </div>

      <div className="killfeed">
        {hud.killfeed.slice(-5).map((item) => (
          <div key={item.id} className={`killfeed-row ${item.team.toLowerCase()}`}>
            {item.text}
          </div>
        ))}
      </div>

      {!scope ? (
        <div className="crosshair" style={{ '--gap': `${gap}px` } as React.CSSProperties}>
          <span className="ch top" />
          <span className="ch right" />
          <span className="ch bottom" />
          <span className="ch left" />
          <span className="ch dot" />
        </div>
      ) : (
        <div className="scope-overlay">
          <div className="scope-lens">
            <span className="scope-line horizontal" />
            <span className="scope-line vertical" />
            <span className="scope-dot" />
          </div>
        </div>
      )}

      <div className="vitals">
        <div className="vital-block health">
          <span className="vital-icon">HP</span>
          <span className="vital-value">{Math.ceil(hud.health)}</span>
          <div className="vital-bar"><span style={{ width: `${hud.health}%` }} /></div>
        </div>
        <div className="vital-block armor">
          <span className="vital-icon">AP</span>
          <span className="vital-value">{Math.ceil(hud.armor)}</span>
          <div className="vital-bar"><span style={{ width: `${hud.armor}%` }} /></div>
        </div>
      </div>

      <div className="ammo-panel">
        <div className="weapon-name">{hud.weaponName}</div>
        <div className={`ammo-numbers ${hud.reloading ? 'reloading' : ''}`}>
          <span className="mag">{hud.reloading ? '--' : hud.mag}</span>
          <span className="ammo-sep">/</span>
          <span className="reserve">{hud.reserve}</span>
        </div>
        {hud.reloading && <div className="reload-text">换弹中</div>}
        {hud.canPlant && <div className="action-hint">按住 E 安放 C4</div>}
        {hud.canDefuse && <div className="action-hint">按住 E 拆除 C4</div>}
        {hud.bombProgress > 0 && (
          <div className="progress-track">
            <span style={{ width: `${hud.bombProgress * 100}%` }} />
          </div>
        )}
      </div>

      <div className="center-message">{hud.message}</div>

      <div className="control-hint">
        WASD 移动 · 鼠标射击 · R 换弹 · 1/2/3 武器 · B 购买 · 右键 AWP 开镜
      </div>

      {hud.buyMenu && (
        <div className="buy-menu">
          <div className="buy-title">购买菜单</div>
          <div>1 · {hud.playerTeam === 'CT' ? 'M4A4' : 'AK-47'}</div>
          <div>2 · AWP</div>
          <div>3 · Desert Eagle</div>
          <div>4 · USP-S</div>
          <div className="buy-note">按 B 关闭</div>
        </div>
      )}

      {showMenu && (
        <button className="start-screen" onClick={onResume} type="button">
          <div className="title">NAGI CS: DUST2</div>
          <div className="subtitle">
            {hud.phase === 'roundEnd' ? `${hud.roundWinner ?? ''} 获胜` : '5v5 手枪局原型'}
          </div>
          <div className="start-action">{hud.phase === 'roundEnd' ? '点击进入下一回合' : '点击进入战斗'}</div>
          <div className="start-controls">WASD 移动 · 鼠标射击 · 空格跳跃 · R 换弹 · E 互动</div>
        </button>
      )}
    </div>
  );
}
