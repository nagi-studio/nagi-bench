import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import * as THREE from 'three'

class Body {
  angle = 0
  omega = 0
  invI = 1
  torque = 0
  damping = 0.05
  minOmega = -Infinity
  maxOmega = Infinity
  constructor(invI = 1, damping = 0.05) { this.invI = invI; this.damping = damping }
}

interface GearPair { a: number; b: number; ratio: number }

class Mechanics {
  bodies: Body[] = []
  gears: GearPair[] = []
  waterFlow = 0
  lock = 0
  lockPhase = 0
  ticks = 0
  lastTooth = 0
  puppetImpulse = 0
  chimeAt = -1

  constructor() {
    for (let i = 0; i < 9; i++) this.bodies.push(new Body(1 / (1 + i * 0.55), 0.04 + i * 0.012))
    this.bodies[7].damping = 0.012
    this.gears.push({ a: 0, b: 1, ratio: 3.0 })
    this.gears.push({ a: 1, b: 2, ratio: 2.5 })
    this.gears.push({ a: 2, b: 3, ratio: 2.0 })
    this.gears.push({ a: 3, b: 4, ratio: 1.6 })
    this.gears.push({ a: 4, b: 5, ratio: 1.4 })
    this.gears.push({ a: 5, b: 6, ratio: 1.2 })
    this.gears.push({ a: 0, b: 8, ratio: 0.42 })
  }

  step(dt: number, flow: number) {
    const b = this.bodies
    this.waterFlow += (flow - this.waterFlow) * Math.min(1, dt * 2.2)

    const wheel = b[0]
    const tooth = Math.PI * 2 / 36
    wheel.torque = this.waterFlow * 34 - 1.1

    const osc = b[7]
    const k = 26.0
    osc.torque = -k * Math.sin(osc.angle) - 0.28 * osc.omega

    for (const body of b) {
      const accel = (body.torque - body.damping * body.omega) * body.invI
      body.omega += accel * dt
      body.omega = Math.max(body.minOmega, Math.min(body.maxOmega, body.omega))
      body.angle += body.omega * dt
      body.torque = 0
    }

    const locked = this.lock > 0
    if (locked) {
      wheel.omega = 0
      wheel.angle = this.lastTooth * tooth
      this.lock -= dt
    } else {
      const crossed = Math.floor(wheel.angle / tooth)
      if (crossed > this.lastTooth) {
        this.lastTooth = crossed
        this.ticks++
        this.lock = 0.085
        osc.omega += 3.1 * Math.sign(osc.omega || 1)
        wheel.angle = crossed * tooth
        if (this.ticks % 12 === 0) { this.puppetImpulse = 5.2; this.chimeAt = this.ticks }
      }
    }

    for (let iter = 0; iter < 3; iter++) {
      for (const g of this.gears) {
        const A = b[g.a], B = b[g.b]
        const err = B.omega + g.ratio * A.omega
        const eff = A.invI * g.ratio * g.ratio + B.invI
        const lambda = err / (eff + 1e-7)
        A.omega -= lambda * g.ratio * A.invI
        B.omega -= lambda * B.invI
      }
    }
    if (locked) { wheel.omega = 0; wheel.angle = this.lastTooth * tooth }

    if (this.puppetImpulse > 0) {
      for (const idx of [9, 10, 11]) {
        if (this.bodies[idx]) { this.bodies[idx].omega += this.puppetImpulse * this.bodies[idx].invI; this.puppetImpulse *= 0.7 }
      }
      this.puppetImpulse = 0
    }
  }
}

const CHAPTERS = [
  { t: 0, title: '一 · 水从高处来', text: '北宋苏颂的水运仪象台，以恒定水流作为整座钟的原动力。' },
  { t: 5, title: '二 · 水推动枢轮', text: '水注入枢轮轮缘的三十六只水斗，一侧渐重，重力产生转矩。' },
  { t: 11, title: '三 · 轮系传递', text: '相互啮合的齿轮把转动逐级传到计时轴，每一级由物理约束求解转速比。' },
  { t: 17, title: '四 · 擒纵定时', text: '擒纵机构按水斗逐一放行，把连续重力切成等时间隔，速度因此恒定。' },
  { t: 23, title: '五 · 报时与浑仪', text: '报时轮拨动木偶击钲，顶层的浑仪随之运转，观测与报时合为一体。' },
  { t: 27.5, title: '六 · 一台机器，一条因果链', text: '水 → 重力 → 转矩 → 齿轮 → 擒纵 → 报时。每一步都由下一步接续。' },
]

