// The authoritative game simulation: fixed-step, headless, deterministic-ish.
// Owns characters, weapons/combat, C4, rounds and bots. Rendering only reads from it.

import { World } from './world.ts';
import { NavGrid } from './nav.ts';
import { Character, emptyInput, otherTeam } from './character.ts';
import type { Team } from './character.ts';
import type { GameEvent } from './events.ts';
import { RoundManager, ROUND_CFG } from './round.ts';
import { BOMBSITES, BUY_ZONES } from './mapData.ts';
import { BOT_FOV_COS, HUMAN_FOV_COS, TICK, inZone } from './constants.ts';
import { stepBody, JUMP_SPEED, groundHeight, resolveHorizontal } from './physics.ts';
import { HITBOXES, rayHitboxes, BODY } from './skeleton.ts';
import { computeDamage, WEAPONS } from './weapons.ts';
import type { HitGroup, Slot, WeaponDef, WeaponId } from './weapons.ts';
import { clamp, DEG, dirFromAngles, randomInDisk } from './math.ts';
import type { Vec3 } from './math.ts';
import { BotBrain } from './ai.ts';

export type Difficulty = 'easy' | 'normal' | 'hard';

export interface SimConfig {
  playerTeam: Team;
  difficulty: Difficulty;
  allPistolRounds: boolean;
  winsToMatch: number;
  /** if true the "player" slot is driven by a bot as well (tests / demo) */
  autopilot: boolean;
  playerName: string;
}

export type BombStatus = 'carried' | 'dropped' | 'planted' | 'defused' | 'exploded';

export interface BombState {
  state: BombStatus;
  carrierId: number;
  pos: Vec3;
  site: 'A' | 'B' | null;
  plantStart: number;
  explodeTime: number;
  plantedTime: number;
  defuserId: number;
  defuseStart: number;
  defuseDuration: number;
  nextBeep: number;
}

export interface Noise {
  x: number;
  y: number;
  z: number;
  team: Team;
  radius: number;
  time: number;
}

export interface BulletResult {
  t: number;
  victim: Character | null;
  group: HitGroup | null;
  normal: Vec3 | null;
}

const BOT_NAMES = [
  'Albert', 'Allen', 'Bert', 'Brian', 'Cecil', 'Clarence', 'Elliot', 'Elmer', 'Ernie', 'Eugene', 'Fergus',
  'Ferris', 'Frank', 'Frasier', 'Graham', 'Harvey', 'Irwin', 'Lester', 'Marvin', 'Neil', 'Niles', 'Oliver',
  'Opie', 'Quincy', 'Rex', 'Ringo', 'Seth', 'Ulric', 'Vinny', 'Wade', 'Walt', 'Xander', 'Yanni', 'Zach',
];

export { TICK };

export class Sim {
  readonly world: World;
  readonly nav: NavGrid;
  readonly config: SimConfig;
  chars: Character[] = [];
  brains: (BotBrain | null)[] = [];
  time = 0;
  tick = 0;
  events: GameEvent[] = [];
  round: RoundManager;
  bomb: BombState;
  playerId = 0;
  controlledId = 0;
  /** last time each character was seen by the given team */
  spotted: Record<Team, Float64Array>;
  noises: Noise[] = [];
  /** A* calls allowed this tick (spread path-finding cost across frames) */
  pathBudget = 2;
  /** coarse team intel for bot rotations */
  intel: Record<Team, { site: 'A' | 'B' | null; time: number }> = {
    T: { site: null, time: -99 },
    CT: { site: null, time: -99 },
  };

  constructor(config: SimConfig, world?: World, nav?: NavGrid) {
    this.config = config;
    this.world = world ?? new World();
    this.nav = nav ?? new NavGrid(this.world);
    this.round = new RoundManager(this);
    this.bomb = this.freshBomb();
    const names = BOT_NAMES.slice().sort(() => Math.random() - 0.5);
    const enemy = otherTeam(config.playerTeam);
    for (let i = 0; i < 10; i++) {
      const team = i < 5 ? config.playerTeam : enemy;
      const name = i === 0 ? config.playerName : names[i];
      const c = new Character(i, name, team);
      c.isBot = i !== 0 || config.autopilot;
      this.chars.push(c);
    }
    this.spotted = { T: new Float64Array(10).fill(-99), CT: new Float64Array(10).fill(-99) };
    const skill = { easy: 0.3, normal: 0.55, hard: 0.82 }[config.difficulty];
    this.brains = this.chars.map((c) => new BotBrain(this, c, clamp(skill + (Math.random() - 0.5) * 0.2, 0.1, 0.95)));
  }

