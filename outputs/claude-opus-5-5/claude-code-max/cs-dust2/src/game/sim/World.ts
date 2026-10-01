import * as THREE from 'three';
import { BotBrain } from '../ai/BotBrain';
import { TeamAI } from '../ai/TeamAI';
import { PHYS, RULES } from '../core/config';
import { EventBus } from '../core/EventBus';
import { dirFromAngles, yawFromDir } from '../core/math';
import { Random } from '../core/Random';
import { otherTeam, type MatchSettings, type RoundEndReason, type SiteId, type Team } from '../core/types';
import { MASK_MOVE } from '../world/Collision';
import { Level } from '../world/Level';
import { DUST2 } from '../world/MapData';
import {
  BUYABLE_PRIMARY,
  BUYABLE_SECONDARY,
  DEFAULT_PISTOL,
  DEFAULT_RIFLE,
  WEAPONS,
  WeaponInstance,
  type WeaponId,
  type WeaponSlot,
} from '../weapons/WeaponDefs';
import { Actor } from './Actor';
import { applyDamage, bestSlot, switchSlot, updateWeapons } from './Combat';
import type { DamageSource, GameEvents } from './Events';
import { updateMovement } from './Movement';

export type RoundPhase = 'freeze' | 'live' | 'post' | 'over';
export type BombState = 'none' | 'carried' | 'dropped' | 'planted' | 'defused' | 'exploded';

export interface DroppedItem {
  id: number;
  inst: WeaponInstance;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  yaw: number;
  resting: boolean;
  time: number;
}

export interface BombInfo {
  state: BombState;
  carrier: Actor | null;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  resting: boolean;
  site: SiteId | null;
  timeLeft: number;
  defuser: Actor | null;
  nextBeep: number;
  plantedBy: Actor | null;
}

export interface IntelEntry {
  x: number;
  y: number;
  z: number;
  time: number;
}

export interface WorldOptions {
  /** If false every slot is a bot (headless soak tests / attract mode). */
  humanControlled: boolean;
  seed?: number;
}

const BOT_NAMES: Record<Team, string[]> = {
  CT: ['Hawk', 'Viper', 'Falcon', 'Shield', 'Ranger', 'Bishop'],
  T: ['Cobra', 'Jackal', 'Rook', 'Ghost', 'Mamba', 'Scorpion'],
};

const _v = new THREE.Vector3();
const _eye = new THREE.Vector3();
const _head = new THREE.Vector3();

/**
 * The authoritative game state and fixed-step simulation ("global state engine"):
 * actors, weapons, bomb, rounds, spotting/intel and AI. Rendering, audio and UI only observe it
 * through its public state and the event bus.
 */
export class World {
  readonly events = new EventBus<GameEvents>();
  readonly level: Level;
  readonly rng: Random;
  readonly actors: Actor[] = [];
  readonly settings: MatchSettings;
  readonly options: WorldOptions;
  time = 0;

  // ---- round state
  phase: RoundPhase = 'freeze';
  roundNumber = 0;
  readonly score: Record<Team, number> = { CT: 0, T: 0 };
  phaseEndsAt = 0;
  roundEndsAt = 0;
  isPistolRound = false;
  lastWinner: Team | null = null;
  lastReason: RoundEndReason | null = null;
  matchWinner: Team | null = null;
  readonly history: { winner: Team; reason: RoundEndReason }[] = [];

  // ---- objects
  readonly bomb: BombInfo = {
    state: 'none',
    carrier: null,
    pos: new THREE.Vector3(),
    vel: new THREE.Vector3(),
    resting: true,
    site: null,
    timeLeft: 0,
    defuser: null,
    nextBeep: 0,
    plantedBy: null,
  };
  readonly dropped: DroppedItem[] = [];
  private nextItemId = 1;

  // ---- control
  readonly human: Actor;
  /** Actor currently driven by the human (null while dead/spectating). */
  controlled: Actor | null = null;
  readonly humanLoadout: { primary: WeaponId | null; secondary: WeaponId | null } = { primary: null, secondary: null };

