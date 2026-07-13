import * as THREE from 'three'
import type { WeaponId } from './types'

function mat(color: number, metalness = 0.2): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness })
}

function box(w: number, h: number, d: number, m: THREE.Material): THREE.Mesh {
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m)
}

/** First-person weapon models, attached to the camera. Procedural geometry only. */
export class ViewModel {
  group = new THREE.Group()
  private models = new Map<WeaponId, THREE.Group>()
  private current: WeaponId = 'knife'
  private kick = 0
  private raise = 1
  private slashT = 0
  private reloadT = 0
  private reloadDur = 0
  private bobPhase = 0
  private flash: THREE.Mesh
  private flashT = 0

  constructor(camera: THREE.Camera) {
    this.group.position.set(0.26, -0.24, -0.5)
    this.group.scale.setScalar(0.82)
    camera.add(this.group)

    const skin = mat(0xd8b094, 0)
    for (const id of ['ak47', 'm4a4', 'awp', 'glock', 'usp', 'deagle', 'knife'] as WeaponId[]) {
      const g = this.build(id)
      // hands
      const handL = box(0.05, 0.05, 0.07, skin)
      const handR = box(0.05, 0.05, 0.07, skin)
      if (id === 'knife') {
        handR.position.set(0, -0.03, 0.1)
        g.add(handR)
      } else {
        handL.position.set(-0.01, -0.04, -0.22)
        handR.position.set(0.01, -0.05, 0.05)
        g.add(handL, handR)
      }
      g.visible = false
      this.group.add(g)
      this.models.set(id, g)
    }

    this.flash = new THREE.Mesh(
      new THREE.PlaneGeometry(0.16, 0.16),
      new THREE.MeshBasicMaterial({ color: 0xffd080, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }),
    )
    this.flash.position.set(0, 0.02, -0.85)
    this.group.add(this.flash)
    this.setWeapon('knife', false)
  }

