/**
 * React bridge.
 *
 * The simulation runs at 64 Hz and the renderer at display rate; React must not re-render
 * at either of those speeds. This store snapshots only what the HUD needs, at a fixed
 * 30 Hz, and exposes it through `useSyncExternalStore` — so the UI is a pure function of an
 * immutable snapshot while the hot loop stays allocation-light.
 */

import type { Team } from '../game/constants.ts';
import { BOMB_TIMER, ROUND_TIME } from '../game/constants.ts';
import type { GameEvent } from '../game/events.ts';
import type { HitPart } from '../game/hitbox.ts';
import type { RoundPhase } from '../game/systems/round.ts';
import type { GameWorld } from '../game/world.ts';
import type { WeaponId, WeaponSlot } from '../game/weapons.ts';
import { WEAPONS } from '../game/weapons.ts';

export interface KillFeedEntry {
  id: number;
  attacker: string;
  victim: string;
  attackerTeam: Team;
  victimTeam: Team;
  weapon: WeaponId | 'bomb' | 'world';
  headshot: boolean;
  involvesPlayer: boolean;
  bornAt: number;
}

export interface MinimapActor {
  id: number;
  x: number;
  z: number;
  yaw: number;
  team: Team;
  alive: boolean;
  isSelf: boolean;
  hasBomb: boolean;
  /** Enemies are only drawn once your team has seen them. */
  known: boolean;
}

export interface ScoreRow {
  id: number;
  name: string;
  team: Team;
  kills: number;
  deaths: number;
  damage: number;
  alive: boolean;
  isSelf: boolean;
  weapon: WeaponId | null;
  hasBomb: boolean;
  health: number;
}

export interface HudSnapshot {
  version: number;
  phase: RoundPhase;
  round: number;
  timeLeft: number;
  timeFraction: number;
  scoreCT: number;
  scoreT: number;
  aliveCT: number;
  aliveT: number;
  playerTeam: Team;
  pistolRound: boolean;

  alive: boolean;
  spectating: boolean;
  viewName: string;
  health: number;
  armor: number;
  helmet: boolean;
  areaLabel: string;

  weaponId: WeaponId;
  weaponName: string;
  slot: WeaponSlot;
  magAmmo: number;
  magSize: number;
  reserveAmmo: number;
  reloading: boolean;
  scopeLevel: number;
  scopeFov: number;
  /** Normalised crosshair gap, 0 = pinpoint. */
  spread: number;

  inventory: Array<{ slot: WeaponSlot; id: WeaponId | null; active: boolean }>;

  bombState: 'carried' | 'dropped' | 'planted' | 'defused' | 'exploded';
  bombTimer: number;
  bombSite: 'A' | 'B' | null;
  bombCarriedByMe: boolean;
  bombX: number;
  bombZ: number;
  bombKnown: boolean;
  plantProgress: number;
  defuseProgress: number;
  defuseHasKit: boolean;

  usePrompt: 'plant' | 'defuse' | 'pickup' | null;
  killFeed: KillFeedEntry[];
  minimap: MinimapActor[];
  scoreboard: ScoreRow[];

  roundResultWinner: Team | null;
  roundResultReason: string | null;
  matchWinner: Team | null;

  hitMarker: number;
  hitMarkerHead: boolean;
  damageFlash: number;
  damageDirection: number;
  lastHitPart: HitPart | null;
}

const REASON_TEXT: Record<string, string> = {
  tEliminated: '恐怖分子被消灭',
  ctEliminated: '反恐精英被消灭',
  bombExploded: 'C4 爆炸',
  bombDefused: 'C4 被拆除',
  timeout: '时间到',
};

