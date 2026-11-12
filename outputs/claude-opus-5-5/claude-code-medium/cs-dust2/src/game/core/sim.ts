// The authoritative game simulation: entities, weapons, damage, bomb, rounds.
// Runs at a fixed tick and is completely independent of rendering; the client
// reads its state and drains `events` every frame.

import { BotBrain } from './bot.ts';
import {
  BOMB_KILL_RADIUS,
  BOMB_PICKUP_RANGE,
  BOMB_TIMER,
  BUY_TIME,
  DEFUSE_RANGE,
  DEFUSE_TIME,
  EYE_HEIGHT,
  FREEZE_TIME,
  PLANT_TIME,
  PLAYER_HEIGHT,
  PLAYER_RADIUS,
  POST_ROUND_TIME,
  ROUND_TIME,
} from './constants.ts';
import type { Difficulty } from './constants.ts';
import { emptyInput, otherTeam } from './entity.ts';
import type { Entity, Team } from './entity.ts';
import type { SimEvent } from './events.ts';
import { HIT_MULT, rayVsCharacter } from './hitbox.ts';
import type { HitGroup } from './hitbox.ts';
import { SPAWN_CELLS, buildMap, cellCenter, regionAt, siteAt } from './map.ts';
import type { MapData, SiteId } from './map.ts';
import { clamp, clone, copyTo, dirFromYawPitch, dist2D, pick, shuffle, v3 } from './math.ts';
import type { V3 } from './math.ts';
import { NavGrid } from './nav.ts';
import { CollisionWorld, JUMP_SPEED } from './physics.ts';
import { PRIMARY_IDS, ROUND_CONFIG, SECONDARY_IDS, WEAPONS, makeWeapon } from './weapons.ts';
import type { RoundType, Slot, WeaponDef, WeaponId } from './weapons.ts';

export interface SimConfig {
  playerTeam: Team;
  difficulty: Difficulty;
  startWithPistolRound: boolean;
  winsToMatch: number;
  playerName: string;
}

export type Phase = 'freeze' | 'live' | 'post' | 'over';

export interface BombState {
  state: 'carried' | 'dropped' | 'planted' | 'defused' | 'exploded';
  carrierId: number;
  pos: V3;
  site: SiteId | null;
  timeLeft: number;
  nextBeep: number;
  defuserId: number;
  defuseProgress: number;
}

interface Intel {
  pos: V3;
  time: number;
}

const BOT_NAMES: Record<Team, string[]> = {
  T: ['Rook', 'Vex', 'Sable', 'Dune', 'Kestrel'],
  CT: ['Atlas', 'Bishop', 'Cobalt', 'Harbor', 'Lynx'],
};

const A_PRESSURE = new Set(['a_site', 'long_a', 'catwalk', 'catwalk_low', 'pit', 'long_doors']);
const B_PRESSURE = new Set(['b_site', 'b_tunnels', 'b_tunnel_entry', 'lower_tunnels', 'b_doors']);

export class Sim {
  cfg: SimConfig;
  map: MapData;
  world: CollisionWorld;
  nav: NavGrid;
  entities: Entity[] = [];
  byId = new Map<number, Entity>();
  brains = new Map<number, BotBrain>();
  time = 0;
  events: SimEvent[] = [];

  phase: Phase = 'freeze';
  phaseEnd = 0;
  liveStart = 0;
  roundEndsAt = 0;
  round = 0;
  roundType: RoundType = 'pistol';
  score: Record<Team, number> = { T: 0, CT: 0 };
  lastWinner: Team | null = null;
  lastReason = '';
  matchWinner: Team | null = null;

  bomb: BombState = {
    state: 'carried',
    carrierId: -1,
    pos: v3(),
    site: null,
    timeLeft: 0,
    nextBeep: 0,
    defuserId: -1,
    defuseProgress: 0,
  };
  plan: { site: SiteId } = { site: 'A' };
  intel: Record<Team, Map<number, Intel>> = { T: new Map(), CT: new Map() };

  playerId: number;
  controlledId: number;
  playerPrefs: { primary: WeaponId | null; secondary: WeaponId | null } = { primary: null, secondary: null };

  private visTimer = 0;
  private nextEntityId = 1;

  constructor(cfg: SimConfig) {
    this.cfg = cfg;
    this.map = buildMap();
    this.world = new CollisionWorld(this.map.boxes);
    this.nav = new NavGrid(this.map);

    const player = this.createEntity(cfg.playerName, cfg.playerTeam, false);
    this.playerId = player.id;
    this.controlledId = player.id;
    const mates = BOT_NAMES[cfg.playerTeam].slice(0, 4);
    for (const n of mates) this.createEntity(n, cfg.playerTeam, true);
    for (const n of BOT_NAMES[otherTeam(cfg.playerTeam)]) this.createEntity(n, otherTeam(cfg.playerTeam), true);
    this.startRound();
  }

