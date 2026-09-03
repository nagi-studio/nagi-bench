import * as THREE from 'three'
import type { Agent, Team, WeaponId, Zone } from './types'
import { WEAPONS } from './weapons'

const shared = {
  skin: new THREE.MeshStandardMaterial({ color: 0xb9825b, roughness: .82 }),
  boot: new THREE.MeshStandardMaterial({ color: 0x17191a, roughness: .9 }),
  dark: new THREE.MeshStandardMaterial({ color: 0x20272a, roughness: .78 }),
}

function part(geometry: THREE.BufferGeometry, material: THREE.Material, zone: Zone, agentId: number) {
  const mesh = new THREE.Mesh(geometry, material)
  mesh.castShadow = true; mesh.receiveShadow = true
  mesh.userData.agentId = agentId; mesh.userData.zone = zone
  return mesh
}

export function createCharacter(id: number, team: Team) {
  const root = new THREE.Group(); root.name = `${team}-${id}`
  const hitMeshes: THREE.Object3D[] = []
  const uniform = new THREE.MeshStandardMaterial({ color: team === 'CT' ? 0x2e5267 : 0x7b5232, roughness: .88 })
  const accent = new THREE.MeshStandardMaterial({ color: team === 'CT' ? 0x172d3c : 0x33261e, roughness: .82 })

  const torso = part(new THREE.BoxGeometry(.72, .82, .38), uniform, 'chest', id); torso.position.y = 1.25; hitMeshes.push(torso); root.add(torso)
  const abdomen = part(new THREE.BoxGeometry(.62, .42, .34), accent, 'abdomen', id); abdomen.position.y = .66; hitMeshes.push(abdomen); root.add(abdomen)
  const head = part(new THREE.SphereGeometry(.22, 12, 8), shared.skin, 'head', id); head.position.y = 1.89; hitMeshes.push(head); root.add(head)
  const helmet = new THREE.Mesh(new THREE.SphereGeometry(.235, 12, 6, 0, Math.PI * 2, 0, Math.PI * .58), team === 'CT' ? shared.dark : accent)
  helmet.position.y = 1.93; helmet.castShadow = true; root.add(helmet)

  // Every limb is independent and articulated into a held-rifle pose.
  const armGeo = new THREE.BoxGeometry(.19, .68, .2)
  const lArm = part(armGeo, uniform, 'arm', id); lArm.position.set(-.47, 1.27, -.18); lArm.rotation.x = -1.0; lArm.rotation.z = -.13
  const rArm = part(armGeo, uniform, 'arm', id); rArm.position.set(.47, 1.27, -.18); rArm.rotation.x = -1.08; rArm.rotation.z = .13
  hitMeshes.push(lArm, rArm); root.add(lArm, rArm)
  const handL = new THREE.Mesh(new THREE.BoxGeometry(.2, .2, .2), shared.skin); handL.position.set(-.46, 1.05, -.48); root.add(handL)
  const handR = handL.clone(); handR.position.x = .46; root.add(handR)
  const legGeo = new THREE.BoxGeometry(.25, .72, .27)
  const lLeg = part(legGeo, uniform, 'leg', id); lLeg.position.set(-.2, .22, 0)
  const rLeg = part(legGeo, uniform, 'leg', id); rLeg.position.set(.2, .22, 0)
  hitMeshes.push(lLeg, rLeg); root.add(lLeg, rLeg)
  const bootL = new THREE.Mesh(new THREE.BoxGeometry(.27, .17, .39), shared.boot); bootL.position.set(-.2, -.17, -.06); root.add(bootL)
  const bootR = bootL.clone(); bootR.position.x = .2; root.add(bootR)
  const vest = new THREE.Mesh(new THREE.BoxGeometry(.78, .58, .43), accent); vest.position.set(0, 1.25, .01); root.add(vest)
  if (team === 'CT') {
    const visor = new THREE.Mesh(new THREE.BoxGeometry(.32, .08, .08), new THREE.MeshStandardMaterial({ color: 0x16252e, metalness: .45 }))
    visor.position.set(0, 1.93, -.205); root.add(visor)
  } else {
    const scarf = new THREE.Mesh(new THREE.BoxGeometry(.42, .22, .38), new THREE.MeshStandardMaterial({ color: 0xa9824c, roughness: 1 }))
    scarf.position.set(0, 1.68, 0); root.add(scarf)
  }
  const gun = buildWeaponModel(team === 'T' ? 'ak47' : 'm4a4', false)
  gun.name = 'heldWeapon'; gun.position.set(.06, 1.18, -.65); gun.scale.setScalar(.72); root.add(gun)
  return { group: root, hitMeshes }
}

function mat(color: number, metalness = .25) { return new THREE.MeshStandardMaterial({ color, roughness: .58, metalness }) }

