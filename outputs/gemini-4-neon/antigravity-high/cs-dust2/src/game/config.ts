import { HitboxZone } from './types';

export const PHYSICS = {
  GRAVITY: 24.0,
  PLAYER_RADIUS: 0.44,
  PLAYER_HEIGHT: 1.78,
  PLAYER_CROUCH_HEIGHT: 1.24,
  EYE_HEIGHT: 1.62,
  CROUCH_EYE_HEIGHT: 1.12,
  BASE_MOVE_SPEED: 6.4, // m/s (knife ~6.4, rifle ~5.4, awp ~5.0)
  WALK_SPEED_MULT: 0.54,
  CROUCH_SPEED_MULT: 0.48,
  JUMP_SPEED: 7.4,
  STEP_HEIGHT: 0.52,
  GROUND_ACCEL: 58.0,
  GROUND_FRICTION: 10.5,
  AIR_ACCEL: 14.0,
  FIXED_DT: 1 / 60,
  MAX_FRAME_DT: 0.05,
};

export const ROUND_CONFIG = {
  FREEZE_TIME: 4.0, // brief freeze / buy window at start of round
  BUY_WINDOW: 22.0, // seconds into live round where buy is still allowed in buy zone
  ROUND_TIME: 115.0, // 1:55
  BOMB_TIMER: 40.0, // 40 seconds C4 fuse
  PLANT_TIME: 3.2, // seconds to plant C4
  DEFUSE_TIME: 5.0, // seconds to defuse C4
  ROUND_END_TIME: 4.5,
  PISTOL_ROUND_MONEY: 800,
  PISTOL_ROUND_ARMOR: 100, // Standard pistol round Kevlar armor, no helmet
  FULL_BUY_START_MONEY: 5500,
  WIN_REWARD: 3250,
  LOSS_REWARD: 2400,
  BOMB_PLANT_BONUS: 800,
  MAX_MONEY: 16000,
  ARMOR_COST: 650,
  HELMET_COST: 350,
};

// Hitbox damage multipliers: Head is strictly 2.0x chest (body), every zone distinct
export const HITBOX_MULTIPLIERS: Record<HitboxZone, number> = {
  head: 2.0,
  chest: 1.0,
  stomach: 1.2,
  arm: 0.85,
  leg: 0.75,
};

export const CAMERA_CONFIG = {
  DEFAULT_FOV: 75,
  NEAR: 0.08,
  FAR: 220,
  DEFAULT_SENSITIVITY: 0.0022,
};

export const MAP_BOUNDS = {
  MIN_X: -52,
  MAX_X: 52,
  MIN_Z: -52,
  MAX_Z: 52,
};

export const TEAM_NAMES = {
  CT: ['Alpha', 'Bravo', 'Vanguard', 'Spectre', 'Sentinel'],
  T: ['Viper', 'Mirage', 'Jackal', 'Nomad', 'Scorpion'],
};
