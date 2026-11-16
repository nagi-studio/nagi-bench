import * as THREE from 'three'
import { ClockParts } from '../sim/clock'

/** The tower is built from blocks, like everything else in this benchmark. */
function mat(color: number, rough = 0.9, metal = 0.02, emissive = 0) {
  return new THREE.MeshStandardMaterial({
    color, roughness: rough, metalness: metal,
    emissive: new THREE.Color(emissive), emissiveIntensity: emissive ? 1.2 : 0,
  })
}

const M = {
  stone: mat(0x8b8375),
  stoneDark: mat(0x6d675c),
  wood: mat(0x8a6238, 0.8),
  woodDark: mat(0x5d4225, 0.85),
  brass: mat(0xc9a24a, 0.35, 0.75),
  bronze: mat(0xa87b3c, 0.42, 0.7),
  rope: mat(0xa8926a, 0.95),
  water: new THREE.MeshStandardMaterial({
    color: 0x3f8fd0, transparent: true, opacity: 0.72, roughness: 0.15, metalness: 0.1,
    emissive: new THREE.Color(0x0d3350), emissiveIntensity: 0.6,
  }),
  face: mat(0xe8e2d0, 0.7),
  dial: mat(0x1d1b18, 0.6),
  bell: mat(0xb08b3c, 0.3, 0.8),
  glow: mat(0xffe6b0, 0.4, 0, 0xffb75e),
}

function gearMesh(radius: number, teeth: number, thickness: number, material: THREE.Material) {
  const g = new THREE.Group()
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.86, radius * 0.86, thickness, 24), material)
  disc.rotation.x = Math.PI / 2
  g.add(disc)
  for (let i = 0; i < teeth; i++) {
    const a = (i / teeth) * Math.PI * 2
    const t = new THREE.Mesh(new THREE.BoxGeometry(radius * 0.2, thickness, radius * 0.22), material)
    t.position.set(Math.cos(a) * radius * 0.93, Math.sin(a) * radius * 0.93, 0)
    t.rotation.z = a
    g.add(t)
  }
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(radius * 0.9, radius * 0.14, thickness * 0.7), material)
    spoke.position.set(Math.cos(a) * radius * 0.4, Math.sin(a) * radius * 0.4, 0)
    spoke.rotation.z = a
    g.add(spoke)
  }
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.16, radius * 0.16, thickness * 1.6, 12), M.bronze)
  hub.rotation.x = Math.PI / 2
  g.add(hub)
  return g
}

