/**
 * GameEngine — the authoritative simulation.
 *
 * Owns: map grid + props, 10 combatants, the bomb, round flow, damage,
 * kill feed / hit-marker events and the audio cue dispatch.
 *
 * It is completely framework agnostic: React reads immutable snapshots from
 * it, three.js reads the live objects for rendering.
 */

import { NavGrid } from './map/grid';
import {
  PROPS, REGIONS, SITES, buildDust2Grid, propBlockBoxes, propBoxes, siteAt,
  type Box, type PropDef, type SiteDef,
} from './map/dust2';
import {
  CHARACTER, WEAPONS, armorLossFrom, computeDamage, makeWeaponState, weaponDef,
  type HitBoxId, type Slot, type WeaponDef, type WeaponId, type WeaponState,
} from './weapons';
import {
  JUMP_VELOCITY, accelerate, hasLineOfSight, moveHorizontal, moveVertical, raycastWorld,
  unstickBody, type Body,
} from './physics';
import {
  BOT_NAMES_CT, BOT_NAMES_T, createCombatant, dirFromAngles, eyePosition, gunLoadout,
  pistolLoadout, raycastCombatant, rightVector, spawnPointsFor, makeBrain,
  type Loadout,
} from './entities';
import { updateBot, type AIWorld } from './ai';
import { audio } from './audio';
import { OTHER_TEAM, type Bomb, type BotRole, type Combatant, type HitMarker, type KillEvent, type RoundInfo, type Team } from './types';
import { clamp, dist2D, randRange, TAU } from './mathUtils';

// ---------------------------------------------------------------------------
// Tuning
// ---------------------------------------------------------------------------

export const ROUND_TIME = 115;
export const FREEZE_TIME = 5;
export const OVER_TIME = 5;
export const BOMB_TIMER = 40;
export const PLANT_TIME = 3.5;
export const DEFUSE_TIME = 10;
export const DEFUSE_TIME_KIT = 5;
export const BOMB_PICKUP_RANGE = 1.8;
export const DEFUSE_RANGE = 2.0;

const BASE_SPEED = 4.7;
const MOUSE_SENS = 0.0022;
const TEAM_SIZE = 5;

export interface InputState {
  forward: number;
  strafe: number;
  jump: boolean;
  use: boolean;
  fire: boolean;
  /** consumed once per press */
  firePressed: boolean;
  ads: boolean;
  reload: boolean;
  walk: boolean;
  slotRequest: Slot | null;
  mouseDX: number;
  mouseDY: number;
  cycleSpectate: number;
  takeControl: boolean;
}

export function makeInput(): InputState {
  return {
    forward: 0, strafe: 0, jump: false, use: false, fire: false, firePressed: false,
    ads: false, reload: false, walk: false, slotRequest: null,
    mouseDX: 0, mouseDY: 0, cycleSpectate: 0, takeControl: false,
  };
}

interface NoiseEvent {
  x: number;
  z: number;
  team: Team;
  time: number;
}

// ---------------------------------------------------------------------------
// Snapshots for React
// ---------------------------------------------------------------------------

export interface PlayerSnapshot {
  id: number;
  name: string;
  team: Team;
  alive: boolean;
  health: number;
  armor: number;
  kills: number;
  deaths: number;
  damage: number;
  isHuman: boolean;
  hasBomb: boolean;
  weapon: WeaponId;
  /** on-screen position relative to the local player, null when unknown */
  screen: { x: number; y: number; dist: number; visible: boolean } | null;
}

export interface SelfSnapshot {
  id: number;
  team: Team;
  alive: boolean;
  health: number;
  armor: number;
  helmet: boolean;
  kit: boolean;
  weaponId: WeaponId;
  weaponName: string;
  ammo: number;
  magSize: number;
  reserve: number;
  reloading: boolean;
  reloadProgress: number;
  slot: Slot;
  hasPrimary: boolean;
  hasSecondary: boolean;
  spread: number;
  ads: boolean;
  adsAmount: number;
  scoped: boolean;
  hasBomb: boolean;
  canPlant: boolean;
  canDefuse: boolean;
  plantProgress: number;
  defuseProgress: number;
  speed: number;
  onGround: boolean;
  kills: number;
  deaths: number;
  damage: number;
  hitFlash: number;
  hitFromAngle: number;
}

export interface Snapshot {
  time: number;
  round: RoundInfo;
  bomb: {
    state: Bomb['state'];
    x: number;
    z: number;
    timer: number;
    site: 'A' | 'B' | null;
    plantProgress: number;
    defuseProgress: number;
  };
  self: SelfSnapshot | null;
  players: PlayerSnapshot[];
  killfeed: KillEvent[];
  hitmarker: HitMarker | null;
  spectate: { id: number; name: string; alive: boolean } | null;
  banner: string | null;
  aliveCT: number;
  aliveT: number;
  attackSite: 'A' | 'B';
  scoreLimit: number;
}

// ---------------------------------------------------------------------------
// Engine
// ---------------------------------------------------------------------------

export class GameEngine {
  readonly grid: NavGrid;
  readonly props: PropDef[] = PROPS;
  readonly blockBoxes: Box[] = propBlockBoxes();
  readonly collideBoxes: Box[] = propBoxes();
  readonly regions = REGIONS;
  readonly sites: SiteDef[] = SITES;

  combatants: Combatant[] = [];
  bomb: Bomb = {
    state: 'carried', carrier: null, x: 0, z: 0, site: null,
    timer: 0, plantProgress: 0, defuseProgress: 0, planterId: null, defuserId: null,
  };

  round: RoundInfo = {
    number: 1, phase: 'freeze', timeLeft: FREEZE_TIME, isPistol: true,
    winner: null, reason: '', scoreCT: 0, scoreT: 0,
  };

