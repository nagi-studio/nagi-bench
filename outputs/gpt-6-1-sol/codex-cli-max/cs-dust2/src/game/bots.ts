import { Vector3 } from 'three';
import type { Engine } from './engine';
import type { Actor, Point } from './types';
import { angleDelta, distance } from './math';
import { equipped, WEAPONS } from './weapons';
import { EYE_HEIGHT } from './physics';
import { SITES } from './world';

/** Objective state machine. All movement and damage use the player's collision/combat systems. */
export class BotDirector {
  constructor(private game: Engine) {}
  update(a: Actor, dt: number) {
    const g = this.game;
    const currentAmmo = a.ammo[equipped(a)];
    if (currentAmmo && currentAmmo.mag === 0 && currentAmmo.reserve === 0) g.equip(a, a.slot === 'primary' ? 'secondary' : 'melee');
    if (g.time >= a.thinkAt) {
      a.thinkAt = g.time + .14 + Math.random() * .09;
      let closest: Actor | null = null, nearest = Infinity;
      const eye = new Vector3(a.x, a.y + EYE_HEIGHT, a.z);
      for (const enemy of g.actors) {
        if (!enemy.alive || enemy.team === a.team) continue;
        const d = distance(a, enemy); if (d > 48 || d > nearest) continue;
        const angle = Math.atan2(-(enemy.x - a.x), -(enemy.z - a.z));
        if (d > 9 && Math.abs(angleDelta(angle, a.yaw)) > 1.45) continue;
        if (!g.world.visible(eye, new Vector3(enemy.x, enemy.y + 1.35, enemy.z))) continue;
        closest = enemy; nearest = d;
      }
      if (closest && a.target !== closest.id) a.reactionAt = g.time + .3 + Math.random() * .3;
      a.target = closest?.id ?? null;
      if (closest) {
        if (a.team === g.settings.team) { closest.lastSeen = g.time; g.spotEnemy(closest); }
        a.lastSeen = g.time;
      }
    }
    const target = a.target === null ? null : g.actors[a.target];
    let fighting = false;
    if (target?.alive) {
      const eye = new Vector3(a.x, a.y + EYE_HEIGHT, a.z), aim = new Vector3(target.x, target.y + 1.23, target.z);
      if (g.world.visible(eye, aim)) {
        fighting = true; a.state = 'engage';
        const yaw = Math.atan2(-(target.x - a.x), -(target.z - a.z));
        a.yaw += angleDelta(yaw, a.yaw) * Math.min(1, dt * 12);
        a.pitch = Math.atan2(aim.y - eye.y, distance(a, target));
        if (g.time >= a.reactionAt && Math.abs(angleDelta(yaw, a.yaw)) < .12) g.shoot(a, target);
        const w = WEAPONS[equipped(a)], ammo = a.ammo[w.id];
        if (ammo?.mag === 0) g.reload(a);
        const strafe = Math.sin(g.time * 1.7 + a.id * 2.3) > .2 ? 1 : -1;
        if (w.category === 'knife' && distance(a, target) > 1.8) {
          this.navigate(a, target, dt);
        } else if (!a.reloading && w.category !== 'sniper') {
          g.move(a, { x: Math.cos(yaw) * strafe * 1.05, z: -Math.sin(yaw) * strafe * 1.05 }, dt);
        } else g.move(a, { x: 0, z: 0 }, dt);
      }
    }
    if (fighting) return;
    a.pitch *= Math.max(0, 1 - dt * 5);
    const bomb = g.bomb;
    let destination: Point;
    if (bomb.state === 'planted') {
      if (a.team === 'CT') {
        a.state = 'defuse'; destination = bomb;
        if (distance(a, bomb) < 1.55) { g.move(a, { x: 0, z: 0 }, dt); g.interact(a, dt); return; }
      } else {
        a.state = 'patrol';
        const s = SITES[bomb.site!];
        const holds = bomb.site === 'A' ? [{ x: 35, z: 11 }, { x: 23, z: 16 }, { x: 31, z: 24 }] : [{ x: -33, z: 5 }, { x: -23, z: 16 }, { x: -36, z: 19 }];
        destination = holds[a.id % holds.length] ?? s;
      }
    } else if (a.team === 'T' && bomb.state === 'dropped') {
      a.state = 'retrieve'; destination = bomb;
    } else if (a.team === 'T' && bomb.carrier === a.id && g.world.siteAt(a.x, a.z)) {
      a.state = 'plant'; g.move(a, { x: 0, z: 0 }, dt); g.interact(a, dt); return;
    } else if (a.routeIndex < a.route.length) {
      a.state = 'advance'; destination = a.route[a.routeIndex];
      if (distance(a, destination) < 1.7) { a.routeIndex++; a.repathAt = 0; if (a.routeIndex < a.route.length) destination = a.route[a.routeIndex]; }
    } else {
      a.state = 'patrol';
      if (a.team === 'T') destination = SITES[g.attackSite];
      else {
        const patrols = [[{ x: -30, z: 9 }, { x: -16, z: 20 }], [{ x: 0, z: 9 }, { x: 0, z: -6 }], [{ x: 18, z: 9 }, { x: 18, z: -8 }], [{ x: 34, z: 13 }, { x: 34, z: -8 }], [{ x: -24, z: 17 }, { x: -31, z: 4 }]];
        const pair = patrols[a.id % 5]; destination = pair[Math.floor((g.time + a.id * 4) / 12) % 2];
      }
    }
    this.navigate(a, destination, dt);
    const ammo = a.ammo[equipped(a)];
    if (ammo && ammo.mag < 6 && !a.reloading) g.reload(a);
  }
  private navigate(a: Actor, destination: Point, dt: number) {
    const g = this.game;
    if (!a.destination || distance(a.destination, destination) > 2 || g.time > a.repathAt || a.pathIndex >= a.path.length) {
      a.path = g.navigation.findPath(a, destination); a.pathIndex = 0; a.destination = { ...destination }; a.repathAt = g.time + 1.8 + a.id * .03;
    }
    let p = a.path[a.pathIndex];
    if (!p) { g.move(a, { x: 0, z: 0 }, dt); a.yaw += dt * .35; return; }
    if (distance(a, p) < .48) { a.pathIndex++; p = a.path[a.pathIndex]; }
    if (!p || distance(a, destination) < .6) { g.move(a, { x: 0, z: 0 }, dt); a.yaw += dt * .15; return; }
    const d = distance(a, p), speed = WEAPONS[equipped(a)].speed * .8;
    let vx = (p.x - a.x) / d * speed, vz = (p.z - a.z) / d * speed;
    // Local separation prevents queues of bots occupying the same waypoint.
    for (const other of g.actors) {
      if (!other.alive || other.id === a.id) continue;
      const dist = distance(a, other);
      if (dist > .01 && dist < 1.05) { const force = (1.05 - dist) * 5; vx += (a.x - other.x) / dist * force; vz += (a.z - other.z) / dist * force; }
    }
    const magnitude = Math.hypot(vx, vz); if (magnitude > speed) { vx = vx / magnitude * speed; vz = vz / magnitude * speed; }
    const yaw = Math.atan2(-vx, -vz); a.yaw += angleDelta(yaw, a.yaw) * Math.min(1, dt * 8);
    g.move(a, { x: vx, z: vz }, dt);
  }
}
