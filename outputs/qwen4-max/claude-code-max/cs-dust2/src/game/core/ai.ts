import type { Entity, RouteId, Vec3 } from './types.ts';
import type { GameCore } from './core.ts';
import { CFG } from './config.ts';
import { angleDiff, clamp, dist2, pick, rand, v3, yawTo } from './vecmath.ts';
import { activeWeapon } from './entities.ts';
import { WEAPONS } from './weapons.ts';
import { isWalkablePoint, segmentWalkable } from './map.ts';

interface RouteDef {
  site: 'A' | 'B';
  mid: [number, number];
  goal: [number, number];
}

export const ROUTES: Record<RouteId, RouteDef> = {
  longA: { site: 'A', mid: [47, 8], goal: [40, -38] },
  midShort: { site: 'A', mid: [13, -6], goal: [34, -34] },
  splitA: { site: 'A', mid: [47, 14], goal: [44, -44] },
  tunnelsB: { site: 'B', mid: [-37, 20], goal: [-38, -42] },
  midB: { site: 'B', mid: [-16, 4], goal: [-36, -46] },
};

const CT_HOLDS: [number, number][] = [
  [40, -38], [32, -31], // A
  [6, -10], // mid
  [-38, -42], [-30, -36], // B
];

export function initAI(e: Entity, index: number, time: number): void {
  const skill = rand(0.45, 0.9);
  e.ai = {
    state: 'idle',
    route: 'longA',
    routeStage: 0,
    site: 'A',
    path: [],
    pathIdx: 0,
    goal: null,
    hold: v3(CT_HOLDS[index % CT_HOLDS.length][0], 0, CT_HOLDS[index % CT_HOLDS.length][1]),
    targetId: null,
    memory: null,
    nextThink: time + rand(0, CFG.aiThinkInterval),
    burst: 0,
    burstPause: 0,
    aim: 0,
    strafe: 0,
    strafeT: 0,
    stuckT: 0,
    lastPos: { ...e.pos },
    reaction: 0,
    seenAt: -100,
    wander: rand(0, Math.PI * 2),
    skill,
    scanYaw: e.yaw,
  };
}

export function assignAttack(e: Entity, site: 'A' | 'B', route: RouteId): void {
  if (!e.ai) return;
  e.ai.site = site;
  e.ai.route = route;
  e.ai.routeStage = 0;
  e.ai.path = [];
  e.ai.goal = null;
}

function resumeObjective(core: GameCore, e: Entity): void {
  const ai = e.ai!;
  ai.targetId = null;
  ai.aim = 0;
  if (e.team === 'T') {
    if (core.bomb.state === 'planted') {
      ai.state = 'defend';
      const off = v3(rand(-6, 6), 0, rand(-6, 6));
      core.setGoal(e, v3(core.bomb.pos.x + off.x, 0, core.bomb.pos.z + off.z));
    } else if (e.bombCarrier) {
      ai.state = 'advance';
      ai.routeStage = 0;
      ai.path = [];
      ai.goal = null;
    } else if (core.bomb.state === 'dropped' && core.isNearestBombRetriever(e)) {
      ai.state = 'retrieve';
      core.setGoal(e, core.bomb.pos);
    } else {
      ai.state = 'advance';
      ai.routeStage = 0;
      ai.path = [];
      ai.goal = null;
    }
  } else {
    if (core.bomb.state === 'planted') {
      ai.state = 'rotate';
      core.setGoal(e, core.bomb.pos);
    } else {
      ai.state = 'hold';
      core.setGoal(e, ai.hold);
    }
  }
}

