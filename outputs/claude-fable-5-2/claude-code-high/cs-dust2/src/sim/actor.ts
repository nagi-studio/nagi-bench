// Actor = one of the ten combatants. Humans and bots share exactly the same state and simulation
// code; the only difference is who fills in `input` each tick (keyboard/mouse or a BotBrain).

import { Body, CollisionWorld } from './collision';
import { Vec3, clamp, lerp, v3 } from './math';
import { HitZone, Slot, WeaponDef, WeaponId, WeaponState } from './weapons';

export type Team = 'atk' | 'def';

export interface ActorInput {
  /** Local strafe (-1 left .. 1 right) and forward (-1 back .. 1 forward). */
  moveX: number;
  moveZ: number;
  jump: boolean;
  crouch: boolean;
  walk: boolean;
  fire: boolean;
  fire2: boolean;
  reload: boolean;
  use: boolean;
  switchTo: Slot | null;
  drop: boolean;
}

export const emptyInput = (): ActorInput => ({
  moveX: 0,
  moveZ: 0,
  jump: false,
  crouch: false,
  walk: false,
  fire: false,
  fire2: false,
  reload: false,
  use: false,
  switchTo: null,
  drop: false,
});

export function resetInput(i: ActorInput): void {
  i.moveX = 0;
  i.moveZ = 0;
  i.jump = false;
  i.crouch = false;
  i.walk = false;
  i.fire = false;
  i.fire2 = false;
  i.reload = false;
  i.use = false;
  i.switchTo = null;
  i.drop = false;
}

export const ACTOR_HW = 0.34;
export const STAND_HEIGHT = 1.8;
export const CROUCH_HEIGHT = 1.32;
export const EYE_STAND = 1.62;
export const EYE_CROUCH = 1.14;
export const RUN_SPEED = 5.3;
export const JUMP_SPEED = 6.7;

export class Actor implements Body {
  id: number;
  name: string;
  team: Team;
  /** True while a human is driving this actor. */
  isHuman = false;

  pos: Vec3 = v3();
  vel: Vec3 = v3();
  prevPos: Vec3 = v3();
  yaw = 0;
  pitch = 0;
  prevYaw = 0;
  prevPitch = 0;
  onGround = true;
  hw = ACTOR_HW;
  height = STAND_HEIGHT;
  /** 0 = standing, 1 = fully crouched. */
  crouch = 0;

  hp = 100;
  armor = 0;
  helmet = false;
  alive = true;
  hasBomb = false;
  hasKit = false;
  deathTime = 0;
  /** Direction the body falls when killed (yaw of the incoming shot). */
  deathYaw = 0;

  weapons: { primary: WeaponState | null; secondary: WeaponState | null; melee: WeaponState };
  active: Slot = 'melee';
  lastSlot: Slot = 'melee';
  nextFire = 0;
  reloadStart = 0;
  reloadEnd = 0;
  drawStart = 0;
  drawEnd = 0;
  zoom = 0;
  rezoomAt = 0;
  rezoomLevel = 0;
  shotsFired = 0;
  lastShotTime = -100;
  /** Accumulated firing inaccuracy (radians). */
  spread = 0;
  /** Recoil view punch (radians), added to yaw/pitch for both the camera and bullets. */
  punchPitch = 0;
  punchYaw = 0;
  prevFire = false;
  prevFire2 = false;
  prevJump = false;
  lastAttackTime = -100;
  lastAttackHeavy = false;

  input: ActorInput = emptyInput();
  kills = 0;
  deaths = 0;
  stepDist = 0;
  lastDamageFrom = -1;
  lastDamageTime = -100;
  /** Progress (seconds) of the current plant/defuse action. */
  useTime = 0;
  /** Team-visibility bookkeeping: time until which the opposing team "sees" this actor. */
  spottedUntil = -100;
  /** Speed (m/s) on the ground plane, cached each tick. */
  speed = 0;

  constructor(id: number, name: string, team: Team) {
    this.id = id;
    this.name = name;
    this.team = team;
    this.weapons = { primary: null, secondary: null, melee: new WeaponState('knife') };
  }

