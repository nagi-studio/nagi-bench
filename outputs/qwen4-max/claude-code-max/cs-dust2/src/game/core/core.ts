import type {
  Bomb, Entity, GameEvent, HudEntityDot, HudPlayer, InputState, KillEvent,
  RoundState, Slot, Snapshot, Team, Vec3, WeaponId,
} from './types.ts';
import type { MapData } from './map.ts';
import { buildMap, findPath, areaAt, raycastWorld } from './map.ts';
import { CFG, DEG, PLAYER_NAME } from './config.ts';
import { clone, clamp, dist, dist2, dirFromYawPitch, pick, rand, randInt, v3, angleDiff } from './vecmath.ts';
import { moveEntity, separate } from './physics.ts';
import { activeWeapon, buildTeams, respawn, switchSlot, resetIds } from './entities.ts';
import { WEAPONS, computeDamage, fireInterval, makeWeapon, defaultSecondary } from './weapons.ts';
import { eyePos, hitscan, applySpread } from './combat.ts';
import { aiUpdate, initAI, assignAttack, ROUTES } from './ai.ts';
import { botBuy, buyItem, clampMoney, lossReward, teamAlive } from './round.ts';

export function defaultInput(): InputState {
  return {
    forward: 0, right: 0, jump: false, walk: false,
    fire: false, firePressed: false, ads: false, adsPressed: false,
    reload: false, use: false, usePressed: false, slot: null, quickSwitch: false, buy: false,
  };
}

interface Seen { pos: Vec3; time: number }

export class GameCore {
  map: MapData;
  entities: Entity[] = [];
  bomb: Bomb;
  round: RoundState;
  time = 0;
  playerTeam: Team = 'CT';
  playerEntityId = -1;
  controlledId = -1;
  viewId = -1;
  spectating = false;
  input: InputState = defaultInput();
  events: GameEvent[] = [];
  killfeed: KillEvent[] = [];
  running = false;
  paused = false;
  buyOpen = false;
  matchWinner: Team | null = null;
  fps = 60;
  lastPlayerHit = -10;
  lastPlayerHeadshot = false;
  lastPlayerKill = -10;
  lastPlayerHurt = -10;
  teamSeen: Record<Team, Map<number, Seen>> = { CT: new Map(), T: new Map() };
  private seenAccum = 0;
  private planSite: 'A' | 'B' = 'A';
  private roundIndex = 0;

  constructor(map?: MapData) {
    this.map = map ?? buildMap();
    this.bomb = {
      state: 'carried', pos: v3(), carrierId: null, planterId: null, retrieverId: null, site: null,
      timer: CFG.bombTimer, defuseProgress: 0, defuserId: null, beepT: 0,
    };
    this.round = {
      phase: 'freeze', number: 0, pistol: true, timer: CFG.freezeTime,
      scoreCT: 0, scoreT: 0, winner: null, reason: '', lossStreakCT: 0, lossStreakT: 0, mvpId: null,
    };
  }

  emit(ev: GameEvent): void {
    this.events.push(ev);
  }

  drainEvents(): GameEvent[] {
    const e = this.events;
    this.events = [];
    return e;
  }

  byId(id: number): Entity | undefined {
    return this.entities.find((e) => e.id === id);
  }

  get controlled(): Entity | undefined {
    return this.byId(this.controlledId);
  }
  get view(): Entity | undefined {
    return this.byId(this.viewId);
  }
  get playerEntity(): Entity | undefined {
    return this.byId(this.playerEntityId);
  }

  // ---- Match / round lifecycle --------------------------------------------

  startMatch(team: Team): void {
    resetIds();
    this.playerTeam = team;
    this.entities = buildTeams(team, true, this.map.spawns, this.map.spawnYaw);
    this.playerEntityId = this.entities.find((e) => e.isPlayerSlot)!.id;
    this.round.scoreCT = 0;
    this.round.scoreT = 0;
    this.round.lossStreakCT = 0;
    this.round.lossStreakT = 0;
    this.matchWinner = null;
    this.killfeed = [];
    this.time = 0;
    this.running = true;
    this.paused = false;
    this.startRound(1);
  }

  private routeFor(site: 'A' | 'B', i: number): 'longA' | 'midShort' | 'splitA' | 'tunnelsB' | 'midB' {
    if (site === 'A') return (['longA', 'midShort', 'splitA'] as const)[i % 3];
    return (['tunnelsB', 'midB'] as const)[i % 2];
  }

