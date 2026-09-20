import * as THREE from 'three';
import {
  CROUCH_EYE,
  EYE_HEIGHT,
  GRAVITY,
  JUMP_SPEED,
  MAX_HEALTH,
  PLAYER_HEIGHT,
  PLAYER_RADIUS,
  STEP_HEIGHT,
} from '../engine/constants';
import { clamp } from '../core/math';
import { groundHeightAt, moveWithCollision } from '../physics/collision';
import { CharacterRig } from '../entities/character';
import type { AABB } from '../world/mapLayout';
import { fireInterval, makeWeapon, type WeaponInstance, type WeaponSlot } from '../weapons/weapons';
import type { ActorInput, Brain, Team } from './types';

export class Actor {
  readonly id: number;
  name: string;
  team: Team;
  isPlayerControlled = false;
  alive = true;
  health = MAX_HEALTH;
  armor = 0;
  helmet = false;

  readonly rig: CharacterRig;
  readonly pos = new THREE.Vector3();
  readonly vel = new THREE.Vector3();
  yaw = 0;
  pitch = 0;
  onGround = true;
  crouching = false;
  eyeHeight = EYE_HEIGHT;

  inventory: { primary: WeaponInstance | null; secondary: WeaponInstance | null; knife: WeaponInstance };
  slot: WeaponSlot = 'knife';

  nextFireTime = 0;
  reloading = false;
  reloadEndTime = 0;
  equipEndTime = 0;
  spread = 0;
  recoilDebt = 0;
  scoped = false;

  stepAccum = 0;
  kills = 0;
  deaths = 0;
  hasBomb = false;
  brain: Brain | null = null;

  /** Last time this actor fired (for AI audio/muzzle flash). */
  lastShotAt = -10;

  constructor(id: number, name: string, team: Team) {
    this.id = id;
    this.name = name;
    this.team = team;
    this.rig = new CharacterRig();
    this.rig.setTeam(team);
    this.inventory = { primary: null, secondary: null, knife: makeWeapon('knife') };
    this.spread = 0;
  }

  currentWeapon(): WeaponInstance | null {
    if (this.slot === 'primary') return this.inventory.primary;
    if (this.slot === 'secondary') return this.inventory.secondary;
    return this.inventory.knife;
  }

  currentDef() {
    return this.currentWeapon()?.def ?? null;
  }

  giveWeapon(id: string, slot: WeaponSlot, fullAmmo = true) {
    const inst = makeWeapon(id);
    if (!fullAmmo) {
      inst.ammo = inst.def.magSize;
      inst.reserve = inst.def.reserve;
    }
    if (slot === 'primary') this.inventory.primary = inst;
    else if (slot === 'secondary') this.inventory.secondary = inst;
    else this.inventory.knife = inst;
  }

  equip(slot: WeaponSlot, now: number): boolean {
    const inst = slot === 'primary' ? this.inventory.primary : slot === 'secondary' ? this.inventory.secondary : this.inventory.knife;
    if (!inst) return false;
    this.slot = slot;
    this.scoped = false;
    this.reloading = false;
    this.spread = inst.def.spreadBase;
    this.equipEndTime = now + inst.def.drawTime;
    this.rig.setWeapon(inst.def);
    return true;
  }

  /** Equip the best available slot after spawn. */
  equipBest(now: number) {
    if (this.inventory.primary) this.equip('primary', now);
    else if (this.inventory.secondary) this.equip('secondary', now);
    else this.equip('knife', now);
  }

  getEyePos(out: THREE.Vector3): THREE.Vector3 {
    return out.set(this.pos.x, this.pos.y + this.eyeHeight, this.pos.z);
  }

  getChestPos(out: THREE.Vector3): THREE.Vector3 {
    return out.set(this.pos.x, this.pos.y + 1.2, this.pos.z);
  }

  /** Aim direction from current yaw/pitch (recoil already baked into pitch). */
  aimDir(out: THREE.Vector3): THREE.Vector3 {
    const cp = Math.cos(this.pitch);
    out.set(-Math.sin(this.yaw) * cp, Math.sin(this.pitch), -Math.cos(this.yaw) * cp);
    return out.normalize();
  }

  horizontalSpeed(): number {
    return Math.hypot(this.vel.x, this.vel.z);
  }

  recoverRecoil(dt: number, recoverRate: number) {
    if (this.recoilDebt > 0) {
      const step = Math.min(this.recoilDebt, recoverRate * dt);
      this.pitch -= step;
      this.recoilDebt -= step;
    }
  }

