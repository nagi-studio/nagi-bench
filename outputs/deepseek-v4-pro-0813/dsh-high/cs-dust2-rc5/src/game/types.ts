export type Team = 'T' | 'CT'

export type HitboxPart = 'head' | 'chest' | 'abdomen' | 'armL' | 'armR' | 'legL' | 'legR'

export type WeaponId = 'ak47' | 'm4a4' | 'awp' | 'glock' | 'usp' | 'deagle' | 'knife'

export type WeaponSlot = 'primary' | 'secondary' | 'melee'

export interface Vec3 {
  x: number
  y: number
  z: number
}

export interface NavPoint {
  x: number
  z: number
}

export interface KillEvent {
  id: number
  attacker: string
  attackerTeam: Team
  victim: string
  victimTeam: Team
  weapon: string
  headshot: boolean
  time: number
}

export interface MinimapPlayer {
  x: number
  z: number
  yaw: number
  team: Team
  alive: boolean
  isLocal: boolean
  visible: boolean
}

export interface MinimapData {
  players: MinimapPlayer[]
  bomb: { x: number; z: number; planted: boolean; carriedBy: string | null } | null
  siteA: { x: number; z: number }
  siteB: { x: number; z: number }
}

export type RoundPhase = 'freeze' | 'live' | 'over'

export type BombState = 'none' | 'carried' | 'planted' | 'defusing'

export interface HudState {
  hp: number
  armor: number
  hasHelmet: boolean
  weaponName: string
  weaponSlot: WeaponSlot
  mag: number
  reserve: number
  reloading: boolean
  scope: boolean
  crosshairGap: number
  killfeed: KillEvent[]
  round: number
  roundPhase: RoundPhase
  bombTimer: number
  bombState: BombState
  bombCarrier: string | null
  scoreT: number
  scoreCT: number
  pistolRound: boolean
  spectating: boolean
  spectatedName: string
  hint: string
  banner: string | null
  team: Team
  minimap: MinimapData
  version: number
}

export type AIMode = 'idle' | 'move' | 'combat' | 'plant' | 'defuse'

export interface AIState {
  mode: AIMode
  /** player id currently engaged */
  targetId: number | null
  /** last known enemy position */
  lastKnown: { x: number; z: number } | null
  path: NavPoint[]
  pathIndex: number
  repathTimer: number
  stuckTimer: number
  lastX: number
  lastZ: number
  objective: NavPoint | null
  holdPos: NavPoint | null
  reaction: number
  shootTimer: number
  strafeDir: number
  strafeTimer: number
  aimPitch: number
  bombsite: 'A' | 'B'
  homeSite: 'A' | 'B' | 'MID'
  /** time spent planting/defusing */
  actionProgress: number
}

export interface SlotWeapon {
  id: WeaponId | null
  mag: number
  reserve: number
}

export interface Player {
  id: number
  name: string
  team: Team
  isLocal: boolean
  alive: boolean
  health: number
  armor: number
  hasHelmet: boolean
  x: number
  y: number
  z: number
  yaw: number
  pitch: number
  vy: number
  grounded: boolean
  weapons: Record<WeaponSlot, SlotWeapon>
  currentSlot: WeaponSlot
  reloading: boolean
  reloadTimer: number
  bloom: number
  fireCooldown: number
  carryingC4: boolean
  defusing: boolean
  ai: AIState
  moving: boolean
  walkCycle: number
  footTimer: number
  /** count of bots taken over / kill stats for display */
  kills: number
  deaths: number
}