export function buildWeaponModel(id: WeaponId, firstPerson: boolean) {
  const spec = WEAPONS[id]
  const g = new THREE.Group()
  const main = mat(spec.color); const black = mat(0x151719, .6); const steel = mat(0x5b6264, .7)
  const pistol = spec.slot === 'secondary'
  const knife = id === 'knife'
  const length = knife ? .75 : pistol ? .58 : id === 'awp' ? 1.55 : 1.15
  if (knife) {
    const blade = new THREE.Mesh(new THREE.BoxGeometry(.08, .035, .65), steel); blade.rotation.x = -.08; blade.position.z = -.28; g.add(blade)
    const point = new THREE.Mesh(new THREE.ConeGeometry(.065, .23, 4), steel); point.rotation.x = -Math.PI / 2; point.position.z = -.72; g.add(point)
    const grip = new THREE.Mesh(new THREE.BoxGeometry(.13, .13, .34), black); grip.position.z = .2; g.add(grip)
  } else {
    const body = new THREE.Mesh(new THREE.BoxGeometry(pistol ? .2 : .24, pistol ? .25 : .27, length * .55), main); body.position.z = -.14; g.add(body)
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(pistol ? .035 : .045, pistol ? .035 : .05, length * .58, 8), black)
    barrel.rotation.x = Math.PI / 2; barrel.position.set(0, .055, -length * .55); g.add(barrel)
    const grip = new THREE.Mesh(new THREE.BoxGeometry(.16, .34, .18), black); grip.position.set(0, -.25, pistol ? .04 : .12); grip.rotation.x = -.18; g.add(grip)
    if (!pistol) {
      const mag = new THREE.Mesh(new THREE.BoxGeometry(.16, .42, .22), id === 'ak47' ? main : black); mag.position.set(0, -.26, -.15); mag.rotation.x = id === 'ak47' ? -.25 : 0; g.add(mag)
      const stock = new THREE.Mesh(new THREE.BoxGeometry(.2, .22, .42), id === 'ak47' ? main : black); stock.position.z = .52; stock.rotation.x = .08; g.add(stock)
    }
    if (id === 'awp') {
      const scope = new THREE.Mesh(new THREE.CylinderGeometry(.105, .105, .48, 12), black); scope.rotation.z = Math.PI / 2; scope.position.set(0, .23, -.12); g.add(scope)
      const lens = new THREE.Mesh(new THREE.CircleGeometry(.09, 12), mat(0x345f68, .8)); lens.rotation.y = Math.PI / 2; lens.position.set(.245, .23, -.12); g.add(lens)
    }
    const sight = new THREE.Mesh(new THREE.BoxGeometry(.055, .09, .06), black); sight.position.set(0, .2, -length * .51); g.add(sight)
  }
  if (firstPerson) {
    g.rotation.y = 0
    g.traverse(o => { o.renderOrder = 4 })
  }
  return g
}

export class ViewModel {
  readonly group = new THREE.Group()
  private weapon: THREE.Group | null = null
  private weaponId: WeaponId | null = null
  private recoil = 0
  private time = 0
  private hands: THREE.Mesh[] = []

  constructor(camera: THREE.Camera) {
    camera.add(this.group)
    const skin = new THREE.MeshStandardMaterial({ color: 0xb9825b, roughness: .9, depthTest: false })
    const sleeve = new THREE.MeshStandardMaterial({ color: 0x263944, roughness: .9, depthTest: false })
    const left = new THREE.Mesh(new THREE.BoxGeometry(.16, .17, .66), sleeve); left.position.set(-.29, -.28, -.59); left.rotation.x = -1.24; left.rotation.z = -.1
    const right = left.clone(); right.position.x = .31; right.rotation.z = .1
    const hand1 = new THREE.Mesh(new THREE.BoxGeometry(.17, .16, .22), skin); hand1.position.set(-.29, -.27, -.93)
    const hand2 = hand1.clone(); hand2.position.x = .31
    this.hands = [left, right, hand1, hand2]; this.group.add(...this.hands)
  }

  setWeapon(id: WeaponId) {
    if (this.weaponId === id) return
    if (this.weapon) this.group.remove(this.weapon)
    this.weaponId = id; this.weapon = buildWeaponModel(id, true)
    this.weapon.position.set(.14, -.22, -.78); this.weapon.scale.setScalar(.78); this.group.add(this.weapon)
    const knife = id === 'knife'
    this.hands[0].position.x = knife ? .12 : -.29
    this.hands[2].position.x = knife ? .12 : -.29
  }

  kick(amount: number) { this.recoil = Math.min(.18, this.recoil + amount * 2.3) }
  update(dt: number, moving: boolean, scoped: boolean) {
    this.time += dt; this.recoil = THREE.MathUtils.damp(this.recoil, 0, 13, dt)
    const bob = moving ? Math.sin(this.time * 10) * .009 : 0
    this.group.position.set(0, bob, this.recoil)
    this.group.rotation.x = this.recoil * 1.7
    this.group.visible = !scoped
  }
}

export function syncHeldWeapon(agent: Agent) {
  const old = agent.group.getObjectByName('heldWeapon')
  if (old) agent.group.remove(old)
  const gun = buildWeaponModel(agent.inventory[agent.activeSlot]?.id ?? 'knife', false)
  gun.name = 'heldWeapon'; gun.position.set(.06, 1.18, -.65); gun.scale.setScalar(.72); agent.group.add(gun)
}