  private freshBomb(): BombState {
    return {
      state: 'carried',
      carrierId: -1,
      pos: { x: 0, y: 0, z: 0 },
      site: null,
      plantStart: 0,
      explodeTime: 0,
      plantedTime: 0,
      defuserId: -1,
      defuseStart: 0,
      defuseDuration: ROUND_CFG.defuseTime,
      nextBeep: 0,
    };
  }

  start() {
    this.round.startRound();
  }

  emit(e: GameEvent) {
    this.events.push(e);
  }

  get controlled(): Character {
    return this.chars[this.controlledId];
  }

  get player(): Character {
    return this.chars[this.playerId];
  }

  resetRoundState() {
    this.bomb = this.freshBomb();
    this.controlledId = this.playerId;
    for (const c of this.chars) c.isBot = c.id !== this.playerId || this.config.autopilot;
    this.spotted.T.fill(-99);
    this.spotted.CT.fill(-99);
    this.noises.length = 0;
    this.intel.T = { site: null, time: -99 };
    this.intel.CT = { site: null, time: -99 };
  }

  // ------------------------------------------------------------------ main step
  step(dt: number = TICK) {
    this.time += dt;
    this.tick++;
    this.pathBudget = 1;
    this.round.update();

    if (this.tick % 6 === 0) this.updateSpotting();
    for (const c of this.chars) {
      if (!c.alive) continue;
      if (c.isBot) this.brains[c.id]?.update(dt);
    }
    for (const c of this.chars) {
      if (!c.alive) continue;
      this.updateWeapon(c, dt);
      this.updateMovement(c, dt);
    }
    this.separateCharacters();
    this.updateBomb();
    if (this.noises.length > 64) this.noises.splice(0, this.noises.length - 64);
  }

  // ------------------------------------------------------------------ perception
  eye(c: Character): Vec3 {
    return { x: c.pos.x, y: c.eyeY, z: c.pos.z };
  }

  /** Line-of-sight + view cone test from a to b. */
  canSee(a: Character, b: Character, fovCos: number): boolean {
    const ex = a.pos.x;
    const ey = a.eyeY;
    const ez = a.pos.z;
    const tx = b.pos.x - ex;
    const tz = b.pos.z - ez;
    const ty = b.pos.y + 1.3 - ey;
    const d = Math.hypot(tx, ty, tz);
    if (d > 110) return false;
    if (d > 2.5) {
      const f = dirFromAngles(a.yaw, a.pitch);
      if ((f.x * tx + f.y * ty + f.z * tz) / d < fovCos) return false;
    }
    const pts = [1.66, 1.3, 0.7];
    for (const h of pts) {
      if (this.world.lineOfSight(ex, ey, ez, b.pos.x, b.pos.y + h, b.pos.z)) return true;
    }
    return false;
  }

  private updateSpotting() {
    for (const a of this.chars) {
      if (!a.alive) continue;
      const cos = a.isBot ? BOT_FOV_COS : HUMAN_FOV_COS;
      for (const b of this.chars) {
        if (!b.alive || b.team === a.team) continue;
        if (this.canSee(a, b, cos)) {
          this.spotted[a.team][b.id] = this.time;
          const region = this.world.regionAt(b.pos.x, b.pos.z);
          const site =
            region === 'asite' || region === 'short' || region === 'long' || region === 'cat'
              ? 'A'
              : region === 'bsite' || region === 'tunnels' || region === 'bdoors'
                ? 'B'
                : null;
          if (site && b.team === 'T') this.intel.CT = { site, time: this.time };
        }
      }
    }
  }

  isSpottedBy(team: Team, c: Character, window = 0.6): boolean {
    return this.time - this.spotted[team][c.id] < window;
  }

  addNoise(pos: Vec3, team: Team, radius: number) {
    this.noises.push({ x: pos.x, y: pos.y, z: pos.z, team, radius, time: this.time });
  }

