import * as THREE from 'three'
import { buildAirlock, buildCabin, buildEVA, buildStudy } from './sets'
import { filmAudio } from './sound'
import { TOTAL_SECONDS, VOICE_CUES, VoiceCue } from './voiceCues'

interface Shot {
  start: number
  end: number
  set: 'study' | 'airlock' | 'eva' | 'cabin'
  from: [number, number, number]
  to: [number, number, number]
  look: [number, number, number]
  fov: number
  /** optional one-shot sound at the cut */
  sound?: () => void
  /** how far the camera drifts inside the shot */
  drift?: number
}

/** The edit. 200 s in four acts, well inside the 360 s hard cap. */
const SHOTS: Shot[] = [
  // Act I — the study (0 – 48 s)
  { start: 0, end: 9, set: 'study', from: [5.6, 2.6, 4.4], to: [4.4, 2.3, 3.8], look: [1.2, 1.5, 1.4], fov: 42 },
  { start: 9, end: 18, set: 'study', from: [4.2, 2.2, 3.6], to: [3.2, 2.0, 3.0], look: [-1.4, 1.6, 1.8], fov: 38 },
  { start: 18, end: 27, set: 'study', from: [-3.4, 2.4, 4.2], to: [-2.4, 2.2, 3.6], look: [0.4, 1.4, 1.2], fov: 44 },
  { start: 27, end: 38, set: 'study', from: [1.2, 3.9, 4.6], to: [0.4, 3.6, 3.0], look: [0.2, 3.0, -4.0], fov: 50 },
  { start: 38, end: 48, set: 'study', from: [-4.6, 1.9, 2.6], to: [-2.6, 1.8, 2.2], look: [3.4, 1.7, 2.4], fov: 40, sound: () => filmAudio.machining(1.4) },

  // Act II — the airlock (48 – 96 s)
  { start: 48, end: 58, set: 'airlock', from: [0, 2.2, 11.2], to: [0, 2.1, 8.0], look: [0, 1.7, 2.0], fov: 46, sound: () => filmAudio.servo(2.2) },
  { start: 58, end: 70, set: 'airlock', from: [1.8, 1.9, 3.4], to: [0.4, 1.8, 1.0], look: [-2.6, 2.4, -3.0], fov: 42, sound: () => filmAudio.breath(2.6) },
  { start: 70, end: 82, set: 'airlock', from: [-1.4, 1.5, -5.0], to: [0.6, 1.7, -1.0], look: [0.2, 2.2, 8.0], fov: 50, sound: () => filmAudio.alarm(1.6) },
  { start: 82, end: 96, set: 'airlock', from: [0, 2.4, 6.0], to: [0, 2.3, 11.0], look: [0, 2.2, 13.0], fov: 48, sound: () => filmAudio.depressurize(4.5) },

  // Act III — outside the hull (96 – 160 s)
  { start: 96, end: 110, set: 'eva', from: [-3.6, 2.6, 6.0], to: [-1.0, 2.4, 3.0], look: [0.4, 1.6, -2.0], fov: 52, sound: () => filmAudio.rumble(12) },
  { start: 110, end: 124, set: 'eva', from: [0.8, 1.9, -2.0], to: [0.6, 1.8, -6.0], look: [2.6, 1.7, -27.5], fov: 40 },
  { start: 124, end: 138, set: 'eva', from: [0.4, 1.7, -6.2], to: [0.5, 1.7, -6.6], look: [2.6, 1.6, -27.5], fov: 22, drift: 0.12 },
  { start: 138, end: 146, set: 'eva', from: [0.5, 1.7, -6.6], to: [0.5, 1.7, -6.8], look: [2.6, 1.6, -27.5], fov: 16, drift: 0.05, sound: () => filmAudio.shotInVacuum() },
  { start: 146, end: 160, set: 'eva', from: [0.5, 1.8, -6.4], to: [-1.4, 2.6, -1.0], look: [0.0, 2.0, -20.0], fov: 46 },

  // Act IV — back inside (160 – 200 s)
  { start: 160, end: 172, set: 'cabin', from: [2.6, 2.2, 3.0], to: [1.4, 2.0, 1.2], look: [0.4, 1.6, -4.6], fov: 44, sound: () => filmAudio.impact(0.3) },
  { start: 172, end: 184, set: 'cabin', from: [-1.2, 1.8, -2.4], to: [0.2, 1.7, -3.2], look: [0.0, 1.6, -5.4], fov: 38, sound: () => filmAudio.radio(1.0) },
  { start: 184, end: 200, set: 'cabin', from: [0.6, 1.7, -3.0], to: [3.2, 2.6, 1.6], look: [0.0, 2.2, -4.0], fov: 46, sound: () => filmAudio.chord(196) },
]

