import React, { useEffect, useRef } from 'react'
import { GRID, HALF, cellAt, Cell, SITE_A, SITE_B, buildMap } from '../game/map'
import type { GameState, Entity } from '../game/types'
import { lineOfSight } from '../game/map'

// Top-down minimap: draws the Dust2 floor outline once into an offscreen canvas,
// then blits it each frame with live dots for the player, teammates, visible
// enemies and the bomb.
const SIZE = 190
const PAD = 6

// world (in [-HALF, HALF]) -> minimap pixel
function toMap(w: number): number {
  return ((w + HALF) / GRID) * (SIZE - PAD * 2) + PAD
}

let baseCanvas: HTMLCanvasElement | null = null
function buildBase(): HTMLCanvasElement {
  if (baseCanvas) return baseCanvas
  buildMap()
  const cv = document.createElement('canvas')
  cv.width = cv.height = SIZE
  const c = cv.getContext('2d')!
  c.clearRect(0, 0, SIZE, SIZE)
  // floor tiles
  const scale = (SIZE - PAD * 2) / GRID
  c.fillStyle = 'rgba(198,176,132,0.55)'
  for (let z = 0; z < GRID; z++)
    for (let x = 0; x < GRID; x++) {
      if (cellAt(x, z) !== Cell.FLOOR) continue
      c.fillRect(PAD + x * scale, PAD + z * scale, Math.ceil(scale), Math.ceil(scale))
    }
  // site boxes
  const site = (sx: number, sz: number, r: number, color: string) => {
    c.strokeStyle = color
    c.lineWidth = 1.5
    const px = toMap(sx - r), pz = toMap(sz - r)
    c.strokeRect(px, pz, (r * 2) / GRID * (SIZE - PAD * 2), (r * 2) / GRID * (SIZE - PAD * 2))
  }
  site(SITE_A.x, SITE_A.z, SITE_A.r, 'rgba(255,179,71,0.9)')
  site(SITE_B.x, SITE_B.z, SITE_B.r, 'rgba(102,194,255,0.9)')
  // site letters
  c.font = 'bold 12px system-ui'
  c.textAlign = 'center'
  c.textBaseline = 'middle'
  c.fillStyle = 'rgba(255,179,71,0.95)'
  c.fillText('A', toMap(SITE_A.x), toMap(SITE_A.z))
  c.fillStyle = 'rgba(102,194,255,0.95)'
  c.fillText('B', toMap(SITE_B.x), toMap(SITE_B.z))
  baseCanvas = cv
  return cv
}

export default function Minimap({ s, player }: { s: GameState; player: Entity }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const c = cv.getContext('2d')!
    const base = buildBase()

    // The view follows the player; keep them centred by translating the base.
    const draw = () => {
      c.clearRect(0, 0, SIZE, SIZE)
      // draw base shifted so the player sits near the centre
      const px = toMap(player.x), pz = toMap(player.z)
      const offX = SIZE / 2 - px, offZ = SIZE / 2 - pz
      c.save()
      c.beginPath()
      c.rect(0, 0, SIZE, SIZE)
      c.clip()
      c.drawImage(base, offX, offZ)

      // bomb
      const showBomb = s.bomb.planted || (!s.bomb.carried && s.bomb.x !== 0)
      if (showBomb) dot(c, toMap(s.bomb.x) + offX, toMap(s.bomb.z) + offZ, 3.5, s.bomb.planted ? '#ff3b30' : '#ffb347', true)
      // bomb carrier (a T holding it)
      const carrier = s.entities.find((e) => e.alive && e.hasBomb)
      if (carrier) dot(c, toMap(carrier.x) + offX, toMap(carrier.z) + offZ, 3, '#ffb347', false)

      // entities
      for (const e of s.entities) {
        if (!e.alive) continue
        const mx = toMap(e.x) + offX, mz = toMap(e.z) + offZ
        if (mx < -6 || mx > SIZE + 6 || mz < -6 || mz > SIZE + 6) continue
        if (e.isPlayer || e.id === s.spectateId) {
          // self: an arrow showing facing
          arrow(c, mx, mz, e.isPlayer ? playerFacing(s) : e.yaw, '#7dffa0')
        } else if (e.team === player.team) {
          dot(c, mx, mz, 3, '#66c2ff', false)
        } else {
          // only show enemies the player can currently see
          if (lineOfSight(player.x, player.z, e.x, e.z)) dot(c, mx, mz, 3, '#ff5b4a', false)
        }
      }
      c.restore()

      // border + north indicator
      c.strokeStyle = 'rgba(255,255,255,0.18)'
      c.lineWidth = 1
      c.strokeRect(0.5, 0.5, SIZE - 1, SIZE - 1)
      c.fillStyle = 'rgba(200,206,214,0.8)'
      c.font = '9px system-ui'
      c.textAlign = 'left'
      c.fillText('N ↑', 6, 12)
    }
    draw()
    const id = setInterval(draw, 90)
    return () => clearInterval(id)
  }, [s, player])

  return (
    <canvas
      ref={ref}
      width={SIZE}
      height={SIZE}
      style={{
        position: 'fixed', left: 16, top: 64, width: SIZE, height: SIZE, zIndex: 5,
        borderRadius: 10, background: 'rgba(8,12,18,0.5)', border: '1px solid rgba(255,255,255,0.12)',
        pointerEvents: 'none', backdropFilter: 'blur(4px)',
      }}
    />
  )
}

function playerFacing(s: GameState): number {
  const p = s.entities.find((e) => e.isPlayer)
  return p ? p.yaw : 0
}
function dot(c: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, pulse: boolean) {
  c.beginPath()
  c.arc(x, y, r, 0, Math.PI * 2)
  c.fillStyle = color
  c.fill()
  if (pulse) {
    c.strokeStyle = color
    c.lineWidth = 1
    c.beginPath()
    c.arc(x, y, r + 2.5, 0, Math.PI * 2)
    c.stroke()
  }
}
function arrow(c: CanvasRenderingContext2D, x: number, y: number, yaw: number, color: string) {
  c.save()
  c.translate(x, y)
  c.rotate(-yaw)
  c.beginPath()
  c.moveTo(0, -5)
  c.lineTo(3.5, 4)
  c.lineTo(0, 2)
  c.lineTo(-3.5, 4)
  c.closePath()
  c.fillStyle = color
  c.fill()
  c.restore()
}