  startRound(n: number): void {
    this.round.number = n;
    this.round.pistol = n === 1;
    this.round.winner = null;
    this.round.reason = '';
    this.round.phase = 'freeze';
    this.round.timer = CFG.freezeTime;
    this.round.mvpId = null;
    this.buyOpen = false;
    this.roundIndex++;

    const pistol = this.round.pistol;
    // Respawn everyone.
    const teamCount: Record<Team, number> = { CT: 0, T: 0 };
    for (const e of this.entities) {
      const idx = teamCount[e.team]++;
      const spawn = this.map.spawns[e.team][idx % 5];
      respawn(e, spawn, this.map.spawnYaw[e.team], pistol, true);
      e.bot = !e.isPlayerSlot;
      e.ai = null;
    }
    // Player auto loadout.
    const pe = this.playerEntity;
    if (pe) {
      if (!pistol) {
        const rifle: WeaponId = pe.team === 'T' ? 'ak47' : 'm4a4';
        pe.inv.primary = makeWeapon(rifle);
        pe.activeSlot = 'primary';
        pe.armor = 100;
        pe.helmet = true;
        if (pe.team === 'CT') pe.kit = true;
      } else {
        pe.armor = 0;
        pe.helmet = false;
      }
    }

    // Bomb carrier.
    const ts = this.entities.filter((e) => e.team === 'T');
    const carrier = pick(ts);
    for (const e of this.entities) e.bombCarrier = false;
    carrier.bombCarrier = true;
    this.bomb.state = 'carried';
    this.bomb.carrierId = carrier.id;
    this.bomb.pos = clone(carrier.pos);
    this.bomb.planterId = null;
    this.bomb.retrieverId = null;
    this.bomb.site = null;
    this.bomb.timer = CFG.bombTimer;
    this.bomb.defuseProgress = 0;
    this.bomb.defuserId = null;
    this.bomb.beepT = 0;

    // Attack plan.
    this.planSite = pick(['A', 'B'] as const);
    let tIdx = 0;
    let ctIdx = 0;
    for (const e of this.entities) {
      if (e.bot) {
        const index = e.team === 'T' ? tIdx++ : ctIdx++;
        initAI(e, index, this.time);
        botBuy(e, pistol, index === 4);
        if (e.team === 'T') {
          assignAttack(e, this.planSite, this.routeFor(this.planSite, index));
        } else if (e.ai) {
          e.ai.hold = v3(e.ai.hold.x + rand(-2, 2), 0, e.ai.hold.z + rand(-2, 2));
        }
      }
    }

    this.controlledId = this.playerEntityId;
    this.viewId = this.playerEntityId;
    this.spectating = false;
    this.teamSeen.CT.clear();
    this.teamSeen.T.clear();
    this.emit({ type: 'roundStart', pistol });
  }

  private endRound(winner: Team, reason: string): void {
    if (this.round.phase === 'roundend' || this.round.phase === 'matchend') return;
    this.round.winner = winner;
    this.round.reason = reason;
    this.round.phase = 'roundend';
    this.round.timer = CFG.roundEndTime;
    if (winner === 'CT') {
      this.round.scoreCT++;
      this.round.lossStreakCT = 0;
      this.round.lossStreakT++;
    } else {
      this.round.scoreT++;
      this.round.lossStreakT = 0;
      this.round.lossStreakCT++;
    }
    for (const e of this.entities) {
      const streak = e.team === 'CT' ? this.round.lossStreakCT : this.round.lossStreakT;
      const reward = e.team === winner ? CFG.winReward : lossReward(streak);
      e.money = clampMoney(e.money + reward);
    }
    if (this.round.scoreCT >= CFG.winScore) this.matchWinner = 'CT';
    else if (this.round.scoreT >= CFG.winScore) this.matchWinner = 'T';
    this.emit({ type: 'roundEnd', winner, reason });
  }

  // ---- Main step -----------------------------------------------------------

  update(dt: number): void {
    if (!this.running || this.paused) return;
    this.time += dt;
    this.updateRoundPhase(dt);

    const phase = this.round.phase;
    const controllable = phase === 'live' || phase === 'planted';

    // Controlled entity input.
    const ce = this.controlled;
    if (ce && ce.alive && !this.spectating) {
      this.updatePlayer(ce, dt, controllable);
    }
    this.consumeEdges();

    // AI.
    if (controllable || phase === 'freeze') {
      for (const e of this.entities) {
        if (e.bot && e.alive && e.ai) {
          if (phase === 'freeze') {
            // idle in place during freeze
            moveEntity(this.map, e, { wishX: 0, wishZ: 0, speed: 0, jump: false, dt });
          } else {
            aiUpdate(this, e, dt);
          }
        }
      }
    }

    // Separation between living agents.
    for (let i = 0; i < this.entities.length; i++) {
      for (let j = i + 1; j < this.entities.length; j++) {
        const a = this.entities[i], b = this.entities[j];
        if (a.alive && b.alive) separate(a, b);
      }
    }

    // Weapon timers / animation state.
    for (const e of this.entities) {
      this.updateWeapon(e, dt);
      if (e.hitFlash > 0) e.hitFlash -= dt;
      if (e.alive) {
        e.walkPhase += e.speed * dt * 1.7;
        // footsteps
        if (e.onGround && e.speed > 1.2) {
          e.footAccum += e.speed * dt;
          const stride = e.speed > 4 ? 2.2 : 1.7;
          if (e.footAccum >= stride) {
            e.footAccum = 0;
            const loud = !this.input.walk || e.id !== this.controlledId;
            this.emit({ type: 'footstep', entityId: e.id, pos: clone(e.pos), loud });
          }
        }
      }
    }

    this.updateActions(dt);
    this.updateBomb(dt);
    this.updateTeamSeen(dt);
    this.checkWin();
  }