export function aiThink(core: GameCore, e: Entity): void {
  const ai = e.ai;
  if (!ai || !e.alive) return;
  const time = core.time;
  ai.nextThink = time + CFG.aiThinkInterval;

  const visible = core.getVisibleEnemies(e);
  if (visible.length > 0) {
    // choose nearest
    let best = visible[0];
    let bd = dist2(e.pos, best.pos);
    for (const v of visible) {
      const d = dist2(e.pos, v.pos);
      if (d < bd) { bd = d; best = v; }
    }
    if (ai.targetId !== best.id) {
      ai.seenAt = time;
      ai.reaction = time + rand(CFG.aiReactionMin, CFG.aiReactionMax) * (1.3 - ai.skill);
      ai.aim = 0;
    }
    ai.targetId = best.id;
    ai.memory = { pos: { ...best.pos }, time, entityId: best.id };
    if (time >= ai.reaction) {
      ai.state = 'engage';
      return;
    }
  } else if (ai.state === 'engage') {
    // lost sight
    if (ai.memory && time - ai.memory.time < 2.5) {
      ai.state = 'hunt';
      core.setGoal(e, ai.memory.pos);
    } else {
      resumeObjective(core, e);
    }
    return;
  }

  // Objective transitions (non-combat).
  if (e.team === 'T') {
    if (core.bomb.state === 'planted') {
      if (ai.state !== 'defend' && ai.state !== 'hunt') {
        ai.state = 'defend';
        const off = v3(rand(-7, 7), 0, rand(-7, 7));
        core.setGoal(e, v3(core.bomb.pos.x + off.x, 0, core.bomb.pos.z + off.z));
      }
    } else if (e.bombCarrier) {
      if (core.inSite(e.pos, ai.site)) {
        ai.state = 'plant';
      } else if (ai.state !== 'advance' && ai.state !== 'hunt') {
        ai.state = 'advance';
        ai.routeStage = 0;
        ai.path = [];
      }
    } else if (core.bomb.state === 'dropped' && core.isNearestBombRetriever(e)) {
      if (ai.state !== 'retrieve') {
        ai.state = 'retrieve';
        core.setGoal(e, core.bomb.pos);
      }
    } else if (ai.state !== 'advance' && ai.state !== 'hunt' && ai.state !== 'defend') {
      ai.state = 'advance';
      ai.routeStage = 0;
      ai.path = [];
    }
  } else {
    // CT
    if (core.bomb.state === 'planted') {
      const d = dist2(e.pos, core.bomb.pos);
      if (d < 2.0 && !core.defuserBusy(e)) {
        ai.state = 'defuse';
      } else if (ai.state !== 'rotate' && ai.state !== 'defuse' && ai.state !== 'hunt') {
        ai.state = 'rotate';
        core.setGoal(e, core.bomb.pos);
      }
    } else if (ai.state !== 'hold' && ai.state !== 'hunt') {
      ai.state = 'hold';
      core.setGoal(e, ai.hold);
    }
  }
}

function followPath(core: GameCore, e: Entity, dt: number, speed: number): boolean {
  const ai = e.ai!;
  let guard = 0;
  while (ai.pathIdx < ai.path.length && guard++ < 8) {
    const wp = ai.path[ai.pathIdx];
    const dx = wp.x - e.pos.x;
    const dz = wp.z - e.pos.z;
    const d = Math.hypot(dx, dz);
    if (d < 0.85) {
      ai.pathIdx++;
      continue;
    }
    core.moveBot(e, dx / d, dz / d, speed, dt);
    return false;
  }
  return true; // arrived
}

function trackStuck(core: GameCore, e: Entity, dt: number, moving: boolean): void {
  const ai = e.ai!;
  if (!moving) { ai.stuckT = 0; ai.lastPos = { ...e.pos }; return; }
  const moved = dist2(e.pos, ai.lastPos);
  if (moved < 0.025) {
    ai.stuckT += dt;
    if (ai.stuckT > 0.7) {
      ai.stuckT = 0;
      ai.path = [];
      ai.pathIdx = 0;
      ai.lastPos = { ...e.pos };
      // Escape to a verified-walkable nearby point with a clear line of travel.
      let escape: Vec3 | null = null;
      const baseAng = Math.random() * Math.PI * 2;
      for (let k = 0; k < 16; k++) {
        const ang = baseAng + (k / 16) * Math.PI * 2;
        const rad = 3 + (k % 4);
        const cx = e.pos.x + Math.cos(ang) * rad;
        const cz = e.pos.z + Math.sin(ang) * rad;
        if (isWalkablePoint(core.map, cx, cz) && segmentWalkable(core.map, e.pos.x, e.pos.z, cx, cz)) {
          escape = v3(cx, 0, cz);
          break;
        }
      }
      if (escape) core.setGoal(e, escape);
      else if (ai.goal) core.setGoal(e, ai.goal);
    }
  } else {
    ai.stuckT = 0;
  }
  ai.lastPos = { ...e.pos };
}