function buildTower(scene: THREE.Scene) {
  const wood = new THREE.MeshStandardMaterial({ color: 0x7a5334, roughness: 0.78, metalness: 0.06 })
  const darkWood = new THREE.MeshStandardMaterial({ color: 0x402c1d, roughness: 0.85 })
  const bronze = new THREE.MeshStandardMaterial({ color: 0xb98b47, roughness: 0.32, metalness: 0.86 })
  const brass = new THREE.MeshStandardMaterial({ color: 0xd8b26a, roughness: 0.26, metalness: 0.9 })
  const stone = new THREE.MeshStandardMaterial({ color: 0x6b6a63, roughness: 0.92 })
  const water = new THREE.MeshStandardMaterial({ color: 0x3f9fc4, roughness: 0.16, metalness: 0.24, transparent: true, opacity: 0.82 })
  const jade = new THREE.MeshStandardMaterial({ color: 0x9fd4c6, roughness: 0.35, metalness: 0.2 })

  const root = new THREE.Group()
  scene.add(root)

  const base = new THREE.Mesh(new THREE.BoxGeometry(15, 0.9, 15), stone)
  base.position.y = -5.2
  root.add(base)
  for (const x of [-5.6, 5.6]) for (const z of [-5.6, 5.6]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.62, 11.4, 0.62), wood)
    post.position.set(x, 0.4, z)
    root.add(post)
  }
  for (const y of [-4.6, -0.4, 3.8]) {
    for (const z of [-5.6, 5.6]) {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(11.8, 0.38, 0.5), darkWood)
      beam.position.set(0, y, z); root.add(beam)
    }
    for (const x of [-5.6, 5.6]) {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.38, 11.8), darkWood)
      beam.position.set(x, y, 0); root.add(beam)
    }
  }

  const tank = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.1, 1.7, 20), bronze)
  tank.position.set(-3.2, 5.0, 0); root.add(tank)
  const tankWater = new THREE.Mesh(new THREE.CylinderGeometry(1.94, 1.94, 1.3, 20), water)
  tankWater.position.set(-3.2, 5.2, 0); root.add(tankWater)
  const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 1.5, 10), bronze)
  spout.rotation.z = Math.PI / 2; spout.position.set(-2.2, 4.55, 0); root.add(spout)

  const drops: THREE.Mesh[] = []
  for (let i = 0; i < 26; i++) {
    const d = new THREE.Mesh(new THREE.SphereGeometry(0.105, 8, 6), water)
    d.position.set(-1.5 + Math.random() * 0.2, 4.3 - Math.random() * 5.6, (Math.random() - 0.5) * 0.22)
    d.userData.v = 0
    root.add(d); drops.push(d)
  }

  const wheelGroup = new THREE.Group()
  wheelGroup.position.set(0, -0.4, 0)
  wheelGroup.rotation.y = Math.PI / 2
  root.add(wheelGroup)
  const rim = new THREE.Mesh(new THREE.TorusGeometry(3.15, 0.19, 10, 48), bronze)
  wheelGroup.add(rim)
  const rim2 = new THREE.Mesh(new THREE.TorusGeometry(3.15, 0.19, 10, 48), bronze)
  rim2.position.z = -0.95; wheelGroup.add(rim2)
  for (let i = 0; i < 8; i++) {
    const sp = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.2, 0.2), darkWood)
    sp.rotation.z = i * Math.PI / 8; wheelGroup.add(sp)
  }
  const buckets: THREE.Mesh[] = []
  for (let i = 0; i < 36; i++) {
    const a = i * Math.PI * 2 / 36
    const bk = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.5, 0.78), i % 3 === 0 ? jade : bronze)
    bk.position.set(Math.cos(a) * 3.15, Math.sin(a) * 3.15, -0.48)
    bk.rotation.z = a + Math.PI / 2
    wheelGroup.add(bk); buckets.push(bk)
  }
  const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 2.4, 16), brass)
  axle.rotation.x = Math.PI / 2; axle.position.z = -0.48; wheelGroup.add(axle)

  function makeGear(r: number, teeth: number, material: THREE.Material, x: number, y: number, z: number) {
    const g = new THREE.Group()
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.84, r * 0.84, 0.24, 28), material)
    disc.rotation.x = Math.PI / 2; g.add(disc)
    for (let i = 0; i < teeth; i++) {
      const a = i * Math.PI * 2 / teeth
      const t = new THREE.Mesh(new THREE.BoxGeometry(r * 0.19, r * 0.13, 0.24), material)
      t.position.set(Math.cos(a) * r * 0.9, Math.sin(a) * r * 0.9, 0)
      t.rotation.z = a; g.add(t)
    }
    for (let i = 0; i < 5; i++) {
      const a = i * Math.PI * 2 / 5
      const s = new THREE.Mesh(new THREE.BoxGeometry(r * 0.72, r * 0.09, 0.16), material)
      s.position.set(Math.cos(a) * r * 0.42, Math.sin(a) * r * 0.42, 0); s.rotation.z = a; g.add(s)
    }
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.13, r * 0.13, 0.4, 16), brass)
    hub.rotation.x = Math.PI / 2; g.add(hub)
    g.position.set(x, y, z); root.add(g)
    return g
  }
  const gears = [
    makeGear(1.55, 18, brass, 3.1, -0.4, 1.4),
    makeGear(1.10, 14, bronze, 5.0, 1.5, 1.4),
    makeGear(0.86, 12, brass, 3.6, 2.9, 1.4),
    makeGear(0.68, 10, bronze, 1.7, 3.5, 1.4),
    makeGear(0.54, 9, brass, 0.2, 3.0, 1.4),
    makeGear(0.44, 8, bronze, -0.9, 2.1, 1.4),
    makeGear(0.36, 7, brass, -1.6, 0.9, 1.4),
  ]

  const pendulum = new THREE.Group()
  const rod = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.1, 0.12), brass)
  rod.position.y = -1.4; pendulum.add(rod)
  const bob = new THREE.Mesh(new THREE.SphereGeometry(0.48, 16, 12), bronze)
  bob.position.y = -2.9; pendulum.add(bob)
  const anchor = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.24, 0.3), brass)
  anchor.position.y = 0.2; pendulum.add(anchor)
  pendulum.position.set(-2.4, 3.4, 1.6)
  root.add(pendulum)

  const drum = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.25, 2.6, 24), wood)
  drum.rotation.x = Math.PI / 2; drum.position.set(0, 3.6, -2.0); root.add(drum)
  for (let i = 0; i < 12; i++) {
    const peg = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.34, 0.16), brass)
    const a = i * Math.PI / 2 / 3
    peg.position.set(0, 3.6 + Math.cos(a) * 1.35, -2.0 + Math.sin(a) * 1.35)
    drum.add(peg)
  }
  const puppets: THREE.Group[] = []
  for (let i = 0; i < 3; i++) {
    const p = new THREE.Group()
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.86, 0.32), i === 1 ? bronze : jade)
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), wood)
    head.position.y = 0.58; p.add(body); p.add(head)
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.1), brass)
    arm.position.set(0.34, 0.16, 0); p.add(arm)
    p.position.set(-1.8 + i * 1.8, 2.4, -2.0)
    root.add(p); puppets.push(p)
  }

  const armillary = new THREE.Group()
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.7 - i * 0.22, 0.055, 8, 48), brass)
    ring.rotation.set(i * 0.9, i * 0.6, i * 0.3); armillary.add(ring)
  }
  const globe = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 12), jade)
  armillary.add(globe)
  armillary.position.set(0, 6.6, 0); root.add(armillary)

  const lights: THREE.Light[] = []
  const key = new THREE.DirectionalLight(0xffe2b0, 2.1); key.position.set(8, 13, 10); root.add(key)
  const fill = new THREE.DirectionalLight(0x8ec2e8, 1.0); fill.position.set(-10, 4, -8); root.add(fill)
  const amb = new THREE.AmbientLight(0x5d6b78, 0.8); root.add(amb)
  lights.push(key, fill, amb)

  return { root, wheelGroup, gears, pendulum, drum, puppets, armillary, drops, tankWater }
}

