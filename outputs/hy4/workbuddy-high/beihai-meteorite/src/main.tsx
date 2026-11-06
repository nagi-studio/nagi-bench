import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import * as THREE from 'three'

const DURATION = 300

interface Cue {
  id: string
  kind: string
  speaker: string
  text: string
  delivery: string
  start: number
  end: number
}

const VOICE_CUES: Cue[] = [
  { id: 'v001', kind: 'narration', speaker: '旁白', text: '公元二十一世纪，人类仍在为「该往哪里去」争吵。', delivery: '低沉、克制', start: 4, end: 13 },
  { id: 'v002', kind: 'title', speaker: '字幕', text: '章北海 · 陨石子弹', delivery: '无', start: 14, end: 22 },
  { id: 'v003', kind: 'ambient', speaker: '工人甲', text: '这批料子密度不对，再车一遍。', delivery: '压低嗓音、带回声', start: 26, end: 33 },
  { id: 'v004', kind: 'ambient', speaker: '工人乙', text: '听说要拿它做弹头？', delivery: '随口一问', start: 34, end: 39 },
  { id: 'v005', kind: 'inner', speaker: '章北海', text: '陨石不是武器。是让所有人无法再回头的证据。', delivery: '平静、不带情绪', start: 42, end: 53 },
  { id: 'v006', kind: 'radio', speaker: '广播', text: '请各位代表进入会议厅，议题：工质推进飞船可行性。', delivery: '机械、失真', start: 62, end: 71 },
  { id: 'v007', kind: 'dialogue', speaker: '老航天', text: '辐射帆、无工质推进，都是纸上谈兵。稳妥路线不能丢。', delivery: '缓慢、笃定', start: 76, end: 88 },
  { id: 'v008', kind: 'dialogue', speaker: '与会者', text: '可我们已经没有第二个两百年了。', delivery: '短促、犹豫', start: 90, end: 96 },
  { id: 'v009', kind: 'inner', speaker: '章北海', text: '他们不是错，只是站得太靠近现在。', delivery: '近乎耳语', start: 100, end: 108 },
  { id: 'v010', kind: 'inner', speaker: '章北海', text: '总要有人，替未来做一次选择。', delivery: '渐强、决绝', start: 112, end: 121 },
  { id: 'v011', kind: 'radio', speaker: '地面控制', text: '北海，出舱窗口还有九十秒。', delivery: '带电流杂音', start: 136, end: 143 },
  { id: 'v012', kind: 'dialogue', speaker: '章北海', text: '收到。按计划执行。', delivery: '平稳', start: 144, end: 149 },
  { id: 'v013', kind: 'inner', speaker: '章北海', text: '宇宙里没有声音，也没有人能拦住一颗石头。', delivery: '极轻', start: 158, end: 168 },
  { id: 'v014', kind: 'radio', speaker: '航天服', text: '氧气循环正常。心率六十二。', delivery: '合成音、无起伏', start: 172, end: 179 },
  { id: 'v015', kind: 'inner', speaker: '章北海', text: '对不起。', delivery: '只有三个字', start: 188, end: 192 },
  { id: 'v016', kind: 'silence', speaker: '字幕', text: '真空不传递枪声。只有航天服里的一记闷震。', delivery: '无', start: 200, end: 210 },
  { id: 'v017', kind: 'radio', speaker: '地面控制', text: '目标失去信号……重复，目标失去信号。', delivery: '急促、失真', start: 222, end: 230 },
  { id: 'v018', kind: 'ambient', speaker: '控制厅', text: '三名，全部。', delivery: '几乎听不见', start: 233, end: 238 },
  { id: 'v019', kind: 'inner', speaker: '章北海', text: '从此，飞船只能向前。', delivery: '释然', start: 248, end: 256 },
  { id: 'v020', kind: 'narration', speaker: '旁白', text: '后来的人称那一天为「陨石雨」，却很少提起雨从何来。', delivery: '远、克制', start: 262, end: 273 },
  { id: 'v021', kind: 'title', speaker: '字幕', text: '献给所有替未来承担的人', delivery: '无', start: 278, end: 288 },
  { id: 'v022', kind: 'credits', speaker: '字幕', text: '改编自《三体》章北海片段 · 程序化体素影像 · 全片时长 300 秒', delivery: '无', start: 289, end: 298 },
]

