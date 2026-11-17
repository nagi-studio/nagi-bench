import { SLOT_ORDER, WEAPONS, type Slot, type Team, type WeaponId } from './arsenal'
import { areaName, clamp, type Point, type Site } from './level'
import {
  DEFUSE_SECONDS, EMPTY_COMMAND, FUSE_SECONDS, PLANT_SECONDS, Match, currentAmmo,
  type Command, type Config, type Frag, type MatchEvent, type Phase, type RoundMode,
} from './match'
import { Navigation, eyeAt } from './physics'
import { Viewport } from './renderer'
import { Sound } from './sound'

export type Screen = 'menu' | 'playing' | 'paused'

export interface RosterMember {
  id: number
  name: string
  team: Team
  alive: boolean
  kills: number
  deaths: number
}

interface MapMarker extends Point {
  yaw: number
  team: Team
  self: boolean
}

export interface HudState {
  phase: Phase
  round: number
  mode: RoundMode
  clock: number
  score: Record<Team, number>
  result: Match['result']
  roster: RosterMember[]
  team: Team
  controlled: number
  watched: string | null
  tookOver: boolean
  alive: boolean
  health: number
  armor: number
  weapon: WeaponId
  slots: { slot: Slot; id: WeaponId | null }[]
  loaded: number
  reserve: number
  reload: number | null
  scoped: boolean
  spread: number
  hit: 'body' | 'head' | null
  hurt: number
  feed: Frag[]
  markers: MapMarker[]
  position: Point
  area: string
  bomb: { state: Match['bomb']['state']; position: Point | null; mine: boolean; site: Site | null }
  bombProgress: number
  interaction: { kind: 'plant' | 'defuse'; progress: number | null } | null
  tab: boolean
  fallback: boolean
}

export interface Snapshot {
  screen: Screen
  hud: HudState | null
  fps: number
}

const KEYS = new Set([
  'KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space', 'ShiftLeft', 'ShiftRight', 'KeyR', 'KeyQ',
  'Digit1', 'Digit2', 'Digit3', 'KeyE', 'KeyG', 'Tab', 'ArrowLeft', 'ArrowRight',
])
const HOTBAR: Partial<Record<string, Slot>> = { Digit1: 'primary', Digit2: 'secondary', Digit3: 'melee' }
const FIXED_DT = 1 / 60

export class BrowserGame {
  private viewport: Viewport
  private match: Match | null = null
  private navigation = new Navigation()
  private sound = new Sound()
  private keys = new Set<string>()
  private edge: Command = { ...EMPTY_COMMAND }
  private hold = false
  private wheel = 0
  private screen: Screen = 'menu'
  private lockMode: 'idle' | 'pending' | 'locked' | 'fallback' = 'idle'
  private lockTimer = 0
  private lockSince = 0
  private stalledWhileLocked = 0
  private frameId = 0
  private accumulator = 0
  private previousAt = 0
  private publishedAt = 0
  private frames = 0
  private measuredAt = 0
  private fps = 0
  private controller = new AbortController()

  constructor(host: HTMLElement, private publish: (snapshot: Snapshot) => void) {
    this.viewport = new Viewport(host)
    const signal = this.controller.signal
    document.addEventListener('pointerlockchange', this.onLock, { signal })
    document.addEventListener('pointerlockerror', this.onLockError, { signal })
    document.addEventListener('visibilitychange', this.onVisibility, { signal })
    window.addEventListener('blur', this.onBlur, { signal })
    window.addEventListener('keydown', this.onKeyDown, { signal })
    window.addEventListener('keyup', this.onKeyUp, { signal })
    window.addEventListener('mousemove', this.onMouseMove, { signal })
    window.addEventListener('mouseup', this.onMouseUp, { signal })
    this.viewport.canvas.addEventListener('mousedown', this.onMouseDown, { signal })
    this.viewport.canvas.addEventListener('contextmenu', event => event.preventDefault(), { signal })
    this.viewport.canvas.addEventListener('wheel', this.onWheel, { signal, passive: false })
    this.frameId = requestAnimationFrame(this.frame)
  }

  start(config: Config) {
    this.clearInput()
    this.viewport.resetEffects()
    this.match = new Match(config, this.navigation, this.handleEvent)
    this.screen = 'playing'
    this.resume()
  }

  pause = () => {
    if (this.screen !== 'playing') return
    this.screen = 'paused'
    this.lockMode = 'idle'
    window.clearTimeout(this.lockTimer)
    this.clearInput()
    if (document.pointerLockElement === this.viewport.canvas) document.exitPointerLock()
    this.send()
  }

  resume = () => {
    if (!this.match) return
    this.clearInput()
    this.sound.unlock()
    this.screen = 'playing'
    this.capturePointer()
    this.send()
  }

  leave = () => {
    this.screen = 'menu'
    this.match = null
    this.lockMode = 'idle'
    window.clearTimeout(this.lockTimer)
    this.clearInput()
    this.viewport.resetEffects()
    if (document.pointerLockElement === this.viewport.canvas) document.exitPointerLock()
    this.send()
  }