  time = 0;
  playerTeam: Team;
  /** combatant currently driven by the human */
  playerId: number;
  /** true while the human is dead and watching someone else */
  spectating = false;
  spectateId: number | null = null;

  attackSite: 'A' | 'B' = 'A';
  killfeed: KillEvent[] = [];
  hitmarkers: HitMarker[] = [];
  noises: NoiseEvent[] = [];
  banner: string | null = null;
  bannerUntil = 0;

  private killSeq = 1;
  private hitSeq = 1;
  private lastBeep = 0;
  private humanLoadout: Loadout;
  humanUse = false;

  /** bullet tracers for the renderer (world space, short lived) */
  tracers: {
    x0: number; y0: number; z0: number;
    x1: number; y1: number; z1: number;
    time: number; weapon: WeaponId;
  }[] = [];

  // Built in the constructor: grid must exist before the AI adapter captures it.
  private aiWorld!: AIWorld;

  constructor(playerTeam: Team = 'CT') {
    this.grid = buildDust2Grid();
    this.playerTeam = playerTeam;
    this.humanLoadout = pistolLoadout(playerTeam);
    this.playerId = 0;
    this.buildTeams();
    this.aiWorld = {
      grid: this.grid,
      blockBoxes: this.blockBoxes,
      collideBoxes: this.collideBoxes,
      combatants: this.combatants,
      bomb: this.bomb,
      time: 0,
      phase: 'live',
      attackSite: 'A',
      lineOfSight: (ax, ay, az, bx, by, bz) => this.los(ax, ay, az, bx, by, bz),
      tryFire: (c) => this.tryFire(c),
      reload: (c) => this.startReload(c),
      defendSpot: (c) => this.defendSpot(c),
      recentEnemyNoise: (c, maxAge, maxDist) => this.recentEnemyNoise(c, maxAge, maxDist),
    };
    this.startRound(1);
  }

  // -- setup ---------------------------------------------------------------

  private buildTeams(): void {
    this.combatants = [];
    const tSpawns = spawnPointsFor('T');
    const ctSpawns = spawnPointsFor('CT');

    let idx = 0;
    // human first so they always get spawn slot 0
    const human = createCombatant(idx, 'YOU', this.playerTeam, true,
      this.playerTeam === 'T' ? tSpawns[0]! : ctSpawns[0]!, this.humanLoadout);
    this.combatants.push(human);
    this.playerId = human.id;
    idx++;

    const tNames = [...BOT_NAMES_T];
    const ctNames = [...BOT_NAMES_CT];
    for (let i = 1; i < TEAM_SIZE; i++) {
      const isT = this.playerTeam === 'T';
      if (isT) {
        const c = createCombatant(idx, tNames.pop() ?? `T-${i}`, 'T', false, tSpawns[i]!, pistolLoadout('T'));
        c.brain = makeBrain('rushA');
        this.combatants.push(c);
      } else {
        const c = createCombatant(idx, ctNames.pop() ?? `CT-${i}`, 'CT', false, ctSpawns[i]!, pistolLoadout('CT'));
        c.brain = makeBrain('anchorA');
        this.combatants.push(c);
      }
      idx++;
    }
    // the opposing five
    for (let i = 0; i < TEAM_SIZE; i++) {
      if (this.playerTeam === 'T') {
        const c = createCombatant(idx, ctNames.pop() ?? `CT-${i}`, 'CT', false, ctSpawns[i]!, pistolLoadout('CT'));
        c.brain = makeBrain('anchorA');
        this.combatants.push(c);
      } else {
        const c = createCombatant(idx, tNames.pop() ?? `T-${i}`, 'T', false, tSpawns[i]!, pistolLoadout('T'));
        c.brain = makeBrain('rushA');
        this.combatants.push(c);
      }
      idx++;
    }
  }

  private assignRoundLoadouts(): void {
    const isPistol = this.round.isPistol;
    this.humanLoadout = isPistol ? pistolLoadout(this.playerTeam) : gunLoadout(this.playerTeam);
    for (const c of this.combatants) {
      const load: Loadout = isPistol ? pistolLoadout(c.team) : gunLoadout(c.team);
      c.health = 100;
      c.alive = true;
      c.armor = load.armor;
      c.helmet = load.helmet;
      c.hasDefuseKit = load.kit;
      c.primaryId = load.primary;
      c.weapons = {
        secondary: makeWeaponState(load.secondary, this.time),
        melee: makeWeaponState('knife', this.time),
      };
      if (load.primary) c.weapons.primary = makeWeaponState(load.primary, this.time);
      c.slot = load.primary ? 'primary' : 'secondary';
      c.spread = 0;
      c.recoilDebt = 0;
      c.recoilPitch = 0;
      c.recoilYaw = 0;
      c.ads = false;
      c.adsAmount = 0;
      c.burstLeft = 0;
      c.plantHold = 0;
      c.defuseHold = 0;
      c.hasBomb = false;
      c.body.vx = 0; c.body.vy = 0; c.body.vz = 0;

      // bot roles
      if (c.brain) {
        c.brain.state = 'advance';
        c.brain.route = [];
        c.brain.routeIndex = 0;
        c.brain.path = [];
        c.brain.pathIndex = 0;
        c.brain.goal = null;
        c.brain.targetId = null;
        c.brain.lastSeenTime = -99;
        c.brain.visible = false;
        c.brain.decisionTimer = 0;
        c.brain.repathTimer = 0;
        c.brain.stuckTimer = 0;
        c.brain.holdSpot = null;
        c.brain.role = this.roleFor(c);
      }
    }
  }

  private roleFor(c: Combatant): BotRole {
    const i = c.id % 5;
    if (c.team === 'T') {
      const a: BotRole[] = this.attackSite === 'A'
        ? ['rushA', 'midTake', 'rushA', 'midTake', 'lurker']
        : ['rushB', 'midTake', 'rushB', 'lurker', 'midTake'];
      return a[i]!;
    }
    const a: BotRole[] = ['anchorA', 'anchorB', 'anchorMid', 'anchorA', 'anchorB'];
    return a[i]!;
  }

