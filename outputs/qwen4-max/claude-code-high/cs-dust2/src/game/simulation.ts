import type { Vec3 } from './math';
import {
  v3, vclone, vadd, vsub, vscale, vnorm, vlen2, vdist2, yawDir, lookDir,
  clamp, rotY, makeRng,
} from './math';
import type {
  Combatant, Team, WeaponId, Slot, Bomb, SimEvent, PlayerInput, HitPart,
  RoundPhase, RoundEndReason,
} from './types';
import { emptyInput } from './types';
import { WEAPONS, PART_MULT, applyArmor, currentWeaponId, weaponOf } from './weapons';
import type { WeaponDef } from './weapons';
import { buildMap, inSite, floorHeightAt, cellAt, walkable, avoidCrates } from './map';
import type { MapData } from './map';
import { moveEntity, raycastWorld, rayBox, hasLOS, EYE_HEIGHT, JUMP_VEL, groundAt } from './physics';
import { makeBot, botThink } from './ai';

const FREEZE_TIME = 3;
const ROUND_TIME = 115;
const ROUND_END_TIME = 5;
const BOMB_TIMER = 40;
const PLANT_TIME = 3.2;
const DEFUSE_TIME = 10;
const WIN_SCORE = 8;
const HALF_ROUNDS = 7;

const CT_NAMES = ['Rock', 'Viper', 'Ghost', 'Falcon', 'Steel'];
const T_NAMES = ['Jackal', 'Scorpion', 'Cobra', 'Hyena', 'Vulture'];

interface LocalBox { min: Vec3; max: Vec3; part: HitPart; }

/** Hitboxes in character-local space (character faces -Z, feet at origin). */
const HITBOXES: LocalBox[] = [
  { min: v3(-0.14, 1.52, -0.14), max: v3(0.14, 1.8, 0.14), part: 'head' },
  { min: v3(-0.25, 1.18, -0.16), max: v3(0.25, 1.52, 0.16), part: 'chest' },
  { min: v3(-0.23, 0.92, -0.15), max: v3(0.23, 1.18, 0.15), part: 'stomach' },
  { min: v3(0.25, 1.02, -0.42), max: v3(0.44, 1.5, 0.12), part: 'arm' },
  { min: v3(-0.44, 1.02, -0.42), max: v3(-0.25, 1.5, 0.12), part: 'arm' },
  { min: v3(0.03, 0, -0.17), max: v3(0.22, 0.92, 0.17), part: 'leg' },
  { min: v3(-0.22, 0, -0.17), max: v3(-0.03, 0.92, 0.17), part: 'leg' },
];

export interface SimOptions {
  seed?: number;
  /** headless mode: the "player" slot is also bot-driven (used by tests) */
  allBots?: boolean;
  playerTeam?: Team;
  playerName?: string;
}

export class GameSim {
  map: MapData;
  rng: () => number;
  combatants: Combatant[] = [];
  bomb: Bomb;
  phase: RoundPhase = 'freeze';
  phaseT = FREEZE_TIME;
  liveT = ROUND_TIME;
  round = 1;
  pistol = true;
  scores: { CT: number; T: number } = { CT: 0, T: 0 };
  roundEndWinner: Team | null = null;
  roundEndReason: RoundEndReason | null = null;
  matchWinner: Team | null = null;
  events: SimEvent[] = [];
  time = 0;
  playerId = 0;
  readonly roundTime = ROUND_TIME;
  allBots: boolean;
  playerTeam: Team;
  /** enemy ids currently spotted by each team (for minimap + AI) */
  spotted: { CT: Set<number>; T: Set<number> } = { CT: new Set(), T: new Set() };
  /** last team contact, used for rotations */
  contact: { CT: { pos: Vec3; t: number } | null; T: { pos: Vec3; t: number } | null } = { CT: null, T: null };
  private visionClock = 0;
  private playerName: string;

