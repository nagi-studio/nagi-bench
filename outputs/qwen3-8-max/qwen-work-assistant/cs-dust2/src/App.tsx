import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Renderer, playerYawRef } from './game/renderer'
import { createState, step, INPUT, TICK } from './game/engine'
import { WEAPONS, WeaponId } from './game/weapons'
import type { GameState, Entity } from './game/types'
import { initAudio, resumeAudio } from './game/audio'
import Hud from './ui/Hud'
import Minimap from './ui/Minimap'

// A fixed-timestep loop drives the simulation so behaviour is identical on
// 60 Hz and 144 Hz displays; rendering happens once per animation frame.
export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<Renderer | null>(null)
  const stateRef = useRef<GameState>(createState(true))
  const [snapshot, setSnapshot] = useState<{
    s: GameState
    player: Entity
  }>({ s: stateRef.current, player: stateRef.current.entities.find((e) => e.isPlayer)! })
  const [locked, setLocked] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    let renderer: Renderer
    try {
      renderer = new Renderer(canvas)
    } catch (e) {
      return
    }
    rendererRef.current = renderer

    const resize = () => renderer.resize(window.innerWidth, window.innerHeight)
    resize()
    window.addEventListener('resize', resize)

    // ---- input wiring ----
    const keys: Record<string, boolean> = {}
    let mouseDown = false
    let rightDown = false
    let bob = 0
    let recoilKick = 0

    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      keys[k] = true
      if (k === 'r') { /* reload below */ }
      if (k === '1') INPUT.switchTo = 'knife'
      if (k === '2') INPUT.switchTo = snapshotRef.current.player.secondary
      if (k === '3') { const p = snapshotRef.current.player; if (p.primary) INPUT.switchTo = p.primary }
      if (k === 'e') INPUT.defuse = true
      if (k === ' ') e.preventDefault()
      if (k === 'escape') document.exitPointerLock?.()
    }
    const onKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      keys[k] = false
      if (k === 'e') INPUT.defuse = false
    }
    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== canvas) return
      INPUT.yaw -= e.movementX * 0.0022
      INPUT.pitch -= e.movementY * 0.0022
      INPUT.pitch = Math.max(-Math.PI / 2 + 0.05, Math.min(Math.PI / 2 - 0.05, INPUT.pitch))
    }
    const onMouseDown = (e: MouseEvent) => {
      if (document.pointerLockElement !== canvas) return
      if (e.button === 0) { mouseDown = true; INPUT.fire = true }
      if (e.button === 2) { rightDown = true; INPUT.scope = true; INPUT.plant = true }
    }
    const onMouseUp = (e: MouseEvent) => {
      if (e.button === 0) { mouseDown = false; INPUT.fire = false }
      if (e.button === 2) { rightDown = false; INPUT.scope = false }
    }
    const onContext = (e: Event) => e.preventDefault()
    const onLockChange = () => setLocked(document.pointerLockElement === canvas)

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    canvas.addEventListener('contextmenu', onContext)
    document.addEventListener('pointerlockchange', onLockChange)

    // live snapshot ref so key handlers see the current player
    const snapshotRef = { current: snapshot }

    // ---- main loop ----
    let acc = 0
    let last = performance.now()
    let raf = 0
    let hudT = 0
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop)
      const frameDt = Math.min((t - last) / 1000, 0.1)
      last = t
      acc += frameDt

      // read movement keys into INPUT
      INPUT.fwd = (keys['w'] ? 1 : 0) - (keys['s'] ? 1 : 0)
      INPUT.strafe = (keys['d'] ? 1 : 0) - (keys['a'] ? 1 : 0)
      INPUT.jump = !!keys[' ']
      INPUT.crouch = !!keys['shift'] || !!keys['control']
      INPUT.reload = INPUT.reload || !!keys['r']
      if (keys['r']) { INPUT.reload = true; keys['r'] = false }

      const s = stateRef.current
      // fixed-step simulate
      let guard = 0
      while (acc >= TICK && guard++ < 8) {
        step(s, TICK)
        acc -= TICK
      }

      const player = s.entities.find((e) => e.id === s.playerId)!
      playerYawRef.yaw = INPUT.yaw
      playerYawRef.pitch = INPUT.pitch

      // recoil kick decay + head bob
      recoilKick = Math.max(0, recoilKick - frameDt * 6)
      if (INPUT.fire && player.alive) recoilKick = Math.min(1, recoilKick + frameDt * 8)
      const spd = Math.hypot(player.vx, player.vz)
      bob += frameDt * (2 + spd * 1.6)

      renderer.render(s, player, bob, recoilKick)

      snapshotRef.current = { s, player }
      hudT += frameDt
      if (hudT > 0.08) {
        hudT = 0
        setSnapshot({ s, player })
      }
    }

    if (started) raf = requestAnimationFrame(loop)
    else {
      // render one static frame behind the start overlay
      const player = stateRef.current.entities.find((e) => e.id === stateRef.current.playerId)!
      renderer.render(stateRef.current, player, 0, 0)
    }

    // expose a start function via a custom event
    const startHandler = () => {
      if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop) }
    }
    window.addEventListener('mc-start', startHandler)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      canvas.removeEventListener('contextmenu', onContext)
      document.removeEventListener('pointerlockchange', onLockChange)
      window.removeEventListener('mc-start', startHandler)
      renderer.dispose()
    }
  }, [started])

  const begin = () => {
    initAudio()
    resumeAudio()
    setStarted(true)
    setTimeout(() => {
      window.dispatchEvent(new Event('mc-start'))
      canvasRef.current?.requestPointerLock?.()
    }, 30)
  }

  const s = snapshot.s
  const player = snapshot.player

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
      {started && <Hud s={s} player={player} />}
      {started && <Minimap s={s} player={player} />}
      {started && player.scoped && <ScopeOverlay />}
      {started && !player.alive && <SpectateBar s={s} onSpectate={(id) => { s.spectateId = id }} />}
      {!started && <StartOverlay onStart={begin} />}
      {started && !locked && player.alive && (
        <div style={styles.clickHint} onClick={() => canvasRef.current?.requestPointerLock?.()}>
          点击锁定鼠标 · Click to capture mouse
        </div>
      )}
    </div>
  )
}

