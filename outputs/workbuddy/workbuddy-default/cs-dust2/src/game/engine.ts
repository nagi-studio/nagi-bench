import * as THREE from 'three'
import { AudioKit } from './audio'
import {
  buildMap, BOUNDS, T_SPAWNS, CT_SPAWNS, SITES,
} from './map'

export interface HudState {
  hp: number; armor: number; weapon: string; ammo: number; reserve: number
  killfeed: string[]; scoped: boolean; banner: string; hint: string; team: 'CT' | 'T'
  map: {
    player: { x: number; z: number; angle: number }
    allies: { x: number; z: number; alive: boolean }[]
    enemies: { x: number; z: number; alive: boolean; seen: boolean }[]
    bomb: { x: number; z: number } | null
    bounds: typeof BOUNDS
  }
}

interface WDef {
  id: string; name: string; dmg: number; rpm: number; spread: number; recoil: number
  mag: number; reserve: number; auto: boolean; scoped: boolean; melee: boolean
}

const WEAPONS: Record<string, WDef> = {
  knife: { id: 'Knife', name: 'Knife', dmg: 55, rpm: 150, spread: 0, recoil: 0, mag: 1, reserve: 1, auto: false, scoped: false, melee: true },
  glock: { id: 'Glock', name: 'Glock', dmg: 24, rpm: 400, spread: 0.02, recoil: 0.012, mag: 20, reserve: 120, auto: false, scoped: false, melee: false },
  usp: { id: 'USP', name: 'USP', dmg: 26, rpm: 360, spread: 0.018, recoil: 0.011, mag: 18, reserve: 108, auto: false, scoped: false, melee: false },
  deagle: { id: 'Deagle', name: 'Deagle', dmg: 54, rpm: 240, spread: 0.03, recoil: 0.03, mag: 7, reserve: 42, auto: false, scoped: false, melee: false },
  ak47: { id: 'AK-47', name: 'AK-47', dmg: 34, rpm: 600, spread: 0.025, recoil: 0.05, mag: 30, reserve: 120, auto: true, scoped: false, melee: false },
  m4a4: { id: 'M4A4', name: 'M4A4', dmg: 30, rpm: 666, spread: 0.02, recoil: 0.03, mag: 30, reserve: 120, auto: true, scoped: false, melee: false },
  awp: { id: 'AWP', name: 'AWP', dmg: 115, rpm: 48, spread: 0, recoil: 0, mag: 10, reserve: 40, auto: false, scoped: true, melee: false },
}

const EYE = 1.6
const RADIUS = 0.35

interface Ammo { mag: number; reserve: number }
type Team = 'CT' | 'T'

class Character {
  team: Team
  name: string
  pos = new THREE.Vector3()
  yaw = 0
  pitch = 0
  vel = new THREE.Vector3()
  hp = 100
  armor = 100
  alive = true
  isPlayer = false
  respawn = 0
  group: THREE.Group
  weapon: string
  ammo: Record<string, Ammo> = {}
  fireCd = 0
  reloadT = 0
  reloading = false
  aiTimer = 0
  aiTarget: Character | null = null
  bombCarrier = false
  head = new THREE.Box3()
  body = new THREE.Box3()
  legs = new THREE.Box3()

  constructor(team: Team, name: string, color: number, weapon: string) {
    this.team = team
    this.name = name
    this.weapon = weapon
    this.group = this.build(color)
    for (const id of Object.keys(WEAPONS)) this.ammo[id] = { mag: WEAPONS[id].mag, reserve: WEAPONS[id].reserve }
  }

