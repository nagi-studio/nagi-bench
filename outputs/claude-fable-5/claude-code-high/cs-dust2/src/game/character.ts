import * as THREE from 'three'
import type { Team, WeaponId } from './types'

type GunKind = 'rifle' | 'awp' | 'pistol' | 'knife'

export function gunKindOf(id: WeaponId): GunKind {
  if (id === 'awp') return 'awp'
  if (id === 'ak47' || id === 'm4a4') return 'rifle'
  if (id === 'knife') return 'knife'
  return 'pistol'
}

function mat(color: number): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.9 })
}

function box(w: number, h: number, d: number, m: THREE.MeshStandardMaterial): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m)
  mesh.castShadow = true
  return mesh
}

/**
 * Procedural humanoid: separate head / torso / two arms / two legs,
 * built entirely from code. Faces -Z. Feet at origin.
 */
export class CharacterRig {
  root = new THREE.Group()
  private body = new THREE.Group()
  private legL: THREE.Mesh
  private legR: THREE.Mesh
  private head: THREE.Group
  private aim = new THREE.Group()
  private guns: Record<GunKind, THREE.Group>
  private bombPack: THREE.Mesh
  private mats: THREE.MeshStandardMaterial[] = []
  private walkPhase = 0
  private dead = false
  private deathT = 0
  private fallAxis = 1

  constructor(team: Team) {
    const skin = mat(0xd8b094)
    const shirt = team === 'CT' ? mat(0x3d5a73) : mat(0xa08752)
    const pants = team === 'CT' ? mat(0x2c3e50) : mat(0x55483a)
    const gear = team === 'CT' ? mat(0x232f3a) : mat(0x4a3b28)
    const headgear = team === 'CT' ? mat(0x46586b) : mat(0x7d3030)
    this.mats.push(skin, shirt, pants, gear, headgear)

    // legs (pivot at hip)
    const mkLeg = (x: number) => {
      const leg = box(0.17, 0.9, 0.2, pants)
      leg.geometry.translate(0, -0.45, 0)
      leg.position.set(x, 0.9, 0)
      return leg
    }
    this.legL = mkLeg(-0.12)
    this.legR = mkLeg(0.12)
    this.body.add(this.legL, this.legR)

    // torso + vest
    const torso = box(0.46, 0.52, 0.24, shirt)
    torso.position.y = 1.21
    const vest = box(0.5, 0.3, 0.28, gear)
    vest.position.y = 1.14
    this.body.add(torso, vest)

    // bomb backpack (visible when carrying C4)
    this.bombPack = box(0.3, 0.36, 0.16, mat(0x8a2e2e))
    this.bombPack.position.set(0, 1.22, 0.22)
    this.bombPack.visible = false
    this.body.add(this.bombPack)

    // head (pivot at neck)
    this.head = new THREE.Group()
    this.head.position.y = 1.5
    const skull = box(0.26, 0.26, 0.26, skin)
    skull.position.y = 0.16
    this.head.add(skull)
    if (team === 'CT') {
      const helmet = box(0.3, 0.13, 0.3, headgear)
      helmet.position.y = 0.28
      this.head.add(helmet)
      const visor = box(0.22, 0.06, 0.02, mat(0x111111))
      visor.position.set(0, 0.19, -0.14)
      this.head.add(visor)
    } else {
      const wrap = box(0.28, 0.1, 0.28, headgear)
      wrap.position.y = 0.27
      this.head.add(wrap)
      const tail = box(0.06, 0.16, 0.03, headgear)
      tail.position.set(0.08, 0.18, 0.15)
      this.head.add(tail)
    }
    this.body.add(this.head)

    // aim group: both arms + weapon, pitches with view
    this.aim.position.y = 1.42
    const mkArm = (x: number, rotX: number, rotZ: number) => {
      const arm = box(0.13, 0.42, 0.13, shirt)
      arm.geometry.translate(0, -0.21, 0)
      const hand = box(0.09, 0.1, 0.09, skin)
      hand.position.y = -0.44
      arm.add(hand)
      arm.position.set(x, 0, 0)
      arm.rotation.set(rotX, 0, rotZ)
      return arm
    }
    this.aim.add(mkArm(-0.28, 1.15, 0.4), mkArm(0.28, 1.05, -0.3))

    // world-model guns
    this.guns = {
      rifle: this.buildRifle(),
      awp: this.buildAwp(),
      pistol: this.buildPistol(),
      knife: this.buildKnife(),
    }
    for (const g of Object.values(this.guns)) {
      g.position.set(0.05, -0.24, -0.35)
      g.visible = false
      this.aim.add(g)
    }
    this.guns.rifle.visible = true
    this.body.add(this.aim)
    this.root.add(this.body)
  }