  // ---- AI & perception
  readonly teamAI: Record<Team, TeamAI>;
  /** vis[observer.id][target.id] — refreshed every 100 ms. */
  readonly vis: boolean[][];
  readonly intel: Record<Team, Map<number, IntelEntry>> = { CT: new Map(), T: new Map() };
  private nextVisibility = 0;

  constructor(settings: MatchSettings, options: WorldOptions = { humanControlled: true }) {
    this.settings = settings;
    this.options = options;
    this.rng = new Random(options.seed ?? (Date.now() & 0xffffffff));
    this.level = new Level(DUST2);

    let id = 0;
    let human: Actor | null = null;
    for (const team of ['CT', 'T'] as Team[]) {
      const names = this.rng.shuffle([...BOT_NAMES[team]]);
      for (let i = 0; i < 5; i++) {
        const isHuman = team === settings.playerTeam && i === 0;
        const a = new Actor(id++, isHuman ? settings.playerName || '玩家' : names[i], team, isHuman);
        a.brain = new BotBrain(this, a, settings.difficulty);
        this.actors.push(a);
        if (isHuman) human = a;
      }
    }
    this.human = human!;
    this.vis = this.actors.map(() => this.actors.map(() => false));
    this.teamAI = { CT: new TeamAI(this, 'CT'), T: new TeamAI(this, 'T') };
    this.startRound();
  }

  get collision() {
    return this.level.collision;
  }

  get nav() {
    return this.level.nav;
  }

  // ================================================================== main tick

  tick(dt: number): void {
    this.time += dt;
    this.updateRoundPhase();
    if (this.phase === 'over') return;
    const frozen = this.phase === 'freeze';

    for (const a of this.actors) {
      a.prevPos.copy(a.pos);
      a.prevYaw = a.yaw;
      a.prevPitch = a.pitch;
    }

    this.teamAI.CT.update();
    this.teamAI.T.update();
    for (const a of this.actors) {
      if (a.alive && a.isBot && a.brain) a.brain.update(dt);
    }

    for (const a of this.actors) {
      if (!a.alive) continue;
      this.updateItemsFor(a);
      updateWeapons(this, a, dt, !frozen);
      updateMovement(this, a, dt, frozen);
      const inp = a.input;
      inp.firePressed = false;
      inp.altPressed = false;
      inp.reload = false;
      inp.usePressed = false;
      inp.slot = null;
      inp.lastWeapon = false;
      inp.drop = false;
    }

    this.separateActors();
    this.updateBomb(dt);
    this.updateDropped(dt);

    if (this.time >= this.nextVisibility) {
      this.nextVisibility = this.time + 0.1;
      this.updateVisibility();
    }

    for (const a of this.actors) {
      a.model.advance(dt, Math.hypot(a.vel.x, a.vel.z), a.onGround);
      this.poseActor(a, a.pos, a.yaw, a.pitch);
      a.model.updateHitboxes();
    }

    this.checkRoundEnd();
  }

  /** Apply the character pose for an arbitrary (possibly interpolated) transform. */
  poseActor(a: Actor, pos: THREE.Vector3, yaw: number, pitch: number): void {
    const reload = a.reloading ? (this.time - a.reloadStart) / Math.max(0.01, a.reloadEnd - a.reloadStart) : -1;
    a.model.setWeapon(a.alive ? a.weaponId : null);
    a.model.pose({
      x: pos.x,
      y: pos.y,
      z: pos.z,
      yaw,
      pitch,
      vx: a.vel.x,
      vz: a.vel.z,
      onGround: a.onGround,
      crouch: a.crouchAmt,
      alive: a.alive,
      deadFor: this.time - a.deathTime,
      fallDir: a.fallDir,
      fallSide: a.fallSide,
      reload,
      kick: a.kick,
      busy: a.planting || a.defusing,
    });
  }

  // ================================================================== rounds