  private build(id: WeaponId): THREE.Group {
    const g = new THREE.Group()
    const dark = mat(0x35353a)
    const darker = mat(0x232326)
    switch (id) {
      case 'ak47': {
        const wood = mat(0x6f4c2e, 0)
        const recv = box(0.055, 0.09, 0.42, dark); recv.position.z = -0.1
        const guard = box(0.055, 0.07, 0.2, wood); guard.position.set(0, -0.005, -0.38)
        const barrel = box(0.025, 0.025, 0.3, darker); barrel.position.z = -0.6
        const sight = box(0.012, 0.05, 0.012, darker); sight.position.set(0, 0.06, -0.68)
        const magM = box(0.04, 0.18, 0.1, mat(0x8a6a3a)); magM.position.set(0, -0.13, -0.02); magM.rotation.x = 0.45
        const stock = box(0.045, 0.08, 0.2, wood); stock.position.set(0, -0.01, 0.2)
        g.add(recv, guard, barrel, sight, magM, stock)
        break
      }
      case 'm4a4': {
        const recv = box(0.055, 0.09, 0.44, dark); recv.position.z = -0.12
        const rail = box(0.03, 0.03, 0.3, darker); rail.position.set(0, 0.065, -0.2)
        const barrel = box(0.024, 0.024, 0.32, darker); barrel.position.z = -0.62
        const magM = box(0.04, 0.16, 0.08, darker); magM.position.set(0, -0.12, -0.06)
        const stock = box(0.05, 0.075, 0.18, dark); stock.position.set(0, 0, 0.2)
        const grip = box(0.03, 0.09, 0.045, darker); grip.position.set(0, -0.09, 0.08); grip.rotation.x = 0.3
        g.add(recv, rail, barrel, magM, stock, grip)
        break
      }
      case 'awp': {
        const olive = mat(0x4c5f3b, 0)
        const body = box(0.055, 0.095, 0.6, olive); body.position.z = -0.15
        const barrel = box(0.022, 0.022, 0.5, darker); barrel.position.z = -0.78
        const muzzleBrake = box(0.035, 0.035, 0.06, darker); muzzleBrake.position.z = -1.0
        const scope = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.26, 10), darker)
        scope.rotation.x = Math.PI / 2
        scope.position.set(0, 0.085, -0.15)
        const stock = box(0.05, 0.1, 0.22, olive); stock.position.set(0, -0.01, 0.2)
        const bolt = box(0.015, 0.015, 0.08, mat(0xa8a8b0, 0.7)); bolt.position.set(0.045, 0.03, 0.02)
        g.add(body, barrel, muzzleBrake, scope, stock, bolt)
        break
      }
      case 'glock': {
        const slide = box(0.04, 0.055, 0.22, dark); slide.position.z = -0.05
        const frame = box(0.038, 0.05, 0.18, darker); frame.position.set(0, -0.045, -0.02)
        const grip = box(0.036, 0.12, 0.055, darker); grip.position.set(0, -0.1, 0.05); grip.rotation.x = 0.25
        g.add(slide, frame, grip)
        break
      }
      case 'usp': {
        const slide = box(0.04, 0.055, 0.26, mat(0x4a4a52, 0.5)); slide.position.z = -0.07
        const supp = box(0.045, 0.045, 0.14, darker); supp.position.z = -0.27
        const grip = box(0.038, 0.12, 0.055, darker); grip.position.set(0, -0.1, 0.05); grip.rotation.x = 0.22
        g.add(slide, supp, grip)
        break
      }
      case 'deagle': {
        const silver = mat(0xb4b4bc, 0.8)
        const slide = box(0.05, 0.07, 0.3, silver); slide.position.z = -0.08
        const grip = box(0.04, 0.13, 0.06, darker); grip.position.set(0, -0.1, 0.06); grip.rotation.x = 0.25
        g.add(slide, grip)
        break
      }
      case 'knife': {
        const blade = box(0.012, 0.04, 0.26, mat(0xd6dde4, 0.9)); blade.position.z = -0.16
        const edge = box(0.006, 0.012, 0.24, mat(0xf2f6fa, 1)); edge.position.set(0, -0.026, -0.15)
        const guardK = box(0.04, 0.015, 0.02, darker); guardK.position.z = -0.02
        const handle = box(0.028, 0.045, 0.13, mat(0x2c2c30, 0)); handle.position.z = 0.06
        g.add(blade, edge, guardK, handle)
        g.rotation.z = 0.25
        g.rotation.y = 0.28
        break
      }
    }
    return g
  }

  setWeapon(id: WeaponId, animate = true) {
    if (id === this.current && animate) return
    this.current = id
    for (const [k, g] of this.models) g.visible = k === id
    if (animate) this.raise = 0
    this.reloadT = 0
    this.reloadDur = 0
  }

  onFire(kickScale: number) {
    if (this.current === 'knife') {
      this.slashT = 0.3
      return
    }
    this.kick = Math.min(1.6, this.kick + 0.5 + kickScale * 18)
    this.flashT = 0.05
    if (this.current !== 'awp') {
      ;(this.flash.material as THREE.MeshBasicMaterial).opacity = 0.9
    }
  }

  onReload(duration: number) {
    this.reloadDur = duration
    this.reloadT = 0.0001
  }

  update(dt: number, speed: number, onGround: boolean, scoped: boolean) {
    this.kick *= Math.exp(-13 * dt)
    this.raise = Math.min(1, this.raise + dt / 0.28)
    this.flashT -= dt
    if (this.flashT <= 0) (this.flash.material as THREE.MeshBasicMaterial).opacity = 0
    if (this.reloadDur > 0) {
      this.reloadT += dt
      if (this.reloadT >= this.reloadDur) { this.reloadT = 0; this.reloadDur = 0 }
    }

    this.group.visible = !scoped
    const speedRatio = onGround ? Math.min(1, speed / 4.7) : 0.2
    this.bobPhase += speed * dt * 1.9

    let px = 0.26, py = -0.24, pz = -0.5
    let rx = 0, ry = 0, rz = 0
    py += Math.abs(Math.sin(this.bobPhase)) * 0.012 * speedRatio - 0.006 * speedRatio
    px += Math.sin(this.bobPhase * 0.5) * 0.008 * speedRatio
    pz += this.kick * 0.05
    rx += this.kick * 0.06
    py -= (1 - this.raise) * 0.3
    rx -= (1 - this.raise) * 0.6
    if (this.reloadDur > 0) {
      const p = Math.sin(Math.PI * Math.min(1, this.reloadT / this.reloadDur))
      py -= p * 0.09
      rz += p * 0.5
      rx -= p * 0.25
    }
    if (this.slashT > 0) {
      this.slashT = Math.max(0, this.slashT - dt)
      const p = 1 - this.slashT / 0.3 // 0 → 1 over the swing
      const sweep = Math.sin(p * Math.PI)
      // diagonal slash: wind up right, cut across to lower-left
      px += 0.1 - p * 0.32
      py += 0.06 - p * 0.2
      pz -= sweep * 0.22
      ry += 0.5 - p * 1.1
      rz -= sweep * 0.9
      rx -= sweep * 0.35
    }
    this.group.position.set(px, py, pz)
    this.group.rotation.set(rx, ry, rz)
  }
}
