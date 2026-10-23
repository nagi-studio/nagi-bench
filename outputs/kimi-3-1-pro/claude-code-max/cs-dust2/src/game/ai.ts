import * as THREE from 'three';
import type { MapData } from './map';
import { zoneAt } from './map';
import type { NavigationGrid } from './navigation';
import { angleTo, eyePosition, hasLineOfSight, normalizeAngle } from './physics';
import type { Actor, BombState, RoundPhase } from './types';
import { WEAPONS, weaponForSlot } from './weapons';

export interface AIContext {
  time: number;
  map: MapData;
  actors: Actor[];
  bomb: BombState;
  phase: RoundPhase;
  navigation: NavigationGrid;
  moveBot(actor: Actor, direction: THREE.Vector3, speed: number, dt: number): void;
  fireBot(actor: Actor): boolean;
  reload(actor: Actor): void;
  jumpBot(actor: Actor): void;
  setAction(actor: Actor, action: 'plant' | 'defuse' | null): void;
}

const tempEye = new THREE.Vector3();
const tempTarget = new THREE.Vector3();
const tempDirection = new THREE.Vector3();

function horizontalDistance(a: THREE.Vector3, b: THREE.Vector3) {
  return Math.hypot(a.x - b.x, a.z - b.z);
}

function visibleEnemy(bot: Actor, context: AIContext): Actor | null {
  const origin = eyePosition(bot, tempEye);
  const forwardX = -Math.sin(bot.yaw);
  const forwardZ = -Math.cos(bot.yaw);
  let best: Actor | null = null;
  let bestScore = Infinity;
  for (const target of context.actors) {
    if (!target.alive || target.team === bot.team) continue;
    const distance = bot.position.distanceTo(target.position);
    if (distance > 62) continue;
    const dx = (target.position.x - bot.position.x) / Math.max(distance, 0.001);
    const dz = (target.position.z - bot.position.z) / Math.max(distance, 0.001);
    const dot = dx * forwardX + dz * forwardZ;
    if (distance > 3 && dot < 0.18 && bot.lastAttackerId !== target.id) continue;
    tempTarget.set(target.position.x, target.position.y + 1.25, target.position.z);
    if (!hasLineOfSight(context.map, origin, tempTarget)) continue;
    const score = distance + (target.inventory.hasBomb ? -4 : 0);
    if (score < bestScore) {
      bestScore = score;
      best = target;
    }
  }
  return best;
}

function routeFor(bot: Actor, context: AIContext): THREE.Vector3[] {
  const index = Number(bot.id.slice(1)) % 5;
  const offset = ((index % 3) - 1) * 1.4;
  if (bot.team === 'T') {
    if (bot.brain.preferredSite === 'A') {
      if (index % 2 === 0) {
        return [
          new THREE.Vector3(30 + offset, 0, 27),
          new THREE.Vector3(30, 0, -8),
          context.map.plantSpots.A.clone().add(new THREE.Vector3(offset, 0, 0)),
        ];
      }
      return [
        new THREE.Vector3(offset, 0, 12),
        new THREE.Vector3(8, 0, -9),
        new THREE.Vector3(16, 0, -16),
        context.map.plantSpots.A.clone().add(new THREE.Vector3(offset, 0, 0)),
      ];
    }
    return [
      new THREE.Vector3(-28 + offset, 0, 27),
      new THREE.Vector3(-28, 0, 3),
      context.map.plantSpots.B.clone().add(new THREE.Vector3(offset, 0, 0)),
    ];
  }
  const routes = [
    [new THREE.Vector3(8, 0, -30), new THREE.Vector3(25, 0, -26)],
    [new THREE.Vector3(-8, 0, -30), new THREE.Vector3(-27, 0, -25)],
    [new THREE.Vector3(0, 0, -22), new THREE.Vector3(0, 0, -9), new THREE.Vector3(13, 0, -9)],
    [new THREE.Vector3(18, 0, -30), new THREE.Vector3(30, 0, -11)],
    [new THREE.Vector3(-18, 0, -30), new THREE.Vector3(-28, 0, -10)],
  ];
  return routes[index].map((point) => point.add(new THREE.Vector3(offset * 0.4, 0, 0)));
}

function nearestActor(bot: Actor, actors: Actor[], position: THREE.Vector3) {
  let nearest = Infinity;
  for (const actor of actors) {
    if (!actor.alive || actor.team !== bot.team) continue;
    nearest = Math.min(nearest, horizontalDistance(actor.position, position));
  }
  return nearest;
}

