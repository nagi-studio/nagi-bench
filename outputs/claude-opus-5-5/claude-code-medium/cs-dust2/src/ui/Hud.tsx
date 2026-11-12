import { useSyncExternalStore } from 'react';
import type { Game } from '../game/client/Game.ts';
import type { HudState } from '../game/client/store.ts';
import { BuyMenu } from './BuyMenu.tsx';
import { Minimap } from './Minimap.tsx';
import { Scoreboard } from './Scoreboard.tsx';

const fmtTime = (s: number) => {
  const t = Math.ceil(s);
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
};

function Crosshair({ hud }: { hud: HudState }) {
  if (hud.scoped) return null;
  const gap = Math.min(80, hud.crosshairGap);
  const len = 7;
  const hit = hud.now - hud.hitmarkerAt < 220;
  const kill = hud.now - hud.killmarkerAt < 450;
  return (
    <div className="crosshair">
      <div className="ch-line" style={{ width: 2, height: len, transform: `translate(-1px, ${-gap - len}px)` }} />
      <div className="ch-line" style={{ width: 2, height: len, transform: `translate(-1px, ${gap}px)` }} />
      <div className="ch-line" style={{ width: len, height: 2, transform: `translate(${-gap - len}px, -1px)` }} />
      <div className="ch-line" style={{ width: len, height: 2, transform: `translate(${gap}px, -1px)` }} />
      <div className="ch-dot" />
      {(hit || kill) && <div className={`hitmarker ${kill ? 'kill' : hud.hitmarkerHead ? 'head' : ''}`} />}
    </div>
  );
}

function ScopeOverlay() {
  return (
    <div className="scope">
      <div className="scope-hole" />
      <div className="scope-h" />
      <div className="scope-v" />
    </div>
  );
}

function TopBar({ hud }: { hud: HudState }) {
  const planted = hud.bombState === 'planted';
  return (
    <div className="topbar">
      <div className="tb-team ct">
        <span className="tb-alive">{'●'.repeat(hud.aliveCount.CT)}</span>
        <span className="tb-score">{hud.score.CT}</span>
      </div>
      <div className={`tb-center ${planted ? 'planted' : ''}`}>
        {planted ? (
          <>
            <div className="tb-bomb">💣 {hud.bombSite} 点</div>
            <div className="tb-time">{hud.bombTime.toFixed(1)}</div>
          </>
        ) : (
          <>
            <div className="tb-round">
              {hud.phase === 'freeze' ? '冻结时间' : `回合 ${hud.round}`} · {hud.roundTypeLabel}
            </div>
            <div className="tb-time">{hud.phase === 'post' || hud.phase === 'over' ? '--:--' : fmtTime(hud.timeLeft)}</div>
          </>
        )}
      </div>
      <div className="tb-team t">
        <span className="tb-score">{hud.score.T}</span>
        <span className="tb-alive">{'●'.repeat(hud.aliveCount.T)}</span>
      </div>
    </div>
  );
}

function Killfeed({ hud }: { hud: HudState }) {
  return (
    <div className="killfeed">
      {hud.killfeed.map((k) => (
        <div key={k.key} className={`kf-row ${k.mine ? 'mine' : ''}`}>
          {k.killer && <span className={`kf-name ${k.killerTeam?.toLowerCase()}`}>{k.killer}</span>}
          <span className="kf-weapon">
            {k.weapon}
            {k.headshot && <span className="kf-hs"> ⦿HS</span>}
          </span>
          <span className={`kf-name ${k.victimTeam.toLowerCase()}`}>{k.victim}</span>
        </div>
      ))}
    </div>
  );
}

function Vitals({ hud }: { hud: HudState }) {
  return (
    <div className="vitals">
      <div className={`vital hp ${hud.hp <= 25 ? 'low' : ''}`}>
        <span className="vital-icon">✚</span>
        <span className="vital-val">{hud.hp}</span>
        <div className="vital-bar">
          <div style={{ width: `${hud.hp}%` }} />
        </div>
      </div>
      <div className="vital armor">
        <span className="vital-icon">{hud.helmet ? '⛑' : '◈'}</span>
        <span className="vital-val">{hud.armor}</span>
        <div className="vital-bar">
          <div style={{ width: `${hud.armor}%` }} />
        </div>
      </div>
      {hud.hasBomb && <div className="bomb-carry">C4</div>}
    </div>
  );
}

