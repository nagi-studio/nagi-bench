import type { Vec3 } from './math';
import {
  v3, vclone, vadd, vsub, vscale, vnorm, vdist2, yawDir, yawToward, wrapAngle, clamp,
} from './math';
import type { Combatant, BotState } from './types';
import { weaponOf, currentWeaponId } from './weapons';
import type { WeaponDef } from './weapons';
import { inSite, cellAt, walkable, avoidCrates } from './map';
import { findPath } from './nav';
import { EYE_HEIGHT } from './physics';
import type { GameSim } from './simulation';

/**
 * Bot finite state machine: move / engage / plant / defuse / pickup / hold.
 * Pure logic — reads the sim's public state (vision, bomb, contacts) and writes
 * per-tick intent (wishDir, wantFire, wantUse, aim) on the combatant.
 */

export function makeBot(sim: GameSim, c: Combatant): BotState {
  return {
    state: 'move', goal: null, path: [], pathI: 0, repathT: 0,
    targetId: -1, reactT: 0, burstLeft: 0, burstPause: 0,
    strafeDir: 1, strafeT: 0, skill: 0.7 + sim.rng() * 0.45,
    holdPos: v3(), attackSite: 'A', stuckT: 0, lastPos: vclone(c.pos),
    visionT: sim.rng() * 0.12, wanderT: 4 + sim.rng() * 6,
  };
}

