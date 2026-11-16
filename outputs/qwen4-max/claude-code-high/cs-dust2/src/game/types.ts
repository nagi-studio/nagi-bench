import type { Vec3 } from './math';

export type Team = 'CT' | 'T';
export type WeaponId = 'ak47' | 'm4a4' | 'awp' | 'glock' | 'usp' | 'deagle' | 'knife';
export type Slot = 'primary' | 'secondary' | 'knife';
export type HitPart = 'head' | 'chest' | 'stomach' | 'arm' | 'leg';
export type RoundPhase = 'freeze' | 'live' | 'roundend' | 'matchend';
export type BombState = 'carried' | 'dropped' | 'planted' | 'defused' | 'exploded';
export type RoundEndReason = 'elimination' | 'explosion' | 'defuse' | 'time';

export interface Ammo {
  mag: number;
  reserve: number;
}

export interface BotState {
  state: 'move' | 'engage' | 'plant' | 'defuse' | 'pickup' | 'hold';
  goal: Vec3 | null;
  path: Vec3[];
  pathI: number;
  repathT: number;
  targetId: number;
  reactT: number;
  burstLeft: number;
  burstPause: number;
  strafeDir: number;
  strafeT: number;
  skill: number;
  holdPos: Vec3;
  attackSite: 'A' | 'B';
  stuckT: number;
  lastPos: Vec3;
  visionT: number;
  wanderT: number;
}

export interface Combatant {
  id: number;
  name: string;
  team: Team;
  pos: Vec3; // feet position
  vel: Vec3;
  yaw: number;
  pitch: number;
  hp: number;
  armor: number;
  alive: boolean;
  onGround: boolean;
  primary: WeaponId | null;
  secondary: WeaponId;
  slot: Slot;
  ammo: Partial<Record<WeaponId, Ammo>>;
  cooldown: number;
  reloadT: number;
  bloom: number; // accumulated spread from firing
  recoilPitch: number; // view kick (player) / aim disturbance
  scoped: boolean;
  hasBomb: boolean;
  plantT: number;
  defuseT: number;
  isPlayer: boolean;
  bot: BotState | null;
  deathT: number;
  walkPhase: number;
  stepDist: number;
  kills: number;
  deaths: number;
  lastAttacker: number;
  lastDamageT: number;
  // per-tick intent (set by player input or bot brain)
  wishDir: Vec3;
  wantJump: boolean;
  wantFire: boolean;
  wantFirePressed: boolean;
  wantAltFire: boolean;
  wantReload: boolean;
  wantUse: boolean;
  wantWalk: boolean;
}

export interface Bomb {
  state: BombState;
  carrier: number;
  pos: Vec3;
  timer: number;
  beepT: number;
  planter: number;
  defuser: number;
  defuseProgress: number;
}

export type SimEvent =
  | { type: 'shot'; by: number; weapon: WeaponId; origin: Vec3; end: Vec3; scoped: boolean }
  | { type: 'hit'; attacker: number; victim: number; part: HitPart; dmg: number; pos: Vec3 }
  | { type: 'kill'; killer: number; victim: number; weapon: WeaponId | 'c4'; headshot: boolean }
  | { type: 'damage'; victim: number; attacker: number }
  | { type: 'reload'; by: number; weapon: WeaponId }
  | { type: 'switch'; by: number; weapon: WeaponId }
  | { type: 'step'; by: number; pos: Vec3 }
  | { type: 'scope'; by: number; on: boolean }
  | { type: 'bombDrop'; pos: Vec3 }
  | { type: 'bombPickup'; by: number }
  | { type: 'planted'; pos: Vec3; by: number }
  | { type: 'defused'; by: number }
  | { type: 'beep'; pos: Vec3; urgency: number }
  | { type: 'explosion'; pos: Vec3 }
  | { type: 'roundStart'; round: number; pistol: boolean }
  | { type: 'roundEnd'; winner: Team; reason: RoundEndReason }
  | { type: 'matchEnd'; winner: Team };

export interface PlayerInput {
  forward: boolean;
  back: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  fire: boolean;
  firePressed: boolean;
  altFirePressed: boolean;
  reload: boolean;
  use: boolean;
  walk: boolean;
  switchSlot: Slot | null;
  dropBomb: boolean;
}

export const emptyInput = (): PlayerInput => ({
  forward: false,
  back: false,
  left: false,
  right: false,
  jump: false,
  fire: false,
  firePressed: false,
  altFirePressed: false,
  reload: false,
  use: false,
  walk: false,
  switchSlot: null,
  dropBomb: false,
});

export interface KillfeedEntry {
  id: number;
  killer: string;
  killerTeam: Team;
  victim: string;
  victimTeam: Team;
  weapon: WeaponId | 'c4';
  headshot: boolean;
  t: number;
}

export interface ScoreRow {
  id: number;
  name: string;
  team: Team;
  kills: number;
  deaths: number;
  alive: boolean;
  isPlayer: boolean;
  hasBomb: boolean;
}

export interface HudState {
  phase: RoundPhase;
  round: number;
  pistol: boolean;
  scores: { CT: number; T: number };
  timer: number;
  bombState: BombState;
  bombTimer: number;
  aliveCT: number;
  aliveT: number;
  playerAlive: boolean;
  hp: number;
  armor: number;
  weapon: WeaponId;
  weaponName: string;
  mag: number;
  reserve: number;
  reloading: boolean;
  scoped: boolean;
  hasBomb: boolean;
  canPlant: boolean;
  canDefuse: boolean;
  plantProgress: number; // 0..1
  defuseProgress: number;
  spreadPx: number;
  killfeed: KillfeedEntry[];
  scoreboard: ScoreRow[];
  spectating: boolean;
  spectateName: string;
  roundEndWinner: Team | null;
  roundEndReason: RoundEndReason | null;
  matchWinner: Team | null;
  playerTeam: Team;
  hitmarkerT: number;
  hitmarkerHead: boolean;
  damageT: number;
  buyOpen: boolean;
  hint: string;
}
