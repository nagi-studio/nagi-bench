import { EventBus } from '../core/events.ts';
import { Rng, clamp, dist2D, v3, vclone, wrapAngle } from '../core/math.ts';
import type { Vec3 } from '../core/math.ts';
import type { HudSnapshot, KillEvent, RoundEndReason, RoundPhase, ScoreboardRow, SlotId, Team } from '../core/types.ts';
import { otherTeam } from '../core/types.ts';
import { createDust2World } from '../map/dust2.ts';
import { NavGraph } from '../map/nav.ts';
import type { World } from '../map/world.ts';
import {
  activeDef,
  activeWeapon,
  bestSlot,
  canReload,
  clearLoadout,
  createActor,
  finishReload,
  giveWeapon,
  isReloading,
  startReload,
  switchSlot,
} from './actor.ts';
import type { Actor } from './actor.ts';
import { assignRoles, hearNoise, updateBot } from './ai.ts';
import type { AICtx, RoundView } from './ai.ts';
import { applyDamage, currentSpread, decayRecoil, tryFire } from './combat.ts';
import type { CombatCtx } from './combat.ts';
import { NO_INPUT, radiusDamage, separateActors, stepActor } from './physics.ts';
import type { MoveIntent } from './physics.ts';
import {
  DEFUSE_KIT_PRICE,
  FULL_BUY_ARMOR,
  KEVLAR_HELMET_PRICE,
  KEVLAR_PRICE,
  PISTOL_ROUND_ARMOR,
  TEAM_PISTOL,
  TEAM_RIFLE,
  WEAPONS,
} from './weapons.ts';
import type { WeaponId } from './weapons.ts';

export const TICK_RATE = 64;
export const TICK_DT = 1 / TICK_RATE;

const FREEZE_TIME = 8;
const ROUND_TIME = 115;
const OVER_TIME = 5;
const BOMB_FUSE = 40;
const PLANT_TIME = 3.2;
const DEFUSE_TIME = 10;
const DEFUSE_KIT_TIME = 5;
const BOMB_DAMAGE = 500;
const BOMB_RADIUS = 26;
const BOMB_PICKUP_RANGE = 1.5;
const MAX_KILLFEED = 6;

const T_NAMES = ['Cypher', 'Rukh', 'Volkov', 'Saad', 'Mirza', 'Osman'];
const CT_NAMES = ['Falcon', 'Grim', 'Nomad', 'Sable', 'Vector', 'Rhys'];

export interface PlayerInput {
  forward: number;
  strafe: number;
  jump: boolean;
  crouch: boolean;
  walk: boolean;
  fire: boolean;
  /** Rising edge of the fire button, consumed once per press. */
  firePressed: boolean;
  altFire: boolean;
  altFirePressed: boolean;
  reload: boolean;
  use: boolean;
  slotRequest: SlotId | null;
}

export function createInput(): PlayerInput {
  return {
    forward: 0,
    strafe: 0,
    jump: false,
    crouch: false,
    walk: false,
    fire: false,
    firePressed: false,
    altFire: false,
    altFirePressed: false,
    reload: false,
    use: false,
    slotRequest: null,
  };
}

export type BombPhase = 'carried' | 'dropped' | 'planted' | 'defused' | 'exploded';

export interface BombState {
  phase: BombPhase;
  pos: Vec3;
  carrierId: number;
  site: 'A' | 'B' | null;
  fuse: number;
  plantProgress: number;
  planterId: number;
  defuseProgress: number;
  defuserId: number;
  beepTimer: number;
}

export interface MatchConfig {
  playerTeam: Team;
  /** Force every round to be a pistol round. */
  pistolOnly: boolean;
  botSkill: number;
  seed: number;
}

export const DEFAULT_CONFIG: MatchConfig = {
  playerTeam: 'CT',
  pistolOnly: false,
  botSkill: 0.62,
  seed: 20250724,
};

/**
 * The authoritative simulation. Runs on a fixed 64 Hz tick, owns every actor,
 * the round/bomb state machine and the economy. It knows nothing about THREE,
 * React or the DOM: the renderer reads its state, the HUD reads throttled
 * snapshots, and effects/audio are driven through the event bus.
 */
export class GameEngine {
  readonly world: World;
  readonly nav: NavGraph;
  readonly bus = new EventBus();
  readonly actors: Actor[] = [];
  readonly config: MatchConfig;

  rng: Rng;
  time = 0;
  tick = 0;

  phase: RoundPhase = 'freeze';
  phaseTimer = FREEZE_TIME;
  roundNumber = 1;
  scoreCT = 0;
  scoreT = 0;
  roundWinner: Team | null = null;
  roundEndReason: RoundEndReason | null = null;
  lossStreak: Record<Team, number> = { CT: 0, T: 0 };