  // ------------------------------------------------------------------ movement
  private updateMovement(c: Character, dt: number) {
    const inp = c.input;
    const b = c.body;
    const frozen = this.round.phase === 'freeze' || c.plantProgress >= 0 || c.defuseProgress >= 0;
    const def = c.def;
    let maxSpeed = def ? def.speed : 6;
    if (c.scope > 0 && def?.scope) maxSpeed *= def.scope.scopedSpeedMul;
    if (inp.walk) maxSpeed *= 0.52;
    // tagging: slowed down briefly when hit
    if (this.time - c.lastHurtTime < 0.35) maxSpeed *= 0.55;
    let wx = 0;
    let wz = 0;
    if (!frozen) {
      const sy = Math.sin(c.yaw);
      const cy = Math.cos(c.yaw);
      wx = -sy * inp.forward + cy * inp.right;
      wz = -cy * inp.forward - sy * inp.right;
      const l = Math.hypot(wx, wz);
      if (l > 1) {
        wx /= l;
        wz /= l;
      }
    }
    const jumpEdge = inp.jump && !c.prevJump;
    c.prevJump = inp.jump;
    if (b.onGround) {
      const moving = wx !== 0 || wz !== 0;
      const k = 1 - Math.exp(-(moving ? 10 : 14) * dt);
      b.vel.x += (wx * maxSpeed - b.vel.x) * k;
      b.vel.z += (wz * maxSpeed - b.vel.z) * k;
      if (jumpEdge && !frozen) {
        b.vel.y = JUMP_SPEED;
        b.onGround = false;
        this.emit({ type: 'jump', who: c.id, pos: { ...c.pos } });
      }
    } else {
      b.vel.x += wx * maxSpeed * 2 * dt;
      b.vel.z += wz * maxSpeed * 2 * dt;
      const hs = Math.hypot(b.vel.x, b.vel.z);
      const cap = Math.max(maxSpeed, 0.1);
      if (hs > cap) {
        b.vel.x *= cap / hs;
        b.vel.z *= cap / hs;
      }
    }
    stepBody(this.world, b, dt);
    if (b.landImpact > 0) {
      if (b.landImpact > 3.5) this.emit({ type: 'land', who: c.id, pos: { ...c.pos }, impact: b.landImpact });
      // fall damage
      if (b.landImpact > 11) this.applyRawDamage(c, c, Math.round((b.landImpact - 11) * 12), 'fall');
      b.landImpact = 0;
    }
    const hs = Math.hypot(b.vel.x, b.vel.z);
    c.animSpeed = hs;
    if (b.onGround) {
      c.walkPhase += (hs * dt * Math.PI * 2) / 3.2;
      if (hs > 3.2) {
        c.stepAccum += hs * dt;
        if (c.stepAccum > 1.65) {
          c.stepAccum = 0;
          this.emit({ type: 'footstep', who: c.id, pos: { ...c.pos }, foot: Math.floor(c.walkPhase / Math.PI) & 1 });
          this.addNoise(c.pos, c.team, 20);
        }
      }
    }
    // safety net: never leave the playable space
    if (c.pos.y < -10) {
      const g = groundHeight(this.world, c.pos.x, c.pos.z, b.radius, 50);
      c.pos.y = g;
    }
  }

  private separateCharacters() {
    const cs = this.chars;
    for (let i = 0; i < cs.length; i++) {
      const a = cs[i];
      if (!a.alive) continue;
      for (let j = i + 1; j < cs.length; j++) {
        const b = cs[j];
        if (!b.alive) continue;
        if (Math.abs(a.pos.y - b.pos.y) > 1.6) continue;
        const dx = b.pos.x - a.pos.x;
        const dz = b.pos.z - a.pos.z;
        const d = Math.hypot(dx, dz);
        const min = a.body.radius + b.body.radius;
        if (d >= min || d < 1e-5) continue;
        const push = (min - d) * 0.5;
        const nx = dx / d;
        const nz = dz / d;
        a.pos.x -= nx * push;
        a.pos.z -= nz * push;
        b.pos.x += nx * push;
        b.pos.z += nz * push;
        // never let a shove push somebody into geometry
        resolveHorizontal(this.world, a.body);
        resolveHorizontal(this.world, b.body);
      }
    }
  }

