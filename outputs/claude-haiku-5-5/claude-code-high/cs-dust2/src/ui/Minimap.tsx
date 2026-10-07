import { useEffect, useMemo, useRef } from 'react'
import type { HudState } from '../game/types.ts'
import { CELL, COLS, ROWS } from '../game/config.ts'
import { LAYOUT } from '../game/map/layout.ts'

const W = 220
const H = Math.round((W * ROWS) / COLS)
const WORLD_W = COLS * CELL
const WORLD_H = ROWS * CELL

const TILE_COLORS: Record<string, string> = {
  '#': '#4a4236',
  '.': '#d9c49a',
  D: '#8a6a40',
  x: '#8a6236',
  l: '#8e8a7e',
  A: '#e8a050',
  B: '#8fb7d8',
  T: '#c79a5e',
  C: '#a5b8c9',
}

/** 把布局预先绘制成一张离屏位图，之后每帧只叠加动态点位 */
function buildBase(): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d')
  if (!g) return c
  const cw = W / COLS
  const ch = H / ROWS
  for (let r = 0; r < ROWS; r++) {
    for (let col = 0; col < COLS; col++) {
      g.fillStyle = TILE_COLORS[LAYOUT[r][col]] ?? '#000'
      g.fillRect(col * cw, r * ch, cw + 0.5, ch + 0.5)
    }
  }
  return c
}

const toPx = (x: number, z: number): [number, number] => [
  ((x + WORLD_W / 2) / WORLD_W) * W,
  ((z + WORLD_H / 2) / WORLD_H) * H,
]

/** 小地图：常驻俯视图，显示自己、队友、被看见的敌人以及 C4 位置 */
export function Minimap({ hud, teamColor }: { hud: HudState; teamColor: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const base = useMemo(() => buildBase(), [])

  useEffect(() => {
    const canvas = ref.current
    const g = canvas?.getContext('2d')
    if (!canvas || !g) return
    g.clearRect(0, 0, W, H)
    g.drawImage(base, 0, 0)

    // C4：安放后闪烁红点，携带 / 掉落时为黄色方块
    const b = hud.bomb
    if (b.visible && b.state !== 'defused' && b.state !== 'exploded') {
      const [px, py] = toPx(b.x, b.z)
      const blink = b.state === 'planted' && Math.floor(Date.now() / 300) % 2 === 0
      g.fillStyle = b.state === 'planted' ? (blink ? '#ff3030' : '#7a1010') : '#ffd34d'
      g.fillRect(px - 3.5, py - 3.5, 7, 7)
    }

    for (const e of hud.radar.enemies) {
      const [px, py] = toPx(e.x, e.z)
      g.beginPath()
      g.arc(px, py, 3.2, 0, Math.PI * 2)
      g.fillStyle = '#ff4d4d'
      g.fill()
      g.strokeStyle = '#000'
      g.lineWidth = 1
      g.stroke()
    }

    const me = hud.me
    for (const f of hud.radar.friends) {
      if (me && f.id === me.id) continue
      const [px, py] = toPx(f.x, f.z)
      g.beginPath()
      g.arc(px, py, 3, 0, Math.PI * 2)
      g.fillStyle = teamColor
      g.fill()
      g.strokeStyle = '#fff'
      g.stroke()
    }

    // 自己：朝向箭头（前方 = (-sin yaw, -cos yaw)，画布 y 轴与 z 同向）
    if (hud.radar.you) {
      const [px, py] = toPx(hud.radar.you.x, hud.radar.you.z)
      const dx = -Math.sin(hud.radar.yaw)
      const dy = -Math.cos(hud.radar.yaw)
      const nx = -dy
      const ny = dx
      g.beginPath()
      g.moveTo(px + dx * 9, py + dy * 9)
      g.lineTo(px - dx * 5 + nx * 5, py - dy * 5 + ny * 5)
      g.lineTo(px - dx * 5 - nx * 5, py - dy * 5 - ny * 5)
      g.closePath()
      g.fillStyle = '#ffffff'
      g.fill()
      g.strokeStyle = '#000'
      g.stroke()
    }
  }, [hud, base, teamColor])

  return (
    <div className="minimap">
      <canvas ref={ref} width={W} height={H} />
      <div className="minimap-legend">
        <span className="lg-me">●</span> 你 <span className="lg-mate">●</span> 队友 <span className="lg-enemy">●</span> 敌人（可见）{' '}
        <span className="lg-bomb">■</span> C4
      </div>
    </div>
  )
}