  retryPointer = () => {
    if (this.screen === 'playing' && this.lockMode === 'fallback') this.capturePointer()
  }

  mute(muted: boolean) {
    this.sound.muted = muted
    if (!muted) this.sound.unlock()
  }

  private capturePointer() {
    if (document.pointerLockElement === this.viewport.canvas) {
      this.lockMode = 'locked'
      return
    }
    this.lockMode = 'pending'
    window.clearTimeout(this.lockTimer)
    try {
      const result = this.viewport.canvas.requestPointerLock()
      if (result && typeof result.catch === 'function') void result.catch(this.onLockError)
      this.lockTimer = window.setTimeout(this.onLockError, 850)
    } catch {
      this.onLockError()
    }
  }

  private onLock = () => {
    if (document.pointerLockElement === this.viewport.canvas) {
      if (this.screen !== 'playing') {
        document.exitPointerLock()
        return
      }
      this.lockMode = 'locked'
      this.lockSince = performance.now()
      this.stalledWhileLocked = 0
      this.edge.dx = this.edge.dy = 0
      window.clearTimeout(this.lockTimer)
      this.send()
    } else if (this.lockMode === 'locked') {
      this.pause()
    }
  }

  private onLockError = () => {
    if (this.screen !== 'playing' || this.lockMode !== 'pending') return
    this.lockMode = 'fallback'
    this.send()
  }

  private onVisibility = () => {
    if (document.hidden) this.pause()
  }

  private onBlur = () => {
    if (this.lockMode !== 'pending') this.pause()
  }

  private clearInput() {
    this.keys.clear()
    this.hold = false
    this.edge = { ...EMPTY_COMMAND }
    this.wheel = 0
    this.accumulator = 0
    this.measuredAt = this.frames = this.fps = 0
  }

  private onKeyDown = (event: KeyboardEvent) => {
    if (this.screen !== 'playing') return
    if (event.code === 'Escape') {
      if (this.lockMode !== 'locked') {
        event.preventDefault()
        this.pause()
      }
      return
    }
    if (!KEYS.has(event.code)) return
    event.preventDefault()
    this.keys.add(event.code)
    if (event.repeat) return
    if (event.code === 'Space') this.edge.jump = true
    if (event.code === 'KeyR') this.edge.reload = true
    if (event.code === 'KeyE') this.edge.takeOver = true
    if (event.code === 'KeyG') this.edge.drop = true
    if (event.code === 'KeyQ') this.edge.switchTo = 'previous'
    if (event.code === 'ArrowRight') this.edge.spectator = 1
    if (event.code === 'ArrowLeft') this.edge.spectator = -1
    this.edge.switchTo = HOTBAR[event.code] ?? this.edge.switchTo
  }

  private onKeyUp = (event: KeyboardEvent) => {
    this.keys.delete(event.code)
  }

  private onMouseMove = (event: MouseEvent) => {
    if (this.screen !== 'playing') return
    if (this.lockMode !== 'locked' && (this.lockMode !== 'fallback' || event.target !== this.viewport.canvas || event.altKey)) return
    // Browsers can emit a large synthetic delta as the pointer is captured.
    if (this.lockMode === 'locked' && performance.now() - this.lockSince < 80 && Math.hypot(event.movementX, event.movementY) > 90) return
    this.edge.dx += event.movementX
    this.edge.dy += event.movementY
  }

  private onMouseDown = (event: MouseEvent) => {
    if (this.screen !== 'playing' || (event.button !== 0 && event.button !== 2)) return
    event.preventDefault()
    if (this.lockMode === 'pending') return
    this.sound.unlock()
    if (!this.match?.player.alive) {
      this.edge.spectator = event.button === 0 ? 1 : -1
      return
    }
    if (event.button === 0) {
      this.hold = true
      this.edge.firePressed = true
    } else this.edge.scope = true
  }

  private onMouseUp = (event: MouseEvent) => {
    if (event.button === 0) this.hold = false
  }

  private onWheel = (event: WheelEvent) => {
    if (this.screen !== 'playing' || !event.deltaY) return
    event.preventDefault()
    const direction = event.deltaY > 0 ? 1 : -1
    if (this.match?.player.alive) this.wheel = direction
    else this.edge.spectator = direction
  }

  private command(): Command {
    const data = {
      ...this.edge,
      forward: Number(this.keys.has('KeyW')) - Number(this.keys.has('KeyS')),
      right: Number(this.keys.has('KeyD')) - Number(this.keys.has('KeyA')),
      walk: this.keys.has('ShiftLeft') || this.keys.has('ShiftRight'),
      jump: this.edge.jump || this.keys.has('Space'),
      fire: this.hold,
      interact: this.keys.has('KeyE'),
    }
    this.edge = { ...EMPTY_COMMAND }
    return data
  }

  private handleEvent = (event: MatchEvent) => {
    const match = this.match
    if (!match) return
    this.viewport.notify(event, match.time)
    const { view } = match
    const listener = { position: eyeAt(view.position), yaw: view.yaw }
    if (event.type === 'shot') this.sound.shot(event.weapon, listener, event.actor === view.id ? undefined : event.start)
    if (event.type === 'sound') this.sound.cue(event.cue, listener, event.actor === view.id ? undefined : event.position)
    if (event.type === 'explosion') this.sound.explode(listener, event.position)
  }