  private consumeEdges(): void {
    this.input.firePressed = false;
    this.input.adsPressed = false;
    this.input.usePressed = false;
    this.input.quickSwitch = false;
    this.input.slot = null;
    this.input.reload = false;
    this.input.buy = false;
    this.input.jump = false;
  }

  private updateRoundPhase(dt: number): void {
    const r = this.round;
    if (r.phase === 'freeze') {
      r.timer -= dt;
      if (r.timer <= 0) {
        r.phase = 'live';
        r.timer = CFG.roundTime;
      }
    } else if (r.phase === 'live') {
      r.timer -= dt;
    } else if (r.phase === 'planted') {
      this.bomb.timer -= dt;
      r.timer = this.bomb.timer;
    } else if (r.phase === 'roundend') {
      r.timer -= dt;
      if (r.timer <= 0) {
        if (this.matchWinner) {
          r.phase = 'matchend';
        } else {
          this.startRound(r.number + 1);
        }
      }
    }
  }

  private checkWin(): void {
    const r = this.round;
    if (r.phase === 'live') {
      const ct = teamAlive(this.entities, 'CT');
      const t = teamAlive(this.entities, 'T');
      if (ct === 0) this.endRound('T', 'CT eliminated');
      else if (t === 0) this.endRound('CT', 'T eliminated');
      else if (r.timer <= 0) this.endRound('CT', 'Time expired');
    } else if (r.phase === 'planted') {
      const ct = teamAlive(this.entities, 'CT');
      if (ct === 0) this.endRound('T', 'CT eliminated');
      else if (this.bomb.timer <= 0) this.explodeBomb();
    }
  }

  // ---- Player control ------------------------------------------------------

  private updatePlayer(e: Entity, dt: number, controllable: boolean): void {
    const inp = this.input;
    const w = activeWeapon(e);
    const def = WEAPONS[w.id];

    // Look is applied by input layer directly to e.yaw/pitch (mouse). Recoil recovery:
    if (e.recoilRecover > 0) {
      const rec = Math.min(e.recoilRecover, 4.5 * DEG * dt);
      e.pitch -= rec;
      e.recoilRecover -= rec;
    }

    // Weapon switching.
    if (inp.slot) switchSlot(e, inp.slot, this.time);
    if (inp.quickSwitch) {
      const target: Slot = e.activeSlot === 'primary' ? 'secondary' : (e.inv.primary ? 'primary' : 'melee');
      switchSlot(e, target, this.time);
    }
    if (inp.reload) this.startReload(e);

    // ADS toggle (AWP).
    if (inp.adsPressed && def.scoped) {
      e.scoped = !e.scoped;
      this.emit({ type: 'scope', entityId: e.id, on: e.scoped });
    }
    if (!def.scoped) e.scoped = false;

    if (!controllable) {
      moveEntity(this.map, e, { wishX: 0, wishZ: 0, speed: 0, jump: false, dt });
      return;
    }

    // Movement.
    const sin = Math.sin(e.yaw), cos = Math.cos(e.yaw);
    let wx = sin * inp.forward + cos * inp.right;
    let wz = -cos * inp.forward + sin * inp.right;
    let speed = def.moveSpeed;
    if (inp.walk) speed *= CFG.walkFactor;
    if (e.scoped) speed *= 0.4;
    if (e.action) speed = 0;
    moveEntity(this.map, e, { wishX: wx, wishZ: wz, speed, jump: inp.jump, dt });

    // Fire.
    const wantFire = def.auto ? inp.fire : inp.firePressed;
    if (wantFire && !e.action) {
      const spread = this.currentSpread(e);
      const dir = applySpread(dirFromYawPitch(e.yaw, e.pitch), spread);
      this.shoot(e, dir, false);
    }

    // Use (plant / defuse / pickup).
    if (inp.use) {
      this.tryUse(e);
    } else if (e.action) {
      e.action = null;
      if (this.bomb.defuserId === e.id) this.bomb.defuserId = null;
    }
  }

  currentSpread(e: Entity): number {
    const w = activeWeapon(e);
    const def = WEAPONS[w.id];
    const moving = e.speed > 1.0 ? def.spreadMove : def.spreadBase;
    let s = moving + w.bloom;
    if (def.scoped) s = e.scoped ? 0.02 : def.spreadBase;
    if (!e.onGround) s += 1.5;
    return s;
  }

  private tryUse(e: Entity): void {
    if (e.team === 'T') {
      if (this.bomb.state === 'dropped' && dist2(e.pos, this.bomb.pos) < 1.4) {
        this.tryPickupBomb(e);
        return;
      }
      if (e.bombCarrier && (this.inSite(e.pos, 'A') || this.inSite(e.pos, 'B')) && !e.action && e.speed < 0.6) {
        this.beginPlant(e);
      }
    } else {
      if (this.bomb.state === 'planted' && dist2(e.pos, this.bomb.pos) < 1.8 && !e.action && e.speed < 0.6) {
        this.beginDefuse(e);
      }
    }
  }