  // ------------------------------------------------------------------ setup

  private createEntity(name: string, team: Team, isBot: boolean): Entity {
    const e: Entity = {
      id: this.nextEntityId++,
      name,
      team,
      isBot,
      pos: v3(),
      prevPos: v3(),
      vel: v3(),
      onGround: true,
      radius: PLAYER_RADIUS,
      height: PLAYER_HEIGHT,
      yaw: 0,
      pitch: 0,
      hp: 100,
      armor: 0,
      helmet: false,
      alive: true,
      weapons: { primary: null, secondary: null, melee: makeWeapon('knife') },
      slot: 'secondary',
      prevSlot: 'melee',
      hasBomb: false,
      kills: 0,
      deaths: 0,
      nextFire: 0,
      drawUntil: 0,
      reloadUntil: 0,
      reloadStart: 0,
      shotsFired: 0,
      lastShotTime: -10,
      recoilPitch: 0,
      recoilYaw: 0,
      spreadAccum: 0,
      scope: 0,
      resumeScope: 0,
      resumeScopeAt: 0,
      triggerLatch: false,
      dryLatch: false,
      stepAccum: 0,
      planting: false,
      plantProgress: 0,
      defusing: false,
      visibleEnemies: [],
      spottedUntil: { T: 0, CT: 0 },
      lastDamageTime: -10,
      lastAttackerId: -1,
      deathTime: 0,
      input: emptyInput(),
    };
    this.entities.push(e);
    this.byId.set(e.id, e);
    this.brains.set(e.id, new BotBrain(e, this));
    return e;
  }

  get controlled(): Entity {
    return this.byId.get(this.controlledId)!;
  }
  get player(): Entity {
    return this.byId.get(this.playerId)!;
  }

  eyePos(e: Entity): V3 {
    return { x: e.pos.x, y: e.pos.y + EYE_HEIGHT, z: e.pos.z };
  }

  currentWeapon(e: Entity) {
    return e.weapons[e.slot] ?? e.weapons.melee!;
  }

  // ------------------------------------------------------------------ rounds

  startRound() {
    this.round++;
    this.roundType = this.round === 1 && this.cfg.startWithPistolRound ? 'pistol' : 'rifle';
    const conf = ROUND_CONFIG[this.roundType];
    this.phase = 'freeze';
    this.phaseEnd = this.time + FREEZE_TIME;
    this.intel.T.clear();
    this.intel.CT.clear();
    this.plan.site = Math.random() < 0.5 ? 'A' : 'B';
    this.controlledId = this.playerId;

    for (const team of ['T', 'CT'] as Team[]) {
      const members = this.entities.filter((e) => e.team === team);
      const spawns = shuffle(SPAWN_CELLS[team].slice());
      const bots = shuffle(members.filter((e) => e.id !== this.playerId));
      const altFor = new Map<number, WeaponId>();
      conf.botAlt[team].forEach((id, i) => {
        if (bots[i]) altFor.set(bots[i].id, id);
      });
      members.forEach((e, i) => {
        const [c, r] = spawns[i % spawns.length];
        const p = cellCenter(c, r);
        p.x += (Math.random() - 0.5) * 0.6;
        p.z += (Math.random() - 0.5) * 0.6;
        copyTo(e.pos, p);
        copyTo(e.prevPos, p);
        e.vel = v3();
        e.onGround = true;
        e.isBot = e.id !== this.playerId;
        e.alive = true;
        e.hp = 100;
        e.armor = conf.armor;
        e.helmet = conf.helmet;
        e.hasBomb = false;
        e.planting = false;
        e.plantProgress = 0;
        e.defusing = false;
        e.recoilPitch = 0;
        e.recoilYaw = 0;
        e.spreadAccum = 0;
        e.shotsFired = 0;
        e.scope = 0;
        e.resumeScope = 0;
        e.reloadUntil = 0;
        e.drawUntil = 0;
        e.nextFire = 0;
        e.triggerLatch = false;
        e.visibleEnemies = [];
        e.spottedUntil = { T: 0, CT: 0 };
        e.input = emptyInput();
        // face towards the middle of the map
        e.yaw = team === 'T' ? 0 : Math.PI;
        e.pitch = 0;
        const pId = conf.primary[team];
        let sId: WeaponId = conf.secondary[team];
        let primary: WeaponId | null = pId;
        const alt = altFor.get(e.id);
        if (alt) {
          if (WEAPONS[alt].slot === 'primary') primary = alt;
          else sId = alt;
        }
        if (e.id === this.playerId) {
          if (this.playerPrefs.secondary) sId = this.playerPrefs.secondary;
          if (conf.allowPrimary && this.playerPrefs.primary) primary = this.playerPrefs.primary;
        }
        e.weapons = {
          primary: primary ? makeWeapon(primary) : null,
          secondary: makeWeapon(sId),
          melee: makeWeapon('knife'),
        };
        e.slot = primary ? 'primary' : 'secondary';
        e.prevSlot = primary ? 'secondary' : 'melee';
      });
    }

    // Bomb to a random T (bots or player)
    const ts = this.entities.filter((e) => e.team === 'T');
    const carrier = pick(ts);
    carrier.hasBomb = true;
    this.bomb = {
      state: 'carried',
      carrierId: carrier.id,
      pos: clone(carrier.pos),
      site: null,
      timeLeft: 0,
      nextBeep: 0,
      defuserId: -1,
      defuseProgress: 0,
    };

    // AI roles: T split 3/2 between main and alternative routes; CT 2A/1mid/2B.
    // (the player's own entity also gets a role so it can be AI-driven headless)
    const tBots = shuffle(ts.slice());
    // carrier always on main route
    tBots.sort((a, b) => (b.hasBomb ? 1 : 0) - (a.hasBomb ? 1 : 0));
    tBots.forEach((e, i) => this.brains.get(e.id)!.resetRound(i < 3 ? 'main' : 'alt'));
    const ctRoles: ('A' | 'B' | 'mid')[] = shuffle(['A', 'A', 'B', 'B', 'mid']);
    const ctBots = this.entities.filter((e) => e.team === 'CT');
    ctBots.forEach((e, i) => this.brains.get(e.id)!.resetRound(ctRoles[i % ctRoles.length]));

    this.emit({ type: 'roundStart', round: this.round, roundType: this.roundType });
  }

