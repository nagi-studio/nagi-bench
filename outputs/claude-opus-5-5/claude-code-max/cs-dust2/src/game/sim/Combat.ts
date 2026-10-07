import * as THREE from 'three';
import { PHYS } from '../core/config';
import { clamp, DEG, dirFromAngles } from '../core/math';
import { HITGROUP_MULTIPLIER, type HitGroup } from '../core/types';
import { makeRayHit, MASK_BULLET } from '../world/Collision';
import type { WeaponDef, WeaponInstance, WeaponSlot } from '../weapons/WeaponDefs';
import type { Actor } from './Actor';
import type { DamageSource } from './Events';
import type { World } from './World';

const _eye = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _right = new THREE.Vector3();
const _up = new THREE.Vector3();
const _end = new THREE.Vector3();
const _n = new THREE.Vector3();
const _hitPoint = new THREE.Vector3();
const UP = new THREE.Vector3(0, 1, 0);
const worldHit = makeRayHit();

/** Current inaccuracy cone (degrees) for an actor's held weapon. Drives both bullets and the crosshair. */
export function computeInaccuracy(a: Actor, def: WeaponDef): number {
  const sp = def.spread;
  let inacc = a.crouchAmt > 0.5 ? sp.crouch : sp.stand;
  const hs = Math.hypot(a.vel.x, a.vel.z);
  const frac = hs / Math.max(0.1, def.moveSpeed);
  const moveFactor = clamp((frac - PHYS.accurateSpeedFraction) / (1 - PHYS.accurateSpeedFraction), 0, 1);
  inacc += sp.move * moveFactor;
  if (!a.onGround) inacc += sp.air;
  inacc += Math.min(a.spreadBloom, sp.max);
  if (def.scope && a.scopeLevel === 0) inacc += def.scope.unscopedPenalty;
  return inacc;
}

export function switchSlot(world: World, a: Actor, slot: WeaponSlot): void {
  if (slot === a.slot || !a.weapons[slot]) return;
  if (a.planting) world.abortPlant(a);
  a.lastSlot = a.slot;
  a.slot = slot;
  a.reloading = false;
  a.scopeLevel = 0;
  a.rezoomAt = 0;
  const def = a.weapons[slot]!.def;
  a.drawEnd = world.time + def.drawTime;
  world.events.emit('draw', { actor: a, weapon: def.id });
}

/** Pick the best available slot (primary > secondary > knife). */
export function bestSlot(a: Actor): WeaponSlot {
  if (a.weapons[0]) return 0;
  if (a.weapons[1]) return 1;
  return 2;
}

export function startReload(world: World, a: Actor): void {
  const w = a.weapon;
  if (!w || a.reloading) return;
  const def = w.def;
  if (def.magSize === 0 || w.ammo >= def.magSize || w.reserve <= 0) return;
  if (world.time < a.drawEnd) return;
  a.reloading = true;
  a.reloadStart = world.time;
  a.reloadEnd = world.time + def.reloadTime;
  a.scopeLevel = 0;
  a.rezoomAt = 0;
  world.events.emit('reload', { actor: a, weapon: def.id });
}

/** Per-tick weapon handling: switching, reload, scope, recoil recovery, firing. */
export function updateWeapons(world: World, a: Actor, dt: number, canFire: boolean): void {
  const inp = a.input;
  const now = world.time;

  if (inp.slot !== null) switchSlot(world, a, inp.slot);
  if (inp.lastWeapon) switchSlot(world, a, a.lastSlot);

  const w = a.weapon;
  if (!w) return;
  const def = w.def;

  // recovery
  if (now - a.lastShotTime > def.fireInterval + 0.04) {
    const k = Math.exp(-def.recoil.recover * dt);
    a.recoilPitch *= k;
    a.recoilYaw *= k;
    a.recoilIndex = Math.max(0, a.recoilIndex - dt * def.recoil.recover * 3);
  }
  a.spreadBloom *= Math.exp(-def.spread.recover * dt);
  a.kick = Math.max(0, a.kick - dt * 7);

  if (a.reloading && now >= a.reloadEnd) {
    const take = Math.min(def.magSize - w.ammo, w.reserve);
    w.ammo += take;
    w.reserve -= take;
    a.reloading = false;
  }

  if (a.rezoomAt > 0 && now >= a.rezoomAt) {
    if (def.scope && !a.reloading && a.alive) {
      a.scopeLevel = a.rezoomLevel;
      world.events.emit('scope', { actor: a, level: a.scopeLevel });
    }
    a.rezoomAt = 0;
  }

  if (inp.reload) startReload(world, a);

  if (inp.altPressed && now >= a.drawEnd) {
    if (def.scope && !a.reloading) {
      a.scopeLevel = (a.scopeLevel + 1) % (def.scope.fovs.length + 1);
      a.rezoomAt = 0;
      world.events.emit('scope', { actor: a, level: a.scopeLevel });
    } else if (def.melee && canFire && now >= a.nextAttack) {
      knifeAttack(world, a, def, true);
    }
  }

  if (!inp.fire || !canFire || def.kind === 'c4') return;
  if (now < a.nextAttack || now < a.drawEnd || a.reloading) return;

  if (def.melee) {
    knifeAttack(world, a, def, false);
    return;
  }
  if (w.ammo <= 0) {
    if (inp.firePressed) {
      world.events.emit('dryFire', { actor: a, weapon: def.id });
      a.nextAttack = now + 0.25;
      if (w.reserve > 0) startReload(world, a);
    }
    return;
  }
  if (!def.automatic && !inp.firePressed) return;
  shoot(world, a, w);
}

