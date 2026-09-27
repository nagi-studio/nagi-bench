import * as THREE from 'three'
import type { TeamId, WeaponId } from './weapons'
import { buildGun } from './guns'

export interface CharacterVisual {
  root: THREE.Group
  hitMeshes: THREE.Object3D[]
  gunMount: THREE.Group
  gun: THREE.Group
  lArm: THREE.Group
  rArm: THREE.Group
  lLeg: THREE.Group
  rLeg: THREE.Group
  team: TeamId
  walk: number
  death: number
  weapon: WeaponId
  bombPack: THREE.Mesh
}

const mats = new Map<string, THREE.MeshStandardMaterial>()

function mat(color: number, rough = 0.78, metal = 0.04): THREE.MeshStandardMaterial {
  const k = `${color}-${rough}-${metal}`
  let m = mats.get(k)
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal })
    mats.set(k, m)
  }
  return m
}

function part(
  w: number,
  h: number,
  d: number,
  color: number,
  zone: string | null,
  hits: THREE.Object3D[],
  rough = 0.78,
): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color, rough))
  mesh.castShadow = true
  mesh.receiveShadow = true
  if (zone) {
    mesh.userData.zone = zone
    mesh.userData.half = new THREE.Vector3(w / 2, h / 2, d / 2)
    hits.push(mesh)
  }
  return mesh
}

export function createCharacter(team: TeamId): CharacterVisual {
  const ct = team === 'ct'
  const skin = 0xc68642
  const shirt = ct ? 0x1b4f8a : 0x8a5a32
  const pants = ct ? 0x121c30 : 0x3e2c22
  const gear = ct ? 0x89a0b8 : 0x5a4030
  const helm = ct ? 0x16324a : 0x6a3b22
  const accent = ct ? 0x3ec6d8 : 0xe25b12
  const boot = 0x1a1a1a
  const hits: THREE.Object3D[] = []
  const root = new THREE.Group()
  root.rotation.order = 'YXZ'

  const hips = part(0.4, 0.22, 0.24, pants, 'stomach', hits)
  hips.position.y = 0.9
  root.add(hips)

  const chest = part(0.48, 0.46, 0.28, shirt, 'chest', hits)
  chest.position.y = 1.28
  root.add(chest)

  const plate = part(0.36, 0.28, 0.08, gear, null, hits, 0.55)
  plate.position.set(0, 1.3, 0.16)
  root.add(plate)

  const head = part(0.28, 0.3, 0.28, skin, 'head', hits)
  head.position.y = 1.66
  root.add(head)

  const helmet = part(ct ? 0.34 : 0.3, ct ? 0.18 : 0.14, ct ? 0.34 : 0.3, helm, null, hits, 0.45)
  helmet.position.y = ct ? 1.84 : 1.84
  root.add(helmet)

  const eye = part(0.2, 0.045, 0.04, accent, null, hits, 0.3)
  eye.position.set(0, 1.66, 0.15)
  root.add(eye)

  if (!ct) {
    const band = part(0.1, 0.08, 0.1, accent, null, hits)
    band.position.set(-0.28, 1.25, 0)
    root.add(band)
  } else {
    const visor = part(0.26, 0.06, 0.06, 0x0e1a24, null, hits, 0.25)
    visor.position.set(0, 1.74, 0.14)
    root.add(visor)
  }

  const lArm = new THREE.Group()
  lArm.position.set(-0.32, 1.46, 0)
  const lua = part(0.12, 0.28, 0.12, shirt, 'arm', hits)
  lua.position.y = -0.14
  const lel = new THREE.Group()
  lel.position.y = -0.28
  const lla = part(0.11, 0.26, 0.11, shirt, 'arm', hits)
  lla.position.y = -0.13
  const lhand = part(0.1, 0.1, 0.1, skin, 'arm', hits)
  lhand.position.y = -0.3
  lel.add(lla, lhand)
  lArm.add(lua, lel)
  lArm.rotation.x = -1.15
  lel.rotation.x = 0.45
  root.add(lArm)

  const rArm = new THREE.Group()
  rArm.position.set(0.32, 1.46, 0)
  const rua = part(0.12, 0.28, 0.12, shirt, 'arm', hits)
  rua.position.y = -0.14
  const rel = new THREE.Group()
  rel.position.y = -0.28
  const rla = part(0.11, 0.26, 0.11, shirt, 'arm', hits)
  rla.position.y = -0.13
  const rhand = part(0.1, 0.1, 0.1, skin, 'arm', hits)
  rhand.position.y = -0.3
  rel.add(rla, rhand)
  rArm.add(rua, rel)
  rArm.rotation.x = -1.28
  rel.rotation.x = 0.35
  root.add(rArm)

  function leg(side: number): THREE.Group {
    const g = new THREE.Group()
    g.position.set(0.12 * side, 0.82, 0)
    const up = part(0.15, 0.4, 0.16, pants, 'leg', hits)
    up.position.y = -0.2
    const knee = new THREE.Group()
    knee.position.y = -0.4
    const low = part(0.13, 0.38, 0.14, pants, 'leg', hits)
    low.position.y = -0.19
    const foot = part(0.14, 0.1, 0.26, boot, 'leg', hits)
    foot.position.set(0, -0.4, 0.05)
    knee.add(low, foot)
    g.add(up, knee)
    return g
  }

  const lLeg = leg(-1)
  const rLeg = leg(1)
  root.add(lLeg, rLeg)

  const gunMount = new THREE.Group()
  gunMount.position.set(0.12, 1.22, 0.22)
  const gun = buildGun('glock', 1)
  gunMount.add(gun)
  root.add(gunMount)

  const bombPack = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.22, 0.12), mat(0x20241c, 0.6, 0.2))
  bombPack.position.set(0, 1.2, -0.18)
  bombPack.visible = false
  const led = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.04), mat(0xff2a2a, 0.4, 0.1))
  led.position.set(0, 0.02, 0.08)
  bombPack.add(led)
  root.add(bombPack)

  return {
    root,
    hitMeshes: hits,
    gunMount,
    gun,
    lArm,
    rArm,
    lLeg,
    rLeg,
    team,
    walk: 0,
    death: 0,
    weapon: 'glock',
    bombPack,
  }
}

export function setCharacterGun(vis: CharacterVisual, id: WeaponId): void {
  if (vis.weapon === id) return
  vis.gunMount.remove(vis.gun)
  vis.gun = buildGun(id, 1)
  vis.gunMount.add(vis.gun)
  vis.weapon = id
}

export function poseCharacter(
  vis: CharacterVisual,
  x: number,
  y: number,
  z: number,
  yaw: number,
  moving: number,
  crouch: boolean,
  alive: boolean,
  dt: number,
  hasBomb: boolean,
): void {
  vis.walk += dt * moving * 2.4
  const swing = Math.sin(vis.walk) * Math.min(1, moving / 3)
  const targetDeath = alive ? 0 : 1
  vis.death += (targetDeath - vis.death) * Math.min(1, dt * 6)
  vis.root.position.set(x, y + (crouch ? 0.32 : 0.45) * vis.death, z)
  vis.root.rotation.set(-vis.death * 1.35, yaw, 0)
  const crouchDrop = crouch && alive ? 0.28 : 0
  vis.root.position.y -= crouchDrop
  vis.lLeg.rotation.x = swing * 0.75
  vis.rLeg.rotation.x = -swing * 0.75
  vis.lArm.rotation.x = -1.15 + swing * 0.06
  vis.rArm.rotation.x = -1.28 - swing * 0.04
  vis.bombPack.visible = hasBomb && alive
}