interface Shot {
  start: number
  end: number
  scene: string
  cam: [number, number, number]
  look: [number, number, number]
  fov: number
}

const SHOTS: Shot[] = [
  { start: 0, end: 18, scene: 'void', cam: [0, 6, 34], look: [0, 2, 0], fov: 52 },
  { start: 18, end: 58, scene: 'basement', cam: [9, 4.5, 13], look: [0, 1.6, 0], fov: 46 },
  { start: 58, end: 96, scene: 'hall', cam: [0, 4, 17], look: [0, 2, 0], fov: 48 },
  { start: 96, end: 128, scene: 'hall', cam: [4.5, 2.4, 6.5], look: [1.2, 2.1, 0], fov: 38 },
  { start: 128, end: 158, scene: 'orbit', cam: [-14, 8, 24], look: [0, 0, 0], fov: 60 },
  { start: 158, end: 196, scene: 'eva', cam: [6, 2, 10], look: [0, 1, 0], fov: 42 },
  { start: 196, end: 214, scene: 'vacuum', cam: [2.2, 1.4, 4.2], look: [0, 1.2, -2], fov: 30 },
  { start: 214, end: 246, scene: 'debris', cam: [-8, 5, 16], look: [0, 0, 0], fov: 56 },
  { start: 246, end: 278, scene: 'orbit', cam: [12, 3, -18], look: [0, 1, 0], fov: 50 },
  { start: 278, end: 300, scene: 'void', cam: [0, 0, 20], look: [0, 0, 0], fov: 44 },
]

const PAL = {
  dark: 0x1a2029, steel: 0x59636d, light: 0xa9b4bd, pale: 0xdfe6e8,
  gold: 0xc9a05c, rust: 0x8c4a35, blue: 0x3c6f9e, glow: 0x7fd4e6,
  skin: 0xd0b49a, suit: 0xe6e9e6, visor: 0x14293b, red: 0xa63838,
}

