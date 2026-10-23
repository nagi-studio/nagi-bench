/**
 * character.ts — one combatant (the player or a bot). Owns movement physics,
 * health/armour, inventory & firing; the AI brain (bot.ts) or the player
 * controller (player.ts) only fills in its intent fields each frame.
 */

import * as THREE from 'three';
import { World, AABB, PLAYER_R, STEP } from './world';
import { Humanoid, Team, worldModelFor } from './humanoid';
import { WEAPONS, WeaponDef, WeaponState, applyArmor, makeWeaponState, Slot } from './weapons';
import { audio } from './audio';
import { clamp, coneSpread, rayAABB } from './util';
import type { Game } from './engine';

export const RUN_SPEED = 5.6;
export const JUMP_V = 6.3;
export const GRAVITY = 17;

export type Region = 'head' | 'chest' | 'stomach' | 'arm' | 'leg';

/** yaw-oriented box hitbox */
export interface Hitbox { region: Region; cx: number; cz: number; y1: number; y2: number; hx: number; hz: number; yaw: number }

/** ray vs oriented hitbox — rotates the ray into the box frame */
export function rayHitbox(ox: number, oy: number, oz: number, dx: number, dy: number, dz: number, hb: Hitbox, maxT: number): number | null {
  const c = Math.cos(hb.yaw), s = Math.sin(hb.yaw);
  const px = ox - hb.cx, pz = oz - hb.cz;
  const lx = px * c - pz * s, lz = px * s + pz * c;
  const ldx = dx * c - dz * s, ldz = dx * s + dz * c;
  return rayAABB(lx, oy, lz, ldx, dy, ldz, { x1: -hb.hx, y1: hb.y1, z1: -hb.hz, x2: hb.hx, y2: hb.y2, z2: hb.hz }, maxT);
}

let nextId = 1;

const BOT_NAMES = ['Phoenix', 'Viper', 'Blaze', 'Wolf', 'Cobra', 'Ghost', 'Falcon', 'Rex', 'Storm', 'Havoc', 'Dagger', 'Ace'];

export class Character {
  id = nextId++;
  name: string;
  team: Team;
  isPlayer = false;

  x = 0; y = 0; z = 0;          // feet position
  vx = 0; vy = 0; vz = 0;
  yaw = 0; pitch = 0;
  /** view recoil offset (decays) */
  recoilX = 0; recoilY = 0;

  crouch = false;
  crouchAmt = 0;
  walk = false;
  grounded = true;
  alive = true;
  deadTime = 0;

  health = 100;
  armor = 0;
  helmet = false;

  primary: WeaponState | null = null;
  secondary: WeaponState | null = null;
  melee: WeaponState = makeWeaponState('knife');
  slot: Slot = 'primary';

  fireCd = 0;
  lastShotAt = -99;
  reloadEnd = -1;
  reloadStart = -1;
  spread = 0;
  semiLatch = false;
  hasC4 = false;

  kills = 0;
  deaths = 0;
  money = 800;

  // per-frame intent (set by player input or bot brain)
  moveFwd = 0; moveSide = 0;
  wantJump = false;
  firing = false;
  scoped = false;
  plantProgress = 0;   // 0..1 while planting/defusing (engine driven)
  busyAction: 'none' | 'plant' | 'defuse' = 'none';

  humanoid: Humanoid;
  brain: import('./bot').BotBrain | null = null;

  // vision bookkeeping
  spottedAt = -99;      // last time an enemy of this char saw it
  lastEnemies: Character[] = [];

  private walkPhase = 0;
  private footDist = 0;
  private stepParity = 0;
  lastDamageFrom: Character | null = null;
  flashT = 0;

  constructor(team: Team, name?: string) {
    this.team = team;
    this.name = name ?? BOT_NAMES[(nextId * 7) % BOT_NAMES.length];
    this.humanoid = new Humanoid(team);
    this.humanoid.setWeapon(WEAPONS.knife.model);
  }

  /* ------------------------------------------------------------ */