class SoundDesign {
  ctx: AudioContext | null = null
  master: GainNode | null = null
  drone: OscillatorNode[] = []
  lastClick = 0
  lastChime = 0

  start() {
    const AC = (window as any).AudioContext || (window as any).webkitAudioContext
    if (!AC) return
    this.ctx = new AC()
    this.master = this.ctx.createGain()
    this.master.gain.value = 0.24
    this.master.connect(this.ctx.destination)
    for (const f of [55, 82.4, 110]) {
      const o = this.ctx.createOscillator()
      const g = this.ctx.createGain()
      o.type = 'sine'; o.frequency.value = f; g.gain.value = 0.11
      o.connect(g); g.connect(this.master!); o.start()
      this.drone.push(o)
    }
  }
  tick(now: number, ticks: number, flow: number) {
    if (!this.ctx || !this.master) return
    const c = this.ctx
    if (ticks !== this.lastClick && now - this.lastClick > 0.06) {
      this.lastClick = now
      const o = c.createOscillator(), g = c.createGain()
      o.type = 'square'; o.frequency.setValueAtTime(640, c.currentTime)
      o.frequency.exponentialRampToValueAtTime(210, c.currentTime + 0.05)
      g.gain.setValueAtTime(0.035, c.currentTime)
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.07)
      o.connect(g); g.connect(this.master); o.start(); o.stop(c.currentTime + 0.08)
    }
    if (ticks % 12 === 0 && ticks !== this.lastChime && ticks > 0) {
      this.lastChime = ticks
      for (const f of [523.25, 659.25, 783.99]) {
        const o = c.createOscillator(), g = c.createGain()
        o.type = 'sine'; o.frequency.value = f
        g.gain.setValueAtTime(0.0001, c.currentTime)
        g.gain.exponentialRampToValueAtTime(0.07, c.currentTime + 0.02)
        g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 1.5)
        o.connect(g); g.connect(this.master); o.start(); o.stop(c.currentTime + 1.6)
      }
    }
    if (Math.random() < flow * 0.012) {
      const o = c.createOscillator(), g = c.createGain()
      o.type = 'sine'; o.frequency.setValueAtTime(900 + Math.random() * 600, c.currentTime)
      o.frequency.exponentialRampToValueAtTime(320, c.currentTime + 0.09)
      g.gain.setValueAtTime(0.018, c.currentTime)
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.11)
      o.connect(g); g.connect(this.master); o.start(); o.stop(c.currentTime + 0.12)
    }
  }
}

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [chapter, setChapter] = useState(0)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const pausedRef = useRef(false)
  const [time, setTime] = useState(0)
  useEffect(() => { pausedRef.current = paused }, [paused])

  useEffect(() => {
    const canvas = canvasRef.current!
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8))
    renderer.setSize(innerWidth, innerHeight)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0b1018)
    scene.fog = new THREE.FogExp2(0x0b1018, 0.014)
    const camera = new THREE.PerspectiveCamera(46, innerWidth / innerHeight, 0.1, 200)
    const parts = buildTower(scene)
    const mech = new Mechanics()
    const sound = new SoundDesign()
    let started = false
    const onFirst = () => { if (!started) { started = true; sound.start() } }
    window.addEventListener('pointerdown', onFirst)
    window.addEventListener('keydown', onFirst)

    let last = performance.now(), elapsed = 0, raf = 0
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      const dtReal = Math.min((now - last) / 1000, 0.05); last = now
      if (pausedRef.current) { renderer.render(scene, camera); return }
      elapsed += dtReal
      const t = Math.min(elapsed, 30)
      const flow = t < 0.6 ? t / 0.6 : (t > 28 ? Math.max(0, (30 - t) / 2) : 1)

      const sub = 4
      for (let s = 0; s < sub; s++) mech.step(dtReal / sub, flow)
      mech.bodies[9] = mech.bodies[9] || new Body(2, 0.9)
      mech.bodies[10] = mech.bodies[10] || new Body(2, 0.9)
      mech.bodies[11] = mech.bodies[11] || new Body(2, 0.9)
      for (let i = 9; i <= 11; i++) {
        const b = mech.bodies[i]
        b.torque = -6 * b.angle - 0.6 * b.omega
        b.omega += (b.torque - b.damping * b.omega) * b.invI * dtReal
        b.angle += b.omega * dtReal
      }

      parts.wheelGroup.rotation.z = mech.bodies[0].angle
      for (let i = 0; i < parts.gears.length; i++) parts.gears[i].rotation.z = mech.bodies[i + 1].angle
      parts.pendulum.rotation.z = Math.sin(mech.bodies[7].angle) * 0.32
      parts.drum.rotation.z = -mech.bodies[6].angle * 0.32
      parts.armillary.rotation.y = mech.bodies[8].angle
      for (let i = 0; i < 3; i++) parts.puppets[i].rotation.z = Math.sin(mech.bodies[9 + i].angle) * 0.5
      parts.tankWater.scale.y = Math.max(0.08, 1 - t / 42)
      for (const d of parts.drops) {
        d.position.y -= (1.6 + (d.userData.v as number)) * dtReal
        d.userData.v = (d.userData.v as number) + 3.2 * dtReal
        d.visible = flow > 0.02
        if (d.position.y < -1.2) { d.position.y = 4.3 + Math.random() * 0.4; d.userData.v = 0 }
      }

      const chapterTargets = [
        [12, 7, 15], [7, 2.5, 11], [5, 4.5, 9], [4, 3.5, 7], [7, 5, 10], [13, 8, 17],
      ]
      let ci = 0
      for (let i = 0; i < CHAPTERS.length; i++) if (t >= CHAPTERS[i].t) ci = i
      const next = chapterTargets[Math.min(ci + 1, chapterTargets.length - 1)]
      const cur = chapterTargets[ci]
      const local = CHAPTERS[ci + 1] ? (t - CHAPTERS[ci].t) / (CHAPTERS[ci + 1].t - CHAPTERS[ci].t) : 0
      const e = local * local * (3 - 2 * local)
      camera.position.set(cur[0] + (next[0] - cur[0]) * e, cur[1] + (next[1] - cur[1]) * e, cur[2] + (next[2] - cur[2]) * e)
      camera.lookAt(0, 1.1, 0)

      sound.tick(t, mech.ticks, flow)
      if (Math.floor(t * 6) % 3 === 0) { setChapter(ci); setProgress(t / 30); setTime(t) }
      renderer.render(scene, camera)
    }
    raf = requestAnimationFrame(loop)
    const onResize = () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight) }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); window.removeEventListener('pointerdown', onFirst); window.removeEventListener('keydown', onFirst); renderer.dispose() }
  }, [])

  const c = CHAPTERS[chapter]
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#0b1018', fontFamily: 'system-ui, sans-serif', color: '#e8e2d4' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', left: 34, top: 28, letterSpacing: '.24em', fontSize: 12, color: '#b9a47c' }}>水 运 仪 象 台</div>
      <div style={{ position: 'absolute', left: 34, top: 52, fontSize: 11, color: '#7d8b96', letterSpacing: '.12em' }}>
        实时刚体动力学 · 齿轮约束求解 · 擒纵锁定释放
      </div>
      <div style={{ position: 'absolute', left: 34, bottom: 76, maxWidth: 620 }}>
        <div style={{ fontSize: 20, color: '#e9cd94', letterSpacing: '.12em', marginBottom: 12 }}>{c.title}</div>
        <div style={{ fontSize: 15, lineHeight: 1.9, color: '#d5dde4', textShadow: '0 2px 8px #000' }}>{c.text}</div>
      </div>
      <div style={{ position: 'absolute', left: 34, right: 34, bottom: 42, height: 2, background: 'rgba(255,255,255,.14)' }}>
        <div style={{ width: (progress * 100) + '%', height: '100%', background: '#d8b26a' }} />
      </div>
      <div style={{ position: 'absolute', right: 34, bottom: 48, fontFamily: 'monospace', fontSize: 11, color: '#9aa8b2' }}>
        {time.toFixed(1)} / 30.0 s
      </div>
      <button onClick={() => setPaused(p => !p)} style={{ position: 'absolute', right: 34, top: 28, background: 'rgba(12,18,26,.7)', color: '#d8b26a', border: '1px solid rgba(216,178,106,.5)', borderRadius: 18, padding: '7px 16px', fontSize: 11, letterSpacing: '.12em', cursor: 'pointer' }}>
        {paused ? '继续' : '暂停'}
      </button>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