  bomb: BombState = {
    phase: 'carried',
    pos: v3(),
    carrierId: -1,
    site: null,
    fuse: BOMB_FUSE,
    plantProgress: 0,
    planterId: -1,
    defuseProgress: 0,
    defuserId: -1,
    beepTimer: 0,
  };
  targetSite: 'A' | 'B' = 'A';

  localActorId = -1;
  viewActorId = -1;
  spectating = false;
  buyMenuOpen = false;

  input: PlayerInput = createInput();
  killfeed: KillEvent[] = [];
  private killfeedSeq = 1;
  hitMarkerTime = -99;
  damageFlashTime = -99;
  lastDamageDir = 0;

  private listeners = new Set<() => void>();
  private snapshotAccum = 0;
  private accumulator = 0;
  private snapshot: HudSnapshot;
  private combatCtx: CombatCtx;

  constructor(config: Partial<MatchConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.rng = new Rng(this.config.seed);
    this.world = createDust2World();
    this.nav = new NavGraph(this.world);
    this.combatCtx = {
      world: this.world,
      actors: this.actors,
      rng: this.rng,
      bus: this.bus,
      time: 0,
      viewActorId: -1,
      onKill: (victim, attacker, weaponId, headshot) => this.onKill(victim, attacker, weaponId, headshot),
    };
    this.createTeams();
    this.snapshot = this.buildSnapshot();
    this.startRound(true);
    // Bots react to gunfire they cannot see.
    this.bus.on('shot', ({ actorId, origin, weaponId }) => {
      const loud = WEAPONS[weaponId].sfx.gain;
      for (const a of this.actors) {
        if (a.id === actorId || !a.isBot || !a.alive) continue;
        hearNoise(a, origin, this.time, loud);
      }
    });
    // Local feedback: hit marker when we damage someone, red flash when hurt.
    this.bus.on('hit', ({ attackerId, victimId, point }) => {
      if (attackerId === this.viewActorId) this.hitMarkerTime = this.time;
      if (victimId === this.viewActorId) {
        this.damageFlashTime = this.time;
        const me = this.viewActor;
        const from = this.actorById(attackerId);
        if (me && from) {
          this.lastDamageDir = Math.atan2(from.pos.x - me.pos.x, -(from.pos.z - me.pos.z));
        } else if (me) {
          this.lastDamageDir = Math.atan2(point.x - me.pos.x, -(point.z - me.pos.z));
        }
      }
    });
  }

  // ------------------------------------------------------------- lifecycle

  private createTeams(): void {
    const skill = this.config.botSkill;
    for (let i = 0; i < 5; i++) {
      const t = createActor(T_NAMES[i], 'T', true, clamp(skill + this.rng.range(-0.18, 0.18), 0.15, 0.98));
      const ct = createActor(CT_NAMES[i], 'CT', true, clamp(skill + this.rng.range(-0.18, 0.18), 0.15, 0.98));
      this.actors.push(t, ct);
    }
    // Promote one bot on the player's side to the human seat.
    const mine = this.actors.find((a) => a.team === this.config.playerTeam)!;
    mine.isBot = false;
    mine.isLocal = true;
    mine.ai.skill = 0.75;
    this.localActorId = mine.id;
    this.viewActorId = mine.id;
    this.refreshNames();
  }

  private refreshNames(): void {
    for (const a of this.actors) {
      a.name = a.isLocal ? `${a.baseName} (YOU)` : a.baseName;
    }
  }

  get localActor(): Actor | null {
    return this.actors.find((a) => a.id === this.localActorId) ?? null;
  }

  get viewActor(): Actor | null {
    return this.actors.find((a) => a.id === this.viewActorId) ?? null;
  }

  actorById(id: number): Actor | null {
    return this.actors.find((a) => a.id === id) ?? null;
  }

  aliveCount(team: Team): number {
    return this.actors.reduce((n, a) => n + (a.alive && a.team === team ? 1 : 0), 0);
  }

  get isPistolRound(): boolean {
    return this.config.pistolOnly || this.roundNumber === 1 || this.roundNumber === 13;
  }

  // ----------------------------------------------------------------- rounds

