import * as THREE from 'three';
import type { Entity, NavGrid } from './types';
import { JUMP_VEL } from './config';
import { zoneAt } from './map';
import type { Engine } from './engine';

export type BotStateKind =
  | 'idle'
  | 'patrol'
  | 'engage'
  | 'chase'
  | 'plant'
  | 'defuse'
  | 'fetch'
  | 'push'
  | 'hold';

export interface BotState {
  state: BotStateKind;
  path: [number, number][];
  pathI: number;
  goalX: number;
  goalZ: number;
  hasGoal: boolean;
  repathAt: number;
  thinkAt: number;
  targetId: number;
  lastSeenPos: THREE.Vector3;
  lastSeenAt: number;
  reactAt: number;
  burstLeft: number;
  nextShotAt: number;
  errYaw: number;
  errPitch: number;
  strafeDir: number;
  strafeAt: number;
  patrolI: number;
  stuckAt: number;
  lastPos: THREE.Vector3;
  stuckCount: number;
  assignment: 'A' | 'B' | 'mid';
}

export function createBot(assignment: 'A' | 'B' | 'mid'): BotState {
  return {
    state: 'idle',
    path: [],
    pathI: 0,
    goalX: 0,
    goalZ: 0,
    hasGoal: false,
    repathAt: 0,
    thinkAt: Math.random() * 0.2,
    targetId: -1,
    lastSeenPos: new THREE.Vector3(),
    lastSeenAt: -10,
    reactAt: 0,
    burstLeft: 3,
    nextShotAt: 0,
    errYaw: 0,
    errPitch: 0,
    strafeDir: 1,
    strafeAt: 0,
    patrolI: 0,
    stuckAt: 0,
    lastPos: new THREE.Vector3(),
    stuckCount: 0,
    assignment,
  };
}

export function normAngle(a: number): number {
  while (a > Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
}

function turnTo(current: number, target: number, maxDelta: number): number {
  const d = normAngle(target - current);
  if (Math.abs(d) <= maxDelta) return target;
  return current + Math.sign(d) * maxDelta;
}

// ---------------- A* pathfinding ----------------

interface HeapNode {
  i: number;
  f: number;
}

function cellOf(nav: NavGrid, x: number, z: number): number {
  const cx = Math.floor((x - nav.ox) / nav.cell);
  const cz = Math.floor((z - nav.oz) / nav.cell);
  if (cx < 0 || cz < 0 || cx >= nav.w || cz >= nav.h) return -1;
  return cz * nav.w + cx;
}

function nearestWalkable(nav: NavGrid, idx: number): number {
  if (idx >= 0 && nav.walk[idx]) return idx;
  if (idx < 0) return -1;
  const cx0 = idx % nav.w;
  const cz0 = (idx / nav.w) | 0;
  for (let r = 1; r <= 8; r++) {
    for (let dz = -r; dz <= r; dz++) {
      for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dz)) !== r) continue;
        const cx = cx0 + dx;
        const cz = cz0 + dz;
        if (cx < 0 || cz < 0 || cx >= nav.w || cz >= nav.h) continue;
        const i = cz * nav.w + cx;
        if (nav.walk[i]) return i;
      }
    }
  }
  return -1;
}

/** straight-line walkability on the nav grid (for path smoothing) */
export function losNav(nav: NavGrid, x1: number, z1: number, x2: number, z2: number): boolean {
  const dist = Math.hypot(x2 - x1, z2 - z1);
  const steps = Math.max(1, Math.ceil(dist / 0.4));
  let prevH: number | null = null;
  for (let i = 0; i <= steps; i++) {
    const x = x1 + ((x2 - x1) * i) / steps;
    const z = z1 + ((z2 - z1) * i) / steps;
    const idx = cellOf(nav, x, z);
    if (idx < 0 || !nav.walk[idx]) return false;
    if (prevH !== null && Math.abs(nav.hgt[idx] - prevH) > 0.6) return false;
    prevH = nav.hgt[idx];
  }
  return true;
}