  constructor(opts: SimOptions = {}) {
    this.map = buildMap();
    this.rng = makeRng(opts.seed ?? 1337);
    this.allBots = opts.allBots ?? false;
    this.playerTeam = opts.playerTeam ?? 'CT';
    this.playerName = opts.playerName ?? '你';
    this.bomb = {
      state: 'carried', carrier: -1, pos: v3(), timer: BOMB_TIMER,
      beepT: 0, planter: -1, defuser: -1, defuseProgress: 0,
    };
    this.createCombatants();
    this.startRound();
  }

  private createCombatants(): void {
    let id = 0;
    const mk = (team: Team, name: string, isPlayer: boolean): Combatant => {
      const c: Combatant = {
        id: id++, name, team,
        pos: v3(), vel: v3(), yaw: team === 'CT' ? Math.PI : 0, pitch: 0,
        hp: 100, armor: 0, alive: true, onGround: true,
        primary: null, secondary: team === 'CT' ? 'usp' : 'glock', slot: 'secondary',
        ammo: {}, cooldown: 0, reloadT: 0, bloom: 0, recoilPitch: 0, scoped: false,
        hasBomb: false, plantT: 0, defuseT: 0,
        isPlayer, bot: null, deathT: 0, walkPhase: 0, stepDist: 0,
        kills: 0, deaths: 0, lastAttacker: -1, lastDamageT: -99,
        wishDir: v3(), wantJump: false, wantFire: false, wantFirePressed: false,
        wantAltFire: false, wantReload: false, wantUse: false, wantWalk: false,
      };
      if (!isPlayer || this.allBots) c.bot = makeBot(this, c);
      return c;
    };
    for (let i = 0; i < 5; i++) {
      const isP = this.playerTeam === 'CT' && i === 0;
      this.combatants.push(mk('CT', isP ? this.playerName : CT_NAMES[i], isP));
    }
    for (let i = 0; i < 5; i++) {
      const isP = this.playerTeam === 'T' && i === 0;
      this.combatants.push(mk('T', isP ? this.playerName : T_NAMES[i], isP));
    }
    this.playerId = this.combatants.find((c) => c.isPlayer)?.id ?? 0;
  }

  get player(): Combatant {
    return this.combatants[this.playerId];
  }

  byId(id: number): Combatant | undefined {
    return this.combatants[id];
  }

  alive(team: Team): Combatant[] {
    return this.combatants.filter((c) => c.alive && c.team === team);
  }

  // ---------------------------------------------------------------- rounds

