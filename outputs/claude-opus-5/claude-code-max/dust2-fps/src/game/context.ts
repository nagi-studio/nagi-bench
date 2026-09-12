/**
 * The slice of the world that individual systems (movement, combat, AI, round flow) need.
 * Declaring it as an interface keeps those systems free of a dependency on `GameWorld`
 * itself, so there are no import cycles and each system stays unit-testable.
 */

import type { Rng, Vec3 } from '../core/math.ts';
import type { Actor } from './actor.ts';
import type { Team } from './constants.ts';
import type { GameEvent } from './events.ts';
import type { CollisionWorld } from './map/collision.ts';
import type { NavGrid } from './map/navgrid.ts';

export type BombState = 'carried' | 'dropped' | 'planted' | 'defused' | 'exploded';

export interface Bomb {
  state: BombState;
  /** Actor id of the carrier while `state === 'carried'`. */
  carrier: number;
  pos: Vec3;
  site: 'A' | 'B' | null;
  /** Seconds left on the fuse once planted. */
  timer: number;
  /** 0..1 progress of the current defuse attempt. */
  defuseProgress: number;
  defuser: number;
  planter: number;
}

export interface SimContext {
  time: number;
  actors: Actor[];
  collision: CollisionWorld;
  nav: NavGrid;
  rng: Rng;
  events: GameEvent[];
  bomb: Bomb;
  /** Actor id currently driven by the human player (-1 while spectating a dead body). */
  playerActorId: number;
  /**
   * Shared per-team knowledge of where enemies were last seen. Bots write to it when they
   * spot someone and read from it when they have no target of their own — a cheap stand-in
   * for radio callouts.
   */
  intel: Record<Team, Map<number, { pos: Vec3; time: number }>>;
}
