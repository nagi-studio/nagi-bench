import { useEffect, useRef, useState } from 'react'
import { Engine } from './game/engine'
import HUD from './ui/HUD'

export default function App() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<Engine | null>(null)
  const [engine, setEngine] = useState<Engine | null>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const e = new Engine(viewportRef.current!)
    engineRef.current = e
    setEngine(e)
    ;(window as unknown as { __engine?: Engine }).__engine = e
    return () => e.dispose()
  }, [])

  const start = () => {
    engine?.start()
    setStarted(true)
  }

  return (
    <div className="app">
      <div ref={viewportRef} className="viewport" />
      {engine && <HUD engine={engine} />}
      {!started && (
        <div id="startOverlay" onClick={start}>
          <div className="startBox">
            <h1>DUST II · 5v5</h1>
            <p>第一人称射击原型</p>
            <p className="go">点击开始（锁定鼠标）</p>
            <p className="tip">WASD 移动 · 空格跳 · 鼠标瞄准 · 左键开火 · 右键开镜(AWP) · 1-5 切枪 · R 换弹 · F 安包 · E 拆包</p>
          </div>
        </div>
      )}
    </div>
  )
}
