/**
 * 战斗：开火节奏 / 精度模型 / 后坐力 / 命中判定 / 伤害结算。
 *
 * 精度模型（贴近 CS 的手感）：
 *   实际弹道 = 视角(含后坐力冲击) + 一个半角为 inaccuracy 的随机锥
 *   inaccuracy = 基础 + 累计扩散 + 移动惩罚 + 空中惩罚（蹲下打折）
 * 后坐力冲击直接作用在"视角"上，所以准星会跟着往上飘，
 * 子弹永远打在准星处——玩家要靠往下压鼠标来对抗，这就是压枪。
 */

import {
  TAU,
  anglesToDir,
  basisFromDir,
  clamp,
  v3,
  vnormalize,
} from '../core/math.ts';
import type { Vec3 } from '../core/math.ts';
import type { Rng } from '../core/rng.ts';
import type { CollisionWorld } from '../map/collision.ts';
import type { Actor } from './actor.ts';
import {
  actorBoundsRadius,
  activeWeapon,
  activeWeaponDef,
  computeDamage,
  eyePos,
  raycastActor,
} from './actor.ts';
import type { GameEvent } from './events.ts';
import type { HitboxName, WeaponDef, WeaponId } from './weapons.ts';
import { WEAPONS, fireInterval, recoilPattern } from './weapons.ts';

/** 连发计数在停火多久后清零 */
const RECOIL_RESET = 0.35;

export interface CombatCtx {
  world: CollisionWorld;
  actors: Actor[];
  rng: Rng;
  time: number;
  emit: (e: GameEvent) => void;
  localActorId: number;
  /** 命中回调，引擎用来记分/播报 */
  onKill: (victim: Actor, attacker: Actor | null, weapon: WeaponId, headshot: boolean) => void;
}

const tmpEye = v3();
const tmpDir = v3();
const tmpRight = v3();
const tmpUp = v3();

/** 当前散布半角（弧度）。 */
export function currentInaccuracy(a: Actor, def: WeaponDef): number {
  const base = a.scoped && def.scope ? def.scope.spread : def.baseSpread;
  let inacc = base + a.spread;
  const maxSpeed = def.moveSpeed;
  const moveFactor = clamp(a.speed / Math.max(1, maxSpeed), 0, 1.2);
  inacc += def.moveSpread * moveFactor * moveFactor;
  if (!a.grounded) inacc += def.airSpread;
  if (a.crouching) inacc *= 0.65;
  return inacc;
}

/** 视角（含后坐力冲击）对应的朝向。 */
export function aimDir(a: Actor, out: Vec3): Vec3 {
  return anglesToDir(out, a.yaw + a.punchYaw, a.pitch + a.punchPitch);
}

/**
 * 每帧更新武器状态：切枪、装弹、扩散/后坐力回落、自动开火。
 */
export function updateWeapon(ctx: CombatCtx, a: Actor, dt: number): void {
  const def = activeWeaponDef(a);
  const ws = activeWeapon(a);

  // 后坐力冲击回落（指数）
  const rec = Math.exp(-def.recoilRecovery * dt);
  a.punchPitch *= rec;
  a.punchYaw *= rec;
  // 累计扩散回落
  a.spread *= Math.exp(-def.spreadRecovery * dt);
  if (a.spread < 1e-5) a.spread = 0;

  if (a.deployTimer > 0) a.deployTimer = Math.max(0, a.deployTimer - dt);
  if (a.fireCooldown > 0) a.fireCooldown = Math.max(0, a.fireCooldown - dt);

  // 停火后复位弹道计数
  if (ctx.time - a.lastShotTime > RECOIL_RESET && a.recoilIndex > 0) {
    a.recoilIndex = 0;
  }

  // 装弹
  if (a.reloadTimer > 0) {
    a.reloadTimer -= dt;
    if (a.reloadTimer <= 0 && ws) {
      const need = WEAPONS[ws.id].magSize - ws.ammo;
      const take = Math.min(need, ws.reserve);
      ws.ammo += take;
      ws.reserve -= take;
      a.reloadTimer = 0;
    }
    return;
  }

  if (a.busy) return;

  // 开镜（只有带瞄准镜的武器）
  if (def.scope) {
    const want = a.intent.scope && a.deployTimer <= 0;
    if (want !== a.scoped) {
      a.scoped = want;
      ctx.emit({ type: 'scope', actorId: a.id, on: want });
    }
  } else if (a.scoped) {
    a.scoped = false;
  }
  a.scopeLevel += ((a.scoped ? 1 : 0) - a.scopeLevel) * Math.min(1, dt * 18);

  // 手动装弹
  if (a.intent.reload && ws && ws.ammo < def.magSize && ws.reserve > 0) {
    startReload(ctx, a);
    return;
  }

  // 开火
  const wantFire = def.auto ? a.intent.fire : a.intent.firePressed;
  if (wantFire && a.deployTimer <= 0 && a.fireCooldown <= 0) {
    if (def.slot === 'melee') {
      meleeAttack(ctx, a, def);
    } else if (def.slot === 'bomb') {
      /* C4 不能开火 */
    } else if (ws && ws.ammo > 0) {
      fireBullet(ctx, a, def, ws.id);
      ws.ammo--;
      if (ws.ammo === 0 && ws.reserve > 0) startReload(ctx, a);
    } else if (ws) {
      ctx.emit({ type: 'empty', actorId: a.id });
      a.fireCooldown = 0.25;
      if (ws.reserve > 0) startReload(ctx, a);
    }
  }
}