  canBuy(): boolean {
    const p = this.player;
    if (!p.alive || this.controlledId !== this.playerId) return false;
    if (this.phase === 'freeze') return true;
    return this.phase === 'live' && this.time - this.liveStart < BUY_TIME;
  }

  /** Buy-menu selection for the local player (free in this prototype). */
  buy(id: WeaponId): boolean {
    if (!this.canBuy()) return false;
    const def = WEAPONS[id];
    const conf = ROUND_CONFIG[this.roundType];
    const p = this.player;
    if (def.slot === 'primary') {
      if (!conf.allowPrimary || !PRIMARY_IDS.includes(id)) return false;
      this.playerPrefs.primary = id;
    } else if (def.slot === 'secondary') {
      if (!SECONDARY_IDS.includes(id)) return false;
      this.playerPrefs.secondary = id;
    } else return false;
    p.weapons[def.slot] = makeWeapon(id);
    p.slot = 'melee'; // force a proper switch
    this.switchTo(p, def.slot);
    return true;
  }

  private endRound(winner: Team, reason: string) {
    if (this.phase !== 'live') return;
    this.phase = 'post';
    this.phaseEnd = this.time + POST_ROUND_TIME;
    this.score[winner]++;
    this.lastWinner = winner;
    this.lastReason = reason;
    this.emit({ type: 'roundEnd', winner, reason });
    if (this.score[winner] >= this.cfg.winsToMatch) {
      this.matchWinner = winner;
      this.emit({ type: 'matchOver', winner });
    }
  }

  private updatePhase() {
    if (this.phase === 'freeze' && this.time >= this.phaseEnd) {
      this.phase = 'live';
      this.liveStart = this.time;
      this.roundEndsAt = this.time + ROUND_TIME;
      this.emit({ type: 'roundLive' });
    } else if (this.phase === 'live') {
      if (this.bomb.state !== 'planted' && this.time >= this.roundEndsAt) {
        this.endRound('CT', '时间耗尽，炸弹未安放');
      }
    } else if (this.phase === 'post' && this.time >= this.phaseEnd) {
      if (this.matchWinner) this.phase = 'over';
      else this.startRound();
    }
  }

  private checkWin() {
    let t = 0;
    let ct = 0;
    for (const e of this.entities) if (e.alive) e.team === 'T' ? t++ : ct++;
    if (ct === 0) this.endRound('T', 'CT 全部阵亡');
    else if (t === 0 && this.bomb.state !== 'planted') this.endRound('CT', 'T 全部阵亡');
  }

  restartMatch() {
    this.score = { T: 0, CT: 0 };
    this.round = 0;
    this.matchWinner = null;
    for (const e of this.entities) {
      e.kills = 0;
      e.deaths = 0;
    }
    this.startRound();
  }

  // ------------------------------------------------------------------ main step

