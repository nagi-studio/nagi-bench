import * as THREE from 'three'

export interface Cue {
  id: string
  kind: 'narration' | 'dialogue' | 'monologue'
  speaker: string
  text: string
  delivery: string
  start: number
  end: number
}

// Structured subtitle / voice cue list (the 7 required fields, Chinese).
const CUES: Cue[] = [
  { id: 'c1', kind: 'narration', speaker: '旁白', text: '二十一世纪中叶。太空军政委章北海，陪同三位老航天将领进山狩猎——一场看似寻常的踏青。', delivery: '沉稳、交代背景', start: 1, end: 11 },
  { id: 'c2', kind: 'dialogue', speaker: '司令员', text: '北海，你父亲若还在，也该是这山里的常客了。', delivery: '温和、长辈口吻', start: 12, end: 19 },
  { id: 'c3', kind: 'dialogue', speaker: '章北海', text: '首长过奖。父亲常说，国家的重器，要交到看得远的人手里。', delivery: '恭敬、克制', start: 20, end: 28 },
  { id: 'c4', kind: 'dialogue', speaker: '总长', text: '看得远？如今有些人，只想逃得远。逃亡主义，要不得啊。', delivery: '略带讥讽', start: 29, end: 37 },
  { id: 'c5', kind: 'monologue', speaker: '章北海', text: '他们不懂。真正的重器，是敢在黑暗森林里，替人类按下那一下的人。', delivery: '内心独白、低沉', start: 38, end: 48 },
  { id: 'c6', kind: 'monologue', speaker: '章北海', text: '我不会让历史，停在你们这一代手里。', delivery: '决绝', start: 49, end: 53 },
  { id: 'c7', kind: 'narration', speaker: '旁白', text: '三声枪响。子弹，来自一块坠入大气的陨石——无迹可寻。', delivery: '平静、冷峻', start: 55, end: 64 },
  { id: 'c8', kind: 'monologue', speaker: '章北海', text: '对不起，首长。但星舰必须启航，哪怕踩着你们的尸骨。', delivery: '痛苦而坚定', start: 65, end: 75 },
  { id: 'c9', kind: 'narration', speaker: '旁白', text: '雪落无声。一场狩猎意外，被工整地写进档案。', delivery: '留白', start: 76, end: 86 },
  { id: 'c10', kind: 'monologue', speaker: '章北海', text: '父亲，这条路，孩儿走通了。', delivery: '释然', start: 87, end: 95 },
  { id: 'c11', kind: 'narration', speaker: '旁白', text: '多年以后，人类才明白：那颗陨石子弹，改写了文明的航向。', delivery: '宏大收束', start: 96, end: 112 },
]

const SHOT_AT = 54

interface Shot { start: number; end: number; from: THREE.Vector3; to: THREE.Vector3; look: THREE.Vector3 }