  // ---- Shooting ------------------------------------------------------------

  startReload(e: Entity): void {
    const w = activeWeapon(e);
    const def = WEAPONS[w.id];
    if (def.id === 'knife') return;
    if (w.reloading || w.ammo >= def.mag || w.reserve <= 0) return;
    w.reloading = true;
    w.reloadT = def.reloadTime;
    e.scoped = false;
    this.emit({ type: 'reload', entityId: e.id, weapon: w.id });
  }

  private updateWeapon(e: Entity, dt: number): void {
    const w = activeWeapon(e);
    const def = WEAPONS[w.id];
    if (w.reloading) {
      w.reloadT -= dt;
      if (w.reloadT <= 0) {
        w.reloading = false;
        const need = def.mag - w.ammo;
        const take = Math.min(need, w.reserve);
        w.ammo += take;
        w.reserve -= take;
        w.bloom = 0;
        w.spray = 0;
      }
    }
    if (this.time - w.lastShot > 0.35) w.spray = 0;
    if (w.bloom > 0) w.bloom = Math.max(0, w.bloom - def.bloomRecover * dt);
  }

  shoot(e: Entity, dir: Vec3, isBot: boolean): void {
    if (!e.alive) return;
    const w = activeWeapon(e);
    const def = WEAPONS[w.id];
    if (this.time < e.switchT) return;
    if (w.reloading) return;
    if (this.time < w.nextFire) return;

    if (def.id === 'knife') {
      this.doKnife(e);
      return;
    }
    if (w.ammo <= 0) {
      if (!isBot) this.startReload(e);
      return;
    }

    w.ammo--;
    w.nextFire = this.time + fireInterval(w.id);
    w.spray = this.time - w.lastShot < 0.4 ? w.spray + 1 : 0;
    w.lastShot = this.time;
    w.bloom = Math.min(def.bloomMax, w.bloom + def.bloomPerShot);

    const eye = eyePos(e);
    const origin = v3(eye.x + dir.x * 0.35, eye.y + dir.y * 0.35, eye.z + dir.z * 0.35);

    if (!isBot) {
      const kick = def.recoilPitch * DEG * (1 + w.spray * 0.05);
      e.pitch = clamp(e.pitch + kick, -1.5, 1.5);
      e.yaw += rand(-def.recoilYaw, def.recoilYaw) * DEG;
      e.recoilRecover += kick * 0.8;
    }

    this.emit({ type: 'shot', entityId: e.id, weapon: w.id, origin, dir, scoped: e.scoped });
    const result = hitscan(this.map, this.entities, e, origin, dir, def);
    const penScale = result.kind !== 'none' && result.pens > 0 ? Math.pow(0.55, result.pens) : 1;

    if (result.kind === 'entity') {
      const victim = result.entity;
      this.emit({ type: 'tracer', from: origin, to: result.point, weapon: w.id });
      const dmgInfo = computeDamage(def, result.region, victim.armor);
      const dmg = dmgInfo.hp * penScale;
      victim.armor = Math.max(0, victim.armor - dmgInfo.armorLost);
      victim.hp -= dmg;
      victim.hitFlash = 0.18;
      victim.lastDamageFrom = e.id;
      const headshot = result.region === 'head';
      const killed = victim.hp <= 0;
      if (e.id === this.controlledId) {
        this.lastPlayerHit = this.time;
        this.lastPlayerHeadshot = headshot;
      }
      if (victim.id === this.controlledId) this.lastPlayerHurt = this.time;
      this.emit({ type: 'hit', attackerId: e.id, victimId: victim.id, region: result.region, damage: dmg, pos: result.point, headshot, killed });
      if (killed) this.kill(e, victim, w.id, headshot);
    } else if (result.kind === 'world') {
      this.emit({ type: 'tracer', from: origin, to: result.point, weapon: w.id });
      this.emit({ type: 'impact', pos: result.point, normal: result.normal, material: result.collider.material });
    } else {
      this.emit({ type: 'tracer', from: origin, to: result.point, weapon: w.id });
    }

    if (!isBot && w.ammo === 0 && w.reserve > 0) this.startReload(e);
  }

  private doKnife(e: Entity): void {
    const w = activeWeapon(e);
    w.nextFire = this.time + 0.5;
    this.emit({ type: 'knife', entityId: e.id });
    const eye = eyePos(e);
    const dir = dirFromYawPitch(e.yaw, e.pitch);
    const def = WEAPONS.knife;
    const result = hitscan(this.map, this.entities, e, eye, dir, def);
    if (result.kind === 'entity') {
      const victim = result.entity;
      const region = result.region === 'head' ? 'head' : 'chest';
      const dmgInfo = computeDamage(def, region, victim.armor);
      victim.hp -= dmgInfo.hp;
      victim.armor = Math.max(0, victim.armor - dmgInfo.armorLost);
      victim.hitFlash = 0.18;
      const killed = victim.hp <= 0;
      this.emit({ type: 'hit', attackerId: e.id, victimId: victim.id, region, damage: dmgInfo.hp, pos: result.point, headshot: region === 'head', killed });
      if (killed) this.kill(e, victim, 'knife', region === 'head');
    }
  }

