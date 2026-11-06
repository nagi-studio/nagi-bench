// Weapon simulation shared by human and bots: switching, reloading, zoom, spread,
// recoil (aim punch), hitscan against world + per-zone hitboxes, armor, damage and kills.

import * as THREE from 'three';
import type { Game } from '../Game';
import type { Soldier, WeaponInstance } from '../entities/Soldier';
import type { Intent } from '../types';
import { HITZONE_MULT, type HitZone, type Slot, type WeaponDef } from '../weapons/WeaponDefs';
import { raycastHitboxes } from '../entities/Hitbox';
import { DEG, clamp, dirFromAngles, lerp, randSym } from '../math';

const SLOTS: Slot[] = ['primary', 'secondary', 'melee'];
const tmpDir = new THREE.Vector3();
const tmpEye = new THREE.Vector3();
const tmpEnd = new THREE.Vector3();
const tmpMuzzle = new THREE.Vector3();
const tmpN = new THREE.Vector3();
const tmpP = new THREE.Vector3();

export interface ShotResult {
  hitSoldier: Soldier | null;
  zone: HitZone | null;
  end: THREE.Vector3;
}

export class Combat {
  constructor(private game: Game) {}

  switchTo(s: Soldier, slot: Slot) {
    if (!s.weapons[slot] || slot === s.current) return;
    const w = s.weapon;
    w.reloadEnd = 0;
    w.zoom = 0;
    w.resumeZoom = 0;
    s.lastSlot = s.current;
    s.current = slot;
    const nw = s.weapon;
    s.drawEnd = this.game.time + nw.def.drawTime;
    s.drawStart = this.game.time;
    nw.shots = 0;
    s.punchPitch = 0;
    s.punchYaw = 0;
    if (this.game.isControlled(s)) this.game.audio.draw();
  }

  cycle(s: Soldier, dir: 1 | -1) {
    const idx = SLOTS.indexOf(s.current);
    for (let k = 1; k <= 3; k++) {
      const slot = SLOTS[(idx + dir * k + 6) % 3];
      if (s.weapons[slot]) {
        this.switchTo(s, slot);
        return;
      }
    }
  }

  startReload(s: Soldier) {
    const w = s.weapon;
    const def = w.def;
    if (def.slot === 'melee' || w.reloading || w.ammo >= def.magSize || w.reserve <= 0) return;
    if (this.game.time < s.drawEnd) return;
    w.reloadStart = this.game.time;
    w.reloadEnd = this.game.time + def.reloadTime;
    w.zoom = 0;
    w.resumeZoom = 0;
    if (this.game.isControlled(s)) this.game.audio.reload(def.sound, def.reloadTime);
  }

  spreadOf(s: Soldier, w: WeaponInstance): number {
    const sp = w.def.spread;
    let v = sp.base + w.bloom;
    const speedFrac = clamp(s.horizontalSpeed / w.def.moveSpeed, 0, 1);
    v += sp.move * clamp((speedFrac - 0.32) / 0.68, 0, 1);
    if (!s.onGround) v += sp.air;
    v *= lerp(1, sp.crouchMul, s.crouch);
    if (w.def.scope && w.zoom === 0) v += sp.unscoped ?? 0;
    return v;
  }

  /** Per-tick weapon update: input handling + timers. */
  update(s: Soldier, intent: Intent, dt: number, canAct: boolean) {
    const g = this.game;
    const t = g.time;
    // slot switching
    if (intent.switchSlot && canAct) {
      if (intent.switchSlot === 'last') this.switchTo(s, s.weapons[s.lastSlot] ? s.lastSlot : 'melee');
      else if (intent.switchSlot === 'next') this.cycle(s, 1);
      else if (intent.switchSlot === 'prev') this.cycle(s, -1);
      else this.switchTo(s, intent.switchSlot);
    }
    const w = s.weapon;
    const def = w.def;

    // reload completion
    if (w.reloading && t >= w.reloadEnd) {
      const take = Math.min(def.magSize - w.ammo, w.reserve);
      w.ammo += take;
      w.reserve -= take;
      w.reloadEnd = 0;
    }
    if (intent.reload && canAct) this.startReload(s);

    // zoom / heavy attack
    if (intent.altPressed && canAct && t >= s.drawEnd) {
      if (def.scope && !w.reloading) {
        w.zoom = (w.zoom + 1) % (def.scope.fovs.length + 1);
        w.resumeZoom = 0;
        if (g.isControlled(s)) g.audio.scope();
      } else if (def.melee && t >= w.nextFire) {
        this.melee(s, true);
      }
    }
    // AWP re-zoom after bolt cycle
    if (w.resumeZoom > 0 && t >= w.nextFire && !w.reloading) {
      w.zoom = w.resumeZoom;
      w.resumeZoom = 0;
    }

    // firing
    const wantsFire = def.auto ? intent.fire : intent.firePressed;
    if (wantsFire && canAct) this.tryFire(s);

    // recovery
    const interval = 60 / def.rpm;
    if (t - w.lastShot > interval * 1.15) {
      w.bloom = Math.max(0, w.bloom - def.spread.recover * dt);
      const k = Math.min(1, def.recoil.recover * dt);
      s.punchPitch -= s.punchPitch * k;
      s.punchYaw -= s.punchYaw * k;
    }
    if (t - w.lastShot > Math.max(0.3, interval * 2)) w.shots = 0;
  }

