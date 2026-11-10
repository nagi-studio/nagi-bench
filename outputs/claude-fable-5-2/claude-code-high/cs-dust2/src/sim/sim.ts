// Simulation core. Owns the world, the ten actors, round state and team tactics, and advances
// everything with a fixed time step. It has no rendering, audio or DOM dependencies: the outside
// world observes it through plain state plus the `events` queue.

import { Actor, Team, rayActor, resetInput, stepMovement } from './actor';
import { BotBrain } from './bot';
import { CollisionWorld } from './collision';
import { MapData, buildMap } from './map';
import { RNG, Vec3, angleDiff, clamp, dirFromAngles, dist3D, v3, yawTo } from './math';
import { NavGrid } from './nav';
import { RoundManager, WinReason } from './round';
import { Spot, TeamTactics } from './tactics';
import { HitZone, Slot, WeaponDef, WeaponId, WEAPONS, ZONE_MULT, applyArmor } from './weapons';

export type GameMode = 'match' | 'pistol' | 'rifle';

export interface SimOptions {
  humanTeam: Team;
  mode: GameMode;
  /** 0 easy, 1 normal, 2 hard */
  difficulty: number;
  seed?: number;
  /** Headless tests: every actor is a bot. */
  noHuman?: boolean;
}

export type BombEventKind = 'pickup' | 'drop' | 'plantStart' | 'planted' | 'defuseStart' | 'defused' | 'exploded' | 'beep';

export type SimEvent =
  | {
      type: 'shot';
      actor: number;
      weapon: WeaponId;
      ox: number;
      oy: number;
      oz: number;
      ex: number;
      ey: number;
      ez: number;
      /** 0 = nothing, 1 = world, 2 = actor */
      hit: number;
      nx: number;
      ny: number;
      nz: number;
    }
  | { type: 'melee'; actor: number; heavy: boolean; hit: boolean }
  | { type: 'hit'; victim: number; attacker: number; zone: HitZone; damage: number; killed: boolean; x: number; y: number; z: number }
  | { type: 'kill'; killer: number; victim: number; weapon: WeaponId | 'c4' | 'fall'; headshot: boolean }
  | { type: 'reload'; actor: number; weapon: WeaponId }
  | { type: 'switch'; actor: number; weapon: WeaponId }
  | { type: 'zoom'; actor: number; level: number }
  | { type: 'dry'; actor: number }
  | { type: 'footstep'; actor: number }
  | { type: 'jump'; actor: number }
  | { type: 'land'; actor: number; speed: number }
  | { type: 'bomb'; kind: BombEventKind; actor: number; x: number; y: number; z: number }
  | { type: 'round'; kind: 'start' | 'live' | 'end' | 'match'; winner?: Team; reason?: WinReason }
  | { type: 'takeover'; actor: number };

export interface TacPoints {
  spawns: Record<Team, Vec3[]>;
  sites: Record<'A' | 'B', { center: Vec3; plant: Vec3[]; post: Spot[]; holds: Spot[] }>;
  midHolds: Spot[];
  routes: Record<'A' | 'B', Record<string, Vec3[]>>;
}

export const TEAM_NAMES: Record<Team, string[]> = {
  atk: ['渡鸦', '灰隼', '山猫', '赤狐', '夜枭'],
  def: ['铁砧', '灯塔', '礁石', '海燕', '锚点'],
};

export const TICK = 1 / 60;

const tmpDir = v3();
const tmpEye = v3();

export class Simulation {
  readonly map: MapData;
  readonly world: CollisionWorld;
  readonly nav: NavGrid;
  readonly rng: RNG;
  readonly actors: Actor[] = [];
  readonly brains: BotBrain[] = [];
  readonly round: RoundManager;
  readonly tactics: Record<Team, TeamTactics>;
  readonly pts: TacPoints;
  options: SimOptions;
  time = 0;
  events: SimEvent[] = [];
  /** Actor currently driven by the human (-1 in headless runs). */
  humanId = -1;
  /** The human's own slot; control returns here at every round start. */
  homeId = -1;
  loadout: { primary: WeaponId | null; secondary: WeaponId | null } = { primary: null, secondary: null };