function box(w: number, h: number, d: number, color: number, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color, roughness: 0.82, metalness: 0.12 }))
  m.position.set(x, y, z)
  return m
}
function voxelPerson(color: number, suit = false) {
  const g = new THREE.Group()
  const body = suit ? PAL.suit : color
  g.add(box(1.0, 1.35, 0.62, body, 0, 1.65, 0))
  g.add(box(0.72, 0.68, 0.68, suit ? PAL.visor : PAL.skin, 0, 2.65, 0))
  if (suit) {
    g.add(box(0.76, 0.3, 0.72, PAL.gold, 0, 2.88, 0))
    const v = box(0.6, 0.26, 0.06, 0x0d1c2c, 0, 2.68, 0.35)
    ;(v.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(0x1d4a66)
    g.add(v)
    g.add(box(1.35, 0.34, 0.72, body, 0, 1.95, 0))
    g.add(box(0.9, 0.28, 0.9, PAL.steel, 0, 1.2, 0))
  }
  g.add(box(0.32, 1.25, 0.36, body, -0.68, 1.7, 0))
  g.add(box(0.32, 1.25, 0.36, body, 0.68, 1.7, 0))
  g.add(box(0.36, 1.15, 0.42, suit ? body : PAL.dark, -0.27, 0.55, 0))
  g.add(box(0.36, 1.15, 0.42, suit ? body : PAL.dark, 0.27, 0.55, 0))
  g.add(box(0.42, 0.2, 0.55, PAL.dark, -0.27, 0.02, 0.08))
  g.add(box(0.42, 0.2, 0.55, PAL.dark, 0.27, 0.02, 0.08))
  return g
}

function buildScenes(scene: THREE.Scene) {
  const groups: Record<string, THREE.Group> = {}
  for (const k of ['void', 'basement', 'hall', 'orbit', 'eva', 'vacuum', 'debris']) {
    const g = new THREE.Group(); g.visible = false; scene.add(g); groups[k] = g
  }

  const starGeo = new THREE.BufferGeometry()
  const pts: number[] = []
  for (let i = 0; i < 1400; i++) {
    const r = 70 + Math.random() * 90
    const th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1)
    pts.push(r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph), r * Math.sin(ph) * Math.sin(th))
  }
  starGeo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xdfe9f2, size: 0.42, sizeAttenuation: true }))
  for (const k of ['void', 'orbit', 'eva', 'vacuum', 'debris']) groups[k].add(stars.clone())

  const titleBlock = new THREE.Group()
  for (let i = 0; i < 9; i++) {
    const b = box(1.5, 1.5, 1.5, i % 2 ? PAL.gold : PAL.steel, (i - 4) * 1.75, Math.sin(i * 0.9) * 0.8, 0)
    titleBlock.add(b)
  }
  titleBlock.position.set(0, 2, 0)
  groups['void'].add(titleBlock)
  const earth = box(7, 7, 7, 0x2c5674, -14, 5, -18)
  groups['orbit'].add(earth)
  for (let i = 0; i < 8; i++) groups['orbit'].add(box(1.6, 1.6, 1.6, 0x3f7691, -14 + (Math.random() - .5) * 8, 5 + (Math.random() - .5) * 8, -18 + (Math.random() - .5) * 8))

  const bm = groups['basement']
  bm.add(box(30, 0.5, 24, 0x2a2e33, 0, -0.3, 0))
  bm.add(box(30, 10, 0.5, 0x242a30, 0, 4.7, -11.8))
  bm.add(box(0.5, 10, 24, 0x242a30, -14.8, 4.7, 0))
  for (let i = -3; i <= 3; i++) bm.add(box(0.5, 0.5, 24, 0x394049, i * 4, 9.4, 0))
  const lamp = new THREE.Mesh(box(2.2, 0.24, 2.2, 0xf5e3b8, 0, 9.0, 0).geometry, new THREE.MeshStandardMaterial({ color: 0xffe6b0, emissive: 0xffd68a, emissiveIntensity: 1.6 }))
  lamp.position.set(0, 9.0, 0); bm.add(lamp)
  const pl = new THREE.PointLight(0xffd9a0, 2.4, 40); pl.position.set(0, 8.6, 0); bm.add(pl)
  bm.add(box(8, 1.1, 3, PAL.steel, 0, 1.0, 0))
  for (const x of [-3.4, 3.4]) for (const z of [-1.2, 1.2]) bm.add(box(0.34, 1.0, 0.34, PAL.dark, x, 0.45, z))
  const lathe = new THREE.Group()
  lathe.add(box(2.2, 1.5, 1.5, 0x4a555e, 0, 1.9, 0))
  const spindle = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 3.2, 12), new THREE.MeshStandardMaterial({ color: PAL.gold, metalness: 0.85, roughness: 0.3 }))
  spindle.rotation.z = Math.PI / 2; spindle.position.set(0, 2.3, 0); lathe.add(spindle)
  lathe.position.set(-1.2, 0, 0); bm.add(lathe)
  const rock = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55, 0), new THREE.MeshStandardMaterial({ color: 0x6b5a4a, roughness: 0.95, flatShading: true }))
  rock.position.set(1.4, 1.75, 0.4); bm.add(rock)
  const p1 = voxelPerson(PAL.blue); p1.position.set(-3.2, 0, 1.2); p1.rotation.y = 0.7; bm.add(p1)
  const p2 = voxelPerson(PAL.rust); p2.position.set(3.4, 0, 1.4); p2.rotation.y = -0.6; bm.add(p2)
  const hero = voxelPerson(PAL.dark); hero.position.set(0.4, 0, 3.4); hero.rotation.y = 0.1; bm.add(hero)

  const hall = groups['hall']
  hall.add(box(26, 0.5, 20, 0x30363e, 0, -0.3, 0))
  hall.add(box(26, 9, 0.5, 0x262d36, 0, 4.3, -9.8))
  for (let i = -4; i <= 4; i++) hall.add(box(0.7, 8, 0.7, 0x4a535c, i * 3, 4, -8.6))
  hall.add(box(12, 0.75, 3.4, 0x6a5340, 0, 1.2, 0))
  const panel = box(9, 3.2, 0.28, 0x1d2a38, 0, 5.0, -9.4)
  hall.add(panel)
  const seats = [voxelPerson(PAL.steel), voxelPerson(PAL.rust), voxelPerson(PAL.blue), voxelPerson(PAL.pale), voxelPerson(PAL.gold)]
  seats.forEach((s, i) => { s.position.set(-5 + i * 2.5, 0, -2.6); s.rotation.y = Math.PI; hall.add(s) })
  const oldMan = voxelPerson(PAL.pale); oldMan.position.set(0, 0, 2.8); oldMan.rotation.y = 0; hall.add(oldMan)
  const hallHero = voxelPerson(PAL.dark); hallHero.position.set(5.4, 0, 2.2); hallHero.rotation.y = -0.3; hall.add(hallHero)
  const hl = new THREE.PointLight(0xffe2b4, 2.2, 45); hl.position.set(0, 7, 0); hall.add(hl)

  const station = new THREE.Group()
  for (let i = 0; i < 12; i++) station.add(box(1.2, 1.2, 5, i % 3 ? 0x8a9299 : 0xb0b8bd, (i % 4 - 1.5) * 2.4, Math.floor(i / 4) * 1.4 - 1.4, 0))
  station.position.set(8, 0, -6)
  for (const k of ['eva', 'vacuum', 'orbit']) groups[k].add(station.clone())
  const suitA = voxelPerson(0, true); suitA.position.set(-3, 0, 0); groups['eva'].add(suitA)
  const suitB = voxelPerson(0, true); suitB.position.set(2, 0.4, -2.4); groups['eva'].add(suitB)
  const suitC = voxelPerson(0, true); suitC.position.set(4.5, -0.6, -4.2); groups['eva'].add(suitC)
  const shooter = voxelPerson(0, true); shooter.position.set(0, 0, 0); shooter.rotation.y = 0.2; groups['vacuum'].add(shooter)
  const gun = box(0.24, 0.24, 1.5, 0x39424b, 0.55, 1.9, -0.9); groups['vacuum'].add(gun)
  const targets = [voxelPerson(0, true), voxelPerson(0, true), voxelPerson(0, true)]
  targets.forEach((t, i) => { t.position.set(-2 + i * 2.1, -0.2, -8 - i * 0.6); groups['vacuum'].add(t); groups['debris'].add(t.clone()) })
  for (let i = 0; i < 90; i++) {
    const a = new THREE.Mesh(new THREE.IcosahedronGeometry(0.16 + Math.random() * 0.5, 0), new THREE.MeshStandardMaterial({ color: 0x6e6257, flatShading: true, roughness: 1 }))
    a.position.set((Math.random() - .5) * 40, (Math.random() - .5) * 22, (Math.random() - .5) * 30)
    a.userData.spin = (Math.random() - .5) * 0.4
    groups['debris'].add(a)
  }
  const sun = new THREE.DirectionalLight(0xfff2d8, 2.6); sun.position.set(12, 14, 8); scene.add(sun)
  scene.add(new THREE.AmbientLight(0x556273, 0.72))

  return { groups, titleBlock, rock, lathe, spindle, stars: stars.clone(), targets, gun, hero, hallHero }
}