export function findPath(nav: NavGrid, sx: number, sz: number, tx: number, tz: number): [number, number][] | null {
  const start = nearestWalkable(nav, cellOf(nav, sx, sz));
  const goal = nearestWalkable(nav, cellOf(nav, tx, tz));
  if (start < 0 || goal < 0) return null;
  if (start === goal) return [[tx, tz]];

  const { w, h, walk, hgt } = nav;
  const g = new Float32Array(w * h).fill(Infinity);
  const came = new Int32Array(w * h).fill(-1);
  const closed = new Uint8Array(w * h);
  const gx = goal % w;
  const gz = (goal / w) | 0;

  const heap: HeapNode[] = [];
  const push = (i: number, f: number) => {
    heap.push({ i, f });
    let c = heap.length - 1;
    while (c > 0) {
      const p = (c - 1) >> 1;
      if (heap[p].f <= heap[c].f) break;
      [heap[p], heap[c]] = [heap[c], heap[p]];
      c = p;
    }
  };
  const pop = (): HeapNode => {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let c = 0;
      for (;;) {
        const l = c * 2 + 1;
        const r = l + 1;
        let m = c;
        if (l < heap.length && heap[l].f < heap[m].f) m = l;
        if (r < heap.length && heap[r].f < heap[m].f) m = r;
        if (m === c) break;
        [heap[m], heap[c]] = [heap[c], heap[m]];
        c = m;
      }
    }
    return top;
  };

  const hFn = (i: number) => {
    const dx = Math.abs((i % w) - gx);
    const dz = Math.abs(((i / w) | 0) - gz);
    return Math.max(dx, dz) + 0.41 * Math.min(dx, dz);
  };

  g[start] = 0;
  push(start, hFn(start));
  let iter = 0;

  while (heap.length > 0 && iter++ < 30000) {
    const { i } = pop();
    if (closed[i]) continue;
    closed[i] = 1;
    if (i === goal) {
      // reconstruct
      const cells: number[] = [];
      let c = i;
      while (c !== -1) {
        cells.push(c);
        c = came[c];
      }
      cells.reverse();
      const pts: [number, number][] = cells.map((ci) => [
        nav.ox + ((ci % w) + 0.5) * nav.cell,
        nav.oz + (((ci / w) | 0) + 0.5) * nav.cell,
      ]);
      pts[pts.length - 1] = [tx, tz];
      // smooth: greedy line-of-sight
      const out: [number, number][] = [];
      let anchor: [number, number] = [sx, sz];
      let k = 0;
      while (k < pts.length) {
        let far = k;
        for (let j = pts.length - 1; j > k; j--) {
          if (losNav(nav, anchor[0], anchor[1], pts[j][0], pts[j][1])) {
            far = j;
            break;
          }
        }
        out.push(pts[far]);
        anchor = pts[far];
        k = far + 1;
      }
      return out;
    }
    const cx = i % w;
    const cz = (i / w) | 0;
    for (let dz = -1; dz <= 1; dz++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dz === 0) continue;
        const nx = cx + dx;
        const nz = cz + dz;
        if (nx < 0 || nz < 0 || nx >= w || nz >= h) continue;
        const ni = nz * w + nx;
        if (!walk[ni] || closed[ni]) continue;
        if (Math.abs(hgt[ni] - hgt[i]) > 0.55) continue;
        // prevent corner cutting on diagonals
        if (dx !== 0 && dz !== 0) {
          if (!walk[cz * w + nx] || !walk[nz * w + cx]) continue;
        }
        const cost = dx !== 0 && dz !== 0 ? 1.414 : 1;
        const ng = g[i] + cost;
        if (ng < g[ni]) {
          g[ni] = ng;
          came[ni] = i;
          push(ni, ng + hFn(ni));
        }
      }
    }
  }
  return null;
}

// ---------------- bot brain ----------------

