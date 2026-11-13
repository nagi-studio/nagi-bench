import { useEffect, useRef, useState } from 'react'
import { Director, FilmState } from './film/director'
import { TOTAL_SECONDS, VOICE_CUES } from './film/voiceCues'

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dirRef = useRef<Director | null>(null)
  const [state, setState] = useState<FilmState>({ time: 0, total: TOTAL_SECONDS, playing: false, cue: null, act: '' })
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const d = new Director(canvas, (s) => setState({ ...s }))
    dirRef.current = d
    return () => { d.dispose(); dirRef.current = null }
  }, [])

  const begin = () => {
    setStarted(true)
    dirRef.current?.play()
  }

  const pct = (state.time / state.total) * 100

  return (
    <div className="film">
      <canvas ref={canvasRef} className="stage" />

      {!started && (
        <div className="intro" onClick={begin}>
          <h1>章北海 · 陨石子弹</h1>
          <h2>程序化 3D 短片 · 方块世界美术 · 全程程序化合成音</h2>
          <p>总时长 200 秒（上限 360 秒）· 四幕结构 · {VOICE_CUES.length} 条待配音 cue</p>
          <p>所有对白以【说话者】字幕呈现；舱外枪声遵循真空物理，不作空气传播。</p>
          <div className="go">点击播放</div>
        </div>
      )}

      {started && (
        <>
          <div className="hud-top">
            <span className="act">{state.act}</span>
            <span className="tc">
              {Math.floor(state.time / 60)}:{(state.time % 60).toFixed(1).padStart(4, '0')} / {Math.floor(TOTAL_SECONDS / 60)}:{String(TOTAL_SECONDS % 60).padStart(2, '0')}
            </span>
          </div>

          <div className="progress"><i style={{ width: `${pct}%` }} /></div>

          <div className="subtitle">
            {state.cue ? (
              <>
                <span className="who">【{state.cue.speaker}】</span>
                <span className="line">{state.cue.text}</span>
              </>
            ) : null}
          </div>

          <div className="cue-strip">
            {VOICE_CUES.map((c) => (
              <i
                key={c.id}
                className={state.cue && state.cue.id === c.id ? 'on' : ''}
                style={{ left: `${(c.start / TOTAL_SECONDS) * 100}%`, width: `${((c.end - c.start) / TOTAL_SECONDS) * 100}%` }}
                title={c.text}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