  get weaponDef(): WeaponDef {
    const st = this.current();
    return WEAPONS[st.id];
  }
  current(): WeaponState {
    if (this.slot === 'primary' && this.primary) return this.primary;
    if (this.slot === 'secondary' && this.secondary) return this.secondary;
    this.slot = 'melee';
    return this.melee;
  }
  hasSlot(s: Slot): boolean {
    if (s === 'melee') return true;
    if (s === 'primary') return !!this.primary;
    return !!this.secondary;
  }
  switchSlot(s: Slot, now: number): boolean {
    if (!this.hasSlot(s) || this.slot === s) return false;
    this.slot = s;
    this.cancelReload();
    this.semiLatch = true;
    this.spread = 0;
    this.humanoid.setWeapon(WEAPONS[this.current().id].model);
    if (this.isPlayer) audio.draw();
    void now;
    return true;
  }
  nextSlot(dir: number, now: number) {
    const order: Slot[] = ['primary', 'secondary', 'melee'];
    let i = order.indexOf(this.slot);
    for (let k = 0; k < 3; k++) {
      i = (i + dir + 3) % 3;
      if (this.switchSlot(order[i], now)) break;
    }
  }
  cancelReload() { this.reloadEnd = -1; this.reloadStart = -1; }

  eyeHeight() { return 1.62 - this.crouchAmt * 0.5; }
  eyeY() { return this.y + this.eyeHeight(); }
  muzzleY() { return this.eyeY() - 0.12; }

  aimDir(): [number, number, number] {
    const cp = Math.cos(this.pitch);
    return [Math.sin(this.yaw) * cp, Math.sin(this.pitch), Math.cos(this.yaw) * cp];
  }

  totalSpread(): number {
    const d = this.weaponDef;
    const hs = Math.hypot(this.vx, this.vz);
    let s = d.spreadBase + this.spread;
    s += d.spreadMoving * clamp(hs / RUN_SPEED, 0, 1) * (this.grounded ? 1 : 0.3);
    if (!this.grounded) s += d.spreadJump;
    if (this.crouch) s *= 0.65;
    if (this.scoped && d.scope) s = d.spreadBase * 0.5;
    return s;
  }

  /* ------------------------------------------------------------ */
  /* combat                                                        */
  /* ------------------------------------------------------------ */

  startReload(now: number): boolean {
    const st = this.current();
    const d = WEAPONS[st.id];
    if (d.slot === 'melee') return false;
    if (this.reloadEnd > now) return false;
    if (st.mag >= d.magSize || st.reserve <= 0) return false;
    this.reloadEnd = now + d.reloadTime;
    this.reloadStart = now;
    if (this.isPlayer) { audio.reload(0); }
    return true;
  }

  private finishReload(now: number) {
    const st = this.current();
    const d = WEAPONS[st.id];
    const need = d.magSize - st.mag;
    const take = Math.min(need, st.reserve);
    st.mag += take;
    st.reserve -= take;
    this.reloadEnd = -1;
    void now;
  }

  /** attempt to fire; returns true when a shot was released */
  tryFire(now: number, game: Game): boolean {
    if (!this.alive) return false;
    const st = this.current();
    const d = WEAPONS[st.id];
    if (this.reloadEnd > now) return false;
    if (this.busyAction !== 'none') return false;

    if (d.fireMode === 'melee') {
      if (now < this.fireCd) return false;
      this.fireCd = now + 1 / d.melee!.rate;
      game.meleeAttack(this, d);
      return true;
    }

    if (d.fireMode === 'semi' || d.fireMode === 'bolt') {
      if (!this.firing || this.semiLatch) return false;
      this.semiLatch = true;
    } else if (!this.firing) return false;

    if (now < this.fireCd) return false;
    if (st.mag <= 0) {
      if (this.isPlayer) { audio.dryFire(); this.startReload(now); }
      else this.startReload(now);
      return false;
    }
    this.fireCd = now + 60 / d.rpm;
    this.lastShotAt = now;
    st.mag--;

    // direction with spread
    const [dx, dy, dz] = this.aimDir();
    const spread = this.totalSpread();
    const [sdx, sdy, sdz] = coneSpread(dx, dy, dz, spread);
    const ox = this.x, oy = this.muzzleY(), oz = this.z;
    game.fireBullet(this, ox, oy, oz, sdx, sdy, sdz, d);

    // recoil & spread
    this.spread = Math.min(d.spreadMax, this.spread + d.spreadPerShot);
    this.recoilX += d.recoilPitch * (this.crouch ? 0.8 : 1);
    this.recoilY += (Math.random() - 0.5) * 2 * d.recoilYaw;
    if (this.isPlayer) audio.shot(d.sound, undefined, undefined, 1);
    else audio.shot(d.sound, this.x, this.z, 1);
    game.onShotFired(this, d);
    return true;
  }