  startRound(number: number): void {
    this.round.number = number;
    this.round.isPistol = (number - 1) % 13 === 0;
    this.round.phase = 'freeze';
    this.round.timeLeft = FREEZE_TIME;
    this.round.winner = null;
    this.round.reason = '';
    this.attackSite = Math.random() < 0.5 ? 'A' : 'B';

    const tSpawns = spawnPointsFor('T');
    const ctSpawns = spawnPointsFor('CT');
    let tIdx = 0, ctIdx = 0;
    for (const c of this.combatants) {
      const p = c.team === 'T' ? tSpawns[tIdx++ % tSpawns.length]! : ctSpawns[ctIdx++ % ctSpawns.length]!;
      c.body.x = p.x + randRange(-0.8, 0.8);
      c.body.z = p.z + randRange(-0.8, 0.8);
      c.body.y = 0;
      c.body.vx = 0; c.body.vy = 0; c.body.vz = 0;
      c.body.onGround = true;
      c.yaw = c.team === 'T' ? Math.PI * 0.78 : -Math.PI * 0.28;
      c.pitch = 0;
    }

    this.assignRoundLoadouts();

    // give the bomb to a random T
    const ts = this.combatants.filter((c) => c.team === 'T');
    const carrier = ts[Math.floor(Math.random() * ts.length)]!;
    carrier.hasBomb = true;
    this.bomb = {
      state: 'carried', carrier: carrier.id, x: carrier.body.x, z: carrier.body.z,
      site: null, timer: 0, plantProgress: 0, defuseProgress: 0, planterId: null, defuserId: null,
    };

    this.killfeed = [];
    this.hitmarkers = [];
    this.noises = [];
    this.spectating = false;
    this.spectateId = null;
    this.setBanner(this.round.isPistol ? '手枪局 — 全员仅有默认手枪' : `第 ${number} 回合`, 3.2);
    audio.roundStart(this.round.isPistol);
  }

  private setBanner(text: string, seconds: number): void {
    this.banner = text;
    this.bannerUntil = this.time + seconds;
  }

  // -- queries -------------------------------------------------------------

  byId(id: number): Combatant | null {
    for (const c of this.combatants) if (c.id === id) return c;
    return null;
  }

  get player(): Combatant | null { return this.byId(this.playerId); }

  aliveOf(team: Team): Combatant[] {
    return this.combatants.filter((c) => c.team === team && c.alive);
  }

  los(ax: number, ay: number, az: number, bx: number, by: number, bz: number): boolean {
    return hasLineOfSight(this.grid, this.blockBoxes, ax, ay, az, bx, by, bz);
  }

  effectiveSpread(c: Combatant): number {
    const def = weaponDef(this.currentWeaponId(c));
    const speed = Math.hypot(c.body.vx, c.body.vz);
    let s = def.spread.base + c.spread;
    if (!c.body.onGround) s += def.spread.air;
    else s += def.spread.move * Math.min(speed, 5.5) / 5.5;
    if (def.ads && c.adsAmount > 0.6) s *= 0.22;
    return s;
  }

  currentWeaponId(c: Combatant): WeaponId {
    const ws = c.weapons[c.slot];
    return ws ? ws.id : 'knife';
  }

  currentState(c: Combatant): WeaponState | null {
    return c.weapons[c.slot] ?? null;
  }

  // -- weapon handling -----------------------------------------------------

  startReload(c: Combatant): void {
    const ws = this.currentState(c);
    if (!ws) return;
    const def = weaponDef(ws.id);
    if (def.category === 'melee') return;
    if (ws.reloading) return;
    if (ws.ammo >= def.magSize) return;
    if (ws.reserve <= 0) return;
    ws.reloading = true;
    ws.reloadEnd = this.time + def.reloadTime;
    audio.reload(ws.id, 'out');
    if (c === this.player) {
      setTimeout(() => audio.reload(ws.id, 'in'), def.reloadTime * 500);
    }
  }

  private finishReload(c: Combatant): void {
    const ws = this.currentState(c);
    if (!ws || !ws.reloading) return;
    const def = weaponDef(ws.id);
    const need = def.magSize - ws.ammo;
    const take = Math.min(need, ws.reserve);
    ws.ammo += take;
    ws.reserve -= take;
    ws.reloading = false;
    audio.reload(ws.id, 'done');
  }

  switchSlot(c: Combatant, slot: Slot): boolean {
    if (c.slot === slot) return false;
    if (!c.weapons[slot]) return false;
    const ws = c.weapons[slot]!;
    ws.reloading = false;
    c.slot = slot;
    ws.readyTime = this.time + weaponDef(ws.id).drawTime;
    c.ads = false;
    audio.draw(ws.id);
    return true;
  }