  tryFire(s: Soldier): boolean {
    const g = this.game;
    const t = g.time;
    const w = s.weapon;
    const def = w.def;
    if (t < s.drawEnd || w.reloading || t < w.nextFire) return false;
    if (def.melee) {
      this.melee(s, false);
      return true;
    }
    if (w.ammo <= 0) {
      w.nextFire = t + 0.25;
      if (g.isControlled(s)) g.audio.empty();
      if (w.reserve > 0) this.startReload(s);
      return false;
    }
    w.ammo--;
    w.nextFire = t + 60 / def.rpm;
    w.lastShot = t;

    // bullet direction = view + aim punch + random cone
    const spread = this.spreadOf(s, w) * DEG;
    const yaw = s.yaw + s.punchYaw * DEG;
    const pitch = s.pitch + s.punchPitch * DEG;
    dirFromAngles(yaw, pitch, tmpDir);
    if (spread > 0) {
      const a = Math.random() * Math.PI * 2;
      const r = spread * Math.sqrt(Math.random());
      // perpendicular basis
      const right = tmpN.set(Math.cos(yaw), 0, -Math.sin(yaw));
      const up = tmpP.crossVectors(right, tmpDir).normalize();
      tmpDir.addScaledVector(right, Math.cos(a) * r).addScaledVector(up, Math.sin(a) * r).normalize();
    }
    s.eye(tmpEye);
    const res = this.traceBullet(s, tmpEye, tmpDir, def);

    // recoil
    const rc = def.recoil;
    s.punchPitch = Math.min(rc.maxPitch, s.punchPitch + rc.pitch + w.shots * rc.pitchGrow);
    let yawKick = randSym() * rc.yaw;
    if (w.shots > 3) yawKick += Math.sin(w.shots * 0.45) * rc.yawSway * 0.35;
    s.punchYaw = clamp(s.punchYaw + yawKick, -rc.yawSway * 2 - 1, rc.yawSway * 2 + 1);
    w.shots++;
    w.bloom = Math.min(def.spread.max, w.bloom + def.spread.perShot);
    if (def.scope && w.zoom > 0) {
      w.resumeZoom = w.zoom;
      w.zoom = 0;
      if (g.isControlled(s)) g.audio.boltCycle(0.35);
    } else if (def.id === 'awp' && g.isControlled(s)) g.audio.boltCycle(0.35);

    // feedback
    const controlled = g.isControlled(s);
    if (controlled) {
      g.audio.shot(def.sound, null);
      g.viewMuzzle(tmpMuzzle);
    } else {
      s.model?.muzzleWorld(tmpMuzzle);
      s.model?.onShot();
      g.audio.shot(def.sound, tmpMuzzle, !g.audibleLine(tmpMuzzle));
    }
    if (def.id !== 'usp') g.effects.muzzleLight(tmpMuzzle, t, def.id === 'awp' ? 1.6 : 1);
    if (!controlled || Math.random() < 0.55) g.effects.tracer(tmpMuzzle, res.end);
    g.emitNoise(s, s.pos, def.id === 'usp' ? 10 : 48);
    return true;
  }

  traceBullet(s: Soldier, eye: THREE.Vector3, dir: THREE.Vector3, def: WeaponDef, maxRange = def.range): ShotResult {
    const g = this.game;
    const hit = g.world.raycast(eye.x, eye.y, eye.z, dir.x, dir.y, dir.z, maxRange);
    let wallT = hit ? hit.t : maxRange;
    let victim: Soldier | null = null;
    let zone: HitZone | null = null;
    for (const o of g.soldiers) {
      if (!o.alive || o === s || o.team === s.team) continue;
      const zh = raycastHitboxes(o, eye.x, eye.y, eye.z, dir.x, dir.y, dir.z, wallT);
      if (zh && zh.t < wallT) {
        wallT = zh.t;
        victim = o;
        zone = zh.zone;
      }
    }
    tmpEnd.copy(eye).addScaledVector(dir, wallT);
    if (victim && zone) {
      tmpN.copy(dir).negate();
      g.effects.impact(tmpEnd, tmpN, 'blood');
      this.damage(victim, s, def, zone, wallT, dir);
    } else if (hit) {
      tmpN.set(hit.nx, hit.ny, hit.nz);
      const kind = hit.box?.mat === 'metal' ? 'metal' : hit.box && (hit.box.mat === 'crate' || hit.box.mat === 'crateDark' || hit.box.mat === 'door') ? 'wood' : 'dust';
      g.effects.impact(tmpEnd, tmpN, kind);
      if (def.slot !== 'melee') g.effects.decal(tmpEnd, tmpN);
    }
    return { hitSoldier: victim, zone, end: tmpEnd.clone() };
  }

