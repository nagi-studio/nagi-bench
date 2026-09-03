import * as THREE from 'three'
import { GameAudio } from './audio'
import { createCharacter, syncHeldWeapon, ViewModel } from './character'
import { buildMap, findPath, getLocation, NAV_NODES, pointInSite, SITES, WORLD_BOUNDS } from './map'
import type { Agent, GameOptions, GameSnapshot, KillEvent, RoundMode, Team, WeaponId, Zone } from './types'
import { activeItem, equipPracticeWeapon, giveLoadout, switchSlot, WEAPONS } from './weapons'

type SnapshotListener = (snapshot: GameSnapshot) => void

const T_NAMES = ['Rook', 'Viper', 'Kestrel', 'Nomad', 'Ghost']
const CT_NAMES = ['Atlas', 'Bishop', 'Sable', 'Mako', 'Cipher']
const ZONE_DAMAGE: Record<Zone, number> = { head: 2, chest: 1, abdomen: .84, arm: .66, leg: .55 }
const UP = new THREE.Vector3(0, 1, 0)

interface BombState {
  state: 'carried' | 'dropped' | 'planted' | 'defused' | 'exploded'
  carrierId: number | null
  position: THREE.Vector3
  site: 'A' | 'B' | null
  timer: number
  beepAt: number
  mesh: THREE.Group
}

export class DustGame {
  private container: HTMLElement
  private listener: SnapshotListener
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(74, 1, .05, 180)
  private renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
  private clock = new THREE.Clock()
  private map = buildMap(this.scene)
  private agents: Agent[] = []
  private hitObjects: THREE.Object3D[] = []
  private viewModel: ViewModel
  private audio = new GameAudio()
  private bomb: BombState
  private phase: 'ready' | 'live' | 'roundEnd' = 'ready'
  private mode: RoundMode = 'pistol'
  private playerTeam: Team = 'CT'
  private controlledId = 5
  private round = 1
  private roundTime = 120
  private score = { T: 0, CT: 0 }
  private banner = ''
  private roundResetAt = 0
  private keys = new Set<string>()
  private fireHeld = false
  private triggerLatched = false
  private useHeld = false
  private scoped = false
  private recoilSpread = 0
  private actionLabel = ''
  private actionProgress = 0
  private killfeed: KillEvent[] = []
  private killSerial = 0
  private lastSnapshot = 0
  private lastStep = 0
  private raf = 0
  private disposed = false
  private flash: THREE.PointLight
  private previewAngle = 0
  private lastFrameTime = performance.now() / 1000
  private bombTarget: 'A' | 'B' = 'A'