  emit(ev: SimEvent) {
    this.events.push(ev);
  }

  step(dt: number) {
    this.time += dt;
    for (const e of this.entities) copyTo(e.prevPos, e.pos);
    this.updatePhase();

    this.visTimer -= dt;
    if (this.visTimer <= 0) {
      this.visTimer = 0.1;
      this.updateVisibility();
    }

    for (const e of this.entities) {
      if (e.alive && e.isBot && e.id !== this.controlledId) this.brains.get(e.id)!.update(dt);
    }
    for (const e of this.entities) if (e.alive) this.updateEntity(e, dt);
    this.separate();
    this.updateBomb(dt);
    if (this.phase === 'live') this.checkWin();
  }

  // ------------------------------------------------------------------ entities

  switchTo(e: Entity, slot: Slot) {
    const w = e.weapons[slot];
    if (!w || slot === e.slot) return;
    e.prevSlot = e.slot;
    e.slot = slot;
    e.reloadUntil = 0;
    e.scope = 0;
    e.resumeScope = 0;
    e.shotsFired = 0;
    e.drawUntil = this.time + w.def.drawTime * 0.7;
    e.planting = false;
    this.emit({ type: 'switch', id: e.id, weapon: w.def.id });
  }

  private startReload(e: Entity) {
    const w = this.currentWeapon(e);
    const d = w.def;
    if (d.slot === 'melee' || e.reloadUntil > 0 || w.mag >= d.magSize || w.reserve <= 0) return;
    if (this.time < e.drawUntil) return;
    e.reloadUntil = this.time + d.reloadTime;
    e.reloadStart = this.time;
    e.scope = 0;
    e.resumeScope = 0;
    this.emit({ type: 'reload', id: e.id, weapon: d.id, time: d.reloadTime });
  }

  spreadOf(e: Entity): number {
    const d = this.currentWeapon(e).def;
    const hs = Math.hypot(e.vel.x, e.vel.z);
    const moveF = clamp((hs - 1.3) / 3.5, 0, 1);
    let s: number;
    if (d.scopeFov) {
      s = e.scope > 0 ? d.scopedSpread! : d.spreadBase;
      s += d.spreadMove * moveF;
    } else {
      s = d.spreadBase + e.spreadAccum + d.spreadMove * moveF;
    }
    if (!e.onGround) s += d.spreadAir;
    return s;
  }

