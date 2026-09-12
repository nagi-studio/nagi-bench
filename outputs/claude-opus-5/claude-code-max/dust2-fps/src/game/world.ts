/**
 * GameWorld — the authoritative simulation.
 *
 * Owns the actors, the map queries, the bomb, the round state machine and the AI brains.
 * Runs on a fixed 64 Hz tick regardless of the display refresh rate; the renderer and the
 * React HUD are pure consumers of its state plus the event queue it produces.
 */

import { Rng, Vec3, clamp } from '../core/math.ts';
import { Actor } from './actor.ts';
import {
  MAX_TICKS_PER_FRAME,
  TICK_DT,
  type Team,
  otherTeam,
} from './constants.ts';
import type { Bomb, SimContext } from './context.ts';
import type { GameEvent } from './events.ts';
import { CollisionWorld } from './map/collision.ts';
import { CT_SPAWNS, T_SPAWNS, bombSiteAt } from './map/dust2.ts';
import { NavGrid } from './map/navgrid.ts';
import type { PlayerInput } from './playerinput.ts';
import { BotBrain, planRound } from './systems/ai.ts';
import { createBomb, resetBombBeep, updateBomb, updateDefuse, updatePlant } from './systems/bomb.ts';
import { toggleScope, tryFire, tryReload, updateWeaponState } from './systems/combat.ts';
import { moveActor } from './systems/movement.ts';
import { RoundManager } from './systems/round.ts';
import { buyLoadout, pistolRoundLoadout } from './weapons.ts';

const BOT_NAMES_T = ['Volk', 'Ismail', 'Rasmus', 'Enzo', 'Yuri', 'Dmitri', 'Karim'];
const BOT_NAMES_CT = ['Bishop', 'Ronin', 'Sabre', 'Falk', 'Nomad', 'Cobalt', 'Wren'];

export interface WorldConfig {
  seed: number;
  playerTeam: Team;
  playerName: string;
  /** Force every round to be a pistol round. */
  pistolRoundsOnly: boolean;
  /** 0..1 baseline bot skill. */
  botSkill: number;
}

export const DEFAULT_CONFIG: WorldConfig = {
  seed: 1337,
  playerTeam: 'CT',
  playerName: '你',
  pistolRoundsOnly: false,
  botSkill: 0.5,
};

export class GameWorld implements SimContext {
  readonly config: WorldConfig;
  readonly collision: CollisionWorld;
  readonly nav: NavGrid;
  readonly rng: Rng;

  time = 0;
  actors: Actor[] = [];
  brains: BotBrain[] = [];
  events: GameEvent[] = [];
  bomb: Bomb;
  intel: Record<Team, Map<number, { pos: Vec3; time: number }>> = {
    CT: new Map(),
    T: new Map(),
  };

  readonly round = new RoundManager();

  /** The actor the human owns at the start of every round. */
  playerHomeId = 0;
  /** The actor the human is currently driving (-1 = pure spectator). */
  playerActorId = 0;
  /** Actor being watched while dead. */
  spectateId = 0;
  spectating = false;

  private accumulator = 0;

  constructor(config: Partial<WorldConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.collision = new CollisionWorld();
    this.nav = new NavGrid(this.collision);
    this.rng = new Rng(this.config.seed);
    this.bomb = createBomb();

    this.createTeams();
    this.beginRound();
  }

  // ------------------------------------------------------------------- setup

  private createTeams(): void {
    let id = 0;
    const playerTeam = this.config.playerTeam;

    for (const team of ['CT', 'T'] as Team[]) {
      const names = team === 'CT' ? BOT_NAMES_CT : BOT_NAMES_T;
      for (let i = 0; i < 5; i++) {
        const isPlayer = team === playerTeam && i === 0;
        const actor = new Actor(id, isPlayer ? this.config.playerName : `${names[i]}`, team);
        actor.controller = isPlayer ? 'player' : 'bot';
        if (isPlayer) {
          this.playerHomeId = id;
          this.playerActorId = id;
          this.spectateId = id;
        }
        this.actors.push(actor);
        // Every actor gets a brain: when the human dies or hands a body back, the AI can
        // simply resume driving it.
        const skill = clamp(
          this.config.botSkill + this.rng.range(-0.18, 0.18),
          0.05,
          1,
        );
        this.brains.push(new BotBrain(actor, skill, this.config.seed * 7919 + id * 104729));
        id++;
      }
    }
  }

