// Central tuning constants. Units are metres and seconds.
export const TICK_RATE = 64;
export const TICK_DT = 1 / TICK_RATE;

export const GRAVITY = 22;
export const JUMP_SPEED = 7.2;
export const STEP_HEIGHT = 0.55;

export const PLAYER_RADIUS = 0.42;
export const PLAYER_HEIGHT = 1.82;
export const EYE_HEIGHT = 1.62;
export const CROUCH_EYE = 1.05;

export const WALL_HEIGHT = 4.2;
export const WALL_THICKNESS = 0.6;

export const MAP_CELL = 2;
export const MAP_W = 64;
export const MAP_H = 64;
export const MAP_HALF_X = (MAP_W * MAP_CELL) / 2; // 64
export const MAP_HALF_Z = (MAP_H * MAP_CELL) / 2; // 64

// Round / bomb timing.
export const ROUND_TIME = 100;
export const FREEZE_TIME = 4;
export const BOMB_TIMER = 40;
export const PLANT_TIME = 3.2;
export const DEFUSE_TIME = 5.0;
export const BOMB_INTERACT_RANGE = 1.9;
export const SITE_PLANT_RANGE = 6.5;

export const MAX_HEALTH = 100;

// Vision.
export const AI_FOV = (115 * Math.PI) / 180;
export const AI_VIEW_DIST = 62;
export const AI_HEAR_DIST = 22;

export const KNIFE_RANGE = 2.0;

export const COLORS = {
  ct: 0x3f6fd8,
  ctDark: 0x243f86,
  t: 0xc9a06a,
  tDark: 0x7d5a2e,
  wall: 0xb9a888,
  wallTrim: 0x8a7a5c,
  crate: 0x9c6f3c,
  floor: 0xc7b48d,
  siteA: 0xa63c3c,
  siteB: 0x3c6ea6,
};