  private vis = new Uint8Array(100);
  private visCursor = 0;
  private nextTactics = 0;

  constructor(options: SimOptions, map: MapData = buildMap()) {
    this.options = options;
    this.map = map;
    this.rng = new RNG(options.seed ?? (Date.now() & 0xffffff));
    this.world = new CollisionWorld(map.boxes, map.minX, map.minZ, map.maxX, map.maxZ);
    const s0 = map.tac.spawns.atk[0];
    this.nav = new NavGrid(this.world, map.minX, map.minZ, map.maxX, map.maxZ, { x: s0[0], y: 0, z: s0[1] });

    const P = (p: [number, number]): Vec3 => this.nav.project(p[0], p[1], 0);
    const S = (h: { pos: [number, number]; look: [number, number] }): Spot => ({
      pos: P(h.pos),
      look: { x: h.look[0], y: 0, z: h.look[1] },
    });
    const site = (id: 'A' | 'B') => {
      const s = map.tac.sites[id];
      return { center: { x: s.center[0], y: 0, z: s.center[1] }, plant: s.plant.map(P), post: s.post.map(S), holds: s.holds.map(S) };
    };
    const routes = (r: Record<string, [number, number][]>) => {
      const out: Record<string, Vec3[]> = {};
      for (const k of Object.keys(r)) out[k] = r[k].map(P);
      return out;
    };
    this.pts = {
      spawns: { atk: map.tac.spawns.atk.map(P), def: map.tac.spawns.def.map(P) },
      sites: { A: site('A'), B: site('B') },
      midHolds: map.tac.midHolds.map(S),
      routes: { A: routes(map.tac.routes.A), B: routes(map.tac.routes.B) },
    };

    // actors 0-4 attackers, 5-9 defenders; the human takes the first slot of their team
    const teams: Team[] = ['atk', 'def'];
    for (const team of teams) {
      for (let i = 0; i < 5; i++) {
        const id = this.actors.length;
        this.actors.push(new Actor(id, TEAM_NAMES[team][i], team));
      }
    }
    if (!options.noHuman) {
      this.homeId = options.humanTeam === 'atk' ? 0 : 5;
      this.humanId = this.homeId;
      this.actors[this.homeId].isHuman = true;
      this.actors[this.homeId].name = '你';
    }
    this.round = new RoundManager(this);
    this.tactics = { atk: new TeamTactics(this, 'atk'), def: new TeamTactics(this, 'def') };
    for (const a of this.actors) this.brains.push(new BotBrain(this, a));
    this.round.startRound();
  }

  emit(e: SimEvent): void {
    this.events.push(e);
  }

  get human(): Actor | null {
    return this.humanId >= 0 ? this.actors[this.humanId] : null;
  }

  /** Returns control to the human's own actor (called at round start). */
  restoreHuman(): void {
    if (this.homeId < 0) return;
    for (const a of this.actors) a.isHuman = false;
    this.humanId = this.homeId;
    this.actors[this.homeId].isHuman = true;
  }

  /** The (dead) human takes over a living bot teammate. */
  takeOver(id: number): boolean {
    const cur = this.human;
    const next = this.actors[id];
    if (!cur || !next || cur.alive || !next.alive || next.team !== cur.team || next.isHuman) return false;
    cur.isHuman = false;
    next.isHuman = true;
    resetInput(next.input);
    next.prevFire = true; // swallow the click that triggered the takeover
    this.humanId = id;
    this.emit({ type: 'takeover', actor: id });
    return true;
  }