  /** Full reset of actors, loadouts, bomb and AI plans for a new round. */
  beginRound(): void {
    const pistolRound = this.round.round === 1 || this.config.pistolRoundsOnly;
    this.round.resetForRound(pistolRound);
    this.intel.CT.clear();
    this.intel.T.clear();
    resetBombBeep();

    this.bomb.state = 'carried';
    this.bomb.carrier = -1;
    this.bomb.site = null;
    this.bomb.defuseProgress = 0;
    this.bomb.defuser = -1;
    this.bomb.planter = -1;

    // Hand control back to the player's own actor.
    this.playerActorId = this.playerHomeId;
    this.spectating = false;
    this.spectateId = this.playerHomeId;

    let ctIndex = 0;
    let tIndex = 0;
    for (const a of this.actors) {
      const spawn = a.team === 'CT' ? CT_SPAWNS[ctIndex++ % CT_SPAWNS.length] : T_SPAWNS[tIndex++ % T_SPAWNS.length];
      const teamIndex = a.team === 'CT' ? ctIndex - 1 : tIndex - 1;
      const loadout = pistolRound
        ? pistolRoundLoadout(a.team)
        : buyLoadout(a.team, teamIndex, () => this.rng.next());

      const jitterX = this.rng.range(-0.6, 0.6);
      const jitterZ = this.rng.range(-0.6, 0.6);
      const x = spawn.x + jitterX;
      const z = spawn.z + jitterZ;
      const y = this.collision.groundAt(x, z, 40, 60);
      a.resetForRound(x, y, z, spawn.yaw, loadout);
      a.controller = a.id === this.playerActorId ? 'player' : 'bot';
      a.hasDefuseKit = a.team === 'CT' && !pistolRound && this.rng.bool(0.55);
      a.equipBest(this.time);
    }

    // Give the bomb to a random T.
    const ts = this.actors.filter((a) => a.team === 'T');
    const carrier = ts[this.rng.int(0, ts.length)];
    carrier.hasBomb = true;
    this.bomb.carrier = carrier.id;
    this.bomb.pos.copy(carrier.pos);

    this.round.attackSite = planRound(this, this.brains, this.rng);

    this.events.push({
      type: 'roundStart',
      round: this.round.round,
      pistolRound,
    });
  }

  // ------------------------------------------------------------------ update

  /**
   * Advances the simulation by a display frame. The frame time is split into fixed ticks so
   * physics stays deterministic; look input is applied once per frame for lowest latency.
   */
  update(frameDt: number, input: PlayerInput): void {
    this.events.length = 0;

    this.applyLook(input);
    this.applyDiscreteInput(input);

    this.accumulator += Math.min(frameDt, 0.25);
    let ticks = 0;
    while (this.accumulator >= TICK_DT && ticks < MAX_TICKS_PER_FRAME) {
      this.tick(TICK_DT, input);
      this.accumulator -= TICK_DT;
      ticks++;
    }
    if (ticks === MAX_TICKS_PER_FRAME) this.accumulator = 0;
  }

  /** Runs a single fixed simulation step. Used directly by the headless tests. */
  tick(dt: number, input: PlayerInput): void {
    this.time += dt;
    const live = this.round.phase === 'live';

    // --- decide what everyone wants to do -----------------------------------
    for (const a of this.actors) {
      if (!a.alive) continue;
      if (a.controller === 'player') {
        this.applyPlayerCommand(a, input, live, dt);
        // The player is a team mate too: feed what they can see into the shared intel so
        // the minimap and the bots know about it.
        if (live) this.brains[a.id].observeOnly(this);
      } else {
        const brain = this.brains[a.id];
        if (live) {
          brain.update(this, dt);
        } else {
          a.command.forward = 0;
          a.command.right = 0;
          a.command.jump = false;
        }
      }
    }

    // --- resolve ------------------------------------------------------------
    for (const a of this.actors) {
      updateWeaponState(this, a, dt);
      if (!a.alive) continue;
      if (!live) {
        a.command.forward = 0;
        a.command.right = 0;
        a.command.jump = false;
      }
      moveActor(this, a, dt);
    }

    if (live || this.round.phase === 'ended') updateBomb(this, dt);

    this.round.update(this, dt);
    this.updateSpectator();
  }

  // ------------------------------------------------------------ player input

  private applyLook(input: PlayerInput): void {
    const a = this.controlledActor();
    if (!a || !a.alive) return;
    const def = a.weapon();
    let sens = input.sensitivity;
    if (a.scopeLevel > 0 && def.scope) {
      sens *= def.scope.sensitivity[a.scopeLevel - 1] ?? 0.5;
    }
    a.yaw -= input.mouseDx * sens;
    a.pitch = clamp(a.pitch - input.mouseDy * sens, -Math.PI / 2 + 0.02, Math.PI / 2 - 0.02);
  }