  private updateEntity(e: Entity, dt: number) {
    const inp = e.input;
    const frozen = this.phase === 'freeze' || this.phase === 'over';
    const now = this.time;

    if (inp.switchSlot) {
      this.switchTo(e, inp.switchSlot);
      inp.switchSlot = null;
    }
    const w = this.currentWeapon(e);
    const def = w.def;

    // reload
    if (inp.reload) {
      inp.reload = false;
      this.startReload(e);
    }
    if (e.reloadUntil > 0 && now >= e.reloadUntil) {
      const take = Math.min(def.magSize - w.mag, w.reserve);
      w.mag += take;
      w.reserve -= take;
      e.reloadUntil = 0;
      this.emit({ type: 'reloadDone', id: e.id });
    }

    // alt fire: scope or knife stab
    if (inp.alt) {
      inp.alt = false;
      if (def.scopeFov && e.reloadUntil === 0 && now >= e.drawUntil) {
        e.scope = (e.scope + 1) % (def.scopeFov.length + 1);
        e.resumeScope = 0;
        this.emit({ type: 'scope', id: e.id, level: e.scope });
      } else if (def.slot === 'melee' && !frozen && now >= e.nextFire && now >= e.drawUntil) {
        this.knifeAttack(e, true);
      }
    }
    if (e.resumeScope > 0 && now >= e.resumeScopeAt) {
      if (e.reloadUntil === 0 && def.scopeFov && w.mag > 0) {
        e.scope = e.resumeScope;
        this.emit({ type: 'scope', id: e.id, level: e.scope });
      }
      e.resumeScope = 0;
    }

    // plant
    const canPlant = e.team === 'T' && e.hasBomb && inp.use && e.onGround && this.phase === 'live' && siteAt(e.pos.x, e.pos.z) !== null;
    if (canPlant) {
      if (!e.planting) {
        e.planting = true;
        e.plantProgress = 0;
        this.emit({ type: 'plantStart', id: e.id, pos: clone(e.pos) });
      }
      e.plantProgress += dt;
      if (e.plantProgress >= PLANT_TIME) this.plantBomb(e);
    } else if (e.planting) {
      e.planting = false;
      e.plantProgress = 0;
    }
    e.defusing = this.bomb.state === 'planted' && this.bomb.defuserId === e.id;

    // movement
    let speed = def.speed;
    if (e.scope > 0 && def.scopedSpeed) speed = def.scopedSpeed;
    if (inp.walk) speed *= 0.52;
    const lock = frozen || e.planting || e.defusing;
    let mf = lock ? 0 : inp.moveF;
    let mr = lock ? 0 : inp.moveR;
    const ml = Math.hypot(mf, mr);
    if (ml > 1) {
      mf /= ml;
      mr /= ml;
    }
    const sy = Math.sin(e.yaw);
    const cy = Math.cos(e.yaw);
    const wishX = (-sy * mf + cy * mr) * speed;
    const wishZ = (-cy * mf - sy * mr) * speed;
    const k = e.onGround ? 11 : 1.2;
    const a = 1 - Math.exp(-k * dt);
    e.vel.x += (wishX - e.vel.x) * a;
    e.vel.z += (wishZ - e.vel.z) * a;
    if (inp.jump && e.onGround && !lock) {
      e.vel.y = JUMP_SPEED;
      e.onGround = false;
    }
    const res = this.world.step(e, dt);
    if (res.landed && res.fallSpeed > 3) {
      this.emit({ type: 'land', id: e.id, pos: clone(e.pos) });
      this.noise(e, 14);
    }
    if (e.onGround) {
      const hs = Math.hypot(e.vel.x, e.vel.z);
      if (hs > 2.2 && !inp.walk) {
        e.stepAccum += hs * dt;
        if (e.stepAccum > 2.3) {
          e.stepAccum = 0;
          this.emit({ type: 'footstep', id: e.id, pos: clone(e.pos), loud: clamp(hs / 5.5, 0.4, 1) });
          this.noise(e, 18);
        }
      }
    }

    // recoil & spread recovery
    if (now - e.lastShotTime > def.fireInterval * 1.3 + 0.02) {
      const r = Math.exp(-def.recoilRecover * dt);
      e.recoilPitch *= r;
      e.recoilYaw *= r;
      e.spreadAccum = Math.max(0, e.spreadAccum - def.spreadRecover * dt);
      if (now - e.lastShotTime > 0.35) e.shotsFired = 0;
    }

    // fire
    if (!inp.fire) {
      e.triggerLatch = false;
      e.dryLatch = false;
    } else if (!frozen && !e.planting && !e.defusing) {
      if (def.auto || !e.triggerLatch) this.tryFire(e);
      e.triggerLatch = true;
    }
  }

  private tryFire(e: Entity) {
    const now = this.time;
    const w = this.currentWeapon(e);
    const d = w.def;
    if (now < e.nextFire || now < e.drawUntil) return;
    if (d.slot === 'melee') {
      this.knifeAttack(e, false);
      return;
    }
    if (e.reloadUntil > 0) return;
    if (w.mag <= 0) {
      if (!e.dryLatch) {
        e.dryLatch = true;
        this.emit({ type: 'dryfire', id: e.id });
      }
      if (w.reserve > 0) this.startReload(e);
      return;
    }
    w.mag--;
    e.nextFire = now + d.fireInterval;
    const spread = this.spreadOf(e);
    const yaw = e.yaw + e.recoilYaw;
    const pitch = e.pitch + e.recoilPitch;
    const ang = Math.random() * Math.PI * 2;
    const rad = spread * Math.pow(Math.random(), 0.75);
    const dir = dirFromYawPitch(
      yaw + (Math.cos(ang) * rad) / Math.max(0.2, Math.cos(pitch)),
      pitch + Math.sin(ang) * rad,
    );

    // recoil
    e.shotsFired++;
    e.lastShotTime = now;
    const n = e.shotsFired;
    const kick = d.recoilPitch * (n === 1 ? 0.65 : n > 12 ? 0.3 : 1);
    e.recoilPitch = Math.min(d.recoilMax, e.recoilPitch + kick);
    const sway = n > 4 ? Math.sin(n * 0.55) * 1.7 : (Math.random() - 0.5) * 1.2;
    e.recoilYaw = clamp(e.recoilYaw + d.recoilYaw * sway, -d.recoilMax * 0.5, d.recoilMax * 0.5);
    e.spreadAccum = Math.min(d.spreadMax, e.spreadAccum + d.spreadPerShot);
    if (d.scopeFov && e.scope > 0) {
      // bolt action: drop out of the scope, re-zoom after the bolt cycles
      e.resumeScope = e.scope;
      e.resumeScopeAt = now + d.fireInterval * 0.85;
      e.scope = 0;
    }

    this.fireHitscan(e, d, dir);
    this.noise(e, d.id === 'usp' ? 22 : 45);
  }