  startRound(first = false): void {
    this.phase = 'freeze';
    this.phaseTimer = FREEZE_TIME;
    this.roundWinner = null;
    this.roundEndReason = null;
    this.targetSite = this.rng.next() < 0.5 ? 'A' : 'B';

    const pistol = this.isPistolRound;
    for (const a of this.actors) {
      const spawnList = this.world.spawns(a.team);
      const idx = this.actors.filter((o) => o.team === a.team).indexOf(a) % spawnList.length;
      const sp = spawnList[idx];
      const safe = this.world.nearestOpen(sp.x, sp.z, 0, 0.42);
      a.pos.x = safe.x;
      a.pos.z = safe.z;
      a.pos.y = this.world.grid.floorAt(safe.x, safe.z);
      a.vel.x = a.vel.y = a.vel.z = 0;
      a.yaw = sp.yaw;
      a.pitch = 0;
      a.punchPitch = 0;
      a.punchYaw = 0;
      a.alive = true;
      a.health = 100;
      a.heightScale = 1;
      a.crouching = false;
      a.grounded = true;
      a.hasBomb = false;
      a.plantProgress = 0;
      a.defuseProgress = 0;
      a.spread = 0;
      a.scoped = false;
      a.wantsScope = false;
      a.deployEndTime = 0;
      a.reloadEndTime = -1;
      a.footAccum = 0;
      a.lastAttackerId = -1;
      if (first) a.money = 800;
      this.equip(a, pistol);
    }

    // Give the bomb to a random terrorist — but bias it toward the human when
    // they are on T, so the plant mechanic is actually reachable in play.
    const ts = this.actors.filter((a) => a.team === 'T');
    const human = ts.find((a) => a.id === this.localActorId);
    const carrier = human && this.rng.next() < 0.6 ? human : ts[Math.floor(this.rng.next() * ts.length)];
    this.giveBomb(carrier);

    assignRoles(this.actors, this.targetSite, this.rng);
    this.buyMenuOpen = false;
    // Back to your own body at the start of every round.
    const own = this.actorById(this.localActorId);
    if (own) {
      own.isBot = false;
      own.isLocal = true;
      this.viewActorId = own.id;
      this.spectating = false;
    }
    this.refreshNames();
    this.bus.emit('roundStart', { round: this.roundNumber, pistolRound: pistol });
    this.notify();
  }

  /** Loadout for the round: pistol rounds are pistols + no armour, otherwise auto-buy. */
  private equip(a: Actor, pistolRound: boolean): void {
    clearLoadout(a);
    a.armor = 0;
    a.helmet = false;
    a.hasKit = false;
    giveWeapon(a, TEAM_PISTOL[a.team]);

    if (pistolRound) {
      a.armor = PISTOL_ROUND_ARMOR.armor;
      a.helmet = PISTOL_ROUND_ARMOR.helmet;
      // Bots may splash on light armour if they somehow have cash.
      if (a.isBot && a.money >= KEVLAR_PRICE + 200) {
        a.armor = 100;
        a.money -= KEVLAR_PRICE;
      }
    } else if (a.isBot) {
      this.botBuy(a);
    } else {
      // The human keeps whatever they can afford by default; the buy menu can override.
      this.autoBuyForPlayer(a);
    }
    a.activeSlot = bestSlot(a);
    a.deployEndTime = 0;
  }

  private botBuy(a: Actor): void {
    const rifle = TEAM_RIFLE[a.team];
    const riflePrice = WEAPONS[rifle].price;
    const wantAwp = a.ai.skill > 0.72 && a.money >= WEAPONS.awp.price + KEVLAR_HELMET_PRICE;
    if (wantAwp && this.rng.next() < 0.45) {
      a.money -= WEAPONS.awp.price;
      giveWeapon(a, 'awp');
    } else if (a.money >= riflePrice + KEVLAR_PRICE) {
      a.money -= riflePrice;
      giveWeapon(a, rifle);
    } else if (a.money >= WEAPONS.deagle.price + KEVLAR_PRICE) {
      a.money -= WEAPONS.deagle.price;
      giveWeapon(a, 'deagle');
    }
    if (a.money >= KEVLAR_HELMET_PRICE) {
      a.money -= KEVLAR_HELMET_PRICE;
      a.armor = FULL_BUY_ARMOR.armor;
      a.helmet = true;
    } else if (a.money >= KEVLAR_PRICE) {
      a.money -= KEVLAR_PRICE;
      a.armor = FULL_BUY_ARMOR.armor;
    }
    if (a.team === 'CT' && a.money >= DEFUSE_KIT_PRICE) {
      a.money -= DEFUSE_KIT_PRICE;
      a.hasKit = true;
    }
  }

  private autoBuyForPlayer(a: Actor): void {
    const rifle = TEAM_RIFLE[a.team];
    if (a.money >= WEAPONS[rifle].price + KEVLAR_HELMET_PRICE) {
      a.money -= WEAPONS[rifle].price;
      giveWeapon(a, rifle);
      a.money -= KEVLAR_HELMET_PRICE;
      a.armor = 100;
      a.helmet = true;
    } else if (a.money >= WEAPONS[rifle].price) {
      a.money -= WEAPONS[rifle].price;
      giveWeapon(a, rifle);
    } else if (a.money >= KEVLAR_PRICE) {
      a.money -= KEVLAR_PRICE;
      a.armor = 100;
    }
  }