  get weapon(): WeaponState {
    return this.weapons[this.active] ?? this.weapons.melee;
  }
  get def(): WeaponDef {
    return this.weapon.def;
  }
  get eyeHeight(): number {
    return lerp(EYE_STAND, EYE_CROUCH, this.crouch);
  }
  eye(out: Vec3 = v3()): Vec3 {
    out.x = this.pos.x;
    out.y = this.pos.y + this.eyeHeight;
    out.z = this.pos.z;
    return out;
  }
  get reloading(): boolean {
    return this.reloadEnd > 0;
  }
  give(id: WeaponId): void {
    const w = new WeaponState(id);
    this.weapons[w.def.slot] = w as WeaponState;
  }
  hasSlot(slot: Slot): boolean {
    return this.weapons[slot] !== null;
  }
  bestSlot(): Slot {
    if (this.weapons.primary) return 'primary';
    if (this.weapons.secondary) return 'secondary';
    return 'melee';
  }
  /** Current total inaccuracy cone (radians), used for bullets and the dynamic crosshair. */
  inaccuracy(): number {
    const d = this.def;
    if (d.kind === 'melee') return 0;
    let base = d.spreadBase;
    if (d.zoom && this.zoom > 0) base = d.zoom.spreadScoped;
    let s = base + this.spread;
    const moveFrac = clamp(this.speed / RUN_SPEED, 0, 1);
    // standing still / slow walking is accurate; penalty ramps in above ~35 % speed
    s += d.spreadMove * clamp((moveFrac - 0.35) / 0.65, 0, 1);
    if (!this.onGround) s += d.spreadAir;
    if (this.crouch > 0.5) s *= 0.78;
    return s;
  }
}

// ---------------------------------------------------------------------------- hitboxes
// Boxes are expressed in the actor's local frame (x right, y up, z back; the actor faces -Z).
interface HitBoxDef {
  zone: HitZone;
  min: [number, number, number];
  max: [number, number, number];
}

const HITBOXES: HitBoxDef[] = [
  { zone: 'head', min: [-0.13, 1.5, -0.15], max: [0.13, 1.8, 0.14] },
  { zone: 'chest', min: [-0.24, 1.14, -0.16], max: [0.24, 1.5, 0.16] },
  { zone: 'stomach', min: [-0.22, 0.88, -0.15], max: [0.22, 1.14, 0.15] },
  { zone: 'arm', min: [-0.38, 1.0, -0.5], max: [-0.24, 1.48, 0.12] },
  { zone: 'arm', min: [0.24, 1.0, -0.5], max: [0.38, 1.48, 0.12] },
  { zone: 'leg', min: [-0.23, 0, -0.14], max: [-0.01, 0.88, 0.14] },
  { zone: 'leg', min: [0.01, 0, -0.14], max: [0.23, 0.88, 0.14] },
];

export interface ActorHit {
  t: number;
  zone: HitZone;
}

/** Ray vs. the actor's zoned hitboxes. Direction must be normalised. */
export function rayActor(a: Actor, ox: number, oy: number, oz: number, dx: number, dy: number, dz: number, maxT: number): ActorHit | null {
  // quick reject: distance from the ray to the body's centre line
  const cx = a.pos.x - ox;
  const cy = a.pos.y + 0.9 - oy;
  const cz = a.pos.z - oz;
  const proj = cx * dx + cy * dy + cz * dz;
  if (proj < -1.2 || proj > maxT + 1.2) return null;
  const px = cx - dx * proj;
  const py = cy - dy * proj;
  const pz = cz - dz * proj;
  if (px * px + py * py + pz * pz > 1.5 * 1.5) return null;

  // world -> local (inverse of rotation about Y by yaw)
  const c = Math.cos(a.yaw);
  const s = Math.sin(a.yaw);
  const rx = ox - a.pos.x;
  const ry = oy - a.pos.y;
  const rz = oz - a.pos.z;
  const lox = rx * c - rz * s;
  const loz = rx * s + rz * c;
  const ldx = dx * c - dz * s;
  const ldz = dx * s + dz * c;
  const ys = lerp(1, CROUCH_HEIGHT / STAND_HEIGHT, a.crouch);
  const idx = Math.abs(ldx) > 1e-12 ? 1 / ldx : 1e30;
  const idy = Math.abs(dy) > 1e-12 ? 1 / dy : 1e30;
  const idz = Math.abs(ldz) > 1e-12 ? 1 / ldz : 1e30;

  let best = maxT;
  let zone: HitZone | null = null;
  for (let i = 0; i < HITBOXES.length; i++) {
    const hb = HITBOXES[i];
    let t1 = (hb.min[0] - lox) * idx;
    let t2 = (hb.max[0] - lox) * idx;
    let tmin = Math.min(t1, t2);
    let tmax = Math.max(t1, t2);
    t1 = (hb.min[1] * ys - ry) * idy;
    t2 = (hb.max[1] * ys - ry) * idy;
    tmin = Math.max(tmin, Math.min(t1, t2));
    tmax = Math.min(tmax, Math.max(t1, t2));
    t1 = (hb.min[2] - loz) * idz;
    t2 = (hb.max[2] - loz) * idz;
    tmin = Math.max(tmin, Math.min(t1, t2));
    tmax = Math.min(tmax, Math.max(t1, t2));
    if (tmax < 0 || tmin > tmax) continue;
    const t = tmin < 0 ? 0 : tmin;
    // the head wins ties so a shot through the face is never credited to the chest behind it
    if (t < best - 1e-6 || (zone !== 'head' && hb.zone === 'head' && t < best + 0.02)) {
      best = t;
      zone = hb.zone;
    }
  }
  return zone ? { t: best, zone } : null;
}