  startRound(): void {
    // side swap at half time
    if (this.round === HALF_ROUNDS + 1) {
      for (const c of this.combatants) c.team = c.team === 'CT' ? 'T' : 'CT';
      this.playerTeam = this.player.team;
    }
    this.pistol = this.round === 1 || this.round === HALF_ROUNDS + 1;
    this.phase = 'freeze';
    this.phaseT = FREEZE_TIME;
    this.liveT = ROUND_TIME;
    this.roundEndWinner = null;
    this.roundEndReason = null;
    this.spotted.CT.clear();
    this.spotted.T.clear();

    const site: 'A' | 'B' = this.rng() < 0.5 ? 'A' : 'B';
    let ctI = 0;
    let tI = 0;
    for (const c of this.combatants) {
      const spawns = this.map.spawns[c.team];
      const idx = c.team === 'CT' ? ctI++ : tI++;
      const sp = spawns[idx % spawns.length];
      c.pos = v3(sp.x, groundAt(this.map, sp.x, sp.z), sp.z);
      c.vel = v3();
      c.yaw = c.team === 'CT' ? Math.PI : 0;
      c.pitch = 0;
      c.hp = 100;
      c.alive = true;
      c.onGround = true;
      c.deathT = 0;
      c.hasBomb = false;
      c.plantT = 0;
      c.defuseT = 0;
      c.bloom = 0;
      c.recoilPitch = 0;
      c.scoped = false;
      c.cooldown = 0;
      c.reloadT = 0;
      c.lastAttacker = -1;
      c.lastDamageT = -99;
      // loadout
      if (this.pistol) {
        c.primary = null;
        c.secondary = c.team === 'CT' ? 'usp' : 'glock';
        c.armor = 0; // pistol round: default pistols, no armor
        c.slot = 'secondary';
      } else {
        const awpBot = c.bot && ((c.team === 'T' && idx === 3) || (c.team === 'CT' && idx === 2)) && this.rng() < 0.55;
        c.primary = awpBot ? 'awp' : c.team === 'CT' ? 'm4a4' : 'ak47';
        c.secondary = c.bot && this.rng() < 0.25 ? 'deagle' : c.team === 'CT' ? 'usp' : 'glock';
        c.armor = 100;
        c.slot = 'primary';
      }
      c.ammo = {};
      const ids: WeaponId[] = ['knife', c.secondary];
      if (c.primary) ids.push(c.primary);
      for (const w of ids) {
        const def = WEAPONS[w];
        c.ammo[w] = { mag: def.magSize, reserve: def.reserve };
      }
      // bot strategy
      if (c.bot) {
        // defenders hold prepared angles: small skill edge
        c.bot.skill = 0.7 + this.rng() * 0.45 + (c.team === 'CT' ? 0.2 : 0);
        c.bot.targetId = -1;
        c.bot.path = [];
        c.bot.pathI = 0;
        c.bot.goal = null;
        c.bot.repathT = 0;
        c.bot.state = 'move';
        c.bot.attackSite = site;
        c.bot.burstLeft = 0;
        c.bot.burstPause = 0;
        c.bot.lastPos = vclone(c.pos);
        c.bot.stuckT = 0;
        if (c.team === 'CT') {
          c.bot.holdPos = avoidCrates(this.map, vclone(this.map.ctHolds[idx % this.map.ctHolds.length]));
        } else if (idx === 4) {
          // lurker: holds mid early, then joins the hit
          c.bot.holdPos = v3(2, 0, 8);
        } else {
          const center = this.map.siteCenters[site];
          const ang = (idx / 4) * Math.PI * 2 + (site === 'A' ? 0.6 : 2.2);
          c.bot.holdPos = avoidCrates(this.map, v3(center.x + Math.cos(ang) * 7, 0, center.z + Math.sin(ang) * 7));
        }
      }
    }
    // bomb to a random T
    const ts = this.alive('T');
    const carrier = ts[Math.floor(this.rng() * ts.length)];
    carrier.hasBomb = true;
    this.bomb = {
      state: 'carried', carrier: carrier.id, pos: vclone(carrier.pos), timer: BOMB_TIMER,
      beepT: 0, planter: -1, defuser: -1, defuseProgress: 0,
    };
    this.events.push({ type: 'roundStart', round: this.round, pistol: this.pistol });
  }

  private endRound(winner: Team, reason: RoundEndReason): void {
    if (this.phase !== 'live') return;
    this.phase = 'roundend';
    this.phaseT = ROUND_END_TIME;
    this.roundEndWinner = winner;
    this.roundEndReason = reason;
    this.scores[winner]++;
    this.events.push({ type: 'roundEnd', winner, reason });
  }

  restartMatch(): void {
    this.round = 1;
    this.scores = { CT: 0, T: 0 };
    this.matchWinner = null;
    for (const c of this.combatants) {
      c.kills = 0;
      c.deaths = 0;
    }
    // restore original sides
    for (let i = 0; i < 5; i++) this.combatants[i].team = 'CT';
    for (let i = 5; i < 10; i++) this.combatants[i].team = 'T';
    this.playerTeam = this.player.team;
    this.startRound();
  }

  // ---------------------------------------------------------------- update

