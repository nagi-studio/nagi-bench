export interface KillLine {
  killer: string
  kTeam: 'ct' | 't'
  victim: string
  vTeam: 'ct' | 't'
  weapon: string
  hs: boolean
  at: number
}

export interface BoardRow {
  name: string
  team: 'ct' | 't'
  hp: number
  money: number
  weapon: string
  armor: number
  bomb: boolean
  alive: boolean
  you: boolean
}

export interface HudSnap {
  phase: 'menu' | 'freeze' | 'buy' | 'live' | 'end' | 'match'
  team: 'ct' | 't' | null
  round: number
  scoreCT: number
  scoreT: number
  banner: string
  sub: string
  roundTime: number
  hp: number
  armor: number
  helmet: boolean
  money: number
  weapon: string
  mag: number
  reserve: number
  melee: boolean
  spread: number
  fov: number
  scoped: boolean
  hit: number
  hitHs: boolean
  damage: number
  damageAngle: number
  action: 'plant' | 'defuse' | null
  actionPct: number
  bomb: 'none' | 'carried' | 'dropped' | 'planted'
  bombYou: boolean
  bombTime: number
  bombCarrier: string
  kills: KillLine[]
  mates: { x: number; z: number }[]
  enemies: { x: number; z: number }[]
  self: { x: number; z: number; yaw: number } | null
  bombPos: { x: number; z: number } | null
  alive: boolean
  spectating: boolean
  specName: string
  paused: boolean
  tab: boolean
  prompt: string
  board: BoardRow[]
}

export function emptySnap(): HudSnap {
  return {
    phase: 'menu',
    team: null,
    round: 0,
    scoreCT: 0,
    scoreT: 0,
    banner: '',
    sub: '',
    roundTime: 0,
    hp: 100,
    armor: 0,
    helmet: false,
    money: 800,
    weapon: '',
    mag: 0,
    reserve: 0,
    melee: false,
    spread: 0.01,
    fov: 74,
    scoped: false,
    hit: 0,
    hitHs: false,
    damage: 0,
    damageAngle: 0,
    action: null,
    actionPct: 0,
    bomb: 'none',
    bombYou: false,
    bombTime: 0,
    bombCarrier: '',
    kills: [],
    mates: [],
    enemies: [],
    self: null,
    bombPos: null,
    alive: false,
    spectating: false,
    specName: '',
    paused: false,
    tab: false,
    prompt: '',
    board: [],
  }
}

export class HudBus {
  snap: HudSnap = emptySnap()
  bake: HTMLCanvasElement | null = null
  private listeners = new Set<() => void>()

  subscribe = (fn: () => void): (() => void) => {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  get = (): HudSnap => this.snap

  push(snap: HudSnap): void {
    this.snap = snap
    for (const fn of this.listeners) fn()
  }
}