  // ------------------------------------------------------------------ weapons
  switchTo(c: Character, slot: Slot) {
    const w = c.weapons[slot];
    if (!w || slot === c.active) return;
    if (c.plantProgress >= 0 || c.defuseProgress >= 0) return;
    c.lastSlot = c.active;
    c.active = slot;
    c.deployEnd = this.time + w.def.deployTime;
    c.nextAttack = Math.max(c.nextAttack, c.deployEnd);
    c.reloadEnd = 0;
    c.scope = 0;
    c.rescopeAt = 0;
    c.shotsFired = 0;
    this.emit({ type: 'switch', who: c.id, weapon: w.def.id });
  }

  startReload(c: Character) {
    const w = c.weapon;
    if (!w || c.reloading || w.def.magSize === 0) return;
    if (w.mag >= w.def.magSize || w.reserve <= 0) return;
    if (this.time < c.deployEnd) return;
    c.reloadStart = this.time;
    c.reloadEnd = this.time + w.def.reloadTime;
    c.scope = 0;
    c.rescopeAt = 0;
    this.emit({ type: 'reload', who: c.id, weapon: w.def.id, duration: w.def.reloadTime });
  }

  computeSpread(c: Character): number {
    const def = c.def;
    if (!def) return 0;
    const s = def.spread;
    const b = c.body;
    const hs = Math.hypot(b.vel.x, b.vel.z);
    const moveFrac = clamp((hs / def.speed - 0.3) / 0.7, 0, 1);
    let base = s.base;
    if (def.scope) base = c.scope > 0 ? def.scope.scopedBase : s.base + def.scope.unscopedPenalty;
    return base + s.move * moveFrac + (b.onGround ? 0 : s.air) + c.spreadAccum;
  }

  private updateWeapon(c: Character, dt: number) {
    const t = this.time;
    const inp = c.input;
    if (inp.slot) {
      this.switchTo(c, inp.slot);
      inp.slot = null;
    }
    if (inp.lastWeapon) {
      if (c.weapons[c.lastSlot]) this.switchTo(c, c.lastSlot);
      inp.lastWeapon = false;
    }
    const w = c.weapon;
    if (!w) {
      c.active = c.bestSlot();
      return;
    }
    const def = w.def;
    if (c.reloadEnd > 0 && t >= c.reloadEnd) {
      const need = def.magSize - w.mag;
      const take = Math.min(need, w.reserve);
      w.mag += take;
      w.reserve -= take;
      c.reloadEnd = 0;
    }
    if (c.rescopeAt > 0 && t >= c.rescopeAt) {
      if (def.scope && !c.reloading && c.rescopeLevel > 0 && w.mag > 0) {
        c.scope = c.rescopeLevel;
        this.emit({ type: 'scope', who: c.id, level: c.scope });
      }
      c.rescopeAt = 0;
    }
    const canAct = this.round.phase !== 'freeze' && c.plantProgress < 0 && c.defuseProgress < 0;
    if (inp.reload) {
      inp.reload = false;
      this.startReload(c);
    }
    const altEdge = inp.alt && !c.prevAlt;
    c.prevAlt = inp.alt;
    const fireEdge = inp.fire && !c.prevFire;
    c.prevFire = inp.fire;

    if (altEdge && def.scope && t >= c.deployEnd && !c.reloading) {
      c.scope = (c.scope + 1) % (def.scope.fovs.length + 1);
      c.rescopeAt = 0;
      this.emit({ type: 'scope', who: c.id, level: c.scope });
    }

    if (def.slot === 'melee') {
      if (canAct && (inp.fire || inp.alt) && t >= c.nextAttack && t >= c.deployEnd) this.meleeAttack(c, !inp.fire && inp.alt);
    } else if (def.slot !== 'bomb') {
      const wantFire = def.automatic ? inp.fire : fireEdge;
      if (wantFire && canAct && t >= c.nextAttack && t >= c.deployEnd && !c.reloading) {
        if (w.mag > 0) this.fireBullet(c, def);
        else {
          this.emit({ type: 'empty', who: c.id });
          c.nextAttack = t + 0.25;
          if (w.reserve > 0) this.startReload(c);
        }
      }
      if (w.mag === 0 && w.reserve > 0 && !c.reloading && t >= c.nextAttack && !inp.fire) this.startReload(c);
    }

    // recoil + spread recovery
    if (t - c.lastShotTime > def.fireInterval * 1.25) {
      const rec = (def.recoil.recover * DEG + Math.abs(c.punchPitch) * 5) * dt;
      c.punchPitch = Math.abs(c.punchPitch) <= rec ? 0 : c.punchPitch - Math.sign(c.punchPitch) * rec;
      const recY = (def.recoil.recover * 0.6 * DEG + Math.abs(c.punchYaw) * 5) * dt;
      c.punchYaw = Math.abs(c.punchYaw) <= recY ? 0 : c.punchYaw - Math.sign(c.punchYaw) * recY;
      c.spreadAccum *= Math.exp(-def.spread.recovery * dt);
      c.shotsFired = Math.max(0, c.shotsFired - dt * 12);
    }
  }

