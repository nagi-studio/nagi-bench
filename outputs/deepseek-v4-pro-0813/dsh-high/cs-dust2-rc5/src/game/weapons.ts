import * as THREE from 'three'
import type { WeaponId } from './types'

export interface ViewModel {
  group: THREE.Group
  muzzle: THREE.Object3D
  flash: THREE.Mesh
}

const METAL = 0x2b2b2b
const METAL_LIGHT = 0x444444
const WOOD = 0x7a4a14
const POLYMER = 0x1c1c1c

function box(w: number, h: number, d: number, color: number): THREE.Mesh {
  const m = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.4 }),
  )
  m.castShadow = true
  return m
}

function makeFlash(muzzle: THREE.Object3D): THREE.Mesh {
  const flash = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 6, 6),
    new THREE.MeshBasicMaterial({
      color: 0xffe08a,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  )
  flash.visible = false
  muzzle.add(flash)
  return flash
}

/**
 * First-person view model for each weapon. Built from boxes, oriented so the
 * barrel points along -Z (the camera's forward direction).
 */
export function buildViewModel(id: WeaponId): ViewModel {
  const group = new THREE.Group()
  const muzzle = new THREE.Object3D()
  muzzle.position.set(0, 0, -0.62)
  group.add(muzzle)

  switch (id) {
    case 'ak47': {
      const body = box(0.06, 0.1, 0.34, METAL)
      body.position.set(0, 0, -0.12)
      const barrel = box(0.03, 0.03, 0.3, METAL_LIGHT)
      barrel.position.set(0, 0.02, -0.45)
      const gas = box(0.035, 0.035, 0.14, METAL_LIGHT)
      gas.position.set(0, 0.055, -0.3)
      const handguard = box(0.055, 0.07, 0.2, WOOD)
      handguard.position.set(0, -0.005, -0.32)
      const mag = box(0.05, 0.2, 0.09, 0x333333)
      mag.position.set(0, -0.14, -0.05)
      mag.rotation.x = 0.35
      const grip = box(0.05, 0.12, 0.07, POLYMER)
      grip.position.set(0, -0.12, 0.06)
      grip.rotation.x = -0.3
      const stock = box(0.05, 0.09, 0.16, WOOD)
      stock.position.set(0, -0.02, 0.18)
      const sight = box(0.015, 0.06, 0.02, METAL_LIGHT)
      sight.position.set(0, 0.07, -0.25)
      group.add(body, barrel, gas, handguard, mag, grip, stock, sight)
      muzzle.position.set(0, 0.02, -0.6)
      break
    }
    case 'm4a4': {
      const body = box(0.06, 0.1, 0.4, METAL)
      body.position.set(0, 0, -0.12)
      const barrel = box(0.03, 0.03, 0.26, METAL_LIGHT)
      barrel.position.set(0, 0.02, -0.46)
      const handguard = box(0.06, 0.07, 0.22, 0x242424)
      handguard.position.set(0, -0.005, -0.33)
      const mag = box(0.05, 0.16, 0.07, METAL_LIGHT)
      mag.position.set(0, -0.13, -0.03)
      const grip = box(0.05, 0.11, 0.07, POLYMER)
      grip.position.set(0, -0.11, 0.08)
      grip.rotation.x = -0.25
      const stock = box(0.05, 0.08, 0.16, 0x242424)
      stock.position.set(0, -0.01, 0.2)
      const carry = box(0.015, 0.05, 0.16, METAL)
      carry.position.set(0, 0.08, -0.08)
      group.add(body, barrel, handguard, mag, grip, stock, carry)
      muzzle.position.set(0, 0.02, -0.6)
      break
    }
    case 'awp': {
      const body = box(0.06, 0.11, 0.62, 0x1d4d1d)
      body.position.set(0, 0, -0.1)
      const barrel = box(0.035, 0.035, 0.5, METAL_LIGHT)
      barrel.position.set(0, 0.03, -0.62)
      const scope = box(0.07, 0.07, 0.24, METAL)
      scope.position.set(0, 0.12, -0.08)
      const scopeLens = box(0.075, 0.075, 0.02, 0x111111)
      scopeLens.position.set(0, 0.12, -0.2)
      const bolt = box(0.03, 0.03, 0.1, METAL_LIGHT)
      bolt.position.set(0.05, 0.02, -0.02)
      const mag = box(0.05, 0.1, 0.08, METAL)
      mag.position.set(0, -0.1, 0.05)
      const grip = box(0.05, 0.12, 0.07, POLYMER)
      grip.position.set(0, -0.12, 0.16)
      grip.rotation.x = -0.3
      const stock = box(0.05, 0.09, 0.16, 0x1d4d1d)
      stock.position.set(0, -0.02, 0.28)
      const bipod = box(0.04, 0.02, 0.12, METAL)
      bipod.position.set(0, -0.05, -0.45)
      group.add(body, barrel, scope, scopeLens, bolt, mag, grip, stock, bipod)
      muzzle.position.set(0, 0.03, -0.88)
      break
    }
    case 'glock': {
      const slide = box(0.05, 0.05, 0.16, 0x2a2a2a)
      slide.position.set(0, 0.03, -0.06)
      const frame = box(0.05, 0.08, 0.14, POLYMER)
      frame.position.set(0, -0.03, -0.04)
      const grip = box(0.05, 0.12, 0.06, POLYMER)
      grip.position.set(0, -0.12, 0.03)
      grip.rotation.x = 0.25
      const trigger = box(0.02, 0.03, 0.02, METAL_LIGHT)
      trigger.position.set(0, -0.04, 0.04)
      group.add(slide, frame, grip, trigger)
      muzzle.position.set(0, 0.03, -0.15)
      break
    }
    case 'usp': {
      const slide = box(0.05, 0.05, 0.14, 0x2a2a2a)
      slide.position.set(0, 0.03, -0.05)
      const frame = box(0.05, 0.08, 0.13, 0x111111)
      frame.position.set(0, -0.03, -0.03)
      const grip = box(0.05, 0.12, 0.06, 0x111111)
      grip.position.set(0, -0.12, 0.03)
      grip.rotation.x = 0.25
      const silencer = box(0.04, 0.04, 0.14, 0x1c1c1c)
      silencer.position.set(0, 0.03, -0.16)
      group.add(slide, frame, grip, silencer)
      muzzle.position.set(0, 0.03, -0.24)
      break
    }
    case 'deagle': {
      const slide = box(0.055, 0.06, 0.2, 0x3a3a3a)
      slide.position.set(0, 0.04, -0.08)
      const frame = box(0.05, 0.08, 0.16, 0x1a1a1a)
      frame.position.set(0, -0.03, -0.05)
      const grip = box(0.05, 0.13, 0.06, 0x1a1a1a)
      grip.position.set(0, -0.12, 0.04)
      grip.rotation.x = 0.3
      const barrel = box(0.04, 0.04, 0.1, 0x3a3a3a)
      barrel.position.set(0, 0.04, -0.2)
      group.add(slide, frame, grip, barrel)
      muzzle.position.set(0, 0.04, -0.26)
      break
    }
    case 'knife': {
      const handle = box(0.035, 0.035, 0.12, 0x4a2c12)
      handle.position.set(0, 0, 0.06)
      const guard = box(0.08, 0.02, 0.02, METAL_LIGHT)
      guard.position.set(0, 0, -0.01)
      const blade = box(0.02, 0.06, 0.22, METAL_LIGHT)
      blade.position.set(0, 0.01, -0.18)
      group.add(handle, guard, blade)
      muzzle.position.set(0, 0, -0.3)
      break
    }
  }

  const flash = makeFlash(muzzle)
  group.traverse((o) => (o.userData.viewmodel = true))
  return { group, muzzle, flash }
}