// ---------------------------------------------------------------------------- movement
const FRICTION = 7.5;
const STOP_SPEED = 1.6;
const GROUND_ACCEL = 9.5;
const AIR_ACCEL = 14;
const AIR_WISH_CAP = 0.75;

export interface MoveResult {
  jumped: boolean;
  landedSpeed: number;
  footstep: boolean;
}

const moveResult: MoveResult = { jumped: false, landedSpeed: 0, footstep: false };

/** Quake-style ground/air acceleration followed by collide-and-slide. */
export function stepMovement(a: Actor, world: CollisionWorld, dt: number, frozen: boolean): MoveResult {
  const inp = a.input;
  moveResult.jumped = false;
  moveResult.footstep = false;
  moveResult.landedSpeed = 0;

  // --- crouch (cannot stand up under a low ceiling)
  let wantCrouch = inp.crouch;
  if (!wantCrouch && a.crouch > 0 && !world.bodyFits(a.pos.x, a.pos.y, a.pos.z, a.hw, STAND_HEIGHT)) wantCrouch = true;
  a.crouch = clamp(a.crouch + (wantCrouch ? 1 : -1) * dt * 7, 0, 1);
  a.height = lerp(STAND_HEIGHT, CROUCH_HEIGHT, a.crouch);

  // --- wish direction
  let mx = frozen ? 0 : clamp(inp.moveX, -1, 1);
  let mz = frozen ? 0 : clamp(inp.moveZ, -1, 1);
  const ml = Math.hypot(mx, mz);
  if (ml > 1) {
    mx /= ml;
    mz /= ml;
  }
  const sy = Math.sin(a.yaw);
  const cyaw = Math.cos(a.yaw);
  // forward = (-sin, -cos), right = (cos, -sin)
  let wx = -sy * mz + cyaw * mx;
  let wz = -cyaw * mz - sy * mx;
  const wl = Math.hypot(wx, wz);
  const def = a.def;
  let maxSpeed = RUN_SPEED * def.moveMul;
  if (def.zoom && a.zoom > 0) maxSpeed *= def.zoom.moveMul;
  if (a.crouch > 0.5) maxSpeed *= 0.42;
  else if (inp.walk) maxSpeed *= 0.5;
  const wishSpeed = wl * maxSpeed;
  if (wl > 1e-5) {
    wx /= wl;
    wz /= wl;
  }

  const v = a.vel;
  if (a.onGround) {
    const sp = Math.hypot(v.x, v.z);
    if (sp > 1e-4) {
      const drop = Math.max(sp, STOP_SPEED) * FRICTION * dt;
      const k = Math.max(0, sp - drop) / sp;
      v.x *= k;
      v.z *= k;
    } else {
      v.x = 0;
      v.z = 0;
    }
    const cur = v.x * wx + v.z * wz;
    const add = wishSpeed - cur;
    if (add > 0) {
      const acc = Math.min(GROUND_ACCEL * dt * maxSpeed, add);
      v.x += wx * acc;
      v.z += wz * acc;
    }
    if (inp.jump && !a.prevJump && !frozen) {
      v.y = JUMP_SPEED;
      a.onGround = false;
      moveResult.jumped = true;
    }
  } else {
    const ws = Math.min(wishSpeed, AIR_WISH_CAP);
    const cur = v.x * wx + v.z * wz;
    const add = ws - cur;
    if (add > 0) {
      const acc = Math.min(AIR_ACCEL * dt * maxSpeed, add);
      v.x += wx * acc;
      v.z += wz * acc;
    }
  }
  a.prevJump = inp.jump;

  const wasGround = a.onGround;
  moveResult.landedSpeed = world.moveBody(a, dt);
  a.speed = Math.hypot(v.x, v.z);

  // --- footsteps (running only: walking and crouching are silent)
  if (a.onGround && wasGround && a.speed > RUN_SPEED * 0.6) {
    a.stepDist += a.speed * dt;
    if (a.stepDist > 2.1) {
      a.stepDist = 0;
      moveResult.footstep = true;
    }
  } else if (a.speed < 0.5) {
    a.stepDist = 1.2;
  }
  return moveResult;
}