  private fireHitscan(e: Entity, d: WeaponDef, dir: V3) {
    const o = this.eyePos(e);
    const wall = this.world.raycast(o, dir, d.range);
    let hitT = wall ? wall.t : d.range;
    let hitE: Entity | null = null;
    let hitG: HitGroup = 'chest';
    for (const other of this.entities) {
      if (!other.alive || other.team === e.team) continue;
      const cx = other.pos.x - o.x;
      const cy = other.pos.y + 0.9 - o.y;
      const cz = other.pos.z - o.z;
      const tc = cx * dir.x + cy * dir.y + cz * dir.z;
      if (tc < -1 || tc > hitT + 1) continue;
      const px = cx - dir.x * tc;
      const py = cy - dir.y * tc;
      const pz = cz - dir.z * tc;
      if (px * px + py * py + pz * pz > 1.6) continue;
      const r = rayVsCharacter(o, dir, hitT, other.pos, other.yaw);
      if (r) {
        hitT = r.t;
        hitE = other;
        hitG = r.group;
      }
    }
    const end = { x: o.x + dir.x * hitT, y: o.y + dir.y * hitT, z: o.z + dir.z * hitT };
    this.emit({
      type: 'shot',
      shooter: e.id,
      weapon: d.id,
      sound: d.sound,
      origin: o,
      end,
      hitEntity: hitE ? hitE.id : null,
      wallNormal: !hitE && wall && wall.t <= hitT + 1e-3 ? wall.normal : null,
    });
    if (hitE) {
      const dmg = d.damage * Math.pow(d.rangeMod, hitT / 10);
      this.applyDamage(e, hitE, dmg, hitG, d, end);
    }
  }

  private knifeAttack(e: Entity, stab: boolean) {
    const d = WEAPONS.knife;
    e.nextFire = this.time + (stab ? d.altInterval! : d.fireInterval);
    const o = this.eyePos(e);
    const dir = dirFromYawPitch(e.yaw, e.pitch);
    const wall = this.world.raycast(o, dir, d.range);
    const maxT = wall ? wall.t : d.range;
    let best: Entity | null = null;
    let group: HitGroup = 'chest';
    let bestT = maxT;
    for (const other of this.entities) {
      if (!other.alive || other.team === e.team) continue;
      const r = rayVsCharacter(o, dir, bestT, other.pos, other.yaw);
      if (r) {
        best = other;
        bestT = r.t;
        group = r.group;
      }
    }
    if (!best) {
      // forgiving melee cone
      for (const other of this.entities) {
        if (!other.alive || other.team === e.team) continue;
        const dx = other.pos.x - e.pos.x;
        const dz = other.pos.z - e.pos.z;
        const dd = Math.hypot(dx, dz);
        if (dd > 1.6 || dd < 1e-3) continue;
        if ((dx * dir.x + dz * dir.z) / dd > 0.8 && this.world.lineClear(o, this.eyePos(other))) {
          best = other;
          group = 'chest';
          break;
        }
      }
    }
    this.emit({ type: 'knife', shooter: e.id, hit: !!best, stab });
    this.noise(e, 8);
    if (best) {
      const fwd = dirFromYawPitch(best.yaw, 0);
      const back = fwd.x * dir.x + fwd.z * dir.z > 0.5; // attacking from behind
      let dmg = stab ? d.altDamage! : d.damage;
      if (back) dmg *= stab ? 2.8 : 2;
      // knife ignores hitgroup multipliers (but keeps the zone label)
      this.applyDamage(e, best, dmg / HIT_MULT[group], group, d, this.eyePos(best));
    }
  }

  applyDamage(attacker: Entity, victim: Entity, base: number, group: HitGroup, d: WeaponDef, point: V3) {
    if (!victim.alive) return;
    let dmg = base * HIT_MULT[group];
    const armored = victim.armor > 0 && group !== 'leg' && (group !== 'head' || victim.helmet);
    if (armored) {
      const hpDmg = dmg * d.armorPen;
      victim.armor = Math.max(0, Math.round(victim.armor - (dmg - hpDmg) * 0.5));
      dmg = hpDmg;
    }
    dmg = Math.max(1, Math.round(dmg));
    victim.hp -= dmg;
    victim.lastDamageTime = this.time;
    victim.lastAttackerId = attacker.id;
    this.emit({ type: 'damage', attacker: attacker.id, victim: victim.id, amount: dmg, group, armorHit: armored, point });
    this.intel[victim.team].set(attacker.id, { pos: clone(attacker.pos), time: this.time });
    if (victim.isBot) this.brains.get(victim.id)!.onDamaged(attacker);
    if (victim.hp <= 0) this.kill(victim, attacker, d.icon, group === 'head');
  }

