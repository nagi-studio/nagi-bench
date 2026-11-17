import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { type Team, type WeaponId } from './arsenal'
import { clamp } from './level'

export const UNIT_BOX = new THREE.BoxGeometry(1, 1, 1)
const ROUND = new THREE.CylinderGeometry(1, 1, 1, 10)
const ROUND_FLAT = new THREE.CylinderGeometry(1, 1, 1, 6)
const HELMET = new THREE.SphereGeometry(1, 12, 8)
const DIAMOND = new THREE.IcosahedronGeometry(1, 0)

const materials = new Map<string, THREE.MeshStandardMaterial>()
export function paint(color: string, roughness = 0.83, metalness = 0) {
  const key = color + '/' + roughness + '/' + metalness
  let material = materials.get(key)
  if (!material) {
    material = new THREE.MeshStandardMaterial({ color, roughness, metalness })
    materials.set(key, material)
  }
  return material
}

export function primitive(
  group: THREE.Object3D, geometry: THREE.BufferGeometry, material: THREE.Material,
  x: number, y: number, z: number, w: number, h: number, d: number,
) {
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(x, y, z)
  mesh.scale.set(w, h, d)
  group.add(mesh)
  return mesh
}

const box = (
  group: THREE.Object3D, material: THREE.Material,
  x: number, y: number, z: number, w: number, h: number, d: number,
) => primitive(group, UNIT_BOX, material, x, y, z, w, h, d)

function link(group: THREE.Object3D, material: THREE.Material, from: THREE.Vector3, to: THREE.Vector3, width: number, depth = width, round = false) {
  const delta = to.clone().sub(from)
  const center = from.clone().add(to).multiplyScalar(0.5)
  const mesh = primitive(group, round ? ROUND_FLAT : UNIT_BOX, material, center.x, center.y, center.z, width, delta.length(), depth)
  mesh.quaternion.setFromUnitVectors(UP, delta.normalize())
  return mesh
}

function compact(group: THREE.Group) {
  const bins = new Map<THREE.Material, THREE.Mesh[]>()
  for (const part of group.children) {
    if (!(part instanceof THREE.Mesh) || Array.isArray(part.material)) continue
    if (!bins.has(part.material)) bins.set(part.material, [])
    bins.get(part.material)!.push(part)
  }
  for (const [material, parts] of bins) {
    if (parts.length < 2) continue
    const geometry = parts.map(part => {
      part.updateMatrix()
      const copy = part.geometry.index ? part.geometry.toNonIndexed() : part.geometry.clone()
      return copy.applyMatrix4(part.matrix)
    })
    const merged = mergeGeometries(geometry)
    geometry.forEach(copy => copy.dispose())
    if (!merged) continue
    const mesh = new THREE.Mesh(merged, material)
    mesh.castShadow = parts.some(part => part.castShadow)
    mesh.receiveShadow = parts.some(part => part.receiveShadow)
    group.remove(...parts)
    group.add(mesh)
  }
}

const UP = new THREE.Vector3(0, 1, 0)
const GUNMETAL = paint('#424b49', 0.46, 0.27)
const DARK_METAL = paint('#262d2b', 0.49, 0.21)
const STEEL = paint('#727b79', 0.35, 0.4)
const DUST_STEEL = paint('#b0a28a', 0.44, 0.34)
const POLYMER = paint('#2e3835')
const WOOD = paint('#865530', 0.6)
const WOOD_DARK = paint('#5c3520', 0.77)
const OLIVE = paint('#596148', 0.67)
const GLASS = paint('#436973', 0.22, 0.47)
const GLOVES = paint('#252724')

function tubeZ(root: THREE.Object3D, material: THREE.Material, x: number, y: number, z: number, radius: number, length: number) {
  const tube = primitive(root, ROUND, material, x, y, z, radius, length, radius)
  tube.rotation.x = Math.PI / 2
  return tube
}

function polygon(root: THREE.Object3D, material: THREE.Material, contour: number[][], thickness: number, x = 0) {
  const shape = new THREE.Shape()
  contour.forEach(([z, y], i) => i ? shape.lineTo(-z, y) : shape.moveTo(-z, y))
  shape.closePath()
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false })
  geometry.translate(0, 0, -thickness / 2)
  geometry.rotateY(Math.PI / 2)
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.x = x
  root.add(mesh)
  return mesh
}