  private buildRifle(): THREE.Group {
    const g = new THREE.Group()
    const metal = mat(0x3a3a3a)
    const wood = mat(0x6b4a2f)
    const body = box(0.06, 0.1, 0.55, metal); body.position.z = -0.15
    const barrel = box(0.035, 0.035, 0.35, metal); barrel.position.z = -0.55
    const stock = box(0.05, 0.09, 0.22, wood); stock.position.z = 0.2
    const magM = box(0.04, 0.16, 0.09, wood); magM.position.set(0, -0.12, -0.1); magM.rotation.x = 0.35
    g.add(body, barrel, stock, magM)
    return g
  }

  private buildAwp(): THREE.Group {
    const g = new THREE.Group()
    const olive = mat(0x4a5d3a)
    const metal = mat(0x2e2e2e)
    const body = box(0.06, 0.1, 0.7, olive); body.position.z = -0.2
    const barrel = box(0.03, 0.03, 0.5, metal); barrel.position.z = -0.78
    const scope = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.28, 8), metal)
    scope.rotation.x = Math.PI / 2
    scope.position.set(0, 0.08, -0.2)
    scope.castShadow = true
    const stock = box(0.05, 0.11, 0.24, olive); stock.position.z = 0.25
    g.add(body, barrel, scope, stock)
    return g
  }

  private buildPistol(): THREE.Group {
    const g = new THREE.Group()
    const metal = mat(0x333338)
    const slide = box(0.045, 0.06, 0.24, metal); slide.position.z = -0.06
    const grip = box(0.04, 0.13, 0.06, metal); grip.position.set(0, -0.08, 0.05); grip.rotation.x = 0.25
    g.add(slide, grip)
    return g
  }

  private buildKnife(): THREE.Group {
    const g = new THREE.Group()
    const blade = box(0.015, 0.045, 0.3, mat(0xcfd6dd)); blade.position.z = -0.15
    const handle = box(0.03, 0.05, 0.12, mat(0x2f2f33)); handle.position.z = 0.06
    g.add(blade, handle)
    return g
  }

  setWeapon(id: WeaponId) {
    const kind = gunKindOf(id)
    for (const [k, g] of Object.entries(this.guns)) g.visible = k === kind
  }

  setBomb(visible: boolean) {
    this.bombPack.visible = visible
  }

  spawnReset() {
    this.dead = false
    this.deathT = 0
    this.walkPhase = 0
    this.body.rotation.set(0, 0, 0)
    this.body.position.set(0, 0, 0)
    for (const m of this.mats) { m.transparent = false; m.opacity = 1 }
    this.root.visible = true
  }

  die() {
    if (this.dead) return
    this.dead = true
    this.deathT = 0
    this.fallAxis = Math.random() < 0.5 ? 1 : -1
  }

  update(dt: number, pos: THREE.Vector3, yaw: number, pitch: number, speed: number, onGround: boolean) {
    this.root.position.copy(pos)
    this.root.rotation.y = yaw

    if (this.dead) {
      this.deathT += dt
      const k = Math.min(1, this.deathT / 0.4)
      this.body.rotation.z = this.fallAxis * (Math.PI / 2) * k * k * (3 - 2 * k)
      this.body.position.y = 0.12 * k
      if (this.deathT > 6) {
        const fade = Math.max(0, 1 - (this.deathT - 6) / 1.5)
        for (const m of this.mats) { m.transparent = true; m.opacity = fade }
        if (fade <= 0) this.root.visible = false
      }
      return
    }

    const speedRatio = Math.min(1, speed / 4.7)
    this.walkPhase += speed * dt * 2.2
    const swing = onGround ? Math.sin(this.walkPhase) * 0.7 * speedRatio : 0.25
    this.legL.rotation.x = swing
    this.legR.rotation.x = -swing
    this.body.position.y = onGround ? Math.abs(Math.sin(this.walkPhase)) * 0.045 * speedRatio : 0.05
    this.aim.rotation.x = pitch
    this.head.rotation.x = pitch * 0.55
  }

  dispose(scene: THREE.Scene) {
    scene.remove(this.root)
    this.root.traverse(o => {
      if (o instanceof THREE.Mesh) o.geometry.dispose()
    })
    for (const m of this.mats) m.dispose()
  }
}
