// Central gameplay tunables.

export const FIXED_DT = 1 / 60; // physics step
export const MAX_FRAME_DT = 1 / 20; // clamp big frame gaps (tab switches)
export const GRAVITY = 20; // m/s^2

export const PLAYER = {
  radius: 0.42,
  height: 1.8,
  eyeHeight: 1.62,
  jumpSpeed: 7.4, // apex ~1.37m (clears 1.2m crates)
  runSpeed: 6.6,
  walkSpeed: 3.3, // hold shift: slow + accurate
  groundAccel: 65,
  airAccel: 14,
  friction: 10,
  maxHealth: 100,
  maxArmor: 100,
};

export const AI = {
  fovDeg: 105, // vision cone half-handled in code
  viewRange: 70,
  reactionTime: 0.22, // seconds before a spotted enemy is engaged
  aimError: 0.05, // radians of aim jitter (skill)
  aimSpeed: 7, // rad/s turn toward target
  burstMin: 0.3,
  burstMax: 0.9,
  repathInterval: 0.6,
};

export const ROUND = {
  freezeTime: 3,
  roundTime: 115, // seconds before CT win by time (no plant)
  bombTimer: 40,
  plantTime: 3.2,
  defuseTime: 7,
  overTime: 5, // seconds showing result before next round
  bombDamageRadius: 14,
};

// Team colors (three.js hex). CT = navy/blue, T = tan/sand.
export const COLORS = {
  ctPrimary: 0x2f5fa8,
  ctSecondary: 0xbcd2f0,
  ctSkin: 0xd7a98a,
  tPrimary: 0xb08b4f,
  tSecondary: 0x5a4526,
  tSkin: 0xc99a76,
  wall: 0xb8a488,
  wallDark: 0x8f7f66,
  floor: 0xa79878,
  crate: 0x9c6b34,
  crateEdge: 0x5c3d1c,
  siteA: 0xd25b4a,
  siteB: 0x4aa3d2,
  bomb: 0x222222,
  sky: 0x8fb3d9,
};
