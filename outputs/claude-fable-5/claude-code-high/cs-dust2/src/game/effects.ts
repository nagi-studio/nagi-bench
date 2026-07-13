import * as THREE from 'three'

const MAX_TRACERS = 96
const MAX_SPARKS = 768
const MAX_BLOOD = 384

interface Particle { life: number; max: number; vx: number; vy: number; vz: number; gravity: number }

class ParticlePool {
  points: THREE.Points
  pos: Float32Array
  col: Float32Array
  parts: Particle[]
  baseCol: Float32Array
  private cursor = 0

  constructor(count: number, size: number, additive: boolean) {
    this.pos = new Float32Array(count * 3).fill(-999)
    this.col = new Float32Array(count * 3)
    this.baseCol = new Float32Array(count * 3)
    this.parts = Array.from({ length: count }, () => ({ life: 0, max: 1, vx: 0, vy: 0, vz: 0, gravity: 0 }))
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(this.col, 3))
    const matP = new THREE.PointsMaterial({
      size, vertexColors: true, transparent: true, depthWrite: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      sizeAttenuation: true,
    })
    this.points = new THREE.Points(geo, matP)
    this.points.frustumCulled = false
  }

  spawn(p: THREE.Vector3, vel: THREE.Vector3, life: number, color: THREE.Color, gravity: number) {
    const i = this.cursor
    this.cursor = (this.cursor + 1) % this.parts.length
    this.pos[i * 3] = p.x; this.pos[i * 3 + 1] = p.y; this.pos[i * 3 + 2] = p.z
    this.baseCol[i * 3] = color.r; this.baseCol[i * 3 + 1] = color.g; this.baseCol[i * 3 + 2] = color.b
    const part = this.parts[i]
    part.life = life; part.max = life
    part.vx = vel.x; part.vy = vel.y; part.vz = vel.z
    part.gravity = gravity
  }

  update(dt: number) {
    for (let i = 0; i < this.parts.length; i++) {
      const p = this.parts[i]
      if (p.life <= 0) continue
      p.life -= dt
      if (p.life <= 0) {
        this.pos[i * 3 + 1] = -999
        this.col[i * 3] = this.col[i * 3 + 1] = this.col[i * 3 + 2] = 0
        continue
      }
      p.vy -= p.gravity * dt
      this.pos[i * 3] += p.vx * dt
      this.pos[i * 3 + 1] += p.vy * dt
      this.pos[i * 3 + 2] += p.vz * dt
      const f = p.life / p.max
      this.col[i * 3] = this.baseCol[i * 3] * f
      this.col[i * 3 + 1] = this.baseCol[i * 3 + 1] * f
      this.col[i * 3 + 2] = this.baseCol[i * 3 + 2] * f
    }
    this.points.geometry.attributes.position.needsUpdate = true
    this.points.geometry.attributes.color.needsUpdate = true
  }
}

export class Effects {
  private scene: THREE.Scene
  private tracerGeo: THREE.BufferGeometry
  private tracerPos: Float32Array
  private tracerCol: Float32Array
  private tracers: { life: number; max: number }[]
  private tracerCursor = 0
  private sparks: ParticlePool
  private blood: ParticlePool
  private muzzleLight: THREE.PointLight
  private muzzleT = 0
  private explosionLight: THREE.PointLight
  private explosionT = 0
  private rings: { mesh: THREE.Mesh; life: number }[] = []
  shake = 0

  constructor(scene: THREE.Scene) {
    this.scene = scene
    this.tracerPos = new Float32Array(MAX_TRACERS * 6).fill(-999)
    this.tracerCol = new Float32Array(MAX_TRACERS * 6)
    this.tracers = Array.from({ length: MAX_TRACERS }, () => ({ life: 0, max: 1 }))
    this.tracerGeo = new THREE.BufferGeometry()
    this.tracerGeo.setAttribute('position', new THREE.BufferAttribute(this.tracerPos, 3))
    this.tracerGeo.setAttribute('color', new THREE.BufferAttribute(this.tracerCol, 3))
    const lines = new THREE.LineSegments(this.tracerGeo, new THREE.LineBasicMaterial({
      vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    }))
    lines.frustumCulled = false
    scene.add(lines)

    this.sparks = new ParticlePool(MAX_SPARKS, 0.09, true)
    this.blood = new ParticlePool(MAX_BLOOD, 0.11, false)
    scene.add(this.sparks.points, this.blood.points)

    this.muzzleLight = new THREE.PointLight(0xffc070, 0, 14)
    this.explosionLight = new THREE.PointLight(0xff8030, 0, 60)
    scene.add(this.muzzleLight, this.explosionLight)
  }