  update(dt: number, input: PlayerInput): void {
    this.time += dt;
    if (this.phase === 'matchend') return;

    if (this.phase === 'freeze') {
      this.phaseT -= dt;
      // allow looking around during freeze, but no movement
      const p = this.player;
      if (p.alive && !this.allBots) this.applyPlayerLook(p, input);
      if (this.phaseT <= 0) {
        this.phase = 'live';
      }
      return;
    }

    if (this.phase === 'roundend') {
      this.phaseT -= dt;
      this.updateDeadBodies(dt);
      if (this.phaseT <= 0) {
        if (this.scores.CT >= WIN_SCORE || this.scores.T >= WIN_SCORE) {
          this.phase = 'matchend';
          this.matchWinner = this.scores.CT >= WIN_SCORE ? 'CT' : 'T';
          this.events.push({ type: 'matchEnd', winner: this.matchWinner });
        } else {
          this.round++;
          this.startRound();
        }
      }
      return;
    }

    // ---- live ----
    this.liveT -= dt;
    this.visionClock -= dt;
    if (this.visionClock <= 0) {
      this.visionClock = 0.12;
      this.updateVision();
    }

    for (const c of this.combatants) {
      if (!c.alive) continue;
      if (c.isPlayer && !this.allBots) {
        this.applyPlayerInput(c, input);
      } else if (c.bot) {
        botThink(this, c, dt);
      }
      this.updateWeapon(c, dt, input);
      this.updateMovement(c, dt);
      this.updateUse(c, dt);
    }

    this.updateBomb(dt);
    this.updateDeadBodies(dt);

    // round end conditions
    const ct = this.alive('CT').length;
    const t = this.alive('T').length;
    if (ct === 0) this.endRound('T', 'elimination');
    else if (t === 0 && this.bomb.state !== 'planted') this.endRound('CT', 'elimination');
    else if (this.liveT <= 0 && this.bomb.state !== 'planted') this.endRound('CT', 'time');
  }

  private updateDeadBodies(dt: number): void {
    for (const c of this.combatants) {
      if (!c.alive) c.deathT += dt;
    }
  }

  private applyPlayerLook(c: Combatant, input: PlayerInput): void {
    // yaw/pitch are written directly by the engine from mouse deltas
    void input;
    void c;
  }

  private applyPlayerInput(c: Combatant, input: PlayerInput): void {
    const f = yawDir(c.yaw);
    const r = yawDir(c.yaw - Math.PI / 2);
    let wish = v3();
    if (input.forward) wish = vadd(wish, f);
    if (input.back) wish = vsub(wish, f);
    if (input.right) wish = vadd(wish, r);
    if (input.left) wish = vsub(wish, r);
    c.wishDir = vnorm(wish);
    c.wantJump = input.jump;
    c.wantFire = input.fire;
    c.wantFirePressed = input.firePressed;
    c.wantAltFire = input.altFirePressed;
    c.wantReload = input.reload;
    c.wantUse = input.use;
    c.wantWalk = input.walk;
    if (input.switchSlot) this.switchSlot(c, input.switchSlot);
    if (input.dropBomb && c.hasBomb && this.bomb.state === 'carried') {
      this.dropBomb(c);
    }
  }

  switchSlot(c: Combatant, slot: Slot): void {
    if (slot === 'primary' && !c.primary) return;
    if (c.slot === slot) return;
    c.slot = slot;
    c.reloadT = 0;
    c.scoped = false;
    c.bloom = 0;
    this.events.push({ type: 'switch', by: c.id, weapon: currentWeaponId(c) });
  }

  // ---------------------------------------------------------------- weapons

  private updateWeapon(c: Combatant, dt: number, input: PlayerInput): void {
    const w = weaponOf(currentWeaponId(c));
    c.cooldown = Math.max(0, c.cooldown - dt);
    c.bloom = Math.max(0, c.bloom - w.bloomRecovery * dt);
    c.recoilPitch = Math.max(0, c.recoilPitch - w.recoilRecovery * c.recoilPitch * dt - 0.002 * dt);

    // reload
    if (c.reloadT > 0) {
      c.reloadT -= dt;
      if (c.reloadT <= 0) {
        const ammo = c.ammo[w.id];
        if (ammo) {
          const need = w.magSize - ammo.mag;
          const take = Math.min(need, ammo.reserve);
          ammo.mag += take;
          ammo.reserve -= take;
        }
        c.reloadT = 0;
      }
    } else if (c.wantReload) {
      this.startReload(c, w);
    }

    // scope toggle (player edge-triggered; bots set c.scoped in botThink)
    if (c.isPlayer && !this.allBots && input.altFirePressed && w.scope) {
      c.scoped = !c.scoped;
      this.events.push({ type: 'scope', by: c.id, on: c.scoped });
    }
    if (!w.scope) c.scoped = false;

    // fire
    const wantShot = w.melee ? c.wantFirePressed || c.wantAltFire : w.auto ? c.wantFire : c.wantFirePressed;
    if (wantShot && c.cooldown <= 0 && c.reloadT <= 0) {
      if (w.melee) {
        this.fireMelee(c, w, c.wantAltFire);
      } else {
        const ammo = c.ammo[w.id]!;
        if (ammo.mag <= 0) {
          this.startReload(c, w);
        } else {
          this.fireHitscan(c, w);
        }
      }
    }
    c.wantFirePressed = false;
    c.wantAltFire = false;
    c.wantReload = false;
  }

