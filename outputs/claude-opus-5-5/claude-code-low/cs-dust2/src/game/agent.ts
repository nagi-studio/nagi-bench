/**
 * Agent = any combatant (the human player or a bot). Both share the same body,
 * physics, inventory and hitboxes; only the "controller" differs.
 */
import * as THREE from 'three';
import { GameMap } from './map';
import { Inventory, type HitZone, type Team } from './weapons';
import { buildCharacter, setRigWeapon, type CharacterRig } from './models';
import type { BotBrain } from './ai';

export const RADIUS = 0.32;
export const EYE = 1.68;
export const RUN_SPEED = 5.2;
const GRAVITY = 20;
const JUMP_V = 6.6;

interface HitBox {
  zone: HitZone;
  min: [number, number, number];
  max: [number, number, number];
}

/** local-space hitboxes (character faces -Z) */
export const HITBOXES: HitBox[] = [
  { zone: 'head', min: [-0.13, 1.62, -0.15], max: [0.13, 1.9, 0.15] },
  { zone: 'chest', min: [-0.24, 1.3, -0.17], max: [0.24, 1.62, 0.17] },
  { zone: 'stomach', min: [-0.22, 0.9, -0.15], max: [0.22, 1.3, 0.15] },
  { zone: 'arm', min: [0.17, 1.15, -0.62], max: [0.34, 1.58, 0.08] },
  { zone: 'arm', min: [-0.34, 1.15, -0.62], max: [-0.12, 1.58, 0.08] },
  { zone: 'leg', min: [-0.24, 0.0, -0.15], max: [0.24, 0.9, 0.15] },
];

let nextId = 1;

export class Agent {
  id = nextId++;
  pos = new THREE.Vector3();
  vel = new THREE.Vector3();
  yaw = 0;
  pitch = 0;
  health = 100;
  armor = 0;
  helmet = false;
  alive = true;
  onGround = true;
  hasBomb = false;
  isPlayer = false;
  inv = new Inventory();
  rig: CharacterRig;
  brain: BotBrain | null = null;
  kills = 0;
  deaths = 0;
  /** time until which this agent is marked visible to the enemy team on the radar */
  spottedUntil = 0;
  deathTime = 0;
  stepAccum = 0;
  walkPhase = 0;
  moveFrac = 0;
  /** last frame's horizontal speed (for animation) */
  speed = 0;
  scoped = false;
  lastDamagedBy: Agent | null = null;

  constructor(public name: string, public team: Team) {
    this.rig = buildCharacter(team);
  }

  get eye() {
    return new THREE.Vector3(this.pos.x, this.pos.y + EYE, this.pos.z);
  }

  forward(out = new THREE.Vector3()) {
    const cp = Math.cos(this.pitch);
    return out.set(-Math.sin(this.yaw) * cp, Math.sin(this.pitch), -Math.cos(this.yaw) * cp);
  }

  reset(x: number, z: number, yaw: number) {
    this.pos.set(x, 0, z);
    this.vel.set(0, 0, 0);
    this.yaw = yaw;
    this.pitch = 0;
    this.health = 100;
    this.alive = true;
    this.hasBomb = false;
    this.scoped = false;
    this.spottedUntil = 0;
    this.lastDamagedBy = null;
    this.rig.body.rotation.set(0, 0, 0);
    this.rig.body.position.set(0, 0, 0);
    this.rig.root.visible = true;
  }

  /**
   * Physics step shared by player and bots.
   * wishX/wishZ: desired horizontal direction in world space (length 0..1).
   */
  physics(map: GameMap, wishX: number, wishZ: number, jump: boolean, walk: boolean, dt: number) {
    const w = this.inv.weapon.def;
    let maxSpeed = RUN_SPEED * w.moveSpeed * (walk ? 0.52 : 1);
    if (this.scoped) maxSpeed *= 0.55;
    const len = Math.hypot(wishX, wishZ);
    if (len > 1) {
      wishX /= len;
      wishZ /= len;
    }
    const accel = this.onGround ? 14 : 2.2;
    const tx = wishX * maxSpeed;
    const tz = wishZ * maxSpeed;
    const k = Math.min(1, accel * dt);
    if (this.onGround || len > 0.01) {
      this.vel.x += (tx - this.vel.x) * k;
      this.vel.z += (tz - this.vel.z) * k;
    }
    if (jump && this.onGround) {
      this.vel.y = JUMP_V;
      this.onGround = false;
    }
    this.vel.y -= GRAVITY * dt;

    const before = { x: this.pos.x, z: this.pos.z };
    map.moveBody(this.pos, this.vel.x * dt, this.vel.z * dt, RADIUS);
    // kill velocity into walls
    if (Math.abs(this.pos.x - before.x) < Math.abs(this.vel.x * dt) * 0.5) this.vel.x *= 0.2;
    if (Math.abs(this.pos.z - before.z) < Math.abs(this.vel.z * dt) * 0.5) this.vel.z *= 0.2;

    this.pos.y += this.vel.y * dt;
    const ground = map.groundHeight(this.pos.x, this.pos.z, RADIUS, Math.max(this.pos.y, this.pos.y - this.vel.y * dt));
    let landed = false;
    if (this.pos.y <= ground) {
      if (!this.onGround && this.vel.y < -6) landed = true;
      this.pos.y = ground;
      this.vel.y = 0;
      this.onGround = true;
    } else if (this.pos.y > ground + 0.05) {
      this.onGround = false;
    } else if (this.vel.y <= 0) {
      // smooth step down small ledges
      this.pos.y = ground;
      this.vel.y = 0;
      this.onGround = true;
    }
    this.speed = Math.hypot(this.vel.x, this.vel.z);
    this.moveFrac = Math.min(1, this.speed / RUN_SPEED);
    return landed;
  }