  /** Buy menu action (freeze time only). */
  buy(item: WeaponId | 'kevlar' | 'kevlar_helmet' | 'kit'): boolean {
    const a = this.localActor;
    if (!a || !a.alive || this.phase !== 'freeze') return false;
    if (item === 'kevlar' || item === 'kevlar_helmet') {
      const price = item === 'kevlar' ? KEVLAR_PRICE : KEVLAR_HELMET_PRICE;
      if (a.money < price) return false;
      a.money -= price;
      a.armor = 100;
      if (item === 'kevlar_helmet') a.helmet = true;
      this.notify();
      return true;
    }
    if (item === 'kit') {
      if (a.team !== 'CT' || a.hasKit || a.money < DEFUSE_KIT_PRICE) return false;
      a.money -= DEFUSE_KIT_PRICE;
      a.hasKit = true;
      this.notify();
      return true;
    }
    const def = WEAPONS[item];
    // Pistol rounds are pistols only, whatever the UI offers.
    if (this.isPistolRound && def.slot === 'primary') return false;
    if (a.money < def.price) return false;
    a.money -= def.price;
    giveWeapon(a, item);
    switchSlot(a, def.slot, this.time);
    a.deployEndTime = 0;
    this.notify();
    return true;
  }

  private endRound(winner: Team, reason: RoundEndReason): void {
    if (this.phase === 'over') return;
    this.phase = 'over';
    this.phaseTimer = OVER_TIME;
    this.roundWinner = winner;
    this.roundEndReason = reason;
    if (winner === 'CT') this.scoreCT++;
    else this.scoreT++;

    const loser = otherTeam(winner);
    this.lossStreak[loser] = Math.min(4, this.lossStreak[loser] + 1);
    this.lossStreak[winner] = 0;
    const lossBonus = 1400 + 500 * this.lossStreak[loser];
    for (const a of this.actors) {
      if (a.team === winner) a.money = Math.min(16000, a.money + 3250);
      else a.money = Math.min(16000, a.money + lossBonus);
    }
    this.bus.emit('roundEnd', { winner, reason });
    this.notify();
  }

  private checkRoundEnd(): void {
    if (this.phase !== 'live') return;
    const aliveT = this.aliveCount('T');
    const aliveCT = this.aliveCount('CT');
    if (aliveCT === 0) {
      this.endRound('T', 'ct_eliminated');
      return;
    }
    if (aliveT === 0 && this.bomb.phase !== 'planted') {
      this.endRound('CT', 't_eliminated');
      return;
    }
    if (this.phaseTimer <= 0 && this.bomb.phase !== 'planted') {
      this.endRound('CT', 'time_expired');
    }
  }

  // ------------------------------------------------------------------ bomb

  private giveBomb(a: Actor): void {
    this.bomb.phase = 'carried';
    this.bomb.carrierId = a.id;
    this.bomb.site = null;
    this.bomb.fuse = BOMB_FUSE;
    this.bomb.plantProgress = 0;
    this.bomb.defuseProgress = 0;
    this.bomb.defuserId = -1;
    this.bomb.planterId = -1;
    this.bomb.pos = vclone(a.pos);
    for (const o of this.actors) o.hasBomb = false;
    a.hasBomb = true;
    a.weapons.bomb = { id: 'c4', mag: 0, reserve: 0 };
  }

  private dropBomb(a: Actor): void {
    a.hasBomb = false;
    a.weapons.bomb = null;
    this.bomb.phase = 'dropped';
    this.bomb.carrierId = -1;
    this.bomb.pos = vclone(a.pos);
    this.bomb.pos.y = this.world.grid.floorAt(a.pos.x, a.pos.z);
    if (a.activeSlot === 'bomb') a.activeSlot = bestSlot(a);
    this.bus.emit('bombDropped', { pos: vclone(this.bomb.pos) });
  }

  private updateBomb(dt: number): void {
    const b = this.bomb;
    if (b.phase === 'carried') {
      const carrier = this.actorById(b.carrierId);
      if (carrier && carrier.alive) {
        b.pos = vclone(carrier.pos);
      }
      return;
    }
    if (b.phase === 'dropped') {
      // Any terrorist that walks over it picks it up.
      for (const a of this.actors) {
        if (a.team !== 'T' || !a.alive) continue;
        if (dist2D(a.pos, b.pos) < BOMB_PICKUP_RANGE && Math.abs(a.pos.y - b.pos.y) < 2) {
          this.giveBomb(a);
          this.bus.emit('bombPickup', { actorId: a.id });
          break;
        }
      }
      return;
    }
    if (b.phase === 'planted') {
      b.fuse -= dt;
      b.beepTimer -= dt;
      if (b.beepTimer <= 0) {
        // Beeps speed up as the fuse runs down.
        b.beepTimer = clamp(b.fuse / BOMB_FUSE, 0.12, 1) * 1.2;
        this.bus.emit('bombBeep', { pos: vclone(b.pos) });
      }
      if (b.fuse <= 0) {
        this.explode();
        return;
      }
      this.updateDefuse(dt);
    }
  }