  private startReload(c: Combatant, w: WeaponDef): void {
    const ammo = c.ammo[w.id];
    if (!ammo || w.melee || ammo.mag >= w.magSize || ammo.reserve <= 0 || c.reloadT > 0) return;
    c.reloadT = w.reloadTime;
    c.scoped = false;
    this.events.push({ type: 'reload', by: c.id, weapon: w.id });
  }

  private spreadOf(c: Combatant, w: WeaponDef): number {
    const move = vlen2(c.vel) * 0.0045;
    const air = c.onGround ? 0 : 0.035;
    let s = w.spreadBase + c.bloom + move + air;
    if (c.scoped) s *= 0.08;
    return s;
  }

  private fireHitscan(c: Combatant, w: WeaponDef): void {
    const ammo = c.ammo[w.id]!;
    ammo.mag--;
    c.cooldown = 60 / w.rpm;
    c.bloom = Math.min(w.bloomMax, c.bloom + w.bloomPerShot);
    c.recoilPitch = Math.min(0.14, c.recoilPitch + w.recoilPitch);
    c.yaw += (this.rng() - 0.5) * w.recoilYaw * 2;

    const origin = vadd(c.pos, v3(0, EYE_HEIGHT, 0));
    const spread = this.spreadOf(c, w);
    const base = lookDir(c.yaw, c.pitch + c.recoilPitch * 0.6);
    // random cone
    const a = this.rng() * Math.PI * 2;
    const r = Math.sqrt(this.rng()) * spread;
    const up = v3(0, 1, 0);
    const right = vnorm({ x: base.z, y: 0, z: -base.x });
    const realUp = { x: up.x - base.x * (base.y), y: up.y - base.y * base.y, z: up.z - base.z * base.y };
    const dir = vnorm(vadd(base, vadd(vscale(right, Math.cos(a) * r), vscale(vnorm(realUp), Math.sin(a) * r))));

    const result = this.traceBullet(c, origin, dir, w);
    this.events.push({ type: 'shot', by: c.id, weapon: w.id, origin, end: result.end, scoped: c.scoped });
    if (result.victim) {
      this.applyDamage(result.victim, c, result.dmg, result.part, w.id);
    }
  }

  private traceBullet(
    shooter: Combatant, origin: Vec3, dir: Vec3, w: WeaponDef,
  ): { end: Vec3; victim: Combatant | null; part: HitPart; dmg: number } {
    let dmg = w.damage;
    let penetrations = w.penetration;
    let traveled = 0;
    const maxDist = w.range;
    let o = vclone(origin);
    while (traveled < maxDist) {
      // nearest world hit
      const wh = raycastWorld(this.map, o, dir, maxDist - traveled);
      // nearest enemy hit
      let bestT = wh ? wh.t : maxDist - traveled;
      let victim: Combatant | null = null;
      let part: HitPart = 'chest';
      for (const e of this.combatants) {
        if (!e.alive || e.team === shooter.team || e.id === shooter.id) continue;
        const hit = this.rayCharacter(o, dir, e, bestT);
        if (hit && hit.t < bestT) {
          bestT = hit.t;
          victim = e;
          part = hit.part;
        }
      }
      const end = vadd(o, vscale(dir, bestT));
      if (victim) {
        const falloff = clamp(1 - (traveled + bestT) / (w.range * 1.6), w.falloffMin, 1);
        return { end, victim, part, dmg: dmg * PART_MULT[part] * falloff };
      }
      if (!wh) return { end, victim: null, part: 'chest', dmg: 0 };
      if (wh.collider.penetrable && penetrations > 0) {
        penetrations--;
        dmg *= 0.55;
        traveled += wh.t + 0.35;
        o = vadd(o, vscale(dir, wh.t + 0.35));
        continue;
      }
      return { end, victim: null, part: 'chest', dmg: 0 };
    }
    return { end: vadd(o, vscale(dir, maxDist - traveled)), victim: null, part: 'chest', dmg: 0 };
  }