  /** Fire one round. Returns true when a bullet actually left the barrel. */
  fireOneShot(c: Combatant): boolean {
    if (!c.alive) return false;
    if (this.round.phase !== 'live') return false;
    const ws = this.currentState(c);
    if (!ws) return false;
    const def = weaponDef(ws.id);
    if (ws.reloading) return false;
    if (this.time < ws.readyTime) return false;
    if (this.time < ws.nextFireTime) return false;
    if (def.category !== 'melee' && ws.ammo <= 0) {
      if (c === this.player) audio.dryFire();
      ws.nextFireTime = this.time + 0.35;
      return false;
    }

    ws.nextFireTime = this.time + 60 / def.rpm;
    if (!def.auto) ws.nextFireTime = Math.max(ws.nextFireTime, this.time + def.triggerReset);
    if (def.category !== 'melee') ws.ammo--;

    // --- recoil / bloom ---
    const kick = def.recoil.vertical * randRange(0.78, 1.18);
    const side = def.recoil.horizontal * randRange(-1, 1);
    c.pitch = clamp(c.pitch + kick, -1.45, 1.45);
    c.yaw += side;
    c.recoilDebt += kick * def.recoil.returnToZero;
    c.recoilPitch += kick * def.recoil.punch;
    c.spread = Math.min(def.spread.max, c.spread + def.spread.perShot);

    // --- direction ---
    const fwd = dirFromAngles(c.yaw, c.pitch);
    const right = rightVector(c.yaw);
    const spread = this.effectiveSpread(c);
    let dx = fwd.x, dy = fwd.y, dz = fwd.z;
    if (spread > 0) {
      const a = Math.random() * TAU;
      const r = Math.sqrt(Math.random()) * spread;
      const ox = Math.cos(a) * r;
      const oy = Math.sin(a) * r;
      dx += right.x * ox;
      dz += right.z * ox;
      // up vector = forward x right
      const ux = fwd.y * right.z - fwd.z * 0;
      const uy = fwd.z * right.x - fwd.x * right.z;
      const uz = fwd.x * 0 - fwd.y * right.x;
      const ul = Math.hypot(ux, uy, uz) || 1;
      dx += (ux / ul) * oy;
      dy += (uy / ul) * oy;
      dz += (uz / ul) * oy;
      const l = Math.hypot(dx, dy, dz) || 1;
      dx /= l; dy /= l; dz /= l;
    }

    const eye = eyePosition(c);
    const maxRange = def.category === 'melee' ? def.range : 120;

    // --- hit test: world first so we know the wall distance ---
    const wall = raycastWorld(this.grid, this.blockBoxes, eye.x, eye.y, eye.z, dx, dy, dz, maxRange);
    const wallT = wall ? wall.t : maxRange;

    let bestT = wallT;
    let victim: Combatant | null = null;
    let hitbox: HitBoxId = 'chest';
    for (const e of this.combatants) {
      if (!e.alive || e.id === c.id || e.team === c.team) continue;
      const h = raycastCombatant(e, eye.x, eye.y, eye.z, dx, dy, dz, bestT);
      if (h && h.t < bestT) { bestT = h.t; victim = e; hitbox = h.hitbox; }
    }

    // --- audio + fx ---
    const self = c === this.player;
    audio.shot(ws.id, c.body.x, c.body.z, self);
    this.noises.push({ x: c.body.x, z: c.body.z, team: c.team, time: this.time });
    if (this.noises.length > 40) this.noises.shift();

    const endX = eye.x + dx * bestT;
    const endY = eye.y + dy * bestT;
    const endZ = eye.z + dz * bestT;
    const rx = right.x * 0.16;
    const rz = right.z * 0.16;
    this.tracers.push({
      x0: eye.x + rx + dx * 0.55, y0: eye.y - 0.10 + dy * 0.55, z0: eye.z + rz + dz * 0.55,
      x1: endX, y1: endY, z1: endZ,
      time: this.time, weapon: ws.id,
    });
    if (this.tracers.length > 48) this.tracers.shift();

    if (victim) {
      const dmg = computeDamage(def, hitbox, bestT, victim.armor);
      this.applyDamage(victim, c, dmg.health, dmg.absorbed, hitbox, ws.id);
    } else if (wall) {
      audio.impact(wall.x, wall.z);
    }

    if (def.category !== 'melee' && ws.ammo === 0 && ws.reserve > 0) {
      this.startReload(c);
    }
    return true;
  }

  /** Trigger interface for both the human and the bots. */
  tryFire(c: Combatant): boolean {
    const ws = this.currentState(c);
    if (!ws) return false;
    const def = weaponDef(ws.id);
    if (def.burst > 0) {
      if (c.burstLeft <= 0) c.burstLeft = def.burst;
      return false;
    }
    return this.fireOneShot(c);
  }

  private applyDamage(
    victim: Combatant,
    attacker: Combatant,
    healthDamage: number,
    absorbed: number,
    hitbox: HitBoxId,
    weapon: WeaponId,
  ): void {
    victim.health -= healthDamage;
    if (victim.armor > 0) {
      victim.armor = Math.max(0, victim.armor - armorLossFrom(absorbed));
    }
    attacker.damage += healthDamage;
    victim.lastHitTime = this.time;
    victim.lastHitFromX = attacker.body.x;
    victim.lastHitFromZ = attacker.body.z;

    const headshot = hitbox === 'head';
    if (attacker === this.player) {
      this.hitmarkers.push({ id: this.hitSeq++, time: this.time, headshot, killed: false });
      if (this.hitmarkers.length > 4) this.hitmarkers.shift();
      audio.hitmarker(headshot);
    }
    if (victim === this.player) audio.hurt();

    if (victim.health <= 0) {
      victim.health = 0;
      this.killCombatant(victim, attacker, weapon, headshot);
    }
  }

  private killCombatant(victim: Combatant, killer: Combatant, weapon: WeaponId, headshot: boolean): void {
    victim.alive = false;
    victim.deaths++;
    victim.deathTime = this.time;
    victim.deathYaw = victim.yaw;
    killer.kills++;

    const ev: KillEvent = {
      id: this.killSeq++,
      time: this.time,
      killerId: killer.id,
      killerName: killer.name,
      killerTeam: killer.team,
      victimId: victim.id,
      victimName: victim.name,
      victimTeam: victim.team,
      weapon,
      headshot,
    };
    this.killfeed.push(ev);
    if (this.killfeed.length > 6) this.killfeed.shift();

    if (killer === this.player) {
      const hm = this.hitmarkers[this.hitmarkers.length - 1];
      if (hm) hm.killed = true;
      audio.kill(headshot);
    }
    if (victim === this.player) {
      audio.death();
      this.beginSpectate();
    }

    // drop the bomb
    if (victim.hasBomb) {
      victim.hasBomb = false;
      this.bomb.state = 'dropped';
      this.bomb.carrier = null;
      this.bomb.x = victim.body.x;
      this.bomb.z = victim.body.z;
      this.bomb.plantProgress = 0;
    }
    if (victim.brain) {
      victim.brain.state = 'reposition';
      victim.brain.targetId = null;
    }
  }

