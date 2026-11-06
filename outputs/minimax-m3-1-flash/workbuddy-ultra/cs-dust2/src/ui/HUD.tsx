import { useEffect, useRef } from 'react'
import { HudState } from '../game/engine'
import { DustMap, GRID, CELL, HALF } from '../game/map'

function Minimap({ state, map }: { state: HudState; map: DustMap }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const base = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    // pre-render the static map outline once
    const c = document.createElement('canvas')
    c.width = c.height = GRID
    const g = c.getContext('2d')!
    g.clearRect(0, 0, GRID, GRID)
    for (let cz = 0; cz < GRID; cz++) {
      for (let cx = 0; cx < GRID; cx++) {
        if (!map.cellWalkable(cx, cz)) continue
        g.fillStyle = 'rgba(150,170,190,.20)'
        g.fillRect(cx, cz, 1, 1)
        g.fillStyle = 'rgba(190,215,240,.42)'
        // outline every edge that faces solid rock
        if (!map.cellWalkable(cx, cz - 1)) g.fillRect(cx, cz, 1, 0.22)
        if (!map.cellWalkable(cx, cz + 1)) g.fillRect(cx, cz + 0.78, 1, 0.22)
        if (!map.cellWalkable(cx - 1, cz)) g.fillRect(cx, cz, 0.22, 1)
        if (!map.cellWalkable(cx + 1, cz)) g.fillRect(cx + 0.78, cz, 0.22, 1)
      }
    }
    base.current = c
  }, [map])

  useEffect(() => {
    const cv = ref.current
    const b = base.current
    if (!cv || !b) return
    const g = cv.getContext('2d')!
    const S = 172
    g.clearRect(0, 0, S, S)
    g.fillStyle = 'rgba(6,9,14,.78)'
    g.fillRect(0, 0, S, S)
    const k = S / GRID
    g.imageSmoothingEnabled = false
    g.drawImage(b, 0, 0, S, S)

    const toPx = (x: number, z: number): [number, number] => {
      const [cx, cz] = [Math.floor((x + HALF) / CELL), Math.floor((z + HALF) / CELL)]
      return [cx * k, cz * k]
    }
    // bomb site markers
    g.strokeStyle = 'rgba(255,190,80,.85)'
    g.lineWidth = 1
    g.strokeRect(20 * k, 21 * k, 12 * k, 10 * k)
    g.strokeRect(14 * k, 28 * k, 8 * k, 16 * k)
    g.fillStyle = 'rgba(255,190,80,.8)'
    g.font = '8px monospace'
    g.fillText('A', 25 * k, 17 * k)
    g.fillText('B', 17 * k, 27 * k)

    const dot = (x: number, z: number, color: string, r: number) => {
      const [px, py] = toPx(x, z)
      g.fillStyle = color
      g.beginPath()
      g.arc(px, py, r, 0, 7)
      g.fill()
    }
    state.minimap.teammates.forEach(([x, z]) => dot(x, z, 'rgba(120,200,255,.95)', 2.6))
    state.minimap.enemies.forEach(([x, z]) => dot(x, z, 'rgba(255,110,90,.95)', 2.6))
    if (state.minimap.bomb) {
      const [px, py] = toPx(state.minimap.bomb[0], state.minimap.bomb[1])
      g.strokeStyle = state.minimap.bombPlanted ? '#ff5b4a' : '#ffd24a'
      g.lineWidth = 1.4
      g.strokeRect(px - 3, py - 3, 6, 6)
    }
    if (state.minimap.self) {
      const [px, py] = toPx(state.minimap.self[0], state.minimap.self[1])
      g.fillStyle = '#ffffff'
      g.beginPath()
      g.moveTo(px, py - 4.2)
      g.lineTo(px + 3.2, py + 3)
      g.lineTo(px, py + 1.4)
      g.lineTo(px - 3.2, py + 3)
      g.closePath()
      g.fill()
    }
  })

  return (
    <div className="minimap">
      <canvas ref={ref} width={172} height={172} />
      <div className="minimap-label">DUST II</div>
    </div>
  )
}

export function HUD({ state, map }: { state: HudState; map: DustMap }) {
  const spread = state.crosshair
  const mm = Math.floor(state.timeLeft / 60)
  const ss = Math.floor(state.timeLeft % 60)
  return (
    <>
      <div className="crosshair" style={{ width: spread, height: spread }}>
        <i className="ch-t" /><i className="ch-b" /><i className="ch-l" /><i className="ch-r" />
        {state.hitMarker > 0 && <i className="hitmark" />}
      </div>

      <Minimap state={state} map={map} />

      <div className="topbar">
        <div className="score ct"><b>{state.scoreCT}</b><span>CT</span></div>
        <div className="clock">
          <div className="time">{mm}:{ss.toString().padStart(2, '0')}</div>
          <div className="round">第 {state.round} 回合 · {state.aliveCT} v {state.aliveT}</div>
        </div>
        <div className="score t"><span>T</span><b>{state.scoreT}</b></div>
      </div>

      <div className="killfeed">
        {state.killfeed.map((k) => (
          <div key={k.id} className={`kf ${k.team === 'CT' ? 'ct' : 't'}`}>
            {k.team === 'CT' ? 'CT' : 'T'} · {k.text}{k.headshot ? ' ✱' : ''}
          </div>
        ))}
      </div>

      <div className="logbox">
        {state.log.map((l, i) => <div key={i}>{l}</div>)}
      </div>

      {state.bombPlanted && (
        <div className="bomb">
          <span className="lbl">C4 已安放</span>
          <span className="tmr">{state.bombTimer.toFixed(1)}</span>
          {state.defuseProgress > 0 && (
            <div className="bar"><i style={{ width: `${Math.min(100, state.defuseProgress * 100)}%` }} /></div>
          )}
        </div>
      )}

      <div className="hud-bottom">
        <div className="vitals">
          <div className="hp"><b>{state.hp}</b><span>HP</span></div>
          <div className="armor"><b>{state.armor}</b><span>护甲</span></div>
        </div>
        <div className="ammo">
          <div className="wname">{state.weaponName}<small>{state.weaponEn}</small></div>
          <div className="count">{state.slot === 'melee' ? '—' : state.ammo}<span>/{state.slot === 'melee' ? '—' : state.mag}</span></div>
          <div className="slots">
            <i className={state.slot === 'primary' ? 'on' : ''}>1</i>
            <i className={state.slot === 'secondary' ? 'on' : ''}>2</i>
            <i className={state.slot === 'melee' ? 'on' : ''}>3</i>
          </div>
        </div>
      </div>

      {!state.alive && (
        <div className="spectate">
          <div className="t">你已阵亡</div>
          <div className="s">正在观战：{state.spectating ?? '等待队友'}</div>
        </div>
      )}
    </>
  )
}