  private updateDefuse(dt: number): void {
    const b = this.bomb;
    const defuser = this.actorById(b.defuserId);
    const stillValid =
      defuser &&
      defuser.alive &&
      defuser.team === 'CT' &&
      dist2D(defuser.pos, b.pos) < 1.6 &&
      this.wantsUse(defuser);
    if (!stillValid) {
      if (b.defuserId !== -1) {
        b.defuserId = -1;
        b.defuseProgress = 0;
      }
      // Look for a new defuser.
      for (const a of this.actors) {
        if (a.team !== 'CT' || !a.alive) continue;
        if (dist2D(a.pos, b.pos) > 1.6) continue;
        if (!this.wantsUse(a)) continue;
        b.defuserId = a.id;
        b.defuseProgress = 0;
        this.bus.emit('bombDefuseStart', { actorId: a.id, pos: vclone(b.pos) });
        break;
      }
      return;
    }
    const total = defuser.hasKit ? DEFUSE_KIT_TIME : DEFUSE_TIME;
    b.defuseProgress += dt / total;
    defuser.defuseProgress = b.defuseProgress;
    if (b.defuseProgress >= 1) {
      b.phase = 'defused';
      defuser.defuseProgress = 0;
      defuser.money = Math.min(16000, defuser.money + 300);
      this.bus.emit('bombDefused', { pos: vclone(b.pos) });
      this.endRound('CT', 'bomb_defused');
    }
  }

  /** Does this actor want to plant/defuse right now? (E held, or the bot decided to). */
  private wantsUse(a: Actor): boolean {
    if (a.id === this.localActorId && !a.isBot) return this.input.use;
    return this.botUseFlags.get(a.id) === true;
  }

  private botUseFlags = new Map<number, boolean>();
  private reloadTracker = new Map<number, number>();

  private updatePlant(a: Actor, dt: number): void {
    const b = this.bomb;
    if (b.phase !== 'carried' || b.carrierId !== a.id) return;
    const site = this.world.siteAt(a.pos);
    const canPlant = !!site && a.grounded && a.speed2D < 0.6 && this.wantsUse(a);
    if (!canPlant) {
      if (b.plantProgress > 0) {
        b.plantProgress = 0;
        a.plantProgress = 0;
      }
      return;
    }
    b.plantProgress += dt / PLANT_TIME;
    a.plantProgress = b.plantProgress;
    if (b.plantProgress >= 1) {
      b.phase = 'planted';
      b.site = site!;
      b.planterId = a.id;
      b.fuse = BOMB_FUSE;
      b.plantProgress = 0;
      b.beepTimer = 0;
      a.plantProgress = 0;
      a.hasBomb = false;
      a.weapons.bomb = null;
      if (a.activeSlot === 'bomb') switchSlot(a, bestSlot(a), this.time);
      b.pos = vclone(a.pos);
      b.pos.y = this.world.grid.floorAt(a.pos.x, a.pos.z);
      b.carrierId = -1;
      a.money = Math.min(16000, a.money + 300);
      this.bus.emit('bombPlanted', { pos: vclone(b.pos), site: site! });
      this.notify();
    }
  }

  private explode(): void {
    const b = this.bomb;
    b.phase = 'exploded';
    this.bus.emit('bombExploded', { pos: vclone(b.pos) });
    for (const a of this.actors) {
      if (!a.alive) continue;
      const d = dist2D(a.pos, b.pos);
      const dmg = radiusDamage(d, BOMB_DAMAGE, BOMB_RADIUS);
      if (dmg > 0) {
        applyDamage(this.combatCtx, a, null, dmg, 'chest', vclone(a.pos), 'c4');
      }
    }
    this.endRound('T', 'bomb_exploded');
  }

  // ------------------------------------------------------------------ kills

  private onKill(victim: Actor, attacker: Actor | null, weaponId: WeaponId, headshot: boolean): void {
    if (victim.hasBomb) this.dropBomb(victim);
    if (attacker && attacker.team !== victim.team) {
      attacker.kills++;
      attacker.money = Math.min(16000, attacker.money + WEAPONS[weaponId].killReward);
    }
    const ev: KillEvent = {
      id: this.killfeedSeq++,
      time: this.time,
      killer: attacker ? attacker.name : 'World',
      killerTeam: attacker ? attacker.team : otherTeam(victim.team),
      victim: victim.name,
      victimTeam: victim.team,
      weapon: WEAPONS[weaponId].name,
      headshot,
      involvesPlayer: victim.id === this.localActorId || attacker?.id === this.localActorId,
    };
    this.killfeed.unshift(ev);
    if (this.killfeed.length > MAX_KILLFEED) this.killfeed.length = MAX_KILLFEED;
    this.bus.emit('kill', {
      killerId: attacker ? attacker.id : -1,
      victimId: victim.id,
      headshot,
      byPlayer: attacker?.id === this.viewActorId,
    });

    if (victim.id === this.viewActorId) {
      // Death cam then auto-spectate.
      this.spectating = true;
    }
    this.notify();
  }