  /** Ray vs hitboxes. Returns nearest hit distance + zone, or null. */
  rayHit(o: THREE.Vector3, d: THREE.Vector3, maxDist: number): { t: number; zone: HitZone } | null {
    if (!this.alive) return null;
    // broad phase: distance from ray to agent axis
    const px = this.pos.x - o.x, pz = this.pos.z - o.z;
    const along = px * d.x + pz * d.z;
    if (along < -1) return null;
    // transform to local
    const c = Math.cos(-this.yaw), s = Math.sin(-this.yaw);
    const lox = (o.x - this.pos.x) * c + (o.z - this.pos.z) * s;
    const loz = -(o.x - this.pos.x) * s + (o.z - this.pos.z) * c;
    const loy = o.y - this.pos.y;
    const ldx = d.x * c + d.z * s;
    const ldz = -d.x * s + d.z * c;
    const ldy = d.y;
    let best: { t: number; zone: HitZone } | null = null;
    for (const hb of HITBOXES) {
      const t = rayAabb(lox, loy, loz, ldx, ldy, ldz, hb.min, hb.max);
      if (t !== null && t <= maxDist && (!best || t < best.t)) best = { t, zone: hb.zone };
    }
    return best;
  }

  setWeaponModel() {
    setRigWeapon(this.rig, this.inv.weapon.def.id);
  }

  /** update the 3rd person rig (position, aim pitch, walk cycle, death fall) */
  animate(dt: number, now: number) {
    const r = this.rig;
    r.root.position.copy(this.pos);
    r.root.rotation.y = this.yaw;
    r.bomb.visible = this.hasBomb && this.alive;
    if (!this.alive) {
      const t = Math.min(1, (now - this.deathTime) / 0.6);
      const e = t * t;
      r.body.rotation.x = e * (Math.PI / 2) * 0.98;
      r.body.position.y = 0.05 * e;
      r.upper.rotation.x = 0;
      r.legL.rotation.x = r.legR.rotation.x = 0;
      return;
    }
    r.upper.rotation.x = this.pitch * 0.6;
    if (this.onGround && this.speed > 0.3) this.walkPhase += dt * this.speed * 2.1;
    else this.walkPhase *= 0.9;
    const amp = this.onGround ? Math.min(0.7, this.speed * 0.13) : 0.35;
    const sw = Math.sin(this.walkPhase);
    r.legL.rotation.x = sw * amp;
    r.legR.rotation.x = -sw * amp;
    r.kneeL.rotation.x = Math.max(0, -Math.cos(this.walkPhase)) * amp * 1.2;
    r.kneeR.rotation.x = Math.max(0, Math.cos(this.walkPhase)) * amp * 1.2;
    r.upper.position.y = 0.95 + Math.abs(Math.cos(this.walkPhase)) * 0.025 * (amp > 0.1 ? 1 : 0);
  }
}

function rayAabb(
  ox: number, oy: number, oz: number, dx: number, dy: number, dz: number,
  mn: [number, number, number], mx: [number, number, number]
): number | null {
  let tmin = 0, tmax = Infinity;
  const o = [ox, oy, oz], d = [dx, dy, dz];
  for (let i = 0; i < 3; i++) {
    if (Math.abs(d[i]) < 1e-9) {
      if (o[i] < mn[i] || o[i] > mx[i]) return null;
    } else {
      let t1 = (mn[i] - o[i]) / d[i];
      let t2 = (mx[i] - o[i]) / d[i];
      if (t1 > t2) [t1, t2] = [t2, t1];
      tmin = Math.max(tmin, t1);
      tmax = Math.min(tmax, t2);
      if (tmin > tmax) return null;
    }
  }
  return tmin;
}
