import { useEffect, useRef } from 'react'
import { TEAM_COLORS } from '../game/arsenal'
import type { HudState } from '../game/client'
import { EDGES, MAP_BOUNDS, PROPS, SITES, WALKWAYS } from '../game/level'
import { Icon } from './icons'

const WIDTH = 208
const HEIGHT = 174
const SCALE = 2
const x = (world: number) => WIDTH / 2 + (world - (MAP_BOUNDS.x1 + MAP_BOUNDS.x0) / 2) * SCALE
const y = (world: number) => HEIGHT / 2 + (world - (MAP_BOUNDS.z1 + MAP_BOUNDS.z0) / 2) * SCALE

function base(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT)
  ctx.fillStyle = '#20231d'
  ctx.fillRect(0, 0, WIDTH, HEIGHT)
  ctx.strokeStyle = '#ffffff0a'
  ctx.lineWidth = 1
  ctx.beginPath()
  for (let n = 9; n < WIDTH; n += 14) { ctx.moveTo(n, 0); ctx.lineTo(n, HEIGHT) }
  for (let n = 10; n < HEIGHT; n += 14) { ctx.moveTo(0, n); ctx.lineTo(WIDTH, n) }
  ctx.stroke()
  ctx.beginPath()
  for (const r of WALKWAYS) ctx.rect(x(r.x0), y(r.z0), (r.x1 - r.x0) * SCALE, (r.z1 - r.z0) * SCALE)
  ctx.fillStyle = '#47493f'
  ctx.fill()

  ctx.strokeStyle = '#757365'
  ctx.lineWidth = 1
  ctx.beginPath()
  for (const edge of EDGES) {
    ctx.moveTo(x(edge.alongX ? edge.from : edge.line), y(edge.alongX ? edge.line : edge.from))
    ctx.lineTo(x(edge.alongX ? edge.to : edge.line), y(edge.alongX ? edge.line : edge.to))
  }
  ctx.stroke()

  for (const prop of PROPS) {
    if (prop.y > 1.65 || prop.kind === 'roof') continue
    ctx.save()
    ctx.translate(x(prop.x), y(prop.z))
    ctx.rotate(-prop.angle)
    ctx.fillStyle = prop.kind === 'door' ? '#a7885f' : '#2c302a'
    ctx.fillRect(-prop.w * SCALE / 2, -prop.d * SCALE / 2, prop.w * SCALE, prop.d * SCALE)
    ctx.restore()
  }
  for (const [letter, site] of Object.entries(SITES)) {
    const px = x(site.x)
    const py = y(site.z)
    const r = site.radius * SCALE + 1.2
    ctx.fillStyle = '#a778475e'
    ctx.strokeStyle = '#d6a26c'
    ctx.lineWidth = 0.9
    ctx.fillRect(px - r, py - r, r * 2, r * 2)
    ctx.strokeRect(px - r, py - r, r * 2, r * 2)
    ctx.font = 'bold 11px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#f8d2a3'
    ctx.fillText(letter, px, py + 0.5)
  }
}

function markers(ctx: CanvasRenderingContext2D, hud: HudState) {
  const self = hud.markers.find(marker => marker.self)
  if (self) {
    ctx.save()
    ctx.translate(x(self.x), y(self.z))
    ctx.rotate(-self.yaw)
    const fade = ctx.createRadialGradient(0, 0, 2, 0, 0, 30)
    fade.addColorStop(0, '#f1e6b34f')
    fade.addColorStop(1, '#f1e6b300')
    ctx.fillStyle = fade
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.arc(0, 0, 30, -Math.PI * 0.77, -Math.PI * 0.23)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }

  for (const marker of hud.markers) {
    ctx.save()
    ctx.translate(x(marker.x), y(marker.z))
    ctx.beginPath()
    if (marker.self) {
      ctx.rotate(-marker.yaw)
      ctx.moveTo(0, -5.9)
      ctx.lineTo(4.05, 4.5)
      ctx.lineTo(0, 3.15)
      ctx.lineTo(-4.05, 4.5)
      ctx.closePath()
      ctx.fillStyle = '#fff3cf'
    } else {
      ctx.arc(0, 0, marker.team === hud.team ? 2.7 : 3.15, 0, Math.PI * 2)
      ctx.fillStyle = marker.team === hud.team ? TEAM_COLORS[marker.team] : '#ff7b6e'
    }
    ctx.strokeStyle = '#181a15'
    ctx.lineWidth = 1.65
    ctx.stroke()
    ctx.fill()
    ctx.restore()
  }

  if (hud.bomb.position) {
    ctx.save()
    ctx.translate(x(hud.bomb.position.x), y(hud.bomb.position.z) - (hud.bomb.state === 'carried' ? 4.5 : 0))
    ctx.rotate(Math.PI / 4)
    ctx.shadowColor = '#ebad6c'
    ctx.shadowBlur = hud.bomb.state === 'planted' ? 6 : 0
    ctx.strokeStyle = '#252115'
    ctx.lineWidth = 1.35
    ctx.fillStyle = hud.bomb.state === 'planted' ? '#ff7d5f' : '#f7c577'
    ctx.fillRect(-2.8, -2.8, 5.6, 5.6)
    ctx.strokeRect(-2.8, -2.8, 5.6, 5.6)
    ctx.restore()
  }
}

export function Radar({ hud }: { hud: HudState }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const terrain = useRef<HTMLCanvasElement | null>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const pixel = Math.min(2, window.devicePixelRatio || 1)
    if (!terrain.current) {
      const layer = document.createElement('canvas')
      layer.width = WIDTH * pixel
      layer.height = HEIGHT * pixel
      const back = layer.getContext('2d')!
      back.scale(pixel, pixel)
      base(back)
      terrain.current = layer
      canvas.width = layer.width
      canvas.height = layer.height
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.drawImage(terrain.current, 0, 0)
    ctx.setTransform(canvas.width / WIDTH, 0, 0, canvas.height / HEIGHT, 0, 0)
    markers(ctx, hud)
  }, [hud])

  return (
    <section className="radar" aria-label="战区小地图">
      <div className="radar-head"><Icon name="layers" size={14} /><span>战术雷达</span><span className="radar-north">↑ N</span></div>
      <canvas ref={ref} width={WIDTH} height={HEIGHT} aria-label="双包点、队友、已发现的敌人和 C4 位置" />
      <div className="radar-place"><Icon name="pin" size={13} /> {hud.area}</div>
    </section>
  )
}
