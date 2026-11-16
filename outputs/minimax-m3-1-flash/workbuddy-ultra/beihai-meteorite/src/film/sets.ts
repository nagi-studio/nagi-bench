import * as THREE from 'three'

/** Everything in the film is built from blocks — the whole visual language is voxel. */
export interface BlockOpts {
  color?: number
  emissive?: number
  rough?: number
  metal?: number
}

const mats = new Map<string, THREE.MeshStandardMaterial>()
function mat(color: number, emissive = 0, rough = 0.85, metal = 0.05) {
  const key = `${color}_${emissive}_${rough}_${metal}`
  let m = mats.get(key)
  if (!m) {
    m = new THREE.MeshStandardMaterial({
      color, emissive: new THREE.Color(emissive), emissiveIntensity: emissive ? 1.4 : 0,
      roughness: rough, metalness: metal,
    })
    mats.set(key, m)
  }
  return m
}

export class Vox {
  group = new THREE.Group()
  box(x: number, y: number, z: number, w: number, h: number, d: number, o: BlockOpts = {}) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(o.color ?? 0x8a8a92, o.emissive ?? 0, o.rough ?? 0.85, o.metal ?? 0.05))
    m.position.set(x, y, z)
    m.castShadow = true
    m.receiveShadow = true
    this.group.add(m)
    return m
  }
  /** a humanoid built from blocks: head, torso, two arms, two legs */
  figure(x: number, y: number, z: number, s: number, suit: number, trim: number, visor = 0x1b2430) {
    const g = new THREE.Group()
    const add = (w: number, h: number, d: number, px: number, py: number, pz: number, c: number, e = 0) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w * s, h * s, d * s), mat(c, e, 0.72, 0.12))
      m.position.set(px * s, py * s, pz * s)
      m.castShadow = true
      g.add(m)
      return m
    }
    add(0.62, 0.78, 0.42, 0, 1.32, 0, suit)          // torso
    add(0.44, 0.42, 0.42, 0, 1.92, 0, trim)         // helmet
    add(0.34, 0.16, 0.06, 0, 1.92, 0.22, visor, 0x101820) // visor
    add(0.62, 0.16, 0.44, 0, 1.60, 0, trim)         // collar
    add(0.2, 0.72, 0.2, -0.42, 1.30, 0, suit)       // arms
    add(0.2, 0.72, 0.2, 0.42, 1.30, 0, suit)
    add(0.24, 0.92, 0.24, -0.16, 0.46, 0, trim)     // legs
    add(0.24, 0.92, 0.24, 0.16, 0.46, 0, trim)
    add(0.26, 0.12, 0.4, -0.16, 0.06, 0.06, 0x2b2f36)
    add(0.26, 0.12, 0.4, 0.16, 0.06, 0.06, 0x2b2f36)
    add(0.34, 0.5, 0.34, 0.5, 1.15, 0.22, 0x30343c) // chest pack
    g.position.set(x, y, z)
    this.group.add(g)
    return g
  }
}

