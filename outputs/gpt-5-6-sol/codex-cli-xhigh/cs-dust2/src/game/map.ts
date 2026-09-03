import * as THREE from 'three'
import type { NavNode, Site, WallCollider } from './types'

export const WORLD_BOUNDS = { minX: -52, maxX: 52, minZ: -48, maxZ: 62 }
export const SITES: Site[] = [
  { id: 'A', center: new THREE.Vector3(-32, 0, -27), radius: 7.2 },
  { id: 'B', center: new THREE.Vector3(32, 0, -28), radius: 7.2 },
]

const P = (x: number, z: number) => new THREE.Vector3(x, 0, z)

export const NAV_NODES: NavNode[] = [
  { id: 0, name: 'T 出生点', position: P(0, 54), links: [1, 5, 9] },
  { id: 1, name: 'A 大入口', position: P(-27, 46), links: [0, 2] },
  { id: 2, name: 'A 大', position: P(-43, 19), links: [1, 3] },
  { id: 3, name: 'A 大斜坡', position: P(-42, -13), links: [2, 4] },
  { id: 4, name: 'A 点', position: P(-32, -27), links: [3, 8, 13] },
  { id: 5, name: '中路上段', position: P(-2, 31), links: [0, 6, 9] },
  { id: 6, name: '中路', position: P(1, 11), links: [5, 7, 8, 10] },
  { id: 7, name: '中门', position: P(2, -7), links: [6, 12] },
  { id: 8, name: '猫道', position: P(-17, -9), links: [6, 4] },
  { id: 9, name: 'B 洞外', position: P(23, 43), links: [0, 5, 10] },
  { id: 10, name: 'B 洞', position: P(37, 20), links: [9, 6, 11] },
  { id: 11, name: 'B 洞出口', position: P(34, -10), links: [10, 14] },
  { id: 12, name: 'CT 出生点', position: P(6, -38), links: [7, 13, 14] },
  { id: 13, name: 'A 回防', position: P(-17, -36), links: [12, 4] },
  { id: 14, name: 'B 点', position: P(32, -28), links: [12, 11] },
]

export interface MapResult {
  group: THREE.Group
  colliders: WallCollider[]
  raycastMeshes: THREE.Object3D[]
}