  private fireBullet(c: Character, def: WeaponDef) {
    const w = c.weapon!;
    const t = this.time;
    w.mag--;
    c.nextAttack = t + def.fireInterval;
    c.lastShotTime = t;
    c.shotCounter++;
    const spread = this.computeSpread(c);
    const dir = dirFromAngles(c.yaw + c.punchYaw, c.pitch + c.punchPitch);
    // spread cone basis
    let rx = -dir.z;
    let rz = dir.x;
    const rl = Math.hypot(rx, rz) || 1;
    rx /= rl;
    rz /= rl;
    // up = right x dir
    const ux = -rz * dir.y;
    const uy = rz * dir.x - rx * dir.z;
    const uz = rx * dir.y;
    const [sx, sy] = randomInDisk();
    const off = Math.tan(spread);
    let dx = dir.x + (rx * sx + ux * sy) * off;
    let dy = dir.y + uy * sy * off;
    let dz = dir.z + (rz * sx + uz * sy) * off;
    const dl = Math.hypot(dx, dy, dz);
    dx /= dl;
    dy /= dl;
    dz /= dl;
    const eye = this.eye(c);
    const res = this.traceBullet(c, eye, dx, dy, dz, def.range);
    const to = { x: eye.x + dx * res.t, y: eye.y + dy * res.t, z: eye.z + dz * res.t };
    c.lastShotHit = !!res.victim;
    this.emit({
      type: 'shot',
      shooter: c.id,
      weapon: def.id,
      from: eye,
      to,
      normal: res.victim ? null : res.normal,
      hitChar: res.victim ? res.victim.id : -1,
      tracer: c.shotCounter % def.tracerEvery === 0,
    });
    this.addNoise(eye, c.team, def.silenced ? 14 : 55);
    if (res.victim && res.group) this.applyDamage(res.victim, c, def, def.damage, res.group, res.t, to);

    // recoil (after the shot so the first bullet goes where you aim)
    const r = def.recoil;
    const i = c.shotsFired;
    const up = r.up * (i < r.riseShots ? 1 : 0.3);
    const side =
      (i >= 3 ? r.side * Math.sin(i * 0.55 + (c.id % 3)) : r.side * 0.25 * (Math.random() - 0.5)) +
      (Math.random() * 2 - 1) * r.jitter;
    c.punchPitch = Math.min(c.punchPitch + up * DEG, r.maxUp * DEG);
    c.punchYaw = clamp(c.punchYaw + side * DEG, -6 * DEG, 6 * DEG);
    c.shotsFired += 1;
    c.spreadAccum = Math.min(c.spreadAccum + def.spread.perShot, def.spread.max);
    if (def.scope && c.scope > 0) {
      c.rescopeLevel = c.scope;
      c.scope = 0;
      c.rescopeAt = c.nextAttack;
    }
  }

  traceBullet(shooter: Character, eye: Vec3, dx: number, dy: number, dz: number, range: number): BulletResult {
    const wh = this.world.raycast(eye.x, eye.y, eye.z, dx, dy, dz, range);
    let maxT = wh ? wh.t : range;
    let victim: Character | null = null;
    let group: HitGroup | null = null;
    for (const o of this.chars) {
      if (!o.alive || o.team === shooter.team) continue;
      const cx = o.pos.x - eye.x;
      const cy = o.pos.y + 0.9 - eye.y;
      const cz = o.pos.z - eye.z;
      const tp = cx * dx + cy * dy + cz * dz;
      if (tp < -1.5 || tp > maxT + 1.5) continue;
      const px = cx - dx * tp;
      const py = cy - dy * tp;
      const pz = cz - dz * tp;
      if (px * px + py * py + pz * pz > 1.4 * 1.4) continue;
      const h = rayHitboxes(HITBOXES[o.holdPose], o.pos, o.yaw, eye.x, eye.y, eye.z, dx, dy, dz, maxT);
      if (h && h.t < maxT) {
        maxT = h.t;
        victim = o;
        group = h.group;
      }
    }
    const normal = !victim && wh ? { x: wh.nx, y: wh.ny, z: wh.nz } : null;
    return { t: maxT, victim, group, normal };
  }

