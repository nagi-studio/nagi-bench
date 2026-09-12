/**
 * C4 lifecycle: carried -> dropped -> planted -> (defused | exploded).
 *
 * Plant and defuse are "hold the use key" actions that abort the moment the actor moves,
 * dies or lets go, which is what makes retakes tense.
 */

import { Vec3 } from '../../core/math.ts';
import type { Actor } from '../actor.ts';
import {
  BOMB_EXPLOSION_DAMAGE,
  BOMB_EXPLOSION_RADIUS,
  BOMB_PICKUP_RADIUS,
  BOMB_TIMER,
  DEFUSE_TIME,
  DEFUSE_TIME_KIT,
  PLANT_TIME,
} from '../constants.ts';
import type { Bomb, SimContext } from '../context.ts';
import { killActor } from './combat.ts';
import { bombSiteAt } from '../map/dust2.ts';

export function createBomb(): Bomb {
  return {
    state: 'carried',
    carrier: -1,
    pos: new Vec3(),
    site: null,
    timer: BOMB_TIMER,
    defuseProgress: 0,
    defuser: -1,
    planter: -1,
  };
}

export function giveBombTo(ctx: SimContext, a: Actor): void {
  ctx.bomb.state = 'carried';
  ctx.bomb.carrier = a.id;
  ctx.bomb.pos.copy(a.pos);
  a.hasBomb = true;
  ctx.events.push({ type: 'bombPickup', actorId: a.id });
}

/** True when this actor is standing somewhere the bomb may be planted. */
export function canPlantHere(a: Actor): boolean {
  return a.hasBomb && a.alive && a.onGround && bombSiteAt(a.pos.x, a.pos.z) !== null;
}

/** Advance a plant while the use key is held. Returns true while planting. */
export function updatePlant(ctx: SimContext, a: Actor, holding: boolean, dt: number): boolean {
  if (!holding || !canPlantHere(a) || a.speed > 0.8) {
    if (a.plantProgress > 0) {
      a.plantProgress = 0;
      ctx.events.push({ type: 'plantAbort', actorId: a.id });
    }
    return false;
  }

  if (a.plantProgress === 0) {
    ctx.events.push({ type: 'plantStart', actorId: a.id, pos: a.pos.clone() });
  }
  a.plantProgress += dt / PLANT_TIME;

  if (a.plantProgress >= 1) {
    a.plantProgress = 0;
    a.hasBomb = false;
    const site = bombSiteAt(a.pos.x, a.pos.z)!;
    const bomb = ctx.bomb;
    bomb.state = 'planted';
    bomb.carrier = -1;
    bomb.planter = a.id;
    bomb.site = site;
    bomb.timer = BOMB_TIMER;
    bomb.defuseProgress = 0;
    bomb.pos.set(a.pos.x, a.pos.y + 0.1, a.pos.z);
    ctx.events.push({ type: 'plantDone', actorId: a.id, site, pos: bomb.pos.clone() });
    return false;
  }
  return true;
}

export function canDefuseHere(ctx: SimContext, a: Actor): boolean {
  const bomb = ctx.bomb;
  return (
    a.team === 'CT' &&
    a.alive &&
    a.onGround &&
    bomb.state === 'planted' &&
    a.pos.distanceTo2D(bomb.pos) < 1.6 &&
    Math.abs(a.pos.y - bomb.pos.y) < 2.0
  );
}

/** Advance a defuse while the use key is held. Returns true while defusing. */
export function updateDefuse(ctx: SimContext, a: Actor, holding: boolean, dt: number): boolean {
  const bomb = ctx.bomb;
  if (!holding || !canDefuseHere(ctx, a) || a.speed > 0.8) {
    if (a.defuseProgress > 0) {
      a.defuseProgress = 0;
      if (bomb.defuser === a.id) {
        bomb.defuser = -1;
        bomb.defuseProgress = 0;
      }
      ctx.events.push({ type: 'defuseAbort', actorId: a.id });
    }
    return false;
  }

  if (a.defuseProgress === 0) {
    ctx.events.push({ type: 'defuseStart', actorId: a.id, pos: a.pos.clone(), kit: a.hasDefuseKit });
  }
  const duration = a.hasDefuseKit ? DEFUSE_TIME_KIT : DEFUSE_TIME;
  a.defuseProgress += dt / duration;
  bomb.defuser = a.id;
  bomb.defuseProgress = a.defuseProgress;

  if (a.defuseProgress >= 1) {
    a.defuseProgress = 0;
    bomb.state = 'defused';
    bomb.defuseProgress = 1;
    ctx.events.push({ type: 'defuseDone', actorId: a.id, pos: bomb.pos.clone() });
    return false;
  }
  return true;
}

let nextBeepAt = 0;

export function resetBombBeep(): void {
  nextBeepAt = 0;
}

/** Bomb pickup, carrier tracking, fuse countdown and detonation. */
export function updateBomb(ctx: SimContext, dt: number): void {
  const bomb = ctx.bomb;

  if (bomb.state === 'carried') {
    const carrier = ctx.actors.find((a) => a.id === bomb.carrier);
    if (carrier && carrier.alive) {
      bomb.pos.copy(carrier.pos);
    } else {
      bomb.state = 'dropped';
      bomb.carrier = -1;
    }
    return;
  }

  if (bomb.state === 'dropped') {
    for (const a of ctx.actors) {
      if (!a.alive || a.team !== 'T') continue;
      if (a.pos.distanceTo2D(bomb.pos) < BOMB_PICKUP_RADIUS && Math.abs(a.pos.y - bomb.pos.y) < 2) {
        giveBombTo(ctx, a);
        break;
      }
    }
    return;
  }

  if (bomb.state !== 'planted') return;

  bomb.timer -= dt;

  // Beeps accelerate as the fuse runs down.
  const urgency = 1 - Math.max(0, bomb.timer) / BOMB_TIMER;
  const interval = 1.4 - urgency * 1.15;
  nextBeepAt -= dt;
  if (nextBeepAt <= 0) {
    nextBeepAt = Math.max(0.12, interval);
    ctx.events.push({ type: 'bombBeep', pos: bomb.pos.clone(), urgency });
  }

  if (bomb.timer <= 0) {
    bomb.timer = 0;
    bomb.state = 'exploded';
    ctx.events.push({ type: 'explode', pos: bomb.pos.clone() });

    for (const a of ctx.actors) {
      if (!a.alive) continue;
      const d = a.pos.distanceTo(bomb.pos);
      if (d > BOMB_EXPLOSION_RADIUS) continue;
      const falloff = 1 - d / BOMB_EXPLOSION_RADIUS;
      const damage = BOMB_EXPLOSION_DAMAGE * falloff * falloff;
      if (damage >= a.health + a.armor * 0.5) {
        killActor(ctx, null, a, 'bomb', false);
      } else {
        a.health = Math.max(1, Math.round(a.health - damage));
      }
    }
  }
}

export function defuseTimeFor(a: Actor): number {
  return a.hasDefuseKit ? DEFUSE_TIME_KIT : DEFUSE_TIME;
}
