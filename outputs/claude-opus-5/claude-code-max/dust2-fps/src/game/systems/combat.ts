/**
 * Combat: shooting, spread/recoil, hitscan resolution and damage.
 *
 * Bullets are instant rays. Every ray is tested against the world *and* every actor, so
 * teammates block your line of fire (without taking damage) exactly like in CS.
 */

import { TAU, Vec3, clamp, dirFromAngles, rightFromYaw } from '../../core/math.ts';
import type { Actor } from '../actor.ts';
import { ARMOR_ABSORB, otherTeam } from '../constants.ts';
import type { SimContext } from '../context.ts';
import { HIT_MULTIPLIER, type HitPart, rayVsActor } from '../hitbox.ts';
import type { SolidKind } from '../map/collision.ts';
import { speedFraction } from './movement.ts';
import { type WeaponDef, type WeaponId, fireInterval, rangeFalloff } from '../weapons.ts';

const eye = new Vec3();
const dir = new Vec3();
const side = new Vec3();
const up = new Vec3();
const end = new Vec3();

/** Total inaccuracy cone (radians) for an actor's current state. */
export function currentSpread(a: Actor): number {
  const s = a.weapon().spread;
  let cone = s.base + a.spreadAccum;
  if (!a.onGround) cone += s.jumping;
  else if (a.speed > 0.9) cone += s.moving * speedFraction(a);
  if (a.crouching) cone += s.crouching;
  if (a.scopeLevel > 0) cone *= 0.3;
  return Math.max(0.00015, cone);
}

/** Per-frame weapon bookkeeping: reload completion, spread decay, recoil recovery. */
export function updateWeaponState(ctx: SimContext, a: Actor, dt: number): void {
  const def = a.weapon();

  if (a.reloading && ctx.time >= a.reloadEndsAt) {
    a.reloading = false;
    const ammo = a.currentAmmo();
    const needed = def.magazine - ammo.mag;
    const taken = Math.min(needed, ammo.reserve);
    ammo.mag += taken;
    ammo.reserve -= taken;
    ctx.events.push({
      type: 'reloadDone',
      actorId: a.id,
      weapon: a.weaponId(),
      firstPerson: a.id === ctx.playerActorId,
      pos: a.pos.clone(),
    });
  }

  // Cone recovery.
  const rec = def.spread.recovery;
  a.spreadAccum = Math.max(0, a.spreadAccum * Math.exp(-rec * dt) - 0.0004 * dt);

  // View punch springs back towards centre.
  const punchRec = def.recoil.recovery;
  const k = Math.exp(-punchRec * dt);
  a.viewPunchPitch *= k;
  a.viewPunchYaw *= k;

  // Recoil pattern resets after a pause in fire.
  if (ctx.time - a.nextFireAt > 0.35) a.shotIndex = 0;
}

export function tryReload(ctx: SimContext, a: Actor): boolean {
  const def = a.weapon();
  if (def.slot === 'melee' || a.reloading) return false;
  const ammo = a.currentAmmo();
  if (ammo.mag >= def.magazine || ammo.reserve <= 0) return false;

  a.reloading = true;
  a.reloadEndsAt = ctx.time + def.reloadTime;
  a.nextFireAt = Math.max(a.nextFireAt, a.reloadEndsAt);
  a.scopeLevel = 0;
  a.spreadAccum = 0;
  ctx.events.push({
    type: 'reload',
    actorId: a.id,
    weapon: a.weaponId(),
    firstPerson: a.id === ctx.playerActorId,
    pos: a.pos.clone(),
  });
  return true;
}

export function toggleScope(ctx: SimContext, a: Actor): void {
  const def = a.weapon();
  if (!def.scope || a.reloading) return;
  a.scopeLevel = (a.scopeLevel + 1) % (def.scope.fovs.length + 1);
  ctx.events.push({
    type: 'scope',
    actorId: a.id,
    level: a.scopeLevel,
    firstPerson: a.id === ctx.playerActorId,
  });
}