  private meleeAttack(c: Character, alt: boolean) {
    const def = c.def!;
    const m = def.melee!;
    const t = this.time;
    c.nextAttack = t + (alt ? m.altInterval : def.fireInterval);
    c.meleeSwingEnd = t + (alt ? 0.6 : 0.35);
    c.meleeAlt = alt;
    c.shotCounter++;
    c.lastShotTime = t;
    const eye = this.eye(c);
    let hitSomething = false;
    let hitWorld = false;
    for (const yawOff of [0, 0.12, -0.12, 0.24, -0.24]) {
      const d = dirFromAngles(c.yaw + yawOff, c.pitch);
      const res = this.traceBullet(c, eye, d.x, d.y, d.z, m.range);
      if (res.victim && res.group) {
        const v = res.victim;
        // backstab if attacking from behind the victim
        const vf = dirFromAngles(v.yaw, 0);
        const toAtt = { x: c.pos.x - v.pos.x, z: c.pos.z - v.pos.z };
        const l = Math.hypot(toAtt.x, toAtt.z) || 1;
        const behind = (vf.x * toAtt.x + vf.z * toAtt.z) / l < -0.5;
        const base = (alt ? m.altDamage : m.damage) * (behind ? (alt ? 2.8 : 2.2) : 1);
        this.applyDamage(v, c, def, base, res.group, res.t, {
          x: eye.x + d.x * res.t,
          y: eye.y + d.y * res.t,
          z: eye.z + d.z * res.t,
        });
        hitSomething = true;
        break;
      }
      if (yawOff === 0 && res.normal && res.t < m.range) hitWorld = true;
    }
    this.emit({ type: 'melee', shooter: c.id, alt, hit: hitSomething, hitWorld });
    this.addNoise(eye, c.team, 8);
  }

  applyDamage(v: Character, a: Character, def: WeaponDef, base: number, group: HitGroup, dist: number, pos: Vec3) {
    if (!v.alive) return;
    const res = computeDamage(def, base, group, dist, { armor: v.armor, helmet: v.helmet });
    const armorHit = res.armor > 0;
    v.armor = Math.max(0, v.armor - res.armor);
    if (v.armor === 0) v.helmet = false;
    const before = v.health;
    v.health -= res.health;
    a.damageDealt += Math.min(before, res.health);
    v.lastHurtTime = this.time;
    v.lastHurtFrom = this.eye(a);
    v.lastHurtBy = a.id;
    // aim punch on the victim
    v.punchPitch += (group === 'head' ? 3 : 1.4) * DEG;
    const killed = v.health <= 0;
    this.emit({
      type: 'damage',
      victim: v.id,
      attacker: a.id,
      amount: res.health,
      group,
      pos,
      killed,
      weapon: def.id,
      armorHit,
    });
    if (killed) this.kill(v, a, def.id, group === 'head');
  }

  applyRawDamage(v: Character, a: Character, amount: number, _kind: 'fall' | 'bomb') {
    if (!v.alive) return;
    v.health -= amount;
    v.lastHurtTime = this.time;
    if (v.health <= 0) this.kill(v, a, _kind === 'bomb' ? 'c4' : 'knife', false, _kind === 'fall');
  }

