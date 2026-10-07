import { BOMB_TIMER } from '../config.ts'
import type { BombState, SiteId, BombView } from '../types.ts'

/** C4 炸弹状态机：carried → dropped ⇄ carried → planted → (defused | exploded) */
export class Bomb implements BombView {
  state: BombState = 'carried'
  x = 0
  y = 0
  z = 0
  site: SiteId | null = null
  timer = BOMB_TIMER
  carrierId: number | null = null

  giveTo(carrierId: number): void {
    this.state = 'carried'
    this.carrierId = carrierId
    this.site = null
    this.timer = BOMB_TIMER
  }

  drop(x: number, y: number, z: number): void {
    this.state = 'dropped'
    this.carrierId = null
    this.x = x
    this.y = y
    this.z = z
  }

  pickUp(carrierId: number): void {
    this.state = 'carried'
    this.carrierId = carrierId
  }

  plant(site: SiteId, x: number, y: number, z: number): void {
    this.state = 'planted'
    this.site = site
    this.carrierId = null
    this.x = x
    this.y = y
    this.z = z
    this.timer = BOMB_TIMER
  }

  defuse(): void {
    this.state = 'defused'
  }

  explode(): void {
    this.state = 'exploded'
  }
}
