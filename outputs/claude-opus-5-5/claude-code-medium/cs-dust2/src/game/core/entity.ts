import type { V3 } from './math.ts';
import type { Slot, WeaponInst } from './weapons.ts';

export type Team = 'T' | 'CT';
export const otherTeam = (t: Team): Team => (t === 'T' ? 'CT' : 'T');

/** Intent written by either the local player or the AI brain. */
export interface InputState {
  moveF: number; // -1..1 forward/back
  moveR: number; // -1..1 strafe right/left
  jump: boolean;
  walk: boolean;
  fire: boolean; // held
  alt: boolean; // edge-triggered (scope / knife stab)
  reload: boolean; // edge-triggered
  use: boolean; // held (plant / defuse)
  switchSlot: Slot | null; // edge-triggered
}

export const emptyInput = (): InputState => ({
  moveF: 0,
  moveR: 0,
  jump: false,
  walk: false,
  fire: false,
  alt: false,
  reload: false,
  use: false,
  switchSlot: null,
});

export interface Entity {
  id: number;
  name: string;
  team: Team;
  isBot: boolean;
  pos: V3;
  prevPos: V3;
  vel: V3;
  onGround: boolean;
  radius: number;
  height: number;
  yaw: number;
  pitch: number;
  hp: number;
  armor: number;
  helmet: boolean;
  alive: boolean;
  weapons: Record<Slot, WeaponInst | null>;
  slot: Slot;
  prevSlot: Slot;
  hasBomb: boolean;
  kills: number;
  deaths: number;
  // weapon runtime state
  nextFire: number;
  drawUntil: number;
  reloadUntil: number; // 0 = not reloading
  reloadStart: number;
  shotsFired: number;
  lastShotTime: number;
  recoilPitch: number;
  recoilYaw: number;
  spreadAccum: number;
  scope: number; // 0 = unscoped, 1..n zoom level
  /** AWP re-zooms automatically after the bolt cycles. */
  resumeScope: number;
  resumeScopeAt: number;
  triggerLatch: boolean;
  dryLatch: boolean;
  // movement runtime
  stepAccum: number;
  // objective runtime
  planting: boolean;
  plantProgress: number;
  defusing: boolean;
  // perception (updated by the sim)
  visibleEnemies: number[];
  spottedUntil: Record<Team, number>;
  lastDamageTime: number;
  lastAttackerId: number;
  deathTime: number;
  input: InputState;
}