  /** Applies the chosen loadout immediately (only allowed during freeze time of a rifle round). */
  setLoadout(primary: WeaponId | null, secondary: WeaponId | null): void {
    if (primary) this.loadout.primary = primary;
    if (secondary) this.loadout.secondary = secondary;
    const h = this.human;
    if (h && h.alive && !this.round.pistol && this.round.phase === 'freeze') {
      const lo = this.loadout;
      if (lo.primary && (!h.weapons.primary || h.weapons.primary.def.id !== lo.primary)) h.give(lo.primary);
      if (lo.secondary && (!h.weapons.secondary || h.weapons.secondary.def.id !== lo.secondary)) h.give(lo.secondary);
      h.zoom = 0;
      h.reloadEnd = 0;
      h.drawStart = this.time;
      h.drawEnd = this.time + h.def.drawTime * 0.6;
      this.emit({ type: 'switch', actor: h.id, weapon: h.def.id });
    }
  }

  // ------------------------------------------------------------------ visibility
  sees(a: number, b: number): boolean {
    return this.vis[a * 10 + b] === 1;
  }

  private computeSees(a: Actor, e: Actor): boolean {
    const d = dist3D(a.pos, e.pos);
    if (d > 95) return false;
    if (d > 2.2) {
      const yaw = yawTo(a.pos, e.pos);
      const half = a.isHuman ? 1.0 : 1.2;
      if (Math.abs(angleDiff(yaw, a.yaw)) > half) return false;
    }
    a.eye(tmpEye);
    const head = { x: e.pos.x, y: e.pos.y + e.eyeHeight, z: e.pos.z };
    if (this.world.clearLine(tmpEye, head)) return true;
    head.y = e.pos.y + e.height * 0.55;
    return this.world.clearLine(tmpEye, head);
  }

  private updateVisibility(): void {
    // two observers per tick -> every actor refreshes its view about 12 times a second
    for (let k = 0; k < 2; k++) {
      const a = this.actors[this.visCursor];
      this.visCursor = (this.visCursor + 1) % this.actors.length;
      for (const e of this.actors) {
        if (e.team === a.team) continue;
        const s = a.alive && e.alive && this.computeSees(a, e);
        this.vis[a.id * 10 + e.id] = s ? 1 : 0;
        if (s) e.spottedUntil = this.time + 1.6;
      }
    }
  }

  private noise(src: Actor, kind: 'shot' | 'step'): void {
    for (const b of this.brains) {
      const a = b.actor;
      if (!a.alive || a.isHuman || a.team === src.team) continue;
      b.hear(src.pos, kind);
    }
  }

  // ------------------------------------------------------------------ main tick
  tick(dt: number = TICK): void {
    this.time += dt;
    const now = this.time;
    const round = this.round;
    round.preUpdate();
    if (round.phase === 'matchover') return;
    const frozen = round.phase === 'freeze';

    for (const a of this.actors) {
      a.prevPos.x = a.pos.x;
      a.prevPos.y = a.pos.y;
      a.prevPos.z = a.pos.z;
      a.prevYaw = a.yaw;
      a.prevPitch = a.pitch;
    }
    if (now >= this.nextTactics) {
      this.nextTactics = now + 0.25;
      this.tactics.atk.update();
      this.tactics.def.update();
    }
    for (const a of this.actors) {
      if (a.alive && !a.isHuman) this.brains[a.id].update(dt);
    }
    for (const a of this.actors) {
      if (!a.alive) continue;
      const busy = round.handleUse(a, dt);
      this.updateWeapon(a, dt, frozen || busy);
      const mr = stepMovement(a, this.world, dt, frozen || busy);
      if (mr.jumped) this.emit({ type: 'jump', actor: a.id });
      if (mr.landedSpeed > 5) this.emit({ type: 'land', actor: a.id, speed: mr.landedSpeed });
      if (mr.landedSpeed > 13) {
        // fall damage
        const dmg = Math.round((mr.landedSpeed - 13) * 9);
        a.hp -= dmg;
        this.emit({ type: 'hit', victim: a.id, attacker: -1, zone: 'leg', damage: dmg, killed: a.hp <= 0, x: a.pos.x, y: a.pos.y, z: a.pos.z });
        if (a.hp <= 0) this.kill(a, null, 'fall', false);
      }
      if (mr.footstep) {
        this.emit({ type: 'footstep', actor: a.id });
        this.noise(a, 'step');
      }
      a.prevFire = a.input.fire;
      a.prevFire2 = a.input.fire2;
    }
    this.separate();
    round.postUpdate();
    this.updateVisibility();
  }

