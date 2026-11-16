// Pure data types shared across the simulation core. No external imports.

export type Team = 'CT' | 'T';
export type Vec3 = { x: number; y: number; z: number };
export type Vec2 = { x: number; z: number };

export type WeaponId = 'ak47' | 'm4a4' | 'awp' | 'glock' | 'usp' | 'deagle' | 'knife';
export type Slot = 'primary' | 'secondary' | 'melee';
export type HitRegion = 'head' | 'chest' | 'stomach' | 'arm' | 'leg';
export type Material = 'stone' | 'wood' | 'metal' | 'crate' | 'glass';

export interface Rect {
  x1: number;
  z1: number;
  x2: number;
  z2: number;
  h?: number; // floor height (default 0)
}

export interface Ramp {
  x1: number;
  z1: number;
  x2: number;
  z2: number;
  h0: number;
  h1: number;
  axis: 'x' | 'z'; // height interpolates along this axis
}

export interface Collider {
  min: Vec3;
  max: Vec3;
  material: Material;
  penetrable: boolean; // bullets pass through (wood doors) with attenuation
  tag?: string;
}

export interface WeaponDef {
  id: WeaponId;
  name: string;
  slot: Slot;
  damage: number; // base chest damage
  rpm: number; // rounds per minute
  mag: number;
  reserve: number;
  reloadTime: number; // seconds
  auto: boolean; // hold-to-fire
  spreadBase: number; // degrees, standing still
  spreadMove: number; // degrees, while moving
  bloomPerShot: number; // degrees added per shot
  bloomMax: number;
  bloomRecover: number; // degrees/sec recovery
  recoilPitch: number; // degrees view kick up per shot
  recoilYaw: number; // degrees random horizontal kick
  armorPen: number; // 0..1, how much armor is ignored
  moveSpeed: number; // m/s while holding
  scoped: boolean;
  zoomFov: number; // fov when scoped
  price: number;
  killReward: number;
  range: number; // effective hitscan range (m)
  pellets: number;
}

export interface WeaponState {
  id: WeaponId;
  ammo: number;
  reserve: number;
  reloading: boolean;
  reloadT: number; // remaining reload time
  nextFire: number; // core.time when next shot allowed
  spray: number; // consecutive shot index for recoil pattern
  lastShot: number; // core.time of last shot
  bloom: number; // current spread bloom (degrees)
}

export interface Inventory {
  primary: WeaponState | null;
  secondary: WeaponState;
  melee: WeaponState;
}

export type AIStateName =
  | 'idle'
  | 'advance'
  | 'hold'
  | 'engage'
  | 'hunt'
  | 'plant'
  | 'defuse'
  | 'retrieve'
  | 'rotate'
  | 'defend';

export interface AIMemory {
  pos: Vec3;
  time: number;
  entityId: number;
}

export interface AIState {
  state: AIStateName;
  route: RouteId;
  routeStage: number;
  site: 'A' | 'B';
  path: Vec3[];
  pathIdx: number;
  goal: Vec3 | null;
  hold: Vec3;
  targetId: number | null;
  memory: AIMemory | null;
  nextThink: number;
  burst: number; // shots left in current burst
  burstPause: number; // core.time when burst may resume
  aim: number; // 0..1 aim convergence
  strafe: number; // -1 | 0 | 1
  strafeT: number;
  stuckT: number;
  lastPos: Vec3;
  reaction: number; // core.time when allowed to react to a newly seen enemy
  seenAt: number;
  wander: number;
  skill: number; // 0..1 accuracy multiplier
  scanYaw: number;
}

export type RouteId = 'longA' | 'midShort' | 'midB' | 'tunnelsB' | 'splitA';

export interface Entity {
  id: number;
  name: string;
  team: Team;
  isPlayerSlot: boolean; // the human's original slot
  bot: boolean; // currently AI-driven
  pos: Vec3; // feet center
  vel: Vec3;
  yaw: number; // radians, 0 = -Z (north), increases clockwise viewed from above
  pitch: number; // radians, + looks up
  onGround: boolean;
  hp: number;
  armor: number;
  helmet: boolean;
  kit: boolean;
  alive: boolean;
  money: number;
  kills: number;
  deaths: number;
  inv: Inventory;
  activeSlot: Slot;
  prevSlot: Slot;
  switchT: number; // core.time when weapon deploy completes
  action: { type: 'plant' | 'defuse'; t: number; duration: number } | null;
  bombCarrier: boolean;
  scoped: boolean;
  ai: AIState | null;
  walkPhase: number;
  speed: number; // horizontal speed magnitude (render/anim)
  deathT: number; // core.time of death
  hitFlash: number; // render feedback timer
  lastDamageFrom: number | null;
  footAccum: number;
  recoilRecover: number; // accumulated view recoil to recover (player)
  spawnYaw: number;
}

export type BombState = 'carried' | 'dropped' | 'planted' | 'defused' | 'exploded';

export interface Bomb {
  state: BombState;
  pos: Vec3;
  carrierId: number | null;
  planterId: number | null;
  retrieverId: number | null;
  site: 'A' | 'B' | null;
  timer: number; // seconds until explosion once planted
  defuseProgress: number; // 0..1
  defuserId: number | null;
  beepT: number;
}

export type RoundPhase = 'freeze' | 'live' | 'planted' | 'roundend' | 'matchend';