  /** Transform ray into character local space and test part AABBs. */
  private rayCharacter(origin: Vec3, dir: Vec3, e: Combatant, maxT: number): { t: number; part: HitPart } | null {
    const lo = vsub(origin, e.pos);
    const loRot = rotY(lo, -e.yaw);
    const dirRot = rotY(dir, -e.yaw);
    let best: { t: number; part: HitPart } | null = null;
    for (const hb of HITBOXES) {
      const h = rayBox(loRot, dirRot, hb.min, hb.max, maxT);
      if (h && (!best || h.t < best.t)) best = { t: h.t, part: hb.part };
    }
    return best;
  }

  private fireMelee(c: Combatant, w: WeaponDef, heavy: boolean): void {
    c.cooldown = heavy ? 1.0 : 0.5;
    const origin = vadd(c.pos, v3(0, EYE_HEIGHT, 0));
    const dir = lookDir(c.yaw, c.pitch);
    const range = w.meleeRange;
    let bestT = range;
    let victim: Combatant | null = null;
    let part: HitPart = 'chest';
    const wh = raycastWorld(this.map, origin, dir, range);
    if (wh) bestT = wh.t;
    for (const e of this.combatants) {
      if (!e.alive || e.team === c.team || e.id === c.id) continue;
      const hit = this.rayCharacter(origin, dir, e, bestT);
      if (hit && hit.t < bestT) {
        bestT = hit.t;
        victim = e;
        part = hit.part;
      }
    }
    const end = vadd(origin, vscale(dir, bestT));
    this.events.push({ type: 'shot', by: c.id, weapon: 'knife', origin, end, scoped: false });
    if (victim) {
      const dmg = (heavy ? w.heavyDamage ?? 65 : w.damage) * PART_MULT[part];
      this.applyDamage(victim, c, dmg, part, 'knife');
    }
  }

  private applyDamage(victim: Combatant, attacker: Combatant, raw: number, part: HitPart, weapon: WeaponId | 'c4'): void {
    if (!victim.alive) return;
    const { hp: hpDmg, armorLost } = applyArmor(raw, victim.armor, part);
    victim.armor = Math.max(0, victim.armor - armorLost);
    victim.hp -= hpDmg;
    victim.lastAttacker = attacker.id;
    victim.lastDamageT = this.time;
    const pos = vadd(victim.pos, v3(0, part === 'head' ? 1.65 : part === 'leg' ? 0.5 : 1.25, 0));
    this.events.push({ type: 'hit', attacker: attacker.id, victim: victim.id, part, dmg: hpDmg, pos });
    this.events.push({ type: 'damage', victim: victim.id, attacker: attacker.id });
    if (victim.hp <= 0) {
      victim.hp = 0;
      victim.alive = false;
      victim.deathT = 0;
      victim.deaths++;
      victim.scoped = false;
      if (attacker.id !== victim.id && attacker.team !== victim.team) attacker.kills++;
      if (victim.hasBomb) this.dropBomb(victim);
      this.events.push({
        type: 'kill', killer: attacker.id, victim: victim.id, weapon,
        headshot: part === 'head',
      });
    }
  }

  private dropBomb(c: Combatant): void {
    c.hasBomb = false;
    this.bomb.state = 'dropped';
    this.bomb.carrier = -1;
    this.bomb.pos = v3(c.pos.x, groundAt(this.map, c.pos.x, c.pos.z), c.pos.z);
    this.events.push({ type: 'bombDrop', pos: vclone(this.bomb.pos) });
  }

  // ---------------------------------------------------------------- movement

