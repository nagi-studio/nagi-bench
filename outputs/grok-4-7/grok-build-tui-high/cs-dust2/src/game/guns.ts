import * as THREE from 'three'
import type { WeaponId } from './weapons'

const cache = new Map<string, THREE.MeshStandardMaterial>()

function mat(color: number, rough = 0.55, metal = 0.35): THREE.MeshStandardMaterial {
  const k = `${color}-${rough}-${metal}`
  let m = cache.get(k)
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal })
    cache.set(k, m)
  }
  return m
}

function box(g: THREE.Group, w: number, h: number, d: number, x: number, y: number, z: number, color: number, rough = 0.5, metal = 0.4): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color, rough, metal))
  m.position.set(x, y, z)
  m.castShadow = true
  g.add(m)
  return m
}

/** Gun points along +Z, grip near the origin. `s` scales the whole build. */
export function buildGun(id: WeaponId, s: number): THREE.Group {
  const g = new THREE.Group()
  const metal = 0x2a2e32
  const dark = 0x1a1c1e
  const wood = 0x7a4e2a
  const slide = 0xb7bcc2
  if (id === 'ak') {
    box(g, 0.07 * s, 0.08 * s, 0.72 * s, 0, 0.04 * s, 0.18 * s, metal, 0.45, 0.55)
    box(g, 0.08 * s, 0.1 * s, 0.28 * s, 0, 0.02 * s, -0.16 * s, wood, 0.75, 0.05)
    box(g, 0.05 * s, 0.16 * s, 0.08 * s, 0, -0.08 * s, 0.02 * s, dark, 0.6, 0.2)
    box(g, 0.04 * s, 0.14 * s, 0.06 * s, 0, -0.06 * s, 0.16 * s, 0x3a2416, 0.7, 0.1)
    box(g, 0.02 * s, 0.03 * s, 0.2 * s, 0, 0.09 * s, 0.28 * s, dark, 0.4, 0.6)
  } else if (id === 'm4') {
    box(g, 0.06 * s, 0.07 * s, 0.78 * s, 0, 0.04 * s, 0.2 * s, 0x3c4146, 0.4, 0.65)
    box(g, 0.07 * s, 0.09 * s, 0.26 * s, 0, 0.02 * s, -0.16 * s, 0x2c3034, 0.45, 0.5)
    box(g, 0.045 * s, 0.16 * s, 0.07 * s, 0, -0.08 * s, 0.0, dark, 0.55, 0.3)
    box(g, 0.05 * s, 0.18 * s, 0.05 * s, 0, -0.08 * s, 0.16 * s, dark, 0.5, 0.35)
    box(g, 0.03 * s, 0.035 * s, 0.22 * s, 0, 0.09 * s, 0.22 * s, 0x22262a, 0.35, 0.7)
    box(g, 0.05 * s, 0.05 * s, 0.12 * s, 0, 0.08 * s, 0.42 * s, 0x1e2226, 0.4, 0.6)
  } else if (id === 'awp') {
    box(g, 0.05 * s, 0.06 * s, 1.15 * s, 0, 0.03 * s, 0.28 * s, 0x3a3f36, 0.42, 0.55)
    box(g, 0.07 * s, 0.09 * s, 0.32 * s, 0, 0.02 * s, -0.22 * s, 0x2a2e28, 0.5, 0.4)
    box(g, 0.045 * s, 0.14 * s, 0.07 * s, 0, -0.08 * s, -0.02 * s, dark, 0.5, 0.3)
    box(g, 0.06 * s, 0.07 * s, 0.22 * s, 0, 0.1 * s, 0.05 * s, 0x111418, 0.3, 0.7)
    box(g, 0.045 * s, 0.045 * s, 0.16 * s, 0, 0.1 * s, 0.22 * s, 0x0e1114, 0.25, 0.75)
    box(g, 0.08 * s, 0.08 * s, 0.04 * s, 0, 0.1 * s, 0.1 * s, 0x222, 0.3, 0.6)
  } else if (id === 'deagle') {
    box(g, 0.07 * s, 0.1 * s, 0.32 * s, 0, 0.04 * s, 0.08 * s, slide, 0.28, 0.8)
    box(g, 0.05 * s, 0.14 * s, 0.08 * s, 0, -0.08 * s, 0.0, 0x6e5530, 0.45, 0.5)
    box(g, 0.04 * s, 0.04 * s, 0.16 * s, 0, 0.02 * s, 0.2 * s, dark, 0.4, 0.6)
  } else if (id === 'usp') {
    box(g, 0.055 * s, 0.08 * s, 0.26 * s, 0, 0.03 * s, 0.06 * s, 0x24282c, 0.4, 0.6)
    box(g, 0.04 * s, 0.12 * s, 0.06 * s, 0, -0.07 * s, 0.0, dark, 0.5, 0.3)
    box(g, 0.03 * s, 0.03 * s, 0.1 * s, 0, 0.02 * s, 0.16 * s, 0x111, 0.35, 0.5)
  } else if (id === 'glock') {
    box(g, 0.05 * s, 0.075 * s, 0.22 * s, 0, 0.03 * s, 0.05 * s, 0x2c3034, 0.42, 0.55)
    box(g, 0.04 * s, 0.12 * s, 0.055 * s, 0, -0.07 * s, -0.01 * s, dark, 0.55, 0.25)
  } else {
    box(g, 0.03 * s, 0.04 * s, 0.12 * s, 0, -0.02 * s, -0.02 * s, 0x4a3424, 0.7, 0.1)
    box(g, 0.02 * s, 0.08 * s, 0.28 * s, 0, 0.02 * s, 0.14 * s, 0xcfd4d8, 0.25, 0.85)
    box(g, 0.012 * s, 0.02 * s, 0.18 * s, 0, 0.07 * s, 0.16 * s, 0xeee, 0.2, 0.9)
  }
  const tipZ =
    id === 'awp' ? 0.9 * s : id === 'm4' ? 0.62 * s : id === 'ak' ? 0.56 * s : id === 'knife' ? 0.3 * s : 0.24 * s
  const muzzle = new THREE.Object3D()
  muzzle.name = 'muzzle'
  muzzle.position.set(0, 0.04 * s, tipZ)
  g.add(muzzle)
  return g
}