  kill(victim: Entity, killer: Entity | null, weapon: string, headshot: boolean) {
    victim.alive = false;
    victim.hp = 0;
    victim.deaths++;
    victim.deathTime = this.time;
    victim.planting = false;
    victim.defusing = false;
    victim.scope = 0;
    victim.vel = v3();
    if (killer && killer !== victim) killer.kills++;
    if (victim.hasBomb) this.dropBomb(victim);
    if (this.bomb.defuserId === victim.id) {
      this.bomb.defuserId = -1;
      this.bomb.defuseProgress = 0;
    }
    this.emit({ type: 'kill', killer: killer ? killer.id : -1, victim: victim.id, weapon, headshot });
  }

  // ------------------------------------------------------------------ perception

  private updateVisibility() {
    const fovCos = Math.cos((70 * Math.PI) / 180);
    for (const a of this.entities) a.visibleEnemies.length = 0;
    for (const a of this.entities) {
      if (!a.alive) continue;
      const eye = this.eyePos(a);
      const fx = -Math.sin(a.yaw);
      const fz = -Math.cos(a.yaw);
      for (const b of this.entities) {
        if (!b.alive || b.team === a.team) continue;
        const dx = b.pos.x - eye.x;
        const dz = b.pos.z - eye.z;
        const hd = Math.hypot(dx, dz);
        if (hd > 130) continue;
        if (hd > 3 && (dx * fx + dz * fz) / hd < fovCos) continue;
        const head = { x: b.pos.x, y: b.pos.y + 1.62, z: b.pos.z };
        const chest = { x: b.pos.x, y: b.pos.y + 1.2, z: b.pos.z };
        const legs = { x: b.pos.x, y: b.pos.y + 0.5, z: b.pos.z };
        if (this.world.lineClear(eye, head) || this.world.lineClear(eye, chest) || this.world.lineClear(eye, legs)) {
          a.visibleEnemies.push(b.id);
          b.spottedUntil[a.team] = this.time + 0.4;
          this.intel[a.team].set(b.id, { pos: clone(b.pos), time: this.time });
        }
      }
    }
  }

  /** Enemy pressure per site as known by the given team (from recent intel). */
  sitePressure(team: Team): Record<SiteId, number> {
    const out: Record<SiteId, number> = { A: 0, B: 0 };
    for (const [id, info] of this.intel[team]) {
      const e = this.byId.get(id);
      if (!e || !e.alive || this.time - info.time > 6) continue;
      const reg = regionAt(info.pos.x, info.pos.z);
      if (!reg) continue;
      if (A_PRESSURE.has(reg.id)) out.A++;
      else if (B_PRESSURE.has(reg.id)) out.B++;
    }
    return out;
  }

  /** Sound propagation: enemy bots in range hear the noise. */
  private noise(src: Entity, radius: number) {
    for (const e of this.entities) {
      if (!e.alive || !e.isBot || e.team === src.team || e.id === this.controlledId) continue;
      if (dist2D(e.pos, src.pos) < radius) this.brains.get(e.id)!.onHear(src.pos);
    }
  }

