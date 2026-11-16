import * as THREE from 'three'
import { CRATES, CELL, GRID, HALF, WALL_H, AREAS, DustMap } from './map'
import { WeaponId } from './weapons'

export type Team = 'CT' | 'T'

export const TEAM_COLORS: Record<Team, { primary: number; secondary: number; accent: number; skin: number }> = {
  CT: { primary: 0x2f4f7a, secondary: 0x1d3350, accent: 0x7fa8dd, skin: 0xc79b72 },
  T:   { primary: 0x8a6a35, secondary: 0x5c4722, accent: 0xd3ad63, skin: 0xc08d63 },
}

/** six distinguishable outfits per side (used by both the player and the bots) */
export const OUTFIT_VARIANTS = [
  { cloth: 0x000000, trim: 0x000000 },
  { cloth: 0x121212, trim: 0x303030 },
  { cloth: 0x1c1c22, trim: 0x44444c },
  { cloth: 0x24242a, trim: 0x565660 },
  { cloth: 0x2c2c22, trim: 0x66664a },
  { cloth: 0x101820, trim: 0x2a3a4a },
]

export interface CharacterRig {
  root: THREE.Group
  head: THREE.Mesh
  torso: THREE.Mesh
  armL: THREE.Group
  armR: THREE.Group
  legL: THREE.Group
  legR: THREE.Group
  weapon: THREE.Group
  muzzle: THREE.Object3D
}

const MAT_CACHE = new Map<string, THREE.MeshStandardMaterial>()
function mat(color: number, rough = 0.75, metal = 0.05): THREE.MeshStandardMaterial {
  const key = `${color}_${rough}_${metal}`
  let m = MAT_CACHE.get(key)
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal })
    MAT_CACHE.set(key, m)
  }
  return m
}

export function buildCharacter(team: Team, variant: number, weaponId: WeaponId): CharacterRig {
  const tc = TEAM_COLORS[team]
  const ov = OUTFIT_VARIANTS[variant % OUTFIT_VARIANTS.length]
  const root = new THREE.Group()

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.72, 0.34), mat(tc.primary))
  torso.position.y = 1.26
  root.add(torso)
  // vest plate
  const vest = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.5, 0.38), mat(tc.secondary))
  vest.position.y = 1.3
  root.add(vest)
  // shoulder pads in the variant colour
  ;[-1, 1].forEach((s) => {
    const pad = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.18, 0.36), mat(ov.trim))
    pad.position.set(s * 0.37, 1.54, 0)
    root.add(pad)
  })

  const head = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.34, 0.32), mat(tc.skin))
  head.position.y = 1.78
  root.add(head)
  const helmet = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.2, 0.38), mat(ov.cloth))
  helmet.position.y = 1.9
  root.add(helmet)
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.07, 0.04), mat(0x14181e, 0.3, 0.4))
  visor.position.set(0, 1.79, 0.17)
  root.add(visor)

  const mkArm = (side: number) => {
    const g = new THREE.Group()
    g.position.set(side * 0.4, 1.52, 0)
    const upper = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.42, 0.17), mat(tc.primary))
    upper.position.y = -0.21
    g.add(upper)
    const fore = new THREE.Group()
    fore.position.y = -0.42
    const fm = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.4, 0.16), mat(ov.cloth))
    fm.position.y = -0.2
    fore.add(fm)
    const glove = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.14, 0.19), mat(0x1b1b20, 0.9))
    glove.position.y = -0.44
    fore.add(glove)
    g.add(fore)
    return { g, fore }
  }
  const armL = mkArm(-1)
  const armR = mkArm(1)
  root.add(armL.g)
  root.add(armR.g)

  const mkLeg = (side: number) => {
    const g = new THREE.Group()
    g.position.set(side * 0.17, 0.9, 0)
    const thigh = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.48, 0.26), mat(tc.secondary))
    thigh.position.y = -0.24
    g.add(thigh)
    const shin = new THREE.Group()
    shin.position.y = -0.48
    const sm = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.46, 0.24), mat(ov.cloth))
    sm.position.y = -0.23
    shin.add(sm)
    const boot = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.14, 0.34), mat(0x16161a, 0.9))
    boot.position.set(0, -0.5, 0.05)
    shin.add(boot)
    g.add(shin)
    return { g, shin }
  }
  const legL = mkLeg(-1)
  const legR = mkLeg(1)
  root.add(legL.g)
  root.add(legR.g)

  // weapon is parented to the right forearm so it follows the aim
  const weapon = buildWeaponProp(weaponId)
  armR.fore.add(weapon)
  weapon.position.set(0, -0.42, 0.16)
  weapon.rotation.set(Math.PI / 2, 0, 0)

  const muzzle = new THREE.Object3D()
  muzzle.position.set(0, -0.42, 0.9)
  weapon.add(muzzle)

  // arm pose: both hands on the weapon
  armL.g.rotation.set(-0.95, 0, 0.32)
  armL.fore.rotation.set(-0.55, 0, 0)
  armR.g.rotation.set(-1.05, 0, -0.18)
  armR.fore.rotation.set(-0.35, 0, 0)

  return { root, head, torso, armL: armL.g, armR: armR.g, legL: legL.g, legR: legR.g, weapon, muzzle }
}