  constructor(container: HTMLElement, listener: SnapshotListener) {
    this.container = container; this.listener = listener
    this.scene.background = new THREE.Color(0x8bb5cb)
    this.scene.fog = new THREE.FogExp2(0xa9c0c4, .006)
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7))
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.05
    container.appendChild(this.renderer.domElement)
    this.camera.rotation.order = 'YXZ'; this.scene.add(this.camera)
    this.viewModel = new ViewModel(this.camera)
    this.flash = new THREE.PointLight(0xffb35a, 0, 5); this.camera.add(this.flash); this.flash.position.set(.15, -.12, -1)

    this.scene.add(new THREE.HemisphereLight(0xcce7ff, 0x705432, 2.3))
    const sun = new THREE.DirectionalLight(0xffe3b5, 3.7); sun.position.set(-30, 58, 28)
    sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.camera.left = -70; sun.shadow.camera.right = 70
    sun.shadow.camera.top = 70; sun.shadow.camera.bottom = -70; sun.shadow.camera.far = 150; this.scene.add(sun)
    const dome = new THREE.Mesh(new THREE.SphereGeometry(155, 20, 12), new THREE.MeshBasicMaterial({ color: 0x82aec7, side: THREE.BackSide }))
    dome.position.y = 20; this.scene.add(dome)
    this.bomb = this.createBomb()
    this.installEvents(); this.resize(); this.publish(); this.loop()
  }

  start(options: GameOptions) {
    this.audio.unlock(); this.mode = options.mode; this.playerTeam = options.team
    this.score = { T: 0, CT: 0 }; this.round = 1
    if (!this.agents.length) this.createAgents()
    this.controlledId = options.team === 'T' ? 0 : 5
    this.resetRound(); this.requestLock()
  }

  requestLock() {
    this.audio.unlock()
    const result = this.renderer.domElement.requestPointerLock()
    if (result && typeof result.catch === 'function') void result.catch(() => undefined)
  }

  dispose() {
    this.disposed = true; cancelAnimationFrame(this.raf)
    window.removeEventListener('resize', this.resize)
    document.removeEventListener('keydown', this.onKeyDown)
    document.removeEventListener('keyup', this.onKeyUp)
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mousedown', this.onMouseDown)
    document.removeEventListener('mouseup', this.onMouseUp)
    document.removeEventListener('contextmenu', this.onContextMenu)
    this.renderer.dispose(); this.renderer.domElement.remove()
  }

  private createAgents() {
    const spawn = (id: number, team: Team, name: string) => {
      const made = createCharacter(id, team); this.scene.add(made.group)
      const agent: Agent = {
        id, team, name, isBot: true, alive: true, hp: 100, armor: 0, position: new THREE.Vector3(), velocity: new THREE.Vector3(),
        yaw: team === 'T' ? Math.PI : 0, pitch: 0, group: made.group, hitMeshes: made.hitMeshes, inventory: {}, activeSlot: 'secondary',
        lastShot: -10, reloadUntil: 0, hasBomb: false, visibleToPlayer: false,
        ai: { state: 'patrol', targetId: null, navPath: [], navCursor: 0, repathAt: 0, actionProgress: 0, aimError: .08 + Math.random() * .08, waypoint: 0 },
      }
      this.agents.push(agent); this.hitObjects.push(...made.hitMeshes)
    }
    T_NAMES.forEach((n, i) => spawn(i, 'T', n)); CT_NAMES.forEach((n, i) => spawn(i + 5, 'CT', n))
  }

  private resetRound() {
    this.phase = 'live'; this.banner = ''; this.roundTime = 120; this.scoped = false; this.recoilSpread = 0
    this.bombTarget = Math.random() > .5 ? 'A' : 'B'
    this.agents.forEach((a, i) => {
      a.alive = true; a.hp = 100; a.velocity.set(0,0,0); a.hasBomb = false; a.group.visible = true
      a.position.copy(a.team === 'T' ? new THREE.Vector3(-3 + (i % 5) * 1.5, 0, 54 + (i % 2) * 1.6) : new THREE.Vector3(2 + (i % 5) * 1.8, 0, -38 + (i % 2) * 1.5))
      a.yaw = a.team === 'T' ? Math.PI : 0; a.pitch = 0; a.lastShot = -10; a.reloadUntil = 0
      a.ai = { state: 'patrol', targetId: null, navPath: [], navCursor: 0, repathAt: 0, actionProgress: 0, aimError: .055 + Math.random() * .1, waypoint: 0 }
      giveLoadout(a, this.mode === 'pistol', !this.mode.includes('pistol') && (i === 2 || i === 7))
      syncHeldWeapon(a); a.group.position.copy(a.position)
    })
    const eligible = this.agents.filter(a => a.team === 'T')
    const carrier = eligible[Math.floor(Math.random() * eligible.length)]
    carrier.hasBomb = true; this.bomb.carrierId = carrier.id; this.bomb.state = 'carried'; this.bomb.site = null; this.bomb.timer = 40; this.bomb.beepAt = 0
    this.bomb.mesh.visible = false; this.bomb.position.copy(carrier.position)
    this.setControlled(this.playerTeam === 'T' ? 0 : 5)
    this.publish()
  }

  private setControlled(id: number) {
    const previous = this.agents[this.controlledId]
    if (previous) { previous.isBot = previous.alive; previous.group.visible = previous.alive }
    this.controlledId = id; const next = this.agents[id]; next.isBot = false; next.group.visible = false
    this.scoped = false; this.viewModel.setWeapon(activeItem(next).id)
  }

  private createBomb(): BombState {
    const g = new THREE.Group(); g.visible = false
    const block = new THREE.Mesh(new THREE.BoxGeometry(.42, .18, .3), new THREE.MeshStandardMaterial({ color: 0x333a2c, roughness: .8 }))
    const display = new THREE.Mesh(new THREE.BoxGeometry(.18, .08, .015), new THREE.MeshBasicMaterial({ color: 0x5cff54 }))
    display.position.set(0, .03, -.158); g.add(block, display)
    const wires = [0xff4638, 0xf3cf35, 0x3d75ff].map((color, i) => {
      const w = new THREE.Mesh(new THREE.TorusGeometry(.13 + i * .025, .012, 5, 12, Math.PI), new THREE.MeshBasicMaterial({ color }))
      w.rotation.x = Math.PI / 2; w.position.set(0, .12, .02 + i * .035); return w
    }); g.add(...wires)
    const light = new THREE.PointLight(0xff2515, 0, 3); light.name = 'bombLight'; light.position.y = .25; g.add(light)
    this.scene.add(g)
    return { state: 'carried', carrierId: null, position: new THREE.Vector3(), site: null, timer: 40, beepAt: 0, mesh: g }
  }

  private installEvents() {
    window.addEventListener('resize', this.resize)
    document.addEventListener('keydown', this.onKeyDown)
    document.addEventListener('keyup', this.onKeyUp)
    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mousedown', this.onMouseDown)
    document.addEventListener('mouseup', this.onMouseUp)
    document.addEventListener('contextmenu', this.onContextMenu)
  }

  private resize = () => {
    const w = this.container.clientWidth || innerWidth, h = this.container.clientHeight || innerHeight
    this.camera.aspect = w / h; this.camera.updateProjectionMatrix(); this.renderer.setSize(w, h, false)
  }

  private onKeyDown = (e: KeyboardEvent) => {
    this.keys.add(e.code)
    if (['Space','KeyE'].includes(e.code)) e.preventDefault()
    if (this.phase === 'ready' || document.pointerLockElement !== this.renderer.domElement) {
      if (e.code === 'Escape') return
      if (this.phase !== 'ready') this.requestLock()
    }
    const a = this.agents[this.controlledId]
    if (!a) return
    if (!a.alive && e.code === 'KeyE') { this.takeOverNext(); return }
    if (!a.alive && e.code === 'KeyQ') { this.spectateNext(); return }
    if (e.code === 'Digit1') this.changeSlot('primary')
    if (e.code === 'Digit2') this.changeSlot('secondary')
    if (e.code === 'Digit3') this.changeSlot('melee')
    if (this.mode === 'rifle' && e.code === 'Digit4') this.practiceEquip('ak47')
    if (this.mode === 'rifle' && e.code === 'Digit5') this.practiceEquip('m4a4')
    if (this.mode === 'rifle' && e.code === 'Digit6') this.practiceEquip('awp')
    if (this.mode === 'rifle' && e.code === 'Digit7') this.practiceEquip('deagle')
    if (e.code === 'KeyR') this.reload(a)
    if (e.code === 'KeyE') this.useHeld = true
  }
  private onKeyUp = (e: KeyboardEvent) => { this.keys.delete(e.code); if (e.code === 'KeyE') this.useHeld = false }
  private onMouseMove = (e: MouseEvent) => {
    if (document.pointerLockElement !== this.renderer.domElement || this.phase !== 'live') return
    const a = this.agents[this.controlledId]; if (!a?.alive) return
    a.yaw -= e.movementX * .00175; a.pitch -= e.movementY * .00155; a.pitch = THREE.MathUtils.clamp(a.pitch, -1.45, 1.45)
  }
  private onMouseDown = (e: MouseEvent) => {
    if (e.target !== this.renderer.domElement && document.pointerLockElement !== this.renderer.domElement) return
    this.audio.unlock()
    if (document.pointerLockElement !== this.renderer.domElement) { this.requestLock(); return }
    if (e.button === 0) { this.fireHeld = true; this.triggerLatched = false; this.fireControlled() }
    if (e.button === 2) this.toggleScope()
  }
  private onMouseUp = (e: MouseEvent) => { if (e.button === 0) { this.fireHeld = false; this.triggerLatched = false } }
  private onContextMenu = (e: Event) => e.preventDefault()

  private changeSlot(slot: 'primary' | 'secondary' | 'melee') {
    const a = this.agents[this.controlledId]; if (!a?.alive) return
    switchSlot(a, slot); this.scoped = false; this.viewModel.setWeapon(activeItem(a).id); syncHeldWeapon(a); this.publish()
  }
  private practiceEquip(id: WeaponId) {
    const a = this.agents[this.controlledId]; if (!a?.alive) return
    equipPracticeWeapon(a, id); this.scoped = false; this.viewModel.setWeapon(id); syncHeldWeapon(a); this.publish()
  }
  private toggleScope() {
    const a = this.agents[this.controlledId]; if (!a?.alive || activeItem(a).id !== 'awp') return
    this.scoped = !this.scoped; this.audio.scope()
  }
  private reload(a: Agent) {
    const item = activeItem(a), w = WEAPONS[item.id], now = performance.now() / 1000
    if (!a.alive || w.slot === 'melee' || item.ammo >= w.magazine || item.reserve <= 0 || a.reloadUntil > now) return
    a.reloadUntil = now + w.reloadTime; this.scoped = false
    if (a.id === this.controlledId) this.audio.reload()
  }

  private loop = () => {
    if (this.disposed) return
    this.raf = requestAnimationFrame(this.loop)
    const now = performance.now() / 1000; const dt = Math.min(.04, now - this.lastFrameTime); this.lastFrameTime = now
    if (this.phase === 'ready') this.updatePreview(dt)
    else {
      if (this.phase === 'live') this.updateGame(dt, now)
      else if (now >= this.roundResetAt) { this.round++; this.resetRound() }
      this.updateCamera(dt)
    }
    this.flash.intensity = THREE.MathUtils.damp(this.flash.intensity, 0, 25, dt)
    this.renderer.render(this.scene, this.camera)
    if (now - this.lastSnapshot > .08) { this.lastSnapshot = now; this.publish() }
  }

  private updatePreview(dt: number) {
    this.previewAngle += dt * .09
    this.camera.position.set(Math.sin(this.previewAngle) * 53, 44, Math.cos(this.previewAngle) * 53 + 5)
    this.camera.lookAt(0, 0, 3); this.viewModel.group.visible = false
  }

  private updateGame(dt: number, now: number) {
    this.roundTime -= dt
    const controlled = this.agents[this.controlledId]
    if (controlled?.alive) this.updatePlayer(controlled, dt, now)
    this.completeReloads(now)
    for (const a of this.agents) if (a.alive && a.id !== this.controlledId) this.updateAI(a, dt, now)
    this.updateBomb(dt, now)
    this.updateVisibility()
    this.checkRoundEnd()
    if (this.roundTime <= 0 && this.bomb.state !== 'planted') this.endRound('CT', '时间耗尽 · CT 守住阵地')
  }

  private updatePlayer(a: Agent, dt: number, now: number) {
    const forward = new THREE.Vector3(-Math.sin(a.yaw), 0, -Math.cos(a.yaw))
    const right = new THREE.Vector3(Math.cos(a.yaw), 0, -Math.sin(a.yaw))
    const wish = new THREE.Vector3()
    if (this.keys.has('KeyW')) wish.add(forward); if (this.keys.has('KeyS')) wish.sub(forward)
    if (this.keys.has('KeyD')) wish.add(right); if (this.keys.has('KeyA')) wish.sub(right)
    const moving = wish.lengthSq() > 0
    if (moving) wish.normalize().multiplyScalar(activeItem(a).id === 'knife' ? 7.1 : this.scoped ? 3 : 5.8)
    a.velocity.x = THREE.MathUtils.damp(a.velocity.x, wish.x, moving ? 18 : 12, dt)
    a.velocity.z = THREE.MathUtils.damp(a.velocity.z, wish.z, moving ? 18 : 12, dt)
    if (this.keys.has('Space') && a.position.y <= .001) a.velocity.y = 6.2
    a.velocity.y -= 17.5 * dt
    this.moveAgent(a, a.velocity.x * dt, a.velocity.z * dt)
    a.position.y = Math.max(0, a.position.y + a.velocity.y * dt); if (a.position.y <= 0) a.velocity.y = 0
    a.group.position.copy(a.position); a.group.rotation.y = a.yaw
    if (moving && a.position.y === 0 && now - this.lastStep > .34) { this.lastStep = now; this.audio.step() }
    if (this.fireHeld && WEAPONS[activeItem(a).id].automatic) this.fireControlled()
    this.recoilSpread = THREE.MathUtils.damp(this.recoilSpread, moving ? .008 : 0, 5, dt)
    this.handlePlayerObjective(a, dt)
    this.viewModel.update(dt, moving, this.scoped)
  }

  private moveAgent(a: Agent, dx: number, dz: number) {
    const radius = .4
    const nx = a.position.clone(); nx.x += dx
    if (!this.collides(nx, radius)) a.position.x = nx.x
    const nz = a.position.clone(); nz.z += dz
    if (!this.collides(nz, radius)) a.position.z = nz.z
    a.position.x = THREE.MathUtils.clamp(a.position.x, WORLD_BOUNDS.minX + 1, WORLD_BOUNDS.maxX - 1)
    a.position.z = THREE.MathUtils.clamp(a.position.z, WORLD_BOUNDS.minZ + 1, WORLD_BOUNDS.maxZ - 1)
  }

  private collides(p: THREE.Vector3, radius: number) {
    for (const { box } of this.map.colliders) {
      if (box.max.y < p.y + .1 || box.min.y > p.y + 1.7) continue
      const x = THREE.MathUtils.clamp(p.x, box.min.x, box.max.x), z = THREE.MathUtils.clamp(p.z, box.min.z, box.max.z)
      if ((p.x-x)*(p.x-x) + (p.z-z)*(p.z-z) < radius*radius) return true
    }
    return false
  }

  private fireControlled() {
    const a = this.agents[this.controlledId]; if (!a?.alive || this.phase !== 'live') return
    const item = activeItem(a), w = WEAPONS[item.id], now = performance.now() / 1000
    if (!w.automatic && this.triggerLatched) return
    this.triggerLatched = true
    if (a.reloadUntil > now || now - a.lastShot < w.fireInterval) return
    if (item.ammo <= 0) { this.reload(a); return }
    a.lastShot = now; if (w.slot !== 'melee') item.ammo--
    this.audio.shot(w); this.flash.intensity = w.id === 'awp' ? 7 : 3.2
    const direction = new THREE.Vector3(); this.camera.getWorldDirection(direction)
    const spread = w.spread + this.recoilSpread + (a.position.y > 0 ? .025 : 0) + (!this.scoped && w.id === 'awp' ? .075 : 0)
    direction.x += (Math.random() - .5) * spread; direction.y += (Math.random() - .5) * spread; direction.z += (Math.random() - .5) * spread; direction.normalize()
    this.castShot(a, this.camera.getWorldPosition(new THREE.Vector3()), direction, w.range, item.id)
    a.pitch = Math.min(1.45, a.pitch + w.recoil * (.75 + Math.random() * .5))
    this.recoilSpread = Math.min(.1, this.recoilSpread + w.recoil * .52); this.viewModel.kick(w.recoil)
    if (w.id === 'awp') this.scoped = false
  }

  private castShot(shooter: Agent, origin: THREE.Vector3, direction: THREE.Vector3, range: number, weaponId: WeaponId) {
    const ray = new THREE.Raycaster(origin, direction, 0, range)
    const objects = [...this.map.raycastMeshes, ...this.hitObjects.filter(o => {
      const owner = this.agents[o.userData.agentId]; return owner?.alive && owner.id !== shooter.id
    })]
    const hit = ray.intersectObjects(objects, false)[0]
    this.spawnTracer(origin, hit?.point ?? origin.clone().addScaledVector(direction, range), WEAPONS[weaponId].color)
    if (!hit?.object.userData.zone) return
    const target = this.agents[hit.object.userData.agentId]
    if (!target || target.team === shooter.team || !target.alive) return
    this.damage(target, shooter, weaponId, hit.object.userData.zone as Zone)
  }

  private spawnTracer(from: THREE.Vector3, to: THREE.Vector3, color: number) {
    const points = [from.clone(), to.clone()]
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: color === 0x151719 ? 0xffd081 : 0xffefb0, transparent: true, opacity: .7 }))
    this.scene.add(line); setTimeout(() => { this.scene.remove(line); line.geometry.dispose(); (line.material as THREE.Material).dispose() }, 42)
  }

  private damage(target: Agent, shooter: Agent, weaponId: WeaponId, zone: Zone) {
    const w = WEAPONS[weaponId]
    let amount = w.damage * ZONE_DAMAGE[zone] * (.94 + Math.random() * .12)
    if (target.armor > 0 && zone !== 'leg') {
      const absorbed = amount * .28; amount *= .72; target.armor = Math.max(0, target.armor - absorbed * .65)
    }
    target.hp -= amount
    if (shooter.id === this.controlledId) this.audio.hit()
    if (target.hp <= 0) this.kill(target, shooter, weaponId, zone === 'head')
  }

  private kill(victim: Agent, killer: Agent, weaponId: WeaponId, headshot: boolean) {
    victim.hp = 0; victim.alive = false; victim.group.visible = false; victim.velocity.set(0,0,0)
    if (victim.hasBomb) {
      victim.hasBomb = false; this.bomb.state = 'dropped'; this.bomb.carrierId = null; this.bomb.position.copy(victim.position)
      this.bomb.position.y = .12; this.bomb.mesh.position.copy(this.bomb.position); this.bomb.mesh.visible = true
    }
    this.killfeed.unshift({ id: ++this.killSerial, killer: killer.name, victim: victim.name, weapon: WEAPONS[weaponId].shortName, headshot, team: killer.team })
    this.killfeed = this.killfeed.slice(0, 5)
    if (killer.id === this.controlledId) this.audio.kill()
    if (victim.id === this.controlledId) { this.scoped = false; this.banner = '你已阵亡 · E 接管队友 / Q 切换视角' }
  }

  private completeReloads(now: number) {
    for (const a of this.agents) if (a.reloadUntil && now >= a.reloadUntil) {
      const item = activeItem(a), w = WEAPONS[item.id], take = Math.min(w.magazine - item.ammo, item.reserve)
      item.ammo += take; item.reserve -= take; a.reloadUntil = 0
    }
  }

  private updateAI(a: Agent, dt: number, now: number) {
    const enemy = this.findVisibleEnemy(a)
    if (enemy) {
      a.ai.state = 'engage'; a.ai.targetId = enemy.id; this.aiEngage(a, enemy, dt, now)
    } else {
      a.ai.targetId = null; this.aiObjective(a, dt, now)
    }
    a.group.position.copy(a.position); a.group.rotation.y = a.yaw
  }

  private findVisibleEnemy(a: Agent) {
    const range = activeItem(a).id === 'awp' ? 55 : 31
    let closest: Agent | null = null, best = range * range
    for (const e of this.agents) {
      if (!e.alive || e.team === a.team) continue
      const d = a.position.distanceToSquared(e.position); if (d >= best) continue
      const dir = e.position.clone().sub(a.position).normalize()
      const forward = new THREE.Vector3(-Math.sin(a.yaw), 0, -Math.cos(a.yaw))
      if (forward.dot(dir) < -.2 && a.ai.state !== 'engage') continue
      if (!this.lineClear(a.position.clone().add(new THREE.Vector3(0,1.55,0)), e.position.clone().add(new THREE.Vector3(0,1.25,0)))) continue
      closest = e; best = d
    }
    return closest
  }

  private lineClear(from: THREE.Vector3, to: THREE.Vector3) {
    const delta = to.clone().sub(from), distance = delta.length()
    const ray = new THREE.Raycaster(from, delta.normalize(), 0, distance)
    return ray.intersectObjects(this.map.raycastMeshes, false).length === 0
  }

  private aiEngage(a: Agent, enemy: Agent, dt: number, now: number) {
    const to = enemy.position.clone().sub(a.position); const dist = to.length()
    const desiredYaw = Math.atan2(-to.x, -to.z); a.yaw = this.lerpAngle(a.yaw, desiredYaw, Math.min(1, dt * 7))
    // Bots hold angles but gently strafe when too exposed.
    if (dist > (activeItem(a).id === 'awp' ? 22 : 12)) this.aiMoveToward(a, enemy.position, dt, .48)
    else if (Math.random() < .018) this.moveAgent(a, Math.cos(a.yaw) * (Math.random()-.5), -Math.sin(a.yaw) * (Math.random()-.5))
    const item = activeItem(a), w = WEAPONS[item.id]
    if (item.ammo === 0) { this.reload(a); return }
    if (a.reloadUntil > now || now - a.lastShot < w.fireInterval * (w.automatic ? 1.35 : 1.7)) return
    a.lastShot = now; if (w.slot !== 'melee') item.ammo--
    if (a.position.distanceTo(this.agents[this.controlledId].position) < 42) this.audio.shot(w)
    const origin = a.position.clone().add(new THREE.Vector3(0,1.5,0))
    const aim = enemy.position.clone().add(new THREE.Vector3(0, activeItem(a).id === 'awp' ? 1.38 : 1.2, 0)).sub(origin).normalize()
    const error = a.ai.aimError * THREE.MathUtils.clamp(dist / 28, .35, 1.2)
    aim.x += (Math.random()-.5)*error; aim.y += (Math.random()-.5)*error; aim.z += (Math.random()-.5)*error; aim.normalize()
    this.castShot(a, origin, aim, w.range, item.id)
  }

  private aiObjective(a: Agent, dt: number, now: number) {
    let target: THREE.Vector3
    if (this.bomb.state === 'planted' && a.team === 'CT') {
      a.ai.state = 'defuse'; target = this.bomb.position
      if (a.position.distanceTo(target) < 1.35) {
        a.ai.actionProgress += dt
        if (a.ai.actionProgress >= 5) { this.bomb.state = 'defused'; this.audio.defuse(); this.endRound('CT', '炸弹已拆除 · CT 胜利') }
        return
      }
    } else if (this.bomb.state === 'dropped' && a.team === 'T') {
      a.ai.state = 'pickup'; target = this.bomb.position
    } else if (a.team === 'T' && a.hasBomb) {
      a.ai.state = 'plant'; target = SITES.find(s => s.id === this.bombTarget)!.center
      if (pointInSite(a.position)) {
        a.ai.actionProgress += dt
        if (a.ai.actionProgress >= 3.1) this.plantBomb(a, pointInSite(a.position)!)
        return
      }
    } else {
      a.ai.state = 'patrol'
      const attackChoices = this.bombTarget === 'A' ? [4,8,3] : [14,11,7]
      const defendChoices = [4,14,7,13]
      const choices = a.team === 'T' ? attackChoices : defendChoices
      if (!a.ai.waypoint || now > a.ai.repathAt + 4) a.ai.waypoint = choices[(a.id + this.round + Math.floor(now / 12)) % choices.length]
      target = NAV_NODES[a.ai.waypoint].position
    }
    this.aiFollowPath(a, target, dt, now)
  }

  private aiFollowPath(a: Agent, target: THREE.Vector3, dt: number, now: number) {
    if (!a.ai.navPath.length || now > a.ai.repathAt) {
      a.ai.navPath = findPath(a.position, target); a.ai.navCursor = Math.min(1, a.ai.navPath.length - 1); a.ai.repathAt = now + 2.4 + Math.random()
    }
    let point = a.ai.navPath.length ? NAV_NODES[a.ai.navPath[a.ai.navCursor]].position : target
    if (a.position.distanceTo(point) < 1.25 && a.ai.navCursor < a.ai.navPath.length - 1) { a.ai.navCursor++; point = NAV_NODES[a.ai.navPath[a.ai.navCursor]].position }
    if (a.ai.navCursor >= a.ai.navPath.length - 1 && a.position.distanceTo(point) < 1.5) point = target
    this.aiMoveToward(a, point, dt, 1)
  }

  private aiMoveToward(a: Agent, target: THREE.Vector3, dt: number, speedFactor: number) {
    const d = target.clone().sub(a.position); d.y = 0; if (d.lengthSq() < .01) return; d.normalize()
    const desiredYaw = Math.atan2(-d.x, -d.z); a.yaw = this.lerpAngle(a.yaw, desiredYaw, Math.min(1, dt * 5))
    const before = a.position.clone(); this.moveAgent(a, d.x * dt * 4.25 * speedFactor, d.z * dt * 4.25 * speedFactor)
    if (before.distanceToSquared(a.position) < .000001) {
      // Wall slide fallback prevents agents from pinning themselves on convex corners.
      this.moveAgent(a, d.z * dt * 3.2, -d.x * dt * 3.2)
    }
  }

  private lerpAngle(a: number, b: number, t: number) {
    let d = (b-a+Math.PI)%(Math.PI*2)-Math.PI; if (d < -Math.PI) d += Math.PI*2; return a+d*t
  }

  private handlePlayerObjective(a: Agent, dt: number) {
    this.actionLabel = ''; this.actionProgress = 0
    if (!this.useHeld) { a.ai.actionProgress = 0; return }
    if (a.team === 'T' && a.hasBomb && this.bomb.state === 'carried') {
      const site = pointInSite(a.position)
      if (site) {
        this.actionLabel = `正在安放炸弹 · ${site} 点`; a.ai.actionProgress += dt; this.actionProgress = a.ai.actionProgress / 3.1
        if (a.ai.actionProgress >= 3.1) this.plantBomb(a, site)
        return
      }
    }
    if (a.team === 'CT' && this.bomb.state === 'planted' && a.position.distanceTo(this.bomb.position) < 1.5) {
      this.actionLabel = '正在拆除炸弹'; a.ai.actionProgress += dt; this.actionProgress = a.ai.actionProgress / 5
      if (a.ai.actionProgress >= 5) { this.bomb.state = 'defused'; this.audio.defuse(); this.endRound('CT', '炸弹已拆除 · CT 胜利') }
      return
    }
    a.ai.actionProgress = 0
  }

  private plantBomb(carrier: Agent, site: 'A' | 'B') {
    carrier.hasBomb = false; carrier.ai.actionProgress = 0
    this.bomb.state = 'planted'; this.bomb.carrierId = null; this.bomb.site = site; this.bomb.timer = 40
    this.bomb.position.copy(carrier.position).setY(.13); this.bomb.mesh.position.copy(this.bomb.position); this.bomb.mesh.visible = true
    this.audio.plant(); this.banner = `炸弹已安放 · ${site} 点`
  }

  private updateBomb(dt: number, now: number) {
    if (this.bomb.state === 'carried') {
      const carrier = this.agents.find(a => a.id === this.bomb.carrierId)
      if (carrier?.alive) this.bomb.position.copy(carrier.position)
    }
    if (this.bomb.state === 'dropped') {
      for (const a of this.agents) if (a.alive && a.team === 'T' && a.position.distanceTo(this.bomb.position) < 1.15) {
        a.hasBomb = true; this.bomb.state = 'carried'; this.bomb.carrierId = a.id; this.bomb.mesh.visible = false; this.audio.plant(); break
      }
    }
    if (this.bomb.state === 'planted') {
      this.bomb.timer -= dt
      const interval = THREE.MathUtils.lerp(.16, .92, THREE.MathUtils.clamp(this.bomb.timer / 40, 0, 1))
      if (now >= this.bomb.beepAt) { this.bomb.beepAt = now + interval; this.audio.beep(this.bomb.timer < 8); (this.bomb.mesh.getObjectByName('bombLight') as THREE.PointLight).intensity = 2.5; setTimeout(() => { const l = this.bomb.mesh.getObjectByName('bombLight') as THREE.PointLight | undefined; if (l) l.intensity = 0 }, 80) }
      this.bomb.mesh.rotation.y += dt * .7
      if (this.bomb.timer <= 0) { this.bomb.state = 'exploded'; this.bomb.mesh.visible = false; this.audio.explode(); this.explosionVisual(); this.endRound('T', 'C4 爆炸 · T 胜利') }
    }
  }

  private explosionVisual() {
    const light = new THREE.PointLight(0xff6a20, 32, 38); light.position.copy(this.bomb.position).setY(2); this.scene.add(light)
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), new THREE.MeshBasicMaterial({ color: 0xffa226, transparent: true, opacity: .9 }))
    sphere.position.copy(this.bomb.position); this.scene.add(sphere)
    let s = 1
    const tick = () => { s += 1.6; sphere.scale.setScalar(s); (sphere.material as THREE.MeshBasicMaterial).opacity -= .06; light.intensity *= .8; if (s < 16) requestAnimationFrame(tick); else { this.scene.remove(sphere, light) } }; tick()
  }

  private updateVisibility() {
    const friends = this.agents.filter(a => a.alive && a.team === this.playerTeam)
    for (const enemy of this.agents) {
      if (enemy.team === this.playerTeam) { enemy.visibleToPlayer = true; continue }
      enemy.visibleToPlayer = friends.some(f => f.position.distanceToSquared(enemy.position) < 38*38 && this.lineClear(f.position.clone().add(new THREE.Vector3(0,1.5,0)), enemy.position.clone().add(new THREE.Vector3(0,1.2,0))))
    }
  }

  private checkRoundEnd() {
    if (this.phase !== 'live') return
    const tAlive = this.agents.some(a => a.team === 'T' && a.alive), ctAlive = this.agents.some(a => a.team === 'CT' && a.alive)
    if (!ctAlive) this.endRound('T', 'CT 全员阵亡 · T 胜利')
    else if (!tAlive && this.bomb.state !== 'planted') this.endRound('CT', 'T 全员阵亡 · CT 胜利')
  }

  private endRound(winner: Team, message: string) {
    if (this.phase !== 'live') return
    this.phase = 'roundEnd'; this.score[winner]++; this.banner = message; this.scoped = false
    this.roundResetAt = performance.now()/1000 + 5
  }

  private takeOverNext() {
    const living = this.agents.filter(a => a.team === this.playerTeam && a.alive)
    if (!living.length) return
    const next = living.find(a => a.id > this.controlledId) ?? living[0]
    this.banner = `已接管 ${next.name}`; this.setControlled(next.id)
  }

  private spectateNext() {
    const living = this.agents.filter(a => a.team === this.playerTeam && a.alive)
    if (!living.length) return
    const next = living.find(a => a.id > this.controlledId) ?? living[0]
    this.controlledId = next.id; this.viewModel.setWeapon(activeItem(next).id)
  }

  private updateCamera(dt: number) {
    const a = this.agents[this.controlledId]; if (!a) return
    if (!a.alive) {
      const living = this.agents.filter(x => x.team === this.playerTeam && x.alive)
      if (living.length) {
        const target = living[0]; this.camera.position.lerp(target.position.clone().add(new THREE.Vector3(0,3.3,5)), .08); this.camera.lookAt(target.position.clone().add(new THREE.Vector3(0,1,0)))
      }
      this.viewModel.group.visible = false; return
    }
    this.camera.position.copy(a.position).add(new THREE.Vector3(0,1.66,0))
    this.camera.rotation.set(a.pitch, a.yaw, 0)
    const wantedFov = this.scoped ? 24 : 74; this.camera.fov = THREE.MathUtils.damp(this.camera.fov, wantedFov, 14, dt); this.camera.updateProjectionMatrix()
    this.viewModel.group.visible = !this.scoped
  }

  private publish() {
    const a = this.agents[this.controlledId]
    const item = a ? activeItem(a) : { id: 'usp' as WeaponId, ammo: 12, reserve: 48 }
    const spec = WEAPONS[item.id]
    this.listener({
      phase: this.phase, mode: this.mode, team: this.playerTeam, round: this.round, time: Math.max(0, this.roundTime),
      scoreT: this.score.T, scoreCT: this.score.CT, hp: Math.ceil(a?.hp ?? 100), armor: Math.ceil(a?.armor ?? 0), weapon: item.id,
      weaponName: spec.name, ammo: item.ammo, reserve: item.reserve, reloading: !!a?.reloadUntil,
      spread: this.recoilSpread, scoped: this.scoped, kills: this.killfeed, actionLabel: this.actionLabel, actionProgress: this.actionProgress,
      banner: this.banner, location: a ? getLocation(a.position) : 'TACTICAL MAP', spectator: !!a && !a.alive,
      agents: this.agents.map(x => ({ id:x.id, name:x.name, team:x.team, alive:x.alive, hp:Math.ceil(x.hp), armor:Math.ceil(x.armor), x:x.position.x, z:x.position.z, yaw:x.yaw, visible:x.visibleToPlayer, controlled:x.id===this.controlledId, hasBomb:x.hasBomb })),
      bomb: { state:this.bomb.state, x:this.bomb.position.x, z:this.bomb.position.z, site:this.bomb.site, timer:this.bomb.timer, carrierName:this.bomb.carrierId === null ? null : this.agents[this.bomb.carrierId]?.name ?? null },
    })
  }
}