export function botThink(game: Engine, e: Entity, now: number): void {
  const bs = e.bot!;
  if (!e.alive) return;

  // ---- vision: nearest visible enemy ----
  let best: Entity | null = null;
  let bestD = 55;
  for (const o of game.entities) {
    if (o.team === e.team || !o.alive) continue;
    const d = e.pos.distanceTo(o.pos);
    if (d > bestD) continue;
    const ang = Math.atan2(-(o.pos.x - e.pos.x), -(o.pos.z - e.pos.z));
    const dyaw = normAngle(ang - e.yaw);
    if (Math.abs(dyaw) > 1.4 && d > 4) continue;
    if (!game.losClear(e.pos.x, e.pos.y + 1.55, e.pos.z, o.pos.x, o.pos.y + 1.45, o.pos.z)) continue;
    best = o;
    bestD = d;
  }

  if (best) {
    if (e.team === 'T') best.lastSeenByT = now;
    else best.lastSeenByCT = now;
    if (bs.targetId !== best.id) {
      bs.targetId = best.id;
      bs.reactAt = now + 0.3 + Math.random() * 0.45;
      bs.errYaw = (Math.random() - 0.5) * 0.16;
      bs.errPitch = (Math.random() - 0.5) * 0.09;
      bs.burstLeft = 3;
    }
    bs.lastSeenPos.copy(best.pos);
    bs.lastSeenAt = now;
    bs.state = 'engage';
    return;
  }

  if (bs.state === 'engage') {
    if (now - bs.lastSeenAt > 2.5) {
      bs.state = 'chase';
      bs.targetId = -1;
      bs.hasGoal = false;
    } else {
      return; // keep peeking toward last seen briefly
    }
  }

  // ---- opportunistic reload when safe ----
  const w = e.weapons[e.slot];
  if (w && !w.def.melee && w.reloadUntil < now && w.mag < w.def.magSize * 0.4 && w.reserve > 0) {
    game.startReload(e);
  }

  const bomb = game.bomb;
  const map = game.map;

  if (e.team === 'T') {
    if (bomb.state === 'planted') {
      const p = map.plantPoints[bomb.site ?? 'A'];
      setGoal(game, e, p.x + (Math.random() - 0.5) * 8, p.z + (Math.random() - 0.5) * 8, 'hold', now);
    } else if (e.hasBomb) {
      const site = zoneAt(map.zones, e.pos.x, e.pos.z);
      if (site) {
        bs.state = 'plant';
        bs.hasGoal = false;
        bs.path = [];
        game.startChannel(e, 'plant');
      } else {
        const p = map.plantPoints[game.attackSite];
        setGoal(game, e, p.x, p.z, 'push', now);
      }
    } else if (bomb.state === 'dropped') {
      if (game.nearestFetcherId() === e.id) {
        setGoal(game, e, bomb.pos.x, bomb.pos.z, 'fetch', now);
      } else {
        pushWithTeam(game, e, now);
      }
    } else {
      pushWithTeam(game, e, now);
    }
  } else {
    // CT
    if (bomb.state === 'planted') {
      const d = Math.hypot(e.pos.x - bomb.pos.x, e.pos.z - bomb.pos.z);
      if (d < 2.4) {
        bs.state = 'defuse';
        bs.hasGoal = false;
        bs.path = [];
        game.startChannel(e, 'defuse');
      } else {
        setGoal(game, e, bomb.pos.x, bomb.pos.z, 'push', now);
      }
    } else {
      // patrol assigned area
      const key = bs.assignment === 'A' ? 'siteA' : bs.assignment === 'B' ? 'siteB' : 'mid';
      const pts = map.waypoints[key];
      const t = pts[bs.patrolI % pts.length];
      if (Math.hypot(e.pos.x - t[0], e.pos.z - t[1]) < 1.6) bs.patrolI++;
      const nt = pts[bs.patrolI % pts.length];
      setGoal(game, e, nt[0], nt[1], 'patrol', now);
    }
  }
}

function pushWithTeam(game: Engine, e: Entity, now: number): void {
  const bs = e.bot!;
  const carrier = game.entities.find((x) => x.team === 'T' && x.alive && x.hasBomb);
  if (carrier && carrier.id !== e.id) {
    setGoal(game, e, carrier.pos.x + (Math.random() - 0.5) * 4, carrier.pos.z + (Math.random() - 0.5) * 4, 'push', now);
  } else {
    const p = game.map.plantPoints[game.attackSite];
    setGoal(game, e, p.x + (Math.random() - 0.5) * 6, p.z + (Math.random() - 0.5) * 6, 'push', now);
  }
}

function setGoal(game: Engine, e: Entity, x: number, z: number, state: BotStateKind, now: number): void {
  const bs = e.bot!;
  const moved = !bs.hasGoal || Math.hypot(x - bs.goalX, z - bs.goalZ) > 2.5;
  bs.state = state;
  if (moved || now >= bs.repathAt || bs.pathI >= bs.path.length) {
    bs.goalX = x;
    bs.goalZ = z;
    bs.hasGoal = true;
    const path = findPath(game.map.nav, e.pos.x, e.pos.z, x, z);
    if (path) {
      bs.path = path;
      bs.pathI = 0;
    }
    bs.repathAt = now + 2.5 + Math.random() * 1.5;
  }
}