class AudioEngine {
  ctx: AudioContext | null = null
  master: GainNode | null = null
  conv: ConvolverNode | null = null
  lastCue = ''
  lastTick = -1
  init() {
    const AC = (window as any).AudioContext || (window as any).webkitAudioContext
    if (!AC) return
    const c = new AC(); this.ctx = c
    const m = c.createGain(); m.gain.value = 0.26; m.connect(c.destination); this.master = m
    const conv = c.createConvolver()
    const len = Math.floor(c.sampleRate * 1.9)
    const buf = c.createBuffer(2, len, c.sampleRate)
    for (let ch = 0; ch < 2; ch++) {
      const dat = buf.getChannelData(ch)
      for (let i = 0; i < len; i++) dat[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.2) * 0.55
    }
    conv.buffer = buf; conv.connect(m); this.conv = conv
  }
  noise(dur: number, gain: number, filterHz: number, reverb: boolean, at?: number) {
    const c = this.ctx!; const t = at ?? c.currentTime
    const n = Math.floor(c.sampleRate * dur)
    const buf = c.createBuffer(1, n, c.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 1.4)
    const src = c.createBufferSource(); src.buffer = buf
    const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = filterHz
    const g = c.createGain(); g.gain.value = gain
    src.connect(f); f.connect(g); g.connect(this.master!)
    if (reverb && this.conv) g.connect(this.conv)
    src.start(t); src.stop(t + dur + 0.02)
  }
  tone(freq: number, dur: number, gain: number, type: OscillatorType = 'sine', sweep = 1) {
    const c = this.ctx!; const t = c.currentTime
    const o = c.createOscillator(); o.type = type; o.frequency.setValueAtTime(freq, t)
    o.frequency.exponentialRampToValueAtTime(Math.max(30, freq * sweep), t + dur)
    const g = c.createGain(); g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(gain, t + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    o.connect(g); g.connect(this.master!); o.start(t); o.stop(t + dur + 0.02)
  }
  update(t: number, shot: string, cue: Cue | null) {
    if (!this.ctx || !this.master) return
    const sec = Math.floor(t)
    if (sec === this.lastTick) return
    this.lastTick = sec
    if (shot === 'basement') {
      if (sec % 2 === 0) this.noise(0.45, 0.06, 1500, true)
      if (sec % 5 === 0) this.tone(180 + Math.random() * 60, 0.3, 0.03, 'sawtooth', 0.7)
    } else if (shot === 'hall') {
      if (sec % 7 === 0) this.tone(320, 0.5, 0.02, 'triangle', 1.2)
      if (sec % 3 === 0) this.noise(0.12, 0.012, 600, true)
    } else if (shot === 'orbit' || shot === 'eva') {
      if (sec % 4 === 0) this.noise(1.3, 0.014, 340, false)
      if (sec % 2 === 0) this.noise(0.22, 0.008, 900, false)
      if (sec % 9 === 0) this.tone(660, 0.12, 0.02, 'square', 0.9)
    } else if (shot === 'vacuum') {
      if (sec === 200 || sec === 203 || sec === 206) {
        this.tone(58, 0.65, 0.19, 'sine', 0.42)
        this.noise(0.28, 0.028, 190, false)
      }
    } else if (shot === 'debris') {
      if (sec % 6 === 0) this.tone(240, 1.2, 0.016, 'sine', 0.6)
      if (sec % 3 === 0) this.noise(0.25, 0.012, 480, false)
    } else if (shot === 'void') {
      if (sec % 11 === 0) this.tone(110, 2.4, 0.02, 'sine', 1.02)
    }
    if (cue && cue.id !== this.lastCue) {
      this.lastCue = cue.id
      if (cue.kind === 'radio') this.noise(0.1, 0.02, 2600, false)
    }
  }
}

function App() {
  const ref = useRef<HTMLCanvasElement>(null)
  const [cueText, setCueText] = useState('')
  const [t, setT] = useState(0)
  const [paused, setPaused] = useState(false)
  const pausedRef = useRef(false)
  const [sceneName, setSceneName] = useState('')
  useEffect(() => { pausedRef.current = paused }, [paused])

  useEffect(() => {
    const renderer = new THREE.WebGLRenderer({ canvas: ref.current!, antialias: true })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7))
    renderer.setSize(innerWidth, innerHeight)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x05070c)
    scene.fog = new THREE.FogExp2(0x05070c, 0.008)
    const camera = new THREE.PerspectiveCamera(48, innerWidth / innerHeight, 0.1, 400)
    const P = buildScenes(scene)
    const audio = new AudioEngine()
    let started = false
    const onFirst = () => { if (!started) { started = true; audio.init() } }
    window.addEventListener('pointerdown', onFirst)
    window.addEventListener('keydown', onFirst)