function chooseObjective(bot: Actor, context: AIContext) {
  const brain = bot.brain;
  let objective: THREE.Vector3 | null = null;
  let guard = false;

  if (context.bomb.status === 'planted') {
    objective = context.bomb.position;
    guard = bot.team === 'T';
  } else if (bot.team === 'CT') {
    const route = routeFor(bot, context);
    const stage = Math.min(brain.objectiveStage, route.length - 1);
    objective = route[stage];
    if (horizontalDistance(bot.position, objective) < 2 && brain.objectiveStage < route.length - 1) {
      brain.objectiveStage++;
      objective = route[brain.objectiveStage];
    } else if (brain.objectiveStage >= route.length - 1 && horizontalDistance(bot.position, objective) < 2.2) {
      guard = true;
      if (!brain.destination || horizontalDistance(bot.position, brain.destination) < 1.4) {
        objective = objective.clone().add(new THREE.Vector3((Math.random() - 0.5) * 7, 0, (Math.random() - 0.5) * 6));
      }
    }
  } else if (context.bomb.status === 'dropped') {
    const ownDistance = horizontalDistance(bot.position, context.bomb.position);
    if (Math.abs(nearestActor(bot, context.actors, context.bomb.position) - ownDistance) < 0.2) {
      objective = context.bomb.position;
    }
  }

  if (!objective && bot.team === 'T') {
    if (context.bomb.status === 'planted') {
      objective = context.bomb.position;
      guard = true;
    } else {
      const route = routeFor(bot, context);
      const stage = Math.min(brain.objectiveStage, route.length - 1);
      objective = route[stage];
      if (horizontalDistance(bot.position, objective) < 2.1 && brain.objectiveStage < route.length - 1) {
        brain.objectiveStage++;
        objective = route[brain.objectiveStage];
      } else if (brain.objectiveStage >= route.length - 1 && horizontalDistance(bot.position, objective) < 2) {
        guard = !bot.inventory.hasBomb;
      }
    }
  }

  if (objective && (!brain.destination || brain.destination.distanceTo(objective) > 2.2)) {
    brain.destination = objective.clone();
    brain.nextPath = 0;
    brain.path = [];
    brain.pathIndex = 0;
  }
  brain.state = guard ? 'guard' : 'advance';
}

function stopBot(bot: Actor, context: AIContext, dt: number) {
  tempDirection.set(0, 0, 0);
  context.moveBot(bot, tempDirection, 0, dt);
}

function updateEngagement(bot: Actor, target: Actor, context: AIContext, dt: number) {
  const brain = bot.brain;
  brain.state = 'engage';
  context.setAction(bot, null);
  const distance = bot.position.distanceTo(target.position);
  const aimHeight = weaponForSlot(bot.inventory).id === 'awp' ? 1.25 : 1.18;
  tempTarget.set(target.position.x, target.position.y + aimHeight, target.position.z);
  const angles = angleTo(eyePosition(bot, tempEye), tempTarget);
  const skill = 0.78 + (Number(bot.id.slice(1)) % 4) * 0.055;
  const error = (0.009 + distance * 0.00055) / skill;
  angles.yaw += Math.sin(context.time * 2.7 + Number(bot.id.slice(1))) * error;
  angles.pitch += Math.cos(context.time * 2.1 + Number(bot.id.slice(1))) * error * 0.55;
  bot.yaw += normalizeAngle(angles.yaw - bot.yaw) * Math.min(1, dt * 10);
  bot.pitch = THREE.MathUtils.lerp(bot.pitch, angles.pitch, Math.min(1, dt * 9));

  if (context.time > brain.strafeUntil) {
    brain.strafeDirection = Math.random() < 0.5 ? -1 : 1;
    brain.strafeUntil = context.time + 0.55 + Math.random() * 0.85;
  }
  const dx = (target.position.x - bot.position.x) / Math.max(distance, 0.01);
  const dz = (target.position.z - bot.position.z) / Math.max(distance, 0.01);
  tempDirection.set(-dz * brain.strafeDirection, 0, dx * brain.strafeDirection);
  if (distance > 24 && weaponForSlot(bot.inventory).id !== 'awp') {
    tempDirection.add(new THREE.Vector3(dx * 0.7, 0, dz * 0.7));
  } else if (distance < 5) {
    tempDirection.add(new THREE.Vector3(-dx * 0.65, 0, -dz * 0.65));
  }
  if (weaponForSlot(bot.inventory).id !== 'awp' || context.time < brain.nextShot) {
    context.moveBot(bot, tempDirection, 2.25, dt);
  } else {
    stopBot(bot, context, dt);
  }

  const aimDifference = Math.abs(normalizeAngle(angles.yaw - bot.yaw));
  if (context.time >= brain.reactionAt && context.time >= brain.nextShot && aimDifference < 0.11) {
    if (brain.burstLeft <= 0) brain.burstLeft = weaponForSlot(bot.inventory).id === 'awp' ? 1 : 2 + Math.floor(Math.random() * 5);
    if (context.fireBot(bot)) {
      brain.burstLeft--;
      if (brain.burstLeft <= 0) brain.nextShot = context.time + 0.22 + Math.random() * 0.42;
    } else {
      brain.nextShot = context.time + 0.08;
    }
  }
}

