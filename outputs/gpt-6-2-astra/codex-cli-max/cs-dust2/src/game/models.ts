import * as T from 'three'
import { Batch, paint, texture, V } from './geometry'
import type { Team, WeaponId } from './types'

const dark = paint('#252c2e', 0.46, 0.58),
  steel = paint('#495052', 0.43, 0.65),
  edge = paint('#707676', 0.36, 0.65),
  black = paint('#151d20', 0.64, 0.2)
const wood = paint('#996238', 0.55),
  woodDark = paint('#694128', 0.63),
  poly = paint('#343b39', 0.84),
  olive = paint('#526047', 0.87)
const glove = paint('#343d36'),
  leather = paint('#202927', 0.74),
  pad = paint('#4b5141'),
  skin = paint('#b88661'),
  sleeve = paint('#747967')
const cloth = paint('#a48e6b'),
  sand = paint('#c5b596'),
  jacket = paint('#3c5d65'),
  navy = paint('#283c48'),
  vest = paint('#37413b')
const glass = paint('#24363b', 0.21, 0.55),
  strap = paint('#695d46'),
  patch = paint('#d68a41'),
  bluePatch = paint('#67c6d1')
let detailed = false
function detail() {
  if (detailed) return
  detailed = true
  wood.map = texture('wood')
  woodDark.map = wood.map
  for (const m of [glove, pad, cloth, sleeve, jacket, navy, vest, olive]) m.map = texture('fabric')
}
function profile(b: Batch, points: number[][], width: number, mat: T.Material, x = 0) {
  const s = new T.Shape()
  points.forEach(([z, y], i) => (i ? s.lineTo(-z, y) : s.moveTo(-z, y)))
  s.closePath()
  const g = new T.ExtrudeGeometry(s, {
    depth: width,
    bevelEnabled: true,
    bevelSize: 0.003,
    bevelThickness: 0.003,
    bevelSegments: 1,
  })
  g.translate(0, 0, -width / 2)
  g.rotateY(Math.PI / 2)
  b.add(g, mat, x)
}
function ring(b: Batch, x: number, y: number, z: number, r: number, t: number, mat: T.Material) {
  b.add(new T.TorusGeometry(r, t, 5, 12), mat, x, y, z)
}
const weapons = new Map<WeaponId, T.Group>()
export function weaponModel(id: WeaponId) {
  detail()
  const cache = weapons.get(id)
  if (cache) return cache.clone()
  const b = new Batch()
  const barrel = (from: number, to: number, r: number, y = 0.052, mat = dark) =>
    b.rod(V(0, y, from), V(0, y, to), r, r, mat, 12)
  if (id === 'ak' || id === 'm4' || id === 'awp') {
    const ak = id === 'ak',
      sniper = id === 'awp'
    b.box(0, 0.004, -0.016, 0.086, 0.105, 0.285, dark)
    profile(
      b,
      [
        [-0.16, 0.061],
        [0.115, 0.06],
        [0.151, 0.036],
        [0.125, 0.011],
        [-0.16, 0.011],
      ],
      0.078,
      steel
    )
    b.box(0.045, 0.007, 0.012, 0.009, 0.038, 0.179, steel)
    if (ak) {
      b.rod(V(0, 0.046, -0.15), V(0, 0.046, 0.105), 0.042, 0.043, steel, 12)
      for (const x of [-0.031, -0.018, 0.018, 0.031])
        b.rod(V(x, 0.075, -0.138), V(x, 0.075, 0.086), 0.0028, 0.0028, dark, 5)
      for (const z of [-0.098, -0.087, 0.04, 0.051])
        b.rod(V(-0.033, 0.072, z), V(0.033, 0.072, z), 0.003, 0.003, steel, 5)
      b.rod(V(0.048, 0.018, -0.055), V(0.048, -0.002, 0.097), 0.007, 0.007, edge, 5)
      b.box(-0.046, 0.016, -0.027, 0.007, 0.022, 0.107, black)
      for (const z of [-0.126, -0.11, 0.058, 0.094])
        b.rod(V(-0.045, 0.018, z), V(-0.049, 0.018, z), 0.006, 0.005, edge, 9)
      b.rod(V(-0.047, -0.023, -0.12), V(-0.047, -0.023, 0.072), 0.0027, 0.0027, steel, 5)
      b.rod(V(-0.047, -0.027, 0.038), V(-0.047, -0.002, 0.093), 0.0031, 0.0031, steel, 5)
      for (const z of [-0.1, -0.057, 0.071]) b.ball(-0.045, -0.026, z, 0.0045, 0.005, 0.005, steel)
      b.box(0, 0.045, 0.12, 0.026, 0.028, 0.012, edge)
    }
    b.box(0.055, 0.035, -0.03, 0.026, 0.013, 0.04, edge)
    profile(
      b,
      [
        [0.06, -0.036],
        [0.115, -0.033],
        [0.165, -0.158],
        [0.125, -0.182],
        [0.09, -0.13],
      ],
      0.063,
      ak ? woodDark : poly
    )
    b.box(0, -0.096, 0.028, 0.014, 0.012, 0.074, steel)
    b.box(0, -0.066, -0.012, 0.015, 0.067, 0.013, steel)
    barrel(-0.13, sniper ? -0.76 : -0.64, sniper ? 0.022 : 0.018)
    barrel(-0.596, -0.65, 0.028)
    barrel(-0.645, -0.668, 0.024)
    if (ak) {
      profile(
        b,
        [
          [0.12, 0.042],
          [0.236, 0.02],
          [0.42, 0.038],
          [0.432, -0.077],
          [0.385, -0.081],
          [0.206, -0.054],
          [0.13, -0.035],
        ],
        0.077,
        wood
      )
      b.box(0, -0.019, 0.429, 0.085, 0.119, 0.014, steel)
      profile(
        b,
        [
          [-0.17, 0.024],
          [-0.396, 0.019],
          [-0.409, -0.01],
          [-0.371, -0.049],
          [-0.218, -0.06],
          [-0.165, -0.027],
        ],
        0.089,
        wood
      )
      barrel(-0.182, -0.395, 0.036, 0.052, wood)
      barrel(-0.393, -0.5, 0.019, 0.073, steel)
      for (const z of [-0.17, -0.392]) {
        b.box(0, 0.011, z, 0.098, 0.106, 0.018, steel)
      }
      for (const z of [-0.224, -0.263, -0.302, -0.341])
        for (const sign of [-1, 1]) {
          b.box(sign * 0.047, -0.005, z, 0.004, 0.023, 0.018, woodDark)
          b.box(sign * 0.034, 0.041, z, 0.004, 0.014, 0.022, black)
        }
      profile(
        b,
        [
          [-0.028, -0.045],
          [-0.115, -0.047],
          [-0.14, -0.163],
          [-0.213, -0.247],
          [-0.162, -0.286],
          [-0.082, -0.234],
          [-0.042, -0.146],
        ],
        0.064,
        dark
      )
      for (let k = 0; k < 3; k++) {
        const z = -0.051 - k * 0.019
        b.rod(V(0.034, -0.075, z), V(0.034, -0.178, z - 0.029), 0.003, 0.003, steel, 5)
        b.rod(V(0.034, -0.178, z - 0.029), V(0.034, -0.242, z - 0.08), 0.003, 0.003, steel, 5)
      }
      b.rod(V(0, 0.053, -0.54), V(0, 0.126, -0.556), 0.011, 0.009, steel)
      ring(b, 0, 0.132, -0.559, 0.018, 0.0038, steel)
      b.box(0, 0.134, -0.56, 0.004, 0.031, 0.007, black)
      b.box(0, 0.086, -0.117, 0.054, 0.024, 0.058, dark)
      b.box(0, 0.099, -0.109, 0.02, 0.006, 0.035, edge)
      for (const z of [-0.108, -0.085, 0.064, 0.099])
        b.ball(0.046, 0.012, z, 0.004, 0.007, 0.007, edge)
    } else if (!sniper) {
      barrel(0.11, 0.359, 0.027, 0.014, steel)
      profile(
        b,
        [
          [0.185, 0.044],
          [0.413, 0.046],
          [0.421, -0.095],
          [0.354, -0.086],
          [0.316, -0.036],
          [0.188, -0.02],
        ],
        0.077,
        poly
      )
      b.box(0, 0.016, -0.282, 0.096, 0.094, 0.273, poly)
      for (let z = -0.395; z < -0.155; z += 0.025) {
        b.box(0, 0.071, z, 0.099, 0.013, 0.015, black)
        b.box(0.05, 0.018, z, 0.011, 0.041, 0.011, dark)
      }
      profile(
        b,
        [
          [-0.027, -0.047],
          [-0.12, -0.047],
          [-0.139, -0.217],
          [-0.071, -0.236],
          [-0.045, -0.165],
        ],
        0.069,
        steel
      )
      for (const z of [-0.06, -0.081, -0.105])
        b.box(0.036, -0.137, z, 0.004, 0.115, 0.006, dark, 0, -0.15)
      b.rod(V(0, 0.054, -0.48), V(0, 0.13, -0.51), 0.009, 0.007, dark)
      ring(b, 0, 0.137, -0.509, 0.02, 0.005, steel)
      b.box(0, 0.085, 0.031, 0.067, 0.038, 0.058, dark)
    } else {
      profile(
        b,
        [
          [-0.49, 0.015],
          [-0.13, 0.025],
          [0.1, 0.025],
          [0.22, 0.02],
          [0.41, 0.047],
          [0.44, -0.102],
          [0.31, -0.096],
          [0.208, -0.05],
          [0.11, -0.1],
          [-0.04, -0.063],
          [-0.43, -0.053],
        ],
        0.102,
        olive
      )
      b.box(0, -0.101, -0.078, 0.074, 0.105, 0.098, black)
      barrel(-0.3, 0.105, 0.041, 0.158, black)
      barrel(-0.36, -0.264, 0.062, 0.158, dark)
      barrel(0.104, 0.155, 0.052, 0.158, dark)
      b.rod(V(0, 0.158, 0.156), V(0, 0.158, 0.158), 0.043, 0.043, glass, 16)
      for (const z of [-0.19, 0.028]) {
        b.box(0, 0.095, z, 0.046, 0.116, 0.025, steel)
        barrel(z - 0.013, z + 0.013, 0.047, 0.158, steel)
      }
      b.rod(V(0, 0.184, -0.079), V(0, 0.217, -0.079), 0.024, 0.024, dark, 12)
      b.rod(V(0.044, 0.038, 0.069), V(0.094, -0.005, 0.085), 0.008, 0.008, steel)
      b.ball(0.097, -0.009, 0.086, 0.019, 0.019, 0.02, black)
      barrel(-0.76, -0.799, 0.029)
    }
  } else if (id === 'knife') {
    profile(
      b,
      [
        [0.17, 0.006],
        [-0.014, 0.012],
        [-0.029, -0.02],
        [0.16, -0.026],
      ],
      0.044,
      black
    )
    for (let i = 0; i < 6; i++) b.box(0, -0.006, 0.004 + i * 0.025, 0.054, 0.047, 0.009, poly)
    b.box(0, 0, -0.032, 0.071, 0.077, 0.02, steel)
    profile(
      b,
      [
        [-0.039, 0.019],
        [-0.19, 0.014],
        [-0.335, 0.073],
        [-0.268, -0.007],
        [-0.112, -0.031],
        [-0.04, -0.026],
      ],
      0.009,
      edge
    )
    profile(
      b,
      [
        [-0.041, 0.02],
        [-0.2, 0.016],
        [-0.3, 0.057],
        [-0.182, -0.002],
        [-0.04, -0.006],
      ],
      0.012,
      steel
    )
  } else {
    const de = id === 'deagle',
      usp = id === 'usp'
    profile(
      b,
      [
        [0.071, -0.009],
        [0.094, -0.026],
        [0.105, -0.16],
        [0.063, -0.173],
        [0.012, -0.064],
        [-0.143, -0.054],
        [-0.15, -0.022],
      ],
      0.06,
      poly
    )
    profile(
      b,
      [
        [0.085, 0.027],
        [0.066, 0.048],
        [-(de ? 0.207 : 0.174), 0.048],
        [-(de ? 0.221 : 0.184), 0.02],
        [-0.177, -0.017],
        [0.082, -0.017],
      ],
      de ? 0.071 : 0.062,
      de ? edge : steel
    )
    for (let i = 0; i < 6; i++) b.box(0.032, 0.013, 0.056 - i * 0.009, 0.002, 0.042, 0.003, dark)
    b.box(0, -0.092, -0.014, 0.011, 0.012, 0.078, dark)
    b.box(0, -0.065, -0.054, 0.012, 0.062, 0.011, dark)
    b.box(0, 0.057, -0.154, 0.011, 0.017, 0.009, black)
    b.box(0, 0.056, 0.057, 0.041, 0.014, 0.013, black)
    if (usp) barrel(-0.169, -0.33, 0.025, 0.02)
    if (de) barrel(-0.212, -0.224, 0.021, 0.022, black)
    b.box(0, -0.16, 0.079, 0.069, 0.015, 0.062, black)
  }
  const gr = b.group()
  weapons.set(id, gr)
  return gr.clone()
}
export function heldModel(id: WeaponId) {
  const g = new T.Group()
  g.add(weaponModel(id))
  const b = new Batch()
  const hand = (x: number, y: number, z: number, left: boolean) => {
    b.ball(x, y, z, 0.048, 0.053, 0.076, glove, 10)
    b.ball(x + (left ? -0.019 : 0.021), y + 0.015, z + 0.012, 0.037, 0.042, 0.053, pad)
    for (let i = 0; i < 4; i++) {
      const zy = z - 0.05 + i * 0.026
      b.rod(
        V(x + (left ? 0.026 : -0.026), y + 0.009, zy),
        V(x + (left ? 0.041 : -0.041), y + 0.036, zy - 0.003),
        0.012,
        0.01,
        leather,
        7
      )
      b.ball(x + (left ? 0.038 : -0.038), y + 0.04, zy - 0.004, 0.012, 0.014, 0.011, glove)
    }
    b.rod(
      V(x + (left ? 0.025 : -0.024), y + 0.019, z + 0.04),
      V(x + (left ? 0.05 : -0.04), y + 0.06, z + 0.003),
      0.017,
      0.013,
      glove,
      8
    )
  }
  const rifle = ['ak', 'm4', 'awp'].includes(id),
    knife = id === 'knife'
  hand(0.044, -0.102, 0.104, false)
  b.rod(V(0.054, -0.119, 0.139), V(0.147, -0.248, 0.37), 0.041, 0.068, sleeve, 9)
  b.rod(V(0.057, -0.119, 0.138), V(0.081, -0.155, 0.205), 0.049, 0.054, leather, 9)
  b.rod(V(0.079, -0.157, 0.204), V(0.087, -0.168, 0.225), 0.056, 0.057, pad, 9)
  if (!knife) {
    const x = rifle ? -0.029 : -0.027,
      z = rifle ? -0.308 : 0.039,
      y = rifle ? -0.059 : -0.129
    hand(x, y, z, true)
    if (rifle) {
      for (let finger = 0; finger < 4; finger++) {
        const pz = z - 0.045 + finger * 0.025
        b.rod(V(-0.052, -0.067, pz), V(-0.071, -0.035, pz + 0.003), 0.012, 0.013, leather, 8)
        b.rod(V(-0.071, -0.035, pz + 0.003), V(-0.06, -0.006, pz - 0.001), 0.013, 0.011, glove, 8)
        b.ball(-0.057, -0.001, pz - 0.002, 0.011, 0.012, 0.011, pad, 8)
      }
      b.rod(V(-0.063, -0.066, z + 0.055), V(-0.079, -0.035, z + 0.077), 0.016, 0.014, leather, 8)
      b.rod(V(-0.079, -0.035, z + 0.077), V(-0.06, 0.009, z + 0.061), 0.014, 0.011, pad, 8)
      b.box(-0.071, -0.08, z + 0.083, 0.015, 0.032, 0.052, leather, 0.3, -0.4)
    }
    b.rod(V(x - 0.02, y - 0.024, z + 0.032), V(-0.169, -0.258, 0.235), 0.04, 0.073, sleeve, 9)
    b.rod(
      V(x - 0.018, y - 0.018, z + 0.025),
      V(x - 0.049, y - 0.064, z + 0.127),
      0.048,
      0.053,
      glove,
      9
    )
    b.rod(
      V(x - 0.046, y - 0.06, z + 0.118),
      V(x - 0.053, y - 0.073, z + 0.143),
      0.055,
      0.055,
      pad,
      9
    )
  }
  g.add(b.group(false))
  return g
}
const actorModels = new Map<Team, T.Group>()
export function characterModel(team: Team) {
  detail()
  const cached = actorModels.get(team)
  if (cached) return cached.clone(true)
  const t = team === 'T',
    coat = t ? cloth : jacket,
    pants = t ? olive : navy
  const root = new T.Group(),
    b = new Batch()
  b.ball(0, 1.235, 0.012, 0.231, 0.317, 0.15, coat)
  b.box(0, 1.24, -0.013, 0.406, 0.378, 0.257, vest)
  b.ball(0, 1.25, 0.136, 0.167, 0.209, 0.084, t ? strap : navy, 9)
  b.box(0, 1.235, 0.188, 0.238, 0.217, 0.069, t ? olive : vest)
  b.box(0, 1.31, 0.221, 0.239, 0.049, 0.017, leather)
  for (const off of [-0.105, 0.105]) {
    b.box(off, 1.13, 0.207, 0.082, 0.115, 0.045, t ? strap : navy)
    b.box(off, 1.151, 0.233, 0.073, 0.021, 0.013, leather)
    b.box(off, 1.405, 0.116, 0.064, 0.087, 0.054, t ? sand : vest)
  }
  b.box(0, 1.325, -0.154, 0.285, 0.118, 0.031, t ? strap : navy)
  b.box(0.08, 1.36, -0.173, 0.083, 0.032, 0.009, t ? patch : bluePatch)
  for (let i = 0; i < 3; i++)
    b.box(-0.117 + i * 0.118, 1.16, -0.163, 0.099, 0.145, 0.068, t ? strap : olive)
  for (const x of [-0.137, 0.137]) {
    b.box(x, 1.393, -0.094, 0.06, 0.21, 0.074, strap, 0, -0.24)
    b.box(x, 1.29, 0.14, 0.061, 0.37, 0.04, strap)
  }
  b.ball(0, 0.983, 0.005, 0.2, 0.154, 0.13, pants)
  b.box(0, 1.025, 0, 0.39, 0.058, 0.261, leather)
  b.rod(V(0, 1.452, 0), V(0, 1.55, 0), 0.085, 0.081, skin)
  b.ball(0, 1.637, -0.01, 0.133, 0.168, 0.126, t ? skin : glove, 10)
  if (t) {
    b.ball(0, 1.708, 0.001, 0.143, 0.107, 0.136, cloth, 12)
    for (let i = 0; i < 4; i++) {
      const scarf = i % 2 ? strap : cloth
      b.rod(
        V(-0.107, 1.67 + i * 0.016, 0.075),
        V(0.098, 1.65 + i * 0.015, 0.1),
        0.016,
        0.018,
        scarf
      )
    }
    b.box(-0.052, 1.568, 0.108, 0.079, 0.18, 0.025, cloth, 0.16, -0.29, 0.18)
    b.ball(0, 1.499, 0.014, 0.131, 0.047, 0.113, strap, 9)
    b.box(0, 1.627, -0.12, 0.228, 0.046, 0.034, glass)
    b.ball(0, 1.56, -0.025, 0.131, 0.071, 0.137, strap)
    for (let j = 0; j < 3; j++)
      b.rod(
        V(-0.111, 1.7 + j * 0.018, -0.063),
        V(0.095, 1.698 + j * 0.018, -0.095),
        0.007,
        0.006,
        strap,
        6
      )
  } else {
    b.ball(0, 1.716, 0.004, 0.154, 0.118, 0.148, navy, 10)
    b.box(0, 1.706, -0.107, 0.258, 0.036, 0.118, vest)
    b.box(0, 1.638, -0.119, 0.228, 0.071, 0.041, glass)
    b.box(0.142, 1.633, 0, 0.033, 0.104, 0.074, black)
  }
  const arms = [
    [V(0.192, 1.404, 0), V(0.276, 1.179, 0.023), V(0.09, 1.256, -0.228)],
    [V(-0.192, 1.404, 0), V(-0.251, 1.19, -0.131), V(0.008, 1.309, -0.464)],
  ]
  for (const [s, e, h] of arms) {
    b.rod(s, e, 0.092, 0.067, coat)
    b.rod(e, h, 0.069, 0.046, coat)
    b.ball(h.x, h.y, h.z, 0.055, 0.059, 0.058, glove)
  }
  root.add(b.group())
  for (const sign of [-1, 1]) {
    const leg = new Batch()
    leg.rod(V(sign * 0.117, 0, 0), V(sign * 0.126, -0.41, -0.028), 0.108, 0.087, pants)
    leg.rod(V(sign * 0.126, -0.4, -0.028), V(sign * 0.126, -0.781, 0.016), 0.085, 0.064, pants)
    leg.ball(sign * 0.126, -0.401, -0.083, 0.083, 0.092, 0.055, vest)
    leg.box(sign * 0.198, -0.212, 0.014, 0.046, 0.163, 0.134, olive)
    leg.box(sign * 0.222, -0.162, 0.014, 0.017, 0.038, 0.144, strap)
    leg.rod(V(sign * 0.126, -0.437, -0.012), V(sign * 0.126, -0.407, -0.014), 0.088, 0.092, leather)
    leg.rod(V(sign * 0.126, -0.792, 0.014), V(sign * 0.126, -0.665, 0.012), 0.077, 0.076, leather)
    for (let j = 0; j < 3; j++)
      leg.box(sign * 0.126, -0.752 + j * 0.028, -0.063, 0.065, 0.008, 0.014, strap)
    leg.box(sign * 0.126, -0.841, -0.042, 0.148, 0.138, 0.267, leather)
    const g = leg.group()
    g.name = sign === 1 ? 'rightLeg' : 'leftLeg'
    g.position.y = 0.91
    root.add(g)
  }
  actorModels.set(team, root)
  return root.clone(true)
}
export function bombModel() {
  const b = new Batch()
  b.box(0, 0.084, 0, 0.34, 0.15, 0.24, olive)
  b.box(0, 0.168, 0, 0.23, 0.035, 0.16, black)
  b.box(-0.035, 0.189, -0.031, 0.119, 0.009, 0.057, paint('#9fad7a'))
  for (let i = 0; i < 6; i++)
    b.box(
      0.052 + 0.026 * (i % 2),
      0.19,
      -0.037 + 0.034 * Math.floor(i / 2),
      0.016,
      0.008,
      0.019,
      pad
    )
  for (const x of [-0.132, 0.132]) b.box(x, 0.086, 0, 0.024, 0.162, 0.249, strap)
  return b.group()
}