function emptySnapshot(): HudSnapshot {
  return {
    version: 0,
    phase: 'freeze',
    round: 1,
    timeLeft: 0,
    timeFraction: 1,
    scoreCT: 0,
    scoreT: 0,
    aliveCT: 5,
    aliveT: 5,
    playerTeam: 'CT',
    pistolRound: true,
    alive: true,
    spectating: false,
    viewName: '',
    health: 100,
    armor: 0,
    helmet: false,
    areaLabel: '',
    weaponId: 'usp',
    weaponName: 'USP-S',
    slot: 'secondary',
    magAmmo: 12,
    magSize: 12,
    reserveAmmo: 24,
    reloading: false,
    scopeLevel: 0,
    scopeFov: 90,
    spread: 0,
    inventory: [],
    bombState: 'carried',
    bombTimer: BOMB_TIMER,
    bombSite: null,
    bombCarriedByMe: false,
    bombX: 0,
    bombZ: 0,
    bombKnown: false,
    plantProgress: 0,
    defuseProgress: 0,
    defuseHasKit: false,
    usePrompt: null,
    killFeed: [],
    minimap: [],
    scoreboard: [],
    roundResultWinner: null,
    roundResultReason: null,
    matchWinner: null,
    hitMarker: 0,
    hitMarkerHead: false,
    damageFlash: 0,
    damageDirection: 0,
    lastHitPart: null,
  };
}

/** How long a kill feed entry stays on screen, seconds. */
const KILLFEED_TTL = 6;
const UPDATE_INTERVAL = 1 / 30;

export class HudStore {
  private snapshot: HudSnapshot = emptySnapshot();
  private listeners = new Set<() => void>();
  private killFeed: KillFeedEntry[] = [];
  private killIdCounter = 0;
  private accumulator = 0;
  private clock = 0;
  private hitMarker = 0;
  private hitMarkerHead = false;
  private lastHitPart: HitPart | null = null;

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = (): HudSnapshot => this.snapshot;

  /** Events are consumed every frame, even though the snapshot is published at 30 Hz. */
  consumeEvents(events: GameEvent[], world: GameWorld): void {
    for (const ev of events) {
      if (ev.type === 'kill') {
        this.killFeed.push({
          id: this.killIdCounter++,
          attacker: ev.attackerName,
          victim: ev.victimName,
          attackerTeam: ev.attackerTeam,
          victimTeam: ev.victimTeam,
          weapon: ev.weapon,
          headshot: ev.headshot,
          involvesPlayer: ev.byPlayer || ev.onPlayer,
          bornAt: this.clock,
        });
        if (this.killFeed.length > 6) this.killFeed.shift();
      } else if (ev.type === 'hit' && ev.byPlayer) {
        this.hitMarker = 1;
        this.hitMarkerHead = ev.part === 'head';
        this.lastHitPart = ev.part;
      } else if (ev.type === 'roundStart') {
        this.killFeed.length = 0;
      }
    }
    void world;
  }

