import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Character } from '../src/game/entities/character.ts'
import { aimDirection, fireBullet, traceCharacter } from '../src/game/combat/combat.ts'
import { partDamage } from '../src/game/combat/combat.ts'
import { buildMapData } from '../src/game/map/mapData.ts'
import { WEAPONS } from '../src/game/weapons/weapons.ts'
import { ARMOR_ABSORB, EYE_HEIGHT, HITGROUP_MULT } from '../src/game/config.ts'

const colliders = buildMapData().colliders

/** T 出生区空地上的两名对手：射手在 z=40 朝 -Z 看，目标在 z=34 */
function duel(): { shooter: Character; target: Character } {
  const shooter = new Character(0, 'S', 'CT')
  shooter.x = 0
  shooter.z = 40
  shooter.yaw = 0
  const target = new Character(5, 'T', 'T')
  target.x = 0
  target.z = 34
  target.yaw = 0
  return { shooter, target }
}

test('爆头伤害为身体伤害的两倍', () => {
  assert.equal(HITGROUP_MULT.head, 2 * HITGROUP_MULT.chest)
  assert.equal(partDamage(36, 'head'), 72)
  assert.equal(partDamage(36, 'chest'), 36)
  assert.ok(partDamage(36, 'legs') < partDamage(36, 'chest'))
})

test('命中判定按部位：水平射线的高度决定命中头 / 胸 / 腿', () => {
  const { target } = duel()
  const shot = (h: number) => traceCharacter(target, { x: 0, y: h, z: 40 }, { x: 0, y: 0, z: -1 }, 50)?.part
  assert.equal(shot(1.62), 'head')
  assert.equal(shot(1.2), 'chest')
  assert.equal(shot(0.95), 'stomach')
  assert.equal(shot(0.5), 'legs')
})

test('开火：直线射击命中敌人，并返回命中部位', () => {
  const { shooter, target } = duel()
  const res = fireBullet(shooter, WEAPONS.awp, 0, colliders, [shooter, target])
  assert.equal(res.target, target)
  assert.equal(res.part, 'head')
})

test('墙体会挡住子弹：墙后的敌人命中不了', () => {
  // 中路（z=14）开火射向北侧中路（z=4），中门南侧的墙体（z≈8~10）挡住视线
  const shooter = new Character(0, 'S', 'CT')
  shooter.x = 2
  shooter.z = 14
  shooter.yaw = 0
  const target = new Character(5, 'T', 'T')
  target.x = 2
  target.z = 4
  const res = fireBullet(shooter, WEAPONS.ak47, 0, colliders, [shooter, target])
  assert.equal(res.target, null)
})

test('护甲吸收一半伤害，并被消耗', () => {
  const c = new Character(1, 'x', 'T')
  c.armor = 100
  const dealt = c.takeDamage(36, ARMOR_ABSORB)
  assert.equal(dealt, 18)
  assert.equal(c.armor, 82)
  assert.equal(c.hp, 82)
})

test('护甲不足时只吸收剩余护甲值，扣血不超过当前血量', () => {
  const c = new Character(1, 'x', 'T')
  c.armor = 5
  const dealt = c.takeDamage(115, ARMOR_ABSORB)
  assert.equal(c.armor, 0)
  assert.equal(dealt, 100)
  assert.equal(c.hp, 0)
  assert.equal(c.alive, false)
})

test('AWP 胸口一发致命（满血 100 点）', () => {
  const c = new Character(1, 'x', 'T')
  c.hp = 100
  c.takeDamage(partDamage(WEAPONS.awp.damage, 'chest'), ARMOR_ABSORB)
  assert.equal(c.alive, false)
})

test('扩散：零扩散时方向精确指向视线方向', () => {
  const d = aimDirection(0, 0, 0)
  assert.ok(Math.abs(d.z + 1) < 1e-9 && Math.abs(d.x) < 1e-9 && Math.abs(d.y) < 1e-9)
  const up = aimDirection(0, Math.PI / 4, 0)
  assert.ok(up.y > 0.7 && up.z < 0)
  assert.ok(EYE_HEIGHT > 1.5)
})

test('伤害梯度：手枪低于步枪，沙鹰介于手枪与步枪之间且弹匣更小', () => {
  for (const pistol of [WEAPONS.glock, WEAPONS.usp]) {
    assert.ok(pistol.damage < WEAPONS.ak47.damage)
    assert.ok(pistol.damage < WEAPONS.m4a4.damage)
    assert.ok(WEAPONS.deagle.damage > pistol.damage)
  }
  assert.ok(WEAPONS.deagle.damage < WEAPONS.m4a4.damage)
  assert.ok(WEAPONS.deagle.damage < WEAPONS.ak47.damage)
  assert.ok(WEAPONS.deagle.magSize < WEAPONS.glock.magSize)
})

test('手感差异：AK 后坐力最剧烈，M4 射速更高，AWP 射速最低', () => {
  assert.ok(WEAPONS.ak47.recoilPitch > WEAPONS.m4a4.recoilPitch)
  assert.ok(WEAPONS.m4a4.fireInterval < WEAPONS.ak47.fireInterval)
  assert.ok(WEAPONS.awp.fireInterval > WEAPONS.ak47.fireInterval)
  assert.ok(WEAPONS.awp.scope !== null && WEAPONS.ak47.scope === null)
})