  startRound(): void {
    this.roundNumber++;
    this.isPistolRound = this.roundNumber === 1 && this.settings.firstRound === 'pistol';
    this.dropped.length = 0;
    const b = this.bomb;
    b.state = 'none';
    b.carrier = null;
    b.site = null;
    b.defuser = null;
    b.plantedBy = null;
    b.timeLeft = 0;
    this.intel.CT.clear();
    this.intel.T.clear();

    const def = this.level.def;
    const spawns: Record<Team, [number, number][]> = {
      CT: this.rng.shuffle([...def.spawns.CT]),
      T: this.rng.shuffle([...def.spawns.T]),
    };
    const counters: Record<Team, number> = { CT: 0, T: 0 };
    const sniper: Record<Team, Actor | null> = { CT: null, T: null };
    if (!this.isPistolRound) {
      for (const team of ['CT', 'T'] as Team[]) {
        if (this.rng.chance(0.65)) {
          const bots = this.actors.filter((a) => a.team === team && !a.isHumanSlot);
          sniper[team] = this.rng.pick(bots);
        }
      }
    }

    for (const a of this.actors) {
      a.resetForRound();
      const [sx, sz] = spawns[a.team][counters[a.team]++ % spawns[a.team].length];
      const gy = this.level.groundAt(sx, sz);
      a.pos.set(sx, gy, sz);
      a.prevPos.copy(a.pos);
      const look = def.spawnLook[a.team];
      a.yaw = yawFromDir(look[0] - sx, look[1] - sz);
      a.pitch = 0;
      a.prevYaw = a.yaw;
      a.prevPitch = 0;
      a.isBot = !(a.isHumanSlot && this.options.humanControlled);
      this.giveLoadout(a, sniper[a.team] === a);
      a.brain?.resetForRound();
    }
    this.controlled = this.options.humanControlled ? this.human : null;

    const ts = this.actors.filter((a) => a.team === 'T');
    const carrier = this.rng.pick(ts);
    carrier.give('c4');
    b.state = 'carried';
    b.carrier = carrier;
    b.pos.copy(carrier.pos);

    this.phase = 'freeze';
    this.phaseEndsAt = this.time + RULES.freezeTime;
    this.roundEndsAt = this.phaseEndsAt + RULES.roundTime;
    this.teamAI.CT.onRoundStart();
    this.teamAI.T.onRoundStart();
    for (const a of this.actors) {
      a.model.advance(0, 0, true);
      this.poseActor(a, a.pos, a.yaw, a.pitch);
      a.model.updateHitboxes();
    }
    this.events.emit('roundStart', { round: this.roundNumber, pistol: this.isPistolRound });
  }

  private giveLoadout(a: Actor, awp: boolean): void {
    a.give('knife');
    const human = a.isHumanSlot && this.options.humanControlled;
    let pistol = DEFAULT_PISTOL[a.team];
    if (human && this.humanLoadout.secondary && !this.isPistolRound) pistol = this.humanLoadout.secondary;
    a.give(pistol);
    if (this.isPistolRound) {
      const kevlar = this.settings.pistolArmor === 'kevlar';
      a.armor = kevlar ? 100 : 0;
      a.helmet = false;
      a.hasKit = false;
    } else {
      a.armor = 100;
      a.helmet = true;
      a.hasKit = a.team === 'CT';
      let primary: WeaponId = DEFAULT_RIFLE[a.team];
      if (human && this.humanLoadout.primary) primary = this.humanLoadout.primary;
      else if (awp) primary = 'awp';
      a.give(primary);
    }
    a.slot = bestSlot(a);
    a.lastSlot = a.weapons[1] && a.slot !== 1 ? 1 : 2;
    a.drawEnd = this.time + 0.3;
  }

  /** Free buy menu (no economy): only during freeze time / first 20 s, pistols only in a pistol round. */
  canBuy(): boolean {
    return this.phase === 'freeze' || (this.phase === 'live' && this.time - this.phaseEndsAt < 20 && this.roundEndsAt - this.time > RULES.roundTime - 20);
  }