  private recoverPointer(now: number, gap: number) {
    if (this.lockMode !== 'locked' || !this.viewport.softwareRendering || now - this.lockSince < 1200) return
    this.stalledWhileLocked = gap > 260 ? this.stalledWhileLocked + 1 : 0
    if (this.stalledWhileLocked < 3) return
    // Some software-backed browsers stall on successive frames while the cursor is captured.
    this.lockMode = 'fallback'
    this.clearInput()
    if (document.pointerLockElement === this.viewport.canvas) document.exitPointerLock()
    this.send()
  }

  private frame = (now: number) => {
    const sinceFrame = this.previousAt ? now - this.previousAt : FIXED_DT * 1000
    const elapsed = Math.min(sinceFrame / 1000, 0.12)
    this.previousAt = now
    this.recoverPointer(now, sinceFrame)
    if (this.match && this.screen === 'playing') {
      this.accumulator += elapsed
      while (this.accumulator >= FIXED_DT) {
        if (this.wheel) {
          this.match.cycleSlot(this.wheel)
          this.wheel = 0
        }
        this.match.tick(FIXED_DT, this.command())
        this.accumulator -= FIXED_DT
      }
    }
    const rendered = this.viewport.frame(this.screen, this.match, now / 1000, elapsed)
    if (this.screen === 'playing') {
      if (!this.measuredAt) this.measuredAt = now
      this.frames += Number(rendered)
      if (now >= this.measuredAt + 850) {
        this.fps = Math.round(this.frames * 1000 / (now - this.measuredAt))
        if (this.match && this.match.time > 3) this.viewport.setQuality(this.fps)
        this.measuredAt = now
        this.frames = 0
      }
    }
    if (now >= this.publishedAt + (this.screen === 'menu' ? 300 : 50)) {
      this.publishedAt = now
      this.send()
    }
    this.frameId = requestAnimationFrame(this.frame)
  }

  private send() {
    this.publish({ screen: this.screen, hud: this.match ? this.getHud(this.match) : null, fps: this.fps })
  }

  private getHud(match: Match): HudState {
    const { time, view, player, interaction, bomb } = match
    const ammo = currentAmmo(view)
    const possible = match.canInteract(view)
    const ownAction = interaction?.actor === view.id ? interaction : null
    const duration = ownAction?.kind === 'plant' ? PLANT_SECONDS : DEFUSE_SECONDS
    const reload = view.reloadEnd ? clamp((time - view.reloadStart) / (view.reloadEnd - view.reloadStart), 0, 1) : null
    return {
      phase: match.phase, round: match.round, mode: match.mode, clock: match.clock,
      score: { ...match.score }, result: match.result, team: match.config.team,
      roster: match.actors.map(({ id, name, team, alive, kills, deaths }) => ({ id, name, team, alive, kills, deaths })),
      controlled: match.controlled, watched: match.spectating ? view.name : null,
      tookOver: match.controlled !== match.human,
      alive: view.alive, health: view.health, armor: view.armor, weapon: ammo.id,
      slots: SLOT_ORDER.map(slot => ({ slot, id: view.loadout[slot]?.id ?? null })),
      loaded: ammo.loaded, reserve: ammo.reserve,
      reload, scoped: view.scoped && view.alive, spread: 7 + (WEAPONS[ammo.id].spread + view.bloom) * 250 + view.speed * 1.04 + (view.grounded ? 0 : 9),
      hit: time - match.hitAt < 0.16 ? (time - match.headAt < 0.16 ? 'head' : 'body') : null,
      hurt: clamp(1 - (time - match.hurtAt) * 3.1, 0, 1),
      feed: match.feed.filter(frag => time - frag.time < 6.4).slice(0, 5),
      markers: match.actors.filter(actor => actor.alive && (actor.team === match.config.team || match.visibleEnemies.has(actor.id)))
        .map(actor => ({ x: actor.position.x, z: actor.position.z, yaw: actor.yaw, team: actor.team, self: actor.id === view.id })),
      position: { x: view.position.x, z: view.position.z }, area: areaName(view.position),
      bomb: {
        state: bomb.state, position: match.bombPosition(),
        mine: bomb.state === 'carried' && bomb.actor === player.id,
        site: 'site' in bomb ? bomb.site : null,
      },
      bombProgress: bomb.state === 'planted' ? match.clock / FUSE_SECONDS : 1,
      interaction: possible ? { kind: possible, progress: ownAction ? clamp((time - ownAction.since) / duration, 0, 1) : null } : null,
      tab: this.keys.has('Tab'), fallback: this.lockMode === 'fallback',
    }
  }

  dispose() {
    this.controller.abort()
    if (document.pointerLockElement === this.viewport.canvas) document.exitPointerLock()
    window.clearTimeout(this.lockTimer)
    cancelAnimationFrame(this.frameId)
    this.viewport.dispose()
    this.sound.dispose()
  }
}