function followPath(bot: Actor, context: AIContext, dt: number) {
  const brain = bot.brain;
  if (!brain.destination) { stopBot(bot, context, dt); return; }
  if (context.time >= brain.nextPath && (brain.path.length === 0 || brain.pathIndex >= brain.path.length)) {
    brain.path = context.navigation.findPath(bot.position, brain.destination);
    brain.pathIndex = 0;
    brain.nextPath = context.time + 2.5 + Math.random();
  }
  if (brain.path.length === 0 || brain.pathIndex >= brain.path.length) { stopBot(bot, context, dt); return; }
  let waypoint = brain.path[brain.pathIndex];
  if (horizontalDistance(bot.position, waypoint) < 0.72) {
    brain.pathIndex++;
    if (brain.pathIndex >= brain.path.length) { stopBot(bot, context, dt); return; }
    waypoint = brain.path[brain.pathIndex];
  }
  tempDirection.set(waypoint.x - bot.position.x, 0, waypoint.z - bot.position.z).normalize();
  const desiredYaw = Math.atan2(-tempDirection.x, -tempDirection.z);
  bot.yaw += normalizeAngle(desiredYaw - bot.yaw) * Math.min(1, dt * 8);
  bot.pitch = THREE.MathUtils.lerp(bot.pitch, 0, Math.min(1, dt * 5));
  const active = weaponForSlot(bot.inventory).id;
  context.moveBot(bot, tempDirection, active === 'awp' ? 3.4 : 4.15, dt);

  const moved = horizontalDistance(bot.position, brain.lastPosition);
  if (moved < 0.006) brain.stuckFor += dt;
  else brain.stuckFor = Math.max(0, brain.stuckFor - dt * 2);
  brain.lastPosition.copy(bot.position);
  if (brain.stuckFor > 0.8) {
    context.jumpBot(bot);
    brain.nextPath = 0;
    brain.path = [];
    brain.stuckFor = 0;
  }
}

export function updateBot(bot: Actor, context: AIContext, dt: number) {
  if (!bot.alive || bot.controlled || context.phase !== 'live') return;
  const brain = bot.brain;
  const target = visibleEnemy(bot, context);

  if (target) {
    if (brain.targetId !== target.id) {
      brain.targetId = target.id;
      brain.reactionAt = context.time + 0.18 + Math.random() * 0.28;
    }
    updateEngagement(bot, target, context, dt);
    return;
  }
  brain.targetId = null;
  brain.burstLeft = 0;

  if (context.time >= brain.nextThink) {
    brain.nextThink = context.time + 0.16 + Math.random() * 0.12;
    chooseObjective(bot, context);
    const state = weaponForSlot(bot.inventory);
    if (state.ammo <= WEAPONS[state.id].magazine * 0.25 && state.reserve > 0 && !bot.action) context.reload(bot);
  }

  if (bot.team === 'T' && bot.inventory.hasBomb && context.bomb.status === 'carried') {
    const zone = zoneAt(context.map, bot.position);
    const site = zone?.id === 'A' || zone?.id === 'B' ? zone.id : null;
    if (site && horizontalDistance(bot.position, context.map.plantSpots[site]) < 2.2) {
      brain.state = 'plant';
      bot.yaw = THREE.MathUtils.lerp(bot.yaw, bot.brain.preferredSite === 'A' ? 0 : Math.PI, dt * 2);
      context.setAction(bot, 'plant');
      stopBot(bot, context, dt);
      return;
    }
  }

  if (bot.team === 'CT' && context.bomb.status === 'planted') {
    const distance = horizontalDistance(bot.position, context.bomb.position);
    const nearest = nearestActor(bot, context.actors, context.bomb.position);
    if (distance < 1.65 && Math.abs(nearest - distance) < 0.2) {
      brain.state = 'defuse';
      context.setAction(bot, 'defuse');
      stopBot(bot, context, dt);
      return;
    }
  }

  followPath(bot, context, dt);
}