  buy(a: Actor, id: WeaponId): boolean {
    if (!a.alive || !this.canBuy()) return false;
    const def = WEAPONS[id];
    if (def.slot === 0 && (this.isPistolRound || !BUYABLE_PRIMARY.includes(id))) return false;
    if (def.slot === 1 && !BUYABLE_SECONDARY.includes(id)) return false;
    if (def.slot > 1) return false;
    a.weapons[def.slot] = new WeaponInstance(def);
    if (a.isHumanSlot) {
      if (def.slot === 0) this.humanLoadout.primary = id;
      else this.humanLoadout.secondary = id;
    }
    a.slot = 2 as WeaponSlot;
    switchSlot(this, a, def.slot);
    return true;
  }

  buyArmor(a: Actor): boolean {
    if (!a.alive || !this.canBuy()) return false;
    a.armor = 100;
    if (!this.isPistolRound) a.helmet = true;
    return true;
  }

  private updateRoundPhase(): void {
    if (this.phase === 'freeze' && this.time >= this.phaseEndsAt) {
      this.phase = 'live';
      this.events.emit('roundLive', { round: this.roundNumber });
    } else if (this.phase === 'post' && this.time >= this.phaseEndsAt) {
      if (this.matchWinner) {
        this.phase = 'over';
        this.events.emit('matchEnd', { winner: this.matchWinner });
      } else {
        this.startRound();
      }
    }
  }

  private checkRoundEnd(): void {
    if (this.phase !== 'live') return;
    let tAlive = 0;
    let ctAlive = 0;
    for (const a of this.actors) {
      if (!a.alive) continue;
      if (a.team === 'T') tAlive++;
      else ctAlive++;
    }
    const planted = this.bomb.state === 'planted';
    if (ctAlive === 0) this.endRound('T', 'ct_eliminated');
    else if (!planted && tAlive === 0) this.endRound('CT', 't_eliminated');
    else if (!planted && this.time >= this.roundEndsAt) this.endRound('CT', 'time_expired');
  }

  endRound(winner: Team, reason: RoundEndReason): void {
    if (this.phase !== 'live') return;
    this.phase = 'post';
    this.phaseEndsAt = this.time + RULES.postRoundTime;
    this.score[winner]++;
    this.lastWinner = winner;
    this.lastReason = reason;
    this.history.push({ winner, reason });
    if (this.score[winner] >= this.settings.roundsToWin) this.matchWinner = winner;
    this.events.emit('roundEnd', { winner, reason });
  }

  /** Seconds left on the round clock (or bomb timer once planted). */
  get clock(): number {
    if (this.phase === 'freeze') return Math.max(0, this.phaseEndsAt - this.time);
    if (this.phase === 'live') {
      if (this.bomb.state === 'planted') return Math.max(0, this.bomb.timeLeft);
      return Math.max(0, this.roundEndsAt - this.time);
    }
    if (this.phase === 'post') return Math.max(0, this.phaseEndsAt - this.time);
    return 0;
  }

  /** Round seconds elapsed since freeze time ended. */
  get roundElapsed(): number {
    return this.phase === 'freeze' ? 0 : this.time - (this.roundEndsAt - RULES.roundTime);
  }

  /** Round clock seconds remaining (ignores the bomb). */
  get roundTimeLeft(): number {
    return Math.max(0, this.roundEndsAt - this.time);
  }

  aliveCount(team: Team): number {
    let n = 0;
    for (const a of this.actors) if (a.alive && a.team === team) n++;
    return n;
  }

  // ================================================================== deaths & items

  killActor(victim: Actor, killer: Actor | null, source: DamageSource, headshot: boolean, dir?: THREE.Vector3): void {
    if (!victim.alive) return;
    victim.alive = false;
    victim.health = 0;
    victim.deathTime = this.time;
    if (victim.planting) this.abortPlant(victim);
    if (this.bomb.defuser === victim) this.abortDefuse(victim);
    victim.reloading = false;
    victim.scopeLevel = 0;
    // fall away from the shot
    if (dir) {
      const f = dirFromAngles(victim.yaw, 0, _v);
      victim.fallDir = f.x * dir.x + f.z * dir.z < 0 ? 1 : -1;
    } else victim.fallDir = 1;
    victim.fallSide = this.rng.range(-1, 1);

    // drop best gun and the bomb
    if (victim.weapons[0]) this.dropWeapon(victim, 0, false);
    else if (victim.weapons[1]) this.dropWeapon(victim, 1, false);
    if (victim.weapons[3]) this.dropWeapon(victim, 3, false);

    victim.deaths++;
    if (killer && killer !== victim && killer.team !== victim.team) {
      killer.kills++;
      killer.roundKills++;
      if (headshot) killer.headshots++;
    }
    this.events.emit('kill', { killer, victim, weapon: source, headshot });
    if (this.controlled === victim) this.controlled = null;
  }