export function setScope(ctx: SimContext, a: Actor, level: number): void {
  const def = a.weapon();
  if (!def.scope) return;
  const clamped = clamp(level, 0, def.scope.fovs.length);
  if (clamped === a.scopeLevel) return;
  a.scopeLevel = clamped;
  ctx.events.push({
    type: 'scope',
    actorId: a.id,
    level: a.scopeLevel,
    firstPerson: a.id === ctx.playerActorId,
  });
}

export interface TraceResult {
  distance: number;
  actor: Actor | null;
  part: HitPart | null;
  point: Vec3;
  normal: Vec3 | null;
  surface: SolidKind | null;
}

/** Casts a bullet ray through the world and every actor. */
export function traceBullet(
  ctx: SimContext,
  shooter: Actor,
  origin: Vec3,
  direction: Vec3,
  maxRange: number,
): TraceResult {
  let bestDist = maxRange;
  let hitActor: Actor | null = null;
  let hitPart: HitPart | null = null;
  let normal: Vec3 | null = null;
  let surface: SolidKind | null = null;

  const worldHit = ctx.collision.rayCast(origin, direction, maxRange);
  if (worldHit) {
    bestDist = worldHit.distance;
    normal = worldHit.normal;
    surface = worldHit.box.kind;
  }

  for (const other of ctx.actors) {
    if (!other.alive || other.id === shooter.id) continue;
    const r = rayVsActor(origin, direction, bestDist, other.pos, other.yaw, other.crouching);
    if (r && r.distance < bestDist) {
      bestDist = r.distance;
      hitActor = other;
      hitPart = r.part;
      normal = null;
      surface = null;
    }
  }

  return {
    distance: bestDist,
    actor: hitActor,
    part: hitPart,
    point: new Vec3(
      origin.x + direction.x * bestDist,
      origin.y + direction.y * bestDist,
      origin.z + direction.z * bestDist,
    ),
    normal,
    surface,
  };
}

/**
 * Applies damage with CS-style armour mitigation. Armour only protects the head when the
 * victim owns a helmet.
 */
export function applyDamage(
  ctx: SimContext,
  attacker: Actor | null,
  victim: Actor,
  rawDamage: number,
  part: HitPart,
  weapon: WeaponDef | null,
  point: Vec3,
): number {
  if (!victim.alive) return 0;

  let damage = rawDamage;
  const armourApplies = victim.armor > 0 && (part !== 'head' || victim.helmet);
  if (armourApplies && weapon) {
    const through = damage * weapon.armorPenetration;
    const absorbed = (damage - through) * ARMOR_ABSORB;
    victim.takeArmor(absorbed);
    damage = through;
  } else if (armourApplies) {
    const through = damage * 0.5;
    victim.takeArmor((damage - through) * ARMOR_ABSORB);
    damage = through;
  }

  damage = Math.max(1, Math.round(damage));
  victim.health -= damage;
  if (attacker) {
    attacker.damageDealt += damage;
    victim.lastAttacker = attacker.id;
  }

  ctx.events.push({
    type: 'hit',
    attacker: attacker ? attacker.id : -1,
    victim: victim.id,
    part,
    damage,
    point: point.clone(),
    byPlayer: attacker ? attacker.id === ctx.playerActorId : false,
    onPlayer: victim.id === ctx.playerActorId,
  });

  if (victim.health <= 0) {
    killActor(ctx, attacker, victim, weapon ? weapon.id : 'world', part === 'head');
  }
  return damage;
}

