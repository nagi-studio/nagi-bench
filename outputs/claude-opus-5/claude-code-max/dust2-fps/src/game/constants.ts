/** Shared tuning constants for the simulation. */

export type Team = 'CT' | 'T';

export function otherTeam(t: Team): Team {
  return t === 'CT' ? 'T' : 'CT';
}

/** Simulation runs at a fixed 64 Hz tick, like a CS server. */
export const TICK_RATE = 64;
export const TICK_DT = 1 / TICK_RATE;
export const MAX_TICKS_PER_FRAME = 5;

// --- actor dimensions (metres) -------------------------------------------------
export const ACTOR_RADIUS = 0.4;
export const ACTOR_HEIGHT = 1.78;
export const ACTOR_CROUCH_HEIGHT = 1.28;
export const EYE_HEIGHT = 1.64;
export const EYE_HEIGHT_CROUCH = 1.14;
export const STEP_HEIGHT = 0.55;

// --- movement ------------------------------------------------------------------
export const BASE_SPEED = 7.0;
export const WALK_MULTIPLIER = 0.52;
export const CROUCH_MULTIPLIER = 0.42;
export const GROUND_ACCEL = 12;
export const AIR_ACCEL = 2.4;
export const GROUND_FRICTION = 9.5;
export const GRAVITY = 22;
export const JUMP_SPEED = 5.9;
export const MAX_FALL_DAMAGE_SPEED = 12;

// --- combat --------------------------------------------------------------------
export const MAX_HEALTH = 100;
export const MAX_ARMOR = 100;
/** Fraction of blocked damage that is absorbed by (and removed from) armour. */
export const ARMOR_ABSORB = 0.5;

// --- round flow (seconds) -------------------------------------------------------
export const FREEZE_TIME = 5;
export const ROUND_TIME = 115;
export const BOMB_TIMER = 40;
export const PLANT_TIME = 3.2;
export const DEFUSE_TIME = 10;
export const DEFUSE_TIME_KIT = 5;
export const ROUND_END_DELAY = 5;
export const BOMB_EXPLOSION_RADIUS = 18;
export const BOMB_EXPLOSION_DAMAGE = 500;
export const BOMB_PICKUP_RADIUS = 1.4;
export const MATCH_ROUNDS = 16;

// --- AI ------------------------------------------------------------------------
export const AI_VIEW_DISTANCE = 62;
export const AI_FOV = (105 * Math.PI) / 180;
export const AI_HEAR_RADIUS = 22;