  dropWeapon(a: Actor, slot: WeaponSlot, thrown: boolean): void {
    const inst = a.weapons[slot];
    if (!inst || slot === 2) return;
    a.weapons[slot] = null;
    a.eyePos(_eye);
    const vel = new THREE.Vector3();
    if (thrown) dirFromAngles(a.yaw, Math.max(a.pitch, -0.2) + 0.25, vel).multiplyScalar(4.5);
    else vel.set(this.rng.range(-0.6, 0.6), 1, this.rng.range(-0.6, 0.6));
    vel.x += a.vel.x * 0.5;
    vel.z += a.vel.z * 0.5;
    const start = new THREE.Vector3(a.pos.x, a.pos.y + (a.alive ? 1.3 : 0.6), a.pos.z);
    if (slot === 3) {
      const b = this.bomb;
      b.state = 'dropped';
      b.carrier = null;
      b.pos.copy(start);
      b.vel.copy(vel);
      b.resting = false;
      if (a.planting) this.abortPlant(a);
      this.events.emit('bombDrop', { actor: a, pos: b.pos.clone() });
    } else {
      this.dropped.push({ id: this.nextItemId++, inst, pos: start, vel, yaw: a.yaw + Math.PI / 2, resting: false, time: this.time });
      this.events.emit('weaponDrop', { actor: a, weapon: inst.def.id });
    }
    if (a.alive && a.slot === slot) {
      a.slot = bestSlot(a);
      a.drawEnd = this.time + a.weapons[a.slot]!.def.drawTime;
      a.reloading = false;
      a.scopeLevel = 0;
      this.events.emit('draw', { actor: a, weapon: a.weapons[a.slot]!.def.id });
    }
  }

  private updateItemsFor(a: Actor): void {
    const inp = a.input;
    if (inp.drop && a.slot !== 2) this.dropWeapon(a, a.slot, true);

    // auto-pickup of guns into empty slots, E to swap the looked-at gun
    for (let i = this.dropped.length - 1; i >= 0; i--) {
      const it = this.dropped[i];
      if (this.time - it.time < 0.6) continue;
      const dx = it.pos.x - a.pos.x;
      const dz = it.pos.z - a.pos.z;
      const dy = it.pos.y - a.pos.y;
      const d2 = dx * dx + dz * dz;
      if (dy < -0.5 || dy > 1.8) continue;
      const slot = it.inst.def.slot;
      if (d2 < 1.0 && !a.weapons[slot]) {
        this.pickup(a, i);
      } else if (inp.usePressed && !a.isBot && d2 < 2.6 * 2.6) {
        const f = dirFromAngles(a.yaw, 0, _v);
        const len = Math.sqrt(d2) || 1;
        if ((f.x * dx + f.z * dz) / len > 0.6) {
          this.dropWeapon(a, slot, true);
          this.pickup(a, i);
          inp.usePressed = false;
        }
      }
    }
  }

  private pickup(a: Actor, index: number): void {
    const it = this.dropped[index];
    this.dropped.splice(index, 1);
    const slot = it.inst.def.slot;
    a.weapons[slot] = it.inst;
    this.events.emit('pickup', { actor: a, weapon: it.inst.def.id });
    if (slot === 0 || (slot === 1 && !a.weapons[0])) {
      if (a.slot !== slot) switchSlot(this, a, slot);
    }
  }

  private updateDropped(dt: number): void {
    for (const it of this.dropped) this.itemPhysics(it.pos, it.vel, dt, it);
    if (this.bomb.state === 'dropped') {
      this.itemPhysics(this.bomb.pos, this.bomb.vel, dt, this.bomb);
    }
  }