function grip(root: THREE.Object3D, z: number, material: THREE.Material) {
  const base = box(root, material, 0, -0.125, z, 0.061, 0.22, 0.09)
  base.rotation.x = -0.24
  box(root, DARK_METAL, 0, -0.072, z - 0.062, 0.045, 0.088, 0.019)
  box(root, GUNMETAL, 0, -0.095, z - 0.10, 0.044, 0.02, 0.135)
}

function rifle(root: THREE.Group, id: 'ak' | 'm4') {
  const ak = id === 'ak'
  const furniture = ak ? WOOD : POLYMER
  box(root, GUNMETAL, 0, 0.006, -0.068, 0.086, 0.125, 0.325)
  box(root, DARK_METAL, 0, 0.076, -0.061, 0.083, 0.024, 0.31)
  box(root, GUNMETAL, 0, 0.049, -0.278, 0.074, 0.071, 0.15)
  box(root, furniture, 0, 0.02, -0.36, 0.097, 0.10, 0.232)
  tubeZ(root, GUNMETAL, 0, 0.052, -0.536, 0.018, 0.236)
  tubeZ(root, DARK_METAL, 0, 0.052, -0.673, 0.03, 0.08)
  box(root, DARK_METAL, 0, 0.11, -0.574, 0.04, 0.10, 0.04)
  box(root, STEEL, 0.008, 0.159, -0.574, 0.01, 0.021, 0.025)
  grip(root, 0.04, ak ? WOOD_DARK : POLYMER)

  if (ak) {
    polygon(root, WOOD, [[0.09, 0.063], [0.38, 0.044], [0.43, 0.018], [0.413, -0.115], [0.363, -0.098], [0.15, -0.045], [0.09, -0.042]], 0.077)
    box(root, DARK_METAL, 0, -0.035, 0.424, 0.08, 0.129, 0.025)
    polygon(root, DARK_METAL, [[-0.226, -0.035], [-0.303, -0.293], [-0.245, -0.33], [-0.179, -0.244], [-0.126, -0.072]], 0.069)
    polygon(root, GUNMETAL, [[-0.218, -0.076], [-0.277, -0.282], [-0.252, -0.304], [-0.197, -0.246], [-0.151, -0.076]], 0.071)
    box(root, STEEL, -0.045, 0.045, -0.116, 0.01, 0.041, 0.14)
    box(root, DARK_METAL, 0, 0.107, 0.017, 0.050, 0.049, 0.056)
    for (let i = 0; i < 4; i++) {
      box(root, WOOD_DARK, -0.049, 0.028, -0.29 - i * 0.046, 0.002, 0.035, 0.018)
      box(root, WOOD_DARK, 0.049, 0.028, -0.29 - i * 0.046, 0.002, 0.035, 0.018)
    }
  } else {
    tubeZ(root, STEEL, 0, 0.036, 0.215, 0.028, 0.24)
    polygon(root, POLYMER, [[0.175, 0.062], [0.425, 0.066], [0.426, -0.109], [0.35, -0.103], [0.27, -0.022], [0.175, -0.027]], 0.078)
    box(root, DARK_METAL, 0, -0.025, 0.436, 0.087, 0.178, 0.026)
    polygon(root, GUNMETAL, [[-0.233, -0.042], [-0.265, -0.279], [-0.172, -0.302], [-0.128, -0.073]], 0.067)
    for (let i = 0; i < 12; i++) box(root, STEEL, 0, 0.09, -0.411 + i * 0.042, 0.065, 0.012, 0.014)
    for (let i = 0; i < 6; i++) {
      box(root, GUNMETAL, -0.05, 0.024, -0.254 - i * 0.036, 0.006, 0.034, 0.022)
      box(root, GUNMETAL, 0.05, 0.024, -0.254 - i * 0.036, 0.006, 0.034, 0.022)
    }
    box(root, DARK_METAL, 0, 0.123, 0.025, 0.07, 0.066, 0.065)
    box(root, STEEL, -0.044, 0.054, -0.09, 0.009, 0.037, 0.14)
  }
}