  // -- spectating ----------------------------------------------------------

  private beginSpectate(): void {
    this.spectating = true;
    this.pickSpectateTarget(1);
  }

  private pickSpectateTarget(dir: number): void {
    const mates = this.combatants.filter((c) => c.team === this.playerTeam && c.alive);
    if (mates.length === 0) { this.spectateId = null; return; }
    if (this.spectateId === null) {
      this.spectateId = mates[0]!.id;
      return;
    }
    const order = mates.map((m) => m.id);
    let i = order.indexOf(this.spectateId);
    if (i < 0) i = 0;
    i = (i + dir + order.length) % order.length;
    this.spectateId = order[i]!;
  }

  /** Take over the body the player is currently watching. */
  takeControlOfSpectated(): void {
    if (!this.spectating || this.spectateId === null) return;
    const next = this.byId(this.spectateId);
    if (!next || !next.alive) return;
    const prev = this.byId(this.playerId);
    if (prev) {
      prev.isHuman = false;
      prev.brain = makeBrain(prev.team === 'T' ? 'rushA' : 'anchorA');
      prev.brain.route = [];
      prev.brain.decisionTimer = 0;
    }
    next.isHuman = true;
    next.brain = null;
    this.playerId = next.id;
    this.spectating = false;
    this.spectateId = null;
    this.setBanner(`接管 ${next.name}`, 2.0);
  }

  // -- bomb ----------------------------------------------------------------

  private updateBomb(dt: number, input: InputState): void {
    this.humanUse = input.use;
    const bomb = this.bomb;

    if (bomb.state === 'carried') {
      const carrier = this.byId(bomb.carrier ?? -1);
      if (!carrier || !carrier.alive || !carrier.hasBomb) {
        // find whoever actually holds it
        const holder = this.combatants.find((c) => c.hasBomb && c.alive);
        if (holder) { bomb.carrier = holder.id; }
        else { bomb.state = 'dropped'; bomb.carrier = null; }
      }
      if (bomb.state === 'carried' && carrier) {
        bomb.x = carrier.body.x;
        bomb.z = carrier.body.z;
      }
    }

    if (bomb.state === 'dropped') {
      // auto pickup for nearby T
      for (const c of this.combatants) {
        if (!c.alive || c.team !== 'T' || c.hasBomb) continue;
        if (dist2D(c.body.x, c.body.z, bomb.x, bomb.z) < BOMB_PICKUP_RANGE) {
          c.hasBomb = true;
          bomb.state = 'carried';
          bomb.carrier = c.id;
          this.setBanner(`${c.name} 捡起了 C4`, 1.6);
          break;
        }
      }
    }

    // ---- planting ----
    let planting = false;
    for (const c of this.combatants) {
      if (!c.alive) continue;
      const site = siteAt(c.body.x, c.body.z);
      const wantsToPlant = c.team === 'T' && c.hasBomb && !!site &&
        (c.isHuman ? this.humanUse : c.brain?.state === 'plant');
      const still = Math.hypot(c.body.vx, c.body.vz) < 0.9;
      if (wantsToPlant && still && this.round.phase === 'live') {
        if (c.plantHold === 0) audio.c4PlantStart();
        c.plantHold += dt;
        planting = true;
        bomb.plantProgress = Math.min(1, c.plantHold / PLANT_TIME);
        if (c.plantHold >= PLANT_TIME) {
          bomb.state = 'planted';
          bomb.x = c.body.x;
          bomb.z = c.body.z;
          bomb.site = site!.id;
          bomb.timer = BOMB_TIMER;
          bomb.planterId = c.id;
          bomb.plantProgress = 1;
          c.hasBomb = false;
          c.plantHold = 0;
          this.setBanner(`C4 已在 ${site!.label} 安放`, 2.6);
          audio.c4PlantDone();
          for (const m of this.combatants) if (m.brain) { m.brain.goal = null; m.brain.decisionTimer = 0; }
        }
      } else if (c.plantHold > 0) {
        c.plantHold = Math.max(0, c.plantHold - dt * 2.5);
        if (c.plantHold === 0) bomb.plantProgress = 0;
      }
    }
    if (!planting && bomb.state !== 'planted') bomb.plantProgress = Math.max(0, bomb.plantProgress - dt);

    // ---- defusing ----
    let defusing = false;
    if (bomb.state === 'planted') {
      for (const c of this.combatants) {
        if (!c.alive || c.team !== 'CT') continue;
        const near = dist2D(c.body.x, c.body.z, bomb.x, bomb.z) < DEFUSE_RANGE;
        const wants = c.isHuman ? this.humanUse : c.brain?.state === 'defuse';
        const still = Math.hypot(c.body.vx, c.body.vz) < 0.9;
        if (near && wants && still && this.round.phase === 'live') {
          const total = c.hasDefuseKit ? DEFUSE_TIME_KIT : DEFUSE_TIME;
          if (c.defuseHold === 0) audio.c4DefuseTick();
          const before = c.defuseHold;
          c.defuseHold += dt;
          if (Math.floor(before * 3) !== Math.floor(c.defuseHold * 3)) audio.c4DefuseTick();
          defusing = true;
          bomb.defuseProgress = Math.min(1, c.defuseHold / total);
          bomb.defuserId = c.id;
          if (c.defuseHold >= total) {
            bomb.state = 'defused';
            bomb.defuseProgress = 1;
            this.setBanner(`${c.name} 拆除了 C4`, 3.0);
            audio.c4DefuseDone();
            this.endRound('CT', 'CT 成功拆包');
          }
        } else if (c.defuseHold > 0) {
          c.defuseHold = Math.max(0, c.defuseHold - dt * 2.5);
        }
      }
      if (!defusing) {
        bomb.defuseProgress = Math.max(0, bomb.defuseProgress - dt * 0.6);
        bomb.defuserId = null;
      }

      // ---- countdown ----
      bomb.timer -= dt;
      const interval = bomb.timer > 20 ? 1.0 : bomb.timer > 10 ? 0.5 : bomb.timer > 5 ? 0.33 : 0.22;
      if (this.time - this.lastBeep > interval) {
        this.lastBeep = this.time;
        audio.c4Beep(bomb.timer > 10 ? 880 : 1320);
      }
      if (bomb.timer <= 0) {
        bomb.timer = 0;
        bomb.state = 'exploded';
        audio.explosion(bomb.x, bomb.z);
        // splash damage
        for (const c of this.combatants) {
          if (!c.alive) continue;
          const d = dist2D(c.body.x, c.body.z, bomb.x, bomb.z);
          if (d < 18) {
            const dmg = Math.round(140 * (1 - d / 18));
            c.health -= dmg;
            if (c.health <= 0) {
              c.health = 0;
              const planter = this.byId(bomb.planterId ?? -1);
              this.killCombatant(c, planter ?? c, 'ak47', false);
            }
          }
        }
        this.endRound('T', 'C4 爆炸');
      }
    }
  }

