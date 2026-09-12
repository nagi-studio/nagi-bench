// ---------------------------------------------------------------------------
// HUD：准星 / 生命护甲 / 弹药 / 击杀播报 / 回合信息 / 瞄镜遮罩 / 观战条
// ---------------------------------------------------------------------------

import { useSyncExternalStore } from 'react';
import { DEFUSE_TIME, Game, PLANT_TIME } from '../game/engine';
import { Slot } from '../game/types';
import { Minimap } from './Minimap';

export function Hud({ game }: { game: Game }) {
  const hud = useSyncExternalStore(game.subscribe, game.getSnapshot);
  const hitAge = game.now - hud.hitAt;
  const showHit = hitAge < 0.18 && hud.alive;

  return (
    <div className="hud">
      {/* 小地图 */}
      <div className="minimap-wrap panel">
        <Minimap game={game} />
        <div className="minimap-caption">DUST2 · {hud.playerTeam} 阵营</div>
      </div>

      {/* 顶部回合条 */}
      <div className="topbar panel">
        <div className="score ct">
          <span className="team-tag">CT</span>
          <span className="score-num">{hud.scoreCT}</span>
          <span className="alive">{hud.aliveCT} 存活</span>
        </div>
        <div className="round-info">
          <div className={`timer ${hud.bombState === 'planted' ? 'bomb' : ''}`}>
            {hud.phase === 'freeze' ? `准备 ${hud.phaseTimeLeft.toFixed(0)}`
              : hud.phase === 'end' ? '回合结束'
              : formatTime(hud.timeLeft)}
          </div>
          <div className="round-num">第 {hud.round} 回合 {hud.bombState === 'planted' ? '· 💣 已安放' : ''}</div>
        </div>
        <div className="score t">
          <span className="alive">{hud.aliveT} 存活</span>
          <span className="score-num">{hud.scoreT}</span>
          <span className="team-tag">T</span>
        </div>
      </div>

      {/* 击杀播报 */}
      <div className="killfeed">
        {hud.kills.slice(-5).map(k => (
          <div key={k.id} className="kill-row">
            <span className={k.atkTeam === 'CT' ? 'name ct' : 'name t'}>{k.attacker}</span>
            <span className="weapon">[{k.headshot ? '爆头 ' : ''}{k.weapon}]</span>
            <span className={k.vicTeam === 'CT' ? 'name ct' : 'name t'}>{k.victim}</span>
          </div>
        ))}
        {hud.feed.slice(-4).map(f => (
          <div key={f.id} className="feed-row" style={{ color: f.color }}>{f.text}</div>
        ))}
      </div>

      {/* 中央横幅 */}
      {hud.banner && (
        <div className={`banner ${hud.bannerKind}`}>
          <div className="banner-main">{hud.banner}</div>
          <div className="banner-sub">{hud.bannerSub}</div>
        </div>
      )}

      {/* 准星 */}
      {hud.alive && !hud.scoped && (
        <div className="crosshair" style={{ ['--gap' as string]: `${hud.spreadPx}px` }}>
          <span className="ch n" /><span className="ch s" /><span className="ch w" /><span className="ch e" />
          <span className="ch dot" />
        </div>
      )}

      {/* 命中反馈 */}
      {showHit && (
        <div className={`hitmarker ${hud.hitHead ? 'head' : ''}`}>
          <span /><span /><span /><span />
        </div>
      )}

      {/* AWP 瞄准镜遮罩 */}
      {hud.scoped && (
        <div className="scope-overlay">
          <div className="scope-circle" />
          <div className="scope-line h" />
          <div className="scope-line v" />
        </div>
      )}

      {/* 安放 / 拆除进度 */}
      {hud.planting && (
        <div className="channel">
          <div className="channel-label">正在安放 C4…</div>
          <div className="channel-bar"><div className="channel-fill plant" style={{ width: `${(hud.plantT / PLANT_TIME) * 100}%` }} /></div>
        </div>
      )}
      {hud.defusing && (
        <div className="channel">
          <div className="channel-label">正在拆除 C4…</div>
          <div className="channel-bar"><div className="channel-fill defuse" style={{ width: `${(hud.defuseT / DEFUSE_TIME) * 100}%` }} /></div>
        </div>
      )}

      {/* 提示 */}
      {hud.hint && <div className="hint">{hud.hint}</div>}

      {/* 观战条 */}
      {!hud.alive && (
        <div className="spectate panel">
          {hud.spectating ? (
            <>
              <span>你已阵亡 — 观战中：<b>{hud.spectating}</b></span>
              <span className="spectate-tip">按 <kbd>F</kbd> 接管该队友继续战斗</span>
            </>
          ) : (
            <span>全队阵亡，等待回合结束…</span>
          )}
        </div>
      )}

      {/* 左下：生命 / 护甲 */}
      <div className="vitals panel">
        <div className="vital-row">
          <span className="vital-icon">✚</span>
          <div className="vital-bar"><div className={`vital-fill hp ${hud.hp <= 30 ? 'low' : ''}`} style={{ width: `${hud.hp}%` }} /></div>
          <span className="vital-num">{hud.hp}</span>
        </div>
        <div className="vital-row">
          <span className="vital-icon">🛡</span>
          <div className="vital-bar"><div className="vital-fill armor" style={{ width: `${hud.armor}%` }} /></div>
          <span className="vital-num">{hud.armor}</span>
        </div>
        {hud.hasBomb && <div className="bomb-carry">💣 携带 C4</div>}
      </div>

      {/* 右下：武器 / 弹药 */}
      <div className="weapon-panel panel">
        <div className="slots">
          <span className={`slot ${hud.slot === Slot.Primary ? 'active' : ''} ${!hud.hasPrimary ? 'empty' : ''}`}>1 · {hud.primaryName}</span>
          <span className={`slot ${hud.slot === Slot.Secondary ? 'active' : ''}`}>2 · {hud.secondaryName}</span>
          <span className={`slot ${hud.slot === Slot.Melee ? 'active' : ''}`}>3 · 战术刀</span>
        </div>
        <div className="ammo">
          <span className="ammo-mag">{hud.slot === Slot.Melee ? '—' : hud.mag}</span>
          <span className="ammo-reserve">{hud.slot === Slot.Melee ? '近战' : `/ ${hud.reserve}`}</span>
        </div>
        <div className="weapon-name">{hud.weaponName}{hud.reloading ? ' · 换弹中…' : ''}</div>
      </div>

      {/* 暂停遮罩 */}
      {hud.paused && (
        <div className="pause-overlay">
          <div className="pause-card">
            <h2>已暂停（指针未锁定）</h2>
            <p>点击画面继续游戏</p>
            <p className="controls-help">
              WASD 移动 · 空格 跳跃 · Shift 静步 · 鼠标左键 开火 · 右键 开镜(AWP)<br />
              R 换弹 · 1/2/3 切换武器 · Q 上次武器 · E 安放/拆除 · F 接管队友
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}