function sniper(root: THREE.Group) {
  box(root, OLIVE, 0, -0.027, -0.175, 0.105, 0.13, 0.63)
  box(root, GUNMETAL, 0, 0.063, -0.105, 0.087, 0.068, 0.386)
  polygon(root, OLIVE, [[0.06, 0.031], [0.49, 0.031], [0.51, -0.16], [0.39, -0.16], [0.25, -0.076], [0.14, -0.17], [0.055, -0.14]], 0.099)
  box(root, POLYMER, 0, -0.058, 0.515, 0.106, 0.21, 0.029)
  box(root, DARK_METAL, 0, -0.135, -0.19, 0.072, 0.12, 0.13)
  grip(root, 0.06, OLIVE)
  tubeZ(root, GUNMETAL, 0, 0.062, -0.645, 0.026, 0.42)
  tubeZ(root, DARK_METAL, 0, 0.062, -0.874, 0.039, 0.084)
  box(root, DARK_METAL, 0, 0.124, -0.20, 0.068, 0.09, 0.11)
  box(root, DARK_METAL, 0, 0.124, 0.016, 0.067, 0.085, 0.067)
  tubeZ(root, DARK_METAL, 0, 0.199, -0.133, 0.036, 0.385)
  tubeZ(root, GUNMETAL, 0, 0.199, 0.071, 0.052, 0.102)
  tubeZ(root, DARK_METAL, 0, 0.199, -0.356, 0.062, 0.139)
  tubeZ(root, GLASS, 0, 0.199, 0.122, 0.045, 0.004)
  tubeZ(root, GLASS, 0, 0.199, -0.428, 0.052, 0.004)
  primitive(root, ROUND, GUNMETAL, 0, 0.246, -0.135, 0.027, 0.041, 0.027)
  box(root, STEEL, 0.05, 0.072, 0.002, 0.031, 0.028, 0.09).rotation.z = -0.25
}

function pistol(root: THREE.Group, id: 'glock' | 'usp' | 'deagle') {
  const heavy = id === 'deagle'
  const long = heavy ? 0.322 : 0.244
  const width = heavy ? 0.068 : 0.055
  const steel = heavy ? DUST_STEEL : id === 'usp' ? GUNMETAL : DARK_METAL
  box(root, steel, 0, 0.046, -0.055, width, heavy ? 0.083 : 0.062, long)
  box(root, POLYMER, 0, -0.005, -0.042, width * 0.95, 0.039, long * 0.9)
  polygon(root, POLYMER, [[0.026, -0.015], [0.066, -0.155], [0.045, -0.181], [-0.027, -0.18], [-0.056, -0.019]], width * 0.89)
  box(root, DARK_METAL, 0, -0.177, 0.018, width, 0.024, 0.103)
  box(root, POLYMER, 0, -0.052, -0.082, width * 0.68, 0.015, 0.097)
  box(root, POLYMER, 0, -0.032, -0.129, width * 0.68, 0.052, 0.016)
  box(root, GUNMETAL, 0, 0.09, 0.041, width, 0.016, 0.026)
  box(root, GUNMETAL, 0, 0.09, -long / 2 - 0.041, 0.016, 0.012, 0.024)
  if (id === 'usp') tubeZ(root, DARK_METAL, 0, 0.047, -0.256, 0.026, 0.168)
  else tubeZ(root, DARK_METAL, 0, 0.048, -long / 2 - 0.058, 0.018, 0.012)
  for (let i = 0; i < 6; i++) {
    box(root, GUNMETAL, width / 2 + 0.001, 0.042, 0.064 - i * 0.011, 0.003, 0.047, 0.004)
    box(root, GUNMETAL, -width / 2 - 0.001, 0.042, 0.064 - i * 0.011, 0.003, 0.047, 0.004)
  }
}

const weaponModels = new Map<WeaponId, THREE.Group>()

export function makeWeapon(id: WeaponId) {
  const existing = weaponModels.get(id)
  if (existing) return existing.clone(true)
  const root = new THREE.Group()
  if (id === 'ak' || id === 'm4') rifle(root, id)
  else if (id === 'awp') sniper(root)
  else if (id === 'knife') {
    box(root, POLYMER, 0, 0, 0.035, 0.058, 0.069, 0.233)
    box(root, STEEL, 0, 0, -0.088, 0.096, 0.093, 0.022)
    polygon(root, STEEL, [[-0.09, -0.039], [-0.275, -0.035], [-0.425, 0.013], [-0.33, 0.054], [-0.09, 0.051]], 0.015)
    polygon(root, DUST_STEEL, [[-0.095, -0.022], [-0.265, -0.018], [-0.413, 0.014], [-0.274, -0.034], [-0.095, -0.037]], 0.016)
    for (let i = 0; i < 7; i++) box(root, GUNMETAL, 0, 0, -0.059 + i * 0.027, 0.064, 0.074, 0.008)
  } else pistol(root, id)
  compact(root)
  weaponModels.set(id, root)
  return root.clone(true)
}