  // -- per-combatant dynamics ---------------------------------------------

  private updateWeaponDynamics(c: Combatant, dt: number): void {
    const def = weaponDef(this.currentWeaponId(c));
    const ws = this.currentState(c);

    // recoil return to zero
    if (c.recoilDebt > 0) {
      const ret = c.recoilDebt * (1 - Math.exp(-def.recoil.recover * dt));
      c.recoilDebt -= ret;
      c.pitch = clamp(c.pitch - ret, -1.45, 1.45);
    }
    c.recoilPitch *= Math.exp(-9 * dt);
    c.recoilYaw *= Math.exp(-9 * dt);

    // bloom decay
    c.spread *= Math.exp(-def.spread.recover * dt);
    if (c.spread < 1e-5) c.spread = 0;

    // ads
    const wantAds = c.ads && !!def.ads;
    c.adsAmount = clamp(c.adsAmount + (wantAds ? dt / (def.ads?.time ?? 0.25) : -dt / (def.ads?.time ?? 0.25)), 0, 1);

    // reload completion
    if (ws && ws.reloading && this.time >= ws.reloadEnd) this.finishReload(c);

    // burst firing (Glock)
    if (c.burstLeft > 0 && ws && !ws.reloading && this.time >= ws.nextFireTime) {
      if (this.fireOneShot(c)) c.burstLeft--;
      if (ws.ammo <= 0) c.burstLeft = 0;
    }
  }

  private updateFootsteps(c: Combatant, dt: number): void {
    const speed = Math.hypot(c.body.vx, c.body.vz);
    if (!c.body.onGround || speed < 0.6) return;
    c.stepAccum += speed * dt;
    const stride = speed > 4.0 ? 2.35 : 1.9;
    if (c.stepAccum >= stride) {
      c.stepAccum -= stride;
      audio.footstep(c.body.x, c.body.z, c === this.player, speed > 4.0);
    }
  }

  private updateAnimation(c: Combatant, dt: number): void {
    const speed = Math.hypot(c.body.vx, c.body.vz);
    c.animPhase += speed * dt * 2.4;
    if (!c.body.onGround) c.animPhase += dt * 0.6;
  }

  // -- human control -------------------------------------------------------

  private updateHuman(c: Combatant, input: InputState, dt: number): void {
    const def = weaponDef(this.currentWeaponId(c));

    // look
    const scoped = def.ads !== null && c.adsAmount > 0.85;
    const sens = MOUSE_SENS * (scoped ? def.ads!.sensitivity : 1);
    c.yaw -= input.mouseDX * sens;
    c.pitch = clamp(c.pitch - input.mouseDY * sens, -1.45, 1.45);

    // weapon switching
    if (input.slotRequest) {
      this.switchSlot(c, input.slotRequest);
      input.slotRequest = null;
    }

    // ads
    const wantAds = input.ads && def.ads !== null;
    if (wantAds !== c.ads) {
      c.ads = wantAds;
      if (def.ads) {
        if (wantAds) audio.scopeIn(); else audio.scopeOut();
      }
    }

    // reload
    if (input.reload) this.startReload(c);

    const frozen = this.round.phase !== 'live';

    // movement
    let wishX = 0, wishZ = 0;
    if (!frozen) {
      const f = dirFromAngles(c.yaw, 0);
      const r = rightVector(c.yaw);
      wishX = f.x * input.forward + r.x * input.strafe;
      wishZ = f.z * input.forward + r.z * input.strafe;
      const l = Math.hypot(wishX, wishZ);
      if (l > 1e-4) { wishX /= l; wishZ /= l; }
    }

    let speed = BASE_SPEED * def.moveSpeed;
    if (c.adsAmount > 0.3 && def.ads) speed *= 0.52;
    if (input.walk) speed *= 0.52;

    accelerate(c.body, {
      wishX, wishZ, speed,
      accel: 11.0,
      friction: 9.5,
      airAccel: 0.16,
    }, dt);

    if (!frozen && input.jump && c.body.onGround) {
      c.body.vy = JUMP_VELOCITY;
      c.body.onGround = false;
    }

    moveHorizontal(this.grid, this.collideBoxes, c.body, c.body.vx * dt, c.body.vz * dt);
    moveVertical(this.grid, this.collideBoxes, c.body, dt);

    // firing — semi auto weapons require a fresh click, automatics fire
    // continuously while the trigger is held.
    if (!frozen) {
      const ws = this.currentState(c);
      const wdef = ws ? weaponDef(ws.id) : def;
      if (input.firePressed || (input.fire && wdef.auto)) this.tryFire(c);
    }
  }

