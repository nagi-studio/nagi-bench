import { GameWorld, type WorldConfig } from '../world/gameWorld.ts'
import { GameRenderer, type CameraRig } from '../render/renderer.ts'
import { SoundEngine } from '../audio/sound.ts'
import { InputController } from './input.ts'
import { EYE_HEIGHT, FIXED_DT } from '../config.ts'
import { clamp } from '../core/mathUtil.ts'
import type { HudState, WorldEvent } from '../types.ts'

const MAX_STEPS_PER_FRAME = 12
const HUD_INTERVAL = 1 / 20
const MOUSE_SENS = 0.0022
const PITCH_LIMIT = 1.45
const DEAD_EYE = 0.9

/**
 * 运行时控制器：连接 requestAnimationFrame、固定步长逻辑、渲染器、音效与输入。
 *   - 逻辑按 FIXED_DT 推进（累加器模式），与显示帧率解耦；
 *   - 每帧把键鼠状态写入世界，把世界事件分发给渲染与音效；
 *   - 约 20Hz 把只读 HUD 快照交给外部 store，React 只订阅快照，不参与 3D 循环。
 */
export class GameController {
  readonly world: GameWorld
  private readonly renderer: GameRenderer
  private readonly sound = new SoundEngine()
  private readonly input = new InputController()
  private readonly onHud: (hud: HudState) => void
  private readonly onLock: (locked: boolean) => void
  private acc = 0
  private last = 0
  private hudT = 0
  private firedThisFrame = false
  private raf = 0
  private running = false

  constructor(host: HTMLElement, cfg: WorldConfig, onHud: (hud: HudState) => void, onLock: (locked: boolean) => void) {
    this.world = new GameWorld(cfg)
    this.renderer = new GameRenderer(host)
    this.renderer.attachWorld(this.world)
    this.onHud = onHud
    this.onLock = onLock
    this.input.attach(this.renderer.domElement, (locked) => {
      this.onLock(locked)
      if (locked) this.sound.unlock()
    })
  }

  start(): void {
    this.running = true
    this.sound.unlock()
    this.last = performance.now()
    this.raf = requestAnimationFrame(this.frame)
    this.input.requestLock()
  }

  stop(): void {
    this.running = false
    cancelAnimationFrame(this.raf)
    this.input.detach()
    this.renderer.dispose()
  }

  /** 需在用户手势中调用：重新锁定指针（恢复暂停的模拟） */
  requestLock(): void {
    this.input.requestLock()
  }

  private readonly frame = (now: number): void => {
    if (!this.running) return
    const dt = Math.min(0.05, (now - this.last) / 1000)
    this.last = now

    // 指针未锁定（如按下 ESC）时暂停模拟，但仍渲染当前画面
    if (this.input.locked) {
      this.applyInput()
      this.acc += dt
      let steps = 0
      while (this.acc >= FIXED_DT && steps < MAX_STEPS_PER_FRAME) {
        this.world.step(FIXED_DT)
        this.acc -= FIXED_DT
        steps++
        this.dispatch(this.world.drainEvents())
      }
      if (steps === MAX_STEPS_PER_FRAME) this.acc = 0
    }

    const human = this.world.byId(this.world.humanId)
    this.sound.setListener(human.x, human.z, human.yaw)
    this.renderer.render(this.world, this.buildRig(), dt)
    this.firedThisFrame = false

    this.hudT -= dt
    if (this.hudT <= 0) {
      this.hudT = HUD_INTERVAL
      this.onHud(this.world.buildHud())
    }
    this.raf = requestAnimationFrame(this.frame)
  }

  private dispatch(events: WorldEvent[]): void {
    if (events.length === 0) return
    this.renderer.handleEvents(events)
    for (const e of events) {
      if (e.type === 'shot' && e.ownerId === this.world.humanId) this.firedThisFrame = true
      this.sound.handle(e, this.world.humanId)
    }
  }

  /** 把键鼠状态写入世界：移动键 → 持续意图；鼠标 → 视角；按键边沿 → 排队 */
  private applyInput(): void {
    const human = this.world.byId(this.world.humanId)
    const d = this.input.takeMouseDelta()
    if (human.alive) {
      human.yaw -= d.x * MOUSE_SENS
      human.pitch = clamp(human.pitch - d.y * MOUSE_SENS, -PITCH_LIMIT, PITCH_LIMIT)
    }
    this.world.setHumanHeld(human.alive ? this.input.held() : { forward: 0, strafe: 0, jump: false, fire: false, interactHeld: false })
    for (const edge of this.input.takeEdges()) {
      switch (edge.kind) {
        case 'reload':
          this.world.queueHumanPress({ reloadPressed: true })
          break
        case 'alt':
          this.world.queueHumanPress({ altPressed: true })
          break
        case 'interact':
          this.world.queueHumanPress({ interactPressed: true })
          break
        case 'slot':
          this.world.queueHumanPress({ slot: edge.slot })
          break
        case 'takeover':
          this.world.takeControl()
          break
        case 'spectate':
          if (!human.alive) this.world.cycleSpectate(edge.dir)
          break
      }
    }
  }

  /**
   * 镜头：存活时为第一人称（眼睛高度 + 后坐力视角上扬）；
   * 阵亡后跟随观察的队友（没有可观察目标时停留在死亡位置）。
   */
  private buildRig(): CameraRig {
    const w = this.world
    const human = w.byId(w.humanId)
    const target = human.alive ? human : w.spectateId !== null ? w.byId(w.spectateId) : human
    const live = human.alive
    const scoped = target.alive && target.scoped && target.weapon.scope !== null
    const fov = scoped && target.weapon.scope ? target.weapon.scope.fov : 75
    const eye = target.alive ? EYE_HEIGHT : DEAD_EYE
    return {
      x: target.x,
      y: target.y + eye,
      z: target.z,
      yaw: target.yaw,
      pitch: target.pitch + target.punch,
      fov,
      viewOwnerId: live ? human.id : null,
      showViewModel: live,
      weapon: human.weapon.id,
      viewState: {
        speed: human.speed,
        reloadProgress: human.reloading ? 1 - human.reloadLeft / human.reloadTotal : -1,
        scoped: human.scoped,
        fired: this.firedThisFrame,
        stabbing: human.current === 'melee' && this.firedThisFrame,
      },
    }
  }
}