export const MUZZLES: Record<WeaponId, number> = { ak: -0.707, m4: -0.707, awp: -0.916, glock: -0.188, usp: -0.34, deagle: -0.223, knife: -0.425 }

export function makeC4() {
  const model = new THREE.Group()
  box(model, paint('#3c412e'), 0, 0.09, 0, 0.39, 0.18, 0.28)
  box(model, paint('#5e6041'), 0, 0.155, 0, 0.405, 0.085, 0.29)
  for (const x of [-0.152, 0.152]) box(model, POLYMER, x, 0.107, 0, 0.048, 0.225, 0.305)
  box(model, DARK_METAL, 0, 0.199, -0.025, 0.21, 0.032, 0.188)
  const indicator = new THREE.MeshStandardMaterial({ color: '#e66737', emissive: '#ff421b', emissiveIntensity: 1.5 })
  box(model, indicator, -0.024, 0.221, -0.068, 0.114, 0.012, 0.032)
  for (let i = 0; i < 8; i++) box(model, STEEL, (i % 4) * 0.033 - 0.052, 0.22, Math.floor(i / 4) * 0.032 + 0.009, 0.018, 0.012, 0.017)
  const wires = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.175, 0.11, 0.062), new THREE.Vector3(-0.236, 0.15, 0.105),
    new THREE.Vector3(-0.19, 0.22, 0.148), new THREE.Vector3(-0.039, 0.22, 0.074),
  ])
  model.add(new THREE.Mesh(new THREE.TubeGeometry(wires, 9, 0.012, 5, false), paint('#a3452c')))
  return { model, indicator }
}

function glovedHand(root: THREE.Group, x: number, y: number, z: number, roll: number) {
  const hand = new THREE.Group()
  hand.position.set(x, y, z)
  hand.rotation.set(-0.14, 0, roll)
  box(hand, GLOVES, 0, 0, 0, 0.087, 0.081, 0.105)
  box(hand, paint('#4e5144'), 0, 0.043, -0.013, 0.078, 0.012, 0.059)
  for (let i = 0; i < 4; i++) {
    box(hand, GLOVES, -0.03 + i * 0.02, 0.016, -0.06, 0.017, 0.067 - i * 0.005, 0.033)
  }
  const thumb = box(hand, GLOVES, -0.049, 0.008, -0.005, 0.033, 0.038, 0.061)
  thumb.rotation.y = -0.4
  root.add(hand)
}

export function viewRig(id: WeaponId | 'c4', team: Team) {
  const rig = new THREE.Group()
  const sleeve = team === 'CT' ? paint('#3f5354') : paint('#a18b64')
  const cuff = team === 'CT' ? paint('#212c2a') : paint('#5b553c')
  const isRifle = id === 'ak' || id === 'm4' || id === 'awp'
  const held = id === 'c4' ? makeC4().model : makeWeapon(id)
  if (id === 'c4') held.rotation.x = 0.43
  if (id === 'knife') held.rotation.y = -0.30
  rig.add(held)

  const fingers = new THREE.Vector3(0.039, isRifle ? -0.125 : -0.096, id === 'c4' ? 0.12 : 0.034)
  const wrist = new THREE.Vector3(fingers.x + 0.006, fingers.y - 0.035, fingers.z + 0.042)
  const elbow = new THREE.Vector3(0.16, -0.37, 0.395)
  link(rig, sleeve, elbow, wrist, 0.079, 0.068, true)
  link(rig, cuff, wrist.clone().lerp(elbow, 0.18), wrist, 0.077, 0.066, true)
  glovedHand(rig, fingers.x, fingers.y, fingers.z, -0.25)

  const support = id === 'c4' ? new THREE.Vector3(-0.16, 0.015, 0.048)
    : isRifle ? new THREE.Vector3(-0.042, -0.061, id === 'awp' ? -0.32 : -0.265)
    : new THREE.Vector3(-0.046, -0.128, id === 'knife' ? 0.23 : 0.009)
  const left = new THREE.Vector3(-0.47, -0.405, 0.238)
  link(rig, sleeve, left, support, 0.081, 0.071, true)
  link(rig, cuff, support.clone().lerp(left, 0.16), support, 0.079, 0.07, true)
  glovedHand(rig, support.x, support.y, support.z, 0.7)
  return rig
}