export class Cinematic {
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 500)
  private renderer: THREE.WebGLRenderer
  private clock = new THREE.Clock()
  private raf = 0
  private running = false
  private t = 0
  private shotPlayed = false
  private beihai!: THREE.Group
  private beihaiArm!: THREE.Group
  private commanders: THREE.Group[] = []
  private ctx: AudioContext | null = null
  private windGain: GainNode | null = null
  private onSub: (s: { speaker: string; text: string } | null) => void
  private currentCue = ''

  private shots: Shot[] = [
    { start: 0, end: 12, from: new THREE.Vector3(0, 5, 16), to: new THREE.Vector3(0, 4, 12), look: new THREE.Vector3(-1, 1.4, -2) },
    { start: 12, end: 26, from: new THREE.Vector3(6, 2.6, 6), to: new THREE.Vector3(4, 2.5, 4), look: new THREE.Vector3(0, 1.4, -2.5) },
    { start: 26, end: 40, from: new THREE.Vector3(2, 2.5, 8), to: new THREE.Vector3(1, 2.3, 5), look: new THREE.Vector3(0, 1.4, 1) },
    { start: 40, end: 52, from: new THREE.Vector3(3, 2.2, 5), to: new THREE.Vector3(1.5, 2.0, 3.5), look: new THREE.Vector3(0, 1.4, 0.5) },
    { start: 52, end: 56, from: new THREE.Vector3(12, 3, 1), to: new THREE.Vector3(11, 3, 1), look: new THREE.Vector3(0, 1.2, -3) },
    { start: 56, end: 72, from: new THREE.Vector3(8, 2.6, 3), to: new THREE.Vector3(5, 2.3, 2), look: new THREE.Vector3(0, 1.0, -3) },
    { start: 72, end: 86, from: new THREE.Vector3(3, 2.2, 6), to: new THREE.Vector3(2, 2.0, 4.5), look: new THREE.Vector3(0, 1.4, 0.5) },
    { start: 86, end: 98, from: new THREE.Vector3(0, 3, 12), to: new THREE.Vector3(0, 2.5, 10), look: new THREE.Vector3(0, 0.5, -1) },
    { start: 98, end: 114, from: new THREE.Vector3(0, 8, 20), to: new THREE.Vector3(0, 11, 24), look: new THREE.Vector3(0, 0, 0) },
  ]

  constructor(container: HTMLElement, onSub: (s: { speaker: string; text: string } | null) => void) {
    this.onSub = onSub
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    this.renderer.setSize(container.clientWidth, container.clientHeight)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(this.renderer.domElement)

    this.scene.background = new THREE.Color(0xb9c4cc)
    this.scene.fog = new THREE.Fog(0xb9c4cc, 30, 170)

    this.scene.add(new THREE.HemisphereLight(0xcfe0ee, 0x43494f, 0.95))
    const sun = new THREE.DirectionalLight(0xeef3f7, 1.2)
    sun.position.set(20, 40, 10); sun.castShadow = true
    sun.shadow.mapSize.set(2048, 2048); sun.shadow.camera.far = 200
    sun.shadow.camera.left = -40; sun.shadow.camera.right = 40
    sun.shadow.camera.top = 40; sun.shadow.camera.bottom = -40
    this.scene.add(sun)

    this.buildWorld()
    this.buildPeople()
    this.resize()
    addEventListener('resize', this.resize)
    this.renderFrame()
  }

  private buildWorld() {
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(400, 400),
      new THREE.MeshStandardMaterial({ color: 0xeef2f6, roughness: 1 }),
    )
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    this.scene.add(ground)

    // scattered blocky pine trees (avoid the central clearing)
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6b4a2f })
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x2f5d3a })
    for (let i = 0; i < 60; i++) {
      const x = (Math.random() - 0.5) * 120
      const z = (Math.random() - 0.5) * 120
      if (Math.hypot(x, z) < 12) continue
      const tree = new THREE.Group()
      const h = 3 + Math.random() * 3
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, h, 6), trunkMat)
      trunk.position.y = h / 2; trunk.castShadow = true
      const foli = new THREE.Mesh(new THREE.ConeGeometry(2.2, 5, 6), leafMat)
      foli.position.y = h + 2; foli.castShadow = true
      tree.add(trunk, foli)
      tree.position.set(x, 0, z)
      this.scene.add(tree)
    }

    // the "meteorite" pebble on the snow (the untraceable bullet)
    const rock = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.35),
      new THREE.MeshStandardMaterial({ color: 0x3a3f45, roughness: 0.9, metalness: 0.3 }),
    )
    rock.position.set(0, 0.2, -3); rock.castShadow = true
    this.scene.add(rock)
  }

  private makePerson(color: number, skin = 0xe0b48c): { group: THREE.Group; arm: THREE.Group } {
    const g = new THREE.Group()
    const mat = new THREE.MeshStandardMaterial({ color })
    const sk = new THREE.MeshStandardMaterial({ color: skin })
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), sk); head.position.y = 1.7
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.9, 0.45), mat); torso.position.y = 1.1
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.9, 0.25), mat); legL.position.set(-0.18, 0.45, 0)
    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.9, 0.25), mat); legR.position.set(0.18, 0.45, 0)
    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.75, 0.2), mat); armL.position.set(-0.46, 1.1, 0)
    const arm = new THREE.Group()
    const armR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.75, 0.2), mat); armR.position.set(0, -0.3, 0)
    arm.add(armR); arm.position.set(0.46, 1.45, 0)
    // rifle in right hand
    const rifle = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 1.4), new THREE.MeshStandardMaterial({ color: 0x222629 }))
    rifle.position.set(0, -0.6, 0.4)
    arm.add(rifle)
    for (const m of [head, torso, legL, legR, armL]) { m.castShadow = true; g.add(m) }
    arm.castShadow = true; g.add(arm)
    return { group: g, arm }
  }

  private buildPeople() {
    const cmdrColors = [0x44566b, 0x4a5060, 0x3f5468]
    const coords = [[-3, -2], [0, -2], [3, -2]]
    coords.forEach((c, i) => {
      const p = this.makePerson(cmdrColors[i])
      p.group.position.set(c[0], 0, c[1])
      p.group.rotation.y = Math.PI
      this.commanders.push(p.group)
      this.scene.add(p.group)
    })
    const b = this.makePerson(0x39503a)
    b.group.position.set(0, 0, 4)
    b.group.rotation.y = Math.PI
    this.beihai = b.group
    this.beihaiArm = b.arm
    this.scene.add(this.beihai)
  }

  start() {
    this.initAudio()
    if (!this.running) { this.running = true; this.loop() }
  }

  private initAudio() {
    if (this.ctx) { void this.ctx.resume(); return }
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    this.ctx = new Ctor()
    // looping wind (filtered noise)
    const len = this.ctx.sampleRate * 2
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * 0.5
    const src = this.ctx.createBufferSource(); src.buffer = buf; src.loop = true
    const f = this.ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 480
    this.windGain = this.ctx.createGain(); this.windGain.gain.value = 0.12
    src.connect(f); f.connect(this.windGain); this.windGain.connect(this.ctx.destination)
    src.start()
  }

  private gunshot() {
    if (!this.ctx) return
    const t0 = this.ctx.currentTime
    const len = this.ctx.sampleRate
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
    for (let k = 0; k < 3; k++) {
      const s = this.ctx.createBufferSource(); s.buffer = buf
      const bp = this.ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 0.8
      const g = this.ctx.createGain()
      const tt = t0 + k * 0.18
      g.gain.setValueAtTime(0, tt); g.gain.linearRampToValueAtTime(0.9, tt + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, tt + 0.4)
      s.connect(bp); bp.connect(g); g.connect(this.ctx.destination); s.start(tt); s.stop(tt + 0.45)
    }
  }

  private resize = () => {
    this.camera.aspect = innerWidth / innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(innerWidth, innerHeight)
  }

  private renderFrame() {
    this.renderer.render(this.scene, this.camera)
  }

  private loop = () => {
    this.raf = requestAnimationFrame(this.loop)
    const dt = Math.min(this.clock.getDelta(), 0.05)
    this.t += dt
    if (this.t > 114) this.reset()

    // slow-motion around the gunshot
    const slow = this.t > 52 && this.t < 58 ? 0.35 : 1
    const at = this.t * slow

    // camera shot
    const shot = this.shots.find(s => at >= s.start && at < s.end) || this.shots[this.shots.length - 1]
    const p = (at - shot.start) / (shot.end - shot.start)
    this.camera.position.lerpVectors(shot.from, shot.to, Math.min(1, Math.max(0, p)))
    this.camera.lookAt(shot.look)

    // beihai walks toward commanders before the shot, raises rifle
    if (this.t < 52) {
      const targetZ = 2 + (1 - Math.min(1, this.t / 40)) * 2
      this.beihai.position.z += (targetZ - this.beihai.position.z) * 0.02
      this.beihai.position.y = Math.abs(Math.sin(this.t * 3)) * 0.05
      const raise = Math.min(1, Math.max(0, (this.t - 44) / 8))
      this.beihaiArm.rotation.x = -raise * 1.4
    } else {
      const lower = Math.min(1, Math.max(0, (this.t - 56) / 8))
      this.beihaiArm.rotation.x = -1.4 * (1 - lower) + 0.2 * lower
    }

    // commanders fall after the shot
    const fall = Math.min(1, Math.max(0, (this.t - SHOT_AT) / 3))
    for (const c of this.commanders) c.rotation.x = fall * (Math.PI / 2)

    // gunshot audio once
    if (!this.shotPlayed && this.t >= SHOT_AT) { this.shotPlayed = true; this.gunshot() }

    // subtitle
    const cue = CUES.find(c => this.t >= c.start && this.t < c.end)
    const id = cue?.id ?? ''
    if (id !== this.currentCue) {
      this.currentCue = id
      this.onSub(cue ? { speaker: cue.speaker, text: cue.text } : null)
    }

    this.renderFrame()
  }

  private reset() {
    this.t = 0; this.shotPlayed = false; this.currentCue = ''
    this.beihai.position.set(0, 0, 4); this.beihaiArm.rotation.x = 0
    for (const c of this.commanders) c.rotation.x = 0
  }

  dispose() {
    cancelAnimationFrame(this.raf)
    removeEventListener('resize', this.resize)
    this.renderer.dispose()
  }
}