  /** called every frame after firing logic */
  postUpdate(now: number, dt: number, world: World) {
    // keep the yaw in (-pi, pi] so long games do not accumulate turns
    if (this.yaw > Math.PI || this.yaw <= -Math.PI) {
      this.yaw = ((this.yaw + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
    }
    // semi-auto / bolt weapons need the trigger released between shots
    if (!this.firing) this.semiLatch = false;
    // spread recovery
    const d = this.weaponDef;
    this.spread = Math.max(0, this.spread - d.spreadRecover * dt);
    // view recoil recovery
    this.recoilX = Math.max(0, this.recoilX - this.recoilX * d.recoilRecover * dt);
    this.recoilY -= this.recoilY * d.recoilRecover * dt;
    // reload completion
    if (this.reloadEnd > 0 && now >= this.reloadEnd) {
      this.finishReload(now);
      if (this.isPlayer) audio.reload(2);
    } else if (this.isPlayer && this.reloadStart > 0) {
      const p = (now - this.reloadStart) / Math.max(0.01, this.reloadEnd - this.reloadStart);
      if (p > 0.55 && !this.reloadMid) { this.reloadMid = true; audio.reload(1); }
    }

    // hit flash decay
    if (this.flashT > 0) {
      this.flashT -= dt;
      if (this.flashT <= 0) this.humanoid.clearFlash();
    }

    // footsteps
    const hs = Math.hypot(this.vx, this.vz);
    if (this.grounded && hs > 0.6 && !this.crouch) {
      this.footDist += hs * dt;
      const stride = hs > 3.4 ? 2.35 : 2.9;
      if (this.footDist > stride) {
        this.footDist = 0;
        this.stepParity++;
        audio.footstep(this.x, this.z, hs > 3.4, this.stepParity);
      }
    }
    void world;
  }
  private reloadMid = false;

  takeDamage(dmg: number, region: Region, attacker: Character | null, weaponId: string, now: number): boolean {
    if (!this.alive) return false;
    const def = WEAPONS[weaponId];
    let hp = dmg;
    const armored = region === 'head' ? (this.helmet && this.armor > 0) : this.armor > 0;
    if (armored) {
      const r = applyArmor(dmg, def.armorPen, this.armor);
      hp = r.hp;
      this.armor = Math.round(r.armorLeft);
    }
    this.health -= hp;
    this.lastDamageFrom = attacker;
    this.flashT = 0.09;
    this.humanoid.flash(0x552222, 90);
    if (this.health <= 0) {
      this.health = 0;
      this.alive = false;
      this.deaths++;
      this.deadTime = 0.0001;
      this.firing = false;
      this.hasC4 = false;
      if (attacker && attacker !== this) attacker.kills++;
      return true;
    }
    void now;
    return false;
  }

  giveLoadout(primary: string | null, secondary: string, armor: number, helmet: boolean) {
    this.primary = primary ? makeWeaponState(primary) : null;
    this.secondary = makeWeaponState(secondary);
    this.melee = makeWeaponState('knife');
    this.armor = armor;
    this.helmet = helmet;
    this.slot = primary ? 'primary' : 'secondary';
    this.humanoid.setWeapon(WEAPONS[this.current().id].model);
    this.cancelReload();
    this.spread = 0;
  }

  /* ------------------------------------------------------------ */
  /* physics                                                       */
  /* ------------------------------------------------------------ */

  update(dt: number, world: World, now: number) {
    if (!this.alive) {
      this.deadTime += dt;
      this.humanoid.root.position.set(this.x, this.y, this.z);
      this.humanoid.root.rotation.y = this.yaw;
      this.humanoid.animate(this.walkPhase, 0, 0, false, 0, this.deadTime, 0);
      return;
    }

    // crouch smoothing
    this.crouchAmt = clamp(this.crouchAmt + (this.crouch ? 1 : -1) * dt * 7, 0, 1);

    const def = this.weaponDef;
    let speed = RUN_SPEED * def.moveSpeed;
    if (this.walk) speed *= 0.52;
    if (this.crouch) speed *= 0.45;
    if (this.scoped) speed *= 0.5;
    if (this.busyAction !== 'none') speed = 0;

    // wish velocity in world space
    const sy = Math.sin(this.yaw), cy = Math.cos(this.yaw);
    const wx = (this.moveSide * cy + this.moveFwd * sy);
    const wz = (-this.moveSide * sy + this.moveFwd * cy);
    const wl = Math.hypot(wx, wz);
    const scale = wl > 0.001 ? speed / wl : 0;
    const tx = wx * scale, tz = wz * scale;
    const accel = this.grounded ? 13 : 3.0;
    const k = 1 - Math.exp(-accel * dt);
    this.vx += (tx - this.vx) * k;
    this.vz += (tz - this.vz) * k;

    // jump / gravity
    if (this.wantJump && this.grounded && this.busyAction === 'none') {
      this.vy = JUMP_V;
      this.grounded = false;
      audio.jump();
    }
    this.vy -= GRAVITY * dt;
    this.wantJump = false;

    // horizontal move with wall sliding (grid heightfield collision)
    const feet = this.y;
    const mx = this.vx * dt, mz = this.vz * dt;
    let nx = this.x, nz = this.z;
    if (mx !== 0 && world.fits(this.x + mx, this.z, feet, PLAYER_R)) nx += mx;
    else this.vx = 0;
    if (mz !== 0 && world.fits(nx, this.z + mz, feet, PLAYER_R)) nz += mz;
    else this.vz = 0;
    this.x = nx; this.z = nz;

    // vertical
    const prevY = this.y;
    this.y += this.vy * dt;
    const support = world.supportHeight(this.x, this.z, this.y + 0.05);
    if (this.y <= support) {
      if (!this.grounded && this.vy < -4) audio.land(this.x, this.z);
      this.y = support;
      this.vy = 0;
      this.grounded = true;
    } else if (this.y > support + STEP * 0.5) {
      this.grounded = false;
    }
    if (prevY === this.y && this.vy < 0) this.vy = 0;

    // walk animation phase
    const hs = Math.hypot(this.vx, this.vz);
    this.walkPhase += dt * (0.6 + hs * 0.22);

    this.postUpdate(now, dt, world);
  }

  /* ------------------------------------------------------------ */

  syncModel(_dt: number) {
    const h = this.humanoid;
    h.root.position.set(this.x, this.y, this.z);
    h.root.rotation.y = this.yaw;
    const planting = this.busyAction !== 'none' ? 1 : 0;
    h.animate(this.walkPhase, Math.hypot(this.vx, this.vz), this.crouchAmt, !this.grounded, this.pitch, this.alive ? 0 : this.deadTime, planting);
  }

  /** world-space hitboxes for bullet collisions */
  hitboxes(): Hitbox[] {
    const h = 1 - this.crouchAmt * 0.26;
    const cy = this.y, yaw = this.yaw;
    const hb: Hitbox[] = [
      { region: 'head', cx: this.x, cz: this.z, y1: cy + 1.64 * h, y2: cy + 1.88 * h, hx: 0.135, hz: 0.145, yaw },
      { region: 'chest', cx: this.x, cz: this.z, y1: cy + 1.2 * h, y2: cy + 1.64 * h, hx: 0.25, hz: 0.17, yaw },
      { region: 'stomach', cx: this.x, cz: this.z, y1: cy + 0.94 * h, y2: cy + 1.2 * h, hx: 0.23, hz: 0.16, yaw },
      { region: 'leg', cx: this.x, cz: this.z, y1: cy + 0.0, y2: cy + 0.94 * h, hx: 0.21, hz: 0.17, yaw },
    ];
    // arms as two thin boxes beside the torso
    for (const side of [-1, 1]) {
      const lx = side * 0.31, lz = 0.03;
      const cx = this.x + lx * Math.cos(yaw) + lz * Math.sin(yaw);
      const cz = this.z - lx * Math.sin(yaw) + lz * Math.cos(yaw);
      hb.push({ region: 'arm', cx, cz, y1: cy + 1.06 * h, y2: cy + 1.56 * h, hx: 0.11, hz: 0.12, yaw });
    }
    return hb;
  }

  dispose(scene: THREE.Scene) {
    scene.remove(this.humanoid.root);
  }
}