export interface Soldier {
  root: THREE.Group
  stance: THREE.Group
  upper: THREE.Group
  head: THREE.Group
  legs: THREE.Group[]
  knees: THREE.Group[]
  gun: THREE.Group
  weapon: WeaponId | null
}

export function makeSoldier(team: Team, variation: number): Soldier {
  const ct = team === 'CT'
  const root = new THREE.Group()
  const stance = new THREE.Group()
  root.add(stance)
  const uniform = paint(ct ? ['#53686e', '#495e65', '#526266'][variation % 3] : ['#b29b73', '#a78960', '#9b8560'][variation % 3])
  const thighs = paint(ct ? '#46565c' : '#6f6e50')
  const armor = paint(ct ? '#29383b' : '#674b39')
  const webbing = paint(ct ? '#52616a' : '#ac7950')
  const face = paint(['#b48163', '#94604c', '#c38b67', '#875c48', '#c9a182'][variation % 5])
  const scarf = paint(ct ? '#233134' : ['#9d4b39', '#a76c48', '#a44236'][variation % 3])
  const soles = paint('#242624')
  const badge = paint(ct ? '#6cb9d0' : '#d6a35c')
  const skull = primitive(stance, ROUND_FLAT, uniform, 0, 1.52, 0, 0.089, 0.15, 0.084)
  skull.rotation.y = 0.32
  box(stance, thighs, 0, 0.907, 0.012, 0.37, 0.17, 0.286)
  box(stance, uniform, 0, 1.221, 0.0, 0.45, 0.505, 0.279)
  box(stance, armor, 0, 1.249, -0.059, 0.445, 0.391, 0.225)
  box(stance, armor, 0, 1.284, 0.151, 0.365, 0.324, 0.12)
  box(stance, webbing, 0, 1.05, -0.032, 0.415, 0.053, 0.296)
  for (const x of [-0.143, -0.049, 0.049, 0.143]) {
    box(stance, webbing, x, 1.174, -0.184, 0.08, 0.123, 0.058)
    box(stance, armor, x, 1.217, -0.193, 0.084, 0.034, 0.055)
  }
  for (const x of [-0.169, 0.169]) box(stance, webbing, x, 1.422, -0.013, 0.06, 0.11, 0.284)
  box(stance, badge, 0.103, 1.345, -0.175, 0.096, 0.041, 0.013)
  box(stance, webbing, -0.23, 0.988, 0.058, 0.095, 0.122, 0.102)

  const head = new THREE.Group()
  head.position.y = 1.54
  stance.add(head)
  primitive(head, HELMET, face, 0, 0.118, -0.003, 0.119, 0.149, 0.113)
  if (ct) {
    primitive(head, HELMET, armor, 0, 0.182, 0.015, 0.151, 0.12, 0.145)
    box(head, armor, 0, 0.152, -0.028, 0.293, 0.054, 0.238)
    box(head, GLASS, 0, 0.121, -0.105, 0.226, 0.072, 0.056)
    box(head, scarf, 0, 0.055, -0.075, 0.201, 0.078, 0.097)
    for (const x of [-0.14, 0.14]) box(head, webbing, x, 0.121, 0.014, 0.057, 0.111, 0.095)
    box(head, GUNMETAL, -0.14, 0.204, 0.068, 0.025, 0.16, 0.023)
  } else {
    primitive(head, HELMET, scarf, 0, 0.18, 0.025, 0.139, 0.104, 0.128)
    box(head, scarf, 0, 0.041, -0.029, 0.255, 0.103, 0.183)
    box(head, scarf, -0.082, 0.002, 0.102, 0.096, 0.141, 0.055).rotation.z = 0.4
    box(head, GUNMETAL, 0, 0.129, -0.103, 0.19, 0.039, 0.018)
    box(head, webbing, 0, 0.194, -0.101, 0.24, 0.035, 0.045)
  }

  const upper = new THREE.Group()
  upper.position.y = 1.385
  stance.add(upper)
  const gun = new THREE.Group()
  gun.position.set(0.09, -0.13, -0.30)
  gun.scale.setScalar(0.67)
  upper.add(gun)
  for (const side of [-1, 1]) {
    const shoulder = new THREE.Vector3(side * 0.246, -0.013, 0.031)
    const elbow = new THREE.Vector3(side * 0.304, -0.191 - (side === -1 ? 0.028 : 0), -0.14)
    const wrist = new THREE.Vector3(side === 1 ? 0.136 : 0.047, -0.184, side === 1 ? -0.348 : -0.49)
    link(upper, uniform, shoulder, elbow, 0.088, 0.091, true)
    link(upper, uniform, elbow, wrist, 0.076, 0.075, true)
    primitive(upper, HELMET, armor, shoulder.x, shoulder.y, shoulder.z, 0.114, 0.099, 0.098)
    box(upper, badge, shoulder.x + side * 0.077, -0.035, 0.021, 0.036, 0.057, 0.095)
    box(upper, GLOVES, wrist.x, wrist.y, wrist.z, 0.102, 0.087, 0.12)
  }

  const legs: THREE.Group[] = []
  const knees: THREE.Group[] = []
  for (const side of [-1, 1]) {
    const hip = new THREE.Group()
    hip.position.set(side * 0.125, 0.917, 0.017)
    const knee = new THREE.Group()
    knee.position.y = -0.426
    hip.add(knee)
    stance.add(hip)
    primitive(hip, ROUND_FLAT, thighs, 0, -0.207, 0.007, 0.118, 0.429, 0.133)
    box(hip, webbing, side * 0.063, -0.145, 0.012, 0.105, 0.151, 0.139)
    primitive(knee, ROUND_FLAT, uniform, 0, -0.167, 0.015, 0.096, 0.345, 0.103)
    box(knee, armor, 0, -0.027, -0.083, 0.139, 0.148, 0.064)
    box(knee, GLOVES, 0, -0.344, -0.027, 0.171, 0.202, 0.245)
    box(knee, soles, 0, -0.427, -0.038, 0.178, 0.037, 0.272)
    legs.push(hip)
    knees.push(knee)
  }

  // The larger planes give the articulated figure a readable silhouette at distance.
  stance.traverse(object => {
    if (object instanceof THREE.Mesh) {
      const size = object.scale.length()
      object.castShadow = size > 0.13
      object.receiveShadow = true
    }
  })
  for (const part of [stance, upper, head, ...legs, ...knees]) compact(part)
  return { root, stance, upper, head, legs, knees, gun, weapon: null }
}