  private itemPhysics(pos: THREE.Vector3, vel: THREE.Vector3, dt: number, holder: { resting: boolean }): void {
    if (holder.resting) return;
    vel.y -= PHYS.gravity * dt;
    const nx = pos.x + vel.x * dt;
    const nz = pos.z + vel.z * dt;
    if (this.collision.overlapsBox(nx - 0.12, pos.y + 0.05, nz - 0.12, nx + 0.12, pos.y + 0.3, nz + 0.12, MASK_MOVE)) {
      vel.x *= -0.25;
      vel.z *= -0.25;
    } else {
      pos.x = nx;
      pos.z = nz;
    }
    const ground = this.collision.groundHeight(pos.x, pos.z, pos.y + 0.3, 0.12);
    pos.y += vel.y * dt;
    if (pos.y <= ground) {
      pos.y = ground;
      if (Math.abs(vel.y) < 2) {
        vel.set(0, 0, 0);
        holder.resting = true;
      } else {
        vel.y *= -0.25;
        vel.x *= 0.5;
        vel.z *= 0.5;
      }
    }
    if (pos.y < -30) {
      pos.y = 0;
      holder.resting = true;
    }
  }

  // ================================================================== bomb

  private updateBomb(dt: number): void {
    const b = this.bomb;
    if (b.state === 'carried' && b.carrier) {
      b.pos.copy(b.carrier.pos);
      this.handlePlanting(b.carrier, dt);
    } else if (b.state === 'dropped') {
      for (const a of this.actors) {
        if (!a.alive || a.team !== 'T') continue;
        const dx = a.pos.x - b.pos.x;
        const dz = a.pos.z - b.pos.z;
        const dy = b.pos.y - a.pos.y;
        if (dx * dx + dz * dz < RULES.pickupDistance * RULES.pickupDistance && dy > -0.6 && dy < 1.6) {
          a.give('c4');
          b.state = 'carried';
          b.carrier = a;
          this.events.emit('bombPickup', { actor: a });
          break;
        }
      }
    } else if (b.state === 'planted') {
      b.timeLeft -= dt;
      if (this.time >= b.nextBeep) {
        const frac = Math.max(0, b.timeLeft / RULES.bombTimer);
        const interval = Math.max(0.1, 0.1 + 0.95 * Math.pow(frac, 1.4));
        b.nextBeep = this.time + interval;
        this.events.emit('bombBeep', { pos: b.pos, urgency: 1 - frac });
      }
      this.handleDefuse(dt);
      if (b.timeLeft <= 0 && b.state === 'planted') this.explode();
    }
  }

  private handlePlanting(c: Actor, dt: number): void {
    const inp = c.input;
    const wants = c.alive && this.phase === 'live' && (inp.use || (c.slot === 3 && inp.fire));
    const site = this.level.bombsiteAt(c.pos.x, c.pos.z);
    if (wants && site && c.onGround) {
      if (!c.planting) {
        if (c.slot !== 3) switchSlot(this, c, 3);
        c.planting = true;
        c.plantProgress = 0;
        this.events.emit('plantStart', { actor: c });
      }
      c.plantProgress += dt;
      if (c.plantProgress >= RULES.plantTime) this.plant(c, site.id);
    } else if (c.planting) {
      this.abortPlant(c);
    }
  }

  abortPlant(a: Actor): void {
    if (!a.planting) return;
    a.planting = false;
    a.plantProgress = 0;
    this.events.emit('plantAbort', { actor: a });
  }

  private plant(c: Actor, site: SiteId): void {
    const b = this.bomb;
    c.planting = false;
    c.plantProgress = 0;
    c.weapons[3] = null;
    if (c.slot === 3) {
      c.slot = bestSlot(c);
      c.drawEnd = this.time + 0.5;
      this.events.emit('draw', { actor: c, weapon: c.weapons[c.slot]!.def.id });
    }
    b.state = 'planted';
    b.site = site;
    b.carrier = null;
    b.plantedBy = c;
    const f = dirFromAngles(c.yaw, 0, _v);
    b.pos.set(c.pos.x + f.x * 0.45, c.pos.y, c.pos.z + f.z * 0.45);
    b.pos.y = this.level.groundAt(b.pos.x, b.pos.z, c.pos.y + 0.5);
    if (!Number.isFinite(b.pos.y)) b.pos.y = c.pos.y;
    b.timeLeft = RULES.bombTimer;
    b.nextBeep = this.time + 1;
    this.events.emit('bombPlanted', { actor: c, site, pos: b.pos.clone() });
  }