  private separate(): void {
    const list = this.actors;
    for (let i = 0; i < list.length; i++) {
      const a = list[i];
      if (!a.alive) continue;
      for (let j = i + 1; j < list.length; j++) {
        const b = list[j];
        if (!b.alive) continue;
        const dx = b.pos.x - a.pos.x;
        const dz = b.pos.z - a.pos.z;
        const d = Math.hypot(dx, dz);
        const min = 0.66;
        if (d >= min || Math.abs(a.pos.y - b.pos.y) > 1.6) continue;
        const push = (min - d) * 0.5;
        let ux = 1;
        let uz = 0;
        if (d > 1e-4) {
          ux = dx / d;
          uz = dz / d;
        }
        this.world.nudge(a, -ux * push, -uz * push);
        this.world.nudge(b, ux * push, uz * push);
      }
    }
  }

  // ------------------------------------------------------------------ weapons
  private switchSlot(a: Actor, slot: Slot): void {
    if (slot === a.active || !a.hasSlot(slot)) return;
    a.lastSlot = a.active;
    a.active = slot;
    a.reloadEnd = 0;
    a.zoom = 0;
    a.rezoomAt = 0;
    a.spread = 0;
    a.shotsFired = 0;
    a.drawStart = this.time;
    a.drawEnd = this.time + a.def.drawTime;
    this.emit({ type: 'switch', actor: a.id, weapon: a.def.id });
  }

  private updateWeapon(a: Actor, dt: number, locked: boolean): void {
    const now = this.time;
    const inp = a.input;
    if (inp.switchTo) this.switchSlot(a, inp.switchTo);
    const w = a.weapon;
    const d = w.def;

    // --- recovery of spread and recoil
    a.spread *= Math.exp(-dt * d.spreadRecover);
    const firingRecently = now - a.lastShotTime < (60 / d.rpm) * 1.5 + 0.06;
    const rate = firingRecently ? 1.5 : 7.5;
    const k = Math.exp(-dt * rate);
    a.punchPitch *= k;
    a.punchYaw *= k;
    if (!firingRecently && a.shotsFired > 0 && now - a.lastShotTime > 0.35) a.shotsFired = 0;

    // --- reload
    if (a.reloadEnd > 0 && now >= a.reloadEnd) {
      const take = Math.min(d.magSize - w.ammo, w.reserve);
      w.ammo += take;
      w.reserve -= take;
      a.reloadEnd = 0;
    }
    const canAct = now >= a.drawEnd && a.reloadEnd === 0;
    if (inp.reload && canAct && d.kind !== 'melee' && w.ammo < d.magSize && w.reserve > 0) this.startReload(a);

    // --- scope
    if (a.rezoomAt > 0 && now >= a.rezoomAt) {
      a.zoom = a.rezoomLevel;
      a.rezoomAt = 0;
    }
    const fire2Edge = inp.fire2 && !a.prevFire2;
    if (d.zoom && fire2Edge && canAct && !locked) {
      a.rezoomAt = 0;
      a.zoom = (a.zoom + 1) % (d.zoom.fovs.length + 1);
      this.emit({ type: 'zoom', actor: a.id, level: a.zoom });
    }
    if (locked) {
      if (a.zoom) a.zoom = 0;
      return;
    }

    // --- fire
    if (d.kind === 'melee') {
      if (now >= a.nextFire && now >= a.drawEnd) {
        if (inp.fire) this.melee(a, false);
        else if (fire2Edge) this.melee(a, true);
      }
      return;
    }
    const wants = inp.fire && (d.auto || !a.prevFire);
    if (wants && canAct && now >= a.nextFire) {
      if (w.ammo > 0) this.shoot(a);
      else {
        if (!a.prevFire) this.emit({ type: 'dry', actor: a.id });
        a.nextFire = now + 0.2;
        if (w.reserve > 0) this.startReload(a);
      }
    }
  }