export function botThink(sim: GameSim, c: Combatant, dt: number): void {
  const b = c.bot!;
  const w = weaponOf(currentWeaponId(c));
  b.visionT -= dt;
  if (b.visionT <= 0) {
    b.visionT = 0.1 + sim.rng() * 0.06;
    let best = -1;
    let bestD = Infinity;
    for (const e of sim.combatants) {
      if (!e.alive || e.team === c.team) continue;
      if (!sim.sees(c, e)) continue;
      const d = vdist2(c.pos, e.pos);
      if (d < bestD) {
        bestD = d;
        best = e.id;
      }
    }
    if (best !== b.targetId) {
      b.targetId = best;
      if (best >= 0) {
        b.reactT = 0.22 + (1.1 - b.skill) * 0.45;
        b.burstLeft = 0;
        b.burstPause = 0;
      }
    }
  }

  const target = b.targetId >= 0 ? sim.byId(b.targetId) : undefined;
  const engaging = !!target && target.alive && sim.sees(c, target);
  if (!engaging) b.targetId = -1;

  c.wantFire = false;
  c.wantFirePressed = false;
  c.wantUse = false;
  c.wantJump = false;
  c.wantWalk = false;
  c.wishDir = v3();

  // weapon management
  const ammo = c.ammo[w.id];
  if (!w.melee && ammo && ammo.mag === 0 && ammo.reserve > 0) c.wantReload = true;
  else if (!w.melee && ammo && ammo.mag < w.magSize * 0.25 && !engaging && ammo.reserve > 0) c.wantReload = true;
  if (!c.primary || (c.ammo[c.primary]?.mag ?? 0) + (c.ammo[c.primary]?.reserve ?? 0) === 0) {
    if (c.slot === 'primary') sim.switchSlot(c, 'secondary');
  }
  if (c.slot === 'secondary' && (c.ammo[c.secondary]?.mag ?? 0) + (c.ammo[c.secondary]?.reserve ?? 0) === 0) {
    sim.switchSlot(c, 'knife');
  }

  if (engaging && target) {
    botEngage(sim, c, b, target, dt, w);
    return;
  }

  b.reactT = 0;
  if (w.scope && c.scoped) {
    c.scoped = false;
    sim.events.push({ type: 'scope', by: c.id, on: false });
  }

  // objective selection
  let goal: Vec3 | null = null;
  if (c.team === 'T') {
    if (sim.bomb.state === 'dropped') {
      // nearest T goes for the bomb
      let nearest = -1;
      let nd = Infinity;
      for (const t of sim.alive('T')) {
        const d = vdist2(t.pos, sim.bomb.pos);
        if (d < nd) {
          nd = d;
          nearest = t.id;
        }
      }
      if (nearest === c.id) {
        goal = vclone(sim.bomb.pos);
        b.state = 'pickup';
      }
    }
    if (!goal && c.hasBomb) {
      const site = inSite(sim.map, c.pos.x, c.pos.z);
      if (site) {
        b.state = 'plant';
        c.wantUse = true;
        c.wishDir = v3();
        faceToward(c, sim.map.siteCenters[site], dt, 4);
        return;
      }
      goal = vclone(sim.map.siteCenters[b.attackSite]);
      b.state = 'move';
    }
    if (!goal) {
      if (sim.bomb.state === 'planted') {
        if (c.id % 5 === 3) {
          // one aggressive post-plant hunter; the rest guard the bomb
          const ct = sim.contact.T;
          if (ct && sim.time - ct.t < 6) {
            goal = vclone(ct.pos);
          } else {
            const ang = sim.time * 0.15 + c.id;
            goal = avoidCrates(sim.map, vadd(sim.bomb.pos, v3(Math.cos(ang) * 10, 0, Math.sin(ang) * 10)));
          }
        } else {
          const ang = (c.id % 5) * 1.26;
          goal = avoidCrates(sim.map, vadd(sim.bomb.pos, v3(Math.cos(ang) * 5, 0, Math.sin(ang) * 5)));
        }
      } else if (c.id % 5 === 4 && sim.liveT > sim.roundTime - 22) {
        goal = vclone(b.holdPos); // lurk mid early, then join below
      } else if (c.id % 5 === 4 || sim.liveT < 25) {
        goal = vclone(sim.map.siteCenters[b.attackSite]);
      } else {
        // escorts stack close to the site center with the carrier
        const center = sim.map.siteCenters[b.attackSite];
        const ang = (c.id % 5) * 1.9;
        goal = avoidCrates(sim.map, vadd(center, v3(Math.cos(ang) * 3.5, 0, Math.sin(ang) * 3.5)));
      }
      b.state = 'move';
    }
  } else {
    // CT
    if (sim.bomb.state === 'planted') {
      // group up before committing to the retake (unless the timer forces it)
      const near = sim.alive('CT').filter((o) => vdist2(o.pos, sim.bomb.pos) < 14).length;
      if (vdist2(c.pos, sim.bomb.pos) < 11 && near < 2 && sim.bomb.timer > 15) {
        b.state = 'hold';
        c.wishDir = v3();
        c.yaw += Math.sin(sim.time * 0.5 + c.id) * 0.4 * dt;
        return;
      }
      goal = vclone(sim.bomb.pos);
      b.state = 'move';
      if (vdist2(c.pos, sim.bomb.pos) < 1.5) {
        // only commit to the defuse when the area is reasonably clear,
        // or when the timer forces a ninja defuse
        let danger = false;
        for (const eid of sim.spotted.CT) {
          const e = sim.byId(eid);
          if (e && e.alive && vdist2(e.pos, sim.bomb.pos) < 18) {
            danger = true;
            break;
          }
        }
        if (!danger || sim.bomb.timer < 12) {
          b.state = 'defuse';
          c.wantUse = true;
          c.wishDir = v3();
          faceToward(c, sim.bomb.pos, dt, 4);
          return;
        }
        // guard the bomb instead until the area clears
        goal = avoidCrates(sim.map, vadd(sim.bomb.pos, v3(4, 0, 3)));
      }
    } else {
      goal = vclone(b.holdPos);
      b.state = 'move';
      // rotate toward a fresh team contact if it is near my anchor
      const ct = sim.contact.CT;
      if (ct && sim.time - ct.t < 4 && vdist2(b.holdPos, ct.pos) < 30 && vdist2(c.pos, ct.pos) > 5) {
        goal = vclone(ct.pos);
      }
    }
  }

  // hold / wander when at goal
  if (goal && vdist2(c.pos, goal) < 1.4) {
    b.state = 'hold';
    b.wanderT -= dt;
    if (b.wanderT <= 0) {
      b.wanderT = 5 + sim.rng() * 7;
      const ang = sim.rng() * Math.PI * 2;
      const p = vadd(c.pos, v3(Math.cos(ang) * 4, 0, Math.sin(ang) * 4));
      const cc = cellAt(sim.map, p.x, p.z);
      if (walkable(sim.map, cc.c, cc.r)) {
        b.holdPos = p;
      }
      goal = b.holdPos;
    } else {
      // scan around while holding
      c.yaw += Math.sin(sim.time * 0.4 + c.id * 2.1) * 0.35 * dt;
      c.wishDir = v3();
      return;
    }
  }

  botNavigate(sim, c, b, goal, dt);
}

