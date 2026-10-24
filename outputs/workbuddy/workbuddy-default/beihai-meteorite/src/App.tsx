import { useEffect, useRef, useState } from 'react'
import { Cinematic } from './cinematic'

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cinematicRef = useRef<Cinematic | null>(null)
  const [sub, setSub] = useState<{ speaker: string; text: string } | null>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const c = new Cinematic(containerRef.current!, setSub)
    cinematicRef.current = c
    return () => c.dispose()
  }, [])

  const start = () => {
    cinematicRef.current?.start()
    setStarted(true)
  }

  return (
    <div className="film-root">
      <div ref={containerRef} className="film-canvas" />
      <div id="subtitle">
        {sub && (
          <div>
            <span className="spk">【{sub.speaker}】</span>
            <span className="txt">{sub.text}</span>
          </div>
        )}
      </div>
      {!started && (
        <div id="filmStart" onClick={start}>
          <div className="box">
            <h1>章北海 · 陨石子弹</h1>
            <p>体素风格程序化 3D 短片</p>
            <p className="go">点击播放（开启声音）</p>
          </div>
        </div>
      )}
      <style>{`
        .film-root { position: fixed; inset: 0; background: #0b0e12; font-family: "PingFang SC", system-ui, sans-serif; }
        .film-canvas { position: absolute; inset: 0; }
        #subtitle { position: fixed; left: 0; right: 0; bottom: 6%; z-index: 5; text-align: center; pointer-events: none; }
        #subtitle > div { display: inline-block; max-width: 80%; padding: 8px 18px; background: rgba(0,0,0,0.55); border-radius: 8px; color: #fff; font-size: 19px; line-height: 1.55; }
        #subtitle .spk { color: #ffd34d; margin-right: 8px; font-weight: 600; }
        #filmStart { position: fixed; inset: 0; z-index: 10; display: flex; align-items: center; justify-content: center; background: rgba(6,9,14,0.85); cursor: pointer; color: #eaf2fb; }
        #filmStart .box { text-align: center; max-width: 520px; padding: 28px; }
        #filmStart h1 { font-size: 28px; letter-spacing: 2px; }
        #filmStart p { opacity: 0.82; margin-top: 8px; }
        #filmStart .go { color: #ffd34d; font-size: 18px; margin-top: 18px; }
      `}</style>
    </div>
  )
}