  tracer(a: THREE.Vector3, b: THREE.Vector3) {
    const i = this.tracerCursor
    this.tracerCursor = (this.tracerCursor + 1) % MAX_TRACERS
    this.tracerPos.set([a.x, a.y, a.z, b.x, b.y, b.z], i * 6)
    this.tracers[i].life = this.tracers[i].max = 0.07
  }

  muzzle(pos: THREE.Vector3) {
    this.muzzleLight.position.copy(pos)
    this.muzzleLight.intensity = 6
    this.muzzleT = 0.05
  }

  impact(pos: THREE.Vector3) {
    const c = new THREE.Color(0xffcc88)
    for (let i = 0; i < 7; i++) {
      const vel = new THREE.Vector3((Math.random() - 0.5) * 5, Math.random() * 4, (Math.random() - 0.5) * 5)
      this.sparks.spawn(pos, vel, 0.22 + Math.random() * 0.18, c, 12)
    }
  }

  bloodBurst(pos: THREE.Vector3) {
    const c = new THREE.Color(0x8a1515)
    for (let i = 0; i < 10; i++) {
      const vel = new THREE.Vector3((Math.random() - 0.5) * 3.4, Math.random() * 2.6 - 0.4, (Math.random() - 0.5) * 3.4)
      this.blood.spawn(pos, vel, 0.3 + Math.random() * 0.25, c, 9)
    }
  }

  explosion(pos: THREE.Vector3) {
    const fire = new THREE.Color(0xff9040)
    const smoke = new THREE.Color(0x553311)
    for (let i = 0; i < 130; i++) {
      const dir = new THREE.Vector3(Math.random() - 0.5, Math.random() * 0.8, Math.random() - 0.5).normalize()
      const sp = 4 + Math.random() * 16
      this.sparks.spawn(pos.clone().add(new THREE.Vector3(0, 0.5, 0)), dir.multiplyScalar(sp), 0.5 + Math.random() * 0.9, fire, 6)
    }
    for (let i = 0; i < 60; i++) {
      const dir = new THREE.Vector3(Math.random() - 0.5, Math.random(), Math.random() - 0.5).normalize()
      this.blood.spawn(pos.clone(), dir.multiplyScalar(2 + Math.random() * 6), 1 + Math.random(), smoke, -1.5)
    }
    this.explosionLight.position.copy(pos).add(new THREE.Vector3(0, 2, 0))
    this.explosionLight.intensity = 80
    this.explosionT = 0.9
    this.shake = Math.max(this.shake, 1)

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.5, 1.2, 32),
      new THREE.MeshBasicMaterial({ color: 0xffbb66, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false }),
    )
    ring.rotation.x = -Math.PI / 2
    ring.position.copy(pos).add(new THREE.Vector3(0, 0.3, 0))
    this.scene.add(ring)
    this.rings.push({ mesh: ring, life: 0.8 })
  }

  update(dt: number) {
    for (let i = 0; i < MAX_TRACERS; i++) {
      const t = this.tracers[i]
      if (t.life <= 0) continue
      t.life -= dt
      const f = Math.max(0, t.life / t.max)
      const r = 1 * f, g2 = 0.85 * f, b = 0.5 * f
      this.tracerCol.set([r, g2, b, r * 0.6, g2 * 0.6, b * 0.6], i * 6)
      if (t.life <= 0) this.tracerPos.set([-999, -999, -999, -999, -999, -999], i * 6)
    }
    this.tracerGeo.attributes.position.needsUpdate = true
    this.tracerGeo.attributes.color.needsUpdate = true

    this.sparks.update(dt)
    this.blood.update(dt)

    this.muzzleT -= dt
    if (this.muzzleT <= 0) this.muzzleLight.intensity = 0
    if (this.explosionT > 0) {
      this.explosionT -= dt
      this.explosionLight.intensity = Math.max(0, 80 * (this.explosionT / 0.9))
    }
    for (let i = this.rings.length - 1; i >= 0; i--) {
      const r = this.rings[i]
      r.life -= dt
      const s = 1 + (0.8 - r.life) * 30
      r.mesh.scale.set(s, s, 1)
      ;(r.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, r.life)
      if (r.life <= 0) {
        this.scene.remove(r.mesh)
        r.mesh.geometry.dispose()
        this.rings.splice(i, 1)
      }
    }
    this.shake *= Math.exp(-4 * dt)
  }
}