export function buildWeaponProp(id: WeaponId): THREE.Group {
  const g = new THREE.Group()
  const body = mat(0x24242a, 0.45, 0.65)
  const wood = mat(0x6b4a2a, 0.8, 0.05)
  const steel = mat(0x9aa0a8, 0.3, 0.85)
  switch (id) {
    case 'ak47':
    case 'm4a4': {
      const receiver = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.12, 0.52), body)
      receiver.position.z = 0.1
      g.add(receiver)
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.5, 8), steel)
      barrel.rotation.x = Math.PI / 2
      barrel.position.z = 0.55
      g.add(barrel)
      const mag = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.24, 0.12), id === 'ak47' ? wood : body)
      mag.position.set(0, -0.16, 0.14)
      mag.rotation.x = id === 'ak47' ? 0.32 : 0.12
      g.add(mag)
      const stock = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.16, 0.26), id === 'ak47' ? wood : body)
      stock.position.z = -0.22
      g.add(stock)
      const grip = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.18, 0.09), body)
      grip.position.set(0, -0.12, -0.04)
      grip.rotation.x = -0.3
      g.add(grip)
      break
    }
    case 'awp': {
      const rec = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.13, 0.66), body)
      rec.position.z = 0.08
      g.add(rec)
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.03, 0.72, 10), steel)
      barrel.rotation.x = Math.PI / 2
      barrel.position.z = 0.72
      g.add(barrel)
      const scope = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.26, 10), mat(0x111114, 0.35, 0.5))
      scope.rotation.x = Math.PI / 2
      scope.position.set(0, 0.11, 0.1)
      g.add(scope)
      const stock = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.2, 0.36), mat(0x1d3b2a, 0.8))
      stock.position.z = -0.3
      g.add(stock)
      break
    }
    case 'glock':
    case 'usp':
    case 'deagle': {
      const slide = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.1, id === 'deagle' ? 0.3 : 0.22), body)
      slide.position.z = 0.06
      g.add(slide)
      const grip = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.19, 0.1), mat(0x17171b, 0.8))
      grip.position.set(0, -0.13, -0.02)
      grip.rotation.x = -0.25
      g.add(grip)
      break
    }
    default: {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.05, 0.34), steel)
      blade.position.z = 0.2
      g.add(blade)
      const hilt = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.07, 0.14), mat(0x1a1a1e, 0.8))
      hilt.position.z = 0.0
      g.add(hilt)
    }
  }
  return g
}

/** first-person view model */
export function buildViewModel(id: WeaponId): THREE.Group {
  const g = buildWeaponProp(id)
  g.scale.setScalar(1.15)
  g.position.set(0.18, -0.16, -0.45)
  g.rotation.set(0, 0.06, 0)
  return g
}

export interface WorldHandles {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  wallMesh: THREE.InstancedMesh
  floorMesh: THREE.Mesh
  crateMeshes: THREE.Mesh[]
  areaMarkers: THREE.Mesh[]
}