/** Act 1 — the study: warm lamplight, shelves, a window onto the sea */
export function buildStudy(): THREE.Group {
  const v = new Vox()
  const g = v.group
  // room shell
  v.box(0, 3, -4, 14, 0.4, 12, { color: 0x2f2a24 })
  v.box(-7, 3, 0, 0.4, 6, 12, { color: 0x4a4038 })
  v.box(7, 3, 0, 0.4, 6, 12, { color: 0x4a4038 })
  v.box(0, 3, 6, 14, 6, 0.4, { color: 0x4a4038 })
  v.box(0, 6, 0, 14, 0.4, 12, { color: 0x3a332c })
  // bookshelf wall
  v.box(-6.4, 2.4, -1.5, 0.5, 4.2, 6.5, { color: 0x3b2e24 })
  for (let i = 0; i < 4; i++) {
    v.box(-6.1, 1.1 + i * 1.05, -1.5, 0.55, 0.12, 6.1, { color: 0x5a4634 })
    for (let k = 0; k < 16; k++) {
      const h = 0.5 + ((i * 7 + k * 3) % 5) * 0.08
      v.box(-6.05, 1.16 + i * 1.05 + h / 2, -4.4 + k * 0.38, 0.42, h, 0.26, {
        color: [0x8d3b34, 0x3f5a7a, 0x6a6a3c, 0x7a5a34][(i + k) % 4],
      })
    }
  }
  // desk
  v.box(0.6, 1.05, 1.2, 4.2, 0.18, 1.8, { color: 0x5a4632 })
  v.box(-1.3, 0.55, 1.2, 0.3, 1.05, 0.3, { color: 0x4a3826 })
  v.box(2.5, 0.55, 1.2, 0.3, 1.05, 0.3, { color: 0x4a3826 })
  v.box(1.4, 1.2, 1.1, 0.9, 0.12, 0.6, { color: 0xd8d2c4 })       // letter
  v.box(2.9, 1.18, 1.4, 0.22, 0.28, 0.22, { color: 0x2b2b30 })     // mug
  // lamp
  v.box(2.6, 1.9, 0.2, 0.12, 1.6, 0.12, { color: 0x2f2f34 })
  v.box(2.6, 2.72, 0.2, 0.7, 0.16, 0.5, { color: 0xe8c98c, emissive: 0xffc76b })
  const lamp = new THREE.PointLight(0xffc98a, 26, 16, 2)
  lamp.position.set(2.6, 2.4, 0.3)
  g.add(lamp)
  // window with the sea beyond
  v.box(0, 3.4, -5.7, 6.4, 4.2, 0.3, { color: 0x101820 })
  v.box(0, 3.4, -5.5, 6.0, 3.8, 0.2, { color: 0x2d5f80, emissive: 0x1b4a6b, rough: 0.35 })
  v.box(0, 2.1, -5.4, 6.0, 0.7, 0.15, { color: 0x1d3f57, emissive: 0x143349 })
  v.box(0, 3.4, -5.35, 0.16, 4.0, 0.2, { color: 0x4a4038 })
  const win = new THREE.PointLight(0x6fa8d8, 12, 22, 2)
  win.position.set(0, 3.4, -4.6)
  g.add(win)
  // two figures
  const father = v.figure(-1.6, 0, 1.6, 1.0, 0x3d4450, 0x2a3038)
  father.rotation.y = 0.5
  const son = v.figure(3.6, 0, 2.6, 1.0, 0x4a4438, 0x36312a)
  son.rotation.y = -2.1
  // framed photos on the wall
  for (let i = 0; i < 3; i++) {
    v.box(4.9, 3.2 + (i % 2) * 0.9, -2.6 + i * 1.4, 0.14, 0.9, 1.1, { color: 0x6a5a3c })
    v.box(4.85, 3.2 + (i % 2) * 0.9, -2.6 + i * 1.4, 0.06, 0.7, 0.9, { color: 0x9fb6c8, emissive: 0x274055 })
  }
  return g
}

/** Act 2 — the airlock corridor and suit bay */
export function buildAirlock(): THREE.Group {
  const v = new Vox()
  const g = v.group
  v.box(0, 3, 0, 7, 0.4, 26, { color: 0x2b3038 })
  v.box(-3.5, 3, 0, 0.4, 6, 26, { color: 0x555d68 })
  v.box(3.5, 3, 0, 0.4, 6, 26, { color: 0x555d68 })
  v.box(0, 6, 0, 7, 0.4, 26, { color: 0x3b424c })
  // ceiling strip lights
  for (let i = 0; i < 7; i++) {
    v.box(0, 5.7, -11 + i * 3.6, 2.2, 0.12, 0.7, { color: 0xdfeaf5, emissive: 0x9fc8e8 })
    const l = new THREE.PointLight(0xa8c8e8, 9, 12, 2)
    l.position.set(0, 5.2, -11 + i * 3.6)
    g.add(l)
  }
  // hazard stripes on the floor
  for (let i = 0; i < 10; i++) {
    v.box(-2.6 + i * 0.58, 0.22, 9.6, 0.32, 0.04, 1.6, { color: i % 2 ? 0xd8b23c : 0x2a2a2e })
  }
  // airlock door at the end
  v.box(0, 2.6, 12.6, 6.2, 5.2, 0.5, { color: 0x6b7480, metal: 0.6, rough: 0.35 })
  v.box(-1.5, 2.6, 12.3, 0.3, 4.6, 0.2, { color: 0x4a525c })
  v.box(1.5, 2.6, 12.3, 0.3, 4.6, 0.2, { color: 0x4a525c })
  v.box(0, 4.6, 12.2, 1.1, 0.5, 0.16, { color: 0xff6a4a, emissive: 0xff4a2a })
  // suit racks
  for (let i = 0; i < 3; i++) {
    v.box(-2.9, 1.6, -6 + i * 2.4, 0.9, 3.2, 1.1, { color: 0x8f97a3 })
    v.box(-2.9, 2.6, -6 + i * 2.4, 0.95, 0.9, 1.15, { color: 0xd7dde6 })
    v.box(-2.9, 3.2, -6 + i * 2.4, 0.5, 0.45, 0.5, { color: 0x1d2a38, emissive: 0x0d1a26 })
  }
  const hero = v.figure(1.2, 0, 2.4, 1.0, 0xd7dde6, 0x9aa3af, 0x14202c)
  hero.rotation.y = Math.PI
  // beacon
  const beacon = new THREE.PointLight(0xff5a3a, 0, 20, 2)
  beacon.position.set(0, 4.4, 12)
  g.add(beacon)
  return g
}

