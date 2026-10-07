import * as THREE from 'three'
import type { WeaponId } from '../weapons/weapons.ts'
import type { Team } from '../types.ts'

// 全部模型由代码生成：身体部件为立方体（肢体、躯干、头部），武器部件允许使用圆柱作枪管。
// 角色local坐标：脚底为 y=0，面朝 -Z；与命中判定 HIT_BOXES 的几何保持一致。

const matCache = new Map<string, THREE.MeshStandardMaterial>()

export function mat(color: string, roughness = 0.8, metalness = 0.05): THREE.MeshStandardMaterial {
  const key = `${color}|${roughness}|${metalness}`
  let m = matCache.get(key)
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color, roughness, metalness })
    matCache.set(key, m)
  }
  return m
}

function box(parent: THREE.Object3D, w: number, h: number, d: number, color: string, x: number, y: number, z: number): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color))
  m.position.set(x, y, z)
  m.castShadow = true
  m.receiveShadow = true
  parent.add(m)
  return m
}

/** 沿 Z 轴（枪口方向）的圆柱 */
function barrel(parent: THREE.Object3D, radius: number, length: number, color: string, x: number, y: number, z: number): THREE.Mesh {
  const geo = new THREE.CylinderGeometry(radius, radius, length, 10)
  geo.rotateX(Math.PI / 2)
  const m = new THREE.Mesh(geo, mat(color, 0.4, 0.5))
  m.position.set(x, y, z)
  m.castShadow = true
  parent.add(m)
  return m
}

/** 武器模型：原点在握把附近，枪口朝 -Z */
export function buildWeaponModel(id: WeaponId): THREE.Group {
  const g = new THREE.Group()
  switch (id) {
    case 'ak47':
      box(g, 0.06, 0.1, 0.34, '#2a2a2a', 0, 0, -0.1)
      box(g, 0.05, 0.09, 0.2, '#8a5a2b', 0, -0.005, 0.15)
      box(g, 0.06, 0.07, 0.16, '#8a5a2b', 0, -0.01, -0.3)
      barrel(g, 0.011, 0.3, '#151515', 0, 0.01, -0.5)
      box(g, 0.05, 0.2, 0.07, '#1e1e1e', 0, -0.14, -0.1)
      box(g, 0.02, 0.03, 0.02, '#111', 0, 0.07, -0.56)
      break
    case 'm4a4':
      box(g, 0.05, 0.1, 0.36, '#3b3b3b', 0, 0, -0.1)
      box(g, 0.04, 0.08, 0.18, '#1a1a1a', 0, -0.005, 0.16)
      box(g, 0.055, 0.07, 0.2, '#2e2e2e', 0, -0.01, -0.3)
      barrel(g, 0.009, 0.32, '#111', 0, 0.01, -0.5)
      box(g, 0.04, 0.18, 0.06, '#202020', 0, -0.13, -0.12)
      box(g, 0.04, 0.05, 0.1, '#111', 0, 0.08, -0.12)
      break
    case 'awp':
      box(g, 0.06, 0.1, 0.42, '#2b3d2a', 0, 0, -0.1)
      box(g, 0.05, 0.12, 0.26, '#1f2f1f', 0, 0.0, 0.2)
      barrel(g, 0.012, 0.5, '#101010', 0, 0.01, -0.6)
      barrel(g, 0.03, 0.3, '#151515', 0, 0.1, -0.1)
      box(g, 0.05, 0.1, 0.07, '#1a1a1a', 0, -0.11, -0.1)
      break
    case 'glock':
      box(g, 0.04, 0.06, 0.2, '#7a7a7a', 0, 0.02, -0.08)
      box(g, 0.04, 0.12, 0.06, '#333', 0, -0.06, -0.02)
      break
    case 'usp':
      box(g, 0.045, 0.07, 0.22, '#444', 0, 0.02, -0.08)
      box(g, 0.045, 0.13, 0.07, '#222', 0, -0.07, -0.02)
      barrel(g, 0.018, 0.14, '#1a1a1a', 0, 0.02, -0.27)
      break
    case 'deagle':
      box(g, 0.06, 0.09, 0.24, '#c0c0c0', 0, 0.02, -0.08)
      box(g, 0.05, 0.15, 0.08, '#555', 0, -0.08, -0.02)
      break
    case 'knife':
      box(g, 0.03, 0.04, 0.12, '#222', 0, 0, 0.02)
      box(g, 0.05, 0.02, 0.02, '#888', 0, 0, -0.05)
      box(g, 0.02, 0.05, 0.22, '#dddddd', 0, 0.0, -0.17)
      break
  }
  return g
}