  melee(s: Soldier, heavy: boolean) {
    const g = this.game;
    const w = s.weapon;
    const def = w.def;
    const m = def.melee!;
    w.lastShot = g.time;
    w.nextFire = g.time + (heavy ? m.heavyRate : 60 / def.rpm);
    s.eye(tmpEye);
    let best: Soldier | null = null;
    let bestT = m.range;
    let bestZone: HitZone = 'chest';
    for (const off of [0, 0.18, -0.18]) {
      dirFromAngles(s.yaw + off, s.pitch, tmpDir);
      const wall = g.world.raycast(tmpEye.x, tmpEye.y, tmpEye.z, tmpDir.x, tmpDir.y, tmpDir.z, m.range);
      const lim = wall ? wall.t : m.range;
      for (const o of g.soldiers) {
        if (!o.alive || o === s || o.team === s.team) continue;
        const zh = raycastHitboxes(o, tmpEye.x, tmpEye.y, tmpEye.z, tmpDir.x, tmpDir.y, tmpDir.z, Math.min(lim, bestT));
        if (zh && zh.t < bestT) {
          best = o;
          bestT = zh.t;
          bestZone = zh.zone;
        }
      }
    }
    const controlled = g.isControlled(s);
    g.audio.knife(controlled ? null : s.pos, !!best);
    if (!best) {
      // hit wall?
      dirFromAngles(s.yaw, s.pitch, tmpDir);
      const wall = g.world.raycast(tmpEye.x, tmpEye.y, tmpEye.z, tmpDir.x, tmpDir.y, tmpDir.z, m.range);
      if (wall) {
        tmpEnd.set(wall.x, wall.y, wall.z);
        g.effects.impact(tmpEnd, tmpN.set(wall.nx, wall.ny, wall.nz), 'dust');
      }
      return;
    }
    // backstab check
    const vf = tmpN.set(-Math.sin(best.yaw), 0, -Math.cos(best.yaw));
    const toVictim = tmpP.set(best.pos.x - s.pos.x, 0, best.pos.z - s.pos.z).normalize();
    const back = vf.dot(toVictim) > 0.5;
    let dmg = heavy ? m.heavyDamage : def.damage;
    if (back) dmg *= m.backstabMul;
    dirFromAngles(s.yaw, s.pitch, tmpDir);
    tmpEnd.copy(tmpEye).addScaledVector(tmpDir, bestT);
    g.effects.impact(tmpEnd, tmpN.copy(tmpDir).negate(), 'blood');
    this.applyDamage(best, s, dmg, def.armorPen, bestZone === 'leg' ? 'leg' : 'chest', def.killIcon, tmpDir, false);
  }

  damage(victim: Soldier, attacker: Soldier, def: WeaponDef, zone: HitZone, dist: number, dir: THREE.Vector3) {
    const base = def.damage * Math.pow(def.rangeMod, dist / 10) * HITZONE_MULT[zone];
    this.applyDamage(victim, attacker, base, def.armorPen, zone, def.killIcon, dir, zone === 'head');
  }

  applyDamage(
    victim: Soldier,
    attacker: Soldier | null,
    raw: number,
    armorPen: number,
    zone: HitZone,
    weaponName: string,
    dir: THREE.Vector3 | null,
    headshot: boolean,
  ) {
    const g = this.game;
    if (!victim.alive) return;
    let dmg = raw;
    const armored = victim.armor > 0 && zone !== 'leg' && (zone !== 'head' || victim.helmet);
    if (armored) {
      let reduced = dmg * armorPen;
      let armorTaken = (dmg - reduced) * 0.5;
      if (armorTaken > victim.armor) {
        armorTaken = victim.armor;
        reduced = dmg - armorTaken * 2;
      }
      victim.armor = Math.max(0, Math.round(victim.armor - armorTaken));
      dmg = reduced;
    }
    const amount = Math.max(1, Math.round(dmg));
    victim.health -= amount;
    victim.lastHurtTime = g.time;
    victim.slowUntil = g.time + 0.35;
    if (attacker) victim.lastAttackerId = attacker.id;
    // aim punch from being hit
    victim.punchPitch += 1.2 + Math.random();
    victim.punchYaw += randSym() * 0.8;

    if (attacker && g.isControlled(attacker)) g.onPlayerHit(headshot, armored);
    if (g.isControlled(victim)) g.onPlayerHurt(attacker);
    victim.brain?.onDamaged(attacker);

    if (victim.health <= 0) {
      victim.health = 0;
      g.killSoldier(victim, attacker, weaponName, headshot, dir);
    }
  }
}