  kill(killer: Entity, victim: Entity, weapon: WeaponId, headshot: boolean): void {
    if (!victim.alive) return;
    victim.alive = false;
    victim.hp = 0;
    victim.deaths++;
    victim.deathT = this.time;
    victim.action = null;
    victim.scoped = false;
    if (this.bomb.defuserId === victim.id) this.bomb.defuserId = null;
    if (victim.bombCarrier) this.dropBomb(victim);
    killer.kills++;
    killer.money = clampMoney(killer.money + WEAPONS[weapon].killReward);
    if (killer.id === this.controlledId) this.lastPlayerKill = this.time;
    this.round.mvpId = killer.id;
    this.killfeed.push({
      killer: killer.name, killerTeam: killer.team, victim: victim.name, victimTeam: victim.team,
      weapon, headshot, time: this.time,
    });
    if (this.killfeed.length > 6) this.killfeed.shift();
    this.emit({ type: 'death', entityId: victim.id, pos: clone(victim.pos), team: victim.team });
    if (victim.id === this.controlledId) this.onControlledDeath();
  }

  private onControlledDeath(): void {
    this.spectating = true;
    this.controlledId = -1;
    this.pickView();
  }

  private pickView(): void {
    const mates = this.entities.filter((e) => e.team === this.playerTeam && e.alive);
    if (mates.length === 0) return;
    const pe = this.playerEntity;
    if (pe && pe.alive) {
      this.viewId = pe.id;
      return;
    }
    if (!mates.some((m) => m.id === this.viewId)) this.viewId = mates[0].id;
  }

  cycleSpectate(dir: number): void {
    if (!this.spectating) return;
    const mates = this.entities.filter((e) => e.team === this.playerTeam && e.alive);
    if (mates.length === 0) return;
    let idx = mates.findIndex((m) => m.id === this.viewId);
    idx = (idx + dir + mates.length) % mates.length;
    this.viewId = mates[idx].id;
  }

  takeControl(): void {
    if (!this.spectating) return;
    const v = this.view;
    if (v && v.alive && v.team === this.playerTeam) {
      this.controlledId = v.id;
      v.bot = false;
      this.spectating = false;
    }
  }

  // ---- Bomb ----------------------------------------------------------------

  inSite(pos: Vec3, site: 'A' | 'B'): boolean {
    const r = this.map.sites[site];
    return pos.x >= r.x1 && pos.x <= r.x2 && pos.z >= r.z1 && pos.z <= r.z2;
  }

  beginPlant(e: Entity): void {
    if (!e.bombCarrier || e.action) return;
    const site: 'A' | 'B' = this.inSite(e.pos, 'A') ? 'A' : 'B';
    e.action = { type: 'plant', t: 0, duration: CFG.plantTime };
    e.scoped = false;
    this.bomb.site = site;
  }

  beginDefuse(e: Entity): void {
    if (e.team !== 'CT' || e.action || this.bomb.state !== 'planted') return;
    if (this.defuserBusy(e)) return;
    e.action = { type: 'defuse', t: 0, duration: e.kit ? CFG.defuseTimeKit : CFG.defuseTime };
    this.bomb.defuserId = e.id;
    e.scoped = false;
  }

  defuserBusy(e: Entity): boolean {
    const id = this.bomb.defuserId;
    if (id == null || id === e.id) return false;
    const d = this.byId(id);
    return !!d && d.alive && !!d.action && d.action.type === 'defuse';
  }

  private updateActions(dt: number): void {
    for (const e of this.entities) {
      if (!e.action || !e.alive) continue;
      const a = e.action;
      if (e.speed > 0.8) {
        e.action = null;
        if (this.bomb.defuserId === e.id) this.bomb.defuserId = null;
        continue;
      }
      if (a.type === 'plant') {
        if (!e.bombCarrier || !this.inSite(e.pos, this.bomb.site ?? 'A')) {
          e.action = null;
          continue;
        }
        a.t += dt;
        if (a.t >= a.duration) this.plantBomb(e);
      } else {
        if (this.bomb.state !== 'planted' || dist2(e.pos, this.bomb.pos) > 2.0) {
          e.action = null;
          if (this.bomb.defuserId === e.id) this.bomb.defuserId = null;
          continue;
        }
        a.t += dt;
        this.bomb.defuseProgress = clamp(a.t / a.duration, 0, 1);
        if (a.t >= a.duration) this.defuseBomb(e);
      }
    }
  }