export interface FilmState {
  time: number
  total: number
  playing: boolean
  cue: VoiceCue | null
  act: string
}

const ACT_OF: Record<Shot['set'], string> = {
  study: '第一幕 · 书房',
  airlock: '第二幕 · 气闸',
  eva: '第三幕 · 舱外',
  cabin: '第四幕 · 尾声',
}

export class Director {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(45, 1, 0.1, 900)
  renderer: THREE.WebGLRenderer
  sets: Record<string, THREE.Group> = {}
  time = 0
  playing = false
  private clock = new THREE.Clock()
  private raf = 0
  private fired = new Set<number>()
  private onState: (s: FilmState) => void
  private lastState = 0

  constructor(canvas: HTMLCanvasElement, onState: (s: FilmState) => void) {
    this.onState = onState
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.28
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

    this.scene.background = new THREE.Color(0x05070b)
    this.sets.study = buildStudy()
    this.sets.airlock = buildAirlock()
    this.sets.eva = buildEVA()
    this.sets.cabin = buildCabin()
    Object.values(this.sets).forEach((s) => {
      s.visible = false
      this.scene.add(s)
    })
    this.resize()
    addEventListener('resize', () => this.resize())
  }

  resize() {
    const w = innerWidth, h = innerHeight
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h)
  }

  play() {
    if (this.playing) return
    filmAudio.init()
    filmAudio.resume()
    this.playing = true
    this.clock.start()
    const loop = () => {
      this.raf = requestAnimationFrame(loop)
      this.frame()
    }
    loop()
  }

  restart() {
    this.time = 0
    this.fired.clear()
    this.play()
  }

  dispose() {
    cancelAnimationFrame(this.raf)
    this.renderer.dispose()
  }

  private frame() {
    const dt = Math.min(0.05, this.clock.getDelta())
    if (this.playing) {
      this.time += dt
      if (this.time > TOTAL_SECONDS) this.time = TOTAL_SECONDS
    }
    const shot = this.shotAt(this.time)
    if (shot) {
      Object.entries(this.sets).forEach(([k, s]) => { s.visible = k === shot.set })
      const t = THREE.MathUtils.clamp((this.time - shot.start) / (shot.end - shot.start), 0, 1)
      const e = t * t * (3 - 2 * t)
      const d = shot.drift ?? 1
      this.camera.position.set(
        THREE.MathUtils.lerp(shot.from[0], shot.to[0], e) * (d < 1 ? 1 - d * 0.04 : 1),
        THREE.MathUtils.lerp(shot.from[1], shot.to[1], e),
        THREE.MathUtils.lerp(shot.from[2], shot.to[2], e),
      )
      this.camera.lookAt(shot.look[0], shot.look[1], shot.look[2])
      const targetFov = shot.fov
      this.camera.fov += (targetFov - this.camera.fov) * Math.min(1, dt * 2.4)
      this.camera.updateProjectionMatrix()
      if (shot.sound && !this.fired.has(shot.start)) {
        this.fired.add(shot.start)
        shot.sound()
      }
    }
    this.renderer.render(this.scene, this.camera)

    if (this.time - this.lastState > 0.05 || !this.playing) {
      this.lastState = this.time
      const cue = VOICE_CUES.find((c) => this.time >= c.start && this.time <= c.end) ?? null
      this.onState({
        time: this.time,
        total: TOTAL_SECONDS,
        playing: this.playing,
        cue,
        act: shot ? ACT_OF[shot.set] : '',
      })
    }
  }

  private shotAt(t: number): Shot | null {
    for (const s of SHOTS) if (t >= s.start && t < s.end) return s
    return SHOTS[SHOTS.length - 1]
  }

  /** total number of shots, used by the UI */
  static get shotCount() { return SHOTS.length }
}