export function poseSoldier(model: Soldier, time: number, speed: number, pitch: number, id: number, deathAge: number) {
  const moved = clamp(speed / 4.4, 0, 1)
  const stride = time * (speed > 2.5 ? 13 : 9) + id * 0.65
  const fall = deathAge < 0 ? 0 : Math.sin(clamp(deathAge / 0.31, 0, 1) * Math.PI / 2)
  model.stance.rotation.z = fall * (id % 2 ? -1.47 : 1.47)
  model.stance.position.y = fall * 0.17 + Math.abs(Math.sin(stride)) * moved * 0.025
  model.upper.rotation.x = clamp(pitch, -0.62, 0.64)
  model.head.rotation.x = clamp(pitch * 0.6, -0.45, 0.52)
  for (const [i, leg] of model.legs.entries()) {
    const swing = Math.sin(stride + i * Math.PI)
    leg.rotation.x = swing * moved * 0.57 * (1 - fall)
    model.knees[i].rotation.x = Math.max(0, -swing) * moved * 0.53 + fall * 0.16
  }
}

export function armSoldier(model: Soldier, id: WeaponId) {
  if (model.weapon === id) return
  model.gun.clear()
  const weapon = makeWeapon(id)
  model.gun.add(weapon)
  model.weapon = id
}

export function makeFlash() {
  const root = new THREE.Group()
  const core = new THREE.MeshBasicMaterial({ color: '#fff3c1', toneMapped: false })
  const flare = new THREE.MeshBasicMaterial({ color: '#ffc16a', toneMapped: false })
  primitive(root, DIAMOND, core, 0, 0, -0.076, 0.046, 0.043, 0.13)
  primitive(root, DIAMOND, flare, 0, 0, -0.06, 0.076, 0.017, 0.16)
  primitive(root, DIAMOND, flare, 0, 0, -0.06, 0.017, 0.073, 0.16)
  return root
}