  kill(v: Character, k: Character, weapon: WeaponId, headshot: boolean, suicide = false) {
    if (!v.alive) return;
    v.alive = false;
    v.health = 0;
    v.deathTime = this.time;
    v.deathYaw = v.yaw;
    v.deaths++;
    v.killerId = suicide ? v.id : k.id;
    v.body.vel.x = v.body.vel.z = 0;
    if (v.plantProgress >= 0) this.emit({ type: 'bomb', action: 'plant_abort', who: v.id, pos: { ...v.pos } });
    if (v.defuseProgress >= 0) this.emit({ type: 'bomb', action: 'defuse_abort', who: v.id, pos: { ...v.pos } });
    v.plantProgress = -1;
    v.defuseProgress = -1;
    if (this.bomb.defuserId === v.id) this.bomb.defuserId = -1;
    if (!suicide && k.team !== v.team && k.id !== v.id) {
      k.kills++;
      k.roundKills++;
      if (headshot) k.headshots++;
    }
    this.emit({ type: 'kill', killer: suicide ? v.id : k.id, victim: v.id, weapon, headshot });
    if (v.hasBomb()) this.dropBomb(v);
    this.round.checkWin();
  }

  // ------------------------------------------------------------------ bomb
  giveBomb(c: Character) {
    c.give('c4');
    this.bomb.state = 'carried';
    this.bomb.carrierId = c.id;
    this.emit({ type: 'bomb', action: 'given', who: c.id, pos: { ...c.pos } });
  }

  dropBomb(c: Character) {
    delete c.weapons.bomb;
    if (c.active === 'bomb') c.active = c.bestSlot();
    const g = groundHeight(this.world, c.pos.x, c.pos.z, 0.2, c.pos.y + 0.5);
    this.bomb.state = 'dropped';
    this.bomb.carrierId = -1;
    this.bomb.pos = { x: c.pos.x, y: g, z: c.pos.z };
    this.emit({ type: 'bomb', action: 'drop', who: c.id, pos: { ...this.bomb.pos } });
  }

  siteAt(p: Vec3): 'A' | 'B' | null {
    if (inZone(BOMBSITES.A, p.x, p.z)) return 'A';
    if (inZone(BOMBSITES.B, p.x, p.z)) return 'B';
    return null;
  }

  inBuyZone(c: Character): boolean {
    return inZone(BUY_ZONES[c.team], c.pos.x, c.pos.z);
  }