export class ClockScene {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200)
  renderer: THREE.WebGLRenderer

  private reservoirWater!: THREE.Mesh
  private lowerWater!: THREE.Mesh
  private jet!: THREE.Mesh
  private wheel!: THREE.Group
  private gearA!: THREE.Group
  private escape!: THREE.Group
  private minute!: THREE.Group
  private hour!: THREE.Group
  private pendulum!: THREE.Group
  private bucket!: THREE.Group
  private bell!: THREE.Group
  private bellSwing!: THREE.Group
  private minuteHand!: THREE.Group
  private hourHand!: THREE.Group
  private bucketWater!: THREE.Mesh

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.1
    this.scene.background = new THREE.Color(0x11141a)
    this.scene.fog = new THREE.Fog(0x11141a, 26, 70)
    this.scene.add(new THREE.HemisphereLight(0xbcd2f0, 0x2a2620, 0.8))
    const key = new THREE.DirectionalLight(0xfff0d8, 1.7)
    key.position.set(8, 16, 14)
    this.scene.add(key)
    const rim = new THREE.DirectionalLight(0x7fa8dd, 0.5)
    rim.position.set(-10, 6, -8)
    this.scene.add(rim)
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.25))

    this.buildTower()
    this.resize()
    addEventListener('resize', () => this.resize())
  }

  resize() {
    const w = innerWidth, h = innerHeight
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h)
  }

  private buildTower() {
    const s = this.scene
    const box = (w: number, h: number, d: number, x: number, y: number, z: number, m: THREE.Material) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m)
      mesh.position.set(x, y, z)
      mesh.castShadow = true
      mesh.receiveShadow = true
      s.add(mesh)
      return mesh
    }
    // stone tower: back wall, side walls, floor slabs
    box(14, 18, 0.7, 0, 9, -3.4, M.stoneDark)
    box(0.7, 18, 8, -6.8, 9, 0.6, M.stone)
    box(0.7, 18, 8, 6.8, 9, 0.6, M.stone)
    box(14, 0.6, 8, 0, 0.2, 0.6, M.stoneDark)
    box(14, 0.6, 8, 0, 8.4, 0.6, M.stoneDark)
    box(14, 0.6, 8, 0, 17.8, 0.6, M.stoneDark)
    // corner pillars
    for (const px of [-6.4, 6.4]) for (const pz of [-3.0, 4.2]) box(0.6, 18, 0.6, px, 9, pz, M.stone)

    // upper reservoir (top reservoir) with a visible water level
    box(5.2, 3.0, 3.4, -3.4, 15.2, 0.2, M.wood)
    this.reservoirWater = new THREE.Mesh(new THREE.BoxGeometry(4.7, 1, 3.0), M.water)
    this.reservoirWater.position.set(-3.4, 16.2, 0.2)
    s.add(this.reservoirWater)
    // the pipe and the jet
    box(0.5, 1.6, 0.5, -3.4, 12.9, 0.2, M.bronze)
    this.jet = new THREE.Mesh(new THREE.BoxGeometry(0.26, 1, 0.26), M.water)
    this.jet.position.set(-3.4, 12.0, 0.2)
    s.add(this.jet)

    // water wheel with paddles
    this.wheel = new THREE.Group()
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.08, 8, 24), M.woodDark)
    this.wheel.add(rim)
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2
      const paddle = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.06, 0.5), M.wood)
      paddle.position.set(Math.cos(a) * 0.82, Math.sin(a) * 0.82, 0)
      paddle.rotation.z = a
      this.wheel.add(paddle)
    }
    for (const z of [-0.3, 0.3]) {
      const r2 = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.05, 6, 20), M.woodDark)
      r2.position.z = z
      this.wheel.add(r2)
    }
    this.wheel.position.set(-3.4, 6.4, 0.2)
    s.add(this.wheel)

    // gear train
    this.gearA = gearMesh(0.62, 20, 0.24, M.bronze)
    this.gearA.position.set(-3.4, 4.6, 0.2)
    s.add(this.gearA)
    this.escape = gearMesh(0.42, 15, 0.22, M.brass)
    this.escape.position.set(-1.55, 4.6, 0.2)
    s.add(this.escape)
    this.minute = gearMesh(0.8, 30, 0.22, M.bronze)
    this.minute.position.set(-1.55, 2.2, 0.2)
    s.add(this.minute)
    this.hour = gearMesh(0.68, 26, 0.22, M.bronze)
    this.hour.position.set(0.35, 2.2, 0.2)
    s.add(this.hour)

    // the dial with hands
    const face = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.14, 32), M.face)
    face.rotation.x = Math.PI / 2
    face.position.set(0.35, 2.2, 1.15)
    s.add(face)
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2
      const mark = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.26, 0.06), M.dial)
      mark.position.set(0.35 + Math.cos(a) * 1.22, 2.2 + Math.sin(a) * 1.22, 1.24)
      mark.rotation.z = a
      s.add(mark)
    }
    this.hourHand = new THREE.Group()
    const hh = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.9, 0.05), M.dial)
    hh.position.y = 0.42
    this.hourHand.add(hh)
    this.hourHand.position.set(0.35, 2.2, 1.28)
    s.add(this.hourHand)
    this.minuteHand = new THREE.Group()
    const mh = new THREE.Mesh(new THREE.BoxGeometry(0.07, 1.28, 0.05), M.dial)
    mh.position.y = 0.6
    this.minuteHand.add(mh)
    this.minuteHand.position.set(0.35, 2.2, 1.32)
    s.add(this.minuteHand)

    // pendulum
    this.pendulum = new THREE.Group()
    const rod = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.1, 0.08), M.brass)
    rod.position.y = -1.05
    this.pendulum.add(rod)
    const bob = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.12, 20), M.brass)
    bob.rotation.x = Math.PI / 2
    bob.position.y = -2.1
    this.pendulum.add(bob)
    const fork = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.08), M.brass)
    fork.position.set(-0.3, 0.02, 0)
    this.pendulum.add(fork)
    this.pendulum.position.set(0.9, 5.9, 0.2)
    s.add(this.pendulum)

    // reporting bucket + rope + bell
    this.bucket = new THREE.Group()
    const pail = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.6, 0.6), M.bronze)
    this.bucket.add(pail)
    this.bucketWater = new THREE.Mesh(new THREE.BoxGeometry(0.62, 1, 0.5), M.water)
    this.bucketWater.position.y = 0
    this.bucket.add(this.bucketWater)
    this.bucket.position.set(2.9, 5.6, 0.2)
    s.add(this.bucket)
    const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.6, 8), M.rope)
    rope.position.set(2.9, 6.6, 0.2)
    s.add(rope)
    this.bellSwing = new THREE.Group()
    const bell = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.5, 0.62, 16), M.bell)
    bell.position.y = -0.36
    this.bellSwing.add(bell)
    const yoke = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.1, 0.1), M.woodDark)
    this.bellSwing.add(yoke)
    this.bellSwing.position.set(2.9, 7.4, 0.2)
    s.add(this.bellSwing)
    this.bell = this.bellSwing

    // lower tank that collects the used water
    this.lowerWater = new THREE.Mesh(new THREE.BoxGeometry(4.6, 1, 3.0), M.water)
    this.lowerWater.position.set(-3.4, 1.2, 0.2)
    s.add(this.lowerWater)
    // warm interior lamps
    const lamp = new THREE.PointLight(0xffc98a, 22, 24, 2)
    lamp.position.set(0, 12, 3)
    s.add(lamp)
    const lamp2 = new THREE.PointLight(0xffd8a0, 14, 18, 2)
    lamp2.position.set(0.6, 3.4, 3)
    s.add(lamp2)
  }

  /** push the physics state into the scene graph */
  update(p: ClockParts, t: number) {
    this.wheel.rotation.z = -p.wheelAngle
    this.gearA.rotation.z = -p.wheelAngle
    this.escape.rotation.z = -p.escapeAngle
    this.minute.rotation.z = -p.minuteAngle
    this.hour.rotation.z = -p.hourAngle
    this.pendulum.rotation.z = -p.pendulumAngle
    this.hourHand.rotation.z = -p.hourAngle
    this.minuteHand.rotation.z = -p.minuteAngle
    this.bucket.rotation.z = p.bucketReleased ? 0 : p.bucketAngle
    this.bellSwing.rotation.z = p.bellAngle * 0.6
    // water levels
    const resH = Math.max(0.02, p.reservoir)
    this.reservoirWater.scale.y = resH
    this.reservoirWater.position.y = 13.8 + (resH * 2.6) / 2
    const jetH = resH > 0.02 ? 1 : 0.02
    this.jet.scale.y = jetH * 1.5
    this.jet.position.y = 12.6 - jetH * 0.75
    this.lowerWater.scale.y = Math.max(0.02, p.lowerTank)
    this.lowerWater.position.y = 0.9 + (p.lowerTank * 2.0) / 2
    this.bucketWater.scale.y = Math.max(0.02, p.bucketFill)
    this.bucketWater.position.y = -0.25 + (p.bucketFill * 0.45) / 2

    // camera: a scripted move, the only non-physical motion in the piece
    const u = Math.min(1, t / 30)
    if (u < 0.32) {
      const k = u / 0.32
      this.camera.position.set(-7.2 + k * 1.6, 12.4 - k * 1.4, 15.0 - k * 2.2)
      this.camera.lookAt(-3.0, 12.2 - k * 1.2, 0)
    } else if (u < 0.64) {
      const k = (u - 0.32) / 0.32
      this.camera.position.set(-5.6 + k * 3.2, 11.0 - k * 3.4, 12.8 - k * 3.0)
      this.camera.lookAt(-2.4 + k * 2.0, 11.0 - k * 4.4, 0)
    } else {
      const k = (u - 0.64) / 0.36
      this.camera.position.set(-2.4 + k * 2.6, 7.6 - k * 5.2, 9.8 - k * 6.6)
      this.camera.lookAt(-0.4 + k * 0.8, 6.6 - k * 4.2, 0.3)
    }
  }
}
