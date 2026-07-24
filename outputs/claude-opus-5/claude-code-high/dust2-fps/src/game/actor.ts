import { v3 } from '../core/math.ts';
import type { Vec3 } from '../core/math.ts';
import type { SlotId, Team } from '../core/types.ts';
import { PLAYER_CROUCH_SCALE, PLAYER_EYE, PLAYER_HEIGHT } from './hitbox.ts';
import { WEAPONS, weapon } from './weapons.ts';
import type { WeaponDef, WeaponId } from './weapons.ts';

export interface WeaponState {
  id: WeaponId;
  mag: number;
  reserve: number;
}

export type AIMode =
  | 'idle'
  | 'advance'
  | 'engage'
  | 'hunt'
  | 'hold'
  | 'plant'
  | 'defuse'
  | 'retreat'
  | 'rotate';

/** Everything the bot brain remembers between ticks. */
export interface AIBlackboard {
  mode: AIMode;
  skill: number;
  aggression: number;
  /** Current navigation path and cursor into it. */
  path: Vec3[];
  pathIndex: number;
  pathAge: number;
  goal: Vec3 | null;
  goalName: string;
  /** Enemy currently being fought. */
  targetId: number;
  /** Where the target was last seen (used to hunt after losing sight). */
  lastSeen: Vec3 | null;
  lastSeenTime: number;
  /** Reaction delay before the bot may open fire on a fresh target. */
  reactionTimer: number;
  /** Random aim jitter, re-rolled periodically. */
  aimErrorYaw: number;
  aimErrorPitch: number;
  aimErrorTimer: number;
  fireTimer: number;
  burstTimer: number;
  /** Anti-stuck bookkeeping. */
  stuckTimer: number;
  lastPos: Vec3;
  repathTimer: number;
  decisionTimer: number;
  strafeDir: number;
  strafeTimer: number;
  /** Bombsite this bot is committed to this round. */
  site: 'A' | 'B' | null;
  /** Noise heard from a gunshot. */
  alertPos: Vec3 | null;
  alertTime: number;
  holdSpot: Vec3 | null;
  /** Direction this bot is currently watching while holding an angle. */
  watchYaw: number;
}

export interface Actor {
  id: number;
  /** Display name, decorated with "(YOU)" while the human drives this body. */
  name: string;
  baseName: string;
  team: Team;
  isBot: boolean;
  /** True for the actor the human is currently driving. */
  isLocal: boolean;

  pos: Vec3;
  vel: Vec3;
  yaw: number;
  pitch: number;
  /** Recoil offset added on top of the aim angles. */
  punchPitch: number;
  punchYaw: number;
  grounded: boolean;
  crouching: boolean;
  heightScale: number;
  speed2D: number;

  alive: boolean;
  health: number;
  armor: number;
  helmet: boolean;
  hasKit: boolean;
  money: number;
  kills: number;
  deaths: number;
  assists: number;

  weapons: Record<SlotId, WeaponState | null>;
  activeSlot: SlotId;
  spread: number;
  nextFireTime: number;
  shotsInBurst: number;
  reloadEndTime: number;
  deployEndTime: number;
  scoped: boolean;
  wantsScope: boolean;
  triggerHeld: boolean;
  lastShotTime: number;

  hasBomb: boolean;
  plantProgress: number;
  defuseProgress: number;

  footAccum: number;
  deathTime: number;
  lastAttackerId: number;
  /** Death animation bookkeeping for the renderer. */
  deathYaw: number;

  ai: AIBlackboard;
}

let nextId = 1;

export function createActor(name: string, team: Team, isBot: boolean, skill = 0.6): Actor {
  return {
    id: nextId++,
    name,
    baseName: name,
    team,
    isBot,
    isLocal: false,
    pos: v3(),
    vel: v3(),
    yaw: 0,
    pitch: 0,
    punchPitch: 0,
    punchYaw: 0,
    grounded: true,
    crouching: false,
    heightScale: 1,
    speed2D: 0,
    alive: true,
    health: 100,
    armor: 0,
    helmet: false,
    hasKit: false,
    money: 800,
    kills: 0,
    deaths: 0,
    assists: 0,
    weapons: { primary: null, secondary: null, melee: { id: 'knife', mag: 0, reserve: 0 }, bomb: null },
    activeSlot: 'melee',
    spread: 0,
    nextFireTime: 0,
    shotsInBurst: 0,
    reloadEndTime: -1,
    deployEndTime: 0,
    scoped: false,
    wantsScope: false,
    triggerHeld: false,
    lastShotTime: -99,
    hasBomb: false,
    plantProgress: 0,
    defuseProgress: 0,
    footAccum: 0,
    deathTime: -99,
    lastAttackerId: -1,
    deathYaw: 0,
    ai: {
      mode: 'idle',
      skill,
      aggression: 0.5,
      path: [],
      pathIndex: 0,
      pathAge: 0,
      goal: null,
      goalName: '',
      targetId: -1,
      lastSeen: null,
      lastSeenTime: -99,
      reactionTimer: 0,
      aimErrorYaw: 0,
      aimErrorPitch: 0,
      aimErrorTimer: 0,
      fireTimer: 0,
      burstTimer: 0,
      stuckTimer: 0,
      lastPos: v3(),
      repathTimer: 0,
      decisionTimer: 0,
      strafeDir: 0,
      strafeTimer: 0,
      site: null,
      alertPos: null,
      alertTime: -99,
      holdSpot: null,
      watchYaw: 0,
    },
  };
}