function Ammo({ hud }: { hud: HudState }) {
  const slotRow = (key: 'primary' | 'secondary' | 'melee', n: number, name: string | null) => (
    <div className={`slot ${hud.slots.active === key ? 'active' : ''} ${name ? '' : 'empty'}`}>
      <span className="slot-n">{n}</span>
      {name ?? '—'}
    </div>
  );
  const low = !hud.isMelee && hud.mag <= Math.ceil(hud.magSize * 0.2);
  return (
    <div className="ammo">
      <div className="slots">
        {slotRow('primary', 1, hud.slots.primary)}
        {slotRow('secondary', 2, hud.slots.secondary)}
        {slotRow('melee', 3, hud.slots.melee)}
      </div>
      <div className="weapon-name">{hud.weaponName}</div>
      {!hud.isMelee && (
        <div className="ammo-count">
          <span className={`mag ${low ? 'low' : ''}`}>{hud.mag}</span>
          <span className="reserve">/ {hud.reserve}</span>
        </div>
      )}
      {!hud.isMelee && (
        <div className="bullets">
          {Array.from({ length: Math.min(hud.magSize, 30) }).map((_, i) => (
            <i key={i} className={i < hud.mag ? 'full' : ''} />
          ))}
        </div>
      )}
      {hud.reloadFrac !== null && (
        <div className="reload-bar">
          <div style={{ width: `${hud.reloadFrac * 100}%` }} />
          <span>换弹中</span>
        </div>
      )}
    </div>
  );
}

function Progress({ hud }: { hud: HudState }) {
  const p = hud.plantProgress ?? hud.defuseProgress;
  if (p === null) return null;
  return (
    <div className="progress">
      <div className="progress-label">{hud.plantProgress !== null ? '正在安放 C4…' : '正在拆除 C4…'}</div>
      <div className="progress-bar">
        <div style={{ width: `${p * 100}%` }} />
      </div>
    </div>
  );
}

export function Hud({ game, onExit }: { game: Game; onExit: () => void }) {
  const hud = useSyncExternalStore(game.store.subscribe, game.store.get);
  const dmgAge = hud.now - hud.damageAt;

  return (
    <div className="hud">
      {hud.scoped && <ScopeOverlay />}
      {dmgAge < 500 && <div className="damage-flash" style={{ opacity: 1 - dmgAge / 500 }} />}
      {hud.hp > 0 && hud.hp <= 25 && !hud.spectating && <div className="lowhp" />}

      <div className="minimap-wrap">
        <Minimap game={game} />
        <div className="location">{hud.location}</div>
      </div>
      <TopBar hud={hud} />
      <Killfeed hud={hud} />

      {!hud.deathCam && <Crosshair hud={hud} />}
      <Progress hud={hud} />

      {hud.banner && (
        <div className={`banner ${hud.banner.team ? hud.banner.team.toLowerCase() : ''}`}>
          <div className="banner-title">{hud.banner.title}</div>
          <div className="banner-sub">{hud.banner.sub}</div>
        </div>
      )}

      {hud.spectating && (
        <div className="spectate">
          正在观察 <b className={hud.viewTeam.toLowerCase()}>{hud.viewName}</b>
        </div>
      )}
      {hud.deathCam && <div className="spectate dead">你已阵亡</div>}
      {!hud.controlledIsPlayer && !hud.spectating && !hud.deathCam && <div className="spectate">操控中：{hud.viewName}</div>}
      {hud.hint && <div className="hint">{hud.hint}</div>}

      {!hud.deathCam && (
        <>
          <Vitals hud={hud} />
          <Ammo hud={hud} />
        </>
      )}

      {hud.showScores && <Scoreboard hud={hud} />}
      {hud.buyOpen && <BuyMenu game={game} hud={hud} />}

      {hud.matchWinner && hud.phase === 'over' && (
        <div className="overlay">
          <div className="overlay-card">
            <h2 className={hud.matchWinner.toLowerCase()}>{hud.matchWinner === hud.playerTeam ? '胜利！' : '失败'}</h2>
            <p>
              最终比分 CT {hud.score.CT} : {hud.score.T} T
            </p>
            <div className="overlay-btns">
              <button className="start-btn" onClick={() => game.restartMatch()}>
                再来一局
              </button>
              <button className="ghost-btn" onClick={onExit}>
                返回菜单
              </button>
            </div>
          </div>
        </div>
      )}

      {!hud.locked && !hud.buyOpen && hud.phase !== 'over' && (
        <div className="overlay clickable" onClick={() => game.resumePlay()}>
          <div className="overlay-card">
            <h2>点击进入游戏</h2>
            <p>鼠标将被锁定用于瞄准，按 Esc 释放。</p>
            <div className="controls small">
              <div><b>WASD</b> 移动 · <b>Shift</b> 静步 · <b>空格</b> 跳 · <b>左键</b> 开火 · <b>右键</b> 开镜</div>
              <div><b>R</b> 换弹 · <b>1/2/3/Q/滚轮</b> 切枪 · <b>E</b> 安放/拆除 C4 · <b>B</b> 选枪 · <b>Tab</b> 计分板</div>
            </div>
            <button
              className="ghost-btn"
              onClick={(e) => {
                e.stopPropagation();
                onExit();
              }}
            >
              退出到菜单
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
