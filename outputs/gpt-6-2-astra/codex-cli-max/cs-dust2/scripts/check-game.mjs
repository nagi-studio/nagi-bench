import assert from 'node:assert/strict'
import { createServer } from 'vite'

const server = await createServer({
  logLevel: 'silent',
  server: { middlewareMode: true, hmr: false },
  appType: 'custom',
})
const originalRandom = Math.random
let seed = 84113
Math.random = () => (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296

try {
  const { Match, hitActor } = await server.ssrLoadModule('/src/game/match.ts')
  const { pathfind, ground, canStand, visible, gateLeaves, gates, teamSpawns } =
    await server.ssrLoadModule('/src/game/map.ts')
  const { zoneMultiplier } = await server.ssrLoadModule('/src/game/weapons.ts')
  const run = (match, seconds) => {
    for (let i = 0; i < Math.ceil(seconds * 60); i++) match.tick(1 / 60)
  }
  function fixture(options) {
    const m = new Match(options)
    m.start()
    // Each scenario enables only the actors whose decisions it exercises.
    for (const a of m.actors) {
      a.nextThink = 999
      a.plan = []
    }
    return m
  }
  function place(actor, x, z) {
    Object.assign(actor, { x, z, y: ground(x, z), vy: 0, moving: 0, grounded: true })
  }
  function prepareShot(m, shooter, target) {
    place(shooter, 18.5, 34)
    place(target, 18.5, 37)
    shooter.yaw = Math.PI
    shooter.cooldown = 0
    target.hp = 1
    m.fire(shooter, target)
    assert.equal(target.alive, false)
  }

  const stops = [
    ...teamSpawns.T,
    ...teamSpawns.CT,
    { x: 39, z: 4 },
    { x: 37, z: -21 },
    { x: 0.5, z: -15 },
    { x: 11.5, z: -8 },
    { x: -32, z: 1 },
    { x: -38, z: -24 },
  ]
  for (const from of stops)
    for (const to of stops) {
      const path = pathfind(from, to)
      assert.ok(path.length, 'Disconnected area')
      const end = path.at(-1)
      assert.ok(Math.hypot(end.x - to.x, end.z - to.z) < 1.6)
    }
  for (const g of gates.filter((g) => g.wood)) {
    for (const door of gateLeaves(g)) assert.equal(canStand(door.x, door.z, 0), false)
    assert.ok(visible({ x: g.x, y: 1.6, z: g.z + 2.5 }, { x: g.x, y: 1.6, z: g.z - 2.5 }))
  }
  assert.equal(visible({ x: 10, y: 1.6, z: 28 }, { x: 10, y: 1.6, z: 26 }), false)
  console.log('✓ 256 navigation pairs, solid door leaves, open passages and blocked sightlines')

  const pistol = fixture({ team: 'CT', pistolRound: true })
  assert.ok(
    pistol.actors.every(
      (a) =>
        a.armor === 0 &&
        a.inventory[0] === null &&
        a.inventory[1].id === (a.team === 'T' ? 'glock' : 'usp')
    )
  )
  pistol.round = 2
  pistol.resetRound()
  assert.ok(pistol.actors.every((a) => a.armor === 100 && a.inventory[0]))
  const gun = fixture()
  const mag = gun.player.inventory[0]
  gun.fire(gun.player)
  assert.equal(mag.ammo, 29)
  gun.reload()
  run(gun, 2.5)
  assert.equal(mag.ammo, 30)
  assert.equal(mag.reserve, 89)
  place(gun.player, -9.5, 35)
  gun.player.yaw = Math.PI / 2
  gun.key('KeyW', true)
  gun.key('Space', true)
  run(gun, 1.4)
  assert.ok(gun.player.x > -10.71)
  assert.ok(gun.player.grounded)
  const target = gun.actors[5]
  Object.assign(target, { x: 0, y: 0, z: 0, yaw: 0 })
  for (const [region, x, y] of [
    ['head', 0, 1.65],
    ['chest', 0.15, 1.35],
    ['abdomen', 0, 0.96],
    ['arm', 0.24, 1.33],
    ['leg', 0.1, 0.38],
  ]) {
    assert.equal(hitActor({ x, y, z: -5 }, { x: 0, y: 0, z: 1 }, target).zone, region)
  }
  assert.equal(zoneMultiplier.head, 2 * zoneMultiplier.chest)
  console.log(
    '✓ Pistol opener, second-round inventories, reload accounting, jump collision and five hit zones'
  )

  function damageAt(height, armor) {
    const m = fixture()
    const victim = m.actors[5]
    place(m.player, 18.5, 34)
    place(victim, 18.5, 37)
    m.player.yaw = Math.PI
    m.player.pitch = Math.atan2(height - 1.59, 3)
    victim.armor = armor
    m.fire(m.player)
    return 100 - victim.hp
  }
  const body = damageAt(1.42, 0),
    head = damageAt(1.65, 0)
  assert.equal(body, 38)
  assert.equal(head, body * 2)
  assert.ok(damageAt(1.42, 100) < body)
  const frozen = gun.snapshot()
  gun.player.hp = 12
  gun.player.inventory[0].ammo = 2
  assert.equal(frozen.actor.hp, 100)
  assert.equal(frozen.actor.inventory[0].ammo, 30)
  console.log('✓ Live shot damage, armor absorption and immutable HUD snapshots')

  const death = fixture()
  death.bomb.carrier = death.playerId
  prepareShot(death, death.actors[5], death.player)
  assert.ok(death.spectating)
  assert.equal(death.bomb.state, 'dropped')
  const firstMate = death.viewId
  death.cycle()
  assert.notEqual(death.viewId, firstMate)
  death.takeover()
  assert.ok(!death.spectating)
  assert.equal(death.playerId, death.viewId)
  place(death.player, death.bomb.x, death.bomb.z)
  run(death, 0.05)
  assert.equal(death.bomb.carrier, death.playerId)
  console.log('✓ Death, dropped C4, spectator cycling, teammate takeover and pickup')

  const objective = fixture()
  place(objective.player, 37, -23)
  objective.bomb.carrier = objective.playerId
  objective.key('KeyE', true)
  run(objective, 1.6)
  assert.equal(objective.bomb.state, 'carried')
  objective.key('KeyE', false)
  run(objective, 0.04)
  assert.equal(objective.player.action, 0)
  objective.key('KeyE', true)
  run(objective, 3.15)
  assert.equal(objective.bomb.state, 'planted')
  objective.key('KeyE', false)
  for (const a of objective.actors) {
    a.plan = []
    a.nextThink = 999
  }
  for (const a of objective.actors.slice(1, 5)) a.alive = false
  prepareShot(objective, objective.actors[5], objective.player)
  assert.equal(
    objective.phase,
    'live',
    'A planted device survives elimination of the attacking team'
  )
  const defuser = objective.actors[6]
  place(defuser, objective.bomb.x, objective.bomb.z)
  defuser.state = 'defuse'
  run(objective, 2.0)
  assert.ok(defuser.action > 1.9)
  place(defuser, 39, -19)
  run(objective, 0.1)
  assert.equal(defuser.action, 0)
  place(defuser, objective.bomb.x, objective.bomb.z)
  run(objective, 5.1)
  assert.equal(objective.bomb.state, 'defused')
  assert.equal(objective.winner, 'CT')
  console.log('✓ Interrupted plant and defuse, planted-round elimination rule, successful defuse')

  for (const team of ['T', 'CT']) {
    const m = fixture()
    const opponents = m.actors.filter((a) => a.team !== team)
    for (const enemy of opponents.slice(1)) enemy.alive = false
    prepareShot(
      m,
      m.actors.find((a) => a.team === team),
      opponents[0]
    )
    assert.equal(m.winner, team)
  }
  const explosion = fixture()
  Object.assign(explosion.bomb, {
    state: 'planted',
    remaining: 0.05,
    carrier: null,
    x: 37,
    z: -23,
    y: 1.83,
  })
  run(explosion, 0.1)
  assert.equal(explosion.bomb.state, 'exploded')
  assert.equal(explosion.winner, 'T')
  run(explosion, 5.3)
  assert.equal(explosion.round, 2)
  assert.equal(explosion.phase, 'live')
  const timeout = fixture()
  timeout.remaining = 0.05
  run(timeout, 0.1)
  assert.equal(timeout.winner, 'CT')
  console.log('✓ Both elimination outcomes, explosion, timeout and next-round reset')

  for (const round of [1, 2]) {
    const bots = new Match({ team: 'CT' })
    bots.start()
    bots.round = round
    bots.resetRound()
    // Choose the other site for defenders so we can verify each full planting route.
    for (const a of bots.actors.filter((a) => a.team === 'CT')) {
      place(a, round === 1 ? -37 : 37, -30)
      a.nextThink = 999
      a.plan = []
    }
    let time = 0
    while (time++ < 70 * 60 && bots.bomb.state !== 'planted') bots.tick(1 / 60)
    assert.equal(bots.bomb.state, 'planted')
    assert.equal(bots.bomb.site, round === 1 ? 'A' : 'B')
  }
  console.log('✓ Autonomous attackers navigate to and plant at both bombsites')
} finally {
  Math.random = originalRandom
  await server.close()
}