export function buildWorldScene(map: DustMap, canvas: HTMLCanvasElement): WorldHandles {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0d1117)
  scene.fog = new THREE.Fog(0x0d1117, 70, 190)

  const camera = new THREE.PerspectiveCamera(76, 1, 0.05, 400)
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  scene.add(new THREE.HemisphereLight(0xa8c8ff, 0x3a3026, 0.95))
  const sun = new THREE.DirectionalLight(0xfff0d8, 1.9)
  sun.position.set(40, 70, 30)
  sun.castShadow = true
  sun.shadow.mapSize.set(1024, 1024)
  sun.shadow.camera.left = -70
  sun.shadow.camera.right = 70
  sun.shadow.camera.top = 70
  sun.shadow.camera.bottom = -70
  sun.shadow.camera.far = 200
  scene.add(sun)
  const fill = new THREE.DirectionalLight(0x7fa8dd, 0.55)
  fill.position.set(-40, 30, -30)
  scene.add(fill)
  scene.add(new THREE.AmbientLight(0xffffff, 0.28))

  // floor: one quad per walkable cell, merged into a single geometry
  const floorPos: number[] = []
  const floorCol: number[] = []
  const tmp = new THREE.Color()
  for (let cz = 0; cz < GRID; cz++) {
    for (let cx = 0; cx < GRID; cx++) {
      if (!map.cellWalkable(cx, cz)) continue
      const x = cx * CELL - HALF
      const z = cz * CELL - HALF
      const area = map.areaOf[cz * GRID + cx]
      const base = area >= 0 ? 0x6b5c48 : 0x554b3c
      tmp.setHex(base)
      const shade = 0.86 + ((cx * 7 + cz * 13) % 5) * 0.03
      floorPos.push(x, 0, z, x + CELL, 0, z, x + CELL, 0, z + CELL, x, 0, z, x + CELL, 0, z + CELL, x, 0, z + CELL)
      for (let k = 0; k < 6; k++) floorCol.push(tmp.r * shade, tmp.g * shade, tmp.b * shade)
    }
  }
  const fg = new THREE.BufferGeometry()
  fg.setAttribute('position', new THREE.Float32BufferAttribute(floorPos, 3))
  fg.setAttribute('color', new THREE.Float32BufferAttribute(floorCol, 3))
  fg.computeVertexNormals()
  const floorMesh = new THREE.Mesh(fg, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95 }))
  floorMesh.receiveShadow = true
  scene.add(floorMesh)

  // walls: only cells that touch a walkable cell are drawn
  const wallCells: [number, number][] = []
  for (let cz = 0; cz < GRID; cz++) {
    for (let cx = 0; cx < GRID; cx++) {
      if (map.cellWalkable(cx, cz)) continue
      let touches = false
      for (let dz = -1; dz <= 1 && !touches; dz++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (map.cellWalkable(cx + dx, cz + dz)) { touches = true; break }
        }
      }
      if (touches) wallCells.push([cx, cz])
    }
  }
  const wallGeo = new THREE.BoxGeometry(CELL, WALL_H, CELL)
  const wallMesh = new THREE.InstancedMesh(wallGeo, mat(0x6a6458, 0.95, 0.02), wallCells.length)
  const m4 = new THREE.Matrix4()
  wallCells.forEach(([cx, cz], i) => {
    m4.makeTranslation(cx * CELL - HALF + CELL / 2, WALL_H / 2, cz * CELL - HALF + CELL / 2)
    wallMesh.setMatrixAt(i, m4)
  })
  wallMesh.instanceMatrix.needsUpdate = true
  wallMesh.castShadow = true
  wallMesh.receiveShadow = true
  scene.add(wallMesh)

  const crateMeshes: THREE.Mesh[] = []
  for (const c of CRATES) {
    const g = new THREE.BoxGeometry(c.w, c.h, c.d)
    const m = new THREE.Mesh(g, c.kind === 'wood' ? mat(0x7a5a35, 0.9) : mat(0x6f6a60, 0.95))
    m.position.set(c.x, c.h / 2, c.z)
    m.castShadow = true
    m.receiveShadow = true
    scene.add(m)
    crateMeshes.push(m)
  }

  // area markers: faint floor decals so each named region is legible
  const areaMarkers: THREE.Mesh[] = []
  const palette = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0xa06cd5, 0x6bcB77, 0xff9f43, 0x54a0ff, 0xff7bac]
  AREAS.forEach((a, i) => {
    const w = (a.x2 - a.x1 + 1) * CELL
    const d = (a.z2 - a.z1 + 1) * CELL
    const geo = new THREE.PlaneGeometry(w * 0.9, d * 0.9)
    const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
      color: palette[i % palette.length], transparent: true, opacity: 0.055, depthWrite: false,
    }))
    mesh.rotation.x = -Math.PI / 2
    mesh.position.set(
      ((a.x1 + a.x2 + 1) / 2) * CELL - HALF,
      0.02,
      ((a.z1 + a.z2 + 1) / 2) * CELL - HALF,
    )
    scene.add(mesh)
    areaMarkers.push(mesh)
  })

  return { scene, camera, renderer, wallMesh, floorMesh, crateMeshes, areaMarkers }
}