  private updateMovement(c: Combatant, dt: number): void {
    const w = weaponOf(currentWeaponId(c));
    let speed = w.moveSpeed * (c.bot ? 0.92 : 1);
    if (c.wantWalk) speed *= 0.5;
    if (c.scoped) speed *= 0.35;
    if (c.plantT > 0 || c.defuseT > 0) speed = 0;

    const wish = vscale(c.wishDir, speed);
    const accel = c.onGround ? 12 : 2.2;
    const k = Math.min(1, accel * dt);
    c.vel.x += (wish.x - c.vel.x) * k;
    c.vel.z += (wish.z - c.vel.z) * k;
    if (c.wantJump && c.onGround) {
      c.vel.y = JUMP_VEL;
      c.onGround = false;
    }
    const res = moveEntity(this.map, c.pos, c.vel, dt);
    // invariant: a living combatant's center must stay on walkable cells
    const cc = cellAt(this.map, res.pos.x, res.pos.z);
    if (walkable(this.map, cc.c, cc.r)) {
      c.pos = res.pos;
    } else {
      c.pos = { x: c.pos.x, y: res.pos.y, z: c.pos.z };
      c.vel.x = 0;
      c.vel.z = 0;
    }
    c.vel = res.vel;
    c.onGround = res.onGround;

    const spd = vlen2(c.vel);
    c.walkPhase += spd * dt * 2.4;
    if (c.onGround && spd > 0.5 && !c.wantWalk) {
      c.stepDist += spd * dt;
      if (c.stepDist > 2.4) {
        c.stepDist = 0;
        this.events.push({ type: 'step', by: c.id, pos: vclone(c.pos) });
      }
    }
    // safety: never leave the walkable area
    if (floorHeightAt(this.map, c.pos.x, c.pos.z) === 0 && c.pos.y < -2) {
      c.pos = vclone(this.map.spawns[c.team][0]);
      c.vel = v3();
    }
  }

  // ---------------------------------------------------------------- bomb / use

  canPlant(c: Combatant): boolean {
    return c.team === 'T' && c.hasBomb && this.bomb.state === 'carried'
      && inSite(this.map, c.pos.x, c.pos.z) !== null && c.onGround;
  }

  canDefuse(c: Combatant): boolean {
    return c.team === 'CT' && this.bomb.state === 'planted'
      && vdist2(c.pos, this.bomb.pos) < 1.7 && c.onGround;
  }

  private updateUse(c: Combatant, dt: number): void {
    // planting
    if (this.canPlant(c) && c.wantUse && vlen2(c.vel) < 0.6) {
      c.plantT += dt;
      if (c.plantT >= PLANT_TIME) {
        c.plantT = 0;
        c.hasBomb = false;
        this.bomb.state = 'planted';
        this.bomb.carrier = -1;
        this.bomb.pos = v3(c.pos.x, groundAt(this.map, c.pos.x, c.pos.z), c.pos.z);
        this.bomb.timer = BOMB_TIMER;
        this.bomb.planter = c.id;
        this.bomb.beepT = 0;
        this.events.push({ type: 'planted', pos: vclone(this.bomb.pos), by: c.id });
      }
    } else {
      c.plantT = 0;
    }
    // defusing
    if (this.canDefuse(c) && c.wantUse && vlen2(c.vel) < 0.6) {
      c.defuseT += dt;
      this.bomb.defuser = c.id;
      this.bomb.defuseProgress = clamp(c.defuseT / DEFUSE_TIME, 0, 1);
      if (c.defuseT >= DEFUSE_TIME) {
        c.defuseT = 0;
        this.bomb.state = 'defused';
        this.bomb.defuseProgress = 1;
        this.events.push({ type: 'defused', by: c.id });
        this.endRound('CT', 'defuse');
      }
    } else {
      if (this.bomb.defuser === c.id) {
        this.bomb.defuser = -1;
        this.bomb.defuseProgress = 0;
      }
      c.defuseT = 0;
    }
    // pickup dropped bomb
    if (this.bomb.state === 'dropped' && c.team === 'T' && vdist2(c.pos, this.bomb.pos) < 1.3) {
      this.bomb.state = 'carried';
      this.bomb.carrier = c.id;
      c.hasBomb = true;
      this.events.push({ type: 'bombPickup', by: c.id });
    }
  }

