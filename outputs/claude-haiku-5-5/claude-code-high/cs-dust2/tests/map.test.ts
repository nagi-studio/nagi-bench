import { test } from 'node:test'
import assert from 'node:assert/strict'
import { LAYOUT, NAMED_POINTS, namedPoint, worldToCell, charAt } from '../src/game/map/layout.ts'
import { buildMapData } from '../src/game/map/mapData.ts'
import { NavGrid } from '../src/game/nav/navGrid.ts'
import { COLS, ROWS } from '../src/game/config.ts'

const nav = new NavGrid()

/** 从某个格子出发做 4 连通洪泛（门视为可通行），返回可达格子集合 */
function floodFrom(c: number, r: number): Set<string> {
  const seen = new Set<string>()
  const q: [number, number][] = [[c, r]]
  seen.add(`${c},${r}`)
  while (q.length) {
    const [x, y] = q.shift() as [number, number]
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx
      const ny = y + dy
      const k = `${nx},${ny}`
      if (seen.has(k) || !nav.isWalkable(nx, ny)) continue
      seen.add(k)
      q.push([nx, ny])
    }
  }
  return seen
}

test('布局尺寸正确且每行等长', () => {
  assert.equal(LAYOUT.length, ROWS)
  for (const line of LAYOUT) assert.equal(line.length, COLS)
})

test('必需区域全部存在：T/CT 出生、A/B 点、中门、猫道、B 洞', () => {
  const chars = new Set(LAYOUT.join(''))
  for (const ch of ['T', 'C', 'A', 'B', 'D', 'l']) assert.ok(chars.has(ch), `缺少 ${ch}`)
  // 中门为两段 D，各 2 格宽
  const map = buildMapData()
  assert.equal(map.doors.length, 2)
  for (const d of map.doors) assert.equal(d.c1 - d.c0 + 1, 2)
  // 猫道：中路与 B 点之间第 19 行的开口
  assert.equal(charAt(16, 19), '.')
  assert.equal(charAt(14, 19), '.')
})

test('所有关键点都落在可行走格子上（非墙、非箱子）', () => {
  for (const name of Object.keys(NAMED_POINTS) as (keyof typeof NAMED_POINTS)[]) {
    const p = namedPoint(name)
    const { c, r } = worldToCell(p.x, p.z)
    assert.ok(nav.isWalkable(c, r), `${name} (${c},${r}) 不可行走: '${charAt(c, r)}'`)
  }
})

test('A 点、B 点、T 出生、CT 出生两两连通（门视为通路）', () => {
  const pts = {
    tSpawn: namedPoint('tSpawn'),
    ctSpawn: namedPoint('ctSpawn'),
    aSite: namedPoint('aSite'),
    bSite: namedPoint('bSite'),
    mid: namedPoint('mid'),
    catwalk: namedPoint('catwalk'),
    bTunnel: namedPoint('bTunnel'),
    longA: namedPoint('longA'),
  }
  const from = worldToCell(pts.tSpawn.x, pts.tSpawn.z)
  const reach = floodFrom(from.c, from.r)
  for (const [name, p] of Object.entries(pts)) {
    const { c, r } = worldToCell(p.x, p.z)
    assert.ok(reach.has(`${c},${r}`), `T 出生无法到达 ${name}`)
  }
})

test('CT 出生能到达 A 点与 B 点（不经过 T 出生区）', () => {
  const p = worldToCell(namedPoint('ctSpawn').x, namedPoint('ctSpawn').z)
  const reach = floodFrom(p.c, p.r)
  for (const name of ['aSite', 'bSite', 'mid'] as const) {
    const q = worldToCell(namedPoint(name).x, namedPoint(name).z)
    assert.ok(reach.has(`${q.c},${q.r}`), `CT 无法到达 ${name}`)
  }
})

test('A* 寻路能从 T 出生走到 A 点和 B 点，路径非空且终点接近目标', () => {
  for (const target of ['aSite', 'bSite'] as const) {
    const from = namedPoint('tSpawn')
    const to = namedPoint(target)
    const path = nav.findPath(from, to)
    assert.ok(path.length > 0, `找不到到 ${target} 的路径`)
    const last = path[path.length - 1]
    assert.ok(Math.hypot(last.x - to.x, last.z - to.z) < 2.5, `${target} 路径终点偏离`)
  }
})

test('寻路路线不穿过墙体或箱子（逐格检查路径点）', () => {
  const path = nav.findPath(namedPoint('ctSpawn'), namedPoint('bSite'))
  assert.ok(path.length > 0)
  for (const p of path) {
    const { c, r } = worldToCell(p.x, p.z)
    assert.ok(nav.isWalkable(c, r), `路径点落在不可行走格 (${c},${r}) '${charAt(c, r)}'`)
  }
})

test('中门可通过：从中门南侧到北侧的路径必须穿过门格子', () => {
  const south = namedPoint('midDoorsSouth')
  const north = namedPoint('midDoorsNorth')
  const path = nav.findPath(south, north)
  assert.ok(path.length > 0)
  const crossesDoor = path.some((p) => {
    const { c, r } = worldToCell(p.x, p.z)
    return charAt(c, r) === 'D'
  })
  assert.ok(crossesDoor, '路径没有经过中门')
})
