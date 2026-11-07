import { useEffect, useRef, useState } from 'react'
import { createGame, Game, HudState } from './game/engine'
import { DustMap } from './game/map'
import { audio } from './game/audio'
import { HUD } from './ui/HUD'

const EMPTY: HudState = {
  phase: 'menu', round: 1, scoreCT: 0, scoreT: 0, timeLeft: 0,
  hp: 100, armor: 0, ammo: 20, mag: 20, weaponName: 'Glock-18', weaponEn: 'Glock-18',
  slot: 'secondary', scoped: false, alive: true, aliveCT: 5, aliveT: 5,
  killfeed: [], bombPlanted: false, bombTimer: 0, defuseProgress: 0, plantProgress: 0,
  hasBomb: false, spectating: null, scoreboard: [], crosshair: 8, hitMarker: 0, damageDir: 0,
  log: [],
  minimap: { self: null, teammates: [], enemies: [], bomb: null, bombPlanted: false, team: 'CT' },
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameRef = useRef<Game | null>(null)
  const mapRef = useRef<DustMap | null>(null)
  const [hud, setHud] = useState<HudState>(EMPTY)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    audio.init()
    const game = createGame(canvas, (s) => setHud({ ...s }))
    gameRef.current = game
    mapRef.current = game.map
    return () => { game.dispose(); gameRef.current = null }
  }, [])

  const begin = () => {
    audio.init()
    audio.resume()
    const canvas = canvasRef.current!
    const req = canvas.requestPointerLock()
    if (req && (req as any).catch) (req as any).catch(() => {})
    setStarted(true)
    gameRef.current?.startMatch()
  }

  return (
    <div className="app">
      <canvas ref={canvasRef} className="stage" />
      {started && mapRef.current && <HUD state={hud} map={mapRef.current} />}
      {!started && (
        <div className="menu" onClick={begin}>
          <h1>CS DUST II · 5v5</h1>
          <h2>React + TypeScript + three.js 从零手写的 3D 第一人称射击原型</h2>
          <ul>
            <li>WASD 移动 · 空格跳跃 · 鼠标转视角（点击锁定指针）</li>
            <li>左键射击 · 右键 AWP 开镜 · R 换弹 · 1/2/3 或滚轮切换武器</li>
            <li>你属于 CT 队：4 名 AI 队友对抗 5 名 AI 进攻方</li>
            <li>进攻方会下包、拆包与你周旋，阵亡后可切换视角观战队友</li>
          </ul>
          <div className="go">点击进入战场</div>
        </div>
      )}
    </div>
  )
}
