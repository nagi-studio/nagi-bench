import * as THREE from 'three'
import type { Team } from './types'

export interface CharacterRig {
  group: THREE.Group
  head: THREE.Mesh
  torso: THREE.Mesh
  armL: THREE.Group
  armR: THREE.Group
  legL: THREE.Group
  legR: THREE.Group
  weapon: THREE.Group
}

function box(w: number, h: number, d: number, color: number): THREE.Mesh {
  const geo = new THREE.BoxGeometry(w, h, d)
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0.05 })
  const m = new THREE.Mesh(geo, mat)
  m.castShadow = true
  m.receiveShadow = true
  return m
}

/**
 * Procedural humanoid built from boxes — distinct head, torso, two arms and two
 * legs. Facing +Z in local space (yaw=0 => forward = +Z).
 */
export function buildCharacter(team: Team): CharacterRig {
  const group = new THREE.Group()

  const body = team === 'T' ? 0xc98a3d : 0x3a6ea5
  const dark = team === 'T' ? 0x8f5a1d : 0x274d73
  const skin = 0xd8a06a

  // --- legs (pivots at hips) ---
  const legL = new THREE.Group()
  const legR = new THREE.Group()
  legL.position.set(-0.13, 0.8, 0)
  legR.position.set(0.13, 0.8, 0)
  const legGeo = new THREE.BoxGeometry(0.16, 0.8, 0.18)
  const legMat = new THREE.MeshStandardMaterial({ color: dark, roughness: 0.85 })
  const legLm = new THREE.Mesh(legGeo, legMat)
  const legRm = new THREE.Mesh(legGeo, legMat)
  legLm.position.y = -0.4
  legRm.position.y = -0.4
  legLm.castShadow = legRm.castShadow = true
  legL.add(legLm)
  legR.add(legRm)

  // --- torso ---
  const torso = box(0.5, 0.62, 0.28, body)
  torso.position.y = 1.1
  // chest vest detail
  const vest = box(0.46, 0.4, 0.3, team === 'T' ? 0x7a4a14 : 0x1d3a57)
  vest.position.y = 1.12

  // --- head ---
  const head = box(0.27, 0.27, 0.27, skin)
  head.position.y = 1.62
  const helmet = box(0.3, 0.14, 0.3, team === 'CT' ? 0x2c4f6e : body)
  helmet.position.y = 1.77

  // --- arms (pivots at shoulders, posed forward to hold a weapon) ---
  const armL = new THREE.Group()
  const armR = new THREE.Group()
  armL.position.set(-0.3, 1.32, 0)
  armR.position.set(0.3, 1.32, 0)
  const armGeo = new THREE.BoxGeometry(0.12, 0.12, 0.5)
  const armMat = new THREE.MeshStandardMaterial({ color: body, roughness: 0.85 })
  const armLm = new THREE.Mesh(armGeo, armMat)
  const armRm = new THREE.Mesh(armGeo, armMat)
  armLm.position.set(0, -0.02, 0.2)
  armRm.position.set(0, -0.02, 0.2)
  armLm.castShadow = armRm.castShadow = true
  armL.add(armLm)
  armR.add(armRm)
  // hands
  const handGeo = new THREE.BoxGeometry(0.1, 0.1, 0.12)
  const handMat = new THREE.MeshStandardMaterial({ color: skin, roughness: 0.9 })
  const handL = new THREE.Mesh(handGeo, handMat)
  const handR = new THREE.Mesh(handGeo, handMat)
  handL.position.set(0, -0.03, 0.44)
  handR.position.set(0, -0.03, 0.44)
  armL.add(handL)
  armR.add(handR)

  // --- weapon held by both hands ---
  const weapon = new THREE.Group()
  weapon.position.set(0, 1.2, 0.45)
  const gunBody = box(0.09, 0.14, 0.55, 0x1a1a1a)
  gunBody.position.z = 0.1
  const gunMag = box(0.06, 0.22, 0.1, 0x2a2a2a)
  gunMag.position.set(0, -0.16, 0.1)
  weapon.add(gunBody, gunMag)

  group.add(legL, legR, torso, vest, head, helmet, armL, armR, weapon)
  group.traverse((o) => {
    o.userData.characterPart = true
  })

  return { group, head, torso, armL, armR, legL, legR, weapon }
}

export function disposeCharacter(rig: CharacterRig) {
  rig.group.traverse((o) => {
    const mesh = o as THREE.Mesh
    if (mesh.geometry) mesh.geometry.dispose()
    const mat = mesh.material as THREE.Material | THREE.Material[] | undefined
    if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
    else if (mat) mat.dispose()
  })
}