  private separate() {
    const list = this.entities.filter((e) => e.alive);
    for (let i = 0; i < list.length; i++)
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i];
        const b = list[j];
        if (Math.abs(a.pos.y - b.pos.y) > 1.6) continue;
        const dx = b.pos.x - a.pos.x;
        const dz = b.pos.z - a.pos.z;
        const min = a.radius + b.radius;
        const d2 = dx * dx + dz * dz;
        if (d2 >= min * min) continue;
        const d = Math.sqrt(d2) || 0.01;
        const push = (min - d) / 2;
        const nx = d2 > 1e-6 ? dx / d : 1;
        const nz = d2 > 1e-6 ? dz / d : 0;
        a.pos.x -= nx * push;
        a.pos.z -= nz * push;
        b.pos.x += nx * push;
        b.pos.z += nz * push;
        this.world.resolveHorizontal(a);
        this.world.resolveHorizontal(b);
      }
  }

  // ------------------------------------------------------------------ bomb

  private dropBomb(e: Entity) {
    e.hasBomb = false;
    e.planting = false;
    this.bomb.state = 'dropped';
    this.bomb.carrierId = -1;
    this.bomb.pos = { x: e.pos.x, y: this.world.groundHeight(e.pos.x, e.pos.z, 0.2, e.pos.y + 0.1), z: e.pos.z };
    this.emit({ type: 'bombDrop', pos: clone(this.bomb.pos) });
  }

  private plantBomb(e: Entity) {
    const site = siteAt(e.pos.x, e.pos.z);
    if (!site) return;
    e.hasBomb = false;
    e.planting = false;
    e.plantProgress = 0;
    this.bomb.state = 'planted';
    this.bomb.carrierId = -1;
    this.bomb.pos = clone(e.pos);
    this.bomb.site = site;
    this.bomb.timeLeft = BOMB_TIMER;
    this.bomb.nextBeep = 0;
    this.bomb.defuserId = -1;
    this.bomb.defuseProgress = 0;
    this.emit({ type: 'planted', id: e.id, pos: clone(e.pos), site });
    // Everyone knows the bomb has been planted (announcer).
  }

  private updateBomb(dt: number) {
    const b = this.bomb;
    if (b.state === 'carried') {
      const c = this.byId.get(b.carrierId);
      if (c) copyTo(b.pos, c.pos);
    } else if (b.state === 'dropped') {
      if (this.phase === 'freeze' || this.phase === 'over') return;
      for (const e of this.entities) {
        if (!e.alive || e.team !== 'T') continue;
        if (dist2D(e.pos, b.pos) < BOMB_PICKUP_RANGE && Math.abs(e.pos.y - b.pos.y) < 1.5) {
          e.hasBomb = true;
          b.state = 'carried';
          b.carrierId = e.id;
          this.emit({ type: 'bombPickup', id: e.id });
          break;
        }
      }
    } else if (b.state === 'planted') {
      b.timeLeft -= dt;
      b.nextBeep -= dt;
      if (b.nextBeep <= 0) {
        const frac = Math.max(0, b.timeLeft / BOMB_TIMER);
        b.nextBeep = 0.12 + 0.9 * frac;
        this.emit({ type: 'bombBeep', pos: clone(b.pos), urgency: 1 - frac });
      }
      // defuse
      let defuser = b.defuserId >= 0 ? this.byId.get(b.defuserId) : undefined;
      if (defuser && !(defuser.alive && defuser.input.use && dist2D(defuser.pos, b.pos) < DEFUSE_RANGE)) {
        defuser = undefined;
        b.defuserId = -1;
        b.defuseProgress = 0;
      }
      if (!defuser) {
        for (const e of this.entities) {
          if (e.alive && e.team === 'CT' && e.input.use && e.onGround && dist2D(e.pos, b.pos) < DEFUSE_RANGE) {
            defuser = e;
            b.defuserId = e.id;
            b.defuseProgress = 0;
            e.planting = false;
            this.emit({ type: 'defuseStart', id: e.id, pos: clone(b.pos) });
            break;
          }
        }
      }
      if (defuser && this.phase !== 'over') {
        b.defuseProgress += dt;
        if (b.defuseProgress >= DEFUSE_TIME && b.timeLeft > 0) {
          b.state = 'defused';
          b.defuserId = -1;
          defuser.defusing = false;
          this.emit({ type: 'defused', id: defuser.id, pos: clone(b.pos) });
          this.endRound('CT', '炸弹已被拆除');
          return;
        }
      }
      if (b.timeLeft <= 0) this.explode();
    }
  }

  private explode() {
    const b = this.bomb;
    b.state = 'exploded';
    b.defuserId = -1;
    this.emit({ type: 'explode', pos: clone(b.pos) });
    this.endRound('T', '炸弹已爆炸');
    for (const e of this.entities) {
      if (!e.alive) continue;
      const d = Math.hypot(e.pos.x - b.pos.x, e.pos.y - b.pos.y, e.pos.z - b.pos.z);
      if (d > BOMB_KILL_RADIUS) continue;
      const dmg = Math.round(500 * Math.pow(1 - d / BOMB_KILL_RADIUS, 1.6));
      if (dmg <= 0) continue;
      e.hp -= dmg;
      if (e.hp <= 0) this.kill(e, null, 'C4', false);
    }
  }

  // ------------------------------------------------------------------ player helpers

  /** Living teammates of the local player that can be spectated / taken over. */
  spectateCandidates(): Entity[] {
    return this.entities.filter((e) => e.alive && e.team === this.cfg.playerTeam && e.id !== this.controlledId);
  }

  takeOver(id: number): boolean {
    if (this.controlled.alive) return false;
    const t = this.byId.get(id);
    if (!t || !t.alive || t.team !== this.cfg.playerTeam) return false;
    t.isBot = false;
    t.input = emptyInput();
    this.controlledId = id;
    this.emit({ type: 'takeover', id });
    return true;
  }

  bombTimeLeft() {
    return this.bomb.state === 'planted' ? Math.max(0, this.bomb.timeLeft) : 0;
  }
  roundTimeLeft() {
    if (this.phase === 'freeze') return Math.max(0, this.phaseEnd - this.time);
    if (this.phase === 'live') return Math.max(0, this.roundEndsAt - this.time);
    return 0;
  }
}
