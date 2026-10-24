import * as THREE from 'three'

export interface Solid { cx: number; cz: number; w: number; d: number; h: number; y0: number; color: number }
export interface Site { name: string; x: number; z: number; r: number }

const WALL = 0x9a958c
const CRATE = 0xb08a4a

function wall(cx: number, cz: number, w: number, d: number, h = 5, y0 = 0, color = WALL): Solid {
  return { cx, cz, w, d, h, y0, color }
}

// A stylized but connected Dust2-style layout with the canonical named areas.
export const SOLIDS: Solid[] = [
  // perimeter
  wall(0, -30, 66, 1.5), wall(0, 30, 66, 1.5), wall(-32, 0, 1.5, 62), wall(32, 0, 1.5, 62),
  // T / upper divider with a central mid gap (x in [-9,9])
  wall(-20.5, -6, 23, 1.5), wall(20.5, -6, 23, 1.5),
  // mid -> A long (left) divider
  wall(-2, -14, 1.5, 16),
  // mid -> B tunnels (right) divider
  wall(12, -14, 1.5, 16),
  // A site back wall
  wall(-20, 24, 1.5, 14), wall(-28, 17, 14, 1.5),
  // B site back wall
  wall(20, -26, 1.5, 14), wall(28, -19, 14, 1.5),
  // iconic mid double doors (stubs)
  wall(-3.2, -6, 1.2, 2.4, 3), wall(3.2, -6, 1.2, 2.4, 3),
  // catwalk (raised walkway suggestion)
  wall(-6, -18, 14, 1.2, 3, 3),
  // crates / cover at A site
  wall(-22, 16, 2, 2, 2, 0, CRATE), wall(-18, 20, 2, 2, 2, 0, CRATE),
  wall(-24, 20, 2, 2, 2, 0, CRATE), wall(-16, 14, 2, 2, 2, 0, CRATE),
  // crates at B site
  wall(18, -20, 2, 2, 2, 0, CRATE), wall(22, -16, 2, 2, 2, 0, CRATE),
  wall(20, -22, 2, 2, 2, 0, CRATE), wall(24, -20, 2, 2, 2, 0, CRATE),
  // mid cover
  wall(0, 4, 2, 2, 2, 0, CRATE), wall(-6, 2, 2, 2, 2, 0, CRATE), wall(6, 2, 2, 2, 2, 0, CRATE),
  // long-A cover
  wall(-10, -2, 2, 3, 2, 0, CRATE), wall(-14, 0, 2, 3, 2, 0, CRATE),
  // B tunnels cover
  wall(14, -4, 2, 3, 2, 0, CRATE),
]

export const SITES: Site[] = [
  { name: 'A', x: -20, z: 18, r: 8 },
  { name: 'B', x: 20, z: -18, r: 8 },
]

export const BOUNDS = { minX: -32, maxX: 32, minZ: -30, maxZ: 30 }
export const FLOOR = { w: 66, d: 62 }

export const T_SPAWNS: THREE.Vector3[] = [
  new THREE.Vector3(-24, 0, -24), new THREE.Vector3(-22, 0, -26), new THREE.Vector3(-26, 0, -22),
  new THREE.Vector3(-20, 0, -26), new THREE.Vector3(-26, 0, -26),
]
export const CT_SPAWNS: THREE.Vector3[] = [
  new THREE.Vector3(22, 0, 26), new THREE.Vector3(24, 0, 24), new THREE.Vector3(20, 0, 28),
  new THREE.Vector3(26, 0, 24), new THREE.Vector3(22, 0, 28),
]

export function buildMap(scene: THREE.Scene): { colliders: THREE.Box3[]; solids: Solid[] } {
  const colliders: THREE.Box3[] = []
  const mat = new THREE.MeshLambertMaterial({ color: WALL })
  const crateMat = new THREE.MeshLambertMaterial({ color: CRATE })
  for (const s of SOLIDS) {
    const geo = new THREE.BoxGeometry(s.w, s.h, s.d)
    const m = new THREE.Mesh(geo, s.color === CRATE ? crateMat : mat)
    m.position.set(s.cx, s.y0 + s.h / 2, s.cz)
    m.castShadow = true; m.receiveShadow = true
    scene.add(m)
    colliders.push(new THREE.Box3(
      new THREE.Vector3(s.cx - s.w / 2, s.y0, s.cz - s.d / 2),
      new THREE.Vector3(s.cx + s.w / 2, s.y0 + s.h, s.cz + s.d / 2),
    ))
  }
  // floor
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(FLOOR.w, FLOOR.d),
    new THREE.MeshLambertMaterial({ color: 0x6f6a60 }),
  )
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  scene.add(floor)
  return { colliders, solids: SOLIDS }
}
