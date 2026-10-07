import { test } from 'node:test'
import assert from 'node:assert/strict'
import { GameWorld } from '../src/game/world/gameWorld.ts'
import { FIXED_DT, ARMOR_NORMAL, ARMOR_PISTOL } from '../src/game/config.ts'
import { evaluateRound } from '../src/game/round/match.ts'

test('回合判定：CT 全灭 T 胜；T 全灭且未下包 CT 胜；下包后 T 全灭不结束', () => {
  assert.equal(evaluateRound({ aliveT: 3, aliveCT: 0, bombState: 'carried', roundTimeLeft: 50 })?.winner, 'T')
  assert.equal(evaluateRound({ aliveT: 0, aliveCT: 2, bombState: 'carried', roundTimeLeft: 50 })?.winner, 'CT')
  assert.equal(evaluateRound({ aliveT: 0, aliveCT: 2, bombState: 'planted', roundTimeLeft: 50 }), null)
  assert.equal(evaluateRound({ aliveT: 2, aliveCT: 2, bombState: 'exploded', roundTimeLeft: 50 })?.winner, 'T')
  assert.equal(evaluateRound({ aliveT: 2, aliveCT: 2, bombState: 'defused', roundTimeLeft: 50 })?.winner, 'CT')
  assert.equal(evaluateRound({ aliveT: 2, aliveCT: 2, bombState: 'carried', roundTimeLeft: 0 })?.winner, 'CT')
})

test('手枪局：第一回合只有手枪、护甲按手枪局配置', () => {
  const w = new GameWorld({ playerTeam: 'T', primary: 'ak47', secondary: 'deagle', startWithPistolRound: true })
  assert.equal(w.pistolRound, true)
  for (const c of w.characters) {
    assert.equal(c.slots.primary, null, `${c.name} 不应持有主武器`)
    assert.ok(c.slots.secondary !== null)
    assert.equal(c.armor, ARMOR_PISTOL)
  }
  const human = w.byId(w.humanId)
  assert.equal(human.weapon.id, 'glock')
})

test('非手枪局：玩家使用所选主武器，护甲满值', () => {
  const w = new GameWorld({ playerTeam: 'CT', primary: 'awp', secondary: 'deagle', startWithPistolRound: false })
  assert.equal(w.pistolRound, false)
  const human = w.byId(w.humanId)
  assert.equal(human.slots.primary?.id, 'awp')
  assert.equal(human.armor, ARMOR_NORMAL)
  assert.ok(w.characters.some((c) => c.team === 'T' && c.hasBomb), '回合开始时应有 T 持有 C4')
})

test('全局推进：多回合模拟无 NaN、无穿墙，并且会发生交战与回合结算', () => {
  const w = new GameWorld({ playerTeam: 'CT', primary: 'm4a4', secondary: 'usp', startWithPistolRound: true })
  let kills = 0
  let ends = 0
  let penetrations = 0
  const limit = 120 * 60 * 4
  for (let i = 0; i < limit && w.round <= 3; i++) {
    w.step(FIXED_DT)
    for (const e of w.drainEvents()) {
      if (e.type === 'kill') kills++
      if (e.type === 'roundEnd') ends++
    }
    if (i % 120 === 0) {
      for (const c of w.characters) {
        assert.ok(Number.isFinite(c.x) && Number.isFinite(c.z) && Number.isFinite(c.y), 'NaN 位置')
        if (!c.alive || !c.onGround) continue
        for (const col of w.colliders) {
          if (!col.active || col.maxY <= 0.5 + 1e-3) continue
          const ov =
            col.maxX > c.x - 0.4 + 1e-3 && col.minX < c.x + 0.4 - 1e-3 &&
            col.maxZ > c.z - 0.4 + 1e-3 && col.minZ < c.z + 0.4 - 1e-3 &&
            col.minY < c.y + 1.8 && col.maxY > c.y + 0.5
          if (ov && c.y < col.maxY - 0.05) penetrations++
        }
      }
    }
  }
  assert.equal(penetrations, 0, '角色穿墙')
  assert.ok(kills > 0, '模拟期间没有任何击杀')
  assert.ok(ends >= 2, `回合结算次数不足：${ends}`)
})

test('AI 下包流程：多回合内 T 方 AI 至少成功安放一次 C4，且 CT 能拆除或回合被结算', () => {
  // 玩家（CT）保持静止，由 4 名 CT AI 防守；T 方 5 名 AI 进攻
  const w = new GameWorld({ playerTeam: 'CT', primary: 'm4a4', secondary: 'usp', startWithPistolRound: false })
  let planted = 0
  let resolved = 0
  // 注意：T 方 AI 偶尔会在中路被整体击破而没有下包（约 5% 的 4 回合窗口），因此用 8 回合窗口做断言
  const limit = 120 * 60 * 20
  for (let i = 0; i < limit && w.round <= 8; i++) {
    w.step(FIXED_DT)
    for (const e of w.drainEvents()) {
      if (e.type === 'bomb' && e.kind === 'planted') planted++
      if (e.type === 'roundEnd') resolved++
    }
  }
  assert.ok(planted >= 1, `八个回合内 AI 从未安放 C4（结算 ${resolved} 次）`)
  assert.ok(resolved >= 6, `回合没有正常结算：${resolved}`)
})