  /** Edge-triggered actions are handled once per frame, not per tick. */
  private applyDiscreteInput(input: PlayerInput): void {
    const a = this.controlledActor();

    if (this.spectating) {
      if (input.spectateNextPressed) this.cycleSpectate();
      if (input.takeoverPressed) this.takeOverSpectated();
      return;
    }
    if (!a || !a.alive) return;

    if (input.switchSlot === 1) this.equipSlot(a, 'primary');
    else if (input.switchSlot === 2) this.equipSlot(a, 'secondary');
    else if (input.switchSlot === 3) this.equipSlot(a, 'melee');

    if (input.reloadPressed) tryReload(this, a);

    if (input.scopePressed) {
      if (a.weapon().scope) toggleScope(this, a);
    }
  }

  private equipSlot(a: Actor, slot: 'primary' | 'secondary' | 'melee'): void {
    if (a.equip(slot, this.time)) {
      this.events.push({
        type: 'switch',
        actorId: a.id,
        weapon: a.weaponId(),
        firstPerson: true,
        pos: a.pos.clone(),
      });
    }
  }

  private applyPlayerCommand(a: Actor, input: PlayerInput, live: boolean, dt: number): void {
    a.command.forward = live ? input.forward : 0;
    a.command.right = live ? input.right : 0;
    a.command.jump = live && input.jump;
    a.command.crouch = input.crouch;
    a.command.walk = input.walk;

    if (!live) return;

    // Plant / defuse take priority over shooting while the use key is held.
    let busy = false;
    if (a.team === 'T' && a.hasBomb) busy = updatePlant(this, a, input.use, dt);
    if (a.team === 'CT') busy = updateDefuse(this, a, input.use, dt) || busy;

    if (busy) {
      a.command.forward = 0;
      a.command.right = 0;
      return;
    }

    const def = a.weapon();
    a.triggerHeld = input.fire;
    if (def.automatic ? input.fire : input.firePressed) tryFire(this, a);
  }

  // -------------------------------------------------------------- spectating

  controlledActor(): Actor | null {
    if (this.playerActorId < 0) return null;
    return this.actors[this.playerActorId] ?? null;
  }

  /** The actor the camera should follow (own body while alive, teammate while dead). */
  viewActor(): Actor | null {
    if (!this.spectating) return this.controlledActor();
    return this.actors[this.spectateId] ?? null;
  }

  private updateSpectator(): void {
    const a = this.controlledActor();
    if (a && !a.alive && !this.spectating) {
      this.spectating = true;
      a.controller = 'bot';
      this.playerActorId = -1;
      this.spectateId = a.id;
      this.cycleSpectate();
    }
    // Keep watching someone alive.
    if (this.spectating) {
      const watched = this.actors[this.spectateId];
      if (!watched || !watched.alive) this.cycleSpectate();
    }
  }

  cycleSpectate(): void {
    const team = this.playerTeam();
    const mates = this.actors.filter((o) => o.team === team && o.alive);
    if (mates.length === 0) return;
    const currentIndex = mates.findIndex((m) => m.id === this.spectateId);
    const next = mates[(currentIndex + 1) % mates.length];
    this.spectateId = next.id;
  }

  /** Take over the bot currently being spectated. */
  takeOverSpectated(): boolean {
    if (!this.spectating) return false;
    const target = this.actors[this.spectateId];
    if (!target || !target.alive) return false;
    target.controller = 'player';
    target.triggerHeld = false;
    this.playerActorId = target.id;
    this.spectating = false;
    this.events.push({ type: 'takeover', actorId: target.id, name: target.name });
    return true;
  }

  playerTeam(): Team {
    const home = this.actors[this.playerHomeId];
    return home ? home.team : this.config.playerTeam;
  }

  enemyTeam(): Team {
    return otherTeam(this.playerTeam());
  }

  // ----------------------------------------------------------------- queries

  aliveCount(team: Team): number {
    let n = 0;
    for (const a of this.actors) if (a.team === team && a.alive) n++;
    return n;
  }

  /** True when the controlled actor could plant / defuse right now (drives the HUD hint). */
  usePrompt(): 'plant' | 'defuse' | 'pickup' | null {
    const a = this.controlledActor();
    if (!a || !a.alive || this.round.phase !== 'live') return null;
    if (a.team === 'T' && a.hasBomb && bombSiteAt(a.pos.x, a.pos.z)) return 'plant';
    if (a.team === 'CT' && this.bomb.state === 'planted' && a.pos.distanceTo2D(this.bomb.pos) < 1.6) {
      return 'defuse';
    }
    if (
      a.team === 'T' &&
      this.bomb.state === 'dropped' &&
      a.pos.distanceTo2D(this.bomb.pos) < 2.5
    ) {
      return 'pickup';
    }
    return null;
  }

  brainFor(actorId: number): BotBrain | undefined {
    return this.brains[actorId];
  }
}
