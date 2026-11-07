import React from 'react'
import { GameEngine } from './game/engine'
import { initAudio, resumeAudio } from './game/audio'
import { Hud } from './ui/Hud'
import type { GameStatus } from './game/types'

export default function App(): React.ReactElement {
  const mountRef = React.useRef<HTMLDivElement>(null)
  const engineRef = React.useRef<GameEngine | null>(null)
  const rafRef = React.useRef<number>(0)
  const [status, setStatus] = React.useState<GameStatus | null>(null)
  const [started, setStarted] = React.useState(false)
  const [minimap, setMinimap] = React.useState({
    me: { x: 0, z: 0, yaw: 0 },
    allies: [] as { x: number; z: number; id: number }[],
    bomb: null as { x: number; y: number; z: number } | null
  })

  // 创建引擎（只做一次）
  React.useEffect(() => {
    const el = mountRef.current
    if (!el || engineRef.current) return
    const engine = new GameEngine(el)
    engineRef.current = engine
    // 状态同步：每帧把引擎快照推给 React
    const sync = (): void => {
      setStatus({ ...engine.status })
      const me = engine.controlled()
      setMinimap({
        me: { x: me.pos.x, z: me.pos.z, yaw: me.yaw },
        allies: engine.visibleEnemies(),
        bomb: engine.round.bombPlanted ? engine.round.bombPos : null
      })
      rafRef.current = requestAnimationFrame(sync)
    }
    rafRef.current = requestAnimationFrame(sync)
    return () => {
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const start = (): void => {
    initAudio()
    resumeAudio()
    setStarted(true)
    // 等一帧，确保容器已有最终尺寸
    requestAnimationFrame(() => {
      engineRef.current?.run()
      const canvas = mountRef.current?.querySelector('canvas')
      canvas?.requestPointerLock()
    })
  }

  return (
    <div
      ref={mountRef}
      style={{ position: 'fixed', inset: 0, background: '#0b0d10', cursor: started ? 'none' : 'default' }}
    >
      {status && (
        <Hud status={status} me={minimap.me} allies={minimap.allies} bomb={minimap.bomb} />
      )}

      {!started && (
        <div style={overlay}>
          <div style={titleWrap}>
            <div style={kicker}>FIRST PERSON SHOOTER</div>
            <h1 style={title}>DUST2 · 5v5</h1>
            <div style={sub}>程序化 5v5 对战原型 · 无任何外部美术与音频资源</div>
          </div>

          <div style={panel}>
            <div style={panelRow}>
              <span style={k}>移动</span>
              <span style={v}>W A S D · 空格跳跃</span>
            </div>
            <div style={panelRow}>
              <span style={k}>视角</span>
              <span style={v}>鼠标（点击画面锁定指针）</span>
            </div>
            <div style={panelRow}>
              <span style={k}>射击</span>
              <span style={v}>左键 · 右键开镜（AWP）</span>
            </div>
            <div style={panelRow}>
              <span style={k}>武器</span>
              <span style={v}>1 主武器 · 2 手枪 · 3 近战 · 滚轮切换 · R 换弹</span>
            </div>
            <div style={panelRow}>
              <span style={k}>目标</span>
              <span style={v}>消灭敌方 5 人，或安放 / 拆除 C4</span>
            </div>
          </div>

          <button style={startBtn} onClick={start}>
            进 入 战 场
          </button>
          <div style={foot}>建议使用桌面浏览器与鼠标游玩</div>
        </div>
      )}
    </div>
  )
}

/* ---------------- 样式 ---------------- */
const overlay: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 26,
  background:
    'radial-gradient(ellipse at 50% 34%, #24303f 0%, #0d1014 68%)',
  zIndex: 20,
  fontFamily: "'Segoe UI', 'PingFang SC', sans-serif",
  color: '#e8eef5'
}

const titleWrap: React.CSSProperties = { textAlign: 'center' }

const kicker: React.CSSProperties = {
  fontSize: 10.5,
  letterSpacing: '0.44em',
  color: 'rgba(232,238,245,.44)',
  marginBottom: 12
}

const title: React.CSSProperties = {
  margin: 0,
  fontSize: 46,
  fontWeight: 300,
  letterSpacing: '0.2em',
  background: 'linear-gradient(180deg,#ffffff,#e0a850)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent'
}

const sub: React.CSSProperties = {
  marginTop: 12,
  fontSize: 12.5,
  color: 'rgba(232,238,245,.56)',
  letterSpacing: '0.1em'
}

const panel: React.CSSProperties = {
  display: 'grid',
  gap: 9,
  minWidth: 420,
  padding: '20px 26px',
  border: '1px solid rgba(255,255,255,.13)',
  background: 'rgba(12,15,20,.5)'
}

const panelRow: React.CSSProperties = { display: 'flex', gap: 18, fontSize: 12.5 }

const k: React.CSSProperties = {
  color: '#e0a850',
  width: 42,
  letterSpacing: '0.08em'
}

const v: React.CSSProperties = { color: 'rgba(232,238,245,.78)', letterSpacing: '0.04em' }

const startBtn: React.CSSProperties = {
  padding: '14px 52px',
  border: '1px solid #e0a850',
  background: 'transparent',
  color: '#e0a850',
  fontSize: 14,
  letterSpacing: '0.28em',
  cursor: 'pointer',
  fontFamily: 'inherit'
}

const foot: React.CSSProperties = {
  fontSize: 11,
  color: 'rgba(232,238,245,.34)',
  letterSpacing: '0.08em'
}
