import type { HumanHeld } from '../world/gameWorld.ts'

export type InputEdge =
  | { kind: 'reload' }
  | { kind: 'alt' }
  | { kind: 'interact' }
  | { kind: 'slot'; slot: 'primary' | 'secondary' | 'melee' }
  | { kind: 'takeover' }
  | { kind: 'spectate'; dir: number }

/**
 * 键鼠输入采集：只记录状态与边沿事件，不直接修改游戏世界。
 * 鼠标视角增量由 takeMouseDelta() 按帧取出，边沿事件由 takeEdges() 按帧取出。
 */
export class InputController {
  locked = false
  private readonly keys = new Set<string>()
  private fireHeld = false
  private dx = 0
  private dy = 0
  private edges: InputEdge[] = []
  private el: HTMLElement | null = null
  private onLockChange: ((locked: boolean) => void) | null = null
  private readonly handlers: Array<[string, EventListener, EventTarget]> = []

  attach(el: HTMLElement, onLockChange: (locked: boolean) => void): void {
    this.el = el
    this.onLockChange = onLockChange
    this.on(window, 'keydown', this.onKeyDown as EventListener)
    this.on(window, 'keyup', this.onKeyUp as EventListener)
    this.on(window, 'blur', this.releaseAll as EventListener)
    this.on(el, 'mousedown', this.onMouseDown as EventListener)
    this.on(el, 'mouseup', this.onMouseUp as EventListener)
    this.on(el, 'contextmenu', ((e: Event) => e.preventDefault()) as EventListener)
    this.on(el, 'wheel', this.onWheel as EventListener)
    this.on(document, 'mousemove', this.onMouseMove as EventListener)
    this.on(document, 'pointerlockchange', this.onPointerLockChange as EventListener)
  }

  detach(): void {
    for (const [type, fn, target] of this.handlers) target.removeEventListener(type, fn)
    this.handlers.length = 0
    this.releaseAll()
    this.el = null
    this.onLockChange = null
    if (document.pointerLockElement) document.exitPointerLock()
  }

  requestLock(): void {
    if (this.el && !this.locked) this.el.requestPointerLock()
  }

  held(): HumanHeld {
    const fwd = (this.keys.has('KeyW') || this.keys.has('ArrowUp') ? 1 : 0) - (this.keys.has('KeyS') || this.keys.has('ArrowDown') ? 1 : 0)
    const str = (this.keys.has('KeyD') || this.keys.has('ArrowRight') ? 1 : 0) - (this.keys.has('KeyA') || this.keys.has('ArrowLeft') ? 1 : 0)
    return {
      forward: fwd,
      strafe: str,
      jump: this.keys.has('Space'),
      fire: this.fireHeld && this.locked,
      interactHeld: this.keys.has('KeyE'),
    }
  }

  takeMouseDelta(): { x: number; y: number } {
    const d = { x: this.dx, y: this.dy }
    this.dx = 0
    this.dy = 0
    return d
  }

  takeEdges(): InputEdge[] {
    const e = this.edges
    this.edges = []
    return e
  }

  private on(target: EventTarget, type: string, fn: EventListener): void {
    target.addEventListener(type, fn)
    this.handlers.push([type, fn, target])
  }

  private readonly onKeyDown = (e: KeyboardEvent): void => {
    if (e.code === 'Space' || e.code.startsWith('Arrow')) e.preventDefault()
    if (e.repeat) return
    this.keys.add(e.code)
    switch (e.code) {
      case 'KeyR':
        this.edges.push({ kind: 'reload' })
        break
      case 'KeyE':
        this.edges.push({ kind: 'interact' })
        break
      case 'KeyF':
        this.edges.push({ kind: 'takeover' })
        break
      case 'Digit1':
        this.edges.push({ kind: 'slot', slot: 'primary' })
        break
      case 'Digit2':
        this.edges.push({ kind: 'slot', slot: 'secondary' })
        break
      case 'Digit3':
        this.edges.push({ kind: 'slot', slot: 'melee' })
        break
      default:
        break
    }
  }

  private readonly onKeyUp = (e: KeyboardEvent): void => {
    this.keys.delete(e.code)
  }

  private readonly onMouseDown = (e: MouseEvent): void => {
    if (!this.locked) {
      this.requestLock()
      return
    }
    if (e.button === 0) {
      this.fireHeld = true
      // 死亡观察模式下，左键用于切换观察目标
      this.edges.push({ kind: 'spectate', dir: 1 })
    } else if (e.button === 2) {
      this.edges.push({ kind: 'alt' })
    }
  }

  private readonly onMouseUp = (e: MouseEvent): void => {
    if (e.button === 0) this.fireHeld = false
  }

  private readonly onWheel = (e: WheelEvent): void => {
    this.edges.push({ kind: 'spectate', dir: e.deltaY > 0 ? 1 : -1 })
  }

  private readonly onMouseMove = (e: MouseEvent): void => {
    if (!this.locked) return
    this.dx += e.movementX
    this.dy += e.movementY
  }

  private readonly onPointerLockChange = (): void => {
    this.locked = document.pointerLockElement === this.el
    if (!this.locked) this.releaseAll()
    this.onLockChange?.(this.locked)
  }

  private readonly releaseAll = (): void => {
    this.keys.clear()
    this.fireHeld = false
  }
}
