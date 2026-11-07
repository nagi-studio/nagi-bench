import { useEffect, useRef, useState } from 'react'
import { buildClock, ClockParts, stepClock } from './sim/clock'
import { ClockScene } from './render/scene'
import { towerAudio } from './audio'

const CAPTIONS: { t: number; text: string }[] = [
  { t: 0.0, text: '水运仪象台：北宋苏颂主持建造的计时装置，全机不用一根铁钉，靠水驱动。' },
  { t: 4.2, text: '顶层水斗蓄水，水经管道落下，冲击下方的水轮。' },
  { t: 8.4, text: '水轮带动整条齿轮系，把水的重力变成旋转。' },
  { t: 12.6, text: '擒纵机构由摆轮控制：摆轮每摆一次，擒纵轮只放行一个齿。' },
  { t: 16.8, text: '转速因此被"锁"住，不再忽快忽慢——这就是等时性的来源。' },
  { t: 21.0, text: '底层水斗随时间下降，到点时重量拉响时辰钟，完成报时。' },
  { t: 25.2, text: '以水为动力、以摆为节拍：这就是十二世纪中国的机械时钟。' },
]

const DURATION = 30

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<ClockScene | null>(null)
  const partsRef = useRef<ClockParts | null>(null)
  const elapsedRef = useRef(0)
  const playingRef = useRef(false)
  const [time, setTime] = useState(0)
  const [started, setStarted] = useState(false)
  const [caption, setCaption] = useState(CAPTIONS[0].text)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const scene = new ClockScene(canvas)
    sceneRef.current = scene
    partsRef.current = buildClock()

    let raf = 0
    let last = performance.now()
    let acc = 0
    let uiAcc = 0
    let lastTooth = -1
    const loop = () => {
      raf = requestAnimationFrame(loop)
      const now = performance.now()
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const p = partsRef.current!

      if (playingRef.current) {
        elapsedRef.current = Math.min(DURATION, elapsedRef.current + dt)
        acc += dt
        while (acc > 1 / 120) {
          stepClock(p, 1 / 120, { duration: DURATION, flow: 1 })
          acc -= 1 / 120
        }
        if (p.tooth !== lastTooth) {
          lastTooth = p.tooth
          towerAudio.tick()
        }
        towerAudio.music(dt)
        towerAudio.setFlow(p.reservoir)
        if (p.bellHit > 0.9) towerAudio.bell()
      }

      scene.update(p, elapsedRef.current)
      scene.renderer.render(scene.scene, scene.camera)

      uiAcc += dt
      if (uiAcc > 0.1) {
        uiAcc = 0
        setTime(elapsedRef.current)
      }
    }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); scene.renderer.dispose() }
  }, [])

  useEffect(() => {
    const c = CAPTIONS.filter((x) => time >= x.t).pop()
    if (c) setCaption(c.text)
  }, [time])

  const begin = () => {
    towerAudio.init()
    towerAudio.resume()
    playingRef.current = true
    setStarted(true)
  }

  return (
    <div className="app">
      <canvas ref={canvasRef} className="stage" />
      {!started && (
        <div className="intro" onClick={begin}>
          <h1>水运仪象台</h1>
          <h2>30 秒 3D 科普短片 · 全机构由实时物理引擎驱动</h2>
          <p>水流冲击水轮 → 齿轮系 → 擒纵机构被摆轮"锁"住 → 走时轮系带动指针</p>
          <p>底层水斗到点下降，拉响时辰钟完成报时。</p>
          <div className="go">点击播放</div>
        </div>
      )}
      {started && (
        <>
          <div className="caption">{caption}</div>
          <div className="progress"><i style={{ width: `${(time / DURATION) * 100}%` }} /></div>
          <div className="tc">{time.toFixed(1)}s / {DURATION}s</div>
        </>
      )}
    </div>
  )
}