export function startReload(ctx: CombatCtx, a: Actor): void {
  const def = activeWeaponDef(a);
  const ws = activeWeapon(a);
  if (!ws || ws.reserve <= 0 || ws.ammo >= def.magSize || a.reloadTimer > 0) return;
  a.reloadTimer = def.reloadTime;
  a.scoped = false;
  a.recoilIndex = 0;
  ctx.emit({ type: 'reload', actorId: a.id, weapon: ws.id, x: a.pos.x, y: a.pos.y, z: a.pos.z });
}

/** 一发子弹：算方向 -> 打射线 -> 结算。 */
function fireBullet(ctx: CombatCtx, a: Actor, def: WeaponDef, weaponId: WeaponId): void {
  a.fireCooldown = fireInterval(def);
  a.lastShotTime = ctx.time;

  eyePos(a, tmpEye);
  aimDir(a, tmpDir);

  // 散布
  const inacc = currentInaccuracy(a, def);
  if (inacc > 1e-6) {
    basisFromDir(tmpDir, tmpRight, tmpUp);
    const ang = ctx.rng.next() * TAU;
    const rad = Math.sqrt(ctx.rng.next()) * inacc;
    const ox = Math.cos(ang) * rad;
    const oy = Math.sin(ang) * rad;
    tmpDir.x += tmpRight.x * ox + tmpUp.x * oy;
    tmpDir.y += tmpRight.y * ox + tmpUp.y * oy;
    tmpDir.z += tmpRight.z * ox + tmpUp.z * oy;
    vnormalize(tmpDir, tmpDir);
  }

  ctx.emit({
    type: 'shot',
    actorId: a.id,
    weapon: weaponId,
    x: tmpEye.x,
    y: tmpEye.y,
    z: tmpEye.z,
    dx: tmpDir.x,
    dy: tmpDir.y,
    dz: tmpDir.z,
    local: a.id === ctx.localActorId,
  });

  traceBullet(ctx, a, def, weaponId, tmpEye, tmpDir);

  // 后坐力：视角冲击 + 扩散累加
  const kick = recoilPattern(def, a.recoilIndex);
  a.punchPitch += kick.v;
  a.punchYaw += kick.h;
  a.spread = Math.min(def.maxSpread, a.spread + def.spreadPerShot);
  a.recoilIndex++;
}

/** 射线穿过世界，找最近的墙或人。 */
function traceBullet(
  ctx: CombatCtx,
  shooter: Actor,
  def: WeaponDef,
  weaponId: WeaponId,
  origin: Vec3,
  dir: Vec3,
): void {
  const maxDist = def.range;
  const worldHit = ctx.world.raycast(
    origin.x,
    origin.y,
    origin.z,
    dir.x,
    dir.y,
    dir.z,
    maxDist,
  );
  let closest = worldHit ? worldHit.t : maxDist;

  let hitActor: Actor | null = null;
  let hitBox: HitboxName = 'chest';
  let hx = 0;
  let hy = 0;
  let hz = 0;

  const radius = actorBoundsRadius();
  for (const other of ctx.actors) {
    if (other === shooter || !other.alive) continue;
    // 粗剔除：目标中心到射线的距离
    const ox = other.pos.x - origin.x;
    const oy = other.pos.y + 0.9 - origin.y;
    const oz = other.pos.z - origin.z;
    const proj = ox * dir.x + oy * dir.y + oz * dir.z;
    if (proj < -radius || proj > closest + radius) continue;
    const perpSq = ox * ox + oy * oy + oz * oz - proj * proj;
    if (perpSq > radius * radius * 1.6) continue;

    const hit = raycastActor(other, origin.x, origin.y, origin.z, dir.x, dir.y, dir.z, closest);
    if (hit) {
      closest = hit.t;
      hitActor = other;
      hitBox = hit.hitbox;
      hx = hit.x;
      hy = hit.y;
      hz = hit.z;
    }
  }

  const endX = origin.x + dir.x * closest;
  const endY = origin.y + dir.y * closest;
  const endZ = origin.z + dir.z * closest;
  ctx.emit({
    type: 'tracer',
    x0: origin.x,
    y0: origin.y,
    z0: origin.z,
    x1: endX,
    y1: endY,
    z1: endZ,
    weapon: weaponId,
  });

  if (hitActor) {
    // 队友挡枪：挡住子弹但不掉血（避免友伤，但保留"别打队友背后"的战术性）
    if (hitActor.team === shooter.team) return;
    applyDamage(ctx, shooter, hitActor, weaponId, hitBox, closest, hx, hy, hz);
    return;
  }

  if (worldHit && worldHit.t <= closest + 1e-4) {
    ctx.emit({
      type: 'impact',
      x: endX,
      y: endY,
      z: endZ,
      nx: worldHit.nx,
      ny: worldHit.ny,
      nz: worldHit.nz,
      surface: worldHit.box.kind,
    });
  }
}