function botEngage(sim: GameSim, c: Combatant, b: BotState, target: Combatant, dt: number, w: WeaponDef): void {
  b.state = 'engage';
  const dist = vdist2(c.pos, target.pos);
  const headshot = b.skill > 0.95 && dist < 14;
  const aimPoint = vadd(target.pos, v3(0, headshot ? 1.62 : 1.25, 0));
  // aim error shrinks with skill; grows with distance
  const err = (0.05 - b.skill * 0.03) + dist * 0.0007;
  const desiredYaw = yawToward(c.pos, aimPoint) + (sim.rng() - 0.5) * err;
  const desiredPitch = Math.atan2(aimPoint.y - (c.pos.y + EYE_HEIGHT), dist) + (sim.rng() - 0.5) * err;
  turnToward(c, desiredYaw, desiredPitch, dt, 8.5);

  // AWP bots scope at range
  if (w.scope) {
    const wantScope = dist > 9;
    if (wantScope !== c.scoped) {
      c.scoped = wantScope;
      sim.events.push({ type: 'scope', by: c.id, on: wantScope });
    }
  }

  // strafe
  b.strafeT -= dt;
  if (b.strafeT <= 0) {
    b.strafeT = 0.35 + sim.rng() * 0.8;
    b.strafeDir = sim.rng() < 0.5 ? -1 : 1;
  }
  const toT = vnorm(vsub(target.pos, c.pos));
  const perp = v3(-toT.z, 0, toT.x);
  let move = vscale(perp, b.strafeDir * 0.7);
  if (dist > 26) move = vadd(move, vscale(toT, 0.6));
  else if (dist < 5 && !w.melee) move = vadd(move, vscale(toT, -0.5));
  if (w.melee) move = vscale(toT, 1);
  c.wishDir = vnorm(move);

  // fire control
  b.reactT -= dt;
  if (b.reactT > 0) return;
  const aligned = Math.abs(wrapAngle(desiredYaw - c.yaw)) < 0.14;
  if (!aligned) return;
  if (b.burstPause > 0) {
    b.burstPause -= dt;
    return;
  }
  if (b.burstLeft <= 0) {
    b.burstLeft = w.melee ? 1 : w.id === 'awp' ? 1 : 3 + Math.floor(sim.rng() * 4);
  }
  c.wantFire = true;
  c.wantFirePressed = true;
  b.burstLeft--;
  if (b.burstLeft <= 0) {
    b.burstPause = w.id === 'awp' ? 0.8 + sim.rng() * 0.5 : w.melee ? 0.4 : 0.25 + sim.rng() * 0.45;
  }
}

function botNavigate(sim: GameSim, c: Combatant, b: BotState, goal: Vec3 | null, dt: number): void {
  if (!goal) return;
  b.repathT -= dt;
  const goalMoved = !b.goal || vdist2(b.goal, goal) > 2.5;
  if (goalMoved || b.repathT <= 0 || b.path.length === 0) {
    b.goal = vclone(goal);
    b.path = findPath(sim.map, c.pos, goal);
    b.pathI = 0;
    b.repathT = 1.1 + sim.rng() * 0.6;
  }
  // stuck detection
  b.stuckT += dt;
  if (b.stuckT > 1.4) {
    if (vdist2(c.pos, b.lastPos) < 0.35) {
      b.repathT = 0;
      b.path = [];
      // perpendicular sidestep intent (no teleporting through walls)
      const fwd = yawDir(c.yaw);
      const side = sim.rng() < 0.5 ? 1 : -1;
      c.wishDir = v3(-fwd.z * side, 0, fwd.x * side);
      b.lastPos = vclone(c.pos);
      b.stuckT = 0;
      return;
    }
    b.lastPos = vclone(c.pos);
    b.stuckT = 0;
  }
  if (b.path.length === 0) {
    // direct steer fallback
    const dir = vnorm(vsub(goal, c.pos));
    c.wishDir = dir;
    faceToward(c, goal, dt, 6);
    return;
  }
  while (b.pathI < b.path.length && vdist2(c.pos, b.path[b.pathI]) < 0.7) b.pathI++;
  if (b.pathI >= b.path.length) {
    c.wishDir = v3();
    return;
  }
  const wp = b.path[b.pathI];
  c.wishDir = vnorm(vsub(wp, c.pos));
  faceToward(c, wp, dt, 6);
}

function faceToward(c: Combatant, p: Vec3, dt: number, rate: number): void {
  const y = yawToward(c.pos, p);
  turnToward(c, y, 0, dt, rate);
}

function turnToward(c: Combatant, yaw: number, pitch: number, dt: number, rate: number): void {
  const dy = wrapAngle(yaw - c.yaw);
  const dp = pitch - c.pitch;
  const maxStep = rate * dt;
  c.yaw += clamp(dy, -maxStep, maxStep);
  c.pitch += clamp(dp, -maxStep, maxStep);
  c.pitch = clamp(c.pitch, -1.45, 1.45);
}
