import { clamp, yawToDir } from '../core/math.ts';
import type { Rng, Vec3 } from '../core/math.ts';
import type { EventBus } from '../core/events.ts';
import type { HitboxGroup } from '../core/types.ts';
import type { World } from '../map/world.ts';
import type { Actor } from './actor.ts';
import { activeDef, activeWeapon, eyePos, isDeployed, isReloading } from './actor.ts';
import { raycastActor } from './hitbox.ts';
import { HITBOX_MULT, fireInterval } from './weapons.ts';
import type { WeaponDef, WeaponId } from './weapons.ts';

export interface CombatCtx {
  world: World;
  actors: Actor[];
  rng: Rng;
  bus: EventBus;
  time: number;
  /** Actor the human is looking through — decides first-person audio/effects. */
  viewActorId: number;
  onKill(victim: Actor, attacker: Actor | null, weaponId: WeaponId, headshot: boolean): void;
}

export interface TraceResult {
  point: Vec3;
  actor: Actor | null;
  group: HitboxGroup | null;
  dist: number;
  normal: Vec3;
}

/** The aim direction actually used for shooting: view angles plus recoil punch. */
export function aimDir(a: Actor): Vec3 {
  return yawToDir(a.yaw + a.punchYaw, a.pitch + a.punchPitch);
}

/** Current cone half-angle, accounting for movement, jumping and scope. */
export function currentSpread(a: Actor): number {
  const d = activeDef(a);
  const moveFactor = clamp(a.speed2D / 5.2, 0, 1);
  let s = d.spread + a.spread + d.moveSpread * moveFactor * moveFactor;
  if (!a.grounded) s += d.airSpread;
  if (a.crouching) s *= 0.7;
  if (a.scoped && d.scope) s *= d.scope.spreadMul;
  return s;
}

/**
 * Trace a single bullet through the world, stopping at the first wall, prop or
 * enemy hitbox. Teammates do not block fire (friendly fire is off).
 */
export function traceBullet(
  ctx: CombatCtx,
  shooter: Actor,
  origin: Vec3,
  dir: Vec3,
  maxDist: number,
): TraceResult {
  const worldHit = ctx.world.raycast(origin, dir, maxDist);
  let bestDist = worldHit.hit ? worldHit.dist : maxDist;
  let hitActor: Actor | null = null;
  let group: HitboxGroup | null = null;
  let point: Vec3 = worldHit.point;

  for (const other of ctx.actors) {
    if (other === shooter || !other.alive) continue;
    if (other.team === shooter.team) continue;
    const h = raycastActor(origin, dir, bestDist, other.pos, other.yaw, other.heightScale);
    if (h && h.dist < bestDist) {
      bestDist = h.dist;
      hitActor = other;
      group = h.group;
      point = h.point;
    }
  }
  return { point, actor: hitActor, group, dist: bestDist, normal: worldHit.normal };
}

/**
 * Attempt to fire the active weapon.
 * `pressed` is the rising edge of the trigger (semi-auto / bolt action),
 * `held` is the continuous state (full auto).
 */
export function tryFire(ctx: CombatCtx, a: Actor, pressed: boolean, held: boolean): boolean {
  if (!a.alive) return false;
  const def = activeDef(a);
  if (def.mode === 'none') return false;
  if (!isDeployed(a, ctx.time)) return false;
  if (isReloading(a, ctx.time)) return false;
  if (ctx.time < a.nextFireTime) return false;

  const wantShoot = def.mode === 'auto' ? held : pressed;
  if (!wantShoot) return false;

  const ws = activeWeapon(a);
  const firstPerson = a.id === ctx.viewActorId;

  if (def.mode === 'melee') {
    knifeAttack(ctx, a, def);
    a.nextFireTime = ctx.time + fireInterval(def);
    ctx.bus.emit('knifeSwing', { actorId: a.id, pos: eyePos(a), firstPerson });
    return true;
  }

  if (!ws || ws.mag <= 0) {
    if (pressed) ctx.bus.emit('emptyClick', { actorId: a.id, firstPerson });
    a.nextFireTime = ctx.time + 0.2;
    return false;
  }

  ws.mag--;
  a.nextFireTime = ctx.time + fireInterval(def);
  a.lastShotTime = ctx.time;

  const origin = eyePos(a);
  const spread = currentSpread(a);
  const r = spread * Math.sqrt(ctx.rng.next());
  const theta = ctx.rng.next() * Math.PI * 2;
  const dYaw = Math.cos(theta) * r;
  const dPitch = Math.sin(theta) * r;
  const dir = yawToDir(a.yaw + a.punchYaw + dYaw, clamp(a.pitch + a.punchPitch + dPitch, -1.5, 1.5));

  const trace = traceBullet(ctx, a, origin, dir, def.range);

  // Recoil: mostly vertical for the first few rounds, then it starts to drift.
  const n = a.shotsInBurst;
  const vertCurve = n < 3 ? 0.6 + 0.2 * n : 1;
  const horizCurve = n < 3 ? 0.25 : 1;
  a.punchPitch -= def.recoilPitch * vertCurve;
  a.punchYaw += def.recoilYaw * horizCurve * (Math.sin(n * 0.7) + ctx.rng.gauss(0.35));
  a.spread = Math.min(def.maxSpread, a.spread + def.spreadPerShot);
  a.shotsInBurst++;
  if (def.mode === 'bolt') {
    a.scoped = false;
    a.wantsScope = false;
  }

  ctx.bus.emit('shot', {
    actorId: a.id,
    weaponId: def.id,
    origin,
    end: trace.point,
    firstPerson,
  });

  if (trace.actor && trace.group) {
    const dmg = computeDamage(def, trace.group, trace.dist, trace.actor);
    applyDamage(ctx, trace.actor, a, dmg, trace.group, trace.point, def.id);
    ctx.bus.emit('impact', { point: trace.point, normal: trace.normal, surface: 'flesh' });
  } else {
    ctx.bus.emit('impact', { point: trace.point, normal: trace.normal, surface: 'world' });
  }
  return true;
}