  // -- AI world adapter ----------------------------------------------------

  private defendSpot(c: Combatant): { x: number; z: number } {
    const b = this.bomb;
    const ang = (c.id * 1.9) % TAU;
    const r = randRange(8, 13);
    const p = this.grid.nearestWalkable(b.x + Math.cos(ang) * r, b.z + Math.sin(ang) * r);
    return p ?? { x: b.x, z: b.z };
  }

  private recentEnemyNoise(c: Combatant, maxAge: number, maxDist: number): { x: number; z: number } | null {
    for (let i = this.noises.length - 1; i >= 0; i--) {
      const n = this.noises[i]!;
      if (n.team === c.team) continue;
      if (this.time - n.time > maxAge) continue;
      if (dist2D(c.body.x, c.body.z, n.x, n.z) > maxDist) continue;
      return { x: n.x, z: n.z };
    }
    return null;
  }

  // -- main step -----------------------------------------------------------

  step(dt: number, input: InputState): void {
    this.time += dt;
    this.aiWorld.time = this.time;
    this.aiWorld.phase = this.round.phase;
    this.aiWorld.attackSite = this.attackSite;
    this.aiWorld.bomb = this.bomb;

    if (this.banner && this.time > this.bannerUntil) this.banner = null;

    // round clock
    if (this.round.phase === 'freeze') {
      this.round.timeLeft -= dt;
      if (this.round.timeLeft <= 0) {
        this.round.phase = 'live';
        this.round.timeLeft = ROUND_TIME;
        this.setBanner('开始！', 1.2);
      }
    } else if (this.round.phase === 'live') {
      if (this.bomb.state !== 'planted') {
        this.round.timeLeft -= dt;
        if (this.round.timeLeft <= 0) {
          this.round.timeLeft = 0;
          this.endRound('CT', '时间耗尽');
        }
      }
    } else {
      this.round.timeLeft -= dt;
      if (this.round.timeLeft <= 0) {
        this.startRound(this.round.number + 1);
        return;
      }
    }

    // combatants
    for (const c of this.combatants) {
      this.updateWeaponDynamics(c, dt);
      if (!c.alive) continue;
      if (c.isHuman) this.updateHuman(c, input, dt);
      else if (c.brain && this.round.phase === 'live') updateBot(this.aiWorld, c, dt);
      else if (c.brain) {
        // freeze time: hold still but keep scanning
        accelerate(c.body, { wishX: 0, wishZ: 0, speed: 0, accel: 9, friction: 9, airAccel: 0.2 }, dt);
        moveHorizontal(this.grid, this.collideBoxes, c.body, c.body.vx * dt, c.body.vz * dt);
        moveVertical(this.grid, this.collideBoxes, c.body, dt);
      }
      this.updateFootsteps(c, dt);
      this.updateAnimation(c, dt);
    }

    this.separateBodies();
    // run *after* separation so the invariant "every alive body stands on
    // walkable floor" holds at the end of every step
    for (const c of this.combatants) {
      if (c.alive) unstickBody(this.grid, c.body);
    }
    this.updateBomb(dt, input);
    this.checkRoundEnd();

    // audio listener follows the camera
    const cam = this.cameraCombatant();
    if (cam) {
      const f = dirFromAngles(cam.yaw, 0);
      audio.setListener(cam.body.x, cam.body.z, f.x, f.z);
    }

    // consume one-shot input
    input.firePressed = false;
    input.mouseDX = 0;
    input.mouseDY = 0;
    if (input.cycleSpectate !== 0) {
      if (this.spectating) this.pickSpectateTarget(input.cycleSpectate > 0 ? 1 : -1);
      input.cycleSpectate = 0;
    }
    if (input.takeControl) {
      this.takeControlOfSpectated();
      input.takeControl = false;
    }
    if (this.spectating && this.spectateId !== null) {
      const t = this.byId(this.spectateId);
      if (!t || !t.alive) this.pickSpectateTarget(1);
    }
  }