  private build(color: number): THREE.Group {
    const g = new THREE.Group()
    const mat = new THREE.MeshLambertMaterial({ color })
    const skin = new THREE.MeshLambertMaterial({ color: 0xe0b48c })
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.45), skin); head.position.y = 1.62
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.85, 0.4), mat); torso.position.y = 1.05
    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.7, 0.18), mat); armL.position.set(-0.42, 1.05, 0)
    const armR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.7, 0.18), mat); armR.position.set(0.42, 1.05, 0)
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.85, 0.22), mat); legL.position.set(-0.16, 0.42, 0)
    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.85, 0.22), mat); legR.position.set(0.16, 0.42, 0)
    for (const m of [head, torso, armL, armR, legL, legR]) { m.castShadow = true; g.add(m) }
    return g
  }

  syncMesh() {
    this.group.position.copy(this.pos)
    this.group.rotation.y = this.yaw
    this.group.visible = this.alive
    this.head.setFromCenterAndSize(
      new THREE.Vector3(this.pos.x, this.pos.y + 1.62, this.pos.z), new THREE.Vector3(0.45, 0.45, 0.45))
    this.body.setFromCenterAndSize(
      new THREE.Vector3(this.pos.x, this.pos.y + 1.05, this.pos.z), new THREE.Vector3(0.6, 0.85, 0.4))
    this.legs.setFromCenterAndSize(
      new THREE.Vector3(this.pos.x, this.pos.y + 0.42, this.pos.z), new THREE.Vector3(0.5, 0.85, 0.4))
  }
}