  private plantBomb(e: Entity): void {
    e.action = null;
    e.bombCarrier = false;
    this.bomb.state = 'planted';
    this.bomb.pos = v3(e.pos.x, e.pos.y, e.pos.z);
    this.bomb.carrierId = null;
    this.bomb.planterId = e.id;
    this.bomb.timer = CFG.bombTimer;
    this.bomb.defuseProgress = 0;
    this.bomb.beepT = 0;
    e.money = clampMoney(e.money + CFG.plantReward);
    this.round.phase = 'planted';
    this.round.timer = CFG.bombTimer;
    this.emit({ type: 'plant', pos: clone(this.bomb.pos), site: this.bomb.site ?? 'A' });
    // T bots switch to defend.
    for (const t of this.entities) {
      if (t.team === 'T' && t.bot && t.ai && t.alive) {
        t.ai.state = 'defend';
        t.ai.path = [];
        t.ai.goal = null;
      }
    }
  }

  private defuseBomb(e: Entity): void {
    e.action = null;
    this.bomb.state = 'defused';
    this.bomb.defuserId = null;
    this.bomb.defuseProgress = 1;
    this.emit({ type: 'defuse', pos: clone(this.bomb.pos) });
    this.endRound('CT', 'Bomb defused');
  }

  private explodeBomb(): void {
    this.bomb.state = 'exploded';
    this.emit({ type: 'explosion', pos: clone(this.bomb.pos) });
    const center = this.bomb.pos;
    const planter = this.bomb.planterId != null ? this.byId(this.bomb.planterId) : undefined;
    for (const e of this.entities) {
      if (!e.alive) continue;
      const d = dist(e.pos, center);
      if (d < 14) {
        const dmg = 500 * (1 - d / 14);
        e.hp -= dmg;
        if (e.hp <= 0 && planter) this.kill(planter, e, 'ak47', false);
        else if (e.hp <= 0) {
          e.alive = false;
          e.deaths++;
          e.deathT = this.time;
          this.emit({ type: 'death', entityId: e.id, pos: clone(e.pos), team: e.team });
          if (e.id === this.controlledId) this.onControlledDeath();
        }
      }
    }
    this.endRound('T', 'Bomb exploded');
  }

  private dropBomb(victim: Entity): void {
    victim.bombCarrier = false;
    this.bomb.state = 'dropped';
    this.bomb.pos = v3(victim.pos.x, victim.pos.y, victim.pos.z);
    this.bomb.carrierId = null;
    this.bomb.retrieverId = this.nearestT(this.bomb.pos)?.id ?? null;
    this.emit({ type: 'bombDrop', pos: clone(this.bomb.pos) });
  }

  private nearestT(pos: Vec3): Entity | null {
    let best: Entity | null = null;
    let bd = Infinity;
    for (const t of this.entities) {
      if (t.team !== 'T' || !t.alive || t.bombCarrier) continue;
      const d = dist2(t.pos, pos);
      if (d < bd) { bd = d; best = t; }
    }
    return best;
  }

  tryPickupBomb(e: Entity): void {
    if (e.team !== 'T' || !e.alive) return;
    if (this.bomb.state !== 'dropped') return;
    if (dist2(e.pos, this.bomb.pos) > 1.5) return;
    e.bombCarrier = true;
    this.bomb.state = 'carried';
    this.bomb.carrierId = e.id;
    this.bomb.retrieverId = null;
    this.emit({ type: 'bombPickup', entityId: e.id });
  }

  // Stable single retriever (hysteresis) so bots don't thrash roles and oscillate.
  isNearestBombRetriever(e: Entity): boolean {
    if (this.bomb.state !== 'dropped') return false;
    let rid = this.bomb.retrieverId;
    const cur = rid != null ? this.byId(rid) : undefined;
    if (!cur || !cur.alive || cur.team !== 'T') {
      rid = this.nearestT(this.bomb.pos)?.id ?? null;
      this.bomb.retrieverId = rid;
    }
    return rid != null && rid === e.id;
  }

  private updateBomb(dt: number): void {
    if (this.bomb.state === 'carried') {
      const c = this.bomb.carrierId != null ? this.byId(this.bomb.carrierId) : undefined;
      if (c) this.bomb.pos = clone(c.pos);
    } else if (this.bomb.state === 'planted') {
      this.bomb.beepT += dt;
      const urgency = 1 - clamp(this.bomb.timer / CFG.bombTimer, 0, 1);
      const interval = 1.0 - urgency * 0.82;
      if (this.bomb.beepT >= interval) {
        this.bomb.beepT = 0;
        this.emit({ type: 'beep', pos: clone(this.bomb.pos), urgency });
      }
    }
    // Auto pickup for T bots/player walking over a dropped bomb.
    if (this.bomb.state === 'dropped') {
      for (const t of this.entities) {
        if (t.team === 'T' && t.alive && dist2(t.pos, this.bomb.pos) < 1.0) {
          this.tryPickupBomb(t);
          break;
        }
      }
    }
  }

  // ---- AI hooks ------------------------------------------------------------

  setGoal(e: Entity, goal: Vec3): void {
    if (!e.ai) return;
    e.ai.goal = clone(goal);
    e.ai.path = findPath(this.map, e.pos, goal);
    e.ai.pathIdx = 0;
  }

