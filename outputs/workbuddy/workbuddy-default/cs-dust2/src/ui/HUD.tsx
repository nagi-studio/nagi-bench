import { useEffect, useRef, useState } from 'react'
import type { Engine, HudState } from '../game/engine'

export default function HUD({ engine }: { engine: Engine }) {
  const [s, setS] = useState<HudState>(() => engine.getHud())
  const mapRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cb = () => setS(engine.getHud())
    engine.subscribe(cb)
    return () => engine.unsubscribe(cb)
  }, [engine])

  useEffect(() => {
    const cv = mapRef.current
    if (!cv) return
    const g = cv.getContext('2d')!
    const W = cv.width, H = cv.height
    g.clearRect(0, 0, W, H)
    const b = s.map.bounds
    const toX = (x: number) => ((x - b.minX) / (b.maxX - b.minX)) * W
    const toY = (z: number) => ((z - b.minZ) / (b.maxZ - b.minZ)) * H
    g.strokeStyle = 'rgba(255,255,255,0.25)'
    g.strokeRect(0, 0, W, H)
    // allies
    for (const a of s.map.allies) {
      g.fillStyle = a.alive ? '#4fa3ff' : 'rgba(79,163,255,0.3)'
      g.beginPath(); g.arc(toX(a.x), toY(a.z), 3, 0, 7); g.fill()
    }
    // enemies
    for (const e of s.map.enemies) {
      if (!e.seen) continue
      g.fillStyle = e.alive ? '#ff5b5b' : 'rgba(255,91,91,0.3)'
      g.beginPath(); g.arc(toX(e.x), toY(e.z), 3, 0, 7); g.fill()
    }
    // bomb
    if (s.map.bomb) {
      g.fillStyle = '#ffd34d'
      g.fillRect(toX(s.map.bomb.x) - 2, toY(s.map.bomb.z) - 2, 4, 4)
    }
    // player (triangle pointing angle)
    const px = toX(s.map.player.x), py = toY(s.map.player.z)
    g.save(); g.translate(px, py); g.rotate(-s.map.player.angle)
    g.fillStyle = '#ffffff'
    g.beginPath(); g.moveTo(0, -5); g.lineTo(4, 4); g.lineTo(-4, 4); g.closePath(); g.fill()
    g.restore()
  }, [s])

  return (
    <>
      <div id="crosshair" />
      {s.scoped && <div id="scope" />}
      <div className="hud-bl">
        <div className="hp">{Math.max(0, Math.round(s.hp))}<small> HP</small></div>
        <div className="armor">{Math.round(s.armor)} ARMOR · {s.team}</div>
      </div>
      <div className="hud-br">
        <div className="weapon">{s.weapon}</div>
        <div className="ammo">{s.ammo}<span className="res"> / {s.reserve}</span></div>
      </div>
      <div id="killfeed">
        {s.killfeed.slice(-5).map((k: string, i: number) => <div key={i}>{k}</div>)}
      </div>
      <canvas id="minimap" ref={mapRef} width={150} height={150} />
      {s.banner && <div id="banner">{s.banner}</div>}
      {s.hint && <div id="hint">{s.hint}</div>}
    </>
  )
}