  private updateBomb() {
    const bomb = this.bomb;
    const t = this.time;
    if (bomb.state === 'carried') {
      const c = this.chars[bomb.carrierId];
      if (!c) return;
      bomb.pos = { ...c.pos };
      const wants =
        c.alive &&
        (c.input.use || (c.active === 'bomb' && c.input.fire)) &&
        (this.round.phase === 'live' || this.round.phase === 'over') &&
        c.body.onGround;
      const site = this.siteAt(c.pos);
      if (wants && site && this.round.phase === 'live') {
        if (c.plantProgress < 0) {
          c.plantProgress = 0;
          bomb.plantStart = t;
          if (c.active !== 'bomb') {
            c.lastSlot = c.active;
            c.active = 'bomb';
            c.reloadEnd = 0;
            c.scope = 0;
          }
          c.body.vel.x = c.body.vel.z = 0;
          this.emit({ type: 'bomb', action: 'plant_start', who: c.id, pos: { ...c.pos }, site });
          this.addNoise(c.pos, c.team, 12);
        }
        c.plantProgress = (t - bomb.plantStart) / ROUND_CFG.plantTime;
        if (c.plantProgress >= 1) {
          c.plantProgress = -1;
          delete c.weapons.bomb;
          c.active = c.bestSlot();
          c.deployEnd = t + 0.4;
          bomb.state = 'planted';
          bomb.carrierId = -1;
          bomb.site = site;
          bomb.pos = { ...c.pos };
          bomb.plantedTime = t;
          bomb.explodeTime = t + ROUND_CFG.bombTime;
          bomb.nextBeep = t + 1;
          this.intel.CT = { site, time: t };
          this.emit({ type: 'bomb', action: 'planted', who: c.id, pos: { ...bomb.pos }, site });
        }
      } else if (c.plantProgress >= 0) {
        c.plantProgress = -1;
        this.emit({ type: 'bomb', action: 'plant_abort', who: c.id, pos: { ...c.pos } });
      }
    } else if (bomb.state === 'dropped') {
      for (const c of this.chars) {
        if (!c.alive || c.team !== 'T') continue;
        if (Math.hypot(c.pos.x - bomb.pos.x, c.pos.z - bomb.pos.z) < 1.1 && Math.abs(c.pos.y - bomb.pos.y) < 1.5) {
          c.give('c4');
          bomb.state = 'carried';
          bomb.carrierId = c.id;
          this.emit({ type: 'bomb', action: 'pickup', who: c.id, pos: { ...bomb.pos } });
          break;
        }
      }
    } else if (bomb.state === 'planted') {
      const remaining = bomb.explodeTime - t;
      if (t >= bomb.nextBeep) {
        this.emit({ type: 'bomb', action: 'beep', who: -1, pos: { ...bomb.pos } });
        const frac = clamp(remaining / ROUND_CFG.bombTime, 0, 1);
        bomb.nextBeep = t + 0.12 + 0.9 * Math.pow(frac, 1.4);
      }
      // defusing
      if (bomb.defuserId >= 0) {
        const d = this.chars[bomb.defuserId];
        const near = Math.hypot(d.pos.x - bomb.pos.x, d.pos.z - bomb.pos.z) < 1.8 && Math.abs(d.pos.y - bomb.pos.y) < 1.5;
        if (!d.alive || !d.input.use || !near) {
          d.defuseProgress = -1;
          bomb.defuserId = -1;
          this.emit({ type: 'bomb', action: 'defuse_abort', who: d.id, pos: { ...bomb.pos } });
        } else {
          d.defuseProgress = (t - bomb.defuseStart) / bomb.defuseDuration;
          if (d.defuseProgress >= 1) {
            d.defuseProgress = -1;
            bomb.defuserId = -1;
            bomb.state = 'defused';
            this.emit({ type: 'bomb', action: 'defused', who: d.id, pos: { ...bomb.pos } });
            this.round.endRound('CT', 'bomb_defused');
            return;
          }
        }
      } else {
        for (const c of this.chars) {
          if (!c.alive || c.team !== 'CT' || !c.input.use || !c.body.onGround) continue;
          if (Math.hypot(c.pos.x - bomb.pos.x, c.pos.z - bomb.pos.z) < 1.5 && Math.abs(c.pos.y - bomb.pos.y) < 1.5) {
            bomb.defuserId = c.id;
            bomb.defuseStart = t;
            bomb.defuseDuration = c.hasKit ? ROUND_CFG.kitDefuseTime : ROUND_CFG.defuseTime;
            c.defuseProgress = 0;
            c.body.vel.x = c.body.vel.z = 0;
            c.reloadEnd = 0;
            c.scope = 0;
            this.emit({ type: 'bomb', action: 'defuse_start', who: c.id, pos: { ...bomb.pos } });
            this.addNoise(bomb.pos, 'CT', 14);
            break;
          }
        }
      }
      if (t >= bomb.explodeTime) this.explode();
    }
  }

  private explode() {
    const bomb = this.bomb;
    bomb.state = 'exploded';
    if (bomb.defuserId >= 0) {
      this.chars[bomb.defuserId].defuseProgress = -1;
      bomb.defuserId = -1;
    }
    this.emit({ type: 'bomb', action: 'exploded', who: -1, pos: { ...bomb.pos } });
    // settle the round first: blast deaths must not be counted as an elimination result
    this.round.endRound('T', 'bomb_exploded');
    const planter = this.chars.find((c) => c.team === 'T') ?? this.chars[0];
    for (const c of this.chars) {
      if (!c.alive) continue;
      const d = Math.hypot(c.pos.x - bomb.pos.x, c.pos.y + 1 - bomb.pos.y, c.pos.z - bomb.pos.z);
      let dmg = 500 * Math.exp(-((d / 14) ** 2));
      if (c.armor > 0) dmg *= 0.8;
      if (dmg >= 1) this.applyRawDamage(c, planter, Math.round(dmg), 'bomb');
    }
  }

  // ------------------------------------------------------------------ control
  /** Spectator takeover of a living teammate bot. */
  takeOver(id: number): boolean {
    const c = this.chars[id];
    const me = this.player;
    if (!c || !c.alive || c.team !== me.team || this.controlled.alive) return false;
    this.chars[this.controlledId].isBot = this.controlledId !== this.playerId;
    this.controlledId = id;
    c.isBot = false;
    c.input = emptyInput();
    return true;
  }

  aliveCount(team: Team): number {
    let n = 0;
    for (const c of this.chars) if (c.alive && c.team === team) n++;
    return n;
  }

  weaponName(id: WeaponId) {
    return WEAPONS[id].name;
  }

  eyeHeight() {
    return BODY.eyeHeight;
  }
}