function shoot(world: World, a: Actor, w: WeaponInstance): void {
  const def = w.def;
  const now = world.time;
  w.ammo--;
  a.nextAttack = now + def.fireInterval;
  a.lastShotTime = now;

  const inacc = computeInaccuracy(a, def) * DEG;
  const yaw = a.yaw - a.recoilYaw * DEG;
  const pitch = a.pitch + a.recoilPitch * DEG;
  dirFromAngles(yaw, pitch, _dir);
  if (inacc > 0) {
    _right.crossVectors(_dir, UP);
    if (_right.lengthSq() < 1e-8) _right.set(1, 0, 0);
    _right.normalize();
    _up.crossVectors(_right, _dir).normalize();
    const r = Math.tan(inacc * world.rng.next());
    const th = world.rng.next() * Math.PI * 2;
    _dir.addScaledVector(_right, Math.cos(th) * r).addScaledVector(_up, Math.sin(th) * r).normalize();
  }
  a.eyePos(_eye);
  traceBullet(world, a, def, _eye, _dir);

  // recoil for the following shot
  const pat = def.recoil.pattern;
  a.recoilIndex += 1;
  const kickIdx = Math.min(pat.length - 1, Math.floor(a.recoilIndex));
  a.recoilPitch += pat[kickIdx][0];
  a.recoilYaw += pat[kickIdx][1];
  a.spreadBloom = Math.min(def.spread.max, a.spreadBloom + def.spread.perShot);
  a.kick = 1;

  if (def.scope && a.scopeLevel > 0) {
    a.rezoomLevel = a.scopeLevel;
    a.scopeLevel = 0;
    a.rezoomAt = w.ammo > 0 ? now + def.fireInterval * 0.92 : 0;
  }
}

function traceBullet(world: World, a: Actor, def: WeaponDef, origin: THREE.Vector3, dir: THREE.Vector3): void {
  const maxD = def.range;
  const hitWorld = world.collision.raycast(origin.x, origin.y, origin.z, dir.x, dir.y, dir.z, maxD, MASK_BULLET, worldHit);
  let bestT = hitWorld ? worldHit.t : maxD;
  let victim: Actor | null = null;
  let group: HitGroup | null = null;
  for (const b of world.actors) {
    if (!b.alive || b === a || b.team === a.team) continue;
    if (!rayHitsBounds(origin, dir, b, bestT)) continue;
    const r = b.model.raycast(origin.x, origin.y, origin.z, dir.x, dir.y, dir.z, bestT);
    if (r && r.t < bestT) {
      bestT = r.t;
      victim = b;
      group = r.group;
    }
  }
  _end.copy(origin).addScaledVector(dir, bestT);
  if (victim && group) {
    const falloff = Math.pow(def.rangeMod, bestT / 10);
    applyDamage(world, victim, a, def.damage * falloff, group, def, _end, dir, def.id);
  } else if (hitWorld) {
    _n.set(worldHit.nx, worldHit.ny, worldHit.nz);
    world.events.emit('impact', { point: _end.clone(), normal: _n.clone(), material: worldHit.collider?.material ?? 'stone' });
  }
  world.events.emit('shot', { actor: a, weapon: def.id, origin: origin.clone(), end: _end.clone(), hitActor: victim !== null });
  world.noise(a, origin, def.id === 'usp' ? 14 : def.kind === 'sniper' ? 60 : 42);
}

/** Cheap broad phase: ray vs the actor's bounding box. */
function rayHitsBounds(o: THREE.Vector3, d: THREE.Vector3, b: Actor, maxT: number): boolean {
  const pad = 0.75;
  let tmin = 0;
  let tmax = maxT;
  for (let axis = 0; axis < 3; axis++) {
    const oa = axis === 0 ? o.x : axis === 1 ? o.y : o.z;
    const da = axis === 0 ? d.x : axis === 1 ? d.y : d.z;
    const mn = axis === 0 ? b.pos.x - pad : axis === 1 ? b.pos.y - 0.3 : b.pos.z - pad;
    const mx = axis === 0 ? b.pos.x + pad : axis === 1 ? b.pos.y + 2.1 : b.pos.z + pad;
    if (Math.abs(da) < 1e-12) {
      if (oa < mn || oa > mx) return false;
      continue;
    }
    let t1 = (mn - oa) / da;
    let t2 = (mx - oa) / da;
    if (t1 > t2) {
      const t = t1;
      t1 = t2;
      t2 = t;
    }
    if (t1 > tmin) tmin = t1;
    if (t2 < tmax) tmax = t2;
    if (tmin > tmax) return false;
  }
  return true;
}