    let last = performance.now(), elapsed = 0, raf = 0
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      const dt = Math.min((now - last) / 1000, 0.05); last = now
      if (pausedRef.current) { renderer.render(scene, camera); return }
      elapsed += dt
      const time = Math.min(elapsed, DURATION)

      let shot = SHOTS[SHOTS.length - 1]
      for (const s of SHOTS) if (time >= s.start && time < s.end) { shot = s; break }
      Object.keys(P.groups).forEach(k => { P.groups[k].visible = k === shot.scene })
      const local = (time - shot.start) / (shot.end - shot.start)
      const sway = Math.sin(time * 0.28) * 0.55
      camera.position.set(shot.cam[0] + sway, shot.cam[1] + Math.sin(time * 0.19) * 0.25, shot.cam[2] - local * 1.4)
      camera.lookAt(shot.look[0], shot.look[1], shot.look[2])
      camera.fov += (shot.fov - camera.fov) * 0.06
      camera.updateProjectionMatrix()

      P.titleBlock.rotation.y = time * 0.22
      P.spindle.rotation.x = time * 6
      P.rock.rotation.y = time * 0.8
      P.lathe.children.forEach((c, i) => { if (i > 1) c.rotation.z = Math.sin(time * 2 + i) * 0.05 })
      if (shot.scene === 'debris') {
        P.groups['debris'].children.forEach(c => { if (c.userData.spin) { c.rotation.x += c.userData.spin * dt; c.rotation.y += c.userData.spin * dt * 0.7; c.position.x += dt * 0.35 } })
      }
      if (shot.scene === 'vacuum') {
        const flash = time > 199.6 && time < 200.4
        P.gun.visible = true
        const gm = P.gun.material as THREE.MeshStandardMaterial
        gm.emissive.setHex(flash ? 0x6a4b1e : 0x000000)
      }

