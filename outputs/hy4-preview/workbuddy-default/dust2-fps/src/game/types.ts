import type { Body } from './physics';
import type { Slot, WeaponState, WeaponId } from './weapons';

export type Team = 'CT' | 'T';

export const OTHER_TEAM: Record<Team, Team> = { CT: 'T', T: 'CT' };

export type BombState = 'carried' | 'dropped' | 'planted' | 'defused' | 'exploded';

export interface Bomb {
  state: BombState;
  /** combatant id holding the bomb, or null */
  carrier: number | null;
  x: number;
  z: number;
  site: 'A' | 'B' | null;
  /** seconds remaining once planted */
  timer: number;
  /** 0..1 plant progress */
  plantProgress: number;
  /** 0..1 defuse progress */
  defuseProgress: number;
  planterId: number | null;
  defuserId: number | null;
}

export type RoundPhase = 'freeze' | 'live' | 'over';

export interface RoundInfo {
  number: number;
  phase: RoundPhase;
  timeLeft: number;
  isPistol: boolean;
  winner: Team | null;
  /** why the round ended */
  reason: string;
  scoreCT: number;
  scoreT: number;
}

export type BotRole =
  | 'rushA' | 'rushB' | 'midTake' | 'lurker'
  | 'anchorA' | 'anchorB' | 'anchorMid' | 'rotator';

export interface BotBrain {
  state: 'advance' | 'hold' | 'engage' | 'plant' | 'defuse' | 'reposition';
  role: BotRole;
  goal: { x: number; z: number } | null;
  path: { x: number; z: number }[];
  pathIndex: number;
  repathTimer: number;
  stuckTimer: number;
  lastX: number;
  lastZ: number;
  targetId: number | null;
  lastSeenX: number;
  lastSeenZ: number;
  lastSeenTime: number;
  visible: boolean;
  reactionTimer: number;
  /** how long the bot has been locked onto its current target (seconds) */
  trackTime: number;
  /** true when the current burst is aimed at the head line */
  aimHigh: boolean;
  burstLeft: number;
  burstPause: number;
  strafeDir: number;
  strafeTimer: number;
  holdSpot: { x: number; z: number } | null;
  /** ordered list of waypoints the bot walks before reaching its objective */
  route: { x: number; z: number }[];
  routeIndex: number;
  decisionTimer: number;
  /** seconds of "I should push now" pressure */
  aggression: number;
}

export interface Combatant {
  id: number;
  name: string;
  team: Team;
  isHuman: boolean;
  alive: boolean;
  health: number;
  armor: number;
  helmet: boolean;
  hasDefuseKit: boolean;
  body: Body;

  /** view angles (radians) */
  yaw: number;
  pitch: number;

  slot: Slot;
  weapons: Partial<Record<Slot, WeaponState>>;
  /** weapon id currently in the primary slot (null = none) */
  primaryId: WeaponId | null;

  hasBomb: boolean;
  /** seconds spent holding use near the bomb */
  plantHold: number;
  defuseHold: number;

  // weapon dynamics
  spread: number;
  recoilPitch: number;
  recoilYaw: number;
  recoilDebt: number;
  ads: boolean;
  adsAmount: number;
  triggerHeld: boolean;
  burstLeft: number;

  // stats / presentation
  kills: number;
  deaths: number;
  damage: number;
  /** engine time of the last hit taken (for the damage indicator) */
  lastHitTime: number;
  lastHitFromX: number;
  lastHitFromZ: number;

  // animation
  animPhase: number;
  stepAccum: number;
  deathTime: number;
  deathYaw: number;

  brain: BotBrain | null;

  /** set each frame by the app: is this enemy currently visible to the camera owner? */
  __spotted?: boolean;
}

export interface KillEvent {
  id: number;
  time: number;
  killerId: number | null;
  killerName: string;
  killerTeam: Team;
  victimId: number;
  victimName: string;
  victimTeam: Team;
  weapon: WeaponId;
  headshot: boolean;
}

export interface HitMarker {
  id: number;
  time: number;
  headshot: boolean;
  killed: boolean;
}