export function buildMap(scene: THREE.Scene): MapResult {
  const group = new THREE.Group()
  group.name = 'Dust II procedural map'
  scene.add(group)
  const colliders: WallCollider[] = []
  const raycastMeshes: THREE.Object3D[] = []
  const sand = new THREE.MeshStandardMaterial({ color: 0xc8a66f, roughness: .92 })
  const stone = new THREE.MeshStandardMaterial({ color: 0xa98559, roughness: .92 })
  const pale = new THREE.MeshStandardMaterial({ color: 0xd0b789, roughness: .86 })
  const dark = new THREE.MeshStandardMaterial({ color: 0x5d4d3b, roughness: 1 })
  const wood = new THREE.MeshStandardMaterial({ color: 0x70462a, roughness: .86 })

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(112, 122), sand)
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  group.add(floor)

  // Slightly varied paving breaks up the large floor without using textures.
  const paving = new THREE.InstancedMesh(new THREE.BoxGeometry(2.7, .025, 2.7), new THREE.MeshStandardMaterial({ color: 0xbc9863, roughness: 1 }), 230)
  const dummy = new THREE.Object3D()
  for (let i = 0; i < 230; i++) {
    dummy.position.set(-49 + (i % 23) * 4.45 + (i % 3) * .1, .008, -44 + Math.floor(i / 23) * 10.2)
    dummy.rotation.y = (i % 5) * .012
    dummy.updateMatrix(); paving.setMatrixAt(i, dummy.matrix)
  }
  group.add(paving)

  function box(x: number, z: number, w: number, d: number, h = 5, mat = stone, collide = true, minimap = true) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
    mesh.position.set(x, h / 2, z)
    mesh.castShadow = true; mesh.receiveShadow = true
    group.add(mesh)
    if (collide) {
      const collider = { box: new THREE.Box3().setFromObject(mesh), mesh, minimap }
      colliders.push(collider); raycastMeshes.push(mesh)
    }
    return mesh
  }

  // Perimeter and skyline. The stepped parapets make the whole arena read as a dense old city.
  box(-54, 7, 4, 114, 8); box(54, 7, 4, 114, 8); box(0, -50, 108, 4, 8); box(0, 64, 108, 4, 8)
  ;[[-48,54,10,13],[-43,42,9,18],[-47,-38,9,17],[-5,-44,18,9],[20,-44,14,9],[47,-39,10,18],[46,50,12,15],[32,58,18,8]]
    .forEach(([x,z,w,d], i) => box(x,z,w,d, 7 + i % 3 * 2, i % 2 ? pale : stone))

  // Long A: a bent, walled lane from T spawn to the A ramp.
  box(-30, 51, 23, 3, 5); box(-17, 37, 3, 20, 6)
  box(-48, 3, 3, 33, 6); box(-35, 7, 3, 22, 5)
  box(-47, -8, 2, 2.5, 4, pale)

  // Mid spine and short/catwalk. Gaps are deliberate traversable junctions.
  box(-12, 27, 3, 26, 5); box(9, 27, 3, 25, 5)
  box(-14, 4, 10, 3, 5); box(-1.5, 4, 1, 3, 5); box(13, 4, 13, 3, 5)
  box(-26, -4, 3, 25, 5); box(-13, -18, 12, 3, 4)
  const cat = box(-17, -8, 16, 5.5, .38, new THREE.MeshStandardMaterial({ color: 0xb48d58, roughness: 1 }), false)
  cat.position.y = .18
  for (let i = 0; i < 7; i++) box(-10.5 - i * 2.1, -11.1 - i * .5, 2.1, 1.1, .18 + i * .07, pale, false, false)

  // Mid double doors: two solid wooden leaves with a generous passable opening in the middle.
  box(-7.8, -7.2, 9, 1.2, 5.6, stone)
  box(11.8, -7.2, 9, 1.2, 5.6, stone)
  const leftDoor = box(-2.4, -7.15, 4.2, .38, 4.4, wood)
  const rightDoor = box(6.4, -7.15, 4.2, .38, 4.4, wood)
  leftDoor.rotation.y = -.18; rightDoor.rotation.y = .18
  colliders[colliders.length - 2].box.setFromObject(leftDoor)
  colliders[colliders.length - 1].box.setFromObject(rightDoor)
  addDoorHardware(leftDoor); addDoorHardware(rightDoor)

  // A bombsite and CT approach.
  box(-42, -34, 3, 19, 5); box(-26, -39, 28, 3, 5); box(-21, -26, 3, 11, 5)
  crate(-35, -25, 2, 2); crate(-30.5, -30, 2.4, 1.8); crate(-38, -30.5, 1.7, 1.7)

  // B tunnels form a curved-feeling sequence of chambers using staggered orthogonal walls.
  box(16, 59, 3, 7, 6); box(16, 38, 3, 9, 6); box(34, 51, 3, 18, 6)
  box(20, 34, 12, 3, 5); box(42, 34, 16, 3, 5)
  box(29, 20, 3, 25, 5); box(48, 13, 3, 43, 6)
  box(31, 1, 4, 3, 5); box(44, -5, 3, 13, 5)
  // Tunnel roof slats and an arch hint, kept above player height.
  for (let z = 25; z >= 8; z -= 4) box(38.5, z, 18, .55, .55, dark, false, false).position.y = 4.7
  box(38.5, 2, 5.2, .7, 1.3, stone, false).position.y = 4.35

  // B site enclosure, window/door gaps and defensive crates.
  box(19, -18, 3, 24, 5); box(45, -27, 3, 25, 5); box(32, -41, 29, 3, 5)
  box(23, -14, 7, 2.5, 5); box(40, -14, 8, 2.5, 5)
  crate(34, -29, 2, 2.2); crate(39, -34, 2.2, 2.2); crate(26, -33, 1.8, 1.8)

  // CT spawn divider and cover, while preserving routes to both sites and mid.
  box(-1, -29, 4, 3, 4.5); box(8, -29, 4, 3, 4.5); box(10, -19, 3, 13, 5); box(-5, -45, 3, 8, 5)
  crate(5, -37, 2.2, 1.8); crate(15, -34, 2.1, 2.1)

  function crate(x: number, z: number, w: number, d: number) {
    const c = box(x, z, w, d, 2.2, wood)
    const bandMat = new THREE.MeshStandardMaterial({ color: 0x312820, roughness: .75 })
    const b1 = new THREE.Mesh(new THREE.BoxGeometry(w + .035, .13, d + .04), bandMat); b1.position.set(x, .55, z)
    const b2 = b1.clone(); b2.position.y = 1.72; group.add(b1, b2)
    return c
  }

  function addDoorHardware(door: THREE.Mesh) {
    const rivetMat = new THREE.MeshStandardMaterial({ color: 0x25211b, metalness: .5, roughness: .5 })
    for (let y = .55; y < 4; y += .72) {
      const rivet = new THREE.Mesh(new THREE.BoxGeometry(.1, .1, .09), rivetMat)
      rivet.position.set(door.position.x, y, door.position.z - .24); group.add(rivet)
    }
  }

  // Bombsite paint, route labels and familiar wall signs are canvas-free geometric decals.
  for (const site of SITES) {
    const ring = new THREE.Mesh(new THREE.RingGeometry(3.25, 3.48, 48), new THREE.MeshBasicMaterial({ color: 0xd45431, side: THREE.DoubleSide }))
    ring.rotation.x = -Math.PI / 2; ring.position.copy(site.center).setY(.035); group.add(ring)
    const letter = makeTextSprite(site.id, '#e85b36', 1.2)
    letter.position.copy(site.center).add(new THREE.Vector3(0, .15, 0)); group.add(letter)
  }
  const labels: [string, number, number][] = [
    ['T SPAWN', 0, 57], ['LONG A', -43, 12], ['A SITE', -32, -22], ['MID', 1, 13], ['MID DOORS', 2, -10],
    ['CATWALK', -18, -10], ['B TUNNELS', 38, 18], ['B SITE', 32, -24], ['CT SPAWN', 6, -43],
  ]
  labels.forEach(([t,x,z]) => { const s = makeTextSprite(t, '#403625', .45); s.position.set(x, .08, z); s.rotation.x = -Math.PI / 2; group.add(s) })

  // Atmospheric props.
  for (let x = -46; x <= 46; x += 9) {
    const merlon = box(x, 61.2, 2.6, 1.2, 1.4, pale, false, false); merlon.position.y = 6.8
  }
  return { group, colliders, raycastMeshes }
}