function knifeAttack(world: World, a: Actor, def: WeaponDef, alt: boolean): void {
  const melee = def.melee!;
  const now = world.time;
  const range = alt ? melee.altRange : melee.range;
  a.nextAttack = now + (alt ? melee.altInterval : def.fireInterval);
  a.lastShotTime = now;
  a.kick = 1;
  a.eyePos(_eye);

  // a small fan of rays makes melee forgiving
  const offsets: [number, number][] = [
    [0, 0],
    [5, 0],
    [-5, 0],
    [0, 4],
    [0, -6],
  ];
  let bestT = range;
  let victim: Actor | null = null;
  let group: HitGroup | null = null;
  const hitDir = new THREE.Vector3();
  for (const [oy, op] of offsets) {
    dirFromAngles(a.yaw + oy * DEG, a.pitch + op * DEG, _dir);
    for (const b of world.actors) {
      if (!b.alive || b === a || b.team === a.team) continue;
      if (b.pos.distanceToSquared(a.pos) > 9) continue;
      b.model.updateHitboxes();
      const r = b.model.raycast(_eye.x, _eye.y, _eye.z, _dir.x, _dir.y, _dir.z, bestT);
      if (r && r.t < bestT) {
        bestT = r.t;
        victim = b;
        group = r.group;
        hitDir.copy(_dir);
      }
    }
  }
  let hit: 'none' | 'wall' | 'flesh' = 'none';
  if (victim && group) {
    hit = 'flesh';
    // backstab: attacking along the victim's facing direction
    const vf = dirFromAngles(victim.yaw, 0, _n);
    const back = vf.x * hitDir.x + vf.z * hitDir.z > 0.55;
    let dmg = alt ? melee.altDamage : def.damage;
    if (back) dmg = alt ? 180 : 90;
    _end.copy(_eye).addScaledVector(hitDir, bestT);
    applyDamage(world, victim, a, dmg, group, def, _end, hitDir, def.id);
  } else {
    dirFromAngles(a.yaw, a.pitch, _dir);
    if (world.collision.raycast(_eye.x, _eye.y, _eye.z, _dir.x, _dir.y, _dir.z, range, MASK_BULLET, worldHit)) {
      hit = 'wall';
      _hitPoint.set(worldHit.x, worldHit.y, worldHit.z);
      _n.set(worldHit.nx, worldHit.ny, worldHit.nz);
      world.events.emit('impact', { point: _hitPoint.clone(), normal: _n.clone(), material: worldHit.collider?.material ?? 'stone' });
    }
  }
  world.events.emit('knife', { actor: a, alt, hit });
}

/**
 * Applies hitbox-zone multipliers and CS-style armor: protected zones (helmet for head, kevlar for
 * chest/stomach/arms; legs never) let only `armorPen` of the damage through and wear the armor.
 */
export function applyDamage(
  world: World,
  victim: Actor,
  attacker: Actor | null,
  base: number,
  group: HitGroup | null,
  def: WeaponDef | null,
  point: THREE.Vector3,
  dir: THREE.Vector3,
  source: DamageSource,
): void {
  if (!victim.alive) return;
  let dmg = base * (group ? HITGROUP_MULTIPLIER[group] : 1);
  let armorDamage = 0;
  const protectedZone = group === null ? true : group === 'head' ? victim.helmet : group !== 'leg';
  if (victim.armor > 0 && protectedZone) {
    const pen = def ? def.armorPen : 0.5;
    let healthDmg = dmg * pen;
    armorDamage = (dmg - healthDmg) * 0.5;
    if (armorDamage > victim.armor) {
      healthDmg += (armorDamage - victim.armor) * 2;
      armorDamage = victim.armor;
    }
    victim.armor = Math.max(0, Math.floor(victim.armor - armorDamage));
    dmg = healthDmg;
  }
  const amount = Math.max(1, Math.floor(dmg));
  const dealt = Math.min(amount, victim.health);
  victim.health -= amount;
  victim.lastDamageTime = world.time;
  victim.lastAttacker = attacker;
  victim.lastDamageFrom.copy(dir).negate();
  if (attacker && attacker.team !== victim.team) attacker.damageDealt += dealt;
  world.events.emit('damage', {
    attacker,
    victim,
    amount,
    armorDamage,
    group,
    point: point.clone(),
    dir: dir.clone(),
    source,
  });
  if (victim.brain && attacker) victim.brain.onDamaged(attacker);
  if (victim.health <= 0) {
    victim.health = 0;
    world.killActor(victim, attacker, source, group === 'head', dir);
  }
}

