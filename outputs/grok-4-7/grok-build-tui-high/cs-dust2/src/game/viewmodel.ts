import * as THREE from 'three'
import type { TeamId, WeaponId } from './weapons'
import { buildGun } from './guns'

export class ViewModel {
  readonly group = new THREE.Group()
  private gun = new THREE.Group()
  private weapon: WeaponId = 'glock'
  private team: TeamId = 'ct'
  private bob = 0
  kick = 0
  private arms = new THREE.Group()

  constructor() {
    this.group.add(this.arms)
    this.rebuild('glock', 'ct')
  }

  rebuild(id: WeaponId, team: TeamId): void {
    this.weapon = id
    this.team = team
    this.group.clear()
    this.arms = new THREE.Group()
    const sleeve = team === 'ct' ? 0x1b4f8a : 0x8a5a32
    const skin = 0xc68642
    const matA = new THREE.MeshStandardMaterial({ color: sleeve, roughness: 0.8 })
    const matS = new THREE.MeshStandardMaterial({ color: skin, roughness: 0.7 })
    const left = new THREE.Group()
    const lua = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.08), matA)
    lua.position.set(-0.16, -0.18, -0.12)
    lua.rotation.x = -0.6
    const lhand = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.08, 0.08), matS)
    lhand.position.set(-0.12, -0.28, -0.02)
    left.add(lua, lhand)
    const right = new THREE.Group()
    const rua = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.2, 0.08), matA)
    rua.position.set(0.14, -0.2, -0.05)
    rua.rotation.z = -0.2
    const rhand = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.08, 0.09), matS)
    rhand.position.set(0.1, -0.26, 0.02)
    right.add(rua, rhand)
    this.arms.add(left, right)
    this.group.add(this.arms)
    this.gun = buildGun(id, id === 'knife' ? 1.15 : 1.25)
    // Camera looks down -Z; flip the +Z gun so the barrel points forward.
    this.gun.rotation.y = Math.PI
    this.gun.position.set(0.02, -0.02, -0.05)
    const flat = (root: THREE.Object3D) => {
      root.traverse((obj) => {
        const mesh = obj as THREE.Mesh
        if (!mesh.isMesh) return
        const src = mesh.material as THREE.MeshStandardMaterial
        const color = src?.color ? src.color.clone().multiplyScalar(1.35) : new THREE.Color(0xdddddd)
        mesh.material = new THREE.MeshBasicMaterial({ color })
      })
    }
    flat(this.arms)
    flat(this.gun)
    this.group.add(this.gun)
    this.group.position.set(0.22, -0.24, -0.48)
  }

  current(): WeaponId {
    return this.weapon
  }

  currentTeam(): TeamId {
    return this.team
  }

  update(dt: number, speed: number, scoped: boolean): void {
    this.kick += (0 - this.kick) * Math.min(1, dt * 8)
    this.bob += dt * Math.min(8, speed) * 1.5
    const move = Math.min(1, speed / 4)
    const ox = Math.sin(this.bob * 0.5) * 0.012 * move
    const oy = Math.abs(Math.cos(this.bob)) * -0.01 * move
    this.group.position.set(0.22 + ox, -0.24 + oy - this.kick * 0.02, -0.48 - this.kick * 0.06)
    this.group.rotation.set(-this.kick * 0.35, Math.sin(this.bob * 0.5) * 0.01 * move, 0)
    this.group.visible = !scoped
  }

  punch(amount: number): void {
    this.kick = Math.min(1.4, this.kick + amount)
  }

  muzzleWorld(out: THREE.Vector3): THREE.Vector3 {
    const m = this.gun.getObjectByName('muzzle')
    if (m) return m.getWorldPosition(out)
    return this.group.getWorldPosition(out)
  }
}