  // ------------------------------------------------------- player interface

  applyMouse(dx: number, dy: number, sensitivity: number): void {
    const a = this.controlledActor();
    if (!a || !a.alive) return;
    const def = activeDef(a);
    const scopeMul = a.scoped && def.scope ? def.scope.sens : 1;
    a.yaw = wrapAngle(a.yaw - dx * sensitivity * scopeMul);
    a.pitch = clamp(a.pitch - dy * sensitivity * scopeMul, -Math.PI / 2 + 0.02, Math.PI / 2 - 0.02);
  }

  /** The actor the human is currently driving (null while spectating). */
  controlledActor(): Actor | null {
    const a = this.viewActor;
    if (!a) return null;
    return a.isLocal && a.alive ? a : null;
  }

  /** Cycle the spectator target through living team-mates. */
  spectateNext(): void {
    const me = this.actorById(this.localActorId);
    const team = me ? me.team : this.config.playerTeam;
    const mates = this.actors.filter((a) => a.team === team && a.alive);
    if (mates.length === 0) return;
    const cur = mates.findIndex((a) => a.id === this.viewActorId);
    const next = mates[(cur + 1) % mates.length];
    this.viewActorId = next.id;
    this.notify();
  }

  /** Take over a team-mate bot: it stops thinking, you start driving. */
  takeControl(): boolean {
    const target = this.viewActor;
    const me = this.actorById(this.localActorId);
    if (!target || !target.alive) return false;
    if (me && me.id !== target.id) {
      // Hand the old body back to the AI, alive or not, so it never freezes.
      me.isLocal = false;
      me.isBot = true;
    }
    target.isBot = false;
    target.isLocal = true;
    this.localActorId = target.id;
    this.viewActorId = target.id;
    this.spectating = false;
    this.refreshNames();
    this.notify();
    return true;
  }

  toggleBuyMenu(open?: boolean): void {
    const next = open ?? !this.buyMenuOpen;
    this.buyMenuOpen = next && this.phase === 'freeze';
    this.notify();
  }

  // ------------------------------------------------------------ main update

  /** Called once per rendered frame; runs as many fixed ticks as needed. */
  advance(frameDt: number): void {
    const dt = Math.min(frameDt, 0.25);
    this.accumulator += dt;
    let steps = 0;
    while (this.accumulator >= TICK_DT && steps < 8) {
      this.step(TICK_DT);
      this.accumulator -= TICK_DT;
      steps++;
    }
    if (steps === 8) this.accumulator = 0;

    this.snapshotAccum += dt;
    if (this.snapshotAccum >= 1 / 20) {
      this.snapshotAccum = 0;
      this.notify();
    }
  }

  step(dt: number): void {
    this.time += dt;
    this.tick++;
    this.combatCtx.time = this.time;
    this.combatCtx.viewActorId = this.viewActorId;

    // --- phase timers ------------------------------------------------------
    this.phaseTimer -= dt;
    if (this.phase === 'freeze' && this.phaseTimer <= 0) {
      this.phase = 'live';
      this.phaseTimer = ROUND_TIME;
      this.buyMenuOpen = false;
      this.notify();
    } else if (this.phase === 'over' && this.phaseTimer <= 0) {
      this.roundNumber++;
      this.startRound();
      return;
    }

    const frozen = this.phase === 'freeze';
    const roundView = this.roundView();
    const aiCtx: AICtx = {
      world: this.world,
      nav: this.nav,
      actors: this.actors,
      rng: this.rng,
      time: this.time,
      dt,
      round: roundView,
      combat: this.combatCtx,
    };

    // --- actors ------------------------------------------------------------
    for (const a of this.actors) {
      if (!a.alive) continue;
      let intent: MoveIntent = { ...NO_INPUT };

      if (a.isLocal && !a.isBot) {
        intent = this.localIntent(a, frozen);
      } else if (a.isBot) {
        const out = updateBot(a, aiCtx);
        intent = out.intent;
        this.botUseFlags.set(a.id, out.wantPlant || out.wantDefuse);
      }
      // Nobody moves during freeze time — aiming and buying still work.
      if (frozen) {
        intent.forward = 0;
        intent.strafe = 0;
        intent.jump = false;
      }

      const move = stepActor(a, intent, this.world, dt, this.time);
      if (move.footstep) {
        this.bus.emit('footstep', { actorId: a.id, pos: vclone(a.pos), firstPerson: a.id === this.viewActorId });
      }
      if (move.jumped) this.bus.emit('jump', { actorId: a.id, pos: vclone(a.pos) });
      if (move.landed) {
        this.bus.emit('land', { actorId: a.id, pos: vclone(a.pos), hard: move.landedHard });
        if (move.landedHard) {
          const dmg = clamp((Math.abs(a.vel.y) - 8.5) * 6, 0, 60);
          if (dmg > 1) applyDamage(this.combatCtx, a, null, dmg, 'leg', vclone(a.pos), 'c4');
        }
      }

      // Bots start reloads inside their own brain: surface the sound here.
      const trackedReload = this.reloadTracker.get(a.id) ?? -1;
      if (a.reloadEndTime > 0 && a.reloadEndTime !== trackedReload) {
        this.reloadTracker.set(a.id, a.reloadEndTime);
        if (a.isBot) {
          this.bus.emit('reload', {
            actorId: a.id,
            weaponId: activeWeapon(a)?.id ?? 'knife',
            pos: vclone(a.pos),
            firstPerson: a.id === this.viewActorId,
          });
        }
      }
      // Reload completion & recoil recovery for everyone.
      if (a.reloadEndTime > 0 && this.time >= a.reloadEndTime) finishReload(a);
      decayRecoil(a, dt, this.time);
      this.updateScope(a);
      if (a.hasBomb) this.updatePlant(a, dt);
      else if (a.plantProgress) a.plantProgress = 0;
    }

    separateActors(this.actors, this.world);
    this.updateBomb(dt);
    this.checkRoundEnd();

    // Auto-spectate shortly after dying.
    const view = this.viewActor;
    if (view && !view.alive && this.time - view.deathTime > 2.2 && this.phase === 'live') {
      const mates = this.actors.filter((a) => a.team === view.team && a.alive);
      if (mates.length > 0) {
        this.viewActorId = mates[0].id;
        this.spectating = true;
        this.notify();
      }
    }
    this.input.firePressed = false;
    this.input.altFirePressed = false;
  }