  private defuseDuration(a: Actor): number {
    return a.hasKit ? RULES.defuseKitTime : RULES.defuseTime;
  }

  private handleDefuse(dt: number): void {
    const b = this.bomb;
    const d = b.defuser;
    if (d) {
      if (!d.alive || !d.input.use || !this.inBombReach(d)) {
        this.abortDefuse(d);
      } else {
        d.defuseProgress += dt;
        if (d.defuseProgress >= this.defuseDuration(d)) {
          d.defusing = false;
          b.state = 'defused';
          b.defuser = null;
          this.events.emit('bombDefused', { actor: d });
          this.endRound('CT', 'bomb_defused');
        }
      }
      return;
    }
    for (const a of this.actors) {
      if (!a.alive || a.team !== 'CT' || !a.input.use || !a.onGround) continue;
      if (!this.inBombReach(a)) continue;
      b.defuser = a;
      a.defusing = true;
      a.defuseProgress = 0;
      a.reloading = false;
      a.scopeLevel = 0;
      this.events.emit('defuseStart', { actor: a, kit: a.hasKit });
      break;
    }
  }

  inBombReach(a: Actor): boolean {
    const b = this.bomb;
    const dx = a.pos.x - b.pos.x;
    const dz = a.pos.z - b.pos.z;
    const dy = b.pos.y - a.pos.y;
    return dx * dx + dz * dz <= RULES.useDistance * RULES.useDistance && dy > -1.2 && dy < 1.2;
  }

  private abortDefuse(a: Actor): void {
    a.defusing = false;
    a.defuseProgress = 0;
    if (this.bomb.defuser === a) this.bomb.defuser = null;
    this.events.emit('defuseAbort', { actor: a });
  }

  private explode(): void {
    const b = this.bomb;
    b.state = 'exploded';
    if (b.defuser) this.abortDefuse(b.defuser);
    this.events.emit('bombExploded', { pos: b.pos.clone() });
    const sigma = RULES.bombSigma;
    for (const a of this.actors) {
      if (!a.alive) continue;
      _v.set(a.pos.x, a.pos.y + 1, a.pos.z).sub(b.pos);
      const d = _v.length();
      const dmg = RULES.bombMaxDamage * Math.exp(-(d * d) / (2 * sigma * sigma));
      if (dmg < 1) continue;
      const dir = _v.clone().normalize();
      applyDamage(this, a, null, dmg, null, null, a.pos, dir, 'c4');
    }
    this.endRound('T', 'bomb_exploded');
  }

  // ================================================================== perception

  private updateVisibility(): void {
    const n = this.actors.length;
    for (let i = 0; i < n; i++) {
      const o = this.actors[i];
      for (let j = 0; j < n; j++) this.vis[i][j] = false;
      if (!o.alive) continue;
      const humanView = !o.isBot;
      const fovHalf = humanView ? 1.0 : o.brain ? o.brain.fovHalf : 1.05;
      o.eyePos(_eye);
      for (let j = 0; j < n; j++) {
        const t = this.actors[j];
        if (!t.alive || t.team === o.team) continue;
        if (this.canSee(o, t, _eye, fovHalf)) {
          this.vis[i][j] = true;
          t.spottedUntil[o.team] = this.time + 0.4;
          const e = this.intel[o.team].get(t.id);
          if (e) {
            e.x = t.pos.x;
            e.y = t.pos.y;
            e.z = t.pos.z;
            e.time = this.time;
          } else this.intel[o.team].set(t.id, { x: t.pos.x, y: t.pos.y, z: t.pos.z, time: this.time });
        }
      }
    }
    for (const team of ['CT', 'T'] as Team[]) {
      for (const [id] of this.intel[team]) {
        const a = this.actors[id];
        if (!a.alive) this.intel[team].delete(id);
      }
    }
  }