      const cue = VOICE_CUES.find(c => time >= c.start && time < c.end) || null
      audio.update(time, shot.scene, cue)
      setCueText(cue ? `【${cue.speaker}】${cue.text}` : '')
      setSceneName(shot.scene)
      setT(time)
      renderer.render(scene, camera)
    }
    raf = requestAnimationFrame(loop)
    const onResize = () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight) }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); window.removeEventListener('pointerdown', onFirst); window.removeEventListener('keydown', onFirst); renderer.dispose() }
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#05070c', color: '#e8e6df', fontFamily: 'system-ui, sans-serif', overflow: 'hidden' }}>
      <canvas ref={ref} style={{ display: 'block', width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', left: 30, top: 24, fontSize: 11, letterSpacing: '.26em', color: '#8a96a2' }}>
        程序化 3D 体素影像 · 全片 300 秒 · {sceneName}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 68, textAlign: 'center', padding: '0 8%', fontSize: 20, lineHeight: 1.8, color: '#f4f0e6', textShadow: '0 2px 12px #000, 0 0 24px #000', minHeight: 40 }}>
        {cueText}
      </div>
      <div style={{ position: 'absolute', left: 30, right: 30, bottom: 32, height: 2, background: 'rgba(255,255,255,.14)' }}>
        <div style={{ width: (t / DURATION * 100) + '%', height: '100%', background: '#c9a05c' }} />
      </div>
      <div style={{ position: 'absolute', right: 30, bottom: 40, fontFamily: 'monospace', fontSize: 11, color: '#9aa5af' }}>
        {String(Math.floor(t / 60)).padStart(2, '0')}:{String(Math.floor(t % 60)).padStart(2, '0')} / 05:00
      </div>
      <button onClick={() => setPaused(p => !p)} style={{ position: 'absolute', right: 30, top: 20, background: 'rgba(10,15,22,.7)', color: '#c9a05c', border: '1px solid rgba(201,160,92,.5)', borderRadius: 16, padding: '6px 14px', fontSize: 11, cursor: 'pointer' }}>
        {paused ? '继续' : '暂停'}
      </button>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