export function eyePos(a: Actor, out: Vec3 = v3()): Vec3 {
  out.x = a.pos.x;
  out.y = a.pos.y + PLAYER_EYE * a.heightScale;
  out.z = a.pos.z;
  return out;
}

export function chestPos(a: Actor, out: Vec3 = v3()): Vec3 {
  out.x = a.pos.x;
  out.y = a.pos.y + 1.33 * a.heightScale;
  out.z = a.pos.z;
  return out;
}

export function activeWeapon(a: Actor): WeaponState | null {
  return a.weapons[a.activeSlot];
}

export function activeDef(a: Actor): WeaponDef {
  const w = a.weapons[a.activeSlot];
  return w ? WEAPONS[w.id] : WEAPONS.knife;
}

export function giveWeapon(a: Actor, id: WeaponId, fullAmmo = true): void {
  const d = weapon(id);
  const state: WeaponState = {
    id,
    mag: fullAmmo ? d.magSize : 0,
    reserve: fullAmmo ? d.reserve : 0,
  };
  a.weapons[d.slot] = state;
}

export function removeWeapon(a: Actor, slot: SlotId): void {
  a.weapons[slot] = null;
  if (a.activeSlot === slot) a.activeSlot = bestSlot(a);
}

export function bestSlot(a: Actor): SlotId {
  if (a.weapons.primary) return 'primary';
  if (a.weapons.secondary) return 'secondary';
  return 'melee';
}

export function clearLoadout(a: Actor): void {
  a.weapons = { primary: null, secondary: null, melee: { id: 'knife', mag: 0, reserve: 0 }, bomb: null };
  a.activeSlot = 'melee';
}

/** Switching weapons cancels reloads and un-scopes. */
export function switchSlot(a: Actor, slot: SlotId, time: number): boolean {
  if (slot === a.activeSlot) return false;
  if (!a.weapons[slot]) return false;
  a.activeSlot = slot;
  a.reloadEndTime = -1;
  a.scoped = false;
  a.wantsScope = false;
  a.spread = Math.min(a.spread, 0.02);
  a.deployEndTime = time + WEAPONS[a.weapons[slot]!.id].drawTime;
  a.shotsInBurst = 0;
  return true;
}

export function isDeployed(a: Actor, time: number): boolean {
  return time >= a.deployEndTime;
}

export function isReloading(a: Actor, time: number): boolean {
  return a.reloadEndTime > 0 && time < a.reloadEndTime;
}

export function canReload(a: Actor, time: number): boolean {
  const ws = activeWeapon(a);
  if (!ws) return false;
  const d = WEAPONS[ws.id];
  if (d.magSize <= 0) return false;
  if (ws.mag >= d.magSize || ws.reserve <= 0) return false;
  return !isReloading(a, time);
}

export function startReload(a: Actor, time: number): boolean {
  if (!canReload(a, time)) return false;
  const ws = activeWeapon(a)!;
  a.reloadEndTime = time + WEAPONS[ws.id].reloadTime;
  a.scoped = false;
  a.wantsScope = false;
  return true;
}

export function finishReload(a: Actor): void {
  const ws = activeWeapon(a);
  a.reloadEndTime = -1;
  if (!ws) return;
  const d = WEAPONS[ws.id];
  const need = d.magSize - ws.mag;
  const take = Math.min(need, ws.reserve);
  ws.mag += take;
  ws.reserve -= take;
}

export function eyeHeight(a: Actor): number {
  return PLAYER_EYE * a.heightScale;
}

export function standingHeight(a: Actor): number {
  return PLAYER_HEIGHT * a.heightScale;
}

export function targetHeightScale(crouching: boolean): number {
  return crouching ? PLAYER_CROUCH_SCALE : 1;
}