export function aiUpdate(core: GameCore, e: Entity, dt: number): void {
  const ai = e.ai;
  if (!ai || !e.alive) return;
  const time = core.time;
  if (time >= ai.nextThink) aiThink(core, e);

  const w = activeWeapon(e);
  const def = WEAPONS[w.id];
  const baseSpeed = def.moveSpeed;

  switch (ai.state) {
    case 'engage': {
      const target = core.entities.find((x) => x.id === ai.targetId && x.alive);
      if (!target) {
        resumeObjective(core, e);
        break;
      }
      const eye = v3(e.pos.x, e.pos.y + CFG.eyeHeight, e.pos.z);
      const aimY = target.pos.y + (ai.skill > 0.7 && Math.random() < 0.35 ? 1.6 : 1.25);
      const aimPoint = v3(target.pos.x, aimY, target.pos.z);
      const desiredYaw = yawTo(e.pos, aimPoint);
      const hd = Math.max(0.5, dist2(e.pos, target.pos));
      const desiredPitch = Math.atan2(aimPoint.y - eye.y, hd);
      const turn = (5 + ai.skill * 5) * dt;
      e.yaw += clamp(angleDiff(e.yaw, desiredYaw), -turn, turn);
      e.pitch += clamp(angleDiff(e.pitch, desiredPitch), -turn, turn);
      ai.aim = Math.min(1, ai.aim + dt * (1.5 + ai.skill * 3));

      // Strafe occasionally at range; close in if far.
      const d = dist2(e.pos, target.pos);
      if (time > ai.strafeT) {
        ai.strafe = pick([-1, 0, 0, 1]);
        ai.strafeT = time + rand(0.3, 0.9);
      }
      let mx = 0, mz = 0;
      if (d > 14) {
        mx = Math.sin(e.yaw); mz = -Math.cos(e.yaw);
        core.moveBot(e, mx, mz, baseSpeed * 0.7, dt);
      } else if (ai.strafe !== 0) {
        mx = Math.cos(e.yaw) * ai.strafe; mz = Math.sin(e.yaw) * ai.strafe;
        core.moveBot(e, mx, mz, baseSpeed * 0.5, dt);
      } else {
        core.moveBot(e, 0, 0, 0, dt);
      }
      core.botFire(e, target, dt);
      trackStuck(core, e, dt, false);
      break;
    }
    case 'plant': {
      core.moveBot(e, 0, 0, 0, dt);
      if (e.bombCarrier && core.inSite(e.pos, ai.site) && !e.action) {
        core.beginPlant(e);
      }
      if (!e.bombCarrier) resumeObjective(core, e);
      break;
    }
    case 'defuse': {
      core.moveBot(e, 0, 0, 0, dt);
      if (dist2(e.pos, core.bomb.pos) < 2.0 && core.bomb.state === 'planted' && !e.action) {
        core.beginDefuse(e);
      } else if (core.bomb.state !== 'planted') {
        resumeObjective(core, e);
      }
      break;
    }
    case 'advance': {
      const route = ROUTES[ai.route];
      if (ai.routeStage === 0) {
        if (!ai.goal || ai.path.length === 0) core.setGoal(e, v3(route.mid[0], 0, route.mid[1]));
        const arrived = followPath(core, e, dt, baseSpeed);
        trackStuck(core, e, dt, true);
        if (arrived || dist2(e.pos, v3(route.mid[0], 0, route.mid[1])) < 3) {
          ai.routeStage = 1;
          ai.path = [];
          core.setGoal(e, v3(route.goal[0], 0, route.goal[1]));
        }
      } else {
        if (!ai.goal || ai.path.length === 0) core.setGoal(e, v3(route.goal[0], 0, route.goal[1]));
        const arrived = followPath(core, e, dt, baseSpeed);
        trackStuck(core, e, dt, true);
        if (arrived && e.bombCarrier && core.inSite(e.pos, ai.site)) {
          ai.state = 'plant';
        } else if (arrived && !e.bombCarrier) {
          ai.state = 'defend';
          const off = v3(rand(-6, 6), 0, rand(-6, 6));
          core.setGoal(e, v3(e.pos.x + off.x, 0, e.pos.z + off.z));
        }
      }
      break;
    }
    case 'retrieve': {
      if (core.bomb.state !== 'dropped') { resumeObjective(core, e); break; }
      const d = dist2(e.pos, core.bomb.pos);
      if (d < 3.2) {
        // Close the final gap directly so pickup is reachable.
        const dx = core.bomb.pos.x - e.pos.x, dz = core.bomb.pos.z - e.pos.z;
        const l = Math.hypot(dx, dz) || 1;
        core.moveBot(e, dx / l, dz / l, baseSpeed, dt);
        trackStuck(core, e, dt, true);
        if (d < 1.2) { core.tryPickupBomb(e); resumeObjective(core, e); }
      } else {
        if (!ai.goal || ai.path.length === 0) core.setGoal(e, core.bomb.pos);
        const arrived = followPath(core, e, dt, baseSpeed);
        trackStuck(core, e, dt, true);
        if (arrived) { core.tryPickupBomb(e); resumeObjective(core, e); }
      }
      break;
    }
    case 'rotate': {
      if (core.bomb.state !== 'planted') { resumeObjective(core, e); break; }
      const d = dist2(e.pos, core.bomb.pos);
      if (d < 3.2) {
        const dx = core.bomb.pos.x - e.pos.x, dz = core.bomb.pos.z - e.pos.z;
        const l = Math.hypot(dx, dz) || 1;
        core.moveBot(e, dx / l, dz / l, baseSpeed, dt);
        trackStuck(core, e, dt, true);
        if (d < 1.6) {
          if (!core.defuserBusy(e)) ai.state = 'defuse';
          else {
            ai.state = 'defend';
            const off = v3(rand(-5, 5), 0, rand(-5, 5));
            core.setGoal(e, v3(core.bomb.pos.x + off.x, 0, core.bomb.pos.z + off.z));
          }
        }
      } else {
        if (!ai.goal || ai.path.length === 0) core.setGoal(e, core.bomb.pos);
        const arrived = followPath(core, e, dt, baseSpeed);
        trackStuck(core, e, dt, true);
        if (arrived) {
          if (!core.defuserBusy(e)) ai.state = 'defuse';
          else {
            ai.state = 'defend';
            const off = v3(rand(-5, 5), 0, rand(-5, 5));
            core.setGoal(e, v3(core.bomb.pos.x + off.x, 0, core.bomb.pos.z + off.z));
          }
        }
      }
      break;
    }
    case 'hunt': {
      if (!ai.goal || ai.path.length === 0) { resumeObjective(core, e); break; }
      const arrived = followPath(core, e, dt, baseSpeed * 0.85);
      trackStuck(core, e, dt, true);
      if (arrived) resumeObjective(core, e);
      break;
    }
    case 'hold':
    case 'defend':
    default: {
      if (ai.goal && ai.path.length > 0 && ai.pathIdx < ai.path.length) {
        const arrived = followPath(core, e, dt, baseSpeed * 0.8);
        trackStuck(core, e, dt, true);
        if (arrived) { ai.path = []; ai.goal = null; }
      } else {
        core.moveBot(e, 0, 0, 0, dt);
        // scan the area
        ai.wander += dt * 0.4;
        const targetYaw = ai.scanYaw + Math.sin(ai.wander) * 0.9;
        e.yaw += clamp(angleDiff(e.yaw, targetYaw), -1.5 * dt, 1.5 * dt);
        trackStuck(core, e, dt, false);
      }
      break;
    }
  }
}
