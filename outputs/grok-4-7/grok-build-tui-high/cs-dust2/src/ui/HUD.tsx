import { useLayoutEffect, useRef } from 'react'
import type { HudSnap } from '../game/snapshot'

interface Props {
  snap: HudSnap
  bake: HTMLCanvasElement | null
  onStart: (team: 'ct' | 't') => void
  onResume: () => void
}

export function HUD({ snap, bake, onStart, onResume }: Props) {
  return (
    <div className="hud">
      {snap.phase === 'menu' && (
        <div className="menu">
          <div className="menu-card">
            <p className="eyebrow">DUST II · 5v5</p>
            <h1>手枪局</h1>
            <p className="lede">
              经典区域已经连通：T 出生、A 大、A 点、中门、猫道、B 洞、B 点、CT 出生。第一回合全员默认手枪加防弹衣。
            </p>
            <div className="menu-actions">
              <button className="btn ct" onClick={() => onStart('ct')}>
                加入 CT
              </button>
              <button className="btn t" onClick={() => onStart('t')}>
                加入 T
              </button>
            </div>
            <ul className="help">
              <li>WASD 移动 · 空格跳跃 · Shift 静步 · Ctrl 蹲下</li>
              <li>鼠标瞄准 / 左键射击 · 右键 AWP 开镜 · R 换弹</li>
              <li>1 主武器 · 2 手枪 · 3 刀 · 滚轮切换</li>
              <li>E 下包 / 拆包 · 阵亡后 ← → 切队友，F 接管</li>
              <li>Tab 记分板 · 购买阶段 1–5 买枪与护甲</li>
            </ul>
          </div>
        </div>
      )}

      {snap.phase !== 'menu' && (
        <>
          <TopBar snap={snap} />
          <Minimap snap={snap} bake={bake} />
          <Killfeed snap={snap} />
          {!snap.scoped && <Crosshair snap={snap} />}
          {snap.scoped && <div className="scope" />}
          {snap.hit > 0 && (
            <div className={`hitmark ${snap.hitHs ? 'hs' : ''}`} style={{ opacity: Math.min(1, snap.hit) }} />
          )}
          {snap.damage > 0 && (
            <>
              <div className="vignette" style={{ opacity: Math.min(0.75, snap.damage * 0.75) }} />
              <div className="dmg-dir" style={{ opacity: Math.min(1, snap.damage), transform: `rotate(${snap.damageAngle}rad)` }} />
            </>
          )}
          {snap.action && (
            <div className="action">
              <div className="action-label">{snap.action === 'plant' ? '安装 C4' : '拆除 C4'}</div>
              <div className="bar">
                <span style={{ width: `${Math.min(100, snap.actionPct * 100)}%` }} />
              </div>
            </div>
          )}
          {(snap.banner || snap.phase === 'freeze' || snap.phase === 'buy' || snap.phase === 'end' || snap.phase === 'match') && snap.banner && (
            <div className="banner">
              <strong>{snap.banner}</strong>
              <em>{snap.sub}</em>
            </div>
          )}
          <Vitals snap={snap} />
          <Ammo snap={snap} />
          {snap.prompt && <div className="prompt">{snap.prompt}</div>}
          {snap.spectating && <div className="spec">正在观察 {snap.specName}</div>}
          {snap.tab && <Scoreboard snap={snap} />}
          {snap.paused && (
            <div className="pause">
              <div>
                <h2>已暂停</h2>
                <button className="btn ct" onClick={onResume}>
                  点击继续
                </button>
              </div>
            </div>
          )}
          {snap.phase === 'match' && (
            <div className="pause">
              <div>
                <h2>{snap.banner}</h2>
                <p>{snap.sub}</p>
                <button className="btn t" onClick={() => snap.team && onStart(snap.team)}>
                  再来一局
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function TopBar({ snap }: { snap: HudSnap }) {
  const time = formatTime(snap.roundTime)
  const hot = snap.bomb === 'planted'
  return (
    <div className="topbar">
      <span className="score ct">{snap.scoreCT}</span>
      <div className={`timer ${hot ? 'bomb' : ''}`}>
        <small>{hot ? 'C4' : `R${snap.round || 1}`}</small>
        {time}
      </div>
      <span className="score t">{snap.scoreT}</span>
    </div>
  )
}

function formatTime(s: number): string {
  const t = Math.max(0, Math.ceil(s))
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`
}

function Crosshair({ snap }: { snap: HudSnap }) {
  const h = typeof window === 'undefined' ? 800 : window.innerHeight
  const focal = h / (2 * Math.tan(((snap.fov * Math.PI) / 180) / 2))
  const gap = 5 + snap.spread * focal
  return (
    <div className="cross">
      <i style={{ transform: `translateY(${-gap}px)` }} />
      <i style={{ transform: `translateY(${gap}px)` }} />
      <i style={{ transform: `translateX(${-gap}px)` }} />
      <i style={{ transform: `translateX(${gap}px)` }} />
    </div>
  )
}

function Vitals({ snap }: { snap: HudSnap }) {
  const hp = Math.max(0, Math.min(100, snap.hp))
  return (
    <div className="vitals">
      <div className="hp-row">
        <b className={hp < 30 ? 'low' : ''}>{hp}</b>
        <div className="bar hp">
          <span style={{ width: `${hp}%` }} />
        </div>
      </div>
      <div className="arm-row">
        <span>{snap.helmet ? '头甲' : '护甲'}</span>
        <b>{snap.armor}</b>
        <div className="bar arm">
          <span style={{ width: `${Math.min(100, snap.armor)}%` }} />
        </div>
      </div>
      <div className="money">${snap.money}</div>
    </div>
  )
}

function Ammo({ snap }: { snap: HudSnap }) {
  return (
    <div className="ammo">
      <div className="wname">{snap.weapon}</div>
      {snap.melee ? (
        <div className="mag">—</div>
      ) : (
        <div className="mag">
          {snap.mag}
          <small>/ {snap.reserve}</small>
        </div>
      )}
      {snap.bombYou && <div className="carry">携带 C4</div>}
      {snap.bomb === 'planted' && <div className="carry hot">C4 {formatTime(snap.bombTime)}</div>}
      {snap.bomb === 'dropped' && <div className="carry">C4 掉落</div>}
      {snap.bomb === 'carried' && !snap.bombYou && snap.bombCarrier && <div className="carry">{snap.bombCarrier} 携带 C4</div>}
    </div>
  )
}

function Killfeed({ snap }: { snap: HudSnap }) {
  return (
    <ul className="feed">
      {snap.kills.map((k, i) => (
        <li key={`${k.at}-${i}`}>
          <span className={k.kTeam}>{k.killer}</span>
          <em>
            {k.weapon}
            {k.hs ? ' ✚' : ''}
          </em>
          <span className={k.vTeam}>{k.victim}</span>
        </li>
      ))}
    </ul>
  )
}

function Scoreboard({ snap }: { snap: HudSnap }) {
  const ct = snap.board.filter((r) => r.team === 'ct')
  const t = snap.board.filter((r) => r.team === 't')
  return (
    <div className="board">
      <table>
        <thead>
          <tr>
            <th>CT</th>
            <th>HP</th>
            <th>甲</th>
            <th>武器</th>
            <th>$</th>
          </tr>
        </thead>
        <tbody>
          {ct.map((r) => (
            <Row key={r.name + r.team} row={r} />
          ))}
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th>T</th>
            <th>HP</th>
            <th>甲</th>
            <th>武器</th>
            <th>$</th>
          </tr>
        </thead>
        <tbody>
          {t.map((r) => (
            <Row key={r.name + 't'} row={r} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Row({ row }: { row: HudSnap['board'][number] }) {
  return (
    <tr className={`${row.you ? 'you' : ''} ${row.alive ? '' : 'dead'}`}>
      <td>
        {row.name}
        {row.bomb ? ' · C4' : ''}
      </td>
      <td>{row.alive ? row.hp : '—'}</td>
      <td>{row.armor}</td>
      <td>{row.weapon}</td>
      <td>{row.money}</td>
    </tr>
  )
}

function Minimap({ snap, bake }: { snap: HudSnap; bake: HTMLCanvasElement | null }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useLayoutEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const g = canvas.getContext('2d')
    if (!g) return
    const w = canvas.width
    const h = canvas.height
    g.clearRect(0, 0, w, h)
    if (bake) g.drawImage(bake, 0, 0, w, h)
    g.strokeStyle = 'rgba(255,244,220,0.35)'
    g.strokeRect(0.5, 0.5, w - 1, h - 1)
    const worldW = 96
    const worldH = 112
    const pt = (x: number, z: number) => [(x / worldW) * w, (1 - z / worldH) * h]
    if (snap.bombPos) {
      const [x, y] = pt(snap.bombPos.x, snap.bombPos.z)
      g.fillStyle = snap.bomb === 'planted' ? '#ff3b30' : '#ffd60a'
      g.beginPath()
      g.arc(x, y, 4, 0, Math.PI * 2)
      g.fill()
    }
    g.fillStyle = '#3ec6ff'
    for (const m of snap.mates) {
      const [x, y] = pt(m.x, m.z)
      g.fillRect(x - 2.5, y - 2.5, 5, 5)
    }
    g.fillStyle = '#ff5a36'
    for (const m of snap.enemies) {
      const [x, y] = pt(m.x, m.z)
      g.beginPath()
      g.arc(x, y, 3.2, 0, Math.PI * 2)
      g.fill()
    }
    if (snap.self) {
      const [x, y] = pt(snap.self.x, snap.self.z)
      const f = forwardFlat(snap.self.yaw)
      const sx = f.x
      const sy = -f.z
      g.save()
      g.translate(x, y)
      g.rotate(Math.atan2(sy, sx) + Math.PI / 2)
      g.fillStyle = '#f7f1e4'
      g.beginPath()
      g.moveTo(0, -7)
      g.lineTo(4.5, 6)
      g.lineTo(-4.5, 6)
      g.closePath()
      g.fill()
      g.restore()
    }
  }, [snap, bake])
  return (
    <div className="map-wrap">
      <canvas ref={ref} width={200} height={232} />
      <span>雷达</span>
    </div>
  )
}

function forwardFlat(yaw: number): { x: number; z: number } {
  return { x: -Math.sin(yaw), z: -Math.cos(yaw) }
}