  canSee(o: Actor, t: Actor, eye: THREE.Vector3, fovHalf: number): boolean {
    const dx = t.pos.x - eye.x;
    const dz = t.pos.z - eye.z;
    const d2 = dx * dx + dz * dz;
    if (d2 > 130 * 130) return false;
    if (d2 > 2.5 * 2.5) {
      const yawTo = yawFromDir(dx, dz);
      let diff = Math.abs(yawTo - o.yaw) % (Math.PI * 2);
      if (diff > Math.PI) diff = Math.PI * 2 - diff;
      if (diff > fovHalf) return false;
    }
    const col = this.collision;
    t.model.headWorld(_head);
    if (col.lineClear(eye.x, eye.y, eye.z, _head.x, _head.y, _head.z)) return true;
    const chestY = t.pos.y + 1.2 - t.crouchAmt * 0.35;
    if (col.lineClear(eye.x, eye.y, eye.z, t.pos.x, chestY, t.pos.z)) return true;
    return col.lineClear(eye.x, eye.y, eye.z, t.pos.x, t.pos.y + 0.45, t.pos.z);
  }

  /** Visible to observer as of the last perception pass. */
  sees(o: Actor, t: Actor): boolean {
    return this.vis[o.id][t.id];
  }

  /** Is this enemy currently shown on `team`'s radar. */
  isSpottedBy(a: Actor, team: Team): boolean {
    return a.alive && a.spottedUntil[team] > this.time;
  }

  footstep(a: Actor): void {
    const p = a.pos.clone();
    this.events.emit('footstep', { actor: a, pos: p, loud: 1 });
    this.noise(a, p, 18);
  }

  /** Propagate an audible event to enemy bots in range. */
  noise(source: Actor, pos: THREE.Vector3, radius: number): void {
    const r2 = radius * radius;
    for (const a of this.actors) {
      if (!a.alive || !a.brain || !a.isBot || a.team === source.team) continue;
      if (a.pos.distanceToSquared(pos) <= r2) a.brain.hear(source, pos);
    }
  }

  // ================================================================== misc

  private separateActors(): void {
    const n = this.actors.length;
    const minD = PHYS.radius * 2;
    for (let i = 0; i < n; i++) {
      const a = this.actors[i];
      if (!a.alive) continue;
      for (let j = i + 1; j < n; j++) {
        const b = this.actors[j];
        if (!b.alive) continue;
        const dx = b.pos.x - a.pos.x;
        const dz = b.pos.z - a.pos.z;
        const dy = b.pos.y - a.pos.y;
        if (Math.abs(dy) > 1.6) continue;
        const d2 = dx * dx + dz * dz;
        if (d2 >= minD * minD) continue;
        const d = Math.sqrt(d2) || 0.01;
        const push = (minD - d) * 0.5;
        const nx = d2 > 1e-6 ? dx / d : 1;
        const nz = d2 > 1e-6 ? dz / d : 0;
        // rooted (planting/defusing) actors are not pushed
        const wa = a.rooted ? 0 : b.rooted ? 1 : 0.5;
        const wb = 1 - wa;
        if (wa > 0) this.collision.nudgeHull(a, -nx * push * wa * 2, -nz * push * wa * 2);
        if (wb > 0) this.collision.nudgeHull(b, nx * push * wb * 2, nz * push * wb * 2);
      }
    }
  }

  /** Hand control of a living teammate bot to the human (spectator takeover). */
  takeOver(a: Actor): boolean {
    if (!a.alive || a.team !== this.human.team || this.controlled) return false;
    a.isBot = false;
    this.controlled = a;
    return true;
  }

  teamOf(team: Team): Actor[] {
    return this.actors.filter((a) => a.team === team);
  }

  enemiesOf(team: Team): Actor[] {
    return this.actors.filter((a) => a.team === otherTeam(team));
  }
}
