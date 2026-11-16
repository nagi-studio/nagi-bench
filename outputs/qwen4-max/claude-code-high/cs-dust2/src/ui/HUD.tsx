import type { ReactElement } from 'react';
import type { GameEngine } from '../game/engine';
import type { HudState, WeaponId } from '../game/types';
import Minimap from './Minimap';
import Killfeed from './Killfeed';
import Scoreboard from './Scoreboard';

const fmt = (t: number): string => {
  const s = Math.max(0, Math.ceil(t));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

const REASON_TEXT: Record<string, string> = {
  elimination: '歼灭对方',
  explosion: 'C4 爆炸',
  defuse: '成功拆除 C4',
  time: '时间耗尽',
};

const BUY_ITEMS: { id: WeaponId; key: string; name: string; desc: string }[] = [
  { id: 'ak47', key: '1', name: 'AK-47', desc: '高伤害 · 大后坐力' },
  { id: 'm4a4', key: '2', name: 'M4A4', desc: '稳定 · 高射速' },
  { id: 'awp', key: '3', name: 'AWP', desc: '单发致命 · 右键开镜' },
  { id: 'deagle', key: '4', name: '沙鹰', desc: '大威力手枪 · 7 发弹匣' },
];

export default function HUD({ hud, engine }: { hud: HudState; engine: GameEngine | null }): ReactElement {
  const gap = hud.spreadPx;
  const showCross = !hud.scoped && hud.playerAlive && !hud.spectating;
  return (
    <div className="hud">
      {/* damage vignette */}
      {hud.damageT > 0 && <div className="damage-vignette" style={{ opacity: hud.damageT * 1.6 }} />}

      {/* AWP scope */}
      {hud.scoped && (
        <div className="scope">
          <div className="scope-mask" />
          <div className="scope-h" />
          <div className="scope-v" />
          <div className="scope-dot" />
        </div>
      )}

      {/* crosshair */}
      {showCross && (
        <div className="crosshair">
          <span className="ch t" style={{ transform: `translate(-50%, ${-gap - 8}px)` }} />
          <span className="ch b" style={{ transform: `translate(-50%, ${gap}px)` }} />
          <span className="ch l" style={{ transform: `translate(${-gap - 8}px, -50%)` }} />
          <span className="ch r" style={{ transform: `translate(${gap}px, -50%)` }} />
        </div>
      )}
      {hud.hitmarkerT > 0 && (
        <div className={`hitmarker ${hud.hitmarkerHead ? 'head' : ''}`}>
          <i /><i /><i /><i />
        </div>
      )}

      {/* top bar: score + timer */}
      <div className="topbar">
        <div className="score ct">
          <span className="team-label">CT</span>
          <span className="score-num">{hud.scores.CT}</span>
          <span className="alive">{hud.aliveCT} 存活</span>
        </div>
        <div className="timer-box">
          <div className={`timer ${hud.bombState === 'planted' ? 'bomb' : ''}`}>
            {hud.bombState === 'planted' ? fmt(hud.bombTimer) : fmt(hud.timer)}
          </div>
          <div className="round-label">
            回合 {hud.round}{hud.pistol ? ' · 手枪局' : ''}
            {hud.bombState === 'planted' ? ' · C4 已安放' : ''}
          </div>
        </div>
        <div className="score t">
          <span className="alive">{hud.aliveT} 存活</span>
          <span className="score-num">{hud.scores.T}</span>
          <span className="team-label">T</span>
        </div>
      </div>

      <Killfeed entries={hud.killfeed} />

      <div className="minimap-wrap">
        <Minimap engine={engine} />
        {hud.hasBomb && <div className="bomb-carry">携带 C4</div>}
      </div>

      {/* bottom left: health / armor */}
      <div className="status">
        <div className="stat hp">
          <span className="stat-icon">✚</span>
          <span className="stat-num">{hud.hp}</span>
        </div>
        <div className="stat armor">
          <span className="stat-icon">🛡</span>
          <span className="stat-num">{hud.armor}</span>
        </div>
      </div>

      {/* bottom right: ammo */}
      <div className="ammo">
        <div className="weapon-name">{hud.weaponName}{hud.reloading ? ' · 换弹中…' : ''}</div>
        {hud.weapon === 'knife' ? (
          <div className="ammo-num">∞</div>
        ) : (
          <div className="ammo-num">
            <span className={hud.mag === 0 ? 'empty' : ''}>{hud.mag}</span>
            <span className="reserve"> / {hud.reserve}</span>
          </div>
        )}
        <div className="slots">
          <span className={hud.weapon !== 'knife' && hud.weapon !== 'glock' && hud.weapon !== 'usp' && hud.weapon !== 'deagle' ? 'on' : ''}>1 主</span>
          <span className={['glock', 'usp', 'deagle'].includes(hud.weapon) ? 'on' : ''}>2 副</span>
          <span className={hud.weapon === 'knife' ? 'on' : ''}>3 刀</span>
        </div>
      </div>

      {/* center hint / progress */}
      {hud.hint && <div className="hint">{hud.hint}</div>}
      {hud.plantProgress > 0 && (
        <div className="progress-wrap">
          <div className="progress-label">安放 C4…</div>
          <div className="progress"><div className="bar plant" style={{ width: `${hud.plantProgress * 100}%` }} /></div>
        </div>
      )}
      {hud.defuseProgress > 0 && hud.bombState === 'planted' && (
        <div className="progress-wrap">
          <div className="progress-label">拆除中… {Math.ceil((1 - hud.defuseProgress) * 10)}s</div>
          <div className="progress"><div className="bar defuse" style={{ width: `${hud.defuseProgress * 100}%` }} /></div>
        </div>
      )}

      {/* spectate banner */}
      {hud.spectating && (
        <div className="spectate">
          观战：<b>{hud.spectateName}</b> · 空格/点击切换 · <b>F</b> 接管
        </div>
      )}

      {/* round end banner */}
      {hud.phase === 'roundend' && hud.roundEndWinner && (
        <div className={`round-banner ${hud.roundEndWinner === 'CT' ? 'ct' : 't'}`}>
          <div className="banner-title">{hud.roundEndWinner === 'CT' ? 'CT 获胜' : 'T 获胜'}</div>
          <div className="banner-reason">{REASON_TEXT[hud.roundEndReason ?? ''] ?? ''}</div>
        </div>
      )}
      {hud.phase === 'freeze' && (
        <div className="freeze-tag">{hud.pistol ? '手枪局 · 仅默认手枪 / 无护甲' : '购买阶段'}</div>
      )}

      {/* buy menu */}
      {hud.buyOpen && (
        <div className="buy">
          <h3>选择武器（冻结时间）</h3>
          {BUY_ITEMS.map((it) => (
            <button key={it.id} className="buy-item" onClick={() => engine?.buy(it.id)}>
              <span className="buy-key">{it.key}</span>
              <span className="buy-name">{it.name}</span>
              <span className="buy-desc">{it.desc}</span>
            </button>
          ))}
          <p className="buy-tip">手枪局不可购买主武器 · 按 B 关闭</p>
        </div>
      )}

      {engine?.scoreboardOpen && <Scoreboard hud={hud} />}
    </div>
  );
}