function ScopeOverlay() {
  return (
    <div style={styles.scopeWrap}>
      <div style={styles.scopeRing} />
      <div style={styles.scopeCrossH} />
      <div style={styles.scopeCrossV} />
      <div style={styles.scopeDot} />
    </div>
  )
}

function SpectateBar({ s, onSpectate }: { s: GameState; onSpectate: (id: number) => void }) {
  const mates = s.entities.filter((e) => e.team === 'CT' && e.alive)
  return (
    <div style={styles.spectate}>
      <div style={{ marginBottom: 6 }}>你已阵亡 · 观战队友视角</div>
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
        {mates.map((m) => (
          <button key={m.id} style={styles.specBtn} onClick={() => onSpectate(m.id)}>{m.name}</button>
        ))}
        {mates.length === 0 && <span style={{ color: '#98a0a8' }}>无存活队友</span>}
      </div>
    </div>
  )
}

function StartOverlay({ onStart }: { onStart: () => void }) {
  return (
    <div style={styles.startWrap}>
      <div style={styles.startCard}>
        <h1 style={styles.startTitle}>DUST2 5v5</h1>
        <div style={styles.startTag}>React + three.js · 程序化生成 · 无外部资产</div>
        <p style={styles.startP}>复刻 Dust2 核心区域的 5v5 爆破模式：你操控 CT，与 4 名 AI 队友对抗 5 名 AI 敌人。回合制、C4 下包/拆包、手枪局开局。</p>
        <div style={styles.keyGrid}>
          <span>移动</span><span>W A S D · 空格跳跃 · Shift/Ctrl 蹲</span>
          <span>视角 / 射击</span><span>鼠标环视 · 左键开火 · AWP 右键开镜</span>
          <span>武器</span><span>1 刀 · 2 手枪 · 3 主武器 · R 换弹</span>
          <span>C4</span><span>持包 T 在点位右键下包 · CT 靠近按 E 拆包</span>
          <span>其他</span><span>Esc 释放鼠标 · 阵亡后可观战队友</span>
        </div>
        <button style={styles.playBtn} onClick={onStart}>进入战场</button>
        <div style={styles.startFine}>点击后浏览器会锁定指针；再次按 Esc 可释放。</div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  scopeWrap: { position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 4, background: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 22%, rgba(0,0,0,0.96) 34%)' },
  scopeRing: { position: 'absolute', left: '50%', top: '50%', width: '46vmin', height: '46vmin', transform: 'translate(-50%,-50%)', borderRadius: '50%', border: '2px solid rgba(0,0,0,0.9)', boxShadow: '0 0 0 200vmax rgba(0,0,0,0.0)' },
  scopeCrossH: { position: 'absolute', left: 0, right: 0, top: '50%', height: 1, background: 'rgba(0,0,0,0.85)' },
  scopeCrossV: { position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, background: 'rgba(0,0,0,0.85)' },
  scopeDot: { position: 'absolute', left: '50%', top: '50%', width: 4, height: 4, transform: 'translate(-50%,-50%)', borderRadius: '50%', background: '#d33' },
  spectate: { position: 'fixed', left: '50%', top: 16, transform: 'translateX(-50%)', zIndex: 6, padding: '10px 16px', borderRadius: 10, background: 'rgba(10,14,20,0.72)', color: '#e8edf2', fontSize: 13, textAlign: 'center', border: '1px solid rgba(255,255,255,0.12)' },
  specBtn: { padding: '5px 12px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.06)', color: '#e8edf2', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12 },
  clickHint: { position: 'fixed', left: '50%', bottom: 92, transform: 'translateX(-50%)', zIndex: 6, padding: '8px 16px', borderRadius: 9, background: 'rgba(10,14,20,0.7)', color: '#cfd6dd', fontSize: 12, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.12)' },
  startWrap: { position: 'fixed', inset: 0, zIndex: 20, display: 'grid', placeItems: 'center', background: 'radial-gradient(90% 70% at 50% 35%, rgba(28,34,44,0.9), rgba(6,8,12,0.97))' },
  startCard: { maxWidth: 600, padding: '34px 42px', textAlign: 'center', borderRadius: 18, background: 'rgba(12,17,25,0.72)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' },
  startTitle: { fontSize: 32, letterSpacing: '0.12em', fontWeight: 800, color: '#f3d489', margin: 0 },
  startTag: { fontSize: 12, letterSpacing: '0.16em', color: '#9aa3ad', margin: '6px 0 18px' },
  startP: { fontSize: 13, lineHeight: 1.9, color: '#c4ccd4', margin: '0 0 8px' },
  keyGrid: { display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '7px 16px', margin: '18px 0 24px', textAlign: 'left', fontSize: 12.5, color: '#9aa3ad' },
  playBtn: { padding: '13px 46px', borderRadius: 11, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, letterSpacing: '0.08em', fontWeight: 700, color: '#1a1408', background: 'linear-gradient(180deg,#f2d489,#e6c069)' },
  startFine: { marginTop: 16, fontSize: 10.5, color: '#69727c' },
}
