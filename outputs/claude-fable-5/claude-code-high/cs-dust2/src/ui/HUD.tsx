import { useEffect, useRef, useSyncExternalStore } from 'react'
import type { Engine } from '../game/engine'
import { GRID } from '../game/map'
import type { HudState, Team } from '../game/types'

const MINIMAP_PX = 4 // px per cell

function fmtTime(t: number): string {
  const s = Math.max(0, Math.ceil(t))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

function Minimap({ engine }: { engine: Engine }) {
  const bgRef = useRef<HTMLCanvasElement>(null)
  const fgRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const bg = bgRef.current!
    engine.map.drawMinimap(bg.getContext('2d')!, MINIMAP_PX)

    let raf = 0
    const draw = () => {
      raf = requestAnimationFrame(draw)
      const fg = fgRef.current
      if (!fg) return
      const ctx = fg.getContext('2d')!
      const size = GRID * MINIMAP_PX
      ctx.clearRect(0, 0, size, size)
      const info = engine.minimapInfo()
      const toPx = (x: number, z: number): [number, number] => [
        (x / 2.5 + GRID / 2) * MINIMAP_PX,
        (z / 2.5 + GRID / 2) * MINIMAP_PX,
      ]

      // bomb
      const bomb = info.bomb
      let bombPos = bomb.plantedPos ?? bomb.droppedPos
      if (!bombPos && bomb.carrierId !== null) {
        const carrier = info.soldiers[bomb.carrierId]
        if (carrier && (carrier.team === info.playerTeam || carrier.lastSeenBy[info.playerTeam] > info.time - 2)) {
          bombPos = carrier.pos
        }
      }
      if (bombPos && (bomb.plantedPos ? Math.sin(info.time * 10) > -0.4 : true)) {
        const [bx, bz] = toPx(bombPos.x, bombPos.z)
        ctx.fillStyle = '#ff7828'
        ctx.fillRect(bx - 4, bz - 4, 8, 8)
        ctx.fillStyle = '#000'
        ctx.font = 'bold 7px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('C4', bx, bz + 2.5)
      }

      for (const s of info.soldiers) {
        if (!s.alive) continue
        const mine = s.team === info.playerTeam
        const seen = s.lastSeenBy[info.playerTeam] > info.time - 1.6
        if (!mine && !seen) continue
        const [px, pz] = toPx(s.pos.x, s.pos.z)
        if (s.id === info.viewedId) {
          // white arrow with view direction
          ctx.save()
          ctx.translate(px, pz)
          ctx.rotate(-s.yaw)
          ctx.fillStyle = '#ffffff'
          ctx.beginPath()
          ctx.moveTo(0, -6)
          ctx.lineTo(4.4, 4.4)
          ctx.lineTo(0, 2)
          ctx.lineTo(-4.4, 4.4)
          ctx.closePath()
          ctx.fill()
          ctx.restore()
        } else {
          ctx.fillStyle = mine ? '#57c46a' : '#e84c3d'
          ctx.beginPath()
          ctx.arc(px, pz, 3.4, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [engine])

  const size = GRID * MINIMAP_PX
  return (
    <div className="minimap">
      <canvas ref={bgRef} width={size} height={size} />
      <canvas ref={fgRef} width={size} height={size} />
    </div>
  )
}

function Crosshair({ st }: { st: HudState }) {
  if (st.me.scoped) return null
  if (!st.me.alive) return null
  if (st.me.weaponId === 'awp') {
    // unscoped AWP: big circle = inaccurate
    return <div className="crosshair-circle" />
  }
  const gap = Math.min(40, st.me.spreadPx)
  const len = 9
  return (
    <div className="crosshair">
      <div className="ch-dot" />
      <div className="ch-line" style={{ left: '50%', top: '50%', width: 2, height: len, transform: `translate(-50%, ${gap}px)` }} />
      <div className="ch-line" style={{ left: '50%', top: '50%', width: 2, height: len, transform: `translate(-50%, ${-gap - len}px)` }} />
      <div className="ch-line" style={{ left: '50%', top: '50%', width: len, height: 2, transform: `translate(${gap}px, -50%)` }} />
      <div className="ch-line" style={{ left: '50%', top: '50%', width: len, height: 2, transform: `translate(${-gap - len}px, -50%)` }} />
    </div>
  )
}

function Scope() {
  return (
    <div className="scope">
      <div className="scope-cutout" />
      <div className="scope-hline" />
      <div className="scope-vline" />
    </div>
  )
}

function TeamTag({ team }: { team: Team }) {
  return <span className={`teamtag ${team === 'CT' ? 'ct' : 't'}`}>{team}</span>
}

export default function HUD({ engine }: { engine: Engine }) {
  useSyncExternalStore(engine.hud.subscribe, engine.hud.getSnapshot)
  const st = engine.hud.state
  const now = engine.time

  if (st.phase === 'menu') {
    return (
      <div className="overlay menu">
        <h1>DUST&nbsp;II</h1>
        <p className="subtitle">5v5 炸弹模式 · 三维第一人称 · 纯代码生成</p>
        <div className="team-select">
          <button className="team-card ct" onClick={() => { engine.start('CT'); engine.requestLock() }}>
            <span className="team-name">加入 CT</span>
            <span className="team-desc">反恐精英 · USP-S 起手<br />守卫 A / B 点，拆除 C4</span>
          </button>
          <button className="team-card t" onClick={() => { engine.start('T'); engine.requestLock() }}>
            <span className="team-name">加入 T</span>
            <span className="team-desc">恐怖分子 · Glock 起手<br />突入包点，安放 C4</span>
          </button>
        </div>
        <button className="spectate-btn" onClick={() => engine.start('CT', true)}>AI 对战观赏模式</button>
        <div className="controls-help">
          <span>WASD 移动</span><span>空格 跳跃</span><span>Shift 静步</span>
          <span>鼠标左键 开火</span><span>右键 AWP 开镜</span><span>R 换弹</span>
          <span>1/2/3 切枪</span><span>E 安放 / 拆除</span><span>B 购买阶段换 AWP</span>
        </div>
      </div>
    )
  }

  const dmgFlash = now - st.damageAt < 0.4
  const hitAge = now - st.hitmarkerAt

  return (
    <div className="hud">
      {st.me.scoped && <Scope />}
      <Crosshair st={st} />

      {hitAge < 0.25 && (
        <div className={`hitmarker ${st.hitmarkerHead ? 'head' : ''}`}>
          <span /><span /><span /><span />
        </div>
      )}
      {dmgFlash && <div className="damage-flash" />}

      {/* top bar */}
      <div className="topbar">
        <div className="score ct-score">{st.ctScore}</div>
        <div className="timer">
          {st.bombPlanted
            ? <span className="bomb-timer">💣 {Math.ceil(st.bombTimeLeft ?? 0)}</span>
            : <span>{st.phase === 'freeze' ? fmtTime(st.freezeLeft) : fmtTime(st.timeLeft)}</span>}
          <div className="round-label">回合 {st.round}{st.pistolRound ? ' · 手枪局' : ''}</div>
        </div>
        <div className="score t-score">{st.tScore}</div>
      </div>

      <Minimap engine={engine} />

      {/* killfeed */}
      <div className="killfeed">
        {st.killfeed.map(k => (
          <div className="kf-entry" key={k.id}>
            <span className={k.attackerTeam === 'CT' ? 'kf-ct' : 'kf-t'}>{k.attacker}</span>
            <span className="kf-weapon">{k.weapon}{k.headshot ? ' ◎' : ''}</span>
            <span className={k.victimTeam === 'CT' ? 'kf-ct' : 'kf-t'}>{k.victim}</span>
          </div>
        ))}
      </div>

      {/* bottom left: hp / armor */}
      {st.me.alive && (
        <div className="vitals">
          <div className="vital">
            <span className="vital-icon">＋</span>
            <span className="vital-num">{st.me.hp}</span>
            <div className="vital-bar"><div style={{ width: `${st.me.hp}%` }} className="vital-fill hp" /></div>
          </div>
          <div className="vital">
            <span className="vital-icon">🛡</span>
            <span className="vital-num">{st.me.armor}</span>
            <div className="vital-bar"><div style={{ width: `${st.me.armor}%` }} className="vital-fill armor" /></div>
          </div>
          {st.me.hasBomb && <div className="carrying-bomb">携带 C4</div>}
        </div>
      )}

      {/* bottom right: ammo */}
      {st.me.alive && (
        <div className="ammo">
          <div className="weapon-name">{st.me.weaponName}{st.me.reloading ? '（换弹中…）' : ''}</div>
          {st.me.weaponId !== 'knife' && (
            <div className="ammo-nums">
              <span className="ammo-mag">{st.me.mag}</span>
              <span className="ammo-sep">/</span>
              <span className="ammo-reserve">{st.me.reserve}</span>
            </div>
          )}
        </div>
      )}

      {/* center messages */}
      <div className="center-stack">
        {st.phase === 'freeze' && (
          <div className="banner freeze">
            <div className="banner-title">准备阶段 · {Math.ceil(st.freezeLeft)}s</div>
            {!st.pistolRound && <div className="banner-sub">按 B 切换主武器：当前 {st.loadout === 'awp' ? 'AWP' : '步枪'}</div>}
            {st.pistolRound && <div className="banner-sub">手枪局 — {st.playerTeam === 'T' ? 'Glock-18' : 'USP-S'}，无护甲</div>}
          </div>
        )}
        {st.channel && (
          <div className="channel">
            <div className="channel-label">{st.channel.label}</div>
            <div className="channel-bar"><div style={{ width: `${st.channel.progress * 100}%` }} /></div>
          </div>
        )}
        {st.centerHint && !st.channel && <div className="hint">{st.centerHint}</div>}
        {st.bombPlanted && st.phase === 'live' && <div className="planted-note">C4 已安放</div>}
        {st.phase === 'over' && st.winner && (
          <div className={`banner winner ${st.winner === 'CT' ? 'ct' : 't'}`}>
            <div className="banner-title">{st.winner} 获胜</div>
            <div className="banner-sub">{st.winReason}</div>
          </div>
        )}
      </div>

      {/* spectate bar */}
      {st.spectating && st.phase === 'live' && (
        <div className="spectate-bar">
          {st.spectating.isSelf
            ? <span>你已阵亡 — 正在寻找存活队友…</span>
            : <>
                <span>观战中：<b>{st.spectating.name}</b> <TeamTag team={st.me.team} /></span>
                <span className="spec-keys">←/→ 或 左键 切换 · E 接管该队友</span>
              </>}
        </div>
      )}

      {/* pause overlay (pointer unlocked mid-game) */}
      {!st.locked && !st.auto && st.phase !== 'matchover' && (
        <div className="overlay pause" onClick={() => engine.requestLock()}>
          <div className="pause-box">
            <h2>已暂停 / 鼠标未锁定</h2>
            <p>点击任意处继续（锁定鼠标）</p>
            <button onClick={e => { e.stopPropagation(); engine.toMenu() }}>返回主菜单</button>
          </div>
        </div>
      )}

      {st.phase === 'matchover' && st.matchWinner && (
        <div className="overlay">
          <div className="pause-box">
            <h2>比赛结束 — {st.matchWinner} {st.matchWinner === st.playerTeam ? '胜利 🏆' : '获胜'}</h2>
            <p>CT {st.ctScore} : {st.tScore} T</p>
            <button onClick={() => { engine.restartMatch(); engine.requestLock() }}>再来一局</button>
            <button onClick={() => engine.toMenu()}>返回主菜单</button>
          </div>
        </div>
      )}
    </div>
  )
}