  private updateBomb(dt: number): void {
    if (this.bomb.state === 'carried') {
      const carrier = this.byId(this.bomb.carrier);
      if (carrier) this.bomb.pos = vclone(carrier.pos);
      return;
    }
    if (this.bomb.state !== 'planted') return;
    this.bomb.timer -= dt;
    this.bomb.beepT -= dt;
    if (this.bomb.beepT <= 0) {
      const urgency = clamp(1 - this.bomb.timer / BOMB_TIMER, 0, 1);
      this.bomb.beepT = 1.0 - urgency * 0.85;
      this.events.push({ type: 'beep', pos: vclone(this.bomb.pos), urgency });
    }
    if (this.bomb.timer <= 0) {
      this.bomb.state = 'exploded';
      const pos = vclone(this.bomb.pos);
      this.events.push({ type: 'explosion', pos });
      // explosion damage ignores walls, radial falloff
      for (const c of this.combatants) {
        if (!c.alive) continue;
        const d = vdist2(c.pos, pos);
        if (d < 28) {
          const dmg = 500 * Math.pow(1 - d / 28, 1.4);
          const planter = this.byId(this.bomb.planter) ?? c;
          this.applyDamage(c, planter, dmg, 'chest', 'c4');
        }
      }
      this.endRound('T', 'explosion');
    }
  }

  // ---------------------------------------------------------------- vision

  private updateVision(): void {
    this.spotted.CT.clear();
    this.spotted.T.clear();
    for (const c of this.combatants) {
      if (!c.alive) continue;
      const eye = vadd(c.pos, v3(0, EYE_HEIGHT, 0));
      const fwd = yawDir(c.yaw);
      for (const e of this.combatants) {
        if (!e.alive || e.team === c.team) continue;
        const to = vsub(e.pos, c.pos);
        const d = vlen2(to);
        if (d > 60) continue;
        const dot = (to.x * fwd.x + to.z * fwd.z) / (d || 1);
        const aware = c.lastDamageT > this.time - 3 && c.lastAttacker === e.id;
        if (dot < 0.25 && !aware) continue; // ~105° FOV
        const target = vadd(e.pos, v3(0, 1.3, 0));
        if (hasLOS(this.map, eye, target)) {
          this.spotted[c.team].add(e.id);
          this.contact[c.team] = { pos: vclone(e.pos), t: this.time };
        }
      }
    }
  }

  sees(c: Combatant, e: Combatant): boolean {
    return this.spotted[c.team].has(e.id);
  }

  // ---------------------------------------------------------------- helpers

  /** Player buy during freeze (prototype: free loadout pick). */
  buy(weapon: WeaponId): boolean {
    const p = this.player;
    // pistol round: everyone carries only the default pistol, no buying
    if (this.phase !== 'freeze' || !p.alive || this.pistol) return false;
    const def = WEAPONS[weapon];
    if (def.slot === 'primary') {
      p.primary = weapon;
      p.slot = 'primary';
    } else if (def.slot === 'secondary') {
      p.secondary = weapon;
      p.slot = 'secondary';
    } else {
      return false;
    }
    p.ammo[weapon] = { mag: def.magSize, reserve: def.reserve };
    if (!this.pistol) p.armor = 100;
    this.events.push({ type: 'switch', by: p.id, weapon });
    return true;
  }

  /** Take over a living teammate while spectating. */
  takeover(id: number): boolean {
    const c = this.byId(id);
    if (!c || !c.alive || c.team !== this.player.team || c.isPlayer) return false;
    const old = this.player;
    old.isPlayer = false;
    if (!old.bot) old.bot = makeBot(this, old);
    c.isPlayer = true;
    c.bot = null;
    this.playerId = c.id;
    return true;
  }

  drainEvents(): SimEvent[] {
    const e = this.events;
    this.events = [];
    return e;
  }
}

export { FREEZE_TIME, ROUND_TIME, BOMB_TIMER, PLANT_TIME, DEFUSE_TIME, WIN_SCORE };
export type { Slot };
export { emptyInput };