/** 近战：短距离射线，背刺加成。 */
function meleeAttack(ctx: CombatCtx, a: Actor, def: WeaponDef): void {
  a.fireCooldown = fireInterval(def);
  a.lastShotTime = ctx.time;
  eyePos(a, tmpEye);
  aimDir(a, tmpDir);

  ctx.emit({
    type: 'shot',
    actorId: a.id,
    weapon: 'knife',
    x: tmpEye.x,
    y: tmpEye.y,
    z: tmpEye.z,
    dx: tmpDir.x,
    dy: tmpDir.y,
    dz: tmpDir.z,
    local: a.id === ctx.localActorId,
  });

  const worldHit = ctx.world.raycast(
    tmpEye.x,
    tmpEye.y,
    tmpEye.z,
    tmpDir.x,
    tmpDir.y,
    tmpDir.z,
    def.range,
  );
  let closest = worldHit ? worldHit.t : def.range;
  let victim: Actor | null = null;
  let box: HitboxName = 'chest';
  let px = 0;
  let py = 0;
  let pz = 0;
  for (const other of ctx.actors) {
    if (other === a || !other.alive || other.team === a.team) continue;
    const hit = raycastActor(
      other,
      tmpEye.x,
      tmpEye.y,
      tmpEye.z,
      tmpDir.x,
      tmpDir.y,
      tmpDir.z,
      closest,
    );
    if (hit) {
      closest = hit.t;
      victim = other;
      box = hit.hitbox;
      px = hit.x;
      py = hit.y;
      pz = hit.z;
    }
  }
  if (victim) {
    // 背刺：攻击者在受害者背后 100 度扇形内
    const dot =
      Math.cos(victim.yaw) * Math.cos(a.yaw) + Math.sin(victim.yaw) * Math.sin(a.yaw);
    const back = dot > 0.35;
    applyDamage(
      ctx,
      a,
      victim,
      'knife',
      box,
      closest,
      px,
      py,
      pz,
      back ? (def.backstab ?? 1) : 1,
    );
  }
}

/** 结算伤害，必要时判定死亡。 */
export function applyDamage(
  ctx: CombatCtx,
  attacker: Actor | null,
  victim: Actor,
  weaponId: WeaponId,
  hitbox: HitboxName,
  distance: number,
  x: number,
  y: number,
  z: number,
  multiplier = 1,
): void {
  if (!victim.alive) return;
  const res = computeDamage(weaponId, hitbox, distance, victim.armor, victim.helmet);
  const dmg = Math.max(1, Math.round(res.damage * multiplier));
  victim.armor = Math.max(0, victim.armor - res.armorLoss);
  victim.health -= dmg;
  victim.flinch = Math.min(1, victim.flinch + dmg / 90);
  victim.lastHitBy = attacker ? attacker.id : -1;
  victim.lastHitTime = ctx.time;

  const headshot = hitbox === 'head';
  ctx.emit({
    type: 'hit',
    attackerId: attacker ? attacker.id : -1,
    victimId: victim.id,
    damage: dmg,
    hitbox,
    headshot,
    x,
    y,
    z,
  });

  if (victim.health <= 0) {
    victim.health = 0;
    ctx.emit({
      type: 'kill',
      attackerId: attacker ? attacker.id : -1,
      victimId: victim.id,
      weapon: weaponId,
      headshot,
    });
    ctx.onKill(victim, attacker, weaponId, headshot);
  }
}

/** A 能不能看见 B（眼睛 -> 胸口/头，有一条通就算看见）。 */
export function canSee(world: CollisionWorld, a: Actor, b: Actor): boolean {
  const ex = a.pos.x;
  const ey = a.pos.y + a.eyeHeight;
  const ez = a.pos.z;
  const scale = b.crouching ? 0.72 : 1;
  if (world.visible(ex, ey, ez, b.pos.x, b.pos.y + 1.28 * scale, b.pos.z)) return true;
  if (world.visible(ex, ey, ez, b.pos.x, b.pos.y + 1.63 * scale, b.pos.z)) return true;
  if (world.visible(ex, ey, ez, b.pos.x, b.pos.y + 0.5 * scale, b.pos.z)) return true;
  return false;
}