  moveBot(e: Entity, dx: number, dz: number, speed: number, dt: number): void {
    moveEntity(this.map, e, { wishX: dx, wishZ: dz, speed, jump: false, dt });
    if (speed > 0.1 && e.ai && e.ai.state !== 'engage' && e.ai.state !== 'plant' && e.ai.state !== 'defuse') {
      const desired = Math.atan2(dx, -dz);
      e.yaw += clamp(angleDiff(e.yaw, desired), -8 * dt, 8 * dt);
    }
  }

  getVisibleEnemies(e: Entity): Entity[] {
    const out: Entity[] = [];
    const eye = eyePos(e);
    const fwd = dirFromYawPitch(e.yaw, 0);
    const halfFov = (CFG.aiFov * 0.5) * DEG;
    for (const o of this.entities) {
      if (o.team === e.team || !o.alive) continue;
      const to = v3(o.pos.x - e.pos.x, 0, o.pos.z - e.pos.z);
      const d = Math.hypot(to.x, to.z);
      if (d > CFG.aiViewDist || d < 0.001) continue;
      const cosA = (to.x * fwd.x + to.z * fwd.z) / d;
      if (Math.acos(clamp(cosA, -1, 1)) > halfFov) continue;
      const target = v3(o.pos.x, o.pos.y + 1.3, o.pos.z);
      const dir = v3(target.x - eye.x, target.y - eye.y, target.z - eye.z);
      const dl = Math.hypot(dir.x, dir.y, dir.z);
      const nd = v3(dir.x / dl, dir.y / dl, dir.z / dl);
      const hit = raycastWorld(this.map, eye, nd, dl);
      if (hit.solid && hit.solid.t < dl - 0.4) continue;
      out.push(o);
    }
    return out;
  }

  botFire(e: Entity, target: Entity, dt: number): void {
    const ai = e.ai!;
    const w = activeWeapon(e);
    const def = WEAPONS[w.id];
    if (this.time < ai.reaction) return;
    if (w.reloading) return;
    if (w.ammo <= 0) {
      if (w.reserve > 0) this.startReload(e);
      return;
    }
    if (this.time < w.nextFire || this.time < e.switchT) return;
    if (ai.burst <= 0) {
      if (this.time < ai.burstPause) return;
      ai.burst = def.id === 'awp' ? 1 : def.auto ? randInt(3, 7) : randInt(2, 4);
    }
    const eye = eyePos(e);
    const headChance = ai.skill > 0.65 ? 0.3 : 0.1;
    const aimY = target.pos.y + (Math.random() < headChance ? 1.62 : 1.25);
    const aim = v3(target.pos.x, aimY, target.pos.z);
    let dir = v3(aim.x - eye.x, aim.y - eye.y, aim.z - eye.z);
    const dl = Math.hypot(dir.x, dir.y, dir.z) || 1;
    dir = v3(dir.x / dl, dir.y / dl, dir.z / dl);
    // verify LOS
    const wall = raycastWorld(this.map, eye, dir, dl);
    if (wall.solid && wall.solid.t < dl - 0.5) return;
    const d = dist2(e.pos, target.pos);
    let err = (1 - ai.skill) * 2.0 + (1 - ai.aim) * 2.6 + d * 0.02 + (e.speed > 1 ? 1.4 : 0);
    if (def.scoped) err *= 0.12;
    err = Math.max(0.04, err);
    dir = applySpread(dir, err);
    this.shoot(e, dir, true);
    ai.burst--;
    if (ai.burst <= 0) {
      ai.burstPause = this.time + (def.id === 'awp' ? rand(1.0, 1.7) : rand(0.2, 0.5));
    }
  }

  private updateTeamSeen(dt: number): void {
    this.seenAccum += dt;
    if (this.seenAccum < 0.1) return;
    this.seenAccum = 0;
    for (const team of ['CT', 'T'] as Team[]) {
      const seen = this.teamSeen[team];
      for (const e of this.entities) {
        if (e.team !== team || !e.alive) continue;
        const vis = this.getVisibleEnemies(e);
        for (const v of vis) seen.set(v.id, { pos: clone(v.pos), time: this.time });
      }
      // expire
      for (const [id, s] of seen) if (this.time - s.time > 1.5) seen.delete(id);
    }
  }

  // ---- Economy / buy -------------------------------------------------------

  buyAllowed(): boolean {
    const e = this.controlled;
    if (!e || !e.alive || this.round.phase !== 'freeze') return false;
    const r = e.team === 'CT'
      ? { x1: -8, z1: -58, x2: 22, z2: -34 }
      : { x1: -10, z1: 40, x2: 24, z2: 64 };
    return e.pos.x >= r.x1 && e.pos.x <= r.x2 && e.pos.z >= r.z1 && e.pos.z <= r.z2;
  }

  toggleBuy(): void {
    if (this.buyAllowed()) this.buyOpen = !this.buyOpen;
    else this.buyOpen = false;
  }