export function botFrame(game: Engine, e: Entity, dt: number, now: number): void {
  const bs = e.bot!;
  if (!e.alive) return;
  const w = e.weapons[e.slot];
  const speed = w ? w.def.moveSpeed : 4.5;

  // --- combat ---
  if (bs.state === 'engage' && bs.targetId >= 0) {
    const t = game.entities[bs.targetId];
    if (t && t.alive) {
      const dx = t.pos.x - e.pos.x;
      const dz = t.pos.z - e.pos.z;
      const distXZ = Math.hypot(dx, dz);
      const desiredYaw = Math.atan2(-dx, -dz);
      const dy = t.pos.y + 1.25 - (e.pos.y + 1.55);
      const desiredPitch = Math.atan2(dy, distXZ);
      bs.errYaw *= Math.max(0, 1 - dt * 1.4);
      bs.errPitch *= Math.max(0, 1 - dt * 1.4);
      e.yaw = turnTo(e.yaw, desiredYaw + bs.errYaw, dt * 7);
      e.pitch = turnTo(e.pitch, desiredPitch + bs.errPitch, dt * 7);

      const aligned = Math.abs(normAngle(desiredYaw - e.yaw)) < 0.07;
      const canSee = game.losClear(e.pos.x, e.pos.y + 1.55, e.pos.z, t.pos.x, t.pos.y + 1.45, t.pos.z);
      if (now >= bs.reactAt && aligned && canSee) {
        if (w && !w.def.melee) {
          if (w.mag > 0) {
            if (now >= bs.nextShotAt && w.reloadUntil < now) {
              game.fireWeapon(e);
              bs.burstLeft--;
              if (!w.def.auto || bs.burstLeft <= 0) {
                bs.burstLeft = w.def.auto ? 3 + ((Math.random() * 4) | 0) : 1;
                bs.nextShotAt = now + 0.35 + Math.random() * 0.45;
              }
            }
          } else {
            game.startReload(e);
          }
        } else if (w && w.def.melee) {
          // chase with knife (shouldn't normally happen)
          game.moveEntity(e, dx / distXZ, dz / distXZ, speed, dt);
          return;
        }
      }
      // strafe while fighting (snipers hold still)
      if (now > bs.strafeAt) {
        bs.strafeDir = Math.random() < 0.5 ? -1 : 1;
        bs.strafeAt = now + 0.6 + Math.random() * 0.9;
      }
      if (!(w && w.def.scope)) {
        const px = -Math.sin(e.yaw + (Math.PI / 2) * bs.strafeDir);
        const pz = -Math.cos(e.yaw + (Math.PI / 2) * bs.strafeDir);
        game.moveEntity(e, px, pz, speed * 0.45, dt);
      } else {
        game.moveEntity(e, 0, 0, 0, dt);
      }
      return;
    }
    bs.targetId = -1;
  }

  // --- channeling plant / defuse ---
  if (bs.state === 'plant' || bs.state === 'defuse') {
    game.moveEntity(e, 0, 0, 0, dt);
    if (!e.channel) bs.state = 'idle';
    return;
  }

  // --- path following ---
  let wantsMove = false;
  if (bs.pathI < bs.path.length) {
    const wp = bs.path[bs.pathI];
    const dx = wp[0] - e.pos.x;
    const dz = wp[1] - e.pos.z;
    const d = Math.hypot(dx, dz);
    if (d < 0.5) {
      bs.pathI++;
    } else {
      wantsMove = true;
      const dirX = dx / d;
      const dirZ = dz / d;
      e.yaw = turnTo(e.yaw, Math.atan2(-dirX, -dirZ), dt * 10);
      e.pitch *= 1 - Math.min(1, dt * 6);
      game.moveEntity(e, dirX, dirZ, speed, dt);
    }
  } else {
    game.moveEntity(e, 0, 0, 0, dt);
  }

  // --- stuck detection ---
  if (now >= bs.stuckAt) {
    const moved = e.pos.distanceTo(bs.lastPos);
    if (wantsMove && moved < 0.25) {
      bs.stuckCount++;
      if (bs.stuckCount >= 2) {
        e.vel.y = JUMP_VEL;
        e.onGround = false;
        bs.repathAt = 0;
        bs.hasGoal = false;
        bs.stuckCount = 0;
      }
    } else {
      bs.stuckCount = 0;
    }
    bs.lastPos.copy(e.pos);
    bs.stuckAt = now + 0.6;
  }
}