export function killActor(
  ctx: SimContext,
  attacker: Actor | null,
  victim: Actor,
  weapon: WeaponId | 'bomb' | 'world',
  headshot: boolean,
): void {
  if (!victim.alive) return;
  victim.alive = false;
  victim.health = 0;
  victim.deaths++;
  victim.triggerHeld = false;
  victim.plantProgress = 0;
  victim.defuseProgress = 0;
  victim.killedBy = attacker ? attacker.id : -1;

  if (attacker && attacker.team !== victim.team) {
    attacker.kills++;
    // A death is information: the victim's team learns roughly where the killer is, which
    // is what makes the survivors rotate towards the fight.
    ctx.intel[victim.team].set(attacker.id, { pos: attacker.pos.clone(), time: ctx.time });
  } else if (attacker && attacker.id !== victim.id) {
    attacker.kills--;
  }

  // Carrying the bomb? Drop it where you fell so another T can pick it up.
  if (victim.hasBomb) {
    victim.hasBomb = false;
    ctx.bomb.state = 'dropped';
    ctx.bomb.carrier = -1;
    ctx.bomb.pos.copy(victim.pos);
    ctx.events.push({ type: 'bombDrop', pos: victim.pos.clone() });
  }

  ctx.events.push({
    type: 'kill',
    attacker: attacker ? attacker.id : -1,
    victim: victim.id,
    attackerName: attacker ? attacker.name : '世界',
    victimName: victim.name,
    attackerTeam: attacker ? attacker.team : otherTeam(victim.team),
    victimTeam: victim.team,
    weapon,
    headshot,
    byPlayer: attacker ? attacker.id === ctx.playerActorId : false,
    onPlayer: victim.id === ctx.playerActorId,
  });
}

/**
 * Fires the current weapon if it is ready. Returns true when a shot was actually taken.
 */
export function tryFire(ctx: SimContext, a: Actor): boolean {
  const def = a.weapon();
  if (ctx.time < a.nextFireAt || ctx.time < a.deployEndsAt) return false;
  if (a.reloading) return false;

  const firstPerson = a.id === ctx.playerActorId;

  if (def.slot !== 'melee') {
    const ammo = a.currentAmmo();
    if (ammo.mag <= 0) {
      a.nextFireAt = ctx.time + 0.3;
      ctx.events.push({ type: 'dryfire', actorId: a.id, firstPerson });
      tryReload(ctx, a);
      return false;
    }
    ammo.mag--;
  }

  a.nextFireAt = ctx.time + fireInterval(def);

  // ---- aim direction: view punch first, then the random cone ----------------
  a.eyePos(eye);
  dirFromAngles(a.yaw + a.viewPunchYaw, clamp(a.pitch + a.viewPunchPitch, -1.5, 1.5), dir);

  const cone = currentSpread(a);
  if (cone > 0.0002) {
    rightFromYaw(a.yaw, side);
    up.cross(side, dir).normalize();
    const angle = ctx.rng.next() * TAU;
    const radius = cone * Math.sqrt(ctx.rng.next());
    dir.addScaled(side, Math.cos(angle) * radius);
    dir.addScaled(up, Math.sin(angle) * radius);
    dir.normalize();
  }

  const trace = traceBullet(ctx, a, eye, dir, def.maxRange);
  end.copy(trace.point);

  ctx.events.push({
    type: 'shot',
    actorId: a.id,
    weapon: def.id,
    origin: eye.clone(),
    dir: dir.clone(),
    end: end.clone(),
    hitActor: trace.actor ? trace.actor.id : -1,
    firstPerson,
  });

  if (trace.actor && trace.part) {
    if (trace.actor.team !== a.team) {
      const raw = def.damage * HIT_MULTIPLIER[trace.part] * rangeFalloff(def, trace.distance);
      applyDamage(ctx, a, trace.actor, raw, trace.part, def, trace.point);
    }
    // Same-team hits are absorbed by the body: no damage, no wall impact.
  } else if (trace.normal) {
    ctx.events.push({
      type: 'impact',
      point: trace.point,
      normal: trace.normal,
      surface: trace.surface ?? 'wall',
    });
  }

  // ---- recoil --------------------------------------------------------------
  const s = def.spread;
  a.spreadAccum = Math.min(a.spreadAccum + s.perShot, s.max);

  const idx = a.shotIndex++;
  const rampUp = idx < 3 ? 0.55 + idx * 0.18 : 1;
  const drift = idx < 3 ? 0.25 : 1;
  a.viewPunchPitch += def.recoil.vertical * rampUp;
  a.viewPunchYaw += def.recoil.horizontal * drift * Math.sin(idx * 0.9 + 0.4);

  if (def.scope && def.scope.unscopeOnFire) setScope(ctx, a, 0);

  return true;
}
