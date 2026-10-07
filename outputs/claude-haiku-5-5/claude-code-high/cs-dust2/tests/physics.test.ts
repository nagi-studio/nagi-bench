import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildMapData } from '../src/game/map/mapData.ts'
import { cellLeft, cellTop } from '../src/game/map/layout.ts'
import { moveBody, updateVertical, type Body } from '../src/game/physics/physics.ts'
import { BODY_RADIUS, FIXED_DT, JUMP_SPEED } from '../src/game/config.ts'

const map = buildMapData()

function body(x: number, z: number): Body {
  return { x, y: 0, z, vy: 0, onGround: true }
}

/** 按固定步长推进若干秒：水平移动 + 竖直更新 */
function run(b: Body, dx: number, dz: number, seconds: number, jumpFirst = false): void {
  const steps = Math.round(seconds / FIXED_DT)
  for (let i = 0; i < steps; i++) {
    moveBody(b, dx * FIXED_DT, dz * FIXED_DT, map.colliders)
    updateVertical(b, FIXED_DT, jumpFirst && i === 0, map.colliders)
  }
}

test('墙体阻挡：朝东推墙，身体停在墙面外侧，不穿墙', () => {
  // 长 A 走廊（第 45~49 列），东墙位于第 50 列
  const wallX = cellLeft(50)
  const b = body(cellLeft(47), cellTop(22) + 1)
  run(b, 5.2, 0, 3)
  assert.ok(b.x <= wallX - BODY_RADIUS + 1e-3, `穿墙了：x=${b.x}`)
  assert.ok(b.x > wallX - BODY_RADIUS - 0.2, `没有贴墙：x=${b.x}`)
})

test('贴墙滑动：斜向推墙时沿墙面滑动而不是被完全卡住', () => {
  const wallX = cellLeft(50)
  const b = body(cellLeft(47), cellTop(22) + 1)
  const z0 = b.z
  run(b, 5.2, 2.0, 1)
  assert.ok(b.x <= wallX - BODY_RADIUS + 1e-3)
  assert.ok(b.z > z0 + 0.5, '没有沿墙滑动')
})

test('箱子不能直接走过去（高于台阶高度）', () => {
  // B 点箱子位于第 4~5 列、第 15~16 行
  const crateLeft = cellLeft(4)
  const b = body(cellLeft(0) + 1, cellTop(15) + 2)
  run(b, 5.2, 0, 1.5)
  assert.ok(b.x <= crateLeft - BODY_RADIUS + 1e-3, `穿过了箱子：x=${b.x}`)
})

test('起跳可越过箱子并站在箱子顶部（y≈1）', () => {
  const crateLeft = cellLeft(4)
  const crateRight = cellLeft(6)
  const b = body(crateLeft - 2, cellTop(15) + 2)
  let peak = 0
  let crossed = false
  const steps = Math.round(1.6 / FIXED_DT)
  for (let i = 0; i < steps; i++) {
    moveBody(b, 5.2 * FIXED_DT, 0, map.colliders)
    updateVertical(b, FIXED_DT, i === 0 && b.onGround, map.colliders)
    peak = Math.max(peak, b.y)
    if (b.x > crateRight + BODY_RADIUS) crossed = true
  }
  assert.ok(crossed, '未能越过箱子')
  assert.ok(peak > 0.9 && peak <= JUMP_SPEED ** 2 / 40 + 1.01, `起跳高度异常：${peak}`)
})

test('中门关闭时阻挡，打开后可以穿过', () => {
  const door = map.doors[0]
  const cx = door.hingeX + door.length / 2
  const zSouth = door.hingeZ + 3.5
  const b = body(cx, zSouth)
  run(b, 0, -5.2, 2)
  assert.ok(b.z >= door.hingeZ + 0.15 + BODY_RADIUS - 1e-3, `关门时穿过了门：z=${b.z}`)

  door.collider.active = false
  run(b, 0, -5.2, 2)
  assert.ok(b.z < door.hingeZ - 1, `开门后仍无法通过：z=${b.z}`)
})

test('重力：离地后落回地面，y 不会变成 NaN', () => {
  const b = body(cellLeft(47), cellTop(22) + 1)
  b.y = 3
  b.onGround = false
  run(b, 0, 0, 2)
  assert.equal(b.y, 0)
  assert.ok(b.onGround)
  assert.ok(Number.isFinite(b.y))
})