  private roundView(): RoundView {
    const b = this.bomb;
    let bombPos: Vec3 | null = null;
    if (b.phase === 'planted' || b.phase === 'dropped') bombPos = b.pos;
    else if (b.phase === 'carried') {
      const c = this.actorById(b.carrierId);
      bombPos = c ? c.pos : null;
    }
    return {
      phase: this.phase,
      bombPlanted: b.phase === 'planted',
      bombDropped: b.phase === 'dropped',
      bombPos,
      bombCarrierId: b.carrierId,
      bombSite: b.site,
      targetSite: this.targetSite,
      timeLeft: this.phaseTimer,
    };
  }

  /** Translate raw player input into a movement intent + weapon actions. */
  private localIntent(a: Actor, frozen: boolean): MoveIntent {
    const inp = this.input;
    const intent: MoveIntent = {
      forward: inp.forward,
      strafe: inp.strafe,
      jump: inp.jump,
      crouch: inp.crouch,
      walk: inp.walk,
    };
    if (inp.slotRequest) {
      switchSlot(a, inp.slotRequest, this.time);
      inp.slotRequest = null;
    }
    if (inp.reload) {
      if (canReload(a, this.time)) {
        startReload(a, this.time);
        this.bus.emit('reload', {
          actorId: a.id,
          weaponId: activeWeapon(a)?.id ?? 'knife',
          pos: vclone(a.pos),
          firstPerson: a.id === this.viewActorId,
        });
      }
      inp.reload = false;
    }
    const def = activeDef(a);
    if (def.scope) {
      if (inp.altFirePressed) a.wantsScope = !a.wantsScope;
    } else if (inp.altFirePressed) {
      a.wantsScope = false;
    }
    if (!frozen) {
      tryFire(this.combatCtx, a, inp.firePressed, inp.fire);
    }
    return intent;
  }

  /** Scope state transitions (shared by bots and the player). */
  private updateScope(a: Actor): void {
    const def = activeDef(a);
    if (!def.scope) {
      if (a.scoped) {
        a.scoped = false;
        this.bus.emit('scope', { actorId: a.id, on: false, firstPerson: a.id === this.viewActorId });
      }
      a.wantsScope = false;
      return;
    }
    if (a.wantsScope !== a.scoped && !isReloading(a, this.time)) {
      a.scoped = a.wantsScope;
      this.bus.emit('scope', { actorId: a.id, on: a.scoped, firstPerson: a.id === this.viewActorId });
    }
  }

  // -------------------------------------------------------------- snapshots

  subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  getSnapshot = (): HudSnapshot => this.snapshot;

  private notify(): void {
    this.snapshot = this.buildSnapshot();
    for (const fn of this.listeners) fn();
  }