  private startReload(a: Actor): void {
    const d = a.def;
    a.reloadStart = this.time;
    a.reloadEnd = this.time + d.reloadTime;
    a.zoom = 0;
    a.rezoomAt = 0;
    this.emit({ type: 'reload', actor: a.id, weapon: d.id });
  }

  private shoot(a: Actor): void {
    const now = this.time;
    const w = a.weapon;
    const d = w.def;
    w.ammo--;
    a.nextFire = now + 60 / d.rpm;

    const inacc = a.inaccuracy();
    const yaw = a.yaw + a.punchYaw;
    const pitch = clamp(a.pitch + a.punchPitch, -1.55, 1.55);
    const dir = dirFromAngles(yaw, pitch, tmpDir);
    const cy = Math.cos(yaw);
    const sy = Math.sin(yaw);
    // right = (cy, 0, -sy); up = right x dir
    const ux = sy * dir.y;
    const uy = -sy * dir.x - cy * dir.z;
    const uz = cy * dir.y;
    const ang = this.rng.next() * Math.PI * 2;
    const rad = inacc * Math.sqrt(this.rng.next());
    const ca = Math.cos(ang) * rad;
    const sa = Math.sin(ang) * rad;
    let dx = dir.x + cy * ca + ux * sa;
    let dy = dir.y + uy * sa;
    let dz = dir.z - sy * ca + uz * sa;
    const dl = Math.hypot(dx, dy, dz);
    dx /= dl;
    dy /= dl;
    dz /= dl;

    const eye = a.eye(tmpEye);
    const wall = this.world.raycast(eye.x, eye.y, eye.z, dx, dy, dz, d.range);
    let bestT = wall ? wall.t : d.range;
    let victim: Actor | null = null;
    let zone: HitZone = 'chest';
    for (const e of this.actors) {
      if (!e.alive || e.team === a.team) continue;
      const h = rayActor(e, eye.x, eye.y, eye.z, dx, dy, dz, bestT);
      if (h && h.t < bestT) {
        bestT = h.t;
        victim = e;
        zone = h.zone;
      }
    }
    const ex = eye.x + dx * bestT;
    const ey = eye.y + dy * bestT;
    const ez = eye.z + dz * bestT;
    this.emit({
      type: 'shot',
      actor: a.id,
      weapon: d.id,
      ox: eye.x,
      oy: eye.y,
      oz: eye.z,
      ex,
      ey,
      ez,
      hit: victim ? 2 : wall ? 1 : 0,
      nx: wall ? wall.nx : 0,
      ny: wall ? wall.ny : 0,
      nz: wall ? wall.nz : 0,
    });
    if (victim) this.damage(victim, a, d, d.damage, zone, bestT, ex, ey, ez);

    // --- recoil: the view climbs and wanders; spread blooms
    const idx = a.shotsFired++;
    a.lastShotTime = now;
    const ramp = idx === 0 ? 0.62 : Math.min(1, 0.62 + idx * 0.1);
    a.punchPitch = Math.min(d.recoilMaxPitch, a.punchPitch + d.recoilPitch * ramp);
    const sway = Math.sin(idx * 0.55 + 0.6) * (idx > 3 ? 1 : 0.25);
    a.punchYaw += d.recoilYaw * (sway + (this.rng.next() - 0.5) * 0.9);
    a.spread = Math.min(d.spreadMax, a.spread + d.spreadShot);
    if (d.zoom && a.zoom > 0) {
      // bolt action: the scope drops while the bolt is cycled, then comes back up
      a.rezoomLevel = a.zoom;
      a.zoom = 0;
      a.rezoomAt = now + d.zoom.rezoomDelay;
    }
    this.noise(a, 'shot');
  }