  /** Prevent bodies from occupying the same space. */
  private separateBodies(): void {
    const list = this.combatants.filter((c) => c.alive);
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i]!;
        const b = list[j]!;
        if (Math.abs(a.body.y - b.body.y) > CHARACTER.height * 0.8) continue;
        const dx = b.body.x - a.body.x;
        const dz = b.body.z - a.body.z;
        const d = Math.hypot(dx, dz);
        const min = CHARACTER.radius * 2;
        if (d > min || d < 1e-5) continue;
        const push = (min - d) * 0.5;
        const nx = dx / d, nz = dz / d;
        const ab: Body = a.body, bb: Body = b.body;
        moveHorizontal(this.grid, this.collideBoxes, ab, -nx * push, -nz * push);
        moveHorizontal(this.grid, this.collideBoxes, bb, nx * push, nz * push);
      }
    }
  }

  private checkRoundEnd(): void {
    if (this.round.phase !== 'live') return;
    // if the bomb is planted the round can only end via defuse / explosion
    if (this.bomb.state === 'planted') return;
    const ct = this.aliveOf('CT').length;
    const t = this.aliveOf('T').length;
    if (t === 0) this.endRound('CT', 'CT 全歼 T');
    else if (ct === 0) this.endRound('T', 'T 全歼 CT');
  }

  endRound(winner: Team, reason: string): void {
    if (this.round.phase === 'over') return;
    this.round.phase = 'over';
    this.round.winner = winner;
    this.round.reason = reason;
    this.round.timeLeft = OVER_TIME;
    if (winner === 'CT') this.round.scoreCT++; else this.round.scoreT++;
    this.setBanner(`${winner === 'CT' ? 'CT' : 'T'} 获胜 — ${reason}`, OVER_TIME);
    audio.roundWin(winner);
  }

  /** Which combatant the camera should follow. */
  cameraCombatant(): Combatant | null {
    if (this.spectating && this.spectateId !== null) return this.byId(this.spectateId);
    return this.byId(this.playerId);
  }

  // -- React snapshot ------------------------------------------------------

  snapshot(): Snapshot {
    const cam = this.cameraCombatant();
    const self = this.byId(this.playerId);
    const now = this.time;

    let selfSnap: SelfSnapshot | null = null;
    if (self) {
      const ws = this.currentState(self);
      const def = weaponDef(this.currentWeaponId(self));
      const site = siteAt(self.body.x, self.body.z);
      const nearBomb = this.bomb.state === 'planted' &&
        dist2D(self.body.x, self.body.z, this.bomb.x, this.bomb.z) < DEFUSE_RANGE;
      selfSnap = {
        id: self.id,
        team: self.team,
        alive: self.alive,
        health: Math.max(0, Math.round(self.health)),
        armor: Math.max(0, Math.round(self.armor)),
        helmet: self.helmet,
        kit: self.hasDefuseKit,
        weaponId: def.id,
        weaponName: def.name,
        ammo: ws ? ws.ammo : 0,
        magSize: def.magSize,
        reserve: ws ? ws.reserve : 0,
        reloading: ws ? ws.reloading : false,
        reloadProgress: ws && ws.reloading ? clamp(1 - (ws.reloadEnd - now) / def.reloadTime, 0, 1) : 0,
        slot: self.slot,
        hasPrimary: !!self.weapons.primary,
        hasSecondary: !!self.weapons.secondary,
        spread: this.effectiveSpread(self),
        ads: self.ads,
        adsAmount: self.adsAmount,
        scoped: def.ads !== null && self.adsAmount > 0.85,
        hasBomb: self.hasBomb,
        canPlant: self.hasBomb && !!site && self.alive,
        canDefuse: self.team === 'CT' && nearBomb && self.alive,
        plantProgress: this.bomb.plantProgress,
        defuseProgress: this.bomb.defuseProgress,
        speed: Math.hypot(self.body.vx, self.body.vz),
        onGround: self.body.onGround,
        kills: self.kills,
        deaths: self.deaths,
        damage: Math.round(self.damage),
        hitFlash: self.alive ? clamp(1 - (now - self.lastHitTime) / 0.7, 0, 1) : 0,
        hitFromAngle: self.alive ? Math.atan2(self.lastHitFromX - self.body.x, -(self.lastHitFromZ - self.body.z)) : 0,
      };
    }

    const players: PlayerSnapshot[] = this.combatants.map((c) => {
      let screen: PlayerSnapshot['screen'] = null;
      if (cam && c.id !== cam.id && c.alive) {
        const d = dist2D(cam.body.x, cam.body.z, c.body.x, c.body.z);
        const eye = eyePosition(cam);
        const visible = this.los(eye.x, eye.y, eye.z, c.body.x, c.body.y + 1.25, c.body.z);
        screen = { x: c.body.x, y: c.body.z, dist: d, visible };
      }
      return {
        id: c.id,
        name: c.name,
        team: c.team,
        alive: c.alive,
        health: Math.max(0, Math.round(c.health)),
        armor: Math.max(0, Math.round(c.armor)),
        kills: c.kills,
        deaths: c.deaths,
        damage: Math.round(c.damage),
        isHuman: c.isHuman,
        hasBomb: c.hasBomb,
        weapon: this.currentWeaponId(c),
        screen,
      };
    });

    const spectate = this.spectating && this.spectateId !== null
      ? (() => { const t = this.byId(this.spectateId!); return t ? { id: t.id, name: t.name, alive: t.alive } : null; })()
      : null;

    const hm = this.hitmarkers.length > 0 ? this.hitmarkers[this.hitmarkers.length - 1]! : null;

    return {
      time: now,
      round: { ...this.round },
      bomb: {
        state: this.bomb.state,
        x: this.bomb.x,
        z: this.bomb.z,
        timer: Math.max(0, this.bomb.timer),
        site: this.bomb.site,
        plantProgress: this.bomb.plantProgress,
        defuseProgress: this.bomb.defuseProgress,
      },
      self: selfSnap,
      players,
      killfeed: this.killfeed.slice(-5),
      hitmarker: hm && now - hm.time < 0.35 ? hm : null,
      spectate,
      banner: this.banner,
      aliveCT: this.aliveOf('CT').length,
      aliveT: this.aliveOf('T').length,
      attackSite: this.attackSite,
      scoreLimit: 16,
    };
  }

  // -- debug helpers -------------------------------------------------------

  /** Give the local player a specific loadout (used by the freeze-time buy UI). */
  setPlayerWeapons(primary: WeaponId | null, secondary: WeaponId): void {
    const c = this.byId(this.playerId);
    if (!c) return;
    c.primaryId = primary;
    c.weapons.secondary = makeWeaponState(secondary, this.time);
    if (primary) c.weapons.primary = makeWeaponState(primary, this.time);
    else delete c.weapons.primary;
    c.slot = primary ? 'primary' : 'secondary';
    const ws = this.currentState(c);
    if (ws) ws.readyTime = this.time + weaponDef(ws.id).drawTime;
  }

  availableWeapons(): { id: WeaponId; name: string; category: string }[] {
    return Object.values(WEAPONS).map((w: WeaponDef) => ({ id: w.id, name: w.name, category: w.category }));
  }

  otherTeam(team: Team): Team { return OTHER_TEAM[team]; }
}
