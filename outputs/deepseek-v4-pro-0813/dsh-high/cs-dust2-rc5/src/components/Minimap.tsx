import { useLayoutEffect, useRef } from 'react'
import { useHud } from '../hooks'
import { MOVEMENT_BLOCKERS, CATWALK_SUPPORT, ZONES, WORLD_MIN_X, WORLD_MAX_X, WORLD_MIN_Z, WORLD_MAX_Z } from '../game/mapData'

const W = 256
const H = 224

export function Minimap() {
  const hud = useHud()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const scale = Math.min(W / (WORLD_MAX_X - WORLD_MIN_X), H / (WORLD_MAX_Z - WORLD_MIN_Z))
    const ox = (W - (WORLD_MAX_X - WORLD_MIN_X) * scale) / 2
    const oy = (H - (WORLD_MAX_Z - WORLD_MIN_Z) * scale) / 2

    const mx = (x: number) => ox + (x - WORLD_MIN_X) * scale
    const my = (z: number) => oy + (WORLD_MAX_Z - z) * scale

    ctx.clearRect(0, 0, W, H)
    // background
    ctx.fillStyle = '#1a1d21'
    ctx.fillRect(0, 0, W, H)

    // bombsite zones
    ctx.fillStyle = 'rgba(255,176,32,0.16)'
    for (const r of [ZONES.A_SITE, ZONES.B_SITE]) {
      ctx.fillRect(mx(r.minX), my(r.maxZ), (r.maxX - r.minX) * scale, (r.maxZ - r.minZ) * scale)
    }

    // walls / crates / platforms
    for (const b of MOVEMENT_BLOCKERS) {
      const isCrate = b.sy <= 1.6 && b.sx <= 2.1
      ctx.fillStyle = isCrate ? '#8a6a3a' : '#c9b48c'
      ctx.fillRect(mx(b.cx - b.sx / 2), my(b.cz + b.sz / 2), b.sx * scale, b.sz * scale)
    }
    ctx.fillStyle = '#9a9a9a'
    const c = CATWALK_SUPPORT
    ctx.fillRect(mx(c.cx - c.sx / 2), my(c.cz + c.sz / 2), c.sx * scale, c.sz * scale)

    // site labels
    ctx.fillStyle = '#ffd24a'
    ctx.font = 'bold 13px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('A', mx(-15), my(15) + 4)
    ctx.fillText('B', mx(20), my(14) + 4)

    // bomb
    const bomb = hud.minimap.bomb
    if (bomb) {
      const pulse = Math.sin(performance.now() / 150) > 0
      ctx.fillStyle = pulse ? '#ff2020' : '#7a0f0f'
      ctx.beginPath()
      ctx.arc(mx(bomb.x), my(bomb.z), bomb.planted ? 5 : 4, 0, Math.PI * 2)
      ctx.fill()
    }

    // players
    for (const p of hud.minimap.players) {
      if (!p.alive) {
        ctx.fillStyle = '#3c3c3c'
        ctx.beginPath()
        ctx.arc(mx(p.x), my(p.z), 2.5, 0, Math.PI * 2)
        ctx.fill()
        continue
      }
      if (!p.visible) continue
      const isLocal = p.isLocal
      const color = isLocal ? '#ffffff' : p.team === 'CT' ? '#5ab4ff' : '#ffb04a'
      if (isLocal) {
        // arrow for local player
        ctx.save()
        ctx.translate(mx(p.x), my(p.z))
        ctx.rotate(-p.yaw)
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.moveTo(0, -5)
        ctx.lineTo(4, 4)
        ctx.lineTo(0, 2)
        ctx.lineTo(-4, 4)
        ctx.closePath()
        ctx.fill()
        ctx.restore()
      } else {
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(mx(p.x), my(p.z), 3.5, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }, [hud.minimap])

  return (
    <div className="minimap">
      <canvas ref={canvasRef} width={W} height={H} />
    </div>
  )
}