export interface RoundState {
  phase: RoundPhase;
  number: number; // 1-based
  pistol: boolean;
  timer: number; // phase countdown
  scoreCT: number;
  scoreT: number;
  winner: Team | null;
  reason: string;
  lossStreakCT: number;
  lossStreakT: number;
  mvpId: number | null;
}

export interface KillEvent {
  killer: string;
  killerTeam: Team;
  victim: string;
  victimTeam: Team;
  weapon: WeaponId;
  headshot: boolean;
  time: number;
}

// Events emitted by the core for the render/audio layers to consume.
export type GameEvent =
  | { type: 'shot'; entityId: number; weapon: WeaponId; origin: Vec3; dir: Vec3; scoped: boolean }
  | { type: 'hit'; attackerId: number; victimId: number; region: HitRegion; damage: number; pos: Vec3; headshot: boolean; killed: boolean }
  | { type: 'impact'; pos: Vec3; normal: Vec3; material: Material }
  | { type: 'tracer'; from: Vec3; to: Vec3; weapon: WeaponId }
  | { type: 'reload'; entityId: number; weapon: WeaponId }
  | { type: 'deploy'; entityId: number; weapon: WeaponId }
  | { type: 'death'; entityId: number; pos: Vec3; team: Team }
  | { type: 'explosion'; pos: Vec3 }
  | { type: 'plant'; pos: Vec3; site: 'A' | 'B' }
  | { type: 'defuse'; pos: Vec3 }
  | { type: 'bombPickup'; entityId: number }
  | { type: 'bombDrop'; pos: Vec3 }
  | { type: 'beep'; pos: Vec3; urgency: number }
  | { type: 'roundStart'; pistol: boolean }
  | { type: 'roundEnd'; winner: Team; reason: string }
  | { type: 'buy'; entityId: number }
  | { type: 'scope'; entityId: number; on: boolean }
  | { type: 'footstep'; entityId: number; pos: Vec3; loud: boolean }
  | { type: 'knife'; entityId: number };

export interface InputState {
  forward: number; // -1..1
  right: number; // -1..1
  jump: boolean;
  walk: boolean;
  fire: boolean; // held
  firePressed: boolean; // edge (semi-auto)
  ads: boolean; // held / toggled
  adsPressed: boolean;
  reload: boolean;
  use: boolean; // held (plant/defuse)
  usePressed: boolean;
  slot: Slot | null; // requested switch
  quickSwitch: boolean;
  buy: boolean;
}

export interface HudPlayer {
  name: string;
  team: Team;
  hp: number;
  armor: number;
  helmet: boolean;
  kit: boolean;
  alive: boolean;
  money: number;
  kills: number;
  deaths: number;
  weapon: WeaponId;
  weaponName: string;
  ammo: number;
  reserve: number;
  reloading: boolean;
  reloadProgress: number;
  slot: Slot;
  hasPrimary: boolean;
  scoped: boolean;
  bombCarrier: boolean;
  action: { type: 'plant' | 'defuse'; progress: number } | null;
  spread: number; // crosshair gap px factor
}

export interface HudEntityDot {
  id: number;
  x: number;
  z: number;
  yaw: number;
  team: Team;
  alive: boolean;
  isSelf: boolean;
  isControlled: boolean;
  bombCarrier: boolean;
}

export interface Snapshot {
  phase: RoundPhase;
  roundNumber: number;
  pistol: boolean;
  timer: number;
  scoreCT: number;
  scoreT: number;
  winner: Team | null;
  reason: string;
  player: HudPlayer | null;
  controlledId: number;
  spectating: boolean;
  spectateName: string;
  playerTeam: Team;
  bomb: { state: BombState; x: number; z: number; timer: number; defuseProgress: number; site: 'A' | 'B' | null };
  dots: HudEntityDot[];
  killfeed: KillEvent[];
  aliveCT: number;
  aliveT: number;
  buyOpen: boolean;
  buyAllowed: boolean;
  scoreboard: { name: string; team: Team; kills: number; deaths: number; money: number; alive: boolean; isPlayer: boolean }[];
  matchWinner: Team | null;
  hint: string;
  fps: number;
  hitMarker: boolean;
  hitHeadshot: boolean;
  killMarker: boolean;
  hurtFlash: boolean;
  area: string;
}

export interface AudioSink {
  shot(weapon: WeaponId, pos: Vec3, listener: Vec3, listenerYaw: number, scoped: boolean): void;
  reload(pos: Vec3, listener: Vec3, listenerYaw: number): void;
  deploy(pos: Vec3, listener: Vec3, listenerYaw: number): void;
  footstep(pos: Vec3, listener: Vec3, listenerYaw: number, loud: boolean): void;
  hit(headshot: boolean, killed: boolean): void;
  kill(): void;
  scope(on: boolean): void;
  plant(): void;
  defuse(): void;
  explosion(pos: Vec3, listener: Vec3, listenerYaw: number): void;
  beep(pos: Vec3, listener: Vec3, listenerYaw: number, urgency: number): void;
  roundStart(pistol: boolean): void;
  roundEnd(winner: Team, playerTeam: Team): void;
  buy(): void;
  death(pos: Vec3, listener: Vec3, listenerYaw: number): void;
  knife(pos: Vec3, listener: Vec3, listenerYaw: number): void;
  hurt(): void;
}