  updateMovement(dt: number, input: ActorInput, colliders: readonly AABB[]): { landed: boolean; moved: number } {
    const def = this.currentDef();
    let maxSpeed = def ? def.moveSpeed : 5.0;
    if (this.scoped && def?.scopedMoveSpeed) maxSpeed = def.scopedMoveSpeed;
    if (this.crouching) maxSpeed *= 0.5;

    const fx = -Math.sin(this.yaw);
    const fz = -Math.cos(this.yaw);
    const rx = Math.cos(this.yaw);
    const rz = -Math.sin(this.yaw);
    let wx = fx * input.moveZ + rx * input.moveX;
    let wz = fz * input.moveZ + rz * input.moveX;
    const wl = Math.hypot(wx, wz);
    if (wl > 1e-5) {
      wx /= wl;
      wz /= wl;
    }
    const wish = Math.min(1, wl) * maxSpeed;
    const accel = this.onGround ? 14 : 3.2;
    const k = 1 - Math.exp(-accel * dt);
    this.vel.x += (wx * wish - this.vel.x) * k;
    this.vel.z += (wz * wish - this.vel.z) * k;

    if (input.jump && this.onGround) {
      this.vel.y = JUMP_SPEED;
      this.onGround = false;
    }
    this.vel.y -= GRAVITY * dt;

    const startX = this.pos.x;
    const startZ = this.pos.z;
    const res = moveWithCollision(
      colliders,
      this.pos.x,
      this.pos.z,
      PLAYER_RADIUS,
      PLAYER_RADIUS,
      this.pos.y,
      PLAYER_HEIGHT,
      this.vel.x * dt,
      this.vel.z * dt,
    );
    this.pos.x = res.x;
    this.pos.z = res.z;
    if (res.hitX) this.vel.x = 0;
    if (res.hitZ) this.vel.z = 0;

    this.pos.y += this.vel.y * dt;
    const ground = groundHeightAt(colliders, this.pos.x, this.pos.z, PLAYER_RADIUS, PLAYER_RADIUS, this.pos.y, STEP_HEIGHT);
    let landed = false;
    if (this.pos.y <= ground + 0.001 && this.vel.y <= 0) {
      if (!this.onGround && this.vel.y < -3) landed = true;
      this.pos.y = ground;
      this.vel.y = 0;
      this.onGround = true;
    } else {
      this.onGround = false;
    }

    this.crouching = input.crouch;
    const targetEye = this.crouching ? CROUCH_EYE : EYE_HEIGHT;
    this.eyeHeight += (targetEye - this.eyeHeight) * (1 - Math.exp(-14 * dt));

    const moved = Math.hypot(this.pos.x - startX, this.pos.z - startZ);
    return { landed, moved };
  }

  /** Sync the visual rig to the logical transform. */
  syncRig(dt: number, speed01: number, moving: boolean) {
    this.rig.group.position.set(this.pos.x, this.pos.y, this.pos.z);
    this.rig.group.rotation.y = this.yaw;
    this.rig.animate(speed01, dt, moving, this.crouching);
    this.rig.aimPitch(this.pitch);
    this.rig.group.visible = this.alive;
  }

  fireInterval(): number {
    const d = this.currentDef();
    return d ? fireInterval(d) : 0.2;
  }

  canFire(now: number): boolean {
    if (!this.alive) return false;
    if (this.reloading) return false;
    if (now < this.equipEndTime) return false;
    if (now < this.nextFireTime) return false;
    return true;
  }

  applyDamage(dmg: number): void {
    this.health = clamp(this.health - dmg, 0, MAX_HEALTH);
    if (this.health <= 0) this.alive = false;
  }

  resetForRound(spawn: { x: number; z: number; yaw: number }) {
    this.alive = true;
    this.health = MAX_HEALTH;
    this.armor = 0;
    this.helmet = false;
    this.pos.set(spawn.x, 0, spawn.z);
    this.vel.set(0, 0, 0);
    this.yaw = spawn.yaw;
    this.pitch = 0;
    this.onGround = true;
    this.crouching = false;
    this.eyeHeight = EYE_HEIGHT;
    this.reloading = false;
    this.recoilDebt = 0;
    this.spread = 0;
    this.scoped = false;
    this.hasBomb = false;
    this.inventory.primary = null;
    this.inventory.secondary = null;
    this.inventory.knife = makeWeapon('knife');
    this.slot = 'knife';
    this.rig.setWeapon(null);
    this.rig.group.visible = true;
  }

  dispose() {
    this.rig.dispose();
  }
}