export interface Humanoid {
  root: THREE.Group
  legL: THREE.Group
  legR: THREE.Group
  armL: THREE.Group
  armR: THREE.Group
  gunMount: THREE.Group
}

/**
 * 程序化人形角色：独立的头、躯干、双臂、双腿（各由多个立方体拼接）。
 * T 阵营：黑色面罩 + 橙色头带、棕色上衣；CT 阵营：蓝色头盔 + 护目镜、深蓝上衣。
 */
export function buildHumanoid(team: Team): Humanoid {
  const isT = team === 'T'
  const shirt = isT ? '#8c4a2c' : '#2f4f73'
  const pants = isT ? '#6e5c3c' : '#1d2735'
  const skin = '#e0b48c'
  const root = new THREE.Group()

  // 腿：髋部为旋转点，大腿 / 小腿 / 靴子
  const makeLeg = (x: number): THREE.Group => {
    const leg = new THREE.Group()
    leg.position.set(x, 0.9, 0)
    box(leg, 0.2, 0.44, 0.2, pants, 0, -0.22, 0)
    box(leg, 0.18, 0.4, 0.18, pants, 0, -0.64, 0)
    box(leg, 0.2, 0.1, 0.26, '#1a1a1a', 0, -0.86, -0.03)
    root.add(leg)
    return leg
  }
  const legL = makeLeg(-0.11)
  const legR = makeLeg(0.11)

  // 腰（胃部命中区）与躯干（胸部命中区）
  box(root, 0.42, 0.2, 0.26, pants, 0, 0.99, 0)
  box(root, 0.5, 0.36, 0.3, shirt, 0, 1.27, 0)
  if (isT) box(root, 0.5, 0.06, 0.3, '#3a2a1a', 0, 1.1, 0)

  // 头部
  box(root, 0.26, 0.3, 0.26, skin, 0, 1.62, 0)
  if (isT) {
    box(root, 0.28, 0.3, 0.28, '#1c1c1c', 0, 1.62, 0)
    box(root, 0.28, 0.04, 0.28, '#e0802a', 0, 1.73, 0)
  } else {
    box(root, 0.31, 0.1, 0.31, '#2c4a6e', 0, 1.77, 0)
    box(root, 0.24, 0.05, 0.03, '#7fd3ff', 0, 1.65, -0.14)
  }

  // 手臂：肩部为旋转点，上臂 / 前臂 / 手；默认为持枪前伸姿势
  const makeArm = (x: number, pitch: number): THREE.Group => {
    const arm = new THREE.Group()
    arm.position.set(x, 1.38, 0)
    box(arm, 0.15, 0.34, 0.15, shirt, 0, -0.17, 0)
    box(arm, 0.13, 0.32, 0.13, skin, 0, -0.5, 0)
    box(arm, 0.12, 0.1, 0.12, skin, 0, -0.68, 0)
    arm.rotation.x = pitch
    root.add(arm)
    return arm
  }
  const armL = makeArm(-0.33, 1.3)
  const armR = makeArm(0.33, 1.45)

  // 武器挂点：位于双手之间（由渲染器按当前武器填充）
  const gunMount = new THREE.Group()
  gunMount.position.set(0.02, 1.3, -0.42)
  root.add(gunMount)

  return { root, legL, legR, armL, armR, gunMount }
}

export function buildBomb(): { group: THREE.Group; led: THREE.Mesh } {
  const group = new THREE.Group()
  box(group, 0.3, 0.12, 0.22, '#3d3d3d', 0, 0.06, 0)
  box(group, 0.26, 0.04, 0.18, '#777', 0, 0.13, 0)
  const led = box(group, 0.06, 0.03, 0.04, '#ff2a2a', 0, 0.16, -0.06)
  ;(led.material as THREE.MeshStandardMaterial).emissive = new THREE.Color('#ff1010')
  ;(led.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.2
  return { group, led }
}