function knifeAttack(ctx: CombatCtx, a: Actor, def: WeaponDef): void {
  const origin = eyePos(a);
  const dir = aimDir(a);
  const trace = traceBullet(ctx, a, origin, dir, def.range);
  if (!trace.actor || !trace.group) return;
  // Backstab: attacking from behind the victim multiplies the damage.
  const vDir = yawToDir(trace.actor.yaw);
  const toVictimX = trace.actor.pos.x - a.pos.x;
  const toVictimZ = trace.actor.pos.z - a.pos.z;
  const len = Math.hypot(toVictimX, toVictimZ) || 1;
  const facing = (vDir.x * toVictimX + vDir.z * toVictimZ) / len;
  const back = facing > 0.55;
  const dmg = computeDamage(def, trace.group, trace.dist, trace.actor) * (back ? 3.2 : 1);
  applyDamage(ctx, trace.actor, a, dmg, trace.group, trace.point, def.id);
  ctx.bus.emit('impact', { point: trace.point, normal: trace.normal, surface: 'flesh' });
}

/** Raw damage before armour, including hitbox multiplier and range falloff. */
export function computeDamage(def: WeaponDef, group: HitboxGroup, dist: number, victim: Actor): number {
  let dmg = def.damage * HITBOX_MULT[group];
  if (dist > def.falloffStart) {
    const mul = clamp(1 - ((dist - def.falloffStart) * def.falloffPerMeter) / 100, 0.4, 1);
    dmg *= mul;
  }
  return dmg;
}

export function applyDamage(
  ctx: CombatCtx,
  victim: Actor,
  attacker: Actor | null,
  rawDamage: number,
  group: HitboxGroup,
  point: Vec3,
  weaponId: WeaponId,
): void {
  if (!victim.alive) return;
  const def = attacker ? activeDef(attacker) : null;
  const armorPen = def ? def.armorPen : 0.8;

  let health = rawDamage;
  const armored = victim.armor > 0 && (group !== 'head' || victim.helmet);
  if (armored) {
    health = rawDamage * armorPen;
    const absorbed = (rawDamage - health) * 0.5;
    victim.armor = Math.max(0, victim.armor - absorbed);
  }
  health = Math.max(1, Math.round(health));
  victim.health -= health;
  if (attacker) victim.lastAttackerId = attacker.id;

  const fatal = victim.health <= 0;
  ctx.bus.emit('hit', {
    attackerId: attacker ? attacker.id : -1,
    victimId: victim.id,
    damage: health,
    group,
    point,
    fatal,
  });

  if (fatal) {
    victim.health = 0;
    victim.alive = false;
    victim.deaths++;
    victim.deathTime = ctx.time;
    victim.deathYaw = victim.yaw;
    victim.scoped = false;
    victim.vel.x = 0;
    victim.vel.z = 0;
    ctx.bus.emit('death', { actorId: victim.id, killerId: attacker ? attacker.id : -1, pos: { ...victim.pos }, team: victim.team });
    ctx.onKill(victim, attacker, weaponId, group === 'head');
  }
}

/** Recoil / bloom recovery, run every physics tick. */
export function decayRecoil(a: Actor, dt: number, time: number): void {
  const def = activeDef(a);
  const firing = time - a.lastShotTime < 0.22;
  if (!firing) {
    const k = Math.exp(-def.recoilRecovery * dt);
    a.punchPitch *= k;
    a.punchYaw *= k;
    a.spread = Math.max(0, a.spread - def.spreadRecovery * dt);
    if (time - a.lastShotTime > 0.35) a.shotsInBurst = 0;
  }
}
