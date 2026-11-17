export type Team = 'T' | 'CT'
export type WeaponId = 'ak' | 'm4' | 'awp' | 'glock' | 'usp' | 'deagle' | 'knife'
export type Slot = 0 | 1 | 2
export type Vec2 = { x: number; z: number }
export type Point = Vec2 & { y: number }
export type Phase = 'ready' | 'live' | 'paused' | 'roundEnd' | 'matchEnd'
export type Zone = 'head' | 'chest' | 'abdomen' | 'arm' | 'leg'
export type Weapon = {
  id: WeaponId
  name: string
  slot: Slot
  damage: number
  capacity: number
  reserve: number
  interval: number
  reload: number
  recoil: number
  spread: number
  automatic: boolean
  range: number
}
export type Magazine = { id: WeaponId; ammo: number; reserve: number }
export type Inventory = [Magazine | null, Magazine, Magazine]
export type BrainState = 'advance' | 'guard' | 'engage' | 'recover' | 'plant' | 'defuse'
export interface Actor extends Point {
  id: number
  name: string
  team: Team
  yaw: number
  pitch: number
  hp: number
  armor: number
  alive: boolean
  vy: number
  grounded: boolean
  moving: number
  step: number
  inventory: Inventory
  slot: Slot
  cooldown: number
  reloadLeft: number
  recoil: number
  spread: number
  kills: number
  deaths: number
  state: BrainState
  target: number | null
  nextThink: number
  plan: Vec2[]
  destination: Vec2 | null
  reroute: number
  guardTime: number
  engageTime: number
  stuckTime: number
  route: Vec2[]
  action: number
  seen: number
  seenPosition: Vec2
}
export type Bomb = {
  state: 'carried' | 'dropped' | 'planted' | 'defused' | 'exploded'
  carrier: number | null
  x: number
  y: number
  z: number
  remaining: number
  site: string
  worker: number | null
}
export type Feed = {
  id: number
  killer: string
  victim: string
  team: Team
  weapon: WeaponId
  head: boolean
  time: number
}
export interface Options {
  team: Team
  primary: WeaponId
  pistol: WeaponId
  pistolRound: boolean
  volume: number
  sensitivity: number
  muted: boolean
}
export type HudActor = Pick<
  Actor,
  | 'id'
  | 'name'
  | 'team'
  | 'x'
  | 'y'
  | 'z'
  | 'yaw'
  | 'alive'
  | 'hp'
  | 'armor'
  | 'slot'
  | 'inventory'
  | 'kills'
  | 'deaths'
  | 'reloadLeft'
  | 'spread'
  | 'moving'
  | 'seen'
  | 'seenPosition'
>
export interface Snapshot {
  phase: Phase
  round: number
  time: number
  scores: Record<Team, number>
  alive: Record<Team, number>
  feed: Feed[]
  actor: HudActor
  actors: HudActor[]
  elapsed: number
  endIn: number
  team: Team
  playerId: number
  spectating: boolean
  bomb: Bomb
  area: string
  scope: boolean
  hit: number
  damage: number
  progress: number
  prompt: string
  winner: Team | null
  reason: string
  flash: number
  options: Options
  pointerFallback: boolean
}