  private melee(a: Actor, heavy: boolean): void {
    const now = this.time;
    const d = a.def;
    const m = d.melee;
    if (!m) return;
    a.nextFire = now + (heavy ? m.heavyInterval : 60 / d.rpm);
    a.lastAttackTime = now;
    a.lastAttackHeavy = heavy;
    const eye = a.eye(tmpEye);
    const range = heavy ? m.range * 0.85 : m.range;
    let victim: Actor | null = null;
    let zone: HitZone = 'chest';
    let bestT = range;
    // a small fan of rays makes the knife forgiving
    const offsets = [0, -0.14, 0.14, -0.28, 0.28];
    for (const off of offsets) {
      const dir = dirFromAngles(a.yaw + off, a.pitch, tmpDir);
      const wall = this.world.raycast(eye.x, eye.y, eye.z, dir.x, dir.y, dir.z, range);
      const lim = wall ? Math.min(wall.t, bestT) : bestT;
      for (const e of this.actors) {
        if (!e.alive || e.team === a.team) continue;
        const h = rayActor(e, eye.x, eye.y, eye.z, dir.x, dir.y, dir.z, lim);
        if (h && h.t < bestT) {
          bestT = h.t;
          victim = e;
          zone = h.zone;
        }
      }
      if (victim) break;
    }
    this.emit({ type: 'melee', actor: a.id, heavy, hit: !!victim });
    if (victim) {
      // knives ignore zone multipliers except for a modest headshot bonus
      const base = heavy ? m.heavyDamage : d.damage;
      this.damage(victim, a, d, zone === 'head' ? base * 0.6 : base / ZONE_MULT[zone], zone, 0, victim.pos.x, victim.pos.y + 1.2, victim.pos.z);
    }
  }

  private damage(victim: Actor, attacker: Actor, d: WeaponDef, base: number, zone: HitZone, dist: number, x: number, y: number, z: number): void {
    const raw = base * ZONE_MULT[zone] * Math.pow(d.rangeMod, dist / 25);
    const res = applyArmor(raw, zone, victim.armor, victim.helmet, d.armorPen);
    victim.armor = Math.max(0, victim.armor - res.armor);
    const dealt = Math.max(1, Math.round(res.health));
    victim.hp -= dealt;
    victim.lastDamageFrom = attacker.id;
    victim.lastDamageTime = this.time;
    // flinch
    victim.punchPitch += 0.012 * (victim.armor > 0 ? 0.4 : 1);
    victim.punchYaw += (this.rng.next() - 0.5) * 0.02;
    const killed = victim.hp <= 0;
    this.emit({ type: 'hit', victim: victim.id, attacker: attacker.id, zone, damage: dealt, killed, x, y, z });
    if (killed) this.kill(victim, attacker, d.id, zone === 'head');
    else if (!victim.isHuman) this.brains[victim.id].onDamaged(attacker);
  }

  kill(victim: Actor, killer: Actor | null, weapon: WeaponId | 'c4' | 'fall', headshot: boolean): void {
    if (!victim.alive) return;
    victim.alive = false;
    victim.hp = 0;
    victim.deaths++;
    victim.deathTime = this.time;
    victim.deathYaw = killer ? yawTo(killer.pos, victim.pos) : victim.yaw;
    victim.zoom = 0;
    victim.reloadEnd = 0;
    victim.useTime = 0;
    victim.vel.x = victim.vel.z = 0;
    resetInput(victim.input);
    if (killer && killer !== victim) {
      killer.kills++;
      // the victim's last words: teammates learn where the killer is
      this.tactics[victim.team].report(killer);
    }
    if (victim.hasBomb) this.round.dropBomb(victim, false);
    this.emit({ type: 'kill', killer: killer ? killer.id : -1, victim: victim.id, weapon, headshot });
  }

  // ------------------------------------------------------------------ queries used by UI / tests
  aliveCount(team: Team): number {
    let n = 0;
    for (const a of this.actors) if (a.alive && a.team === team) n++;
    return n;
  }

  /** Living teammates the dead human could spectate or take over. */
  spectateCandidates(): Actor[] {
    const h = this.actors[this.homeId];
    if (!h) return [];
    return this.actors.filter((a) => a.alive && a.team === h.team);
  }
}

export { WEAPONS };