  private buildSnapshot(): HudSnapshot {
    const view = this.viewActor;
    const local = this.actorById(this.localActorId);
    const ws = view ? activeWeapon(view) : null;
    const def = view ? activeDef(view) : WEAPONS.knife;
    const b = this.bomb;
    const scoreboard: ScoreboardRow[] = this.actors
      .map((a) => ({
        id: a.id,
        name: a.name,
        team: a.team,
        kills: a.kills,
        deaths: a.deaths,
        money: a.money,
        alive: a.alive,
        isPlayer: a.id === this.localActorId,
        hasBomb: a.hasBomb,
      }))
      .sort((x, y) => (x.team === y.team ? y.kills - x.kills : x.team === 'CT' ? -1 : 1));

    const spread = view ? currentSpread(view) : 0;
    const controlled = this.controlledActor();

    return {
      tick: this.tick,
      phase: this.phase,
      roundNumber: this.roundNumber,
      isPistolRound: this.isPistolRound,
      phaseTimeLeft: Math.max(0, this.phaseTimer),
      scoreCT: this.scoreCT,
      scoreT: this.scoreT,
      aliveCT: this.aliveCount('CT'),
      aliveT: this.aliveCount('T'),
      money: local ? local.money : 0,
      playerName: local ? local.name : '',
      playerTeam: local ? local.team : this.config.playerTeam,
      playerAlive: !!local && local.alive,
      spectating: !controlled,
      spectatedName: view ? view.name : '',
      health: view ? Math.max(0, Math.round(view.health)) : 0,
      armor: view ? Math.round(view.armor) : 0,
      helmet: view ? view.helmet : false,
      hasBomb: view ? view.hasBomb : false,
      weaponName: def.name,
      weaponSlot: view ? view.activeSlot : 'melee',
      magAmmo: ws ? ws.mag : 0,
      reserveAmmo: ws ? ws.reserve : 0,
      usesAmmo: def.magSize > 0,
      reloading: view ? isReloading(view, this.time) : false,
      scoped: view ? view.scoped : false,
      spreadPx: clamp(6 + spread * 900, 6, 90),
      bombPlanted: b.phase === 'planted',
      bombTimeLeft: b.phase === 'planted' ? Math.max(0, b.fuse) : 0,
      bombCarriedByPlayerTeam: b.phase === 'carried' && (local?.team === 'T'),
      plantProgress: b.phase === 'carried' ? b.plantProgress : 0,
      defuseProgress: b.phase === 'planted' ? b.defuseProgress : 0,
      hint: this.buildHint(),
      killfeed: this.killfeed.slice(),
      roundEndText: this.roundEndText(),
      scoreboard,
      loadout: (['primary', 'secondary', 'melee', 'bomb'] as SlotId[])
        .filter((s) => view && view.weapons[s])
        .map((s) => ({
          slot: s,
          name: WEAPONS[view!.weapons[s]!.id].name,
          active: view!.activeSlot === s,
        })),
      buyMenuOpen: this.buyMenuOpen,
      canBuy: this.phase === 'freeze' && !!local && local.alive,
      damageFlash: this.damageFlashTime,
      hitMarker: this.hitMarkerTime,
    };
  }

  private buildHint(): string {
    const a = this.controlledActor();
    if (!a) {
      const view = this.viewActor;
      if (view && view.id !== this.localActorId) return '[空格] 切换队友视角   [F] 接管该队友';
      return '阵亡 — 等待复活或切换视角';
    }
    const b = this.bomb;
    if (a.team === 'T' && a.hasBomb && b.phase === 'carried') {
      if (this.world.siteAt(a.pos)) {
        return b.plantProgress > 0 ? '正在安放 C4…' : '[按住 E] 安放 C4';
      }
      return `携带 C4 — 前往 ${this.targetSite} 点安放`;
    }
    if (a.team === 'T' && b.phase === 'dropped' && dist2D(a.pos, b.pos) < 4) {
      return '走到 C4 上方即可拾取';
    }
    if (a.team === 'CT' && b.phase === 'planted') {
      const d = dist2D(a.pos, b.pos);
      if (d < 1.6) {
        return b.defuseProgress > 0
          ? `正在拆除… ${Math.round(b.defuseProgress * 100)}%`
          : `[按住 E] 拆除 C4${a.hasKit ? '（有拆弹器 5s）' : '（10s）'}`;
      }
      return `C4 已安放于 ${b.site} 点 — 前往拆除`;
    }
    if (this.phase === 'freeze') return '[B] 购买菜单 — 准备阶段';
    return '';
  }

  private roundEndText(): string {
    if (this.phase !== 'over' || !this.roundWinner) return '';
    const w = this.roundWinner === 'CT' ? '反恐精英' : '恐怖分子';
    switch (this.roundEndReason) {
      case 'bomb_exploded':
        return `${w} 获胜 — C4 爆炸`;
      case 'bomb_defused':
        return `${w} 获胜 — 成功拆除炸弹`;
      case 'ct_eliminated':
        return `${w} 获胜 — 全歼反恐精英`;
      case 't_eliminated':
        return `${w} 获胜 — 全歼恐怖分子`;
      case 'time_expired':
        return `${w} 获胜 — 回合时间耗尽`;
      default:
        return `${w} 获胜`;
    }
  }
}