function makeTextSprite(text: string, color: string, scale = 1) {
  const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 128
  const ctx = canvas.getContext('2d')!
  ctx.font = '900 64px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillStyle = color; ctx.fillText(text, 256, 64)
  const tex = new THREE.CanvasTexture(canvas); tex.colorSpace = THREE.SRGBColorSpace
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }))
  sprite.scale.set(6 * scale, 1.5 * scale, 1)
  return sprite
}

export function pointInSite(position: THREE.Vector3): 'A' | 'B' | null {
  for (const site of SITES) if (position.distanceToSquared(site.center) < site.radius * site.radius) return site.id
  return null
}

export function getLocation(position: THREE.Vector3) {
  let best = NAV_NODES[0]; let d = Infinity
  for (const node of NAV_NODES) {
    const nd = node.position.distanceToSquared(position)
    if (nd < d) { d = nd; best = node }
  }
  return best.name
}

export function nearestNavNode(position: THREE.Vector3) {
  let best = 0; let dist = Infinity
  for (const n of NAV_NODES) {
    const d = n.position.distanceToSquared(position)
    if (d < dist) { dist = d; best = n.id }
  }
  return best
}

export function findPath(from: THREE.Vector3, to: THREE.Vector3) {
  const start = nearestNavNode(from), goal = nearestNavNode(to)
  const open = new Set<number>([start]); const came = new Map<number, number>()
  const g = new Map<number, number>([[start, 0]]); const f = new Map<number, number>([[start, NAV_NODES[start].position.distanceTo(NAV_NODES[goal].position)]])
  while (open.size) {
    let current = [...open].sort((a,b) => (f.get(a) ?? Infinity) - (f.get(b) ?? Infinity))[0]
    if (current === goal) {
      const path = [current]
      while (came.has(current)) { current = came.get(current)!; path.unshift(current) }
      return path
    }
    open.delete(current)
    for (const next of NAV_NODES[current].links) {
      const tentative = (g.get(current) ?? Infinity) + NAV_NODES[current].position.distanceTo(NAV_NODES[next].position)
      if (tentative < (g.get(next) ?? Infinity)) {
        came.set(next, current); g.set(next, tentative)
        f.set(next, tentative + NAV_NODES[next].position.distanceTo(NAV_NODES[goal].position)); open.add(next)
      }
    }
  }
  return [start, goal]
}