  /** Publishes a new snapshot at a fixed rate. */
  update(world: GameWorld, dt: number, damageFlash: number, damageDirection: number): void {
    this.clock += dt;
    this.hitMarker = Math.max(0, this.hitMarker - dt * 3.6);
    this.accumulator += dt;
    if (this.accumulator < UPDATE_INTERVAL) return;
    this.accumulator = 0;

    const view = world.viewActor();
    const controlled = world.controlledActor();
    const subject = controlled ?? view;
    const playerTeam = world.playerTeam();
    const bomb = world.bomb;

    // Enemies are revealed only when the player's team has seen them recently.
    const intel = world.intel[playerTeam];
    const minimap: MinimapActor[] = world.actors.map((a) => {
      const sighting = intel.get(a.id);
      const known =
        a.team === playerTeam ||
        (sighting !== undefined && world.time - sighting.time < 4 && a.alive);
      const pos = a.team === playerTeam || !sighting ? a.pos : sighting.pos;
      return {
        id: a.id,
        x: known ? pos.x : 0,
        z: known ? pos.z : 0,
        yaw: a.yaw,
        team: a.team,
        alive: a.alive,
        isSelf: view ? a.id === view.id : false,
        hasBomb: a.hasBomb,
        known,
      };
    });

    const scoreboard: ScoreRow[] = world.actors
      .map((a) => ({
        id: a.id,
        name: a.name,
        team: a.team,
        kills: a.kills,
        deaths: a.deaths,
        damage: Math.round(a.damageDealt),
        alive: a.alive,
        isSelf: a.id === world.playerHomeId || a.id === world.playerActorId,
        weapon: a.loadoutSlots.primary ?? a.loadoutSlots.secondary,
        hasBomb: a.hasBomb,
        health: Math.max(0, Math.round(a.health)),
      }))
      .sort((x, y) => (x.team === y.team ? y.kills - x.kills : x.team === 'CT' ? -1 : 1));

    this.killFeed = this.killFeed.filter((k) => this.clock - k.bornAt < KILLFEED_TTL);

    const def = subject ? subject.weapon() : WEAPONS.usp;
    const ammo = subject ? subject.currentAmmo() : { mag: 0, reserve: 0 };
    const maxCone = def.spread.max + def.spread.base + def.spread.moving;

    let spread = 0;
    if (subject) {
      const cone = def.spread.base + subject.spreadAccum +
        (!subject.onGround ? def.spread.jumping : subject.speed > 0.9 ? def.spread.moving * Math.min(1, subject.speed / 7) : 0);
      spread = Math.min(1, cone / maxCone);
    }

    const bombKnown =
      bomb.state === 'planted' ||
      bomb.state === 'dropped' ||
      bomb.state === 'defused' ||
      playerTeam === 'T';

    this.snapshot = {
      version: this.snapshot.version + 1,
      phase: world.round.phase,
      round: world.round.round,
      timeLeft: Math.max(0, world.round.timeLeft),
      timeFraction: Math.max(0, Math.min(1, world.round.timeLeft / ROUND_TIME)),
      scoreCT: world.round.scoreCT,
      scoreT: world.round.scoreT,
      aliveCT: world.aliveCount('CT'),
      aliveT: world.aliveCount('T'),
      playerTeam,
      pistolRound: world.round.pistolRound,

      alive: !!controlled && controlled.alive,
      spectating: world.spectating,
      viewName: view ? view.name : '',
      health: subject ? Math.max(0, Math.round(subject.health)) : 0,
      armor: subject ? Math.round(subject.armor) : 0,
      helmet: subject ? subject.helmet : false,
      areaLabel: subject ? subject.areaLabel : '',

      weaponId: subject ? subject.weaponId() : 'usp',
      weaponName: def.name,
      slot: subject ? subject.slot : 'secondary',
      magAmmo: def.slot === 'melee' ? 0 : ammo.mag,
      magSize: def.magazine,
      reserveAmmo: def.slot === 'melee' ? 0 : ammo.reserve,
      reloading: subject ? subject.reloading : false,
      scopeLevel: subject ? subject.scopeLevel : 0,
      scopeFov: def.scope && subject && subject.scopeLevel > 0 ? def.scope.fovs[subject.scopeLevel - 1] : 90,
      spread,

      inventory: (['primary', 'secondary', 'melee'] as WeaponSlot[]).map((slot) => ({
        slot,
        id: subject ? subject.loadoutSlots[slot] : null,
        active: subject ? subject.slot === slot : false,
      })),

      bombState: bomb.state,
      bombTimer: Math.max(0, bomb.timer),
      bombSite: bomb.site,
      bombCarriedByMe: !!controlled && controlled.hasBomb,
      bombX: bomb.pos.x,
      bombZ: bomb.pos.z,
      bombKnown,
      plantProgress: subject ? subject.plantProgress : 0,
      defuseProgress: subject ? subject.defuseProgress : 0,
      defuseHasKit: subject ? subject.hasDefuseKit : false,

      usePrompt: world.usePrompt(),
      killFeed: [...this.killFeed],
      minimap,
      scoreboard,

      roundResultWinner: world.round.phase === 'ended' || world.round.phase === 'matchOver' ? world.round.winner : null,
      roundResultReason:
        world.round.reason && (world.round.phase === 'ended' || world.round.phase === 'matchOver')
          ? REASON_TEXT[world.round.reason] ?? world.round.reason
          : null,
      matchWinner:
        world.round.phase === 'matchOver' ? (world.round.scoreCT > world.round.scoreT ? 'CT' : 'T') : null,

      hitMarker: this.hitMarker,
      hitMarkerHead: this.hitMarkerHead,
      damageFlash,
      damageDirection,
      lastHitPart: this.lastHitPart,
    };

    for (const l of this.listeners) l();
  }

  reset(): void {
    this.snapshot = emptySnapshot();
    this.killFeed = [];
    for (const l of this.listeners) l();
  }
}
