import * as THREE from 'three'
import { buildWeaponModel, mat } from './models.ts'
import type { WeaponId } from '../weapons/weapons.ts'
import { approach } from '../core/mathUtil.ts'

export interface ViewModelState {
  /** 水平速度（m/s），驱动走路晃动 */
  speed: number
  /** 换弹进度 0..1，不在换弹时为 -1 */
  reloadProgress: number
  scoped: boolean
  /** 本帧是否射击（触发后坐力动画） */
  fired: boolean
  /** 刀刺突进 */
  stabbing: boolean
}

/**
 * 第一人称手持模型：独立的场景与相机（避免被墙体裁剪），在主场景绘制之后用清除深度的方式叠加。
 * 包括双臂（袖口颜色随阵营区分）、当前武器、走路晃动、开火后坐力、换弹下沉、刀刺前冲。
 */
export class ViewModel {
  readonly scene = new THREE.Scene()
  readonly camera = new THREE.PerspectiveCamera(70, 1, 0.01, 10)
  private readonly root = new THREE.Group()
  private readonly gunHolder = new THREE.Group()
  private gun: THREE.Group | null = null
  private weaponId: WeaponId | null = null
  private kick = 0
  private stab = 0
  private clock = 0

  constructor() {
    this.scene.add(new THREE.HemisphereLight('#ffffff', '#6a6a6a', 1.6))
    const key = new THREE.DirectionalLight('#ffffff', 1.1)
    key.position.set(0.5, 1, 0.6)
    this.scene.add(key)
    this.scene.add(this.root)
    this.root.add(this.gunHolder)
    this.root.position.set(0.24, -0.23, -0.4)
    this.buildArms()
  }

  private buildArms(): void {
    // 右前臂 + 手掌（握把位置）；左手扶护木
    const forearm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.42), mat('#2f4f73'))
    forearm.position.set(0.04, -0.12, 0.2)
    forearm.rotation.x = 0.1
    const hand = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.1, 0.1), mat('#e0b48c'))
    hand.position.set(0.02, -0.07, -0.02)
    const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.38), mat('#2f4f73'))
    leftArm.position.set(-0.2, -0.16, 0.12)
    leftArm.rotation.set(0.1, 0.35, 0)
    const leftHand = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 0.09), mat('#e0b48c'))
    leftHand.position.set(-0.13, -0.1, -0.1)
    this.root.add(forearm, hand, leftArm, leftHand)
  }

  setWeapon(id: WeaponId): void {
    if (id === this.weaponId) return
    if (this.gun) this.gunHolder.remove(this.gun)
    this.gun = buildWeaponModel(id)
    this.gunHolder.add(this.gun)
    this.weaponId = id
  }

  update(dt: number, s: ViewModelState): void {
    this.clock += dt
    if (s.fired) this.kick = 1
    this.kick = approach(this.kick, 0, dt * 9)
    this.stab = approach(this.stab, s.stabbing ? 1 : 0, dt * 8)

    // 走路晃动：速度越快幅度越大
    const bobAmp = Math.min(1, s.speed / 5.2)
    const bobX = Math.sin(this.clock * 9) * 0.006 * bobAmp
    const bobY = Math.abs(Math.cos(this.clock * 9)) * 0.008 * bobAmp

    // 换弹：枪口下沉再抬起
    const reload = s.reloadProgress >= 0 ? Math.sin(s.reloadProgress * Math.PI) : 0
    this.root.position.set(0.24 + bobX, -0.23 - bobY - reload * 0.12, -0.4 + this.kick * 0.03 - this.stab * 0.18)
    this.root.rotation.set(this.kick * 0.1 + reload * 0.5, 0, 0)
    this.gunHolder.position.set(0, 0, 0)
    this.gunHolder.visible = !s.scoped
  }
}