  buy(id: WeaponId | 'kevlar' | 'helmet' | 'kit'): void {
    const e = this.controlled;
    if (!e || !this.buyAllowed()) return;
    if (this.round.pistol && (id === 'ak47' || id === 'm4a4' || id === 'awp')) return;
    if (buyItem(e, id)) {
      this.emit({ type: 'buy', entityId: e.id });
      if (id === 'ak47' || id === 'm4a4' || id === 'awp') e.activeSlot = 'primary';
      else if (id === 'deagle' || id === 'glock' || id === 'usp') e.activeSlot = 'secondary';
    }
  }

  // ---- Snapshot ------------------------------------------------------------

  private hudPlayer(e: Entity | undefined): HudPlayer | null {
    if (!e) return null;
    const w = activeWeapon(e);
    const def = WEAPONS[w.id];
    return {
      name: e.name, team: e.team, hp: Math.max(0, Math.ceil(e.hp)), armor: Math.ceil(e.armor),
      helmet: e.helmet, kit: e.kit, alive: e.alive, money: e.money, kills: e.kills, deaths: e.deaths,
      weapon: w.id, weaponName: def.name, ammo: w.ammo, reserve: w.reserve,
      reloading: w.reloading, reloadProgress: w.reloading ? 1 - w.reloadT / def.reloadTime : 0,
      slot: e.activeSlot, hasPrimary: !!e.inv.primary, scoped: e.scoped, bombCarrier: e.bombCarrier,
      action: e.action ? { type: e.action.type, progress: clamp(e.action.t / e.action.duration, 0, 1) } : null,
      spread: this.currentSpread(e),
    };
  }

  getSnapshot(): Snapshot {
    const view = this.view;
    const controlled = this.controlled;
    const hudSrc = this.spectating ? view : controlled;
    const dots: HudEntityDot[] = this.entities.map((e) => ({
      id: e.id, x: e.pos.x, z: e.pos.z, yaw: e.yaw, team: e.team, alive: e.alive,
      isSelf: e.id === this.playerEntityId, isControlled: e.id === this.controlledId,
      bombCarrier: e.bombCarrier,
    }));
    const seen = this.teamSeen[this.playerTeam];
    // Only reveal enemies seen by our team (or dead ones remain hidden).
    const visibleEnemyIds = new Set<number>(seen.keys());
    const filteredDots = dots.filter((d) => {
      if (d.team === this.playerTeam) return true;
      return visibleEnemyIds.has(d.id) && d.alive;
    });

    let hint = '';
    if (this.round.phase === 'freeze') hint = this.buyAllowed() ? 'Press B to buy — round starts soon' : 'Freeze time';
    else if (this.spectating) hint = 'Spectating — [ ] switch teammate · Enter to take control';
    else if (controlled) {
      if (controlled.team === 'T' && controlled.bombCarrier && (this.inSite(controlled.pos, 'A') || this.inSite(controlled.pos, 'B'))) hint = 'Hold E to plant the C4';
      else if (controlled.team === 'T' && controlled.bombCarrier) hint = `You carry the C4 — push ${this.planSite} site`;
      else if (controlled.team === 'CT' && this.bomb.state === 'planted' && dist2(controlled.pos, this.bomb.pos) < 2) hint = 'Hold E to defuse';
      else if (this.bomb.state === 'dropped' && controlled.team === 'T') hint = 'The bomb was dropped — recover it';
    }

    return {
      phase: this.round.phase,
      roundNumber: this.round.number,
      pistol: this.round.pistol,
      timer: Math.max(0, this.round.timer),
      scoreCT: this.round.scoreCT,
      scoreT: this.round.scoreT,
      winner: this.round.winner,
      reason: this.round.reason,
      player: this.hudPlayer(hudSrc),
      controlledId: this.controlledId,
      spectating: this.spectating,
      spectateName: view ? view.name : '',
      playerTeam: this.playerTeam,
      bomb: { state: this.bomb.state, x: this.bomb.pos.x, z: this.bomb.pos.z, timer: Math.max(0, this.bomb.timer), defuseProgress: this.bomb.defuseProgress, site: this.bomb.site },
      dots: filteredDots,
      killfeed: this.killfeed.slice(-6),
      aliveCT: teamAlive(this.entities, 'CT'),
      aliveT: teamAlive(this.entities, 'T'),
      buyOpen: this.buyOpen,
      buyAllowed: this.buyAllowed(),
      scoreboard: this.entities.map((e) => ({ name: e.name, team: e.team, kills: e.kills, deaths: e.deaths, money: e.money, alive: e.alive, isPlayer: e.isPlayerSlot })),
      matchWinner: this.matchWinner,
      hint,
      fps: this.fps,
      hitMarker: this.time - this.lastPlayerHit < 0.18,
      hitHeadshot: this.lastPlayerHeadshot,
      killMarker: this.time - this.lastPlayerKill < 0.5,
      hurtFlash: this.time - this.lastPlayerHurt < 0.35,
      area: this.areaName(),
    };
  }

  areaName(): string {
    const v = this.view;
    return v ? areaAt(this.map, v.pos.x, v.pos.z) : '—';
  }
}