export class Engine {
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 400)
  private renderer: THREE.WebGLRenderer
  private audio = new AudioKit()
  private clock = new THREE.Clock()
  private colliders: THREE.Box3[] = []
  private chars: Character[] = []
  private player!: Character
  private controlled!: Character
  private yaw = 0
  private pitch = 0
  private scoped = false
  private keys: Record<string, boolean> = {}
  private firing = false
  private started = false
  private locked = false
  private raf = 0
  private listeners: ((s: HudState) => void)[] = []
  private killfeed: string[] = []
  private banner = ''
  private bannerT = 0
  private hint = ''
  private bomb: { planted: boolean; pos: THREE.Vector3; timer: number; defuse: number; carrier: Character | null } =
    { planted: false, pos: new THREE.Vector3(), timer: 0, defuse: 0, carrier: null }
  private round = 0
  private hudAccum = 0
  private roundOver = false

  constructor(private container: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    this.renderer.setSize(container.clientWidth, container.clientHeight)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(this.renderer.domElement)

    this.scene.background = new THREE.Color(0x0e1218)
    this.scene.fog = new THREE.Fog(0x0e1218, 40, 180)
    const sun = new THREE.DirectionalLight(0xffffff, 1.4)
    sun.position.set(30, 60, 20); sun.castShadow = true
    sun.shadow.mapSize.set(2048, 2048); sun.shadow.camera.far = 200
    sun.shadow.camera.left = -60; sun.shadow.camera.right = 60
    sun.shadow.camera.top = 60; sun.shadow.camera.bottom = -60
    this.scene.add(sun)
    this.scene.add(new THREE.HemisphereLight(0xbcd6ff, 0x2a2a2a, 0.6))

    const { colliders } = buildMap(this.scene)
    this.colliders = colliders
    this.spawnRound(true)

    addEventListener('resize', this.onResize)
    addEventListener('keydown', this.onKeyDown)
    addEventListener('keyup', this.onKeyUp)
    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mousedown', this.onMouseDown)
    document.addEventListener('mouseup', this.onMouseUp)
    document.addEventListener('pointerlockchange', this.onLockChange)
  }

  // ----- setup / rounds -----
  private spawnRound(initial: boolean) {
    this.roundOver = false
    if (initial) {
      // create characters once
      const ctColors = 0x2f6df0, tColors = 0xd14b3a
      this.player = new Character('CT', 'You', ctColors, 'm4a4')
      this.player.isPlayer = true
      this.chars.push(this.player)
      const allies = ['Ally-1', 'Ally-2', 'Ally-3', 'Ally-4']
      allies.forEach((n, i) => {
        const c = new Character('CT', n, ctColors, i === 0 ? 'awp' : 'm4a4')
        this.chars.push(c)
      })
      for (let i = 0; i < 5; i++) {
        const c = new Character('T', 'Enemy-' + (i + 1), tColors, i === 1 ? 'awp' : 'ak47')
        if (i === 0) { c.bombCarrier = true; c.weapon = 'ak47' }
        if (i === 2) c.weapon = 'deagle'
        this.chars.push(c)
      }
      for (const c of this.chars) this.scene.add(c.group)
    }
    this.round++
    // reset
    const ct = this.chars.filter(c => c.team === 'CT')
    const t = this.chars.filter(c => c.team === 'T')
    ct.forEach((c, i) => this.resetChar(c, CT_SPAWNS[i % CT_SPAWNS.length]))
    t.forEach((c, i) => this.resetChar(c, T_SPAWNS[i % T_SPAWNS.length]))
    this.bomb = { planted: false, pos: new THREE.Vector3(), timer: 0, defuse: 0, carrier: t.find(c => c.bombCarrier) ?? null }
    this.controlled = this.player
    this.showBanner(this.round === 1 ? 'PISTOL ROUND' : 'ROUND ' + this.round, 2)
    this.hint = ''
  }

  private resetChar(c: Character, spawn: THREE.Vector3) {
    c.pos.copy(spawn); c.pos.y = 0
    c.hp = 100; c.armor = this.round === 1 ? 0 : 100
    c.alive = true; c.vel.set(0, 0, 0); c.respawn = 0
    c.weapon = c.team === 'CT' ? (c.isPlayer ? 'm4a4' : (c.bombCarrier ? 'm4a4' : 'm4a4')) : 'ak47'
    if (c.isPlayer) c.weapon = 'm4a4'
    for (const id of Object.keys(WEAPONS)) c.ammo[id] = { mag: WEAPONS[id].mag, reserve: WEAPONS[id].reserve }
    c.yaw = Math.random() * Math.PI * 2; c.pitch = 0; c.fireCd = 0; c.reloading = false; c.reloadT = 0
  }

  start() {
    this.audio.init()
    if (!this.started) { this.started = true; this.loop() }
    this.renderer.domElement.requestPointerLock?.()
  }

  dispose() {
    cancelAnimationFrame(this.raf)
    removeEventListener('resize', this.onResize)
    removeEventListener('keydown', this.onKeyDown)
    removeEventListener('keyup', this.onKeyUp)
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mousedown', this.onMouseDown)
    document.removeEventListener('mouseup', this.onMouseUp)
    document.removeEventListener('pointerlockchange', this.onLockChange)
    this.renderer.dispose()
  }

  // ----- input -----
  private onResize = () => {
    this.camera.aspect = innerWidth / innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
  }
  private onKeyDown = (e: KeyboardEvent) => {
    this.keys[e.code] = true
    if (!this.locked) return
    if (e.code === 'Digit1') this.switchWeapon('knife')
    if (e.code === 'Digit2') this.switchWeapon(this.player.team === 'CT' ? 'usp' : 'glock')
    if (e.code === 'Digit3') this.switchWeapon(this.player.team === 'CT' ? 'm4a4' : 'ak47')
    if (e.code === 'Digit4') this.switchWeapon('awp')
    if (e.code === 'Digit5') this.switchWeapon('deagle')
    if (e.code === 'KeyR') this.reload(this.controlled)
    if (e.code === 'KeyF') this.plantBomb()
    if (e.code === 'KeyE') this.defuseHeld = true
  }
  private onKeyUp = (e: KeyboardEvent) => { this.keys[e.code] = false; if (e.code === 'KeyE') this.defuseHeld = false }
  private defuseHeld = false
  private onMouseMove = (e: MouseEvent) => {
    if (!this.locked) return
    this.yaw -= e.movementX * 0.0022
    this.pitch -= e.movementY * 0.0022
    this.pitch = Math.max(-1.5, Math.min(1.5, this.pitch))
  }
  private onMouseDown = (e: MouseEvent) => {
    if (!this.locked) return
    if (e.button === 0) this.firing = true
    if (e.button === 2) {
      const w = WEAPONS[this.controlled.weapon]
      if (w.scoped) { this.scoped = !this.scoped; this.audio.scope(); this.camera.fov = this.scoped ? 35 : 75; this.camera.updateProjectionMatrix() }
      else this.firing = true
    }
  }
  private onMouseUp = (e: MouseEvent) => { if (e.button === 0) this.firing = false }
  private onLockChange = () => { this.locked = document.pointerLockElement === this.renderer.domElement }

  private switchWeapon(id: string) {
    if (this.controlled.ammo[id]) { this.controlled.weapon = id; this.scoped = false; this.camera.fov = 75; this.camera.updateProjectionMatrix() }
  }
  private reload(c: Character) {
    const a = c.ammo[c.weapon]; const w = WEAPONS[c.weapon]
    if (c.reloading || a.mag >= w.mag || a.reserve <= 0) return
    c.reloading = true; c.reloadT = 2.0; this.audio.reload()
  }

  // ----- combat -----
  private rayDir(spread: number): THREE.Vector3 {
    const e = new THREE.Euler(this.pitch, this.yaw, 0, 'YXZ')
    const d = new THREE.Vector3(0, 0, -1).applyEuler(e)
    if (spread > 0) {
      d.x += (Math.random() - 0.5) * spread * 2
      d.y += (Math.random() - 0.5) * spread * 2
      d.z += (Math.random() - 0.5) * spread * 2
    }
    return d.normalize()
  }

  private hasLOS(a: THREE.Vector3, b: THREE.Vector3): boolean {
    const dir = b.clone().sub(a)
    const dist = dir.length(); dir.normalize()
    const ray = new THREE.Ray(a, dir)
    for (const box of this.colliders) {
      const t = ray.intersectBox(box, new THREE.Vector3())
      if (t && t.distanceTo(a) < dist - 0.5) return false
    }
    return true
  }

  private hitscan(shooter: Character, from: THREE.Vector3, dir: THREE.Vector3): { target: Character; part: string; dist: number } | null {
    const ray = new THREE.Ray(from, dir)
    let best: { target: Character; part: string; dist: number } | null = null
    for (const c of this.chars) {
      if (c === shooter || !c.alive || c.team === shooter.team) continue
      for (const [part, box] of [['head', c.head], ['body', c.body], ['legs', c.legs]] as [string, THREE.Box3][]) {
        const hit = ray.intersectBox(box, new THREE.Vector3())
        if (hit) {
          const dist = hit.distanceTo(from)
          if (!best || dist < best.dist) best = { target: c, part, dist }
        }
      }
    }
    return best
  }

  private fire(c: Character) {
    const w = WEAPONS[c.weapon]
    const a = c.ammo[c.weapon]
    if (w.melee) { this.audio.shot('Knife'); return }
    if (a.mag <= 0) { this.reload(c); return }
    a.mag--
    this.audio.shot(c.weapon)
    if (c === this.controlled && !w.scoped) { this.pitch = Math.min(1.5, this.pitch + w.recoil) }
    const eye = new THREE.Vector3(c.pos.x, c.pos.y + EYE, c.pos.z)
    const dir = this.rayDir(w.spread + (c !== this.controlled ? 0.04 : 0))
    const hit = this.hitscan(c, eye, dir)
    if (hit) {
      let dmg = w.dmg * (hit.part === 'head' ? 2 : 1)
      if (hit.target.armor > 0 && hit.part !== 'head') {
        const absorbed = Math.min(hit.target.armor, dmg * 0.5)
        hit.target.armor -= absorbed; dmg -= absorbed * 0.5
      }
      hit.target.hp -= dmg
      if (c === this.controlled) this.audio.hit()
      if (hit.target.hp <= 0 && hit.target.alive) this.kill(c, hit.target)
    }
  }

  private kill(killer: Character, victim: Character) {
    victim.alive = false; victim.respawn = 3
    this.killfeed.push(`${killer.name} ▸ ${victim.name}`)
    if (this.killfeed.length > 6) this.killfeed.shift()
    if (victim === this.controlled) this.switchControl()
    this.checkRoundEnd()
  }

  private switchControl() {
    const ally = this.chars.find(c => c.team === this.controlled.team && c.alive && !c.isPlayer)
    if (ally) {
      this.controlled = ally
      this.yaw = ally.yaw; this.pitch = ally.pitch
      this.showBanner('接管 ' + ally.name, 1.2)
    }
  }

  private checkRoundEnd() {
    const ctAlive = this.chars.some(c => c.team === 'CT' && c.alive)
    const tAlive = this.chars.some(c => c.team === 'T' && c.alive)
    if (!ctAlive) this.win('T')
    else if (!tAlive) this.win('CT')
  }

  private endRound(winner: Team) { this.win(winner) }
  private win(winner: Team) {
    if (this.roundOver) return
    this.roundOver = true
    this.showBanner((winner === this.player.team ? '胜利' : '失败') + ' · ' + winner + ' WINS', 3)
    setTimeout(() => { if (this.started) { this.roundOver = false; this.spawnRound(false) } }, 3000)
  }

  private plantBomb() {
    if (this.controlled.team !== 'T' || !this.bomb.carrier || this.bomb.planted) return
    const site = SITES.find(s => Math.hypot(this.controlled.pos.x - s.x, this.controlled.pos.z - s.z) < s.r)
    if (!site) { this.hint = '需在 A 或 B 点位安包'; setTimeout(() => this.hint = '', 1500); return }
    this.bomb.planted = true; this.bomb.pos.copy(this.controlled.pos); this.bomb.timer = 40; this.bomb.carrier = null
    this.hint = 'C4 已安放！'
  }

  private showBanner(text: string, t: number) { this.banner = text; this.bannerT = t }

  // ----- physics -----
  private collide(p: THREE.Vector3) {
    for (const box of this.colliders) {
      const cx = Math.max(box.min.x, Math.min(p.x, box.max.x))
      const cz = Math.max(box.min.z, Math.min(p.z, box.max.z))
      const dx = p.x - cx, dz = p.z - cz
      const d2 = dx * dx + dz * dz
      if (d2 < RADIUS * RADIUS) {
        const d = Math.sqrt(d2) || 0.0001
        const push = (RADIUS - d) / d
        p.x += dx * push; p.z += dz * push
      }
    }
  }

  private moveCharacter(c: Character, fwd: THREE.Vector3, dt: number, speed: number) {
    c.pos.x += fwd.x * speed * dt
    c.pos.z += fwd.z * speed * dt
    this.collide(c.pos)
  }

  // ----- main loop -----
  private loop = () => {
    this.raf = requestAnimationFrame(this.loop)
    const dt = Math.min(this.clock.getDelta(), 0.05)
    if (this.locked) this.updatePlayer(dt)
    this.updateBots(dt)
    this.updateBomb(dt)
    this.syncAll()
    this.updateCamera()
    this.renderer.render(this.scene, this.camera)
    this.hudAccum += dt
    if (this.hudAccum > 0.08) { this.hudAccum = 0; this.emit() }
  }

  private updatePlayer(dt: number) {
    const c = this.controlled
    const speed = (this.keys['ShiftLeft'] ? 4.5 : 7)
    const fwd = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw))
    const right = new THREE.Vector3().crossVectors(fwd, new THREE.Vector3(0,1,0)).normalize()
    const mv = new THREE.Vector3()
    if (this.keys['KeyW']) mv.add(fwd)
    if (this.keys['KeyS']) mv.sub(fwd)
    if (this.keys['KeyD']) mv.add(right)
    if (this.keys['KeyA']) mv.sub(right)
    if (mv.lengthSq() > 0) mv.normalize()
    this.moveCharacter(c, mv, dt, speed)
    // gravity / jump
    c.vel.y -= 24 * dt
    c.pos.y += c.vel.y * dt
    if (c.pos.y <= 0) { c.pos.y = 0; c.vel.y = 0; if (this.keys['Space']) c.vel.y = 8 }
    // fire
    const w = WEAPONS[c.weapon]
    c.fireCd -= dt
    if (this.firing && !c.reloading && c.fireCd <= 0) {
      this.fire(c); c.fireCd = 60 / w.rpm
    }
    if (c.reloading) { c.reloadT -= dt; if (c.reloadT <= 0) { const a = c.ammo[c.weapon]; const need = w.mag - a.mag; const take = Math.min(need, a.reserve); a.mag += take; a.reserve -= take; c.reloading = false } }
    if (c.weapon === 'awp' && this.keys['KeyE']) { /* no-op */ }
  }

  private updateBots(dt: number) {
    for (const c of this.chars) {
      if (!c.alive || c.isPlayer) continue
      c.fireCd -= dt
      const enemy = this.nearestEnemy(c)
      if (!enemy) continue
      const toE = enemy.pos.clone().sub(c.pos)
      const dist = toE.length()
      const see = this.hasLOS(new THREE.Vector3(c.pos.x, c.pos.y + EYE, c.pos.z), new THREE.Vector3(enemy.pos.x, enemy.pos.y + EYE, enemy.pos.z))
      if (see) {
        c.yaw = Math.atan2(-toE.x, -toE.z)
        if (dist < 60 && c.fireCd <= 0) { this.fire(c); c.fireCd = 60 / WEAPONS[c.weapon].rpm }
      } else {
        // move toward enemy / objective
        const dir = toE.clone().setY(0).normalize()
        c.yaw = Math.atan2(-dir.x, -dir.z)
        this.moveCharacter(c, dir, dt, 4.5)
      }
      if (c.pos.y <= 0) c.pos.y = 0
    }
  }

  private nearestEnemy(c: Character): Character | null {
    let best: Character | null = null; let bd = Infinity
    for (const e of this.chars) {
      if (!e.alive || e.team === c.team) continue
      const d = e.pos.distanceTo(c.pos); if (d < bd) { bd = d; best = e }
    }
    return best
  }

  private updateBomb(dt: number) {
    if (this.bomb.planted) {
      this.bomb.timer -= dt
      this.hint = '炸弹倒计时 ' + Math.max(0, Math.ceil(this.bomb.timer)) + 's'
      if (this.defuseHeld && this.controlled.team === 'CT' && this.controlled.alive &&
          Math.hypot(this.controlled.pos.x - this.bomb.pos.x, this.controlled.pos.z - this.bomb.pos.z) < 3) {
        this.bomb.defuse += dt
        if (this.bomb.defuse >= 5) { this.bomb.planted = false; this.win('CT') }
      } else this.bomb.defuse = 0
      if (this.bomb.timer <= 0) { this.audio.explosion(); this.win('T') }
    }
  }

  private syncAll() {
    for (const c of this.chars) c.syncMesh()
  }

  private updateCamera() {
    const c = this.controlled
    this.camera.position.set(c.pos.x, c.pos.y + EYE, c.pos.z)
    this.camera.rotation.set(this.pitch, this.yaw, 0, 'YXZ')
  }

  // ----- HUD -----
  subscribe(cb: (s: HudState) => void) { this.listeners.push(cb) }
  unsubscribe(cb: (s: HudState) => void) { this.listeners = this.listeners.filter(l => l !== cb) }
  private emit() {
    const s = this.getHud()
    for (const l of this.listeners) l(s)
  }
  getHud(): HudState {
    const c = this.controlled
    const w = WEAPONS[c.weapon]
    const a = c.ammo[c.weapon]
    return {
      hp: c.hp, armor: c.armor, weapon: w.name, ammo: a.mag, reserve: a.reserve,
      killfeed: this.killfeed.slice(), scoped: this.scoped, banner: this.banner, hint: this.hint, team: c.team,
      map: {
        player: { x: c.pos.x, z: c.pos.z, angle: this.yaw },
        allies: this.chars.filter(e => e.team === c.team).map(e => ({ x: e.pos.x, z: e.pos.z, alive: e.alive })),
        enemies: this.chars.filter(e => e.team !== c.team).map(e => {
          const see = e.alive && this.hasLOS(
            new THREE.Vector3(c.pos.x, c.pos.y + EYE, c.pos.z),
            new THREE.Vector3(e.pos.x, e.pos.y + EYE, e.pos.z))
          return { x: e.pos.x, z: e.pos.z, alive: e.alive, seen: see }
        }),
        bomb: this.bomb.planted ? { x: this.bomb.pos.x, z: this.bomb.pos.z } : null,
        bounds: BOUNDS,
      },
    }
  }
}