/** Act 3 — outside the hull: platforms, handrails, the far module, starfield */
export function buildEVA(): THREE.Group {
  const v = new Vox()
  const g = v.group
  // the station hull the hero stands on
  v.box(0, -0.6, 0, 16, 1.2, 16, { color: 0x6e7783, metal: 0.55, rough: 0.42 })
  v.box(0, 0.05, 0, 15.2, 0.1, 15.2, { color: 0x4d555f })
  // handrails
  for (let i = -3; i <= 3; i++) {
    v.box(i * 2.2, 0.9, -7.2, 0.16, 1.6, 0.16, { color: 0xc8cfd8, metal: 0.7, rough: 0.3 })
  }
  v.box(0, 1.7, -7.2, 14.4, 0.16, 0.16, { color: 0xc8cfd8, metal: 0.7, rough: 0.3 })
  // distant module with lit windows
  v.box(0, 2.2, -34, 26, 9, 12, { color: 0x4c5560, metal: 0.5, rough: 0.5 })
  v.box(0, 7.2, -34, 26.6, 1.4, 12.6, { color: 0x3f4750 })
  for (let i = 0; i < 9; i++) {
    v.box(-9 + i * 2.3, 2.4, -27.9, 1.1, 0.8, 0.2, { color: 0xffd9a0, emissive: 0xffb75e })
  }
  const far = new THREE.PointLight(0xffc98a, 18, 40, 2)
  far.position.set(0, 2.6, -26)
  g.add(far)
  // the target, standing on the far platform
  const target = v.figure(2.6, 0, -27.5, 1.05, 0xc9d1dc, 0x8f98a5, 0x121c26)
  target.rotation.y = 0.2
  // star field
  const stars = new THREE.Points(
    (() => {
      const p = new Float32Array(900 * 3)
      for (let i = 0; i < 900; i++) {
        p[i * 3] = (Math.random() - 0.5) * 700
        p[i * 3 + 1] = (Math.random() - 0.5) * 500
        p[i * 3 + 2] = -60 - Math.random() * 300
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.Float32BufferAttribute(p, 3))
      return geo
    })(),
    new THREE.PointsMaterial({ color: 0xdfe9f5, size: 0.7, sizeAttenuation: true }),
  )
  g.add(stars)
  // the sun: a hard, unfiltered disc
  const sun = new THREE.DirectionalLight(0xfff4e0, 2.6)
  sun.position.set(60, 40, 40)
  g.add(sun)
  const sunDisc = new THREE.Mesh(
    new THREE.SphereGeometry(6, 16, 12),
    new THREE.MeshBasicMaterial({ color: 0xfffdf2 }),
  )
  sunDisc.position.set(120, 80, 150)
  g.add(sunDisc)
  // distant planet limb
  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(90, 32, 24),
    new THREE.MeshStandardMaterial({ color: 0x2c4a6e, roughness: 1, metalness: 0 }),
  )
  planet.position.set(-150, -60, -260)
  g.add(planet)
  return g
}

/** Act 4 — back inside: a console, a screen, warm interior light */
export function buildCabin(): THREE.Group {
  const v = new Vox()
  const g = v.group
  v.box(0, 3, 0, 12, 0.4, 14, { color: 0x2b3038 })
  v.box(-6, 3, 0, 0.4, 6, 14, { color: 0x4b535e })
  v.box(6, 3, 0, 0.4, 6, 14, { color: 0x4b535e })
  v.box(0, 6, 0, 12, 0.4, 14, { color: 0x353c45 })
  v.box(0, 3, 7, 12, 6, 0.4, { color: 0x4b535e })
  // console + screen
  v.box(0, 1.1, -5.4, 5.4, 0.2, 1.6, { color: 0x3a4149 })
  v.box(0, 1.6, -5.6, 4.6, 1.6, 0.24, { color: 0x0d1418 })
  v.box(0, 1.6, -5.45, 4.2, 1.2, 0.06, { color: 0x1d4a5e, emissive: 0x1b6a86 })
  for (let i = 0; i < 5; i++) {
    v.box(-1.6 + i * 0.8, 1.15, -4.6, 0.4, 0.12, 0.3, { color: 0x7fd8ff, emissive: 0x2f9fd0 })
  }
  const glow = new THREE.PointLight(0x66c8ff, 12, 16, 2)
  glow.position.set(0, 2.0, -4.6)
  g.add(glow)
  const warm = new THREE.PointLight(0xffc98a, 14, 18, 2)
  warm.position.set(3.4, 3.4, 1.4)
  g.add(warm)
  v.box(3.4, 4.0, 1.4, 1.6, 0.2, 1.6, { color: 0xffe0b0, emissive: 0xffc070 })
  const hero = v.figure(0.6, 0, -3.2, 1.0, 0xd7dde6, 0x9aa3af, 0x14202c)
  hero.rotation.y = Math.PI
  return g
}
